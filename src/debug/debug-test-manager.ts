import * as vscode from 'vscode';
import { AIDebugAdapter } from './ai-debug-adapter';
import { LiveTestEngine } from './live-test-engine';
import { EventEmitter } from 'events';

export interface DebugTestSession {
	id: string;
	debugAdapter: AIDebugAdapter;
	testEngine: LiveTestEngine;
	status: 'active' | 'paused' | 'stopped';
	workspaceRoot: string;
	activeFile?: string;
}

export interface DebugTestConfig {
	autoTest: boolean;
	watchFiles: boolean;
	smartBreakpoints: boolean;
	aiSuggestions: boolean;
	coverage: boolean;
	timeout: number;
	frameworks: string[];
}

export interface SessionMetrics {
	debugSessions: number;
	testsRun: number;
	testsPassed: number;
	testsFailed: number;
	avgResponseTime: number;
	coverage: number;
	uptime: number;
}

export class DebugTestManager {
	private sessions = new Map<string, DebugTestSession>();
	private config: DebugTestConfig;
	private eventEmitter = new EventEmitter();
	private websocketServer?: any; // WebSocket server for UI communication
	private metrics: SessionMetrics;
	private startTime = Date.now();

	constructor() {
		this.config = {
			autoTest: true,
			watchFiles: true,
			smartBreakpoints: true,
			aiSuggestions: true,
			coverage: true,
			timeout: 30000,
			frameworks: ['jest', 'mocha', 'pytest', 'unittest']
		};

		this.metrics = {
			debugSessions: 0,
			testsRun: 0,
			testsPassed: 0,
			testsFailed: 0,
			avgResponseTime: 0,
			coverage: 0,
			uptime: 0
		};

		this.setupWebSocketServer();
		this.registerCommands();
		this.startMetricsUpdater();
	}

	async createSession(workspaceRoot: string, activeFile?: string): Promise<string> {
		const sessionId = `debug_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		try {
			// Create AI Debug Adapter
			const debugAdapter = new AIDebugAdapter();

			// Create Live Test Engine
			const testEngine = new LiveTestEngine(workspaceRoot);
			await testEngine.initialize();

			// Setup session
			const session: DebugTestSession = {
				id: sessionId,
				debugAdapter,
				testEngine,
				status: 'active',
				workspaceRoot,
				activeFile
			};

			// Setup event forwarding
			this.setupSessionEventHandlers(session);

			this.sessions.set(sessionId, session);
			this.metrics.debugSessions++;

			this.eventEmitter.emit('session-created', { sessionId, session });
			this.broadcastToUI('session-created', { sessionId, workspaceRoot, activeFile });

			return sessionId;

		} catch (error) {
			console.error('Failed to create debug-test session:', error);
			throw error;
		}
	}

	async destroySession(sessionId: string): Promise<void> {
		const session = this.sessions.get(sessionId);
		if (!session) return;

		try {
			// Stop test engine
			await session.testEngine.dispose();

			// Update session status
			session.status = 'stopped';

			// Remove from active sessions
			this.sessions.delete(sessionId);

			this.eventEmitter.emit('session-destroyed', { sessionId });
			this.broadcastToUI('session-destroyed', { sessionId });

		} catch (error) {
			console.error('Failed to destroy session:', error);
		}
	}

	getSession(sessionId: string): DebugTestSession | undefined {
		return this.sessions.get(sessionId);
	}

	getAllSessions(): DebugTestSession[] {
		return Array.from(this.sessions.values());
	}

	async startDebug(sessionId: string, file: string, breakpoints?: any[]): Promise<void> {
		const session = this.sessions.get(sessionId);
		if (!session) throw new Error(`Session ${sessionId} not found`);

		try {
			session.status = 'active';
			session.activeFile = file;

			// Start debug session
			await session.debugAdapter.handleCommand('setBreakpoints', {
				source: { path: file },
				breakpoints: breakpoints || []
			});

			this.eventEmitter.emit('debug-started', { sessionId, file });
			this.broadcastToUI('debug-session-started', {
				sessionId,
				file,
				session: session.debugAdapter.getSessionData()
			});

		} catch (error) {
			console.error('Failed to start debug:', error);
			throw error;
		}
	}

	async stopDebug(sessionId: string): Promise<void> {
		const session = this.sessions.get(sessionId);
		if (!session) return;

		try {
			session.status = 'stopped';

			this.eventEmitter.emit('debug-stopped', { sessionId });
			this.broadcastToUI('debug-session-stopped', { sessionId });

		} catch (error) {
			console.error('Failed to stop debug:', error);
		}
	}

	async generateTests(sessionId: string, file: string, language: string): Promise<any[]> {
		const session = this.sessions.get(sessionId);
		if (!session) throw new Error(`Session ${sessionId} not found`);

		try {
			const doc = await vscode.workspace.openTextDocument(file);
			const results = await session.testEngine.generateAndRunTests(doc.getText(), language);

			this.updateTestMetrics(results);

			this.eventEmitter.emit('tests-generated', { sessionId, file, results });
			this.broadcastToUI('tests-generated', { sessionId, file, results });

			return results;

		} catch (error) {
			console.error('Failed to generate tests:', error);
			throw error;
		}
	}

	async runTests(sessionId: string, testIds: string[]): Promise<any[]> {
		const session = this.sessions.get(sessionId);
		if (!session) throw new Error(`Session ${sessionId} not found`);

		try {
			const results: any[] = [];

			for (const testId of testIds) {
				// Find test in generated tests or create basic test
				const testCase = {
					id: testId,
					name: `Test ${testId}`,
					code: '// Generated test',
					inputs: [],
					expectedOutputs: [],
					framework: 'jest',
					status: 'pending' as const
				};

				const result = await session.testEngine.runTest(testCase);
				results.push(result);

				this.metrics.testsRun++;
				if (result.status === 'passed') {
					this.metrics.testsPassed++;
				} else if (result.status === 'failed') {
					this.metrics.testsFailed++;
				}
			}

			this.eventEmitter.emit('tests-completed', { sessionId, results });
			this.broadcastToUI('tests-completed', { sessionId, results });

			return results;

		} catch (error) {
			console.error('Failed to run tests:', error);
			throw error;
		}
	}

	updateConfig(updates: Partial<DebugTestConfig>): void {
		this.config = { ...this.config, ...updates };

		this.eventEmitter.emit('config-updated', this.config);
		this.broadcastToUI('config-updated', this.config);
	}

	getConfig(): DebugTestConfig {
		return { ...this.config };
	}

	getMetrics(): SessionMetrics {
		return {
			...this.metrics,
			uptime: Date.now() - this.startTime
		};
	}

	private setupSessionEventHandlers(session: DebugTestSession): void {
		// Debug adapter events
		session.debugAdapter.on('stackTraceEnhanced', (data) => {
			this.broadcastToUI('debug-output', {
				sessionId: session.id,
				type: 'stack-trace',
				data
			});
		});

		session.debugAdapter.on('variablesAnalyzed', (data) => {
			this.broadcastToUI('variable-anomaly-detected', {
				sessionId: session.id,
				anomaly: data.anomalies[0] // Send first anomaly for demo
			});
		});

		session.debugAdapter.on('fixApplied', (data) => {
			this.broadcastToUI('debug-output', {
				sessionId: session.id,
				message: `Fix applied: ${data.fix.description}`
			});
		});

		// Test engine events
		session.testEngine.on('test-started', (data) => {
			this.broadcastToUI('test-started', {
				sessionId: session.id,
				...data
			});
		});

		session.testEngine.on('test-completed', (data) => {
			this.broadcastToUI('test-completed', {
				sessionId: session.id,
				...data
			});
		});

		session.testEngine.on('test-improvement-suggested', (data) => {
			this.broadcastToUI('ai-suggestion', {
				sessionId: session.id,
				suggestion: {
					description: `Improved test: ${data.improvedTest.name}`,
					confidence: data.improvedTest.confidence
				}
			});
		});

		session.testEngine.on('file-changed', (data) => {
			if (this.config.autoTest) {
				// Auto-run tests when files change
				this.handleAutoTest(session, data.relativePath);
			}
		});
	}

	private async handleAutoTest(session: DebugTestSession, filePath: string): Promise<void> {
		try {
			const language = this.detectLanguageFromFile(filePath);
			if (language) {
				const doc = await vscode.workspace.openTextDocument(
					vscode.Uri.file(vscode.path.join(session.workspaceRoot, filePath))
				);

				await session.testEngine.generateAndRunTests(doc.getText(), language);
			}
		} catch (error) {
			console.error('Auto-test failed:', error);
		}
	}

	private detectLanguageFromFile(filePath: string): string | null {
		const ext = vscode.path.extname(filePath).toLowerCase();
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
			default:
				return null;
		}
	}

	private updateTestMetrics(results: any[]): void {
		for (const result of results) {
			this.metrics.testsRun++;
			if (result.status === 'passed') {
				this.metrics.testsPassed++;
			} else if (result.status === 'failed') {
				this.metrics.testsFailed++;
			}

			if (result.duration) {
				// Update average response time
				this.metrics.avgResponseTime =
					(this.metrics.avgResponseTime + result.duration) / 2;
			}
		}
	}

	private setupWebSocketServer(): void {
		try {
			// This would be implemented with a real WebSocket server
			// For now, we'll simulate it
			console.log('Debug-Test WebSocket server would be set up here');
		} catch (error) {
			console.error('Failed to setup WebSocket server:', error);
		}
	}

	private broadcastToUI(event: string, data: any): void {
		// Broadcast to all connected UI clients
		this.eventEmitter.emit('ui-broadcast', { event, data });

		// If we had a real WebSocket server, we'd broadcast here
		console.log(`Broadcasting to UI: ${event}`, data);
	}

	private registerCommands(): void {
		// Register VS Code commands for debug-test functionality
		vscode.commands.registerCommand('vsembed.debugTest.createSession', async () => {
			const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
			if (!workspaceRoot) {
				vscode.window.showErrorMessage('No workspace folder open');
				return;
			}

			const activeFile = vscode.window.activeTextEditor?.document.fileName;
			const sessionId = await this.createSession(workspaceRoot, activeFile);

			vscode.window.showInformationMessage(`Debug-Test session created: ${sessionId}`);
			return sessionId;
		});

		vscode.commands.registerCommand('vsembed.debugTest.generateTests', async () => {
			const activeFile = vscode.window.activeTextEditor?.document.fileName;
			if (!activeFile) {
				vscode.window.showErrorMessage('No active file');
				return;
			}

			const sessions = this.getAllSessions();
			if (sessions.length === 0) {
				vscode.window.showErrorMessage('No active debug-test sessions');
				return;
			}

			const language = this.detectLanguageFromFile(activeFile);
			if (!language) {
				vscode.window.showErrorMessage('Unsupported file type for test generation');
				return;
			}

			const session = sessions[0]; // Use first session
			const results = await this.generateTests(session.id, activeFile, language);

			vscode.window.showInformationMessage(`Generated ${results.length} tests`);
		});

		vscode.commands.registerCommand('vsembed.debugTest.toggleAutoTest', () => {
			this.updateConfig({ autoTest: !this.config.autoTest });
			vscode.window.showInformationMessage(
				`Auto-test ${this.config.autoTest ? 'enabled' : 'disabled'}`
			);
		});

		vscode.commands.registerCommand('vsembed.debugTest.showMetrics', () => {
			const metrics = this.getMetrics();
			const message = `
        Debug Sessions: ${metrics.debugSessions}
        Tests Run: ${metrics.testsRun}
        Tests Passed: ${metrics.testsPassed}
        Tests Failed: ${metrics.testsFailed}
        Avg Response: ${metrics.avgResponseTime.toFixed(1)}ms
        Uptime: ${Math.round(metrics.uptime / 1000)}s
      `;
			vscode.window.showInformationMessage(message);
		});
	}

	private startMetricsUpdater(): void {
		setInterval(() => {
			const metrics = this.getMetrics();
			this.broadcastToUI('metrics-updated', metrics);
		}, 5000); // Update every 5 seconds
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
		// Stop all sessions
		const sessionIds = Array.from(this.sessions.keys());
		for (const sessionId of sessionIds) {
			await this.destroySession(sessionId);
		}

		// Clean up WebSocket server
		if (this.websocketServer) {
			this.websocketServer.close();
		}

		this.eventEmitter.removeAllListeners();
	}
}

// Global manager instance
let debugTestManager: DebugTestManager | undefined;

export function getDebugTestManager(): DebugTestManager {
	if (!debugTestManager) {
		debugTestManager = new DebugTestManager();
	}
	return debugTestManager;
}

export function disposeDebugTestManager(): void {
	if (debugTestManager) {
		debugTestManager.dispose();
		debugTestManager = undefined;
	}
}

// VS Code Extension Integration
export function activate(context: vscode.ExtensionContext): void {
	const manager = getDebugTestManager();

	// Register disposables
	context.subscriptions.push({
		dispose: () => disposeDebugTestManager()
	});

	// Auto-create session when workspace opens
	if (vscode.workspace.workspaceFolders?.length) {
		const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
		manager.createSession(workspaceRoot).catch(console.error);
	}
}

export function deactivate(): void {
	disposeDebugTestManager();
}
