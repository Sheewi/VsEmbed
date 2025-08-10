import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useRunner } from '../contexts/RunnerContext';
import { useAI } from '../contexts/AIContext';
import { useNotifications } from '../contexts/NotificationContext';
import '../styles/MenuHandler.css';

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  submenu?: MenuItem[];
  action?: () => void;
}

interface MenuHandlerProps {
  onViewToggle?: (view: string) => void;
}

export const MenuHandler: React.FC<MenuHandlerProps> = ({ onViewToggle }) => {
  const { currentWorkspace, createWorkspace, openWorkspace, saveWorkspace } = useWorkspace();
  const { runStatus, buildProject, startProject, stopProject } = useRunner();
  const { clearConversation, setModel, availableModels } = useAI();
  const { addNotification } = useNotifications();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const electronAPI = (window as any).electronAPI;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            handleNewWorkspace();
            break;
          case 'o':
            e.preventDefault();
            handleOpenWorkspace();
            break;
          case 's':
            e.preventDefault();
            handleSaveWorkspace();
            break;
          case 'r':
            e.preventDefault();
            handleRunProject();
            break;
          case 'b':
            e.preventDefault();
            handleBuildProject();
            break;
          case 'q':
            e.preventDefault();
            handleQuit();
            break;
        }
      }

      if (e.key === 'F5') {
        e.preventDefault();
        handleRunProject();
      }

      if (e.key === 'F11') {
        e.preventDefault();
        handleToggleFullscreen();
      }

      if (e.key === 'Escape') {
        setActiveMenu(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMenuClick = (menuId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  const handleNewWorkspace = async () => {
    try {
      const name = prompt('Enter workspace name:');
      if (name) {
        await createWorkspace(name, `/tmp/${name}`);
        addNotification({
          type: 'success',
          title: 'Workspace Created',
          message: `Workspace "${name}" created successfully`,
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Create Workspace',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
    setActiveMenu(null);
  };

  const handleOpenWorkspace = async () => {
    try {
      if (electronAPI?.workspace?.selectDirectory) {
        const path = await electronAPI.workspace.selectDirectory();
        if (path) {
          await openWorkspace(path);
          addNotification({
            type: 'success',
            title: 'Workspace Opened',
            message: `Opened workspace at ${path}`,
          });
        }
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Open Workspace',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
    setActiveMenu(null);
  };

  const handleSaveWorkspace = async () => {
    if (!currentWorkspace) {
      addNotification({
        type: 'warning',
        title: 'No Workspace',
        message: 'No workspace is currently open',
      });
      return;
    }

    try {
      await saveWorkspace();
      addNotification({
        type: 'success',
        title: 'Workspace Saved',
        message: 'Workspace saved successfully',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Save Workspace',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
    setActiveMenu(null);
  };

  const handleBuildProject = async () => {
    try {
      await buildProject();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Build Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
    setActiveMenu(null);
  };

  const handleRunProject = async () => {
    try {
      if (runStatus === 'running') {
        await stopProject();
      } else {
        await startProject();
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Run Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
    setActiveMenu(null);
  };

  const handleToggleFullscreen = () => {
    if (electronAPI?.window?.toggleFullscreen) {
      electronAPI.window.toggleFullscreen();
    }
    setActiveMenu(null);
  };

  const handleQuit = () => {
    if (electronAPI?.app?.quit) {
      electronAPI.app.quit();
    }
    setActiveMenu(null);
  };

  const fileMenu: MenuItem[] = [
    {
      id: 'new-workspace',
      label: 'New Workspace',
      icon: '📁',
      shortcut: 'Ctrl+N',
      action: handleNewWorkspace,
    },
    {
      id: 'open-workspace',
      label: 'Open Workspace',
      icon: '📂',
      shortcut: 'Ctrl+O',
      action: handleOpenWorkspace,
    },
    { id: 'sep1', label: '', separator: true },
    {
      id: 'save-workspace',
      label: 'Save Workspace',
      icon: '💾',
      shortcut: 'Ctrl+S',
      disabled: !currentWorkspace,
      action: handleSaveWorkspace,
    },
    { id: 'sep2', label: '', separator: true },
    {
      id: 'quit',
      label: 'Quit',
      icon: '🚪',
      shortcut: 'Ctrl+Q',
      action: handleQuit,
    },
  ];

  const runMenu: MenuItem[] = [
    {
      id: 'build',
      label: 'Build Project',
      icon: '🔨',
      shortcut: 'Ctrl+B',
      disabled: !currentWorkspace,
      action: handleBuildProject,
    },
    {
      id: 'run',
      label: runStatus === 'running' ? 'Stop Project' : 'Run Project',
      icon: runStatus === 'running' ? '⏹️' : '▶️',
      shortcut: 'F5',
      disabled: !currentWorkspace,
      action: handleRunProject,
    },
  ];

  const viewMenu: MenuItem[] = [
    {
      id: 'toggle-sidebar',
      label: 'Toggle Sidebar',
      icon: '📋',
      action: () => onViewToggle?.('sidebar'),
    },
    {
      id: 'toggle-terminal',
      label: 'Toggle Terminal',
      icon: '💻',
      action: () => onViewToggle?.('terminal'),
    },
    {
      id: 'toggle-preview',
      label: 'Toggle Preview',
      icon: '👁️',
      action: () => onViewToggle?.('preview'),
    },
    { id: 'sep1', label: '', separator: true },
    {
      id: 'fullscreen',
      label: 'Toggle Fullscreen',
      icon: '🖥️',
      shortcut: 'F11',
      action: handleToggleFullscreen,
    },
  ];

  const aiMenu: MenuItem[] = [
    {
      id: 'clear-chat',
      label: 'Clear Conversation',
      icon: '🗑️',
      action: () => {
        clearConversation();
        setActiveMenu(null);
      },
    },
    { id: 'sep1', label: '', separator: true },
    {
      id: 'ai-models',
      label: 'AI Models',
      icon: '🧠',
      submenu: availableModels.map(model => ({
        id: `model-${model}`,
        label: model,
        action: () => {
          setModel(model);
          setActiveMenu(null);
        },
      })),
    },
  ];

  const helpMenu: MenuItem[] = [
    {
      id: 'about',
      label: 'About VSEmbed',
      icon: 'ℹ️',
      action: () => {
        setShowAbout(true);
        setActiveMenu(null);
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      action: () => {
        setShowSettings(true);
        setActiveMenu(null);
      },
    },
  ];

  const renderMenuItem = (item: MenuItem) => {
    if (item.separator) {
      return <div key={item.id} className="menu-separator" />;
    }

    return (
      <div
        key={item.id}
        className={`menu-item ${item.disabled ? 'disabled' : ''}`}
        onClick={item.disabled ? undefined : item.action}
      >
        {item.icon && <span className="menu-icon">{item.icon}</span>}
        <span className="menu-label">{item.label}</span>
        {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
        {item.submenu && <span className="menu-arrow">▶</span>}
      </div>
    );
  };

  const renderMenu = (items: MenuItem[]) => (
    <div className="menu-dropdown">
      {items.map(renderMenuItem)}
    </div>
  );

  return (
    <>
      <div className="menu-bar">
        <div
          className={`menu-button ${activeMenu === 'file' ? 'active' : ''}`}
          onClick={(e) => handleMenuClick('file', e)}
        >
          File
          {activeMenu === 'file' && renderMenu(fileMenu)}
        </div>

        <div
          className={`menu-button ${activeMenu === 'run' ? 'active' : ''}`}
          onClick={(e) => handleMenuClick('run', e)}
        >
          Run
          {activeMenu === 'run' && renderMenu(runMenu)}
        </div>

        <div
          className={`menu-button ${activeMenu === 'view' ? 'active' : ''}`}
          onClick={(e) => handleMenuClick('view', e)}
        >
          View
          {activeMenu === 'view' && renderMenu(viewMenu)}
        </div>

        <div
          className={`menu-button ${activeMenu === 'ai' ? 'active' : ''}`}
          onClick={(e) => handleMenuClick('ai', e)}
        >
          AI
          {activeMenu === 'ai' && renderMenu(aiMenu)}
        </div>

        <div
          className={`menu-button ${activeMenu === 'help' ? 'active' : ''}`}
          onClick={(e) => handleMenuClick('help', e)}
        >
          Help
          {activeMenu === 'help' && renderMenu(helpMenu)}
        </div>
      </div>

      {/* About Dialog */}
      {showAbout && (
        <div className="modal-overlay">
          <div className="modal about-modal">
            <div className="modal-header">
              <h2>About VSEmbed AI DevTool</h2>
              <button className="modal-close" onClick={() => setShowAbout(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="about-content">
                <div className="app-icon">🤖</div>
                <h3>VSEmbed AI DevTool</h3>
                <p className="version">Version 1.0.0</p>
                <p className="description">
                  A portable, embeddable developer application where conversational AI agents
                  write, execute, debug, and live-preview user projects inside a VS Code engine
                  with CLI environment integration.
                </p>
                <div className="features">
                  <h4>Features:</h4>
                  <ul>
                    <li>🤖 AI-powered code generation and debugging</li>
                    <li>🏗️ Integrated VS Code editor with Monaco</li>
                    <li>💻 Built-in terminal and command execution</li>
                    <li>👁️ Live preview with multi-device views</li>
                    <li>📦 Portable workspace management</li>
                    <li>🔒 Secure sandboxed execution environment</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowAbout(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Dialog */}
      {showSettings && (
        <div className="modal-overlay">
          <div className="modal settings-modal">
            <div className="modal-header">
              <h2>Settings</h2>
              <button className="modal-close" onClick={() => setShowSettings(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="settings-content">
                <div className="setting-group">
                  <h4>Editor</h4>
                  <label>
                    <input type="checkbox" defaultChecked />
                    Enable auto-save
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked />
                    Show line numbers
                  </label>
                  <label>
                    <input type="checkbox" />
                    Enable word wrap
                  </label>
                </div>

                <div className="setting-group">
                  <h4>AI Assistant</h4>
                  <label>
                    Auto-approve low-risk actions:
                    <input type="checkbox" />
                  </label>
                  <label>
                    Maximum response length:
                    <select defaultValue="medium">
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </label>
                </div>

                <div className="setting-group">
                  <h4>Terminal</h4>
                  <label>
                    Default shell:
                    <select defaultValue="bash">
                      <option value="bash">Bash</option>
                      <option value="zsh">Zsh</option>
                      <option value="powershell">PowerShell</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowSettings(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={() => setShowSettings(false)}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
