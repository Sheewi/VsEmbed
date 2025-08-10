import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { spawn, execSync } from 'child_process';
import { EventEmitter } from 'events';
import { AIModel, ModelDetector } from './model-autodetect';

export interface DownloadProgress {
	modelId: string;
	progress: number; // 0-100
	downloaded: number; // bytes
	total: number; // bytes
	speed: number; // bytes/second
	eta: number; // seconds
	status: 'downloading' | 'extracting' | 'complete' | 'error';
	error?: string;
}

export interface ModelInstallOptions {
	force?: boolean; // Overwrite existing files
	quantization?: 'q4_0' | 'q4_1' | 'q5_0' | 'q5_1' | 'q8_0' | 'f16' | 'f32';
	skipVerification?: boolean;
}

export class ModelInstaller extends EventEmitter {
	private static readonly BASE_MODELS_DIR = path.join(os.homedir(), 'ai_models');
	private static readonly DOWNLOAD_CACHE_DIR = path.join(os.homedir(), '.cache', 'ai_models');

	private downloadQueue: Map<string, DownloadProgress> = new Map();
	private activeDownloads: Set<string> = new Set();

	constructor() {
		super();
		this.ensureDirectoriesExist();
	}

	async installModel(modelId: string, options: ModelInstallOptions = {}): Promise<boolean> {
		if (this.activeDownloads.has(modelId)) {
			throw new Error(`Model ${modelId} is already being downloaded`);
		}

		const models = await ModelDetector.getAvailableModels();
		const model = models.find(m => m.id === modelId);

		if (!model) {
			throw new Error(`Model ${modelId} not found in registry`);
		}

		if (model.type === 'cloud') {
			return this.setupCloudModel(model);
		}

		return this.downloadLocalModel(model, options);
	}

	async downloadLocalModel(model: AIModel, options: ModelInstallOptions): Promise<boolean> {
		this.activeDownloads.add(model.id);

		try {
			const progress: DownloadProgress = {
				modelId: model.id,
				progress: 0,
				downloaded: 0,
				total: 0,
				speed: 0,
				eta: 0,
				status: 'downloading'
			};

			this.downloadQueue.set(model.id, progress);
			this.emit('downloadStarted', progress);

			// Get download URL for the model
			const downloadUrl = this.getDownloadUrl(model, options.quantization);
			const targetPath = this.getModelTargetPath(model, options.quantization);

			// Check if file already exists
			if (!options.force) {
				try {
					await fs.access(targetPath);
					progress.status = 'complete';
					progress.progress = 100;
					this.emit('downloadComplete', progress);
					return true;
				} catch (error) {
					// File doesn't exist, proceed with download
				}
			}

			// Ensure target directory exists
			await fs.mkdir(path.dirname(targetPath), { recursive: true });

			// Download the model
			const success = await this.downloadFile(downloadUrl, targetPath, progress);

			if (success) {
				// Verify download if not skipped
				if (!options.skipVerification) {
					progress.status = 'extracting';
					this.emit('downloadProgress', progress);

					const verified = await this.verifyDownload(targetPath, model);
					if (!verified) {
						throw new Error('Download verification failed');
					}
				}

				// Update model registry
				await this.updateModelPath(model.id, targetPath);

				progress.status = 'complete';
				progress.progress = 100;
				this.emit('downloadComplete', progress);

				return true;
			} else {
				throw new Error('Download failed');
			}

		} catch (error) {
			const progress = this.downloadQueue.get(model.id);
			if (progress) {
				progress.status = 'error';
				progress.error = error instanceof Error ? error.message : 'Unknown error';
				this.emit('downloadError', progress);
			}
			return false;
		} finally {
			this.activeDownloads.delete(model.id);
			this.downloadQueue.delete(model.id);
		}
	}

	private async downloadFile(url: string, targetPath: string, progress: DownloadProgress): Promise<boolean> {
		return new Promise((resolve, reject) => {
			// Use curl for downloading with progress tracking
			const curlArgs = [
				'--location',
				'--progress-bar',
				'--output', targetPath,
				'--continue-at', '-', // Resume partial downloads
				url
			];

			const curlProcess = spawn('curl', curlArgs, {
				stdio: ['pipe', 'pipe', 'pipe']
			});

			let lastUpdate = Date.now();
			let lastDownloaded = 0;

			curlProcess.stderr?.on('data', (data) => {
				const output = data.toString();

				// Parse curl progress output
				const progressMatch = output.match(/(\d+)%.*?(\d+[KMGT]?)\s+(\d+[KMGT]?)\s+(\d+[KMGT]?)\s+(\d+[KMGT]?)/);
				if (progressMatch) {
					const [, percent, downloaded, total] = progressMatch;

					progress.progress = parseInt(percent);
					progress.downloaded = this.parseSize(downloaded);
					progress.total = this.parseSize(total);

					// Calculate speed
					const now = Date.now();
					const timeDiff = (now - lastUpdate) / 1000;
					if (timeDiff > 1) {
						progress.speed = (progress.downloaded - lastDownloaded) / timeDiff;
						progress.eta = progress.speed > 0 ? (progress.total - progress.downloaded) / progress.speed : 0;

						lastUpdate = now;
						lastDownloaded = progress.downloaded;

						this.emit('downloadProgress', progress);
					}
				}
			});

			curlProcess.on('close', (code) => {
				if (code === 0) {
					resolve(true);
				} else {
					reject(new Error(`Download failed with exit code ${code}`));
				}
			});

			curlProcess.on('error', (error) => {
				reject(error);
			});
		});
	}

	private parseSize(sizeStr: string): number {
		const match = sizeStr.match(/^(\d+(?:\.\d+)?)([KMGT])?$/);
		if (!match) return parseInt(sizeStr) || 0;

		const [, num, unit] = match;
		const size = parseFloat(num);

		switch (unit) {
			case 'K': return size * 1024;
			case 'M': return size * 1024 * 1024;
			case 'G': return size * 1024 * 1024 * 1024;
			case 'T': return size * 1024 * 1024 * 1024 * 1024;
			default: return size;
		}
	}

	private getDownloadUrl(model: AIModel, quantization?: string): string {
		// Map of model IDs to their download URLs
		const baseUrls: Record<string, string> = {
			'llama3-70b-q4': 'https://huggingface.co/microsoft/Llama-3-70B-Instruct-GGUF/resolve/main/Llama-3-70B-Instruct-Q4_0.gguf',
			'llama3-8b-q4': 'https://huggingface.co/microsoft/Llama-3-8B-Instruct-GGUF/resolve/main/Llama-3-8B-Instruct-Q4_0.gguf',
			'dolphin-2.9-uncensored': 'https://huggingface.co/cognitivecomputations/dolphin-2.9-llama3-8b-gguf/resolve/main/dolphin-2.9-llama3-8b-q4_0.gguf',
			'codellama-34b': 'https://huggingface.co/codellama/CodeLlama-34b-Instruct-GGUF/resolve/main/codellama-34b-instruct.q4_0.gguf',
			'mistral-7b-instruct': 'https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.q4_0.gguf',
			'phi-3-medium': 'https://huggingface.co/microsoft/Phi-3-medium-4k-instruct-gguf/resolve/main/Phi-3-medium-4k-instruct-q4.gguf',
			'wizardcoder-15b': 'https://huggingface.co/WizardLM/WizardCoder-15B-V1.0-GGUF/resolve/main/wizardcoder-15b-v1.0.q4_0.gguf',
			'neural-chat-7b': 'https://huggingface.co/Intel/neural-chat-7b-v3-3-GGUF/resolve/main/neural-chat-7b-v3-3.q4_0.gguf',
			'deepseek-coder-33b': 'https://huggingface.co/deepseek-ai/deepseek-coder-33b-instruct-GGUF/resolve/main/deepseek-coder-33b-instruct.q4_0.gguf',
			'vicuna-13b-uncensored': 'https://huggingface.co/Undi95/Vicuna-13B-v1.5-Uncensored-GGUF/resolve/main/vicuna-13b-v1.5-uncensored.q4_0.gguf'
		};

		let url = baseUrls[model.id];
		if (!url) {
			throw new Error(`No download URL configured for model ${model.id}`);
		}

		// Modify URL based on quantization if specified
		if (quantization && quantization !== 'q4_0') {
			url = url.replace('q4_0', quantization);
		}

		return url;
	}

	private getModelTargetPath(model: AIModel, quantization?: string): string {
		const modelDir = path.join(ModelInstaller.BASE_MODELS_DIR, model.id);
		const filename = quantization ? `model-${quantization}.gguf` : 'model.gguf';
		return path.join(modelDir, filename);
	}

	private async verifyDownload(filePath: string, model: AIModel): Promise<boolean> {
		try {
			const stats = await fs.stat(filePath);

			// Basic file size check - GGUF files should be at least 1GB for reasonable models
			if (stats.size < 1024 * 1024 * 1024) {
				console.warn(`Model file ${filePath} seems too small: ${stats.size} bytes`);
				return false;
			}

			// Check if file is a valid GGUF file by reading magic number
			const fileHandle = await fs.open(filePath, 'r');
			const buffer = Buffer.alloc(4);
			await fileHandle.read(buffer, 0, 4, 0);
			await fileHandle.close();

			const magic = buffer.toString('ascii');
			if (magic !== 'GGUF') {
				console.error(`Invalid GGUF magic number: ${magic}`);
				return false;
			}

			return true;
		} catch (error) {
			console.error('Download verification failed:', error);
			return false;
		}
	}

	private async setupCloudModel(model: AIModel): Promise<boolean> {
		// For cloud models, just check if API key environment variable is set
		const apiKeyVar = ModelDetector.getApiKeyEnvVar(model.id);

		if (process.env[apiKeyVar]) {
			await ModelDetector.updateModelStatus(model.id, 'available');
			return true;
		}

		// Prompt user to set up API key
		this.emit('apiKeyRequired', {
			modelId: model.id,
			envVar: apiKeyVar,
			instructions: this.getApiKeyInstructions(model.id)
		});

		return false;
	}

	private getApiKeyInstructions(modelId: string): string {
		const instructions: Record<string, string> = {
			'claude-3-sonnet': 'Get your API key from https://console.anthropic.com/ and set ANTHROPIC_API_KEY environment variable',
			'claude-3-haiku': 'Get your API key from https://console.anthropic.com/ and set ANTHROPIC_API_KEY environment variable',
			'gpt-4': 'Get your API key from https://platform.openai.com/api-keys and set OPENAI_API_KEY environment variable',
			'gpt-3.5-turbo': 'Get your API key from https://platform.openai.com/api-keys and set OPENAI_API_KEY environment variable',
			'gemini-pro': 'Get your API key from https://makersuite.google.com/app/apikey and set GOOGLE_API_KEY environment variable'
		};

		return instructions[modelId] || `Set up API key for ${modelId}`;
	}

	private async updateModelPath(modelId: string, filePath: string): Promise<void> {
		try {
			const registryPath = path.join(os.homedir(), 'ai_models', 'model-registry.json');
			const registryContent = await fs.readFile(registryPath, 'utf-8');
			const registry = JSON.parse(registryContent);

			const modelIndex = registry.models.findIndex((m: AIModel) => m.id === modelId);
			if (modelIndex !== -1) {
				registry.models[modelIndex].path = filePath;
				registry.models[modelIndex].status = 'available';
				registry.lastUpdated = new Date().toISOString();

				await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));
			}
		} catch (error) {
			console.error('Failed to update model path in registry:', error);
		}
	}

	private async ensureDirectoriesExist(): Promise<void> {
		await fs.mkdir(ModelInstaller.BASE_MODELS_DIR, { recursive: true });
		await fs.mkdir(ModelInstaller.DOWNLOAD_CACHE_DIR, { recursive: true });
	}

	async cancelDownload(modelId: string): Promise<void> {
		if (this.activeDownloads.has(modelId)) {
			this.activeDownloads.delete(modelId);
			const progress = this.downloadQueue.get(modelId);
			if (progress) {
				progress.status = 'error';
				progress.error = 'Download cancelled by user';
				this.emit('downloadCancelled', progress);
				this.downloadQueue.delete(modelId);
			}
		}
	}

	getDownloadProgress(modelId: string): DownloadProgress | null {
		return this.downloadQueue.get(modelId) || null;
	}

	getActiveDownloads(): DownloadProgress[] {
		return Array.from(this.downloadQueue.values());
	}

	async removeModel(modelId: string): Promise<boolean> {
		try {
			const models = await ModelDetector.getAvailableModels();
			const model = models.find(m => m.id === modelId);

			if (!model || model.type === 'cloud') {
				return true; // Nothing to remove for cloud models
			}

			if (model.path) {
				const expandedPath = model.path.replace('~', os.homedir());
				const modelDir = path.dirname(expandedPath);

				// Remove the entire model directory
				await fs.rm(modelDir, { recursive: true, force: true });

				// Update registry
				await ModelDetector.updateModelStatus(modelId, 'not_installed');

				this.emit('modelRemoved', { modelId });
				return true;
			}

			return false;
		} catch (error) {
			console.error(`Failed to remove model ${modelId}:`, error);
			return false;
		}
	}

	async getModelSize(modelId: string): Promise<number> {
		try {
			const models = await ModelDetector.getAvailableModels();
			const model = models.find(m => m.id === modelId);

			if (!model || !model.path) return 0;

			const expandedPath = model.path.replace('~', os.homedir());
			const stats = await fs.stat(expandedPath);
			return stats.size;
		} catch (error) {
			return 0;
		}
	}

	async getTotalModelsSize(): Promise<number> {
		try {
			const files = await fs.readdir(ModelInstaller.BASE_MODELS_DIR, { recursive: true });
			let totalSize = 0;

			for (const file of files) {
				try {
					const filePath = path.join(ModelInstaller.BASE_MODELS_DIR, file.toString());
					const stats = await fs.stat(filePath);
					if (stats.isFile()) {
						totalSize += stats.size;
					}
				} catch (error) {
					// Skip files that can't be accessed
				}
			}

			return totalSize;
		} catch (error) {
			return 0;
		}
	}
}
