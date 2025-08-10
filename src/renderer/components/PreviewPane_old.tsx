import React, { useState, useEffect, useRef } from 'react';
import { useRunner } from '../contexts/RunnerContext';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useNotifications } from '../contexts/NotificationContext';
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
  const workspace = useWorkspace();
  const { addNotification } = useNotifications();

  const [currentMode, setCurrentMode] = useState<PreviewMode>({
    id: 'web',
    name: 'Web Preview',
    icon: '🌐',
    url: runnerStatus.preview_url || '',
    refreshable: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [devTools, setDevTools] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const electronAPI = (window as any).electronAPI;

  const previewModes: PreviewMode[] = [
    {
      id: 'web',
      name: 'Web Preview',
      icon: '🌐',
      url: previewUrl || 'http://localhost:3000',
      refreshable: true,
    },
    {
      id: 'mobile',
      name: 'Mobile View',
      icon: '📱',
      url: previewUrl || 'http://localhost:3000',
      refreshable: true,
    },
    {
      id: 'desktop',
      name: 'Desktop View',
      icon: '🖥️',
      url: previewUrl || 'http://localhost:3000',
      refreshable: true,
    },
    {
      id: 'docs',
      name: 'Documentation',
      icon: '📚',
      url: 'http://localhost:8080/docs',
      refreshable: true,
    },
  ];

  useEffect(() => {
    if (previewUrl && previewUrl !== currentMode.url) {
      setCurrentMode(prev => ({ ...prev, url: previewUrl }));
    }
  }, [previewUrl, currentMode.url]);

  useEffect(() => {
    // Auto-refresh when project starts running
    if (runStatus === 'running' && currentMode.refreshable) {
      setTimeout(() => {
        handleRefresh();
      }, 2000); // Give the server time to start
    }
  }, [runStatus, currentMode.refreshable]);

  const handleRefresh = () => {
    if (!iframeRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      iframeRef.current.src = iframeRef.current.src;
    } catch (err) {
      setError('Failed to refresh preview');
      setIsLoading(false);
    }
  };

  const handleModeChange = (mode: PreviewMode) => {
    setCurrentMode(mode);
    setError(null);
    setIsLoading(true);
  };

  const handleCustomUrl = () => {
    if (!customUrl.trim()) return;

    let url = customUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }

    setCurrentMode({
      id: 'custom',
      name: 'Custom URL',
      icon: '🔗',
      url,
      refreshable: true,
    });

    setShowUrlInput(false);
    setCustomUrl('');
    setError(null);
    setIsLoading(true);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load preview. Make sure the server is running.');
  };

  const handleOpenExternal = () => {
    if (electronAPI?.shell) {
      electronAPI.shell.openExternal(currentMode.url);
    } else {
      window.open(currentMode.url, '_blank');
    }
  };

  const handleDevTools = () => {
    if (iframeRef.current && electronAPI?.webContents) {
      setDevTools(!devTools);
      // In a real implementation, this would open dev tools for the iframe
      addNotification({
        type: 'info',
        title: 'Developer Tools',
        message: devTools ? 'Developer tools closed' : 'Developer tools opened',
      });
    }
  };

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    let newZoom = zoomLevel;

    switch (direction) {
      case 'in':
        newZoom = Math.min(200, zoomLevel + 10);
        break;
      case 'out':
        newZoom = Math.max(50, zoomLevel - 10);
        break;
      case 'reset':
        newZoom = 100;
        break;
    }

    setZoomLevel(newZoom);

    if (iframeRef.current) {
      iframeRef.current.style.transform = `scale(${newZoom / 100})`;
      iframeRef.current.style.transformOrigin = 'top left';
    }
  };

  const getContainerClass = () => {
    switch (currentMode.id) {
      case 'mobile':
        return 'preview-container mobile';
      case 'desktop':
        return 'preview-container desktop';
      default:
        return 'preview-container';
    }
  };

  return (
    <div className="preview-pane">
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
            <div className="url-display">
              <span className="url-text">{currentMode.url}</span>
              <button
                className="url-edit-btn"
                onClick={() => setShowUrlInput(true)}
                title="Edit URL"
              >
                ✏️
              </button>
            </div>

            {showUrlInput && (
              <div className="url-input-container">
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomUrl();
                    } else if (e.key === 'Escape') {
                      setShowUrlInput(false);
                      setCustomUrl('');
                    }
                  }}
                  placeholder="http://localhost:3000"
                  autoFocus
                />
                <button onClick={handleCustomUrl} disabled={!customUrl.trim()}>
                  Go
                </button>
                <button onClick={() => { setShowUrlInput(false); setCustomUrl(''); }}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="action-controls">
            <button
              className="control-btn"
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh (F5)"
            >
              {isLoading ? '⏳' : '🔄'}
            </button>

            <button
              className="control-btn"
              onClick={handleOpenExternal}
              title="Open in External Browser"
            >
              🚀
            </button>

            <div className="zoom-controls">
              <button
                className="control-btn"
                onClick={() => handleZoom('out')}
                disabled={zoomLevel <= 50}
                title="Zoom Out"
              >
                🔍➖
              </button>
              <span className="zoom-level">{zoomLevel}%</span>
              <button
                className="control-btn"
                onClick={() => handleZoom('in')}
                disabled={zoomLevel >= 200}
                title="Zoom In"
              >
                🔍➕
              </button>
              <button
                className="control-btn"
                onClick={() => handleZoom('reset')}
                title="Reset Zoom"
              >
                🎯
              </button>
            </div>

            <button
              className={`control-btn ${devTools ? 'active' : ''}`}
              onClick={handleDevTools}
              title="Toggle Developer Tools"
            >
              🛠️
            </button>
          </div>
        </div>
      </div>

      <div className={getContainerClass()}>
        {error ? (
          <div className="preview-error">
            <div className="error-content">
              <h3>🚫 Preview Error</h3>
              <p>{error}</p>
              <div className="error-suggestions">
                <h4>Troubleshooting:</h4>
                <ul>
                  <li>Make sure your development server is running</li>
                  <li>Check if the URL is correct: <code>{currentMode.url}</code></li>
                  <li>Try starting your project with the Run button</li>
                  <li>Check the terminal for any error messages</li>
                </ul>
              </div>
              <div className="error-actions">
                <button onClick={handleRefresh} className="retry-btn">
                  🔄 Retry
                </button>
                <button
                  onClick={() => setShowUrlInput(true)}
                  className="change-url-btn"
                >
                  🔗 Change URL
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="preview-loading">
                <div className="loading-spinner"></div>
                <p>Loading preview...</p>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={currentMode.url}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              className="preview-iframe"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top left',
                width: `${10000 / zoomLevel}%`,
                height: `${10000 / zoomLevel}%`,
              }}
            />
          </>
        )}
      </div>

      <div className="preview-status">
        <div className="status-left">
          <span className={`connection-status ${runStatus}`}>
            {runStatus === 'running' && '🟢 Server Running'}
            {runStatus === 'stopped' && '🔴 Server Stopped'}
            {runStatus === 'error' && '🟡 Server Error'}
          </span>
        </div>

        <div className="status-right">
          <span className="preview-info">
            {currentMode.name} • {currentMode.url}
          </span>
        </div>
      </div>
    </div>
  );
};
