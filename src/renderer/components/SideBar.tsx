import React, { useState } from 'react';
import { FileExplorer } from './FileExplorer';
import { SearchPanel } from './SearchPanel';
import { SourceControlPanel } from './SourceControlPanel';
import { 
  DebugPanel, 
  ExtensionsPanel, 
  TestingPanel, 
  RemoteExplorerPanel, 
  BookmarksPanel, 
  ProjectManagerPanel, 
  AccountsPanel, 
  SettingsPanel 
} from './PanelPlaceholders';
import './SideBar.css';

interface SideBarProps {
  activeView: string;
  isVisible: boolean;
  onToggle: () => void;
}

export const SideBar: React.FC<SideBarProps> = ({
  activeView,
  isVisible,
  onToggle
}) => {
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  const getViewTitle = (view: string): string => {
    const titles: Record<string, string> = {
      explorer: 'Explorer',
      search: 'Search',
      scm: 'Source Control',
      debug: 'Run and Debug',
      extensions: 'Extensions',
      testing: 'Testing',
      remote: 'Remote Explorer',
      bookmarks: 'Bookmarks',
      'project-manager': 'Project Manager',
      accounts: 'Accounts',
      settings: 'Settings'
    };
    return titles[view] || 'Unknown';
  };

  const getViewActions = (view: string): React.ReactNode => {
    switch (view) {
      case 'explorer':
        return (
          <div className="sidebar-actions">
            <button className="action-btn" title="New File">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M9.5 1.1l3.4 3.5.1.4v2h-1V6H8V2H3v11h4v1H2.5l-.5-.5v-12l.5-.5h6.7l.3.1zM9 2v3h2.9L9 2zm4 14h-1v-3H9v-1h3V9h1v3h3v1h-3v3z"/>
              </svg>
            </button>
            <button className="action-btn" title="New Folder">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M14.5 3H7.71l-.85-.85L6.51 2h-5l-.5.5v11l.5.5h13l.5-.5v-10L14.5 3zm-.51 8.49V13H7.49l-4-4V3h4.2l.85.85.35.15H14v7.49z"/>
              </svg>
            </button>
            <button className="action-btn" title="Refresh Explorer">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M13.451 5.609l-.579-.939-1.068.812-.076.094c-.335.415-.927 1.341-1.124 2.876l-.021.165.033.163.071.345c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3c.95 0 1.796.44 2.343 1.126l.27.344 1.055-.813-.312-.399C9.411 4.35 8.013 3.625 6.5 3.625c-2.309 0-4.125 1.816-4.125 4.125S4.191 11.875 6.5 11.875s4.125-1.816 4.125-4.125c0-.239-.02-.472-.058-.699l.884-1.442zM2.328 8.422l.068-.223L2.359 8.2c-.006-.025-.012-.049-.017-.074L2.328 8.422z"/>
              </svg>
            </button>
            <button className="action-btn" title="Collapse All">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M9 9H4v1h5V9zM4 7h5V6H4v1z"/>
              </svg>
            </button>
          </div>
        );
      case 'search':
        return (
          <div className="sidebar-actions">
            <button className="action-btn" title="Clear All">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M8 1a6.97 6.97 0 0 1 4.94 2.06l1.06-1.06A8 8 0 1 0 16 8h-1a7 7 0 1 1-7-7z"/>
              </svg>
            </button>
            <button className="action-btn" title="Refresh">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M13.451 5.609l-.579-.939-1.068.812-.076.094c-.335.415-.927 1.341-1.124 2.876l-.021.165.033.163.071.345c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3c.95 0 1.796.44 2.343 1.126l.27.344 1.055-.813-.312-.399C9.411 4.35 8.013 3.625 6.5 3.625c-2.309 0-4.125 1.816-4.125 4.125S4.191 11.875 6.5 11.875s4.125-1.816 4.125-4.125c0-.239-.02-.472-.058-.699l.884-1.442zM2.328 8.422l.068-.223L2.359 8.2c-.006-.025-.012-.049-.017-.074L2.328 8.422z"/>
              </svg>
            </button>
          </div>
        );
      case 'scm':
        return (
          <div className="sidebar-actions">
            <button className="action-btn" title="View & Sort">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M4.708 5.578L2.061 8.224l2.647 2.646-.708.708-3-3V7.87l3-3 .708.708zm7-.708L11 5.578l2.647 2.646L11 10.87l.708.708 3-3V7.87l-3-3zM4.908 13l.894.448L9.456 3l-.894-.448L4.908 13z"/>
              </svg>
            </button>
            <button className="action-btn" title="Commit">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V9H5V7h2V5h2v2h2v2H9v2z"/>
              </svg>
            </button>
            <button className="action-btn" title="More Actions">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'explorer':
        return <FileExplorer />;
      case 'search':
        return <SearchPanel />;
      case 'scm':
        return <SourceControlPanel />;
      case 'debug':
        return <DebugPanel />;
      case 'extensions':
        return <ExtensionsPanel />;
      case 'testing':
        return <TestingPanel />;
      case 'remote':
        return <RemoteExplorerPanel />;
      case 'bookmarks':
        return <BookmarksPanel />;
      case 'project-manager':
        return <ProjectManagerPanel />;
      case 'accounts':
        return <AccountsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <div className="sidebar-placeholder">Select a view from the activity bar</div>;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX - 48; // Account for activity bar width
      if (newWidth >= 200 && newWidth <= 600) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  if (!isVisible) return null;

  return (
    <div 
      className="sidebar" 
      style={{ width: `${width}px` }}
    >
      <div className="sidebar-header">
        <div className="sidebar-title">
          <h2>{getViewTitle(activeView)}</h2>
        </div>
        {getViewActions(activeView)}
      </div>

      <div className="sidebar-content">
        {renderActiveView()}
      </div>

      <div 
        className="sidebar-resize-handle"
        onMouseDown={handleMouseDown}
        style={{ cursor: isResizing ? 'col-resize' : 'col-resize' }}
      />
    </div>
  );
};
