import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../contexts/AIContext';
import { useNotifications } from '../contexts/NotificationContext';
import '../styles/ChatPane.css';

interface ActionPlanProps {
  plan: any;
  onApprove: (actionId: string) => void;
  onReject: (actionId: string) => void;
  onExecute: () => void;
}

const ActionPlanView: React.FC<ActionPlanProps> = ({ plan, onApprove, onReject, onExecute }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const approvedActions = plan.actions.filter((action: any) => action.approved);
  const rejectedActions = plan.actions.filter((action: any) => !action.approved && action.approved !== undefined);
  const pendingActions = plan.actions.filter((action: any) => action.approved === undefined);

  return (
    <div className="action-plan">
      <div className="plan-header">
        <h4>Action Plan</h4>
        <span
          className="risk-badge"
          style={{ backgroundColor: getRiskColor(plan.risk_assessment) }}
        >
          {plan.risk_assessment.toUpperCase()} RISK
        </span>
      </div>

      <div className="plan-summary">
        <p>{plan.summary}</p>
        <div className="plan-stats">
          <span>Estimated time: {Math.round(plan.estimated_time / 60)} min</span>
          <span>{plan.actions.length} action(s)</span>
        </div>
      </div>

      <div className="actions-list">
        {plan.actions.map((action: any) => (
          <div key={action.id} className={`action-item ${action.approved === true ? 'approved' : action.approved === false ? 'rejected' : 'pending'}`}>
            <div className="action-header">
              <span className="action-type">{action.type}</span>
              <span
                className="action-risk"
                style={{ color: getRiskColor(action.risk_level) }}
              >
                {action.risk_level}
              </span>
            </div>

            <div className="action-description">
              {action.description}
            </div>

            <div className="action-preview">
              <code>{action.preview}</code>
            </div>

            {action.approved === undefined && (
              <div className="action-buttons">
                <button
                  className="approve-btn"
                  onClick={() => onApprove(action.id)}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => onReject(action.id)}
                >
                  Reject
                </button>
              </div>
            )}

            {action.approved === true && (
              <div className="action-status approved">✓ Approved</div>
            )}

            {action.approved === false && (
              <div className="action-status rejected">✗ Rejected</div>
            )}

            {action.executed && (
              <div className="action-status executed">🚀 Executed</div>
            )}
          </div>
        ))}
      </div>

      {approvedActions.length > 0 && !plan.actions.every((a: any) => a.executed) && (
        <div className="plan-actions">
          <button
            className="execute-plan-btn"
            onClick={onExecute}
          >
            Execute {approvedActions.length} Approved Action(s)
          </button>
        </div>
      )}
    </div>
  );
};

export const ChatPane: React.FC = () => {
  const {
    messages,
    isProcessing,
    currentModel,
    availableModels,
    activePlan,
    sendMessage,
    clearConversation,
    setModel,
    approveAction,
    rejectAction,
    executeApprovedPlan,
    regenerateResponse
  } = useAI();

  const { addNotification } = useNotifications();
  const [inputValue, setInputValue] = useState('');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isProcessing) return;

    const message = inputValue.trim();
    setInputValue('');

    try {
      await sendMessage(message);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Send Message',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleModelChange = async (modelName: string) => {
    setShowModelSelector(false);
    await setModel(modelName);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handlePlanAction = (action: 'approve' | 'reject', actionId: string) => {
    if (!activePlan) return;

    if (action === 'approve') {
      approveAction(activePlan.id, actionId);
    } else {
      rejectAction(activePlan.id, actionId);
    }
  };

  const handleExecutePlan = async () => {
    if (!activePlan) return;

    try {
      await executeApprovedPlan(activePlan.id);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Execute Plan',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  return (
    <div className="chat-pane">
      <div className="chat-header">
        <div className="chat-title">
          <h3>AI Assistant</h3>
          <div className="model-selector">
            <button
              className="current-model"
              onClick={() => setShowModelSelector(!showModelSelector)}
            >
              {currentModel} ▼
            </button>
            {showModelSelector && (
              <div className="model-dropdown">
                {availableModels.map(model => (
                  <button
                    key={model}
                    className={`model-option ${model === currentModel ? 'active' : ''}`}
                    onClick={() => handleModelChange(model)}
                  >
                    {model}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="chat-actions">
          <button
            className="clear-btn"
            onClick={clearConversation}
            title="Clear conversation"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="welcome-message">
              <h4>Welcome to VSEmbed AI DevTool</h4>
              <p>I'm your AI assistant. I can help you write, debug, and execute code. Just describe what you'd like to build!</p>
              <div className="example-prompts">
                <button onClick={() => setInputValue("Create a React component for a todo list")}>
                  Create a React component
                </button>
                <button onClick={() => setInputValue("Help me debug this error")}>
                  Debug an error
                </button>
                <button onClick={() => setInputValue("Set up a new Python project")}>
                  Set up a project
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <div className="message-header">
                  <span className="message-role">
                    {message.role === 'user' ? '👤' : message.role === 'assistant' ? '🤖' : '⚙️'}
                    {message.role}
                  </span>
                  <span className="message-time">
                    {formatTimestamp(message.timestamp)}
                  </span>
                  {message.role === 'assistant' && (
                    <button
                      className="regenerate-btn"
                      onClick={() => regenerateResponse(message.id)}
                      title="Regenerate response"
                    >
                      🔄
                    </button>
                  )}
                </div>

                <div className="message-content">
                  <pre>{message.content}</pre>
                </div>

                {message.plan && (
                  <ActionPlanView
                    plan={message.plan}
                    onApprove={(actionId) => handlePlanAction('approve', actionId)}
                    onReject={(actionId) => handlePlanAction('reject', actionId)}
                    onExecute={handleExecutePlan}
                  />
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="message assistant processing">
                <div className="message-header">
                  <span className="message-role">🤖 assistant</span>
                  <span className="processing-indicator">Thinking...</span>
                </div>
                <div className="message-content">
                  <div className="typing-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you'd like to build or ask for help..."
            disabled={isProcessing}
            rows={2}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className="send-btn"
          >
            {isProcessing ? '⏳' : '📤'}
          </button>
        </div>
      </form>
    </div>
  );
};
