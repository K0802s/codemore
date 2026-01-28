/**
 * Context Map Service
 * 
 * Maintains a project-wide context map with dependency graphs.
 * Provides incremental updates on file changes.
 */

import * as fs from 'fs';
import * as path from 'path';
import {
    FileContext,
    ProjectContext,
    CodeHealthMetrics,
    CodeIssue,
    IssueSeverity,
    IssueCategory,
} from '../../shared/protocol';

export class ContextMap {
    private files = new Map<string, FileContext>();
    private dependencyGraph = new Map<string, string[]>();
    private reverseDependencyGraph = new Map<string, string[]>();
    private lastFullAnalysis = 0;

    constructor(private readonly workspacePath: string) { }

    /**
     * Scan workspace for all files
     */
    async scanWorkspace(): Promise<void> {
        console.log(`[ContextMap] Scanning workspace: ${this.workspacePath}`);

        const files = await this.findFiles(this.workspacePath);
        console.log(`[ContextMap] Found ${files.length} files`);

        this.lastFullAnalysis = Date.now();
    }

    /**
     * Get all files in the workspace
     */
    async getAllFiles(): Promise<string[]> {
        return await this.findFiles(this.workspacePath);
    }

    /**
     * Find all supported files recursively
     */
    private async findFiles(dir: string): Promise<string[]> {
        const files: string[] = [];

        const supportedExtensions = [
            '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
        ];

        const excludeDirs = ['node_modules', '.git', 'dist', 'build', 'out', '.next'];

        try {
            const entries = await fs.promises.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    if (!excludeDirs.includes(entry.name) && !entry.name.startsWith('.')) {
                        files.push(...await this.findFiles(fullPath));
                    }
                } else if (entry.isFile()) {
                    const ext = path.extname(entry.name).toLowerCase();
                    if (supportedExtensions.includes(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        } catch (error) {
            console.error(`[ContextMap] Error scanning ${dir}:`, error);
        }

        return files;
    }

    /**
     * Get file content
     */
    async getFileContent(filePath: string): Promise<string> {
        try {
            return await fs.promises.readFile(filePath, 'utf-8');
        } catch (error) {
            console.error(`[ContextMap] Error reading file ${filePath}:`, error);
            return '';
        }
    }

    /**
     * Update file context
     */
    updateFile(filePath: string, context: FileContext): void {
        // Update dependency graph
        const oldContext = this.files.get(filePath);
        if (oldContext) {
            // Remove old dependencies
            for (const dep of oldContext.dependencies) {
                const reverse = this.reverseDependencyGraph.get(dep);
                if (reverse) {
                    const index = reverse.indexOf(filePath);
                    if (index > -1) {
                        reverse.splice(index, 1);
                    }
                }
            }
        }

        // Add new dependencies
        this.dependencyGraph.set(filePath, context.dependencies);
        for (const dep of context.dependencies) {
            if (!this.reverseDependencyGraph.has(dep)) {
                this.reverseDependencyGraph.set(dep, []);
            }
            this.reverseDependencyGraph.get(dep)!.push(filePath);
        }

        // Store context
        this.files.set(filePath, context);
    }

    /**
     * Get file context
     */
    getFileContext(filePath: string): FileContext | null {
        return this.files.get(filePath) || null;
    }

    /**
     * Invalidate file cache
     */
    invalidateFile(filePath: string): void {
        this.files.delete(filePath);
    }

    /**
     * Get files that depend on a given file
     */
    getDependents(filePath: string): string[] {
        return this.reverseDependencyGraph.get(filePath) || [];
    }

    /**
     * Get files that a given file depends on
     */
    getDependencies(filePath: string): string[] {
        return this.dependencyGraph.get(filePath) || [];
    }

    /**
     * Get project context
     * Note: Maps are converted to plain objects for JSON serialization
     */
    getProjectContext(): ProjectContext {
        let totalIssues = 0;
        for (const context of this.files.values()) {
            totalIssues += context.issues.length;
        }

        // Convert Maps to plain objects for JSON serialization
        const filesObj: Record<string, FileContext> = {};
        for (const [key, value] of this.files.entries()) {
            filesObj[key] = value;
        }

        const depGraphObj: Record<string, string[]> = {};
        for (const [key, value] of this.dependencyGraph.entries()) {
            depGraphObj[key] = value;
        }

        return {
            rootPath: this.workspacePath,
            name: path.basename(this.workspacePath),
            files: filesObj as any,
            dependencyGraph: depGraphObj as any,
            totalIssues,
            lastFullAnalysis: this.lastFullAnalysis,
        };
    }

    /**
     * Get code health metrics
     */
    getHealthMetrics(): CodeHealthMetrics {
        const issuesByCategory: Record<IssueCategory, number> = {
            'bug': 0,
            'code-smell': 0,
            'performance': 0,
            'security': 0,
            'maintainability': 0,
            'accessibility': 0,
            'best-practice': 0,
        };

        const issuesBySeverity: Record<IssueSeverity, number> = {
            'error': 0,
            'warning': 0,
            'info': 0,
            'hint': 0,
        };

        let totalIssues = 0;
        let totalLinesOfCode = 0;
        let totalComplexity = 0;

        for (const context of this.files.values()) {
            for (const issue of context.issues) {
                totalIssues++;
                issuesByCategory[issue.category]++;
                issuesBySeverity[issue.severity]++;
            }

            // Estimate lines of code
            totalLinesOfCode += context.symbols.reduce((acc, symbol) => {
                return acc + (symbol.range.end.line - symbol.range.start.line + 1);
            }, 0);

            // Estimate complexity (simplified)
            totalComplexity += context.symbols.filter(s => s.kind === 'function').length;
        }

        const filesAnalyzed = this.files.size;
        const averageComplexity = filesAnalyzed > 0 ? totalComplexity / filesAnalyzed : 0;

        // Calculate overall score (0-100)
        // Higher is better
        let overallScore = 100;
        overallScore -= issuesBySeverity.error * 10;
        overallScore -= issuesBySeverity.warning * 5;
        overallScore -= issuesBySeverity.info * 2;
        overallScore -= issuesBySeverity.hint * 1;
        overallScore = Math.max(0, Math.min(100, overallScore));

        // Estimate technical debt in minutes
        const technicalDebtMinutes =
            issuesBySeverity.error * 60 +
            issuesBySeverity.warning * 30 +
            issuesBySeverity.info * 10 +
            issuesBySeverity.hint * 5;

        return {
            overallScore,
            issuesByCategory,
            issuesBySeverity,
            filesAnalyzed,
            totalFiles: filesAnalyzed, // In full scan, these would differ
            linesOfCode: totalLinesOfCode,
            averageComplexity,
            technicalDebtMinutes,
        };
    }

    /**
     * Get all issues across the project
     */
    getAllIssues(): CodeIssue[] {
        const issues: CodeIssue[] = [];
        for (const context of this.files.values()) {
            issues.push(...context.issues);
        }
        return issues;
    }

    /**
     * Get issues for a specific file
     */
    getFileIssues(filePath: string): CodeIssue[] {
        const context = this.files.get(filePath);
        return context?.issues || [];
    }

    /**
     * Clear all cached data
     */
    clear(): void {
        this.files.clear();
        this.dependencyGraph.clear();
        this.reverseDependencyGraph.clear();
    }
}
