/**
 * Webview Types
 * Re-export types from shared protocol for use in webview components
 */

// Re-export from shared protocol
export type {
    CodeIssue,
    CodeSuggestion,
    CodeHealthMetrics,
    FileContext,
    IssueSeverity,
    IssueCategory,
    WebviewToExtensionMessage,
    ExtensionToWebviewMessage,
} from '../shared/protocol';
