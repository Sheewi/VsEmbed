import React, { useState, useEffect } from 'react';

export interface FileSystemItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified: Date;
  children?: FileSystemItem[];
  isExpanded?: boolean;
}

export const FileManager: React.FC = () => {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FileSystemItem | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'list' | 'grid'>('tree');

  useEffect(() => {
    // Initialize with sample file structure
    const sampleFileSystem: FileSystemItem[] = [
      {
        id: 'root',
        name: 'Project Root',
        path: '/',
        type: 'directory',
        modified: new Date(),
        isExpanded: true,
        children: [
          {
            id: 'src',
            name: 'src',
            path: '/src',
            type: 'directory',
            modified: new Date(),
            isExpanded: true,
            children: [
              {
                id: 'app',
                name: 'App.tsx',
                path: '/src/App.tsx',
                type: 'file',
                size: 2048,
                modified: new Date(),
              },
              {
                id: 'index',
                name: 'index.tsx',
                path: '/src/index.tsx',
                type: 'file',
                size: 512,
                modified: new Date(),
              }
            ]
          },
          {
            id: 'package',
            name: 'package.json',
            path: '/package.json',
            type: 'file',
            size: 1024,
            modified: new Date(),
          }
        ]
      }
    ];

    setFileSystem(sampleFileSystem);
  }, []);

  const toggleDirectory = (item: FileSystemItem) => {
    const updateItem = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.map(currentItem => {
        if (currentItem.id === item.id) {
          return { ...currentItem, isExpanded: !currentItem.isExpanded };
        }
        if (currentItem.children) {
          return { ...currentItem, children: updateItem(currentItem.children) };
        }
        return currentItem;
      });
    };

    setFileSystem(updateItem(fileSystem));
  };

  const renderTreeItem = (item: FileSystemItem, level: number = 0) => {
    const indent = level * 20;

    return (
      <div key={item.id}>
        <div
          className={`file-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
          style={{ paddingLeft: `${indent}px` }}
          onClick={() => setSelectedItem(item)}
        >
          <div className="file-icon">
            {item.type === 'directory' ? (
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDirectory(item);
                }}
                style={{ cursor: 'pointer' }}
              >
                {item.isExpanded ? '📂' : '📁'}
              </span>
            ) : (
              <span>📄</span>
            )}
          </div>
          <span className="file-name">{item.name}</span>
          {item.size && (
            <span className="file-size">{formatBytes(item.size)}</span>
          )}
        </div>
        
        {item.type === 'directory' && item.isExpanded && item.children && (
          <div className="directory-children">
            {item.children.map(child => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-manager">
      <div className="file-manager-header">
        <h3>📁 File Manager</h3>
        <div className="view-mode-selector">
          <button 
            className={viewMode === 'tree' ? 'active' : ''}
            onClick={() => setViewMode('tree')}
          >
            Tree
          </button>
          <button 
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
          <button 
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
        </div>
      </div>

      <div className={`file-manager-content view-${viewMode}`}>
        {fileSystem.map(item => renderTreeItem(item))}
      </div>

      {selectedItem && (
        <div className="file-details">
          <h4>File Details</h4>
          <p><strong>Name:</strong> {selectedItem.name}</p>
          <p><strong>Path:</strong> {selectedItem.path}</p>
          <p><strong>Type:</strong> {selectedItem.type}</p>
          {selectedItem.size && (
            <p><strong>Size:</strong> {formatBytes(selectedItem.size)}</p>
          )}
          <p><strong>Modified:</strong> {selectedItem.modified.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
