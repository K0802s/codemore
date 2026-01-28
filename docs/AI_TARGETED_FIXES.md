# Targeted AI Fix Generation

## Overview

CodeMore now uses a **targeted AI approach** for generating code fixes. Instead of sending every file to AI for review (which is slow and expensive), AI is only invoked **on-demand** when a user selects a specific issue.

This approach provides:
- ⚡ **Faster analysis** - No waiting for AI to analyze every file
- 💰 **Lower costs** - Only pay for AI when you need it
- 🎯 **Better quality** - AI gets full context about the specific issue
- 🔒 **More security** - Sensitive code isn't automatically sent to external APIs

## How It Works

### 1. Initial Analysis (Fast, No AI)

When you open a file or workspace, CodeMore runs:

1. **External Static Analysis Tools** (Biome, Ruff, TFLint, etc.)
   - Industry-standard linters and security scanners
   - Fast, accurate, no API costs
   
2. **Built-in Static Analysis**
   - TypeScript AST-based analysis
   - Detects complexity, dead code, security issues
   - No external API calls

**Result:** You get instant feedback on code quality issues without any AI involvement.

### 2. Targeted AI Fix Generation (On-Demand)

When you want a proper AI-powered fix:

1. **Select an issue** from the CodeMore dashboard
2. **Click "Generate AI Fix"** button
3. CodeMore then:
   - Gathers the issue context (file, line numbers, code snippet)
   - Finds and includes **related files** (imports, dependencies)
   - Sends focused context to AI with specific instructions
   - Receives **multiple fix suggestions** with diffs
   - Shows you the proposed changes for review

**Result:** High-quality, context-aware fixes that you can accept or reject.

## Architecture

### Old Approach (Inefficient)
```
File Change → AI Analysis → Issues + Suggestions
   ↓
Every file sent to AI
Slow, expensive, unnecessary
```

### New Approach (Targeted)
```
File Change → Static Analysis → Issues
                    ↓
           User selects issue
                    ↓
    AI Fix Generation (with context)
                    ↓
          Suggestions + Diffs
```

## API Changes

### New RPC Method

```typescript
// Daemon RPC Method
'generateAiFix': {
    params: { 
        issueId: string; 
        includeRelatedFiles?: boolean 
    };
    result: { suggestions: CodeSuggestion[] };
}
```

### New Webview Message

```typescript
// User clicks "Generate AI Fix" in UI
{ 
    type: 'generateAiFix'; 
    issueId: string; 
    includeRelatedFiles?: boolean 
}
```

## Implementation Details

### Related File Discovery

When generating an AI fix, CodeMore automatically gathers related files:

1. **Direct imports** - Files imported by the target file
2. **Reverse dependencies** - Files that import the target file
3. **Same directory** - Related files in the same module

This provides AI with the context needed to generate reliable, secure fixes.

**Limit:** Maximum 5 related files to avoid sending too much data.

### AI Prompt Structure

The AI receives:

1. **Issue details** - Title, description, category, severity
2. **Problematic code** - The specific code section with 10 lines of context
3. **File context** - Imports, exports, symbols
4. **Related files** - Relevant code from imported/dependent files
5. **Specific instructions** - Generate secure, minimal, production-ready fix

### Response Format

AI returns structured JSON with:

```typescript
{
    "id": "fix-{issueId}-1",
    "title": "Brief fix description",
    "description": "Detailed explanation with reasoning",
    "originalCode": "exact code to replace",
    "suggestedCode": "fixed code",
    "diff": "unified diff format",
    "confidence": 85,  // 70-95
    "impact": 80,      // estimated impact score
    "tags": ["category", "severity", "ai-generated"]
}
```

## Usage Example

### 1. User sees an issue in the dashboard:

```
❌ MAJOR: Cyclomatic complexity too high (25)
   Function `processUserData` is too complex
   File: src/user/processor.ts:45-89
```

### 2. User clicks "Generate AI Fix"

### 3. Behind the scenes:

```typescript
// Extension calls daemon
await daemon.call('generateAiFix', { 
    issueId: 'complexity-abc123',
    includeRelatedFiles: true 
});

// Daemon gathers context
const issue = getIssue('complexity-abc123');
const fileContent = readFile('src/user/processor.ts');
const relatedFiles = [
    'src/user/types.ts',      // imported types
    'src/user/validator.ts',  // imports this file
];

// AI receives targeted prompt
const suggestions = await ai.generateFix(
    issue, 
    fileContent, 
    relatedFiles
);
```

### 4. User sees suggestions:

```
✨ AI-Generated Fix Suggestions (3)

1. Extract validation logic into separate function
   Confidence: 88% | Impact: High
   
2. Use early returns to reduce nesting
   Confidence: 92% | Impact: Medium
   
3. Split into smaller focused functions
   Confidence: 85% | Impact: High
```

### 5. User reviews diff and applies the fix

## Configuration

### Disable Automatic AI Analysis

In settings:

```json
{
    "codemore.analysisTools": "external"  // or "internal" or "both"
}
```

Options:
- `"external"` - Only use external tools (Biome, Ruff, etc.)
- `"internal"` - Only use built-in static analysis
- `"both"` - Use both (default, but no AI)

**Note:** AI is never used automatically. It's always invoked explicitly by the user.

## Benefits

### For Developers

✅ **Control** - You decide when to use AI
✅ **Fast** - Instant issue detection without waiting for AI
✅ **Quality** - AI gets full context for better suggestions
✅ **Privacy** - Code only sent to AI when you explicitly request it

### For Teams

✅ **Cost-effective** - Pay only for fixes you need
✅ **Efficient** - No wasted AI calls on every file change
✅ **Reliable** - Static analysis catches most issues instantly
✅ **Secure** - Sensitive code stays local unless you choose to get AI help

## Future Enhancements

Planned improvements:

1. **Batch fix generation** - Generate fixes for multiple related issues
2. **Custom prompts** - Allow users to guide AI with specific requirements
3. **Learning from feedback** - Improve suggestions based on accepted/rejected fixes
4. **Team knowledge base** - Share successful fixes across the team
5. **Offline AI** - Support local LLMs for complete privacy

## See Also

- [AI Service Documentation](./daemon/services/aiService.ts)
- [Suggestion Engine Documentation](./daemon/services/suggestionEngine.ts)
- [Protocol Definitions](../shared/protocol.ts)
