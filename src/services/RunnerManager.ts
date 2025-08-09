import { RunnerAPI } from '../api/interfaces';
import { RunnerConfig, RunnerStatus, BuildResult } from '../types';
import { TerminalService } from './TerminalService';
import * as Docker from 'dockerode';
import * as path from 'path';
import * as fs from 'fs/promises';

export class RunnerManager implements RunnerAPI {
	private docker: Docker | null = null;
	private currentContainer: Docker.Container | null = null;
	private currentStatus: RunnerStatus;
	private terminalService: TerminalService;
	private workspacePath: string | null = null;

	constructor() {
		this.terminalService = new TerminalService();
		this.currentStatus = {
			running: false,
			ports: {},
			resource_usage: {
				cpu_percent: 0,
				memory_mb: 0,
				disk_mb: 0,
			},
			last_build: {
				success: false,
				output: '',
				errors: [],
				warnings: [],
				artifacts: [],
			},
		};

		this.initializeDocker();
	}

	setWorkspacePath(workspacePath: string): void {
		this.workspacePath = workspacePath;
		this.terminalService.setWorkspacePath(workspacePath);
	}

	private async initializeDocker(): Promise<void> {
		try {
			this.docker = new Docker();

			// Test Docker connection
			await this.docker.ping();
			console.log('Docker connection established');
		} catch (error) {
			console.warn('Docker not available, falling back to local runner:', error);
			this.docker = null;
		}
	}

	async build(config?: RunnerConfig): Promise<BuildResult> {
		try {
			const buildConfig = config || await this.getDefaultConfig();

			let buildResult: BuildResult;

			if (this.docker && buildConfig.type === 'docker') {
				buildResult = await this.buildWithDocker(buildConfig);
			} else {
				buildResult = await this.buildLocally(buildConfig);
			}

			this.currentStatus.last_build = buildResult;
			return buildResult;
		} catch (error) {
			const buildResult: BuildResult = {
				success: false,
				output: '',
				errors: [error instanceof Error ? error.message : String(error)],
				warnings: [],
				artifacts: [],
			};

			this.currentStatus.last_build = buildResult;
			return buildResult;
		}
	}

	async start(config?: RunnerConfig): Promise<RunnerStatus> {
		try {
			const runConfig = config || await this.getDefaultConfig();

			if (this.docker && runConfig.type === 'docker') {
				await this.startWithDocker(runConfig);
			} else {
				await this.startLocally(runConfig);
			}

			this.currentStatus.running = true;
			return this.currentStatus;
		} catch (error) {
			console.error('Failed to start runner:', error);
			this.currentStatus.running = false;
			throw error;
		}
	}

	async stop(): Promise<boolean> {
		try {
			if (this.currentContainer) {
				await this.currentContainer.stop();
				await this.currentContainer.remove();
				this.currentContainer = null;
			}

			// Kill any local processes
			const processes = await this.terminalService.getProcesses();
			for (const proc of processes) {
				await this.terminalService.kill(proc.pid);
			}

			this.currentStatus.running = false;
			this.currentStatus.ports = {};

			return true;
		} catch (error) {
			console.error('Failed to stop runner:', error);
			return false;
		}
	}

	async status(): Promise<RunnerStatus> {
		if (this.currentContainer) {
			try {
				const containerInfo = await this.currentContainer.inspect();
				this.currentStatus.running = containerInfo.State.Running;

				// Get resource usage
				const stats = await this.currentContainer.stats({ stream: false });
				this.updateResourceUsage(stats);
			} catch (error) {
				console.warn('Failed to get container status:', error);
				this.currentStatus.running = false;
			}
		}

		return { ...this.currentStatus };
	}

	async exposePort(localPort: number, containerPort: number): Promise<boolean> {
		try {
			this.currentStatus.ports[localPort] = containerPort;

			// Update preview URL if this is the main port
			if (!this.currentStatus.preview_url || localPort === 3000 || localPort === 8000) {
				this.currentStatus.preview_url = `http://localhost:${localPort}`;
			}

			return true;
		} catch (error) {
			console.error('Failed to expose port:', error);
			return false;
		}
	}

	async getLogs(lines: number = 100): Promise<string> {
		try {
			if (this.currentContainer) {
				const logs = await this.currentContainer.logs({
					stdout: true,
					stderr: true,
					tail: lines,
					timestamps: true,
				});
				return logs.toString();
			}

			// For local runner, return recent terminal output
			return 'Local runner logs not implemented yet';
		} catch (error) {
			console.error('Failed to get logs:', error);
			return `Error getting logs: ${error}`;
		}
	}

	async restart(): Promise<RunnerStatus> {
		await this.stop();
		return await this.start();
	}

	private async buildWithDocker(config: RunnerConfig): Promise<BuildResult> {
		if (!this.docker || !this.workspacePath) {
			throw new Error('Docker not available or workspace not set');
		}

		const buildOutput: string[] = [];
		const errors: string[] = [];
		const warnings: string[] = [];

		try {
			// Create Dockerfile if it doesn't exist
			await this.ensureDockerfile(config);

			// Build Docker image
			const buildContext = path.join(this.workspacePath, 'workspace');
			const tarStream = await this.createBuildContext(buildContext);

			const buildStream = await this.docker.buildImage(tarStream, {
				t: `vsembed-workspace:${Date.now()}`,
				dockerfile: 'Dockerfile',
			});

			// Parse build output
			await new Promise<void>((resolve, reject) => {
				this.docker!.modem.followProgress(buildStream, (err, res) => {
					if (err) reject(err);
					else resolve();
				}, (event) => {
					if (event.stream) {
						buildOutput.push(event.stream);

						if (event.stream.toLowerCase().includes('warning')) {
							warnings.push(event.stream.trim());
						}
					}

					if (event.error) {
						errors.push(event.error);
					}
				});
			});

			return {
				success: errors.length === 0,
				output: buildOutput.join(''),
				errors,
				warnings,
				artifacts: ['Docker image built successfully'],
			};
		} catch (error) {
			errors.push(error instanceof Error ? error.message : String(error));

			return {
				success: false,
				output: buildOutput.join(''),
				errors,
				warnings,
				artifacts: [],
			};
		}
	}

	private async buildLocally(config: RunnerConfig): Promise<BuildResult> {
		const buildCommands = this.getBuildCommands(config);
		let allOutput = '';
		const errors: string[] = [];
		const warnings: string[] = [];

		for (const command of buildCommands) {
			try {
				const result = await this.terminalService.exec(command, {
					explanation: `Build step: ${command}`,
					requireApproval: false,
					riskLevel: 'low',
					timeout: 300000, // 5 minutes
				});

				allOutput += result.stdout + '\n' + result.stderr + '\n';

				if (result.code !== 0) {
					errors.push(`Command failed: ${command}\n${result.stderr}`);
				}

				// Check for warnings in output
				if (result.stderr && result.stderr.toLowerCase().includes('warning')) {
					warnings.push(result.stderr);
				}
			} catch (error) {
				errors.push(`Failed to execute ${command}: ${error}`);
			}
		}

		return {
			success: errors.length === 0,
			output: allOutput,
			errors,
			warnings,
			artifacts: ['Local build completed'],
		};
	}

	private async startWithDocker(config: RunnerConfig): Promise<void> {
		if (!this.docker) {
			throw new Error('Docker not available');
		}

		// Stop existing container
		if (this.currentContainer) {
			await this.stop();
		}

		// Create and start new container
		const portBindings: { [key: string]: any } = {};
		for (const [localPort, containerPort] of Object.entries(config.ports)) {
			portBindings[`${containerPort}/tcp`] = [{ HostPort: localPort.toString() }];
		}

		this.currentContainer = await this.docker.createContainer({
			Image: config.image || 'node:18-alpine',
			WorkingDir: '/workspace',
			Cmd: this.getStartCommand(config),
			Env: Object.entries(config.environment).map(([key, value]) => `${key}=${value}`),
			HostConfig: {
				PortBindings: portBindings,
				Memory: this.parseMemoryLimit(config.resource_limits.memory),
				CpuQuota: this.parseCpuLimit(config.resource_limits.cpu),
				Binds: [`${path.join(this.workspacePath!, 'workspace')}:/workspace`],
			},
			ExposedPorts: Object.fromEntries(
				Object.values(config.ports).map(port => [`${port}/tcp`, {}])
			),
		});

		await this.currentContainer.start();

		// Update status
		for (const [localPort, containerPort] of Object.entries(config.ports)) {
			this.currentStatus.ports[parseInt(localPort)] = containerPort;
		}
	}

	private async startLocally(config: RunnerConfig): Promise<void> {
		const startCommands = this.getStartCommands(config);

		for (const command of startCommands) {
			try {
				// Start command in background for servers
				const isServerCommand = command.includes('start') || command.includes('serve') || command.includes('server');

				if (isServerCommand) {
					// Don't await server commands - they run indefinitely
					this.terminalService.exec(command, {
						explanation: `Start server: ${command}`,
						requireApproval: false,
						riskLevel: 'low',
						timeout: 0, // No timeout for servers
					}).catch(console.error);
				} else {
					await this.terminalService.exec(command, {
						explanation: `Start command: ${command}`,
						requireApproval: false,
						riskLevel: 'low',
					});
				}
			} catch (error) {
				console.error(`Failed to execute start command ${command}:`, error);
			}
		}

		// Set up default ports for local development
		this.currentStatus.ports = config.ports;
		if (Object.keys(config.ports).length > 0) {
			const firstPort = Object.keys(config.ports)[0];
			this.currentStatus.preview_url = `http://localhost:${firstPort}`;
		}
	}

	private async getDefaultConfig(): Promise<RunnerConfig> {
		const runtime = await this.detectRuntime();

		return {
			type: this.docker ? 'docker' : 'local',
			image: this.getDefaultImage(runtime),
			ports: this.getDefaultPorts(runtime),
			environment: {
				NODE_ENV: 'development',
				PORT: '3000',
				...process.env,
			},
			working_directory: '/workspace',
			resource_limits: {
				cpu: '1.0',
				memory: '512m',
				disk: '1g',
			},
			network_policy: {
				enabled: true,
				allowed_hosts: ['localhost', '127.0.0.1'],
			},
		};
	}

	private async detectRuntime(): Promise<string> {
		if (!this.workspacePath) return 'nodejs';

		try {
			const workspaceContent = path.join(this.workspacePath, 'workspace');

			// Check for package.json (Node.js)
			try {
				await fs.access(path.join(workspaceContent, 'package.json'));
				return 'nodejs';
			} catch { }

			// Check for requirements.txt (Python)
			try {
				await fs.access(path.join(workspaceContent, 'requirements.txt'));
				return 'python';
			} catch { }

			// Check for main.py (Python)
			try {
				await fs.access(path.join(workspaceContent, 'main.py'));
				return 'python';
			} catch { }

			// Default to Node.js
			return 'nodejs';
		} catch {
			return 'nodejs';
		}
	}

	private getDefaultImage(runtime: string): string {
		const images = {
			nodejs: 'node:18-alpine',
			python: 'python:3.11-alpine',
			docker: 'alpine:latest',
		};

		return images[runtime] || images.nodejs;
	}

	private getDefaultPorts(runtime: string): { [localPort: number]: number } {
		switch (runtime) {
			case 'nodejs':
				return { 3000: 3000 };
			case 'python':
				return { 8000: 8000 };
			default:
				return { 3000: 3000 };
		}
	}

	private getBuildCommands(config: RunnerConfig): string[] {
		// Detect project type and return appropriate build commands
		if (config.environment.NODE_ENV) {
			return ['npm install', 'npm run build'];
		}

		// Python projects
		return ['pip install -r requirements.txt'];
	}

	private getStartCommands(config: RunnerConfig): string[] {
		// Detect project type and return appropriate start commands
		if (config.environment.NODE_ENV) {
			return ['npm start'];
		}

		// Python projects
		return ['python main.py'];
	}

	private getStartCommand(config: RunnerConfig): string[] {
		return this.getStartCommands(config);
	}

	private async ensureDockerfile(config: RunnerConfig): Promise<void> {
		if (!this.workspacePath) return;

		const dockerfilePath = path.join(this.workspacePath, 'workspace', 'Dockerfile');

		try {
			await fs.access(dockerfilePath);
			// Dockerfile exists, no need to create
		} catch {
			// Create default Dockerfile
			const dockerfile = this.generateDockerfile(config);
			await fs.writeFile(dockerfilePath, dockerfile);
		}
	}

	private generateDockerfile(config: RunnerConfig): string {
		const runtime = config.image?.includes('node') ? 'nodejs' : 'python';

		if (runtime === 'nodejs') {
			return `FROM ${config.image || 'node:18-alpine'}

WORKDIR /workspace

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`;
		} else {
			return `FROM ${config.image || 'python:3.11-alpine'}

WORKDIR /workspace

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]
`;
		}
	}

	private async createBuildContext(contextPath: string): Promise<NodeJS.ReadableStream> {
		const tar = require('tar');

		return tar.create({
			gzip: false,
			cwd: contextPath,
		}, ['.']);
	}

	private parseMemoryLimit(limit: string): number {
		const match = limit.match(/(\d+)([kmg]?)/i);
		if (!match) return 512 * 1024 * 1024; // Default 512MB

		const value = parseInt(match[1]);
		const unit = match[2]?.toLowerCase() || '';

		switch (unit) {
			case 'k': return value * 1024;
			case 'm': return value * 1024 * 1024;
			case 'g': return value * 1024 * 1024 * 1024;
			default: return value;
		}
	}

	private parseCpuLimit(limit: string): number {
		const value = parseFloat(limit);
		return Math.floor(value * 100000); // Docker CPU quota in microseconds
	}

	private updateResourceUsage(stats: any): void {
		try {
			// Parse Docker stats
			const cpuPercent = this.calculateCpuPercent(stats);
			const memoryMB = stats.memory_stats?.usage ?
				Math.round(stats.memory_stats.usage / (1024 * 1024)) : 0;

			this.currentStatus.resource_usage = {
				cpu_percent: cpuPercent,
				memory_mb: memoryMB,
				disk_mb: 0, // Docker doesn't provide disk usage easily
			};
		} catch (error) {
			console.warn('Failed to update resource usage:', error);
		}
	}

	private calculateCpuPercent(stats: any): number {
		try {
			const cpuDelta = stats.cpu_stats.cpu_usage.total_usage -
				(stats.precpu_stats?.cpu_usage?.total_usage || 0);
			const systemDelta = stats.cpu_stats.system_cpu_usage -
				(stats.precpu_stats?.system_cpu_usage || 0);

			if (systemDelta > 0 && cpuDelta > 0) {
				return Math.round((cpuDelta / systemDelta) * 100);
			}

			return 0;
		} catch {
			return 0;
		}
	}
}
