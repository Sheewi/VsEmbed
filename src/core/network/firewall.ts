import * as url from 'url';
import * as dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

export interface NetworkPolicy {
	allowedDomains: string[];
	blockedDomains: string[];
	allowedIPs: string[];
	blockedIPs: string[];
	requireHttps: boolean;
	maxRequestSize: number; // bytes
	rateLimit: {
		requestsPerMinute: number;
		burstLimit: number;
	};
	logAllRequests: boolean;
}

export interface RequestLog {
	timestamp: string;
	url: string;
	method: string;
	blocked: boolean;
	reason?: string;
	userAgent?: string;
	size?: number;
}

export class AIFirewall {
	private static readonly DEFAULT_POLICY: NetworkPolicy = {
		allowedDomains: [
			'api.openai.com',
			'api.anthropic.com',
			'api.cohere.ai',
			'generativelanguage.googleapis.com',
			'huggingface.co',
			'api.github.com',
			'github.com',
			'pkg.actions.githubusercontent.com', // Required for immutable actions
			'ghcr.io', // For future immutable action publishing
			'raw.githubusercontent.com',
			'marketplace.visualstudio.com',
			'vscode-update.azurewebsites.net',
			'registry.npmjs.org',
			'nodejs.org'
		],
		blockedDomains: [
			'malware-domain.com',
			'phishing-site.net',
			'cryptominer.evil'
		],
		allowedIPs: [],
		blockedIPs: [
			'0.0.0.0',
			'127.0.0.1', // Prevent localhost access
			'10.0.0.0/8',
			'172.16.0.0/12',
			'192.168.0.0/16'
		],
		requireHttps: true,
		maxRequestSize: 10 * 1024 * 1024, // 10MB
		rateLimit: {
			requestsPerMinute: 60,
			burstLimit: 10
		},
		logAllRequests: true
	};

	private policy: NetworkPolicy;
	private requestLog: RequestLog[] = [];
	private requestCounts = new Map<string, { count: number; lastReset: number }>();

	constructor(customPolicy?: Partial<NetworkPolicy>) {
		this.policy = { ...AIFirewall.DEFAULT_POLICY, ...customPolicy };
	}

	async checkRequest(requestUrl: string, options: {
		method?: string;
		userAgent?: string;
		contentLength?: number;
	} = {}): Promise<{ allowed: boolean; reason?: string }> {
		const { method = 'GET', userAgent = 'AI-Agent', contentLength = 0 } = options;

		try {
			const parsedUrl = new url.URL(requestUrl);

			// Log request
			const logEntry: RequestLog = {
				timestamp: new Date().toISOString(),
				url: requestUrl,
				method,
				blocked: false,
				userAgent,
				size: contentLength
			};

			// Check HTTPS requirement
			if (this.policy.requireHttps && parsedUrl.protocol !== 'https:') {
				logEntry.blocked = true;
				logEntry.reason = 'HTTPS required';
				this.addToLog(logEntry);
				return { allowed: false, reason: 'HTTPS required' };
			}

			// Check request size
			if (contentLength > this.policy.maxRequestSize) {
				logEntry.blocked = true;
				logEntry.reason = 'Request too large';
				this.addToLog(logEntry);
				return { allowed: false, reason: `Request size exceeds ${this.policy.maxRequestSize} bytes` };
			}

			// Check rate limiting
			const rateLimitCheck = this.checkRateLimit(parsedUrl.hostname);
			if (!rateLimitCheck.allowed) {
				logEntry.blocked = true;
				logEntry.reason = 'Rate limit exceeded';
				this.addToLog(logEntry);
				return { allowed: false, reason: 'Rate limit exceeded' };
			}

			// Check domain against blocklist
			if (this.isDomainBlocked(parsedUrl.hostname)) {
				logEntry.blocked = true;
				logEntry.reason = 'Domain blocked';
				this.addToLog(logEntry);
				return { allowed: false, reason: 'Domain is blocked' };
			}

			// Check domain against allowlist
			if (!this.isDomainAllowed(parsedUrl.hostname)) {
				logEntry.blocked = true;
				logEntry.reason = 'Domain not allowed';
				this.addToLog(logEntry);
				return { allowed: false, reason: 'Domain is not on allowlist' };
			}

			// Check IP address
			const ipCheck = await this.checkIPAddress(parsedUrl.hostname);
			if (!ipCheck.allowed) {
				logEntry.blocked = true;
				logEntry.reason = ipCheck.reason;
				this.addToLog(logEntry);
				return ipCheck;
			}

			// Request is allowed
			this.addToLog(logEntry);
			return { allowed: true };

		} catch (error) {
			const reason = `Invalid URL: ${error instanceof Error ? error.message : 'Unknown error'}`;
			this.addToLog({
				timestamp: new Date().toISOString(),
				url: requestUrl,
				method,
				blocked: true,
				reason,
				userAgent
			});
			return { allowed: false, reason };
		}
	}

	private isDomainAllowed(hostname: string): boolean {
		// Check exact matches
		if (this.policy.allowedDomains.includes(hostname)) {
			return true;
		}

		// Check wildcard matches
		return this.policy.allowedDomains.some(allowed => {
			if (allowed.startsWith('*.')) {
				const domain = allowed.substring(2);
				return hostname.endsWith(domain);
			}
			if (allowed.startsWith('.')) {
				return hostname.endsWith(allowed);
			}
			return false;
		});
	}

	private isDomainBlocked(hostname: string): boolean {
		// Check exact matches
		if (this.policy.blockedDomains.includes(hostname)) {
			return true;
		}

		// Check wildcard matches
		return this.policy.blockedDomains.some(blocked => {
			if (blocked.startsWith('*.')) {
				const domain = blocked.substring(2);
				return hostname.endsWith(domain);
			}
			if (blocked.startsWith('.')) {
				return hostname.endsWith(blocked);
			}
			return false;
		});
	}

	private async checkIPAddress(hostname: string): Promise<{ allowed: boolean; reason?: string }> {
		try {
			const { address } = await dnsLookup(hostname);

			// Check if IP is explicitly blocked
			if (this.policy.blockedIPs.includes(address)) {
				return { allowed: false, reason: 'IP address is blocked' };
			}

			// Check if IP is in blocked CIDR ranges
			if (this.isIPInBlockedRange(address)) {
				return { allowed: false, reason: 'IP address is in blocked range' };
			}

			// Check if we have an allowlist for IPs
			if (this.policy.allowedIPs.length > 0) {
				if (!this.policy.allowedIPs.includes(address)) {
					return { allowed: false, reason: 'IP address not in allowlist' };
				}
			}

			return { allowed: true };
		} catch (error) {
			return { allowed: false, reason: 'DNS resolution failed' };
		}
	}

	private isIPInBlockedRange(ip: string): boolean {
		// Simple CIDR check for common private ranges
		const privateRanges = [
			{ network: '10.0.0.0', mask: 8 },
			{ network: '172.16.0.0', mask: 12 },
			{ network: '192.168.0.0', mask: 16 },
			{ network: '127.0.0.0', mask: 8 }
		];

		for (const range of privateRanges) {
			if (this.isIPInCIDR(ip, range.network, range.mask)) {
				return true;
			}
		}

		return false;
	}

	private isIPInCIDR(ip: string, network: string, maskBits: number): boolean {
		const ipParts = ip.split('.').map(Number);
		const networkParts = network.split('.').map(Number);

		const mask = ~((1 << (32 - maskBits)) - 1);

		const ipInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
		const networkInt = (networkParts[0] << 24) | (networkParts[1] << 16) | (networkParts[2] << 8) | networkParts[3];

		return (ipInt & mask) === (networkInt & mask);
	}

	private checkRateLimit(hostname: string): { allowed: boolean; reason?: string } {
		const now = Date.now();
		const windowMs = 60 * 1000; // 1 minute window

		const key = hostname;
		const current = this.requestCounts.get(key);

		if (!current || (now - current.lastReset) > windowMs) {
			// Reset or initialize counter
			this.requestCounts.set(key, { count: 1, lastReset: now });
			return { allowed: true };
		}

		if (current.count >= this.policy.rateLimit.requestsPerMinute) {
			return { allowed: false, reason: 'Rate limit exceeded' };
		}

		// Increment counter
		current.count++;
		this.requestCounts.set(key, current);

		return { allowed: true };
	}

	private addToLog(entry: RequestLog): void {
		if (this.policy.logAllRequests) {
			this.requestLog.push(entry);

			// Keep only last 1000 entries
			if (this.requestLog.length > 1000) {
				this.requestLog = this.requestLog.slice(-1000);
			}
		}
	}

	// Public methods for managing the firewall

	addAllowedDomain(domain: string): void {
		if (!this.policy.allowedDomains.includes(domain)) {
			this.policy.allowedDomains.push(domain);
		}
	}

	removeAllowedDomain(domain: string): void {
		const index = this.policy.allowedDomains.indexOf(domain);
		if (index !== -1) {
			this.policy.allowedDomains.splice(index, 1);
		}
	}

	addBlockedDomain(domain: string): void {
		if (!this.policy.blockedDomains.includes(domain)) {
			this.policy.blockedDomains.push(domain);
		}
	}

	removeBlockedDomain(domain: string): void {
		const index = this.policy.blockedDomains.indexOf(domain);
		if (index !== -1) {
			this.policy.blockedDomains.splice(index, 1);
		}
	}

	updateRateLimit(requestsPerMinute: number, burstLimit?: number): void {
		this.policy.rateLimit.requestsPerMinute = requestsPerMinute;
		if (burstLimit !== undefined) {
			this.policy.rateLimit.burstLimit = burstLimit;
		}
	}

	getPolicy(): NetworkPolicy {
		return { ...this.policy };
	}

	getRequestLog(): RequestLog[] {
		return [...this.requestLog];
	}

	getBlockedRequests(): RequestLog[] {
		return this.requestLog.filter(entry => entry.blocked);
	}

	clearRequestLog(): void {
		this.requestLog.length = 0;
	}

	getStatistics(): {
		totalRequests: number;
		blockedRequests: number;
		allowedRequests: number;
		blockRate: number;
		topBlockedDomains: string[];
		topAllowedDomains: string[];
	} {
		const total = this.requestLog.length;
		const blocked = this.requestLog.filter(entry => entry.blocked).length;
		const allowed = total - blocked;

		// Count domain frequencies
		const blockedDomains = new Map<string, number>();
		const allowedDomains = new Map<string, number>();

		this.requestLog.forEach(entry => {
			try {
				const hostname = new url.URL(entry.url).hostname;
				if (entry.blocked) {
					blockedDomains.set(hostname, (blockedDomains.get(hostname) || 0) + 1);
				} else {
					allowedDomains.set(hostname, (allowedDomains.get(hostname) || 0) + 1);
				}
			} catch (error) {
				// Invalid URL, skip
			}
		});

		const topBlocked = Array.from(blockedDomains.entries())
			.sort(([, a], [, b]) => b - a)
			.slice(0, 5)
			.map(([domain]) => domain);

		const topAllowed = Array.from(allowedDomains.entries())
			.sort(([, a], [, b]) => b - a)
			.slice(0, 5)
			.map(([domain]) => domain);

		return {
			totalRequests: total,
			blockedRequests: blocked,
			allowedRequests: allowed,
			blockRate: total > 0 ? blocked / total : 0,
			topBlockedDomains: topBlocked,
			topAllowedDomains: topAllowed
		};
	}

	// Create a secure fetch wrapper
	createSecureFetch(): typeof fetch {
		return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
			const requestUrl = typeof input === 'string' ? input : input.toString();

			const check = await this.checkRequest(requestUrl, {
				method: init?.method || 'GET',
				userAgent: init?.headers?.['User-Agent'] as string,
				contentLength: init?.body ? new Blob([init.body]).size : 0
			});

			if (!check.allowed) {
				throw new Error(`Request blocked by firewall: ${check.reason}`);
			}

			// Use original fetch if allowed
			return fetch(input, init);
		};
	}
}

// Global firewall instance
export const globalFirewall = new AIFirewall();

// Convenience function for checking URLs
export function checkUrl(url: string): Promise<{ allowed: boolean; reason?: string }> {
	return globalFirewall.checkRequest(url);
}

// Enhanced validation function for GitHub Actions support
export function validateRequest(url: string): boolean {
	const ALLOWED_DOMAINS = [
		'api.github.com',
		'pkg.actions.githubusercontent.com', // Required for immutable actions
		'ghcr.io' // For future immutable action publishing
	];

	try {
		const parsedUrl = new URL(url);
		return ALLOWED_DOMAINS.some(domain =>
			parsedUrl.hostname === domain || parsedUrl.hostname.endsWith('.' + domain)
		);
	} catch {
		return false;
	}
}

// Secure fetch function
export const secureFetch = globalFirewall.createSecureFetch();
