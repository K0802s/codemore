/**
 * Dashboard Component
 * 
 * Displays code health metrics and summary visualizations
 */

import React from 'react';
import { CodeHealthMetrics, CodeIssue, IssueSeverity, IssueCategory } from '../types';

interface DashboardProps {
    metrics: CodeHealthMetrics | null;
    issues: CodeIssue[];
    onSelectIssue: (issue: CodeIssue) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, issues, onSelectIssue }) => {
    if (!metrics) {
        return (
            <div className="dashboard empty-state">
                <p>No metrics available. Run an analysis to see code health data.</p>
            </div>
        );
    }

    const getSeverityColor = (severity: IssueSeverity): string => {
        switch (severity) {
            case 'error': return 'var(--color-error)';
            case 'warning': return 'var(--color-warning)';
            case 'info': return 'var(--color-info)';
            case 'hint': return 'var(--color-hint)';
        }
    };

    const getCategoryIconClass = (category: IssueCategory): string => {
        switch (category) {
            case 'bug': return 'bug';
            case 'code-smell': return 'warning';
            case 'performance': return 'dashboard';
            case 'security': return 'shield';
            case 'maintainability': return 'tools';
            case 'accessibility': return 'accessibility';
            case 'best-practice': return 'star';
        }
    };

    const getScoreColor = (score: number): string => {
        if (score >= 80) return 'var(--color-success)';
        if (score >= 60) return 'var(--color-warning)';
        return 'var(--color-error)';
    };

    const formatDebt = (minutes: number): string => {
        if (minutes < 60) return `${minutes}m`;
        if (minutes < 480) return `${Math.round(minutes / 60)}h`;
        return `${Math.round(minutes / 480)}d`;
    };

    // Get top issues
    const topIssues = issues
        .sort((a, b) => {
            const severityOrder = { error: 0, warning: 1, info: 2, hint: 3 };
            return severityOrder[a.severity] - severityOrder[b.severity];
        })
        .slice(0, 5);

    return (
        <div className="dashboard">
            {/* Health Score */}
            <div className="score-card">
                <div className="score-circle" style={{ borderColor: getScoreColor(metrics.overallScore) }}>
                    <span className="score-value">{Math.round(metrics.overallScore)}</span>
                    <span className="score-label">Health Score</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="codicon codicon-file stat-icon"></span>
                    <div className="stat-content">
                        <span className="stat-value">{metrics.filesAnalyzed}</span>
                        <span className="stat-label">Files Analyzed</span>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="codicon codicon-symbol-text stat-icon"></span>
                    <div className="stat-content">
                        <span className="stat-value">{metrics.linesOfCode.toLocaleString()}</span>
                        <span className="stat-label">Lines of Code</span>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="codicon codicon-watch stat-icon"></span>
                    <div className="stat-content">
                        <span className="stat-value">{formatDebt(metrics.technicalDebtMinutes)}</span>
                        <span className="stat-label">Tech Debt</span>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="codicon codicon-graph stat-icon"></span>
                    <div className="stat-content">
                        <span className="stat-value">{metrics.averageComplexity.toFixed(1)}</span>
                        <span className="stat-label">Avg Complexity</span>
                    </div>
                </div>
            </div>

            {/* Issues by Severity */}
            <div className="section">
                <h3 className="section-title">Issues by Severity</h3>
                <div className="severity-bars">
                    {(Object.entries(metrics.issuesBySeverity) as [IssueSeverity, number][]).map(
                        ([severity, count]) => (
                            <div key={severity} className="severity-bar-item">
                                <div className="severity-bar-label">
                                    <span className="severity-dot" style={{ backgroundColor: getSeverityColor(severity) }} />
                                    <span className="severity-name">{severity}</span>
                                    <span className="severity-count">{count}</span>
                                </div>
                                <div className="severity-bar-track">
                                    <div
                                        className="severity-bar-fill"
                                        style={{
                                            width: `${Math.min(100, (count / Math.max(1, issues.length)) * 100)}%`,
                                            backgroundColor: getSeverityColor(severity),
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Issues by Category */}
            <div className="section">
                <h3 className="section-title">Issues by Category</h3>
                <div className="category-grid">
                    {(Object.entries(metrics.issuesByCategory) as [IssueCategory, number][])
                        .filter(([, count]) => count > 0)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, count]) => (
                            <div key={category} className="category-card">
                                <span className={`codicon codicon-${getCategoryIconClass(category)} category-icon`}></span>
                                <span className="category-count">{count}</span>
                                <span className="category-name">{category.replace('-', ' ')}</span>
                            </div>
                        ))}
                </div>
            </div>

            {/* Top Issues */}
            {topIssues.length > 0 && (
                <div className="section">
                    <h3 className="section-title">Top Issues</h3>
                    <div className="top-issues-list">
                        {topIssues.map((issue) => (
                            <button
                                key={issue.id}
                                className="top-issue-item"
                                onClick={() => onSelectIssue(issue)}
                            >
                                <span
                                    className="issue-severity-badge"
                                    style={{ backgroundColor: getSeverityColor(issue.severity) }}
                                >
                                    {issue.severity}
                                </span>
                                <span className="issue-title">{issue.title}</span>
                                <span className="issue-file">
                                    {issue.location.filePath.split(/[/\\]/).pop()}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
