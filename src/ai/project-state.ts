import * as vscode from 'vscode';
import { EventEmitter } from 'events';
import * as path from 'path';

export interface ProjectFile {
	path: string;
	content: string;
	language: string;
	lastModified: Date;
}

export interface ProjectStructure {
	root: string;
	directories: string[];
	files: ProjectFile[];
	dependencies: Record<string, string>;
	scripts: Record<string, string>;
}

export interface ProjectChange {
	id: string;
	type: 'create' | 'modify' | 'delete';
	file: string;
	changes: string;
	timestamp: Date;
	author: 'user' | 'ai';
}

export class ProjectState extends EventEmitter {
	private structure: ProjectStructure | null = null;
	private changes: ProjectChange[] = [];
	private watchers: vscode.FileSystemWatcher[] = [];
	private isInitialized = false;

	constructor() {
		super();
	}

	async initialize(): Promise<void> {
		if (this.isInitialized) return;

		await this.scanProject();
		this.setupFileWatchers();

		this.isInitialized = true;
		this.emit('initialized');
	}

	private async scanProject(): Promise<void> {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (!workspaceFolder) {
			throw new Error('No workspace folder found');
		}

		const rootPath = workspaceFolder.uri.fsPath;

		// Scan directory structure
		const directories = await this.scanDirectories(rootPath);

		// Read important files
		const files = await this.readProjectFiles(rootPath);

		// Parse package.json or similar
		const packageInfo = await this.parsePackageInfo(rootPath);

		this.structure = {
			root: rootPath,
			directories,
			files,
			dependencies: packageInfo.dependencies || {},
			scripts: packageInfo.scripts || {}
		};

		this.emit('structureUpdated', this.structure);
	}

	private async scanDirectories(rootPath: string): Promise<string[]> {
		const directories: string[] = [];

		try {
			const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(rootPath));

			for (const [name, type] of entries) {
				if (type === vscode.FileType.Directory && !name.startsWith('.') && name !== 'node_modules') {
					const dirPath = path.join(rootPath, name);
					directories.push(dirPath);

					// Recursively scan subdirectories (up to 3 levels deep)
					const subDirs = await this.scanDirectoriesRecursive(dirPath, 2);
					directories.push(...subDirs);
				}
			}
		} catch (error) {
			console.error('Error scanning directories:', error);
		}

		return directories;
	}

	private async scanDirectoriesRecursive(dirPath: string, maxDepth: number): Promise<string[]> {
		if (maxDepth <= 0) return [];

		const directories: string[] = [];

		try {
			const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(dirPath));

			for (const [name, type] of entries) {
				if (type === vscode.FileType.Directory && !name.startsWith('.')) {
					const subDirPath = path.join(dirPath, name);
					directories.push(subDirPath);

					const subDirs = await this.scanDirectoriesRecursive(subDirPath, maxDepth - 1);
					directories.push(...subDirs);
				}
			}
		} catch (error) {
			// Ignore errors for inaccessible directories
		}

		return directories;
	}

	private async readProjectFiles(rootPath: string): Promise<ProjectFile[]> {
		const files: ProjectFile[] = [];
		const importantExtensions = ['.ts', '.js', '.tsx', '.jsx', '.json', '.md', '.html', '.css'];

		try {
			const allFiles = await this.findFilesRecursive(rootPath, importantExtensions);

			for (const filePath of allFiles.slice(0, 50)) { // Limit to first 50 files
				try {
					const uri = vscode.Uri.file(filePath);
					const content = await vscode.workspace.fs.readFile(uri);
					const stats = await vscode.workspace.fs.stat(uri);

					files.push({
						path: filePath,
						content: content.toString(),
						language: this.getLanguageFromExtension(path.extname(filePath)),
						lastModified: new Date(stats.mtime)
					});
				} catch (error) {
					// Skip files that can't be read
				}
			}
		} catch (error) {
			console.error('Error reading project files:', error);
		}

		return files;
	}

	private async findFilesRecursive(dirPath: string, extensions: string[]): Promise<string[]> {
		const files: string[] = [];

		try {
			const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(dirPath));

			for (const [name, type] of entries) {
				const fullPath = path.join(dirPath, name);

				if (type === vscode.FileType.File) {
					const ext = path.extname(name);
					if (extensions.includes(ext)) {
						files.push(fullPath);
					}
				} else if (type === vscode.FileType.Directory && !name.startsWith('.') && name !== 'node_modules') {
					const subFiles = await this.findFilesRecursive(fullPath, extensions);
					files.push(...subFiles);
				}
			}
		} catch (error) {
			// Ignore errors for inaccessible directories
		}

		return files;
	}

	private async parsePackageInfo(rootPath: string): Promise<{
		dependencies?: Record<string, string>;
		scripts?: Record<string, string>;
	}> {
		try {
			const packageJsonPath = path.join(rootPath, 'package.json');
			const uri = vscode.Uri.file(packageJsonPath);
			const content = await vscode.workspace.fs.readFile(uri);
			const packageJson = JSON.parse(content.toString());

			return {
				dependencies: {
					...packageJson.dependencies,
					...packageJson.devDependencies
				},
				scripts: packageJson.scripts
			};
		} catch (error) {
			// Try other project files (e.g., tsconfig.json, pyproject.toml)
			return {};
		}
	}

	private getLanguageFromExtension(ext: string): string {
		const languageMap: Record<string, string> = {
			'.ts': 'typescript',
			'.tsx': 'typescriptreact',
			'.js': 'javascript',
			'.jsx': 'javascriptreact',
			'.json': 'json',
			'.md': 'markdown',
			'.html': 'html',
			'.css': 'css',
			'.py': 'python',
			'.java': 'java',
			'.cs': 'csharp'
		};

		return languageMap[ext] || 'plaintext';
	}

	private setupFileWatchers(): void {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (!workspaceFolder) return;

		// Watch for file changes
		const fileWatcher = vscode.workspace.createFileSystemWatcher(
			new vscode.RelativePattern(workspaceFolder, '**/*.{ts,js,tsx,jsx,json,md}')
		);

		fileWatcher.onDidChange(this.handleFileChange.bind(this));
		fileWatcher.onDidCreate(this.handleFileCreate.bind(this));
		fileWatcher.onDidDelete(this.handleFileDelete.bind(this));

		this.watchers.push(fileWatcher);
	}

	private async handleFileChange(uri: vscode.Uri): Promise<void> {
		const change: ProjectChange = {
			id: this.generateId(),
			type: 'modify',
			file: uri.fsPath,
			changes: 'File modified',
			timestamp: new Date(),
			author: 'user' // Assume user changes for now
		};

		this.changes.push(change);
		this.emit('fileChanged', change);

		// Update file in structure if it exists
		if (this.structure) {
			const fileIndex = this.structure.files.findIndex(f => f.path === uri.fsPath);
			if (fileIndex !== -1) {
				try {
					const content = await vscode.workspace.fs.readFile(uri);
					const stats = await vscode.workspace.fs.stat(uri);

					this.structure.files[fileIndex] = {
						...this.structure.files[fileIndex],
						content: content.toString(),
						lastModified: new Date(stats.mtime)
					};
				} catch (error) {
					// Handle error
				}
			}
		}
	}

	private handleFileCreate(uri: vscode.Uri): void {
		const change: ProjectChange = {
			id: this.generateId(),
			type: 'create',
			file: uri.fsPath,
			changes: 'File created',
			timestamp: new Date(),
			author: 'user'
		};

		this.changes.push(change);
		this.emit('fileCreated', change);
	}

	private handleFileDelete(uri: vscode.Uri): void {
		const change: ProjectChange = {
			id: this.generateId(),
			type: 'delete',
			file: uri.fsPath,
			changes: 'File deleted',
			timestamp: new Date(),
			author: 'user'
		};

		this.changes.push(change);
		this.emit('fileDeleted', change);

		// Remove file from structure
		if (this.structure) {
			this.structure.files = this.structure.files.filter(f => f.path !== uri.fsPath);
		}
	}

	getSnapshot(): ProjectStructure | null {
		return this.structure ? { ...this.structure } : null;
	}

	async getCurrentFiles(): Promise<ProjectFile[]> {
		if (!this.structure) {
			await this.initialize();
		}
		return this.structure?.files || [];
	}

	getStructure(): ProjectStructure | null {
		return this.structure;
	}

	getRecentChanges(count: number = 10): ProjectChange[] {
		return this.changes.slice(-count);
	}

	async getRecentErrors(): Promise<string[]> {
		// Get diagnostic information from VS Code
		const diagnostics = vscode.languages.getDiagnostics();
		const errors: string[] = [];

		for (const [uri, diags] of diagnostics) {
			for (const diag of diags) {
				if (diag.severity === vscode.DiagnosticSeverity.Error) {
					errors.push(`${path.basename(uri.fsPath)}: ${diag.message}`);
				}
			}
		}

		return errors.slice(0, 20); // Return up to 20 recent errors
	}

	getFeatureList(): string[] {
		if (!this.structure) return [];

		const features: string[] = [];

		// Extract features from file names and structure
		this.structure.files.forEach(file => {
			const basename = path.basename(file.path, path.extname(file.path));
			const dirname = path.dirname(file.path);

			// Common feature patterns
			if (basename.includes('auth')) features.push('authentication');
			if (basename.includes('user')) features.push('user management');
			if (basename.includes('api')) features.push('api');
			if (basename.includes('dashboard')) features.push('dashboard');
			if (dirname.includes('components')) features.push('ui components');
		});

		// Extract from package.json dependencies
		Object.keys(this.structure.dependencies).forEach(dep => {
			if (dep.includes('auth')) features.push('authentication');
			if (dep.includes('test')) features.push('testing');
			if (dep.includes('react')) features.push('react ui');
			if (dep.includes('express')) features.push('web server');
		});

		return [...new Set(features)]; // Remove duplicates
	}

	addChange(change: Omit<ProjectChange, 'id' | 'timestamp'>): void {
		const completeChange: ProjectChange = {
			...change,
			id: this.generateId(),
			timestamp: new Date()
		};

		this.changes.push(completeChange);
		this.emit('changeAdded', completeChange);
	}

	private generateId(): string {
		return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	dispose(): void {
		this.watchers.forEach(watcher => watcher.dispose());
		this.watchers = [];
		this.removeAllListeners();
	}
}
