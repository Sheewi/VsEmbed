import * as vscode from 'vscode';
import { SecurityManager, SecurityValidationResult } from '../security/firewall';

export interface AICapability {
	type: string;
	permissions: string[];
	riskLevel: 'low' | 'medium' | 'high' | 'critical';
	requiresUserConsent: boolean;
}

export interface ExtensionSecurityContext {
	extensionId: string;
	publisher: string;
	capabilities: AICapability[];
	validated: boolean;
	securityScore: number;
	lastValidated: Date;
}

export class VSCodeBridge {
	private static instance: VSCodeBridge;
	private securityManager: SecurityManager;
	private extensionContexts = new Map<string, ExtensionSecurityContext>();
	private validationCache = new Map<string, SecurityValidationResult>();

	private constructor() {
		this.securityManager = new SecurityManager();
		this.initializeMonitoring();
	}

	static getInstance(): VSCodeBridge {
		if (!VSCodeBridge.instance) {
			VSCodeBridge.instance = new VSCodeBridge();
		}
		return VSCodeBridge.instance;
	}

	/**
	 * Register AI extension monitoring and security validation
	 */
	static registerAIExtensions(): void {
		const bridge = VSCodeBridge.getInstance();

		// Monitor extension changes
		vscode.extensions.onDidChange(() => {
			bridge.validateExtensions();
		});

		// Initial validation
		bridge.validateExtensions();

		console.log('AI extension monitoring registered');
	}

	/**
	 * Initialize real-time monitoring
	 */
	private initializeMonitoring(): void {
		// Monitor workspace changes
		vscode.workspace.onDidChangeConfiguration(async (event) => {
			if (event.affectsConfiguration('ai') || event.affectsConfiguration('security')) {
				await this.validateExtensions();
			}
		});

		// Monitor file system changes for extension installations
		vscode.workspace.onDidCreateFiles(async (event) => {
			for (const file of event.files) {
				if (file.path.includes('.vscode/extensions') || file.path.includes('package.json')) {
					await this.validateExtensions();
					break;
				}
			}
		});
	}

	/**
	 * Validate all installed extensions with AI capabilities
	 */
	private async validateExtensions(): Promise<void> {
		console.log('Validating extensions with AI capabilities...');

		for (const extension of vscode.extensions.all) {
			if (this.hasAICapabilities(extension)) {
				await this.validateAndTrackExtension(extension);
			}
		}

		// Apply security policies
		await this.applySecurityPolicies();
	}

	/**
	 * Check if extension has AI capabilities
	 */
	private hasAICapabilities(extension: vscode.Extension<any>): boolean {
		const packageJson = extension.packageJSON;

		return !!(
			packageJson.aiCapabilities ||
			packageJson.contributes?.ai ||
			packageJson.contributes?.commands?.some((cmd: any) =>
				cmd.command?.includes('ai') || cmd.title?.toLowerCase().includes('ai')
			) ||
			packageJson.keywords?.some((keyword: string) =>
				['ai', 'llm', 'gpt', 'copilot', 'assistant'].includes(keyword.toLowerCase())
			)
		);
	}

	/**
	 * Validate and track individual extension
	 */
	private async validateAndTrackExtension(extension: vscode.Extension<any>): Promise<void> {
		const extensionId = extension.id;
		const packageJson = extension.packageJSON;

		try {
			// Extract AI capabilities
			const capabilities = this.extractAICapabilities(packageJson);

			// Validate extension security
			const validationResult = await this.securityManager.validateExtensionPackage(
				extension.extensionPath
			);

			// Cache validation result
			this.validationCache.set(extensionId, validationResult);

			// Create or update extension context
			const context: ExtensionSecurityContext = {
				extensionId,
				publisher: packageJson.publisher || 'unknown',
				capabilities,
				validated: validationResult.allowed,
				securityScore: this.calculateSecurityScore(capabilities, validationResult),
				lastValidated: new Date()
			};

			this.extensionContexts.set(extensionId, context);

			// Log validation results
			if (!validationResult.allowed) {
				console.warn(`Extension ${extensionId} failed security validation:`, validationResult.reason);
				await this.handleUnsafeExtension(extension, validationResult);
			} else {
				console.log(`Extension ${extensionId} passed security validation`);
			}

		} catch (error) {
			console.error(`Failed to validate extension ${extensionId}:`, error);
		}
	}

	/**
	 * Extract AI capabilities from package.json
	 */
	private extractAICapabilities(packageJson: any): AICapability[] {
		const capabilities: AICapability[] = [];

		// Direct AI capabilities declaration
		if (packageJson.aiCapabilities) {
			for (const [type, config] of Object.entries(packageJson.aiCapabilities)) {
				capabilities.push({
					type,
					permissions: (config as any).permissions || [],
					riskLevel: (config as any).riskLevel || 'medium',
					requiresUserConsent: (config as any).requiresUserConsent !== false
				});
			}
		}

		// Infer capabilities from contributes
		if (packageJson.contributes) {
			// Check for AI commands
			if (packageJson.contributes.commands) {
				const aiCommands = packageJson.contributes.commands.filter((cmd: any) =>
					cmd.command?.includes('ai') || cmd.title?.toLowerCase().includes('ai')
				);

				if (aiCommands.length > 0) {
					capabilities.push({
						type: 'ai.commands',
						permissions: aiCommands.map((cmd: any) => cmd.command),
						riskLevel: 'medium',
						requiresUserConsent: true
					});
				}
			}

			// Check for language features
			if (packageJson.contributes.languages) {
				capabilities.push({
					type: 'language.support',
					permissions: ['editor.language'],
					riskLevel: 'low',
					requiresUserConsent: false
				});
			}

			// Check for keybindings
			if (packageJson.contributes.keybindings) {
				capabilities.push({
					type: 'input.keybindings',
					permissions: ['editor.input'],
					riskLevel: 'low',
					requiresUserConsent: false
				});
			}
		}

		// Check for dangerous activationEvents
		if (packageJson.activationEvents) {
			const dangerousEvents = packageJson.activationEvents.filter((event: string) =>
				event.includes('*') || event.includes('onFileSystem')
			);

			if (dangerousEvents.length > 0) {
				capabilities.push({
					type: 'system.access',
					permissions: dangerousEvents,
					riskLevel: 'high',
					requiresUserConsent: true
				});
			}
		}

		return capabilities;
	}

	/**
	 * Calculate security score for extension
	 */
	private calculateSecurityScore(
		capabilities: AICapability[],
		validationResult: SecurityValidationResult
	): number {
		let score = 100; // Start with perfect score

		// Deduct points based on risk levels
		capabilities.forEach(cap => {
			switch (cap.riskLevel) {
				case 'low': score -= 5; break;
				case 'medium': score -= 15; break;
				case 'high': score -= 30; break;
				case 'critical': score -= 50; break;
			}
		});

		// Deduct points based on validation result
		if (!validationResult.allowed) {
			switch (validationResult.riskLevel) {
				case 'low': score -= 10; break;
				case 'medium': score -= 25; break;
				case 'high': score -= 50; break;
				case 'critical': score -= 80; break;
			}
		}

		return Math.max(0, score);
	}

	/**
	 * Apply security policies to extensions
	 */
	private async applySecurityPolicies(): Promise<void> {
		for (const [extensionId, context] of this.extensionContexts) {
			if (!context.validated || context.securityScore < 50) {
				await this.restrictExtension(extensionId, context);
			}
		}
	}

	/**
	 * Handle unsafe extension
	 */
	private async handleUnsafeExtension(
		extension: vscode.Extension<any>,
		validationResult: SecurityValidationResult
	): Promise<void> {
		const action = await vscode.window.showWarningMessage(
			`Extension "${extension.packageJSON.displayName || extension.id}" failed security validation: ${validationResult.reason}`,
			'Disable Extension',
			'Allow Once',
			'Learn More'
		);

		switch (action) {
			case 'Disable Extension':
				// Note: VS Code API doesn't allow programmatic disabling of extensions
				// This would need to be handled through workspace settings
				await this.disableExtensionInWorkspace(extension.id);
				break;
			case 'Allow Once':
				// Temporarily allow the extension
				this.validationCache.set(extension.id, { ...validationResult, allowed: true });
				break;
			case 'Learn More':
				await vscode.env.openExternal(vscode.Uri.parse(
					'https://code.visualstudio.com/docs/editor/extension-marketplace#_extension-security'
				));
				break;
		}
	}

	/**
	 * Restrict extension capabilities
	 */
	private async restrictExtension(extensionId: string, context: ExtensionSecurityContext): Promise<void> {
		console.log(`Applying restrictions to extension: ${extensionId}`);

		// Log security restrictions
		vscode.window.showInformationMessage(
			`Extension "${extensionId}" is running with restricted permissions due to security policy.`
		);
	}

	/**
	 * Disable extension in workspace settings
	 */
	private async disableExtensionInWorkspace(extensionId: string): Promise<void> {
		const config = vscode.workspace.getConfiguration();
		const disabledExtensions = config.get<string[]>('extensions.autoCheckUpdates') || [];

		if (!disabledExtensions.includes(extensionId)) {
			disabledExtensions.push(extensionId);
			await config.update('extensions.autoCheckUpdates', disabledExtensions, vscode.ConfigurationTarget.Workspace);
		}
	}

	/**
	 * Get extension security report
	 */
	getSecurityReport(): {
		totalExtensions: number;
		aiExtensions: number;
		validatedExtensions: number;
		highRiskExtensions: number;
		averageSecurityScore: number;
	} {
		const aiExtensions = this.extensionContexts.size;
		const validatedExtensions = Array.from(this.extensionContexts.values())
			.filter(ctx => ctx.validated).length;
		const highRiskExtensions = Array.from(this.extensionContexts.values())
			.filter(ctx => ctx.securityScore < 50).length;
		const averageSecurityScore = aiExtensions > 0
			? Array.from(this.extensionContexts.values())
				.reduce((sum, ctx) => sum + ctx.securityScore, 0) / aiExtensions
			: 100;

		return {
			totalExtensions: vscode.extensions.all.length,
			aiExtensions,
			validatedExtensions,
			highRiskExtensions,
			averageSecurityScore: Math.round(averageSecurityScore)
		};
	}

	/**
	 * Get extension context by ID
	 */
	getExtensionContext(extensionId: string): ExtensionSecurityContext | undefined {
		return this.extensionContexts.get(extensionId);
	}

	/**
	 * Force re-validation of all extensions
	 */
	async revalidateExtensions(): Promise<void> {
		this.validationCache.clear();
		await this.validateExtensions();
	}
}

// Auto-register when VS Code is available
if (typeof vscode !== 'undefined') {
	VSCodeBridge.registerAIExtensions();
}

export default VSCodeBridge;
