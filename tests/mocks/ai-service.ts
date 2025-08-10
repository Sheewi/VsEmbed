import { jest } from '@jest/globals';
import { AIService, AIRequest, AIResponse } from '../../src/ai/ai-service';

export interface MockAIResponse {
	task: string;
	response: any;
	latency?: number;
	confidence?: number;
	shouldFail?: boolean;
	failureReason?: string;
}

export class MockAIService implements Partial<AIService> {
	private responses = new Map<string, MockAIResponse>();
	private callHistory: Array<{ request: AIRequest; timestamp: number }> = [];
	private defaultResponse: any = null;
	private simulateLatency = true;
	private baseLatency = 100; // milliseconds

	// Mock implementation of predict method
	predict = jest.fn(async (request: AIRequest): Promise<AIResponse> => {
		// Record the call
		this.callHistory.push({
			request: { ...request },
			timestamp: Date.now()
		});

		// Simulate network latency
		if (this.simulateLatency) {
			await new Promise(resolve => setTimeout(resolve, this.baseLatency));
		}

		// Check for task-specific response
		const mockResponse = this.responses.get(request.task);
		
		if (mockResponse?.shouldFail) {
			throw new Error(mockResponse.failureReason || `Mock failure for task: ${request.task}`);
		}

		const responseData = mockResponse?.response || this.getDefaultResponse(request);
		const latency = mockResponse?.latency || this.baseLatency;
		const confidence = mockResponse?.confidence || 0.8;

		return {
			success: true,
			data: responseData,
			model: request.model || 'mock-model',
			latency,
			source: 'local',
			confidence
		};
	});

	// Mock implementation of other methods
	healthCheck = jest.fn(async (): Promise<{ [model: string]: boolean }> => {
		return {
			'mock-model-1': true,
			'mock-model-2': true,
			'gpt-3.5-turbo': true
		};
	});

	queueRequest = jest.fn(async (request: AIRequest): Promise<string> => {
		const requestId = `mock_req_${Date.now()}`;
		// Simulate queuing by calling predict after a delay
		setTimeout(() => this.predict(request), 10);
		return requestId;
	});

	updateConfig = jest.fn((newConfig: any): void => {
		// Mock config update
	});

	getPerformanceStats = jest.fn(() => ({
		models: [
			{
				name: 'mock-model-1',
				performance: { avgLatency: 100, reliability: 0.95, costPerRequest: 0 },
				circuitBreakerStatus: 'closed'
			}
		],
		queueLength: 0,
		isProcessing: false
	}));

	// Configuration methods
	setResponse(task: string, response: any, options?: {
		latency?: number;
		confidence?: number;
		shouldFail?: boolean;
		failureReason?: string;
	}): void {
		this.responses.set(task, {
			task,
			response,
			latency: options?.latency,
			confidence: options?.confidence,
			shouldFail: options?.shouldFail,
			failureReason: options?.failureReason
		});
	}

	setDefaultResponse(response: any): void {
		this.defaultResponse = response;
	}

	setLatency(latency: number): void {
		this.baseLatency = latency;
	}

	enableLatencySimulation(enable: boolean): void {
		this.simulateLatency = enable;
	}

	// Assertion helpers
	expectCalled(times?: number): void {
		if (times !== undefined) {
			expect(this.predict).toHaveBeenCalledTimes(times);
		} else {
			expect(this.predict).toHaveBeenCalled();
		}
	}

	expectCalledWith(task: string, context?: any): void {
		expect(this.predict).toHaveBeenCalledWith(
			expect.objectContaining({
				task,
				...(context && { context: expect.objectContaining(context) })
			})
		);
	}

	expectNotCalled(): void {
		expect(this.predict).not.toHaveBeenCalled();
	}

	getCallHistory(): Array<{ request: AIRequest; timestamp: number }> {
		return [...this.callHistory];
	}

	getLastCall(): AIRequest | null {
		return this.callHistory.length > 0 
			? this.callHistory[this.callHistory.length - 1].request 
			: null;
	}

	getCallCount(): number {
		return this.callHistory.length;
	}

	getCallsForTask(task: string): AIRequest[] {
		return this.callHistory
			.filter(call => call.request.task === task)
			.map(call => call.request);
	}

	// Reset methods
	reset(): void {
		this.predict.mockClear();
		this.healthCheck.mockClear();
		this.queueRequest.mockClear();
		this.updateConfig.mockClear();
		this.getPerformanceStats.mockClear();
		this.callHistory = [];
		this.responses.clear();
		this.defaultResponse = null;
	}

	resetCallHistory(): void {
		this.callHistory = [];
		this.predict.mockClear();
	}

	// Default response generators
	private getDefaultResponse(request: AIRequest): any {
		if (this.defaultResponse) {
			return this.defaultResponse;
		}

		switch (request.task) {
			case 'code-generation':
				return {
					code: `// Generated code for: ${request.context?.prompt || 'unknown prompt'}
function generatedFunction() {
  // TODO: Implement functionality
  return null;
}`,
					suggestions: ['Add error handling', 'Add unit tests']
				};

			case 'code-completion':
				return {
					completions: [
						{ text: 'console.log(', confidence: 0.9 },
						{ text: 'function ', confidence: 0.8 },
						{ text: 'const ', confidence: 0.7 }
					]
				};

			case 'code-review':
				return {
					comments: [
						{
							line: 1,
							message: 'Mock review comment',
							severity: 'warning',
							category: 'style'
						}
					],
					summary: { total: 1, errors: 0, warnings: 1, info: 0 },
					suggestions: ['Consider adding documentation']
				};

			case 'test-generation':
				return {
					tests: [
						{
							name: 'should work with valid input',
							code: 'test("should work", () => { expect(true).toBe(true); });',
							confidence: 0.8
						}
					]
				};

			case 'suggest-breakpoints':
				return {
					suggestions: [
						{
							line: request.context?.code?.split('\n').length || 1,
							condition: 'true',
							reason: 'Mock breakpoint suggestion',
							confidence: 0.7
						}
					]
				};

			case 'analyze-stack':
				return {
					tags: ['mock-analysis'],
					suggestions: [
						{
							id: 'mock-1',
							description: 'Mock debugging suggestion',
							confidence: 0.8,
							category: 'performance'
						}
					],
					anomalies: [],
					fixes: []
				};

			case 'suggest-fix':
				return {
					uri: request.context?.file || 'mock-file.ts',
					startLine: request.context?.line || 1,
					endLine: request.context?.line || 1,
					newCode: '// Mock fix suggestion',
					description: 'Mock fix for the issue'
				};

			case 'detect-anomalies':
				return {
					anomalies: [
						{
							variableName: 'mockVar',
							expectedType: 'string',
							actualType: 'number',
							anomalyType: 'type_mismatch',
							severity: 'medium',
							suggestion: 'Check variable type'
						}
					]
				};

			case 'improve-test':
				return {
					name: 'improved_test',
					description: 'Improved version of the test',
					code: 'test("improved test", () => { expect(true).toBe(true); });',
					confidence: 0.9,
					testType: 'unit'
				};

			case 'generate-mock-data':
				return {
					mockData: [
						{ id: 1, name: 'Mock Item 1' },
						{ id: 2, name: 'Mock Item 2' }
					]
				};

			case 'health-check':
				return { status: 'healthy' };

			default:
				return {
					message: `Mock response for unknown task: ${request.task}`,
					success: true
				};
		}
	}
}

// Pre-configured mock instances
export const mockAI = new MockAIService();

// Specific mock configurations
export const createMockAIForTesting = (config?: {
	enableLatency?: boolean;
	baseLatency?: number;
	defaultResponses?: { [task: string]: any };
}): MockAIService => {
	const mock = new MockAIService();
	
	if (config?.enableLatency !== undefined) {
		mock.enableLatencySimulation(config.enableLatency);
	}
	
	if (config?.baseLatency) {
		mock.setLatency(config.baseLatency);
	}
	
	if (config?.defaultResponses) {
		Object.entries(config.defaultResponses).forEach(([task, response]) => {
			mock.setResponse(task, response);
		});
	}
	
	return mock;
};

// Debug-specific mock
export const createDebugMockAI = (): MockAIService => {
	const mock = new MockAIService();
	
	mock.setResponse('suggest-breakpoints', {
		suggestions: [
			{ line: 5, condition: 'x > 0', reason: 'Function entry', confidence: 0.9 },
			{ line: 10, condition: 'result !== null', reason: 'Before return', confidence: 0.8 }
		]
	});
	
	mock.setResponse('analyze-stack', {
		tags: ['performance-issue', 'memory-leak'],
		suggestions: [
			{
				id: 'perf-1',
				description: 'Consider using memoization',
				confidence: 0.8,
				category: 'performance'
			}
		],
		anomalies: [
			{
				variableName: 'largeArray',
				expectedType: 'array',
				actualType: 'large array',
				anomalyType: 'memory_leak',
				severity: 'high',
				suggestion: 'Array size is unusually large'
			}
		],
		fixes: []
	});
	
	return mock;
};

// Test-specific mock
export const createTestMockAI = (): MockAIService => {
	const mock = new MockAIService();
	
	mock.setResponse('generate-tests', {
		tests: [
			{
				name: 'should_handle_valid_input',
				description: 'Test with valid parameters',
				code: 'test("should handle valid input", () => {\n  expect(myFunction("valid")).toBeTruthy();\n});',
				confidence: 0.9,
				testType: 'unit'
			},
			{
				name: 'should_handle_edge_cases',
				description: 'Test with edge case inputs',
				code: 'test("should handle edge cases", () => {\n  expect(myFunction(null)).toBeFalsy();\n  expect(myFunction("")).toBeFalsy();\n});',
				confidence: 0.8,
				testType: 'unit'
			}
		]
	});
	
	mock.setResponse('improve-test', {
		name: 'improved_test_case',
		description: 'Enhanced test with better coverage',
		code: 'test("improved test case", () => {\n  const result = myFunction("test");\n  expect(result).toBeDefined();\n  expect(result.status).toBe("success");\n});',
		confidence: 0.95,
		testType: 'unit'
	});
	
	return mock;
};

// Code generation mock
export const createCodeGenMockAI = (): MockAIService => {
	const mock = new MockAIService();
	
	mock.setResponse('code-generation', {
		code: `import React from 'react';

interface Props {
  title: string;
  onClick: () => void;
}

export const GeneratedComponent: React.FC<Props> = ({ title, onClick }) => {
  return (
    <div className="generated-component">
      <h2>{title}</h2>
      <button onClick={onClick}>Click me</button>
    </div>
  );
};`,
		suggestions: [
			'Add PropTypes for runtime validation',
			'Consider adding accessibility attributes',
			'Add error boundary for robustness'
		],
		confidence: 0.92
	});
	
	return mock;
};

// Export convenience functions for common test scenarios
export const withMockAI = (testFn: (mockAI: MockAIService) => Promise<void> | void) => {
	return async () => {
		const mock = new MockAIService();
		try {
			await testFn(mock);
		} finally {
			mock.reset();
		}
	};
};

export const expectAICall = (mock: MockAIService, task: string, times = 1) => {
	const calls = mock.getCallsForTask(task);
	expect(calls).toHaveLength(times);
	return calls;
};

export const expectAICallWith = (mock: MockAIService, task: string, context: any) => {
	const calls = mock.getCallsForTask(task);
	expect(calls.length).toBeGreaterThan(0);
	expect(calls[calls.length - 1].context).toMatchObject(context);
};
