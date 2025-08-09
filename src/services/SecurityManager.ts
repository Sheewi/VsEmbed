import { AuditLogEntry } from '../types';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { dialog } from 'electron';

export class SecurityManager {
	private readonly auditLogPath = path.join(os.homedir(), '.vsembed', 'audit.log');
	private auditLog: AuditLogEntry[] = [];

	constructor() {
		this.loadAuditLog();
	}

	async requestApproval(
		summary: string,
		riskLevel: 'low' | 'medium' | 'high' | 'critical',
		details?: any
	): Promise<boolean> {
		try {
			// Log the approval request
			await this.logAction('approval_requested', {
				summary,
				risk_level: riskLevel,
				details,
			}, riskLevel);

			// Show approval dialog to user
			const approved = await this.showApprovalDialog(summary, riskLevel, details);

			// Log the approval result
			await this.logAction(approved ? 'approval_granted' : 'approval_denied', {
				summary,
				risk_level: riskLevel,
				approved,
			}, riskLevel);

			return approved;
		} catch (error) {
			console.error('Failed to request approval:', error);
			return false;
		}
	}

	async logAction(
		actionType: string,
		metadata: any,
		riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
	): Promise<void> {
		const entry: AuditLogEntry = {
			id: uuidv4(),
			timestamp: new Date().toISOString(),
			action_type: actionType,
			user_initiated: this.isUserInitiated(actionType),
			ai_initiated: this.isAIInitiated(actionType),
			summary: this.generateActionSummary(actionType, metadata),
			metadata,
			risk_level: riskLevel,
			approved: this.wasApproved(actionType, metadata),
			executed: this.wasExecuted(actionType, metadata),
		};

		this.auditLog.push(entry);
		await this.saveAuditLog();
	}

	async getAuditLog(
		startDate?: Date,
		endDate?: Date,
		actionType?: string
	): Promise<AuditLogEntry[]> {
		let filteredLog = [...this.auditLog];

		if (startDate) {
			filteredLog = filteredLog.filter(entry =>
				new Date(entry.timestamp) >= startDate
			);
		}

		if (endDate) {
			filteredLog = filteredLog.filter(entry =>
				new Date(entry.timestamp) <= endDate
			);
		}

		if (actionType) {
			filteredLog = filteredLog.filter(entry =>
				entry.action_type === actionType
			);
		}

		return filteredLog.sort((a, b) =>
			new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		);
	}

	async clearAuditLog(): Promise<void> {
		// Request approval for clearing audit log (high-risk action)
		const approved = await this.requestApproval(
			'Clear entire audit log',
			'high',
			{ action: 'clear_audit_log', entries_count: this.auditLog.length }
		);

		if (approved) {
			this.auditLog = [];
			await this.saveAuditLog();
		}
	}

	async exportAuditLog(filePath: string): Promise<boolean> {
		try {
			const exportData = {
				export_timestamp: new Date().toISOString(),
				total_entries: this.auditLog.length,
				entries: this.auditLog,
			};

			await fs.writeFile(filePath, JSON.stringify(exportData, null, 2));

			await this.logAction('audit_log_exported', {
				file_path: filePath,
				entries_count: this.auditLog.length,
			});

			return true;
		} catch (error) {
			console.error('Failed to export audit log:', error);
			return false;
		}
	}

	async validateActionSecurity(actionType: string, metadata: any): Promise<{
		allowed: boolean;
		riskLevel: 'low' | 'medium' | 'high' | 'critical';
		reason: string;
	}> {
		const securityCheck = this.performSecurityCheck(actionType, metadata);

		await this.logAction('security_validation', {
			action_type: actionType,
			validation_result: securityCheck,
			metadata,
		}, securityCheck.riskLevel);

		return securityCheck;
	}

	async checkRateLimit(actionType: string): Promise<boolean> {
		const now = new Date();
		const oneMinuteAgo = new Date(now.getTime() - 60000);

		const recentActions = this.auditLog.filter(entry =>
			entry.action_type === actionType &&
			new Date(entry.timestamp) > oneMinuteAgo
		);

		const limit = this.getRateLimit(actionType);
		const allowed = recentActions.length < limit;

		if (!allowed) {
			await this.logAction('rate_limit_exceeded', {
				action_type: actionType,
				recent_count: recentActions.length,
				limit,
			}, 'medium');
		}

		return allowed;
	}

	private async showApprovalDialog(
		summary: string,
		riskLevel: 'low' | 'medium' | 'high' | 'critical',
		details?: any
	): Promise<boolean> {
		const riskColors = {
			low: '🟢',
			medium: '🟡',
			high: '🟠',
			critical: '🔴',
		};

		const message = `${riskColors[riskLevel]} AI Action Approval Required\n\n${summary}`;

		let detailText = '';
		if (details) {
			detailText = `\n\nDetails:\n${JSON.stringify(details, null, 2)}`;
		}

		const result = await dialog.showMessageBox({
			type: riskLevel === 'critical' ? 'error' :
				riskLevel === 'high' ? 'warning' : 'question',
			title: 'AI Action Approval',
			message,
			detail: detailText,
			buttons: ['Approve', 'Deny'],
			defaultId: 1, // Default to deny for security
			cancelId: 1,
		});

		return result.response === 0; // 0 = Approve
	}

	private isUserInitiated(actionType: string): boolean {
		const userInitiatedActions = [
			'user_request',
			'file_opened',
			'settings_changed',
			'approval_granted',
			'approval_denied',
			'workspace_created',
			'workspace_opened',
		];

		return userInitiatedActions.includes(actionType);
	}

	private isAIInitiated(actionType: string): boolean {
		const aiInitiatedActions = [
			'ai_request_processed',
			'action_executed',
			'file_created',
			'file_modified',
			'command_executed',
		];

		return aiInitiatedActions.includes(actionType);
	}

	private generateActionSummary(actionType: string, metadata: any): string {
		switch (actionType) {
			case 'ai_request_processed':
				return `AI processed request: ${metadata.user_input?.substring(0, 50)}...`;
			case 'action_executed':
				return `Executed action: ${metadata.action_type} - ${metadata.description}`;
			case 'file_created':
				return `File created: ${metadata.file_path}`;
			case 'file_modified':
				return `File modified: ${metadata.file_path}`;
			case 'command_executed':
				return `Command executed: ${metadata.command}`;
			case 'approval_requested':
				return `Approval requested: ${metadata.summary}`;
			case 'approval_granted':
				return `Approval granted: ${metadata.summary}`;
			case 'approval_denied':
				return `Approval denied: ${metadata.summary}`;
			case 'security_validation':
				return `Security validation: ${metadata.action_type} - ${metadata.validation_result.reason}`;
			case 'rate_limit_exceeded':
				return `Rate limit exceeded for: ${metadata.action_type}`;
			default:
				return `Action: ${actionType}`;
		}
	}

	private wasApproved(actionType: string, metadata: any): boolean {
		return actionType === 'approval_granted' ||
			metadata.approved === true ||
			this.isLowRiskAction(actionType);
	}

	private wasExecuted(actionType: string, metadata: any): boolean {
		const executedActions = [
			'action_executed',
			'file_created',
			'file_modified',
			'command_executed',
		];

		return executedActions.includes(actionType) || metadata.executed === true;
	}

	private isLowRiskAction(actionType: string): boolean {
		const lowRiskActions = [
			'file_opened',
			'search_performed',
			'ai_request_processed',
			'settings_viewed',
		];

		return lowRiskActions.includes(actionType);
	}

	private performSecurityCheck(actionType: string, metadata: any): {
		allowed: boolean;
		riskLevel: 'low' | 'medium' | 'high' | 'critical';
		reason: string;
	} {
		// Check for dangerous commands
		if (actionType === 'command_executed') {
			const command = metadata.command?.toLowerCase() || '';

			if (command.includes('rm -rf') || command.includes('del /f')) {
				return {
					allowed: false,
					riskLevel: 'critical',
					reason: 'Destructive file deletion command detected',
				};
			}

			if (command.includes('sudo') || command.includes('chmod 777')) {
				return {
					allowed: false,
					riskLevel: 'high',
					reason: 'Privileged command detected',
				};
			}

			if (command.includes('install') || command.includes('download')) {
				return {
					allowed: true,
					riskLevel: 'medium',
					reason: 'Package installation or download command',
				};
			}
		}

		// Check for file operations
		if (actionType === 'file_delete') {
			return {
				allowed: true,
				riskLevel: 'medium',
				reason: 'File deletion operation',
			};
		}

		if (actionType === 'file_create' || actionType === 'file_modify') {
			return {
				allowed: true,
				riskLevel: 'low',
				reason: 'Standard file operation',
			};
		}

		// Default to low risk for unknown actions
		return {
			allowed: true,
			riskLevel: 'low',
			reason: 'Standard operation',
		};
	}

	private getRateLimit(actionType: string): number {
		const rateLimits: { [key: string]: number } = {
			command_executed: 10,
			file_created: 20,
			file_modified: 50,
			ai_request_processed: 30,
		};

		return rateLimits[actionType] || 100;
	}

	private async loadAuditLog(): Promise<void> {
		try {
			const data = await fs.readFile(this.auditLogPath, 'utf-8');
			this.auditLog = JSON.parse(data);
		} catch (error) {
			if ((error as any).code === 'ENOENT') {
				// Create empty log if file doesn't exist
				this.auditLog = [];
			} else {
				console.error('Failed to load audit log:', error);
				this.auditLog = [];
			}
		}
	}

	private async saveAuditLog(): Promise<void> {
		try {
			// Ensure directory exists
			await fs.mkdir(path.dirname(this.auditLogPath), { recursive: true });

			// Keep only last 10000 entries to prevent unlimited growth
			if (this.auditLog.length > 10000) {
				this.auditLog = this.auditLog.slice(-10000);
			}

			await fs.writeFile(this.auditLogPath, JSON.stringify(this.auditLog, null, 2));
		} catch (error) {
			console.error('Failed to save audit log:', error);
		}
	}
}
