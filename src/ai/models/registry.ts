import * as os from 'os';
import * as path from 'path';
import { execSync } from 'child_process';

export interface ModelConfig {
	id: string;
	name: string;
	type: 'local' | 'cloud';
	path?: string;
	endpoint?: string;
	hardware: {
		minRAM: number; // GB
		acceleration: 'cuda' | 'metal' | 'cpu' | 'cuda|metal|cpu';
		minVRAM?: number; // GB
	};
	context: number;
	quantization?: 'q4_0' | 'q4_1' | 'q5_0' | 'q5_1' | 'q8_0' | 'f16' | 'f32';
	capabilities: string[];
	performance: {
		tokensPerSecond: number;
		latency: number; // ms
		powerUsage?: number; // watts
	};
	security: {
		sandboxed: boolean;
		permissions: string[];
	};
	downloadUrl?: string;
	checksum?: string;
	license: string;
	tags: string[];
}

export const MODEL_REGISTRY: Record<string, ModelConfig> = {
	// High-Performance Local Models
	'llama3-70b-q4': {
		id: 'llama3-70b-q4',
		name: 'Llama 3 70B (Q4)',
		type: 'local',
		path: './models/llama3-70b-q4.gguf',
		hardware: {
			minRAM: 64,
			acceleration: 'cuda|metal|cpu',
			minVRAM: 24
		},
		context: 8192,
		quantization: 'q4_0',
		capabilities: ['reasoning', 'coding', 'analysis', 'creative'],
		performance: {
			tokensPerSecond: 15,
			latency: 2000,
			powerUsage: 200
		},
		security: {
			sandboxed: true,
			permissions: ['files:read', 'terminal:create']
		},
		downloadUrl: 'https://huggingface.co/microsoft/Llama-3-70B-Instruct-GGUF/resolve/main/Llama-3-70B-Instruct-Q4_0.gguf',
		checksum: 'sha256:abc123...',
		license: 'Llama 3 Community License',
		tags: ['large', 'reasoning', 'enterprise']
	},

	'llama3-8b-q4': {
		id: 'llama3-8b-q4',
		name: 'Llama 3 8B (Q4)',
		type: 'local',
		path: './models/llama3-8b-q4.gguf',
		hardware: {
			minRAM: 8,
			acceleration: 'cuda|metal|cpu',
			minVRAM: 6
		},
		context: 8192,
		quantization: 'q4_0',
		capabilities: ['coding', 'reasoning', 'general'],
		performance: {
			tokensPerSecond: 35,
			latency: 800,
			powerUsage: 50
		},
		security: {
			sandboxed: true,
			permissions: ['files:read', 'terminal:create']
		},
		downloadUrl: 'https://huggingface.co/microsoft/Llama-3-8B-Instruct-GGUF/resolve/main/Llama-3-8B-Instruct-Q4_0.gguf',
		license: 'Llama 3 Community License',
		tags: ['balanced', 'popular', 'recommended']
	},

	'codellama-34b': {
		id: 'codellama-34b',
		name: 'CodeLlama 34B',
		type: 'local',
		path: './models/codellama-34b-q4.gguf',
		hardware: {
			minRAM: 24,
			acceleration: 'cuda|metal|cpu',
			minVRAM: 16
		},
		context: 16384,
		quantization: 'q4_0',
		capabilities: ['coding', 'debugging', 'refactoring'],
		performance: {
			tokensPerSecond: 20,
			latency: 1500,
			powerUsage: 120
		},
		security: {
			sandboxed: true,
			permissions: ['files:read', 'files:write', 'terminal:create']
		},
		downloadUrl: 'https://huggingface.co/codellama/CodeLlama-34b-Instruct-GGUF/resolve/main/codellama-34b-instruct.q4_0.gguf',
		license: 'Custom Commercial License',
		tags: ['coding', 'specialized', 'large']
	},

	'dolphin-uncensored': {
		id: 'dolphin-uncensored',
		name: 'Dolphin 2.9 Uncensored',
		type: 'local',
		path: './models/dolphin-2.9-uncensored.gguf',
		hardware: {
			minRAM: 16,
			acceleration: 'cuda|metal|cpu',
			minVRAM: 8
		},
		context: 4096,
		quantization: 'q4_0',
		capabilities: ['creative', 'uncensored', 'roleplaying'],
		performance: {
			tokensPerSecond: 25,
			latency: 1200,
			powerUsage: 70
		},
		security: {
			sandboxed: true,
			permissions: ['files:read']
		},
		downloadUrl: 'https://huggingface.co/cognitivecomputations/dolphin-2.9-llama3-8b-gguf/resolve/main/dolphin-2.9-llama3-8b-q4_0.gguf',
		license: 'Apache 2.0',
		tags: ['creative', 'uncensored', 'experimental']
	},

	'mistral-7b': {
		id: 'mistral-7b',
		name: 'Mistral 7B Instruct',
		type: 'local',
		path: './models/mistral-7b-instruct.gguf',
		hardware: {
			minRAM: 6,
			acceleration: 'cuda|metal|cpu',
			minVRAM: 4
		},
		context: 8192,
		quantization: 'q4_0',
		capabilities: ['general', 'fast', 'efficient'],
		performance: {
			tokensPerSecond: 40,
			latency: 600,
			powerUsage: 30
		},
		security: {
			sandboxed: true,
			permissions: ['files:read', 'terminal:create']
		},
		downloadUrl: 'https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.q4_0.gguf',
		license: 'Apache 2.0',
		tags: ['small', 'fast', 'efficient']
	},

	// Cloud Models
	'gpt4-turbo': {
		id: 'gpt4-turbo',
		name: 'GPT-4 Turbo',
		type: 'cloud',
		endpoint: 'https://api.openai.com/v1',
		hardware: {
			minRAM: 1,
			acceleration: 'cpu'
		},
		context: 128000,
		capabilities: ['reasoning', 'coding', 'analysis', 'multimodal'],
		performance: {
			tokensPerSecond: 25,
			latency: 1000
		},
		security: {
			sandboxed: false,
			permissions: ['network:external']
		},
		license: 'Commercial',
		tags: ['cloud', 'powerful', 'multimodal']
	},

	'claude-3-sonnet': {
		id: 'claude-3-sonnet',
		name: 'Claude 3 Sonnet',
		type: 'cloud',
		endpoint: 'https://api.anthropic.com',
		hardware: {
			minRAM: 1,
			acceleration: 'cpu'
		},
		context: 200000,
		capabilities: ['reasoning', 'analysis', 'coding', 'safety'],
		performance: {
			tokensPerSecond: 30,
			latency: 800
		},
		security: {
			sandboxed: false,
			permissions: ['network:external']
		},
		license: 'Commercial',
		tags: ['cloud', 'safe', 'long-context']
	},

	'claude-3-haiku': {
		id: 'claude-3-haiku',
		name: 'Claude 3 Haiku',
		type: 'cloud',
		endpoint: 'https://api.anthropic.com',
		hardware: {
			minRAM: 1,
			acceleration: 'cpu'
		},
		context: 200000,
		capabilities: ['fast', 'efficient', 'general'],
		performance: {
			tokensPerSecond: 50,
			latency: 400
		},
		security: {
			sandboxed: false,
			permissions: ['network:external']
		},
		license: 'Commercial',
		tags: ['cloud', 'fast', 'affordable']
	},

	// Specialized Models
	'deepseek-coder': {
		id: 'deepseek-coder',
		name: 'DeepSeek Coder 33B',
		type: 'local',
		path: './models/deepseek-coder-33b.gguf',
		hardware: {
			minRAM: 22,
			acceleration: 'cuda|metal|cpu',
			minVRAM: 14
		},
		context: 16384,
		quantization: 'q4_0',
		capabilities: ['coding', 'debugging', 'code-analysis'],
		performance: {
			tokensPerSecond: 18,
			latency: 1600,
			powerUsage: 100
		},
		security: {
			sandboxed: true,
			permissions: ['files:read', 'files:write', 'terminal:create']
		},
		downloadUrl: 'https://huggingface.co/deepseek-ai/deepseek-coder-33b-instruct-GGUF/resolve/main/deepseek-coder-33b-instruct.q4_0.gguf',
		license: 'DeepSeek License',
		tags: ['coding', 'specialized', 'advanced']
	},

	'wizardcoder-15b': {
		id: 'wizardcoder-15b',
		name: 'WizardCoder 15B',
		type: 'local',
		path: './models/wizardcoder-15b.gguf',
		hardware: {
			minRAM: 12,
			acceleration: 'cuda|metal|cpu',
			minVRAM: 8
		},
		context: 8192,
		quantization: 'q4_0',
		capabilities: ['coding', 'problem-solving', 'algorithms'],
		performance: {
			tokensPerSecond: 22,
			latency: 1300,
			powerUsage: 60
		},
		security: {
			sandboxed: true,
			permissions: ['files:read', 'files:write', 'terminal:create']
		},
		downloadUrl: 'https://huggingface.co/WizardLM/WizardCoder-15B-V1.0-GGUF/resolve/main/wizardcoder-15b-v1.0.q4_0.gguf',
		license: 'Apache 2.0',
		tags: ['coding', 'medium', 'balanced']
	}
};

export interface HardwareInfo {
	totalRAM: number; // GB
	availableRAM: number; // GB
	cpuCores: number;
	hasNvidiaGPU: boolean;
	hasAMDGPU: boolean;
	gpuVRAM: number; // GB
	platform: string;
	architecture: string;
}

export function getSystemHardware(): HardwareInfo {
	const totalRAM = Math.round(os.totalmem() / (1024 ** 3));
	const freeRAM = Math.round(os.freemem() / (1024 ** 3));

	let hasNvidiaGPU = false;
	let hasAMDGPU = false;
	let gpuVRAM = 0;

	// Check for NVIDIA GPU
	try {
		const nvidiaOutput = execSync('nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits', {
			encoding: 'utf-8',
			timeout: 5000
		});
		const vramMB = parseInt(nvidiaOutput.trim().split('\n')[0]);
		if (vramMB > 0) {
			hasNvidiaGPU = true;
			gpuVRAM = Math.round(vramMB / 1024);
		}
	} catch (error) {
		// NVIDIA GPU not available
	}

	// Check for AMD GPU
	try {
		const amdOutput = execSync('rocm-smi --showmeminfo vram --csv', {
			encoding: 'utf-8',
			timeout: 5000
		});
		if (amdOutput.includes('GPU')) {
			hasAMDGPU = true;
			// Parse AMD VRAM info
		}
	} catch (error) {
		// AMD GPU not available
	}

	return {
		totalRAM,
		availableRAM: freeRAM,
		cpuCores: os.cpus().length,
		hasNvidiaGPU,
		hasAMDGPU,
		gpuVRAM,
		platform: os.platform(),
		architecture: os.arch()
	};
}

export function meetsHardwareReqs(modelConfig: ModelConfig, hardware?: HardwareInfo): boolean {
	const hw = hardware || getSystemHardware();

	// Check RAM requirement
	if (hw.totalRAM < modelConfig.hardware.minRAM) {
		return false;
	}

	// Check VRAM requirement for GPU models
	if (modelConfig.hardware.minVRAM && hw.gpuVRAM < modelConfig.hardware.minVRAM) {
		return false;
	}

	// Check acceleration support
	const acceleration = modelConfig.hardware.acceleration;
	if (acceleration.includes('cuda') && hw.hasNvidiaGPU) {
		return true;
	}
	if (acceleration.includes('metal') && hw.platform === 'darwin') {
		return true;
	}
	if (acceleration.includes('cpu')) {
		return true;
	}

	return false;
}

export function getCompatibleModels(hardware?: HardwareInfo): ModelConfig[] {
	const hw = hardware || getSystemHardware();

	return Object.values(MODEL_REGISTRY).filter(config =>
		meetsHardwareReqs(config, hw)
	).sort((a, b) => {
		// Prioritize local models
		if (a.type === 'local' && b.type === 'cloud') return -1;
		if (a.type === 'cloud' && b.type === 'local') return 1;

		// Then by performance (tokens per second)
		return b.performance.tokensPerSecond - a.performance.tokensPerSecond;
	});
}

export function getBestModel(hardware?: HardwareInfo): ModelConfig | null {
	const compatible = getCompatibleModels(hardware);
	return compatible.length > 0 ? compatible[0] : null;
}

export function getModelById(id: string): ModelConfig | undefined {
	return MODEL_REGISTRY[id];
}

export function getModelsByTag(tag: string): ModelConfig[] {
	return Object.values(MODEL_REGISTRY).filter(model =>
		model.tags.includes(tag)
	);
}

export function getCodeModels(): ModelConfig[] {
	return getModelsByTag('coding');
}

export function getFastModels(): ModelConfig[] {
	return Object.values(MODEL_REGISTRY)
		.filter(model => model.performance.tokensPerSecond > 30)
		.sort((a, b) => b.performance.tokensPerSecond - a.performance.tokensPerSecond);
}

export function getCloudModels(): ModelConfig[] {
	return Object.values(MODEL_REGISTRY).filter(model => model.type === 'cloud');
}

export function getLocalModels(): ModelConfig[] {
	return Object.values(MODEL_REGISTRY).filter(model => model.type === 'local');
}
