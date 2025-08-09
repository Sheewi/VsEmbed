import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

interface EncryptedSecret {
	iv: string;
	encryptedData: string;
	authTag: string;
}

interface SecretsStore {
	version: string;
	secrets: { [key: string]: EncryptedSecret };
	created: string;
	lastModified: string;
}

export class SecretsManager {
	private readonly secretsDir = path.join(os.homedir(), '.vsembed', 'secrets');
	private readonly secretsFile = path.join(this.secretsDir, 'secrets.json');
	private passphrase: string | null = null;
	private secretsStore: SecretsStore | null = null;

	constructor() {
		this.ensureSecretsDirectory();
	}

	private async ensureSecretsDirectory(): Promise<void> {
		try {
			await fs.mkdir(this.secretsDir, { recursive: true });

			// Set restrictive permissions on secrets directory
			await fs.chmod(this.secretsDir, 0o700);
		} catch (error) {
			console.error('Failed to create secrets directory:', error);
		}
	}

	async setSecret(key: string, value: string): Promise<boolean> {
		try {
			if (!this.passphrase) {
				this.passphrase = await this.getPassphrase();
			}

			await this.loadSecretsStore();

			// Encrypt the secret
			const encrypted = this.encryptSecret(value, this.passphrase);

			// Store the encrypted secret
			this.secretsStore!.secrets[key] = encrypted;
			this.secretsStore!.lastModified = new Date().toISOString();

			// Save to disk
			await this.saveSecretsStore();

			return true;
		} catch (error) {
			console.error('Failed to set secret:', error);
			return false;
		}
	}

	async getSecret(key: string, requester: 'user' | 'ai'): Promise<string | null> {
		try {
			if (!this.passphrase) {
				this.passphrase = await this.getPassphrase();
			}

			await this.loadSecretsStore();

			const encryptedSecret = this.secretsStore?.secrets[key];
			if (!encryptedSecret) {
				return null;
			}

			// For AI requests, require explicit user approval
			if (requester === 'ai') {
				const approved = await this.requestSecretApproval(key);
				if (!approved) {
					console.log(`Secret access denied for AI request: ${key}`);
					return null;
				}
			}

			// Decrypt the secret
			const decrypted = this.decryptSecret(encryptedSecret, this.passphrase);
			return decrypted;
		} catch (error) {
			console.error('Failed to get secret:', error);
			return null;
		}
	}

	async deleteSecret(key: string): Promise<boolean> {
		try {
			await this.loadSecretsStore();

			if (!this.secretsStore?.secrets[key]) {
				return false;
			}

			delete this.secretsStore.secrets[key];
			this.secretsStore.lastModified = new Date().toISOString();

			await this.saveSecretsStore();
			return true;
		} catch (error) {
			console.error('Failed to delete secret:', error);
			return false;
		}
	}

	async listSecrets(): Promise<string[]> {
		try {
			await this.loadSecretsStore();
			return Object.keys(this.secretsStore?.secrets || {});
		} catch (error) {
			console.error('Failed to list secrets:', error);
			return [];
		}
	}

	async hasSecret(key: string): Promise<boolean> {
		try {
			await this.loadSecretsStore();
			return key in (this.secretsStore?.secrets || {});
		} catch (error) {
			console.error('Failed to check secret existence:', error);
			return false;
		}
	}

	async changePassphrase(oldPassphrase: string, newPassphrase: string): Promise<boolean> {
		try {
			// Verify old passphrase
			this.passphrase = oldPassphrase;
			await this.loadSecretsStore();

			// Re-encrypt all secrets with new passphrase
			const secrets = this.secretsStore!.secrets;
			const reencryptedSecrets: { [key: string]: EncryptedSecret } = {};

			for (const [key, encryptedSecret] of Object.entries(secrets)) {
				const decrypted = this.decryptSecret(encryptedSecret, oldPassphrase);
				reencryptedSecrets[key] = this.encryptSecret(decrypted, newPassphrase);
			}

			// Update store
			this.secretsStore!.secrets = reencryptedSecrets;
			this.secretsStore!.lastModified = new Date().toISOString();
			this.passphrase = newPassphrase;

			await this.saveSecretsStore();
			return true;
		} catch (error) {
			console.error('Failed to change passphrase:', error);
			return false;
		}
	}

	async exportSecrets(): Promise<{ keys: string[]; warning: string }> {
		const keys = await this.listSecrets();
		return {
			keys,
			warning: 'Secret values are encrypted and cannot be exported. Only keys are listed.',
		};
	}

	private async loadSecretsStore(): Promise<void> {
		try {
			const data = await fs.readFile(this.secretsFile, 'utf-8');
			this.secretsStore = JSON.parse(data);
		} catch (error) {
			if ((error as any).code === 'ENOENT') {
				// Create new store if file doesn't exist
				this.secretsStore = {
					version: '1.0.0',
					secrets: {},
					created: new Date().toISOString(),
					lastModified: new Date().toISOString(),
				};
			} else {
				throw error;
			}
		}
	}

	private async saveSecretsStore(): Promise<void> {
		if (!this.secretsStore) {
			throw new Error('No secrets store to save');
		}

		const data = JSON.stringify(this.secretsStore, null, 2);
		await fs.writeFile(this.secretsFile, data);

		// Set restrictive permissions on secrets file
		await fs.chmod(this.secretsFile, 0o600);
	}

	private encryptSecret(secret: string, passphrase: string): EncryptedSecret {
		// Derive key from passphrase
		const salt = crypto.randomBytes(32);
		const key = crypto.scryptSync(passphrase, salt, 32);

		// Generate IV
		const iv = crypto.randomBytes(16);

		// Create cipher
		const cipher = crypto.createCipherGCM('aes-256-gcm', key);
		cipher.setAAD(salt); // Use salt as additional authenticated data

		let encrypted = cipher.update(secret, 'utf8', 'hex');
		encrypted += cipher.final('hex');

		const authTag = cipher.getAuthTag();

		return {
			iv: Buffer.concat([salt, iv]).toString('hex'),
			encryptedData: encrypted,
			authTag: authTag.toString('hex'),
		};
	}

	private decryptSecret(encryptedSecret: EncryptedSecret, passphrase: string): string {
		// Extract salt and IV
		const ivBuffer = Buffer.from(encryptedSecret.iv, 'hex');
		const salt = ivBuffer.subarray(0, 32);
		const iv = ivBuffer.subarray(32, 48);

		// Derive key from passphrase
		const key = crypto.scryptSync(passphrase, salt, 32);

		// Create decipher
		const decipher = crypto.createDecipherGCM('aes-256-gcm', key);
		decipher.setAAD(salt);
		decipher.setAuthTag(Buffer.from(encryptedSecret.authTag, 'hex'));

		let decrypted = decipher.update(encryptedSecret.encryptedData, 'hex', 'utf8');
		decrypted += decipher.final('utf8');

		return decrypted;
	}

	private async getPassphrase(): Promise<string> {
		// In a real implementation, this would prompt the user for their passphrase
		// For now, use a default or environment variable
		const passphrase = process.env.VSEMBED_SECRETS_PASSPHRASE;

		if (!passphrase) {
			throw new Error('No passphrase provided. Set VSEMBED_SECRETS_PASSPHRASE environment variable or implement user prompt.');
		}

		return passphrase;
	}

	private async requestSecretApproval(key: string): Promise<boolean> {
		// In a real implementation, this would show a dialog to the user
		// asking for permission to access the secret
		console.log(`AI requesting access to secret: ${key}`);

		// For now, return false (deny access) for security
		// This should be implemented as a proper user dialog
		return false;
	}

	// Utility methods for integration with OS keyring (future enhancement)
	private async storeInKeyring(key: string, value: string): Promise<boolean> {
		// This would integrate with OS keyring (Keychain on macOS, Credential Manager on Windows, etc.)
		// For now, just log the intention
		console.log(`Would store ${key} in OS keyring`);
		return true;
	}

	private async getFromKeyring(key: string): Promise<string | null> {
		// This would retrieve from OS keyring
		console.log(`Would retrieve ${key} from OS keyring`);
		return null;
	}

	async clearAllSecrets(): Promise<boolean> {
		try {
			this.secretsStore = {
				version: '1.0.0',
				secrets: {},
				created: new Date().toISOString(),
				lastModified: new Date().toISOString(),
			};

			await this.saveSecretsStore();
			return true;
		} catch (error) {
			console.error('Failed to clear all secrets:', error);
			return false;
		}
	}

	async backupSecrets(backupPath: string): Promise<boolean> {
		try {
			await this.loadSecretsStore();

			// Create backup (still encrypted)
			const backupData = JSON.stringify(this.secretsStore, null, 2);
			await fs.writeFile(backupPath, backupData);

			// Set restrictive permissions
			await fs.chmod(backupPath, 0o600);

			return true;
		} catch (error) {
			console.error('Failed to backup secrets:', error);
			return false;
		}
	}

	async restoreSecrets(backupPath: string): Promise<boolean> {
		try {
			const backupData = await fs.readFile(backupPath, 'utf-8');
			const backupStore = JSON.parse(backupData) as SecretsStore;

			// Validate backup structure
			if (!backupStore.version || !backupStore.secrets) {
				throw new Error('Invalid backup file format');
			}

			this.secretsStore = backupStore;
			this.secretsStore.lastModified = new Date().toISOString();

			await this.saveSecretsStore();
			return true;
		} catch (error) {
			console.error('Failed to restore secrets:', error);
			return false;
		}
	}
}
