import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ConfigurationManager, VSCodeSettings } from '../../core/config/ConfigurationManager';
import { GrokService, GrokConversation, GrokMessage } from '../../ai/grok-service';
import './GrokChatPanel.css';

interface GrokChatPanelProps {
  configManager: ConfigurationManager;
  grokService: GrokService;
  isVisible: boolean;
  onToggle: () => void;
}

interface ChatInput {
  message: string;
  context?: string;
  systemPrompt?: string;
}

export const GrokChatPanel: React.FC<GrokChatPanelProps> = ({
  configManager,
  grokService,
  isVisible,
  onToggle,
}) => {
  const [conversations, setConversations] = useState<GrokConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [settings, setSettings] = useState<VSCodeSettings>(configManager.getVSCodeSettings());
  const [streamingContent, setStreamingContent] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversations, streamingContent, scrollToBottom]);

  // Initialize and setup event listeners
  useEffect(() => {
    const handleConfigUpdate = (config: any) => {
      if (config.vscode) {
        setSettings(config.vscode);
      }
    };

    const handleConversationCreated = (conversation: GrokConversation) => {
      setConversations(prev => [...prev, conversation]);
      if (!activeConversationId) {
        setActiveConversationId(conversation.id);
      }
    };

    const handleMessageReceived = ({ conversationId, message }: any) => {
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, messages: [...conv.messages, message], updatedAt: Date.now() }
          : conv
      ));
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingContent('');
    };

    const handleStreamChunk = ({ conversationId, chunk, fullContent }: any) => {
      setStreamingContent(fullContent);
    };

    const handleStreamComplete = ({ conversationId, content }: any) => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          const lastMessage = conv.messages[conv.messages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            return {
              ...conv,
              messages: [...conv.messages.slice(0, -1), { ...lastMessage, content }],
              updatedAt: Date.now(),
            };
          }
        }
        return conv;
      }));
      setIsStreaming(false);
      setStreamingContent('');
    };

    const handleConnectionTest = ({ success }: any) => {
      setConnectionStatus(success ? 'connected' : 'disconnected');
    };

    configManager.on('configSaved', handleConfigUpdate);
    grokService.on('conversationCreated', handleConversationCreated);
    grokService.on('messageReceived', handleMessageReceived);
    grokService.on('streamChunk', handleStreamChunk);
    grokService.on('streamComplete', handleStreamComplete);
    grokService.on('connectionTest', handleConnectionTest);

    // Load existing conversations
    setConversations(grokService.getAllConversations());

    // Test connection on mount
    testConnection();

    return () => {
      configManager.off('configSaved', handleConfigUpdate);
      grokService.off('conversationCreated', handleConversationCreated);
      grokService.off('messageReceived', handleMessageReceived);
      grokService.off('streamChunk', handleStreamChunk);
      grokService.off('streamComplete', handleStreamComplete);
      grokService.off('connectionTest', handleConnectionTest);
    };
  }, [configManager, grokService, activeConversationId]);

  const testConnection = async () => {
    setConnectionStatus('testing');
    await grokService.testConnection();
  };

  const createNewConversation = async () => {
    const id = await grokService.createConversation();
    setActiveConversationId(id);
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
    setStreamingContent('');
  };

  const deleteConversation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      grokService.deleteConversation(id);
      setConversations(prev => prev.filter(conv => conv.id !== id));
      if (activeConversationId === id) {
        const remaining = conversations.filter(conv => conv.id !== id);
        setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading || !activeConversationId) return;

    const message = currentMessage.trim();
    setCurrentMessage('');
    setIsLoading(true);
    setIsStreaming(true);

    try {
      // Add user message to conversation immediately
      setConversations(prev => prev.map(conv =>
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: [...conv.messages, {
                role: 'user' as const,
                content: message,
                timestamp: Date.now(),
              }],
              updatedAt: Date.now(),
            }
          : conv
      ));

      await grokService.sendMessage(activeConversationId, message, {
        stream: true,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      setIsStreaming(false);
      // Show error message
      setConversations(prev => prev.map(conv =>
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: [...conv.messages, {
                role: 'assistant' as const,
                content: `Error: ${error.message}`,
                timestamp: Date.now(),
              }],
            }
          : conv
      ));
    }
  };

  const cancelStreaming = () => {
    if (activeConversationId) {
      grokService.cancelStream(activeConversationId);
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const exportConversation = () => {
    if (!activeConversation) return;
    
    const exportData = {
      title: activeConversation.title,
      messages: activeConversation.messages,
      createdAt: new Date(activeConversation.createdAt).toISOString(),
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grok-conversation-${activeConversation.title.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMessage = (message: GrokMessage, index: number) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    
    return (
      <div
        key={index}
        className={`grok-message ${isUser ? 'user' : isSystem ? 'system' : 'assistant'}`}
      >
        <div className="message-header">
          <span className="message-role">
            {isUser ? '👤 You' : isSystem ? '⚙️ System' : '🤖 Grok'}
          </span>
          {message.timestamp && (
            <span className="message-time">
              {formatTime(message.timestamp)}
            </span>
          )}
        </div>
        <div className="message-content">
          {message.content.split('\n').map((line, lineIndex) => (
            <div key={lineIndex}>
              {line.includes('```') ? (
                <pre className="code-block">
                  <code>{line.replace(/```[\w]*\n?/g, '')}</code>
                </pre>
              ) : (
                line
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <div className={`grok-chat-panel theme-${settings.theme}`}>
      <div className="grok-header">
        <div className="header-left">
          <h3 className="panel-title">🤖 Grok AI Assistant</h3>
          <div className={`connection-status ${connectionStatus}`}>
            <span className="status-indicator"></span>
            {connectionStatus === 'connected' && 'Connected'}
            {connectionStatus === 'disconnected' && 'Disconnected'}
            {connectionStatus === 'testing' && 'Testing...'}
          </div>
        </div>
        <div className="header-actions">
          <button
            className="action-button"
            onClick={testConnection}
            disabled={connectionStatus === 'testing'}
            title="Test Connection"
          >
            🔄
          </button>
          <button
            className="action-button"
            onClick={createNewConversation}
            title="New Conversation"
          >
            ➕
          </button>
          {activeConversation && (
            <button
              className="action-button"
              onClick={exportConversation}
              title="Export Conversation"
            >
              💾
            </button>
          )}
          <button
            className="action-button close-button"
            onClick={onToggle}
            title="Close Panel"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="grok-content">
        <div className="conversations-sidebar">
          <div className="sidebar-header">
            <h4>Conversations</h4>
            <span className="conversation-count">{conversations.length}</span>
          </div>
          <div className="conversations-list">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${activeConversationId === conv.id ? 'active' : ''}`}
                onClick={() => selectConversation(conv.id)}
              >
                <div className="conversation-title">{conv.title}</div>
                <div className="conversation-meta">
                  <span className="message-count">{conv.messages.length} messages</span>
                  <span className="last-updated">
                    {formatTime(conv.updatedAt)}
                  </span>
                </div>
                <button
                  className="delete-conversation"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  title="Delete Conversation"
                >
                  🗑️
                </button>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="empty-state">
                <p>No conversations yet</p>
                <button onClick={createNewConversation}>Start a conversation</button>
              </div>
            )}
          </div>
        </div>

        <div className="chat-area">
          {activeConversation ? (
            <>
              <div className="messages-container">
                <div className="messages-list">
                  {activeConversation.messages.map((message, index) =>
                    renderMessage(message, index)
                  )}
                  {isStreaming && streamingContent && (
                    <div className="grok-message assistant streaming">
                      <div className="message-header">
                        <span className="message-role">🤖 Grok</span>
                        <button
                          className="cancel-stream"
                          onClick={cancelStreaming}
                          title="Cancel Generation"
                        >
                          ⏹️
                        </button>
                      </div>
                      <div className="message-content">
                        {streamingContent}
                        <span className="typing-indicator">▋</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="input-area">
                <div className="input-container">
                  <textarea
                    ref={inputRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={connectionStatus === 'connected' 
                      ? "Ask Grok anything... (Enter to send, Shift+Enter for new line)"
                      : "Please configure Grok API key in settings to start chatting"
                    }
                    disabled={isLoading || connectionStatus !== 'connected'}
                    className="message-input"
                    rows={3}
                  />
                  <div className="input-actions">
                    <button
                      onClick={sendMessage}
                      disabled={!currentMessage.trim() || isLoading || connectionStatus !== 'connected'}
                      className="send-button"
                    >
                      {isLoading ? '⏳' : '📤'}
                    </button>
                  </div>
                </div>
                {isStreaming && (
                  <div className="streaming-status">
                    <span>🤖 Grok is thinking...</span>
                    <button onClick={cancelStreaming} className="cancel-button">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-conversation">
              <div className="welcome-message">
                <h3>Welcome to Grok AI Assistant</h3>
                <p>Create a new conversation to start chatting with Grok.</p>
                <button onClick={createNewConversation} className="cta-button">
                  Start New Conversation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grok-footer">
        <div className="usage-stats">
          <span>Conversations: {conversations.length}</span>
          <span>Total Messages: {conversations.reduce((sum, conv) => sum + conv.messages.length, 0)}</span>
        </div>
        <div className="ai-model">
          Model: {grokService.getConfig().model}
        </div>
      </div>
    </div>
  );
};
