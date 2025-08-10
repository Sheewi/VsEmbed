/**
 * VSEmbed Server Main Entry Point
 * Enhanced with immutable actions support for GitHub Actions compatibility
 */

// Add immutable actions support
if (process.env.GITHUB_ACTIONS) {
	require('./immutable-actions-patch');
}

// Standard VS Code server initialization
const { createServer } = require('vs/server/node/server');
const { validateRequest } = require('../../../core/network/firewall');

// Enhanced server with security layer
class VSEmbedServer {
	constructor() {
		this.server = null;
		this.securityEnabled = process.env.VSEMBED_SECURITY !== 'false';
	}

	async start() {
		console.log('Starting VSEmbed Server...');

		// Initialize security if enabled
		if (this.securityEnabled) {
			console.log('Security layer enabled');
			this.setupSecurityMiddleware();
		}

		// Create VS Code server instance
		this.server = await createServer({
			port: process.env.PORT || 8080,
			host: process.env.HOST || 'localhost',
			connectionToken: process.env.CONNECTION_TOKEN || 'dev-token',
			withoutConnectionToken: process.env.WITHOUT_CONNECTION_TOKEN === 'true'
		});

		console.log('VSEmbed Server started successfully');
		return this.server;
	}

	setupSecurityMiddleware() {
		// Network request validation
		const originalFetch = global.fetch;
		global.fetch = async (url, options) => {
			if (typeof url === 'string' && !validateRequest(url)) {
				throw new Error(`Network request blocked by security policy: ${url}`);
			}
			return originalFetch(url, options);
		};

		// Extension loading security
		if (process.env.SECURE_EXTENSIONS === 'true') {
			const { SecureExtensionHost } = require('../../../core/extensions/loader');
			global.extensionHost = new SecureExtensionHost();
		}
	}

	async stop() {
		if (this.server) {
			await this.server.close();
			console.log('VSEmbed Server stopped');
		}
	}
}

// Error handling
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
	console.log('Received SIGTERM, shutting down gracefully');
	if (global.vsembedServer) {
		await global.vsembedServer.stop();
	}
	process.exit(0);
});

process.on('SIGINT', async () => {
	console.log('Received SIGINT, shutting down gracefully');
	if (global.vsembedServer) {
		await global.vsembedServer.stop();
	}
	process.exit(0);
});

// Start server if this is the main module
if (require.main === module) {
	const server = new VSEmbedServer();
	global.vsembedServer = server;

	server.start().catch((error) => {
		console.error('Failed to start VSEmbed Server:', error);
		process.exit(1);
	});
}

module.exports = { VSEmbedServer };
