import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AIService } from './ai-service';
import { Project, ProjectFile, ProjectConstraints } from './feedback-loop';

export interface ProjectTemplate {
	id: string;
	name: string;
	description: string;
	category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'desktop' | 'library';
	frameworks: string[];
	languages: string[];
	files: TemplateFile[];
	dependencies: TemplateDependency[];
	scripts: TemplateScript[];
	infrastructure?: InfrastructureConfig;
	compatibility: string[]; // Compatible template IDs for mixing
}

export interface TemplateFile {
	path: string;
	content: string;
	language: string;
	purpose: string;
	isTemplate: boolean; // If true, content will be processed for variables
	variables?: TemplateVariable[];
}

export interface TemplateVariable {
	name: string;
	type: 'string' | 'number' | 'boolean' | 'choice';
	description: string;
	default?: any;
	choices?: string[]; // For choice type
	required: boolean;
}

export interface TemplateDependency {
	name: string;
	version: string;
	type: 'dependency' | 'devDependency' | 'peerDependency';
	manager: 'npm' | 'yarn' | 'pip' | 'composer' | 'maven' | 'gradle';
}

export interface TemplateScript {
	name: string;
	command: string;
	description: string;
	stage: 'build' | 'test' | 'start' | 'deploy' | 'dev';
}

export interface InfrastructureConfig {
	docker?: DockerConfig;
	kubernetes?: KubernetesConfig;
	terraform?: TerraformConfig;
	cicd?: CICDConfig;
}

export interface DockerConfig {
	baseImage: string;
	ports: number[];
	volumes: string[];
	environment: Record<string, string>;
	commands: string[];
}

export interface KubernetesConfig {
	namespace: string;
	replicas: number;
	resources: {
		limits: { cpu: string; memory: string };
		requests: { cpu: string; memory: string };
	};
	service: {
		type: 'ClusterIP' | 'NodePort' | 'LoadBalancer';
		ports: number[];
	};
}

export interface TerraformConfig {
	provider: string;
	resources: TerraformResource[];
	variables: TerraformVariable[];
}

export interface TerraformResource {
	type: string;
	name: string;
	config: Record<string, any>;
}

export interface TerraformVariable {
	name: string;
	type: string;
	description: string;
	default?: any;
}

export interface CICDConfig {
	platform: 'github-actions' | 'gitlab-ci' | 'jenkins' | 'azure-devops';
	stages: CICDStage[];
	triggers: string[];
}

export interface CICDStage {
	name: string;
	steps: CICDStep[];
	dependencies?: string[];
}

export interface CICDStep {
	name: string;
	action: string;
	parameters: Record<string, any>;
}

export interface ProjectGenerationRequest {
	name: string;
	description: string;
	templates: string[]; // Template IDs to mix
	variables: Record<string, any>;
	constraints: ProjectConstraints;
	infrastructure: boolean;
	outputPath: string;
}

export interface ProjectGenerationResult {
	project: Project;
	files: ProjectFile[];
	infrastructure?: {
		dockerfile?: string;
		dockerCompose?: string;
		kubernetes?: string[];
		terraform?: string[];
		cicd?: string;
	};
	scripts: TemplateScript[];
	nextSteps: string[];
}

export class TemplateRegistry {
	private templates = new Map<string, ProjectTemplate>();

	constructor() {
		this.loadBuiltInTemplates();
	}

	private loadBuiltInTemplates(): void {
		// React Frontend Template
		this.templates.set('react-frontend', {
			id: 'react-frontend',
			name: 'React Frontend',
			description: 'Modern React application with TypeScript and Vite',
			category: 'frontend',
			frameworks: ['React', 'Vite'],
			languages: ['TypeScript', 'CSS'],
			files: [
				{
					path: 'src/App.tsx',
					content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>{{projectName}}</h1>
        <p>{{description}}</p>
      </header>
    </div>
  );
}

export default App;`,
					language: 'typescript',
					purpose: 'main-component',
					isTemplate: true,
					variables: [
						{ name: 'projectName', type: 'string', description: 'Project name', required: true },
						{ name: 'description', type: 'string', description: 'Project description', required: false }
					]
				},
				{
					path: 'package.json',
					content: `{
  "name": "{{projectName}}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}`,
					language: 'json',
					purpose: 'package-config',
					isTemplate: true
				}
			],
			dependencies: [
				{ name: 'react', version: '^18.2.0', type: 'dependency', manager: 'npm' },
				{ name: 'react-dom', version: '^18.2.0', type: 'dependency', manager: 'npm' },
				{ name: 'vite', version: '^4.4.5', type: 'devDependency', manager: 'npm' }
			],
			scripts: [
				{ name: 'dev', command: 'vite', description: 'Start development server', stage: 'dev' },
				{ name: 'build', command: 'tsc && vite build', description: 'Build for production', stage: 'build' },
				{ name: 'preview', command: 'vite preview', description: 'Preview production build', stage: 'start' }
			],
			compatibility: ['express-backend', 'django-backend', 'node-backend']
		});

		// Express Backend Template
		this.templates.set('express-backend', {
			id: 'express-backend',
			name: 'Express Backend',
			description: 'Node.js backend with Express and TypeScript',
			category: 'backend',
			frameworks: ['Express', 'Node.js'],
			languages: ['TypeScript'],
			files: [
				{
					path: 'src/app.ts',
					content: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || {{port}};

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to {{projectName}} API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

export default app;`,
					language: 'typescript',
					purpose: 'main-server',
					isTemplate: true,
					variables: [
						{ name: 'port', type: 'number', description: 'Server port', default: 3000, required: false }
					]
				}
			],
			dependencies: [
				{ name: 'express', version: '^4.18.2', type: 'dependency', manager: 'npm' },
				{ name: 'cors', version: '^2.8.5', type: 'dependency', manager: 'npm' },
				{ name: 'helmet', version: '^7.0.0', type: 'dependency', manager: 'npm' }
			],
			scripts: [
				{ name: 'dev', command: 'nodemon src/app.ts', description: 'Start development server', stage: 'dev' },
				{ name: 'build', command: 'tsc', description: 'Build TypeScript', stage: 'build' },
				{ name: 'start', command: 'node dist/app.js', description: 'Start production server', stage: 'start' }
			],
			compatibility: ['react-frontend', 'vue-frontend', 'angular-frontend']
		});

		// Django Backend Template
		this.templates.set('django-backend', {
			id: 'django-backend',
			name: 'Django Backend',
			description: 'Python backend with Django REST framework',
			category: 'backend',
			frameworks: ['Django', 'Django REST Framework'],
			languages: ['Python'],
			files: [
				{
					path: 'manage.py',
					content: `#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

if __name__ == '__main__':
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', '{{projectName}}.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)`,
					language: 'python',
					purpose: 'django-manage',
					isTemplate: true
				}
			],
			dependencies: [
				{ name: 'Django', version: '>=4.2,<5.0', type: 'dependency', manager: 'pip' },
				{ name: 'djangorestframework', version: '^3.14.0', type: 'dependency', manager: 'pip' }
			],
			scripts: [
				{ name: 'runserver', command: 'python manage.py runserver', description: 'Start development server', stage: 'dev' },
				{ name: 'migrate', command: 'python manage.py migrate', description: 'Run migrations', stage: 'build' }
			],
			compatibility: ['react-frontend', 'vue-frontend']
		});
	}

	getTemplate(id: string): ProjectTemplate | undefined {
		return this.templates.get(id);
	}

	getCompatibleTemplates(templateId: string): ProjectTemplate[] {
		const template = this.templates.get(templateId);
		if (!template) return [];

		return template.compatibility
			.map(id => this.templates.get(id))
			.filter(t => t !== undefined) as ProjectTemplate[];
	}

	getAllTemplates(): ProjectTemplate[] {
		return Array.from(this.templates.values());
	}

	getTemplatesByCategory(category: ProjectTemplate['category']): ProjectTemplate[] {
		return Array.from(this.templates.values()).filter(t => t.category === category);
	}

	addCustomTemplate(template: ProjectTemplate): void {
		this.templates.set(template.id, template);
	}
}

export class ProjectGenerator {
	private aiService: AIService;
	private templateRegistry: TemplateRegistry;

	constructor(aiService: AIService) {
		this.aiService = aiService;
		this.templateRegistry = new TemplateRegistry();
	}

	async generateProject(request: ProjectGenerationRequest): Promise<ProjectGenerationResult> {
		try {
			// Validate template compatibility
			this.validateTemplateCompatibility(request.templates);

			// Get templates
			const templates = request.templates.map(id => {
				const template = this.templateRegistry.getTemplate(id);
				if (!template) throw new Error(`Template ${id} not found`);
				return template;
			});

			// Mix templates using AI
			const mixedProject = await this.mixTemplates(templates, request);

			// Generate infrastructure if requested
			let infrastructure;
			if (request.infrastructure) {
				infrastructure = await this.generateInfrastructure(mixedProject, request);
			}

			// Process template variables
			const processedFiles = await this.processTemplateFiles(mixedProject.files, request.variables);

			// Create project structure
			const project: Project = {
				id: `project_${Date.now()}`,
				name: request.name,
				type: templates.length > 1 ? 'fullstack' : templates[0].category,
				structure: {
					files: processedFiles,
					directories: this.extractDirectories(processedFiles),
					entryPoints: this.findEntryPoints(processedFiles),
					configFiles: processedFiles.filter(f => f.purpose.includes('config')).map(f => f.path)
				},
				constraints: request.constraints,
				dependencies: this.mergeDependencies(templates),
				metadata: {
					version: '1.0.0',
					description: request.description,
					author: '',
					license: 'MIT',
					tags: templates.flatMap(t => t.frameworks),
					createdAt: Date.now(),
					lastModified: Date.now()
				}
			};

			// Write files to disk
			await this.writeProjectFiles(request.outputPath, processedFiles, infrastructure);

			const result: ProjectGenerationResult = {
				project,
				files: processedFiles,
				infrastructure,
				scripts: templates.flatMap(t => t.scripts),
				nextSteps: this.generateNextSteps(templates, infrastructure !== undefined)
			};

			return result;

		} catch (error) {
			console.error('Project generation failed:', error);
			throw error;
		}
	}

	private validateTemplateCompatibility(templateIds: string[]): void {
		if (templateIds.length < 2) return;

		const templates = templateIds.map(id => this.templateRegistry.getTemplate(id));

		for (let i = 0; i < templates.length; i++) {
			for (let j = i + 1; j < templates.length; j++) {
				const template1 = templates[i];
				const template2 = templates[j];

				if (!template1 || !template2) continue;

				const compatible = template1.compatibility.includes(template2.id) ||
					template2.compatibility.includes(template1.id);

				if (!compatible) {
					throw new Error(`Templates ${template1.name} and ${template2.name} are not compatible`);
				}
			}
		}
	}

	private async mixTemplates(templates: ProjectTemplate[], request: ProjectGenerationRequest): Promise<{ files: TemplateFile[] }> {
		if (templates.length === 1) {
			return { files: templates[0].files };
		}

		try {
			// Use AI to intelligently mix templates
			const response = await this.aiService.predict({
				task: 'mix-templates',
				context: {
					templates: templates.map(t => ({
						id: t.id,
						name: t.name,
						category: t.category,
						frameworks: t.frameworks,
						files: t.files.map(f => ({ path: f.path, purpose: f.purpose, language: f.language }))
					})),
					projectName: request.name,
					constraints: request.constraints
				},
				model: 'advanced',
				priority: 'high'
			});

			if (response.success && response.data.files) {
				// AI provided mixed template
				return { files: response.data.files };
			}

		} catch (error) {
			console.warn('AI template mixing failed, using fallback:', error);
		}

		// Fallback: Simple template merging
		return this.fallbackTemplateMixing(templates);
	}

	private fallbackTemplateMixing(templates: ProjectTemplate[]): { files: TemplateFile[] } {
		const allFiles: TemplateFile[] = [];
		const fileMap = new Map<string, TemplateFile>();

		// Merge files, with later templates overriding earlier ones for conflicts
		templates.forEach(template => {
			template.files.forEach(file => {
				fileMap.set(file.path, file);
			});
		});

		allFiles.push(...fileMap.values());

		// Add integration files for mixed templates
		if (templates.length > 1) {
			const frontend = templates.find(t => t.category === 'frontend');
			const backend = templates.find(t => t.category === 'backend');

			if (frontend && backend) {
				// Add proxy configuration for frontend to backend
				if (frontend.frameworks.includes('React')) {
					allFiles.push({
						path: 'vite.config.ts',
						content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api/, '')
      }
    }
  }
})`,
						language: 'typescript',
						purpose: 'build-config',
						isTemplate: false
					});
				}
			}
		}

		return { files: allFiles };
	}

	private async generateInfrastructure(project: { files: TemplateFile[] }, request: ProjectGenerationRequest): Promise<any> {
		try {
			const response = await this.aiService.predict({
				task: 'generate-infrastructure',
				context: {
					project,
					constraints: request.constraints,
					includeDocker: true,
					includeKubernetes: true,
					includeTerraform: true,
					includeCICD: true
				},
				model: 'advanced',
				priority: 'normal'
			});

			if (response.success) {
				return response.data;
			}

		} catch (error) {
			console.warn('AI infrastructure generation failed, using templates:', error);
		}

		// Fallback: Basic infrastructure templates
		return this.generateBasicInfrastructure(project, request);
	}

	private generateBasicInfrastructure(project: { files: TemplateFile[] }, request: ProjectGenerationRequest): any {
		const hasNode = project.files.some(f => f.language === 'typescript' || f.language === 'javascript');
		const hasPython = project.files.some(f => f.language === 'python');

		const infrastructure: any = {};

		// Generate Dockerfile
		if (hasNode) {
			infrastructure.dockerfile = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]`;
		} else if (hasPython) {
			infrastructure.dockerfile = `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]`;
		}

		// Generate docker-compose.yml
		infrastructure.dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ${request.name}
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`;

		// Generate basic GitHub Actions workflow
		infrastructure.cicd = `name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: echo "Deploy to production server"`;

		return infrastructure;
	}

	private async processTemplateFiles(files: TemplateFile[], variables: Record<string, any>): Promise<ProjectFile[]> {
		return files.map(file => {
			let content = file.content;

			if (file.isTemplate) {
				// Replace template variables
				content = this.replaceTemplateVariables(content, variables);
			}

			return {
				path: file.path,
				content,
				language: file.language,
				purpose: file.purpose,
				dependencies: [] // TODO: Extract dependencies from content
			};
		});
	}

	private replaceTemplateVariables(content: string, variables: Record<string, any>): string {
		let result = content;

		// Replace {{variable}} patterns
		Object.entries(variables).forEach(([key, value]) => {
			const pattern = new RegExp(`{{${key}}}`, 'g');
			result = result.replace(pattern, String(value));
		});

		return result;
	}

	private extractDirectories(files: ProjectFile[]): string[] {
		const dirs = new Set<string>();

		files.forEach(file => {
			const dir = path.dirname(file.path);
			if (dir !== '.') {
				dirs.add(dir);
			}
		});

		return Array.from(dirs).sort();
	}

	private findEntryPoints(files: ProjectFile[]): string[] {
		const entryPoints: string[] = [];

		files.forEach(file => {
			if (file.purpose === 'main-component' ||
				file.purpose === 'main-server' ||
				file.path === 'src/main.ts' ||
				file.path === 'src/App.tsx' ||
				file.path === 'manage.py') {
				entryPoints.push(file.path);
			}
		});

		return entryPoints;
	}

	private mergeDependencies(templates: ProjectTemplate[]): string[] {
		const deps = new Set<string>();

		templates.forEach(template => {
			template.dependencies.forEach(dep => {
				deps.add(`${dep.name}@${dep.version}`);
			});
		});

		return Array.from(deps);
	}

	private async writeProjectFiles(outputPath: string, files: ProjectFile[], infrastructure?: any): Promise<void> {
		const workspaceUri = vscode.Uri.file(outputPath);

		// Create directories
		const dirs = this.extractDirectories(files);
		for (const dir of dirs) {
			const dirUri = vscode.Uri.file(path.join(outputPath, dir));
			await vscode.workspace.fs.createDirectory(dirUri);
		}

		// Write project files
		for (const file of files) {
			const fileUri = vscode.Uri.file(path.join(outputPath, file.path));
			await vscode.workspace.fs.writeFile(fileUri, Buffer.from(file.content, 'utf8'));
		}

		// Write infrastructure files
		if (infrastructure) {
			if (infrastructure.dockerfile) {
				const dockerfileUri = vscode.Uri.file(path.join(outputPath, 'Dockerfile'));
				await vscode.workspace.fs.writeFile(dockerfileUri, Buffer.from(infrastructure.dockerfile, 'utf8'));
			}

			if (infrastructure.dockerCompose) {
				const composeUri = vscode.Uri.file(path.join(outputPath, 'docker-compose.yml'));
				await vscode.workspace.fs.writeFile(composeUri, Buffer.from(infrastructure.dockerCompose, 'utf8'));
			}

			if (infrastructure.cicd) {
				const cicdDir = vscode.Uri.file(path.join(outputPath, '.github', 'workflows'));
				await vscode.workspace.fs.createDirectory(cicdDir);
				const cicdUri = vscode.Uri.file(path.join(outputPath, '.github', 'workflows', 'ci.yml'));
				await vscode.workspace.fs.writeFile(cicdUri, Buffer.from(infrastructure.cicd, 'utf8'));
			}
		}
	}

	private generateNextSteps(templates: ProjectTemplate[], hasInfrastructure: boolean): string[] {
		const steps: string[] = [];

		// Installation steps
		if (templates.some(t => t.dependencies.some(d => d.manager === 'npm'))) {
			steps.push('Run "npm install" to install dependencies');
		}

		if (templates.some(t => t.dependencies.some(d => d.manager === 'pip'))) {
			steps.push('Create virtual environment and run "pip install -r requirements.txt"');
		}

		// Development steps
		steps.push('Configure environment variables in .env file');

		if (templates.some(t => t.category === 'backend')) {
			steps.push('Set up database connection and run migrations');
		}

		if (templates.some(t => t.category === 'frontend')) {
			steps.push('Start development server with "npm run dev"');
		}

		// Infrastructure steps
		if (hasInfrastructure) {
			steps.push('Review and customize Docker configuration');
			steps.push('Set up CI/CD secrets in your repository settings');
		}

		steps.push('Initialize git repository and make first commit');
		steps.push('Review generated code and customize as needed');

		return steps;
	}

	// Public API methods
	getTemplateRegistry(): TemplateRegistry {
		return this.templateRegistry;
	}

	async validateProject(files: ProjectFile[]): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
		try {
			const response = await this.aiService.predict({
				task: 'validate-project',
				context: { files },
				model: 'lightweight',
				priority: 'normal'
			});

			return response.data || { isValid: true, errors: [], warnings: [] };

		} catch (error) {
			return {
				isValid: false,
				errors: ['Project validation failed'],
				warnings: []
			};
		}
	}
}

export default ProjectGenerator;
