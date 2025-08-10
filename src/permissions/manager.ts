import { PermissionRequest } from '../ai/config';

export interface PermissionRule {
	pattern: string;
	defaultAction: 'allow' | 'deny' | 'prompt';
	riskLevel: 'low' | 'medium' | 'high';
	description: string;
}

export class PermissionManager {
	private static readonly PERMISSIONS_KEY = 'extension-permissions';
	private static readonly AUDIT_KEY = 'permission-audit';

	private permissions: Record<string, boolean> = {};
	private auditLog: PermissionRequest[] = [];

	private readonly securityRules: PermissionRule[] = [
		{
			pattern: '*.executeCommand',
			defaultAction: 'prompt',
			riskLevel: 'medium',
			description: 'Execute VS Code commands'
		},
		{
			pattern: '*.workspace.fs.*',
			defaultAction: 'prompt',
			riskLevel: 'high',
			description: 'File system access'
		},
		{
			pattern: '*.terminal.*',
			defaultAction: 'deny',
			riskLevel: 'high',
			description: 'Terminal access'
		},
		{
			pattern: '*.debug.*',
			defaultAction: 'prompt',
			riskLevel: 'medium',
			description: 'Debugger access'
		},
		{
			pattern: 'kali-*',
			defaultAction: 'deny',
			riskLevel: 'high',
			description: 'Security tools access'
		},
		{
			pattern: '*.docker.*',
			defaultAction: 'prompt',
			riskLevel: 'medium',
			description: 'Docker operations'
		}
	];

	constructor() {
		this.loadSavedData();
	}

	private loadSavedData(): void {
		try {
			const savedPermissions = localStorage.getItem(PermissionManager.PERMISSIONS_KEY);
			if (savedPermissions) {
				this.permissions = JSON.parse(savedPermissions);
			}

			const savedAudit = localStorage.getItem(PermissionManager.AUDIT_KEY);
			if (savedAudit) {
				this.auditLog = JSON.parse(savedAudit);
			}
		} catch (error) {
			console.error('Failed to load permission data:', error);
		}
	}

	private saveData(): void {
		try {
			localStorage.setItem(
				PermissionManager.PERMISSIONS_KEY,
				JSON.stringify(this.permissions)
			);
			localStorage.setItem(
				PermissionManager.AUDIT_KEY,
				JSON.stringify(this.auditLog)
			);
		} catch (error) {
			console.error('Failed to save permission data:', error);
		}
	}

	async requestExtensionPermission(
		extensionId: string,
		command: string,
		purpose: string
	): Promise<boolean> {
		const permissionKey = `${extensionId}:${command}`;

		// Check if permission already granted/denied
		if (this.permissions.hasOwnProperty(permissionKey)) {
			this.logAuditEvent(extensionId, command, purpose, this.permissions[permissionKey]);
			return this.permissions[permissionKey];
		}

		// Check security rules
		const rule = this.findMatchingRule(permissionKey);

		if (rule?.defaultAction === 'allow') {
			this.permissions[permissionKey] = true;
			this.saveData();
			this.logAuditEvent(extensionId, command, purpose, true, 'auto-allowed');
			return true;
		}

		if (rule?.defaultAction === 'deny') {
			this.permissions[permissionKey] = false;
			this.saveData();
			this.logAuditEvent(extensionId, command, purpose, false, 'auto-denied');
			return false;
		}

		// Prompt user for permission
		return this.promptUser(extensionId, command, purpose, rule?.riskLevel || 'medium');
	}

	private findMatchingRule(permissionKey: string): PermissionRule | null {
		return this.securityRules.find(rule => {
			const pattern = rule.pattern.replace('*', '.*');
			const regex = new RegExp(pattern);
			return regex.test(permissionKey);
		}) || null;
	}

	private async promptUser(
		extensionId: string,
		command: string,
		purpose: string,
		riskLevel: 'low' | 'medium' | 'high'
	): Promise<boolean> {
		return new Promise((resolve) => {
			const permissionKey = `${extensionId}:${command}`;

			// Create permission request event
			const request: PermissionRequest = {
				id: Date.now().toString(),
				extensionId,
				command,
				purpose,
				riskLevel,
				timestamp: Date.now()
			};

			// Dispatch custom event for UI to handle
			window.dispatchEvent(new CustomEvent('permissionRequest', {
				detail: {
					request,
					onResponse: (granted: boolean, remember: boolean = false) => {
						request.approved = granted;

						if (remember) {
							this.permissions[permissionKey] = granted;
							this.saveData();
						}

						this.logAuditEvent(extensionId, command, purpose, granted, 'user-prompted');
						resolve(granted);
					}
				}
			}));
		});
	}

	private logAuditEvent(
		extensionId: string,
		command: string,
		purpose: string,
		granted: boolean,
		source: string = 'unknown'
	): void {
		const auditEntry: PermissionRequest = {
			id: Date.now().toString(),
			extensionId,
			command,
			purpose,
			riskLevel: this.findMatchingRule(`${extensionId}:${command}`)?.riskLevel || 'medium',
			timestamp: Date.now(),
			approved: granted
		};

		this.auditLog.unshift(auditEntry);

		// Keep only last 1000 audit entries
		if (this.auditLog.length > 1000) {
			this.auditLog = this.auditLog.slice(0, 1000);
		}

		this.saveData();

		console.log(`Permission ${granted ? 'granted' : 'denied'} for ${extensionId}:${command} (${source})`);
	}

	hasPermission(extensionId: string, command?: string): boolean {
		if (!command) {
			// Check if extension has any permissions
			return Object.keys(this.permissions).some(key =>
				key.startsWith(extensionId) && this.permissions[key]
			);
		}

		const permissionKey = `${extensionId}:${command}`;
		return this.permissions[permissionKey] === true;
	}

	revokePermission(extensionId: string, command?: string): void {
		if (!command) {
			// Revoke all permissions for extension
			Object.keys(this.permissions)
				.filter(key => key.startsWith(extensionId))
				.forEach(key => delete this.permissions[key]);
		} else {
			const permissionKey = `${extensionId}:${command}`;
			delete this.permissions[permissionKey];
		}

		this.saveData();
	}

	getPermissions(): Record<string, boolean> {
		return { ...this.permissions };
	}

	getAuditLog(): PermissionRequest[] {
		return [...this.auditLog];
	}

	clearAuditLog(): void {
		this.auditLog = [];
		this.saveData();
	}

	exportAuditLog(): string {
		return JSON.stringify({
			permissions: this.permissions,
			auditLog: this.auditLog,
			exportedAt: new Date().toISOString()
		}, null, 2);
	}

	getSecurityReport(): {
		totalRequests: number;
		approvedRequests: number;
		deniedRequests: number;
		riskBreakdown: Record<string, number>;
		recentActivity: PermissionRequest[];
	} {
		const approved = this.auditLog.filter(entry => entry.approved).length;
		const denied = this.auditLog.filter(entry => !entry.approved).length;

		const riskBreakdown = this.auditLog.reduce((acc, entry) => {
			acc[entry.riskLevel] = (acc[entry.riskLevel] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const recentActivity = this.auditLog
			.filter(entry => Date.now() - entry.timestamp < 24 * 60 * 60 * 1000) // Last 24 hours
			.slice(0, 10);

		return {
			totalRequests: this.auditLog.length,
			approvedRequests: approved,
			deniedRequests: denied,
			riskBreakdown,
			recentActivity
		};
	}

	addSecurityRule(rule: PermissionRule): void {
		this.securityRules.push(rule);
	}

	removeSecurityRule(pattern: string): void {
		const index = this.securityRules.findIndex(rule => rule.pattern === pattern);
		if (index !== -1) {
			this.securityRules.splice(index, 1);
		}
	}

	getSecurityRules(): PermissionRule[] {
		return [...this.securityRules];
	}
}
