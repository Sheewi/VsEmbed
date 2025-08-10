import { AIService, AIRequest } from './ai-service';
import { debounce } from 'lodash';

export interface CodeGenerationRequest {
	prompt: string;
	language: string;
	context?: string;
	priority?: 'low' | 'normal' | 'high';
	timeout?: number;
}

export interface CodeGenerationResult {
	code: string;
	confidence: number;
	model: string;
	latency: number;
	suggestions?: string[];
}

export class DebouncedCodeGenerator {
	private aiService: AIService;
	private pendingRequests = new Map<string, CodeGenerationRequest>();
	private activeGenerations = new Map<string, Promise<CodeGenerationResult>>();

	// Debounced generation function with leading and trailing execution
	private debouncedGenerate = debounce(
		async (requestId: string, request: CodeGenerationRequest) => {
			return this.executeGeneration(requestId, request);
		},
		300,
		{ 
			leading: true,  // Execute immediately for first call
			trailing: true  // Execute after wait period for final call
		}
	);

	constructor(aiService: AIService) {
		this.aiService = aiService;
	}

	async generate(request: CodeGenerationRequest): Promise<CodeGenerationResult> {
		const requestId = this.createRequestId(request);

		// Store the request
		this.pendingRequests.set(requestId, request);

		// Check if generation is already in progress for this request
		if (this.activeGenerations.has(requestId)) {
			return this.activeGenerations.get(requestId)!;
		}

		// Create and store the generation promise
		const generationPromise = new Promise<CodeGenerationResult>((resolve, reject) => {
			this.debouncedGenerate(requestId, request)
				.then(resolve)
				.catch(reject)
				.finally(() => {
					this.activeGenerations.delete(requestId);
					this.pendingRequests.delete(requestId);
				});
		});

		this.activeGenerations.set(requestId, generationPromise);
		return generationPromise;
	}

	private async executeGeneration(requestId: string, request: CodeGenerationRequest): Promise<CodeGenerationResult> {
		const startTime = Date.now();

		try {
			// Get the latest request (in case it was updated during debounce)
			const latestRequest = this.pendingRequests.get(requestId) || request;

			const aiRequest: AIRequest = {
				task: 'code-generation',
				context: {
					prompt: latestRequest.prompt,
					language: latestRequest.language,
					context: latestRequest.context
				},
				model: 'auto',
				priority: latestRequest.priority || 'normal',
				timeout: latestRequest.timeout
			};

			const response = await this.aiService.predict(aiRequest);
			const latency = Date.now() - startTime;

			if (response.success) {
				return {
					code: response.data.code || response.data.text || '',
					confidence: response.confidence || 0.8,
					model: response.model,
					latency,
					suggestions: response.data.suggestions || []
				};
			} else {
				// Fallback generation
				return this.generateFallbackCode(latestRequest, latency);
			}

		} catch (error) {
			const latency = Date.now() - startTime;
			console.error('Code generation failed:', error);
			return this.generateFallbackCode(request, latency);
		}
	}

	private generateFallbackCode(request: CodeGenerationRequest, latency: number): CodeGenerationResult {
		let fallbackCode = '';

		switch (request.language.toLowerCase()) {
			case 'javascript':
			case 'typescript':
				fallbackCode = `// ${request.prompt}\nfunction generatedFunction() {\n  // TODO: Implement functionality\n  return null;\n}`;
				break;
			case 'python':
				fallbackCode = `# ${request.prompt}\ndef generated_function():\n    # TODO: Implement functionality\n    pass`;
				break;
			case 'java':
				fallbackCode = `// ${request.prompt}\npublic class GeneratedClass {\n    // TODO: Implement functionality\n}`;
				break;
			case 'csharp':
				fallbackCode = `// ${request.prompt}\npublic class GeneratedClass\n{\n    // TODO: Implement functionality\n}`;
				break;
			default:
				fallbackCode = `// ${request.prompt}\n// TODO: Implement in ${request.language}`;
		}

		return {
			code: fallbackCode,
			confidence: 0.3,
			model: 'fallback',
			latency,
			suggestions: ['Review and implement the generated code template']
		};
	}

	private createRequestId(request: CodeGenerationRequest): string {
		// Create a unique ID based on request content
		const content = `${request.prompt}_${request.language}_${request.context || ''}`;
		return Buffer.from(content).toString('base64').substring(0, 16);
	}

	// Cancel pending generations
	cancelPending(): void {
		this.debouncedGenerate.cancel();
		this.pendingRequests.clear();
		console.log('Cancelled pending code generations');
	}

	// Get statistics
	getStats(): {
		pendingRequests: number;
		activeGenerations: number;
		requestIds: string[];
	} {
		return {
			pendingRequests: this.pendingRequests.size,
			activeGenerations: this.activeGenerations.size,
			requestIds: Array.from(this.pendingRequests.keys())
		};
	}

	// Flush pending requests immediately
	async flush(): Promise<void> {
		this.debouncedGenerate.flush();
		
		// Wait for all active generations to complete
		const activePromises = Array.from(this.activeGenerations.values());
		await Promise.allSettled(activePromises);
	}
}

// Export a debounced wrapper for the AI service
export function createDebouncedGenerator(aiService: AIService): DebouncedCodeGenerator {
	return new DebouncedCodeGenerator(aiService);
}
