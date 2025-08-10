import * as vscode from 'vscode';
import { AIService } from '../ai/ai-service';
import { EventEmitter } from 'events';

export interface Project {
	id: string;
	name: string;
	type: string;
	structure: ProjectStructure;
	constraints: ProjectConstraints;
	dependencies: string[];
	metadata: ProjectMetadata;
}

export interface ProjectStructure {
	files: ProjectFile[];
	directories: string[];
	entryPoints: string[];
	configFiles: string[];
}

export interface ProjectFile {
	path: string;
	content: string;
	language: string;
	purpose: string;
	dependencies: string[];
}

export interface ProjectConstraints {
	framework?: string;
	language: string;
	buildTool?: string;
	packageManager?: string;
	targetPlatform?: string;
	performance?: PerformanceConstraints;
	security?: SecurityConstraints;
}

export interface PerformanceConstraints {
	maxBundleSize?: number;
	maxLoadTime?: number;
	memoryLimit?: number;
	cpuUsageLimit?: number;
}

export interface SecurityConstraints {
	requiresAuthentication?: boolean;
	dataEncryption?: boolean;
	inputValidation?: boolean;
	xssProtection?: boolean;
}

export interface ProjectMetadata {
	version: string;
	description: string;
	author: string;
	license: string;
	tags: string[];
	createdAt: number;
	lastModified: number;
}

export interface UserFeedback {
	id: string;
	type: 'feature-request' | 'bug-report' | 'improvement' | 'refactor' | 'performance';
	description: string;
	priority: 'low' | 'medium' | 'high' | 'critical';
	affectedFiles?: string[];
	expectedBehavior?: string;
	actualBehavior?: string;
	suggestedSolution?: string;
	timestamp: number;
	userId?: string;
}

export interface ProjectUpdate {
	id: string;
	type: 'file-added' | 'file-modified' | 'file-deleted' | 'dependency-added' | 'config-changed';
	files: ProjectFile[];
	dependencies?: string[];
	config?: any;
	reasoning: string;
	confidence: number;
	appliedAt: number;
}

export interface HotModuleUpdate {
	files: Map<string, string>;
	dependencies: string[];
	restartRequired: boolean;
	backupCreated: boolean;
}

export class HotModuleUpdater {
	private static backups = new Map<string, ProjectFile[]>();

	static async apply(update: ProjectUpdate): Promise<HotModuleUpdate> {
		const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
		if (!workspaceRoot) {
			throw new Error('No workspace folder found');
		}

		const result: HotModuleUpdate = {
			files: new Map(),
			dependencies: update.dependencies || [],
			restartRequired: false,
			backupCreated: false
		};

		try {
			// Create backup before applying changes
			await this.createBackup(update.id, update.files);
			result.backupCreated = true;

			// Apply file changes
			for (const file of update.files) {
				const filePath = vscode.Uri.file(workspaceRoot + '/' + file.path);

				// Check if file needs to be created or updated
				try {
					await vscode.workspace.fs.stat(filePath);
					// File exists, update it
					await vscode.workspace.fs.writeFile(filePath, Buffer.from(file.content, 'utf8'));
				} catch {
					// File doesn't exist, create it
					await vscode.workspace.fs.writeFile(filePath, Buffer.from(file.content, 'utf8'));
				}

				result.files.set(file.path, file.content);

				// Check if this change requires restart
				if (this.requiresRestart(file)) {
					result.restartRequired = true;
				}
			}

			// Update dependencies if needed
			if (update.dependencies && update.dependencies.length > 0) {
				await this.updateDependencies(update.dependencies);
				result.restartRequired = true;
			}

			// Trigger hot reload for supported file types
			if (!result.restartRequired) {
				await this.triggerHotReload(Array.from(result.files.keys()));
			}

			return result;

		} catch (error) {
			// Restore from backup if something went wrong
			if (result.backupCreated) {
				await this.restoreBackup(update.id);
			}
			throw error;
		}
	}

	private static async createBackup(updateId: string, files: ProjectFile[]): Promise<void> {
		const backup: ProjectFile[] = [];
		const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

		if (!workspaceRoot) return;

		for (const file of files) {
			try {
				const filePath = vscode.Uri.file(workspaceRoot + '/' + file.path);
				const content = await vscode.workspace.fs.readFile(filePath);
				backup.push({
					...file,
					content: content.toString()
				});
			} catch {
				// File doesn't exist yet, no backup needed
			}
		}

		this.backups.set(updateId, backup);
	}

	private static async restoreBackup(updateId: string): Promise<void> {
		const backup = this.backups.get(updateId);
		if (!backup) return;

		const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
		if (!workspaceRoot) return;

		for (const file of backup) {
			const filePath = vscode.Uri.file(workspaceRoot + '/' + file.path);
			await vscode.workspace.fs.writeFile(filePath, Buffer.from(file.content, 'utf8'));
		}

		this.backups.delete(updateId);
	}

	private static requiresRestart(file: ProjectFile): boolean {
		const restartExtensions = ['.json', '.config.js', '.env', 'package.json', 'tsconfig.json'];
		return restartExtensions.some(ext => file.path.endsWith(ext)) ||
			file.purpose === 'configuration' ||
			file.path.includes('node_modules');
	}

	private static async updateDependencies(dependencies: string[]): Promise<void> {
		const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
		if (!workspaceRoot) return;

		// Check for package.json
		const packageJsonPath = vscode.Uri.file(workspaceRoot + '/package.json');
		try {
			const content = await vscode.workspace.fs.readFile(packageJsonPath);
			const packageJson = JSON.parse(content.toString());

			// Add new dependencies
			packageJson.dependencies = packageJson.dependencies || {};
			dependencies.forEach(dep => {
				const [name, version] = dep.split('@');
				packageJson.dependencies[name] = version || 'latest';
			});

			await vscode.workspace.fs.writeFile(
				packageJsonPath,
				Buffer.from(JSON.stringify(packageJson, null, 2), 'utf8')
			);

			// Trigger npm install
			await vscode.commands.executeCommand('workbench.action.terminal.sendSequence', {
				text: 'npm install\r'
			});

		} catch (error) {
			console.error('Failed to update dependencies:', error);
		}
	}

	private static async triggerHotReload(files: string[]): Promise<void> {
		// Trigger hot reload for supported files
		for (const file of files) {
			const uri = vscode.Uri.file(file);
			await vscode.commands.executeCommand('vscode.open', uri);

			// If it's a TypeScript/JavaScript file, trigger compilation
			if (file.endsWith('.ts') || file.endsWith('.js')) {
				await vscode.commands.executeCommand('typescript.reloadProjects');
			}
		}
	}
}

export class FeedbackLoop extends EventEmitter {
	private aiService: AIService;
	private feedbackHistory = new Map<string, UserFeedback[]>();
	private updateHistory = new Map<string, ProjectUpdate[]>();

	constructor(aiService: AIService) {
		super();
		this.aiService = aiService;
	}

	async collectFeedback(projectId: string, feedback: Omit<UserFeedback, 'id' | 'timestamp'>): Promise<string> {
		const feedbackId = `feedback_${Date.now()}_${Math.random()}`;
		const fullFeedback: UserFeedback = {
			...feedback,
			id: feedbackId,
			timestamp: Date.now()
		};

		// Store feedback
		if (!this.feedbackHistory.has(projectId)) {
			this.feedbackHistory.set(projectId, []);
		}
		this.feedbackHistory.get(projectId)!.push(fullFeedback);

		this.emit('feedback-collected', { projectId, feedback: fullFeedback });
		return feedbackId;
	}

	async refineProject(project: Project, feedback: UserFeedback): Promise<ProjectUpdate> {
		try {
			// Analyze feedback and generate improvements
			const response = await this.aiService.predict({
				task: 'refine-project',
				context: {
					project,
					feedback,
					history: this.getFeedbackHistory(project.id),
					constraints: project.constraints
				},
				model: 'advanced',
				priority: 'high'
			});

			if (!response.success) {
				throw new Error('AI service failed to generate project refinement');
			}

			const update: ProjectUpdate = {
				id: `update_${Date.now()}_${Math.random()}`,
				type: this.determineUpdateType(feedback),
				files: response.data.files || [],
				dependencies: response.data.dependencies,
				config: response.data.config,
				reasoning: response.data.reasoning || 'AI-generated improvement',
				confidence: response.confidence || 0.7,
				appliedAt: Date.now()
			};

			// Store update history
			if (!this.updateHistory.has(project.id)) {
				this.updateHistory.set(project.id, []);
			}
			this.updateHistory.get(project.id)!.push(update);

			this.emit('project-refined', { project, feedback, update });
			return update;

		} catch (error) {
			console.error('Project refinement failed:', error);
			throw new Error(`Failed to refine project: ${error}`);
		}
	}

	async applyUpdate(update: ProjectUpdate): Promise<HotModuleUpdate> {
		try {
			const result = await HotModuleUpdater.apply(update);

			this.emit('update-applied', { update, result });

			if (result.restartRequired) {
				const restart = await vscode.window.showInformationMessage(
					'Changes require a restart to take effect. Restart now?',
					'Restart',
					'Later'
				);

				if (restart === 'Restart') {
					await vscode.commands.executeCommand('workbench.action.reloadWindow');
				}
			}

			return result;

		} catch (error) {
			this.emit('update-failed', { update, error });
			throw error;
		}
	}

	async analyzeProjectHealth(project: Project): Promise<{
		score: number;
		issues: string[];
		improvements: string[];
		performance: any;
	}> {
		try {
			const response = await this.aiService.predict({
				task: 'analyze-project-health',
				context: {
					project,
					feedbackHistory: this.getFeedbackHistory(project.id),
					updateHistory: this.getUpdateHistory(project.id)
				},
				model: 'advanced',
				priority: 'normal'
			});

			return response.data || {
				score: 0.5,
				issues: ['Analysis failed'],
				improvements: ['Manual review required'],
				performance: {}
			};

		} catch (error) {
			console.error('Project health analysis failed:', error);
			return {
				score: 0,
				issues: ['Health analysis unavailable'],
				improvements: ['Manual review required'],
				performance: {}
			};
		}
	}

	async generateImprovementSuggestions(project: Project): Promise<UserFeedback[]> {
		try {
			const response = await this.aiService.predict({
				task: 'generate-improvements',
				context: {
					project,
					constraints: project.constraints,
					history: this.getFeedbackHistory(project.id)
				},
				model: 'advanced',
				priority: 'low'
			});

			const suggestions = response.data?.suggestions || [];

			return suggestions.map((suggestion: any) => ({
				id: `ai_suggestion_${Date.now()}_${Math.random()}`,
				type: 'improvement',
				description: suggestion.description,
				priority: suggestion.priority || 'medium',
				affectedFiles: suggestion.files,
				suggestedSolution: suggestion.solution,
				timestamp: Date.now(),
				userId: 'ai-assistant'
			}));

		} catch (error) {
			console.error('Failed to generate improvement suggestions:', error);
			return [];
		}
	}

	private determineUpdateType(feedback: UserFeedback): ProjectUpdate['type'] {
		switch (feedback.type) {
			case 'feature-request':
				return 'file-added';
			case 'bug-report':
			case 'improvement':
			case 'refactor':
				return 'file-modified';
			case 'performance':
				return 'config-changed';
			default:
				return 'file-modified';
		}
	}

	private getFeedbackHistory(projectId: string): UserFeedback[] {
		return this.feedbackHistory.get(projectId) || [];
	}

	private getUpdateHistory(projectId: string): ProjectUpdate[] {
		return this.updateHistory.get(projectId) || [];
	}

	// Analytics and reporting
	getFeedbackMetrics(projectId: string): {
		totalFeedback: number;
		byType: Record<string, number>;
		byPriority: Record<string, number>;
		avgResolutionTime: number;
	} {
		const feedback = this.getFeedbackHistory(projectId);
		const updates = this.getUpdateHistory(projectId);

		const byType: Record<string, number> = {};
		const byPriority: Record<string, number> = {};

		feedback.forEach(f => {
			byType[f.type] = (byType[f.type] || 0) + 1;
			byPriority[f.priority] = (byPriority[f.priority] || 0) + 1;
		});

		// Calculate average resolution time
		let totalResolutionTime = 0;
		let resolvedCount = 0;

		feedback.forEach(f => {
			const relatedUpdate = updates.find(u =>
				u.appliedAt > f.timestamp &&
				u.files.some(file => f.affectedFiles?.includes(file.path))
			);

			if (relatedUpdate) {
				totalResolutionTime += relatedUpdate.appliedAt - f.timestamp;
				resolvedCount++;
			}
		});

		return {
			totalFeedback: feedback.length,
			byType,
			byPriority,
			avgResolutionTime: resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0
		};
	}

	exportFeedbackReport(projectId: string): string {
		const feedback = this.getFeedbackHistory(projectId);
		const updates = this.getUpdateHistory(projectId);
		const metrics = this.getFeedbackMetrics(projectId);

		const report = {
			projectId,
			generated: new Date().toISOString(),
			metrics,
			feedback,
			updates,
			summary: {
				totalImprovements: updates.length,
				avgConfidence: updates.reduce((sum, u) => sum + u.confidence, 0) / updates.length,
				lastUpdate: updates.length > 0 ? new Date(updates[updates.length - 1].appliedAt).toISOString() : null
			}
		};

		return JSON.stringify(report, null, 2);
	}
}

export default FeedbackLoop;
