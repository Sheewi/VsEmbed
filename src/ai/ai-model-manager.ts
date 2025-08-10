import * as vscode from 'vscode';
import { OneClickModelSetup } from './one-click-setup';
import { ModelSelectorUI } from './model-selector-ui';
import { ModelDetector } from './model-autodetect';
import { ModelInstaller } from './model-installer';

/**
 * AI Model Management System
 * Provides comprehensive model management with one-click setup, auto-detection, and installation
 */
export class AIModelManager {
	private static instance: AIModelManager;
	private installer: ModelInstaller;
	private outputChannel: vscode.OutputChannel;
	private statusBarItem: vscode.StatusBarItem;

	private constructor() {
		this.installer = new ModelInstaller();
		this.outputChannel = vscode.window.createOutputChannel('AI Models');
		this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

		this.initializeStatusBar();
		this.setupEventListeners();
	}

	public static getInstance(): AIModelManager {
		if (!AIModelManager.instance) {
			AIModelManager.instance = new AIModelManager();
		}
		return AIModelManager.instance;
	}

	/**
	 * Initialize the AI Model Management system
	 */
	public async initialize(): Promise<void> {
		try {
			this.log('🚀 Initializing AI Model Management System...');

			// Create model registry if it doesn't exist
			await this.ensureModelRegistry();

			// Update status bar
			await this.updateStatusBar();

			// Check for available models
			const models = await ModelDetector.getAvailableModels();
			const availableModels = models.filter(m => m.status === 'available');

			if (availableModels.length === 0) {
				this.showWelcomeMessage();
			} else {
				this.log(`✅ Found ${availableModels.length} available AI models`);
			}

		} catch (error) {
			this.log(`❌ Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
			vscode.window.showErrorMessage('Failed to initialize AI Model Management');
		}
	}

	private async ensureModelRegistry(): Promise<void> {
		try {
			await ModelDetector.getAvailableModels();
		} catch (error) {
			// If getting models fails, create the registry
			await ModelDetector.createModelRegistry();
		}
	}

	private async showWelcomeMessage(): Promise<void> {
		const choice = await vscode.window.showInformationMessage(
			'🤖 Welcome to AI Model Manager!\n\nNo AI models are currently installed. Would you like to set up AI models now?',
			{ modal: false },
			'One-Click Setup',
			'Browse Models',
			'Later'
		);

		switch (choice) {
			case 'One-Click Setup':
				await this.runOneClickSetup();
				break;
			case 'Browse Models':
				await this.openModelManager();
				break;
		}
	}

	private async initializeStatusBar(): Promise<void> {
		this.statusBarItem.text = '$(loading~spin) AI Models';
		this.statusBarItem.tooltip = 'AI Model Manager - Initializing...';
		this.statusBarItem.command = 'ai.openModelManager';
		this.statusBarItem.show();
	}

	private async updateStatusBar(): Promise<void> {
		try {
			const models = await ModelDetector.getAvailableModels();
			const availableModels = models.filter(m => m.status === 'available');

			if (availableModels.length === 0) {
				this.statusBarItem.text = '$(warning) No AI Models';
				this.statusBarItem.tooltip = 'No AI models available - Click to set up';
				this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
			} else {
				this.statusBarItem.text = `$(robot) ${availableModels.length} AI Models`;
				this.statusBarItem.tooltip = `${availableModels.length} AI models available - Click to manage`;
				this.statusBarItem.backgroundColor = undefined;
			}
		} catch (error) {
			this.statusBarItem.text = '$(error) AI Models';
			this.statusBarItem.tooltip = 'Error loading AI models - Click to retry';
			this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
		}
	}

	private setupEventListeners(): void {
		// Listen for installer events to update status
		this.installer.on('downloadComplete', () => {
			this.updateStatusBar();
		});

		this.installer.on('modelRemoved', () => {
			this.updateStatusBar();
		});

		// Listen for configuration changes
		vscode.workspace.onDidChangeConfiguration(event => {
			if (event.affectsConfiguration('ai.models')) {
				this.updateStatusBar();
			}
		});
	}

	public async runOneClickSetup(): Promise<boolean> {
		const setup = new OneClickModelSetup();
		const result = await setup.runOneClickSetup();

		if (result) {
			await this.updateStatusBar();
		}

		return result;
	}

	public async openModelManager(): Promise<void> {
		try {
			await ModelSelectorUI.showModelSelector();
		} catch (error) {
			vscode.window.showErrorMessage('Failed to open model manager');
		}
	}

	public async quickModelSwitch(): Promise<void> {
		const models = await ModelDetector.getAvailableModels();
		const availableModels = models.filter(m => m.status === 'available');

		if (availableModels.length === 0) {
			const setup = await vscode.window.showInformationMessage(
				'No AI models available. Would you like to set up models now?',
				'One-Click Setup',
				'Browse Models'
			);

			if (setup === 'One-Click Setup') {
				await this.runOneClickSetup();
			} else if (setup === 'Browse Models') {
				await this.openModelManager();
			}
			return;
		}

		const items = availableModels.map(model => ({
			label: `$(robot) ${model.name}`,
			description: model.description,
			detail: `${model.type} • ${model.size || 'Variable size'} • ${model.capabilities?.join(', ') || ''}`,
			model
		}));

		const selected = await vscode.window.showQuickPick(items, {
			placeHolder: 'Select AI model to use',
			matchOnDescription: true,
			matchOnDetail: true
		});

		if (selected) {
			// Store the selected model in configuration
			await vscode.workspace.getConfiguration('ai').update(
				'activeModel',
				selected.model.id,
				vscode.ConfigurationTarget.Global
			);

			vscode.window.showInformationMessage(
				`Switched to ${selected.model.name}`,
				'Test Model'
			).then(action => {
				if (action === 'Test Model') {
					this.testSelectedModel(selected.model);
				}
			});

			await this.updateStatusBar();
		}
	}

	private async testSelectedModel(model: any): Promise<void> {
		try {
			this.log(`🧪 Testing model: ${model.name}`);

			// Basic test - just verify the model is accessible
			if (model.type === 'local' && model.path) {
				const fs = await import('fs/promises');
				const os = await import('os');
				const expandedPath = model.path.replace('~', os.homedir());
				await fs.access(expandedPath);

				vscode.window.showInformationMessage(`✅ ${model.name} is ready to use!`);
			} else if (model.type === 'cloud') {
				const apiKeyVar = ModelDetector.getApiKeyEnvVar(model.id);
				if (process.env[apiKeyVar]) {
					vscode.window.showInformationMessage(`✅ ${model.name} API key is configured!`);
				} else {
					vscode.window.showWarningMessage(`⚠️ ${model.name} requires API key configuration`);
				}
			}

			this.log(`✅ Model test completed for ${model.name}`);
		} catch (error) {
			this.log(`❌ Model test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
			vscode.window.showErrorMessage(`Model test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	public async getActiveModel(): Promise<any | null> {
		try {
			const activeModelId = vscode.workspace.getConfiguration('ai').get<string>('activeModel');

			if (!activeModelId) return null;

			const models = await ModelDetector.getAvailableModels();
			return models.find(m => m.id === activeModelId && m.status === 'available') || null;
		} catch (error) {
			return null;
		}
	}

	public async getModelExecutionCommand(modelId?: string): Promise<string | null> {
		try {
			const targetModelId = modelId || vscode.workspace.getConfiguration('ai').get<string>('activeModel');

			if (!targetModelId) return null;

			const models = await ModelDetector.getAvailableModels();
			const model = models.find(m => m.id === targetModelId);

			if (!model || model.status !== 'available') return null;

			if (model.type === 'local' && model.path) {
				const os = await import('os');
				const modelPath = model.path.replace('~', os.homedir());

				// Build execution command with optimizations
				const flags = model.executionFlags || {};
				const flagParts = Object.entries(flags).map(([key, value]) => {
					if (typeof value === 'boolean') {
						return value ? `--${key}` : '';
					}
					return `--${key} ${value}`;
				}).filter(Boolean);

				return `llama-cpp-python -m "${modelPath}" ${flagParts.join(' ')}`.trim();
			}

			return null;
		} catch (error) {
			this.log(`❌ Failed to get execution command: ${error instanceof Error ? error.message : 'Unknown error'}`);
			return null;
		}
	}

	public async showModelStats(): Promise<void> {
		try {
			const models = await ModelDetector.getAvailableModels();
			const totalSize = await this.installer.getTotalModelsSize();

			const stats = {
				total: models.length,
				available: models.filter(m => m.status === 'available').length,
				local: models.filter(m => m.type === 'local').length,
				cloud: models.filter(m => m.type === 'cloud').length,
				totalSize: this.formatBytes(totalSize)
			};

			const message = `📊 AI Model Statistics:

Total Models: ${stats.total}
Available: ${stats.available}
Local Models: ${stats.local}
Cloud Models: ${stats.cloud}
Total Storage: ${stats.totalSize}`;

			vscode.window.showInformationMessage(message, 'Open Manager').then(action => {
				if (action === 'Open Manager') {
					this.openModelManager();
				}
			});

		} catch (error) {
			vscode.window.showErrorMessage('Failed to get model statistics');
		}
	}

	private formatBytes(bytes: number): string {
		if (!bytes) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	private log(message: string): void {
		this.outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] ${message}`);
	}

	public dispose(): void {
		this.statusBarItem.dispose();
		this.outputChannel.dispose();
	}

	/**
	 * Register all AI Model Management commands
	 */
	public static registerCommands(context: vscode.ExtensionContext): void {
		const manager = AIModelManager.getInstance();

		// Initialize the manager
		manager.initialize();

		// Register one-click setup commands
		OneClickModelSetup.registerCommands(context);

		// Register additional management commands
		const commands = [
			vscode.commands.registerCommand('ai.modelManager.showStats', () => manager.showModelStats()),
			vscode.commands.registerCommand('ai.modelManager.refresh', () => manager.updateStatusBar()),
			vscode.commands.registerCommand('ai.modelManager.getActive', () => manager.getActiveModel()),
			vscode.commands.registerCommand('ai.modelManager.testActive', async () => {
				const activeModel = await manager.getActiveModel();
				if (activeModel) {
					await manager.testSelectedModel(activeModel);
				} else {
					vscode.window.showInformationMessage('No active model selected');
				}
			})
		];

		context.subscriptions.push(...commands);
		context.subscriptions.push(manager);
	}
}
