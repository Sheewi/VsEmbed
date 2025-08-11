import React, { useState } from 'react';
import './SourceControlPanel.css';

interface ChangeItem {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked';
  staged: boolean;
}

export const SourceControlPanel: React.FC = () => {
  const [message, setMessage] = useState('');
  const [changes] = useState<ChangeItem[]>([
    { path: 'src/components/App.tsx', status: 'modified', staged: false },
    { path: 'src/styles/main.css', status: 'modified', staged: true },
    { path: 'README.md', status: 'added', staged: false },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'modified': return 'M';
      case 'added': return 'A';
      case 'deleted': return 'D';
      case 'untracked': return 'U';
      default: return '?';
    }
  };

  const stagedChanges = changes.filter(c => c.staged);
  const unstagedChanges = changes.filter(c => !c.staged);

  return (
    <div className="source-control-panel">
      <div className="commit-section">
        <textarea
          className="commit-message"
          placeholder="Message (press Ctrl+Enter to commit)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
        <div className="commit-actions">
          <button className="commit-button" disabled={!message.trim() || stagedChanges.length === 0}>
            <svg viewBox="0 0 16 16" width="16" height="16">
              <path fill="currentColor" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V9H5V7h2V5h2v2h2v2H9v2z"/>
            </svg>
            Commit
          </button>
          <button className="more-actions">
            <svg viewBox="0 0 16 16" width="16" height="16">
              <path fill="currentColor" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
          </button>
        </div>
      </div>

      {stagedChanges.length > 0 && (
        <div className="changes-section">
          <div className="section-header">
            <span>Staged Changes ({stagedChanges.length})</span>
            <button className="unstage-all" title="Unstage All Changes">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M8.5 1.5A6.5 6.5 0 0 0 2 8a.5.5 0 0 0 1 0 5.5 5.5 0 1 1 5.5 5.5.5.5 0 0 0 0 1A6.5 6.5 0 0 0 8.5 1.5z"/>
              </svg>
            </button>
          </div>
          <div className="changes-list">
            {stagedChanges.map((change, index) => (
              <div key={index} className="change-item staged">
                <span className={`status-badge ${change.status}`}>
                  {getStatusIcon(change.status)}
                </span>
                <span className="file-path">{change.path}</span>
                <button className="unstage-file" title="Unstage Changes">
                  <svg viewBox="0 0 16 16" width="12" height="12">
                    <path fill="currentColor" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM4.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {unstagedChanges.length > 0 && (
        <div className="changes-section">
          <div className="section-header">
            <span>Changes ({unstagedChanges.length})</span>
            <button className="stage-all" title="Stage All Changes">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.5 6.5h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0v3h3a.5.5 0 0 1 0 1z"/>
              </svg>
            </button>
          </div>
          <div className="changes-list">
            {unstagedChanges.map((change, index) => (
              <div key={index} className="change-item">
                <span className={`status-badge ${change.status}`}>
                  {getStatusIcon(change.status)}
                </span>
                <span className="file-path">{change.path}</span>
                <button className="stage-file" title="Stage Changes">
                  <svg viewBox="0 0 16 16" width="12" height="12">
                    <path fill="currentColor" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.5 6.5h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0v3h3a.5.5 0 0 1 0 1z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {changes.length === 0 && (
        <div className="no-changes">
          <svg viewBox="0 0 16 16" width="48" height="48">
            <path fill="currentColor" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM4.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>
          </svg>
          <p>No changes detected</p>
        </div>
      )}
    </div>
  );
};
