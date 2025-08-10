import { ModelConfiguration } from './config';
import { ToolExecutor } from './tool-executor';
import { ExtensionRecommender } from '../extensions/recommender';
import { PermissionManager } from '../permissions/manager';

interface ChatMessage {
	id: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp: number;
	toolCalls?: any[];
	attachments?: any[];
}

interface StreamToken {
	type: 'token' | 'tool_call' | 'error' | 'complete';
	content: string;
	data?: any;
}

interface WorkspaceContext {
	files: Array<{ path: string; language?: string; content?: string }>;
	dependencies: Record<string, string>;
	installedExtensions: string[];
	activeExtensions: string[];
	currentTask?: string;
	gitRepo?: {
		url: string;
		branch: string;
		uncommittedChanges: boolean;
	};
}

export class AIOrchestrator {
	private modelConfig: ModelConfiguration;
	private toolExecutor: ToolExecutor;
	private extensionRecommender: ExtensionRecommender;
	private permissionManager: PermissionManager;
	private conversationHistory: ChatMessage[] = [];
	private isProcessing = false;

	constructor() {
		this.modelConfig = new ModelConfiguration();
		this.toolExecutor = new ToolExecutor();
		this.extensionRecommender = new ExtensionRecommender();
		this.permissionManager = new PermissionManager();

		this.initializeEventListeners();
	}

	private initializeEventListeners(): void {
		// Listen for configuration updates
		window.addEventListener('configurationUpdated', (event: CustomEvent) => {
			this.modelConfig.updateConfig(event.detail);
			this.notifyConfigurationChange();
		});

		// Listen for workspace changes
		window.addEventListener('workspaceChanged', (event: CustomEvent) => {
			this.analyzeWorkspaceAndRecommend(event.detail);
		});
	}

	async processUserMessage(message: string, attachments?: any[]): Promise<AsyncIterable<StreamToken>> {
		if (this.isProcessing) {
			throw new Error('Already processing a message');
		}

		this.isProcessing = true;

		try {
			// Add user message to history
			const userMessage: ChatMessage = {
				id: Date.now().toString(),
				role: 'user',
				content: message,
				timestamp: Date.now(),
				attachments
			};

			this.conversationHistory.push(userMessage);

			// Get workspace context
			const workspaceContext = await this.getWorkspaceContext();

			// Generate response with tools
			return this.streamResponse(message, workspaceContext);

		} finally {
			this.isProcessing = false;
		}
	}

	private async *streamResponse(
		message: string,
		context: WorkspaceContext
	): AsyncIterable<StreamToken> {
		try {
			// Get available tools
			const availableTools = this.toolExecutor.getAvailableTools();

			// Check for extension recommendations
			const recommendations = this.extensionRecommender.recommendExtensions(context);
			if (recommendations.length > 0) {
				yield {
					type: 'token',
					content: `\n[INFO: Recommended extensions: ${recommendations.map(r => r.extensionId).join(', ')}]\n`
				};
			}

			// Prepare system prompt with context
			const systemPrompt = this.buildSystemPrompt(context, availableTools);

			// Call AI model
			const response = await this.callAIModel({
				messages: [
					{ role: 'system', content: systemPrompt },
					...this.conversationHistory.slice(-10), // Last 10 messages for context
					{ role: 'user', content: message }
				],
				tools: availableTools.map(tool => ({
					type: 'function',
					function: {
						name: tool.name,
						description: tool.description,
						parameters: {
							type: 'object',
							properties: {
								args: {
									type: 'array',
									items: { type: 'string' },
									description: 'Arguments for the tool'
								}
							}
						}
					}
				})),
				stream: true
			});

			let assistantMessage = '';
			let currentToolCalls: any[] = [];

			// Stream response
			for await (const chunk of response) {
				if (chunk.choices?.[0]?.delta?.content) {
					const content = chunk.choices[0].delta.content;
					assistantMessage += content;
					yield {
						type: 'token',
						content
					};
				}

				// Handle tool calls
				if (chunk.choices?.[0]?.delta?.tool_calls) {
					const toolCall = chunk.choices[0].delta.tool_calls[0];

					if (toolCall.function) {
						currentToolCalls.push(toolCall);

						yield {
							type: 'tool_call',
							content: `\n[EXECUTING: ${toolCall.function.name}]\n`,
							data: toolCall
						};

						try {
							const result = await this.toolExecutor.executeTool({
								name: toolCall.function.name,
								function: toolCall.function.name,
								arguments: JSON.parse(toolCall.function.arguments || '{}')
							});

							if (result.success) {
								yield {
									type: 'token',
									content: `\n[RESULT: ${result.output}]\n`
								};
							} else {
								yield {
									type: 'error',
									content: `\n[ERROR: ${result.error}]\n`,
									data: result
								};

								// Handle extension recommendations
								if (result.recommendedExtensions) {
									yield {
										type: 'token',
										content: `\n[SUGGESTION: Install extensions: ${result.recommendedExtensions.join(', ')}]\n`
									};
								}
							}
						} catch (error) {
							yield {
								type: 'error',
								content: `\n[TOOL ERROR: ${error instanceof Error ? error.message : 'Unknown error'}]\n`
							};
						}
					}
				}
			}

			// Add assistant message to history
			const assistantMessage_obj: ChatMessage = {
				id: Date.now().toString(),
				role: 'assistant',
				content: assistantMessage,
				timestamp: Date.now(),
				toolCalls: currentToolCalls
			};

			this.conversationHistory.push(assistantMessage_obj);

			yield {
				type: 'complete',
				content: ''
			};

		} catch (error) {
			yield {
				type: 'error',
				content: `\n[SYSTEM ERROR: ${error instanceof Error ? error.message : 'Unknown error'}]\n`
			};
		}
	}

	private buildSystemPrompt(context: WorkspaceContext, tools: any[]): string {
		const config = this.modelConfig.getConfig();

		return `You are VSEmbed AI DevTool, an advanced AI assistant integrated into a VS Code-like development environment.

CONTEXT:
- Current workspace has ${context.files.length} files
- Languages detected: ${Array.from(new Set(context.files.map(f => f.language).filter(Boolean))).join(', ')}
- Dependencies: ${Object.keys(context.dependencies).join(', ')}
- Available extensions: ${context.installedExtensions.join(', ')}

CAPABILITIES:
- Full VS Code extension access (${config.tools.vscode.extensions ? 'ENABLED' : 'DISABLED'})
- Terminal operations (${config.tools.vscode.terminal ? 'ENABLED' : 'DISABLED'})
- File system access (${config.tools.vscode.fileAccess ? 'ENABLED' : 'DISABLED'})
- Docker operations (${config.tools.docker ? 'ENABLED' : 'DISABLED'})
- GCP integration (${config.tools.gcp ? 'ENABLED' : 'DISABLED'})
- Security tools (${config.tools.kali ? 'ENABLED' : 'DISABLED'})

AVAILABLE TOOLS:
${tools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}

BEHAVIOR:
1. Always explain what you're going to do before using tools
2. Request permissions clearly when needed
3. Recommend extensions when they would be helpful
4. Provide context-aware solutions
5. Respect security settings and user permissions

Current task: ${context.currentTask || 'General development assistance'}`;
	}

	private async callAIModel(params: any): Promise<AsyncIterable<any>> {
		const config = this.modelConfig.getConfig();

		// Simulate AI model response for now
		// In real implementation, this would call OpenAI, Anthropic, etc.
		return this.simulateStreamResponse(params);
	}

	private async *simulateStreamResponse(params: any): AsyncIterable<any> {
		const responses = [
			"I'll help you with your development task. Let me analyze your workspace and available tools.",
			"\n\nBased on your current workspace, I can see you have multiple files and dependencies. ",
			"I have access to various VS Code extensions and development tools that can assist you.",
			"\n\nWhat specific task would you like me to help you with?"
		];

		for (const response of responses) {
			yield {
				choices: [{
					delta: {
						content: response
					}
				}]
			};

			// Simulate streaming delay
			await new Promise(resolve => setTimeout(resolve, 100));
		}
	}

	private async getWorkspaceContext(): Promise<WorkspaceContext> {
		// In a real implementation, this would query the actual workspace
		return {
			files: [
				{ path: 'package.json', language: 'json' },
				{ path: 'src/index.ts', language: 'typescript' },
				{ path: 'README.md', language: 'markdown' }
			],
			dependencies: {
				'react': '^18.0.0',
				'typescript': '^5.0.0',
				'vite': '^4.0.0'
			},
			installedExtensions: [
				'esbenp.prettier-vscode',
				'dbaeumer.vscode-eslint'
			],
			activeExtensions: [
				'esbenp.prettier-vscode',
				'dbaeumer.vscode-eslint'
			],
			currentTask: 'Development assistance',
			gitRepo: {
				url: 'https://github.com/example/project',
				branch: 'main',
				uncommittedChanges: true
			}
		};
	}

	private async analyzeWorkspaceAndRecommend(workspaceContext: WorkspaceContext): Promise<void> {
		const recommendations = this.extensionRecommender.recommendExtensions(workspaceContext);

		if (recommendations.length > 0) {
			// Notify UI about recommendations
			window.dispatchEvent(new CustomEvent('extensionRecommendations', {
				detail: recommendations
			}));
		}
	}

	private notifyConfigurationChange(): void {
		// Notify components about configuration changes
		window.dispatchEvent(new CustomEvent('aiConfigurationChanged', {
			detail: this.modelConfig.getConfig()
		}));
	}

	// Public API methods
	clearConversation(): void {
		this.conversationHistory = [];
	}

	getConversationHistory(): ChatMessage[] {
		return [...this.conversationHistory];
	}

	exportConversation(): string {
		return JSON.stringify({
			messages: this.conversationHistory,
			config: this.modelConfig.getConfig(),
			exportedAt: new Date().toISOString()
		}, null, 2);
	}

	async updateModelConfiguration(updates: Partial<any>): Promise<void> {
		await this.modelConfig.updateConfig(updates);
		this.notifyConfigurationChange();
	}

	getSecurityReport(): any {
		return this.permissionManager.getSecurityReport();
	}

	getAvailableTools(): any[] {
		return this.toolExecutor.getAvailableTools();
	}

	async requestExtensionInstallation(extensionId: string): Promise<boolean> {
		// Simulate extension installation
		console.log(`Installing extension: ${extensionId}`);

		// In real implementation, this would trigger actual VS Code extension installation
		window.dispatchEvent(new CustomEvent('extensionInstalled', {
			detail: { extensionId, success: true }
		}));

		return true;
	}

	isProcessingMessage(): boolean {
		return this.isProcessing;
	}
}
