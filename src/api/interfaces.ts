// API interfaces for VSEmbed AI DevTool

import {
	Edit,
	ExecutionResult,
	FileOperation,
	SearchResult,
	RunnerConfig,
	RunnerStatus,
	BuildResult,
	PreviewConfig,
	AuditLogEntry
} from '../types';

/**
 * Editor API - Exposed to AI Orchestrator
 * Provides programmatic access to the VS Code editor
 */
export interface EditorAPI {
	/**
	 * Apply atomic edits to files
	 */
	applyEdits(edits: Edit[]): Promise<boolean>;

	/**
	 * Create a new file with content
	 */
	createFile(path: string, content: string): Promise<boolean>;

	/**
	 * Delete a file
	 */
	deleteFile(path: string): Promise<boolean>;

	/**
	 * Rename/move a file
	 */
	renameFile(oldPath: string, newPath: string): Promise<boolean>;

	/**
	 * Search for text across files
	 */
	search(query: string, options?: SearchOptions): Promise<SearchResult[]>;

	/**
	 * Get file content
	 */
	getFile(path: string): Promise<string>;

	/**
	 * Get workspace files list
	 */
	getFiles(pattern?: string): Promise<string[]>;

	/**
	 * Open file in editor
	 */
	openFile(path: string, line?: number, column?: number): Promise<void>;

	/**
	 * Get current selection/cursor position
	 */
	getSelection(): Promise<{ file: string; start: any; end: any } | null>;
}

export interface SearchOptions {
	caseSensitive?: boolean;
	regex?: boolean;
	includePattern?: string;
	excludePattern?: string;
	maxResults?: number;
}

/**
 * Terminal API - Safe command execution with policies
 */
export interface TerminalAPI {
	/**
	 * Execute command with explanation and approval workflow
	 */
	exec(
		command: string,
		options: ExecutionOptions
	): Promise<ExecutionResult>;

	/**
	 * Get current working directory
	 */
	getCwd(): Promise<string>;

	/**
	 * Change working directory
	 */
	setCwd(path: string): Promise<boolean>;

	/**
	 * Get environment variables
	 */
	getEnv(): Promise<{ [key: string]: string }>;

	/**
	 * Set environment variable
	 */
	setEnv(key: string, value: string): Promise<boolean>;

	/**
	 * Kill running process
	 */
	kill(pid: number): Promise<boolean>;

	/**
	 * Get running processes
	 */
	getProcesses(): Promise<ProcessInfo[]>;
}

export interface ExecutionOptions {
	explanation: string;
	cwd?: string;
	env?: { [key: string]: string };
	timeout?: number;
	shell?: string;
	requireApproval?: boolean;
	riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export interface ProcessInfo {
	pid: number;
	command: string;
	cpu: number;
	memory: number;
	startTime: string;
}

/**
 * Runner API - Sandboxed execution environment
 */
export interface RunnerAPI {
	/**
	 * Build the project
	 */
	build(config?: RunnerConfig): Promise<BuildResult>;

	/**
	 * Start the application
	 */
	start(config?: RunnerConfig): Promise<RunnerStatus>;

	/**
	 * Stop the application
	 */
	stop(): Promise<boolean>;

	/**
	 * Get current status
	 */
	status(): Promise<RunnerStatus>;

	/**
	 * Expose port for preview
	 */
	exposePort(localPort: number, containerPort: number): Promise<boolean>;

	/**
	 * Get logs from runner
	 */
	getLogs(lines?: number): Promise<string>;

	/**
	 * Restart the runner
	 */
	restart(): Promise<RunnerStatus>;
}

/**
 * Live Preview API - Interactive preview management
 */
export interface PreviewAPI {
	/**
	 * Get preview URL
	 */
	getPreviewUrl(): Promise<string | null>;

	/**
	 * Refresh preview
	 */
	refresh(): Promise<void>;

	/**
	 * Configure preview settings
	 */
	configure(config: PreviewConfig): Promise<void>;

	/**
	 * Send message to preview frame
	 */
	sendMessage(message: any): Promise<void>;

	/**
	 * Enable/disable auto-refresh
	 */
	setAutoRefresh(enabled: boolean): Promise<void>;
}

/**
 * Audit & Confirmation API - Security and approval workflow
 */
export interface AuditAPI {
	/**
	 * Prompt user for approval
	 */
	promptUserForApproval(
		summary: string,
		riskLevel: 'low' | 'medium' | 'high' | 'critical',
		details?: any
	): Promise<boolean>;

	/**
	 * Log an action
	 */
	logAction(
		actionType: string,
		metadata: any,
		riskLevel?: 'low' | 'medium' | 'high' | 'critical'
	): Promise<void>;

	/**
	 * Get audit log entries
	 */
	getAuditLog(
		startDate?: Date,
		endDate?: Date,
		actionType?: string
	): Promise<AuditLogEntry[]>;

	/**
	 * Clear audit log
	 */
	clearAuditLog(): Promise<void>;
}

/**
 * Secrets Manager API - Encrypted secrets handling
 */
export interface SecretsAPI {
	/**
	 * Store encrypted secret
	 */
	setSecret(key: string, value: string): Promise<boolean>;

	/**
	 * Retrieve secret (requires user confirmation for AI access)
	 */
	getSecret(key: string, requester: 'user' | 'ai'): Promise<string | null>;

	/**
	 * Delete secret
	 */
	deleteSecret(key: string): Promise<boolean>;

	/**
	 * List secret keys (not values)
	 */
	listSecrets(): Promise<string[]>;

	/**
	 * Check if secret exists
	 */
	hasSecret(key: string): Promise<boolean>;
}

/**
 * Workspace API - Portable workspace management
 */
export interface WorkspaceAPI {
	/**
	 * Export workspace to archive
	 */
	exportWorkspace(targetPath: string): Promise<boolean>;

	/**
	 * Import workspace from archive
	 */
	importWorkspace(archivePath: string): Promise<boolean>;

	/**
	 * Create new workspace
	 */
	createWorkspace(name: string, template?: string): Promise<boolean>;

	/**
	 * Get workspace metadata
	 */
	getManifest(): Promise<any>;

	/**
	 * Update workspace metadata
	 */
	updateManifest(updates: Partial<any>): Promise<boolean>;

	/**
	 * Validate workspace integrity
	 */
	validateWorkspace(): Promise<{ valid: boolean; errors: string[] }>;
}

/**
 * AI Orchestrator API - Central AI coordination
 */
export interface AIOrchestratorAPI {
	/**
	 * Process user request and return action plan
	 */
	processRequest(
		userInput: string,
		context?: any
	): Promise<{ plan: any; explanation: string }>;

	/**
	 * Execute approved action plan
	 */
	executeActionPlan(planId: string): Promise<boolean>;

	/**
	 * Get available AI models
	 */
	getAvailableModels(): Promise<string[]>;

	/**
	 * Switch AI model
	 */
	setModel(modelName: string): Promise<boolean>;

	/**
	 * Get conversation history
	 */
	getHistory(): Promise<any[]>;

	/**
	 * Clear conversation history
	 */
	clearHistory(): Promise<void>;
}
