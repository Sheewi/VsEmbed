// Core data models for the VSEmbed AI DevTool

export interface WorkspaceManifest {
	workspace_id: string;
	name: string;
	created_at: string;
	updated_at: string;
	runtime: 'nodejs' | 'python' | 'docker' | 'custom';
	runner: 'docker' | 'sandbox' | 'local';
	extensions: string[];
	ai_policy: AiPolicy;
	secrets: SecretsConfig;
	version: string;
}

export interface AiPolicy {
	auto_apply_edits: boolean;
	allow_terminal_commands: boolean;
	require_approval_for_installs: boolean;
	require_approval_for_destructive: boolean;
	allow_network_access: boolean;
	allowed_domains: string[];
	max_command_timeout: number;
}

export interface SecretsConfig {
	encrypted: boolean;
	file: string;
	provider: 'local' | 'keyring';
}

export interface Edit {
	file: string;
	start: { line: number; character: number };
	end: { line: number; character: number };
	replacement: string;
	type: 'insert' | 'replace' | 'delete';
}

export interface ExecutionResult {
	stdout: string;
	stderr: string;
	code: number;
	time: number;
	command: string;
}

export interface RunnerConfig {
	type: 'docker' | 'sandbox' | 'local';
	image?: string;
	ports: { [localPort: number]: number };
	environment: { [key: string]: string };
	working_directory: string;
	resource_limits: {
		cpu: string;
		memory: string;
		disk: string;
	};
	network_policy: {
		enabled: boolean;
		allowed_hosts: string[];
	};
}

export interface PreviewConfig {
	url: string;
	ports: number[];
	refresh_on_change: boolean;
	auto_reload: boolean;
}

export interface AuditLogEntry {
	id: string;
	timestamp: string;
	action_type: 'edit' | 'command' | 'file_operation' | 'approval' | 'rejection';
	user_initiated: boolean;
	ai_initiated: boolean;
	summary: string;
	metadata: any;
	risk_level: 'low' | 'medium' | 'high' | 'critical';
	approved: boolean;
	executed: boolean;
}

export interface ActionPlan {
	id: string;
	summary: string;
	actions: PlannedAction[];
	risk_assessment: 'low' | 'medium' | 'high' | 'critical';
	requires_approval: boolean;
	estimated_time: number;
}

export interface PlannedAction {
	id: string;
	type: 'edit' | 'command' | 'file_create' | 'file_delete' | 'file_rename';
	description: string;
	preview: string;
	risk_level: 'low' | 'medium' | 'high' | 'critical';
	approved: boolean;
	executed: boolean;
	metadata: any;
}

export interface FileOperation {
	type: 'create' | 'delete' | 'rename' | 'read';
	path: string;
	content?: string;
	new_path?: string;
}

export interface SearchResult {
	file: string;
	line: number;
	column: number;
	match: string;
	context: string;
}

export interface BuildResult {
	success: boolean;
	output: string;
	errors: string[];
	warnings: string[];
	artifacts: string[];
}

export interface RunnerStatus {
	running: boolean;
	pid?: number;
	ports: { [localPort: number]: number };
	preview_url?: string;
	resource_usage: {
		cpu_percent: number;
		memory_mb: number;
		disk_mb: number;
	};
	last_build: BuildResult;
}

export interface UserPreferences {
	theme: 'light' | 'dark' | 'auto';
	editor_settings: any;
	ai_settings: {
		model: string;
		provider: 'openai' | 'anthropic' | 'local' | 'azure';
		temperature: number;
		max_tokens: number;
	};
	security_settings: {
		default_approval_required: boolean;
		auto_save: boolean;
		backup_frequency: number;
	};
}
