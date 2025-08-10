import * as vscode from 'vscode';
import { AIModel, ModelDetector } from './model-autodetect';
import { ModelInstaller, DownloadProgress } from './model-installer';

export interface ModelSelectionResult {
	selectedModel: AIModel | null;
	action: 'install' | 'select' | 'configure' | 'cancel';
}

export class ModelSelectorUI {
	private static readonly WEBVIEW_TYPE = 'ai-model-selector';
	private static activePanel: vscode.WebviewPanel | undefined;

	private installer: ModelInstaller;
	private disposables: vscode.Disposable[] = [];

	constructor() {
		this.installer = new ModelInstaller();
		this.setupEventListeners();
	}

	public static async showModelSelector(): Promise<ModelSelectionResult> {
		return new Promise((resolve) => {
			const selector = new ModelSelectorUI();
			selector.createWebviewPanel(resolve);
		});
	}

	private async createWebviewPanel(resolve: (result: ModelSelectionResult) => void): Promise<void> {
		// Close existing panel if open
		if (ModelSelectorUI.activePanel) {
			ModelSelectorUI.activePanel.dispose();
		}

		ModelSelectorUI.activePanel = vscode.window.createWebviewPanel(
			ModelSelectorUI.WEBVIEW_TYPE,
			'AI Model Manager',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
				localResourceRoots: []
			}
		);

		ModelSelectorUI.activePanel.webview.html = await this.getWebviewContent();

		// Handle webview messages
		ModelSelectorUI.activePanel.webview.onDidReceiveMessage(
			async (message) => {
				await this.handleWebviewMessage(message, resolve);
			},
			undefined,
			this.disposables
		);

		// Clean up when panel is disposed
		ModelSelectorUI.activePanel.onDidDispose(
			() => {
				ModelSelectorUI.activePanel = undefined;
				this.dispose();
				resolve({ selectedModel: null, action: 'cancel' });
			},
			undefined,
			this.disposables
		);

		// Load initial data
		await this.loadModelsData();
	}

	private async loadModelsData(): Promise<void> {
		const models = await ModelDetector.getAvailableModels();
		const systemInfo = await ModelDetector.checkSystemHardware();
		const recommendedModel = await ModelDetector.findBestModel();

		this.sendMessage({
			type: 'modelsLoaded',
			models,
			systemInfo,
			recommendedModel
		});
	}

	private async handleWebviewMessage(message: any, resolve: (result: ModelSelectionResult) => void): Promise<void> {
		switch (message.type) {
			case 'selectModel':
				const models = await ModelDetector.getAvailableModels();
				const selectedModel = models.find(m => m.id === message.modelId);
				resolve({
					selectedModel: selectedModel || null,
					action: 'select'
				});
				ModelSelectorUI.activePanel?.dispose();
				break;

			case 'installModel':
				await this.handleInstallModel(message.modelId, message.options);
				break;

			case 'removeModel':
				await this.handleRemoveModel(message.modelId);
				break;

			case 'configureModel':
				await this.handleConfigureModel(message.modelId);
				break;

			case 'refreshModels':
				await this.loadModelsData();
				break;

			case 'getDownloadProgress':
				const progress = this.installer.getActiveDownloads();
				this.sendMessage({
					type: 'downloadProgress',
					downloads: progress
				});
				break;

			case 'cancelDownload':
				await this.installer.cancelDownload(message.modelId);
				break;

			case 'checkSystemRequirements':
				const requirements = await this.checkModelRequirements(message.modelId);
				this.sendMessage({
					type: 'systemRequirements',
					modelId: message.modelId,
					requirements
				});
				break;

			case 'openApiKeySetup':
				await this.openApiKeySetup(message.modelId);
				break;
		}
	}

	private async handleInstallModel(modelId: string, options: any): Promise<void> {
		try {
			this.sendMessage({
				type: 'installationStarted',
				modelId
			});

			const success = await this.installer.installModel(modelId, options);

			if (success) {
				await this.loadModelsData(); // Refresh the model list
				this.sendMessage({
					type: 'installationComplete',
					modelId,
					success: true
				});
			} else {
				this.sendMessage({
					type: 'installationComplete',
					modelId,
					success: false,
					error: 'Installation failed'
				});
			}
		} catch (error) {
			this.sendMessage({
				type: 'installationComplete',
				modelId,
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			});
		}
	}

	private async handleRemoveModel(modelId: string): Promise<void> {
		const success = await this.installer.removeModel(modelId);
		if (success) {
			await this.loadModelsData();
			vscode.window.showInformationMessage(`Model ${modelId} removed successfully`);
		} else {
			vscode.window.showErrorMessage(`Failed to remove model ${modelId}`);
		}
	}

	private async handleConfigureModel(modelId: string): Promise<void> {
		const models = await ModelDetector.getAvailableModels();
		const model = models.find(m => m.id === modelId);

		if (!model) return;

		if (model.type === 'cloud') {
			await this.openApiKeySetup(modelId);
		} else {
			// For local models, show optimization options
			await this.showModelOptimization(model);
		}
	}

	private async openApiKeySetup(modelId: string): Promise<void> {
		const apiKeyVar = ModelDetector.getApiKeyEnvVar(modelId);
		const currentValue = process.env[apiKeyVar] || '';

		const result = await vscode.window.showInputBox({
			prompt: `Enter your API key for ${modelId}`,
			password: true,
			value: currentValue,
			validateInput: (value) => {
				if (!value || value.trim().length === 0) {
					return 'API key cannot be empty';
				}
				return null;
			}
		});

		if (result) {
			// Update environment variable (this would need proper implementation)
			process.env[apiKeyVar] = result;
			await ModelDetector.updateModelStatus(modelId, 'available');
			await this.loadModelsData();

			vscode.window.showInformationMessage(`API key configured for ${modelId}`);
		}
	}

	private async showModelOptimization(model: AIModel): Promise<void> {
		const options = [
			'GPU Acceleration',
			'Memory Optimization',
			'Thread Configuration',
			'Execution Flags'
		];

		const selected = await vscode.window.showQuickPick(options, {
			placeHolder: `Configure ${model.name} optimization`
		});

		if (selected) {
			// Handle specific optimization options
			await this.handleOptimizationOption(model, selected);
		}
	}

	private async handleOptimizationOption(model: AIModel, option: string): Promise<void> {
		switch (option) {
			case 'GPU Acceleration':
				await this.configureGpuAcceleration(model);
				break;
			case 'Memory Optimization':
				await this.configureMemoryOptimization(model);
				break;
			case 'Thread Configuration':
				await this.configureThreads(model);
				break;
			case 'Execution Flags':
				await this.configureExecutionFlags(model);
				break;
		}
	}

	private async configureGpuAcceleration(model: AIModel): Promise<void> {
		const hasGpu = await ModelDetector.hasGpu();

		if (!hasGpu) {
			vscode.window.showWarningMessage('No GPU detected. GPU acceleration not available.');
			return;
		}

		const enabled = await vscode.window.showQuickPick(['Enable', 'Disable'], {
			placeHolder: 'GPU Acceleration'
		});

		if (enabled) {
			const config = model.executionFlags || {};
			config.gpu = enabled === 'Enable';

			await this.updateModelConfig(model.id, { executionFlags: config });
			vscode.window.showInformationMessage(`GPU acceleration ${enabled.toLowerCase()}d for ${model.name}`);
		}
	}

	private async configureMemoryOptimization(model: AIModel): Promise<void> {
		const result = await vscode.window.showInputBox({
			prompt: 'Enter context length (default: 2048)',
			value: model.contextLength?.toString() || '2048',
			validateInput: (value) => {
				const num = parseInt(value);
				if (isNaN(num) || num < 512 || num > 32768) {
					return 'Context length must be between 512 and 32768';
				}
				return null;
			}
		});

		if (result) {
			await this.updateModelConfig(model.id, { contextLength: parseInt(result) });
			vscode.window.showInformationMessage(`Context length updated for ${model.name}`);
		}
	}

	private async configureThreads(model: AIModel): Promise<void> {
		const systemInfo = await ModelDetector.checkSystemHardware();
		const maxThreads = systemInfo.cpuCores;

		const result = await vscode.window.showInputBox({
			prompt: `Enter number of threads (1-${maxThreads})`,
			value: model.executionFlags?.threads?.toString() || Math.ceil(maxThreads / 2).toString(),
			validateInput: (value) => {
				const num = parseInt(value);
				if (isNaN(num) || num < 1 || num > maxThreads) {
					return `Thread count must be between 1 and ${maxThreads}`;
				}
				return null;
			}
		});

		if (result) {
			const config = model.executionFlags || {};
			config.threads = parseInt(result);

			await this.updateModelConfig(model.id, { executionFlags: config });
			vscode.window.showInformationMessage(`Thread configuration updated for ${model.name}`);
		}
	}

	private async configureExecutionFlags(model: AIModel): Promise<void> {
		const flags = model.executionFlags || {};
		const currentFlags = Object.entries(flags).map(([key, value]) => `--${key} ${value}`).join(' ');

		const result = await vscode.window.showInputBox({
			prompt: 'Enter custom execution flags',
			value: currentFlags,
			placeHolder: '--threads 4 --batch-size 512'
		});

		if (result !== undefined) {
			// Parse flags from string
			const parsedFlags = this.parseExecutionFlags(result);
			await this.updateModelConfig(model.id, { executionFlags: parsedFlags });
			vscode.window.showInformationMessage(`Execution flags updated for ${model.name}`);
		}
	}

	private parseExecutionFlags(flagString: string): Record<string, any> {
		const flags: Record<string, any> = {};
		const parts = flagString.trim().split(/\s+/);

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			if (part.startsWith('--')) {
				const key = part.substring(2);
				const value = i + 1 < parts.length && !parts[i + 1].startsWith('--') ? parts[++i] : true;

				// Try to convert to number if possible
				const numValue = parseFloat(value.toString());
				flags[key] = isNaN(numValue) ? value : numValue;
			}
		}

		return flags;
	}

	private async updateModelConfig(modelId: string, updates: Partial<AIModel>): Promise<void> {
		// This would update the model configuration in the registry
		await ModelDetector.updateModelConfig(modelId, updates);
	}

	private async checkModelRequirements(modelId: string): Promise<any> {
		const models = await ModelDetector.getAvailableModels();
		const model = models.find(m => m.id === modelId);
		const systemInfo = await ModelDetector.checkSystemHardware();

		if (!model) return null;

		return {
			meets: ModelDetector.meetsRequirements(model, systemInfo),
			required: model.requirements,
			system: systemInfo,
			recommendations: this.getOptimizationRecommendations(model, systemInfo)
		};
	}

	private getOptimizationRecommendations(model: AIModel, systemInfo: any): string[] {
		const recommendations: string[] = [];

		if (model.requirements?.minRam && systemInfo.totalRam < model.requirements.minRam) {
			recommendations.push('Consider using a smaller quantization (q4_0) to reduce memory usage');
		}

		if (!systemInfo.hasGpu && model.requirements?.gpu) {
			recommendations.push('GPU acceleration recommended for better performance');
		}

		if (systemInfo.cpuCores < 8) {
			recommendations.push('Consider reducing thread count for better stability');
		}

		return recommendations;
	}

	private setupEventListeners(): void {
		// Listen to installer events
		this.installer.on('downloadStarted', (progress: DownloadProgress) => {
			this.sendMessage({
				type: 'downloadStarted',
				progress
			});
		});

		this.installer.on('downloadProgress', (progress: DownloadProgress) => {
			this.sendMessage({
				type: 'downloadProgress',
				progress
			});
		});

		this.installer.on('downloadComplete', (progress: DownloadProgress) => {
			this.sendMessage({
				type: 'downloadComplete',
				progress
			});
			this.loadModelsData(); // Refresh models list
		});

		this.installer.on('downloadError', (progress: DownloadProgress) => {
			this.sendMessage({
				type: 'downloadError',
				progress
			});
		});

		this.installer.on('apiKeyRequired', (data: any) => {
			this.sendMessage({
				type: 'apiKeyRequired',
				data
			});
		});
	}

	private sendMessage(message: any): void {
		ModelSelectorUI.activePanel?.webview.postMessage(message);
	}

	private dispose(): void {
		this.disposables.forEach(d => d.dispose());
		this.disposables = [];
	}

	private async getWebviewContent(): Promise<string> {
		return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Model Manager</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            margin: 0;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .header h1 {
            margin: 0;
            color: var(--vscode-foreground);
        }

        .system-info {
            background: var(--vscode-editor-inactiveSelectionBackground);
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 12px;
        }

        .models-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }

        .model-card {
            background: var(--vscode-list-inactiveSelectionBackground);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 16px;
            transition: all 0.2s ease;
            position: relative;
        }

        .model-card:hover {
            border-color: var(--vscode-focusBorder);
            background: var(--vscode-list-hoverBackground);
        }

        .model-card.recommended {
            border-color: var(--vscode-charts-green);
            background: rgba(0, 255, 0, 0.05);
        }

        .model-card.recommended::before {
            content: "⭐ RECOMMENDED";
            position: absolute;
            top: -8px;
            right: 12px;
            background: var(--vscode-charts-green);
            color: var(--vscode-editor-background);
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }

        .model-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
            color: var(--vscode-foreground);
        }

        .model-description {
            color: var(--vscode-descriptionForeground);
            font-size: 13px;
            margin-bottom: 12px;
            line-height: 1.4;
        }

        .model-specs {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 12px;
        }

        .spec-tag {
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
        }

        .status-indicator {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 12px;
            font-size: 12px;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }

        .status-available { background: var(--vscode-charts-green); }
        .status-not-installed { background: var(--vscode-charts-orange); }
        .status-downloading { background: var(--vscode-charts-blue); }
        .status-error { background: var(--vscode-errorForeground); }

        .model-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
        }

        button:hover {
            background: var(--vscode-button-hoverBackground);
        }

        button:disabled {
            background: var(--vscode-button-background);
            opacity: 0.5;
            cursor: not-allowed;
        }

        .button-secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }

        .button-secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }

        .progress-bar {
            width: 100%;
            height: 4px;
            background: var(--vscode-progressBar-background);
            border-radius: 2px;
            overflow: hidden;
            margin: 8px 0;
        }

        .progress-fill {
            height: 100%;
            background: var(--vscode-progressBar-background);
            transition: width 0.3s ease;
        }

        .download-info {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-top: 4px;
        }

        .filters {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            align-items: center;
        }

        select {
            background: var(--vscode-dropdown-background);
            color: var(--vscode-dropdown-foreground);
            border: 1px solid var(--vscode-dropdown-border);
            padding: 4px 8px;
            border-radius: 4px;
        }

        .refresh-button {
            margin-left: auto;
        }

        .loading {
            text-align: center;
            padding: 40px;
            color: var(--vscode-descriptionForeground);
        }

        .error-message {
            background: var(--vscode-inputValidation-errorBackground);
            color: var(--vscode-inputValidation-errorForeground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            padding: 12px;
            border-radius: 4px;
            margin: 8px 0;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤖 AI Model Manager</h1>
        <button id="refreshButton" class="button-secondary">🔄 Refresh</button>
    </div>

    <div id="systemInfo" class="system-info" style="display: none;">
        <strong>System Information:</strong>
        <span id="systemDetails"></span>
    </div>

    <div class="filters">
        <label>Filter by type:</label>
        <select id="typeFilter">
            <option value="all">All Models</option>
            <option value="local">Local Models</option>
            <option value="cloud">Cloud Models</option>
        </select>

        <label>Status:</label>
        <select id="statusFilter">
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="not_installed">Not Installed</option>
        </select>
    </div>

    <div id="loading" class="loading">
        Loading models...
    </div>

    <div id="modelsContainer" class="models-grid" style="display: none;">
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let models = [];
        let systemInfo = null;
        let recommendedModel = null;
        let downloads = new Map();

        // Event listeners
        document.getElementById('refreshButton').addEventListener('click', () => {
            vscode.postMessage({ type: 'refreshModels' });
        });

        document.getElementById('typeFilter').addEventListener('change', filterModels);
        document.getElementById('statusFilter').addEventListener('change', filterModels);

        // Listen for messages from extension
        window.addEventListener('message', event => {
            const message = event.data;

            switch (message.type) {
                case 'modelsLoaded':
                    models = message.models;
                    systemInfo = message.systemInfo;
                    recommendedModel = message.recommendedModel;
                    renderModels();
                    showSystemInfo();
                    break;

                case 'downloadStarted':
                case 'downloadProgress':
                    updateDownloadProgress(message.progress);
                    break;

                case 'downloadComplete':
                    downloads.delete(message.progress.modelId);
                    vscode.postMessage({ type: 'refreshModels' });
                    break;

                case 'downloadError':
                    downloads.delete(message.progress.modelId);
                    showError(\`Download failed: \${message.progress.error}\`);
                    break;

                case 'installationComplete':
                    if (message.success) {
                        showSuccess(\`Model \${message.modelId} installed successfully!\`);
                    } else {
                        showError(\`Installation failed: \${message.error}\`);
                    }
                    break;

                case 'apiKeyRequired':
                    showApiKeyDialog(message.data);
                    break;
            }
        });

        function showSystemInfo() {
            if (systemInfo) {
                const details = \`
                    CPU: \${systemInfo.cpuCores} cores |
                    RAM: \${formatBytes(systemInfo.totalRam)} |
                    GPU: \${systemInfo.hasGpu ? '✅' : '❌'} |
                    OS: \${systemInfo.platform}
                \`;
                document.getElementById('systemDetails').textContent = details;
                document.getElementById('systemInfo').style.display = 'block';
            }
        }

        function renderModels() {
            const container = document.getElementById('modelsContainer');
            const loading = document.getElementById('loading');

            loading.style.display = 'none';
            container.style.display = 'grid';

            container.innerHTML = models.map(model => createModelCard(model)).join('');

            // Add event listeners
            models.forEach(model => {
                const card = document.getElementById(\`model-\${model.id}\`);
                if (card) {
                    addModelEventListeners(card, model);
                }
            });
        }

        function createModelCard(model) {
            const isRecommended = recommendedModel && recommendedModel.id === model.id;
            const download = downloads.get(model.id);

            return \`
                <div id="model-\${model.id}" class="model-card \${isRecommended ? 'recommended' : ''}" data-type="\${model.type}" data-status="\${model.status}">
                    <div class="model-name">\${model.name}</div>
                    <div class="model-description">\${model.description}</div>

                    <div class="model-specs">
                        <span class="spec-tag">\${model.type}</span>
                        \${model.size ? \`<span class="spec-tag">\${model.size}</span>\` : ''}
                        \${model.contextLength ? \`<span class="spec-tag">\${model.contextLength}K context</span>\` : ''}
                        \${model.capabilities ? model.capabilities.map(cap => \`<span class="spec-tag">\${cap}</span>\`).join('') : ''}
                    </div>

                    <div class="status-indicator">
                        <div class="status-dot status-\${model.status}"></div>
                        <span>\${formatStatus(model.status)}</span>
                    </div>

                    \${download ? createProgressBar(download) : ''}

                    <div class="model-actions">
                        \${createModelActions(model, download)}
                    </div>
                </div>
            \`;
        }

        function createProgressBar(download) {
            return \`
                <div class="progress-bar">
                    <div class="progress-fill" style="width: \${download.progress}%"></div>
                </div>
                <div class="download-info">
                    \${download.progress.toFixed(1)}% - \${formatBytes(download.downloaded)}/\${formatBytes(download.total)}
                    (\${formatBytes(download.speed)}/s) - ETA: \${formatTime(download.eta)}
                </div>
            \`;
        }

        function createModelActions(model, download) {
            if (download) {
                return \`<button onclick="cancelDownload('\${model.id}')">Cancel Download</button>\`;
            }

            let actions = [];

            if (model.status === 'available') {
                actions.push(\`<button onclick="selectModel('\${model.id}')">Select</button>\`);
                actions.push(\`<button class="button-secondary" onclick="configureModel('\${model.id}')">Configure</button>\`);
                if (model.type === 'local') {
                    actions.push(\`<button class="button-secondary" onclick="removeModel('\${model.id}')">Remove</button>\`);
                }
            } else if (model.status === 'not_installed') {
                if (model.type === 'local') {
                    actions.push(\`<button onclick="installModel('\${model.id}')">Install</button>\`);
                } else {
                    actions.push(\`<button onclick="configureModel('\${model.id}')">Setup API Key</button>\`);
                }
                actions.push(\`<button class="button-secondary" onclick="checkRequirements('\${model.id}')">Requirements</button>\`);
            }

            return actions.join('');
        }

        function addModelEventListeners(card, model) {
            // Add double-click to select
            card.addEventListener('dblclick', () => {
                if (model.status === 'available') {
                    selectModel(model.id);
                }
            });
        }

        function filterModels() {
            const typeFilter = document.getElementById('typeFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;

            const cards = document.querySelectorAll('.model-card');
            cards.forEach(card => {
                const type = card.dataset.type;
                const status = card.dataset.status;

                const typeMatch = typeFilter === 'all' || type === typeFilter;
                const statusMatch = statusFilter === 'all' || status === statusFilter;

                card.style.display = typeMatch && statusMatch ? 'block' : 'none';
            });
        }

        // Action handlers
        function selectModel(modelId) {
            vscode.postMessage({ type: 'selectModel', modelId });
        }

        function installModel(modelId) {
            vscode.postMessage({
                type: 'installModel',
                modelId,
                options: { quantization: 'q4_0' }
            });
        }

        function removeModel(modelId) {
            if (confirm(\`Are you sure you want to remove model \${modelId}?\`)) {
                vscode.postMessage({ type: 'removeModel', modelId });
            }
        }

        function configureModel(modelId) {
            vscode.postMessage({ type: 'configureModel', modelId });
        }

        function checkRequirements(modelId) {
            vscode.postMessage({ type: 'checkSystemRequirements', modelId });
        }

        function cancelDownload(modelId) {
            vscode.postMessage({ type: 'cancelDownload', modelId });
        }

        function updateDownloadProgress(progress) {
            downloads.set(progress.modelId, progress);

            const card = document.getElementById(\`model-\${progress.modelId}\`);
            if (card) {
                // Update the card content with progress
                const model = models.find(m => m.id === progress.modelId);
                if (model) {
                    card.innerHTML = createModelCard(model).replace(/^<div[^>]*>/, '').replace(/<\\/div>$/, '');
                }
            }
        }

        // Utility functions
        function formatStatus(status) {
            const statusMap = {
                'available': 'Available',
                'not_installed': 'Not Installed',
                'downloading': 'Downloading',
                'error': 'Error'
            };
            return statusMap[status] || status;
        }

        function formatBytes(bytes) {
            if (!bytes) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        }

        function formatTime(seconds) {
            if (!seconds || seconds === Infinity) return 'Unknown';
            if (seconds < 60) return \`\${Math.round(seconds)}s\`;
            if (seconds < 3600) return \`\${Math.round(seconds / 60)}m\`;
            return \`\${Math.round(seconds / 3600)}h\`;
        }

        function showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            document.body.insertBefore(errorDiv, document.body.firstChild);

            setTimeout(() => errorDiv.remove(), 5000);
        }

        function showSuccess(message) {
            // Similar to showError but with success styling
            console.log('Success:', message);
        }

        function showApiKeyDialog(data) {
            const message = \`\${data.instructions}\\n\\nEnvironment variable: \${data.envVar}\`;
            vscode.postMessage({
                type: 'openApiKeySetup',
                modelId: data.modelId
            });
        }

        // Initial load
        vscode.postMessage({ type: 'refreshModels' });
    </script>
</body>
</html>`;
	}
}
