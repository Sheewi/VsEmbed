import { app, BrowserWindow, ipcMain, Menu, dialog, IpcMainInvokeEvent } from 'electron';
import * as path from 'path';
import { AIOrchestratorService } from '../services/AIOrchestratorService';
import { WorkspaceManager } from '../services/WorkspaceManager';
import { SecretsManager } from '../services/SecretsManager';
import { RunnerManager } from '../services/RunnerManager';
import { SecurityManager } from '../services/SecurityManager';
import { ExtensionRecommender } from '../extensions/recommender';
import { DockerManager } from '../docker/sandbox';
class VSEmbedApplication {
	constructor() {
		app.on('ready', this.createMainWindow.bind(this));
		app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') {
				app.quit();
			}
		});
		app.on('activate', () => {
			if (this.mainWindow === null) {
				this.createMainWindow();
			}
		});
		// ...existing constructor logic (if any)...
	}

	private createMainWindow() {
		this.mainWindow = new BrowserWindow({
			width: 1200,
			height: 800,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, '../../.webpack/preload/preload.js')
			},
			show: true, // Ensure window is visible
		});
		// Load renderer output (index.html from .webpack/renderer)
		const rendererPath = path.join(__dirname, '../../.webpack/renderer/index.html');
		console.log('Loading renderer from:', rendererPath);
		this.mainWindow.loadFile(rendererPath);
		
		// Open dev tools for debugging
		this.mainWindow.webContents.openDevTools();
		
		this.mainWindow.on('closed', () => {
			this.mainWindow = null;
		});
		
		// Initialize application components
		this.createMenu();
		this.setupIpcHandlers();
		this.setupNewComponentHandlers();
	}
	private mainWindow: BrowserWindow | null = null;
	private orchestrator = new AIOrchestratorService();
	private workspaceManager = new WorkspaceManager();
	private secretsManager = new SecretsManager();
	private runnerManager = new RunnerManager();
	private securityManager = new SecurityManager();
	private extensionRecommender = new ExtensionRecommender();
	private dockerManager = new DockerManager(this.extensionRecommender);
	private vscodeBridge: any = {
		executeCommand: async () => ({ success: false, message: 'VS Code bridge disabled' }),
		getFileContent: async () => '',
		writeFile: async () => true,
		getHoverInfo: async () => null,
		getCompletions: async () => [],
		getDefinitions: async () => [],
		getReferences: async () => [],
		on: () => {},
		initialize: async () => true
	};
	private performanceOptimizer: any = {};
	private aiStream: any = {};
	private permissionMiddleware: any = { 
		checkPermission: async () => ({ allowed: true }), 
		on: () => {}, 
		getPolicies: () => [], 
		updatePolicy: () => {}, 
		getAuditLog: () => [] 
	};


	// File menu handlers
	private async handleNewFile(): Promise<void> {
		this.mainWindow?.webContents.send('menu:new-file');
	}

	private async handleNewWindow(): Promise<void> {
		this.createMainWindow();
	}

	private async handleOpenFile(): Promise<void> {
		const result = await dialog.showOpenDialog(this.mainWindow!, {
			properties: ['openFile'],
			title: 'Open File',
			filters: [
				{ name: 'All Files', extensions: ['*'] },
				{ name: 'Text Files', extensions: ['txt', 'md', 'json', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss'] },
			],
		});

		if (!result.canceled && result.filePaths.length > 0) {
			this.mainWindow?.webContents.send('file:open', result.filePaths[0]);
		}
	}

	private async handleOpenFolder(): Promise<void> {
		const result = await dialog.showOpenDialog(this.mainWindow!, {
			properties: ['openDirectory'],
			title: 'Open Folder',
		});

		if (!result.canceled && result.filePaths.length > 0) {
			this.mainWindow?.webContents.send('folder:open', result.filePaths[0]);
		}
	}

	private async handleCreateWorkspace(): Promise<void> {
		const result = await dialog.showSaveDialog(this.mainWindow!, {
			title: 'Create Workspace',
			defaultPath: 'workspace.code-workspace',
			filters: [
				{ name: 'VS Code Workspace', extensions: ['code-workspace'] },
			],
		});

		if (!result.canceled && result.filePath) {
			this.mainWindow?.webContents.send('workspace:create', result.filePath);
		}
	}

	private async handleAddFolderToWorkspace(): Promise<void> {
		const result = await dialog.showOpenDialog(this.mainWindow!, {
			properties: ['openDirectory'],
			title: 'Add Folder to Workspace',
		});

		if (!result.canceled && result.filePaths.length > 0) {
			this.mainWindow?.webContents.send('workspace:add-folder', result.filePaths[0]);
		}
	}

	private async handleSaveWorkspaceAs(): Promise<void> {
		const result = await dialog.showSaveDialog(this.mainWindow!, {
			title: 'Save Workspace As',
			defaultPath: 'workspace.code-workspace',
			filters: [
				{ name: 'VS Code Workspace', extensions: ['code-workspace'] },
			],
		});

		if (!result.canceled && result.filePath) {
			this.mainWindow?.webContents.send('workspace:save-as', result.filePath);
		}
	}

	private async handleSave(): Promise<void> {
		this.mainWindow?.webContents.send('editor:save');
	}

	private async handleSaveAs(): Promise<void> {
		this.mainWindow?.webContents.send('editor:save-as');
	}

	private async handleSaveAll(): Promise<void> {
		this.mainWindow?.webContents.send('editor:save-all');
	}

	private async handleToggleAutoSave(): Promise<void> {
		this.mainWindow?.webContents.send('editor:toggle-auto-save');
	}

	private async handleKeyboardShortcuts(): Promise<void> {
		this.mainWindow?.webContents.send('preferences:keyboard-shortcuts');
	}

	private async handleExtensions(): Promise<void> {
		this.mainWindow?.webContents.send('view:show-extensions');
	}

	private async handleColorTheme(): Promise<void> {
		this.mainWindow?.webContents.send('preferences:color-theme');
	}

	private async handleFileIconTheme(): Promise<void> {
		this.mainWindow?.webContents.send('preferences:file-icon-theme');
	}

	private async handleRevertFile(): Promise<void> {
		this.mainWindow?.webContents.send('editor:revert-file');
	}

	private async handleCloseEditor(): Promise<void> {
		this.mainWindow?.webContents.send('editor:close');
	}

	private async handleCloseFolder(): Promise<void> {
		this.mainWindow?.webContents.send('folder:close');
	}

	private async handleCloseWindow(): Promise<void> {
		this.mainWindow?.close();
	}

	private async handleReopenClosedEditor(): Promise<void> {
		this.mainWindow?.webContents.send('editor:reopen-closed');
	}

	private async handleMoreRecent(): Promise<void> {
		this.mainWindow?.webContents.send('file:show-recent');
	}

	private async handleClearRecentlyOpened(): Promise<void> {
		this.mainWindow?.webContents.send('file:clear-recent');
	}

	// Edit menu handlers
	private async handleFind(): Promise<void> {
		this.mainWindow?.webContents.send('editor:find');
	}

	private async handleReplace(): Promise<void> {
		this.mainWindow?.webContents.send('editor:replace');
	}

	private async handleFindInFiles(): Promise<void> {
		this.mainWindow?.webContents.send('search:find-in-files');
	}

	private async handleReplaceInFiles(): Promise<void> {
		this.mainWindow?.webContents.send('search:replace-in-files');
	}

	private async handleToggleLineComment(): Promise<void> {
		this.mainWindow?.webContents.send('editor:toggle-line-comment');
	}

	private async handleToggleBlockComment(): Promise<void> {
		this.mainWindow?.webContents.send('editor:toggle-block-comment');
	}

	private async handleEmmetExpand(): Promise<void> {
		this.mainWindow?.webContents.send('editor:emmet-expand');
	}

	// Selection menu handlers
	private async handleExpandSelection(): Promise<void> {
		this.mainWindow?.webContents.send('editor:expand-selection');
	}

	private async handleShrinkSelection(): Promise<void> {
		this.mainWindow?.webContents.send('editor:shrink-selection');
	}

	private async handleCopyLineUp(): Promise<void> {
		this.mainWindow?.webContents.send('editor:copy-line-up');
	}

	private async handleCopyLineDown(): Promise<void> {
		this.mainWindow?.webContents.send('editor:copy-line-down');
	}

	private async handleMoveLineUp(): Promise<void> {
		this.mainWindow?.webContents.send('editor:move-line-up');
	}

	private async handleMoveLineDown(): Promise<void> {
		this.mainWindow?.webContents.send('editor:move-line-down');
	}

	private async handleAddCursorAbove(): Promise<void> {
		this.mainWindow?.webContents.send('editor:add-cursor-above');
	}

	private async handleAddCursorBelow(): Promise<void> {
		this.mainWindow?.webContents.send('editor:add-cursor-below');
	}

	private async handleAddCursorsToLineEnds(): Promise<void> {
		this.mainWindow?.webContents.send('editor:add-cursors-to-line-ends');
	}

	private async handleAddNextOccurrence(): Promise<void> {
		this.mainWindow?.webContents.send('editor:add-next-occurrence');
	}

	private async handleAddAllOccurrences(): Promise<void> {
		this.mainWindow?.webContents.send('editor:add-all-occurrences');
	}

	// View menu handlers
	private async handleCommandPalette(): Promise<void> {
		this.mainWindow?.webContents.send('view:command-palette');
	}

	private async handleOpenView(): Promise<void> {
		this.mainWindow?.webContents.send('view:open-view');
	}

	private async handleShowExplorer(): Promise<void> {
		this.mainWindow?.webContents.send('view:show-explorer');
	}

	private async handleShowSearch(): Promise<void> {
		this.mainWindow?.webContents.send('view:show-search');
	}

	private async handleShowSourceControl(): Promise<void> {
		this.mainWindow?.webContents.send('view:show-source-control');
	}

	private async handleShowDebug(): Promise<void> {
		this.mainWindow?.webContents.send('view:show-debug');
	}

	private async handleShowExtensions(): Promise<void> {
		this.mainWindow?.webContents.send('view:show-extensions');
	}

	private async handleShowProblems(): Promise<void> {
		this.mainWindow?.webContents.send('view:show-problems');
	}

	private async handleShowOutput(): Promise<void> {
		this.mainWindow?.webContents.send('view:show-output');
	}

	private async handleShowDebugConsole(): Promise<void> {
		this.mainWindow?.webContents.send('view:show-debug-console');
	}

	private async handleShowTerminal(): Promise<void> {
		this.mainWindow?.webContents.send('view:show-terminal');
	}

	private async handleZenMode(): Promise<void> {
		this.mainWindow?.webContents.send('view:zen-mode');
	}

	private async handleCenteredLayout(): Promise<void> {
		this.mainWindow?.webContents.send('view:centered-layout');
	}

	private async handleToggleMenuBar(): Promise<void> {
		const menuBarVisible = this.mainWindow?.isMenuBarVisible();
		this.mainWindow?.setMenuBarVisibility(!menuBarVisible);
	}

	private async handleToggleActivityBar(): Promise<void> {
		this.mainWindow?.webContents.send('view:toggle-activity-bar');
	}

	private async handleToggleSideBar(): Promise<void> {
		this.mainWindow?.webContents.send('view:toggle-side-bar');
	}

	private async handleToggleStatusBar(): Promise<void> {
		this.mainWindow?.webContents.send('view:toggle-status-bar');
	}

	private async handleTogglePanel(): Promise<void> {
		this.mainWindow?.webContents.send('view:toggle-panel');
	}

	private async handleSplitUp(): Promise<void> {
		this.mainWindow?.webContents.send('editor:split-up');
	}

	private async handleSplitDown(): Promise<void> {
		this.mainWindow?.webContents.send('editor:split-down');
	}

	private async handleSplitLeft(): Promise<void> {
		this.mainWindow?.webContents.send('editor:split-left');
	}

	private async handleSplitRight(): Promise<void> {
		this.mainWindow?.webContents.send('editor:split-right');
	}

	private async handleSingleColumnLayout(): Promise<void> {
		this.mainWindow?.webContents.send('editor:single-column-layout');
	}

	private async handleTwoColumnsLayout(): Promise<void> {
		this.mainWindow?.webContents.send('editor:two-columns-layout');
	}

	private async handleThreeColumnsLayout(): Promise<void> {
		this.mainWindow?.webContents.send('editor:three-columns-layout');
	}

	// Go menu handlers
	private async handleGoBack(): Promise<void> {
		this.mainWindow?.webContents.send('navigation:go-back');
	}

	private async handleGoForward(): Promise<void> {
		this.mainWindow?.webContents.send('navigation:go-forward');
	}

	private async handleGoToLastEditLocation(): Promise<void> {
		this.mainWindow?.webContents.send('navigation:go-to-last-edit');
	}

	private async handleNextEditor(): Promise<void> {
		this.mainWindow?.webContents.send('editor:next-editor');
	}

	private async handlePreviousEditor(): Promise<void> {
		this.mainWindow?.webContents.send('editor:previous-editor');
	}

	private async handleNextEditorInGroup(): Promise<void> {
		this.mainWindow?.webContents.send('editor:next-editor-in-group');
	}

	private async handlePreviousEditorInGroup(): Promise<void> {
		this.mainWindow?.webContents.send('editor:previous-editor-in-group');
	}

	private async handleNextGroup(): Promise<void> {
		this.mainWindow?.webContents.send('editor:next-group');
	}

	private async handlePreviousGroup(): Promise<void> {
		this.mainWindow?.webContents.send('editor:previous-group');
	}

	private async handleGoToFile(): Promise<void> {
		this.mainWindow?.webContents.send('navigation:go-to-file');
	}

	private async handleGoToSymbolInWorkspace(): Promise<void> {
		this.mainWindow?.webContents.send('navigation:go-to-symbol-workspace');
	}

	private async handleGoToSymbolInEditor(): Promise<void> {
		this.mainWindow?.webContents.send('navigation:go-to-symbol-editor');
	}

	private async handleGoToDefinition(): Promise<void> {
		this.mainWindow?.webContents.send('navigation:go-to-definition');
	}

	private async handleGoToDeclaration(): Promise<void> {
		this.mainWindow?.webContents.send('navigation:go-to-declaration');
	}

	private async handleGoToTypeDefinition(): Promise<void> {
		this.mainWindow?.webContents.send('navigation:go-to-type-definition');
	}

	private async handleGoToImplementations(): Promise<void> {
		this.mainWindow?.webContents.send('navigation:go-to-implementations');
	}

	private async handleGoToReferences(): Promise<void> {
		this.mainWindow?.webContents.send('navigation:go-to-references');
	}

	private async handleGoToLine(): Promise<void> {
		this.mainWindow?.webContents.send('navigation:go-to-line');
	}

	private async handleGoToBracket(): Promise<void> {
		this.mainWindow?.webContents.send('navigation:go-to-bracket');
	}

	// Run menu handlers
	private async handleStartDebugging(): Promise<void> {
		this.mainWindow?.webContents.send('debug:start');
	}

	private async handleStartWithoutDebugging(): Promise<void> {
		this.mainWindow?.webContents.send('debug:start-without-debugging');
	}

	private async handleStopDebugging(): Promise<void> {
		this.mainWindow?.webContents.send('debug:stop');
	}

	private async handleRestartDebugging(): Promise<void> {
		this.mainWindow?.webContents.send('debug:restart');
	}

	private async handleOpenConfigurations(): Promise<void> {
		this.mainWindow?.webContents.send('debug:open-configurations');
	}

	private async handleAddConfiguration(): Promise<void> {
		this.mainWindow?.webContents.send('debug:add-configuration');
	}

	private async handleStepOver(): Promise<void> {
		this.mainWindow?.webContents.send('debug:step-over');
	}

	private async handleStepInto(): Promise<void> {
		this.mainWindow?.webContents.send('debug:step-into');
	}

	private async handleStepOut(): Promise<void> {
		this.mainWindow?.webContents.send('debug:step-out');
	}

	private async handleContinue(): Promise<void> {
		this.mainWindow?.webContents.send('debug:continue');
	}

	private async handleToggleBreakpoint(): Promise<void> {
		this.mainWindow?.webContents.send('debug:toggle-breakpoint');
	}

	private async handleConditionalBreakpoint(): Promise<void> {
		this.mainWindow?.webContents.send('debug:conditional-breakpoint');
	}

	private async handleInlineBreakpoint(): Promise<void> {
		this.mainWindow?.webContents.send('debug:inline-breakpoint');
	}

	private async handleFunctionBreakpoint(): Promise<void> {
		this.mainWindow?.webContents.send('debug:function-breakpoint');
	}

	private async handleLogpoint(): Promise<void> {
		this.mainWindow?.webContents.send('debug:logpoint');
	}

	private async handleEnableAllBreakpoints(): Promise<void> {
		this.mainWindow?.webContents.send('debug:enable-all-breakpoints');
	}

	private async handleDisableAllBreakpoints(): Promise<void> {
		this.mainWindow?.webContents.send('debug:disable-all-breakpoints');
	}

	private async handleRemoveAllBreakpoints(): Promise<void> {
		this.mainWindow?.webContents.send('debug:remove-all-breakpoints');
	}

	private async handleInstallAdditionalDebuggers(): Promise<void> {
		this.mainWindow?.webContents.send('debug:install-additional-debuggers');
	}

	// Help menu handlers
	private async handleWelcome(): Promise<void> {
		this.mainWindow?.webContents.send('help:welcome');
	}

	private async handleShowAllCommands(): Promise<void> {
		this.mainWindow?.webContents.send('view:command-palette');
	}

	private async handleShowReleaseNotes(): Promise<void> {
		this.mainWindow?.webContents.send('help:release-notes');
	}

	private async handleKeyboardShortcutsReference(): Promise<void> {
		this.mainWindow?.webContents.send('help:keyboard-shortcuts-reference');
	}

	private async handleVideoTutorials(): Promise<void> {
		this.mainWindow?.webContents.send('help:video-tutorials');
	}

	private async handleTipsAndTricks(): Promise<void> {
		this.mainWindow?.webContents.send('help:tips-and-tricks');
	}

	private async handleJoinTwitter(): Promise<void> {
		this.mainWindow?.webContents.send('help:join-twitter');
	}

	private async handleSearchFeatureRequests(): Promise<void> {
		this.mainWindow?.webContents.send('help:search-feature-requests');
	}

	private async handleReportIssue(): Promise<void> {
		this.mainWindow?.webContents.send('help:report-issue');
	}

	private async handleViewLicense(): Promise<void> {
		this.mainWindow?.webContents.send('help:view-license');
	}

	private async handlePrivacyStatement(): Promise<void> {
		this.mainWindow?.webContents.send('help:privacy-statement');
	}

	private async handleToggleDevTools(): Promise<void> {
		this.mainWindow?.webContents.toggleDevTools();
	}

	private async handleOpenProcessExplorer(): Promise<void> {
		this.mainWindow?.webContents.send('help:process-explorer');
	}

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
					{ label: 'New File', accelerator: 'CmdOrCtrl+N', click: () => this.handleNewFile() },
					{ label: 'New Window', accelerator: 'CmdOrCtrl+Shift+N', click: () => this.handleNewWindow() },
					{ type: 'separator' },
					{ label: 'Open File...', accelerator: 'CmdOrCtrl+O', click: () => this.handleOpenFile() },
					{ label: 'Open Folder...', accelerator: 'CmdOrCtrl+K CmdOrCtrl+O', click: () => this.handleOpenFolder() },
					{ label: 'Open Workspace...', click: () => this.handleOpenWorkspace() },
					{ label: 'Open Recent', submenu: this.getRecentSubmenu() },
					{ type: 'separator' },
					{ label: 'Create Workspace...', click: () => this.handleCreateWorkspace() },
					{ label: 'Add Folder to Workspace...', click: () => this.handleAddFolderToWorkspace() },
					{ label: 'Save Workspace As...', click: () => this.handleSaveWorkspaceAs() },
					{ type: 'separator' },
					{ label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => this.handleSave() },
					{ label: 'Save As...', accelerator: 'CmdOrCtrl+Shift+S', click: () => this.handleSaveAs() },
					{ label: 'Save All', accelerator: 'CmdOrCtrl+K S', click: () => this.handleSaveAll() },
					{ type: 'separator' },
					{ label: 'Auto Save', type: 'checkbox', checked: false, click: () => this.handleToggleAutoSave() },
					{ type: 'separator' },
					{ label: 'Preferences', submenu: [
						{ label: 'Settings', accelerator: 'CmdOrCtrl+,', click: () => this.handleSettings() },
						{ label: 'Keyboard Shortcuts', accelerator: 'CmdOrCtrl+K CmdOrCtrl+S', click: () => this.handleKeyboardShortcuts() },
						{ label: 'Extensions', accelerator: 'CmdOrCtrl+Shift+X', click: () => this.handleExtensions() },
						{ type: 'separator' },
						{ label: 'Color Theme', click: () => this.handleColorTheme() },
						{ label: 'File Icon Theme', click: () => this.handleFileIconTheme() },
					]},
					{ type: 'separator' },
					{ label: 'Revert File', click: () => this.handleRevertFile() },
					{ label: 'Close Editor', accelerator: 'CmdOrCtrl+W', click: () => this.handleCloseEditor() },
					{ label: 'Close Folder', accelerator: 'CmdOrCtrl+K F', click: () => this.handleCloseFolder() },
					{ label: 'Close Window', accelerator: 'CmdOrCtrl+Shift+W', click: () => this.handleCloseWindow() },
					{ type: 'separator' },
					{ label: 'Exit', accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q', role: 'quit' },
				],
			},
			{
				label: 'Edit',
				submenu: [
					{ label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
					{ label: 'Redo', accelerator: 'CmdOrCtrl+Shift+Z', role: 'redo' },
					{ type: 'separator' },
					{ label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
					{ label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
					{ label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
					{ type: 'separator' },
					{ label: 'Find', accelerator: 'CmdOrCtrl+F', click: () => this.handleFind() },
					{ label: 'Replace', accelerator: 'CmdOrCtrl+H', click: () => this.handleReplace() },
					{ type: 'separator' },
					{ label: 'Find in Files', accelerator: 'CmdOrCtrl+Shift+F', click: () => this.handleFindInFiles() },
					{ label: 'Replace in Files', accelerator: 'CmdOrCtrl+Shift+H', click: () => this.handleReplaceInFiles() },
					{ type: 'separator' },
					{ label: 'Toggle Line Comment', accelerator: 'CmdOrCtrl+/', click: () => this.handleToggleLineComment() },
					{ label: 'Toggle Block Comment', accelerator: 'CmdOrCtrl+Shift+A', click: () => this.handleToggleBlockComment() },
					{ type: 'separator' },
					{ label: 'Emmet: Expand Abbreviation', accelerator: 'Tab', click: () => this.handleEmmetExpand() },
				],
			},
			{
				label: 'Selection',
				submenu: [
					{ label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
					{ label: 'Expand Selection', accelerator: 'Shift+Alt+Right', click: () => this.handleExpandSelection() },
					{ label: 'Shrink Selection', accelerator: 'Shift+Alt+Left', click: () => this.handleShrinkSelection() },
					{ type: 'separator' },
					{ label: 'Copy Line Up', accelerator: 'Shift+Alt+Up', click: () => this.handleCopyLineUp() },
					{ label: 'Copy Line Down', accelerator: 'Shift+Alt+Down', click: () => this.handleCopyLineDown() },
					{ label: 'Move Line Up', accelerator: 'Alt+Up', click: () => this.handleMoveLineUp() },
					{ label: 'Move Line Down', accelerator: 'Alt+Down', click: () => this.handleMoveLineDown() },
					{ type: 'separator' },
					{ label: 'Add Cursor Above', accelerator: 'CmdOrCtrl+Alt+Up', click: () => this.handleAddCursorAbove() },
					{ label: 'Add Cursor Below', accelerator: 'CmdOrCtrl+Alt+Down', click: () => this.handleAddCursorBelow() },
					{ label: 'Add Cursors to Line Ends', accelerator: 'Shift+Alt+I', click: () => this.handleAddCursorsToLineEnds() },
					{ label: 'Add Next Occurrence', accelerator: 'CmdOrCtrl+D', click: () => this.handleAddNextOccurrence() },
					{ label: 'Add All Occurrences', accelerator: 'CmdOrCtrl+Shift+L', click: () => this.handleAddAllOccurrences() },
				],
			},
			{
				label: 'View',
				submenu: [
					{ label: 'Command Palette...', accelerator: 'CmdOrCtrl+Shift+P', click: () => this.handleCommandPalette() },
					{ label: 'Open View...', accelerator: 'CmdOrCtrl+Q', click: () => this.handleOpenView() },
					{ type: 'separator' },
					{ label: 'Explorer', accelerator: 'CmdOrCtrl+Shift+E', click: () => this.handleShowExplorer() },
					{ label: 'Search', accelerator: 'CmdOrCtrl+Shift+F', click: () => this.handleShowSearch() },
					{ label: 'Source Control', accelerator: 'CmdOrCtrl+Shift+G', click: () => this.handleShowSourceControl() },
					{ label: 'Run and Debug', accelerator: 'CmdOrCtrl+Shift+D', click: () => this.handleShowDebug() },
					{ label: 'Extensions', accelerator: 'CmdOrCtrl+Shift+X', click: () => this.handleShowExtensions() },
					{ type: 'separator' },
					{ label: 'Problems', accelerator: 'CmdOrCtrl+Shift+M', click: () => this.handleShowProblems() },
					{ label: 'Output', accelerator: 'CmdOrCtrl+Shift+U', click: () => this.handleShowOutput() },
					{ label: 'Debug Console', accelerator: 'CmdOrCtrl+Shift+Y', click: () => this.handleShowDebugConsole() },
					{ label: 'Terminal', accelerator: 'CmdOrCtrl+`', click: () => this.handleShowTerminal() },
					{ type: 'separator' },
					{ label: 'Appearance', submenu: [
						{ label: 'Full Screen', accelerator: 'F11', role: 'togglefullscreen' },
						{ label: 'Zen Mode', accelerator: 'CmdOrCtrl+K Z', click: () => this.handleZenMode() },
						{ label: 'Centered Layout', click: () => this.handleCenteredLayout() },
						{ type: 'separator' },
						{ label: 'Show Menu Bar', type: 'checkbox', checked: true, click: () => this.handleToggleMenuBar() },
						{ label: 'Show Activity Bar', type: 'checkbox', checked: true, click: () => this.handleToggleActivityBar() },
						{ label: 'Show Side Bar', accelerator: 'CmdOrCtrl+B', click: () => this.handleToggleSideBar() },
						{ label: 'Show Status Bar', click: () => this.handleToggleStatusBar() },
						{ label: 'Show Panel', accelerator: 'CmdOrCtrl+J', click: () => this.handleTogglePanel() },
						{ type: 'separator' },
						{ label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
						{ label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
						{ label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
					]},
					{ type: 'separator' },
					{ label: 'Editor Layout', submenu: [
						{ label: 'Split Up', click: () => this.handleSplitUp() },
						{ label: 'Split Down', click: () => this.handleSplitDown() },
						{ label: 'Split Left', click: () => this.handleSplitLeft() },
						{ label: 'Split Right', click: () => this.handleSplitRight() },
						{ type: 'separator' },
						{ label: 'Single Column Layout', click: () => this.handleSingleColumnLayout() },
						{ label: 'Two Columns Layout', click: () => this.handleTwoColumnsLayout() },
						{ label: 'Three Columns Layout', click: () => this.handleThreeColumnsLayout() },
					]},
				],
			},
			{
				label: 'Go',
				submenu: [
					{ label: 'Back', accelerator: 'CmdOrCtrl+Alt+Left', click: () => this.handleGoBack() },
					{ label: 'Forward', accelerator: 'CmdOrCtrl+Alt+Right', click: () => this.handleGoForward() },
					{ label: 'Last Edit Location', accelerator: 'CmdOrCtrl+K CmdOrCtrl+Q', click: () => this.handleGoToLastEditLocation() },
					{ type: 'separator' },
					{ label: 'Switch Editor', submenu: [
						{ label: 'Next Editor', accelerator: 'CmdOrCtrl+PageDown', click: () => this.handleNextEditor() },
						{ label: 'Previous Editor', accelerator: 'CmdOrCtrl+PageUp', click: () => this.handlePreviousEditor() },
						{ label: 'Next Editor in Group', accelerator: 'CmdOrCtrl+Tab', click: () => this.handleNextEditorInGroup() },
						{ label: 'Previous Editor in Group', accelerator: 'CmdOrCtrl+Shift+Tab', click: () => this.handlePreviousEditorInGroup() },
					]},
					{ label: 'Switch Group', submenu: [
						{ label: 'Next Group', accelerator: 'CmdOrCtrl+K CmdOrCtrl+Right', click: () => this.handleNextGroup() },
						{ label: 'Previous Group', accelerator: 'CmdOrCtrl+K CmdOrCtrl+Left', click: () => this.handlePreviousGroup() },
					]},
					{ type: 'separator' },
					{ label: 'Go to File...', accelerator: 'CmdOrCtrl+P', click: () => this.handleGoToFile() },
					{ label: 'Go to Symbol in Workspace...', accelerator: 'CmdOrCtrl+T', click: () => this.handleGoToSymbolInWorkspace() },
					{ label: 'Go to Symbol in Editor...', accelerator: 'CmdOrCtrl+Shift+O', click: () => this.handleGoToSymbolInEditor() },
					{ label: 'Go to Definition', accelerator: 'F12', click: () => this.handleGoToDefinition() },
					{ label: 'Go to Declaration', click: () => this.handleGoToDeclaration() },
					{ label: 'Go to Type Definition', click: () => this.handleGoToTypeDefinition() },
					{ label: 'Go to Implementations', accelerator: 'CmdOrCtrl+F12', click: () => this.handleGoToImplementations() },
					{ label: 'Go to References', accelerator: 'Shift+F12', click: () => this.handleGoToReferences() },
					{ type: 'separator' },
					{ label: 'Go to Line/Column...', accelerator: 'CmdOrCtrl+G', click: () => this.handleGoToLine() },
					{ label: 'Go to Bracket', accelerator: 'CmdOrCtrl+Shift+\\', click: () => this.handleGoToBracket() },
				],
			},
			{
				label: 'Run',
				submenu: [
					{ label: 'Start Debugging', accelerator: 'F5', click: () => this.handleStartDebugging() },
					{ label: 'Start Without Debugging', accelerator: 'CmdOrCtrl+F5', click: () => this.handleStartWithoutDebugging() },
					{ label: 'Stop Debugging', accelerator: 'Shift+F5', click: () => this.handleStopDebugging() },
					{ label: 'Restart Debugging', accelerator: 'CmdOrCtrl+Shift+F5', click: () => this.handleRestartDebugging() },
					{ type: 'separator' },
					{ label: 'Open Configurations', click: () => this.handleOpenConfigurations() },
					{ label: 'Add Configuration...', click: () => this.handleAddConfiguration() },
					{ type: 'separator' },
					{ label: 'Step Over', accelerator: 'F10', click: () => this.handleStepOver() },
					{ label: 'Step Into', accelerator: 'F11', click: () => this.handleStepInto() },
					{ label: 'Step Out', accelerator: 'Shift+F11', click: () => this.handleStepOut() },
					{ label: 'Continue', accelerator: 'F5', click: () => this.handleContinue() },
					{ type: 'separator' },
					{ label: 'Toggle Breakpoint', accelerator: 'F9', click: () => this.handleToggleBreakpoint() },
					{ label: 'New Breakpoint', submenu: [
						{ label: 'Conditional Breakpoint...', click: () => this.handleConditionalBreakpoint() },
						{ label: 'Inline Breakpoint', accelerator: 'Shift+F9', click: () => this.handleInlineBreakpoint() },
						{ label: 'Function Breakpoint...', click: () => this.handleFunctionBreakpoint() },
						{ label: 'Logpoint...', click: () => this.handleLogpoint() },
					]},
					{ label: 'Enable All Breakpoints', click: () => this.handleEnableAllBreakpoints() },
					{ label: 'Disable All Breakpoints', click: () => this.handleDisableAllBreakpoints() },
					{ label: 'Remove All Breakpoints', click: () => this.handleRemoveAllBreakpoints() },
					{ type: 'separator' },
					{ label: 'Install Additional Debuggers...', click: () => this.handleInstallAdditionalDebuggers() },
				],
			},
			{
				label: 'Help',
				submenu: [
					{ label: 'Welcome', click: () => this.handleWelcome() },
					{ label: 'Show All Commands', accelerator: 'CmdOrCtrl+Shift+P', click: () => this.handleShowAllCommands() },
					{ label: 'Documentation', click: () => this.handleDocumentation() },
					{ label: 'Show Release Notes', click: () => this.handleShowReleaseNotes() },
					{ type: 'separator' },
					{ label: 'Keyboard Shortcuts Reference', accelerator: 'CmdOrCtrl+K CmdOrCtrl+R', click: () => this.handleKeyboardShortcutsReference() },
					{ label: 'Video Tutorials', click: () => this.handleVideoTutorials() },
					{ label: 'Tips and Tricks', click: () => this.handleTipsAndTricks() },
					{ type: 'separator' },
					{ label: 'Join Us on Twitter', click: () => this.handleJoinTwitter() },
					{ label: 'Search Feature Requests', click: () => this.handleSearchFeatureRequests() },
					{ label: 'Report Issue', click: () => this.handleReportIssue() },
					{ type: 'separator' },
					{ label: 'View License', click: () => this.handleViewLicense() },
					{ label: 'Privacy Statement', click: () => this.handlePrivacyStatement() },
					{ type: 'separator' },
					{ label: 'Toggle Developer Tools', accelerator: 'F12', click: () => this.handleToggleDevTools() },
					{ label: 'Open Process Explorer', click: () => this.handleOpenProcessExplorer() },
					{ type: 'separator' },
					{ label: 'About', click: () => this.handleAbout() },
				],
			},
		];

		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);
	}

	private getRecentSubmenu(): Electron.MenuItemConstructorOptions[] {
		// This would typically load from stored recent files/workspaces
		return [
			{ label: 'Reopen Closed Editor', accelerator: 'CmdOrCtrl+Shift+T', click: () => this.handleReopenClosedEditor() },
			{ type: 'separator' },
			{ label: 'More...', click: () => this.handleMoreRecent() },
			{ type: 'separator' },
			{ label: 'Clear Recently Opened', click: () => this.handleClearRecentlyOpened() },
		];
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
