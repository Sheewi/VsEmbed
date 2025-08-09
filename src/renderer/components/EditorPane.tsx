import React, { useEffect, useRef, useState } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useNotifications } from '../contexts/NotificationContext';
import '../styles/EditorPane.css';

// Monaco editor will be loaded dynamically
declare global {
  interface Window {
    monaco: any;
  }
}

interface EditorTab {
  id: string;
  path: string;
  name: string;
  language: string;
  content: string;
  isDirty: boolean;
  isActive: boolean;
}

export const EditorPane: React.FC = () => {
  const { currentWorkspace, openFile, saveFile, createFile } = useWorkspace();
  const { addNotification } = useNotifications();
  
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isMonacoLoaded, setIsMonacoLoaded] = useState(false);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<any>(null);
  const electronAPI = (window as any).electronAPI;

  // Load Monaco Editor
  useEffect(() => {
    const loadMonaco = async () => {
      try {
        // Check if Monaco is already loaded
        if (window.monaco) {
          setIsMonacoLoaded(true);
          return;
        }

        // Load Monaco from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
        script.onload = () => {
          const require = (window as any).require;
          require.config({ 
            paths: { 
              vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' 
            } 
          });

          require(['vs/editor/editor.main'], () => {
            // Configure Monaco for VS Code theme
            window.monaco.editor.defineTheme('vs-code-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [],
              colors: {
                'editor.background': '#1e1e1e',
                'editor.foreground': '#d4d4d4',
                'editor.lineHighlightBackground': '#2d2d30',
                'editorCursor.foreground': '#d4d4d4',
                'editor.selectionBackground': '#264f78',
                'editor.inactiveSelectionBackground': '#3a3d41'
              }
            });

            window.monaco.editor.setTheme('vs-code-dark');
            setIsMonacoLoaded(true);
          });
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load Monaco:', error);
        addNotification({
          type: 'error',
          title: 'Editor Error',
          message: 'Failed to load code editor',
        });
      }
    };

    loadMonaco();
  }, [addNotification]);

  // Initialize Monaco editor when container is ready
  useEffect(() => {
    if (!isMonacoLoaded || !editorRef.current || monacoEditorRef.current) return;

    try {
      monacoEditorRef.current = window.monaco.editor.create(editorRef.current, {
        value: '// Welcome to VSEmbed AI DevTool\n// Start by opening a file or creating a new one',
        language: 'javascript',
        theme: 'vs-code-dark',
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        wordWrap: 'on',
        folding: true,
        selectOnLineNumbers: true,
        matchBrackets: 'always',
        contextmenu: true,
        mouseWheelZoom: true,
        multiCursorModifier: 'ctrlCmd',
        formatOnPaste: true,
        formatOnType: true,
      });

      // Handle content changes
      monacoEditorRef.current.onDidChangeModelContent(() => {
        if (activeTabId) {
          setTabs(prevTabs => 
            prevTabs.map(tab => 
              tab.id === activeTabId 
                ? { ...tab, content: monacoEditorRef.current.getValue(), isDirty: true }
                : tab
            )
          );
        }
      });

      // Handle save shortcut
      monacoEditorRef.current.addCommand(
        window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KeyS,
        () => {
          if (activeTabId) {
            handleSaveFile(activeTabId);
          }
        }
      );

    } catch (error) {
      console.error('Failed to initialize Monaco editor:', error);
      addNotification({
        type: 'error',
        title: 'Editor Error',
        message: 'Failed to initialize code editor',
      });
    }
  }, [isMonacoLoaded, activeTabId, addNotification]);

  // Update editor when active tab changes
  useEffect(() => {
    if (!monacoEditorRef.current) return;

    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (activeTab) {
      const model = window.monaco.editor.createModel(
        activeTab.content,
        activeTab.language,
        window.monaco.Uri.file(activeTab.path)
      );
      monacoEditorRef.current.setModel(model);
    }
  }, [activeTabId, tabs]);

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'json': 'json',
      'md': 'markdown',
      'yaml': 'yaml',
      'yml': 'yaml',
      'xml': 'xml',
      'php': 'php',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'rb': 'ruby',
      'sh': 'shell',
      'sql': 'sql',
    };
    return langMap[ext || ''] || 'plaintext';
  };

  const handleOpenFile = async (filePath: string) => {
    if (!electronAPI) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Electron API not available',
      });
      return;
    }

    try {
      const content = await openFile(filePath);
      const fileName = filePath.split('/').pop() || 'untitled';
      const language = getLanguageFromExtension(fileName);
      
      const existingTab = tabs.find(tab => tab.path === filePath);
      if (existingTab) {
        setActiveTabId(existingTab.id);
        return;
      }

      const newTab: EditorTab = {
        id: `tab_${Date.now()}`,
        path: filePath,
        name: fileName,
        language,
        content,
        isDirty: false,
        isActive: true,
      };

      setTabs(prevTabs => [...prevTabs, newTab]);
      setActiveTabId(newTab.id);

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Open File',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const handleSaveFile = async (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab || !electronAPI) return;

    try {
      await saveFile(tab.path, tab.content);
      
      setTabs(prevTabs => 
        prevTabs.map(t => 
          t.id === tabId ? { ...t, isDirty: false } : t
        )
      );

      addNotification({
        type: 'success',
        title: 'File Saved',
        message: `${tab.name} saved successfully`,
      });

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Save File',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const handleCloseTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;

    if (tab.isDirty) {
      const shouldSave = window.confirm(`${tab.name} has unsaved changes. Save before closing?`);
      if (shouldSave) {
        handleSaveFile(tabId);
      }
    }

    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(t => t.id !== tabId);
      
      // If we're closing the active tab, switch to another tab
      if (tabId === activeTabId) {
        const remainingTabs = newTabs;
        if (remainingTabs.length > 0) {
          setActiveTabId(remainingTabs[remainingTabs.length - 1].id);
        } else {
          setActiveTabId(null);
          if (monacoEditorRef.current) {
            monacoEditorRef.current.setValue('// No files open\n// Use File > New or File > Open to get started');
          }
        }
      }
      
      return newTabs;
    });
  };

  const handleNewFile = async () => {
    if (!newFileName.trim()) return;

    const fileName = newFileName.trim();
    const language = getLanguageFromExtension(fileName);
    const filePath = currentWorkspace ? `${currentWorkspace.path}/${fileName}` : fileName;

    try {
      await createFile(filePath, '');
      
      const newTab: EditorTab = {
        id: `tab_${Date.now()}`,
        path: filePath,
        name: fileName,
        language,
        content: '',
        isDirty: false,
        isActive: true,
      };

      setTabs(prevTabs => [...prevTabs, newTab]);
      setActiveTabId(newTab.id);
      setShowNewFileDialog(false);
      setNewFileName('');

      addNotification({
        type: 'success',
        title: 'File Created',
        message: `${fileName} created successfully`,
      });

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Create File',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const formatFilePath = (path: string) => {
    if (!currentWorkspace) return path;
    return path.replace(currentWorkspace.path + '/', '');
  };

  return (
    <div className="editor-pane">
      <div className="editor-header">
        <div className="editor-tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`editor-tab ${tab.id === activeTabId ? 'active' : ''} ${tab.isDirty ? 'dirty' : ''}`}
              onClick={() => setActiveTabId(tab.id)}
              title={formatFilePath(tab.path)}
            >
              <span className="tab-name">{tab.name}</span>
              {tab.isDirty && <span className="dirty-indicator">●</span>}
              <button
                className="tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(tab.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div className="editor-actions">
          <button
            className="action-btn"
            onClick={() => setShowNewFileDialog(true)}
            title="New File"
          >
            📄
          </button>
          <button
            className="action-btn"
            onClick={() => {
              if (electronAPI?.workspace?.openFile) {
                electronAPI.workspace.openFile().then((filePath: string) => {
                  if (filePath) handleOpenFile(filePath);
                });
              }
            }}
            title="Open File"
          >
            📂
          </button>
          {activeTabId && (
            <button
              className="action-btn"
              onClick={() => handleSaveFile(activeTabId)}
              title="Save File (Ctrl+S)"
            >
              💾
            </button>
          )}
        </div>
      </div>

      <div className="editor-container">
        <div ref={editorRef} className="monaco-editor" />
        {!isMonacoLoaded && (
          <div className="editor-loading">
            <div className="loading-spinner"></div>
            <p>Loading editor...</p>
          </div>
        )}
      </div>

      {showNewFileDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New File</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowNewFileDialog(false);
                  setNewFileName('');
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <label>
                File name:
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNewFile();
                    } else if (e.key === 'Escape') {
                      setShowNewFileDialog(false);
                      setNewFileName('');
                    }
                  }}
                  placeholder="example.js"
                  autoFocus
                />
              </label>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowNewFileDialog(false);
                  setNewFileName('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleNewFile}
                disabled={!newFileName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
