const path = require('path');

module.exports = {
	packagerConfig: {
		name: 'VSEmbed',
		executableName: 'vsembed',
		icon: './assets/icon',
		appBundleId: 'com.vsembed.app',
		appCategoryType: 'public.app-category.developer-tools',
		protocols: [
			{
				name: 'VSEmbed Protocol',
				schemes: ['vsembed']
			}
		],
		extraResource: [
			'./src/ai/models',
			'./scripts',
			'./.vscode/security-policy.yml'
		],
		ignore: [
			/^\/\.git/,
			/^\/node_modules\/(?!(@types|typescript))/,
			/^\/src\/.*\.ts$/,
			/^\/\..*$/,
			/^\/docs/,
			/^\/test/
		]
	},
	rebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				name: 'VSEmbed',
				setupIcon: './assets/icon.ico',
				loadingGif: './assets/installing.gif',
				certificateFile: process.env.WINDOWS_CERTIFICATE_FILE,
				certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD
			}
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin', 'linux']
		},
		{
			name: '@electron-forge/maker-deb',
			config: {
				options: {
					maintainer: 'VSEmbed Team',
					homepage: 'https://github.com/Sheewi/VsEmbed',
					description: 'AI-Enhanced VS Code Environment with Security',
					productDescription: 'VSEmbed provides a secure, AI-enhanced development environment based on VS Code OSS with advanced model management and security features.',
					categories: ['Development', 'IDE'],
					depends: ['gconf2', 'gconf-service', 'libnotify4', 'libxtst6', 'libnss3'],
					section: 'devel',
					priority: 'optional',
					genericName: 'Code Editor',
					mimeType: ['text/plain', 'inode/directory']
				}
			}
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {
				options: {
					license: 'MIT',
					homepage: 'https://github.com/Sheewi/VsEmbed',
					description: 'AI-Enhanced VS Code Environment with Security',
					productDescription: 'VSEmbed provides a secure, AI-enhanced development environment based on VS Code OSS.',
					categories: ['Development'],
					requires: ['gconf2', 'libnotify', 'libXtst6', 'nss']
				}
			}
		},
		{
			name: '@electron-forge/maker-dmg',
			config: {
				name: 'VSEmbed',
				title: 'VSEmbed ${version}',
				icon: './assets/icon.icns',
				background: './assets/dmg-background.png',
				contents: [
					{ x: 448, y: 344, type: 'link', path: '/Applications' },
					{ x: 192, y: 344, type: 'file', path: 'VSEmbed.app' }
				]
			}
		}
	],
	plugins: [
		{
			name: '@electron-forge/plugin-auto-unpack-natives',
			config: {}
		},
		{
			name: '@electron-forge/plugin-webpack',
			config: {
				mainConfig: './webpack.main.config.js',
				renderer: {
					config: './webpack.renderer.config.js',
					entryPoints: [
						{
							html: './src/renderer/index.html',
							js: './src/renderer/index.tsx',
							name: 'main_window',
							preload: {
								js: './src/main/preload.ts'
							}
						}
					]
				},
				devContentSecurityPolicy: "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:; connect-src 'self' https: wss: ws:;"
			}
		}
	],
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				repository: {
					owner: 'Sheewi',
					name: 'VsEmbed'
				},
				prerelease: false,
				draft: true
			}
		}
	],
	hooks: {
		readPackageJson: async (forgeConfig, packageJson) => {
			// Only copy the needed dependencies to reduce bundle size
			if (packageJson.dependencies) {
				const keepDeps = [
					'electron-squirrel-startup',
					'electron-store',
					'node-pty',
					'vscode-languageserver',
					'typescript'
				];

				const newDeps = {};
				keepDeps.forEach(dep => {
					if (packageJson.dependencies[dep]) {
						newDeps[dep] = packageJson.dependencies[dep];
					}
				});

				packageJson.dependencies = newDeps;
			}

			return packageJson;
		},
		packageAfterCopy: async (forgeConfig, buildPath) => {
			// Copy additional resources
			const fs = require('fs-extra');

			// Copy AI models directory structure
			await fs.ensureDir(path.join(buildPath, 'resources', 'ai_models'));

			// Copy scripts
			await fs.copy(
				path.join(__dirname, 'scripts'),
				path.join(buildPath, 'resources', 'scripts')
			);

			// Copy security policy
			await fs.copy(
				path.join(__dirname, '.vscode', 'security-policy.yml'),
				path.join(buildPath, 'resources', 'security-policy.yml')
			);

			console.log('Additional resources copied successfully');
		}
	}
};
