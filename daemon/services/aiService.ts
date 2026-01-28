/**
 * AI Service
 * 
 * Handles communication with LLM APIs for code analysis.
 * Supports multiple providers (OpenAI, Anthropic, local).
 */

import { DaemonConfig, CodeIssue, CodeSuggestion, FileContext, IssueCategory, IssueSeverity } from '../../shared/protocol';

interface CacheEntry {
    response: string;
    timestamp: number;
}

export class AiService {
    private cache = new Map<string, CacheEntry>();
    private config: DaemonConfig;

    constructor(config: DaemonConfig) {
        this.config = config;
    }

    /**
     * Update configuration
     */
    updateConfig(config: DaemonConfig): void {
        this.config = config;

        // Clear cache if provider changed
        if (config.aiProvider !== this.config.aiProvider) {
            this.cache.clear();
        }
    }

    /**
     * Analyze code and generate issues
     */
    async analyzeCode(
        filePath: string,
        content: string,
        context: FileContext
    ): Promise<CodeIssue[]> {
        // If no API key, use static analysis only
        if (!this.config.apiKey) {
            return this.performStaticAnalysis(filePath, content, context);
        }

        // Check cache
        const cacheKey = this.getCacheKey(filePath, content);
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        try {
            const issues = await this.callAiApi(filePath, content, context);

            // Cache the result
            this.setCache(cacheKey, JSON.stringify(issues));

            return issues;
        } catch (error) {
            console.error('[AiService] API call failed, falling back to static analysis:', error);
            return this.performStaticAnalysis(filePath, content, context);
        }
    }

    /**
     * Generate suggestions for an issue
     */
    async generateSuggestion(
        issue: CodeIssue,
        fileContent: string,
        context: FileContext
    ): Promise<CodeSuggestion[]> {
        // For now, return mock suggestions
        // In production, this would call the AI API
        const suggestion: CodeSuggestion = {
            id: `suggestion-${issue.id}`,
            issueId: issue.id,
            title: `Fix: ${issue.title}`,
            description: `Suggested fix for the ${issue.category} issue`,
            originalCode: issue.codeSnippet,
            suggestedCode: this.generateMockFix(issue),
            diff: this.generateMockDiff(issue),
            location: issue.location,
            confidence: issue.confidence,
            impact: issue.impact,
            tags: [issue.category, issue.severity],
        };

        return [suggestion];
    }

    /**
     * Call the AI API
     */
    private async callAiApi(
        filePath: string,
        content: string,
        context: FileContext
    ): Promise<CodeIssue[]> {
        const prompt = this.buildPrompt(filePath, content, context);

        switch (this.config.aiProvider) {
            case 'openai':
                return await this.callOpenAI(prompt);
            case 'anthropic':
                return await this.callAnthropic(prompt);
            case 'local':
                return await this.callLocal(prompt);
            default:
                return this.performStaticAnalysis(filePath, content, context);
        }
    }

    /**
     * Call OpenAI API
     */
    private async callOpenAI(prompt: string): Promise<CodeIssue[]> {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a code quality analyzer. Analyze the provided code and return issues in JSON format.',
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: 0.3,
                    max_tokens: 2000,
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json() as { choices: Array<{ message?: { content?: string } }> };
            const content = data.choices[0]?.message?.content;

            if (!content) {
                return [];
            }

            // Parse JSON from response
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return [];
        } catch (error) {
            console.error('[AiService] OpenAI API error:', error);
            throw error;
        }
    }

    /**
     * Call Anthropic API
     */
    private async callAnthropic(prompt: string): Promise<CodeIssue[]> {
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.config.apiKey!,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: 'claude-3-sonnet-20240229',
                    max_tokens: 2000,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error(`Anthropic API error: ${response.status}`);
            }

            const data = await response.json() as { content: Array<{ text?: string }> };
            const content = data.content[0]?.text;

            if (!content) {
                return [];
            }

            // Parse JSON from response
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return [];
        } catch (error) {
            console.error('[AiService] Anthropic API error:', error);
            throw error;
        }
    }

    /**
     * Call local model API (e.g., Ollama)
     */
    private async callLocal(prompt: string): Promise<CodeIssue[]> {
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'codellama',
                    prompt,
                    stream: false,
                }),
            });

            if (!response.ok) {
                throw new Error(`Local API error: ${response.status}`);
            }

            const data = await response.json() as { response?: string };
            const content = data.response;

            if (!content) {
                return [];
            }

            // Parse JSON from response
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return [];
        } catch (error) {
            console.error('[AiService] Local API error:', error);
            throw error;
        }
    }

    /**
     * Build analysis prompt
     */
    private buildPrompt(filePath: string, content: string, context: FileContext): string {
        return `Analyze this ${context.language} code for issues. Return a JSON array of issues.

File: ${filePath}

Code:
\`\`\`${context.language}
${content.slice(0, 5000)} ${content.length > 5000 ? '\n... (truncated)' : ''}
\`\`\`

Context:
- Symbols: ${context.symbols.map(s => s.name).join(', ')}
- Imports: ${context.imports.map(i => i.module).join(', ')}
- Dependencies: ${context.dependencies.join(', ')}

Return issues in this JSON format:
[
  {
    "id": "unique-id",
    "title": "Issue title",
    "description": "Detailed description",
    "category": "bug|code-smell|performance|security|maintainability|best-practice",
    "severity": "error|warning|info|hint",
    "location": {
      "filePath": "${filePath}",
      "range": { "start": { "line": 0, "column": 0 }, "end": { "line": 0, "column": 0 } }
    },
    "codeSnippet": "relevant code",
    "confidence": 80,
    "impact": 70
  }
]`;
    }

    /**
     * Perform static analysis (fallback when no API key)
     */
    private performStaticAnalysis(
        filePath: string,
        content: string,
        context: FileContext
    ): CodeIssue[] {
        const issues: CodeIssue[] = [];
        const lines = content.split('\n');
        let issueId = 0;

        // Check for common issues
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNumber = i;

            // TODO comments
            if (/\/\/\s*TODO/i.test(line)) {
                issues.push(this.createIssue(
                    `todo-${issueId++}`,
                    'TODO comment found',
                    'Consider addressing this TODO item or creating a tracked issue.',
                    'maintainability',
                    'info',
                    filePath,
                    lineNumber,
                    line.trim()
                ));
            }

            // Console.log statements
            if (/console\.(log|debug|info)\s*\(/.test(line)) {
                issues.push(this.createIssue(
                    `console-${issueId++}`,
                    'Console statement found',
                    'Consider removing console statements before production.',
                    'best-practice',
                    'warning',
                    filePath,
                    lineNumber,
                    line.trim()
                ));
            }

            // Magic numbers
            if (/[^a-zA-Z0-9_](\d{2,})[^a-zA-Z0-9_]/.test(line) && !/const|let|var|import|export/.test(line)) {
                const match = line.match(/[^a-zA-Z0-9_](\d{2,})[^a-zA-Z0-9_]/);
                if (match && parseInt(match[1]) > 10) {
                    issues.push(this.createIssue(
                        `magic-${issueId++}`,
                        'Magic number detected',
                        'Consider extracting magic numbers into named constants.',
                        'maintainability',
                        'hint',
                        filePath,
                        lineNumber,
                        line.trim()
                    ));
                }
            }

            // Long lines
            if (line.length > 120) {
                issues.push(this.createIssue(
                    `long-line-${issueId++}`,
                    'Line too long',
                    'Lines should not exceed 120 characters for readability.',
                    'code-smell',
                    'hint',
                    filePath,
                    lineNumber,
                    `${line.slice(0, 50)}...`
                ));
            }

            // Empty catch blocks
            if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(line)) {
                issues.push(this.createIssue(
                    `empty-catch-${issueId++}`,
                    'Empty catch block',
                    'Empty catch blocks may hide errors. Add error handling or logging.',
                    'bug',
                    'warning',
                    filePath,
                    lineNumber,
                    line.trim()
                ));
            }

            // == instead of ===
            if (/[^=!]==[^=]/.test(line)) {
                issues.push(this.createIssue(
                    `equality-${issueId++}`,
                    'Use strict equality',
                    'Use === instead of == for type-safe comparisons.',
                    'best-practice',
                    'warning',
                    filePath,
                    lineNumber,
                    line.trim()
                ));
            }
        }

        // Check for large functions
        for (const symbol of context.symbols) {
            if (symbol.kind === 'function') {
                const functionLength = symbol.range.end.line - symbol.range.start.line;
                if (functionLength > 50) {
                    issues.push(this.createIssue(
                        `long-function-${issueId++}`,
                        `Function '${symbol.name}' is too long`,
                        `This function has ${functionLength} lines. Consider breaking it into smaller functions.`,
                        'maintainability',
                        'warning',
                        filePath,
                        symbol.range.start.line,
                        symbol.name
                    ));
                }
            }
        }

        return issues;
    }

    /**
     * Create an issue object
     */
    private createIssue(
        id: string,
        title: string,
        description: string,
        category: IssueCategory,
        severity: IssueSeverity,
        filePath: string,
        line: number,
        codeSnippet: string
    ): CodeIssue {
        return {
            id,
            title,
            description,
            category,
            severity,
            location: {
                filePath,
                range: {
                    start: { line, column: 0 },
                    end: { line, column: codeSnippet.length },
                },
            },
            codeSnippet,
            confidence: 80,
            impact: this.getImpactForSeverity(severity),
            createdAt: Date.now(),
        };
    }

    /**
     * Get impact score based on severity
     */
    private getImpactForSeverity(severity: IssueSeverity): number {
        switch (severity) {
            case 'error': return 90;
            case 'warning': return 60;
            case 'info': return 40;
            case 'hint': return 20;
        }
    }

    /**
     * Generate mock fix for an issue
     */
    private generateMockFix(issue: CodeIssue): string {
        // In production, this would use AI to generate the fix
        return issue.codeSnippet + ' // Fixed';
    }

    /**
     * Generate mock diff for an issue
     */
    private generateMockDiff(issue: CodeIssue): string {
        return `- ${issue.codeSnippet}\n+ ${issue.codeSnippet} // Fixed`;
    }

    /**
     * Get cache key
     */
    private getCacheKey(filePath: string, content: string): string {
        // Simple hash function
        let hash = 0;
        const str = filePath + content;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `analysis-${hash}`;
    }

    /**
     * Get from cache
     */
    private getFromCache(key: string): string | null {
        if (!this.config.cacheEnabled) {
            return null;
        }

        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }

        // Check TTL
        const ttlMs = this.config.cacheTTLMinutes * 60 * 1000;
        if (Date.now() - entry.timestamp > ttlMs) {
            this.cache.delete(key);
            return null;
        }

        return entry.response;
    }

    /**
     * Set cache entry
     */
    private setCache(key: string, response: string): void {
        if (!this.config.cacheEnabled) {
            return;
        }

        this.cache.set(key, {
            response,
            timestamp: Date.now(),
        });

        // Limit cache size
        if (this.cache.size > 1000) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        this.cache.clear();
    }
}
