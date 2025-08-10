import React, { useState, useEffect } from 'react';
import { ModelConfig } from '../../ai/config';
import { ExtensionRecommendation } from '../../extensions/recommender';
import { PermissionRequest } from '../../permissions/manager';
import './ModelSettings.css';

interface ModelSettingsProps {
  onClose: () => void;
}

export const ModelSettings: React.FC<ModelSettingsProps> = ({ onClose }) => {
  const [config, setConfig] = useState<ModelConfig>({
    provider: 'openai',
    model: 'gpt-4-1106-preview',
    temperature: 0.7,
    maxTokens: 4096,
    tools: {
      kali: false,
      gcp: true,
      docker: true,
      vscode: {
        fileAccess: true,
        terminal: false,
        extensions: true,
        debugger: false
      }
    },
    permissions: {
      dangerousOperations: false,
      networkAccess: true,
      fileSystemWrite: false
    }
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'model' | 'tools' | 'permissions' | 'extensions'>('model');
  const [recommendations, setRecommendations] = useState<ExtensionRecommendation[]>([]);
  const [auditLog, setAuditLog] = useState<PermissionRequest[]>([]);

  useEffect(() => {
    loadConfiguration();
    loadRecommendations();
    loadAuditLog();
  }, []);

  const loadConfiguration = async () => {
    try {
      // In a real implementation, this would load from the configuration manager
      const savedConfig = localStorage.getItem('ai-model-config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Failed to load configuration:', error);
    }
  };

  const loadRecommendations = async () => {
    // Simulate loading extension recommendations
    setRecommendations([
      {
        extensionId: 'esbenp.prettier-vscode',
        reason: 'Code formatting for JavaScript/TypeScript files',
        urgency: 'high',
        category: 'formatting'
      },
      {
        extensionId: 'ms-python.python',
        reason: 'Python language support detected',
        urgency: 'high',
        category: 'language'
      },
      {
        extensionId: 'ms-azuretools.vscode-docker',
        reason: 'Docker configuration found in workspace',
        urgency: 'medium',
        category: 'containerization'
      }
    ]);
  };

  const loadAuditLog = async () => {
    // Simulate loading permission audit log
    setAuditLog([
      {
        id: '1',
        extensionId: 'prettier',
        command: 'format',
        purpose: 'Format code automatically',
        riskLevel: 'low',
        timestamp: Date.now() - 60000,
        approved: true
      },
      {
        id: '2',
        extensionId: 'docker',
        command: 'build',
        purpose: 'Build container image',
        riskLevel: 'medium',
        timestamp: Date.now() - 120000,
        approved: false
      }
    ]);
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors([]);

    try {
      // Validate configuration
      const validationErrors = validateConfig(config);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setSaving(false);
        return;
      }

      // Save configuration
      localStorage.setItem('ai-model-config', JSON.stringify(config));

      // Notify parent components
      window.dispatchEvent(new CustomEvent('configurationUpdated', {
        detail: config
      }));

      setTimeout(() => {
        setSaving(false);
        onClose();
      }, 1000);

    } catch (error) {
      setErrors(['Failed to save configuration']);
      setSaving(false);
    }
  };

  const validateConfig = (config: ModelConfig): string[] => {
    const errors: string[] = [];

    if (!config.apiKey && config.provider !== 'local') {
      errors.push(`API key required for ${config.provider}`);
    }

    if (config.temperature < 0 || config.temperature > 2) {
      errors.push('Temperature must be between 0 and 2');
    }

    if (config.maxTokens < 1 || config.maxTokens > 8192) {
      errors.push('Max tokens must be between 1 and 8192');
    }

    return errors;
  };

  const handleInstallExtension = async (extensionId: string) => {
    try {
      // In a real implementation, this would trigger extension installation
      console.log(`Installing extension: ${extensionId}`);

      // Remove from recommendations after "installation"
      setRecommendations(prev => prev.filter(rec => rec.extensionId !== extensionId));

    } catch (error) {
      console.error(`Failed to install extension ${extensionId}:`, error);
    }
  };

  const renderModelTab = () => (
    <div className="settings-tab">
      <div className="form-group">
        <label htmlFor="provider">Model Provider</label>
        <select
          id="provider"
          value={config.provider}
          onChange={(e) => setConfig({
            ...config,
            provider: e.target.value as ModelConfig['provider']
          })}
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="azure">Azure OpenAI</option>
          <option value="local">Local Model</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="model">Model</label>
        <input
          id="model"
          type="text"
          value={config.model}
          onChange={(e) => setConfig({ ...config, model: e.target.value })}
          placeholder="e.g., gpt-4-1106-preview"
        />
      </div>

      <div className="form-group">
        <label htmlFor="apiKey">API Key</label>
        <input
          id="apiKey"
          type="password"
          value={config.apiKey || ''}
          onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
          placeholder="Enter your API key"
        />
      </div>

      <div className="form-group">
        <label htmlFor="temperature">Temperature: {config.temperature}</label>
        <input
          id="temperature"
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={config.temperature}
          onChange={(e) => setConfig({
            ...config,
            temperature: parseFloat(e.target.value)
          })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="maxTokens">Max Tokens</label>
        <input
          id="maxTokens"
          type="number"
          min="1"
          max="8192"
          value={config.maxTokens}
          onChange={(e) => setConfig({
            ...config,
            maxTokens: parseInt(e.target.value)
          })}
        />
      </div>
    </div>
  );

  const renderToolsTab = () => (
    <div className="settings-tab">
      <div className="tool-section">
        <h4>External Tools</h4>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={config.tools.gcp}
            onChange={(e) => setConfig({
              ...config,
              tools: { ...config.tools, gcp: e.target.checked }
            })}
          />
          <span className="checkmark"></span>
          Google Cloud Platform Access
          <span className="tool-description">Access GCP APIs and services</span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={config.tools.docker}
            onChange={(e) => setConfig({
              ...config,
              tools: { ...config.tools, docker: e.target.checked }
            })}
          />
          <span className="checkmark"></span>
          Docker Operations
          <span className="tool-description">Build and manage containers</span>
        </label>

        <label className="checkbox-label danger">
          <input
            type="checkbox"
            checked={config.tools.kali}
            onChange={(e) => setConfig({
              ...config,
              tools: { ...config.tools, kali: e.target.checked }
            })}
          />
          <span className="checkmark"></span>
          Kali Security Tools
          <span className="tool-description">Network scanning and security testing</span>
        </label>
      </div>

      <div className="tool-section">
        <h4>VS Code Integration</h4>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={config.tools.vscode.fileAccess}
            onChange={(e) => setConfig({
              ...config,
              tools: {
                ...config.tools,
                vscode: { ...config.tools.vscode, fileAccess: e.target.checked }
              }
            })}
          />
          <span className="checkmark"></span>
          File System Access
          <span className="tool-description">Read and write workspace files</span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={config.tools.vscode.extensions}
            onChange={(e) => setConfig({
              ...config,
              tools: {
                ...config.tools,
                vscode: { ...config.tools.vscode, extensions: e.target.checked }
              }
            })}
          />
          <span className="checkmark"></span>
          Extension Access
          <span className="tool-description">Use installed VS Code extensions</span>
        </label>

        <label className="checkbox-label danger">
          <input
            type="checkbox"
            checked={config.tools.vscode.terminal}
            onChange={(e) => setConfig({
              ...config,
              tools: {
                ...config.tools,
                vscode: { ...config.tools.vscode, terminal: e.target.checked }
              }
            })}
          />
          <span className="checkmark"></span>
          Terminal Access
          <span className="tool-description">Execute terminal commands</span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={config.tools.vscode.debugger}
            onChange={(e) => setConfig({
              ...config,
              tools: {
                ...config.tools,
                vscode: { ...config.tools.vscode, debugger: e.target.checked }
              }
            })}
          />
          <span className="checkmark"></span>
          Debugger Access
          <span className="tool-description">Start and control debugging sessions</span>
        </label>
      </div>
    </div>
  );

  const renderPermissionsTab = () => (
    <div className="settings-tab">
      <div className="permission-section">
        <h4>Security Permissions</h4>

        <label className="checkbox-label danger">
          <input
            type="checkbox"
            checked={config.permissions.dangerousOperations}
            onChange={(e) => setConfig({
              ...config,
              permissions: { ...config.permissions, dangerousOperations: e.target.checked }
            })}
          />
          <span className="checkmark"></span>
          Dangerous Operations
          <span className="tool-description">Allow potentially harmful operations</span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={config.permissions.networkAccess}
            onChange={(e) => setConfig({
              ...config,
              permissions: { ...config.permissions, networkAccess: e.target.checked }
            })}
          />
          <span className="checkmark"></span>
          Network Access
          <span className="tool-description">Make external network requests</span>
        </label>

        <label className="checkbox-label danger">
          <input
            type="checkbox"
            checked={config.permissions.fileSystemWrite}
            onChange={(e) => setConfig({
              ...config,
              permissions: { ...config.permissions, fileSystemWrite: e.target.checked }
            })}
          />
          <span className="checkmark"></span>
          File System Write
          <span className="tool-description">Modify files outside workspace</span>
        </label>
      </div>

      <div className="audit-section">
        <h4>Recent Permission Requests</h4>
        <div className="audit-log">
          {auditLog.map(entry => (
            <div key={entry.id} className={`audit-entry ${entry.approved ? 'approved' : 'denied'}`}>
              <div className="audit-header">
                <span className="extension-id">{entry.extensionId}</span>
                <span className={`risk-level ${entry.riskLevel}`}>{entry.riskLevel}</span>
                <span className={`status ${entry.approved ? 'approved' : 'denied'}`}>
                  {entry.approved ? '✓' : '✗'}
                </span>
              </div>
              <div className="audit-details">
                <div className="command">{entry.command}</div>
                <div className="purpose">{entry.purpose}</div>
                <div className="timestamp">
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExtensionsTab = () => (
    <div className="settings-tab">
      <div className="recommendations-section">
        <h4>Recommended Extensions</h4>
        {recommendations.length > 0 ? (
          <div className="recommendations-list">
            {recommendations.map(rec => (
              <div key={rec.extensionId} className={`recommendation ${rec.urgency}`}>
                <div className="rec-header">
                  <span className="extension-name">{rec.extensionId}</span>
                  <span className={`urgency ${rec.urgency}`}>{rec.urgency}</span>
                </div>
                <div className="rec-reason">{rec.reason}</div>
                <div className="rec-actions">
                  <button
                    className="install-btn"
                    onClick={() => handleInstallExtension(rec.extensionId)}
                  >
                    Install
                  </button>
                  <button
                    className="dismiss-btn"
                    onClick={() => setRecommendations(prev =>
                      prev.filter(r => r.extensionId !== rec.extensionId)
                    )}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-recommendations">
            No extension recommendations at this time.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="model-settings-overlay">
      <div className="model-settings-dialog">
        <div className="settings-header">
          <h2>AI Model Configuration</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-tabs">
          <button
            className={`tab ${activeTab === 'model' ? 'active' : ''}`}
            onClick={() => setActiveTab('model')}
          >
            Model
          </button>
          <button
            className={`tab ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('tools')}
          >
            Tools
          </button>
          <button
            className={`tab ${activeTab === 'permissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('permissions')}
          >
            Permissions
          </button>
          <button
            className={`tab ${activeTab === 'extensions' ? 'active' : ''}`}
            onClick={() => setActiveTab('extensions')}
          >
            Extensions
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'model' && renderModelTab()}
          {activeTab === 'tools' && renderToolsTab()}
          {activeTab === 'permissions' && renderPermissionsTab()}
          {activeTab === 'extensions' && renderExtensionsTab()}
        </div>

        {errors.length > 0 && (
          <div className="error-list">
            {errors.map((error, index) => (
              <div key={index} className="error-message">
                {error}
              </div>
            ))}
          </div>
        )}

        <div className="settings-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};
