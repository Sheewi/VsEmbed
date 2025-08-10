import React, { useState } from 'react';
import { MenuHandler } from './MenuHandler';
import { ChatPane } from './ChatPane';
import { EditorPane } from './EditorPane';
import { TerminalPane } from './TerminalPane';
import { PreviewPane } from './PreviewPane';
import { FileExplorer } from './FileExplorer';
import { StatusBar } from './StatusBar';
import '../styles/Layout.css';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [chatVisible, setChatVisible] = useState(true);

  const handleViewToggle = (view: string) => {
    switch (view) {
      case 'sidebar':
        setSidebarVisible(!sidebarVisible);
        break;
      case 'terminal':
        setTerminalVisible(!terminalVisible);
        break;
      case 'preview':
        setPreviewVisible(!previewVisible);
        break;
      case 'chat':
        setChatVisible(!chatVisible);
        break;
    }
  };

  const handlePanelToggle = (panel: string) => {
    switch (panel) {
      case 'problems':
        // TODO: Implement problems panel
        break;
      case 'notifications':
        // TODO: Implement notifications panel
        break;
      case 'terminal':
        setTerminalVisible(!terminalVisible);
        break;
      case 'output':
        // TODO: Implement output panel
        break;
    }
  };

  return (
    <div className="layout">
      {/* Menu Bar */}
      <MenuHandler onViewToggle={handleViewToggle} />

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        {sidebarVisible && (
          <div className="sidebar">
            <FileExplorer />
          </div>
        )}

        {/* Editor Area */}
        <div className="editor-area">
          <div className="editor-container">
            {/* Chat Panel */}
            {chatVisible && (
              <div className="chat-panel">
                <ChatPane />
              </div>
            )}

            {/* Code Editor */}
            <div className="code-editor">
              <EditorPane />
            </div>
          </div>

          {/* Preview Panel */}
          {previewVisible && (
            <div className="preview-panel">
              <PreviewPane />
            </div>
          )}
        </div>
      </div>

      {/* Terminal */}
      {terminalVisible && (
        <div className="terminal-panel">
          <TerminalPane />
        </div>
      )}

      {/* Status Bar */}
      <StatusBar onTogglePanel={handlePanelToggle} />
    </div>
  );
};
