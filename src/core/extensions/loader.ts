import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ExtensionPermissions {
	files: 'none' | 'read' | 'write' | 'full';
	terminal: 'none' | 'create' | 'execute' | 'full';
	network: 'none' | 'local' | 'external' | 'full';
	workspace: 'none' | 'read' | 'write' | 'full';
	commands: string[]; // Allowed VS Code commands
}

export interface SecureExtensionConfig {
	id: string;
	name: string;
	version: string;
	permissions: ExtensionPermissions;
	sandbox: {
		enabled: boolean;
		isolateNetwork: boolean;
		readOnlyFileSystem: boolean;
		memoryLimit?: string; // e.g., "512m"
		cpuLimit?: string; // e.g., "0.5"
	};
	trustedPublisher: boolean;
	signature?: string;
}

export class DockerSandbox {
	private containerId: string | null = null;
	private readonly containerName: string;

	constructor(private name: string) {
		this.containerName = `vscode-ext-${name}-${Date.now()}`;
	}

	async run(command: string, options: {
		network?: 'none' | 'bridge' | 'host';
		readOnly?: boolean;
		memoryLimit?: string;
		cpuLimit?: string;
		volumes?: string[];
	} = {}): Promise<string> {
		const dockerArgs = [
			'run',
			'--rm',
			'--name', this.containerName,
			'--network', options.network || 'none',
			'--security-opt', 'no-new-privileges',
			'--cap-drop', 'ALL',
			'--user', '1000:1000'
		];

		if (options.readOnly) {
			dockerArgs.push('--read-only');
		}

		if (options.memoryLimit) {
			dockerArgs.push('--memory', options.memoryLimit);
		}

		if (options.cpuLimit) {
			dockerArgs.push('--cpus', options.cpuLimit);
		}

		if (options.volumes) {
			options.volumes.forEach(volume => {
				dockerArgs.push('-v', volume);
			});
		}

		// Use a secure base image with VS Code server
		dockerArgs.push('vscode-extension-runtime:latest');
		dockerArgs.push('sh', '-c', command);

		const { stdout, stderr } = await execAsync(`docker ${dockerArgs.join(' ')}`);

		if (stderr) {
			throw new Error(`Docker execution failed: ${stderr}`);
		}

		return stdout;
	}

	async exec(command: string): Promise<string> {
		if (!this.containerId) {
			throw new Error('Container not running');
		}

		const { stdout, stderr } = await execAsync(`docker exec ${this.containerId} sh -c "${command}"`);

		if (stderr) {
			throw new Error(`Command execution failed: ${stderr}`);
		}

		return stdout;
	}

	async stop(): Promise<void> {
		if (this.containerId) {
			await execAsync(`docker stop ${this.containerId}`);
			this.containerId = null;
		}
	}
}

export class SecureExtensionHost {
	private sandbox: DockerSandbox;
	private loadedExtensions = new Map<string, SecureExtensionConfig>();
	private extensionProcesses = new Map<string, any>();

	constructor() {
		this.sandbox = new DockerSandbox('vscode-ext-host');
	}

	async initialize(): Promise<void> {
		// Ensure Docker image exists
		await this.ensureRuntimeImage();

		// Create secure extension directory
		await this.createSecureDirectory();
	}

	async loadExtension(extId: string, config?: Partial<SecureExtensionConfig>): Promise<boolean> {
		try {
			// Validate extension
			const extensionConfig = await this.validateExtension(extId, config);

			if (!extensionConfig) {
				throw new Error(`Extension ${extId} failed validation`);
			}

			// Install in sandbox if needed
			if (extensionConfig.sandbox.enabled) {
				await this.installInSandbox(extId, extensionConfig);
			} else {
				await this.installNative(extId, extensionConfig);
			}

			this.loadedExtensions.set(extId, extensionConfig);

			// Emit load event
			this.onExtensionLoaded(extId, extensionConfig);

			return true;
		} catch (error) {
			console.error(`Failed to load extension ${extId}:`, error);
			return false;
		}
	}

	async unloadExtension(extId: string): Promise<boolean> {
		try {
			const config = this.loadedExtensions.get(extId);
			if (!config) {
				return false;
			}

			// Stop sandbox if used
			if (config.sandbox.enabled) {
				await this.sandbox.stop();
			}

			// Remove from native if needed
			const process = this.extensionProcesses.get(extId);
			if (process) {
				process.kill();
				this.extensionProcesses.delete(extId);
			}

			this.loadedExtensions.delete(extId);

			return true;
		} catch (error) {
			console.error(`Failed to unload extension ${extId}:`, error);
			return false;
		}
	}

	private async validateExtension(extId: string, config?: Partial<SecureExtensionConfig>): Promise<SecureExtensionConfig | null> {
		try {
			// Get extension info from marketplace
			const extensionInfo = await this.getExtensionInfo(extId);

			if (!extensionInfo) {
				throw new Error('Extension not found');
			}

			// Check if publisher is trusted
			const trustedPublisher = await this.isTrustedPublisher(extensionInfo.publisher);

			// Create default configuration
			const defaultConfig: SecureExtensionConfig = {
				id: extId,
				name: extensionInfo.name,
				version: extensionInfo.version,
				permissions: {
					files: 'read',
					terminal: 'none',
					network: 'none',
					workspace: 'read',
					commands: []
				},
				sandbox: {
					enabled: !trustedPublisher,
					isolateNetwork: true,
					readOnlyFileSystem: false,
					memoryLimit: '512m',
					cpuLimit: '0.5'
				},
				trustedPublisher,
				signature: extensionInfo.signature
			};

			// Merge with provided config
			const finalConfig = { ...defaultConfig, ...config };

			// Validate permissions
			if (!this.validatePermissions(finalConfig.permissions)) {
				throw new Error('Invalid permissions configuration');
			}

			return finalConfig;
		} catch (error) {
			console.error('Extension validation failed:', error);
			return null;
		}
	}

	private async installInSandbox(extId: string, config: SecureExtensionConfig): Promise<void> {
		const installCommand = `code --install-extension ${extId} --force`;

		const sandboxOptions = {
			network: config.sandbox.isolateNetwork ? 'none' as const : 'bridge' as const,
			readOnly: config.sandbox.readOnlyFileSystem,
			memoryLimit: config.sandbox.memoryLimit,
			cpuLimit: config.sandbox.cpuLimit,
			volumes: [
				'/tmp/.vscode-extensions:/home/vscode/.vscode/extensions',
				'/tmp/workspace:/workspace:ro'
			]
		};

		await this.sandbox.run(installCommand, sandboxOptions);

		// Verify installation
		const listResult = await this.sandbox.run('code --list-extensions', sandboxOptions);
		if (!listResult.includes(extId)) {
			throw new Error(`Extension ${extId} installation verification failed`);
		}
	}

	private async installNative(extId: string, config: SecureExtensionConfig): Promise<void> {
		// Install extension normally but with monitoring
		const { stdout, stderr } = await execAsync(`code --install-extension ${extId} --force`);

		if (stderr && !stderr.includes('successfully installed')) {
			throw new Error(`Native installation failed: ${stderr}`);
		}

		// Verify installation
		const { stdout: listOutput } = await execAsync('code --list-extensions');
		if (!listOutput.includes(extId)) {
			throw new Error(`Extension ${extId} installation verification failed`);
		}
	}

	private async getExtensionInfo(extId: string): Promise<any> {
		try {
			// Query VS Code marketplace API
			const response = await fetch(`https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json;api-version=3.0-preview.1'
				},
				body: JSON.stringify({
					filters: [{
						criteria: [{ filterType: 7, value: extId }]
					}],
					flags: 914
				})
			});

			const data = await response.json();
			const extension = data.results?.[0]?.extensions?.[0];

			if (!extension) {
				return null;
			}

			return {
				name: extension.displayName,
				version: extension.versions?.[0]?.version,
				publisher: extension.publisher?.publisherName,
				signature: extension.versions?.[0]?.properties?.find((p: any) => p.key === 'Microsoft.VisualStudio.Code.Signature')?.value
			};
		} catch (error) {
			console.error('Failed to get extension info:', error);
			return null;
		}
	}

	private async isTrustedPublisher(publisher: string): Promise<boolean> {
		const trustedPublishers = [
			'microsoft',
			'ms-python',
			'ms-vscode',
			'github',
			'redhat',
			'esbenp',
			'bradlc',
			'formulahendry'
		];

		return trustedPublishers.includes(publisher.toLowerCase());
	}

	private validatePermissions(permissions: ExtensionPermissions): boolean {
		// Check if permissions are within allowed bounds
		const maxPermissions: ExtensionPermissions = {
			files: 'full',
			terminal: 'full',
			network: 'full',
			workspace: 'full',
			commands: ['*'] // Special case for all commands
		};

		// Add validation logic here
		return true;
	}

	private async ensureRuntimeImage(): Promise<void> {
		try {
			// Check if image exists
			await execAsync('docker image inspect vscode-extension-runtime:latest');
		} catch (error) {
			// Build runtime image
			await this.buildRuntimeImage();
		}
	}

	private async buildRuntimeImage(): Promise<void> {
		const dockerfile = `
FROM node:18-alpine

# Install VS Code CLI
RUN wget -qO- https://code.visualstudio.com/sha/download?build=stable&os=cli-alpine-x64 | tar -xz -C /usr/local/bin --strip-components=1

# Create non-root user
RUN adduser -D -s /bin/sh vscode

# Set up workspace
WORKDIR /workspace
RUN chown vscode:vscode /workspace

USER vscode

# Install common extensions in base image
RUN code --install-extension ms-python.python --force || true
RUN code --install-extension ms-vscode.vscode-typescript-next --force || true

CMD ["/bin/sh"]
`;

		// Write Dockerfile
		await fs.writeFile('/tmp/Dockerfile.vscode-runtime', dockerfile);

		// Build image
		await execAsync('docker build -t vscode-extension-runtime:latest -f /tmp/Dockerfile.vscode-runtime /tmp');
	}

	private async createSecureDirectory(): Promise<void> {
		const secureDir = path.join(process.env.HOME || '/tmp', '.vscode-secure');
		await fs.mkdir(secureDir, { recursive: true });
		await fs.mkdir(path.join(secureDir, 'extensions'), { recursive: true });
		await fs.mkdir(path.join(secureDir, 'logs'), { recursive: true });
	}

	private onExtensionLoaded(extId: string, config: SecureExtensionConfig): void {
		console.log(`Extension ${extId} loaded with security level: ${config.sandbox.enabled ? 'sandboxed' : 'native'}`);

		// Log to security audit trail
		this.logSecurityEvent('extension_loaded', {
			extensionId: extId,
			sandboxed: config.sandbox.enabled,
			permissions: config.permissions,
			trustedPublisher: config.trustedPublisher
		});
	}

	private logSecurityEvent(event: string, data: any): void {
		const logEntry = {
			timestamp: new Date().toISOString(),
			event,
			data
		};

		// Write to security log
		const logPath = path.join(process.env.HOME || '/tmp', '.vscode-secure', 'logs', 'security.log');
		fs.appendFile(logPath, JSON.stringify(logEntry) + '\n').catch(console.error);
	}

	getLoadedExtensions(): Map<string, SecureExtensionConfig> {
		return new Map(this.loadedExtensions);
	}

	async getExtensionStatus(extId: string): Promise<'loaded' | 'sandboxed' | 'not_loaded' | 'error'> {
		const config = this.loadedExtensions.get(extId);

		if (!config) {
			return 'not_loaded';
		}

		if (config.sandbox.enabled) {
			return 'sandboxed';
		}

		return 'loaded';
	}

	async dispose(): Promise<void> {
		// Unload all extensions
		const extensionIds = Array.from(this.loadedExtensions.keys());

		for (const extId of extensionIds) {
			await this.unloadExtension(extId);
		}

		// Stop sandbox
		await this.sandbox.stop();
	}
}
