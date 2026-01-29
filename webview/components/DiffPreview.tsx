/**
 * DiffPreview Component
 */

import React, { useState } from 'react';
import { CodeIssue, CodeSuggestion } from '../types';
import { Lightbulb, Search, Eye, Check, Sparkles } from 'lucide-react';

interface DiffPreviewProps {
    issue: CodeIssue | null;
    suggestions: CodeSuggestion[];
    onApply: (suggestion: CodeSuggestion) => void;
    onOpenFile: (filePath: string, line?: number) => void;
    onSelectSuggestion: (suggestion: CodeSuggestion | null) => void;
    onGenerateAiFix: (issueId: string) => void;
    isGeneratingAiFix: boolean;
}

const DiffPreview: React.FC<DiffPreviewProps> = ({
    issue,
    suggestions,
    onApply,
    onOpenFile,
    onGenerateAiFix,
    isGeneratingAiFix,
}) => {
    const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
    const [isApplying, setIsApplying] = useState(false);

    const selectedSuggestion = suggestions[0] || null;

    if (!issue) {
        return (
            <div className="diff-preview empty-state">
                <div className="empty-icon"><Lightbulb size={48} /></div>
                <h3>No Issue Selected</h3>
                <p>Select an issue from the list to view suggested fixes.</p>
            </div>
        );
    }

    if (!selectedSuggestion) {
        return (
            <div className="diff-preview empty-state">
                <div className="empty-icon">{isGeneratingAiFix ? <Sparkles size={48} /> : <Search size={48} />}</div>
                <h3>{isGeneratingAiFix ? 'Generating AI Fix...' : 'No Suggestions Available'}</h3>
                <p>{isGeneratingAiFix ? 'AI is analyzing your code and generating a fix...' : 'Click the button below to generate an AI-powered fix for this issue.'}</p>
                {!isGeneratingAiFix && issue && (
                    <button 
                        className="action-button primary generate-fix-button"
                        onClick={() => onGenerateAiFix(issue.id)}
                    >
                        <Sparkles size={16} /> Generate AI Fix
                    </button>
                )}
            </div>
        );
    }

    const handleApply = () => {
        setIsApplying(true);
        onApply(selectedSuggestion);
        setTimeout(() => setIsApplying(false), 500);
    };

    return (
        <div className="diff-preview">
            <div className="diff-header">
                <h3>{issue.title}</h3>
                <div className="view-mode-toggle">
                    <button className={viewMode === 'split' ? 'active' : ''} onClick={() => setViewMode('split')}>Split</button>
                    <button className={viewMode === 'unified' ? 'active' : ''} onClick={() => setViewMode('unified')}>Unified</button>
                </div>
            </div>

            <div className="suggestion-info">
                <h4>{selectedSuggestion.title}</h4>
                <p>{selectedSuggestion.description}</p>
            </div>

            <div className={`diff-container ${viewMode}`}>
                {viewMode === 'split' ? (
                    <>
                        <div className="diff-pane original">
                            <div className="diff-pane-header"><span>Original</span></div>
                            <pre className="diff-code"><code>{selectedSuggestion.originalCode}</code></pre>
                        </div>
                        <div className="diff-pane suggested">
                            <div className="diff-pane-header"><span>Suggested</span></div>
                            <pre className="diff-code"><code>{selectedSuggestion.suggestedCode}</code></pre>
                        </div>
                    </>
                ) : (
                    <div className="diff-pane unified">
                        <div className="diff-pane-header"><span>Changes</span></div>
                        <pre className="diff-code"><code>{selectedSuggestion.diff}</code></pre>
                    </div>
                )}
            </div>

            <div className="diff-actions">
                <button className="action-button secondary" onClick={() => onOpenFile(selectedSuggestion.location.filePath, selectedSuggestion.location.range.start.line + 1)}>
                    <Eye size={14} /> Preview
                </button>
                {issue && (
                    <button 
                        className="action-button secondary" 
                        onClick={() => onGenerateAiFix(issue.id)}
                        disabled={isGeneratingAiFix}
                    >
                        {isGeneratingAiFix ? (
                            <>Regenerating...</>
                        ) : (
                            <><Sparkles size={14} /> Regenerate AI Fix</>
                        )}
                    </button>
                )}
                <button className="action-button primary" onClick={handleApply} disabled={isApplying}>
                    {isApplying ? (
                        <>Applying...</>
                    ) : (
                        <><Check size={14} /> Apply Fix</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DiffPreview;
