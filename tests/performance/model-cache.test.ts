import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ModelCache } from '../../src/ai/model-cache';
import { eventBus } from '../../src/shared/event-bus';

// Mock AI Service for testing
class MockModelLoader {
	private loadCount = 0;
	private failCount = 0;

	async loadModel(modelId: string): Promise<any> {
		if (this.failCount > 0) {
			this.failCount--;
			throw new Error(`Failed to load model ${modelId}`);
		}

		this.loadCount++;
		await new Promise(resolve => setTimeout(resolve, 100)); // Simulate loading time
		
		return {
			id: modelId,
			loaded: true,
			size: Math.random() * 100,
			timestamp: Date.now()
		};
	}

	simulateFailure(count: number = 1) {
		this.failCount = count;
	}

	getLoadCount() {
		return this.loadCount;
	}

	reset() {
		this.loadCount = 0;
		this.failCount = 0;
	}
}

describe('Model Cache Performance', () => {
	let cache: ModelCache;
	let mockLoader: MockModelLoader;

	beforeEach(() => {
		mockLoader = new MockModelLoader();
		cache = new ModelCache({
			maxSize: 3,
			ttlMs: 1000,
			loader: mockLoader.loadModel.bind(mockLoader)
		});
	});

	afterEach(() => {
		cache.clear();
		mockLoader.reset();
	});

	describe('Basic Caching', () => {
		it('should cache models on first load', async () => {
			const model1 = await cache.load('model-1');
			const model2 = await cache.load('model-1'); // Same model

			expect(model1).toBe(model2); // Should be the exact same instance
			expect(mockLoader.getLoadCount()).toBe(1); // Only loaded once
		});

		it('should handle multiple models', async () => {
			const model1 = await cache.load('model-1');
			const model2 = await cache.load('model-2');
			const model3 = await cache.load('model-3');

			expect(model1.id).toBe('model-1');
			expect(model2.id).toBe('model-2');
			expect(model3.id).toBe('model-3');
			expect(mockLoader.getLoadCount()).toBe(3);
		});

		it('should evict least recently used models when cache is full', async () => {
			// Load 3 models (max cache size)
			await cache.load('model-1');
			await cache.load('model-2');
			await cache.load('model-3');

			// Access model-1 to make it most recently used
			await cache.load('model-1');

			// Load model-4, should evict model-2 (least recently used)
			await cache.load('model-4');

			// Try to load model-2 again, should require new load
			const initialLoadCount = mockLoader.getLoadCount();
			await cache.load('model-2');
			
			expect(mockLoader.getLoadCount()).toBe(initialLoadCount + 1);
		});
	});

	describe('TTL Expiration', () => {
		it('should reload models after TTL expires', async () => {
			const shortTtlCache = new ModelCache({
				maxSize: 3,
				ttlMs: 50, // Very short TTL
				loader: mockLoader.loadModel.bind(mockLoader)
			});

			await shortTtlCache.load('model-1');
			expect(mockLoader.getLoadCount()).toBe(1);

			// Wait for TTL to expire
			await new Promise(resolve => setTimeout(resolve, 100));

			await shortTtlCache.load('model-1');
			expect(mockLoader.getLoadCount()).toBe(2); // Should have reloaded
		});
	});

	describe('Concurrent Loading', () => {
		it('should handle concurrent requests for the same model', async () => {
			const promises = Array(5).fill(0).map(() => cache.load('model-1'));
			const models = await Promise.all(promises);

			// All should be the same instance
			models.forEach(model => {
				expect(model).toBe(models[0]);
			});

			// Should only have loaded once
			expect(mockLoader.getLoadCount()).toBe(1);
		});

		it('should handle concurrent requests for different models', async () => {
			const promises = [
				cache.load('model-1'),
				cache.load('model-2'),
				cache.load('model-3'),
				cache.load('model-1'), // Duplicate
				cache.load('model-2')  // Duplicate
			];

			const models = await Promise.all(promises);

			expect(models[0]).toBe(models[3]); // Same model-1 instances
			expect(models[1]).toBe(models[4]); // Same model-2 instances
			expect(mockLoader.getLoadCount()).toBe(3); // Only 3 unique models loaded
		});
	});

	describe('Error Handling', () => {
		it('should not cache failed model loads', async () => {
			mockLoader.simulateFailure(1);

			// First load should fail
			await expect(cache.load('model-1')).rejects.toThrow('Failed to load model model-1');

			// Second load should try again (not cached)
			const model = await cache.load('model-1');
			expect(model.id).toBe('model-1');
			expect(mockLoader.getLoadCount()).toBe(1); // Only successful load counted
		});

		it('should handle partial failures in concurrent loads', async () => {
			mockLoader.simulateFailure(2);

			const promises = [
				cache.load('model-1').catch(e => ({ error: e.message })),
				cache.load('model-2').catch(e => ({ error: e.message })),
				cache.load('model-3')
			];

			const results = await Promise.all(promises);

			expect(results[0]).toEqual({ error: 'Failed to load model model-1' });
			expect(results[1]).toEqual({ error: 'Failed to load model model-2' });
			expect(results[2].id).toBe('model-3');
		});
	});

	describe('Memory Management', () => {
		it('should track memory usage', async () => {
			await cache.load('model-1');
			await cache.load('model-2');

			const stats = cache.getStats();
			expect(stats.size).toBe(2);
			expect(stats.memoryUsage).toBeGreaterThan(0);
		});

		it('should provide hit/miss statistics', async () => {
			// Cache miss
			await cache.load('model-1');
			let stats = cache.getStats();
			expect(stats.hits).toBe(0);
			expect(stats.misses).toBe(1);

			// Cache hit
			await cache.load('model-1');
			stats = cache.getStats();
			expect(stats.hits).toBe(1);
			expect(stats.misses).toBe(1);
		});

		it('should clear cache properly', async () => {
			await cache.load('model-1');
			await cache.load('model-2');

			let stats = cache.getStats();
			expect(stats.size).toBe(2);

			cache.clear();

			stats = cache.getStats();
			expect(stats.size).toBe(0);
			expect(stats.memoryUsage).toBe(0);
		});
	});

	describe('Warmup Functionality', () => {
		it('should preload models during warmup', async () => {
			const modelsToWarmup = ['model-1', 'model-2', 'model-3'];
			await cache.warmup(modelsToWarmup);

			expect(mockLoader.getLoadCount()).toBe(3);

			// Subsequent loads should be cache hits
			await cache.load('model-1');
			await cache.load('model-2');
			await cache.load('model-3');

			expect(mockLoader.getLoadCount()).toBe(3); // No additional loads
		});

		it('should handle warmup failures gracefully', async () => {
			mockLoader.simulateFailure(1);

			const modelsToWarmup = ['model-1', 'model-2'];
			await cache.warmup(modelsToWarmup);

			// model-1 should have failed, model-2 should be loaded
			expect(mockLoader.getLoadCount()).toBe(1);

			// model-1 should still be loadable after warmup failure
			const model1 = await cache.load('model-1');
			expect(model1.id).toBe('model-1');
		});
	});

	describe('Event Integration', () => {
		it('should emit cache events', async () => {
			const events: any[] = [];
			
			eventBus.on('cache.hit', (data) => events.push({ type: 'hit', ...data }));
			eventBus.on('cache.miss', (data) => events.push({ type: 'miss', ...data }));
			eventBus.on('cache.evicted', (data) => events.push({ type: 'evicted', ...data }));

			// Cache miss
			await cache.load('model-1');
			expect(events).toContainEqual({ type: 'miss', modelId: 'model-1' });

			// Cache hit
			await cache.load('model-1');
			expect(events).toContainEqual({ type: 'hit', modelId: 'model-1' });

			// Force eviction by filling cache
			await cache.load('model-2');
			await cache.load('model-3');
			await cache.load('model-4'); // Should evict model-1

			const evictedEvent = events.find(e => e.type === 'evicted');
			expect(evictedEvent).toBeDefined();
		});
	});

	describe('Performance Benchmarks', () => {
		it('should load models within performance threshold', async () => {
			const startTime = performance.now();
			await cache.load('model-1');
			const loadTime = performance.now() - startTime;

			// First load should be reasonably fast (under 200ms including 100ms mock delay)
			expect(loadTime).toBeLessThan(200);
		});

		it('should serve cached models very quickly', async () => {
			// Load once to cache
			await cache.load('model-1');

			// Measure cache hit time
			const startTime = performance.now();
			await cache.load('model-1');
			const hitTime = performance.now() - startTime;

			// Cache hits should be very fast (under 10ms)
			expect(hitTime).toBeLessThan(10);
		});

		it('should handle high concurrent load', async () => {
			const concurrentRequests = 100;
			const startTime = performance.now();

			const promises = Array(concurrentRequests).fill(0).map((_, i) => 
				cache.load(`model-${i % 5}`) // 5 unique models, many duplicates
			);

			await Promise.all(promises);
			const totalTime = performance.now() - startTime;

			// Should complete all requests in reasonable time
			expect(totalTime).toBeLessThan(1000);
			
			// Should only load 5 unique models
			expect(mockLoader.getLoadCount()).toBe(5);
		}, 10000); // Extended timeout for this test
	});
});
