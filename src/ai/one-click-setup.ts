import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { ModelDetector } from './model-autodetect';
import { ModelInstaller } from './model-installer';
import { ModelSelectorUI } from './model-selector-ui';

export class OneClickModelSetup {
	private static readonly SETUP_CONFIG_FILE = path.join(os.homedir(), '.vscode', 'ai-model-setup.json');

	private installer: ModelInstaller;
	private outputChannel: vscode.OutputChannel;

	constructor() {
		this.installer = new ModelInstaller();
		this.outputChannel = vscode.window.createOutputChannel('AI Model Setup');
	}

	/**
	 * Main entry point for one-click model setup
	 */
	public async runOneClickSetup(): Promise<boolean> {
		try {
			this.outputChannel.show();
			this.log('🚀 Starting One-Click AI Model Setup...');

			// Check if setup has been run before
			const hasExistingSetup = await this.checkExistingSetup();

			if (hasExistingSetup) {
				const runAgain = await vscode.window.showQuickPick(
					['Yes, run setup again', 'No, open model manager', 'Cancel'],
					{ placeHolder: 'AI models are already configured. What would you like to do?' }
				);

				if (runAgain === 'Cancel') return false;
				if (runAgain === 'No, open model manager') {
					await this.openModelManager();
					return true;
				}
			}

			// Step 1: System analysis
			this.log('🔍 Analyzing system capabilities...');
			const systemInfo = await ModelDetector.checkSystemHardware();
			this.logSystemInfo(systemInfo);

			// Step 2: Find best model for system
			this.log('🎯 Finding optimal AI model for your system...');
			const recommendedModel = await ModelDetector.findBestModel();

			if (!recommendedModel) {
				vscode.window.showErrorMessage('No suitable AI model found for your system.');
				return false;
			}

			this.log(`✅ Recommended model: ${recommendedModel.name}`);
			this.log(`   Type: ${recommendedModel.type}`);
			this.log(`   Size: ${recommendedModel.size || 'Variable'}`);
			this.log(`   Description: ${recommendedModel.description}`);

			// Step 3: Confirm installation
			const proceed = await vscode.window.showInformationMessage(
				`AI Model Setup found the perfect model for your system:\n\n${recommendedModel.name}\n${recommendedModel.description}\n\nWould you like to install it now?`,
				{ modal: true },
				'Install Now',
				'Choose Different Model',
				'Cancel'
			);

			if (proceed === 'Cancel') return false;

			if (proceed === 'Choose Different Model') {
				await this.openModelManager();
				return true;
			}

			// Step 4: Install the model
			this.log('📦 Installing AI model...');
			const installed = await this.installModelWithProgress(recommendedModel);

			if (!installed) {
				vscode.window.showErrorMessage('Model installation failed.');
				return false;
			}

			// Step 5: Configure and test
			this.log('⚙️ Configuring model settings...');
			await this.configureModelOptimizations(recommendedModel);

			this.log('🧪 Testing model installation...');
			const testResult = await this.testModelInstallation(recommendedModel);

			if (testResult.success) {
				this.log('✅ Model test successful!');
				await this.saveSetupConfiguration(recommendedModel);

				vscode.window.showInformationMessage(
					`🎉 AI Model Setup Complete!\n\n${recommendedModel.name} is ready to use.`,
					'Open Model Manager',
					'Test AI Chat'
				).then(action => {
					if (action === 'Open Model Manager') {
						this.openModelManager();
					} else if (action === 'Test AI Chat') {
						this.openAIChat();
					}
				});

				return true;
			} else {
				this.log(`❌ Model test failed: ${testResult.error}`);
				vscode.window.showWarningMessage(
					'Model installed but test failed. Please check the configuration.',
					'Open Model Manager'
				).then(action => {
					if (action === 'Open Model Manager') {
						this.openModelManager();
					}
				});
				return false;
			}

		} catch (error) {
			this.log(`❌ Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
			vscode.window.showErrorMessage('One-click setup failed. Please try manual setup.');
			return false;
		}
	}

	private async checkExistingSetup(): Promise<boolean> {
		try {
			await fs.access(OneClickModelSetup.SETUP_CONFIG_FILE);
			const configContent = await fs.readFile(OneClickModelSetup.SETUP_CONFIG_FILE, 'utf-8');
			const config = JSON.parse(configContent);

			return config.setupComplete && config.installedModel;
		} catch (error) {
			return false;
		}
	}

	private logSystemInfo(systemInfo: any): void {
		this.log('📊 System Analysis Results:');
		this.log(`   Platform: ${systemInfo.platform}`);
		this.log(`   CPU Cores: ${systemInfo.cpuCores}`);
		this.log(`   Total RAM: ${this.formatBytes(systemInfo.totalRam)}`);
		this.log(`   Available RAM: ${this.formatBytes(systemInfo.availableRam)}`);
		this.log(`   GPU Available: ${systemInfo.hasGpu ? '✅' : '❌'}`);

		if (systemInfo.hasGpu) {
			this.log(`   GPU Info: ${systemInfo.gpuInfo || 'Detected'}`);
		}
	}

	private async installModelWithProgress(model: any): Promise<boolean> {
		return new Promise((resolve) => {
			// Show progress notification
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: `Installing ${model.name}`,
				cancellable: true
			}, async (progress, token) => {

				let lastProgress = 0;

				// Listen for progress updates
				const progressHandler = (downloadProgress: any) => {
					if (downloadProgress.modelId === model.id) {
						const increment = downloadProgress.progress - lastProgress;
						progress.report({
							increment,
							message: `${downloadProgress.progress.toFixed(1)}% - ${this.formatBytes(downloadProgress.speed)}/s`
						});
						lastProgress = downloadProgress.progress;
					}
				};

				const completeHandler = (downloadProgress: any) => {
					if (downloadProgress.modelId === model.id) {
						resolve(true);
					}
				};

				const errorHandler = (downloadProgress: any) => {
					if (downloadProgress.modelId === model.id) {
						this.log(`❌ Installation error: ${downloadProgress.error}`);
						resolve(false);
					}
				};

				this.installer.on('downloadProgress', progressHandler);
				this.installer.on('downloadComplete', completeHandler);
				this.installer.on('downloadError', errorHandler);

				// Handle cancellation
				token.onCancellationRequested(() => {
					this.installer.cancelDownload(model.id);
					resolve(false);
				});

				// Start installation
				try {
					if (model.type === 'cloud') {
						// For cloud models, just setup API key
						resolve(await this.setupCloudModel(model));
					} else {
						// For local models, start download
						await this.installer.installModel(model.id, {
							quantization: 'q4_0',
							skipVerification: false
						});
					}
				} catch (error) {
					this.log(`❌ Installation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
					resolve(false);
				} finally {
					// Clean up listeners
					this.installer.off('downloadProgress', progressHandler);
					this.installer.off('downloadComplete', completeHandler);
					this.installer.off('downloadError', errorHandler);
				}
			});
		});
	}

	private async setupCloudModel(model: any): Promise<boolean> {
		const apiKeyVar = ModelDetector.getApiKeyEnvVar(model.id);

		// Check if API key is already set
		if (process.env[apiKeyVar]) {
			this.log(`✅ API key for ${model.name} already configured`);
			return true;
		}

		// Prompt for API key
		const instructions = this.getApiKeyInstructions(model.id);
		const apiKey = await vscode.window.showInputBox({
			prompt: `Enter your API key for ${model.name}`,
			password: true,
			ignoreFocusOut: true,
			placeHolder: 'sk-...',
			validateInput: (value) => {
				if (!value || value.trim().length === 0) {
					return 'API key cannot be empty';
				}
				if (value.length < 10) {
					return 'API key seems too short';
				}
				return null;
			}
		});

		if (apiKey) {
			// Save API key to environment (in a real implementation, this would be more secure)
			process.env[apiKeyVar] = apiKey;
			await ModelDetector.updateModelStatus(model.id, 'available');
			this.log(`✅ API key configured for ${model.name}`);
			return true;
		}

		return false;
	}

	private getApiKeyInstructions(modelId: string): string {
		const instructions: Record<string, string> = {
			'claude-3-sonnet': 'Get your API key from https://console.anthropic.com/',
			'claude-3-haiku': 'Get your API key from https://console.anthropic.com/',
			'gpt-4': 'Get your API key from https://platform.openai.com/api-keys',
			'gpt-3.5-turbo': 'Get your API key from https://platform.openai.com/api-keys',
			'gemini-pro': 'Get your API key from https://makersuite.google.com/app/apikey'
		};

		return instructions[modelId] || `Configure API key for ${modelId}`;
	}

	private async configureModelOptimizations(model: any): Promise<void> {
		if (model.type === 'cloud') {
			return; // No local optimizations needed for cloud models
		}

		const systemInfo = await ModelDetector.checkSystemHardware();
		const optimizations: any = {};

		// Auto-configure based on system capabilities
		if (systemInfo.hasGpu) {
			optimizations.gpu = true;
			this.log('   ✅ GPU acceleration enabled');
		}

		// Set optimal thread count (leave some cores for system)
		const optimalThreads = Math.max(1, Math.floor(systemInfo.cpuCores * 0.75));
		optimizations.threads = optimalThreads;
		this.log(`   ✅ Thread count set to ${optimalThreads}`);

		// Set context length based on available RAM
		const contextLength = this.calculateOptimalContextLength(systemInfo.availableRam);
		optimizations.contextLength = contextLength;
		this.log(`   ✅ Context length set to ${contextLength}`);

		// Apply optimizations
		await ModelDetector.updateModelConfig(model.id, {
			executionFlags: optimizations,
			contextLength
		});
	}

	private calculateOptimalContextLength(availableRam: number): number {
		// Rough calculation: 1GB RAM can handle ~2K context for most models
		const ramGB = availableRam / (1024 * 1024 * 1024);

		if (ramGB < 4) return 1024;
		if (ramGB < 8) return 2048;
		if (ramGB < 16) return 4096;
		if (ramGB < 32) return 8192;
		return 16384;
	}

	private async testModelInstallation(model: any): Promise<{ success: boolean; error?: string }> {
		try {
			this.log('🧪 Running model test...');

			// For now, just verify the model is available
			const models = await ModelDetector.getAvailableModels();
			const installedModel = models.find(m => m.id === model.id);

			if (!installedModel || installedModel.status !== 'available') {
				return { success: false, error: 'Model not properly installed' };
			}

			if (model.type === 'local' && installedModel.path) {
				// Verify file exists and is accessible
				try {
					await fs.access(installedModel.path.replace('~', os.homedir()));
				} catch (error) {
					return { success: false, error: 'Model file not accessible' };
				}
			}

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Test failed'
			};
		}
	}

	private async saveSetupConfiguration(model: any): Promise<void> {
		const config = {
			setupComplete: true,
			installedModel: model.id,
			setupDate: new Date().toISOString(),
			systemInfo: await ModelDetector.checkSystemHardware(),
			version: '1.0.0'
		};

		try {
			await fs.mkdir(path.dirname(OneClickModelSetup.SETUP_CONFIG_FILE), { recursive: true });
			await fs.writeFile(OneClickModelSetup.SETUP_CONFIG_FILE, JSON.stringify(config, null, 2));
			this.log('✅ Setup configuration saved');
		} catch (error) {
			this.log(`⚠️ Could not save setup configuration: ${error}`);
		}
	}

	private async openModelManager(): Promise<void> {
		try {
			await ModelSelectorUI.showModelSelector();
		} catch (error) {
			vscode.window.showErrorMessage('Failed to open model manager');
		}
	}

	private async openAIChat(): Promise<void> {
		// This would open the AI chat interface
		vscode.window.showInformationMessage('AI Chat interface would open here');
	}

	private formatBytes(bytes: number): string {
		if (!bytes) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	private log(message: string): void {
		this.outputChannel.appendLine(message);
		console.log(`[AI Setup] ${message}`);
	}

	/**
	 * Register VS Code commands for the model setup
	 */
	public static registerCommands(context: vscode.ExtensionContext): void {
		const setup = new OneClickModelSetup();

		// Main one-click setup command
		const oneClickCommand = vscode.commands.registerCommand(
			'ai.oneClickModelSetup',
			() => setup.runOneClickSetup()
		);

		// Open model manager command
		const modelManagerCommand = vscode.commands.registerCommand(
			'ai.openModelManager',
			() => setup.openModelManager()
		);

		// Quick model switch command
		const quickSwitchCommand = vscode.commands.registerCommand(
			'ai.quickModelSwitch',
			async () => {
				const models = await ModelDetector.getAvailableModels();
				const availableModels = models.filter(m => m.status === 'available');

				if (availableModels.length === 0) {
					vscode.window.showInformationMessage(
						'No AI models available. Run one-click setup first.',
						'Run Setup'
					).then(action => {
						if (action === 'Run Setup') {
							setup.runOneClickSetup();
						}
					});
					return;
				}

				const selected = await vscode.window.showQuickPick(
					availableModels.map(m => ({
						label: m.name,
						description: m.description,
						detail: `${m.type} • ${m.size || 'Variable size'}`,
						model: m
					})),
					{ placeHolder: 'Select AI model to use' }
				);

				if (selected) {
					// Set as active model (implementation depends on your AI system)
					vscode.window.showInformationMessage(`Switched to ${selected.model.name}`);
				}
			}
		);

		context.subscriptions.push(oneClickCommand, modelManagerCommand, quickSwitchCommand);
	}
}
