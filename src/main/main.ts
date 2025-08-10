import { app, BrowserWindow, ipcMain, Menu, dialog, IpcMainInvokeEvent } from 'electron';
import * as path from 'path';
import { AIOrchestratorService } from '../services/AIOrchestratorService';
import { WorkspaceManager } from '../services/WorkspaceManager';
import { SecretsManager } from '../services/SecretsManager';
import { RunnerManager } from '../services/RunnerManager';
import { SecurityManager } from '../services/SecurityManager';
class VSEmbedApplication {
	private mainWindow: BrowserWindow | null = null;
	private orchestrator = new AIOrchestratorService();
	private workspaceManager = new WorkspaceManager();
	private secretsManager = new SecretsManager();
	private runnerManager = new RunnerManager();
	private securityManager = new SecurityManager();
	private vscodeBridge: any = {};
	private extensionRecommender: any = {};
	private dockerManager: any = {};
	private performanceOptimizer: any = {};
	private aiStream: any = {};
	private permissionMiddleware: any = { 
		checkPermission: async () => ({ allowed: true }), 
		on: () => {}, 
		getPolicies: () => [], 
		updatePolicy: () => {}, 
		getAuditLog: () => [] 
	};


	// Place menu handler methods here, after constructor and before final closing brace
	private async handleNewWorkspace(): Promise<void> {
		this.mainWindow?.webContents.send('menu:new-workspace');
	}

	private async handleOpenWorkspace(): Promise<void> {
		const result = await dialog.showOpenDialog(this.mainWindow!, {
			properties: ['openDirectory'],
			title: 'Select Workspace Directory',
		});

		if (!result.canceled && result.filePaths.length > 0) {
			const workspacePath = result.filePaths[0];
			this.mainWindow?.webContents.send('workspace:open', workspacePath);
		}
	}

	private async handleExportWorkspace(): Promise<void> {
		const result = await dialog.showSaveDialog(this.mainWindow!, {
			title: 'Export Workspace',
			defaultPath: 'workspace.tar.gz',
			filters: [
				{ name: 'Workspace Archive', extensions: ['tar.gz', 'zip'] },
			],
		});

		if (!result.canceled && result.filePath) {
			this.mainWindow?.webContents.send('workspace:export', result.filePath);
		}
	}

	private async handleSettings(): Promise<void> {
		this.mainWindow?.webContents.send('menu:settings');
	}

	// Add missing menu handler stubs
	private handleClearConversation(): void {
		// TODO: Implement clear conversation logic
	}

	private handleChangeModel(): void {
		// TODO: Implement change model logic
	}

	private handleDocumentation(): void {
		// TODO: Implement documentation logic
	}

	private async handleAbout(): Promise<void> {
		if (!this.mainWindow) return;
		dialog.showMessageBox(this.mainWindow, {
			type: 'info',
			title: 'About VSEmbed AI DevTool',
			message: 'VSEmbed AI DevTool',
			detail: 'Portable, embeddable AI-powered development environment\nVersion 0.1.0\nCopyright (c) 2025 Sheewi',
		});
	}

	private async handleAISettings(): Promise<void> {
		this.mainWindow?.webContents.send('ai:settings');
	}

	private async handleStartRunner(): Promise<void> {
		this.mainWindow?.webContents.send('runner:start');
	}

	private async handleStopRunner(): Promise<void> {
		this.mainWindow?.webContents.send('runner:stop');
	}

	private async handleRestartRunner(): Promise<void> {
		this.mainWindow?.webContents.send('runner:restart');
	}

	private async handleViewLogs(): Promise<void> {
		this.mainWindow?.webContents.send('runner:view-logs');
	}

	private async handleManageSecrets(): Promise<void> {
		this.mainWindow?.webContents.send('security:manage-secrets');
	}

	private async handleViewAuditLog(): Promise<void> {
		this.mainWindow?.webContents.send('security:view-audit-log');
	}

	private async handleSecuritySettings(): Promise<void> {
		this.mainWindow?.webContents.send('security:settings');
	}

	private async handlePerformanceReport(): Promise<void> {
		this.mainWindow?.webContents.send('performance:report');
	}

	private async handleDockerStatus(): Promise<void> {
		this.mainWindow?.webContents.send('docker:status');
	}

	private async handlePermissionAudit(): Promise<void> {
		this.mainWindow?.webContents.send('permissions:audit');
	}

	private createMenu(): void {
		const template: Electron.MenuItemConstructorOptions[] = [
			{
				label: 'File',
				submenu: [
					{ label: 'New Workspace', click: () => this.handleNewWorkspace() },
					{ label: 'Open Workspace', click: () => this.handleOpenWorkspace() },
					{ label: 'Export Workspace', click: () => this.handleExportWorkspace() },
					{ type: 'separator' },
					{ label: 'Settings', click: () => this.handleSettings() },
					{ type: 'separator' },
					{ role: 'quit' },
				],
			},
			{
				label: 'Edit',
				submenu: [
					{ role: 'undo' },
					{ role: 'redo' },
					{ type: 'separator' },
					{ role: 'cut' },
					{ role: 'copy' },
					{ role: 'paste' },
				],
			},
			{
				label: 'AI',
				submenu: [
					{ label: 'Clear Conversation', click: () => this.handleClearConversation?.() },
					{ label: 'Change Model', click: () => this.handleChangeModel?.() },
					{ type: 'separator' },
					{ label: 'AI Settings', click: () => this.handleAISettings() },
				],
			},
			{
				label: 'Runner',
				submenu: [
					{ label: 'Start', accelerator: 'F5', click: () => this.handleStartRunner() },
					{ label: 'Stop', accelerator: 'Shift+F5', click: () => this.handleStopRunner() },
					{ label: 'Restart', accelerator: 'Ctrl+F5', click: () => this.handleRestartRunner() },
					{ type: 'separator' },
					{ label: 'View Logs', click: () => this.handleViewLogs() },
				],
			},
			{
				label: 'Security',
				submenu: [
					{ label: 'Manage Secrets', click: () => this.handleManageSecrets() },
					{ label: 'View Audit Log', click: () => this.handleViewAuditLog() },
					{ label: 'Security Settings', click: () => this.handleSecuritySettings() },
				],
			},
			{
				label: 'Help',
				submenu: [
					{ label: 'About', click: () => this.handleAbout() },
					{ label: 'Documentation', click: () => this.handleDocumentation?.() },
				],
			},
		];
		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);
	}

	private setupIpcHandlers(): void {
		// Workspace operations
	ipcMain.handle('workspace:create', async (event: IpcMainInvokeEvent, name: string, template?: string) => {
			return await this.workspaceManager.createWorkspace(name, template);
		});

	ipcMain.handle('workspace:open', async (event: IpcMainInvokeEvent, path: string) => {
			return await this.workspaceManager.openWorkspace(path);
		});

	ipcMain.handle('workspace:export', async (event: IpcMainInvokeEvent, targetPath: string) => {
			return await this.workspaceManager.exportWorkspace(targetPath);
		});

	ipcMain.handle('workspace:import', async (event: IpcMainInvokeEvent, archivePath: string) => {
			return await this.workspaceManager.importWorkspace(archivePath);
		});

		// AI Orchestrator operations
	ipcMain.handle('ai:process-request', async (event: IpcMainInvokeEvent, userInput: string, context?: any) => {
			return await this.orchestrator.processRequest(userInput, context);
		});

	ipcMain.handle('ai:execute-plan', async (event: IpcMainInvokeEvent, planId: string) => {
			return await this.orchestrator.executeActionPlan(planId);
		});

		ipcMain.handle('ai:get-models', async () => {
			return await this.orchestrator.getAvailableModels();
		});

	ipcMain.handle('ai:set-model', async (event: IpcMainInvokeEvent, modelName: string) => {
			return await this.orchestrator.setModel(modelName);
		});

		// Runner operations
	ipcMain.handle('runner:start', async (event: IpcMainInvokeEvent, config?: any) => {
			return await this.runnerManager.start(config);
		});

		ipcMain.handle('runner:stop', async () => {
			return await this.runnerManager.stop();
		});

		ipcMain.handle('runner:status', async () => {
			return await this.runnerManager.status();
		});

	ipcMain.handle('runner:build', async (event: IpcMainInvokeEvent, config?: any) => {
			return await this.runnerManager.build(config);
		});

		// Secrets operations
	ipcMain.handle('secrets:set', async (event: IpcMainInvokeEvent, key: string, value: string) => {
			return await this.secretsManager.setSecret(key, value);
		});

	ipcMain.handle('secrets:get', async (event: IpcMainInvokeEvent, key: string, requester: 'user' | 'ai') => {
			return await this.secretsManager.getSecret(key, requester);
		});

		ipcMain.handle('secrets:list', async () => {
			return await this.secretsManager.listSecrets();
		});

		// Security operations
	ipcMain.handle('security:request-approval', async (event: IpcMainInvokeEvent, summary: string, riskLevel: string, details?: any) => {
		const allowedRiskLevels = ['low', 'medium', 'high', 'critical'] as const;
		type RiskLevel = typeof allowedRiskLevels[number];
		const castedRiskLevel: RiskLevel = allowedRiskLevels.includes(riskLevel as RiskLevel) ? riskLevel as RiskLevel : 'low';
		return await this.securityManager.requestApproval(summary, castedRiskLevel, details);
	});

	ipcMain.handle('security:log-action', async (event: IpcMainInvokeEvent, actionType: string, metadata: any, riskLevel?: string) => {
		const allowedRiskLevels = ['low', 'medium', 'high', 'critical'] as const;
		type RiskLevel = typeof allowedRiskLevels[number];
		const castedRiskLevel: RiskLevel | undefined = riskLevel && allowedRiskLevels.includes(riskLevel as RiskLevel) ? riskLevel as RiskLevel : undefined;
		return await this.securityManager.logAction(actionType, metadata, castedRiskLevel);
	});
	}

	private setupNewComponentHandlers(): void {
		// VS Code Bridge operations
	ipcMain.handle('vscode:execute-command', async (event: IpcMainInvokeEvent, command: string, args?: any[]) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'vscode.commands', { command, args });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.vscodeBridge.executeCommand(command, args);
		});

	ipcMain.handle('vscode:get-file-content', async (event: IpcMainInvokeEvent, filePath: string) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'vscode.files.read', { filePath });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.vscodeBridge.getFileContent(filePath);
		});

	ipcMain.handle('vscode:write-file', async (event: IpcMainInvokeEvent, filePath: string, content: string) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'vscode.files.write', { filePath, content });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.vscodeBridge.writeFile(filePath, content);
		});

	ipcMain.handle('vscode:get-hover-info', async (event: IpcMainInvokeEvent, filePath: string, position: any) => {
			return await this.vscodeBridge.getHoverInfo(filePath, position);
		});

	ipcMain.handle('vscode:get-completions', async (event: IpcMainInvokeEvent, filePath: string, position: any) => {
			return await this.vscodeBridge.getCompletions(filePath, position);
		});

	ipcMain.handle('vscode:get-definitions', async (event: IpcMainInvokeEvent, filePath: string, position: any) => {
			return await this.vscodeBridge.getDefinitions(filePath, position);
		});

	ipcMain.handle('vscode:get-references', async (event: IpcMainInvokeEvent, filePath: string, position: any) => {
			return await this.vscodeBridge.getReferences(filePath, position);
		});

		// Extension operations
	ipcMain.handle('extensions:recommend', async (event: IpcMainInvokeEvent, context: any) => {
			return await this.extensionRecommender.recommendExtensions(context);
		});

	ipcMain.handle('extensions:install', async (event: IpcMainInvokeEvent, extensionId: string) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'extensions.install', { extensionId });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.extensionRecommender.installExtension(extensionId);
		});

	ipcMain.handle('extensions:get-info', async (event: IpcMainInvokeEvent, extensionId: string) => {
			return await this.extensionRecommender.getExtensionInfo(extensionId);
		});

		// Docker sandbox operations
	ipcMain.handle('docker:create-sandbox', async (event: IpcMainInvokeEvent, extensionId: string, config?: any) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'docker.create', { extensionId, config });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.dockerManager.createExtensionSandbox(extensionId, config);
		});

	ipcMain.handle('docker:stop-sandbox', async (event: IpcMainInvokeEvent, containerId: string) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'docker.stop', { containerId });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.dockerManager.stopSandbox(containerId);
		});

	ipcMain.handle('docker:execute-command', async (event: IpcMainInvokeEvent, containerId: string, command: string[]) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'docker.execute', { containerId, command });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.dockerManager.executeSandboxCommand(containerId, command);
		});

	ipcMain.handle('docker:get-logs', async (event: IpcMainInvokeEvent, containerId: string, tail?: number) => {
			return await this.dockerManager.getSandboxLogs(containerId, tail);
		});

		ipcMain.handle('docker:list-sandboxes', async () => {
			return this.dockerManager.listSandboxes();
		});

		ipcMain.handle('docker:get-metrics', async () => {
			return this.dockerManager.getMetrics();
		});

		// Performance operations
		ipcMain.handle('performance:get-metrics', async () => {
			return this.performanceOptimizer.getMetrics();
		});

		ipcMain.handle('performance:generate-report', async () => {
			return this.performanceOptimizer.generateReport();
		});

		ipcMain.handle('performance:get-recommendations', async () => {
			return this.performanceOptimizer.getOptimizationRecommendations();
		});

		ipcMain.handle('performance:force-gc', async () => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'performance.gc');
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return this.performanceOptimizer.forceGarbageCollection();
		});

		// Permission middleware operations
	ipcMain.handle('permissions:check', async (event: IpcMainInvokeEvent, actor: string, resource: string, context?: any) => {
			return await this.permissionMiddleware.checkPermission(actor, resource, context);
		});

		ipcMain.handle('permissions:get-policies', async () => {
			return this.permissionMiddleware.getPolicies();
		});

	ipcMain.handle('permissions:update-policy', async (event: IpcMainInvokeEvent, policyId: string, updates: any) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'permissions.policy.update', { policyId, updates });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return this.permissionMiddleware.updatePolicy(policyId, updates);
		});

	ipcMain.handle('permissions:get-audit-log', async (event: IpcMainInvokeEvent, filters?: any) => {
			return this.permissionMiddleware.getAuditLog(filters);
		});

		// AI Streaming operations
		ipcMain.handle('ai-stream:get-connection-info', async () => {
			return {
				port: 8081,
				url: 'ws://localhost:8081',
				connections: this.aiStream.getActiveConnections(),
				streams: this.aiStream.getActiveStreams()
			};
		});

	// Event forwarding from components
	// (No menu handler methods should be here; move them below)

		// Forward permission events to renderer
		this.permissionMiddleware.on('permissionDenied', (data: any) => {
			this.mainWindow?.webContents.send('permissions:denied', data);
		});

		this.permissionMiddleware.on('auditEvent', (data: any) => {
			this.mainWindow?.webContents.send('permissions:audit-event', data);
		});

		// Forward VS Code bridge events to renderer
		this.vscodeBridge.on('extensionInstalled', (data: any) => {
			this.mainWindow?.webContents.send('vscode:extension-installed', data);
		});

		this.vscodeBridge.on('languageServerReady', (data: any) => {
			this.mainWindow?.webContents.send('vscode:language-server-ready', data);
		});
		this.permissionMiddleware.on('permissionDenied', (data: any) => {
			this.mainWindow?.webContents.send('permissions:denied', data);
		});

		this.permissionMiddleware.on('auditEvent', (data: any) => {
			this.mainWindow?.webContents.send('permissions:audit-event', data);
		});

		// Forward VS Code bridge events to renderer
		this.vscodeBridge.on('extensionInstalled', (data: any) => {
			this.mainWindow?.webContents.send('vscode:extension-installed', data);
		});

		this.vscodeBridge.on('languageServerReady', (data: any) => {
			this.mainWindow?.webContents.send('vscode:language-server-ready', data);
		});
	}
}

// Initialize the application
new VSEmbedApplication();
