import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useNotifications } from './NotificationContext';

interface WorkspaceFile {
  path: string;
  name: string;
  type: 'file' | 'directory';
  children?: WorkspaceFile[];
  size?: number;
  modified?: Date;
}

interface WorkspaceManifest {
  workspace_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  runtime: 'nodejs' | 'python' | 'docker' | 'custom';
  runner: 'docker' | 'sandbox' | 'local';
  extensions: string[];
  ai_policy: any;
  secrets: any;
  version: string;
}

interface WorkspaceContextType {
  isWorkspaceOpen: boolean;
  workspacePath: string | null;
  workspaceName: string | null;
  manifest: WorkspaceManifest | null;
  files: WorkspaceFile[];
  currentFile: string | null;

  // Actions
  createWorkspace: (name: string, template?: string) => Promise<boolean>;
  openWorkspace: (path?: string) => Promise<boolean>;
  exportWorkspace: (targetPath?: string) => Promise<boolean>;
  importWorkspace: (archivePath?: string) => Promise<boolean>;
  refreshFiles: () => Promise<void>;
  openFile: (path: string) => Promise<void>;
  createFile: (path: string, content?: string) => Promise<boolean>;
  deleteFile: (path: string) => Promise<boolean>;
  renameFile: (oldPath: string, newPath: string) => Promise<boolean>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

interface WorkspaceProviderProps {
  children: ReactNode;
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({ children }) => {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [workspacePath, setWorkspacePath] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [manifest, setManifest] = useState<WorkspaceManifest | null>(null);
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  const { addNotification } = useNotifications();

  // Check if electron API is available
  const electronAPI = (window as any).electronAPI;

  const createWorkspace = useCallback(async (name: string, template?: string): Promise<boolean> => {
    if (!electronAPI) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Electron API not available',
      });
      return false;
    }

    try {
      const success = await electronAPI.workspace.create(name, template);

      if (success) {
        setIsWorkspaceOpen(true);
        setWorkspaceName(name);
        addNotification({
          type: 'success',
          title: 'Workspace Created',
          message: `Workspace "${name}" has been created successfully.`,
        });

        await refreshFiles();
      } else {
        addNotification({
          type: 'error',
          title: 'Failed to Create Workspace',
          message: 'An error occurred while creating the workspace.',
        });
      }

      return success;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Create Workspace',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return false;
    }
  }, [electronAPI, addNotification]);

  const openWorkspace = useCallback(async (path?: string): Promise<boolean> => {
    if (!electronAPI) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Electron API not available',
      });
      return false;
    }

    try {
      let targetPath = path;

      // If no path provided, this will trigger the main process to show a dialog
      const success = await electronAPI.workspace.open(targetPath || '');

      if (success) {
        setIsWorkspaceOpen(true);
        setWorkspacePath(targetPath || 'Unknown');
        addNotification({
          type: 'success',
          title: 'Workspace Opened',
          message: 'Workspace has been opened successfully.',
        });

        await refreshFiles();
      } else {
        addNotification({
          type: 'error',
          title: 'Failed to Open Workspace',
          message: 'An error occurred while opening the workspace.',
        });
      }

      return success;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Open Workspace',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return false;
    }
  }, [electronAPI, addNotification]);

  const exportWorkspace = useCallback(async (targetPath?: string): Promise<boolean> => {
    if (!electronAPI || !isWorkspaceOpen) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No workspace open or Electron API not available',
      });
      return false;
    }

    try {
      const success = await electronAPI.workspace.export(targetPath || '');

      if (success) {
        addNotification({
          type: 'success',
          title: 'Workspace Exported',
          message: 'Workspace has been exported successfully.',
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Failed to Export Workspace',
          message: 'An error occurred while exporting the workspace.',
        });
      }

      return success;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Export Workspace',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return false;
    }
  }, [electronAPI, isWorkspaceOpen, addNotification]);

  const importWorkspace = useCallback(async (archivePath?: string): Promise<boolean> => {
    if (!electronAPI) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Electron API not available',
      });
      return false;
    }

    try {
      const success = await electronAPI.workspace.import(archivePath || '');

      if (success) {
        setIsWorkspaceOpen(true);
        addNotification({
          type: 'success',
          title: 'Workspace Imported',
          message: 'Workspace has been imported successfully.',
        });

        await refreshFiles();
      } else {
        addNotification({
          type: 'error',
          title: 'Failed to Import Workspace',
          message: 'An error occurred while importing the workspace.',
        });
      }

      return success;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Import Workspace',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return false;
    }
  }, [electronAPI, addNotification]);

  const refreshFiles = useCallback(async (): Promise<void> => {
    // In a real implementation, this would fetch files from the workspace
    // For now, simulate some files
    const mockFiles: WorkspaceFile[] = [
      {
        path: 'src',
        name: 'src',
        type: 'directory',
        children: [
          {
            path: 'src/index.ts',
            name: 'index.ts',
            type: 'file',
            size: 1024,
            modified: new Date(),
          },
          {
            path: 'src/components',
            name: 'components',
            type: 'directory',
            children: [
              {
                path: 'src/components/App.tsx',
                name: 'App.tsx',
                type: 'file',
                size: 2048,
                modified: new Date(),
              },
            ],
          },
        ],
      },
      {
        path: 'package.json',
        name: 'package.json',
        type: 'file',
        size: 512,
        modified: new Date(),
      },
      {
        path: 'README.md',
        name: 'README.md',
        type: 'file',
        size: 256,
        modified: new Date(),
      },
    ];

    setFiles(mockFiles);
  }, []);

  const openFile = useCallback(async (path: string): Promise<void> => {
    setCurrentFile(path);

    // In a real implementation, this would load the file content
    console.log('Opening file:', path);
  }, []);

  const createFile = useCallback(async (path: string, content: string = ''): Promise<boolean> => {
    // In a real implementation, this would create the file
    console.log('Creating file:', path, 'with content:', content);

    addNotification({
      type: 'success',
      title: 'File Created',
      message: `File "${path}" has been created.`,
    });

    await refreshFiles();
    return true;
  }, [addNotification, refreshFiles]);

  const deleteFile = useCallback(async (path: string): Promise<boolean> => {
    // In a real implementation, this would delete the file
    console.log('Deleting file:', path);

    addNotification({
      type: 'success',
      title: 'File Deleted',
      message: `File "${path}" has been deleted.`,
    });

    await refreshFiles();
    return true;
  }, [addNotification, refreshFiles]);

  const renameFile = useCallback(async (oldPath: string, newPath: string): Promise<boolean> => {
    // In a real implementation, this would rename the file
    console.log('Renaming file from:', oldPath, 'to:', newPath);

    addNotification({
      type: 'success',
      title: 'File Renamed',
      message: `File renamed from "${oldPath}" to "${newPath}".`,
    });

    await refreshFiles();
    return true;
  }, [addNotification, refreshFiles]);

  // Load initial workspace state
  useEffect(() => {
    if (electronAPI) {
      // Check if there's a workspace already open
      // This would be implemented in the main process
    }
  }, [electronAPI]);

  const value: WorkspaceContextType = {
    isWorkspaceOpen,
    workspacePath,
    workspaceName,
    manifest,
    files,
    currentFile,
    createWorkspace,
    openWorkspace,
    exportWorkspace,
    importWorkspace,
    refreshFiles,
    openFile,
    createFile,
    deleteFile,
    renameFile,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
