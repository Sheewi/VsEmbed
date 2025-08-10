import * as vscode from 'vscode';
import { execSync, spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface CommandAuditLog {
	timestamp: string;
	command: string;
	user: string;
	dangerous: boolean;
	confirmed: boolean;
	result: 'success' | 'error' | 'cancelled';
	output?: string;
	error?: string;
}

export class AITerminal {
	private readonly channel: vscode.OutputChannel;
	private readonly auditLog: CommandAuditLog[] = [];
	private readonly dangerousCommands = [
		'rm -rf',
		'chmod 777',
		'sudo',
		'dd if=',
		'mkfs',
		'fdisk',
		'format',
		'> /dev/',
		'curl.*|.*sh',
		'wget.*|.*sh',
		'eval',
		'exec',
		'$((',
		'nc -l',
		'python -c.*import.*os'
	];

	constructor() {
		this.channel = vscode.window.createOutputChannel('AI Commands', {
			log: true // Enable command auditing
		});
	}

	async execute(cmd: string, options: {
		confirmDangerous?: boolean;
		timeout?: number;
		cwd?: string;
		env?: Record<string, string>;
		sandboxed?: boolean;
	} = {}): Promise<{ success: boolean; output: string; error?: string }> {
		const {
			confirmDangerous = true,
			timeout = 30000,
			cwd = process.cwd(),
			env = process.env,
			sandboxed = false
		} = options;

		const isDangerous = this.isDangerousCommand(cmd);

		// Log command attempt
		const auditEntry: CommandAuditLog = {
			timestamp: new Date().toISOString(),
			command: cmd,
			user: process.env.USER || 'unknown',
			dangerous: isDangerous,
			confirmed: false,
			result: 'cancelled'
		};

		try {
			// Check for dangerous commands
			if (isDangerous && confirmDangerous) {
				const confirmed = await this.showWarningDialog(cmd);
				auditEntry.confirmed = confirmed;

				if (!confirmed) {
					this.channel.appendLine(`⚠️  Command cancelled by user: ${cmd}`);
					this.auditLog.push(auditEntry);
					return { success: false, output: '', error: 'Cancelled by user' };
				}
			}

			this.channel.appendLine(`$ ${cmd}`);

			let result: { success: boolean; output: string; error?: string };

			if (sandboxed) {
				result = await this.executeSandboxed(cmd, { timeout, cwd, env });
			} else {
				result = await this.executeNative(cmd, { timeout, cwd, env });
			}

			auditEntry.result = result.success ? 'success' : 'error';
			auditEntry.output = result.output;
			auditEntry.error = result.error;

			this.auditLog.push(auditEntry);

			// Log output
			if (result.success) {
				this.channel.appendLine(result.output);
			} else {
				this.channel.appendLine(`❌ Error: ${result.error}`);
			}

			return result;

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			auditEntry.result = 'error';
			auditEntry.error = errorMessage;
			this.auditLog.push(auditEntry);

			this.channel.appendLine(`❌ Execution failed: ${errorMessage}`);
			return { success: false, output: '', error: errorMessage };
		}
	}

	private isDangerousCommand(cmd: string): boolean {
		const lowercaseCmd = cmd.toLowerCase();
		return this.dangerousCommands.some(pattern => {
			if (pattern.includes('*')) {
				// Use regex for wildcard patterns
				const regexPattern = pattern.replace(/\*/g, '.*');
				return new RegExp(regexPattern).test(lowercaseCmd);
			}
			return lowercaseCmd.includes(pattern);
		});
	}

	private async showWarningDialog(cmd: string): Promise<boolean> {
		const choice = await vscode.window.showWarningMessage(
			`⚠️ Dangerous Command Detected\n\nThe following command could be harmful:\n${cmd}\n\nAre you sure you want to execute it?`,
			{ modal: true },
			'Execute Anyway',
			'Cancel'
		);

		return choice === 'Execute Anyway';
	}

	private async executeNative(cmd: string, options: {
		timeout: number;
		cwd: string;
		env: Record<string, string>;
	}): Promise<{ success: boolean; output: string; error?: string }> {
		return new Promise((resolve) => {
			const process = spawn('sh', ['-c', cmd], {
				cwd: options.cwd,
				env: options.env,
				stdio: ['pipe', 'pipe', 'pipe']
			});

			let output = '';
			let error = '';

			const timeout = setTimeout(() => {
				process.kill('SIGTERM');
				resolve({
					success: false,
					output,
					error: 'Command timed out'
				});
			}, options.timeout);

			process.stdout?.on('data', (data) => {
				output += data.toString();
			});

			process.stderr?.on('data', (data) => {
				error += data.toString();
			});

			process.on('close', (code) => {
				clearTimeout(timeout);
				resolve({
					success: code === 0,
					output: output.trim(),
					error: error.trim() || undefined
				});
			});

			process.on('error', (err) => {
				clearTimeout(timeout);
				resolve({
					success: false,
					output,
					error: err.message
				});
			});
		});
	}

	private async executeSandboxed(cmd: string, options: {
		timeout: number;
		cwd: string;
		env: Record<string, string>;
	}): Promise<{ success: boolean; output: string; error?: string }> {
		// Use Docker for sandboxed execution
		const dockerCmd = [
			'docker', 'run',
			'--rm',
			'--network', 'none',
			'--security-opt', 'no-new-privileges',
			'--cap-drop', 'ALL',
			'--read-only',
			'--tmpfs', '/tmp',
			'--user', '1000:1000',
			'--workdir', '/workspace',
			'-v', `${options.cwd}:/workspace:ro`,
			'alpine:latest',
			'sh', '-c', cmd
		].join(' ');

		return this.executeNative(dockerCmd, options);
	}

	async executeVSCodeCommand(commandId: string, ...args: any[]): Promise<any> {
		try {
			this.channel.appendLine(`🔧 Executing VS Code command: ${commandId}`);

			const result = await vscode.commands.executeCommand(commandId, ...args);

			this.channel.appendLine(`✅ Command executed successfully`);

			// Log command execution
			this.auditLog.push({
				timestamp: new Date().toISOString(),
				command: `vscode:${commandId}`,
				user: process.env.USER || 'unknown',
				dangerous: false,
				confirmed: true,
				result: 'success'
			});

			return result;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			this.channel.appendLine(`❌ VS Code command failed: ${errorMessage}`);

			this.auditLog.push({
				timestamp: new Date().toISOString(),
				command: `vscode:${commandId}`,
				user: process.env.USER || 'unknown',
				dangerous: false,
				confirmed: true,
				result: 'error',
				error: errorMessage
			});

			throw error;
		}
	}

	async runInTerminal(cmd: string, options: {
		name?: string;
		cwd?: string;
		env?: Record<string, string>;
		show?: boolean;
	} = {}): Promise<vscode.Terminal> {
		const terminalOptions: vscode.TerminalOptions = {
			name: options.name || 'AI Terminal',
			cwd: options.cwd,
			env: options.env
		};

		const terminal = vscode.window.createTerminal(terminalOptions);

		if (options.show !== false) {
			terminal.show();
		}

		// Log terminal creation
		this.channel.appendLine(`📺 Created terminal: ${terminalOptions.name}`);

		// Send command to terminal
		terminal.sendText(cmd);

		// Log command
		this.auditLog.push({
			timestamp: new Date().toISOString(),
			command: `terminal:${cmd}`,
			user: process.env.USER || 'unknown',
			dangerous: this.isDangerousCommand(cmd),
			confirmed: true,
			result: 'success'
		});

		return terminal;
	}

	async installPackage(packageManager: 'npm' | 'pip' | 'cargo' | 'go', packageName: string): Promise<boolean> {
		const commands: Record<string, string> = {
			npm: `npm install ${packageName}`,
			pip: `pip install ${packageName}`,
			cargo: `cargo install ${packageName}`,
			go: `go install ${packageName}`
		};

		const cmd = commands[packageManager];
		if (!cmd) {
			throw new Error(`Unsupported package manager: ${packageManager}`);
		}

		this.channel.appendLine(`📦 Installing package: ${packageName} via ${packageManager}`);

		const result = await this.execute(cmd, {
			confirmDangerous: false,
			timeout: 120000, // 2 minutes for package installation
			sandboxed: false // Package installation usually needs network access
		});

		if (result.success) {
			this.channel.appendLine(`✅ Package ${packageName} installed successfully`);
		} else {
			this.channel.appendLine(`❌ Failed to install package ${packageName}: ${result.error}`);
		}

		return result.success;
	}

	async getAuditLog(): Promise<CommandAuditLog[]> {
		return [...this.auditLog];
	}

	async exportAuditLog(filePath?: string): Promise<string> {
		const logPath = filePath || path.join(process.cwd(), `ai-terminal-audit-${Date.now()}.json`);

		const logData = {
			exportTime: new Date().toISOString(),
			totalCommands: this.auditLog.length,
			dangerousCommands: this.auditLog.filter(log => log.dangerous).length,
			failedCommands: this.auditLog.filter(log => log.result === 'error').length,
			log: this.auditLog
		};

		await fs.writeFile(logPath, JSON.stringify(logData, null, 2));

		this.channel.appendLine(`📄 Audit log exported to: ${logPath}`);

		return logPath;
	}

	clearAuditLog(): void {
		this.auditLog.length = 0;
		this.channel.appendLine(`🧹 Audit log cleared`);
	}

	show(): void {
		this.channel.show();
	}

	dispose(): void {
		this.channel.dispose();
	}

	// Security analysis methods
	async analyzeCommands(): Promise<{
		totalCommands: number;
		dangerousCommands: number;
		failureRate: number;
		mostUsedCommands: string[];
		recentActivity: CommandAuditLog[];
	}> {
		const total = this.auditLog.length;
		const dangerous = this.auditLog.filter(log => log.dangerous).length;
		const failed = this.auditLog.filter(log => log.result === 'error').length;

		// Count command frequency
		const commandCounts = new Map<string, number>();
		this.auditLog.forEach(log => {
			const baseCmd = log.command.split(' ')[0];
			commandCounts.set(baseCmd, (commandCounts.get(baseCmd) || 0) + 1);
		});

		const mostUsed = Array.from(commandCounts.entries())
			.sort(([, a], [, b]) => b - a)
			.slice(0, 5)
			.map(([cmd]) => cmd);

		const recent = this.auditLog.slice(-10);

		return {
			totalCommands: total,
			dangerousCommands: dangerous,
			failureRate: total > 0 ? failed / total : 0,
			mostUsedCommands: mostUsed,
			recentActivity: recent
		};
	}

	async showSecurityReport(): Promise<void> {
		const analysis = await this.analyzeCommands();

		const report = `
📊 AI Terminal Security Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Statistics:
• Total Commands: ${analysis.totalCommands}
• Dangerous Commands: ${analysis.dangerousCommands}
• Failure Rate: ${(analysis.failureRate * 100).toFixed(1)}%

🔧 Most Used Commands:
${analysis.mostUsedCommands.map(cmd => `• ${cmd}`).join('\n')}

⚠️ Recent Activity:
${analysis.recentActivity.slice(-5).map(log =>
			`• ${log.timestamp.split('T')[1].split('.')[0]} - ${log.command} [${log.result}]`
		).join('\n')}
`;

		this.channel.clear();
		this.channel.appendLine(report);
		this.channel.show();
	}
}
