import React, { useState, useEffect, useRef } from 'react';
import { useRunner } from '../contexts/RunnerContext';
import '../styles/PreviewPane.css';

interface PreviewMode {
  id: string;
  name: string;
  icon: string;
  url: string;
  refreshable: boolean;
}

export const PreviewPane: React.FC = () => {
  const { status: runnerStatus } = useRunner();

  const [currentMode, setCurrentMode] = useState<PreviewMode>({
    id: 'web',
    name: 'Web Preview',
    icon: '🌐',
    url: '',
    refreshable: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewModes: PreviewMode[] = [
    {
      id: 'web',
      name: 'Web Preview',
      icon: '🌐',
      url: runnerStatus.preview_url || '',
      refreshable: true,
    },
    {
      id: 'mobile',
      name: 'Mobile Preview',
      icon: '📱',
      url: runnerStatus.preview_url || '',
      refreshable: true,
    },
    {
      id: 'desktop',
      name: 'Desktop Preview',
      icon: '💻',
      url: runnerStatus.preview_url || '',
      refreshable: true,
    },
  ];

  useEffect(() => {
    // Update current mode URL when runner status changes
    if (runnerStatus.preview_url) {
      setCurrentMode(prev => ({
        ...prev,
        url: runnerStatus.preview_url || '',
      }));
      setError(null);
    }
  }, [runnerStatus.preview_url]);

  const handleModeChange = (mode: PreviewMode) => {
    setCurrentMode(mode);
    setError(null);
  };

  const handleRefresh = () => {
    if (iframeRef.current && currentMode.url) {
      setIsLoading(true);
      setError(null);
      iframeRef.current.src = currentMode.url;
    }
  };

  const handleCustomUrl = () => {
    if (customUrl.trim()) {
      setCurrentMode(prev => ({
        ...prev,
        url: customUrl.trim(),
      }));
      setShowUrlInput(false);
      setCustomUrl('');
      setError(null);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load preview. Make sure the application is running.');
  };

  return (
    <div className="preview-pane">
      {/* Preview Header */}
      <div className="preview-header">
        <div className="preview-modes">
          {previewModes.map(mode => (
            <button
              key={mode.id}
              className={`mode-btn ${currentMode.id === mode.id ? 'active' : ''}`}
              onClick={() => handleModeChange(mode)}
              title={mode.name}
            >
              <span className="mode-icon">{mode.icon}</span>
              <span className="mode-name">{mode.name}</span>
            </button>
          ))}
        </div>

        <div className="preview-controls">
          <div className="url-controls">
            {showUrlInput ? (
              <div className="url-input-container">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomUrl()}
                  placeholder="Enter URL..."
                  className="url-input"
                  autoFocus
                />
                <button onClick={handleCustomUrl} className="url-btn">
                  ✓
                </button>
                <button onClick={() => setShowUrlInput(false)} className="url-btn">
                  ✗
                </button>
              </div>
            ) : (
              <div className="url-display">
                <span className="current-url">
                  {currentMode.url || 'No URL set'}
                </span>
                <button
                  onClick={() => setShowUrlInput(true)}
                  className="control-btn"
                  title="Set Custom URL"
                >
                  🔗
                </button>
              </div>
            )}
          </div>

          <div className="action-controls">
            <button
              onClick={handleRefresh}
              disabled={!currentMode.url || isLoading}
              className="control-btn"
              title="Refresh Preview"
            >
              🔄
            </button>

            <button
              onClick={() => window.open(currentMode.url, '_blank')}
              disabled={!currentMode.url}
              className="control-btn"
              title="Open in Browser"
            >
              🔗
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="preview-content">
        {error ? (
          <div className="preview-error">
            <div className="error-icon">⚠️</div>
            <div className="error-message">{error}</div>
            <button onClick={handleRefresh} className="retry-btn">
              Retry
            </button>
          </div>
        ) : !currentMode.url ? (
          <div className="preview-placeholder">
            <div className="placeholder-icon">🌐</div>
            <div className="placeholder-message">
              <h3>No Preview Available</h3>
              <p>Start your application to see the preview</p>
              <p>Or set a custom URL using the link button above</p>
            </div>
          </div>
        ) : (
          <div className="preview-frame-container">
            {isLoading && (
              <div className="preview-loading">
                <div className="loading-spinner"></div>
                <div className="loading-text">Loading preview...</div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={currentMode.url}
              className={`preview-frame ${currentMode.id}`}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title="Application Preview"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        )}
      </div>

      {/* Preview Footer */}
      <div className="preview-footer">
        <div className="preview-info">
          <span className="info-item">
            <span className="info-label">Mode:</span>
            <span className="info-value">{currentMode.name}</span>
          </span>
          {currentMode.url && (
            <span className="info-item">
              <span className="info-label">URL:</span>
              <span className="info-value">{currentMode.url}</span>
            </span>
          )}
        </div>

        <div className="preview-status">
          {runnerStatus.running ? (
            <span className="status-indicator running">🟢 App Running</span>
          ) : (
            <span className="status-indicator stopped">🔴 App Stopped</span>
          )}
        </div>
      </div>
    </div>
  );
};
