import React, { useEffect, useRef, useState } from 'react';
import { useRunner } from '../contexts/RunnerContext';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useNotifications } from '../contexts/NotificationContext';
import '../styles/TerminalPane.css';

interface TerminalTab {
  id: string;
  name: string;
  type: 'bash' | 'node' | 'python' | 'docker';
  isActive: boolean;
  history: TerminalMessage[];
  currentInput: string;
}

interface TerminalMessage {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
  timestamp: Date;
}

export const TerminalPane: React.FC = () => {
  const { runStatus, buildStatus, output, executeCommand, buildProject, startProject, stopProject } = useRunner();
  const { currentWorkspace } = useWorkspace();
  const { addNotification } = useNotifications();
  
  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: 'main',
      name: 'Terminal',
      type: 'bash',
      isActive: true,
      history: [
        {
          id: '1',
          type: 'system',
          content: 'Welcome to VSEmbed AI DevTool Terminal',
          timestamp: new Date(),
        }
      ],
      currentInput: '',
    }
  ]);
  
  const [activeTabId, setActiveTabId] = useState('main');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const electronAPI = (window as any).electronAPI;

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [tabs, output]);

  useEffect(() => {
    // Update terminal output when runner output changes
    if (output.length > 0) {
      const activeTab = tabs.find(tab => tab.id === activeTabId);
      if (activeTab) {
        const newMessages = output.map((line, index) => ({
          id: `output_${Date.now()}_${index}`,
          type: line.includes('Error:') || line.includes('error:') ? 'error' as const : 'output' as const,
          content: line,
          timestamp: new Date(),
        }));

        setTabs(prevTabs =>
          prevTabs.map(tab =>
            tab.id === activeTabId
              ? { ...tab, history: [...tab.history, ...newMessages] }
              : tab
          )
        );
      }
    }
  }, [output, activeTabId]);

  const getActiveTab = () => tabs.find(tab => tab.id === activeTabId);

  const addMessage = (tabId: string, message: Omit<TerminalMessage, 'id' | 'timestamp'>) => {
    const newMessage: TerminalMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
    };

    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId
          ? { ...tab, history: [...tab.history, newMessage] }
          : tab
      )
    );
  };

  const updateTabInput = (tabId: string, input: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? { ...tab, currentInput: input } : tab
      )
    );
  };

  const executeTerminalCommand = async (command: string) => {
    const activeTab = getActiveTab();
    if (!activeTab || !electronAPI) return;

    // Add command to history
    addMessage(activeTabId, {
      type: 'input',
      content: `$ ${command}`,
    });

    // Update command history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Clear current input
    updateTabInput(activeTabId, '');

    try {
      // Handle built-in commands
      if (command.startsWith('cd ')) {
        const path = command.substring(3).trim();
        await electronAPI.terminal?.changeDirectory(path);
        addMessage(activeTabId, {
          type: 'system',
          content: `Changed directory to: ${path}`,
        });
        return;
      }

      if (command === 'clear') {
        setTabs(prevTabs =>
          prevTabs.map(tab =>
            tab.id === activeTabId
              ? { ...tab, history: [] }
              : tab
          )
        );
        return;
      }

      if (command === 'pwd') {
        const cwd = currentWorkspace?.path || process.cwd();
        addMessage(activeTabId, {
          type: 'output',
          content: cwd,
        });
        return;
      }

      // Execute command through runner context
      await executeCommand(command);

    } catch (error) {
      addMessage(activeTabId, {
        type: 'error',
        content: `Error: ${error instanceof Error ? error.message : 'Command failed'}`,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const activeTab = getActiveTab();
    if (!activeTab) return;

    if (e.key === 'Enter') {
      const command = activeTab.currentInput.trim();
      if (command) {
        executeTerminalCommand(command);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        updateTabInput(activeTabId, commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          updateTabInput(activeTabId, '');
        } else {
          setHistoryIndex(newIndex);
          updateTabInput(activeTabId, commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // TODO: Implement command completion
    }
  };

  const createNewTab = (type: TerminalTab['type']) => {
    const newTab: TerminalTab = {
      id: `tab_${Date.now()}`,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type,
      isActive: false,
      history: [
        {
          id: '1',
          type: 'system',
          content: `${type} terminal ready`,
          timestamp: new Date(),
        }
      ],
      currentInput: '',
    };

    setTabs(prevTabs => [
      ...prevTabs.map(tab => ({ ...tab, isActive: false })),
      { ...newTab, isActive: true }
    ]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length <= 1) return; // Keep at least one tab

    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabId);
      
      // If closing active tab, switch to first remaining tab
      if (tabId === activeTabId && newTabs.length > 0) {
        setActiveTabId(newTabs[0].id);
        newTabs[0].isActive = true;
      }
      
      return newTabs;
    });
  };

  const switchTab = (tabId: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab => ({ ...tab, isActive: tab.id === tabId }))
    );
    setActiveTabId(tabId);
    
    // Focus input after tab switch
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const getPrompt = (tab: TerminalTab) => {
    const cwd = currentWorkspace?.name || 'vsembed';
    switch (tab.type) {
      case 'node':
        return `node:${cwd}> `;
      case 'python':
        return `python:${cwd}> `;
      case 'docker':
        return `docker:${cwd}> `;
      default:
        return `${cwd}$ `;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const activeTab = getActiveTab();

  return (
    <div className="terminal-pane">
      <div className="terminal-header">
        <div className="terminal-tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`terminal-tab ${tab.id === activeTabId ? 'active' : ''}`}
              onClick={() => switchTab(tab.id)}
            >
              <span className="tab-icon">
                {tab.type === 'bash' && '🖥️'}
                {tab.type === 'node' && '🟢'}
                {tab.type === 'python' && '🐍'}
                {tab.type === 'docker' && '🐳'}
              </span>
              <span className="tab-name">{tab.name}</span>
              {tabs.length > 1 && (
                <button
                  className="tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="terminal-actions">
          <div className="new-terminal-dropdown">
            <button className="action-btn" title="New Terminal">
              ➕
            </button>
            <div className="dropdown-content">
              <button onClick={() => createNewTab('bash')}>🖥️ Bash</button>
              <button onClick={() => createNewTab('node')}>🟢 Node.js</button>
              <button onClick={() => createNewTab('python')}>🐍 Python</button>
              <button onClick={() => createNewTab('docker')}>🐳 Docker</button>
            </div>
          </div>
          
          <div className="runner-controls">
            <button
              className={`control-btn ${buildStatus === 'building' ? 'active' : ''}`}
              onClick={buildProject}
              disabled={buildStatus === 'building'}
              title="Build Project"
            >
              🔨
            </button>
            <button
              className={`control-btn ${runStatus === 'running' ? 'active' : ''}`}
              onClick={runStatus === 'running' ? stopProject : startProject}
              title={runStatus === 'running' ? 'Stop Project' : 'Start Project'}
            >
              {runStatus === 'running' ? '⏹️' : '▶️'}
            </button>
          </div>
          
          <button
            className="action-btn"
            onClick={() => {
              if (activeTab) {
                setTabs(prevTabs =>
                  prevTabs.map(tab =>
                    tab.id === activeTabId
                      ? { ...tab, history: [] }
                      : tab
                  )
                );
              }
            }}
            title="Clear Terminal"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="terminal-content" ref={terminalRef}>
        {activeTab && (
          <div className="terminal-messages">
            {activeTab.history.map(message => (
              <div key={message.id} className={`terminal-message ${message.type}`}>
                <span className="message-timestamp">
                  {formatTimestamp(message.timestamp)}
                </span>
                <span className="message-content">
                  {message.content}
                </span>
              </div>
            ))}
            
            <div className="terminal-input-line">
              <span className="terminal-prompt">{getPrompt(activeTab)}</span>
              <input
                ref={inputRef}
                type="text"
                value={activeTab.currentInput}
                onChange={(e) => updateTabInput(activeTabId, e.target.value)}
                onKeyDown={handleKeyDown}
                className="terminal-input"
                autoFocus
                spellCheck={false}
              />
            </div>
          </div>
        )}
      </div>

      <div className="terminal-status">
        <div className="status-left">
          <span className={`status-indicator ${runStatus}`}>
            {runStatus === 'running' && '🟢 Running'}
            {runStatus === 'stopped' && '🔴 Stopped'}
            {runStatus === 'error' && '🟡 Error'}
          </span>
          {buildStatus === 'building' && (
            <span className="status-indicator building">🔨 Building...</span>
          )}
        </div>
        
        <div className="status-right">
          {currentWorkspace && (
            <span className="workspace-info">
              📁 {currentWorkspace.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
