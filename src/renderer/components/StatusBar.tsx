import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useRunner } from '../contexts/RunnerContext';
import { useAI } from '../contexts/AIContext';
import { useNotifications } from '../contexts/NotificationContext';
import '../styles/StatusBar.css';

interface StatusBarProps {
  onTogglePanel?: (panel: string) => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({ onTogglePanel }) => {
  const { currentWorkspace, isLoading: workspaceLoading } = useWorkspace();
  const { runStatus, buildStatus, errors } = useRunner();
  const { isProcessing, currentModel } = useAI();
  const { notifications } = useNotifications();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('connected');
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  const electronAPI = (window as any).electronAPI;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Monitor system resources
    const checkResources = async () => {
      if (electronAPI?.system) {
        try {
          const usage = await electronAPI.system.getMemoryUsage();
          setMemoryUsage(usage.percent);
        } catch (error) {
          console.error('Failed to get memory usage:', error);
        }
      }
    };

    const resourceTimer = setInterval(checkResources, 5000);
    checkResources();

    return () => clearInterval(resourceTimer);
  }, [electronAPI]);

  useEffect(() => {
    // Check connection status periodically
    const checkConnection = async () => {
      try {
        if (electronAPI?.health?.check) {
          const status = await electronAPI.health.check();
          setConnectionStatus(status ? 'connected' : 'disconnected');
        }
      } catch (error) {
        setConnectionStatus('error');
      }
    };

    const connectionTimer = setInterval(checkConnection, 10000);
    checkConnection();

    return () => clearInterval(connectionTimer);
  }, [electronAPI]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return '🟢';
      case 'stopped':
        return '🔴';
      case 'error':
        return '🟡';
      case 'building':
        return '🔨';
      default:
        return '⚫';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return '🟢';
      case 'disconnected':
        return '🔴';
      case 'error':
        return '🟡';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMemory = (percent: number) => {
    return `${Math.round(percent)}%`;
  };

  const getErrorCount = () => {
    return errors.filter(e => e.severity === 'error').length;
  };

  const getWarningCount = () => {
    return errors.filter(e => e.severity === 'warning').length;
  };

  const getUnreadNotificationCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const handleStatusClick = (section: string) => {
    switch (section) {
      case 'errors':
        onTogglePanel?.('problems');
        break;
      case 'notifications':
        onTogglePanel?.('notifications');
        break;
      case 'terminal':
        onTogglePanel?.('terminal');
        break;
      case 'output':
        onTogglePanel?.('output');
        break;
      default:
        break;
    }
  };

  return (
    <div className="status-bar">
      <div className="status-left">
        {/* Workspace Status */}
        <div className="status-item workspace-status">
          {workspaceLoading ? (
            <>
              <span className="status-icon">⏳</span>
              <span className="status-text">Loading...</span>
            </>
          ) : currentWorkspace ? (
            <>
              <span className="status-icon">📁</span>
              <span className="status-text">{currentWorkspace.name}</span>
            </>
          ) : (
            <>
              <span className="status-icon">📂</span>
              <span className="status-text">No Workspace</span>
            </>
          )}
        </div>

        {/* Git Branch (placeholder) */}
        <div className="status-item git-status">
          <span className="status-icon">🌿</span>
          <span className="status-text">main</span>
        </div>

        {/* Errors and Warnings */}
        <div
          className="status-item clickable problems-status"
          onClick={() => handleStatusClick('errors')}
          title="Problems"
        >
          <span className="status-icon">🚨</span>
          <span className="status-text">
            {getErrorCount()} errors, {getWarningCount()} warnings
          </span>
        </div>
      </div>

      <div className="status-center">
        {/* Build/Run Status */}
        <div className="status-item build-status">
          <span className="status-icon">{getStatusIcon(buildStatus)}</span>
          <span className="status-text">
            {buildStatus === 'building' && 'Building...'}
            {buildStatus === 'success' && 'Build Ready'}
            {buildStatus === 'error' && 'Build Failed'}
            {buildStatus === 'idle' && 'Ready'}
          </span>
        </div>

        <div className="status-separator">|</div>

        <div
          className="status-item clickable run-status"
          onClick={() => handleStatusClick('terminal')}
          title="Runtime Status"
        >
          <span className="status-icon">{getStatusIcon(runStatus)}</span>
          <span className="status-text">
            {runStatus === 'running' && 'Running'}
            {runStatus === 'stopped' && 'Stopped'}
            {runStatus === 'error' && 'Error'}
          </span>
        </div>

        {/* AI Status */}
        {isProcessing && (
          <>
            <div className="status-separator">|</div>
            <div className="status-item ai-status">
              <span className="status-icon">🤖</span>
              <span className="status-text processing">AI Thinking...</span>
            </div>
          </>
        )}
      </div>

      <div className="status-right">
        {/* Cursor Position */}
        <div className="status-item cursor-position">
          <span className="status-text">
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
        </div>

        <div className="status-separator">|</div>

        {/* AI Model */}
        <div className="status-item ai-model">
          <span className="status-icon">🧠</span>
          <span className="status-text">{currentModel}</span>
        </div>

        <div className="status-separator">|</div>

        {/* Notifications */}
        <div
          className="status-item clickable notifications-status"
          onClick={() => handleStatusClick('notifications')}
          title="Notifications"
        >
          <span className="status-icon">🔔</span>
          {getUnreadNotificationCount() > 0 && (
            <span className="notification-badge">{getUnreadNotificationCount()}</span>
          )}
        </div>

        {/* Connection Status */}
        <div className="status-item connection-status" title="Connection Status">
          <span className="status-icon">{getConnectionIcon()}</span>
        </div>

        {/* Memory Usage */}
        <div className="status-item memory-usage" title="Memory Usage">
          <span className="status-icon">💾</span>
          <span className="status-text">{formatMemory(memoryUsage)}</span>
        </div>

        <div className="status-separator">|</div>

        {/* Current Time */}
        <div className="status-item time-display">
          <span className="status-icon">🕒</span>
          <span className="status-text">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
};
