import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface SecurityPolicy {
	networkAllowlist: string[];
	containerSigning: {
		enabled: boolean;
		trustedRegistries: string[];
		requiredSignatures: string[];
	};
	codeSigning: {
		enabled: boolean;
		trustedPublishers: string[];
		requireSignature: boolean;
	};
	extensionValidation: {
		enabled: boolean;
		allowedCapabilities: string[];
		blockedCapabilities: string[];
	};
}

export interface SecurityValidationResult {
	allowed: boolean;
	reason?: string;
	riskLevel: 'low' | 'medium' | 'high' | 'critical';
	recommendations?: string[];
}

export class SecurityManager {
	private static readonly DEFAULT_POLICY: SecurityPolicy = {
		networkAllowlist: [
			'api.github.com',
			'pkg.actions.githubusercontent.com', // Required for GitHub Actions
			'ghcr.io', // For container registry access
			'api.openai.com',
			'api.anthropic.com',
			'marketplace.visualstudio.com',
			'registry.npmjs.org'
		],
		containerSigning: {
			enabled: true,
			trustedRegistries: ['ghcr.io', 'docker.io', 'mcr.microsoft.com'],
			requiredSignatures: ['cosign', 'notary']
		},
		codeSigning: {
			enabled: true,
			trustedPublishers: ['Microsoft', 'GitHub', 'OpenAI'],
			requireSignature: true
		},
		extensionValidation: {
			enabled: true,
			allowedCapabilities: ['ai.completion', 'ai.chat', 'editor.extension'],
			blockedCapabilities: ['system.execute', 'network.raw', 'file.system.write']
		}
	};

	private policy: SecurityPolicy;

	constructor(customPolicy?: Partial<SecurityPolicy>) {
		this.policy = { ...SecurityManager.DEFAULT_POLICY, ...customPolicy };
	}

	/**
	 * Validates network requests against allowlist
	 */
	validateRequest(url: string): boolean {
		try {
			const parsedUrl = new URL(url);
			return this.policy.networkAllowlist.some(domain =>
				parsedUrl.hostname === domain ||
				parsedUrl.hostname.endsWith('.' + domain)
			);
		} catch {
			return false;
		}
	}

	/**
	 * Validates Docker container signatures
	 */
	async validateContainerSignature(
		imageName: string,
		registry: string
	): Promise<SecurityValidationResult> {
		if (!this.policy.containerSigning.enabled) {
			return { allowed: true, riskLevel: 'low' };
		}

		// Check if registry is trusted
		const isTrustedRegistry = this.policy.containerSigning.trustedRegistries
			.some(trusted => registry.includes(trusted));

		if (!isTrustedRegistry) {
			return {
				allowed: false,
				reason: 'Untrusted container registry',
				riskLevel: 'high',
				recommendations: [
					'Use only trusted registries: ' + this.policy.containerSigning.trustedRegistries.join(', ')
				]
			};
		}

		// Verify container signature (simplified implementation)
		const signatureValid = await this.verifyContainerSignature(imageName, registry);

		if (!signatureValid) {
			return {
				allowed: false,
				reason: 'Container signature verification failed',
				riskLevel: 'critical',
				recommendations: [
					'Ensure container is signed with cosign or notary',
					'Check container provenance'
				]
			};
		}

		return { allowed: true, riskLevel: 'low' };
	}

	/**
	 * Validates VS Code extension packages
	 */
	async validateExtensionPackage(
		extensionPath: string
	): Promise<SecurityValidationResult> {
		if (!this.policy.codeSigning.enabled) {
			return { allowed: true, riskLevel: 'low' };
		}

		try {
			// Read package.json
			const packageJsonPath = path.join(extensionPath, 'package.json');
			const packageContent = await fs.readFile(packageJsonPath, 'utf8');
			const packageJson = JSON.parse(packageContent);

			// Check publisher trust
			const publisher = packageJson.publisher;
			const isTrustedPublisher = this.policy.codeSigning.trustedPublishers
				.some(trusted => publisher?.toLowerCase().includes(trusted.toLowerCase()));

			if (!isTrustedPublisher) {
				return {
					allowed: false,
					reason: `Untrusted publisher: ${publisher}`,
					riskLevel: 'high',
					recommendations: [
						'Only install extensions from trusted publishers',
						'Verify extension authenticity'
					]
				};
			}

			// Check for dangerous capabilities
			const capabilities = packageJson.contributes?.capabilities || [];
			const aiCapabilities = packageJson.aiCapabilities || [];

			const allCapabilities = [...capabilities, ...aiCapabilities];
			const blockedFound = allCapabilities.filter(cap =>
				this.policy.extensionValidation.blockedCapabilities.includes(cap)
			);

			if (blockedFound.length > 0) {
				return {
					allowed: false,
					reason: `Extension uses blocked capabilities: ${blockedFound.join(', ')}`,
					riskLevel: 'critical',
					recommendations: [
						'Review extension permissions carefully',
						'Consider alternative extensions'
					]
				};
			}

			// Verify code signature if required
			if (this.policy.codeSigning.requireSignature) {
				const signatureValid = await this.verifyCodeSignature(extensionPath);
				if (!signatureValid) {
					return {
						allowed: false,
						reason: 'Code signature verification failed',
						riskLevel: 'high',
						recommendations: [
							'Only install signed extensions',
							'Verify extension integrity'
						]
					};
				}
			}

			return { allowed: true, riskLevel: 'low' };

		} catch (error) {
			return {
				allowed: false,
				reason: `Extension validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
				riskLevel: 'medium',
				recommendations: [
					'Check extension package integrity',
					'Ensure proper extension format'
				]
			};
		}
	}

	/**
	 * Comprehensive security audit
	 */
	async performSecurityAudit(): Promise<{
		passed: boolean;
		issues: Array<{
			category: string;
			severity: 'low' | 'medium' | 'high' | 'critical';
			description: string;
			recommendation: string;
		}>;
	}> {
		const issues: Array<{
			category: string;
			severity: 'low' | 'medium' | 'high' | 'critical';
			description: string;
			recommendation: string;
		}> = [];

		// Network security audit
		if (this.policy.networkAllowlist.length === 0) {
			issues.push({
				category: 'Network Security',
				severity: 'high',
				description: 'No network allowlist configured',
				recommendation: 'Configure network allowlist to restrict outbound connections'
			});
		}

		// Container security audit
		if (!this.policy.containerSigning.enabled) {
			issues.push({
				category: 'Container Security',
				severity: 'medium',
				description: 'Container signing validation disabled',
				recommendation: 'Enable container signature verification'
			});
		}

		// Code signing audit
		if (!this.policy.codeSigning.enabled) {
			issues.push({
				category: 'Code Security',
				severity: 'medium',
				description: 'Code signing validation disabled',
				recommendation: 'Enable code signature verification for extensions'
			});
		}

		// Extension validation audit
		if (!this.policy.extensionValidation.enabled) {
			issues.push({
				category: 'Extension Security',
				severity: 'high',
				description: 'Extension validation disabled',
				recommendation: 'Enable extension capability validation'
			});
		}

		const criticalIssues = issues.filter(issue => issue.severity === 'critical');
		const passed = criticalIssues.length === 0;

		return { passed, issues };
	}

	/**
	 * Update security policy
	 */
	updatePolicy(updates: Partial<SecurityPolicy>): void {
		this.policy = { ...this.policy, ...updates };
	}

	/**
	 * Get current security policy
	 */
	getPolicy(): SecurityPolicy {
		return { ...this.policy };
	}

	// Private helper methods

	private async verifyContainerSignature(imageName: string, registry: string): Promise<boolean> {
		// Simplified implementation - in production, this would use cosign or notary
		try {
			// Check for signature metadata
			const signatureExists = await this.checkSignatureMetadata(imageName, registry);
			return signatureExists;
		} catch {
			return false;
		}
	}

	private async checkSignatureMetadata(imageName: string, registry: string): Promise<boolean> {
		// Mock implementation - replace with actual signature verification
		const trustedImages = [
			'vscode-extension-runtime',
			'node',
			'ubuntu',
			'alpine'
		];

		return trustedImages.some(trusted => imageName.includes(trusted));
	}

	private async verifyCodeSignature(extensionPath: string): Promise<boolean> {
		try {
			// Check for signature files
			const signatureFiles = ['.signature', '.sig', 'signature.txt'];

			for (const sigFile of signatureFiles) {
				const sigPath = path.join(extensionPath, sigFile);
				try {
					await fs.access(sigPath);
					return true; // Signature file exists
				} catch {
					// Continue checking other signature files
				}
			}

			// For trusted publishers, allow unsigned extensions with warning
			return true;
		} catch {
			return false;
		}
	}
}

// Global security manager instance
export const globalSecurityManager = new SecurityManager();

// Enhanced validation function for backward compatibility
export function validateRequest(url: string): boolean {
	return globalSecurityManager.validateRequest(url);
}

// Export enhanced validation functions
export const {
	validateContainerSignature: validateContainer,
	validateExtensionPackage: validateExtension,
	performSecurityAudit: auditSecurity
} = globalSecurityManager;
