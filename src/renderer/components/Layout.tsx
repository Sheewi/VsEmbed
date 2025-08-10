import React, { useState } from 'react';
import { MenuHandler } from './MenuHandler';
import { ChatPane } from './ChatPane';
import { EditorPane } from './EditorPane';
import { TerminalPane } from './TerminalPane';
import { PreviewPane } from './PreviewPane';
import { FileExplorer } from './FileExplorer';
import { StatusBar } from './StatusBar';
import { ModelSettings } from './ModelSettings';
import { PermissionRequestManager } from './PermissionRequestDialog';
import '../styles/Layout.css';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [chatVisible, setChatVisible] = useState(true);
  const [showModelSettings, setShowModelSettings] = useState(false);

  const handleViewToggle = (view: string) => {
    switch (view) {
      case 'sidebar':
        setSidebarVisible(!sidebarVisible);
        break;
      case 'terminal':
        setTerminalVisible(!terminalVisible);
        break;
      case 'chat':
        setChatVisible(!chatVisible);
        break;
      case 'settings':
        setShowModelSettings(true);
        break;
    }
  };

  const handlePanelToggle = (panel: string) => {
    switch (panel) {
      case 'terminal':
        setTerminalVisible(!terminalVisible);
        break;
      default:
        break;
    }
  };

  return (
    <PermissionRequestManager>
      <div className="vsembed-app">
        {/* Menu Bar */}
        <MenuHandler onViewToggle={handleViewToggle} />

        {/* Main Content Area */}
        <div className="vsembed-main">
          {/* Sidebar */}
          {sidebarVisible && (
            <div className="vsembed-sidebar">
              <div className="vsembed-panel-header">
                <span>Explorer</span>
                <button 
                  className="vsembed-btn-secondary"
                  onClick={() => setSidebarVisible(false)}
                  title="Hide Sidebar"
                >
                  ✕
                </button>
              </div>
              <div className="vsembed-panel-content">
                <FileExplorer />
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="vsembed-content">
            {/* Editor and Preview */}
            <div className="vsembed-panels">
              {/* Editor Area */}
              <div className="vsembed-editor-area">
                <div className="vsembed-panel-header">
                  <span>Editor</span>
                  <div className="vsembed-flex vsembed-gap">
                    {!sidebarVisible && (
                      <button 
                        className="vsembed-btn-secondary"
                        onClick={() => setSidebarVisible(true)}
                        title="Show Explorer"
                      >
                        📁
                      </button>
                    )}
                    <button 
                      className="vsembed-btn-secondary"
                      onClick={() => setChatVisible(!chatVisible)}
                      title={chatVisible ? "Hide AI Chat" : "Show AI Chat"}
                    >
                      🤖
                    </button>
                  </div>
                </div>
                <div className="vsembed-panel-content" style={{ padding: 0 }}>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flex: 1 }}>
                      <EditorPane />
                    </div>
                    <div style={{ width: '50%', borderLeft: '1px solid var(--vsembed-border)' }}>
                      <PreviewPane />
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Chat Panel */}
              {chatVisible && (
                <div className="vsembed-chat-panel">
                  <div className="vsembed-panel-header">
                    <span>🤖 AI Assistant</span>
                    <button 
                      className="vsembed-btn-secondary"
                      onClick={() => setChatVisible(false)}
                      title="Hide AI Chat"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="vsembed-panel-content" style={{ padding: 0 }}>
                    <ChatPane />
                  </div>
                </div>
              )}
            </div>

            {/* Terminal */}
            {terminalVisible && (
              <div className="vsembed-bottom-panel">
                <div className="vsembed-panel-header">
                  <span>Terminal</span>
                  <div className="vsembed-flex vsembed-gap">
                    <button 
                      className="vsembed-btn-secondary"
                      onClick={() => setTerminalVisible(false)}
                      title="Hide Terminal"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="vsembed-panel-content" style={{ padding: 0 }}>
                  <TerminalPane />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar onTogglePanel={handlePanelToggle} />

        {/* Model Settings Dialog */}
        {showModelSettings && (
          <ModelSettings onClose={() => setShowModelSettings(false)} />
        )}
      </div>
    </PermissionRequestManager>
  );
};
