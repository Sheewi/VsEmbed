import * as vscode from 'vscode';
import { EventEmitter } from 'events';
import { ConversationSession } from './conversation-session';
import { ProjectState } from './project-state';
import { LivePreview } from './live-preview';
import { AIModelManager } from '../ai/models/manager';

export interface UserMessage {
	id: string;
	text: string;
	timestamp: Date;
	attachments?: {
		screenshots?: string[];
		codeSnippets?: string[];
		runtimeState?: any;
	};
	intent: 'brainstorm' | 'code' | 'debug' | 'test' | 'general';
}

export interface AIResponse {
	id: string;
	conversation: string;
	changesMade?: CodeChange[];
	debugAdvice?: DebugSuggestion[];
	alternatives?: AlternativeIdea[];
	previewUpdate?: PreviewUpdate;
	timestamp: Date;
}

export interface CodeChange {
	file: string;
	range: vscode.Range;
	newContent: string;
	description: string;
	category: 'feature' | 'fix' | 'optimization' | 'style';
}

export interface DebugSuggestion {
	issue: string;
	severity: 'low' | 'medium' | 'high' | 'critical';
	solution: string;
	codeChanges?: CodeChange[];
	explanation: string;
}

export interface AlternativeIdea {
	title: string;
	description: string;
	mockup?: string;
	implementation: string;
	tradeoffs: string[];
}

export class AIDevCompanion extends EventEmitter {
	private conversation: ConversationSession;
	private project: ProjectState;
	private preview: LivePreview;
	private modelManager: AIModelManager;
	private isActive = false;
	private conversationHistory: Array<UserMessage | AIResponse> = [];

	constructor() {
		super();
		this.conversation = new ConversationSession();
		this.project = new ProjectState();
		this.preview = new LivePreview();
		this.modelManager = new AIModelManager();
	}

	async startSession(initialPrompt?: string): Promise<void> {
		this.isActive = true;

		// Initialize all subsystems
		await this.initializeSubsystems();

		// Create chat interface
		await this.createChatInterface();

		// Begin brainstorming
		const welcomeMessage = initialPrompt ||
			"Hi! I'm your AI development partner. What would you like to build today? I can help brainstorm ideas, write code, debug issues, and test functionality - all while we chat!";

		await this.sendAIMessage({
			id: this.generateId(),
			conversation: welcomeMessage,
			timestamp: new Date()
		});

		this.emit('sessionStarted');
	}

	async handleUserMessage(message: UserMessage): Promise<AIResponse> {
		if (!this.isActive) {
			throw new Error('AI companion session not active');
		}

		// Add to conversation history
		this.conversationHistory.push(message);

		// Process in parallel pipelines
		const [brainstorming, coding, debugging, testing] = await Promise.all([
			this.processBrainstorming(message),
			this.processCodeGeneration(message),
			this.processDebugging(message),
			this.processTesting(message)
		]);

		// Apply code changes if any
		if (coding.changes && coding.changes.length > 0) {
			await this.applyCodeChanges(coding.changes);
			await this.preview.update();
		}

		// Generate comprehensive response
		const response: AIResponse = {
			id: this.generateId(),
			conversation: this.generateConversationalResponse(message, {
				brainstorming,
				coding,
				debugging,
				testing
			}),
			changesMade: coding.changes,
			debugAdvice: debugging.suggestions,
			alternatives: brainstorming.alternatives,
			previewUpdate: coding.changes ? await this.preview.getUpdateInfo() : undefined,
			timestamp: new Date()
		};

		// Add to history and emit
		this.conversationHistory.push(response);
		this.emit('messageProcessed', response);

		return response;
	}

	private async initializeSubsystems(): Promise<void> {
		await Promise.all([
			this.conversation.initialize(),
			this.project.initialize(),
			this.preview.initialize(),
			this.modelManager.initialize()
		]);
	}

	private async createChatInterface(): Promise<void> {
		const panel = vscode.window.createWebviewPanel(
			'ai-dev-companion',
			'AI Development Partner',
			vscode.ViewColumn.Beside,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
				localResourceRoots: [
					vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, 'src')
				]
			}
		);

		panel.webview.html = this.getChatUI();

		// Handle messages from webview
		panel.webview.onDidReceiveMessage(async (message) => {
			if (message.type === 'userMessage') {
				const userMsg: UserMessage = {
					id: this.generateId(),
					text: message.text,
					timestamp: new Date(),
					attachments: message.attachments,
					intent: this.detectIntent(message.text)
				};

				const response = await this.handleUserMessage(userMsg);

				panel.webview.postMessage({
					type: 'aiResponse',
					response
				});
			}
		});

		this.emit('chatInterfaceCreated', panel);
	}

	private async processBrainstorming(message: UserMessage): Promise<{
		alternatives: AlternativeIdea[];
		suggestions: string[];
	}> {
		if (message.intent !== 'brainstorm' && !this.containsBrainstormingKeywords(message.text)) {
			return { alternatives: [], suggestions: [] };
		}

		const context = {
			currentProject: this.project.getSnapshot(),
			conversationHistory: this.conversationHistory.slice(-5),
			userMessage: message.text
		};

		const brainstormingResult = await this.modelManager.generateCompletion({
			model: 'gpt-4-turbo',
			messages: [
				{
					role: 'system',
					content: `You are a creative software architect helping brainstorm and explore ideas.
					Generate alternative approaches, suggest improvements, and explore "what if" scenarios.
					Respond with JSON containing alternatives and suggestions arrays.`
				},
				{
					role: 'user',
					content: `Current context: ${JSON.stringify(context)}

					Please brainstorm around: "${message.text}"

					Generate 2-3 alternative approaches and 3-5 suggestions for improvement or exploration.`
				}
			]
		});

		try {
			return JSON.parse(brainstormingResult);
		} catch {
			return {
				alternatives: [{
					title: "Alternative Approach",
					description: brainstormingResult.substring(0, 200),
					implementation: "Detailed implementation needed",
					tradeoffs: ["Requires further analysis"]
				}],
				suggestions: [brainstormingResult]
			};
		}
	}

	private async processCodeGeneration(message: UserMessage): Promise<{
		changes: CodeChange[];
		summary: string;
	}> {
		if (message.intent !== 'code' && !this.containsCodeKeywords(message.text)) {
			return { changes: [], summary: '' };
		}

		const codeContext = {
			currentFiles: await this.project.getCurrentFiles(),
			projectStructure: this.project.getStructure(),
			userRequest: message.text
		};

		const codeResult = await this.modelManager.generateCompletion({
			model: 'gpt-4-turbo',
			messages: [
				{
					role: 'system',
					content: `You are an expert programmer. Generate code changes based on user requests.
					Respond with JSON containing an array of changes and a summary.
					Each change should specify file, range, newContent, description, and category.`
				},
				{
					role: 'user',
					content: `Project context: ${JSON.stringify(codeContext)}

					User request: "${message.text}"

					Generate the necessary code changes to fulfill this request.`
				}
			]
		});

		try {
			const parsed = JSON.parse(codeResult);
			return {
				changes: parsed.changes || [],
				summary: parsed.summary || 'Code changes generated'
			};
		} catch {
			return { changes: [], summary: 'Code generation failed' };
		}
	}

	private async processDebugging(message: UserMessage): Promise<{
		suggestions: DebugSuggestion[];
		analysis: string;
	}> {
		if (message.intent !== 'debug' && !this.containsDebugKeywords(message.text)) {
			return { suggestions: [], analysis: '' };
		}

		const debugContext = {
			runtimeState: message.attachments?.runtimeState,
			errorLogs: await this.project.getRecentErrors(),
			currentCode: await this.project.getCurrentFiles(),
			userIssue: message.text
		};

		const debugResult = await this.modelManager.generateCompletion({
			model: 'gpt-4-turbo',
			messages: [
				{
					role: 'system',
					content: `You are a debugging expert. Analyze issues and provide specific suggestions.
					Respond with JSON containing suggestions array and analysis string.`
				},
				{
					role: 'user',
					content: `Debug context: ${JSON.stringify(debugContext)}

					Issue reported: "${message.text}"

					Provide debugging suggestions and analysis.`
				}
			]
		});

		try {
			return JSON.parse(debugResult);
		} catch {
			return {
				suggestions: [{
					issue: message.text,
					severity: 'medium',
					solution: 'Requires manual inspection',
					explanation: debugResult.substring(0, 300)
				}],
				analysis: debugResult
			};
		}
	}

	private async processTesting(message: UserMessage): Promise<{
		testSuggestions: string[];
		executionPlan: string;
	}> {
		if (message.intent !== 'test' && !this.containsTestKeywords(message.text)) {
			return { testSuggestions: [], executionPlan: '' };
		}

		// Generate test scenarios and execution plans
		const testContext = {
			currentFeatures: this.project.getFeatureList(),
			recentChanges: this.project.getRecentChanges(),
			userRequest: message.text
		};

		const testResult = await this.modelManager.generateCompletion({
			model: 'gpt-4-turbo',
			messages: [
				{
					role: 'system',
					content: `You are a QA expert. Generate test scenarios and execution plans.
					Respond with JSON containing testSuggestions and executionPlan.`
				},
				{
					role: 'user',
					content: `Test context: ${JSON.stringify(testContext)}

					Testing request: "${message.text}"

					Generate test suggestions and execution plan.`
				}
			]
		});

		try {
			return JSON.parse(testResult);
		} catch {
			return {
				testSuggestions: ['Manual testing required'],
				executionPlan: testResult
			};
		}
	}

	private generateConversationalResponse(
		userMessage: UserMessage,
		results: any
	): string {
		const responses = [];

		// Acknowledge the user's message
		responses.push(this.generateAcknowledgment(userMessage));

		// Add brainstorming insights
		if (results.brainstorming.alternatives.length > 0) {
			responses.push(`I've thought of ${results.brainstorming.alternatives.length} alternative approaches we could explore.`);
		}

		// Mention code changes
		if (results.coding.changes.length > 0) {
			responses.push(`I've made ${results.coding.changes.length} code changes: ${results.coding.summary}`);
		}

		// Include debug advice
		if (results.debugging.suggestions.length > 0) {
			responses.push(`I found ${results.debugging.suggestions.length} potential issues to address.`);
		}

		// Add testing insights
		if (results.testing.testSuggestions.length > 0) {
			responses.push(`I suggest testing: ${results.testing.testSuggestions.slice(0, 2).join(', ')}.`);
		}

		// End with engagement
		responses.push("What would you like to explore next?");

		return responses.join(' ');
	}

	private async applyCodeChanges(changes: CodeChange[]): Promise<void> {
		const edit = new vscode.WorkspaceEdit();

		for (const change of changes) {
			const uri = vscode.Uri.file(change.file);
			edit.replace(uri, change.range, change.newContent);
		}

		await vscode.workspace.applyEdit(edit);

		// Format the changed files
		for (const change of changes) {
			const doc = await vscode.workspace.openTextDocument(change.file);
			await vscode.languages.executeDocumentFormattingProvider(doc.uri);
		}

		this.emit('codeChangesApplied', changes);
	}

	private detectIntent(text: string): UserMessage['intent'] {
		const lowerText = text.toLowerCase();

		if (this.containsDebugKeywords(lowerText)) return 'debug';
		if (this.containsTestKeywords(lowerText)) return 'test';
		if (this.containsCodeKeywords(lowerText)) return 'code';
		if (this.containsBrainstormingKeywords(lowerText)) return 'brainstorm';

		return 'general';
	}

	private containsBrainstormingKeywords(text: string): boolean {
		const keywords = ['what if', 'alternative', 'idea', 'approach', 'design', 'architecture', 'brainstorm'];
		return keywords.some(keyword => text.includes(keyword));
	}

	private containsCodeKeywords(text: string): boolean {
		const keywords = ['add', 'create', 'implement', 'build', 'make', 'code', 'function', 'component'];
		return keywords.some(keyword => text.includes(keyword));
	}

	private containsDebugKeywords(text: string): boolean {
		const keywords = ['fix', 'error', 'bug', 'broken', 'issue', 'problem', 'debug', 'why', 'not working'];
		return keywords.some(keyword => text.includes(keyword));
	}

	private containsTestKeywords(text: string): boolean {
		const keywords = ['test', 'check', 'verify', 'validate', 'try', 'does it work', 'functionality'];
		return keywords.some(keyword => text.includes(keyword));
	}

	private generateAcknowledgment(message: UserMessage): string {
		const acknowledgments = [
			"Got it!",
			"I understand.",
			"Let me help with that.",
			"Great idea!",
			"I see what you mean."
		];

		return acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
	}

	private generateId(): string {
		return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	private getChatUI(): string {
		return `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>AI Development Partner</title>
			<style>
				body {
					font-family: var(--vscode-font-family);
					background: var(--vscode-editor-background);
					color: var(--vscode-editor-foreground);
					margin: 0;
					padding: 20px;
					height: 100vh;
					display: flex;
					flex-direction: column;
				}
				.chat-container {
					flex: 1;
					display: flex;
					flex-direction: column;
					max-height: calc(100vh - 40px);
				}
				.messages {
					flex: 1;
					overflow-y: auto;
					padding: 10px;
					border: 1px solid var(--vscode-panel-border);
					margin-bottom: 10px;
				}
				.message {
					margin: 10px 0;
					padding: 10px;
					border-radius: 8px;
				}
				.user-message {
					background: var(--vscode-button-background);
					margin-left: 20%;
				}
				.ai-message {
					background: var(--vscode-input-background);
					margin-right: 20%;
				}
				.code-changes {
					background: var(--vscode-textCodeBlock-background);
					border-left: 3px solid var(--vscode-charts-green);
					padding: 10px;
					margin: 5px 0;
				}
				.debug-advice {
					background: var(--vscode-inputValidation-warningBackground);
					border-left: 3px solid var(--vscode-charts-orange);
					padding: 10px;
					margin: 5px 0;
				}
				.alternatives {
					background: var(--vscode-inputValidation-infoBackground);
					border-left: 3px solid var(--vscode-charts-blue);
					padding: 10px;
					margin: 5px 0;
				}
				.input-container {
					display: flex;
					gap: 10px;
				}
				.input-box {
					flex: 1;
					padding: 10px;
					background: var(--vscode-input-background);
					border: 1px solid var(--vscode-input-border);
					color: var(--vscode-input-foreground);
					border-radius: 4px;
				}
				.send-button {
					padding: 10px 20px;
					background: var(--vscode-button-background);
					color: var(--vscode-button-foreground);
					border: none;
					border-radius: 4px;
					cursor: pointer;
				}
				.send-button:hover {
					background: var(--vscode-button-hoverBackground);
				}
				.timestamp {
					font-size: 0.8em;
					opacity: 0.7;
					margin-top: 5px;
				}
			</style>
		</head>
		<body>
			<div class="chat-container">
				<div class="messages" id="messages"></div>
				<div class="input-container">
					<input type="text" class="input-box" id="messageInput"
						   placeholder="Type your message... (e.g., 'Add a login page' or 'Why isn't this working?')" />
					<button class="send-button" onclick="sendMessage()">Send</button>
				</div>
			</div>

			<script>
				const vscode = acquireVsCodeApi();

				function addMessage(message, isUser = false, extras = {}) {
					const messagesDiv = document.getElementById('messages');
					const messageDiv = document.createElement('div');
					messageDiv.className = 'message ' + (isUser ? 'user-message' : 'ai-message');

					let content = '<div>' + message + '</div>';

					if (extras.changesMade && extras.changesMade.length > 0) {
						content += '<div class="code-changes"><strong>Code Changes:</strong><ul>';
						extras.changesMade.forEach(change => {
							content += '<li>' + change.description + ' (' + change.file + ')</li>';
						});
						content += '</ul></div>';
					}

					if (extras.debugAdvice && extras.debugAdvice.length > 0) {
						content += '<div class="debug-advice"><strong>Debug Suggestions:</strong><ul>';
						extras.debugAdvice.forEach(advice => {
							content += '<li>' + advice.issue + ': ' + advice.solution + '</li>';
						});
						content += '</ul></div>';
					}

					if (extras.alternatives && extras.alternatives.length > 0) {
						content += '<div class="alternatives"><strong>Alternative Ideas:</strong><ul>';
						extras.alternatives.forEach(alt => {
							content += '<li><strong>' + alt.title + ':</strong> ' + alt.description + '</li>';
						});
						content += '</ul></div>';
					}

					content += '<div class="timestamp">' + new Date().toLocaleTimeString() + '</div>';
					messageDiv.innerHTML = content;

					messagesDiv.appendChild(messageDiv);
					messagesDiv.scrollTop = messagesDiv.scrollHeight;
				}

				function sendMessage() {
					const input = document.getElementById('messageInput');
					const text = input.value.trim();

					if (text) {
						addMessage(text, true);

						vscode.postMessage({
							type: 'userMessage',
							text: text,
							attachments: {}
						});

						input.value = '';
					}
				}

				document.getElementById('messageInput').addEventListener('keypress', function(e) {
					if (e.key === 'Enter') {
						sendMessage();
					}
				});

				window.addEventListener('message', event => {
					const message = event.data;

					if (message.type === 'aiResponse') {
						addMessage(message.response.conversation, false, message.response);
					}
				});

				// Initial welcome
				setTimeout(() => {
					addMessage("Hi! I'm your AI development partner. What would you like to build today? I can help brainstorm ideas, write code, debug issues, and test functionality - all while we chat!", false);
				}, 500);
			</script>
		</body>
		</html>
		`;
	}

	async stopSession(): Promise<void> {
		this.isActive = false;
		await this.preview.stop();
		this.emit('sessionStopped');
	}

	getConversationHistory(): Array<UserMessage | AIResponse> {
		return [...this.conversationHistory];
	}

	async exportSession(): Promise<string> {
		return JSON.stringify({
			history: this.conversationHistory,
			projectState: this.project.getSnapshot(),
			timestamp: new Date()
		}, null, 2);
	}
}

// Global instance
export const globalAICompanion = new AIDevCompanion();
