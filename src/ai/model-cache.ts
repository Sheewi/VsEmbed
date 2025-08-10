import { ModelConfig } from './ai-service';

export interface CachedModel {
	instance: any;
	lastAccessed: number;
	loadTime: number;
	memoryUsage: number;
}

export class ModelCache {
	private static instances = new Map<string, Promise<any>>();
	private static cache = new Map<string, CachedModel>();
	private static readonly MAX_CACHE_SIZE = 3;
	private static readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes

	static async load(modelName: string, config: ModelConfig): Promise<any> {
		// Check if model is already loading
		if (this.instances.has(modelName)) {
			return this.instances.get(modelName)!;
		}

		// Check cache first
		const cached = this.cache.get(modelName);
		if (cached && this.isCacheValid(cached)) {
			cached.lastAccessed = Date.now();
			return cached.instance;
		}

		// Load model
		const loadPromise = this.loadModel(modelName, config);
		this.instances.set(modelName, loadPromise);

		try {
			const startTime = Date.now();
			const instance = await loadPromise;
			const loadTime = Date.now() - startTime;

			// Cache the model
			this.cacheModel(modelName, instance, loadTime);

			return instance;
		} finally {
			// Remove from loading instances
			this.instances.delete(modelName);
		}
	}

	private static async loadModel(modelName: string, config: ModelConfig): Promise<any> {
		console.log(`Loading model: ${modelName}`);
		
		if (config.localPath) {
			return await this.loadLocalModel(config);
		} else if (config.endpoint) {
			return await this.loadCloudModel(config);
		}
		
		throw new Error(`No valid model source for ${modelName}`);
	}

	private static async loadLocalModel(config: ModelConfig): Promise<any> {
		// Simulate local model loading
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		return {
			name: config.name,
			type: 'local',
			predict: async (input: any) => {
				// Local model prediction logic
				return { result: 'local prediction', confidence: 0.8 };
			}
		};
	}

	private static async loadCloudModel(config: ModelConfig): Promise<any> {
		return {
			name: config.name,
			type: 'cloud',
			endpoint: config.endpoint,
			predict: async (input: any) => {
				// Cloud model prediction logic
				return { result: 'cloud prediction', confidence: 0.9 };
			}
		};
	}

	private static cacheModel(modelName: string, instance: any, loadTime: number): void {
		// Evict old models if cache is full
		if (this.cache.size >= this.MAX_CACHE_SIZE) {
			this.evictOldestModel();
		}

		this.cache.set(modelName, {
			instance,
			lastAccessed: Date.now(),
			loadTime,
			memoryUsage: this.estimateMemoryUsage(instance)
		});

		console.log(`Model ${modelName} cached (load time: ${loadTime}ms)`);
	}

	private static isCacheValid(cached: CachedModel): boolean {
		const now = Date.now();
		return (now - cached.lastAccessed) < this.CACHE_TTL;
	}

	private static evictOldestModel(): void {
		let oldestModel = '';
		let oldestTime = Date.now();

		for (const [modelName, cached] of this.cache.entries()) {
			if (cached.lastAccessed < oldestTime) {
				oldestTime = cached.lastAccessed;
				oldestModel = modelName;
			}
		}

		if (oldestModel) {
			this.cache.delete(oldestModel);
			console.log(`Evicted model: ${oldestModel}`);
		}
	}

	private static estimateMemoryUsage(instance: any): number {
		// Simple memory estimation (in MB)
		return JSON.stringify(instance).length / 1024 / 1024;
	}

	static getCacheStats(): {
		size: number;
		models: { name: string; lastAccessed: number; loadTime: number; memoryUsage: number }[];
	} {
		return {
			size: this.cache.size,
			models: Array.from(this.cache.entries()).map(([name, cached]) => ({
				name,
				lastAccessed: cached.lastAccessed,
				loadTime: cached.loadTime,
				memoryUsage: cached.memoryUsage
			}))
		};
	}

	static clearCache(): void {
		this.cache.clear();
		this.instances.clear();
		console.log('Model cache cleared');
	}

	static warmupModel(modelName: string, config: ModelConfig): Promise<any> {
		console.log(`Warming up model: ${modelName}`);
		return this.load(modelName, config);
	}
}
