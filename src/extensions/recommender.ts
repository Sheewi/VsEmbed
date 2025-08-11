// Define ExtensionRecommendation interface directly if './config' does not exist
export interface ExtensionRecommendation {
	extensionId: string;
	reason: string;
	urgency: 'low' | 'medium' | 'high';
	category: string;
	requiredForTask?: string;
}

interface ExtensionTool {
	extension: string;
	name: string;
	title: string;
	category: string;
	description?: string;
	dangerous?: boolean;
}

interface WorkspaceContext {
	files: Array<{ path: string; language?: string }>;
	installedExtensions: string[];
	activeExtensions: string[];
	aiTask?: string;
	dependencies: Record<string, string>;
	gitRepo?: {
		url: string;
		branch: string;
	};
}

export class ExtensionRecommender {
	private readonly contextRules: Record<string, string[]> = {
		// Language-based recommendations
		'package.json': [
			'esbenp.prettier-vscode',
			'dbaeumer.vscode-eslint',
			'bradlc.vscode-tailwindcss',
			'ms-vscode.vscode-typescript-next'
		],
		'*.py': [
			'ms-python.python',
			'ms-python.pylint',
			'ms-python.black-formatter',
			'ms-toolsai.jupyter'
		],
		'*.go': ['golang.go'],
		'*.rs': ['rust-lang.rust-analyzer'],
		'*.java': ['redhat.java', 'vscjava.vscode-java-pack'],
		'*.cs': ['ms-dotnettools.csharp'],
		'*.php': ['bmewburn.vscode-intelephense-client'],
		'*.rb': ['rebornix.ruby'],

		// Framework-based recommendations
		'Dockerfile': [
			'ms-azuretools.vscode-docker',
			'ms-kubernetes-tools.vscode-kubernetes-tools'
		],
		'docker-compose.yml': ['ms-azuretools.vscode-docker'],
		'.terraform': ['hashicorp.terraform'],
		'requirements.txt': ['ms-python.python'],
		'Cargo.toml': ['rust-lang.rust-analyzer'],
		'go.mod': ['golang.go'],
		'pom.xml': ['redhat.java'],
		'build.gradle': ['redhat.java'],

		// Security and DevOps
		'.github/workflows': ['github.vscode-github-actions'],
		'.gitlab-ci.yml': ['gitlab.gitlab-workflow'],
		'ansible.cfg': ['redhat.ansible'],

		// Database
		'*.sql': ['ms-mssql.mssql'],
		'schema.prisma': ['prisma.prisma'],

		// Configuration
		'.env': ['mikestead.dotenv'],
		'*.toml': ['tamasfe.even-better-toml'],
		'*.yaml': ['redhat.vscode-yaml'],
		'*.yml': ['redhat.vscode-yaml']
	};

	private readonly taskBasedRules: Record<string, string[]> = {
		'docker': ['ms-azuretools.vscode-docker'],
		'kubernetes': ['ms-kubernetes-tools.vscode-kubernetes-tools'],
		'security': ['kali-linux.security-tools'],
		'testing': ['ms-vscode.test-adapter-converter'],
		'debugging': ['ms-vscode.vscode-js-debug'],
		'git': ['eamodio.gitlens'],
		'database': ['ms-mssql.mssql', 'mtxr.sqltools'],
		'api': ['humao.rest-client', 'ms-vscode.vscode-thunder-client'],
		'documentation': ['yzhang.markdown-all-in-one', 'shd101wyy.markdown-preview-enhanced']
	};

	recommendExtensions(context: WorkspaceContext): ExtensionRecommendation[] {
		const recommendations: ExtensionRecommendation[] = [];

		// File-based recommendations
		context.files.forEach(file => {
			const matched = Object.entries(this.contextRules)
				.filter(([pattern]) => this.matchesPattern(pattern, file.path));

			matched.forEach(([pattern, extIds]) => {
				extIds.forEach(extId => {
					if (!context.installedExtensions.includes(extId)) {
						recommendations.push({
							extensionId: extId,
							reason: `Recommended for ${this.getFileType(pattern)} files`,
							urgency: this.getUrgency(extId, pattern),
							category: this.getCategory(extId),
							requiredForTask: file.path
						});
					}
				});
			});
		});

		// Task-based recommendations
		if (context.aiTask) {
			const taskKeywords = context.aiTask.toLowerCase();
			Object.entries(this.taskBasedRules).forEach(([task, extIds]) => {
				if (taskKeywords.includes(task)) {
					extIds.forEach(extId => {
						if (!context.installedExtensions.includes(extId)) {
							recommendations.push({
								extensionId: extId,
								reason: `Required for ${task} operations`,
								urgency: 'high',
								category: 'task-specific',
								requiredForTask: context.aiTask
							});
						}
					});
				}
			});
		}

		// Dependency-based recommendations
		Object.entries(context.dependencies).forEach(([dep, version]) => {
			const extId = this.getDependencyExtension(dep);
			if (extId && !context.installedExtensions.includes(extId)) {
				recommendations.push({
					extensionId: extId,
					reason: `Enhances support for ${dep}`,
					urgency: 'medium',
					category: 'dependency',
					requiredForTask: `${dep}@${version}`
				});
			}
		});

		return this.dedupeAndPrioritize(recommendations);
	}

	private matchesPattern(pattern: string, filePath: string): boolean {
		if (pattern.includes('*')) {
			const regex = new RegExp(pattern.replace('*', '.*'));
			return regex.test(filePath);
		}
		return filePath.includes(pattern);
	}

	private getFileType(pattern: string): string {
		if (pattern.includes('.')) {
			return pattern.split('.').pop() || 'file';
		}
		return pattern;
	}

	private getUrgency(extensionId: string, pattern: string): 'low' | 'medium' | 'high' {
		// Essential language servers are high priority
		const essential = [
			'ms-python.python',
			'ms-vscode.vscode-typescript-next',
			'golang.go',
			'rust-lang.rust-analyzer'
		];

		if (essential.includes(extensionId)) return 'high';

		// Formatters and linters are medium priority
		if (extensionId.includes('prettier') || extensionId.includes('eslint')) {
			return 'medium';
		}

		return 'low';
	}

	private getCategory(extensionId: string): string {
		if (extensionId.includes('python')) return 'language';
		if (extensionId.includes('docker')) return 'containerization';
		if (extensionId.includes('prettier') || extensionId.includes('eslint')) return 'formatting';
		if (extensionId.includes('git')) return 'version-control';
		return 'utility';
	}

	private getDependencyExtension(dependency: string): string | null {
		const depMap: Record<string, string> = {
			'react': 'ms-vscode.vscode-typescript-next',
			'vue': 'vue.volar',
			'angular': 'angular.ng-template',
			'svelte': 'svelte.svelte-vscode',
			'prisma': 'prisma.prisma',
			'graphql': 'graphql.vscode-graphql',
			'jest': 'orta.vscode-jest',
			'cypress': 'cypress-io.vscode-cypress',
			'tailwindcss': 'bradlc.vscode-tailwindcss'
		};

		return depMap[dependency] || null;
	}

	private dedupeAndPrioritize(recommendations: ExtensionRecommendation[]): ExtensionRecommendation[] {
		const seen = new Set<string>();
		const deduped = recommendations.filter(rec => {
			if (seen.has(rec.extensionId)) return false;
			seen.add(rec.extensionId);
			return true;
		});

		// Sort by urgency and category
		return deduped.sort((a, b) => {
			const urgencyOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
			const urgencyDiff = (urgencyOrder[b.urgency] || 0) - (urgencyOrder[a.urgency] || 0);

			if (urgencyDiff !== 0) return urgencyDiff;

			// Secondary sort by category importance
			const categoryOrder: Record<string, number> = { language: 4, formatting: 3, 'task-specific': 2, utility: 1 };
			return (categoryOrder[b.category] || 0) - (categoryOrder[a.category] || 0);
		});
	}

	getInstallationScript(recommendations: ExtensionRecommendation[]): string[] {
		return recommendations.map(rec =>
			`code --install-extension ${rec.extensionId}`
		);
	}

	generateInstallCommand(extensionIds: string[]): string {
		return extensionIds
			.map(id => `--install-extension ${id}`)
			.join(' ');
	}

	async getExtensionInfo(extensionId: string): Promise<any> {
		// Extension metadata and security info
		const extensionDatabase: Record<string, any> = {
			'ms-python.python': {
				name: 'Python',
				publisher: 'Microsoft',
				category: 'language',
				security: {
					requiresIsolation: false,
					requiredCapabilities: []
				},
				resources: {
					memory: '256m',
					cpu: '0.3'
				}
			},
			'ms-vscode.vscode-typescript-next': {
				name: 'TypeScript',
				publisher: 'Microsoft',
				category: 'language',
				security: {
					requiresIsolation: false,
					requiredCapabilities: []
				},
				resources: {
					memory: '512m',
					cpu: '0.5'
				}
			},
			'ms-azuretools.vscode-docker': {
				name: 'Docker',
				publisher: 'Microsoft',
				category: 'containerization',
				security: {
					requiresIsolation: true,
					requiredCapabilities: ['SYS_ADMIN']
				},
				resources: {
					memory: '128m',
					cpu: '0.2'
				}
			}
		};

		return extensionDatabase[extensionId] || {
			name: extensionId,
			publisher: 'Unknown',
			category: 'utility',
			security: {
				requiresIsolation: false,
				requiredCapabilities: []
			},
			resources: {
				memory: '128m',
				cpu: '0.1'
			}
		};
	}

	async installExtension(extensionId: string): Promise<{ success: boolean; message: string }> {
		try {
			// Simulate extension installation since we're in a sandboxed environment
			console.log(`Installing extension: ${extensionId}`);
			
			// In a real implementation, this would interface with VS Code's extension API
			// For now, we'll just simulate a successful installation
			const extensionInfo = await this.getExtensionInfo(extensionId);
			
			return {
				success: true,
				message: `Successfully installed ${extensionInfo.name} (${extensionId})`
			};
		} catch (error) {
			return {
				success: false,
				message: `Failed to install ${extensionId}: ${error instanceof Error ? error.message : 'Unknown error'}`
			};
		}
	}
}
