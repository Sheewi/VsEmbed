import * as fs from 'fs';
import * as path from 'path';
import { expect } from '@jest/globals';

export interface GoldenFileConfig {
	goldenDir: string;
	updateGolden: boolean;
	fileExtension: string;
	normalize?: (content: string) => string;
}

export class GoldenFileTester {
	private config: GoldenFileConfig;

	constructor(config: Partial<GoldenFileConfig> = {}) {
		this.config = {
			goldenDir: path.join(process.cwd(), 'tests', 'golden'),
			updateGolden: process.env.UPDATE_GOLDEN === 'true',
			fileExtension: '.golden',
			...config
		};

		// Ensure golden directory exists
		if (!fs.existsSync(this.config.goldenDir)) {
			fs.mkdirSync(this.config.goldenDir, { recursive: true });
		}
	}

	matchGoldenFile(testName: string, actual: string): void {
		const goldenPath = this.getGoldenPath(testName);
		const normalizedActual = this.normalize(actual);

		if (this.config.updateGolden || !fs.existsSync(goldenPath)) {
			// Create or update golden file
			fs.writeFileSync(goldenPath, normalizedActual, 'utf8');
			
			if (this.config.updateGolden) {
				console.log(`Updated golden file: ${goldenPath}`);
			} else {
				console.log(`Created golden file: ${goldenPath}`);
			}
			return;
		}

		// Read expected content from golden file
		const expected = fs.readFileSync(goldenPath, 'utf8');
		const normalizedExpected = this.normalize(expected);

		// Compare actual vs expected
		try {
			expect(normalizedActual).toBe(normalizedExpected);
		} catch (error) {
			// Provide helpful error message with diff
			console.error(`Golden file mismatch for test: ${testName}`);
			console.error(`Golden file: ${goldenPath}`);
			console.error('To update golden file, run with UPDATE_GOLDEN=true');
			throw error;
		}
	}

	matchGoldenJSON(testName: string, actual: any): void {
		const actualString = JSON.stringify(actual, null, 2);
		this.matchGoldenFile(testName, actualString);
	}

	private getGoldenPath(testName: string): string {
		const fileName = `${testName}${this.config.fileExtension}`;
		return path.join(this.config.goldenDir, fileName);
	}

	private normalize(content: string): string {
		if (this.config.normalize) {
			return this.config.normalize(content);
		}

		// Default normalization: trim whitespace and normalize line endings
		return content.trim().replace(/\r\n/g, '\n');
	}

	// Utility methods
	getGoldenFiles(): string[] {
		return fs.readdirSync(this.config.goldenDir)
			.filter(file => file.endsWith(this.config.fileExtension))
			.map(file => file.replace(this.config.fileExtension, ''));
	}

	deleteGoldenFile(testName: string): boolean {
		const goldenPath = this.getGoldenPath(testName);
		if (fs.existsSync(goldenPath)) {
			fs.unlinkSync(goldenPath);
			return true;
		}
		return false;
	}

	cleanupOrphanedFiles(validTestNames: string[]): string[] {
		const existingFiles = this.getGoldenFiles();
		const orphaned = existingFiles.filter(file => !validTestNames.includes(file));
		
		orphaned.forEach(file => {
			this.deleteGoldenFile(file);
		});

		return orphaned;
	}
}

// Global instance for convenience
export const goldenTester = new GoldenFileTester();

// Jest matcher extension
declare global {
	namespace jest {
		interface Matchers<R> {
			toMatchGoldenFile(testName: string): R;
			toMatchGoldenJSON(testName: string): R;
		}
	}
}

// Custom Jest matchers
expect.extend({
	toMatchGoldenFile(received: string, testName: string) {
		try {
			goldenTester.matchGoldenFile(testName, received);
			return {
				message: () => `Expected content to match golden file: ${testName}`,
				pass: true
			};
		} catch (error) {
			return {
				message: () => `Content does not match golden file: ${testName}\n${error}`,
				pass: false
			};
		}
	},

	toMatchGoldenJSON(received: any, testName: string) {
		try {
			goldenTester.matchGoldenJSON(testName, received);
			return {
				message: () => `Expected JSON to match golden file: ${testName}`,
				pass: true
			};
		} catch (error) {
			return {
				message: () => `JSON does not match golden file: ${testName}\n${error}`,
				pass: false
			};
		}
	}
});

// Example usage and test templates
export function createCodeGenerationTest(
	testName: string,
	generateCode: () => Promise<string>
) {
	return async () => {
		const code = await generateCode();
		expect(code).toMatchGoldenFile(testName);
	};
}

export function createComponentGenerationTest(
	componentType: string,
	props: any = {}
) {
	return async () => {
		// This would be replaced with actual component generation logic
		const component = await generateComponent(componentType, props);
		expect(component).toMatchGoldenFile(`${componentType}.component`);
	};
}

// Mock component generator for testing
async function generateComponent(type: string, props: any): Promise<string> {
	switch (type) {
		case 'Button':
			return `import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;`;

		case 'Modal':
			return `import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;`;

		default:
			return `// Generated ${type} component
export const ${type} = () => {
  return <div>${type} Component</div>;
};`;
	}
}

// Test helper for AI code generation
export async function testAICodeGeneration(
	prompt: string,
	language: string,
	aiService: any
): Promise<void> {
	const result = await aiService.predict({
		task: 'code-generation',
		context: { prompt, language },
		model: 'auto'
	});

	const testName = `ai-generation-${language}-${prompt.replace(/\s+/g, '-').toLowerCase()}`;
	expect(result.data.code).toMatchGoldenFile(testName);
}

// Configuration for different types of golden files
export const goldenConfigs = {
	code: new GoldenFileTester({
		goldenDir: path.join(process.cwd(), 'tests', 'golden', 'code'),
		fileExtension: '.ts.golden',
		normalize: (content) => {
			// Normalize code formatting
			return content
				.trim()
				.replace(/\s+$/gm, '') // Remove trailing whitespace
				.replace(/^\s*$/gm, '') // Remove empty lines
				.replace(/\n{3,}/g, '\n\n'); // Normalize multiple newlines
		}
	}),

	json: new GoldenFileTester({
		goldenDir: path.join(process.cwd(), 'tests', 'golden', 'json'),
		fileExtension: '.json.golden',
		normalize: (content) => {
			// Normalize JSON formatting
			try {
				return JSON.stringify(JSON.parse(content), null, 2);
			} catch {
				return content.trim();
			}
		}
	}),

	html: new GoldenFileTester({
		goldenDir: path.join(process.cwd(), 'tests', 'golden', 'html'),
		fileExtension: '.html.golden',
		normalize: (content) => {
			// Normalize HTML formatting
			return content
				.trim()
				.replace(/>\s+</g, '><') // Remove whitespace between tags
				.replace(/\s+/g, ' '); // Normalize whitespace
		}
	})
};

// Export convenience functions
export const { code: codeGolden, json: jsonGolden, html: htmlGolden } = goldenConfigs;
