import React, { useState, useEffect } from 'react';
import '../../styles/AIWorkspaceManager.css';

export interface Workspace {
  id: string;
  name: string;
  path: string;
  type: 'project' | 'sandbox' | 'template';
  aiConfig?: {
    enabledFeatures: string[];
    modelPreferences: string[];
    autoSave: boolean;
    smartSuggestions: boolean;
  };
  files: WorkspaceFile[];
  created: Date;
  lastAccessed: Date;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified: Date;
  language?: string;
  aiAnalysis?: {
    complexity: number;
    suggestions: string[];
    errors: number;
    warnings: number;
  };
}

export const AIWorkspaceManager: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with sample workspaces
    const sampleWorkspaces: Workspace[] = [
      {
        id: 'ws-1',
        name: 'React AI Dashboard',
        path: '/projects/react-ai-dashboard',
        type: 'project',
        aiConfig: {
          enabledFeatures: ['auto-completion', 'error-detection', 'refactoring'],
          modelPreferences: ['grok-beta', 'grok-2'],
          autoSave: true,
          smartSuggestions: true,
        },
        files: [],
        created: new Date('2024-01-15'),
        lastAccessed: new Date(),
      },
      {
        id: 'ws-2',
        name: 'Python ML Project',
        path: '/projects/python-ml',
        type: 'project',
        files: [],
        created: new Date('2024-02-01'),
        lastAccessed: new Date('2024-02-15'),
      },
    ];

    setWorkspaces(sampleWorkspaces);
    setCurrentWorkspace(sampleWorkspaces[0]);
    setLoading(false);
  }, []);

  const createNewWorkspace = (name: string, type: Workspace['type']) => {
    const newWorkspace: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      path: `/projects/${name.toLowerCase().replace(/\s+/g, '-')}`,
      type,
      files: [],
      created: new Date(),
      lastAccessed: new Date(),
    };

    setWorkspaces(prev => [...prev, newWorkspace]);
    setCurrentWorkspace(newWorkspace);
  };

  if (loading) {
    return (
      <div className="ai-workspace-loading">
        <div className="loading-spinner"></div>
        <p>Loading AI Workspace...</p>
      </div>
    );
  }

  return (
    <div className="ai-workspace-manager">
      <div className="workspace-header">
        <h2>🏢 AI Workspace Manager</h2>
        <div className="workspace-stats">
          <span>Total Workspaces: {workspaces.length}</span>
          <span>Active: {currentWorkspace?.name || 'None'}</span>
        </div>
      </div>

      <div className="workspace-content">
        <div className="workspace-sidebar">
          <div className="workspace-list">
            <h3>Workspaces</h3>
            {workspaces.map(workspace => (
              <div
                key={workspace.id}
                className={`workspace-item ${currentWorkspace?.id === workspace.id ? 'active' : ''}`}
                onClick={() => setCurrentWorkspace(workspace)}
              >
                <div className="workspace-icon">
                  {workspace.type === 'project' ? '📁' : workspace.type === 'sandbox' ? '🧪' : '📋'}
                </div>
                <div className="workspace-info">
                  <h4>{workspace.name}</h4>
                  <p>{workspace.path}</p>
                  <small>Last accessed: {workspace.lastAccessed.toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="workspace-actions">
            <button
              className="create-workspace-btn"
              onClick={() => createNewWorkspace('New Project', 'project')}
            >
              ➕ Create Workspace
            </button>
          </div>
        </div>

        <div className="workspace-main">
          {currentWorkspace ? (
            <div className="workspace-details">
              <div className="workspace-header-details">
                <h3>{currentWorkspace.name}</h3>
                <span className="workspace-type">{currentWorkspace.type}</span>
              </div>

              <div className="workspace-tabs">
                <div className="tab active">Files</div>
                <div className="tab">AI Config</div>
                <div className="tab">Analytics</div>
                <div className="tab">Settings</div>
              </div>

              <div className="workspace-content-area">
                <div className="file-explorer">
                  <div className="explorer-header">
                    <h4>📁 File Explorer</h4>
                    <button className="add-file-btn">➕ Add File</button>
                  </div>
                  
                  <div className="file-tree">
                    {currentWorkspace.files.length === 0 ? (
                      <div className="empty-workspace">
                        <p>No files in this workspace yet.</p>
                        <button onClick={() => {/* Add file logic */}}>
                          Create your first file
                        </button>
                      </div>
                    ) : (
                      currentWorkspace.files.map(file => (
                        <div key={file.id} className="file-item">
                          <span className="file-icon">
                            {file.type === 'directory' ? '📁' : '📄'}
                          </span>
                          <span className="file-name">{file.name}</span>
                          {file.aiAnalysis && (
                            <div className="ai-analysis-indicator">
                              <span className="complexity">C: {file.aiAnalysis.complexity}</span>
                              <span className="errors">E: {file.aiAnalysis.errors}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {currentWorkspace.aiConfig && (
                  <div className="ai-config-panel">
                    <h4>🤖 AI Configuration</h4>
                    <div className="ai-features">
                      <h5>Enabled Features:</h5>
                      {currentWorkspace.aiConfig.enabledFeatures.map(feature => (
                        <span key={feature} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                    <div className="ai-models">
                      <h5>Preferred Models:</h5>
                      {currentWorkspace.aiConfig.modelPreferences.map(model => (
                        <span key={model} className="model-tag">{model}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-workspace-selected">
              <h3>No workspace selected</h3>
              <p>Select a workspace from the sidebar or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
