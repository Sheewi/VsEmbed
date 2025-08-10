import { WebSocket, WebSocketServer } from 'ws';
import { EventEmitter } from 'events';
import { ToolExecutor } from '../ai/tool-executor';
import { ModelConfiguration } from '../ai/config';

export interface StreamToken {
	type: 'token' | 'tool_call' | 'tool_result' | 'error' | 'complete' | 'status';
	content: string;
	data?: any;
	metadata?: {
		timestamp: number;
		tokenCount?: number;
		model?: string;
		usage?: {
			promptTokens: number;
			completionTokens: number;
			totalTokens: number;
		};
	};
}

export interface AIRequest {
	id: string;
	prompt: string;
	context?: any;
	options?: {
		model?: string;
		temperature?: number;
		maxTokens?: number;
		stream?: boolean;
	};
	tools?: any[];
}

export interface AIResponse {
	id: string;
	content: string;
	usage?: {
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
	};
	toolCalls?: any[];
	error?: string;
}

export class AIStream extends EventEmitter {
	private wsServer: WebSocketServer;
	private connections: Map<string, WebSocket> = new Map();
	private toolExecutor: ToolExecutor;
	private modelConfig: ModelConfiguration;
	private activeStreams: Map<string, AbortController> = new Map();

	constructor(private port: number) {
		super();
		this.toolExecutor = new ToolExecutor();
		this.modelConfig = new ModelConfiguration();
		this.initializeWebSocketServer();
	}

	private initializeWebSocketServer(): void {
		this.wsServer = new WebSocketServer({
			port: this.port,
			perMessageDeflate: false // Disable compression for real-time streaming
		});

		this.wsServer.on('connection', (ws: WebSocket, request) => {
			const connectionId = this.generateConnectionId();
			this.connections.set(connectionId, ws);

			console.log(`AI Stream connection established: ${connectionId}`);

			ws.on('message', async (data) => {
				try {
					const request: AIRequest = JSON.parse(data.toString());
					await this.handleRequest(connectionId, request);
				} catch (error) {
					this.sendError(connectionId, 'Invalid request format');
				}
			});

			ws.on('close', () => {
				this.connections.delete(connectionId);
				// Cancel any active streams for this connection
				const streamController = this.activeStreams.get(connectionId);
				if (streamController) {
					streamController.abort();
					this.activeStreams.delete(connectionId);
				}
				console.log(`AI Stream connection closed: ${connectionId}`);
			});

			ws.on('error', (error) => {
				console.error(`WebSocket error for ${connectionId}:`, error);
				this.connections.delete(connectionId);
			});

			// Send welcome message
			this.sendToken(connectionId, {
				type: 'status',
				content: 'Connected to AI Stream',
				data: { connectionId }
			});
		});

		this.wsServer.on('listening', () => {
			console.log(`AI Stream server listening on port ${this.port}`);
		});
	}

	private async handleRequest(connectionId: string, request: AIRequest): Promise<void> {
		try {
			// Validate request
			if (!request.prompt) {
				this.sendError(connectionId, 'Prompt is required');
				return;
			}

			// Create abort controller for this request
			const abortController = new AbortController();
			this.activeStreams.set(connectionId, abortController);

			// Send status update
			this.sendToken(connectionId, {
				type: 'status',
				content: 'Processing request...',
				data: { requestId: request.id }
			});

			// Get configuration
			const config = this.modelConfig.getConfig();

			// Merge request options with config
			const effectiveOptions = {
				model: request.options?.model || config.model,
				temperature: request.options?.temperature || config.temperature,
				maxTokens: request.options?.maxTokens || config.maxTokens,
				stream: request.options?.stream !== false // Default to streaming
			};

			// Stream the response
			await this.streamResponse(connectionId, request, effectiveOptions, abortController.signal);

		} catch (error) {
			this.sendError(connectionId, error instanceof Error ? error.message : 'Unknown error');
		} finally {
			this.activeStreams.delete(connectionId);
		}
	}

	private async streamResponse(
		connectionId: string,
		request: AIRequest,
		options: any,
		abortSignal: AbortSignal
	): Promise<void> {
		let totalTokens = 0;
		let completionTokens = 0;
		const promptTokens = this.estimateTokenCount(request.prompt);

		try {
			// Get available tools
			const availableTools = this.toolExecutor.getAvailableTools();

			// Prepare messages for AI model
			const messages = [
				{
					role: 'system',
					content: this.buildSystemPrompt(request.context, availableTools)
				},
				{
					role: 'user',
					content: request.prompt
				}
			];

			// Call AI model with streaming
			const stream = await this.callAIModel({
				messages,
				tools: availableTools,
				model: options.model,
				temperature: options.temperature,
				maxTokens: options.maxTokens,
				stream: true
			}, abortSignal);

			let assistantMessage = '';
			let currentToolCalls: any[] = [];

			// Process stream
			for await (const chunk of stream) {
				if (abortSignal.aborted) {
					break;
				}

				// Handle content tokens
				if (chunk.choices?.[0]?.delta?.content) {
					const content = chunk.choices[0].delta.content;
					assistantMessage += content;
					completionTokens += this.estimateTokenCount(content);
					totalTokens = promptTokens + completionTokens;

					this.sendToken(connectionId, {
						type: 'token',
						content,
						metadata: {
							timestamp: Date.now(),
							tokenCount: completionTokens,
							model: options.model
						}
					});
				}

				// Handle tool calls
				if (chunk.choices?.[0]?.delta?.tool_calls) {
					const toolCall = chunk.choices[0].delta.tool_calls[0];

					if (toolCall.function) {
						currentToolCalls.push(toolCall);

						this.sendToken(connectionId, {
							type: 'tool_call',
							content: `\n🔧 Executing: ${toolCall.function.name}\n`,
							data: {
								toolName: toolCall.function.name,
								arguments: toolCall.function.arguments
							}
						});

						try {
							// Execute the tool
							const result = await this.toolExecutor.executeTool({
								name: toolCall.function.name,
								function: toolCall.function.name,
								arguments: JSON.parse(toolCall.function.arguments || '{}')
							});

							if (result.success) {
								this.sendToken(connectionId, {
									type: 'tool_result',
									content: `✅ Result: ${result.output}\n`,
									data: {
										success: true,
										output: result.output,
										toolName: toolCall.function.name
									}
								});
							} else {
								this.sendToken(connectionId, {
									type: 'tool_result',
									content: `❌ Error: ${result.error}\n`,
									data: {
										success: false,
										error: result.error,
										toolName: toolCall.function.name,
										recommendedExtensions: result.recommendedExtensions
									}
								});

								// Handle extension recommendations
								if (result.recommendedExtensions) {
									this.sendToken(connectionId, {
										type: 'status',
										content: `💡 Suggested extensions: ${result.recommendedExtensions.join(', ')}`,
										data: {
											type: 'extension_recommendation',
											extensions: result.recommendedExtensions
										}
									});
								}
							}
						} catch (error) {
							this.sendToken(connectionId, {
								type: 'error',
								content: `🚫 Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}\n`,
								data: {
									toolName: toolCall.function.name,
									error: error instanceof Error ? error.message : 'Unknown error'
								}
							});
						}
					}
				}

				// Handle finish reason
				if (chunk.choices?.[0]?.finish_reason) {
					break;
				}
			}

			// Send completion message
			this.sendToken(connectionId, {
				type: 'complete',
				content: '',
				data: {
					requestId: request.id,
					totalTokens,
					usage: {
						promptTokens,
						completionTokens,
						totalTokens
					},
					toolCalls: currentToolCalls
				},
				metadata: {
					timestamp: Date.now(),
					model: options.model,
					usage: {
						promptTokens,
						completionTokens,
						totalTokens
					}
				}
			});

		} catch (error) {
			if (!abortSignal.aborted) {
				this.sendError(connectionId, error instanceof Error ? error.message : 'Streaming failed');
			}
		}
	}

	private async callAIModel(params: any, abortSignal: AbortSignal): Promise<AsyncIterable<any>> {
		const config = this.modelConfig.getConfig();

		// For demonstration, create a mock streaming response
		// In production, this would call the actual AI service
		return this.createMockStream(params, abortSignal);
	}

	private async *createMockStream(params: any, abortSignal: AbortSignal): AsyncIterable<any> {
		const responses = [
			"I'll help you with your development task. Let me analyze your request and available tools.",
			"\n\nBased on your workspace, I can see several opportunities for improvement. ",
			"Let me start by examining your project structure and dependencies.",
			"\n\nI notice you have some files that could benefit from formatting. ",
			"Would you like me to run prettier on your TypeScript files?"
		];

		for (let i = 0; i < responses.length; i++) {
			if (abortSignal.aborted) {
				break;
			}

			yield {
				choices: [{
					delta: {
						content: responses[i]
					}
				}]
			};

			// Simulate streaming delay
			await new Promise(resolve => setTimeout(resolve, 150));
		}

		// Simulate tool call
		if (!abortSignal.aborted && params.tools && params.tools.length > 0) {
			yield {
				choices: [{
					delta: {
						tool_calls: [{
							function: {
								name: 'vscode_esbenp_prettier_vscode_format',
								arguments: JSON.stringify({ files: ['src/index.ts'] })
							}
						}]
					}
				}]
			};

			await new Promise(resolve => setTimeout(resolve, 1000));
		}

		// Completion
		yield {
			choices: [{
				finish_reason: 'stop'
			}]
		};
	}

	private buildSystemPrompt(context: any, tools: any[]): string {
		const config = this.modelConfig.getConfig();

		return `You are VSEmbed AI DevTool, an advanced AI assistant integrated into a VS Code-like development environment.

CONTEXT:
${context ? JSON.stringify(context, null, 2) : 'No additional context provided'}

AVAILABLE TOOLS:
${tools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}

CAPABILITIES:
- VS Code extension access: ${config.tools.vscode.extensions ? 'ENABLED' : 'DISABLED'}
- Terminal operations: ${config.tools.vscode.terminal ? 'ENABLED' : 'DISABLED'}
- File system access: ${config.tools.vscode.fileAccess ? 'ENABLED' : 'DISABLED'}
- Docker operations: ${config.tools.docker ? 'ENABLED' : 'DISABLED'}
- GCP integration: ${config.tools.gcp ? 'ENABLED' : 'DISABLED'}
- Security tools: ${config.tools.kali ? 'ENABLED' : 'DISABLED'}

INSTRUCTIONS:
1. Always explain what you're going to do before using tools
2. Request permissions clearly when needed
3. Recommend extensions when they would be helpful
4. Provide clear, actionable advice
5. Respect security settings and user permissions
6. Use tools efficiently and explain their purpose

Respond in a helpful, professional manner and use tools when appropriate to assist with development tasks.`;
	}

	private sendToken(connectionId: string, token: StreamToken): void {
		const ws = this.connections.get(connectionId);
		if (ws && ws.readyState === WebSocket.OPEN) {
			try {
				ws.send(JSON.stringify(token));
			} catch (error) {
				console.error(`Failed to send token to ${connectionId}:`, error);
			}
		}
	}

	private sendError(connectionId: string, message: string): void {
		this.sendToken(connectionId, {
			type: 'error',
			content: message,
			metadata: {
				timestamp: Date.now()
			}
		});
	}

	private generateConnectionId(): string {
		return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	private estimateTokenCount(text: string): number {
		// Simple token estimation (roughly 4 characters per token)
		return Math.ceil(text.length / 4);
	}

	// Public API methods
	public async broadcast(token: StreamToken): Promise<void> {
		const message = JSON.stringify(token);
		const promises: Promise<void>[] = [];

		this.connections.forEach((ws, connectionId) => {
			if (ws.readyState === WebSocket.OPEN) {
				promises.push(
					new Promise((resolve, reject) => {
						ws.send(message, (error) => {
							if (error) {
								console.error(`Broadcast failed for ${connectionId}:`, error);
								reject(error);
							} else {
								resolve();
							}
						});
					})
				);
			}
		});

		await Promise.allSettled(promises);
	}

	public getActiveConnections(): number {
		return this.connections.size;
	}

	public getActiveStreams(): number {
		return this.activeStreams.size;
	}

	public async shutdown(): Promise<void> {
		console.log('Shutting down AI Stream server...');

		// Cancel all active streams
		this.activeStreams.forEach(controller => {
			controller.abort();
		});
		this.activeStreams.clear();

		// Close all connections
		const closePromises: Promise<void>[] = [];
		this.connections.forEach((ws, connectionId) => {
			closePromises.push(
				new Promise((resolve) => {
					ws.close(1000, 'Server shutdown');
					ws.on('close', resolve);
				})
			);
		});

		await Promise.all(closePromises);
		this.connections.clear();

		// Close WebSocket server
		return new Promise((resolve, reject) => {
			this.wsServer.close((error) => {
				if (error) {
					reject(error);
				} else {
					console.log('AI Stream server shut down successfully');
					resolve();
				}
			});
		});
	}
}

// Client-side streaming interface
export class AIStreamClient extends EventEmitter {
	private ws: WebSocket | null = null;
	private connectionId: string | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectDelay = 1000;

	constructor(private url: string) {
		super();
	}

	async connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				this.ws = new WebSocket(this.url);

				this.ws.onopen = () => {
					console.log('Connected to AI Stream');
					this.reconnectAttempts = 0;
					resolve();
				};

				this.ws.onmessage = (event) => {
					try {
						const token: StreamToken = JSON.parse(event.data);

						if (token.type === 'status' && token.data?.connectionId) {
							this.connectionId = token.data.connectionId;
						}

						this.emit('token', token);
					} catch (error) {
						console.error('Failed to parse stream message:', error);
					}
				};

				this.ws.onclose = (event) => {
					console.log('AI Stream connection closed:', event.code, event.reason);
					this.emit('disconnect');

					if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
						this.attemptReconnect();
					}
				};

				this.ws.onerror = (error) => {
					console.error('AI Stream error:', error);
					this.emit('error', error);
					reject(error);
				};

			} catch (error) {
				reject(error);
			}
		});
	}

	private async attemptReconnect(): Promise<void> {
		this.reconnectAttempts++;
		const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

		console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);

		setTimeout(async () => {
			try {
				await this.connect();
				this.emit('reconnect');
			} catch (error) {
				console.error('Reconnection failed:', error);
			}
		}, delay);
	}

	async sendRequest(request: AIRequest): Promise<void> {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			throw new Error('WebSocket not connected');
		}

		this.ws.send(JSON.stringify(request));
	}

	disconnect(): void {
		if (this.ws) {
			this.ws.close(1000, 'Client disconnect');
			this.ws = null;
		}
	}

	isConnected(): boolean {
		return this.ws?.readyState === WebSocket.OPEN;
	}

	getConnectionId(): string | null {
		return this.connectionId;
	}
}
