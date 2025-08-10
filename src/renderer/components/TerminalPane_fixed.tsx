import React, { useEffect, useRef, useState } from 'react';
import { useRunner } from '../contexts/RunnerContext';
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
  const { status: runnerStatus, isBuilding, isStarting, logs, build, start, stop } = useRunner();

  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: 'main',
      name: 'Terminal',
      type: 'bash',
      isActive: true,
      history: [
        {
          id: 'welcome',
          type: 'system',
          content: 'VsEmbed Terminal - Ready',
          timestamp: new Date(),
        },
      ],
      currentInput: '',
    },
  ]);

  const [activeTabId, setActiveTabId] = useState('main');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [tabs]);

  const handleCommand = async (command: string) => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return;

    // Add command to history
    const commandMessage: TerminalMessage = {
      id: `cmd_${Date.now()}`,
      type: 'input',
      content: `$ ${command}`,
      timestamp: new Date(),
    };

    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === activeTabId
          ? { 
              ...tab, 
              history: [...tab.history, commandMessage],
              currentInput: ''
            }
          : tab
      )
    );

    // Handle special commands
    try {
      let output = '';
      
      switch (command.trim()) {
        case 'clear':
          setTabs(prevTabs =>
            prevTabs.map(tab =>
              tab.id === activeTabId
                ? { ...tab, history: [] }
                : tab
            )
          );
          return;

        case 'build':
          output = 'Starting build...';
          await build();
          break;

        case 'start':
          output = 'Starting application...';
          await start();
          break;

        case 'stop':
          output = 'Stopping application...';
          await stop();
          break;

        case 'status':
          output = `Status: ${runnerStatus.running ? 'Running' : 'Stopped'}\nBuild: ${runnerStatus.last_build?.success ? 'Success' : 'Failed'}`;
          break;

        case 'help':
          output = `Available commands:
  build  - Build the project
  start  - Start the application
  stop   - Stop the application
  status - Show current status
  clear  - Clear terminal
  help   - Show this help`;
          break;

        default:
          output = `Command not recognized: ${command}. Type 'help' for available commands.`;
      }

      // Add output to history
      const outputMessage: TerminalMessage = {
        id: `out_${Date.now()}`,
        type: 'output',
        content: output,
        timestamp: new Date(),
      };

      setTabs(prevTabs =>
        prevTabs.map(tab =>
          tab.id === activeTabId
            ? { ...tab, history: [...tab.history, outputMessage] }
            : tab
        )
      );

    } catch (error) {
      const errorMessage: TerminalMessage = {
        id: `err_${Date.now()}`,
        type: 'error',
        content: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };

      setTabs(prevTabs =>
        prevTabs.map(tab =>
          tab.id === activeTabId
            ? { ...tab, history: [...tab.history, errorMessage] }
            : tab
        )
      );
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const command = event.currentTarget.value.trim();
      if (command) {
        handleCommand(command);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === activeTabId
          ? { ...tab, currentInput: value }
          : tab
      )
    );
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="terminal-pane">
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`terminal-tab ${tab.isActive ? 'active' : ''}`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <span className="tab-icon">💲</span>
              <span className="tab-name">{tab.name}</span>
            </div>
          ))}
        </div>

        <div className="terminal-controls">
          <button
            className="control-btn"
            onClick={() => build()}
            disabled={isBuilding}
            title="Build Project"
          >
            🔨
          </button>
          <button
            className="control-btn"
            onClick={runnerStatus.running ? () => stop() : () => start()}
            title={runnerStatus.running ? 'Stop Project' : 'Start Project'}
          >
            {runnerStatus.running ? '⏹️' : '▶️'}
          </button>
          <button
            className="control-btn"
            onClick={() => handleCommand('clear')}
            title="Clear Terminal"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="terminal-content" ref={terminalRef}>
        {activeTab?.history.map(message => (
          <div key={message.id} className={`terminal-message ${message.type}`}>
            <span className="timestamp">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="content">{message.content}</span>
          </div>
        ))}
      </div>

      {/* Terminal Input */}
      <div className="terminal-input-container">
        <span className="prompt">$</span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={activeTab?.currentInput || ''}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a command..."
          autoFocus
        />
      </div>

      {/* Status Bar */}
      <div className="terminal-status">
        <div className="status-section">
          <span className={`status-indicator ${runnerStatus.running ? 'running' : 'stopped'}`}>
            {runnerStatus.running ? '🟢 Running' : '🔴 Stopped'}
            {isStarting && '🟡 Starting...'}
          </span>
        </div>
        <div className="status-section">
          <span className={`status-indicator ${isBuilding ? 'building' : 'idle'}`}>
            {isBuilding ? '🔨 Building...' : '⚪ Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};
