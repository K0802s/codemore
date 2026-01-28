/**
 * CodeMore Dashboard App
 * Main application component
 */

import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import IssueList from './components/IssueList';
import DiffPreview from './components/DiffPreview';
import {
    CodeIssue,
    CodeSuggestion,
    CodeHealthMetrics,
    WebviewToExtensionMessage,
    ExtensionToWebviewMessage,
} from './types';

// VS Code API interface
interface VSCodeAPI {
    postMessage: (message: WebviewToExtensionMessage) => void;
    getState: () => unknown;
    setState: (state: unknown) => void;
}

declare function acquireVsCodeApi(): VSCodeAPI;

// Get VS Code API
const vscode = acquireVsCodeApi();

type TabId = 'dashboard' | 'issues' | 'suggestions';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('dashboard');
    const [metrics, setMetrics] = useState<CodeHealthMetrics | null>(null);
    const [issues, setIssues] = useState<CodeIssue[]>([]);
    const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
    const [selectedIssue, setSelectedIssue] = useState<CodeIssue | null>(null);
    const [selectedSuggestion, setSelectedSuggestion] = useState<CodeSuggestion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [analysisProgress, setAnalysisProgress] = useState<{ progress: number; total: number; currentFile?: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(true);

    // Handle messages from extension
    const handleMessage = useCallback((event: MessageEvent<ExtensionToWebviewMessage>) => {
        const message = event.data;

        switch (message.type) {
            case 'metricsUpdate':
                setMetrics(message.metrics);
                setIsLoading(false);
                break;
            case 'issuesUpdate':
                setIssues(message.issues);
                break;
            case 'suggestionsUpdate':
                setSuggestions(message.suggestions);
                break;
            case 'analysisProgress':
                setAnalysisProgress({
                    progress: message.progress,
                    total: message.total,
                    currentFile: message.currentFile,
                });
                break;
            case 'analysisComplete':
                setAnalysisProgress(null);
                break;
            case 'error':
                setError(message.message);
                setTimeout(() => setError(null), 5000);
                break;
            case 'suggestionApplied':
                if (message.success) {
                    // Remove applied suggestion
                    setSuggestions((prev) => prev.filter((s) => s.id !== message.suggestionId));
                }
                break;
            case 'themeChanged':
                setIsDark(message.isDark);
                break;
        }
    }, []);

    // Setup message listener
    useEffect(() => {
        window.addEventListener('message', handleMessage);

        // Signal ready and request initial data
        vscode.postMessage({ type: 'ready' });

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [handleMessage]);

    // Handle issue selection
    const handleSelectIssue = (issue: CodeIssue) => {
        setSelectedIssue(issue);
        vscode.postMessage({ type: 'requestSuggestions', issueId: issue.id });
        setActiveTab('suggestions');
    };

    // Handle suggestion apply
    const handleApplySuggestion = (suggestion: CodeSuggestion) => {
        vscode.postMessage({ type: 'applySuggestion', suggestionId: suggestion.id });
    };

    // Handle file open
    const handleOpenFile = (filePath: string, line?: number) => {
        vscode.postMessage({ type: 'openFile', filePath, line });
    };

    // Handle analyze workspace
    const handleAnalyzeWorkspace = () => {
        vscode.postMessage({ type: 'analyzeWorkspace' });
    };

    // Handle refresh
    const handleRefresh = () => {
        setIsLoading(true);
        vscode.postMessage({ type: 'refreshDashboard' });
    };

    return (
        <div className={`app ${isDark ? 'dark' : 'light'}`}>
            {/* Header */}
            <header className="app-header">
                <h1 className="app-title">
                    <span className="app-icon">⚡</span>
                    CodeMore
                </h1>
                <div className="header-actions">
                    <button
                        className="icon-button"
                        onClick={handleRefresh}
                        title="Refresh"
                    >
                        🔄
                    </button>
                    <button
                        className="icon-button"
                        onClick={handleAnalyzeWorkspace}
                        title="Analyze Workspace"
                    >
                        🔍
                    </button>
                </div>
            </header>

            {/* Error banner */}
            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}

            {/* Progress bar */}
            {analysisProgress && (
                <div className="progress-bar-container">
                    <div className="progress-info">
                        <span>Analyzing: {analysisProgress.currentFile?.split(/[/\\]/).pop() || '...'}</span>
                        <span>{analysisProgress.progress} / {analysisProgress.total}</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${(analysisProgress.progress / analysisProgress.total) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Tab navigation */}
            <nav className="tab-nav">
                <button
                    className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    📊 Dashboard
                </button>
                <button
                    className={`tab-button ${activeTab === 'issues' ? 'active' : ''}`}
                    onClick={() => setActiveTab('issues')}
                >
                    🐛 Issues
                    {issues.length > 0 && (
                        <span className="badge">{issues.length}</span>
                    )}
                </button>
                <button
                    className={`tab-button ${activeTab === 'suggestions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('suggestions')}
                >
                    💡 Suggestions
                </button>
            </nav>

            {/* Main content */}
            <main className="app-content">
                {isLoading ? (
                    <div className="loading-state">
                        <div className="spinner" />
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'dashboard' && (
                            <Dashboard
                                metrics={metrics}
                                issues={issues}
                                onSelectIssue={handleSelectIssue}
                            />
                        )}

                        {activeTab === 'issues' && (
                            <IssueList
                                issues={issues}
                                selectedIssue={selectedIssue}
                                onSelectIssue={handleSelectIssue}
                                onOpenFile={handleOpenFile}
                            />
                        )}

                        {activeTab === 'suggestions' && (
                            <DiffPreview
                                issue={selectedIssue}
                                suggestions={suggestions}
                                onApply={handleApplySuggestion}
                                onOpenFile={handleOpenFile}
                                onSelectSuggestion={setSelectedSuggestion}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default App;
