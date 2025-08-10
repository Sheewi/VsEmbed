import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron';
import * as path from 'path';
import { AIOrchestratorService } from './services/AIOrchestratorService';
import { WorkspaceManager } from './services/WorkspaceManager';
import { SecretsManager } from './services/SecretsManager';
import { RunnerManager } from './services/RunnerManager';
import { SecurityManager } from './services/SecurityManager';
import { VSCodeBridge } from '../electron/vscode';
import { PermissionMiddleware } from '../permissions/middleware';
import { AIStream } from '../ai/streaming';
import { PerformanceOptimizer, defaultOptimizationConfig } from '../performance/optimizer';
import { DockerManager } from '../docker/sandbox';
import { ExtensionRecommender } from '../extensions/recommender';

class VSEmbedApplication {
	private mainWindow: BrowserWindow | null = null;
	private orchestrator: AIOrchestratorService;
	private workspaceManager: WorkspaceManager;
	private secretsManager: SecretsManager;
	private runnerManager: RunnerManager;
	private securityManager: SecurityManager;
	private vscodeBridge: VSCodeBridge;
	private permissionMiddleware: PermissionMiddleware;
	private aiStream: AIStream;
	private performanceOptimizer: PerformanceOptimizer;
	private dockerManager: DockerManager;
	private extensionRecommender: ExtensionRecommender;

	constructor() {
		this.orchestrator = new AIOrchestratorService();
		this.workspaceManager = new WorkspaceManager();
		this.secretsManager = new SecretsManager();
		this.runnerManager = new RunnerManager();
		this.securityManager = new SecurityManager();

		// Initialize new components
		this.extensionRecommender = new ExtensionRecommender();
		this.vscodeBridge = new VSCodeBridge();
		this.permissionMiddleware = new PermissionMiddleware();
		this.aiStream = new AIStream(8081); // WebSocket port for AI streaming
		this.performanceOptimizer = new PerformanceOptimizer(defaultOptimizationConfig);
		this.dockerManager = new DockerManager(this.extensionRecommender);

		this.setupAppHandlers();
		this.setupIpcHandlers();
		this.setupNewComponentHandlers();
		this.setupShutdownHandlers();
	}

	private setupAppHandlers(): void {
		app.whenReady().then(() => {
			this.createMainWindow();
			this.createMenu();
		});

		app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') {
				app.quit();
			}
		});

		app.on('activate', () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				this.createMainWindow();
			}
		});

		// Security: Prevent new window creation
		app.on('web-contents-created', (event, contents) => {
			contents.on('new-window', (event, navigationUrl) => {
				event.preventDefault();
				// Only allow navigation to localhost for preview
				if (!navigationUrl.startsWith('http://localhost:')) {
					console.warn('Blocked navigation to:', navigationUrl);
				}
			});
		});
	}

	private createMainWindow(): void {
		this.mainWindow = new BrowserWindow({
			width: 1400,
			height: 900,
			minWidth: 800,
			minHeight: 600,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				enableRemoteModule: false,
				preload: path.join(__dirname, 'preload.js'),
				webSecurity: true,
				allowRunningInsecureContent: false,
			},
			titleBarStyle: 'default',
			show: false,
		});

		// Load the React application
		if (process.env.NODE_ENV === 'development') {
			this.mainWindow.loadURL('http://localhost:3000');
			this.mainWindow.webContents.openDevTools();
		} else {
			this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
		}

		this.mainWindow.once('ready-to-show', () => {
			this.mainWindow?.show();
		});

		this.mainWindow.on('closed', () => {
			this.mainWindow = null;
		});
	}

	private createMenu(): void {
		const template: any[] = [
			{
				label: 'File',
				submenu: [
					{
						label: 'New Workspace',
						accelerator: 'CmdOrCtrl+N',
						click: () => this.handleNewWorkspace(),
					},
					{
						label: 'Open Workspace',
						accelerator: 'CmdOrCtrl+O',
						click: () => this.handleOpenWorkspace(),
					},
					{
						label: 'Export Workspace',
						accelerator: 'CmdOrCtrl+E',
						click: () => this.handleExportWorkspace(),
					},
					{ type: 'separator' },
					{
						label: 'Settings',
						accelerator: 'CmdOrCtrl+,',
						click: () => this.handleSettings(),
					},
					{ type: 'separator' },
					{
						label: 'Quit',
						accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
						click: () => app.quit(),
					},
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
					{
						label: 'Clear Conversation',
						click: () => this.handleClearConversation(),
					},
					{
						label: 'Change Model',
						click: () => this.handleChangeModel(),
					},
					{ type: 'separator' },
					{
						label: 'AI Settings',
						click: () => this.handleAISettings(),
					},
				],
			},
			{
				label: 'Developer',
				submenu: [
					{
						label: 'Performance Report',
						click: () => this.handlePerformanceReport(),
					},
					{
						label: 'Docker Status',
						click: () => this.handleDockerStatus(),
					},
					{
						label: 'Permission Audit',
						click: () => this.handlePermissionAudit(),
					},
					{ type: 'separator' },
					{
						label: 'Force Cleanup',
						click: () => this.handleForceCleanup(),
					},
				],
			},
			{
				label: 'Runner',
				submenu: [
					{
						label: 'Start',
						accelerator: 'F5',
						click: () => this.handleStartRunner(),
					},
					{
						label: 'Stop',
						accelerator: 'Shift+F5',
						click: () => this.handleStopRunner(),
					},
					{
						label: 'Restart',
						accelerator: 'Ctrl+F5',
						click: () => this.handleRestartRunner(),
					},
					{ type: 'separator' },
					{
						label: 'View Logs',
						click: () => this.handleViewLogs(),
					},
				],
			},
			{
				label: 'Security',
				submenu: [
					{
						label: 'Manage Secrets',
						click: () => this.handleManageSecrets(),
					},
					{
						label: 'View Audit Log',
						click: () => this.handleViewAuditLog(),
					},
					{
						label: 'Security Settings',
						click: () => this.handleSecuritySettings(),
					},
				],
			},
			{
				label: 'Help',
				submenu: [
					{
						label: 'About',
						click: () => this.handleAbout(),
					},
					{
						label: 'Documentation',
						click: () => this.handleDocumentation(),
					},
				],
			},
		];

		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);
	}

	private setupIpcHandlers(): void {
		// Workspace operations
		ipcMain.handle('workspace:create', async (event, name: string, template?: string) => {
			return await this.workspaceManager.createWorkspace(name, template);
		});

		ipcMain.handle('workspace:open', async (event, path: string) => {
			return await this.workspaceManager.openWorkspace(path);
		});

		ipcMain.handle('workspace:export', async (event, targetPath: string) => {
			return await this.workspaceManager.exportWorkspace(targetPath);
		});

		ipcMain.handle('workspace:import', async (event, archivePath: string) => {
			return await this.workspaceManager.importWorkspace(archivePath);
		});

		// AI Orchestrator operations
		ipcMain.handle('ai:process-request', async (event, userInput: string, context?: any) => {
			return await this.orchestrator.processRequest(userInput, context);
		});

		ipcMain.handle('ai:execute-plan', async (event, planId: string) => {
			return await this.orchestrator.executeActionPlan(planId);
		});

		ipcMain.handle('ai:get-models', async () => {
			return await this.orchestrator.getAvailableModels();
		});

		ipcMain.handle('ai:set-model', async (event, modelName: string) => {
			return await this.orchestrator.setModel(modelName);
		});

		// Runner operations
		ipcMain.handle('runner:start', async (event, config?: any) => {
			return await this.runnerManager.start(config);
		});

		ipcMain.handle('runner:stop', async () => {
			return await this.runnerManager.stop();
		});

		ipcMain.handle('runner:status', async () => {
			return await this.runnerManager.status();
		});

		ipcMain.handle('runner:build', async (event, config?: any) => {
			return await this.runnerManager.build(config);
		});

		// Secrets operations
		ipcMain.handle('secrets:set', async (event, key: string, value: string) => {
			return await this.secretsManager.setSecret(key, value);
		});

		ipcMain.handle('secrets:get', async (event, key: string, requester: 'user' | 'ai') => {
			return await this.secretsManager.getSecret(key, requester);
		});

		ipcMain.handle('secrets:list', async () => {
			return await this.secretsManager.listSecrets();
		});

		// Security operations
		ipcMain.handle('security:request-approval', async (event, summary: string, riskLevel: string, details?: any) => {
			return await this.securityManager.requestApproval(summary, riskLevel, details);
		});

		ipcMain.handle('security:log-action', async (event, actionType: string, metadata: any, riskLevel?: string) => {
			return await this.securityManager.logAction(actionType, metadata, riskLevel);
		});
	}

	private setupNewComponentHandlers(): void {
		// VS Code Bridge operations
		ipcMain.handle('vscode:execute-command', async (event, command: string, args?: any[]) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'vscode.commands', { command, args });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.vscodeBridge.executeCommand(command, args);
		});

		ipcMain.handle('vscode:get-file-content', async (event, filePath: string) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'vscode.files.read', { filePath });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.vscodeBridge.getFileContent(filePath);
		});

		ipcMain.handle('vscode:write-file', async (event, filePath: string, content: string) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'vscode.files.write', { filePath, content });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.vscodeBridge.writeFile(filePath, content);
		});

		// Extension operations
		ipcMain.handle('extensions:recommend', async (event, context: any) => {
			return await this.extensionRecommender.recommendExtensions(context);
		});

		ipcMain.handle('extensions:install', async (event, extensionId: string) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'extensions.install', { extensionId });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.extensionRecommender.installExtension(extensionId);
		});

		// Docker operations
		ipcMain.handle('docker:create-sandbox', async (event, extensionId: string, config?: any) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'docker.create', { extensionId, config });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.dockerManager.createExtensionSandbox(extensionId, config);
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

		// AI Streaming operations
		ipcMain.handle('ai-stream:get-connection-info', async () => {
			return {
				port: 8081,
				url: 'ws://localhost:8081',
				connections: this.aiStream.getActiveConnections(),
				streams: this.aiStream.getActiveStreams()
			};
		});

		// Permission operations
		ipcMain.handle('permissions:check', async (event, actor: string, resource: string, context?: any) => {
			return await this.permissionMiddleware.checkPermission(actor, resource, context);
		});

		ipcMain.handle('permissions:get-audit-log', async (event, filters?: any) => {
			return this.permissionMiddleware.getAuditLog(filters);
		});
	}

	private setupShutdownHandlers(): void {
		app.on('before-quit', async (event) => {
			event.preventDefault();

			console.log('Shutting down VSEmbed components...');

			try {
				// Gracefully shutdown all components
				await Promise.all([
					this.dockerManager.shutdown(),
					this.aiStream.shutdown(),
					this.performanceOptimizer.shutdown(),
					this.vscodeBridge.shutdown(),
				]);

				console.log('All components shut down successfully');
				app.exit(0);
			} catch (error) {
				console.error('Error during shutdown:', error);
				app.exit(1);
			}
		});
	}

	// Menu handlers
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

	private async handleClearConversation(): Promise<void> {
		this.mainWindow?.webContents.send('ai:clear-conversation');
	}

	private async handleChangeModel(): Promise<void> {
		this.mainWindow?.webContents.send('ai:change-model');
	}

	private async handleAISettings(): Promise<void> {
		this.mainWindow?.webContents.send('ai:settings');
	}

	private async handlePerformanceReport(): Promise<void> {
		const report = this.performanceOptimizer.generateReport();
		dialog.showMessageBox(this.mainWindow!, {
			type: 'info',
			title: 'Performance Report',
			message: 'Current Performance Status',
			detail: report
		});
	}

	private async handleDockerStatus(): Promise<void> {
		const metrics = this.dockerManager.getMetrics();
		const status = `Docker Containers: ${metrics.runningContainers}/${metrics.totalContainers}
Memory Usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB
Security Events: ${metrics.securityEvents}`;

		dialog.showMessageBox(this.mainWindow!, {
			type: 'info',
			title: 'Docker Status',
			message: 'Container Status',
			detail: status
		});
	}

	private async handlePermissionAudit(): Promise<void> {
		this.mainWindow?.webContents.send('permissions:show-audit');
	}

	private async handleForceCleanup(): Promise<void> {
		this.performanceOptimizer.forceGarbageCollection();
		dialog.showMessageBox(this.mainWindow!, {
			type: 'info',
			title: 'Cleanup Complete',
			message: 'System cleanup has been performed'
		});
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

	private async handleAbout(): Promise<void> {
		dialog.showMessageBox(this.mainWindow!, {
			type: 'info',
			title: 'About VSEmbed AI DevTool',
			message: 'VSEmbed AI DevTool v0.2.0',
			detail: `Portable, embeddable AI-powered development environment

Features:
• Full VS Code integration with language servers
• Docker-based extension sandboxing
• Advanced permission system with audit logging
• Real-time AI streaming
• Performance optimization and monitoring
• Comprehensive security framework

Copyright (c) 2025 Sheewi
All systems operational and properly wired.`
		});
	}

	private async handleDocumentation(): Promise<void> {
		require('electron').shell.openExternal('https://github.com/Sheewi/VsEmbed#readme');
	}
}

// Initialize the application
new VSEmbedApplication();
