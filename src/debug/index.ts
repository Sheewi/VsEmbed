export { AIDebugAdapter, DebugSessionData, PerformanceMetrics, BreakpointSuggestion, DebugAnalysis } from './ai-debug-adapter';
export { LiveTestEngine, TestCase, TestSuite, TestResult, AIGeneratedTest } from './live-test-engine';
export { DebugTestManager, DebugTestSession, DebugTestConfig, getDebugTestManager } from './debug-test-manager';

// Component exports
export { DebugTestPanel } from './components/DebugTestPanel';
export { DebugControls, DebugInspector, BreakpointList, LogOutput } from './components/DebugInspector';
export { LiveTestRunner, TestCoverageView } from './components/LiveTestRunner';

// Type exports
export interface DebugTestIntegration {
	createSession(workspaceRoot: string, activeFile?: string): Promise<string>;
	destroySession(sessionId: string): Promise<void>;
	startDebug(sessionId: string, file: string, breakpoints?: any[]): Promise<void>;
	stopDebug(sessionId: string): Promise<void>;
	generateTests(sessionId: string, file: string, language: string): Promise<any[]>;
	runTests(sessionId: string, testIds: string[]): Promise<any[]>;
}

export interface DebugTestEvents {
	'session-created': { sessionId: string; workspaceRoot: string; activeFile?: string };
	'session-destroyed': { sessionId: string };
	'debug-started': { sessionId: string; file: string };
	'debug-stopped': { sessionId: string };
	'tests-generated': { sessionId: string; file: string; results: any[] };
	'tests-completed': { sessionId: string; results: any[] };
	'variable-anomaly-detected': { sessionId: string; anomaly: any };
	'ai-suggestion': { sessionId: string; suggestion: any };
	'config-updated': any;
	'metrics-updated': any;
}

// Default configuration
export const DEFAULT_DEBUG_TEST_CONFIG = {
	autoTest: true,
	watchFiles: true,
	smartBreakpoints: true,
	aiSuggestions: true,
	coverage: true,
	timeout: 30000,
	frameworks: ['jest', 'mocha', 'pytest', 'unittest']
};

// Utility functions
export function createDebugTestSession(workspaceRoot: string, activeFile?: string): Promise<string> {
	const manager = getDebugTestManager();
	return manager.createSession(workspaceRoot, activeFile);
}

export function isDebugTestSupported(language: string): boolean {
	const supportedLanguages = ['javascript', 'typescript', 'python', 'java', 'csharp'];
	return supportedLanguages.includes(language.toLowerCase());
}

export function getTestFrameworkForLanguage(language: string): string {
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
