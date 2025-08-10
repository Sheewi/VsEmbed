import { EventEmitter } from 'events';
import { TypedEmitter } from 'typed-emitter';

// Define all application events with their payload types
export interface VSEmbedEvents {
	// Debug events
	'debug:breakpoint-hit': (breakpoint: DebugBreakpoint) => void;
	'debug:session-started': (session: DebugSessionInfo) => void;
	'debug:session-ended': (session: DebugSessionInfo) => void;
	'debug:variable-changed': (variable: DebugVariable) => void;
	'debug:stack-trace-updated': (stackTrace: DebugStackTrace) => void;
	'debug:exception-thrown': (exception: DebugException) => void;

	// Test events
	'test:run-started': (testRun: TestRunInfo) => void;
	'test:run-completed': (testRun: TestRunInfo) => void;
	'test:case-started': (testCase: TestCaseInfo) => void;
	'test:case-completed': (testCase: TestCaseInfo) => void;
	'test:case-failed': (testCase: TestCaseInfo, error: TestError) => void;
	'test:coverage-updated': (coverage: TestCoverage) => void;

	// AI events
	'ai:suggestion-generated': (suggestion: AISuggestion) => void;
	'ai:model-switched': (fromModel: string, toModel: string) => void;
	'ai:prediction-started': (request: AIPredictionRequest) => void;
	'ai:prediction-completed': (request: AIPredictionRequest, response: AIPredictionResponse) => void;
	'ai:prediction-failed': (request: AIPredictionRequest, error: AIError) => void;

	// Code events
	'code:generation-requested': (request: CodeGenerationRequest) => void;
	'code:generation-completed': (request: CodeGenerationRequest, result: CodeGenerationResult) => void;
	'code:review-completed': (review: CodeReviewResult) => void;
	'code:file-changed': (file: FileChangeInfo) => void;
	'code:project-opened': (project: ProjectInfo) => void;

	// Performance events
	'performance:metric-recorded': (metric: PerformanceMetric) => void;
	'performance:threshold-exceeded': (metric: PerformanceMetric, threshold: number) => void;
	'performance:bottleneck-detected': (bottleneck: PerformanceBottleneck) => void;

	// System events
	'system:error': (error: SystemError) => void;
	'system:warning': (warning: SystemWarning) => void;
	'system:configuration-changed': (config: ConfigurationChange) => void;
	'system:extension-activated': (extension: ExtensionInfo) => void;
	'system:extension-deactivated': (extension: ExtensionInfo) => void;
}

// Event payload interfaces
export interface DebugBreakpoint {
	id: string;
	file: string;
	line: number;
	condition?: string;
	hitCount: number;
	verified: boolean;
}

export interface DebugSessionInfo {
	id: string;
	name: string;
	type: string;
	startTime: number;
	endTime?: number;
	processId?: number;
}

export interface DebugVariable {
	name: string;
	value: any;
	type: string;
	scope: string;
	variablesReference?: number;
}

export interface DebugStackTrace {
	frames: DebugStackFrame[];
	totalFrames: number;
}

export interface DebugStackFrame {
	id: number;
	name: string;
	source: string;
	line: number;
	column: number;
}

export interface DebugException {
	name: string;
	message: string;
	stack?: string;
	breakMode: 'always' | 'never' | 'unhandled';
}

export interface TestRunInfo {
	id: string;
	name: string;
	startTime: number;
	endTime?: number;
	status: 'running' | 'completed' | 'failed' | 'cancelled';
	totalTests: number;
	passedTests: number;
	failedTests: number;
	skippedTests: number;
}

export interface TestCaseInfo {
	id: string;
	name: string;
	file: string;
	line: number;
	status: 'running' | 'passed' | 'failed' | 'skipped';
	duration: number;
	tags: string[];
}

export interface TestError {
	message: string;
	stack?: string;
	expected?: any;
	actual?: any;
}

export interface TestCoverage {
	lines: { covered: number; total: number };
	functions: { covered: number; total: number };
	branches: { covered: number; total: number };
	statements: { covered: number; total: number };
	percentage: number;
}

export interface AISuggestion {
	id: string;
	type: 'completion' | 'fix' | 'refactor' | 'optimization';
	content: string;
	confidence: number;
	model: string;
	context: any;
}

export interface AIPredictionRequest {
	id: string;
	task: string;
	model: string;
	context: any;
	timestamp: number;
}

export interface AIPredictionResponse {
	id: string;
	success: boolean;
	data: any;
	latency: number;
	model: string;
	confidence?: number;
}

export interface AIError {
	code: string;
	message: string;
	details?: any;
}

export interface CodeGenerationRequest {
	id: string;
	prompt: string;
	language: string;
	context?: string;
}

export interface CodeGenerationResult {
	id: string;
	code: string;
	confidence: number;
	suggestions: string[];
}

export interface CodeReviewResult {
	id: string;
	file: string;
	comments: Array<{
		line: number;
		message: string;
		severity: 'info' | 'warning' | 'error';
	}>;
	summary: {
		total: number;
		errors: number;
		warnings: number;
	};
}

export interface FileChangeInfo {
	file: string;
	type: 'created' | 'modified' | 'deleted';
	timestamp: number;
}

export interface ProjectInfo {
	name: string;
	path: string;
	type: string;
	languages: string[];
}

export interface PerformanceMetric {
	name: string;
	value: number;
	unit: string;
	timestamp: number;
	tags?: { [key: string]: string };
}

export interface PerformanceBottleneck {
	component: string;
	metric: string;
	severity: 'low' | 'medium' | 'high' | 'critical';
	description: string;
	suggestions: string[];
}

export interface SystemError {
	code: string;
	message: string;
	stack?: string;
	component: string;
	severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SystemWarning {
	code: string;
	message: string;
	component: string;
}

export interface ConfigurationChange {
	key: string;
	oldValue: any;
	newValue: any;
	timestamp: number;
}

export interface ExtensionInfo {
	id: string;
	name: string;
	version: string;
}

// Main event bus implementation
export class VSEmbedEventBus extends (EventEmitter as new () => TypedEmitter<VSEmbedEvents>) {
	private static instance: VSEmbedEventBus;
	private eventHistory: Array<{ event: string; data: any; timestamp: number }> = [];
	private readonly maxHistorySize = 1000;
	private listeners: Map<string, number> = new Map();

	private constructor() {
		super();
		this.setupEventTracking();
	}

	static getInstance(): VSEmbedEventBus {
		if (!VSEmbedEventBus.instance) {
			VSEmbedEventBus.instance = new VSEmbedEventBus();
		}
		return VSEmbedEventBus.instance;
	}

	private setupEventTracking(): void {
		// Override emit to track all events
		const originalEmit = this.emit.bind(this);
		this.emit = (event: any, ...args: any[]) => {
			// Record event in history
			this.eventHistory.push({
				event: String(event),
				data: args,
				timestamp: Date.now()
			});

			// Maintain history size
			if (this.eventHistory.length > this.maxHistorySize) {
				this.eventHistory.shift();
			}

			// Track listener counts
			const listenerCount = this.listenerCount(event);
			this.listeners.set(String(event), listenerCount);

			return originalEmit(event, ...args);
		};
	}

	// Enhanced event methods
	emitWithTimeout<K extends keyof VSEmbedEvents>(
		event: K,
		timeout: number,
		...args: Parameters<VSEmbedEvents[K]>
	): Promise<boolean> {
		return new Promise((resolve) => {
			const timer = setTimeout(() => {
				resolve(false);
			}, timeout);

			this.once(event as any, () => {
				clearTimeout(timer);
				resolve(true);
			});

			this.emit(event as any, ...args);
		});
	}

	emitSafe<K extends keyof VSEmbedEvents>(
		event: K,
		...args: Parameters<VSEmbedEvents[K]>
	): boolean {
		try {
			return this.emit(event as any, ...args);
		} catch (error) {
			console.error(`Error emitting event ${String(event)}:`, error);
			return false;
		}
	}

	onceWithTimeout<K extends keyof VSEmbedEvents>(
		event: K,
		timeout: number,
		listener: VSEmbedEvents[K]
	): Promise<boolean> {
		return new Promise((resolve) => {
			const timer = setTimeout(() => {
				this.off(event as any, listener as any);
				resolve(false);
			}, timeout);

			this.once(event as any, (...args: any[]) => {
				clearTimeout(timer);
				(listener as any)(...args);
				resolve(true);
			});
		});
	}

	// Event filtering and querying
	getEventHistory(filter?: {
		event?: string;
		since?: number;
		limit?: number;
	}): Array<{ event: string; data: any; timestamp: number }> {
		let history = this.eventHistory;

		if (filter?.event) {
			history = history.filter(h => h.event === filter.event);
		}

		if (filter?.since) {
			history = history.filter(h => h.timestamp >= filter.since!);
		}

		if (filter?.limit) {
			history = history.slice(-filter.limit);
		}

		return history;
	}

	getEventStats(): {
		totalEvents: number;
		eventTypes: { [event: string]: number };
		activeListeners: { [event: string]: number };
		recentActivity: Array<{ event: string; count: number; lastSeen: number }>;
	} {
		const eventCounts: { [event: string]: number } = {};
		const lastSeen: { [event: string]: number } = {};

		this.eventHistory.forEach(h => {
			eventCounts[h.event] = (eventCounts[h.event] || 0) + 1;
			lastSeen[h.event] = Math.max(lastSeen[h.event] || 0, h.timestamp);
		});

		const recentActivity = Object.entries(eventCounts)
			.map(([event, count]) => ({
				event,
				count,
				lastSeen: lastSeen[event]
			}))
			.sort((a, b) => b.lastSeen - a.lastSeen);

		return {
			totalEvents: this.eventHistory.length,
			eventTypes: eventCounts,
			activeListeners: Object.fromEntries(this.listeners),
			recentActivity
		};
	}

	// Performance monitoring
	measureEventPerformance<K extends keyof VSEmbedEvents>(
		event: K,
		...args: Parameters<VSEmbedEvents[K]>
	): { duration: number; listenerCount: number } {
		const start = performance.now();
		const listenerCount = this.listenerCount(event as any);
		
		this.emit(event as any, ...args);
		
		const duration = performance.now() - start;
		
		// Emit performance metric
		this.emit('performance:metric-recorded', {
			name: `event.${String(event)}.duration`,
			value: duration,
			unit: 'ms',
			timestamp: Date.now(),
			tags: { listenerCount: listenerCount.toString() }
		});

		return { duration, listenerCount };
	}

	// Batch operations
	emitBatch(events: Array<{ event: keyof VSEmbedEvents; args: any[] }>): void {
		events.forEach(({ event, args }) => {
			this.emit(event as any, ...args);
		});
	}

	// Middleware support
	private middlewares: Array<(event: string, args: any[], next: () => void) => void> = [];

	use(middleware: (event: string, args: any[], next: () => void) => void): void {
		this.middlewares.push(middleware);
	}

	private runMiddlewares(event: string, args: any[], callback: () => void): void {
		let index = 0;

		const next = () => {
			if (index >= this.middlewares.length) {
				callback();
				return;
			}

			const middleware = this.middlewares[index++];
			middleware(event, args, next);
		};

		next();
	}

	// Cleanup
	clearHistory(): void {
		this.eventHistory = [];
	}

	reset(): void {
		this.removeAllListeners();
		this.clearHistory();
		this.listeners.clear();
		this.middlewares = [];
	}
}

// Export singleton instance
export const EventBus = VSEmbedEventBus.getInstance();

// Convenience wrapper functions
export function emitDebugEvent<K extends keyof Pick<VSEmbedEvents, `debug:${string}`>>(
	event: K,
	...args: Parameters<VSEmbedEvents[K]>
): boolean {
	return EventBus.emit(event as any, ...args);
}

export function emitTestEvent<K extends keyof Pick<VSEmbedEvents, `test:${string}`>>(
	event: K,
	...args: Parameters<VSEmbedEvents[K]>
): boolean {
	return EventBus.emit(event as any, ...args);
}

export function emitAIEvent<K extends keyof Pick<VSEmbedEvents, `ai:${string}`>>(
	event: K,
	...args: Parameters<VSEmbedEvents[K]>
): boolean {
	return EventBus.emit(event as any, ...args);
}

export function emitCodeEvent<K extends keyof Pick<VSEmbedEvents, `code:${string}`>>(
	event: K,
	...args: Parameters<VSEmbedEvents[K]>
): boolean {
	return EventBus.emit(event as any, ...args);
}

export function emitPerformanceEvent<K extends keyof Pick<VSEmbedEvents, `performance:${string}`>>(
	event: K,
	...args: Parameters<VSEmbedEvents[K]>
): boolean {
	return EventBus.emit(event as any, ...args);
}

export function emitSystemEvent<K extends keyof Pick<VSEmbedEvents, `system:${string}`>>(
	event: K,
	...args: Parameters<VSEmbedEvents[K]>
): boolean {
	return EventBus.emit(event as any, ...args);
}

// Event listener decorators
export function OnEvent<K extends keyof VSEmbedEvents>(event: K) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		// Register event listener when class is instantiated
		const setup = () => {
			EventBus.on(event as any, originalMethod.bind(target));
		};

		// Store setup function for later execution
		if (!target._eventSetups) {
			target._eventSetups = [];
		}
		target._eventSetups.push(setup);

		return descriptor;
	};
}

// Base class with automatic event binding
export abstract class EventAwareComponent {
	constructor() {
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		const setups = (this as any)._eventSetups;
		if (setups) {
			setups.forEach((setup: () => void) => setup());
		}
	}

	protected emit<K extends keyof VSEmbedEvents>(
		event: K,
		...args: Parameters<VSEmbedEvents[K]>
	): boolean {
		return EventBus.emit(event as any, ...args);
	}

	protected on<K extends keyof VSEmbedEvents>(
		event: K,
		listener: VSEmbedEvents[K]
	): this {
		EventBus.on(event as any, listener as any);
		return this;
	}

	protected once<K extends keyof VSEmbedEvents>(
		event: K,
		listener: VSEmbedEvents[K]
	): this {
		EventBus.once(event as any, listener as any);
		return this;
	}

	protected off<K extends keyof VSEmbedEvents>(
		event: K,
		listener: VSEmbedEvents[K]
	): this {
		EventBus.off(event as any, listener as any);
		return this;
	}

	dispose(): void {
		// Override in subclasses to remove specific listeners
		// Base implementation removes all listeners for this instance
		EventBus.removeAllListeners();
	}
}
