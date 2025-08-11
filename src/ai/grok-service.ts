import { EventEmitter } from 'events';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ConfigurationManager, GrokConfig } from '../core/config/ConfigurationManager';

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: number;
  metadata?: Record<string, any>;
}

export interface GrokConversation {
  id: string;
  title: string;
  messages: GrokMessage[];
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, any>;
}

export interface GrokCompletionRequest {
  messages: GrokMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface GrokCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: GrokMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GrokStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason?: string;
  }>;
}

export interface CodeAnalysisRequest {
  code: string;
  language: string;
  context?: string;
  analysisType: 'review' | 'explain' | 'optimize' | 'debug' | 'generate_docs';
}

export interface CodeAnalysisResponse {
  analysis: string;
  suggestions: Array<{
    type: 'improvement' | 'bug' | 'style' | 'performance' | 'security';
    line?: number;
    description: string;
    suggestion: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  score: number;
  metrics: {
    complexity: number;
    maintainability: number;
    performance: number;
    security: number;
  };
}

export class GrokService extends EventEmitter {
  private config: GrokConfig;
  private client!: AxiosInstance;
  private configManager: ConfigurationManager;
  private conversations: Map<string, GrokConversation> = new Map();
  private activeStreamRequests: Map<string, AbortController> = new Map();

  constructor(configManager: ConfigurationManager) {
    super();
    this.configManager = configManager;
    this.config = configManager.getGrokConfig();
    this.initializeClient();
    this.setupEventListeners();
  }

  private initializeClient(): void {
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'VsEmbed/1.0.0',
      },
      timeout: 30000,
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        this.emit('requestStart', { url: config.url, method: config.method });
        return config;
      },
      (error) => {
        this.emit('requestError', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        this.emit('requestComplete', { 
          url: response.config.url, 
          status: response.status,
          tokens: response.data?.usage?.total_tokens 
        });
        return response;
      },
      (error) => {
        this.emit('requestError', error);
        return Promise.reject(error);
      }
    );
  }

  private setupEventListeners(): void {
    this.configManager.on('configSaved', (config) => {
      if (config.grok) {
        this.config = config.grok;
        this.initializeClient();
        this.emit('configUpdated', this.config);
      }
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test with a simple completion request
      const response = await this.client.post('/chat/completions', {
        model: this.config.model,
        messages: [{ role: 'user', content: 'Hello, are you working?' }],
        max_tokens: 10,
      });

      this.emit('connectionTest', { success: true, model: response.data.model });
      return true;
    } catch (error) {
      console.error('Grok connection test failed:', error);
      this.emit('connectionTest', { success: false, error });
      return false;
    }
  }

  async createConversation(title?: string): Promise<string> {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const conversation: GrokConversation = {
      id,
      title: title || `Conversation ${new Date().toLocaleString()}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.conversations.set(id, conversation);
    this.emit('conversationCreated', conversation);
    return id;
  }

  async sendMessage(
    conversationId: string,
    message: string,
    options?: {
      stream?: boolean;
      context?: string;
      systemPrompt?: string;
    }
  ): Promise<string> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    // Add user message
    const userMessage: GrokMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    conversation.messages.push(userMessage);

    // Prepare messages for API
    const messages: GrokMessage[] = [];
    
    if (options?.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt,
      });
    }

    if (options?.context) {
      messages.push({
        role: 'system',
        content: `Context: ${options.context}`,
      });
    }

    messages.push(...conversation.messages);

    const request: GrokCompletionRequest = {
      messages,
      model: this.config.model,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      top_p: this.config.topP,
      frequency_penalty: this.config.frequencyPenalty,
      presence_penalty: this.config.presencePenalty,
      stream: options?.stream || false,
    };

    try {
      if (request.stream) {
        return await this.handleStreamResponse(conversationId, request);
      } else {
        return await this.handleRegularResponse(conversationId, request);
      }
    } catch (error) {
      console.error('Error sending message to Grok:', error);
      this.emit('messageError', { conversationId, error });
      throw error;
    }
  }

  private async handleRegularResponse(
    conversationId: string,
    request: GrokCompletionRequest
  ): Promise<string> {
    const response = await this.client.post<GrokCompletionResponse>(
      '/chat/completions',
      request
    );

    const assistantMessage = response.data.choices[0].message;
    const conversation = this.conversations.get(conversationId)!;
    
    conversation.messages.push({
      ...assistantMessage,
      timestamp: Date.now(),
    });
    conversation.updatedAt = Date.now();

    this.emit('messageReceived', {
      conversationId,
      message: assistantMessage,
      usage: response.data.usage,
    });

    return assistantMessage.content;
  }

  private async handleStreamResponse(
    conversationId: string,
    request: GrokCompletionRequest
  ): Promise<string> {
    const abortController = new AbortController();
    this.activeStreamRequests.set(conversationId, abortController);

    try {
      const response = await this.client.post('/chat/completions', request, {
        responseType: 'stream',
        signal: abortController.signal,
      });

      let fullContent = '';
      const conversation = this.conversations.get(conversationId)!;

      // Add empty assistant message that will be updated during streaming
      const assistantMessage: GrokMessage = {
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };
      conversation.messages.push(assistantMessage);

      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => {
          const lines = chunk.toString().split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                conversation.updatedAt = Date.now();
                this.activeStreamRequests.delete(conversationId);
                this.emit('streamComplete', { conversationId, content: fullContent });
                resolve(fullContent);
                return;
              }

              try {
                const parsed: GrokStreamChunk = JSON.parse(data);
                const delta = parsed.choices[0]?.delta;
                
                if (delta?.content) {
                  fullContent += delta.content;
                  assistantMessage.content = fullContent;
                  
                  this.emit('streamChunk', {
                    conversationId,
                    chunk: delta.content,
                    fullContent,
                  });
                }
              } catch (parseError) {
                // Ignore parsing errors for non-JSON lines
              }
            }
          }
        });

        response.data.on('error', (error: Error) => {
          this.activeStreamRequests.delete(conversationId);
          this.emit('streamError', { conversationId, error });
          reject(error);
        });
      });
    } catch (error) {
      this.activeStreamRequests.delete(conversationId);
      throw error;
    }
  }

  async analyzeCode(request: CodeAnalysisRequest): Promise<CodeAnalysisResponse> {
    const systemPrompt = this.getCodeAnalysisPrompt(request.analysisType);
    const conversationId = await this.createConversation('Code Analysis');

    const message = `
Language: ${request.language}
${request.context ? `Context: ${request.context}\n` : ''}
Code:
\`\`\`${request.language}
${request.code}
\`\`\`

Please analyze this code and provide a detailed response in JSON format.
`;

    const response = await this.sendMessage(conversationId, message, {
      systemPrompt,
    });

    try {
      const analysis = JSON.parse(response);
      this.emit('codeAnalyzed', { request, analysis });
      return analysis;
    } catch (parseError) {
      // Fallback to structured parsing if JSON fails
      return this.parseCodeAnalysisResponse(response);
    }
  }

  private getCodeAnalysisPrompt(analysisType: string): string {
    const basePrompt = `You are an expert software engineer and code reviewer. Your task is to analyze code and provide detailed, actionable feedback.`;

    const prompts = {
      review: `${basePrompt} Focus on code quality, best practices, potential bugs, and improvements. Provide specific suggestions with line numbers when possible.`,
      explain: `${basePrompt} Explain what the code does, how it works, and break down complex parts into understandable components.`,
      optimize: `${basePrompt} Focus on performance optimizations, efficiency improvements, and better algorithms or data structures.`,
      debug: `${basePrompt} Identify potential bugs, edge cases, error handling issues, and suggest fixes.`,
      generate_docs: `${basePrompt} Generate comprehensive documentation including function descriptions, parameter explanations, return values, and usage examples.`,
    };

    return prompts[analysisType as keyof typeof prompts] || prompts.review;
  }

  private parseCodeAnalysisResponse(response: string): CodeAnalysisResponse {
    // Fallback parser for non-JSON responses
    return {
      analysis: response,
      suggestions: [],
      score: 7, // Default score
      metrics: {
        complexity: 5,
        maintainability: 7,
        performance: 6,
        security: 7,
      },
    };
  }

  async generateCode(
    prompt: string,
    language: string,
    context?: string
  ): Promise<string> {
    const systemPrompt = `You are an expert programmer. Generate high-quality, well-documented ${language} code based on the user's requirements. Follow best practices and include appropriate error handling.`;

    const conversationId = await this.createConversation('Code Generation');
    const message = `${context ? `Context: ${context}\n\n` : ''}Generate ${language} code for: ${prompt}`;

    return await this.sendMessage(conversationId, message, { systemPrompt });
  }

  async explainCode(code: string, language: string): Promise<string> {
    const systemPrompt = `You are a programming instructor. Explain code clearly and thoroughly, breaking down complex concepts into understandable parts.`;

    const conversationId = await this.createConversation('Code Explanation');
    const message = `Please explain this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;

    return await this.sendMessage(conversationId, message, { systemPrompt });
  }

  async getCodeSuggestions(
    code: string,
    language: string,
    cursor: { line: number; column: number }
  ): Promise<Array<{ text: string; detail: string; kind: string }>> {
    const systemPrompt = `You are a code completion assistant. Provide relevant code suggestions based on the current context. Return suggestions as a JSON array.`;

    const conversationId = await this.createConversation('Code Completion');
    const message = `
Language: ${language}
Cursor position: Line ${cursor.line}, Column ${cursor.column}
Code:
\`\`\`${language}
${code}
\`\`\`

Provide code completion suggestions for the cursor position.
`;

    try {
      const response = await this.sendMessage(conversationId, message, { systemPrompt });
      return JSON.parse(response);
    } catch (error) {
      console.error('Error getting code suggestions:', error);
      return [];
    }
  }

  getConversation(id: string): GrokConversation | undefined {
    return this.conversations.get(id);
  }

  getAllConversations(): GrokConversation[] {
    return Array.from(this.conversations.values());
  }

  deleteConversation(id: string): boolean {
    const success = this.conversations.delete(id);
    if (success) {
      this.emit('conversationDeleted', { id });
    }
    return success;
  }

  clearConversations(): void {
    this.conversations.clear();
    this.emit('conversationsCleared');
  }

  cancelStream(conversationId: string): void {
    const controller = this.activeStreamRequests.get(conversationId);
    if (controller) {
      controller.abort();
      this.activeStreamRequests.delete(conversationId);
      this.emit('streamCancelled', { conversationId });
    }
  }

  async updateConfig(config: Partial<GrokConfig>): Promise<void> {
    await this.configManager.updateGrokConfig(config);
  }

  getConfig(): GrokConfig {
    return { ...this.config };
  }

  isConnected(): boolean {
    return !!this.config.apiKey && !!this.config.baseUrl;
  }

  getUsageStats(): {
    totalConversations: number;
    totalMessages: number;
    activeStreams: number;
  } {
    const totalMessages = Array.from(this.conversations.values())
      .reduce((sum, conv) => sum + conv.messages.length, 0);

    return {
      totalConversations: this.conversations.size,
      totalMessages,
      activeStreams: this.activeStreamRequests.size,
    };
  }

  // Save and load conversations from storage
  async saveConversations(): Promise<void> {
    try {
      const data = Array.from(this.conversations.entries());
      // This would integrate with the ConfigurationManager's cloud storage
      this.emit('conversationsSaved', { count: data.length });
    } catch (error) {
      console.error('Error saving conversations:', error);
      this.emit('saveError', error);
    }
  }

  async loadConversations(): Promise<void> {
    try {
      // This would integrate with the ConfigurationManager's cloud storage
      this.emit('conversationsLoaded', { count: this.conversations.size });
    } catch (error) {
      console.error('Error loading conversations:', error);
      this.emit('loadError', error);
    }
  }
}
