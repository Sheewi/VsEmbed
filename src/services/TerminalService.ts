import { TerminalAPI, ExecutionOptions, ExecutionResult, ProcessInfo } from '../api/interfaces';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as os from 'os';

export class TerminalService implements TerminalAPI {
	private workingDirectory: string;
	private environment: { [key: string]: string };
	private runningProcesses: Map<number, ChildProcess> = new Map();

	constructor() {
		this.workingDirectory = process.cwd();
		this.environment = { ...process.env };
	}

	setWorkspacePath(workspacePath: string): void {
		this.workingDirectory = path.join(workspacePath, 'workspace');
	}

	async exec(command: string, options: ExecutionOptions): Promise<ExecutionResult> {
		const startTime = Date.now();

		try {
			// Security check
			if (options.requireApproval) {
				// In a real implementation, this would request approval
				console.log(`Command requires approval: ${command}`);
			}

			// Set up execution environment
			const execEnv = {
				...this.environment,
				...(options.env || {}),
			};

			const execCwd = options.cwd || this.workingDirectory;
			const timeout = options.timeout || 30000;

			// Execute command
			const result = await this.executeCommand(command, {
				cwd: execCwd,
				env: execEnv,
				shell: options.shell || this.getDefaultShell(),
				timeout,
			});

			const executionTime = Date.now() - startTime;

			return {
				stdout: result.stdout,
				stderr: result.stderr,
				code: result.code,
				time: executionTime,
				command,
			};
		} catch (error) {
			const executionTime = Date.now() - startTime;

			return {
				stdout: '',
				stderr: error instanceof Error ? error.message : String(error),
				code: 1,
				time: executionTime,
				command,
			};
		}
	}

	async getCwd(): Promise<string> {
		return this.workingDirectory;
	}

	async setCwd(path: string): Promise<boolean> {
		try {
			// Validate path exists
			const fs = require('fs/promises');
			await fs.access(path);

			this.workingDirectory = path;
			return true;
		} catch {
			return false;
		}
	}

	async getEnv(): Promise<{ [key: string]: string }> {
		return { ...this.environment };
	}

	async setEnv(key: string, value: string): Promise<boolean> {
		this.environment[key] = value;
		return true;
	}

	async kill(pid: number): Promise<boolean> {
		try {
			const process = this.runningProcesses.get(pid);
			if (process) {
				process.kill();
				this.runningProcesses.delete(pid);
				return true;
			}

			// Try to kill by PID directly
			process.kill(pid);
			return true;
		} catch {
			return false;
		}
	}

	async getProcesses(): Promise<ProcessInfo[]> {
		const processes: ProcessInfo[] = [];

		for (const [pid, childProcess] of this.runningProcesses) {
			if (childProcess.pid) {
				processes.push({
					pid: childProcess.pid,
					command: childProcess.spawnargs.join(' '),
					cpu: 0, // Would need ps/wmic to get actual CPU usage
					memory: 0, // Would need ps/wmic to get actual memory usage
					startTime: new Date().toISOString(), // Approximate
				});
			}
		}

		return processes;
	}

	private async executeCommand(command: string, options: {
		cwd: string;
		env: { [key: string]: string };
		shell: string;
		timeout: number;
	}): Promise<{ stdout: string; stderr: string; code: number }> {
		return new Promise((resolve, reject) => {
			let stdout = '';
			let stderr = '';

			// Parse command and arguments
			const { cmd, args } = this.parseCommand(command);

			// Spawn process
			const childProcess = spawn(cmd, args, {
				cwd: options.cwd,
				env: options.env,
				shell: options.shell,
				stdio: 'pipe',
			});

			// Track running process
			if (childProcess.pid) {
				this.runningProcesses.set(childProcess.pid, childProcess);
			}

			// Set up timeout
			const timeoutId = setTimeout(() => {
				childProcess.kill('SIGTERM');
				reject(new Error(`Command timed out after ${options.timeout}ms`));
			}, options.timeout);

			// Collect output
			if (childProcess.stdout) {
				childProcess.stdout.on('data', (data) => {
					stdout += data.toString();
				});
			}

			if (childProcess.stderr) {
				childProcess.stderr.on('data', (data) => {
					stderr += data.toString();
				});
			}

			// Handle completion
			childProcess.on('close', (code) => {
				clearTimeout(timeoutId);

				if (childProcess.pid) {
					this.runningProcesses.delete(childProcess.pid);
				}

				resolve({
					stdout: stdout.trim(),
					stderr: stderr.trim(),
					code: code || 0,
				});
			});

			// Handle errors
			childProcess.on('error', (error) => {
				clearTimeout(timeoutId);

				if (childProcess.pid) {
					this.runningProcesses.delete(childProcess.pid);
				}

				reject(error);
			});
		});
	}

	private parseCommand(command: string): { cmd: string; args: string[] } {
		// Simple command parsing (in production, use a proper shell parser)
		const parts = command.trim().split(/\s+/);
		const cmd = parts[0];
		const args = parts.slice(1);

		return { cmd, args };
	}

	private getDefaultShell(): string {
		switch (os.platform()) {
			case 'win32':
				return process.env.COMSPEC || 'cmd.exe';
			case 'darwin':
			case 'linux':
			default:
				return process.env.SHELL || '/bin/sh';
		}
	}

	// Utility methods for common operations
	async installPackages(packageManager: 'npm' | 'yarn' | 'pip', packages: string[]): Promise<ExecutionResult> {
		let command: string;

		switch (packageManager) {
			case 'npm':
				command = `npm install ${packages.join(' ')}`;
				break;
			case 'yarn':
				command = `yarn add ${packages.join(' ')}`;
				break;
			case 'pip':
				command = `pip install ${packages.join(' ')}`;
				break;
			default:
				throw new Error(`Unsupported package manager: ${packageManager}`);
		}

		return this.exec(command, {
			explanation: `Install packages: ${packages.join(', ')}`,
			requireApproval: true,
			riskLevel: 'medium',
			timeout: 120000, // 2 minutes for package installation
		});
	}

	async runScript(script: string): Promise<ExecutionResult> {
		// Detect script type by extension or shebang
		const isNodeScript = script.includes('node ') || script.includes('npm ') || script.includes('yarn ');
		const isPythonScript = script.includes('python ') || script.includes('pip ');

		let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

		if (script.includes('install') || script.includes('download')) {
			riskLevel = 'medium';
		}

		if (script.includes('sudo') || script.includes('rm -rf') || script.includes('format')) {
			riskLevel = 'critical';
		}

		return this.exec(script, {
			explanation: `Run script: ${script}`,
			requireApproval: riskLevel !== 'low',
			riskLevel,
		});
	}

	async startDevServer(command?: string): Promise<ExecutionResult> {
		const defaultCommands = [
			'npm start',
			'npm run dev',
			'yarn start',
			'yarn dev',
			'python -m http.server 8000',
			'python3 -m http.server 8000',
		];

		const serverCommand = command || this.detectStartCommand();

		return this.exec(serverCommand, {
			explanation: `Start development server: ${serverCommand}`,
			requireApproval: false,
			riskLevel: 'low',
			timeout: 60000,
		});
	}

	private detectStartCommand(): string {
		// In a real implementation, this would check package.json, requirements.txt, etc.
		// For now, default to npm start
		return 'npm start';
	}

	async checkPorts(ports: number[]): Promise<{ [port: number]: boolean }> {
		const result: { [port: number]: boolean } = {};

		for (const port of ports) {
			try {
				const command = os.platform() === 'win32'
					? `netstat -an | findstr :${port}`
					: `lsof -i :${port}`;

				const execResult = await this.exec(command, {
					explanation: `Check if port ${port} is in use`,
					requireApproval: false,
					riskLevel: 'low',
				});

				result[port] = execResult.code === 0 && execResult.stdout.length > 0;
			} catch {
				result[port] = false;
			}
		}

		return result;
	}

	async getSystemInfo(): Promise<any> {
		const info: any = {
			platform: os.platform(),
			arch: os.arch(),
			nodeVersion: process.version,
			cwd: this.workingDirectory,
		};

		try {
			// Get additional system info
			const commands = {
				git: 'git --version',
				node: 'node --version',
				npm: 'npm --version',
				python: 'python --version',
				docker: 'docker --version',
			};

			for (const [tool, command] of Object.entries(commands)) {
				try {
					const result = await this.exec(command, {
						explanation: `Check ${tool} version`,
						requireApproval: false,
						riskLevel: 'low',
						timeout: 5000,
					});

					if (result.code === 0) {
						info[`${tool}Version`] = result.stdout.trim();
					}
				} catch {
					// Tool not available
				}
			}
		} catch (error) {
			console.warn('Failed to get system info:', error);
		}

		return info;
	}
}
