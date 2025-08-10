import * as vscode from 'vscode';
import { EventEmitter } from 'events';
import * as path from 'path';
import * as http from 'http';
import * as WebSocket from 'ws';

export interface PreviewUpdate {
	type: 'reload' | 'inject' | 'style' | 'script';
	content?: string;
	timestamp: Date;
}

export interface PreviewState {
	url: string;
	isRunning: boolean;
	lastUpdate: Date;
	frameworkDetected?: string;
}

export class LivePreview extends EventEmitter {
	private server: http.Server | null = null;
	private wsServer: WebSocket.Server | null = null;
	private port = 3001;
	private isRunning = false;
	private webviewPanel: vscode.WebviewPanel | null = null;
	private lastUpdate: Date = new Date();
	private detectedFramework: string | null = null;

	constructor() {
		super();
	}

	async initialize(): Promise<void> {
		await this.detectFramework();
		await this.startPreviewServer();
		await this.createWebviewPanel();

		this.emit('initialized');
	}

	private async detectFramework(): Promise<void> {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (!workspaceFolder) return;

		try {
			const packageJsonUri = vscode.Uri.joinPath(workspaceFolder.uri, 'package.json');
			const content = await vscode.workspace.fs.readFile(packageJsonUri);
			const packageJson = JSON.parse(content.toString());

			const dependencies = {
				...packageJson.dependencies,
				...packageJson.devDependencies
			};

			// Detect framework
			if (dependencies.react) {
				this.detectedFramework = 'react';
			} else if (dependencies.vue) {
				this.detectedFramework = 'vue';
			} else if (dependencies.angular) {
				this.detectedFramework = 'angular';
			} else if (dependencies.express) {
				this.detectedFramework = 'express';
			} else {
				this.detectedFramework = 'vanilla';
			}

			this.emit('frameworkDetected', this.detectedFramework);
		} catch (error) {
			this.detectedFramework = 'unknown';
		}
	}

	private async startPreviewServer(): Promise<void> {
		if (this.isRunning) return;

		// Find available port
		this.port = await this.findAvailablePort(3001);

		// Create HTTP server
		this.server = http.createServer((req, res) => {
			this.handleHttpRequest(req, res);
		});

		// Create WebSocket server for live reload
		this.wsServer = new WebSocket.Server({ server: this.server });
		this.wsServer.on('connection', (ws) => {
			ws.send(JSON.stringify({
				type: 'connected',
				framework: this.detectedFramework
			}));
		});

		// Start server
		await new Promise<void>((resolve, reject) => {
			this.server!.listen(this.port, (err?: Error) => {
				if (err) {
					reject(err);
				} else {
					this.isRunning = true;
					resolve();
				}
			});
		});

		this.emit('serverStarted', this.port);
	}

	private async findAvailablePort(startPort: number): Promise<number> {
		return new Promise((resolve) => {
			const server = http.createServer();
			server.listen(startPort, () => {
				const port = (server.address() as any)?.port || startPort;
				server.close(() => resolve(port));
			});
			server.on('error', () => {
				resolve(this.findAvailablePort(startPort + 1));
			});
		});
	}

	private async handleHttpRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (!workspaceFolder) {
			res.writeHead(404);
			res.end('No workspace found');
			return;
		}

		try {
			let filePath = req.url === '/' ? '/index.html' : req.url || '';

			// Handle different framework entry points
			if (filePath === '/index.html') {
				if (this.detectedFramework === 'react') {
					filePath = '/public/index.html';
				} else if (this.detectedFramework === 'vue') {
					filePath = '/index.html';
				}
			}

			const fullPath = path.join(workspaceFolder.uri.fsPath, filePath);
			const uri = vscode.Uri.file(fullPath);

			// Check if file exists and serve it
			try {
				const content = await vscode.workspace.fs.readFile(uri);
				const contentType = this.getContentType(path.extname(filePath));

				res.writeHead(200, { 'Content-Type': contentType });

				// Inject live reload script for HTML files
				if (contentType === 'text/html') {
					const htmlContent = content.toString();
					const injectedContent = this.injectLiveReloadScript(htmlContent);
					res.end(injectedContent);
				} else {
					res.end(content);
				}
			} catch (error) {
				// File not found, serve default HTML
				res.writeHead(200, { 'Content-Type': 'text/html' });
				res.end(this.getDefaultHTML());
			}
		} catch (error) {
			res.writeHead(500);
			res.end('Server error');
		}
	}

	private getContentType(ext: string): string {
		const types: Record<string, string> = {
			'.html': 'text/html',
			'.js': 'application/javascript',
			'.css': 'text/css',
			'.json': 'application/json',
			'.png': 'image/png',
			'.jpg': 'image/jpeg',
			'.gif': 'image/gif',
			'.svg': 'image/svg+xml'
		};

		return types[ext] || 'text/plain';
	}

	private injectLiveReloadScript(html: string): string {
		const script = `
		<script>
			const ws = new WebSocket('ws://localhost:${this.port}');
			ws.onmessage = function(event) {
				const data = JSON.parse(event.data);
				if (data.type === 'reload') {
					window.location.reload();
				} else if (data.type === 'inject') {
					eval(data.content);
				} else if (data.type === 'style') {
					const style = document.createElement('style');
					style.textContent = data.content;
					document.head.appendChild(style);
				}
			};
			console.log('Live reload connected');
		</script>
		`;

		// Insert script before closing body tag, or at the end if no body tag
		if (html.includes('</body>')) {
			return html.replace('</body>', script + '</body>');
		} else {
			return html + script;
		}
	}

	private getDefaultHTML(): string {
		return `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Live Preview</title>
			<style>
				body {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
					max-width: 800px;
					margin: 0 auto;
					padding: 40px 20px;
					line-height: 1.6;
				}
				.status {
					background: #e3f2fd;
					border-left: 4px solid #2196f3;
					padding: 20px;
					margin: 20px 0;
				}
				.framework {
					background: #f3e5f5;
					border-left: 4px solid #9c27b0;
					padding: 20px;
					margin: 20px 0;
				}
			</style>
		</head>
		<body>
			<h1>🚀 Live Preview Server</h1>
			<div class="status">
				<h3>Status: Running</h3>
				<p>Server is running on port ${this.port}</p>
				<p>Last update: ${this.lastUpdate.toLocaleTimeString()}</p>
			</div>
			<div class="framework">
				<h3>Framework: ${this.detectedFramework || 'Unknown'}</h3>
				<p>The AI companion will automatically update this preview as you build your application.</p>
			</div>
			<h3>Features:</h3>
			<ul>
				<li>✅ Live reload on file changes</li>
				<li>✅ Framework detection</li>
				<li>✅ WebSocket communication</li>
				<li>✅ Hot code injection</li>
			</ul>
			${this.injectLiveReloadScript('')}
		</body>
		</html>
		`;
	}

	private async createWebviewPanel(): Promise<void> {
		this.webviewPanel = vscode.window.createWebviewPanel(
			'livePreview',
			'Live Preview',
			vscode.ViewColumn.Beside,
			{
				enableScripts: true,
				retainContextWhenHidden: true
			}
		);

		this.webviewPanel.webview.html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Live Preview</title>
			<style>
				body, html {
					margin: 0;
					padding: 0;
					height: 100%;
					overflow: hidden;
				}
				iframe {
					width: 100%;
					height: 100vh;
					border: none;
				}
				.toolbar {
					background: var(--vscode-editor-background);
					color: var(--vscode-editor-foreground);
					padding: 8px;
					border-bottom: 1px solid var(--vscode-panel-border);
					font-family: var(--vscode-font-family);
					font-size: 12px;
					display: flex;
					align-items: center;
					gap: 10px;
				}
				.status {
					color: #4caf50;
				}
				.refresh-btn {
					background: var(--vscode-button-background);
					color: var(--vscode-button-foreground);
					border: none;
					padding: 4px 8px;
					border-radius: 3px;
					cursor: pointer;
					font-size: 11px;
				}
			</style>
		</head>
		<body>
			<div class="toolbar">
				<span class="status">● Live</span>
				<span>localhost:${this.port}</span>
				<span>Framework: ${this.detectedFramework || 'Unknown'}</span>
				<button class="refresh-btn" onclick="document.getElementById('preview').src = document.getElementById('preview').src">Refresh</button>
			</div>
			<iframe id="preview" src="http://localhost:${this.port}"></iframe>
		</body>
		</html>
		`;

		this.webviewPanel.onDidDispose(() => {
			this.webviewPanel = null;
		});
	}

	async update(changes?: any): Promise<PreviewUpdate> {
		this.lastUpdate = new Date();

		const update: PreviewUpdate = {
			type: 'reload',
			timestamp: this.lastUpdate
		};

		// Broadcast update to all connected WebSocket clients
		if (this.wsServer) {
			this.wsServer.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(update));
				}
			});
		}

		this.emit('updated', update);
		return update;
	}

	async injectCode(code: string): Promise<void> {
		const update: PreviewUpdate = {
			type: 'inject',
			content: code,
			timestamp: new Date()
		};

		if (this.wsServer) {
			this.wsServer.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(update));
				}
			});
		}

		this.emit('codeInjected', update);
	}

	async injectCSS(css: string): Promise<void> {
		const update: PreviewUpdate = {
			type: 'style',
			content: css,
			timestamp: new Date()
		};

		if (this.wsServer) {
			this.wsServer.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(update));
				}
			});
		}

		this.emit('cssInjected', update);
	}

	getState(): PreviewState {
		return {
			url: `http://localhost:${this.port}`,
			isRunning: this.isRunning,
			lastUpdate: this.lastUpdate,
			frameworkDetected: this.detectedFramework || undefined
		};
	}

	async getUpdateInfo(): Promise<PreviewUpdate> {
		return {
			type: 'reload',
			timestamp: this.lastUpdate
		};
	}

	async stop(): Promise<void> {
		if (this.wsServer) {
			this.wsServer.close();
			this.wsServer = null;
		}

		if (this.server) {
			this.server.close();
			this.server = null;
		}

		if (this.webviewPanel) {
			this.webviewPanel.dispose();
			this.webviewPanel = null;
		}

		this.isRunning = false;
		this.emit('stopped');
	}

	dispose(): void {
		this.stop();
		this.removeAllListeners();
	}
}
