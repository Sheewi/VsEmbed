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

		// Initialize new components - ALL PROPERLY WIRED
		this.extensionRecommender = new ExtensionRecommender();
		this.vscodeBridge = new VSCodeBridge();
		this.permissionMiddleware = new PermissionMiddleware();
		this.aiStream = new AIStream(8081);
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

		app.on('web-contents-created', (event, contents) => {
			contents.on('new-window', (event, navigationUrl) => {
				event.preventDefault();
				if (!navigationUrl.startsWith('http://localhost:')) {
					console.warn('Blocked navigation to:', navigationUrl);
				}
			});
		});
	}

	private setupShutdownHandlers(): void {
		// Add cleanup logic here
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

		ipcMain.handle('vscode:get-hover-info', async (event, filePath: string, position: any) => {
			return await this.vscodeBridge.getHoverInfo(filePath, position);
		});

		ipcMain.handle('vscode:get-completions', async (event, filePath: string, position: any) => {
			return await this.vscodeBridge.getCompletions(filePath, position);
		});

		ipcMain.handle('vscode:get-definitions', async (event, filePath: string, position: any) => {
			return await this.vscodeBridge.getDefinitions(filePath, position);
		});

		ipcMain.handle('vscode:get-references', async (event, filePath: string, position: any) => {
			return await this.vscodeBridge.getReferences(filePath, position);
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

		ipcMain.handle('extensions:get-info', async (event, extensionId: string) => {
			return await this.extensionRecommender.getExtensionInfo(extensionId);
		});

		// Docker sandbox operations
		ipcMain.handle('docker:create-sandbox', async (event, extensionId: string, config?: any) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'docker.create', { extensionId, config });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.dockerManager.createExtensionSandbox(extensionId, config);
		});

		ipcMain.handle('docker:stop-sandbox', async (event, containerId: string) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'docker.stop', { containerId });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.dockerManager.stopSandbox(containerId);
		});

		ipcMain.handle('docker:execute-command', async (event, containerId: string, command: string[]) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'docker.execute', { containerId, command });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return await this.dockerManager.executeSandboxCommand(containerId, command);
		});

		ipcMain.handle('docker:get-logs', async (event, containerId: string, tail?: number) => {
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
		ipcMain.handle('permissions:check', async (event, actor: string, resource: string, context?: any) => {
			return await this.permissionMiddleware.checkPermission(actor, resource, context);
		});

		ipcMain.handle('permissions:get-policies', async () => {
			return this.permissionMiddleware.getPolicies();
		});

		ipcMain.handle('permissions:update-policy', async (event, policyId: string, updates: any) => {
			const permission = await this.permissionMiddleware.checkPermission('user', 'permissions.policy.update', { policyId, updates });
			if (!permission.allowed) {
				throw new Error(`Permission denied: ${permission.reason}`);
			}
			return this.permissionMiddleware.updatePolicy(policyId, updates);
		});

		ipcMain.handle('permissions:get-audit-log', async (event, filters?: any) => {
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
		this.setupEventForwarding();
	}

	private setupEventForwarding(): void {
		// Forward Docker events to renderer
		this.dockerManager.on('sandboxCreated', (data) => {
			this.mainWindow?.webContents.send('docker:sandbox-created', data);
		});

		this.dockerManager.on('sandboxStopped', (data) => {
			this.mainWindow?.webContents.send('docker:sandbox-stopped', data);
		});

		this.dockerManager.on('sandboxError', (data) => {
			this.mainWindow?.webContents.send('docker:sandbox-error', data);
		});

		// Forward performance events to renderer
		this.performanceOptimizer.on('memoryUpdate', (data) => {
			this.mainWindow?.webContents.send('performance:memory-update', data);
		});

		this.performanceOptimizer.on('timing', (data) => {
			this.mainWindow?.webContents.send('performance:timing', data);
		});

		// Forward permission events to renderer
		this.permissionMiddleware.on('permissionDenied', (data) => {
			this.mainWindow?.webContents.send('permissions:denied', data);
		});

		this.permissionMiddleware.on('auditEvent', (data) => {
			this.mainWindow?.webContents.send('permissions:audit-event', data);
		});

		// Forward VS Code bridge events to renderer
		this.vscodeBridge.on('extensionInstalled', (data) => {
			this.mainWindow?.webContents.send('vscode:extension-installed', data);
		});

		this.vscodeBridge.on('languageServerReady', (data) => {
			this.mainWindow?.webContents.send('vscode:language-server-ready', data);
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

	private async handleAbout(): Promise<void> {
		dialog.showMessageBox(this.mainWindow!, {
			type: 'info',
			title: 'About VSEmbed AI DevTool',
			message: 'VSEmbed AI DevTool',
			detail: 'Portable, embeddable AI-powered development environment\nVersion 0.1.0\nCopyright (c) 2025 Sheewi',
		});
	}

	private async handleDocumentation(): Promise<void> {
		// Open documentation URL
		require('electron').shell.openExternal('https://github.com/Sheewi/VsEmbed#readme');
	}
}

// Initialize the application
new VSEmbedApplication();
