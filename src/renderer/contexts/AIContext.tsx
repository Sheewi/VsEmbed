import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { useNotifications } from './NotificationContext';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  plan?: ActionPlan;
}

interface ActionPlan {
  id: string;
  summary: string;
  actions: PlannedAction[];
  risk_assessment: 'low' | 'medium' | 'high' | 'critical';
  requires_approval: boolean;
  estimated_time: number;
}

interface PlannedAction {
  id: string;
  type: 'edit' | 'command' | 'file_create' | 'file_delete' | 'file_rename';
  description: string;
  preview: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  approved: boolean;
  executed: boolean;
  metadata: any;
}

interface AIContextType {
  messages: Message[];
  isProcessing: boolean;
  currentModel: string;
  availableModels: string[];
  activePlan: ActionPlan | null;

  // Actions
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
  setModel: (modelName: string) => Promise<boolean>;
  refreshModels: () => Promise<void>;
  approveAction: (planId: string, actionId: string) => void;
  rejectAction: (planId: string, actionId: string) => void;
  executeApprovedPlan: (planId: string) => Promise<boolean>;
  regenerateResponse: (messageId: string) => Promise<void>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentModel, setCurrentModel] = useState('GPT-4');
  const [availableModels, setAvailableModels] = useState<string[]>(['GPT-4', 'GPT-3.5-turbo', 'Claude-3-Opus']);
  const [activePlan, setActivePlan] = useState<ActionPlan | null>(null);

  const { addNotification } = useNotifications();
  const electronAPI = (window as any).electronAPI;
  const messageIdCounter = useRef(0);

  const generateMessageId = () => {
    messageIdCounter.current += 1;
    return `msg_${messageIdCounter.current}_${Date.now()}`;
  };

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!electronAPI) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Electron API not available',
      });
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Send request to AI orchestrator
      const response = await electronAPI.ai.processRequest(content, {
        currentMessages: messages,
        timestamp: new Date().toISOString(),
      });

      // Add AI response message
      const aiMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: response.explanation,
        timestamp: new Date(),
        plan: response.plan,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Set active plan if one was created
      if (response.plan) {
        setActivePlan(response.plan);

        // Show approval notification if required
        if (response.plan.requires_approval) {
          addNotification({
            type: 'info',
            title: 'Action Plan Requires Approval',
            message: `The AI has created a ${response.plan.risk_assessment} risk plan with ${response.plan.actions.length} action(s). Please review and approve individual actions.`,
            duration: 10000,
            actions: [
              {
                label: 'Review Plan',
                action: () => {
                  // Focus on the plan in the UI
                  console.log('Focus on plan:', response.plan.id);
                },
                style: 'primary',
              },
            ],
          });
        }
      }

    } catch (error) {
      const errorMessage: Message = {
        id: generateMessageId(),
        role: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to process request'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);

      addNotification({
        type: 'error',
        title: 'AI Request Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [electronAPI, messages, addNotification]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setActivePlan(null);

    if (electronAPI) {
      electronAPI.ai.clearHistory?.().catch(console.error);
    }

    addNotification({
      type: 'info',
      title: 'Conversation Cleared',
      message: 'The conversation history has been cleared.',
    });
  }, [electronAPI, addNotification]);

  const setModel = useCallback(async (modelName: string): Promise<boolean> => {
    if (!electronAPI) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Electron API not available',
      });
      return false;
    }

    try {
      const success = await electronAPI.ai.setModel(modelName);

      if (success) {
        setCurrentModel(modelName);
        addNotification({
          type: 'success',
          title: 'Model Changed',
          message: `AI model changed to ${modelName}`,
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Failed to Change Model',
          message: `Could not switch to model ${modelName}`,
        });
      }

      return success;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Change Model',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return false;
    }
  }, [electronAPI, addNotification]);

  const refreshModels = useCallback(async (): Promise<void> => {
    if (!electronAPI) return;

    try {
      const models = await electronAPI.ai.getModels();
      setAvailableModels(models);
    } catch (error) {
      console.error('Failed to refresh models:', error);
    }
  }, [electronAPI]);

  const approveAction = useCallback((planId: string, actionId: string) => {
    if (!activePlan || activePlan.id !== planId) return;

    const updatedPlan = {
      ...activePlan,
      actions: activePlan.actions.map(action =>
        action.id === actionId ? { ...action, approved: true } : action
      ),
    };

    setActivePlan(updatedPlan);

    addNotification({
      type: 'success',
      title: 'Action Approved',
      message: 'The action has been approved for execution.',
    });
  }, [activePlan, addNotification]);

  const rejectAction = useCallback((planId: string, actionId: string) => {
    if (!activePlan || activePlan.id !== planId) return;

    const updatedPlan = {
      ...activePlan,
      actions: activePlan.actions.map(action =>
        action.id === actionId ? { ...action, approved: false } : action
      ),
    };

    setActivePlan(updatedPlan);

    addNotification({
      type: 'warning',
      title: 'Action Rejected',
      message: 'The action has been rejected and will not be executed.',
    });
  }, [activePlan, addNotification]);

  const executeApprovedPlan = useCallback(async (planId: string): Promise<boolean> => {
    if (!electronAPI || !activePlan || activePlan.id !== planId) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Cannot execute plan: invalid plan or API not available',
      });
      return false;
    }

    const approvedActions = activePlan.actions.filter(action => action.approved);

    if (approvedActions.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No Actions Approved',
        message: 'No actions have been approved for execution.',
      });
      return false;
    }

    setIsProcessing(true);

    try {
      const success = await electronAPI.ai.executePlan(planId);

      if (success) {
        // Update plan to mark actions as executed
        const updatedPlan = {
          ...activePlan,
          actions: activePlan.actions.map(action =>
            action.approved ? { ...action, executed: true } : action
          ),
        };

        setActivePlan(updatedPlan);

        addNotification({
          type: 'success',
          title: 'Plan Executed',
          message: `Successfully executed ${approvedActions.length} approved action(s).`,
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Plan Execution Failed',
          message: 'An error occurred while executing the action plan.',
        });
      }

      return success;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Plan Execution Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [electronAPI, activePlan, addNotification]);

  const regenerateResponse = useCallback(async (messageId: string): Promise<void> => {
    // Find the message and the user message before it
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const previousMessage = messages[messageIndex - 1];
    if (previousMessage.role !== 'user') return;

    // Remove the AI message and regenerate
    setMessages(prev => prev.slice(0, messageIndex));
    await sendMessage(previousMessage.content);
  }, [messages, sendMessage]);

  // Initialize models on component mount
  React.useEffect(() => {
    refreshModels();
  }, [refreshModels]);

  const value: AIContextType = {
    messages,
    isProcessing,
    currentModel,
    availableModels,
    activePlan,
    sendMessage,
    clearConversation,
    setModel,
    refreshModels,
    approveAction,
    rejectAction,
    executeApprovedPlan,
    regenerateResponse,
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};
