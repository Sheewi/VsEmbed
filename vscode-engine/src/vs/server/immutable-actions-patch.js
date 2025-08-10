/**
 * Immutable Actions Patch for GitHub Actions Compatibility
 * Provides support for immutable action requirements and check run modifications
 */

const fs = require('fs');
const path = require('path');

class ImmutableActionsPatch {
	constructor() {
		this.initialized = false;
		this.actionCache = new Map();
		this.checkRunSupport = process.env.GITHUB_ACTIONS_CHECK_RUNS === 'true';
	}

	async initialize() {
		if (this.initialized) return;

		console.log('Initializing Immutable Actions Patch...');

		// Set up GitHub Actions environment variables
		this.setupGitHubEnv();

		// Configure action caching
		this.setupActionCaching();

		// Set up check run support (effective March 31, 2025)
		if (this.checkRunSupport) {
			this.setupCheckRunSupport();
		}

		// Set up network allowlist for GitHub Actions
		this.setupNetworkAllowlist();

		this.initialized = true;
		console.log('Immutable Actions Patch initialized successfully');
	}

	setupGitHubEnv() {
		// Ensure required GitHub Actions environment variables
		const requiredEnvVars = [
			'GITHUB_ACTIONS',
			'GITHUB_WORKSPACE',
			'GITHUB_REPOSITORY',
			'GITHUB_SHA',
			'GITHUB_REF'
		];

		const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
		if (missingVars.length > 0) {
			console.warn('Missing GitHub Actions environment variables:', missingVars);
		}

		// Set defaults for development
		if (!process.env.GITHUB_WORKSPACE) {
			process.env.GITHUB_WORKSPACE = process.cwd();
		}
	}

	setupActionCaching() {
		// Create cache directory for immutable actions
		const cacheDir = path.join(process.env.GITHUB_WORKSPACE || process.cwd(), '.github-actions-cache');

		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}

		// Override action loading to use cached immutable versions
		this.patchActionLoader(cacheDir);
	}

	patchActionLoader(cacheDir) {
		// Intercept action loading and ensure immutable versions are used
		const originalRequire = require;

		require = function (id) {
			// Check if this is a GitHub action request
			if (id.includes('actions/') || id.includes('@actions/')) {
				const cachedPath = path.join(cacheDir, id.replace(/[^a-zA-Z0-9]/g, '_') + '.json');

				if (fs.existsSync(cachedPath)) {
					const cachedData = JSON.parse(fs.readFileSync(cachedPath, 'utf8'));
					console.log(`Using cached immutable action: ${id}`);
					return cachedData;
				}
			}

			return originalRequire.apply(this, arguments);
		};

		// Copy properties from original require
		Object.setPrototypeOf(require, originalRequire);
		Object.defineProperties(require, Object.getOwnPropertyDescriptors(originalRequire));
	}

	setupCheckRunSupport() {
		console.log('Setting up enhanced check run support for GitHub Actions API changes');

		// Patch GitHub API calls to support new check run format (March 31, 2025)
		const originalFetch = global.fetch || require('node-fetch');

		global.fetch = async function (url, options = {}) {
			// Intercept GitHub API check run requests
			if (typeof url === 'string' && url.includes('api.github.com') && url.includes('/check-runs')) {
				console.log('Intercepting check run API request:', url);

				// Modify request to use new check run format
				const modifiedOptions = {
					...options,
					headers: {
						...options.headers,
						'Accept': 'application/vnd.github.v3+json',
						'X-GitHub-Api-Version': '2022-11-28',
						'User-Agent': 'VSEmbed-ImmutableActions/1.0'
					}
				};

				// Add required fields for new check run format
				if (options.method === 'POST' && options.body) {
					try {
						const body = JSON.parse(options.body);
						body.external_id = body.external_id || `vsembed-${Date.now()}`;
						body.started_at = body.started_at || new Date().toISOString();
						modifiedOptions.body = JSON.stringify(body);
					} catch (error) {
						console.warn('Failed to modify check run body:', error);
					}
				}

				return originalFetch(url, modifiedOptions);
			}

			return originalFetch(url, options);
		};
	}

	setupNetworkAllowlist() {
		// Ensure GitHub Actions domains are in the network allowlist
		const { globalFirewall } = require('../../../core/network/firewall');

		const requiredDomains = [
			'api.github.com',
			'pkg.actions.githubusercontent.com',
			'ghcr.io',
			'github.com',
			'objects.githubusercontent.com',
			'codeload.github.com'
		];

		requiredDomains.forEach(domain => {
			globalFirewall.addAllowedDomain(domain);
		});

		console.log('Added GitHub Actions domains to network allowlist');
	}

	// Public API for action validation
	async validateAction(actionRef) {
		try {
			// Parse action reference (e.g., "actions/checkout@v4")
			const [owner, repoAndVersion] = actionRef.split('/');
			const [repo, version] = repoAndVersion.split('@');

			// Check if action is from trusted sources
			const trustedOwners = ['actions', 'github', 'microsoft', 'docker'];
			if (!trustedOwners.includes(owner)) {
				console.warn(`Action from untrusted owner: ${owner}`);
				return false;
			}

			// Validate version format (should be v* or commit SHA)
			if (!version || (!version.startsWith('v') && !/^[a-f0-9]{40}$/i.test(version))) {
				console.warn(`Invalid action version format: ${version}`);
				return false;
			}

			console.log(`Validated action: ${actionRef}`);
			return true;
		} catch (error) {
			console.error('Action validation failed:', error);
			return false;
		}
	}

	// Get action metadata
	getActionMetadata(actionRef) {
		return {
			ref: actionRef,
			cached: this.actionCache.has(actionRef),
			immutable: true,
			timestamp: new Date().toISOString(),
			supportedFeatures: {
				checkRuns: this.checkRunSupport,
				immutableActions: true,
				networkAllowlist: true
			}
		};
	}
}

// Initialize patch when module is loaded
const patch = new ImmutableActionsPatch();

// Auto-initialize in GitHub Actions environment
if (process.env.GITHUB_ACTIONS) {
	patch.initialize().catch(error => {
		console.error('Failed to initialize Immutable Actions Patch:', error);
	});
}

module.exports = {
	ImmutableActionsPatch,
	patch,
	validateAction: (actionRef) => patch.validateAction(actionRef),
	getActionMetadata: (actionRef) => patch.getActionMetadata(actionRef)
};
