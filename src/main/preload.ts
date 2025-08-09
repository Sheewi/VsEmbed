import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
	// Workspace operations
	workspace: {
		create: (name: string, template?: string) =>
			ipcRenderer.invoke('workspace:create', name, template),
		open: (path: string) =>
			ipcRenderer.invoke('workspace:open', path),
		export: (targetPath: string) =>
			ipcRenderer.invoke('workspace:export', targetPath),
		import: (archivePath: string) =>
			ipcRenderer.invoke('workspace:import', archivePath),
	},

	// AI Orchestrator operations
	ai: {
		processRequest: (userInput: string, context?: any) =>
			ipcRenderer.invoke('ai:process-request', userInput, context),
		executePlan: (planId: string) =>
			ipcRenderer.invoke('ai:execute-plan', planId),
		getModels: () =>
			ipcRenderer.invoke('ai:get-models'),
		setModel: (modelName: string) =>
			ipcRenderer.invoke('ai:set-model', modelName),
	},

	// Runner operations
	runner: {
		start: (config?: any) =>
			ipcRenderer.invoke('runner:start', config),
		stop: () =>
			ipcRenderer.invoke('runner:stop'),
		status: () =>
			ipcRenderer.invoke('runner:status'),
		build: (config?: any) =>
			ipcRenderer.invoke('runner:build', config),
	},

	// Secrets operations
	secrets: {
		set: (key: string, value: string) =>
			ipcRenderer.invoke('secrets:set', key, value),
		get: (key: string, requester: 'user' | 'ai') =>
			ipcRenderer.invoke('secrets:get', key, requester),
		list: () =>
			ipcRenderer.invoke('secrets:list'),
	},

	// Security operations
	security: {
		requestApproval: (summary: string, riskLevel: string, details?: any) =>
			ipcRenderer.invoke('security:request-approval', summary, riskLevel, details),
		logAction: (actionType: string, metadata: any, riskLevel?: string) =>
			ipcRenderer.invoke('security:log-action', actionType, metadata, riskLevel),
	},

	// Event listeners for menu actions
	onMenuAction: (callback: (action: string, data?: any) => void) => {
		const validChannels = [
			'menu:new-workspace',
			'menu:settings',
			'workspace:open',
			'workspace:export',
			'ai:clear-conversation',
			'ai:change-model',
			'ai:settings',
			'runner:start',
			'runner:stop',
			'runner:restart',
			'runner:view-logs',
			'security:manage-secrets',
			'security:view-audit-log',
			'security:settings'
		];

		validChannels.forEach(channel => {
			ipcRenderer.on(channel, (event, ...args) => {
				callback(channel, ...args);
			});
		});
	},

	// Remove all listeners
	removeAllListeners: () => {
		ipcRenderer.removeAllListeners('menu:new-workspace');
		ipcRenderer.removeAllListeners('menu:settings');
		ipcRenderer.removeAllListeners('workspace:open');
		ipcRenderer.removeAllListeners('workspace:export');
		ipcRenderer.removeAllListeners('ai:clear-conversation');
		ipcRenderer.removeAllListeners('ai:change-model');
		ipcRenderer.removeAllListeners('ai:settings');
		ipcRenderer.removeAllListeners('runner:start');
		ipcRenderer.removeAllListeners('runner:stop');
		ipcRenderer.removeAllListeners('runner:restart');
		ipcRenderer.removeAllListeners('runner:view-logs');
		ipcRenderer.removeAllListeners('security:manage-secrets');
		ipcRenderer.removeAllListeners('security:view-audit-log');
		ipcRenderer.removeAllListeners('security:settings');
	},

	// Platform information
	platform: process.platform,

	// Version information
	versions: {
		node: process.versions.node,
		chrome: process.versions.chrome,
		electron: process.versions.electron,
	},
});

// Type definitions for the exposed API
declare global {
	interface Window {
		electronAPI: {
			workspace: {
				create: (name: string, template?: string) => Promise<boolean>;
				open: (path: string) => Promise<boolean>;
				export: (targetPath: string) => Promise<boolean>;
				import: (archivePath: string) => Promise<boolean>;
			};
			ai: {
				processRequest: (userInput: string, context?: any) => Promise<any>;
				executePlan: (planId: string) => Promise<boolean>;
				getModels: () => Promise<string[]>;
				setModel: (modelName: string) => Promise<boolean>;
			};
			runner: {
				start: (config?: any) => Promise<any>;
				stop: () => Promise<boolean>;
				status: () => Promise<any>;
				build: (config?: any) => Promise<any>;
			};
			secrets: {
				set: (key: string, value: string) => Promise<boolean>;
				get: (key: string, requester: 'user' | 'ai') => Promise<string | null>;
				list: () => Promise<string[]>;
			};
			security: {
				requestApproval: (summary: string, riskLevel: string, details?: any) => Promise<boolean>;
				logAction: (actionType: string, metadata: any, riskLevel?: string) => Promise<void>;
			};
			onMenuAction: (callback: (action: string, data?: any) => void) => void;
			removeAllListeners: () => void;
			platform: string;
			versions: {
				node: string;
				chrome: string;
				electron: string;
			};
		};
	}
}
