import { ExtensionRecommender } from '../extensions/recommender';
import { PermissionManager } from '../permissions/manager';
import { ModelConfiguration } from '../ai/config';

interface ToolCall {
	name: string;
	function: string;
	arguments: any;
}

interface ExecutionResult {
	success: boolean;
	output: string;
	error?: string;
	requiresPermission?: boolean;
	recommendedExtensions?: string[];
}

interface ExtensionAPI {
	id: string;
	isActive: boolean;
	commands: string[];
	api?: any;
}

export class ToolExecutor {
	private permissionManager: PermissionManager;
	private extensionRecommender: ExtensionRecommender;
	private modelConfig: ModelConfiguration;
	private availableExtensions: Map<string, ExtensionAPI> = new Map();

	constructor() {
		this.permissionManager = new PermissionManager();
		this.extensionRecommender = new ExtensionRecommender();
		this.modelConfig = new ModelConfiguration();
		this.initializeExtensionTracking();
	}

	private async initializeExtensionTracking(): Promise<void> {
		// In a real VS Code environment, this would query actual extensions
		// For now, simulate some common extensions
		const commonExtensions = [
			{ id: 'esbenp.prettier-vscode', commands: ['prettier.format'] },
			{ id: 'dbaeumer.vscode-eslint', commands: ['eslint.fix'] },
			{ id: 'ms-python.python', commands: ['python.run', 'python.debug'] },
			{ id: 'ms-azuretools.vscode-docker', commands: ['docker.build', 'docker.run'] }
		];

		commonExtensions.forEach(ext => {
			this.availableExtensions.set(ext.id, {
				id: ext.id,
				isActive: true,
				commands: ext.commands
			});
		});
	}

	async executeTool(toolCall: ToolCall): Promise<ExecutionResult> {
		try {
			// Handle VS Code extension tools
			if (toolCall.name.startsWith('vscode_')) {
				return await this.executeVSCodeTool(toolCall);
			}

			// Handle Kali tools
			if (toolCall.name.startsWith('kali_')) {
				return await this.executeKaliTool(toolCall);
			}

			// Handle Docker tools
			if (toolCall.name.startsWith('docker_')) {
				return await this.executeDockerTool(toolCall);
			}

			// Handle GCP tools
			if (toolCall.name.startsWith('gcp_')) {
				return await this.executeGCPTool(toolCall);
			}

			return {
				success: false,
				output: '',
				error: `Unknown tool type: ${toolCall.name}`
			};

		} catch (error) {
			return {
				success: false,
				output: '',
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	private async executeVSCodeTool(toolCall: ToolCall): Promise<ExecutionResult> {
		const { name, function: command, arguments: args } = toolCall;
		const extId = this.parseExtensionId(name);

		// Check if extension is available
		const extension = this.availableExtensions.get(extId);
		if (!extension) {
			// Recommend extension installation
			const recommendations = this.extensionRecommender.recommendExtensions({
				files: [],
				installedExtensions: Array.from(this.availableExtensions.keys()),
				activeExtensions: Array.from(this.availableExtensions.keys()),
				dependencies: {}
			});

			const recommendation = recommendations.find(r => r.extensionId === extId);

			return {
				success: false,
				output: '',
				error: `Extension ${extId} not available`,
				recommendedExtensions: [extId],
				requiresPermission: false
			};
		}

		// Check permissions
		const hasPermission = await this.permissionManager.requestExtensionPermission(
			extId,
			command,
			`Execute ${command} with arguments: ${JSON.stringify(args)}`
		);

		if (!hasPermission) {
			return {
				success: false,
				output: '',
				error: `Permission denied for ${extId}:${command}`,
				requiresPermission: true
			};
		}

		// Execute the command
		try {
			const result = await this.callExtensionCommand(extId, command, args);
			return {
				success: true,
				output: JSON.stringify(result),
				error: undefined
			};
		} catch (error) {
			return {
				success: false,
				output: '',
				error: `Extension execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
			};
		}
	}

	private async executeKaliTool(toolCall: ToolCall): Promise<ExecutionResult> {
		const config = this.modelConfig.getConfig();

		if (!config.tools.kali) {
			return {
				success: false,
				output: '',
				error: 'Kali tools are disabled in configuration'
			};
		}

		const hasPermission = await this.permissionManager.requestExtensionPermission(
			'kali-tools',
			toolCall.function,
			`Execute Kali security tool: ${toolCall.function}`
		);

		if (!hasPermission) {
			return {
				success: false,
				output: '',
				error: 'Permission denied for Kali tools',
				requiresPermission: true
			};
		}

		// Simulate Kali tool execution
		const { function: tool, arguments: args } = toolCall;

		switch (tool) {
			case 'nmap_scan':
				return this.simulateNmapScan(args);
			case 'vulnerability_scan':
				return this.simulateVulnerabilityScan(args);
			default:
				return {
					success: false,
					output: '',
					error: `Unknown Kali tool: ${tool}`
				};
		}
	}

	private async executeDockerTool(toolCall: ToolCall): Promise<ExecutionResult> {
		const config = this.modelConfig.getConfig();

		if (!config.tools.docker) {
			return {
				success: false,
				output: '',
				error: 'Docker tools are disabled in configuration'
			};
		}

		const hasPermission = await this.permissionManager.requestExtensionPermission(
			'docker',
			toolCall.function,
			`Execute Docker command: ${toolCall.function}`
		);

		if (!hasPermission) {
			return {
				success: false,
				output: '',
				error: 'Permission denied for Docker operations',
				requiresPermission: true
			};
		}

		// Simulate Docker command execution
		const result = await this.executeDockerCommand(toolCall.function, toolCall.arguments);
		return {
			success: true,
			output: result,
			error: undefined
		};
	}

	private async executeGCPTool(toolCall: ToolCall): Promise<ExecutionResult> {
		const config = this.modelConfig.getConfig();

		if (!config.tools.gcp) {
			return {
				success: false,
				output: '',
				error: 'GCP tools are disabled in configuration'
			};
		}

		// Simulate GCP API call
		const result = await this.callGCPAPI(toolCall.function, toolCall.arguments);
		return {
			success: true,
			output: JSON.stringify(result),
			error: undefined
		};
	}

	private parseExtensionId(toolName: string): string {
		// Convert vscode_extension_name_command to extension.name
		const parts = toolName.split('_').slice(1); // Remove 'vscode' prefix
		const commandIndex = parts.findIndex(part => part === 'command' || part === 'cmd');

		if (commandIndex > 0) {
			return parts.slice(0, commandIndex).join('.');
		}

		return parts.join('.');
	}

	private async callExtensionCommand(
		extensionId: string,
		command: string,
		args: any[]
	): Promise<any> {
		// In a real implementation, this would call the actual VS Code API
		// For simulation, return mock results

		if (command === 'prettier.format') {
			return { formatted: true, changes: 5 };
		}

		if (command === 'eslint.fix') {
			return { fixes: 3, errors: 0, warnings: 1 };
		}

		if (command === 'python.run') {
			return { exitCode: 0, output: 'Hello, World!' };
		}

		return { executed: true, command, args };
	}

	private async simulateNmapScan(args: any): Promise<ExecutionResult> {
		// Simulate nmap scan results
		const mockResults = {
			target: args.target || '127.0.0.1',
			open_ports: [22, 80, 443],
			closed_ports: [21, 25, 53],
			scan_time: '2.5s'
		};

		return {
			success: true,
			output: JSON.stringify(mockResults, null, 2),
			error: undefined
		};
	}

	private async simulateVulnerabilityScan(args: any): Promise<ExecutionResult> {
		const mockResults = {
			vulnerabilities: [
				{ id: 'CVE-2023-1234', severity: 'medium', description: 'Sample vulnerability' }
			],
			scan_date: new Date().toISOString()
		};

		return {
			success: true,
			output: JSON.stringify(mockResults, null, 2),
			error: undefined
		};
	}

	private async executeDockerCommand(command: string, args: any): Promise<string> {
		// Simulate Docker command execution
		const mockCommands = {
			'build': `Building image: ${args.tag || 'latest'}`,
			'run': `Running container: ${args.image || 'ubuntu'}`,
			'ps': 'CONTAINER ID   IMAGE     COMMAND   STATUS',
			'images': 'REPOSITORY   TAG       IMAGE ID   SIZE'
		};

		return mockCommands[command as keyof typeof mockCommands] || `Executed: docker ${command}`;
	}

	private async callGCPAPI(endpoint: string, params: any): Promise<any> {
		// Simulate GCP API call
		return {
			endpoint,
			params,
			response: 'Mock GCP response',
			timestamp: new Date().toISOString()
		};
	}

	getAvailableTools(): Array<{ name: string; description: string; category: string }> {
		const tools: Array<{ name: string; description: string; category: string }> = [];

		// Add VS Code extension tools
		this.availableExtensions.forEach((ext, id) => {
			ext.commands.forEach(command => {
				tools.push({
					name: `vscode_${id.replace(/\./g, '_')}_${command}`,
					description: `${ext.id}: ${command}`,
					category: 'vscode'
				});
			});
		});

		// Add Kali tools if enabled
		const config = this.modelConfig.getConfig();
		if (config.tools.kali) {
			tools.push(
				{
					name: 'kali_nmap_scan',
					description: 'Network scanning with Nmap',
					category: 'security'
				},
				{
					name: 'kali_vulnerability_scan',
					description: 'Vulnerability assessment',
					category: 'security'
				}
			);
		}

		// Add Docker tools if enabled
		if (config.tools.docker) {
			tools.push(
				{
					name: 'docker_build',
					description: 'Build Docker image',
					category: 'containerization'
				},
				{
					name: 'docker_run',
					description: 'Run Docker container',
					category: 'containerization'
				}
			);
		}

		return tools;
	}

	async checkExtensionAvailability(extensionId: string): Promise<{
		available: boolean;
		installed: boolean;
		active: boolean;
		recommendInstall?: boolean;
	}> {
		const extension = this.availableExtensions.get(extensionId);

		return {
			available: !!extension,
			installed: !!extension,
			active: extension?.isActive || false,
			recommendInstall: !extension
		};
	}
}
