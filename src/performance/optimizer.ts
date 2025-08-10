import { EventEmitter } from 'events';
import * as vscode from 'vscode';
import { LRUCache } from 'lru-cache';

export interface CacheEntry<T = any> {
	key: string;
	value: T;
	timestamp: number;
	hits: number;
	size: number;
	ttl?: number;
}

export interface PerformanceMetrics {
	cacheHits: number;
	cacheMisses: number;
	cacheHitRate: number;
	memoryUsage: NodeJS.MemoryUsage;
	cpuUsage: NodeJS.CpuUsage;
	lazyLoadedModules: string[];
	performanceTimings: Map<string, number>;
	resourceUsage: {
		extensions: number;
		languageServers: number;
		workers: number;
		webviews: number;
	};
}

export interface OptimizationConfig {
	cache: {
		maxSize: number;
		ttl: number;
		enableCompression: boolean;
		persistToDisk: boolean;
	};
	lazyLoading: {
		enabled: boolean;
		preloadThreshold: number;
		modulePattern: RegExp[];
	};
	memoryManagement: {
		gcThreshold: number;
		maxHeapSize: number;
		enableMonitoring: boolean;
	};
	resourcePooling: {
		maxWorkers: number;
		maxLanguageServers: number;
		workerIdleTimeout: number;
	};
}

class IntelligentCache<T = any> extends EventEmitter {
	private cache: LRUCache<string, CacheEntry<T>>;
	private accessPatterns: Map<string, number[]> = new Map();
	private compressionEnabled: boolean;
	private persistPath?: string;

	constructor(private config: OptimizationConfig['cache']) {
		super();

		this.cache = new LRUCache({
			max: config.maxSize,
			ttl: config.ttl,
			updateAgeOnGet: true,
			allowStale: false,
			sizeCalculation: (entry: CacheEntry<T>) => entry.size
		});

		this.compressionEnabled = config.enableCompression;

		if (config.persistToDisk) {
			this.setupPersistence();
		}

		this.setupMonitoring();
	}

	set(key: string, value: T, ttl?: number): void {
		const entry: CacheEntry<T> = {
			key,
			value,
			timestamp: Date.now(),
			hits: 0,
			size: this.calculateSize(value),
			ttl
		};

		// Track access patterns
		this.recordAccess(key);

		this.cache.set(key, entry);
		this.emit('set', { key, size: entry.size });
	}

	get(key: string): T | undefined {
		const entry = this.cache.get(key);

		if (entry) {
			entry.hits++;
			this.recordAccess(key);
			this.emit('hit', { key, hits: entry.hits });
			return entry.value;
		}

		this.emit('miss', { key });
		return undefined;
	}

	has(key: string): boolean {
		return this.cache.has(key);
	}

	delete(key: string): boolean {
		const deleted = this.cache.delete(key);
		if (deleted) {
			this.emit('delete', { key });
		}
		return deleted;
	}

	clear(): void {
		this.cache.clear();
		this.accessPatterns.clear();
		this.emit('clear');
	}

	getStats(): {
		size: number;
		maxSize: number;
		hitRate: number;
		memoryUsage: number;
	} {
		const hits = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.hits, 0);
		const totalRequests = hits + this.cache.size;

		return {
			size: this.cache.size,
			maxSize: this.cache.max,
			hitRate: totalRequests > 0 ? hits / totalRequests : 0,
			memoryUsage: this.cache.calculatedSize || 0
		};
	}

	// Predictive caching based on access patterns
	getPredictedKeys(): string[] {
		const predictions: { key: string; score: number }[] = [];

		this.accessPatterns.forEach((accesses, key) => {
			if (accesses.length >= 3) {
				// Calculate frequency and recency score
				const now = Date.now();
				const recentAccesses = accesses.filter(time => now - time < 300000); // 5 minutes
				const frequency = recentAccesses.length / accesses.length;
				const recency = Math.max(0, 1 - (now - Math.max(...accesses)) / 300000);

				predictions.push({
					key,
					score: frequency * 0.7 + recency * 0.3
				});
			}
		});

		return predictions
			.sort((a, b) => b.score - a.score)
			.slice(0, 10)
			.map(p => p.key);
	}

	private recordAccess(key: string): void {
		const accesses = this.accessPatterns.get(key) || [];
		accesses.push(Date.now());

		// Keep only last 50 accesses
		if (accesses.length > 50) {
			accesses.splice(0, accesses.length - 50);
		}

		this.accessPatterns.set(key, accesses);
	}

	private calculateSize(value: any): number {
		return JSON.stringify(value).length;
	}

	private setupPersistence(): void {
		// Simplified persistence - in production, use proper serialization
		this.persistPath = vscode.workspace.getConfiguration().get('vsembed.cache.path') as string;
	}

	private setupMonitoring(): void {
		setInterval(() => {
			const stats = this.getStats();
			this.emit('stats', stats);

			// Auto-cleanup if memory usage is high
			if (stats.memoryUsage > this.config.maxSize * 0.9) {
				this.performCleanup();
			}
		}, 30000); // Every 30 seconds
	}

	private performCleanup(): void {
		// Remove least recently used items with low hit rates
		const entries = Array.from(this.cache.entries());
		const candidates = entries
			.map(([key, entry]) => ({ key, entry }))
			.filter(({ entry }) => entry.hits < 2)
			.sort((a, b) => a.entry.timestamp - b.entry.timestamp);

		const toRemove = Math.min(candidates.length, Math.floor(this.cache.size * 0.1));
		for (let i = 0; i < toRemove; i++) {
			this.cache.delete(candidates[i].key);
		}

		this.emit('cleanup', { removed: toRemove });
	}
}

class LazyModuleLoader extends EventEmitter {
	private loadedModules: Set<string> = new Set();
	private preloadQueue: string[] = [];
	private isLoading: Map<string, Promise<any>> = new Map();

	constructor(private config: OptimizationConfig['lazyLoading']) {
		super();
		this.setupPreloading();
	}

	async loadModule(modulePath: string): Promise<any> {
		if (this.loadedModules.has(modulePath)) {
			this.emit('hit', { module: modulePath });
			return require(modulePath);
		}

		// Check if already loading
		const existingLoad = this.isLoading.get(modulePath);
		if (existingLoad) {
			return existingLoad;
		}

		const loadPromise = this.performLoad(modulePath);
		this.isLoading.set(modulePath, loadPromise);

		try {
			const module = await loadPromise;
			this.loadedModules.add(modulePath);
			this.emit('load', { module: modulePath });
			return module;
		} finally {
			this.isLoading.delete(modulePath);
		}
	}

	preloadModule(modulePath: string): void {
		if (!this.loadedModules.has(modulePath) && !this.preloadQueue.includes(modulePath)) {
			this.preloadQueue.push(modulePath);
			this.processPreloadQueue();
		}
	}

	isModuleLoaded(modulePath: string): boolean {
		return this.loadedModules.has(modulePath);
	}

	getLoadedModules(): string[] {
		return Array.from(this.loadedModules);
	}

	private async performLoad(modulePath: string): Promise<any> {
		const startTime = performance.now();

		try {
			const module = await import(modulePath);
			const loadTime = performance.now() - startTime;

			this.emit('loadComplete', {
				module: modulePath,
				loadTime,
				success: true
			});

			return module;
		} catch (error) {
			const loadTime = performance.now() - startTime;

			this.emit('loadComplete', {
				module: modulePath,
				loadTime,
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			});

			throw error;
		}
	}

	private setupPreloading(): void {
		if (!this.config.enabled) return;

		// Preload based on usage patterns
		setInterval(() => {
			this.processPreloadQueue();
		}, 5000);
	}

	private async processPreloadQueue(): Promise<void> {
		if (this.preloadQueue.length === 0) return;

		const module = this.preloadQueue.shift()!;

		try {
			await this.loadModule(module);
		} catch (error) {
			console.warn(`Failed to preload module ${module}:`, error);
		}
	}
}

class ResourcePool extends EventEmitter {
	private workers: Worker[] = [];
	private availableWorkers: Worker[] = [];
	private workerTasks: Map<Worker, any> = new Map();
	private languageServers: Map<string, any> = new Map();
	private webviews: Set<vscode.WebviewPanel> = new Set();

	constructor(private config: OptimizationConfig['resourcePooling']) {
		super();
		this.initializeWorkerPool();
		this.setupCleanup();
	}

	async getWorker(): Promise<Worker> {
		if (this.availableWorkers.length > 0) {
			const worker = this.availableWorkers.pop()!;
			this.emit('workerAssigned', { workerId: this.getWorkerId(worker) });
			return worker;
		}

		if (this.workers.length < this.config.maxWorkers) {
			const worker = await this.createWorker();
			this.workers.push(worker);
			this.emit('workerCreated', { workerId: this.getWorkerId(worker) });
			return worker;
		}

		// Wait for available worker
		return new Promise((resolve) => {
			const checkAvailable = () => {
				if (this.availableWorkers.length > 0) {
					const worker = this.availableWorkers.pop()!;
					this.emit('workerAssigned', { workerId: this.getWorkerId(worker) });
					resolve(worker);
				} else {
					setTimeout(checkAvailable, 100);
				}
			};
			checkAvailable();
		});
	}

	releaseWorker(worker: Worker): void {
		const task = this.workerTasks.get(worker);
		if (task) {
			this.workerTasks.delete(worker);
		}

		this.availableWorkers.push(worker);
		this.emit('workerReleased', { workerId: this.getWorkerId(worker) });
	}

	async getLanguageServer(languageId: string): Promise<any> {
		if (this.languageServers.has(languageId)) {
			this.emit('languageServerHit', { languageId });
			return this.languageServers.get(languageId);
		}

		if (this.languageServers.size >= this.config.maxLanguageServers) {
			// Remove least recently used
			const lru = Array.from(this.languageServers.keys())[0];
			this.languageServers.delete(lru);
			this.emit('languageServerEvicted', { languageId: lru });
		}

		const server = await this.createLanguageServer(languageId);
		this.languageServers.set(languageId, server);
		this.emit('languageServerCreated', { languageId });

		return server;
	}

	registerWebview(webview: vscode.WebviewPanel): void {
		this.webviews.add(webview);

		webview.onDidDispose(() => {
			this.webviews.delete(webview);
			this.emit('webviewDisposed', { title: webview.title });
		});

		this.emit('webviewRegistered', { title: webview.title });
	}

	getResourceUsage(): PerformanceMetrics['resourceUsage'] {
		return {
			extensions: 0, // Would track actual extension instances
			languageServers: this.languageServers.size,
			workers: this.workers.length,
			webviews: this.webviews.size
		};
	}

	private async createWorker(): Promise<Worker> {
		// In a real implementation, this would create an actual Worker
		// For now, return a mock worker object
		return {} as Worker;
	}

	private async createLanguageServer(languageId: string): Promise<any> {
		// In a real implementation, this would start the language server
		return { languageId, startTime: Date.now() };
	}

	private getWorkerId(worker: Worker): string {
		return `worker_${this.workers.indexOf(worker)}`;
	}

	private initializeWorkerPool(): void {
		// Pre-create some workers
		const initialWorkers = Math.min(2, this.config.maxWorkers);
		for (let i = 0; i < initialWorkers; i++) {
			this.createWorker().then(worker => {
				this.workers.push(worker);
				this.availableWorkers.push(worker);
			});
		}
	}

	private setupCleanup(): void {
		setInterval(() => {
			this.cleanupIdleResources();
		}, 60000); // Every minute
	}

	private cleanupIdleResources(): void {
		const now = Date.now();

		// Cleanup idle language servers
		this.languageServers.forEach((server, languageId) => {
			if (now - server.startTime > this.config.workerIdleTimeout) {
				this.languageServers.delete(languageId);
				this.emit('languageServerCleanup', { languageId });
			}
		});
	}
}

export class PerformanceOptimizer extends EventEmitter {
	private cache: IntelligentCache;
	private lazyLoader: LazyModuleLoader;
	private resourcePool: ResourcePool;
	private metrics: PerformanceMetrics;
	private performanceTimings: Map<string, number> = new Map();
	private memoryMonitor?: NodeJS.Timer;

	constructor(private config: OptimizationConfig) {
		super();

		this.cache = new IntelligentCache(config.cache);
		this.lazyLoader = new LazyModuleLoader(config.lazyLoading);
		this.resourcePool = new ResourcePool(config.resourcePooling);

		this.metrics = {
			cacheHits: 0,
			cacheMisses: 0,
			cacheHitRate: 0,
			memoryUsage: process.memoryUsage(),
			cpuUsage: process.cpuUsage(),
			lazyLoadedModules: [],
			performanceTimings: new Map(),
			resourceUsage: {
				extensions: 0,
				languageServers: 0,
				workers: 0,
				webviews: 0
			}
		};

		this.setupEventListeners();
		this.startMonitoring();
	}

	// Cache operations
	cacheSet(key: string, value: any, ttl?: number): void {
		this.cache.set(key, value, ttl);
	}

	cacheGet<T = any>(key: string): T | undefined {
		return this.cache.get(key);
	}

	cacheHas(key: string): boolean {
		return this.cache.has(key);
	}

	cacheDelete(key: string): boolean {
		return this.cache.delete(key);
	}

	cacheClear(): void {
		this.cache.clear();
	}

	// Lazy loading operations
	async loadModule(modulePath: string): Promise<any> {
		return this.lazyLoader.loadModule(modulePath);
	}

	preloadModule(modulePath: string): void {
		this.lazyLoader.preloadModule(modulePath);
	}

	// Resource pool operations
	async getWorker(): Promise<Worker> {
		return this.resourcePool.getWorker();
	}

	releaseWorker(worker: Worker): void {
		this.resourcePool.releaseWorker(worker);
	}

	async getLanguageServer(languageId: string): Promise<any> {
		return this.resourcePool.getLanguageServer(languageId);
	}

	registerWebview(webview: vscode.WebviewPanel): void {
		this.resourcePool.registerWebview(webview);
	}

	// Performance measurement
	startTiming(operation: string): void {
		this.performanceTimings.set(operation, performance.now());
	}

	endTiming(operation: string): number {
		const startTime = this.performanceTimings.get(operation);
		if (startTime) {
			const duration = performance.now() - startTime;
			this.performanceTimings.delete(operation);
			this.emit('timing', { operation, duration });
			return duration;
		}
		return 0;
	}

	// Memory management
	forceGarbageCollection(): void {
		if (global.gc) {
			global.gc();
			this.emit('gc', { timestamp: Date.now() });
		}
	}

	checkMemoryUsage(): NodeJS.MemoryUsage {
		const usage = process.memoryUsage();

		if (usage.heapUsed > this.config.memoryManagement.gcThreshold) {
			this.forceGarbageCollection();
		}

		return usage;
	}

	// Analytics and reporting
	getMetrics(): PerformanceMetrics {
		const cacheStats = this.cache.getStats();

		this.metrics.cacheHits = cacheStats.hitRate * cacheStats.size;
		this.metrics.cacheMisses = cacheStats.size - this.metrics.cacheHits;
		this.metrics.cacheHitRate = cacheStats.hitRate;
		this.metrics.memoryUsage = this.checkMemoryUsage();
		this.metrics.cpuUsage = process.cpuUsage();
		this.metrics.lazyLoadedModules = this.lazyLoader.getLoadedModules();
		this.metrics.resourceUsage = this.resourcePool.getResourceUsage();
		this.metrics.performanceTimings = new Map(this.performanceTimings);

		return { ...this.metrics };
	}

	generateReport(): string {
		const metrics = this.getMetrics();

		return `
VSEmbed Performance Report
=========================

Cache Performance:
- Hit Rate: ${(metrics.cacheHitRate * 100).toFixed(2)}%
- Total Hits: ${metrics.cacheHits}
- Total Misses: ${metrics.cacheMisses}

Memory Usage:
- Heap Used: ${(metrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
- Heap Total: ${(metrics.memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB
- External: ${(metrics.memoryUsage.external / 1024 / 1024).toFixed(2)} MB
- RSS: ${(metrics.memoryUsage.rss / 1024 / 1024).toFixed(2)} MB

Resource Usage:
- Active Workers: ${metrics.resourceUsage.workers}
- Language Servers: ${metrics.resourceUsage.languageServers}
- Webviews: ${metrics.resourceUsage.webviews}

Lazy Loaded Modules: ${metrics.lazyLoadedModules.length}
${metrics.lazyLoadedModules.map(m => `- ${m}`).join('\n')}

Performance Timings:
${Array.from(metrics.performanceTimings.entries()).map(([op, time]) =>
			`- ${op}: ${time.toFixed(2)}ms`
		).join('\n')}
`;
	}

	// Optimization recommendations
	getOptimizationRecommendations(): string[] {
		const recommendations: string[] = [];
		const metrics = this.getMetrics();

		if (metrics.cacheHitRate < 0.7) {
			recommendations.push('Consider increasing cache size or TTL for better hit rates');
		}

		if (metrics.memoryUsage.heapUsed > this.config.memoryManagement.maxHeapSize * 0.8) {
			recommendations.push('Memory usage is high - consider enabling more aggressive garbage collection');
		}

		if (metrics.resourceUsage.languageServers > 5) {
			recommendations.push('Many language servers active - consider reducing concurrent servers');
		}

		if (metrics.lazyLoadedModules.length < 10) {
			recommendations.push('Enable more aggressive lazy loading to improve startup performance');
		}

		return recommendations;
	}

	private setupEventListeners(): void {
		this.cache.on('hit', () => this.metrics.cacheHits++);
		this.cache.on('miss', () => this.metrics.cacheMisses++);

		this.lazyLoader.on('load', (data) => {
			if (!this.metrics.lazyLoadedModules.includes(data.module)) {
				this.metrics.lazyLoadedModules.push(data.module);
			}
		});
	}

	private startMonitoring(): void {
		if (this.config.memoryManagement.enableMonitoring) {
			this.memoryMonitor = setInterval(() => {
				const usage = this.checkMemoryUsage();
				this.emit('memoryUpdate', usage);
			}, 10000); // Every 10 seconds
		}
	}

	public shutdown(): void {
		if (this.memoryMonitor) {
			clearInterval(this.memoryMonitor);
		}

		this.cache.clear();
		this.emit('shutdown');
	}
}

// Default configuration
export const defaultOptimizationConfig: OptimizationConfig = {
	cache: {
		maxSize: 100 * 1024 * 1024, // 100MB
		ttl: 5 * 60 * 1000, // 5 minutes
		enableCompression: true,
		persistToDisk: false
	},
	lazyLoading: {
		enabled: true,
		preloadThreshold: 3,
		modulePattern: [
			/^vscode\//,
			/^@vscode\//,
			/extensions\//
		]
	},
	memoryManagement: {
		gcThreshold: 100 * 1024 * 1024, // 100MB
		maxHeapSize: 512 * 1024 * 1024, // 512MB
		enableMonitoring: true
	},
	resourcePooling: {
		maxWorkers: 4,
		maxLanguageServers: 10,
		workerIdleTimeout: 5 * 60 * 1000 // 5 minutes
	}
};
