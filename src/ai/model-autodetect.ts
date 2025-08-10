import * as os from 'os';
import * as fs from 'fs/promises';
import * as path from 'path';
import { execSync } from 'child_process';

export interface AIModel {
	id: string;
	name: string;
	type: 'cloud' | 'local';
	endpoint?: string;
	path?: string;
	context: number;
	requirements?: {
		ram: number;
		gpu?: string;
		vram?: number;
	};
	tags?: string[];
	defaultPrompt?: string;
	performance?: {
		tokensPerSecond: number;
		latency: number;
	};
	status?: 'available' | 'downloading' | 'error' | 'not_installed';
}

export interface SystemHardware {
	ram: number; // GB
	gpu: {
		name: string;
		vram: number; // GB
		cuda: boolean;
		opencl: boolean;
	}[];
	cpu: {
		cores: number;
		threads: number;
		arch: string;
	};
	os: string;
	platform: string;
}

export class ModelDetector {
	private static readonly MODEL_REGISTRY_PATH = path.join(os.homedir(), 'ai_models', 'model-registry.json');
	private static readonly VSCODE_CONFIG_PATH = path.join(os.homedir(), '.vscode', 'ai_models.json');

	static async findBestModel(): Promise<AIModel | null> {
		const hardware = await this.checkHardware();
		const models = await this.getAvailableModels();

		if (models.length === 0) {
			return null;
		}

		// Sort models by preference: local > cloud, higher context > lower context
		const sortedModels = models.sort((a, b) => {
			// Prioritize local models that meet requirements
			const aLocal = a.type === 'local' && this.meetsRequirements(a, hardware);
			const bLocal = b.type === 'local' && this.meetsRequirements(b, hardware);

			if (aLocal && !bLocal) return -1;
			if (!aLocal && bLocal) return 1;

			// If both are local or both are cloud, prefer higher context
			if (a.context !== b.context) {
				return b.context - a.context;
			}

			// Prefer models with better performance
			const aPerf = a.performance?.tokensPerSecond || 0;
			const bPerf = b.performance?.tokensPerSecond || 0;
			return bPerf - aPerf;
		});

		return sortedModels[0];
	}

	static async getAvailableModels(): Promise<AIModel[]> {
		try {
			// Check if registry exists
			const registryExists = await fs.access(this.MODEL_REGISTRY_PATH).then(() => true).catch(() => false);

			if (!registryExists) {
				// Create default registry
				await this.createDefaultRegistry();
			}

			const registryContent = await fs.readFile(this.MODEL_REGISTRY_PATH, 'utf-8');
			const registry = JSON.parse(registryContent);

			// Check status of each model
			const modelsWithStatus = await Promise.all(
				registry.models.map(async (model: AIModel) => {
					const status = await this.checkModelStatus(model);
					return { ...model, status };
				})
			);

			return modelsWithStatus;
		} catch (error) {
			console.error('Failed to get available models:', error);
			return [];
		}
	}

	static async checkHardware(): Promise<SystemHardware> {
		const hardware: SystemHardware = {
			ram: Math.round(os.totalmem() / (1024 * 1024 * 1024)), // Convert to GB
			gpu: [],
			cpu: {
				cores: os.cpus().length,
				threads: os.cpus().length, // Simplified - actual threads might be 2x cores
				arch: os.arch()
			},
			os: os.type(),
			platform: os.platform()
		};

		// Detect GPU information
		try {
			// Try nvidia-smi for NVIDIA GPUs
			const nvidiaOutput = execSync('nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits', { encoding: 'utf-8' });
			const nvidiaLines = nvidiaOutput.trim().split('\n');

			for (const line of nvidiaLines) {
				const [name, memory] = line.split(', ');
				hardware.gpu.push({
					name: name.trim(),
					vram: Math.round(parseInt(memory) / 1024), // Convert MB to GB
					cuda: true,
					opencl: true
				});
			}
		} catch (error) {
			// NVIDIA GPU not available or nvidia-smi not found
		}

		// Try to detect AMD GPUs
		try {
			const rocmOutput = execSync('rocm-smi --showmeminfo vram --csv', { encoding: 'utf-8' });
			// Parse AMD GPU info if available
		} catch (error) {
			// AMD GPU not available
		}

		// If no dedicated GPU found, add integrated graphics info
		if (hardware.gpu.length === 0) {
			hardware.gpu.push({
				name: 'Integrated Graphics',
				vram: Math.max(1, Math.round(hardware.ram * 0.1)), // Estimate shared memory
				cuda: false,
				opencl: true
			});
		}

		return hardware;
	}

	public static meetsRequirements(model: AIModel, systemInfo: SystemHardware): boolean {
		if (!model.requirements) return true;

		const req = model.requirements;

		// Check minimum RAM
		if (req.minRam && systemInfo.totalRam < req.minRam) {
			return false;
		}

		// Check GPU requirement
		if (req.gpu && !systemInfo.hasGpu) {
			return false;
		}

		// Check minimum CPU cores
		if (req.minCpuCores && systemInfo.cpuCores < req.minCpuCores) {
			return false;
		}

		return true;
	}

	public static async updateModelStatus(modelId: string, status: string): Promise<void> {
		try {
			const registryPath = path.join(os.homedir(), 'ai_models', 'model-registry.json');
			const registryContent = await fs.readFile(registryPath, 'utf-8');
			const registry = JSON.parse(registryContent);

			const modelIndex = registry.models.findIndex((m: AIModel) => m.id === modelId);
			if (modelIndex !== -1) {
				registry.models[modelIndex].status = status;
				registry.lastUpdated = new Date().toISOString();

				await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));
			}
		} catch (error) {
			console.error('Failed to update model status:', error);
		}
	}

	public static async updateModelConfig(modelId: string, updates: Partial<AIModel>): Promise<void> {
		try {
			const registryPath = path.join(os.homedir(), 'ai_models', 'model-registry.json');
			const registryContent = await fs.readFile(registryPath, 'utf-8');
			const registry = JSON.parse(registryContent);

			const modelIndex = registry.models.findIndex((m: AIModel) => m.id === modelId);
			if (modelIndex !== -1) {
				registry.models[modelIndex] = { ...registry.models[modelIndex], ...updates };
				registry.lastUpdated = new Date().toISOString();

				await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));
			}
		} catch (error) {
			console.error('Failed to update model config:', error);
		}
	}

	public static getApiKeyEnvVar(modelId: string): string {
		const envVars: Record<string, string> = {
			'claude-3-sonnet': 'ANTHROPIC_API_KEY',
			'claude-3-haiku': 'ANTHROPIC_API_KEY',
			'gpt-4': 'OPENAI_API_KEY',
			'gpt-3.5-turbo': 'OPENAI_API_KEY',
			'gemini-pro': 'GOOGLE_API_KEY'
		};

		return envVars[modelId] || `${modelId.toUpperCase()}_API_KEY`;
	}

	public static async hasGpu(): Promise<boolean> {
		const systemInfo = await this.checkSystemHardware();
		return systemInfo.hasGpu;
	}

	static async checkModelStatus(model: AIModel): Promise<AIModel['status']> {
		if (model.type === 'cloud') {
			// For cloud models, check if API key is available
			const apiKeyEnvVar = this.getApiKeyEnvVar(model.id);
			return process.env[apiKeyEnvVar] ? 'available' : 'not_installed';
		}

		if (model.type === 'local' && model.path) {
			try {
				const expandedPath = model.path.replace('~', os.homedir());
				await fs.access(expandedPath);
				return 'available';
			} catch (error) {
				return 'not_installed';
			}
		}

		return 'error';
	}

	static getApiKeyEnvVar(modelId: string): string {
		const envVarMap: Record<string, string> = {
			'claude-3-sonnet': 'ANTHROPIC_API_KEY',
			'claude-3-haiku': 'ANTHROPIC_API_KEY',
			'gpt-4': 'OPENAI_API_KEY',
			'gpt-3.5-turbo': 'OPENAI_API_KEY',
			'gemini-pro': 'GOOGLE_API_KEY',
		};

		return envVarMap[modelId] || `${modelId.toUpperCase().replace(/-/g, '_')}_API_KEY`;
	}

	private static async createDefaultRegistry(): Promise<void> {
		const defaultRegistry = {
			version: "1.0.0",
			lastUpdated: new Date().toISOString(),
			models: [
				// Cloud Models
				{
					id: "claude-3-sonnet",
					name: "Claude 3 Sonnet",
					type: "cloud",
					endpoint: "https://api.anthropic.com",
					context: 200000,
					defaultPrompt: "anthropic",
					performance: {
						tokensPerSecond: 25,
						latency: 800
					}
				},
				{
					id: "claude-3-haiku",
					name: "Claude 3 Haiku",
					type: "cloud",
					endpoint: "https://api.anthropic.com",
					context: 200000,
					defaultPrompt: "anthropic",
					performance: {
						tokensPerSecond: 45,
						latency: 400
					}
				},
				{
					id: "gpt-4",
					name: "GPT-4",
					type: "cloud",
					endpoint: "https://api.openai.com",
					context: 128000,
					defaultPrompt: "openai",
					performance: {
						tokensPerSecond: 20,
						latency: 1000
					}
				},
				{
					id: "gpt-3.5-turbo",
					name: "GPT-3.5 Turbo",
					type: "cloud",
					endpoint: "https://api.openai.com",
					context: 16384,
					defaultPrompt: "openai",
					performance: {
						tokensPerSecond: 50,
						latency: 300
					}
				},
				// Local Models
				{
					id: "llama3-70b-q4",
					name: "Llama 3 70B (Q4)",
					type: "local",
					path: "~/ai_models/llama3-70b/model-q4_0.gguf",
					context: 8192,
					requirements: {
						ram: 48,
						vram: 24
					},
					tags: ["large", "reasoning"],
					performance: {
						tokensPerSecond: 15,
						latency: 2000
					}
				},
				{
					id: "llama3-8b-q4",
					name: "Llama 3 8B (Q4)",
					type: "local",
					path: "~/ai_models/llama3-8b/model-q4_0.gguf",
					context: 8192,
					requirements: {
						ram: 8,
						vram: 6
					},
					tags: ["medium", "balanced"],
					performance: {
						tokensPerSecond: 35,
						latency: 800
					}
				},
				{
					id: "dolphin-2.9-uncensored",
					name: "Dolphin 2.9 Uncensored",
					type: "local",
					path: "~/ai_models/dolphin-2.9/model.gguf",
					context: 4096,
					requirements: {
						ram: 16,
						vram: 8
					},
					tags: ["uncensored", "creative"],
					performance: {
						tokensPerSecond: 25,
						latency: 1200
					}
				},
				{
					id: "codellama-34b",
					name: "Code Llama 34B",
					type: "local",
					path: "~/ai_models/codellama-34b/model-q4_0.gguf",
					context: 16384,
					requirements: {
						ram: 24,
						vram: 16
					},
					tags: ["coding", "specialized"],
					performance: {
						tokensPerSecond: 20,
						latency: 1500
					}
				},
				{
					id: "mistral-7b-instruct",
					name: "Mistral 7B Instruct",
					type: "local",
					path: "~/ai_models/mistral-7b/model-q4_0.gguf",
					context: 8192,
					requirements: {
						ram: 6,
						vram: 4
					},
					tags: ["small", "fast"],
					performance: {
						tokensPerSecond: 40,
						latency: 600
					}
				},
				{
					id: "phi-3-medium",
					name: "Phi-3 Medium",
					type: "local",
					path: "~/ai_models/phi-3-medium/model-q4_0.gguf",
					context: 4096,
					requirements: {
						ram: 8,
						vram: 6
					},
					tags: ["microsoft", "reasoning"],
					performance: {
						tokensPerSecond: 30,
						latency: 900
					}
				},
				{
					id: "wizardcoder-15b",
					name: "WizardCoder 15B",
					type: "local",
					path: "~/ai_models/wizardcoder-15b/model-q4_0.gguf",
					context: 8192,
					requirements: {
						ram: 12,
						vram: 8
					},
					tags: ["coding", "specialized"],
					performance: {
						tokensPerSecond: 22,
						latency: 1300
					}
				},
				{
					id: "neural-chat-7b",
					name: "Neural Chat 7B",
					type: "local",
					path: "~/ai_models/neural-chat-7b/model-q4_0.gguf",
					context: 4096,
					requirements: {
						ram: 6,
						vram: 4
					},
					tags: ["chat", "friendly"],
					performance: {
						tokensPerSecond: 38,
						latency: 700
					}
				},
				{
					id: "deepseek-coder-33b",
					name: "DeepSeek Coder 33B",
					type: "local",
					path: "~/ai_models/deepseek-coder-33b/model-q4_0.gguf",
					context: 16384,
					requirements: {
						ram: 22,
						vram: 14
					},
					tags: ["coding", "large"],
					performance: {
						tokensPerSecond: 18,
						latency: 1600
					}
				},
				{
					id: "vicuna-13b-uncensored",
					name: "Vicuna 13B Uncensored",
					type: "local",
					path: "~/ai_models/vicuna-13b/model-q4_0.gguf",
					context: 4096,
					requirements: {
						ram: 10,
						vram: 7
					},
					tags: ["uncensored", "creative", "medium"],
					performance: {
						tokensPerSecond: 28,
						latency: 1000
					}
				}
			]
		};

		// Ensure directory exists
		const modelsDir = path.dirname(this.MODEL_REGISTRY_PATH);
		await fs.mkdir(modelsDir, { recursive: true });

		// Write registry
		await fs.writeFile(this.MODEL_REGISTRY_PATH, JSON.stringify(defaultRegistry, null, 2));

		// Also create VS Code config
		const vscodeDir = path.dirname(this.VSCODE_CONFIG_PATH);
		await fs.mkdir(vscodeDir, { recursive: true });
		await fs.writeFile(this.VSCODE_CONFIG_PATH, JSON.stringify(defaultRegistry, null, 2));
	}

	static async updateModelStatus(modelId: string, status: AIModel['status']): Promise<void> {
		try {
			const registryContent = await fs.readFile(this.MODEL_REGISTRY_PATH, 'utf-8');
			const registry = JSON.parse(registryContent);

			const modelIndex = registry.models.findIndex((m: AIModel) => m.id === modelId);
			if (modelIndex !== -1) {
				registry.models[modelIndex].status = status;
				registry.lastUpdated = new Date().toISOString();

				await fs.writeFile(this.MODEL_REGISTRY_PATH, JSON.stringify(registry, null, 2));
			}
		} catch (error) {
			console.error('Failed to update model status:', error);
		}
	}

	static async getRecommendedModels(hardware: SystemHardware): Promise<AIModel[]> {
		const models = await this.getAvailableModels();

		return models
			.filter(model => this.meetsRequirements(model, hardware))
			.sort((a, b) => {
				// Prefer local models
				if (a.type === 'local' && b.type === 'cloud') return -1;
				if (a.type === 'cloud' && b.type === 'local') return 1;

				// Then by performance
				const aPerf = a.performance?.tokensPerSecond || 0;
				const bPerf = b.performance?.tokensPerSecond || 0;
				return bPerf - aPerf;
			})
			.slice(0, 5); // Top 5 recommendations
	}

	static getModelPath(modelId: string): string {
		return path.join(os.homedir(), 'ai_models', modelId);
	}

	static getModelExecutionFlags(model: AIModel): string[] {
		if (model.type !== 'local' || !model.path) return [];

		const flags = [
			'--model', model.path.replace('~', os.homedir()),
			'--ctx-size', model.context.toString(),
			'--threads', Math.max(1, Math.floor(os.cpus().length / 2)).toString(),
			'--mlock', // Keep model in memory
			'--no-mmap' // Don't use memory mapping for better performance
		];

		// Add GPU acceleration if available
		try {
			execSync('nvidia-smi', { stdio: 'ignore' });
			flags.push('--n-gpu-layers', '99'); // Offload all layers to GPU
		} catch (error) {
			// No NVIDIA GPU available
		}

		return flags;
	}
}
