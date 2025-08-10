import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { MockAIService, createDebugMockAI, withMockAI, expectAICall } from '../mocks/ai-service';
import { AIDebugAdapter } from '../../src/debug/ai-debug-adapter';
import { goldenTester } from '../golden/golden-tester';

describe('AI Debug Adapter Integration', () => {
	let mockAI: MockAIService;
	let debugAdapter: AIDebugAdapter;

	beforeEach(() => {
		mockAI = createDebugMockAI();
		debugAdapter = new AIDebugAdapter(mockAI as any);
	});

	afterEach(() => {
		mockAI.reset();
	});

	describe('Breakpoint Suggestions', () => {
		it('should suggest intelligent breakpoints for JavaScript code', withMockAI(async (ai) => {
			const jsCode = `
function calculateSum(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }
  
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  
  return sum;
}`;

			ai.setResponse('suggest-breakpoints', {
				suggestions: [
					{ line: 2, condition: 'Array.isArray(numbers)', reason: 'Input validation', confidence: 0.9 },
					{ line: 6, condition: 'sum >= 0', reason: 'Loop initialization', confidence: 0.8 },
					{ line: 8, condition: 'i % 5 === 0', reason: 'Loop progress tracking', confidence: 0.7 }
				]
			});

			const suggestions = await debugAdapter['ai'].suggestBreakpoints(jsCode);

			expectAICall(ai, 'suggest-breakpoints', 1);
			expect(suggestions).toHaveLength(3);
			expect(suggestions[0]).toMatchObject({
				line: 2,
				condition: 'Array.isArray(numbers)',
				reason: 'Input validation'
			});

			// Test against golden file
			expect(JSON.stringify(suggestions, null, 2)).toMatchGoldenFile('debug-breakpoint-suggestions-js');
		}));

		it('should generate breakpoint conditions for specific lines', async () => {
			const code = `
function processData(data) {
  const result = [];
  for (const item of data) {
    if (item.isValid) {
      result.push(transform(item));
    }
  }
  return result;
}`;

			mockAI.setResponse('breakpoint-condition', {
				condition: 'item && item.isValid === true'
			});

			const condition = await debugAdapter['ai'].suggestBreakpointConditions(code, 5);

			expect(condition).toBe('item && item.isValid === true');
			expectAICall(mockAI, 'breakpoint-condition', 1);
		});
	});

	describe('Stack Analysis', () => {
		it('should analyze debug stack with AI insights', async () => {
			const mockContext = {
				frames: [
					{ id: 1, name: 'main', source: 'app.js', line: 15, column: 8 },
					{ id: 2, name: 'processData', source: 'utils.js', line: 42, column: 12 },
					{ id: 3, name: 'validateInput', source: 'validation.js', line: 7, column: 4 }
				],
				variables: [
					{ name: 'data', value: '[object Array]', type: 'object', scope: 'local' },
					{ name: 'isValid', value: 'false', type: 'boolean', scope: 'local' },
					{ name: 'result', value: 'null', type: 'object', scope: 'local' }
				],
				performance: {
					responseTime: 250,
					memory: 45.7,
					cpu: 12.3,
					executionTime: 1200
				}
			};

			mockAI.setResponse('analyze-stack', {
				tags: ['validation-error', 'null-result'],
				suggestions: [
					{
						id: 'fix-1',
						description: 'Check input validation logic',
						confidence: 0.85,
						category: 'logic'
					}
				],
				anomalies: [
					{
						variableName: 'result',
						expectedType: 'array',
						actualType: 'null',
						anomalyType: 'null_value',
						severity: 'high',
						suggestion: 'Result should be initialized as empty array'
					}
				],
				fixes: []
			});

			const analysis = await debugAdapter['ai'].analyzeStack(mockContext as any);

			expect(analysis.tags).toContain('validation-error');
			expect(analysis.suggestions).toHaveLength(1);
			expect(analysis.anomalies).toHaveLength(1);
			expect(analysis.anomalies[0].variableName).toBe('result');

			// Test against golden file
			expect(analysis).toMatchGoldenJSON('debug-stack-analysis');
		});
	});

	describe('Variable Anomaly Detection', () => {
		it('should detect variable anomalies using AI and rule-based approaches', async () => {
			const variables = [
				{ name: 'count', value: 'NaN', type: 'number', scope: 'local' },
				{ name: 'items', value: '[object Array(10000)]', type: 'object', scope: 'local' },
				{ name: 'status', value: 'null', type: 'object', scope: 'local' }
			];

			mockAI.setResponse('detect-anomalies', {
				anomalies: [
					{
						variableName: 'count',
						expectedType: 'number',
						actualType: 'NaN',
						anomalyType: 'type_mismatch',
						severity: 'high',
						suggestion: 'NaN value detected - check arithmetic operations'
					}
				]
			});

			const anomalies = await debugAdapter['ai'].detectVariableAnomalies(variables as any);

			// Should detect AI anomalies + rule-based anomalies
			expect(anomalies.length).toBeGreaterThan(1);
			
			// Check for NaN detection (AI)
			const nanAnomaly = anomalies.find(a => a.variableName === 'count' && a.actualType === 'NaN');
			expect(nanAnomaly).toBeDefined();
			
			// Check for large array detection (rule-based)
			const memoryAnomaly = anomalies.find(a => a.variableName === 'items' && a.anomalyType === 'memory_leak');
			expect(memoryAnomaly).toBeDefined();

			// Check for null value detection (rule-based)
			const nullAnomaly = anomalies.find(a => a.variableName === 'status' && a.anomalyType === 'null_value');
			expect(nullAnomaly).toBeDefined();
		});
	});

	describe('Enhanced Breakpoint Setting', () => {
		it('should enhance breakpoints with AI suggestions', async () => {
			const setBreakpointsArgs = {
				source: { path: '/test/example.js' },
				breakpoints: [
					{ line: 10 },
					{ line: 15, condition: 'x > 0' }
				]
			};

			// Mock document reading
			const mockDocument = {
				getText: () => `
function example(x) {
  console.log('start');
  if (x > 0) {
    return x * 2;
  }
  return 0;
}`
			};

			// Mock VS Code workspace
			const originalOpenTextDocument = require('vscode').workspace?.openTextDocument;
			if (require('vscode').workspace) {
				require('vscode').workspace.openTextDocument = jest.fn().mockResolvedValue(mockDocument);
			}

			mockAI.setResponse('suggest-breakpoints', {
				suggestions: [
					{ line: 3, condition: 'true', reason: 'Function entry', confidence: 0.8 },
					{ line: 4, condition: 'x > 0', reason: 'Conditional logic', confidence: 0.9 }
				]
			});

			mockAI.setResponse('breakpoint-condition', {
				condition: 'typeof x === "number"'
			});

			try {
				const result = await debugAdapter.handleCommand('setBreakpoints', setBreakpointsArgs);

				expect(result.breakpoints).toBeDefined();
				expect(result.breakpoints.length).toBeGreaterThan(2); // Original + AI suggestions
				
				// Check that AI-enhanced conditions were applied
				const enhancedBreakpoint = result.breakpoints.find((bp: any) => bp.line === 10);
				expect(enhancedBreakpoint?.condition).toBe('typeof x === "number"');

				// Test against golden file
				expect(result).toMatchGoldenJSON('debug-enhanced-breakpoints');

			} finally {
				// Restore original function
				if (originalOpenTextDocument && require('vscode').workspace) {
					require('vscode').workspace.openTextDocument = originalOpenTextDocument;
				}
			}
		});
	});

	describe('Performance Integration', () => {
		it('should track debug adapter performance metrics', async () => {
			const commands = ['setBreakpoints', 'stackTrace', 'variables', 'suggestBreakpoints'];
			
			// Execute multiple commands to test performance tracking
			for (const command of commands) {
				await debugAdapter.handleCommand(command, {});
			}

			const metrics = debugAdapter.getPerformanceMetrics();
			
			expect(metrics.responseTime).toBeGreaterThan(0);
			expect(metrics.executionTime).toBeGreaterThan(0);
			
			// Should have recorded metrics for each command
			commands.forEach(command => {
				expectAICall(mockAI, 'suggest-breakpoints', 1); // All commands trigger some AI interaction
			});
		});
	});

	describe('Error Handling', () => {
		it('should gracefully handle AI service failures', async () => {
			mockAI.setResponse('suggest-breakpoints', null, { shouldFail: true, failureReason: 'AI service unavailable' });

			const result = await debugAdapter.handleCommand('suggestBreakpoints', { filePath: '/test/file.js' });

			// Should still return some suggestions (fallback)
			expect(result.suggestions).toBeDefined();
			expect(Array.isArray(result.suggestions)).toBe(true);
		});

		it('should handle malformed requests gracefully', async () => {
			const result = await debugAdapter.handleCommand('invalidCommand', { invalid: 'data' });

			expect(result.error).toBeDefined();
			expect(result.error).toContain('Unknown command');
		});
	});
});
