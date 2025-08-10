import * as vscode from 'vscode';
import { AIDevCompanion } from './dev-companion';
import { BrainstormPanel } from './components/BrainstormPanel';
import { InteractiveDebugConsole } from './components/InteractiveDebugConsole';

export class AIDevCompanionExtension {
	private companion: AIDevCompanion;
	private statusBarItem: vscode.StatusBarItem;
	private isActive = false;

	constructor(private context: vscode.ExtensionContext) {
		this.companion = new AIDevCompanion();
		this.statusBarItem = vscode.window.createStatusBarItem(
			vscode.StatusBarAlignment.Right,
			100
		);
	}

	async activate(): Promise<void> {
		// Register commands
		this.registerCommands();

		// Setup status bar
		this.setupStatusBar();

		// Listen to companion events
		this.setupEventListeners();

		console.log('AI Development Companion activated');
	}

	private registerCommands(): void {
		// Start AI companion
		const startCompanion = vscode.commands.registerCommand(
			'aiDevCompanion.start',
			async () => {
				if (!this.isActive) {
					await this.startCompanion();
				} else {
					vscode.window.showInformationMessage('AI Development Companion is already active');
				}
			}
		);

		// Stop AI companion
		const stopCompanion = vscode.commands.registerCommand(
			'aiDevCompanion.stop',
			async () => {
				if (this.isActive) {
					await this.stopCompanion();
				} else {
					vscode.window.showInformationMessage('AI Development Companion is not active');
				}
			}
		);

		// Quick brainstorm
		const quickBrainstorm = vscode.commands.registerCommand(
			'aiDevCompanion.quickBrainstorm',
			async () => {
				const topic = await vscode.window.showInputBox({
					placeHolder: 'What would you like to brainstorm about?',
					prompt: 'Enter a topic for AI brainstorming'
				});

				if (topic) {
					if (!this.isActive) {
						await this.startCompanion(topic);
					} else {
						// Send message to existing companion
						await this.companion.handleUserMessage({
							id: this.generateId(),
							text: `Let's brainstorm about: ${topic}`,
							timestamp: new Date(),
							intent: 'brainstorm'
						});
					}
				}
			}
		);

		// Debug with AI
		const debugWithAI = vscode.commands.registerCommand(
			'aiDevCompanion.debugWithAI',
			async () => {
				const activeEditor = vscode.window.activeTextEditor;
				if (!activeEditor) {
					vscode.window.showErrorMessage('No active editor found');
					return;
				}

				const selection = activeEditor.selection;
				const selectedText = activeEditor.document.getText(selection);

				const prompt = selectedText
					? `Help me debug this code: ${selectedText}`
					: `Help me debug the current file: ${activeEditor.document.fileName}`;

				if (!this.isActive) {
					await this.startCompanion(prompt);
				} else {
					await this.companion.handleUserMessage({
						id: this.generateId(),
						text: prompt,
						timestamp: new Date(),
						intent: 'debug',
						attachments: {
							codeSnippets: selectedText ? [selectedText] : undefined,
							runtimeState: await this.getCurrentDebugState()
						}
					});
				}
			}
		);

		// Build feature with AI
		const buildFeature = vscode.commands.registerCommand(
			'aiDevCompanion.buildFeature',
			async () => {
				const feature = await vscode.window.showInputBox({
					placeHolder: 'Describe the feature you want to build',
					prompt: 'What feature would you like the AI to help build?'
				});

				if (feature) {
					if (!this.isActive) {
						await this.startCompanion(`Help me build: ${feature}`);
					} else {
						await this.companion.handleUserMessage({
							id: this.generateId(),
							text: `I want to build: ${feature}`,
							timestamp: new Date(),
							intent: 'code'
						});
					}
				}
			}
		);

		// Export conversation
		const exportConversation = vscode.commands.registerCommand(
			'aiDevCompanion.exportConversation',
			async () => {
				if (!this.isActive) {
					vscode.window.showWarningMessage('No active conversation to export');
					return;
				}

				const sessionData = await this.companion.exportSession();
				const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

				if (workspaceFolder) {
					const timestamp = new Date().toISOString().split('T')[0];
					const fileName = `ai-session-${timestamp}.json`;
					const uri = vscode.Uri.joinPath(workspaceFolder.uri, fileName);

					await vscode.workspace.fs.writeFile(uri, Buffer.from(sessionData));

					const openFile = await vscode.window.showInformationMessage(
						`Conversation exported to ${fileName}`,
						'Open File'
					);

					if (openFile === 'Open File') {
						await vscode.window.showTextDocument(uri);
					}
				}
			}
		);

		// Register all commands
		this.context.subscriptions.push(
			startCompanion,
			stopCompanion,
			quickBrainstorm,
			debugWithAI,
			buildFeature,
			exportConversation
		);
	}

	private setupStatusBar(): void {
		this.updateStatusBar();
		this.statusBarItem.command = 'aiDevCompanion.start';
		this.statusBarItem.show();
		this.context.subscriptions.push(this.statusBarItem);
	}

	private setupEventListeners(): void {
		this.companion.on('sessionStarted', () => {
			this.isActive = true;
			this.updateStatusBar();
			vscode.window.showInformationMessage('🤖 AI Development Companion started!');
		});

		this.companion.on('sessionStopped', () => {
			this.isActive = false;
			this.updateStatusBar();
			vscode.window.showInformationMessage('AI Development Companion stopped');
		});

		this.companion.on('messageProcessed', (response) => {
			// Show notification for significant changes
			if (response.changesMade && response.changesMade.length > 0) {
				vscode.window.showInformationMessage(
					`AI made ${response.changesMade.length} code changes`
				);
			}
		});

		this.companion.on('codeChangesApplied', (changes) => {
			// Show progress notification
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: 'Applying AI code changes',
				cancellable: false
			}, async (progress) => {
				for (let i = 0; i < changes.length; i++) {
					progress.report({
						increment: (i + 1) / changes.length * 100,
						message: `Applied ${i + 1}/${changes.length} changes`
					});
					await new Promise(resolve => setTimeout(resolve, 100));
				}
			});
		});
	}

	private async startCompanion(initialPrompt?: string): Promise<void> {
		try {
			await this.companion.startSession(initialPrompt);
		} catch (error) {
			vscode.window.showErrorMessage(
				`Failed to start AI companion: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	private async stopCompanion(): Promise<void> {
		try {
			await this.companion.stopSession();
		} catch (error) {
			vscode.window.showErrorMessage(
				`Failed to stop AI companion: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	private updateStatusBar(): void {
		if (this.isActive) {
			this.statusBarItem.text = '$(robot) AI Active';
			this.statusBarItem.tooltip = 'AI Development Companion is active. Click to chat.';
			this.statusBarItem.command = undefined; // Remove command when active
			this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
		} else {
			this.statusBarItem.text = '$(robot) Start AI';
			this.statusBarItem.tooltip = 'Start AI Development Companion';
			this.statusBarItem.command = 'aiDevCompanion.start';
			this.statusBarItem.backgroundColor = undefined;
		}
	}

	private async getCurrentDebugState(): Promise<any> {
		// Get current debug session state if available
		const debugSession = vscode.debug.activeDebugSession;
		if (!debugSession) return null;

		try {
			// Get basic session info
			return {
				sessionId: debugSession.id,
				sessionName: debugSession.name,
				sessionType: debugSession.type,
				// Additional debug state would be gathered here
			};
		} catch (error) {
			return null;
		}
	}

	private generateId(): string {
		return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	deactivate(): void {
		if (this.isActive) {
			this.companion.stopSession();
		}
		this.statusBarItem.dispose();
	}
}

// Extension activation function
export function activate(context: vscode.ExtensionContext): void {
	const extension = new AIDevCompanionExtension(context);
	extension.activate();
}

export function deactivate(): void {
	// Cleanup handled by extension instance
}
