import React, { useEffect, useRef, useState } from 'react';

export interface Terminal {
  id: string;
  name: string;
  cwd: string;
  isActive: boolean;
}

export const TerminalManager: React.FC = () => {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [activeTerminalId, setActiveTerminalId] = useState<string | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with a default terminal
    const defaultTerminal: Terminal = {
      id: 'terminal-1',
      name: 'Terminal 1',
      cwd: '/home/user/projects',
      isActive: true
    };

    setTerminals([defaultTerminal]);
    setActiveTerminalId(defaultTerminal.id);
    setOutput([
      '$ Welcome to VSEmbed AI Terminal',
      '$ Type "help" for available commands',
      '$ Current directory: /home/user/projects',
      '$ '
    ]);
  }, []);

  const createNewTerminal = () => {
    const newTerminal: Terminal = {
      id: `terminal-${terminals.length + 1}`,
      name: `Terminal ${terminals.length + 1}`,
      cwd: '/home/user/projects',
      isActive: false
    };

    setTerminals(prev => [...prev, newTerminal]);
  };

  const switchTerminal = (terminalId: string) => {
    setTerminals(prev => 
      prev.map(t => ({ ...t, isActive: t.id === terminalId }))
    );
    setActiveTerminalId(terminalId);
  };

  const executeCommand = (command: string) => {
    setOutput(prev => [...prev, `$ ${command}`]);
    
    // Simple command simulation
    let response = '';
    switch (command.toLowerCase().trim()) {
      case 'help':
        response = `Available commands:
  help - Show this help message
  ls - List files and directories
  pwd - Show current directory
  clear - Clear terminal
  npm install - Install npm packages
  npm start - Start development server
  git status - Show git status
  ai-assist - Get AI assistance`;
        break;
      case 'ls':
        response = `total 12
drwxr-xr-x  3 user user 4096 Jan 15 10:30 src/
drwxr-xr-x  2 user user 4096 Jan 15 10:30 node_modules/
-rw-r--r--  1 user user  1234 Jan 15 10:30 package.json
-rw-r--r--  1 user user   567 Jan 15 10:30 README.md`;
        break;
      case 'pwd':
        response = '/home/user/projects/vsembed-ai';
        break;
      case 'clear':
        setOutput(['$ ']);
        return;
      case 'git status':
        response = `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   src/renderer/components/AIInterfaceManager.tsx
  
no changes added to commit`;
        break;
      case 'npm start':
        response = `> vsembed-ai@0.1.0 start
> webpack serve --config webpack.renderer.config.js

✅ Development server starting on http://localhost:3000
🤖 AI features enabled
📦 All 309 pages loaded successfully`;
        break;
      case 'ai-assist':
        response = `🤖 AI Assistant activated!
Available AI features:
- Code completion and suggestions
- Error detection and fixes
- Code refactoring recommendations
- Documentation generation
- Test case generation

Type 'ai-assist <command>' for specific AI help.`;
        break;
      default:
        response = `Command not found: ${command}
Type 'help' for available commands.`;
    }

    setOutput(prev => [...prev, response, '$ ']);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="terminal-manager">
      <div className="terminal-tabs">
        {terminals.map(terminal => (
          <div
            key={terminal.id}
            className={`terminal-tab ${terminal.isActive ? 'active' : ''}`}
            onClick={() => switchTerminal(terminal.id)}
          >
            <span>{terminal.name}</span>
            <button className="close-tab">×</button>
          </div>
        ))}
        <button className="new-terminal-btn" onClick={createNewTerminal}>
          ➕
        </button>
      </div>

      <div ref={terminalRef} className="terminal-content">
        <div className="terminal-output">
          {output.map((line, index) => (
            <div key={index} className="terminal-line">
              {line}
            </div>
          ))}
          <div className="terminal-input-line">
            <span className="prompt">$ </span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="terminal-input"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
};
