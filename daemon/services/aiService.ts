/**
 * AI Service
 * 
 * Handles communication with LLM APIs for code analysis.
 * Supports multiple providers (OpenAI, Anthropic, Gemini, local).
 * Falls back to advanced static analysis when AI is not available.
 */

import { DaemonConfig, CodeIssue, CodeSuggestion, FileContext, IssueSeverity } from '../../shared/protocol';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { StaticAnalyzer, StaticAnalyzerConfig } from './staticAnalyzer';

interface CacheEntry {
    response: string;
    timestamp: number;
}

/**
 * Represents a "hot spot" - a code region that warrants deeper AI analysis
 */
interface HotSpot {
    startLine: number;
    endLine: number;
    reason: string;
    severity: IssueSeverity;
}

export class AiService {
    private cache = new Map<string, CacheEntry>();
    private config: DaemonConfig;
    private geminiModel: GenerativeModel | null = null;
    private staticAnalyzer: StaticAnalyzer;

    constructor(config: DaemonConfig) {
        this.config = config;
        this.staticAnalyzer = new StaticAnalyzer();
        this.initGemini();
    }

    /**
     * Initialize Gemini model if configured
     */
    private initGemini(): void {
        if (this.config.aiProvider === 'gemini' && this.config.apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(this.config.apiKey);
                this.geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-09-2025' });
                console.log('[AiService] Gemini model initialized');
            } catch (error) {
                console.error('[AiService] Failed to initialize Gemini:', error);
                this.geminiModel = null;
            }
        }
    }

    /**
     * Update configuration
     */
    updateConfig(config: DaemonConfig): void {
        const providerChanged = config.aiProvider !== this.config.aiProvider;
        const keyChanged = config.apiKey !== this.config.apiKey;
        
        this.config = config;

        // Clear cache and reinitialize if provider or key changed
        if (providerChanged || keyChanged) {
            this.cache.clear();
            this.geminiModel = null;
            this.initGemini();
        }
    }

    /**
     * Analyze code and generate issues
     * Uses a hybrid approach: static analysis always runs, AI enhances when available
     */
    async analyzeCode(
        filePath: string,
        content: string,
        context: FileContext
    ): Promise<CodeIssue[]> {
        // Always run static analysis first - it's fast and comprehensive
        const staticIssues = this.performStaticAnalysis(filePath, content, context);

        // If no API key, return static analysis only
        if (!this.config.apiKey) {
            console.log(`[AiService] No API key configured, returning ${staticIssues.length} static analysis issues`);
            return staticIssues;
        }

        // Check cache for AI results
        const cacheKey = this.getCacheKey(filePath, content);
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            // Merge cached AI issues with static issues
            const aiIssues = JSON.parse(cached) as CodeIssue[];
            return this.mergeIssues(staticIssues, aiIssues);
        }

        // Use static analysis to identify "hot spots" for AI focus
        // This saves API costs by only sending complex/problematic areas
        const hotSpots = this.identifyHotSpots(staticIssues);
        
        try {
            const aiIssues = await this.callAiApi(filePath, content, context, hotSpots);

            // Cache the AI result
            this.setCache(cacheKey, JSON.stringify(aiIssues));

            // Merge static and AI issues, deduplicating similar findings
            return this.mergeIssues(staticIssues, aiIssues);
        } catch (error) {
            console.error('[AiService] API call failed, returning static analysis only:', error);
            // Static analysis already ran, just return those issues
            return staticIssues;
        }
    }

    /**
     * Identify "hot spots" - complex or problematic areas that AI should focus on
     * This enables cost-effective AI usage by targeting problem areas
     */
    private identifyHotSpots(issues: CodeIssue[]): HotSpot[] {
        const hotSpots: HotSpot[] = [];
        const lineIssueCount = new Map<number, number>();

        // Count issues per line/region
        for (const issue of issues) {
            const line = issue.location.range.start.line;
            lineIssueCount.set(line, (lineIssueCount.get(line) || 0) + 1);
        }

        // Identify areas with multiple issues or high-severity issues
        for (const issue of issues) {
            const line = issue.location.range.start.line;
            const issueCount = lineIssueCount.get(line) || 0;

            // Mark as hotspot if:
            // 1. High severity (error or warning)
            // 2. Multiple issues in same area
            // 3. Complexity-related issues
            const isHighSeverity = issue.severity === 'error' || issue.severity === 'warning';
            const hasMultipleIssues = issueCount >= 2;
            const isComplexityIssue = issue.id.includes('cyclomatic') || 
                                       issue.id.includes('cognitive') || 
                                       issue.id.includes('nesting');

            if (isHighSeverity || hasMultipleIssues || isComplexityIssue) {
                hotSpots.push({
                    startLine: issue.location.range.start.line,
                    endLine: issue.location.range.end.line,
                    reason: issue.title,
                    severity: issue.severity,
                });
            }
        }

        // Deduplicate overlapping hotspots
        return this.deduplicateHotSpots(hotSpots);
    }

    /**
     * Deduplicate overlapping hot spots
     */
    private deduplicateHotSpots(hotSpots: HotSpot[]): HotSpot[] {
        if (hotSpots.length === 0) return [];

        // Sort by start line
        const sorted = [...hotSpots].sort((a, b) => a.startLine - b.startLine);
        const result: HotSpot[] = [sorted[0]];

        for (let i = 1; i < sorted.length; i++) {
            const current = sorted[i];
            const last = result[result.length - 1];

            // If overlapping or adjacent, merge
            if (current.startLine <= last.endLine + 5) {
                last.endLine = Math.max(last.endLine, current.endLine);
                last.reason = `${last.reason}; ${current.reason}`;
            } else {
                result.push(current);
            }
        }

        return result;
    }

    /**
     * Merge static and AI issues, removing duplicates
     */
    private mergeIssues(staticIssues: CodeIssue[], aiIssues: CodeIssue[]): CodeIssue[] {
        const merged: CodeIssue[] = [...staticIssues];
        const existingLocations = new Set(
            staticIssues.map(i => `${i.location.range.start.line}:${i.category}:${i.title.toLowerCase().slice(0, 20)}`)
        );

        for (const aiIssue of aiIssues) {
            // Generate a key for deduplication
            const key = `${aiIssue.location.range.start.line}:${aiIssue.category}:${aiIssue.title.toLowerCase().slice(0, 20)}`;
            
            // Only add if not a duplicate
            if (!existingLocations.has(key)) {
                // Mark AI issues for UI differentiation
                merged.push({
                    ...aiIssue,
                    id: `ai-${aiIssue.id}`, // Prefix to indicate AI-generated
                });
                existingLocations.add(key);
            }
        }

        // Sort by severity and line number
        return merged.sort((a, b) => {
            const severityOrder = { error: 0, warning: 1, info: 2, hint: 3 };
            const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
            if (severityDiff !== 0) return severityDiff;
            return a.location.range.start.line - b.location.range.start.line;
        });
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
        context: FileContext,
        hotSpots: HotSpot[] = []
    ): Promise<CodeIssue[]> {
        const prompt = this.buildPrompt(filePath, content, context, hotSpots);

        switch (this.config.aiProvider) {
            case 'openai':
                return await this.callOpenAI(prompt);
            case 'anthropic':
                return await this.callAnthropic(prompt);
            case 'gemini':
                return await this.callGemini(prompt);
            case 'local':
                return await this.callLocal(prompt);
            default:
                return [];
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
     * Call Google Gemini API using the official SDK
     */
    private async callGemini(prompt: string): Promise<CodeIssue[]> {
        try {
            // Initialize model if not already done
            if (!this.geminiModel) {
                if (!this.config.apiKey) {
                    throw new Error('Gemini API key not configured');
                }
                const genAI = new GoogleGenerativeAI(this.config.apiKey);
                this.geminiModel = genAI.getGenerativeModel({ 
                    model: 'gemini-1.5-flash',
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 4000,
                    },
                });
            }

            const systemPrompt = `You are a code quality analyzer. Analyze the provided code and return issues in JSON format.
Return ONLY a valid JSON array, no additional text or markdown.`;

            const result = await this.geminiModel.generateContent([
                { text: systemPrompt },
                { text: prompt },
            ]);

            const response = await result.response;
            const content = response.text();

            if (!content) {
                console.log('[AiService] Gemini returned empty response');
                return [];
            }

            console.log('[AiService] Gemini response received, parsing...');

            // Parse JSON from response - try to extract JSON array
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                try {
                    const issues = JSON.parse(jsonMatch[0]);
                    console.log(`[AiService] Gemini found ${issues.length} issues`);
                    return issues;
                } catch (parseError) {
                    console.error('[AiService] Failed to parse Gemini JSON:', parseError);
                    return [];
                }
            }

            console.log('[AiService] No JSON array found in Gemini response');
            return [];
        } catch (error) {
            console.error('[AiService] Gemini API error:', error);
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
    private buildPrompt(
        filePath: string, 
        content: string, 
        context: FileContext,
        hotSpots: HotSpot[] = []
    ): string {
        // Build hotspot guidance for the AI
        let hotSpotSection = '';
        if (hotSpots.length > 0) {
            const hotSpotDetails = hotSpots.map(hs => 
                `  - Lines ${hs.startLine}-${hs.endLine}: ${hs.reason} (${hs.severity})`
            ).join('\n');
            hotSpotSection = `
PRIORITY AREAS (focus analysis here):
${hotSpotDetails}

`;
        }

        return `Analyze this ${context.language} code for issues. Return a JSON array of issues.

File: ${filePath}
${hotSpotSection}
Code:
\`\`\`${context.language}
${content.slice(0, 5000)} ${content.length > 5000 ? '\n... (truncated)' : ''}
\`\`\`

Context:
- Symbols: ${context.symbols.map(s => s.name).join(', ')}
- Imports: ${context.imports.map(i => i.module).join(', ')}
- Dependencies: ${context.dependencies.join(', ')}

Focus on finding issues that static analysis cannot detect:
- Logic errors and edge cases
- API misuse patterns
- Race conditions
- Memory leaks
- Incorrect algorithm implementations
- Missing error handling in complex scenarios

Return issues in this JSON format:
[
  {
    "id": "unique-id",
    "title": "Issue title",
    "description": "Detailed description with WHY this matters and potential consequences",
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
     * Perform advanced static analysis (fallback when no API key)
     * Uses the comprehensive StaticAnalyzer for deep code analysis
     */
    private performStaticAnalysis(
        filePath: string,
        content: string,
        context: FileContext
    ): CodeIssue[] {
        console.log(`[AiService] Performing advanced static analysis on: ${filePath}`);
        
        // Use the comprehensive static analyzer
        return this.staticAnalyzer.analyze(filePath, content, context);
    }

    /**
     * Update static analyzer configuration
     */
    updateStaticAnalyzerConfig(config: Partial<StaticAnalyzerConfig>): void {
        this.staticAnalyzer.updateConfig(config);
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
