import { ActionPlan, PlannedAction, AuditLogEntry } from '../types';
import { EditorService } from './EditorService';
import { TerminalService } from './TerminalService';
import { RunnerManager } from './RunnerManager';
import { SecurityManager } from './SecurityManager';
import { v4 as uuidv4 } from 'uuid';

interface AIModel {
	name: string;
	provider: 'openai' | 'anthropic' | 'local' | 'azure';
	endpoint?: string;
	apiKey?: string;
	model: string;
}

export class AIOrchestratorService {
	private currentModel: AIModel | null = null;
	private conversationHistory: any[] = [];
	private activePlans = new Map<string, ActionPlan>();

	private editorService: EditorService;
	private terminalService: TerminalService;
	private runnerManager: RunnerManager;
	private securityManager: SecurityManager;

	constructor() {
		this.editorService = new EditorService();
		this.terminalService = new TerminalService();
		this.runnerManager = new RunnerManager();
		this.securityManager = new SecurityManager();

		// Set default model
		this.currentModel = {
			name: 'GPT-4',
			provider: 'openai',
			model: 'gpt-4',
		};
	}

	async processRequest(userInput: string, context?: any): Promise<{ plan: ActionPlan; explanation: string }> {
		try {
			// Add user input to conversation history
			this.conversationHistory.push({
				role: 'user',
				content: userInput,
				timestamp: new Date().toISOString(),
				context,
			});

			// Analyze the request and create action plan
			const plan = await this.createActionPlan(userInput, context);

			// Add AI response to conversation history
			this.conversationHistory.push({
				role: 'assistant',
				content: plan.summary,
				timestamp: new Date().toISOString(),
				plan_id: plan.id,
			});

			// Store the plan
			this.activePlans.set(plan.id, plan);

			// Log the action
			await this.securityManager.logAction('ai_request_processed', {
				user_input: userInput,
				plan_id: plan.id,
				risk_level: plan.risk_assessment,
			});

			return {
				plan,
				explanation: this.generateExplanation(plan),
			};
		} catch (error) {
			console.error('Failed to process AI request:', error);
			throw new Error(`Failed to process request: ${error}`);
		}
	}

	async executeActionPlan(planId: string): Promise<boolean> {
		const plan = this.activePlans.get(planId);
		if (!plan) {
			throw new Error(`Plan ${planId} not found`);
		}

		try {
			// Check if plan requires approval and has been approved
			if (plan.requires_approval && !plan.actions.every(action => action.approved)) {
				throw new Error('Plan requires approval for all actions');
			}

			// Execute actions in sequence
			for (const action of plan.actions) {
				if (!action.approved) {
					console.log(`Skipping unapproved action: ${action.description}`);
					continue;
				}

				await this.executeAction(action);
				action.executed = true;

				// Log each action execution
				await this.securityManager.logAction('action_executed', {
					plan_id: planId,
					action_id: action.id,
					action_type: action.type,
					description: action.description,
				}, action.risk_level);
			}

			// Mark plan as completed
			plan.actions.forEach(action => {
				if (action.approved) action.executed = true;
			});

			return true;
		} catch (error) {
			console.error(`Failed to execute action plan ${planId}:`, error);

			// Log failure
			await this.securityManager.logAction('plan_execution_failed', {
				plan_id: planId,
				error: error.toString(),
			}, 'high');

			return false;
		}
	}

	async getAvailableModels(): Promise<string[]> {
		// Return list of available AI models
		return [
			'GPT-4',
			'GPT-3.5-turbo',
			'Claude-3-Opus',
			'Claude-3-Sonnet',
			'Local-Llama-3.1',
			'Azure-GPT-4',
		];
	}

	async setModel(modelName: string): Promise<boolean> {
		try {
			// Model configuration would be loaded from settings
			const modelConfig = this.getModelConfig(modelName);
			this.currentModel = modelConfig;

			await this.securityManager.logAction('model_changed', {
				old_model: this.currentModel?.name,
				new_model: modelName,
			});

			return true;
		} catch (error) {
			console.error('Failed to set model:', error);
			return false;
		}
	}

	getHistory(): any[] {
		return this.conversationHistory;
	}

	async clearHistory(): Promise<void> {
		this.conversationHistory = [];
		this.activePlans.clear();

		await this.securityManager.logAction('conversation_cleared', {
			timestamp: new Date().toISOString(),
		});
	}

	private async createActionPlan(userInput: string, context?: any): Promise<ActionPlan> {
		const planId = uuidv4();

		// Analyze the user input to determine what actions are needed
		const actions = await this.analyzeUserRequest(userInput, context);

		// Assess overall risk level
		const riskLevel = this.assessPlanRisk(actions);

		// Determine if approval is required
		const requiresApproval = riskLevel !== 'low' || actions.some(action =>
			action.type === 'command' || action.type === 'file_delete'
		);

		const plan: ActionPlan = {
			id: planId,
			summary: this.generatePlanSummary(userInput, actions),
			actions,
			risk_assessment: riskLevel,
			requires_approval: requiresApproval,
			estimated_time: this.estimateExecutionTime(actions),
		};

		return plan;
	}

	private async analyzeUserRequest(userInput: string, context?: any): Promise<PlannedAction[]> {
		const actions: PlannedAction[] = [];

		// Simple keyword-based analysis (in a real implementation, this would use the AI model)
		const lowerInput = userInput.toLowerCase();

		// File operations
		if (lowerInput.includes('create') && (lowerInput.includes('file') || lowerInput.includes('component'))) {
			actions.push({
				id: uuidv4(),
				type: 'file_create',
				description: 'Create new file based on user request',
				preview: 'Will create a new file with appropriate content',
				risk_level: 'low',
				approved: false,
				executed: false,
				metadata: { userInput, context },
			});
		}

		// Code editing
		if (lowerInput.includes('modify') || lowerInput.includes('update') || lowerInput.includes('change')) {
			actions.push({
				id: uuidv4(),
				type: 'edit',
				description: 'Modify existing code based on user request',
				preview: 'Will apply code changes to existing files',
				risk_level: 'low',
				approved: false,
				executed: false,
				metadata: { userInput, context },
			});
		}

		// Command execution
		if (lowerInput.includes('run') || lowerInput.includes('install') || lowerInput.includes('build')) {
			const riskLevel = this.assessCommandRisk(userInput);
			actions.push({
				id: uuidv4(),
				type: 'command',
				description: `Execute command: ${this.extractCommand(userInput)}`,
				preview: `Will run: ${this.extractCommand(userInput)}`,
				risk_level: riskLevel,
				approved: false,
				executed: false,
				metadata: { command: this.extractCommand(userInput), userInput },
			});
		}

		// Default action if no specific actions detected
		if (actions.length === 0) {
			actions.push({
				id: uuidv4(),
				type: 'edit',
				description: 'Analyze request and provide code assistance',
				preview: 'Will analyze the request and provide appropriate assistance',
				risk_level: 'low',
				approved: false,
				executed: false,
				metadata: { userInput, context },
			});
		}

		return actions;
	}

	private async executeAction(action: PlannedAction): Promise<void> {
		switch (action.type) {
			case 'edit':
				await this.executeEditAction(action);
				break;
			case 'command':
				await this.executeCommandAction(action);
				break;
			case 'file_create':
				await this.executeFileCreateAction(action);
				break;
			case 'file_delete':
				await this.executeFileDeleteAction(action);
				break;
			case 'file_rename':
				await this.executeFileRenameAction(action);
				break;
			default:
				throw new Error(`Unknown action type: ${action.type}`);
		}
	}

	private async executeEditAction(action: PlannedAction): Promise<void> {
		// This would use the AI model to generate appropriate edits
		// For now, just log the action
		console.log('Executing edit action:', action.description);

		// In a real implementation, this would:
		// 1. Use the AI model to generate edits
		// 2. Apply edits via editorService.applyEdits()
	}

	private async executeCommandAction(action: PlannedAction): Promise<void> {
		const command = action.metadata.command;
		const result = await this.terminalService.exec(command, {
			explanation: action.description,
			requireApproval: action.risk_level !== 'low',
			riskLevel: action.risk_level,
		});

		console.log('Command executed:', command, 'Result:', result);
	}

	private async executeFileCreateAction(action: PlannedAction): Promise<void> {
		// This would use the AI model to generate file content
		// For now, create a placeholder file
		const fileName = this.extractFileName(action.metadata.userInput) || 'new-file.txt';
		const content = await this.generateFileContent(action.metadata.userInput);

		await this.editorService.createFile(fileName, content);
	}

	private async executeFileDeleteAction(action: PlannedAction): Promise<void> {
		const fileName = action.metadata.fileName;
		await this.editorService.deleteFile(fileName);
	}

	private async executeFileRenameAction(action: PlannedAction): Promise<void> {
		const { oldPath, newPath } = action.metadata;
		await this.editorService.renameFile(oldPath, newPath);
	}

	private generatePlanSummary(userInput: string, actions: PlannedAction[]): string {
		const actionTypes = actions.map(a => a.type).join(', ');
		return `Plan to address: "${userInput}". Actions: ${actionTypes}`;
	}

	private generateExplanation(plan: ActionPlan): string {
		let explanation = `I've created a plan with ${plan.actions.length} action(s):\n\n`;

		plan.actions.forEach((action, index) => {
			explanation += `${index + 1}. ${action.description} (Risk: ${action.risk_level})\n`;
		});

		explanation += `\nOverall risk assessment: ${plan.risk_assessment}`;

		if (plan.requires_approval) {
			explanation += '\n\nThis plan requires your approval before execution.';
		}

		return explanation;
	}

	private assessPlanRisk(actions: PlannedAction[]): 'low' | 'medium' | 'high' | 'critical' {
		const riskLevels = actions.map(a => a.risk_level);

		if (riskLevels.includes('critical')) return 'critical';
		if (riskLevels.includes('high')) return 'high';
		if (riskLevels.includes('medium')) return 'medium';
		return 'low';
	}

	private assessCommandRisk(input: string): 'low' | 'medium' | 'high' | 'critical' {
		const dangerous = ['rm -rf', 'sudo', 'chmod 777', 'format', 'del /f'];
		const install = ['npm install', 'pip install', 'yarn add'];

		if (dangerous.some(cmd => input.toLowerCase().includes(cmd.toLowerCase()))) {
			return 'critical';
		}

		if (install.some(cmd => input.toLowerCase().includes(cmd.toLowerCase()))) {
			return 'medium';
		}

		return 'low';
	}

	private extractCommand(input: string): string {
		// Simple command extraction
		const commands = ['npm install', 'npm start', 'npm run', 'python', 'node', 'yarn', 'pip install'];

		for (const cmd of commands) {
			if (input.toLowerCase().includes(cmd)) {
				return cmd;
			}
		}

		return 'command';
	}

	private extractFileName(input: string): string | null {
		// Simple filename extraction
		const match = input.match(/(?:create|file|component)\s+([a-zA-Z0-9_.-]+)/i);
		return match ? match[1] : null;
	}

	private async generateFileContent(userInput: string): Promise<string> {
		// This would use the AI model to generate appropriate content
		// For now, return a simple placeholder
		return `// Generated by VSEmbed AI DevTool
// User request: ${userInput}

// Your code here
console.log('Hello from VSEmbed AI DevTool!');
`;
	}

	private estimateExecutionTime(actions: PlannedAction[]): number {
		// Estimate execution time in seconds
		let totalTime = 0;

		actions.forEach(action => {
			switch (action.type) {
				case 'edit':
					totalTime += 2;
					break;
				case 'file_create':
					totalTime += 1;
					break;
				case 'command':
					totalTime += 10; // Commands can take longer
					break;
				default:
					totalTime += 3;
			}
		});

		return totalTime;
	}

	private getModelConfig(modelName: string): AIModel {
		// This would load from configuration
		const configs: { [key: string]: AIModel } = {
			'GPT-4': {
				name: 'GPT-4',
				provider: 'openai',
				model: 'gpt-4',
			},
			'GPT-3.5-turbo': {
				name: 'GPT-3.5-turbo',
				provider: 'openai',
				model: 'gpt-3.5-turbo',
			},
			'Claude-3-Opus': {
				name: 'Claude-3-Opus',
				provider: 'anthropic',
				model: 'claude-3-opus-20240229',
			},
			'Local-Llama-3.1': {
				name: 'Local-Llama-3.1',
				provider: 'local',
				model: 'llama-3.1-8b',
				endpoint: 'http://localhost:11434',
			},
		};

		return configs[modelName] || configs['GPT-4'];
	}
}
