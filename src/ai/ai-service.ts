import * as vscode from 'vscode';
import { EventEmitter } from 'events';

export interface AIRequest {
	task: string;
	context?: any;
	model?: 'lightweight' | 'advanced' | 'auto';
	priority?: 'low' | 'normal' | 'high';
	timeout?: number;
}

export interface AIResponse {
	success: boolean;
	data: any;
	model: string;
	latency: number;
	source: 'cloud' | 'local' | 'fallback';
	confidence?: number;
}

export interface ModelConfig {
	name: string;
	type: 'lightweight' | 'advanced';
	endpoint?: string;
	localPath?: string;
	capabilities: string[];
	performance: {
		avgLatency: number;
		reliability: number;
		costPerRequest: number;
	};
}

export interface AIServiceConfig {
	defaultModel: string;
	fallbackToLocal: boolean;
	autoSwitching: boolean;
	maxRetries: number;
	timeoutMs: number;
	modelsConfig: ModelConfig[];
}

export class ModelManager {
	private models = new Map<string, ModelConfig>();
	private modelInstances = new Map<string, any>();
	private performanceMetrics = new Map<string, any>();

	constructor(private config: AIServiceConfig) {
		this.initializeModels();
	}

	private initializeModels(): void {
		this.config.modelsConfig.forEach(model => {
			this.models.set(model.name, model);
		});
	}

	async getModel(modelName: string): Promise<any> {
		if (this.modelInstances.has(modelName)) {
			return this.modelInstances.get(modelName);
		}

		const config = this.models.get(modelName);
		if (!config) {
			throw new Error(`Model ${modelName} not found`);
		}

		const instance = await this.loadModel(config);
		this.modelInstances.set(modelName, instance);
		return instance;
	}

	private async loadModel(config: ModelConfig): Promise<any> {
		if (config.localPath) {
			// Load local model (GGUF, ONNX, etc.)
			return await this.loadLocalModel(config);
		} else if (config.endpoint) {
			// Setup cloud model client
			return await this.loadCloudModel(config);
		}
		throw new Error(`No valid model source for ${config.name}`);
	}

	private async loadLocalModel(config: ModelConfig): Promise<any> {
		try {
			// Dynamically import local model loader based on type
			const loader = await this.getLocalModelLoader(config);
			return await loader.load(config.localPath);
		} catch (error) {
			console.error(`Failed to load local model ${config.name}:`, error);
			throw error;
		}
	}

	private async loadCloudModel(config: ModelConfig): Promise<any> {
		return {
			name: config.name,
			endpoint: config.endpoint,
			predict: async (request: any) => {
				const response = await fetch(config.endpoint!, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${process.env.VSEMBED_API_KEY}`,
						'Content-Security-Policy': 'default-src self',
						'X-Content-Type-Options': 'nosniff',
						'X-Frame-Options': 'DENY'
					},
					body: JSON.stringify(request)
				});
				return await response.json();
			}
		};
	}

	private async getLocalModelLoader(config: ModelConfig): Promise<any> {
		// Return appropriate loader based on model type
		switch (config.type) {
			case 'lightweight':
				return await import('./loaders/gguf-loader');
			case 'advanced':
				return await import('./loaders/onnx-loader');
			default:
				throw new Error(`Unknown model type: ${config.type}`);
		}
	}

	selectOptimalModel(task: string, context?: any): string {
		const taskComplexity = this.assessTaskComplexity(task, context);
		const availableModels = Array.from(this.models.values());

		// Sort models by suitability score
		const scored = availableModels.map(model => ({
			model,
			score: this.calculateSuitabilityScore(model, task, taskComplexity)
		})).sort((a, b) => b.score - a.score);

		return scored[0]?.model.name || this.config.defaultModel;
	}

	private assessTaskComplexity(task: string, context?: any): number {
		let complexity = 1;

		// Base complexity from task type
		const complexTasks = ['code-generation', 'refactoring', 'architecture-design'];
		const simpleTasks = ['syntax-check', 'formatting', 'basic-completion'];

		if (complexTasks.includes(task)) complexity += 3;
		if (simpleTasks.includes(task)) complexity -= 1;

		// Context-based complexity
		if (context?.codeLength > 1000) complexity += 1;
		if (context?.dependencies?.length > 10) complexity += 1;
		if (context?.multiFile) complexity += 2;

		return Math.max(1, Math.min(5, complexity));
	}

	private calculateSuitabilityScore(model: ModelConfig, task: string, complexity: number): number {
		let score = 0;

		// Capability match
		if (model.capabilities.includes(task)) score += 3;
		if (model.capabilities.includes('general')) score += 1;

		// Performance match
		if (model.type === 'lightweight' && complexity <= 2) score += 2;
		if (model.type === 'advanced' && complexity >= 3) score += 2;

		// Availability and reliability
		score += model.performance.reliability * 2;
		score -= model.performance.avgLatency / 1000; // Penalty for high latency

		return score;
	}

	recordPerformance(modelName: string, latency: number, success: boolean): void {
		if (!this.performanceMetrics.has(modelName)) {
			this.performanceMetrics.set(modelName, {
				totalRequests: 0,
				successfulRequests: 0,
				totalLatency: 0,
				avgLatency: 0,
				reliability: 1.0
			});
		}

		const metrics = this.performanceMetrics.get(modelName);
		metrics.totalRequests++;
		metrics.totalLatency += latency;
		metrics.avgLatency = metrics.totalLatency / metrics.totalRequests;

		if (success) {
			metrics.successfulRequests++;
		}

		metrics.reliability = metrics.successfulRequests / metrics.totalRequests;

		// Update model config with new performance data
		const model = this.models.get(modelName);
		if (model) {
			model.performance.avgLatency = metrics.avgLatency;
			model.performance.reliability = metrics.reliability;
		}
	}

	getAvailableModels(): ModelConfig[] {
		return Array.from(this.models.values());
	}
}

export class AIService extends EventEmitter {
	private modelManager: ModelManager;
	private requestQueue: AIRequest[] = [];
	private isProcessing = false;
	private circuitBreaker = new Map<string, any>();

	constructor(private config: AIServiceConfig) {
		super();
		this.modelManager = new ModelManager(config);
	}

	async predict(request: AIRequest): Promise<AIResponse> {
		const startTime = Date.now();

		try {
			// Auto-select model if not specified
			if (!request.model || request.model === 'auto') {
				const optimalModel = this.modelManager.selectOptimalModel(request.task, request.context);
				request.model = optimalModel as any;
			}

			// Check circuit breaker
			if (this.isCircuitOpen(request.model)) {
				return await this.executeFallback(request, startTime);
			}

			// Try cloud model first
			const cloudResult = await this.tryCloudModel(request, startTime);
			if (cloudResult.success) {
				this.recordSuccess(request.model);
				return cloudResult;
			}

			// Fallback to local model
			if (this.config.fallbackToLocal) {
				return await this.tryLocalModel(request, startTime);
			}

			// Final fallback
			return await this.executeFallback(request, startTime);

		} catch (error) {
			this.recordFailure(request.model);
			return await this.executeFallback(request, startTime, error);
		}
	}

	private async tryCloudModel(request: AIRequest, startTime: number): Promise<AIResponse> {
		try {
			const model = await this.modelManager.getModel(request.model as string);
			const result = await Promise.race([
				model.predict(request),
				this.createTimeoutPromise(request.timeout || this.config.timeoutMs)
			]);

			const latency = Date.now() - startTime;
			this.modelManager.recordPerformance(request.model as string, latency, true);

			return {
				success: true,
				data: result,
				model: request.model as string,
				latency,
				source: 'cloud',
				confidence: result.confidence || 0.9
			};

		} catch (error) {
			const latency = Date.now() - startTime;
			this.modelManager.recordPerformance(request.model as string, latency, false);
			throw error;
		}
	}

	private async tryLocalModel(request: AIRequest, startTime: number): Promise<AIResponse> {
		try {
			// Find a local model that can handle this task
			const localModels = this.modelManager.getAvailableModels()
				.filter(m => m.localPath && m.capabilities.includes(request.task));

			if (localModels.length === 0) {
				throw new Error('No local model available for this task');
			}

			const localModel = localModels[0];
			const modelInstance = await this.modelManager.getModel(localModel.name);
			const result = await modelInstance.predict(request);

			const latency = Date.now() - startTime;
			this.modelManager.recordPerformance(localModel.name, latency, true);

			return {
				success: true,
				data: result,
				model: localModel.name,
				latency,
				source: 'local',
				confidence: result.confidence || 0.7
			};

		} catch (error) {
			throw error;
		}
	}

	private async executeFallback(request: AIRequest, startTime: number, error?: any): Promise<AIResponse> {
		// Implement rule-based fallback responses
		const fallbackData = this.generateFallbackResponse(request);

		return {
			success: false,
			data: fallbackData,
			model: 'fallback',
			latency: Date.now() - startTime,
			source: 'fallback',
			confidence: 0.3
		};
	}

	private generateFallbackResponse(request: AIRequest): any {
		switch (request.task) {
			case 'code-completion':
				return {
					completions: [{
						text: '// AI completion unavailable',
						confidence: 0.1
					}]
				};
			case 'error-analysis':
				return {
					suggestions: ['Check syntax errors', 'Verify variable declarations'],
					confidence: 0.2
				};
			case 'test-generation':
				return {
					tests: [{
						name: 'basic_test',
						code: '// Basic test template\ntest("should work", () => {\n  expect(true).toBe(true);\n});'
					}]
				};
			default:
				return {
					message: 'AI service temporarily unavailable',
					fallback: true
				};
		}
	}

	private createTimeoutPromise(timeoutMs: number): Promise<never> {
		return new Promise((_, reject) => {
			setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
		});
	}

	private isCircuitOpen(model: string): boolean {
		const breaker = this.circuitBreaker.get(model);
		if (!breaker) return false;

		const now = Date.now();
		if (now - breaker.lastFailureTime > breaker.resetTimeoutMs) {
			// Reset circuit breaker
			this.circuitBreaker.delete(model);
			return false;
		}

		return breaker.failures >= breaker.threshold;
	}

	private recordSuccess(model: string): void {
		this.circuitBreaker.delete(model);
	}

	private recordFailure(model: string): void {
		const breaker = this.circuitBreaker.get(model) || {
			failures: 0,
			threshold: 3,
			resetTimeoutMs: 60000,
			lastFailureTime: 0
		};

		breaker.failures++;
		breaker.lastFailureTime = Date.now();
		this.circuitBreaker.set(model, breaker);
	}

	// Queue management for high-priority requests
	async queueRequest(request: AIRequest): Promise<string> {
		const requestId = `req_${Date.now()}_${Math.random()}`;
		this.requestQueue.push({ ...request, id: requestId } as any);

		if (!this.isProcessing) {
			this.processQueue();
		}

		return requestId;
	}

	private async processQueue(): Promise<void> {
		this.isProcessing = true;

		// Sort by priority
		this.requestQueue.sort((a, b) => {
			const priorityOrder = { high: 3, normal: 2, low: 1 };
			return priorityOrder[b.priority || 'normal'] - priorityOrder[a.priority || 'normal'];
		});

		while (this.requestQueue.length > 0) {
			const request = this.requestQueue.shift()!;
			try {
				const response = await this.predict(request);
				this.emit('request-completed', { request, response });
			} catch (error) {
				this.emit('request-failed', { request, error });
			}
		}

		this.isProcessing = false;
	}

	// Health check
	async healthCheck(): Promise<{ [model: string]: boolean }> {
		const models = this.modelManager.getAvailableModels();
		const health: { [model: string]: boolean } = {};

		await Promise.all(models.map(async (model) => {
			try {
				const testRequest: AIRequest = {
					task: 'health-check',
					context: { test: true }
				};

				const response = await this.predict({ ...testRequest, model: model.name as any });
				health[model.name] = response.success;
			} catch (error) {
				health[model.name] = false;
			}
		}));

		return health;
	}

	// Configuration updates
	updateConfig(newConfig: Partial<AIServiceConfig>): void {
		Object.assign(this.config, newConfig);
		this.emit('config-updated', this.config);
	}

	// Statistics
	getPerformanceStats(): any {
		return {
			models: this.modelManager.getAvailableModels().map(model => ({
				name: model.name,
				performance: model.performance,
				circuitBreakerStatus: this.circuitBreaker.has(model.name) ? 'open' : 'closed'
			})),
			queueLength: this.requestQueue.length,
			isProcessing: this.isProcessing
		};
	}
}

// Default configuration
export const defaultAIServiceConfig: AIServiceConfig = {
	defaultModel: 'gpt-3.5-turbo',
	fallbackToLocal: true,
	autoSwitching: true,
	maxRetries: 3,
	timeoutMs: 30000,
	modelsConfig: [
		{
			name: 'gpt-4',
			type: 'advanced',
			endpoint: 'https://api.openai.com/v1/chat/completions',
			capabilities: ['code-generation', 'refactoring', 'architecture-design', 'complex-analysis'],
			performance: {
				avgLatency: 2000,
				reliability: 0.95,
				costPerRequest: 0.03
			}
		},
		{
			name: 'gpt-3.5-turbo',
			type: 'lightweight',
			endpoint: 'https://api.openai.com/v1/chat/completions',
			capabilities: ['code-completion', 'syntax-check', 'basic-analysis', 'formatting'],
			performance: {
				avgLatency: 800,
				reliability: 0.98,
				costPerRequest: 0.002
			}
		},
		{
			name: 'llama-3-8b',
			type: 'lightweight',
			localPath: './models/llama-3-8b.gguf',
			capabilities: ['code-completion', 'basic-analysis', 'general'],
			performance: {
				avgLatency: 1500,
				reliability: 0.85,
				costPerRequest: 0
			}
		},
		{
			name: 'codellama-13b',
			type: 'advanced',
			localPath: './models/codellama-13b.gguf',
			capabilities: ['code-generation', 'refactoring', 'debugging', 'test-generation'],
			performance: {
				avgLatency: 3000,
				reliability: 0.82,
				costPerRequest: 0
			}
		}
	]
};

// Export singleton instance
export const aiService = new AIService(defaultAIServiceConfig);
