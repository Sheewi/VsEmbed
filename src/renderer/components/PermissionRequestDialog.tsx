import React, { useState, useEffect } from 'react';
import { PermissionRequest } from '../../permissions/manager';
import './PermissionRequestDialog.css';

interface PermissionRequestDialogProps {
  request: PermissionRequest;
  onResponse: (granted: boolean, remember: boolean) => void;
  onClose: () => void;
}

export const PermissionRequestDialog: React.FC<PermissionRequestDialogProps> = ({
  request,
  onResponse,
  onClose
}) => {
  const [remember, setRemember] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 second timeout

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-deny after timeout
          onResponse(false, remember);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onResponse, onClose, remember]);

  const handleResponse = (granted: boolean) => {
    onResponse(granted, remember);
    onClose();
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '❓';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#2196f3';
    }
  };

  const getExtensionInfo = (extensionId: string) => {
    const extensionMap: Record<string, { name: string; description: string }> = {
      'prettier': {
        name: 'Prettier',
        description: 'Code formatter for multiple languages'
      },
      'eslint': {
        name: 'ESLint',
        description: 'JavaScript and TypeScript linter'
      },
      'docker': {
        name: 'Docker',
        description: 'Container management and deployment'
      },
      'python': {
        name: 'Python',
        description: 'Python language support and tools'
      },
      'kali-tools': {
        name: 'Kali Security Tools',
        description: 'Network security and penetration testing tools'
      }
    };

    return extensionMap[extensionId] || {
      name: extensionId,
      description: 'Third-party extension'
    };
  };

  const extInfo = getExtensionInfo(request.extensionId);

  return (
    <div className="permission-request-overlay">
      <div className="permission-request-dialog">
        <div className="permission-header">
          <div className="permission-icon" style={{ color: getRiskColor(request.riskLevel) }}>
            {getRiskIcon(request.riskLevel)}
          </div>
          <div className="permission-title">
            <h3>Permission Request</h3>
            <div className="timeout-indicator">
              Auto-deny in {timeLeft}s
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="permission-content">
          <div className="extension-info">
            <div className="extension-name">{extInfo.name}</div>
            <div className="extension-id">{request.extensionId}</div>
            <div className="extension-description">{extInfo.description}</div>
          </div>

          <div className="request-details">
            <div className="detail-row">
              <span className="label">Command:</span>
              <code className="command">{request.command}</code>
            </div>

            <div className="detail-row">
              <span className="label">Purpose:</span>
              <span className="purpose">{request.purpose}</span>
            </div>

            <div className="detail-row">
              <span className="label">Risk Level:</span>
              <span
                className={`risk-badge ${request.riskLevel}`}
                style={{ backgroundColor: getRiskColor(request.riskLevel) }}
              >
                {request.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>

          {request.riskLevel === 'high' && (
            <div className="warning-box">
              <div className="warning-icon">⚠️</div>
              <div className="warning-text">
                <strong>High Risk Operation</strong>
                <p>This operation could potentially modify your system, access sensitive data, or perform actions outside the current workspace. Only approve if you trust this extension and understand the implications.</p>
              </div>
            </div>
          )}

          {request.riskLevel === 'medium' && (
            <div className="caution-box">
              <div className="caution-icon">⚡</div>
              <div className="caution-text">
                <strong>Medium Risk Operation</strong>
                <p>This operation will access system resources or perform actions that could affect your development environment. Review the purpose before approving.</p>
              </div>
            </div>
          )}

          <div className="permission-options">
            <label className="remember-option">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="checkmark"></span>
              Remember this decision for future requests from this extension
            </label>
          </div>
        </div>

        <div className="permission-actions">
          <button
            className="deny-btn"
            onClick={() => handleResponse(false)}
          >
            Deny
          </button>
          <button
            className="allow-btn"
            onClick={() => handleResponse(true)}
          >
            Allow
          </button>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(timeLeft / 30) * 100}%`,
              backgroundColor: getRiskColor(request.riskLevel)
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Permission Request Manager Component
interface PermissionManagerProps {
  children: React.ReactNode;
}

export const PermissionRequestManager: React.FC<PermissionManagerProps> = ({ children }) => {
  const [currentRequest, setCurrentRequest] = useState<{
    request: PermissionRequest;
    onResponse: (granted: boolean, remember: boolean) => void;
  } | null>(null);

  useEffect(() => {
    const handlePermissionRequest = (event: CustomEvent) => {
      const { request, onResponse } = event.detail;
      setCurrentRequest({ request, onResponse });
    };

    window.addEventListener('permissionRequest', handlePermissionRequest as EventListener);

    return () => {
      window.removeEventListener('permissionRequest', handlePermissionRequest as EventListener);
    };
  }, []);

  const handleClose = () => {
    if (currentRequest) {
      // Auto-deny if user closes without responding
      currentRequest.onResponse(false, false);
      setCurrentRequest(null);
    }
  };

  const handleResponse = (granted: boolean, remember: boolean) => {
    if (currentRequest) {
      currentRequest.onResponse(granted, remember);
      setCurrentRequest(null);
    }
  };

  return (
    <>
      {children}
      {currentRequest && (
        <PermissionRequestDialog
          request={currentRequest.request}
          onResponse={handleResponse}
          onClose={handleClose}
        />
      )}
    </>
  );
};
