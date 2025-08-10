import { PermissionManager } from '../../permissions/manager';

export interface UserContext {
	id: string;
	role: 'admin' | 'developer' | 'viewer';
	permissions: string[];
	sessionId: string;
	ipAddress?: string;
	userAgent?: string;
}

export interface SecurityPolicy {
	extensionId: string;
	commands: {
		allowed: string[];
		forbidden: string[];
		requiresApproval: string[];
	};
	resourceAccess: {
		filesystem: 'read' | 'write' | 'none';
		network: boolean;
		terminal: boolean;
	};
	riskLevel: 'low' | 'medium' | 'high';
}

export class PermissionMiddleware {
	private permissionManager: PermissionManager;
	private securityPolicies: Map<string, SecurityPolicy> = new Map();
	private auditLog: Array<{
		timestamp: number;
		userId: string;
		action: string;
		resource: string;
		granted: boolean;
		reason: string;
	}> = [];

	constructor() {
		this.permissionManager = new PermissionManager();
		this.initializeDefaultPolicies();
	}

	private initializeDefaultPolicies(): void {
		// Define security policies for built-in commands
		const policies: SecurityPolicy[] = [
			{
				extensionId: 'vscode.built-in',
				commands: {
					allowed: ['vscode.open', 'editor.action.selectAll', 'editor.action.clipboardCopyAction'],
					forbidden: ['workbench.action.terminal.runSelectedText', 'workbench.action.files.delete'],
					requiresApproval: ['workbench.action.files.save', 'editor.action.formatDocument']
				},
				resourceAccess: {
					filesystem: 'read',
					network: false,
					terminal: false
				},
				riskLevel: 'low'
			},
			{
				extensionId: 'ms-python.python',
				commands: {
					allowed: ['python.execInTerminal', 'python.runCurrentFile'],
					forbidden: ['python.execSelectionInDjangoShell'],
					requiresApproval: ['python.debugCurrentFile', 'python.runCurrentFileInTerminal']
				},
				resourceAccess: {
					filesystem: 'write',
					network: true,
					terminal: true
				},
				riskLevel: 'medium'
			},
			{
				extensionId: 'ms-azuretools.vscode-docker',
				commands: {
					allowed: ['docker.images.build', 'docker.containers.start'],
					forbidden: ['docker.containers.remove', 'docker.system.prune'],
					requiresApproval: ['docker.images.push', 'docker.containers.exec']
				},
				resourceAccess: {
					filesystem: 'write',
					network: true,
					terminal: true
				},
				riskLevel: 'high'
			},
			{
				extensionId: 'kali-tools.security',
				commands: {
					allowed: [],
					forbidden: ['kali.exploit.run', 'kali.metasploit.launch'],
					requiresApproval: ['kali.nmap.scan', 'kali.nikto.scan', 'kali.dirb.scan']
				},
				resourceAccess: {
					filesystem: 'read',
					network: true,
					terminal: true
				},
				riskLevel: 'high'
			}
		];

		policies.forEach(policy => {
			this.securityPolicies.set(policy.extensionId, policy);
		});
	}

	async checkExtensionPermission(
		extensionId: string,
		command: string,
		user: UserContext,
		additionalContext?: any
	): Promise<{
		granted: boolean;
		requiresApproval: boolean;
		reason: string;
		riskLevel: 'low' | 'medium' | 'high';
	}> {
		try {
			// Get security policy for extension
			const policy = this.getSecurityPolicy(extensionId);

			// Check user role permissions
			const rolePermission = this.checkRolePermission(user.role, command, policy);
			if (!rolePermission.allowed) {
				this.logSecurityEvent(user.id, command, extensionId, false, rolePermission.reason);
				return {
					granted: false,
					requiresApproval: false,
					reason: rolePermission.reason,
					riskLevel: policy.riskLevel
				};
			}

			// Check if command is explicitly forbidden
			if (policy.commands.forbidden.includes(command)) {
				this.logSecurityEvent(user.id, command, extensionId, false, 'Command explicitly forbidden');
				return {
					granted: false,
					requiresApproval: false,
					reason: 'This command is not allowed for security reasons',
					riskLevel: policy.riskLevel
				};
			}

			// Check if command is explicitly allowed
			if (policy.commands.allowed.includes(command)) {
				this.logSecurityEvent(user.id, command, extensionId, true, 'Command explicitly allowed');
				return {
					granted: true,
					requiresApproval: false,
					reason: 'Command is pre-approved',
					riskLevel: policy.riskLevel
				};
			}

			// Check if command requires approval
			if (policy.commands.requiresApproval.includes(command) || this.isHighRiskOperation(command, policy)) {
				return {
					granted: false,
					requiresApproval: true,
					reason: 'Command requires user approval',
					riskLevel: policy.riskLevel
				};
			}

			// Check existing permissions
			const hasPermission = await this.permissionManager.requestExtensionPermission(
				extensionId,
				command,
				`Execute ${command} command`
			);

			this.logSecurityEvent(
				user.id,
				command,
				extensionId,
				hasPermission,
				hasPermission ? 'Permission granted' : 'Permission denied'
			);

			return {
				granted: hasPermission,
				requiresApproval: false,
				reason: hasPermission ? 'Permission granted' : 'Permission denied',
				riskLevel: policy.riskLevel
			};

		} catch (error) {
			this.logSecurityEvent(user.id, command, extensionId, false, `Error: ${error}`);
			return {
				granted: false,
				requiresApproval: false,
				reason: 'Security check failed',
				riskLevel: 'high'
			};
		}
	}

	private getSecurityPolicy(extensionId: string): SecurityPolicy {
		return this.securityPolicies.get(extensionId) || this.getDefaultPolicy(extensionId);
	}

	private getDefaultPolicy(extensionId: string): SecurityPolicy {
		// Determine risk level based on extension type
		let riskLevel: 'low' | 'medium' | 'high' = 'medium';

		if (extensionId.includes('security') || extensionId.includes('kali')) {
			riskLevel = 'high';
		} else if (extensionId.includes('debug') || extensionId.includes('terminal')) {
			riskLevel = 'medium';
		} else if (extensionId.includes('theme') || extensionId.includes('language')) {
			riskLevel = 'low';
		}

		return {
			extensionId,
			commands: {
				allowed: [],
				forbidden: [],
				requiresApproval: ['*'] // Require approval for all commands by default
			},
			resourceAccess: {
				filesystem: 'read',
				network: false,
				terminal: false
			},
			riskLevel
		};
	}

	private checkRolePermission(
		role: string,
		command: string,
		policy: SecurityPolicy
	): { allowed: boolean; reason: string } {
		switch (role) {
			case 'admin':
				return { allowed: true, reason: 'Admin access granted' };

			case 'developer':
				// Developers can't execute high-risk security commands
				if (policy.riskLevel === 'high' && command.includes('exploit')) {
					return { allowed: false, reason: 'Insufficient privileges for security exploits' };
				}
				return { allowed: true, reason: 'Developer access granted' };

			case 'viewer':
				// Viewers can only execute read-only operations
				if (policy.resourceAccess.filesystem === 'write' || policy.resourceAccess.terminal) {
					return { allowed: false, reason: 'Viewer role cannot modify system' };
				}
				return { allowed: true, reason: 'Viewer access granted' };

			default:
				return { allowed: false, reason: 'Unknown user role' };
		}
	}

	private isHighRiskOperation(command: string, policy: SecurityPolicy): boolean {
		const highRiskPatterns = [
			/delete|remove|destroy/i,
			/exec|execute|run.*script/i,
			/terminal.*run|shell.*exec/i,
			/network.*scan|port.*scan/i,
			/exploit|payload|attack/i,
			/sudo|admin|privilege/i
		];

		return highRiskPatterns.some(pattern => pattern.test(command)) ||
			policy.riskLevel === 'high';
	}

	async approveCommand(
		requestId: string,
		extensionId: string,
		command: string,
		user: UserContext,
		approved: boolean,
		remember: boolean = false
	): Promise<void> {
		if (approved && remember) {
			// Update security policy to allow this command
			const policy = this.getSecurityPolicy(extensionId);
			policy.commands.allowed.push(command);
			this.securityPolicies.set(extensionId, policy);

			// Store permission
			await this.permissionManager.updatePermission(extensionId, true);
		}

		this.logSecurityEvent(
			user.id,
			command,
			extensionId,
			approved,
			approved ? 'User approved command' : 'User denied command'
		);
	}

	checkResourceAccess(
		extensionId: string,
		resourceType: 'filesystem' | 'network' | 'terminal',
		operation?: 'read' | 'write'
	): boolean {
		const policy = this.getSecurityPolicy(extensionId);

		switch (resourceType) {
			case 'filesystem':
				if (operation === 'write') {
					return policy.resourceAccess.filesystem === 'write';
				}
				return policy.resourceAccess.filesystem !== 'none';

			case 'network':
				return policy.resourceAccess.network;

			case 'terminal':
				return policy.resourceAccess.terminal;

			default:
				return false;
		}
	}

	sanitizeCommandOutput(output: string, extensionId: string): string {
		// Remove sensitive information from command outputs
		let sanitized = output;

		// Remove potential credentials
		sanitized = sanitized.replace(/password[=:]\s*\S+/gi, 'password=***');
		sanitized = sanitized.replace(/token[=:]\s*\S+/gi, 'token=***');
		sanitized = sanitized.replace(/key[=:]\s*\S+/gi, 'key=***');
		sanitized = sanitized.replace(/secret[=:]\s*\S+/gi, 'secret=***');

		// Remove IP addresses for security tools
		if (extensionId.includes('security') || extensionId.includes('kali')) {
			sanitized = sanitized.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, 'XXX.XXX.XXX.XXX');
		}

		// Remove file paths that might contain sensitive information
		sanitized = sanitized.replace(/\/home\/[^\/\s]+/g, '/home/***');
		sanitized = sanitized.replace(/C:\\Users\\[^\\]+/g, 'C:\\Users\\***');

		return sanitized;
	}

	private logSecurityEvent(
		userId: string,
		action: string,
		resource: string,
		granted: boolean,
		reason: string
	): void {
		this.auditLog.unshift({
			timestamp: Date.now(),
			userId,
			action,
			resource,
			granted,
			reason
		});

		// Keep only last 1000 events
		if (this.auditLog.length > 1000) {
			this.auditLog = this.auditLog.slice(0, 1000);
		}

		// Log to console for debugging
		console.log(`Security Event: ${granted ? 'GRANTED' : 'DENIED'} - ${userId} - ${action} on ${resource} - ${reason}`);
	}

	getSecurityReport(timeRange?: { start: number; end: number }): {
		totalEvents: number;
		grantedEvents: number;
		deniedEvents: number;
		riskBreakdown: Record<string, number>;
		recentEvents: typeof this.auditLog;
		suspiciousActivity: typeof this.auditLog;
	} {
		let events = this.auditLog;

		if (timeRange) {
			events = events.filter(event =>
				event.timestamp >= timeRange.start && event.timestamp <= timeRange.end
			);
		}

		const granted = events.filter(e => e.granted).length;
		const denied = events.filter(e => !e.granted).length;

		// Identify suspicious patterns
		const suspiciousActivity = events.filter(event =>
			!event.granted && (
				event.action.includes('exploit') ||
				event.reason.includes('forbidden') ||
				events.filter(e => e.userId === event.userId && !e.granted).length > 5
			)
		);

		// Calculate risk breakdown
		const riskBreakdown = events.reduce((acc, event) => {
			const risk = this.getEventRiskLevel(event.action, event.resource);
			acc[risk] = (acc[risk] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return {
			totalEvents: events.length,
			grantedEvents: granted,
			deniedEvents: denied,
			riskBreakdown,
			recentEvents: events.slice(0, 10),
			suspiciousActivity
		};
	}

	private getEventRiskLevel(action: string, resource: string): string {
		if (resource.includes('kali') || action.includes('exploit')) return 'high';
		if (action.includes('terminal') || action.includes('exec')) return 'medium';
		return 'low';
	}

	updateSecurityPolicy(extensionId: string, policy: Partial<SecurityPolicy>): void {
		const currentPolicy = this.getSecurityPolicy(extensionId);
		const updatedPolicy = { ...currentPolicy, ...policy };
		this.securityPolicies.set(extensionId, updatedPolicy);
	}

	exportSecurityConfig(): string {
		const config = {
			policies: Array.from(this.securityPolicies.entries()),
			auditLog: this.auditLog,
			exportedAt: new Date().toISOString()
		};

		return JSON.stringify(config, null, 2);
	}

	importSecurityConfig(configString: string): void {
		try {
			const config = JSON.parse(configString);

			if (config.policies) {
				this.securityPolicies.clear();
				config.policies.forEach(([id, policy]: [string, SecurityPolicy]) => {
					this.securityPolicies.set(id, policy);
				});
			}

			if (config.auditLog) {
				this.auditLog = config.auditLog;
			}
		} catch (error) {
			throw new Error('Invalid security configuration format');
		}
	}
}
