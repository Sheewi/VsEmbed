import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useNotifications } from '../contexts/NotificationContext';
import '../styles/FileExplorer.css';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  expanded?: boolean;
  size?: number;
  modified?: Date;
}

interface ContextMenu {
  x: number;
  y: number;
  target: FileNode;
}

export const FileExplorer: React.FC = () => {
  const { currentWorkspace, createFile, createDirectory, deleteFile, renameFile } = useWorkspace();
  const { addNotification } = useNotifications();

  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [showNewDialog, setShowNewDialog] = useState<{ type: 'file' | 'folder'; parent: string } | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [showRenameDialog, setShowRenameDialog] = useState<{ path: string; oldName: string } | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const electronAPI = (window as any).electronAPI;

  useEffect(() => {
    if (currentWorkspace) {
      loadFileTree();
    } else {
      setFileTree([]);
    }
  }, [currentWorkspace]);

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const loadFileTree = async () => {
    if (!currentWorkspace || !electronAPI) return;

    setIsLoading(true);
    try {
      const tree = await electronAPI.workspace.getFileTree(currentWorkspace.path);
      setFileTree(tree);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Load Files',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (node: FileNode): string => {
    if (node.type === 'directory') {
      return node.expanded ? '📂' : '📁';
    }

    const ext = node.name.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
      'js': '🟨',
      'jsx': '⚛️',
      'ts': '🔷',
      'tsx': '⚛️',
      'py': '🐍',
      'html': '🌐',
      'css': '🎨',
      'scss': '🎨',
      'sass': '🎨',
      'json': '📋',
      'md': '📝',
      'txt': '📄',
      'yaml': '⚙️',
      'yml': '⚙️',
      'xml': '📄',
      'svg': '🖼️',
      'png': '🖼️',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'gif': '🖼️',
      'pdf': '📕',
      'zip': '📦',
      'tar': '📦',
      'gz': '📦',
    };

    return iconMap[ext || ''] || '📄';
  };

  const toggleDirectory = async (path: string) => {
    setFileTree(prevTree => {
      const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.path === path && node.type === 'directory') {
            return { ...node, expanded: !node.expanded };
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };
      return updateNode(prevTree);
    });
  };

  const handleFileClick = async (node: FileNode) => {
    if (node.type === 'directory') {
      await toggleDirectory(node.path);
    } else {
      setSelectedFile(node.path);

      // Open file in editor
      if (electronAPI?.workspace?.openFile) {
        try {
          await electronAPI.workspace.openFile(node.path);
        } catch (error) {
          addNotification({
            type: 'error',
            title: 'Failed to Open File',
            message: error instanceof Error ? error.message : 'Unknown error occurred',
          });
        }
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    e.stopPropagation();

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      target: node,
    });
  };

  const handleNewFile = () => {
    const parentPath = contextMenu?.target.type === 'directory'
      ? contextMenu.target.path
      : currentWorkspace?.path || '';

    setShowNewDialog({ type: 'file', parent: parentPath });
    setContextMenu(null);
  };

  const handleNewFolder = () => {
    const parentPath = contextMenu?.target.type === 'directory'
      ? contextMenu.target.path
      : currentWorkspace?.path || '';

    setShowNewDialog({ type: 'folder', parent: parentPath });
    setContextMenu(null);
  };

  const handleRename = () => {
    if (!contextMenu) return;

    setShowRenameDialog({
      path: contextMenu.target.path,
      oldName: contextMenu.target.name,
    });
    setRenameValue(contextMenu.target.name);
    setContextMenu(null);
  };

  const handleDelete = async () => {
    if (!contextMenu) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${contextMenu.target.name}"?`
    );

    if (confirmed) {
      try {
        await deleteFile(contextMenu.target.path);
        await loadFileTree();

        addNotification({
          type: 'success',
          title: 'File Deleted',
          message: `${contextMenu.target.name} deleted successfully`,
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Failed to Delete File',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    }

    setContextMenu(null);
  };

  const handleCreateItem = async () => {
    if (!showNewDialog || !newItemName.trim()) return;

    const fullPath = `${showNewDialog.parent}/${newItemName.trim()}`;

    try {
      if (showNewDialog.type === 'file') {
        await createFile(fullPath, '');
      } else {
        await createDirectory(fullPath);
      }

      await loadFileTree();

      addNotification({
        type: 'success',
        title: `${showNewDialog.type === 'file' ? 'File' : 'Folder'} Created`,
        message: `${newItemName} created successfully`,
      });

      setShowNewDialog(null);
      setNewItemName('');
    } catch (error) {
      addNotification({
        type: 'error',
        title: `Failed to Create ${showNewDialog.type === 'file' ? 'File' : 'Folder'}`,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const handleRenameItem = async () => {
    if (!showRenameDialog || !renameValue.trim()) return;

    const newPath = showRenameDialog.path.replace(
      showRenameDialog.oldName,
      renameValue.trim()
    );

    try {
      await renameFile(showRenameDialog.path, newPath);
      await loadFileTree();

      addNotification({
        type: 'success',
        title: 'Item Renamed',
        message: `Renamed to ${renameValue}`,
      });

      setShowRenameDialog(null);
      setRenameValue('');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Rename Item',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const handleRefresh = () => {
    loadFileTree();
  };

  const handleCollapseAll = () => {
    setFileTree(prevTree => {
      const collapseNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => ({
          ...node,
          expanded: false,
          children: node.children ? collapseNode(node.children) : undefined,
        }));
      };
      return collapseNode(prevTree);
    });
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  };

  const renderFileNode = (node: FileNode, depth: number = 0): React.ReactNode => {
    const isSelected = selectedFile === node.path;
    const paddingLeft = depth * 16 + 8;

    return (
      <div key={node.path}>
        <div
          className={`file-node ${isSelected ? 'selected' : ''} ${node.type}`}
          style={{ paddingLeft }}
          onClick={() => handleFileClick(node)}
          onContextMenu={(e) => handleContextMenu(e, node)}
        >
          <span className="file-icon">{getFileIcon(node)}</span>
          <span className="file-name">{node.name}</span>
          {node.size !== undefined && node.type === 'file' && (
            <span className="file-size">{formatFileSize(node.size)}</span>
          )}
        </div>

        {node.type === 'directory' && node.expanded && node.children && (
          <div className="directory-children">
            {node.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <div className="explorer-title">
          <h3>Explorer</h3>
          {currentWorkspace && (
            <span className="workspace-name">{currentWorkspace.name}</span>
          )}
        </div>

        <div className="explorer-actions">
          <button
            className="action-btn"
            onClick={handleRefresh}
            title="Refresh"
            disabled={isLoading}
          >
            {isLoading ? '⏳' : '🔄'}
          </button>
          <button
            className="action-btn"
            onClick={handleCollapseAll}
            title="Collapse All"
          >
            📁
          </button>
          <button
            className="action-btn"
            onClick={() => setShowNewDialog({ type: 'file', parent: currentWorkspace?.path || '' })}
            title="New File"
          >
            📄
          </button>
          <button
            className="action-btn"
            onClick={() => setShowNewDialog({ type: 'folder', parent: currentWorkspace?.path || '' })}
            title="New Folder"
          >
            📁
          </button>
        </div>
      </div>

      <div className="file-tree">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading files...</p>
          </div>
        ) : fileTree.length === 0 ? (
          <div className="empty-state">
            {currentWorkspace ? (
              <p>No files found in workspace</p>
            ) : (
              <p>Open a workspace to explore files</p>
            )}
          </div>
        ) : (
          fileTree.map(node => renderFileNode(node))
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button onClick={handleNewFile}>📄 New File</button>
          <button onClick={handleNewFolder}>📁 New Folder</button>
          <div className="menu-separator"></div>
          <button onClick={handleRename}>✏️ Rename</button>
          <button onClick={handleDelete} className="danger">🗑️ Delete</button>
        </div>
      )}

      {/* New Item Dialog */}
      {showNewDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New {showNewDialog.type === 'file' ? 'File' : 'Folder'}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowNewDialog(null);
                  setNewItemName('');
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <label>
                Name:
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateItem();
                    } else if (e.key === 'Escape') {
                      setShowNewDialog(null);
                      setNewItemName('');
                    }
                  }}
                  placeholder={showNewDialog.type === 'file' ? 'example.js' : 'new-folder'}
                  autoFocus
                />
              </label>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowNewDialog(null);
                  setNewItemName('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleCreateItem}
                disabled={!newItemName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Dialog */}
      {showRenameDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Rename Item</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowRenameDialog(null);
                  setRenameValue('');
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <label>
                New name:
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRenameItem();
                    } else if (e.key === 'Escape') {
                      setShowRenameDialog(null);
                      setRenameValue('');
                    }
                  }}
                  autoFocus
                />
              </label>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowRenameDialog(null);
                  setRenameValue('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleRenameItem}
                disabled={!renameValue.trim() || renameValue === showRenameDialog.oldName}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
