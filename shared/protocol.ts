/**
 * CodeMore JSON-RPC Protocol Definitions
 * Shared types between Extension Host, Daemon, and Webview
 */

// ============================================================================
// Core Types
// ============================================================================

export interface Position {
    line: number;
    column: number;
}

export interface Range {
    start: Position;
    end: Position;
}

export interface FileLocation {
    filePath: string;
    range: Range;
}

// ============================================================================
// Issue & Suggestion Types
// ============================================================================

export type IssueSeverity = 'error' | 'warning' | 'info' | 'hint';

export type IssueCategory =
    | 'bug'
    | 'code-smell'
    | 'performance'
    | 'security'
    | 'maintainability'
    | 'accessibility'
    | 'best-practice';

export interface CodeIssue {
    id: string;
    title: string;
    description: string;
    category: IssueCategory;
    severity: IssueSeverity;
    location: FileLocation;
    codeSnippet: string;
    confidence: number; // 0-100
    impact: number; // 0-100
    createdAt: number;
}

export interface CodeSuggestion {
    id: string;
    issueId: string;
    title: string;
    description: string;
    originalCode: string;
    suggestedCode: string;
    diff: string;
    location: FileLocation;
    confidence: number;
    impact: number;
    tags: string[];
}

// ============================================================================
// Context Map Types
// ============================================================================

export interface FileContext {
    filePath: string;
    language: string;
    size: number;
    lastModified: number;
    lastAnalyzed: number;
    symbols: SymbolInfo[];
    imports: ImportInfo[];
    exports: ExportInfo[];
    dependencies: string[];
    issues: CodeIssue[];
}

export interface SymbolInfo {
    name: string;
    kind: 'class' | 'function' | 'variable' | 'interface' | 'type' | 'enum' | 'constant';
    range: Range;
    documentation?: string;
    parameters?: ParameterInfo[];
    returnType?: string;
}

export interface ParameterInfo {
    name: string;
    type?: string;
    optional: boolean;
    defaultValue?: string;
}

export interface ImportInfo {
    module: string;
    isRelative: boolean;
    namedImports: string[];
    defaultImport?: string;
    namespaceImport?: string;
}

export interface ExportInfo {
    name: string;
    kind: SymbolInfo['kind'];
    isDefault: boolean;
}

export interface ProjectContext {
    rootPath: string;
    name: string;
    files: Map<string, FileContext>;
    dependencyGraph: Map<string, string[]>;
    totalIssues: number;
    lastFullAnalysis: number;
}

// ============================================================================
// Health Metrics
// ============================================================================

export interface CodeHealthMetrics {
    overallScore: number; // 0-100
    issuesByCategory: Record<IssueCategory, number>;
    issuesBySeverity: Record<IssueSeverity, number>;
    filesAnalyzed: number;
    totalFiles: number;
    linesOfCode: number;
    averageComplexity: number;
    technicalDebtMinutes: number;
}

// ============================================================================
// JSON-RPC Message Types
// ============================================================================

export interface JsonRpcRequest {
    jsonrpc: '2.0';
    id: string | number;
    method: string;
    params?: unknown;
}

export interface JsonRpcResponse {
    jsonrpc: '2.0';
    id: string | number;
    result?: unknown;
    error?: JsonRpcError;
}

export interface JsonRpcNotification {
    jsonrpc: '2.0';
    method: string;
    params?: unknown;
}

export interface JsonRpcError {
    code: number;
    message: string;
    data?: unknown;
}

// Standard JSON-RPC error codes
export const RpcErrorCodes = {
    PARSE_ERROR: -32700,
    INVALID_REQUEST: -32600,
    METHOD_NOT_FOUND: -32601,
    INVALID_PARAMS: -32602,
    INTERNAL_ERROR: -32603,
    // Custom error codes
    DAEMON_NOT_READY: -32000,
    ANALYSIS_FAILED: -32001,
    AI_SERVICE_UNAVAILABLE: -32002,
    FILE_NOT_FOUND: -32003,
    TIMEOUT: -32004,
} as const;

// ============================================================================
// RPC Method Definitions
// ============================================================================

// Daemon -> Extension Host notifications
export interface DaemonNotifications {
    'daemon/ready': { version: string };
    'daemon/fileDiscovery': { totalFiles: number; fileTypes: Record<string, number> };
    'daemon/analysisProgress': { filePath: string; progress: number; total: number };
    'daemon/analysisComplete': { filePath: string; issues: CodeIssue[] };
    'daemon/issuesUpdated': { issues: CodeIssue[] };
    'daemon/metricsUpdated': { metrics: CodeHealthMetrics };
    'daemon/error': { message: string; details?: unknown };
}

// Extension Host -> Daemon requests
export interface DaemonMethods {
    'initialize': {
        params: { workspacePath: string; config: DaemonConfig };
        result: { success: boolean; version: string };
    };
    'shutdown': {
        params: {};
        result: { success: boolean };
    };
    'analyzeFile': {
        params: { filePath: string; content?: string };
        result: { issues: CodeIssue[]; context: FileContext };
    };
    'analyzeWorkspace': {
        params: { force?: boolean };
        result: { totalFiles: number; analysisId: string };
    };
    'getSuggestions': {
        params: { issueId: string };
        result: { suggestions: CodeSuggestion[] };
    };
    'getSuggestionsForFile': {
        params: { filePath: string };
        result: { suggestions: CodeSuggestion[] };
    };
    'getMetrics': {
        params: {};
        result: { metrics: CodeHealthMetrics };
    };
    'getFileContext': {
        params: { filePath: string };
        result: { context: FileContext | null };
    };
    'getProjectContext': {
        params: {};
        result: { context: ProjectContext };
    };
    'getAllIssues': {
        params: {};
        result: { issues: CodeIssue[] };
    };
    'invalidateFile': {
        params: { filePath: string };
        result: { success: boolean };
    };
    'setConfig': {
        params: { config: Partial<DaemonConfig> };
        result: { success: boolean };
    };
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface DaemonConfig {
    aiProvider: 'openai' | 'anthropic' | 'gemini' | 'local';
    apiKey?: string;
    autoAnalyze: boolean;
    analysisDelay: number;
    excludePatterns: string[];
    maxFileSizeKB: number;
    enableTelemetry: boolean;
    maxConcurrentAnalysis: number;
    cacheEnabled: boolean;
    cacheTTLMinutes: number;
}

export const DEFAULT_CONFIG: DaemonConfig = {
    aiProvider: 'openai',
    autoAnalyze: true,
    analysisDelay: 2000,
    excludePatterns: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/.git/**',
    ],
    maxFileSizeKB: 500,
    enableTelemetry: false,
    maxConcurrentAnalysis: 3,
    cacheEnabled: true,
    cacheTTLMinutes: 30,
};

// ============================================================================
// Webview Message Types
// ============================================================================

export type WebviewToExtensionMessage =
    | { type: 'ready' }
    | { type: 'requestMetrics' }
    | { type: 'requestIssues'; filter?: IssueFilter }
    | { type: 'requestSuggestions'; issueId: string }
    | { type: 'applySuggestion'; suggestionId: string }
    | { type: 'dismissIssue'; issueId: string }
    | { type: 'openFile'; filePath: string; line?: number }
    | { type: 'analyzeWorkspace' }
    | { type: 'refreshDashboard' }
    | { type: 'openSettings' };

export type ExtensionToWebviewMessage =
    | { type: 'metricsUpdate'; metrics: CodeHealthMetrics }
    | { type: 'issuesUpdate'; issues: CodeIssue[] }
    | { type: 'suggestionsUpdate'; suggestions: CodeSuggestion[] }
    | { type: 'fileDiscovery'; totalFiles: number; fileTypes: Record<string, number> }
    | { type: 'analysisProgress'; progress: number; total: number; currentFile?: string }
    | { type: 'analysisComplete' }
    | { type: 'error'; message: string }
    | { type: 'suggestionApplied'; suggestionId: string; success: boolean }
    | { type: 'themeChanged'; isDark: boolean };

export interface IssueFilter {
    categories?: IssueCategory[];
    severities?: IssueSeverity[];
    filePath?: string;
    searchQuery?: string;
    sortBy?: 'severity' | 'confidence' | 'impact' | 'date';
    sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// Utility Types
// ============================================================================

export type MessageHandler<T> = (message: T) => void | Promise<void>;

export function isJsonRpcRequest(msg: unknown): msg is JsonRpcRequest {
    return (
        typeof msg === 'object' &&
        msg !== null &&
        'jsonrpc' in msg &&
        (msg as JsonRpcRequest).jsonrpc === '2.0' &&
        'method' in msg &&
        'id' in msg
    );
}

export function isJsonRpcResponse(msg: unknown): msg is JsonRpcResponse {
    return (
        typeof msg === 'object' &&
        msg !== null &&
        'jsonrpc' in msg &&
        (msg as JsonRpcResponse).jsonrpc === '2.0' &&
        'id' in msg &&
        ('result' in msg || 'error' in msg)
    );
}

export function isJsonRpcNotification(msg: unknown): msg is JsonRpcNotification {
    return (
        typeof msg === 'object' &&
        msg !== null &&
        'jsonrpc' in msg &&
        (msg as JsonRpcNotification).jsonrpc === '2.0' &&
        'method' in msg &&
        !('id' in msg)
    );
}

export function createRequest(id: string | number, method: string, params?: unknown): JsonRpcRequest {
    return { jsonrpc: '2.0', id, method, params };
}

export function createResponse(id: string | number, result: unknown): JsonRpcResponse {
    return { jsonrpc: '2.0', id, result };
}

export function createErrorResponse(id: string | number, error: JsonRpcError): JsonRpcResponse {
    return { jsonrpc: '2.0', id, error };
}

export function createNotification(method: string, params?: unknown): JsonRpcNotification {
    return { jsonrpc: '2.0', method, params };
}
