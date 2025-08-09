import { WorkspaceManifest, AiPolicy, SecretsConfig } from '../types';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream, createWriteStream } from 'fs';
import * as tar from 'tar';

export class WorkspaceManager {
	private currentWorkspace: string | null = null;
	private manifest: WorkspaceManifest | null = null;
	private readonly workspaceDir = path.join(os.homedir(), '.vsembed', 'workspaces');

	constructor() {
		this.ensureWorkspaceDirectory();
	}

	private async ensureWorkspaceDirectory(): Promise<void> {
		try {
			await fs.mkdir(this.workspaceDir, { recursive: true });
		} catch (error) {
			console.error('Failed to create workspace directory:', error);
		}
	}

	async createWorkspace(name: string, template?: string): Promise<boolean> {
		try {
			const workspaceId = uuidv4();
			const workspacePath = path.join(this.workspaceDir, workspaceId);

			// Create workspace directory structure
			await fs.mkdir(workspacePath, { recursive: true });
			await fs.mkdir(path.join(workspacePath, 'workspace'), { recursive: true });
			await fs.mkdir(path.join(workspacePath, '.devstudio'), { recursive: true });
			await fs.mkdir(path.join(workspacePath, '.devstudio', 'state'), { recursive: true });

			// Create default manifest
			const manifest: WorkspaceManifest = {
				workspace_id: workspaceId,
				name,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				runtime: 'nodejs',
				runner: 'docker',
				extensions: [],
				ai_policy: this.getDefaultAiPolicy(),
				secrets: {
					encrypted: true,
					file: '.devstudio/secrets.enc',
					provider: 'local'
				},
				version: '1.0.0'
			};

			// Apply template if specified
			if (template) {
				await this.applyTemplate(workspacePath, template);
			}

			// Save manifest
			await this.saveManifest(workspacePath, manifest);

			this.currentWorkspace = workspacePath;
			this.manifest = manifest;

			return true;
		} catch (error) {
			console.error('Failed to create workspace:', error);
			return false;
		}
	}

	async openWorkspace(workspacePath: string): Promise<boolean> {
		try {
			// Check if workspace exists and has manifest
			const manifestPath = path.join(workspacePath, '.devstudio', 'manifest.json');
			const manifestContent = await fs.readFile(manifestPath, 'utf-8');
			const manifest = JSON.parse(manifestContent) as WorkspaceManifest;

			// Validate workspace structure
			const validation = await this.validateWorkspace(workspacePath);
			if (!validation.valid) {
				console.error('Invalid workspace:', validation.errors);
				return false;
			}

			this.currentWorkspace = workspacePath;
			this.manifest = manifest;

			return true;
		} catch (error) {
			console.error('Failed to open workspace:', error);
			return false;
		}
	}

	async exportWorkspace(targetPath: string): Promise<boolean> {
		if (!this.currentWorkspace) {
			console.error('No workspace currently open');
			return false;
		}

		try {
			// Update manifest with current timestamp
			if (this.manifest) {
				this.manifest.updated_at = new Date().toISOString();
				await this.saveManifest(this.currentWorkspace, this.manifest);
			}

			// Create tar.gz archive
			await tar.create(
				{
					gzip: true,
					file: targetPath,
					cwd: path.dirname(this.currentWorkspace),
				},
				[path.basename(this.currentWorkspace)]
			);

			return true;
		} catch (error) {
			console.error('Failed to export workspace:', error);
			return false;
		}
	}

	async importWorkspace(archivePath: string): Promise<boolean> {
		try {
			const tempDir = path.join(os.tmpdir(), 'vsembed-import', uuidv4());
			await fs.mkdir(tempDir, { recursive: true });

			// Extract archive
			await tar.extract({
				file: archivePath,
				cwd: tempDir,
			});

			// Find the workspace directory in extracted content
			const contents = await fs.readdir(tempDir);
			if (contents.length !== 1) {
				throw new Error('Archive should contain exactly one workspace directory');
			}

			const extractedWorkspace = path.join(tempDir, contents[0]);

			// Validate extracted workspace
			const validation = await this.validateWorkspace(extractedWorkspace);
			if (!validation.valid) {
				throw new Error(`Invalid workspace: ${validation.errors.join(', ')}`);
			}

			// Move to workspace directory
			const manifest = await this.loadManifest(extractedWorkspace);
			const targetPath = path.join(this.workspaceDir, manifest.workspace_id);

			await fs.rename(extractedWorkspace, targetPath);

			// Clean up temp directory
			await fs.rmdir(tempDir, { recursive: true });

			return await this.openWorkspace(targetPath);
		} catch (error) {
			console.error('Failed to import workspace:', error);
			return false;
		}
	}

	async getManifest(): Promise<WorkspaceManifest | null> {
		return this.manifest;
	}

	async updateManifest(updates: Partial<WorkspaceManifest>): Promise<boolean> {
		if (!this.currentWorkspace || !this.manifest) {
			return false;
		}

		try {
			this.manifest = {
				...this.manifest,
				...updates,
				updated_at: new Date().toISOString(),
			};

			await this.saveManifest(this.currentWorkspace, this.manifest);
			return true;
		} catch (error) {
			console.error('Failed to update manifest:', error);
			return false;
		}
	}

	async validateWorkspace(workspacePath?: string): Promise<{ valid: boolean; errors: string[] }> {
		const targetPath = workspacePath || this.currentWorkspace;
		if (!targetPath) {
			return { valid: false, errors: ['No workspace path provided'] };
		}

		const errors: string[] = [];

		try {
			// Check required directories
			const requiredDirs = ['workspace', '.devstudio', '.devstudio/state'];
			for (const dir of requiredDirs) {
				const dirPath = path.join(targetPath, dir);
				try {
					const stats = await fs.stat(dirPath);
					if (!stats.isDirectory()) {
						errors.push(`${dir} is not a directory`);
					}
				} catch {
					errors.push(`Missing required directory: ${dir}`);
				}
			}

			// Check manifest
			try {
				const manifest = await this.loadManifest(targetPath);
				if (!manifest.workspace_id || !manifest.name || !manifest.version) {
					errors.push('Invalid manifest: missing required fields');
				}
			} catch {
				errors.push('Missing or invalid manifest.json');
			}

			return { valid: errors.length === 0, errors };
		} catch (error) {
			return { valid: false, errors: [`Workspace validation failed: ${error}`] };
		}
	}

	getCurrentWorkspacePath(): string | null {
		return this.currentWorkspace;
	}

	private async saveManifest(workspacePath: string, manifest: WorkspaceManifest): Promise<void> {
		const manifestPath = path.join(workspacePath, '.devstudio', 'manifest.json');
		await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
	}

	private async loadManifest(workspacePath: string): Promise<WorkspaceManifest> {
		const manifestPath = path.join(workspacePath, '.devstudio', 'manifest.json');
		const content = await fs.readFile(manifestPath, 'utf-8');
		return JSON.parse(content);
	}

	private getDefaultAiPolicy(): AiPolicy {
		return {
			auto_apply_edits: false,
			allow_terminal_commands: false,
			require_approval_for_installs: true,
			require_approval_for_destructive: true,
			allow_network_access: false,
			allowed_domains: ['localhost', '127.0.0.1'],
			max_command_timeout: 30000,
		};
	}

	private async applyTemplate(workspacePath: string, template: string): Promise<void> {
		// Template application logic would go here
		// For now, just create a simple structure based on template type
		const workspaceContentPath = path.join(workspacePath, 'workspace');

		switch (template) {
			case 'nodejs':
				await this.createNodeJsTemplate(workspaceContentPath);
				break;
			case 'python':
				await this.createPythonTemplate(workspaceContentPath);
				break;
			case 'react':
				await this.createReactTemplate(workspaceContentPath);
				break;
			default:
				// Empty template
				break;
		}
	}

	private async createNodeJsTemplate(workspacePath: string): Promise<void> {
		const packageJson = {
			name: 'my-app',
			version: '1.0.0',
			description: '',
			main: 'index.js',
			scripts: {
				start: 'node index.js',
				dev: 'node index.js',
			},
			dependencies: {},
		};

		const indexJs = `console.log('Hello from VSEmbed AI DevTool!');

// Your Node.js application starts here
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello from Node.js!</h1><p>This app is running in VSEmbed AI DevTool.</p>');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`;

		await fs.writeFile(path.join(workspacePath, 'package.json'), JSON.stringify(packageJson, null, 2));
		await fs.writeFile(path.join(workspacePath, 'index.js'), indexJs);
		await fs.writeFile(path.join(workspacePath, 'README.md'), '# My Node.js App\n\nCreated with VSEmbed AI DevTool');
	}

	private async createPythonTemplate(workspacePath: string): Promise<void> {
		const mainPy = `#!/usr/bin/env python3
"""
Hello from VSEmbed AI DevTool!
"""

import http.server
import socketserver
import os

def main():
    PORT = int(os.environ.get('PORT', 8000))

    class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'<h1>Hello from Python!</h1><p>This app is running in VSEmbed AI DevTool.</p>')

    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Server running on http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    main()
`;

		const requirementsTxt = `# Add your Python dependencies here
# requests>=2.28.0
# flask>=2.2.0
`;

		await fs.writeFile(path.join(workspacePath, 'main.py'), mainPy);
		await fs.writeFile(path.join(workspacePath, 'requirements.txt'), requirementsTxt);
		await fs.writeFile(path.join(workspacePath, 'README.md'), '# My Python App\n\nCreated with VSEmbed AI DevTool');
	}

	private async createReactTemplate(workspacePath: string): Promise<void> {
		// This would create a basic React setup
		// For now, just create a package.json that can be expanded by AI
		const packageJson = {
			name: 'my-react-app',
			version: '0.1.0',
			private: true,
			dependencies: {
				react: '^18.2.0',
				'react-dom': '^18.2.0',
				'react-scripts': '^5.0.1'
			},
			scripts: {
				start: 'react-scripts start',
				build: 'react-scripts build',
				test: 'react-scripts test',
				eject: 'react-scripts eject'
			},
			browserslist: {
				production: ['>0.2%', 'not dead', 'not op_mini all'],
				development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
			}
		};

		await fs.writeFile(path.join(workspacePath, 'package.json'), JSON.stringify(packageJson, null, 2));
		await fs.writeFile(path.join(workspacePath, 'README.md'), '# My React App\n\nCreated with VSEmbed AI DevTool');
	}
}
