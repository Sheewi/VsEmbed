import * as vscode from 'vscode';
import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

export interface DebugSessionData {
	sessionId: string;
	stackFrames?: vscode.DebugStackFrame[];
	variables?: vscode.DebugVariable[];
	breakpoints?: vscode.DebugBreakpoint[];
	performance?: PerformanceMetrics;
}

export interface PerformanceMetrics {
	responseTime: number;
	memory: number;
	cpu: number;
	executionTime: number;
}

export interface BreakpointSuggestion {
	line: number;
	condition?: string;
	reason: string;
	confidence: number;
}

export interface DebugAnalysis {
	tags: string[];
	suggestions: DebugSuggestion[];
	anomalies: VariableAnomaly[];
	fixes: DebugFix[];
}

export interface DebugSuggestion {
	id: string;
	description: string;
	fix: DebugFix;
	confidence: number;
	category: 'performance' | 'logic' | 'memory' | 'syntax';
}

export interface DebugFix {
	uri: vscode.Uri;
	startLine: number;
	endLine: number;
	newCode: string;
	description: string;
}

export interface VariableAnomaly {
	variableName: string;
	expectedType: string;
	actualType: string;
	anomalyType: 'type_mismatch' | 'null_value' | 'range_violation' | 'memory_leak';
	severity: 'low' | 'medium' | 'high' | 'critical';
	suggestion: string;
}

export interface DebugContext {
	frames: vscode.DebugStackFrame[];
	variables: vscode.DebugVariable[];
	performance?: PerformanceMetrics;
	codeContext?: string;
}

export interface DebugError {
	message: string;
	stack: string;
	file: string;
	line: number;
	column: number;
}

export class AIDebugModel {
	private apiEndpoint = 'https://api.vsembed.ai/v1/debug';
	private localModel?: any; // Local GGUF model for offline use

	async predict(request: any): Promise<any> {
		try {
			// Try local model first
			if (this.localModel) {
				return await this.localModel.generate(request);
			}

			// Fallback to cloud API
			const response = await fetch(this.apiEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${process.env.VSEMBED_API_KEY}`
				},
				body: JSON.stringify(request)
			});

			return await response.json();
		} catch (error) {
			console.error('AI Debug prediction failed:', error);
			return this.getFallbackResponse(request);
		}
	}

	private getFallbackResponse(request: any): any {
		// Provide basic rule-based responses when AI is unavailable
		switch (request.task) {
			case 'suggest-breakpoints':
				return { suggestions: this.getBasicBreakpoints(request.code) };
			case 'analyze-stack':
				return { tags: ['unknown'], suggestions: [], anomalies: [], fixes: [] };
			case 'suggest-fix':
				return { description: 'Manual debugging required', newCode: request.code };
			default:
				return {};
		}
	}

	private getBasicBreakpoints(code: string): BreakpointSuggestion[] {
		const lines = code.split('\n');
		const suggestions: BreakpointSuggestion[] = [];

		lines.forEach((line, index) => {
			// Suggest breakpoints on function declarations
			if (line.trim().match(/^(function|const.*=.*=>|class)/)) {
				suggestions.push({
					line: index + 1,
					reason: 'Function entry point',
					confidence: 0.8
				});
			}

			// Suggest breakpoints on conditional statements
			if (line.trim().match(/^(if|else if|switch|case)/)) {
				suggestions.push({
					line: index + 1,
					reason: 'Conditional logic',
					confidence: 0.7
				});
			}

			// Suggest breakpoints on loops
			if (line.trim().match(/^(for|while|do)/)) {
				suggestions.push({
					line: index + 1,
					reason: 'Loop iteration',
					confidence: 0.6
				});
			}

			// Suggest breakpoints on error handling
			if (line.trim().match(/^(try|catch|throw)/)) {
				suggestions.push({
					line: index + 1,
					reason: 'Error handling',
					confidence: 0.9
				});
			}
		});

		return suggestions.slice(0, 10); // Limit to top 10 suggestions
	}
}

export class AIDebugger {
	private model = new AIDebugModel();
	private performance = new PerformanceMonitor();

	async suggestBreakpoints(code: string): Promise<BreakpointSuggestion[]> {
		const startTime = Date.now();

		const response = await this.model.predict({
			task: 'suggest-breakpoints',
			code,
			context: {
				language: this.detectLanguage(code),
				complexity: this.calculateComplexity(code)
			}
		});

		this.performance.recordOperation('breakpoint-suggestion', Date.now() - startTime);
		return response.suggestions || [];
	}

	async analyzeStack(context: DebugContext): Promise<DebugAnalysis> {
		const startTime = Date.now();

		const response = await this.model.predict({
			task: 'analyze-stack',
			stackFrames: context.frames,
			variables: context.variables,
			performance: context.performance,
			codeContext: context.codeContext
		});

		this.performance.recordOperation('stack-analysis', Date.now() - startTime);
		return response;
	}

	async suggestFix(error: DebugError): Promise<DebugFix> {
		const startTime = Date.now();

		const response = await this.model.predict({
			task: 'suggest-fix',
			error: error.message,
			stack: error.stack,
			file: error.file,
			line: error.line,
			column: error.column
		});

		this.performance.recordOperation('fix-suggestion', Date.now() - startTime);
		return response;
	}

	async detectVariableAnomalies(variables: vscode.DebugVariable[]): Promise<VariableAnomaly[]> {
		const anomalies: VariableAnomaly[] = [];

		for (const variable of variables) {
			// Check for null/undefined values
			if (variable.value === 'null' || variable.value === 'undefined') {
				anomalies.push({
					variableName: variable.name,
					expectedType: 'non-null',
					actualType: variable.value,
					anomalyType: 'null_value',
					severity: 'medium',
					suggestion: `Check if ${variable.name} should be initialized before use`
				});
			}

			// Check for type mismatches (basic heuristics)
			if (variable.name.toLowerCase().includes('count') && !variable.value.match(/^\d+$/)) {
				anomalies.push({
					variableName: variable.name,
					expectedType: 'number',
					actualType: typeof variable.value,
					anomalyType: 'type_mismatch',
					severity: 'high',
					suggestion: `${variable.name} appears to be a counter but has non-numeric value`
				});
			}

			// Check for potential memory leaks (large arrays/objects)
			if (variable.value.includes('Array') && variable.value.includes('length')) {
				const match = variable.value.match(/length:\s*(\d+)/);
				if (match && parseInt(match[1]) > 10000) {
					anomalies.push({
						variableName: variable.name,
						expectedType: 'array',
						actualType: 'large array',
						anomalyType: 'memory_leak',
						severity: 'critical',
						suggestion: `${variable.name} contains ${match[1]} items - potential memory leak`
					});
				}
			}
		}

		return anomalies;
	}

	private detectLanguage(code: string): string {
		if (code.includes('function ') || code.includes('=>')) return 'javascript';
		if (code.includes('def ') || code.includes('import ')) return 'python';
		if (code.includes('public class') || code.includes('import java')) return 'java';
		if (code.includes('#include') || code.includes('int main')) return 'cpp';
		return 'unknown';
	}

	private calculateComplexity(code: string): number {
		const lines = code.split('\n');
		let complexity = 1; // Base complexity

		for (const line of lines) {
			// Increase complexity for control structures
			if (line.match(/\b(if|else|for|while|switch|case|catch)\b/)) {
				complexity++;
			}
			// Increase complexity for function calls
			if (line.match(/\w+\s*\(/)) {
				complexity += 0.5;
			}
		}

		return Math.round(complexity);
	}
}

export class VariableAnomalyDetector {
	private baseline = new Map<string, any>();
	private anomalyThresholds = {
		typeChange: 0.1,
		valueRange: 0.2,
		sizeIncrease: 10
	};

	async detect(variables: vscode.DebugVariable[]): Promise<VariableAnomaly[]> {
		const anomalies: VariableAnomaly[] = [];

		for (const variable of variables) {
			const previousValue = this.baseline.get(variable.name);

			if (previousValue) {
				// Check for type changes
				if (typeof previousValue.value !== typeof variable.value) {
					anomalies.push({
						variableName: variable.name,
						expectedType: typeof previousValue.value,
						actualType: typeof variable.value,
						anomalyType: 'type_mismatch',
						severity: 'high',
						suggestion: `Type changed from ${typeof previousValue.value} to ${typeof variable.value}`
					});
				}

				// Check for unusual value ranges
				if (typeof variable.value === 'number' && typeof previousValue.value === 'number') {
					const change = Math.abs(variable.value - previousValue.value) / Math.abs(previousValue.value);
					if (change > this.anomalyThresholds.valueRange) {
						anomalies.push({
							variableName: variable.name,
							expectedType: 'number',
							actualType: 'number',
							anomalyType: 'range_violation',
							severity: 'medium',
							suggestion: `Value changed by ${(change * 100).toFixed(1)}% - possible calculation error`
						});
					}
				}
			}

			// Update baseline
			this.baseline.set(variable.name, {
				value: variable.value,
				type: typeof variable.value,
				timestamp: Date.now()
			});
		}

		return anomalies;
	}

	reset(): void {
		this.baseline.clear();
	}
}

export class PerformanceMonitor {
	private metrics = new Map<string, number[]>();
	private memoryUsage: number[] = [];
	private cpuUsage: number[] = [];

	recordOperation(operation: string, duration: number): void {
		if (!this.metrics.has(operation)) {
			this.metrics.set(operation, []);
		}
		this.metrics.get(operation)!.push(duration);
	}

	recordMemoryUsage(usage: number): void {
		this.memoryUsage.push(usage);
		if (this.memoryUsage.length > 100) {
			this.memoryUsage.shift();
		}
	}

	recordCpuUsage(usage: number): void {
		this.cpuUsage.push(usage);
		if (this.cpuUsage.length > 100) {
			this.cpuUsage.shift();
		}
	}

	getMetrics(): PerformanceMetrics {
		const responseTime = this.getAverageResponseTime();
		const memory = this.getAverageMemoryUsage();
		const cpu = this.getAverageCpuUsage();

		return {
			responseTime,
			memory,
			cpu,
			executionTime: this.getAverageExecutionTime()
		};
	}

	private getAverageResponseTime(): number {
		const allOperations = Array.from(this.metrics.values()).flat();
		return allOperations.length > 0
			? allOperations.reduce((sum, time) => sum + time, 0) / allOperations.length
			: 0;
	}

	private getAverageMemoryUsage(): number {
		return this.memoryUsage.length > 0
			? this.memoryUsage.reduce((sum, usage) => sum + usage, 0) / this.memoryUsage.length
			: 0;
	}

	private getAverageCpuUsage(): number {
		return this.cpuUsage.length > 0
			? this.cpuUsage.reduce((sum, usage) => sum + usage, 0) / this.cpuUsage.length
			: 0;
	}

	private getAverageExecutionTime(): number {
		const executionMetrics = this.metrics.get('execution') || [];
		return executionMetrics.length > 0
			? executionMetrics.reduce((sum, time) => sum + time, 0) / executionMetrics.length
			: 0;
	}
}

export class AIDebugAdapter implements vscode.DebugAdapter {
	private readonly ai = new AIDebugger();
	private sessionData: DebugSessionData = { sessionId: '' };
	private anomalyDetector = new VariableAnomalyDetector();
	private performance = new PerformanceMonitor();
	private eventEmitter = new EventEmitter();

	constructor() {
		this.sessionData.sessionId = `debug_${Date.now()}`;
	}

	async handleCommand(command: string, args: any): Promise<any> {
		const startTime = Date.now();

		try {
			let result;

			switch (command) {
				case 'setBreakpoints':
					result = await this.handleSetBreakpoints(args);
					break;
				case 'stackTrace':
					result = await this.enhanceStackTrace(args);
					break;
				case 'variables':
					result = await this.analyzeVariables(args);
					break;
				case 'applyFix':
					result = await this.applyFix(args);
					break;
				case 'suggestBreakpoints':
					result = await this.suggestSmartBreakpoints(args);
					break;
				default:
					result = { error: `Unknown command: ${command}` };
			}

			this.performance.recordOperation(command, Date.now() - startTime);
			return result;

		} catch (error) {
			console.error(`Debug command ${command} failed:`, error);
			return {
				error: error instanceof Error ? error.message : 'Unknown error',
				command,
				args
			};
		}
	}

	private async handleSetBreakpoints(args: any): Promise<any> {
		try {
			const doc = await vscode.workspace.openTextDocument(args.source.path);
			const smartBreakpoints = await this.ai.suggestBreakpoints(doc.getText());

			// Combine user breakpoints with AI suggestions
			const userBreakpoints = args.breakpoints || [];
			const suggestedBreakpoints = smartBreakpoints
				.filter(bp => !userBreakpoints.some((ubp: any) => ubp.line === bp.line))
				.slice(0, 5); // Limit suggestions

			const allBreakpoints = [
				...userBreakpoints.map((bp: any) => ({
					id: bp.line,
					line: bp.line,
					verified: true,
					condition: bp.condition
				})),
				...suggestedBreakpoints.map(bp => ({
					id: `ai_${bp.line}`,
					line: bp.line,
					verified: true,
					condition: bp.condition,
					logMessage: `AI suggested: ${bp.reason}`,
					hitCondition: bp.confidence > 0.8 ? undefined : 'false' // Only activate high-confidence suggestions
				}))
			];

			this.sessionData.breakpoints = allBreakpoints;

			return {
				breakpoints: allBreakpoints
			};

		} catch (error) {
			console.error('Failed to set breakpoints:', error);
			return {
				breakpoints: args.breakpoints || []
			};
		}
	}

	private async enhanceStackTrace(stackTrace: any): Promise<any> {
		try {
			this.sessionData.stackFrames = stackTrace.stackFrames;

			const context: DebugContext = {
				frames: stackTrace.stackFrames,
				variables: await this.collectVariables(),
				performance: this.performance.getMetrics()
			};

			const enhanced = await this.ai.analyzeStack(context);

			// Emit enhanced data to UI
			this.eventEmitter.emit('stackTraceEnhanced', {
				stackTrace,
				analysis: enhanced,
				sessionId: this.sessionData.sessionId
			});

			return {
				...stackTrace,
				enhancedTags: enhanced.tags,
				suggestions: enhanced.suggestions,
				anomalies: enhanced.anomalies
			};

		} catch (error) {
			console.error('Failed to enhance stack trace:', error);
			return stackTrace;
		}
	}

	private async analyzeVariables(vars: any): Promise<any> {
		try {
			const variables = vars.variables || [];
			this.sessionData.variables = variables;

			// Detect anomalies
			const aiAnomalies = await this.ai.detectVariableAnomalies(variables);
			const behaviorAnomalies = await this.anomalyDetector.detect(variables);

			const allAnomalies = [...aiAnomalies, ...behaviorAnomalies];

			// Emit variable analysis to UI
			this.eventEmitter.emit('variablesAnalyzed', {
				variables,
				anomalies: allAnomalies,
				sessionId: this.sessionData.sessionId
			});

			return {
				...vars,
				anomalies: allAnomalies,
				enhancedVariables: variables.map((v: any) => ({
					...v,
					anomaly: allAnomalies.find(a => a.variableName === v.name)
				}))
			};

		} catch (error) {
			console.error('Failed to analyze variables:', error);
			return vars;
		}
	}

	private async applyFix(args: any): Promise<any> {
		try {
			const { fix } = args;

			const edit = new vscode.WorkspaceEdit();
			edit.replace(
				fix.uri,
				new vscode.Range(
					fix.startLine, 0,
					fix.endLine, Number.MAX_VALUE
				),
				fix.newCode
			);

			const success = await vscode.workspace.applyEdit(edit);

			if (success) {
				// Format the document
				await vscode.commands.executeCommand('editor.action.formatDocument');

				// Emit fix applied event
				this.eventEmitter.emit('fixApplied', {
					fix,
					success: true,
					sessionId: this.sessionData.sessionId
				});
			}

			return { success, fix };

		} catch (error) {
			console.error('Failed to apply fix:', error);
			return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
		}
	}

	private async suggestSmartBreakpoints(args: any): Promise<any> {
		try {
			const { filePath } = args;
			const doc = await vscode.workspace.openTextDocument(filePath);
			const suggestions = await this.ai.suggestBreakpoints(doc.getText());

			return {
				suggestions: suggestions.map(s => ({
					...s,
					filePath,
					preview: this.getLinePreview(doc, s.line)
				}))
			};

		} catch (error) {
			console.error('Failed to suggest breakpoints:', error);
			return { suggestions: [] };
		}
	}

	private async collectVariables(): Promise<vscode.DebugVariable[]> {
		// This would typically be provided by the debug adapter
		return this.sessionData.variables || [];
	}

	private getLinePreview(doc: vscode.TextDocument, line: number): string {
		if (line > 0 && line <= doc.lineCount) {
			return doc.lineAt(line - 1).text.trim();
		}
		return '';
	}

	// Event handling for UI communication
	on(event: string, listener: (...args: any[]) => void): void {
		this.eventEmitter.on(event, listener);
	}

	off(event: string, listener: (...args: any[]) => void): void {
		this.eventEmitter.off(event, listener);
	}

	getSessionData(): DebugSessionData {
		return { ...this.sessionData };
	}

	getPerformanceMetrics(): PerformanceMetrics {
		return this.performance.getMetrics();
	}
}
