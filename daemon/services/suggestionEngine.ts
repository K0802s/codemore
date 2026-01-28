/**
 * Suggestion Engine
 * 
 * Generates actionable refactoring suggestions with diffs.
 * Prioritizes suggestions by impact and confidence.
 */

import { AiService } from './aiService';
import { ContextMap } from './contextMap';
import {
    CodeIssue,
    CodeSuggestion,
    FileContext,
} from '../../shared/protocol';

export class SuggestionEngine {
    private issueCache = new Map<string, CodeIssue>();
    private suggestionCache = new Map<string, CodeSuggestion[]>();
    private suggestionById = new Map<string, CodeSuggestion>();

    constructor(
        private readonly aiService: AiService,
        private readonly contextMap: ContextMap
    ) { }

    /**
     * Analyze a file and return issues
     */
    async analyzeFile(
        filePath: string,
        content: string,
        context: FileContext
    ): Promise<CodeIssue[]> {
        console.log(`[SuggestionEngine] Analyzing: ${filePath}`);

        const issues = await this.aiService.analyzeCode(filePath, content, context);

        // Cache issues
        for (const issue of issues) {
            this.issueCache.set(issue.id, issue);
        }

        // Sort by priority (severity + impact + confidence)
        issues.sort((a, b) => {
            const scoreA = this.calculatePriority(a);
            const scoreB = this.calculatePriority(b);
            return scoreB - scoreA;
        });

        return issues;
    }

    /**
     * Get suggestions for a specific issue
     */
    async getSuggestionsForIssue(issueId: string): Promise<CodeSuggestion[]> {
        // Check cache
        const cached = this.suggestionCache.get(issueId);
        if (cached) {
            return cached;
        }

        // Get the issue
        const issue = this.issueCache.get(issueId);
        if (!issue) {
            console.log(`[SuggestionEngine] Issue not found: ${issueId}`);
            return [];
        }

        // Get file context
        const fileContext = this.contextMap.getFileContext(issue.location.filePath);
        if (!fileContext) {
            console.log(`[SuggestionEngine] File context not found: ${issue.location.filePath}`);
            return [];
        }

        // Get file content
        const content = await this.contextMap.getFileContent(issue.location.filePath);

        // Generate suggestions
        const suggestions = await this.aiService.generateSuggestion(
            issue,
            content,
            fileContext
        );

        // Cache suggestions by issue ID and by suggestion ID
        this.suggestionCache.set(issueId, suggestions);
        for (const suggestion of suggestions) {
            this.suggestionById.set(suggestion.id, suggestion);
        }

        return suggestions;
    }

    /**
     * Get a suggestion by its ID
     */
    getSuggestionById(suggestionId: string): CodeSuggestion | null {
        return this.suggestionById.get(suggestionId) || null;
    }

    /**
     * Get all suggestions for a file
     */
    async getSuggestionsForFile(filePath: string): Promise<CodeSuggestion[]> {
        const fileContext = this.contextMap.getFileContext(filePath);
        if (!fileContext) {
            return [];
        }

        const suggestions: CodeSuggestion[] = [];
        for (const issue of fileContext.issues) {
            const issueSuggestions = await this.getSuggestionsForIssue(issue.id);
            suggestions.push(...issueSuggestions);
        }

        return suggestions;
    }

    /**
     * Calculate priority score for an issue
     */
    private calculatePriority(issue: CodeIssue): number {
        const severityWeights = {
            'BLOCKER': 120,
            'CRITICAL': 100,
            'MAJOR': 60,
            'MINOR': 30,
            'INFO': 10,
        };

        const categoryWeights = {
            'security': 50,
            'bug': 40,
            'performance': 30,
            'maintainability': 20,
            'code-smell': 15,
            'best-practice': 10,
            'accessibility': 10,
        };

        const severityScore = severityWeights[issue.severity as keyof typeof severityWeights] || 0;
        const categoryScore = categoryWeights[issue.category] || 0;
        const confidenceScore = issue.confidence;
        const impactScore = issue.impact;

        // Weighted combination
        return (
            severityScore * 0.4 +
            categoryScore * 0.2 +
            confidenceScore * 0.2 +
            impactScore * 0.2
        );
    }

    /**
     * Clear caches
     */
    clearCache(): void {
        this.issueCache.clear();
        this.suggestionCache.clear();
        this.suggestionById.clear();
    }

    /**
     * Get issue by ID
     */
    getIssue(issueId: string): CodeIssue | undefined {
        return this.issueCache.get(issueId);
    }

    /**
     * Get all cached issues
     */
    getAllIssues(): CodeIssue[] {
        return Array.from(this.issueCache.values());
    }
}
