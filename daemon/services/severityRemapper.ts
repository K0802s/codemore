/**
 * Severity Remapper Service
 * 
 * Re-maps raw static-analysis findings into developer-meaningful severities
 * that reduce noise, increase trust, and surface real engineering risk.
 * 
 * Based on improvements.md specification.
 */

import { CodeIssue, IssueSeverity, IssueCategory } from '../../shared/protocol';

// Canonical severity levels as per spec
export type CanonicalSeverity = 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';

// Mapping from canonical to VS Code severity
const CANONICAL_TO_VSCODE: Record<CanonicalSeverity, IssueSeverity> = {
    'BLOCKER': 'error',
    'CRITICAL': 'error',
    'MAJOR': 'warning',
    'MINOR': 'info',
    'INFO': 'hint',
};

interface RemappingRule {
    pattern: RegExp | string;
    severity: CanonicalSeverity;
    condition?: (issue: CodeIssue) => boolean;
}

export class SeverityRemapper {
    private remappingStats = {
        total: 0,
        remapped: 0,
        upgraded: 0,
        downgraded: 0,
    };

    private sqlRules: RemappingRule[] = [
        // BLOCKER - Data loss/corruption risks
        { pattern: /sql-delete-no-where/i, severity: 'BLOCKER' },
        { pattern: /sql-update-no-where/i, severity: 'BLOCKER' },
        { pattern: /ai-sql-delete-no-where/i, severity: 'BLOCKER' },
        { pattern: /ai-sql-update-no-where/i, severity: 'BLOCKER' },
    ];

    private reactRules: RemappingRule[] = [
        // CRITICAL - Runtime correctness issues
        {
            pattern: /useExhaustiveDependencies/i,
            severity: 'CRITICAL',
            condition: (issue) => {
                // Downgrade if explicitly justified
                const hasJustification = issue.codeSnippet.includes('eslint-disable') ||
                    issue.description.toLowerCase().includes('justified');
                return !hasJustification;
            }
        },
        { pattern: /noArrayIndexKey/i, severity: 'MAJOR' },
    ];

    private typeScriptRules: RemappingRule[] = [
        { pattern: /noGlobalIsNan/i, severity: 'MAJOR' },
        { pattern: /noExplicitAny/i, severity: 'MAJOR' },
        { pattern: /noImplicitAnyLet/i, severity: 'MAJOR' },
        { pattern: /noNonNullAssertion/i, severity: 'MAJOR' },
        { pattern: /useNumberNamespace/i, severity: 'MINOR' },
        { pattern: /noInferrableTypes/i, severity: 'INFO' },
    ];

    private styleRules: RemappingRule[] = [
        // INFO - Style/preference/auto-fixable
        { pattern: /useArrowFunction/i, severity: 'INFO' },
        { pattern: /noForEach/i, severity: 'INFO' },
        { pattern: /useTemplate/i, severity: 'INFO' },
        { pattern: /useImportType/i, severity: 'INFO' },
        // Biome rules that are often noise
        { pattern: /lint\/style/i, severity: 'INFO' },
        { pattern: /lint\/suspicious\/noDoubleEquals/i, severity: 'MINOR' }, // This is actually worth fixing
    ];

    private buildRules: RemappingRule[] = [
        // CRITICAL - Build/infrastructure errors
        { pattern: /internalError\/io/i, severity: 'CRITICAL' },
    ];

    /**
     * Re-map issue severity based on rules
     */
    remapIssue(issue: CodeIssue): CodeIssue {
        const originalSeverity = issue.severity;
        
        // Step 1: Apply rule-based mapping
        let canonicalSeverity = this.applyRuleBasedMapping(issue);

        // Step 2: Apply complexity-based mapping (for AI-generated complexity rules)
        if (!canonicalSeverity && this.isComplexityRule(issue)) {
            canonicalSeverity = this.mapComplexitySeverity(issue);
        }

        // Step 3: Apply post-processing modifiers
        if (canonicalSeverity) {
            const preModifierSeverity = canonicalSeverity;
            canonicalSeverity = this.applyPostProcessingModifiers(issue, canonicalSeverity);
            
            // Track stats
            if (preModifierSeverity !== canonicalSeverity) {
                const levels: CanonicalSeverity[] = ['INFO', 'MINOR', 'MAJOR', 'CRITICAL', 'BLOCKER'];
                const preIndex = levels.indexOf(preModifierSeverity);
                const postIndex = levels.indexOf(canonicalSeverity);
                if (postIndex > preIndex) {
                    this.remappingStats.upgraded++;
                } else {
                    this.remappingStats.downgraded++;
                }
            }
        }

        // Step 4: Map to VS Code severity
        const finalSeverity = canonicalSeverity
            ? CANONICAL_TO_VSCODE[canonicalSeverity]
            : issue.severity; // Keep original if no rule matched

        // Track remapping
        if (finalSeverity !== originalSeverity || canonicalSeverity) {
            this.remappingStats.remapped++;
        }

        return {
            ...issue,
            severity: finalSeverity,
            canonicalSeverity: canonicalSeverity || undefined, // Store for UI display
        };
    }

    /**
     * Re-map an array of issues
     */
    remapIssues(issues: CodeIssue[]): CodeIssue[] {
        this.remappingStats.total = issues.length;
        this.remappingStats.remapped = 0;
        this.remappingStats.upgraded = 0;
        this.remappingStats.downgraded = 0;

        const remapped = issues.map(issue => this.remapIssue(issue));

        // Log stats
        console.log(`[SeverityRemapper] Processed ${this.remappingStats.total} issues: ${this.remappingStats.remapped} remapped (${this.remappingStats.upgraded} upgraded, ${this.remappingStats.downgraded} downgraded)`);
        
        return remapped;
    }

    /**
     * Apply rule-based mapping
     */
    private applyRuleBasedMapping(issue: CodeIssue): CanonicalSeverity | null {
        const allRules = [
            ...this.sqlRules,
            ...this.reactRules,
            ...this.typeScriptRules,
            ...this.styleRules,
            ...this.buildRules,
        ];

        for (const rule of allRules) {
            const matches = typeof rule.pattern === 'string'
                ? issue.id.includes(rule.pattern) || issue.title.includes(rule.pattern)
                : rule.pattern.test(issue.id) || rule.pattern.test(issue.title);

            if (matches) {
                // Check condition if present
                if (rule.condition && !rule.condition(issue)) {
                    continue;
                }
                return rule.severity;
            }
        }

        return null;
    }

    /**
     * Check if this is a complexity rule
     */
    private isComplexityRule(issue: CodeIssue): boolean {
        return /complexity|cyclomatic|cognitive/i.test(issue.title) ||
            /complexity|cyclomatic|cognitive/i.test(issue.id);
    }

    /**
     * Map complexity severity based on measured value
     */
    private mapComplexitySeverity(issue: CodeIssue): CanonicalSeverity {
        // Try to extract complexity value from description or title
        const complexityMatch = issue.description.match(/complexity[:\s]+(\d+)/i) ||
            issue.title.match(/complexity[:\s]+(\d+)/i) ||
            issue.description.match(/(\d+)[^\d]*$/) || // Try to get last number
            issue.title.match(/(\d+)[^\d]*$/);

        const complexity = complexityMatch ? parseInt(complexityMatch[1], 10) : 0;

        if (complexity >= 40) return 'CRITICAL';
        if (complexity >= 25) return 'MAJOR';
        if (complexity >= 15) return 'MINOR';
        
        // Default for unmatched complexity rules
        return 'MINOR';
    }

    /**
     * Apply post-processing severity modifiers
     */
    private applyPostProcessingModifiers(
        issue: CodeIssue,
        currentSeverity: CanonicalSeverity
    ): CanonicalSeverity {
        // Auto-downgrade logic
        if (this.shouldDowngrade(issue)) {
            return this.downgradeSeverity(currentSeverity);
        }

        // Auto-upgrade logic
        if (this.shouldUpgrade(issue)) {
            return this.upgradeSeverity(currentSeverity);
        }

        return currentSeverity;
    }

    /**
     * Check if issue should be downgraded
     */
    private shouldDowngrade(issue: CodeIssue): boolean {
        return issue.confidence < 85 &&
            issue.impact < 70 &&
            issue.category === 'maintainability';
    }

    /**
     * Check if issue should be upgraded
     */
    private shouldUpgrade(issue: CodeIssue): boolean {
        const filePath = issue.location.filePath.toLowerCase();
        
        // Critical paths
        const isCriticalPath = filePath.includes('/supabase/') ||
            filePath.includes('/migrations/') ||
            filePath.includes('/stores/') ||
            filePath.includes('/services/');

        // High confidence and impact
        const isHighQuality = issue.confidence >= 95 && issue.impact >= 90;

        return isCriticalPath || isHighQuality;
    }

    /**
     * Downgrade severity by one level
     */
    private downgradeSeverity(severity: CanonicalSeverity): CanonicalSeverity {
        const levels: CanonicalSeverity[] = ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'INFO'];
        const currentIndex = levels.indexOf(severity);
        const newIndex = Math.min(currentIndex + 1, levels.length - 1);
        return levels[newIndex];
    }

    /**
     * Upgrade severity by one level (max = CRITICAL per spec)
     */
    private upgradeSeverity(severity: CanonicalSeverity): CanonicalSeverity {
        const levels: CanonicalSeverity[] = ['INFO', 'MINOR', 'MAJOR', 'CRITICAL'];
        const currentIndex = levels.indexOf(severity);
        if (currentIndex === -1) return severity;
        
        const newIndex = Math.max(currentIndex - 1, 0);
        const upgraded = levels[newIndex];
        
        // Max = CRITICAL per spec
        return upgraded === 'BLOCKER' ? 'CRITICAL' : upgraded;
    }

    /**
     * Get expected severity distribution statistics
     */
    getDistributionStats(issues: CodeIssue[]): Record<string, number> {
        const remapped = this.remapIssues(issues);
        const stats: Record<string, number> = {
            blocker: 0,
            critical: 0,
            major: 0,
            minor: 0,
            info: 0,
        };

        for (const issue of remapped) {
            if (issue.severity === 'error') {
                // Check if it's BLOCKER or CRITICAL by re-applying rules
                const canonical = this.applyRuleBasedMapping(issue) || this.mapComplexitySeverity(issue);
                if (canonical === 'BLOCKER') {
                    stats.blocker++;
                } else {
                    stats.critical++;
                }
            } else if (issue.severity === 'warning') {
                stats.major++;
            } else if (issue.severity === 'info') {
                stats.minor++;
            } else {
                stats.info++;
            }
        }

        return stats;
    }

    /**
     * Get remapping statistics (for debugging)
     */
    getRemappingStats() {
        return { ...this.remappingStats };
    }

    /**
     * Reset remapping statistics
     */
    resetStats() {
        this.remappingStats = {
            total: 0,
            remapped: 0,
            upgraded: 0,
            downgraded: 0,
        };
    }
}
