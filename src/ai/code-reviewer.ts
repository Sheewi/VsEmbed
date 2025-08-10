import * as vscode from 'vscode';
import { AIService, AIRequest } from './ai-service';

export interface CodeReviewRule {
	id: string;
	name: string;
	description: string;
	severity: 'info' | 'warning' | 'error';
	category: 'performance' | 'security' | 'maintainability' | 'style' | 'bugs';
	pattern?: RegExp;
	enabled: boolean;
}

export interface ReviewComment {
	id: string;
	line: number;
	column: number;
	length: number;
	message: string;
	severity: 'info' | 'warning' | 'error';
	category: string;
	rule?: string;
	suggestion?: string;
	confidence: number;
	autoFixable: boolean;
}

export interface ReviewResult {
	file: string;
	comments: ReviewComment[];
	summary: {
		total: number;
		errors: number;
		warnings: number;
		info: number;
	};
	metrics: {
		complexity: number;
		maintainability: number;
		testCoverage: number;
	};
	suggestions: string[];
}

export class CodeReviewer {
	private aiService: AIService;
	private rules: Map<string, CodeReviewRule> = new Map();

	constructor(aiService: AIService) {
		this.aiService = aiService;
		this.loadDefaultRules();
	}

	private loadDefaultRules(): void {
		const defaultRules: CodeReviewRule[] = [
			{
				id: 'no-console-log',
				name: 'No Console Logs',
				description: 'Console.log statements should not be committed to production',
				severity: 'warning',
				category: 'maintainability',
				pattern: /console\.log\(/g,
				enabled: true
			},
			{
				id: 'no-var',
				name: 'No var declarations',
				description: 'Use let or const instead of var',
				severity: 'warning',
				category: 'style',
				pattern: /\bvar\s+/g,
				enabled: true
			},
			{
				id: 'function-complexity',
				name: 'Function complexity',
				description: 'Functions should not be overly complex',
				severity: 'warning',
				category: 'maintainability',
				enabled: true
			},
			{
				id: 'security-eval',
				name: 'No eval usage',
				description: 'eval() is dangerous and should be avoided',
				severity: 'error',
				category: 'security',
				pattern: /\beval\s*\(/g,
				enabled: true
			},
			{
				id: 'sql-injection',
				name: 'SQL Injection Prevention',
				description: 'Potential SQL injection vulnerability',
				severity: 'error',
				category: 'security',
				enabled: true
			}
		];

		defaultRules.forEach(rule => this.rules.set(rule.id, rule));
	}

	async reviewDiff(diff: string, filePath?: string): Promise<ReviewResult> {
		try {
			// Load project-specific rules
			const projectRules = await this.loadProjectRules();

			const aiRequest: AIRequest = {
				task: 'code-review',
				context: {
					diff,
					filePath,
					rules: Array.from(this.rules.values()).filter(r => r.enabled),
					projectRules
				},
				model: 'advanced',
				priority: 'normal'
			};

			const response = await this.aiService.predict(aiRequest);

			if (response.success) {
				return this.processAIReviewResult(response.data, diff, filePath);
			} else {
				// Fallback to rule-based review
				return this.performRuleBasedReview(diff, filePath);
			}

		} catch (error) {
			console.error('AI code review failed, using fallback:', error);
			return this.performRuleBasedReview(diff, filePath);
		}
	}

	async reviewFile(filePath: string): Promise<ReviewResult> {
		try {
			const document = await vscode.workspace.openTextDocument(filePath);
			const content = document.getText();

			const aiRequest: AIRequest = {
				task: 'code-review-file',
				context: {
					content,
					filePath,
					language: document.languageId,
					rules: Array.from(this.rules.values()).filter(r => r.enabled)
				},
				model: 'advanced',
				priority: 'normal'
			};

			const response = await this.aiService.predict(aiRequest);

			if (response.success) {
				return this.processAIReviewResult(response.data, content, filePath);
			} else {
				return this.performRuleBasedReview(content, filePath);
			}

		} catch (error) {
			console.error('File review failed:', error);
			return {
				file: filePath,
				comments: [],
				summary: { total: 0, errors: 0, warnings: 0, info: 0 },
				metrics: { complexity: 0, maintainability: 0, testCoverage: 0 },
				suggestions: ['Review could not be completed']
			};
		}
	}

	private processAIReviewResult(aiData: any, content: string, filePath?: string): ReviewResult {
		const comments: ReviewComment[] = (aiData.comments || []).map((comment: any, index: number) => ({
			id: `ai_${index}`,
			line: comment.line || 1,
			column: comment.column || 1,
			length: comment.length || 1,
			message: comment.message || 'AI detected issue',
			severity: comment.severity || 'warning',
			category: comment.category || 'general',
			rule: comment.rule,
			suggestion: comment.suggestion,
			confidence: comment.confidence || 0.8,
			autoFixable: comment.autoFixable || false
		}));

		// Add rule-based comments
		const ruleComments = this.applyRuleBasedChecks(content);
		comments.push(...ruleComments);

		const summary = this.calculateSummary(comments);
		const metrics = aiData.metrics || this.calculateBasicMetrics(content);

		return {
			file: filePath || 'unknown',
			comments,
			summary,
			metrics,
			suggestions: aiData.suggestions || []
		};
	}

	private performRuleBasedReview(content: string, filePath?: string): ReviewResult {
		const comments = this.applyRuleBasedChecks(content);
		const summary = this.calculateSummary(comments);
		const metrics = this.calculateBasicMetrics(content);

		return {
			file: filePath || 'unknown',
			comments,
			summary,
			metrics,
			suggestions: this.generateBasicSuggestions(comments)
		};
	}

	private applyRuleBasedChecks(content: string): ReviewComment[] {
		const comments: ReviewComment[] = [];
		const lines = content.split('\n');

		this.rules.forEach(rule => {
			if (!rule.enabled || !rule.pattern) return;

			lines.forEach((line, lineIndex) => {
				const matches = line.matchAll(rule.pattern);
				for (const match of matches) {
					comments.push({
						id: `rule_${rule.id}_${lineIndex}_${match.index}`,
						line: lineIndex + 1,
						column: (match.index || 0) + 1,
						length: match[0].length,
						message: rule.description,
						severity: rule.severity,
						category: rule.category,
						rule: rule.id,
						suggestion: this.generateRuleSuggestion(rule, match[0]),
						confidence: 0.9,
						autoFixable: this.isAutoFixable(rule.id)
					});
				}
			});
		});

		// Additional complexity checks
		this.addComplexityComments(content, comments);

		return comments;
	}

	private addComplexityComments(content: string, comments: ReviewComment[]): void {
		const lines = content.split('\n');
		
		lines.forEach((line, index) => {
			// Check for deeply nested code
			const indentation = line.match(/^(\s*)/)?.[1].length || 0;
			if (indentation > 20) {
				comments.push({
					id: `complexity_nesting_${index}`,
					line: index + 1,
					column: 1,
					length: line.length,
					message: 'Deeply nested code - consider refactoring',
					severity: 'warning',
					category: 'maintainability',
					rule: 'deep-nesting',
					suggestion: 'Extract nested logic into separate functions',
					confidence: 0.7,
					autoFixable: false
				});
			}

			// Check for long lines
			if (line.length > 120) {
				comments.push({
					id: `style_long_line_${index}`,
					line: index + 1,
					column: 121,
					length: line.length - 120,
					message: 'Line too long - consider breaking it up',
					severity: 'info',
					category: 'style',
					rule: 'line-length',
					suggestion: 'Break long lines for better readability',
					confidence: 0.8,
					autoFixable: true
				});
			}
		});
	}

	private generateRuleSuggestion(rule: CodeReviewRule, match: string): string {
		switch (rule.id) {
			case 'no-console-log':
				return 'Use a proper logging library or remove before production';
			case 'no-var':
				return 'Replace with "let" or "const"';
			case 'security-eval':
				return 'Use safer alternatives like JSON.parse() or Function constructor';
			default:
				return `Consider addressing this ${rule.category} issue`;
		}
	}

	private isAutoFixable(ruleId: string): boolean {
		const autoFixableRules = ['no-var', 'line-length'];
		return autoFixableRules.includes(ruleId);
	}

	private calculateSummary(comments: ReviewComment[]): { total: number; errors: number; warnings: number; info: number } {
		return {
			total: comments.length,
			errors: comments.filter(c => c.severity === 'error').length,
			warnings: comments.filter(c => c.severity === 'warning').length,
			info: comments.filter(c => c.severity === 'info').length
		};
	}

	private calculateBasicMetrics(content: string): { complexity: number; maintainability: number; testCoverage: number } {
		const lines = content.split('\n');
		const nonEmptyLines = lines.filter(line => line.trim().length > 0).length;
		
		// Simple complexity calculation
		const complexityKeywords = /\b(if|else|for|while|switch|case|catch|&&|\|\|)\b/g;
		const complexityCount = (content.match(complexityKeywords) || []).length;
		const complexity = Math.min(10, Math.floor(complexityCount / nonEmptyLines * 10));

		// Simple maintainability score (inverse of complexity)
		const maintainability = Math.max(1, 10 - complexity);

		// Test coverage (estimate based on test-related keywords)
		const testKeywords = /\b(test|describe|it|expect|assert|should)\b/g;
		const testCount = (content.match(testKeywords) || []).length;
		const testCoverage = Math.min(100, Math.floor(testCount / nonEmptyLines * 100));

		return { complexity, maintainability, testCoverage };
	}

	private generateBasicSuggestions(comments: ReviewComment[]): string[] {
		const suggestions: string[] = [];

		if (comments.some(c => c.category === 'security')) {
			suggestions.push('Address security issues immediately');
		}

		if (comments.some(c => c.category === 'performance')) {
			suggestions.push('Consider performance optimizations');
		}

		if (comments.some(c => c.category === 'maintainability')) {
			suggestions.push('Refactor for better maintainability');
		}

		if (comments.length === 0) {
			suggestions.push('Code looks good! Consider adding tests if not present.');
		}

		return suggestions;
	}

	private async loadProjectRules(): Promise<CodeReviewRule[]> {
		try {
			// Look for project-specific review rules
			const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
			if (workspaceFolder) {
				const rulesFile = vscode.Uri.joinPath(workspaceFolder.uri, '.vscode', 'review-rules.json');
				const rulesDocument = await vscode.workspace.openTextDocument(rulesFile);
				return JSON.parse(rulesDocument.getText());
			}
		} catch (error) {
			// No project rules found, use defaults
		}
		return [];
	}

	// Public API methods
	addRule(rule: CodeReviewRule): void {
		this.rules.set(rule.id, rule);
	}

	removeRule(ruleId: string): boolean {
		return this.rules.delete(ruleId);
	}

	toggleRule(ruleId: string, enabled: boolean): boolean {
		const rule = this.rules.get(ruleId);
		if (rule) {
			rule.enabled = enabled;
			return true;
		}
		return false;
	}

	getRules(): CodeReviewRule[] {
		return Array.from(this.rules.values());
	}

	async autoFix(comment: ReviewComment, content: string): Promise<string> {
		if (!comment.autoFixable) {
			throw new Error('Comment is not auto-fixable');
		}

		const lines = content.split('\n');
		const line = lines[comment.line - 1];

		switch (comment.rule) {
			case 'no-var':
				lines[comment.line - 1] = line.replace(/\bvar\b/, 'let');
				break;
			case 'line-length':
				// Simple line breaking (could be more sophisticated)
				if (line.length > 120) {
					const breakPoint = line.lastIndexOf(' ', 120);
					if (breakPoint > 0) {
						lines[comment.line - 1] = line.substring(0, breakPoint);
						lines.splice(comment.line, 0, '  ' + line.substring(breakPoint + 1));
					}
				}
				break;
		}

		return lines.join('\n');
	}
}

// Export static method for convenience
export async function reviewDiff(diff: string, aiService: AIService): Promise<ReviewResult> {
	const reviewer = new CodeReviewer(aiService);
	return reviewer.reviewDiff(diff);
}
