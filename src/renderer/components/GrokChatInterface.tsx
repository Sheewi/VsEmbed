import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import '../styles/GrokChatInterface.css';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  model?: string;
  attachments?: Array<{
    type: 'image' | 'file' | 'code';
    name: string;
    content: string;
    language?: string;
  }>;
}

interface GrokChatInterfaceProps {
  className?: string;
}

export const GrokChatInterface: React.FC<GrokChatInterfaceProps> = ({ className }) => {
  const { addNotification } = useNotifications();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentModel, setCurrentModel] = useState('grok-beta');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableModels = [
    'grok-beta',
    'grok-2', 
    'grok-vision',
    'grok-multimodal'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: "I'm Grok, your AI assistant. I can help you with coding, creative projects, analysis, and more. What would you like to work on?",
        timestamp: new Date(),
        model: currentModel
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Advanced AI response simulation with context awareness
  const generateIntelligentResponse = async (userMessage: string, messageHistory: Message[], onChunk: (chunk: string) => void) => {
    const message = userMessage.toLowerCase();
    let response = '';
    
    // Analyze message context and intent
    const isCodeRequest = message.includes('code') || message.includes('function') || message.includes('class') || message.includes('write') || message.includes('create');
    const isExplanation = message.includes('how') || message.includes('why') || message.includes('what') || message.includes('explain');
    const isHelp = message.includes('help') || message.includes('stuck') || message.includes('problem') || message.includes('error');
    const isProject = message.includes('project') || message.includes('app') || message.includes('build') || message.includes('make');
    const isDebug = message.includes('debug') || message.includes('fix') || message.includes('error') || message.includes('bug');
    
    // Detect programming languages
    const languages = {
      javascript: /javascript|js|node|react|vue|angular|npm/i.test(userMessage),
      typescript: /typescript|ts/i.test(userMessage),
      python: /python|py|django|flask|fastapi/i.test(userMessage),
      rust: /rust|cargo/i.test(userMessage),
      go: /golang|go/i.test(userMessage),
      java: /java|spring|maven/i.test(userMessage),
      css: /css|styling|design|html/i.test(userMessage),
      sql: /sql|database|mysql|postgres/i.test(userMessage),
    };
    
    const detectedLang = Object.keys(languages).find(lang => languages[lang as keyof typeof languages]);
    
    // Generate contextual responses
    if (isCodeRequest && detectedLang) {
      const codeExamples = {
        javascript: `Here's a ${userMessage.includes('function') ? 'function' : 'code example'} in JavaScript:

\`\`\`javascript
function ${userMessage.includes('async') ? 'async ' : ''}handleUserInput(input) {
    ${userMessage.includes('async') ? 'const result = await processInput(input);' : 'const result = processInput(input);'}
    return result;
}
\`\`\`

This function ${userMessage.includes('async') ? 'asynchronously ' : ''}processes user input. Would you like me to explain any part of this code or add more functionality?`,
        
        python: `Here's a Python ${userMessage.includes('class') ? 'class' : 'function'} for you:

\`\`\`python
${userMessage.includes('class') ? 'class' : 'def'} ${userMessage.includes('class') ? 'DataProcessor:' : 'process_data(data):'}
    ${userMessage.includes('class') ? 'def __init__(self, config=None):' : '"""Process the input data and return results"""'}
    ${userMessage.includes('class') ? '    self.config = config or {}' : 'result = {}'}
    ${userMessage.includes('class') ? '' : 'return result'}
\`\`\`

This ${userMessage.includes('class') ? 'class' : 'function'} provides a good starting point. What specific functionality would you like to add?`,
        
        typescript: `Here's a TypeScript implementation:

\`\`\`typescript
interface UserData {
    id: number;
    name: string;
    email: string;
}

${userMessage.includes('async') ? 'async ' : ''}function processUserData(data: UserData): ${userMessage.includes('async') ? 'Promise<boolean>' : 'boolean'} {
    // Validate and process user data
    ${userMessage.includes('async') ? 'await' : ''} validateData(data);
    return true;
}
\`\`\`

This provides type safety and clear interfaces. Need help with any specific TypeScript features?`
      };
      
      response = codeExamples[detectedLang as keyof typeof codeExamples] || 
        `I can help you write ${detectedLang} code! What specific functionality are you looking to implement? Please provide more details about your requirements.`;
    }
    
    else if (isProject) {
      const projectTemplates = {
        react: `Let's create a React project! Here's what I recommend:

1. **Setup**: \`npx create-react-app my-project --template typescript\`
2. **Key dependencies**: React Router, Tailwind CSS, Axios
3. **Project structure**:
   \`\`\`
   src/
   ├── components/
   ├── pages/
   ├── hooks/
   ├── utils/
   └── styles/
   \`\`\`

What type of React application are you building? I can provide more specific guidance based on your needs.`,
        
        api: `Perfect! Let's build an API. Here's a solid foundation:

**Node.js/Express API Structure**:
\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(3000, () => console.log('API running on port 3000'));
\`\`\`

What kind of API endpoints do you need? REST, GraphQL, or something else?`
      };
      
      const projectType = userMessage.includes('react') ? 'react' : 
                         userMessage.includes('api') ? 'api' : 'generic';
      
      response = projectTemplates[projectType as keyof typeof projectTemplates] || 
        `I'd love to help you build your project! To give you the best guidance, could you tell me:

1. What type of application/project? (web app, API, mobile, desktop)
2. Which technologies do you prefer?
3. What's the main purpose or functionality?

Based on that, I can provide specific architecture recommendations and starter code.`;
    }
    
    else if (isDebug || isHelp) {
      response = `I'm here to help you debug! 🔍 

To provide the best assistance, could you share:

1. **What error are you seeing?** (exact error message if possible)
2. **What were you trying to do?** 
3. **What code are you working with?**
4. **What environment?** (browser, Node.js, specific framework)

Common debugging approaches I can help with:
- **Console debugging**: \`console.log()\` strategically placed
- **Error analysis**: Reading stack traces and error messages
- **Code review**: Looking for logic errors or typos
- **Performance issues**: Identifying bottlenecks

Share your code or error message and I'll help you fix it!`;
    }
    
    else if (isExplanation) {
      const concepts = {
        async: `**Async/Await in JavaScript**:

\`\`\`javascript
// Instead of callbacks or .then()
async function fetchUserData(id) {
    try {
        const response = await fetch(\`/api/users/\${id}\`);
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
    }
}
\`\`\`

**Key benefits**:
- Cleaner, more readable code
- Better error handling with try/catch
- Easier to debug than callback chains`,
        
        react: `**React Core Concepts**:

1. **Components**: Reusable UI pieces
2. **Props**: Data passed to components
3. **State**: Component's internal data
4. **Hooks**: Functions that let you "hook into" React features

\`\`\`jsx
function UserProfile({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    
    return (
        <div>
            <h1>{user.name}</h1>
            {isEditing ? <EditForm /> : <ViewMode />}
        </div>
    );
}
\`\`\`

What specific React concept would you like me to explain further?`,
        
        api: `**REST API Design Principles**:

1. **Resources**: Use nouns (not verbs) in URLs
2. **HTTP Methods**: 
   - GET: Retrieve data
   - POST: Create new resource
   - PUT: Update entire resource
   - PATCH: Partial update
   - DELETE: Remove resource

3. **Status Codes**:
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 404: Not Found
   - 500: Server Error

\`\`\`
GET    /api/users     → Get all users
POST   /api/users     → Create user
GET    /api/users/123 → Get specific user
PUT    /api/users/123 → Update user
\`\`\`

Which aspect of API design interests you most?`
      };
      
      const topic = userMessage.includes('async') ? 'async' :
                   userMessage.includes('react') ? 'react' :
                   userMessage.includes('api') ? 'api' : 'general';
      
      response = concepts[topic as keyof typeof concepts] || 
        `I'd be happy to explain that concept! Could you be more specific about what you'd like to understand? 

I can explain:
- **Programming concepts**: async/await, promises, closures, scope
- **Frameworks**: React, Vue, Express, Django
- **Patterns**: MVC, REST, GraphQL, microservices
- **Tools**: Git, Docker, databases, testing

What would you like to dive into?`;
    }
    
    else {
      // General conversational responses with variety
      const responses = [
        `That's interesting! I can help you with a wide range of development tasks. Are you working on:

- **Web development** (React, Vue, vanilla JS)
- **Backend services** (Node.js, Python, APIs)
- **Mobile apps** (React Native, Flutter)
- **DevOps/tooling** (Docker, CI/CD, deployment)
- **Data analysis** (Python, SQL, visualization)

What's your current project or challenge?`,

        `I'm here to help with your development needs! 💻

Whether you're:
- Building a new application
- Debugging existing code
- Learning new technologies
- Optimizing performance
- Setting up development environments

Just describe what you're working on and I'll provide specific, actionable guidance.`,

        `Great question! I can assist with:

🔧 **Technical Implementation**
- Code examples and best practices
- Architecture recommendations
- Performance optimization

🐛 **Problem Solving**
- Debugging assistance
- Error analysis and fixes
- Code reviews

📚 **Learning & Growth**
- Concept explanations
- Tutorial walkthroughs
- Technology comparisons

What would be most helpful for you right now?`,

        `I'm designed to be your AI development companion! I can help you:

**Write better code** with examples and explanations
**Solve problems** through debugging and analysis
**Learn new concepts** with clear, practical examples
**Build projects** with architecture guidance

What are you working on? Share your code, errors, or ideas and I'll provide targeted help.`
      ];
      
      response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Stream the response with realistic typing
    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 70));
      const chunk = (i === 0 ? '' : ' ') + words[i];
      onChunk(chunk);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    const assistantMessageId = generateMessageId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
      model: currentModel
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInputValue('');
    setIsProcessing(true);
    setStreamingMessageId(assistantMessageId);

    try {
      let accumulatedContent = '';
      
      await generateIntelligentResponse(
        userMessage.content,
        messages,
        (chunk) => {
          accumulatedContent += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, content: accumulatedContent }
                : msg
            )
          );
        }
      );

      // Mark streaming as complete
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

    } catch (error) {
      console.error('AI Response Error:', error);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? { 
                ...msg, 
                content: "I'm having trouble processing your request right now. Please try again.",
                isStreaming: false 
              }
            : msg
        )
      );

      addNotification({
        type: 'error',
        title: 'Response Error',
        message: 'Failed to generate response. Please try again.',
      });
    } finally {
      setIsProcessing(false);
      setStreamingMessageId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleModelChange = (model: string) => {
    setCurrentModel(model);
    setShowModelSelector(false);
    
    addNotification({
      type: 'info',
      title: 'Model Changed',
      message: `Switched to ${model}`,
    });
  };

  const clearConversation = () => {
    setMessages([]);
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: 'welcome_new',
        role: 'assistant',
        content: "Conversation cleared. What would you like to work on?",
        timestamp: new Date(),
        model: currentModel
      };
      setMessages([welcomeMessage]);
    }, 100);
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        addNotification({
          type: 'error',
          title: 'File Too Large',
          message: `${file.name} is too large. Maximum size is 10MB.`,
        });
        continue;
      }

      // Handle different file types
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const attachment = {
            type: 'image' as const,
            name: file.name,
            content: e.target?.result as string
          };
          
          // Add as a message with attachment
          const attachmentMessage: Message = {
            id: generateMessageId(),
            role: 'user',
            content: `Uploaded image: ${file.name}`,
            timestamp: new Date(),
            attachments: [attachment]
          };
          
          setMessages(prev => [...prev, attachmentMessage]);
        };
        reader.readAsDataURL(file);
      }
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const ModelIcon = ({ model }: { model: string }) => {
    switch (model) {
      case 'grok-beta':
        return <span className="model-icon beta">β</span>;
      case 'grok-2':
        return <span className="model-icon two">2</span>;
      case 'grok-vision':
        return <span className="model-icon vision">👁</span>;
      case 'grok-multimodal':
        return <span className="model-icon multimodal">🎭</span>;
      default:
        return <span className="model-icon default">G</span>;
    }
  };

  return (
    <div className={`grok-chat-interface ${className || ''}`}>
      {/* Header */}
      <div className="grok-header">
        <div className="grok-branding">
          <div className="grok-logo">
            <span className="grok-x">𝕏</span>
            <span className="grok-text">Grok</span>
          </div>
          <div className="connection-status">
            <div className="status-dot online"></div>
            <span>Connected</span>
          </div>
        </div>
        
        <div className="header-controls">
          <div className="model-selector-wrapper">
            <button 
              className="model-selector-btn"
              onClick={() => setShowModelSelector(!showModelSelector)}
            >
              <ModelIcon model={currentModel} />
              <span>{currentModel}</span>
              <svg className="chevron" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            
            {showModelSelector && (
              <div className="model-dropdown">
                {availableModels.map(model => (
                  <button
                    key={model}
                    className={`model-option ${model === currentModel ? 'active' : ''}`}
                    onClick={() => handleModelChange(model)}
                  >
                    <ModelIcon model={model} />
                    <span>{model}</span>
                    {model === currentModel && (
                      <svg className="check" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button className="clear-chat-btn" onClick={clearConversation} title="Clear conversation">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        <div className="messages-wrapper">
          {messages.map((message) => (
            <div key={message.id} className={`message-bubble ${message.role}`}>
              <div className="message-content">
                {message.role === 'assistant' && (
                  <div className="assistant-header">
                    <div className="assistant-avatar">
                      <span className="grok-mini">𝕏</span>
                    </div>
                    <div className="assistant-info">
                      <span className="assistant-name">Grok</span>
                      {message.model && (
                        <span className="model-badge">
                          <ModelIcon model={message.model} />
                        </span>
                      )}
                    </div>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                )}
                
                {message.role === 'user' && (
                  <div className="user-header">
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                    <div className="user-avatar">
                      <span>You</span>
                    </div>
                  </div>
                )}

                <div className="message-text">
                  {message.content}
                  {message.isStreaming && (
                    <span className="streaming-cursor">▋</span>
                  )}
                </div>

                {message.attachments && message.attachments.length > 0 && (
                  <div className="message-attachments">
                    {message.attachments.map((attachment, index) => (
                      <div key={index} className={`attachment ${attachment.type}`}>
                        {attachment.type === 'image' && (
                          <img src={attachment.content} alt={attachment.name} />
                        )}
                        {attachment.type === 'code' && (
                          <pre className={`language-${attachment.language || 'text'}`}>
                            <code>{attachment.content}</code>
                          </pre>
                        )}
                        <span className="attachment-name">{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-wrapper">
            <button
              type="button"
              className="attachment-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
              </svg>
            </button>
            
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Grok..."
              disabled={isProcessing}
              rows={1}
              className="message-input"
            />
            
            <button
              type="submit"
              disabled={!inputValue.trim() || isProcessing}
              className="send-btn"
              title="Send message"
            >
              {isProcessing ? (
                <div className="spinner">
                  <div className="spinner-inner"></div>
                </div>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              )}
            </button>
          </div>
        </form>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.txt,.md,.js,.ts,.tsx,.jsx,.py,.json,.css,.html,.xml"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        
        <div className="input-footer">
          <span className="hint">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
};
