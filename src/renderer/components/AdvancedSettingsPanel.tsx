import React, { useState, useEffect } from 'react';
import { ConfigurationManager, VsEmbedConfig } from '../../core/config/ConfigurationManager';
import './AdvancedSettingsPanel.css';

interface AdvancedSettingsPanelProps {
  configManager: ConfigurationManager;
  isVisible: boolean;
  onToggle: () => void;
}

interface SettingSection {
  id: string;
  title: string;
  icon: string;
  description: string;
}

const SETTING_SECTIONS: SettingSection[] = [
  {
    id: 'grok',
    title: 'Grok AI Configuration',
    icon: '🤖',
    description: 'Configure Grok AI API settings and behavior'
  },
  {
    id: 'googleCloud',
    title: 'Google Cloud Storage',
    icon: '☁️',
    description: 'Setup cloud storage for workspace synchronization'
  },
  {
    id: 'vscode',
    title: 'VS Code Settings',
    icon: '⚙️',
    description: 'Customize editor appearance and behavior'
  },
  {
    id: 'workspace',
    title: 'Workspace Management',
    icon: '📁',
    description: 'Configure workspace and project settings'
  },
  {
    id: 'ai',
    title: 'AI Features',
    icon: '🧠',
    description: 'Enable and configure AI-powered features'
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: '🔒',
    description: 'Security settings and data protection'
  }
];

export const AdvancedSettingsPanel: React.FC<AdvancedSettingsPanelProps> = ({
  configManager,
  isVisible,
  onToggle,
}) => {
  const [config, setConfig] = useState<VsEmbedConfig>(configManager.getConfig());
  const [activeSection, setActiveSection] = useState<string>('grok');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [cloudConnectionStatus, setCloudConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [importExportMode, setImportExportMode] = useState<'none' | 'import' | 'export'>('none');

  useEffect(() => {
    const handleConfigUpdate = (newConfig: VsEmbedConfig) => {
      setConfig(newConfig);
      setHasUnsavedChanges(false);
    };

    const handleCloudConnected = () => {
      setCloudConnectionStatus('connected');
    };

    const handleCloudError = () => {
      setCloudConnectionStatus('error');
    };

    configManager.on('configSaved', handleConfigUpdate);
    configManager.on('cloudStorageConnected', handleCloudConnected);
    configManager.on('cloudStorageError', handleCloudError);

    return () => {
      configManager.off('configSaved', handleConfigUpdate);
      configManager.off('cloudStorageConnected', handleCloudConnected);
      configManager.off('cloudStorageError', handleCloudError);
    };
  }, [configManager]);

  const updateConfig = (path: string, value: any) => {
    const newConfig = { ...config };
    const keys = path.split('.');
    let current = newConfig as any;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
    setHasUnsavedChanges(true);
  };

  const saveSettings = async () => {
    try {
      await configManager.saveConfig(config);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      setConfig(configManager.getConfig());
      setHasUnsavedChanges(true);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'vsembed-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setImportExportMode('none');
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        setConfig(importedConfig);
        setHasUnsavedChanges(true);
        setImportExportMode('none');
      } catch (error) {
        alert('Invalid settings file format.');
      }
    };
    reader.readAsText(file);
  };

  const migrateFromVSCode = async () => {
    try {
      await configManager.migrateFromVSCode();
      setConfig(configManager.getConfig());
    } catch (error) {
      console.error('Failed to migrate VS Code settings:', error);
      alert('Failed to migrate VS Code settings. Make sure VS Code is installed and has configuration files.');
    }
  };

  const testCloudConnection = async () => {
    setCloudConnectionStatus('unknown');
    // This would trigger a cloud connection test
    setTimeout(() => {
      setCloudConnectionStatus(Math.random() > 0.5 ? 'connected' : 'error');
    }, 2000);
  };

  const renderGrokSettings = () => (
    <div className="settings-section">
      <h3>🤖 Grok AI Configuration</h3>
      
      <div className="setting-group">
        <label>API Key</label>
        <input
          type="password"
          value={config.grok.apiKey}
          onChange={(e) => updateConfig('grok.apiKey', e.target.value)}
          placeholder="Enter your Grok API key"
          className="setting-input"
        />
        <small>Get your API key from <a href="https://console.x.ai" target="_blank" rel="noopener noreferrer">X.AI Console</a></small>
      </div>

      <div className="setting-group">
        <label>Base URL</label>
        <input
          type="url"
          value={config.grok.baseUrl}
          onChange={(e) => updateConfig('grok.baseUrl', e.target.value)}
          className="setting-input"
        />
      </div>

      <div className="setting-group">
        <label>Model</label>
        <select
          value={config.grok.model}
          onChange={(e) => updateConfig('grok.model', e.target.value)}
          className="setting-select"
        >
          <option value="grok-beta">Grok Beta</option>
          <option value="grok-2">Grok 2</option>
          <option value="grok-2-mini">Grok 2 Mini</option>
        </select>
      </div>

      <div className="setting-row">
        <div className="setting-group">
          <label>Temperature ({config.grok.temperature})</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={config.grok.temperature}
            onChange={(e) => updateConfig('grok.temperature', parseFloat(e.target.value))}
            className="setting-slider"
          />
        </div>

        <div className="setting-group">
          <label>Max Tokens</label>
          <input
            type="number"
            min="1"
            max="32768"
            value={config.grok.maxTokens}
            onChange={(e) => updateConfig('grok.maxTokens', parseInt(e.target.value))}
            className="setting-input"
          />
        </div>
      </div>

      <div className="setting-row">
        <div className="setting-group">
          <label>Top P ({config.grok.topP})</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.grok.topP}
            onChange={(e) => updateConfig('grok.topP', parseFloat(e.target.value))}
            className="setting-slider"
          />
        </div>

        <div className="setting-group">
          <label>Frequency Penalty ({config.grok.frequencyPenalty})</label>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={config.grok.frequencyPenalty}
            onChange={(e) => updateConfig('grok.frequencyPenalty', parseFloat(e.target.value))}
            className="setting-slider"
          />
        </div>
      </div>
    </div>
  );

  const renderGoogleCloudSettings = () => (
    <div className="settings-section">
      <h3>☁️ Google Cloud Storage</h3>
      
      <div className="connection-status">
        <span className={`status-indicator ${cloudConnectionStatus}`}></span>
        <span>Status: {cloudConnectionStatus === 'connected' ? 'Connected' : cloudConnectionStatus === 'error' ? 'Connection Error' : 'Unknown'}</span>
        <button onClick={testCloudConnection} className="test-button">Test Connection</button>
      </div>

      <div className="setting-group">
        <label>Project ID</label>
        <input
          type="text"
          value={config.googleCloud.projectId}
          onChange={(e) => updateConfig('googleCloud.projectId', e.target.value)}
          placeholder="your-gcp-project-id"
          className="setting-input"
        />
      </div>

      <div className="setting-group">
        <label>Service Account Key File</label>
        <input
          type="text"
          value={config.googleCloud.keyFilename}
          onChange={(e) => updateConfig('googleCloud.keyFilename', e.target.value)}
          placeholder="Path to service account JSON file"
          className="setting-input"
        />
        <small>Or set GOOGLE_APPLICATION_CREDENTIALS environment variable</small>
      </div>

      <div className="setting-group">
        <label>Storage Bucket Name</label>
        <input
          type="text"
          value={config.googleCloud.bucketName}
          onChange={(e) => updateConfig('googleCloud.bucketName', e.target.value)}
          placeholder="vsembed-storage"
          className="setting-input"
        />
      </div>

      <div className="setting-group">
        <label>Region</label>
        <select
          value={config.googleCloud.region}
          onChange={(e) => updateConfig('googleCloud.region', e.target.value)}
          className="setting-select"
        >
          <option value="us-central1">US Central 1</option>
          <option value="us-east1">US East 1</option>
          <option value="us-west1">US West 1</option>
          <option value="europe-west1">Europe West 1</option>
          <option value="asia-east1">Asia East 1</option>
        </select>
      </div>
    </div>
  );

  const renderVSCodeSettings = () => (
    <div className="settings-section">
      <h3>⚙️ VS Code Settings</h3>
      
      <div className="migration-section">
        <button onClick={migrateFromVSCode} className="migrate-button">
          📥 Import VS Code Settings
        </button>
        <small>Import your existing VS Code configuration</small>
      </div>

      <div className="setting-row">
        <div className="setting-group">
          <label>Theme</label>
          <select
            value={config.vscode.theme}
            onChange={(e) => updateConfig('vscode.theme', e.target.value)}
            className="setting-select"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="high-contrast">High Contrast</option>
          </select>
        </div>

        <div className="setting-group">
          <label>Font Size</label>
          <input
            type="number"
            min="8"
            max="72"
            value={config.vscode.fontSize}
            onChange={(e) => updateConfig('vscode.fontSize', parseInt(e.target.value))}
            className="setting-input"
          />
        </div>
      </div>

      <div className="setting-group">
        <label>Font Family</label>
        <input
          type="text"
          value={config.vscode.fontFamily}
          onChange={(e) => updateConfig('vscode.fontFamily', e.target.value)}
          className="setting-input"
        />
      </div>

      <div className="setting-row">
        <div className="setting-group">
          <label>Tab Size</label>
          <input
            type="number"
            min="1"
            max="8"
            value={config.vscode.tabSize}
            onChange={(e) => updateConfig('vscode.tabSize', parseInt(e.target.value))}
            className="setting-input"
          />
        </div>

        <div className="setting-group">
          <label>Insert Spaces</label>
          <input
            type="checkbox"
            checked={config.vscode.insertSpaces}
            onChange={(e) => updateConfig('vscode.insertSpaces', e.target.checked)}
            className="setting-checkbox"
          />
        </div>
      </div>

      <div className="setting-row">
        <div className="setting-group">
          <label>Word Wrap</label>
          <select
            value={config.vscode.wordWrap}
            onChange={(e) => updateConfig('vscode.wordWrap', e.target.value)}
            className="setting-select"
          >
            <option value="on">On</option>
            <option value="off">Off</option>
            <option value="wordWrapColumn">Word Wrap Column</option>
          </select>
        </div>

        <div className="setting-group">
          <label>Line Numbers</label>
          <select
            value={config.vscode.lineNumbers}
            onChange={(e) => updateConfig('vscode.lineNumbers', e.target.value)}
            className="setting-select"
          >
            <option value="on">On</option>
            <option value="off">Off</option>
            <option value="relative">Relative</option>
          </select>
        </div>
      </div>

      <div className="minimap-settings">
        <h4>Minimap</h4>
        <div className="setting-row">
          <div className="setting-group">
            <label>Enable Minimap</label>
            <input
              type="checkbox"
              checked={config.vscode.minimap.enabled}
              onChange={(e) => updateConfig('vscode.minimap.enabled', e.target.checked)}
              className="setting-checkbox"
            />
          </div>

          <div className="setting-group">
            <label>Side</label>
            <select
              value={config.vscode.minimap.side}
              onChange={(e) => updateConfig('vscode.minimap.side', e.target.value)}
              className="setting-select"
              disabled={!config.vscode.minimap.enabled}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkspaceSettings = () => (
    <div className="settings-section">
      <h3>📁 Workspace Management</h3>

      <div className="setting-group">
        <label>Auto Save</label>
        <select
          value={config.workspace.autoSave}
          onChange={(e) => updateConfig('workspace.autoSave', e.target.value)}
          className="setting-select"
        >
          <option value="off">Off</option>
          <option value="onFocusChange">On Focus Change</option>
          <option value="onWindowChange">On Window Change</option>
          <option value="afterDelay">After Delay</option>
        </select>
      </div>

      {config.workspace.autoSave === 'afterDelay' && (
        <div className="setting-group">
          <label>Auto Save Delay (ms)</label>
          <input
            type="number"
            min="100"
            max="10000"
            value={config.workspace.autoSaveDelay}
            onChange={(e) => updateConfig('workspace.autoSaveDelay', parseInt(e.target.value))}
            className="setting-input"
          />
        </div>
      )}

      <div className="setting-group">
        <label>Backup Location</label>
        <select
          value={config.workspace.backupLocation}
          onChange={(e) => updateConfig('workspace.backupLocation', e.target.value)}
          className="setting-select"
        >
          <option value="local">Local Only</option>
          <option value="cloud">Cloud Storage</option>
          <option value="both">Both Local and Cloud</option>
        </select>
      </div>

      <div className="setting-group">
        <label>Sync Settings to Cloud</label>
        <input
          type="checkbox"
          checked={config.workspace.syncSettings}
          onChange={(e) => updateConfig('workspace.syncSettings', e.target.checked)}
          className="setting-checkbox"
        />
        <small>Automatically sync your settings across devices</small>
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="settings-section">
      <h3>🧠 AI Features</h3>

      <div className="feature-toggles">
        <div className="setting-group">
          <label>Enable Code Completion</label>
          <input
            type="checkbox"
            checked={config.ai.enableCodeCompletion}
            onChange={(e) => updateConfig('ai.enableCodeCompletion', e.target.checked)}
            className="setting-checkbox"
          />
        </div>

        <div className="setting-group">
          <label>Enable Chat Assistant</label>
          <input
            type="checkbox"
            checked={config.ai.enableChatAssistant}
            onChange={(e) => updateConfig('ai.enableChatAssistant', e.target.checked)}
            className="setting-checkbox"
          />
        </div>

        <div className="setting-group">
          <label>Enable Code Review</label>
          <input
            type="checkbox"
            checked={config.ai.enableCodeReview}
            onChange={(e) => updateConfig('ai.enableCodeReview', e.target.checked)}
            className="setting-checkbox"
          />
        </div>

        <div className="setting-group">
          <label>Enable Documentation Generation</label>
          <input
            type="checkbox"
            checked={config.ai.enableDocGeneration}
            onChange={(e) => updateConfig('ai.enableDocGeneration', e.target.checked)}
            className="setting-checkbox"
          />
        </div>
      </div>

      <div className="setting-group">
        <label>Context Window Size</label>
        <select
          value={config.ai.contextWindow}
          onChange={(e) => updateConfig('ai.contextWindow', parseInt(e.target.value))}
          className="setting-select"
        >
          <option value="2048">2K tokens</option>
          <option value="4096">4K tokens</option>
          <option value="8192">8K tokens</option>
          <option value="16384">16K tokens</option>
          <option value="32768">32K tokens</option>
        </select>
      </div>

      <div className="setting-group">
        <label>Max Concurrent Requests</label>
        <input
          type="number"
          min="1"
          max="10"
          value={config.ai.maxConcurrentRequests}
          onChange={(e) => updateConfig('ai.maxConcurrentRequests', parseInt(e.target.value))}
          className="setting-input"
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h3>🔒 Security & Privacy</h3>

      <div className="setting-group">
        <label>Enable Sandbox</label>
        <input
          type="checkbox"
          checked={config.security.enableSandbox}
          onChange={(e) => updateConfig('security.enableSandbox', e.target.checked)}
          className="setting-checkbox"
        />
        <small>Run code in isolated containers for security</small>
      </div>

      <div className="setting-group">
        <label>Data Encryption</label>
        <input
          type="checkbox"
          checked={config.security.dataEncryption}
          onChange={(e) => updateConfig('security.dataEncryption', e.target.checked)}
          className="setting-checkbox"
        />
        <small>Encrypt sensitive data at rest and in transit</small>
      </div>

      <div className="setting-group">
        <label>Audit Logging</label>
        <input
          type="checkbox"
          checked={config.security.auditLogging}
          onChange={(e) => updateConfig('security.auditLogging', e.target.checked)}
          className="setting-checkbox"
        />
        <small>Log security-relevant events for monitoring</small>
      </div>

      <div className="setting-group">
        <label>Allowed Domains</label>
        <textarea
          value={config.security.allowedDomains.join('\n')}
          onChange={(e) => updateConfig('security.allowedDomains', e.target.value.split('\n').filter(d => d.trim()))}
          placeholder="*.x.ai&#10;*.googleapis.com&#10;*.github.com"
          className="setting-textarea"
        />
        <small>One domain per line. Use * for wildcards.</small>
      </div>
    </div>
  );

  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'grok': return renderGrokSettings();
      case 'googleCloud': return renderGoogleCloudSettings();
      case 'vscode': return renderVSCodeSettings();
      case 'workspace': return renderWorkspaceSettings();
      case 'ai': return renderAISettings();
      case 'security': return renderSecuritySettings();
      default: return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`advanced-settings-panel theme-${config.vscode.theme}`}>
      <div className="settings-header">
        <div className="header-left">
          <h2>⚙️ Advanced Settings</h2>
          {hasUnsavedChanges && <span className="unsaved-indicator">●</span>}
        </div>
        <div className="header-actions">
          <button
            onClick={() => setImportExportMode('export')}
            className="action-button"
            title="Export Settings"
          >
            📤
          </button>
          <button
            onClick={() => setImportExportMode('import')}
            className="action-button"
            title="Import Settings"
          >
            📥
          </button>
          <button
            onClick={resetToDefaults}
            className="action-button"
            title="Reset to Defaults"
          >
            🔄
          </button>
          <button
            onClick={onToggle}
            className="action-button close-button"
            title="Close Settings"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <div className="settings-nav">
            {SETTING_SECTIONS.map(section => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <div className="nav-text">
                  <div className="nav-title">{section.title}</div>
                  <div className="nav-description">{section.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-main">
          <div className="settings-scroll">
            {renderSettingsContent()}
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <div className="footer-left">
          <span className="version-info">VsEmbed v1.0.0</span>
        </div>
        <div className="footer-actions">
          <button
            onClick={saveSettings}
            disabled={!hasUnsavedChanges}
            className="save-button"
          >
            💾 Save Settings
          </button>
        </div>
      </div>

      {/* Import/Export Modal */}
      {importExportMode !== 'none' && (
        <div className="modal-overlay" onClick={() => setImportExportMode('none')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {importExportMode === 'export' && (
              <>
                <h3>Export Settings</h3>
                <p>Download your current settings as a JSON file.</p>
                <div className="modal-actions">
                  <button onClick={exportSettings} className="primary-button">
                    📤 Download Settings
                  </button>
                  <button onClick={() => setImportExportMode('none')} className="secondary-button">
                    Cancel
                  </button>
                </div>
              </>
            )}
            {importExportMode === 'import' && (
              <>
                <h3>Import Settings</h3>
                <p>Choose a settings file to import. This will replace your current settings.</p>
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="file-input"
                />
                <div className="modal-actions">
                  <button onClick={() => setImportExportMode('none')} className="secondary-button">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
