import React, { ReactNode, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

interface LayoutSidebarProps {
  children: ReactNode;
  width?: number;
}

interface LayoutMainProps {
  children: ReactNode;
}

interface LayoutPanelProps {
  children: ReactNode;
  height?: number;
  minHeight?: number;
  collapsible?: boolean;
  title?: string;
  defaultCollapsed?: boolean;
}

const Layout: React.FC<LayoutProps> & {
  Sidebar: React.FC<LayoutSidebarProps>;
  Main: React.FC<LayoutMainProps>;
  TopPanel: React.FC<LayoutPanelProps>;
  MiddlePanel: React.FC<LayoutPanelProps>;
  BottomPanel: React.FC<LayoutPanelProps>;
} = ({ children }) => {
  return (
    <div className="layout">
      {children}
    </div>
  );
};

const LayoutSidebar: React.FC<LayoutSidebarProps> = ({ children, width = 250 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = currentWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth >= 200 && newWidth <= 600) {
        setCurrentWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`layout-sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{ width: isCollapsed ? 48 : currentWidth }}
    >
      <div className="sidebar-header">
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <div className="sidebar-content">
        {children}
      </div>

      {!isCollapsed && (
        <div
          className="sidebar-resizer"
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
  );
};

const LayoutMain: React.FC<LayoutMainProps> = ({ children }) => {
  return (
    <div className="layout-main">
      {children}
    </div>
  );
};

const LayoutTopPanel: React.FC<LayoutPanelProps> = ({
  children,
  height = 300,
  minHeight = 200,
  collapsible = true,
  title,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [currentHeight, setCurrentHeight] = useState(height);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    const startY = e.clientY;
    const startHeight = currentHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = startHeight + (e.clientY - startY);
      if (newHeight >= minHeight && newHeight <= 600) {
        setCurrentHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`layout-panel layout-top-panel ${isCollapsed ? 'collapsed' : ''}`}
      style={{ height: isCollapsed ? 32 : currentHeight }}
    >
      {(title || collapsible) && (
        <div className="panel-header">
          {title && <span className="panel-title">{title}</span>}
          {collapsible && (
            <button
              className="panel-toggle"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
            >
              {isCollapsed ? '▼' : '▲'}
            </button>
          )}
        </div>
      )}

      {!isCollapsed && (
        <>
          <div className="panel-content">
            {children}
          </div>

          <div
            className="panel-resizer horizontal"
            onMouseDown={handleMouseDown}
          />
        </>
      )}
    </div>
  );
};

const LayoutMiddlePanel: React.FC<LayoutPanelProps> = ({ children }) => {
  return (
    <div className="layout-panel layout-middle-panel">
      <div className="panel-content">
        {children}
      </div>
    </div>
  );
};

const LayoutBottomPanel: React.FC<LayoutPanelProps> = ({
  children,
  height = 250,
  minHeight = 150,
  collapsible = true,
  title,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [currentHeight, setCurrentHeight] = useState(height);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    const startY = e.clientY;
    const startHeight = currentHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = startHeight - (e.clientY - startY);
      if (newHeight >= minHeight && newHeight <= 600) {
        setCurrentHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`layout-panel layout-bottom-panel ${isCollapsed ? 'collapsed' : ''}`}
      style={{ height: isCollapsed ? 32 : currentHeight }}
    >
      {!isCollapsed && (
        <div
          className="panel-resizer horizontal"
          onMouseDown={handleMouseDown}
        />
      )}

      {(title || collapsible) && (
        <div className="panel-header">
          {title && <span className="panel-title">{title}</span>}
          {collapsible && (
            <button
              className="panel-toggle"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
            >
              {isCollapsed ? '▲' : '▼'}
            </button>
          )}
        </div>
      )}

      {!isCollapsed && (
        <div className="panel-content">
          {children}
        </div>
      )}
    </div>
  );
};

Layout.Sidebar = LayoutSidebar;
Layout.Main = LayoutMain;
Layout.TopPanel = LayoutTopPanel;
Layout.MiddlePanel = LayoutMiddlePanel;
Layout.BottomPanel = LayoutBottomPanel;

export { Layout };

// CSS for layout (would be in a separate file in a real app)
const layoutStyles = `
.layout {
  display: flex;
  height: 100vh;
  background-color: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
}

.layout-sidebar {
  background-color: var(--vscode-sidebar-background);
  border-right: 1px solid var(--vscode-border);
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 48px;
  transition: width 0.2s ease;
}

.layout-sidebar.collapsed {
  width: 48px !important;
}

.sidebar-header {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px;
  background-color: var(--vscode-sidebar-background);
  border-bottom: 1px solid var(--vscode-border);
}

.sidebar-toggle {
  background: none;
  border: none;
  color: var(--vscode-sidebar-foreground);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1;
}

.sidebar-toggle:hover {
  background-color: var(--vscode-list-hover-background);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-resizer {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  cursor: ew-resize;
  background-color: transparent;
}

.sidebar-resizer:hover {
  background-color: var(--vscode-button-background);
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-panel {
  display: flex;
  flex-direction: column;
  background-color: var(--vscode-panel-background);
  position: relative;
  overflow: hidden;
}

.layout-top-panel {
  border-bottom: 1px solid var(--vscode-panel-border);
}

.layout-middle-panel {
  flex: 1;
}

.layout-bottom-panel {
  border-top: 1px solid var(--vscode-panel-border);
}

.panel-header {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  background-color: var(--vscode-panel-background);
  border-bottom: 1px solid var(--vscode-panel-border);
  font-size: 12px;
  font-weight: 600;
}

.panel-title {
  color: var(--vscode-foreground);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.panel-toggle {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1;
}

.panel-toggle:hover {
  background-color: var(--vscode-list-hover-background);
}

.panel-content {
  flex: 1;
  overflow: auto;
  position: relative;
}

.panel-resizer {
  position: absolute;
  background-color: transparent;
  cursor: ns-resize;
  z-index: 10;
}

.panel-resizer.horizontal {
  width: 100%;
  height: 4px;
}

.layout-top-panel .panel-resizer.horizontal {
  bottom: 0;
}

.layout-bottom-panel .panel-resizer.horizontal {
  top: 0;
}

.panel-resizer:hover {
  background-color: var(--vscode-button-background);
}

.layout-panel.collapsed .panel-content {
  display: none;
}

.layout-panel.collapsed {
  min-height: 32px;
}

/* Split panel for editor and preview */
.split-panel {
  display: flex;
  height: 100%;
}

.split-panel-left,
.split-panel-right {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.split-panel-resizer {
  width: 4px;
  background-color: var(--vscode-border);
  cursor: ew-resize;
  position: relative;
}

.split-panel-resizer:hover {
  background-color: var(--vscode-button-background);
}
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = layoutStyles;
document.head.appendChild(styleElement);
