import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { EventEmitter } from 'events';

export interface ModelConfig {
	path?: string;
	endpoint?: string;
	modelId?: string;
	displayName: string;
	description: string;
	provider?: string;
	hardwareRequirements?: {
		minRAM: number;
		recommendedRAM?: number;
		acceleration: string[];
		minVRAM?: number;
		diskSpace?: number;
	};
	capabilities: {
		[key: string]: boolean;
	};
	performance: {
		contextWindow: number;
		tokensPerSecond: number;
		accuracy: number;
	};
	pricing?: {
		inputTokens: number;
		outputTokens: number;
		currency: string;
		per: number;
	};
	requiresApiKey?: boolean;
	license: string;
	version?: string;
	downloadUrl?: string;
	checksum?: string;
}

export interface HardwareInfo {
	totalRAM: number;
	availableRAM: number;
	gpuInfo: {
		vendor: string;
		model: string;
		vram: number;
		acceleration: string[];
	}[];
	platform: string;
	architecture: string;
}

export interface ModelStatus {
	id: string;
	available: boolean;
	downloaded: boolean;
	loading: boolean;
	error?: string;
	lastUsed?: Date;
	usageCount: number;
}

export class HybridModelManager extends EventEmitter {
	private config: any;
	private configPath: string;
	private hardwareInfo: HardwareInfo | null = null;
	private modelStatuses = new Map<string, ModelStatus>();
	private activeModels = new Map<string, any>();
	private downloadQueue: string[] = [];

	constructor(configPath?: string) {
		super();
		this.configPath = configPath || path.join(__dirname, 'config.json');
		this.initializeManager();
	}

	/**
	 * Initialize the model manager
	 */
	private async initializeManager(): Promise<void> {
		try {
			await this.loadConfig();
			await this.detectHardware();
			await this.initializeModelStatuses();
			await this.validateLocalModels();

			this.emit('initialized');
			console.log('Hybrid Model Manager initialized successfully');
		} catch (error) {
			console.error('Failed to initialize model manager:', error);
			this.emit('error', error);
		}
	}

	/**
	 * Load configuration from file
	 */
	private async loadConfig(): Promise<void> {
		try {
			const configData = await fs.readFile(this.configPath, 'utf8');
			this.config = JSON.parse(configData);
		} catch (error) {
			throw new Error(`Failed to load model configuration: ${error}`);
		}
	}

	/**
	 * Detect hardware capabilities
	 */
	private async detectHardware(): Promise<void> {
		const totalRAM = os.totalmem() / (1024 * 1024 * 1024); // GB
		const freeRAM = os.freemem() / (1024 * 1024 * 1024); // GB

		// Detect GPU information (simplified implementation)
		const gpuInfo = await this.detectGPUs();

		this.hardwareInfo = {
			totalRAM,
			availableRAM: freeRAM,
			gpuInfo,
			platform: os.platform(),
			architecture: os.arch()
		};

		console.log('Hardware detected:', this.hardwareInfo);
	}

	/**
	 * Detect available GPUs and acceleration
	 */
	private async detectGPUs(): Promise<HardwareInfo['gpuInfo']> {
		const gpus: HardwareInfo['gpuInfo'] = [];

		try {
			// Check for NVIDIA GPU (CUDA)
			if (await this.checkCUDAAvailable()) {
				gpus.push({
					vendor: 'NVIDIA',
					model: 'GPU', // Would need actual detection
					vram: 8, // Would need actual detection
					acceleration: ['cuda']
				});
			}

			// Check for Apple Silicon (Metal)
			if (os.platform() === 'darwin' && os.arch() === 'arm64') {
				gpus.push({
					vendor: 'Apple',
					model: 'M-Series',
					vram: 16, // Unified memory
					acceleration: ['metal']
				});
			}

			// CPU is always available
			if (gpus.length === 0) {
				gpus.push({
					vendor: 'CPU',
					model: os.cpus()[0].model,
					vram: 0,
					acceleration: ['cpu']
				});
			}

		} catch (error) {
			console.warn('GPU detection failed:', error);
		}

		return gpus;
	}

	/**
	 * Check if CUDA is available
	 */
	private async checkCUDAAvailable(): Promise<boolean> {
		try {
			// This is a simplified check - in practice, you'd check for nvidia-smi or CUDA runtime
			const { exec } = require('child_process');
			return new Promise((resolve) => {
				exec('nvidia-smi', (error: any) => {
					resolve(!error);
				});
			});
		} catch {
			return false;
		}
	}

	/**
	 * Initialize model status tracking
	 */
	private async initializeModelStatuses(): Promise<void> {
		// Initialize local models
		for (const [id, model] of Object.entries(this.config.localModels || {})) {
			const modelConfig = model as ModelConfig;
			const isDownloaded = modelConfig.path ? await this.checkModelExists(modelConfig.path) : false;

			this.modelStatuses.set(id, {
				id,
				available: isDownloaded,
				downloaded: isDownloaded,
				loading: false,
				usageCount: 0
			});
		}

		// Initialize cloud models
		for (const [id, model] of Object.entries(this.config.cloudModels || {})) {
			this.modelStatuses.set(id, {
				id,
				available: true, // Cloud models are always available
				downloaded: false,
				loading: false,
				usageCount: 0
			});
		}
	}

	/**
	 * Check if local model file exists
	 */
	private async checkModelExists(modelPath: string): Promise<boolean> {
		try {
			await fs.access(path.resolve(modelPath));
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Validate local models
	 */
	private async validateLocalModels(): Promise<void> {
		for (const [id, model] of Object.entries(this.config.localModels || {})) {
			const modelConfig = model as ModelConfig;
			const status = this.modelStatuses.get(id);

			if (status?.downloaded && modelConfig.path) {
				try {
					const stats = await fs.stat(path.resolve(modelConfig.path));
					console.log(`Model ${id} validated: ${(stats.size / (1024 * 1024 * 1024)).toFixed(2)} GB`);
				} catch (error) {
					console.warn(`Model ${id} validation failed:`, error);
					status.available = false;
					status.error = 'File validation failed';
				}
			}
		}
	}

	/**
	 * Get compatible models based on hardware
	 */
	getCompatibleModels(): string[] {
		if (!this.hardwareInfo) return [];

		const compatible: string[] = [];

		// Check local models
		for (const [id, model] of Object.entries(this.config.localModels || {})) {
			const modelConfig = model as ModelConfig;
			if (this.isModelCompatible(modelConfig)) {
				compatible.push(id);
			}
		}

		// Cloud models are always compatible (if internet available)
		for (const id of Object.keys(this.config.cloudModels || {})) {
			compatible.push(id);
		}

		return compatible;
	}

	/**
	 * Check if model is compatible with current hardware
	 */
	private isModelCompatible(model: ModelConfig): boolean {
		if (!this.hardwareInfo || !model.hardwareRequirements) return true;

		const { hardwareRequirements } = model;
		const { totalRAM, gpuInfo } = this.hardwareInfo;

		// Check RAM requirement
		if (totalRAM < hardwareRequirements.minRAM) {
			return false;
		}

		// Check acceleration support
		const availableAcceleration = gpuInfo.flatMap(gpu => gpu.acceleration);
		const hasCompatibleAcceleration = hardwareRequirements.acceleration
			.some(acc => availableAcceleration.includes(acc));

		if (!hasCompatibleAcceleration) {
			return false;
		}

		// Check VRAM if required
		if (hardwareRequirements.minVRAM) {
			const maxVRAM = Math.max(...gpuInfo.map(gpu => gpu.vram));
			if (maxVRAM < hardwareRequirements.minVRAM) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Get recommended model for specific task
	 */
	getRecommendedModel(task: string): string | null {
		const group = this.config.modelGroups?.[task];
		if (!group) return null;

		const compatibleModels = this.getCompatibleModels();
		const groupModels = group.models.filter((id: string) => compatibleModels.includes(id));

		if (groupModels.length === 0) return null;

		// Prefer recommended model if available
		if (group.recommended && groupModels.includes(group.recommended)) {
			return group.recommended;
		}

		// Otherwise return first compatible model
		return groupModels[0];
	}

	/**
	 * Switch to specific model
	 */
	async switchToModel(modelId: string): Promise<boolean> {
		try {
			const status = this.modelStatuses.get(modelId);
			if (!status) {
				throw new Error(`Model ${modelId} not found`);
			}

			// Check if model is available
			if (!status.available) {
				// Try to download if it's a local model
				if (this.config.localModels[modelId]) {
					await this.downloadModel(modelId);
				} else {
					throw new Error(`Model ${modelId} is not available`);
				}
			}

			// Unload currently active models if needed
			const maxConcurrent = this.config.settings?.maxConcurrentModels || 1;
			if (this.activeModels.size >= maxConcurrent) {
				await this.unloadOldestModel();
			}

			// Load the model
			status.loading = true;
			this.emit('modelLoading', modelId);

			// Simulate model loading (in practice, this would load the actual model)
			await new Promise(resolve => setTimeout(resolve, 2000));

			this.activeModels.set(modelId, { id: modelId, loadedAt: new Date() });
			status.loading = false;
			status.lastUsed = new Date();
			status.usageCount++;

			this.emit('modelLoaded', modelId);
			console.log(`Switched to model: ${modelId}`);

			return true;

		} catch (error) {
			const status = this.modelStatuses.get(modelId);
			if (status) {
				status.loading = false;
				status.error = error instanceof Error ? error.message : 'Unknown error';
			}

			this.emit('modelError', modelId, error);
			throw error;
		}
	}

	/**
	 * Download model
	 */
	async downloadModel(modelId: string): Promise<void> {
		const model = this.config.localModels[modelId];
		if (!model || !model.downloadUrl) {
			throw new Error(`Cannot download model ${modelId}: No download URL`);
		}

		// Add to download queue
		this.downloadQueue.push(modelId);
		this.emit('downloadStarted', modelId);

		try {
			// Simulate download (in practice, this would download from the URL)
			console.log(`Downloading model ${modelId} from ${model.downloadUrl}`);

			// Create models directory if it doesn't exist
			const modelsDir = path.dirname(path.resolve(model.path));
			await fs.mkdir(modelsDir, { recursive: true });

			// Simulate download progress
			for (let progress = 0; progress <= 100; progress += 10) {
				await new Promise(resolve => setTimeout(resolve, 500));
				this.emit('downloadProgress', modelId, progress);
			}

			// Mark as downloaded
			const status = this.modelStatuses.get(modelId);
			if (status) {
				status.downloaded = true;
				status.available = true;
			}

			this.emit('downloadCompleted', modelId);

		} catch (error) {
			this.emit('downloadError', modelId, error);
			throw error;
		} finally {
			// Remove from download queue
			const index = this.downloadQueue.indexOf(modelId);
			if (index > -1) {
				this.downloadQueue.splice(index, 1);
			}
		}
	}

	/**
	 * Unload oldest model
	 */
	private async unloadOldestModel(): Promise<void> {
		let oldestModel: string | null = null;
		let oldestTime = new Date();

		for (const [id, model] of this.activeModels) {
			if (model.loadedAt < oldestTime) {
				oldestTime = model.loadedAt;
				oldestModel = id;
			}
		}

		if (oldestModel) {
			this.activeModels.delete(oldestModel);
			this.emit('modelUnloaded', oldestModel);
			console.log(`Unloaded model: ${oldestModel}`);
		}
	}

	/**
	 * Get model status
	 */
	getModelStatus(modelId: string): ModelStatus | undefined {
		return this.modelStatuses.get(modelId);
	}

	/**
	 * Get all model statuses
	 */
	getAllModelStatuses(): Map<string, ModelStatus> {
		return new Map(this.modelStatuses);
	}

	/**
	 * Get hardware information
	 */
	getHardwareInfo(): HardwareInfo | null {
		return this.hardwareInfo;
	}

	/**
	 * Get current configuration
	 */
	getConfig(): any {
		return { ...this.config };
	}

	/**
	 * Update configuration
	 */
	async updateConfig(updates: any): Promise<void> {
		this.config = { ...this.config, ...updates };
		await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
		this.emit('configUpdated');
	}

	/**
	 * Get usage statistics
	 */
	getUsageStatistics(): {
		totalModels: number;
		downloadedModels: number;
		activeModels: number;
		mostUsedModel: string | null;
		totalUsage: number;
	} {
		const statuses = Array.from(this.modelStatuses.values());
		const totalUsage = statuses.reduce((sum, status) => sum + status.usageCount, 0);
		const mostUsedModel = statuses.reduce((max, status) =>
			status.usageCount > (max?.usageCount || 0) ? status : max, null as ModelStatus | null
		);

		return {
			totalModels: statuses.length,
			downloadedModels: statuses.filter(s => s.downloaded).length,
			activeModels: this.activeModels.size,
			mostUsedModel: mostUsedModel?.id || null,
			totalUsage
		};
	}
}

// Global model manager instance
export const globalModelManager = new HybridModelManager();

export default HybridModelManager;
