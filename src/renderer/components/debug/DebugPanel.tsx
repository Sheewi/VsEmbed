import React, { useState, useEffect } from 'react';

export interface DebugMessage {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: Date;
  source?: string;
  stack?: string;
}

export const DebugPanel: React.FC = () => {
  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    // Add sample debug messages
    const sampleMessages: DebugMessage[] = [
      {
        id: '1',
        level: 'info',
        message: 'AI Interface Manager initialized successfully',
        timestamp: new Date(),
        source: 'AIInterfaceManager'
      },
      {
        id: '2',
        level: 'debug',
        message: 'Loading 309 pages and 29 components...',
        timestamp: new Date(),
        source: 'ComponentRegistry'
      },
      {
        id: '3',
        level: 'warn',
        message: 'Some AI models may take longer to load',
        timestamp: new Date(),
        source: 'AIModelManager'
      }
    ];

    setMessages(sampleMessages);
  }, []);

  const filteredMessages = messages.filter(msg => 
    filter === 'all' || msg.level === filter
  );

  return (
    <div className="debug-panel">
      <div className="debug-header">
        <h3>🐞 Debug Console</h3>
        <div className="debug-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="debug-filter"
          >
            <option value="all">All</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
            <option value="warn">Warnings</option>
            <option value="error">Errors</option>
          </select>
          <button 
            className="clear-btn"
            onClick={() => setMessages([])}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="debug-messages">
        {filteredMessages.map(msg => (
          <div key={msg.id} className={`debug-message level-${msg.level}`}>
            <span className="timestamp">
              {msg.timestamp.toLocaleTimeString()}
            </span>
            <span className={`level-badge level-${msg.level}`}>
              {msg.level.toUpperCase()}
            </span>
            {msg.source && (
              <span className="source">[{msg.source}]</span>
            )}
            <span className="message">{msg.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
