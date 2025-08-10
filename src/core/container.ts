import 'reflect-metadata';
import { Container, injectable, inject } from 'inversify';
import { AIService } from '../ai/ai-service';
import { AIDebugAdapter } from '../debug/ai-debug-adapter';
import { LiveTestEngine } from '../debug/live-test-engine';
import { CodeReviewer } from '../ai/code-reviewer';
import { DebouncedCodeGenerator } from '../ai/debounced-generator';

// Service identifiers
export const TYPES = {
	AIService: Symbol.for('AIService'),
	AIDebugAdapter: Symbol.for('AIDebugAdapter'),
	LiveTestEngine: Symbol.for('LiveTestEngine'),
	CodeReviewer: Symbol.for('CodeReviewer'),
	DebouncedCodeGenerator: Symbol.for('DebouncedCodeGenerator'),
	DebugSession: Symbol.for('DebugSession'),
	WorkspaceService: Symbol.for('WorkspaceService'),
	ConfigurationService: Symbol.for('ConfigurationService')
};

// Injectable decorators for our classes
@injectable()
export class InjectableAIService extends AIService {
	constructor() {
		super({
			defaultModel: 'gpt-3.5-turbo',
			fallbackToLocal: true,
			autoSwitching: true,
			maxRetries: 3,
			timeoutMs: 30000,
			modelsConfig: []
		});
	}
}

@injectable()
export class InjectableAIDebugAdapter extends AIDebugAdapter {
	constructor(@inject(TYPES.AIService) aiService: AIService) {
		super(aiService);
	}
}

@injectable()
export class InjectableLiveTestEngine extends LiveTestEngine {
	constructor(@inject(TYPES.WorkspaceService) workspaceService: WorkspaceService) {
		super(workspaceService.getWorkspaceRoot());
	}
}

@injectable()
export class InjectableCodeReviewer extends CodeReviewer {
	constructor(@inject(TYPES.AIService) aiService: AIService) {
		super(aiService);
	}
}

@injectable()
export class InjectableDebouncedCodeGenerator extends DebouncedCodeGenerator {
	constructor(@inject(TYPES.AIService) aiService: AIService) {
		super(aiService);
	}
}

// Additional services
@injectable()
export class WorkspaceService {
	getWorkspaceRoot(): string {
		return process.cwd();
	}

	getWorkspaceFolders(): string[] {
		// Implementation would return actual workspace folders
		return [this.getWorkspaceRoot()];
	}
}

@injectable()
export class ConfigurationService {
	private config = new Map<string, any>();

	get<T>(key: string, defaultValue?: T): T {
		return this.config.get(key) ?? defaultValue;
	}

	set(key: string, value: any): void {
		this.config.set(key, value);
	}

	getAll(): { [key: string]: any } {
		return Object.fromEntries(this.config);
	}

	load(config: { [key: string]: any }): void {
		Object.entries(config).forEach(([key, value]) => {
			this.config.set(key, value);
		});
	}
}

@injectable()
export class DebugSession {
	constructor(
		@inject(TYPES.AIDebugAdapter) private debugAdapter: AIDebugAdapter,
		@inject(TYPES.ConfigurationService) private config: ConfigurationService
	) {}

	async start(): Promise<void> {
		console.log('Debug session started');
		// Initialize debug session with configuration
		const debugConfig = this.config.get('debug', {});
		// Apply debug configuration...
	}

	async stop(): Promise<void> {
		console.log('Debug session stopped');
		// Cleanup debug session
	}

	getAdapter(): AIDebugAdapter {
		return this.debugAdapter;
	}
}

// Container setup
export class DIContainer {
	private static instance: Container | null = null;

	static getInstance(): Container {
		if (!this.instance) {
			this.instance = new Container({
				defaultScope: 'Singleton',
				autoBindInjectable: true
			});
			this.setupBindings();
		}
		return this.instance;
	}

	private static setupBindings(): void {
		const container = this.instance!;

		// Core services
		container.bind<AIService>(TYPES.AIService).to(InjectableAIService).inSingletonScope();
		container.bind<WorkspaceService>(TYPES.WorkspaceService).to(WorkspaceService).inSingletonScope();
		container.bind<ConfigurationService>(TYPES.ConfigurationService).to(ConfigurationService).inSingletonScope();

		// AI-powered services
		container.bind<AIDebugAdapter>(TYPES.AIDebugAdapter).to(InjectableAIDebugAdapter).inSingletonScope();
		container.bind<LiveTestEngine>(TYPES.LiveTestEngine).to(InjectableLiveTestEngine).inSingletonScope();
		container.bind<CodeReviewer>(TYPES.CodeReviewer).to(InjectableCodeReviewer).inSingletonScope();
		container.bind<DebouncedCodeGenerator>(TYPES.DebouncedCodeGenerator).to(InjectableDebouncedCodeGenerator).inSingletonScope();

		// Complex services with dynamic dependencies
		container.bind<DebugSession>(TYPES.DebugSession).toDynamicValue((context) => {
			const debugAdapter = context.container.get<AIDebugAdapter>(TYPES.AIDebugAdapter);
			const configService = context.container.get<ConfigurationService>(TYPES.ConfigurationService);
			return new DebugSession(debugAdapter, configService);
		}).inTransientScope();
	}

	static resolve<T>(serviceIdentifier: symbol): T {
		return this.getInstance().get<T>(serviceIdentifier);
	}

	static resolveOptional<T>(serviceIdentifier: symbol): T | undefined {
		try {
			return this.getInstance().get<T>(serviceIdentifier);
		} catch {
			return undefined;
		}
	}

	static rebind<T>(serviceIdentifier: symbol, implementation: any): void {
		const container = this.getInstance();
		if (container.isBound(serviceIdentifier)) {
			container.rebind<T>(serviceIdentifier).to(implementation);
		} else {
			container.bind<T>(serviceIdentifier).to(implementation);
		}
	}

	static bindConstant(serviceIdentifier: symbol, value: any): void {
		const container = this.getInstance();
		container.bind(serviceIdentifier).toConstantValue(value);
	}

	static unbind(serviceIdentifier: symbol): void {
		const container = this.getInstance();
		if (container.isBound(serviceIdentifier)) {
			container.unbind(serviceIdentifier);
		}
	}

	static reset(): void {
		if (this.instance) {
			this.instance.unbindAll();
			this.instance = null;
		}
	}

	// Helper methods for common patterns
	static createFactory<T>(serviceIdentifier: symbol): () => T {
		return () => this.resolve<T>(serviceIdentifier);
	}

	static createLazyFactory<T>(serviceIdentifier: symbol): () => T {
		let cached: T | undefined;
		return () => {
			if (!cached) {
				cached = this.resolve<T>(serviceIdentifier);
			}
			return cached;
		};
	}

	// Configuration helpers
	static configure(config: { [key: string]: any }): void {
		const configService = this.resolve<ConfigurationService>(TYPES.ConfigurationService);
		configService.load(config);
	}

	static getConfiguration(): { [key: string]: any } {
		const configService = this.resolve<ConfigurationService>(TYPES.ConfigurationService);
		return configService.getAll();
	}
}

// Convenience exports
export const container = DIContainer.getInstance();

// Decorator factories for easier injection
export function injectAIService(target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
	return inject(TYPES.AIService)(target, propertyKey, parameterIndex);
}

export function injectDebugAdapter(target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
	return inject(TYPES.AIDebugAdapter)(target, propertyKey, parameterIndex);
}

export function injectTestEngine(target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
	return inject(TYPES.LiveTestEngine)(target, propertyKey, parameterIndex);
}

export function injectCodeReviewer(target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
	return inject(TYPES.CodeReviewer)(target, propertyKey, parameterIndex);
}

export function injectCodeGenerator(target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
	return inject(TYPES.DebouncedCodeGenerator)(target, propertyKey, parameterIndex);
}

// Usage example class
@injectable()
export class ExampleService {
	constructor(
		@injectAIService private aiService: AIService,
		@injectDebugAdapter private debugAdapter: AIDebugAdapter,
		@injectTestEngine private testEngine: LiveTestEngine,
		@injectCodeReviewer private codeReviewer: CodeReviewer
	) {}

	async performComplexOperation(): Promise<void> {
		// Use injected services
		const health = await this.aiService.healthCheck();
		console.log('AI Service Health:', health);
		
		// Use other services as needed
	}
}
