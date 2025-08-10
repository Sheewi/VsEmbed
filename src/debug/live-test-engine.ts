import * as vscode from 'vscode';
import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { WebSocket } from 'ws';
import * as fs from 'fs';
import * as path from 'path';

export interface TestCase {
	id: string;
	name: string;
	code: string;
	inputs: any[];
	expectedOutputs: any[];
	framework: 'jest' | 'mocha' | 'pytest' | 'unittest' | 'custom';
	status: 'pending' | 'running' | 'passed' | 'failed' | 'error';
	duration?: number;
	error?: string;
	actualOutput?: any;
	coverage?: TestCoverage;
}

export interface TestCoverage {
	lines: number;
	functions: number;
	branches: number;
	statements: number;
	percentage: number;
}

export interface TestSuite {
	id: string;
	name: string;
	framework: string;
	tests: TestCase[];
	totalTests: number;
	passedTests: number;
	failedTests: number;
	duration: number;
	coverage?: TestCoverage;
}

export interface TestResult {
	suite: TestSuite;
	test: TestCase;
	status: 'passed' | 'failed' | 'error';
	duration: number;
	output: string;
	error?: string;
	coverage?: TestCoverage;
}

export interface LiveTestEvent {
	type: 'test-start' | 'test-end' | 'test-fail' | 'suite-start' | 'suite-end' | 'coverage-update';
	timestamp: number;
	data: any;
}

export interface TestGenerationRequest {
	code: string;
	language: string;
	framework?: string;
	testType: 'unit' | 'integration' | 'e2e' | 'performance';
	coverage?: number; // target coverage percentage
}

export interface AIGeneratedTest {
	name: string;
	description: string;
	code: string;
	inputs: any[];
	expectedOutputs: any[];
	confidence: number;
	testType: 'unit' | 'integration' | 'e2e' | 'performance';
}

export interface TestWatchConfig {
	patterns: string[];
	ignored: string[];
	pollInterval: number;
	runOnChange: boolean;
	coverage: boolean;
}

export interface TestExecutionContext {
	workspaceRoot: string;
	testFile?: string;
	debugMode: boolean;
	coverage: boolean;
	timeout: number;
	env: Record<string, string>;
	parallel?: boolean;
	maxConcurrency?: number;
}

export interface DependencyGraphNode {
	file: string;
	dependencies: string[];
	dependents: string[];
	tests: string[];
}

export class DependencyGraph {
	private static graph = new Map<string, DependencyGraphNode>();

	static addFile(file: string, dependencies: string[] = []): void {
		if (!this.graph.has(file)) {
			this.graph.set(file, {
				file,
				dependencies,
				dependents: [],
				tests: []
			});
		}

		// Update dependents
		dependencies.forEach(dep => {
			const depNode = this.graph.get(dep);
			if (depNode && !depNode.dependents.includes(file)) {
				depNode.dependents.push(file);
			}
		});
	}

	static getAffectedTests(changedFile: string): string[] {
		const visited = new Set<string>();
		const affectedTests = new Set<string>();

		const traverse = (file: string) => {
			if (visited.has(file)) return;
			visited.add(file);

			const node = this.graph.get(file);
			if (!node) return;

			// Add tests for this file
			node.tests.forEach(test => affectedTests.add(test));

			// Traverse dependents
			node.dependents.forEach(dependent => traverse(dependent));
		};

		traverse(changedFile);
		return Array.from(affectedTests);
	}

	static addTestForFile(file: string, testFile: string): void {
		const node = this.graph.get(file);
		if (node && !node.tests.includes(testFile)) {
			node.tests.push(testFile);
		}
	}
}

export class TestFrameworkAdapter {
	private framework: string;
	private workspaceRoot: string;
	private cancellationToken?: vscode.CancellationTokenSource;

	constructor(framework: string, workspaceRoot: string) {
		this.framework = framework;
		this.workspaceRoot = workspaceRoot;
	}

	async executeTests(tests: TestCase[], context: TestExecutionContext): Promise<TestResult[]> {
		if (context.parallel && tests.length > 1) {
			return await this.executeTestsParallel(tests, context);
		} else {
			return await this.executeTestsSequential(tests, context);
		}
	}

	private async executeTestsParallel(tests: TestCase[], context: TestExecutionContext): Promise<TestResult[]> {
		const maxConcurrency = context.maxConcurrency || Math.min(4, tests.length);
		const results: TestResult[] = [];

		// Process tests in batches
		for (let i = 0; i < tests.length; i += maxConcurrency) {
			const batch = tests.slice(i, i + maxConcurrency);
			const batchPromises = batch.map(test => this.runTest(test, context));

			try {
				const batchResults = await Promise.all(batchPromises);
				results.push(...batchResults);
			} catch (error) {
				console.error('Parallel test execution failed:', error);
				// Fallback to sequential execution for this batch
				for (const test of batch) {
					try {
						const result = await this.runTest(test, context);
						results.push(result);
					} catch (testError) {
						results.push(this.createErrorResult(test, testError));
					}
				}
			}
		}

		return results;
	}

	private async executeTestsSequential(tests: TestCase[], context: TestExecutionContext): Promise<TestResult[]> {
		const results: TestResult[] = [];

		for (const test of tests) {
			try {
				const result = await this.runTest(test, context);
				results.push(result);
			} catch (error) {
				results.push(this.createErrorResult(test, error));
			}
		}

		return results;
	}

	private createErrorResult(test: TestCase, error: any): TestResult {
		return {
			suite: {
				id: 'error',
				name: 'Error Suite',
				framework: this.framework,
				tests: [test],
				totalTests: 1,
				passedTests: 0,
				failedTests: 1,
				duration: 0
			},
			test: {
				...test,
				status: 'error',
				error: error instanceof Error ? error.message : 'Unknown error'
			},
			status: 'error',
			duration: 0,
			output: '',
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}

	async runTest(test: TestCase, context: TestExecutionContext): Promise<TestResult> {
		const startTime = Date.now();

		try {
			let command: string;
			let args: string[];

			switch (this.framework) {
				case 'jest':
					[command, args] = this.buildJestCommand(test, context);
					break;
				case 'mocha':
					[command, args] = this.buildMochaCommand(test, context);
					break;
				case 'pytest':
					[command, args] = this.buildPytestCommand(test, context);
					break;
				case 'unittest':
					[command, args] = this.buildUnittestCommand(test, context);
					break;
				default:
					throw new Error(`Unsupported framework: ${this.framework}`);
			}

			const result = await this.executeCommand(command, args, context);
			const duration = Date.now() - startTime;

			return {
				suite: {
					id: 'generated',
					name: 'Generated Tests',
					framework: this.framework,
					tests: [test],
					totalTests: 1,
					passedTests: result.status === 'passed' ? 1 : 0,
					failedTests: result.status === 'failed' ? 1 : 0,
					duration
				},
				test: {
					...test,
					status: result.status,
					duration,
					actualOutput: result.output,
					error: result.error
				},
				status: result.status,
				duration,
				output: result.output,
				error: result.error,
				coverage: result.coverage
			};

		} catch (error) {
			const duration = Date.now() - startTime;
			return {
				suite: {
					id: 'generated',
					name: 'Generated Tests',
					framework: this.framework,
					tests: [test],
					totalTests: 1,
					passedTests: 0,
					failedTests: 1,
					duration
				},
				test: {
					...test,
					status: 'error',
					duration,
					error: error instanceof Error ? error.message : 'Unknown error'
				},
				status: 'error',
				duration,
				output: '',
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	private buildJestCommand(test: TestCase, context: TestExecutionContext): [string, string[]] {
		const args = ['--no-coverage', '--verbose'];

		if (context.coverage) {
			args.push('--coverage');
		}

		if (context.testFile) {
			args.push(context.testFile);
		}

		if (context.debugMode) {
			args.push('--runInBand');
		}

		return ['npx', ['jest', ...args]];
	}

	private buildMochaCommand(test: TestCase, context: TestExecutionContext): [string, string[]] {
		const args = ['--reporter', 'json'];

		if (context.testFile) {
			args.push(context.testFile);
		}

		if (context.timeout) {
			args.push('--timeout', context.timeout.toString());
		}

		return ['npx', ['mocha', ...args]];
	}

	private buildPytestCommand(test: TestCase, context: TestExecutionContext): [string, string[]] {
		const args = ['-v', '--tb=short'];

		if (context.coverage) {
			args.push('--cov=.');
		}

		if (context.testFile) {
			args.push(context.testFile);
		}

		return ['python', ['-m', 'pytest', ...args]];
	}

	private buildUnittestCommand(test: TestCase, context: TestExecutionContext): [string, string[]] {
		const args = ['-m', 'unittest'];

		if (context.testFile) {
			args.push(context.testFile.replace('.py', '').replace('/', '.'));
		}

		args.push('-v');

		return ['python', args];
	}

	private async executeCommand(
		command: string,
		args: string[],
		context: TestExecutionContext
	): Promise<{ status: 'passed' | 'failed' | 'error'; output: string; error?: string; coverage?: TestCoverage }> {
		return new Promise((resolve) => {
			const process = spawn(command, args, {
				cwd: context.workspaceRoot,
				env: { ...process.env, ...context.env },
				stdio: 'pipe'
			});

			let stdout = '';
			let stderr = '';

			process.stdout?.on('data', (data) => {
				stdout += data.toString();
			});

			process.stderr?.on('data', (data) => {
				stderr += data.toString();
			});

			const timeout = setTimeout(() => {
				process.kill('SIGKILL');
				resolve({
					status: 'error',
					output: stdout,
					error: 'Test execution timeout'
				});
			}, context.timeout || 30000);

			process.on('close', (code) => {
				clearTimeout(timeout);

				const status = code === 0 ? 'passed' : 'failed';
				const output = stdout || stderr;
				const error = code !== 0 ? stderr || 'Test failed' : undefined;
				const coverage = this.parseCoverage(output);

				resolve({ status, output, error, coverage });
			});

			process.on('error', (error) => {
				clearTimeout(timeout);
				resolve({
					status: 'error',
					output: stdout,
					error: error.message
				});
			});
		});
	}

	private parseCoverage(output: string): TestCoverage | undefined {
		// Parse coverage information from test output
		// This is framework-specific and would need more sophisticated parsing
		const coverageMatch = output.match(/(\d+)%.*coverage/i);
		if (coverageMatch) {
			const percentage = parseInt(coverageMatch[1]);
			return {
				lines: percentage,
				functions: percentage,
				branches: percentage,
				statements: percentage,
				percentage
			};
		}
		return undefined;
	}
}

export class AITestGenerator {
	private apiEndpoint = 'https://api.vsembed.ai/v1/generate-tests';
	private localModel?: any;

	async generateTests(request: TestGenerationRequest): Promise<AIGeneratedTest[]> {
		try {
			const response = await this.predict({
				task: 'generate-tests',
				code: request.code,
				language: request.language,
				framework: request.framework || this.detectFramework(request.language),
				testType: request.testType,
				targetCoverage: request.coverage || 80
			});

			return response.tests || this.generateFallbackTests(request);
		} catch (error) {
			console.error('AI test generation failed:', error);
			return this.generateFallbackTests(request);
		}
	}

	async improveTest(test: TestCase, errorMessage?: string): Promise<AIGeneratedTest> {
		try {
			const response = await this.predict({
				task: 'improve-test',
				test: test.code,
				inputs: test.inputs,
				expectedOutputs: test.expectedOutputs,
				error: errorMessage,
				framework: test.framework
			});

			return response.improvedTest || this.createBasicImprovement(test);
		} catch (error) {
			console.error('Test improvement failed:', error);
			return this.createBasicImprovement(test);
		}
	}

	async generateMockData(schema: any): Promise<any> {
		try {
			const response = await this.predict({
				task: 'generate-mock-data',
				schema,
				count: 10
			});

			return response.mockData || this.generateBasicMockData(schema);
		} catch (error) {
			console.error('Mock data generation failed:', error);
			return this.generateBasicMockData(schema);
		}
	}

	private async predict(request: any): Promise<any> {
		if (this.localModel) {
			return await this.localModel.generate(request);
		}

		const response = await fetch(this.apiEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.VSEMBED_API_KEY}`
			},
			body: JSON.stringify(request)
		});

		return await response.json();
	}

	private detectFramework(language: string): string {
		switch (language.toLowerCase()) {
			case 'javascript':
			case 'typescript':
				return 'jest';
			case 'python':
				return 'pytest';
			case 'java':
				return 'junit';
			case 'csharp':
				return 'nunit';
			default:
				return 'custom';
		}
	}

	private generateFallbackTests(request: TestGenerationRequest): AIGeneratedTest[] {
		const tests: AIGeneratedTest[] = [];

		// Generate basic positive test case
		tests.push({
			name: 'should_work_with_valid_input',
			description: 'Test with valid input parameters',
			code: this.generateBasicTestCode(request),
			inputs: [{}],
			expectedOutputs: [true],
			confidence: 0.6,
			testType: request.testType
		});

		// Generate edge case test
		tests.push({
			name: 'should_handle_edge_cases',
			description: 'Test with edge case inputs',
			code: this.generateEdgeCaseTestCode(request),
			inputs: [null, undefined, '', 0],
			expectedOutputs: [false],
			confidence: 0.5,
			testType: request.testType
		});

		return tests;
	}

	private generateBasicTestCode(request: TestGenerationRequest): string {
		switch (request.language.toLowerCase()) {
			case 'javascript':
			case 'typescript':
				return `
describe('Generated Test', () => {
  test('should work with valid input', () => {
    // TODO: Add test implementation
    expect(true).toBe(true);
  });
});`;
			case 'python':
				return `
def test_should_work_with_valid_input():
    # TODO: Add test implementation
    assert True`;
			default:
				return '// TODO: Generate test for ' + request.language;
		}
	}

	private generateEdgeCaseTestCode(request: TestGenerationRequest): string {
		switch (request.language.toLowerCase()) {
			case 'javascript':
			case 'typescript':
				return `
test('should handle edge cases', () => {
  expect(() => functionUnderTest(null)).not.toThrow();
  expect(() => functionUnderTest(undefined)).not.toThrow();
  expect(() => functionUnderTest('')).not.toThrow();
});`;
			case 'python':
				return `
def test_should_handle_edge_cases():
    # Test with None
    result = function_under_test(None)
    assert result is not None

    # Test with empty string
    result = function_under_test('')
    assert result is not None`;
			default:
				return '// TODO: Generate edge case test for ' + request.language;
		}
	}

	private createBasicImprovement(test: TestCase): AIGeneratedTest {
		return {
			name: test.name + '_improved',
			description: 'Improved version of ' + test.name,
			code: test.code + '\n// TODO: Add more assertions',
			inputs: test.inputs,
			expectedOutputs: test.expectedOutputs,
			confidence: 0.7,
			testType: 'unit'
		};
	}

	private generateBasicMockData(schema: any): any {
		if (typeof schema === 'object' && schema !== null) {
			const mock: any = {};
			for (const [key, value] of Object.entries(schema)) {
				if (typeof value === 'string') {
					mock[key] = `mock_${key}`;
				} else if (typeof value === 'number') {
					mock[key] = Math.floor(Math.random() * 100);
				} else if (typeof value === 'boolean') {
					mock[key] = Math.random() > 0.5;
				} else {
					mock[key] = null;
				}
			}
			return mock;
		}
		return {};
	}
}

export class TestWatcher {
	private watcher?: vscode.FileSystemWatcher;
	private config: TestWatchConfig;
	private eventEmitter = new EventEmitter();
	private isWatching = false;
	private debounceTimer?: NodeJS.Timeout;
	private pendingChanges = new Set<string>();
	private activeTestProcess: AbortController | null = null;
	private cancellationToken?: vscode.CancellationTokenSource;

	constructor(config: TestWatchConfig) {
		this.config = config;
	}

	async runTests(): Promise<void> {
		// Cancel previous run to prevent race conditions
		this.activeTestProcess?.abort();
		this.activeTestProcess = new AbortController();

		try {
			await this.executeTests(this.activeTestProcess.signal);
		} catch (e: any) {
			if (e.name !== 'AbortError') {
				throw e;
			}
		} finally {
			if (this.activeTestProcess) {
				this.activeTestProcess = null;
			}
		}
	}

	private async executeTests(signal: AbortSignal): Promise<void> {
		// Implementation of test execution with abort signal support
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				if (!signal.aborted) {
					resolve();
				}
			}, 5000);

			signal.addEventListener('abort', () => {
				clearTimeout(timeout);
				reject(new DOMException('Test execution aborted', 'AbortError'));
			});
		});
	}

	start(): void {
		if (this.isWatching) return;

		this.watcher = vscode.workspace.createFileSystemWatcher(
			new vscode.RelativePattern(vscode.workspace.workspaceFolders![0], '**/*')
		);

		this.watcher.onDidChange((uri) => this.handleFileChange(uri));
		this.watcher.onDidCreate((uri) => this.handleFileChange(uri));
		this.watcher.onDidDelete((uri) => this.handleFileChange(uri));

		this.isWatching = true;
		this.eventEmitter.emit('watch-started');
	}

	stop(): void {
		if (this.watcher) {
			this.watcher.dispose();
			this.watcher = undefined;
		}

		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
		}

		if (this.cancellationToken) {
			this.cancellationToken.cancel();
		}

		this.isWatching = false;
		this.eventEmitter.emit('watch-stopped');
	}

	private handleFileChange(uri: vscode.Uri): void {
		const relativePath = vscode.workspace.asRelativePath(uri);

		// Check if file matches watched patterns
		const shouldWatch = this.config.patterns.some(pattern =>
			this.matchesPattern(relativePath, pattern)
		);

		// Check if file is ignored
		const isIgnored = this.config.ignored.some(pattern =>
			this.matchesPattern(relativePath, pattern)
		);

		if (shouldWatch && !isIgnored) {
			this.pendingChanges.add(relativePath);

			// Debounce file changes to avoid running tests too frequently
			if (this.debounceTimer) {
				clearTimeout(this.debounceTimer);
			}

			this.debounceTimer = setTimeout(() => {
				this.processPendingChanges();
			}, 500); // 500ms debounce
		}
	}

	private processPendingChanges(): void {
		const changes = Array.from(this.pendingChanges);
		this.pendingChanges.clear();

		if (changes.length === 0) return;

		// Cancel any ongoing test runs
		if (this.cancellationToken) {
			this.cancellationToken.cancel();
		}
		this.cancellationToken = new vscode.CancellationTokenSource();

		this.eventEmitter.emit('file-changes-batch', {
			changes,
			timestamp: Date.now(),
			cancellationToken: this.cancellationToken.token
		});

		if (this.config.runOnChange) {
			// Get affected tests for all changed files
			const affectedTests = new Set<string>();
			changes.forEach(change => {
				const tests = DependencyGraph.getAffectedTests(change);
				tests.forEach(test => affectedTests.add(test));
			});

			this.eventEmitter.emit('run-tests-requested', {
				triggeredBy: changes,
				affectedTests: Array.from(affectedTests),
				cancellationToken: this.cancellationToken.token
			});
		}
	}

	private matchesPattern(filePath: string, pattern: string): boolean {
		// Simple glob pattern matching
		const regex = pattern
			.replace(/\*\*/g, '.*')
			.replace(/\*/g, '[^/]*')
			.replace(/\?/g, '.');

		return new RegExp(`^${regex}$`).test(filePath);
	}

	on(event: string, listener: (...args: any[]) => void): void {
		this.eventEmitter.on(event, listener);
	}

	off(event: string, listener: (...args: any[]) => void): void {
		this.eventEmitter.off(event, listener);
	}
}

export class LiveTestEngine {
	private generator = new AITestGenerator();
	private adapters = new Map<string, TestFrameworkAdapter>();
	private watcher?: TestWatcher;
	private websocket?: WebSocket;
	private eventEmitter = new EventEmitter();
	private runningTests = new Map<string, ChildProcess>();
	private testQueue: TestCase[] = [];
	private isProcessingQueue = false;

	constructor(private workspaceRoot: string) { }

	async initialize(): Promise<void> {
		// Detect available test frameworks
		await this.detectFrameworks();

		// Setup file watcher
		this.setupWatcher();

		// Setup WebSocket for real-time communication
		this.setupWebSocket();

		this.eventEmitter.emit('initialized');
	}

	async generateAndRunTests(code: string, language: string): Promise<TestResult[]> {
		const request: TestGenerationRequest = {
			code,
			language,
			testType: 'unit',
			coverage: 80
		};

		const generatedTests = await this.generator.generateTests(request);
		const results: TestResult[] = [];

		for (const aiTest of generatedTests) {
			const testCase: TestCase = {
				id: `generated_${Date.now()}_${Math.random()}`,
				name: aiTest.name,
				code: aiTest.code,
				inputs: aiTest.inputs,
				expectedOutputs: aiTest.expectedOutputs,
				framework: this.detectFramework(language),
				status: 'pending'
			};

			const result = await this.runTest(testCase);
			results.push(result);
		}

		return results;
	}

	async runTest(test: TestCase): Promise<TestResult> {
		const adapter = this.adapters.get(test.framework);
		if (!adapter) {
			throw new Error(`No adapter found for framework: ${test.framework}`);
		}

		const context: TestExecutionContext = {
			workspaceRoot: this.workspaceRoot,
			debugMode: false,
			coverage: true,
			timeout: 30000,
			env: {}
		};

		this.eventEmitter.emit('test-started', { test });

		try {
			const result = await adapter.runTest(test, context);

			this.eventEmitter.emit('test-completed', { test, result });

			// If test failed, try to improve it
			if (result.status === 'failed' && result.error) {
				const improvedTest = await this.generator.improveTest(test, result.error);
				this.eventEmitter.emit('test-improvement-suggested', {
					originalTest: test,
					improvedTest
				});
			}

			return result;

		} catch (error) {
			const errorResult: TestResult = {
				suite: {
					id: 'error',
					name: 'Error Suite',
					framework: test.framework,
					tests: [test],
					totalTests: 1,
					passedTests: 0,
					failedTests: 1,
					duration: 0
				},
				test: {
					...test,
					status: 'error',
					error: error instanceof Error ? error.message : 'Unknown error'
				},
				status: 'error',
				duration: 0,
				output: '',
				error: error instanceof Error ? error.message : 'Unknown error'
			};

			this.eventEmitter.emit('test-error', { test, error: errorResult });
			return errorResult;
		}
	}

	async runTestSuite(tests: TestCase[]): Promise<TestResult[]> {
		const results: TestResult[] = [];

		for (const test of tests) {
			this.testQueue.push(test);
		}

		if (!this.isProcessingQueue) {
			this.processTestQueue();
		}

		return new Promise((resolve) => {
			const checkCompletion = () => {
				if (results.length === tests.length) {
					resolve(results);
				}
			};

			this.eventEmitter.on('test-completed', (data) => {
				results.push(data.result);
				checkCompletion();
			});

			this.eventEmitter.on('test-error', (data) => {
				results.push(data.error);
				checkCompletion();
			});
		});
	}

	private async processTestQueue(): Promise<void> {
		this.isProcessingQueue = true;

		while (this.testQueue.length > 0) {
			const test = this.testQueue.shift()!;
			await this.runTest(test);
		}

		this.isProcessingQueue = false;
	}

	private async detectFrameworks(): Promise<void> {
		const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
		const requirementsPath = path.join(this.workspaceRoot, 'requirements.txt');
		const pomXmlPath = path.join(this.workspaceRoot, 'pom.xml');

		// JavaScript/TypeScript frameworks
		if (fs.existsSync(packageJsonPath)) {
			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
			const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

			if (deps.jest) {
				this.adapters.set('jest', new TestFrameworkAdapter('jest', this.workspaceRoot));
			}
			if (deps.mocha) {
				this.adapters.set('mocha', new TestFrameworkAdapter('mocha', this.workspaceRoot));
			}
		}

		// Python frameworks
		if (fs.existsSync(requirementsPath)) {
			const requirements = fs.readFileSync(requirementsPath, 'utf8');
			if (requirements.includes('pytest')) {
				this.adapters.set('pytest', new TestFrameworkAdapter('pytest', this.workspaceRoot));
			}
			// unittest is built into Python
			this.adapters.set('unittest', new TestFrameworkAdapter('unittest', this.workspaceRoot));
		}

		// Java frameworks
		if (fs.existsSync(pomXmlPath)) {
			const pomXml = fs.readFileSync(pomXmlPath, 'utf8');
			if (pomXml.includes('junit')) {
				this.adapters.set('junit', new TestFrameworkAdapter('junit', this.workspaceRoot));
			}
		}
	}

	private detectFramework(language: string): string {
		switch (language.toLowerCase()) {
			case 'javascript':
			case 'typescript':
				return this.adapters.has('jest') ? 'jest' : 'mocha';
			case 'python':
				return this.adapters.has('pytest') ? 'pytest' : 'unittest';
			case 'java':
				return 'junit';
			default:
				return 'custom';
		}
	}

	private setupWatcher(): void {
		const config: TestWatchConfig = {
			patterns: ['**/*.{js,ts,py,java}', '**/test/**', '**/tests/**'],
			ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**'],
			pollInterval: 1000,
			runOnChange: true,
			coverage: true
		};

		this.watcher = new TestWatcher(config);

		this.watcher.on('file-changed', (data) => {
			this.eventEmitter.emit('file-changed', data);
		});

		this.watcher.on('run-tests-requested', async (data) => {
			// Auto-generate and run tests for changed files
			const uri = vscode.Uri.file(path.join(this.workspaceRoot, data.triggeredBy));
			const doc = await vscode.workspace.openTextDocument(uri);
			const language = this.detectLanguageFromFile(data.triggeredBy);

			if (language) {
				const results = await this.generateAndRunTests(doc.getText(), language);
				this.eventEmitter.emit('auto-test-results', { file: data.triggeredBy, results });
			}
		});

		this.watcher.start();
	}

	private setupWebSocket(): void {
		// Setup WebSocket server for real-time communication with UI
		try {
			this.websocket = new WebSocket('ws://localhost:8080/live-test');

			this.websocket.on('open', () => {
				this.eventEmitter.emit('websocket-connected');
			});

			this.websocket.on('message', (data) => {
				try {
					const message = JSON.parse(data.toString());
					this.handleWebSocketMessage(message);
				} catch (error) {
					console.error('Failed to parse WebSocket message:', error);
				}
			});

			this.websocket.on('error', (error) => {
				console.error('WebSocket error:', error);
			});

		} catch (error) {
			console.error('Failed to setup WebSocket:', error);
		}
	}

	private handleWebSocketMessage(message: any): void {
		switch (message.type) {
			case 'run-test':
				this.runTest(message.test);
				break;
			case 'generate-tests':
				this.generateAndRunTests(message.code, message.language);
				break;
			case 'stop-test':
				this.stopTest(message.testId);
				break;
		}
	}

	private stopTest(testId: string): void {
		const process = this.runningTests.get(testId);
		if (process) {
			process.kill('SIGTERM');
			this.runningTests.delete(testId);
			this.eventEmitter.emit('test-stopped', { testId });
		}
	}

	private detectLanguageFromFile(filePath: string): string | null {
		const ext = path.extname(filePath).toLowerCase();
		switch (ext) {
			case '.js':
			case '.jsx':
				return 'javascript';
			case '.ts':
			case '.tsx':
				return 'typescript';
			case '.py':
				return 'python';
			case '.java':
				return 'java';
			case '.cs':
				return 'csharp';
			default:
				return null;
		}
	}

	// Event handling
	on(event: string, listener: (...args: any[]) => void): void {
		this.eventEmitter.on(event, listener);
	}

	off(event: string, listener: (...args: any[]) => void): void {
		this.eventEmitter.off(event, listener);
	}

	// Cleanup
	async dispose(): Promise<void> {
		if (this.watcher) {
			this.watcher.stop();
		}

		if (this.websocket) {
			this.websocket.close();
		}

		// Stop all running tests
		for (const [testId, process] of this.runningTests) {
			process.kill('SIGTERM');
		}
		this.runningTests.clear();

		this.eventEmitter.removeAllListeners();
	}

	// Getters
	getRunningTests(): string[] {
		return Array.from(this.runningTests.keys());
	}

	getAvailableFrameworks(): string[] {
		return Array.from(this.adapters.keys());
	}

	isWatching(): boolean {
		return this.watcher !== undefined;
	}
}
