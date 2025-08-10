import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { CodeReviewer } from '../../src/ai/code-reviewer';
import { MockAIService, createDebugMockAI } from '../mocks/ai-service';
import { goldenTester } from '../golden/golden-tester';

describe('Code Reviewer AI Features', () => {
	let codeReviewer: CodeReviewer;
	let mockAI: MockAIService;

	beforeEach(() => {
		mockAI = createDebugMockAI();
		codeReviewer = new CodeReviewer({
			aiService: mockAI as any,
			rulesPath: './test-rules',
			enableAI: true,
			autoFix: true
		});
	});

	afterEach(() => {
		mockAI.reset();
	});

	describe('AI-Powered Code Review', () => {
		it('should perform comprehensive review of JavaScript code changes', async () => {
			const diff = `
--- src/utils/calculator.js
+++ src/utils/calculator.js
@@ -1,8 +1,12 @@
 function calculate(a, b, operation) {
-    if (operation === 'add') return a + b;
-    if (operation === 'subtract') return a - b;
-    if (operation === 'multiply') return a * b;
-    if (operation === 'divide') return a / b;
+    if (typeof a !== 'number' || typeof b !== 'number') {
+        throw new Error('Invalid input');
+    }
+    
+    if (operation === 'add') return a + b;
+    if (operation === 'subtract') return a - b;
+    if (operation === 'multiply') return a * b;
+    if (operation === 'divide') return b === 0 ? 0 : a / b;
     throw new Error('Unknown operation');
 }
`;

			mockAI.setResponse('review-code', {
				findings: [
					{
						type: 'improvement',
						severity: 'medium',
						line: 9,
						message: 'Division by zero should throw an error, not return 0',
						category: 'logic',
						confidence: 0.9,
						suggestion: 'Consider throwing an error when dividing by zero'
					},
					{
						type: 'positive',
						severity: 'low',
						line: 2,
						message: 'Good addition of input validation',
						category: 'security',
						confidence: 0.95
					}
				],
				summary: {
					totalIssues: 1,
					severity: 'medium',
					categories: ['logic', 'security'],
					overallScore: 8.5,
					recommendation: 'Fix the division by zero handling'
				}
			});

			const result = await codeReviewer.reviewDiff(diff);

			expect(result.aiFindings).toHaveLength(2);
			expect(result.summary.overallScore).toBe(8.5);
			expect(result.summary.recommendation).toContain('division by zero');

			// Should also include rule-based findings
			expect(result.ruleFindings.length).toBeGreaterThan(0);

			// Test against golden file
			expect(result).toMatchGoldenJSON('code-review-javascript-comprehensive');
		});

		it('should identify security vulnerabilities', async () => {
			const diff = `
--- src/auth/login.js
+++ src/auth/login.js
@@ -1,5 +1,8 @@
 function authenticate(username, password) {
-    const query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'";
-    return database.query(query);
+    const hashedPassword = hashPassword(password);
+    const query = "SELECT * FROM users WHERE username = ? AND password_hash = ?";
+    return database.query(query, [username, hashedPassword]);
 }
`;

			mockAI.setResponse('review-code', {
				findings: [
					{
						type: 'positive',
						severity: 'high',
						line: 3,
						message: 'Excellent fix for SQL injection vulnerability',
						category: 'security',
						confidence: 0.98,
						suggestion: 'Consider adding rate limiting for login attempts'
					},
					{
						type: 'improvement',
						severity: 'low',
						line: 2,
						message: 'Consider using bcrypt for password hashing',
						category: 'security',
						confidence: 0.8
					}
				],
				summary: {
					totalIssues: 0,
					severity: 'low',
					categories: ['security'],
					overallScore: 9.5,
					recommendation: 'Great security improvements!'
				}
			});

			const result = await codeReviewer.reviewDiff(diff);

			expect(result.aiFindings[0].category).toBe('security');
			expect(result.aiFindings[0].type).toBe('positive');
			expect(result.summary.overallScore).toBe(9.5);

			// Test against golden file
			expect(result).toMatchGoldenJSON('code-review-security-fix');
		});

		it('should detect performance issues', async () => {
			const diff = `
--- src/utils/dataProcessor.js
+++ src/utils/dataProcessor.js
@@ -1,10 +1,15 @@
 function processLargeDataset(data) {
     const results = [];
+    const cache = new Map();
     
     for (let i = 0; i < data.length; i++) {
-        const processed = expensiveOperation(data[i]);
-        results.push(processed);
+        const key = JSON.stringify(data[i]);
+        if (cache.has(key)) {
+            results.push(cache.get(key));
+        } else {
+            const processed = expensiveOperation(data[i]);
+            cache.set(key, processed);
+            results.push(processed);
+        }
     }
     
     return results;
 }
`;

			mockAI.setResponse('review-code', {
				findings: [
					{
						type: 'improvement',
						severity: 'medium',
						line: 6,
						message: 'JSON.stringify for cache keys can be expensive and unreliable',
						category: 'performance',
						confidence: 0.85,
						suggestion: 'Consider using a more efficient key generation strategy'
					},
					{
						type: 'positive',
						severity: 'high',
						line: 3,
						message: 'Good addition of caching to avoid redundant operations',
						category: 'performance',
						confidence: 0.92
					}
				],
				summary: {
					totalIssues: 1,
					severity: 'medium',
					categories: ['performance'],
					overallScore: 8.0,
					recommendation: 'Consider optimizing cache key generation'
				}
			});

			const result = await codeReviewer.reviewDiff(diff);

			expect(result.aiFindings.some(f => f.category === 'performance')).toBe(true);
			expect(result.aiFindings.some(f => f.message.includes('JSON.stringify'))).toBe(true);

			// Test against golden file
			expect(result).toMatchGoldenJSON('code-review-performance-optimization');
		});
	});

	describe('AI-Enhanced Auto-Fix', () => {
		it('should generate fixes for common issues', async () => {
			const code = `
function divideNumbers(a, b) {
    return a / b;
}

const result = divideNumbers(10, 0);
console.log(result);
`;

			mockAI.setResponse('suggest-fix', {
				fixedCode: `
function divideNumbers(a, b) {
    if (b === 0) {
        throw new Error('Cannot divide by zero');
    }
    return a / b;
}

const result = divideNumbers(10, 0);
console.log(result);
`,
				explanation: 'Added division by zero check to prevent Infinity result'
			});

			const fixes = await codeReviewer.autoFix(code, [
				{
					type: 'error',
					severity: 'high',
					line: 2,
					message: 'Division by zero not handled',
					category: 'logic',
					confidence: 0.9
				}
			]);

			expect(fixes).toHaveLength(1);
			expect(fixes[0].fixedCode).toContain('if (b === 0)');
			expect(fixes[0].explanation).toContain('division by zero');

			// Test against golden file
			expect(fixes[0]).toMatchGoldenJSON('ai-autofix-division-by-zero');
		});

		it('should handle complex TypeScript fixes', async () => {
			const code = `
interface User {
    name: string;
    age: number;
}

function processUser(user: any): string {
    return user.name + " is " + user.age + " years old";
}
`;

			mockAI.setResponse('suggest-fix', {
				fixedCode: `
interface User {
    name: string;
    age: number;
}

function processUser(user: User): string {
    return \`\${user.name} is \${user.age} years old\`;
}
`,
				explanation: 'Changed parameter type from any to User interface and used template literals for string concatenation'
			});

			const fixes = await codeReviewer.autoFix(code, [
				{
					type: 'warning',
					severity: 'medium',
					line: 7,
					message: 'Using any type defeats the purpose of TypeScript',
					category: 'types',
					confidence: 0.95
				}
			]);

			expect(fixes[0].fixedCode).toContain('user: User');
			expect(fixes[0].fixedCode).toContain('${user.name}');

			// Test against golden file
			expect(fixes[0]).toMatchGoldenJSON('ai-autofix-typescript-types');
		});
	});

	describe('Context-Aware Analysis', () => {
		it('should provide context-aware suggestions based on project patterns', async () => {
			const projectContext = {
				patterns: ['express-api', 'mongoose-models', 'jest-testing'],
				dependencies: ['express', 'mongoose', 'jest'],
				codeStyle: {
					quotes: 'single',
					semicolons: true,
					indentation: 2
				}
			};

			const diff = `
--- src/models/user.js
+++ src/models/user.js
@@ -1,8 +1,12 @@
 const mongoose = require("mongoose");
 
 const userSchema = new mongoose.Schema({
-    name: String,
-    email: String
+    name: {
+        type: String,
+        required: true
+    },
+    email: {
+        type: String,
+        required: true,
+        unique: true
+    }
 });
`;

			mockAI.setResponse('review-code', {
				findings: [
					{
						type: 'improvement',
						severity: 'medium',
						line: 1,
						message: 'Consider using single quotes to match project style',
						category: 'style',
						confidence: 0.8,
						suggestion: 'Change "mongoose" to \'mongoose\''
					},
					{
						type: 'positive',
						severity: 'high',
						line: 5,
						message: 'Good addition of required validation',
						category: 'validation',
						confidence: 0.95
					},
					{
						type: 'improvement',
						severity: 'low',
						line: 10,
						message: 'Consider adding email format validation',
						category: 'validation',
						confidence: 0.7
					}
				],
				summary: {
					totalIssues: 2,
					severity: 'medium',
					categories: ['style', 'validation'],
					overallScore: 8.2,
					recommendation: 'Address style consistency and consider email validation'
				}
			});

			const result = await codeReviewer.reviewDiff(diff, { projectContext });

			expect(result.aiFindings.some(f => f.message.includes('single quotes'))).toBe(true);
			expect(result.aiFindings.some(f => f.category === 'validation')).toBe(true);

			// Test against golden file
			expect(result).toMatchGoldenJSON('code-review-context-aware-mongoose');
		});
	});

	describe('AI Service Integration', () => {
		it('should handle AI service failures gracefully', async () => {
			mockAI.setResponse('review-code', null, { shouldFail: true, failureReason: 'AI service timeout' });

			const diff = `
--- test.js
+++ test.js
@@ -1,1 +1,3 @@
+function test() {
+    return "hello";
+}
`;

			const result = await codeReviewer.reviewDiff(diff);

			// Should still have rule-based findings even when AI fails
			expect(result.ruleFindings).toBeDefined();
			expect(result.aiFindings).toHaveLength(0);
			expect(result.summary.totalIssues).toBeGreaterThanOrEqual(0);
		});

		it('should validate AI responses', async () => {
			// Mock invalid AI response
			mockAI.setResponse('review-code', {
				findings: [
					{
						// Missing required fields
						type: 'error',
						message: 'Invalid finding'
					}
				]
			});

			const diff = `
--- test.js
+++ test.js
@@ -1,1 +1,3 @@
+function test() {
+    return "hello";
+}
`;

			const result = await codeReviewer.reviewDiff(diff);

			// Should filter out invalid findings
			expect(result.aiFindings).toHaveLength(0);
		});
	});

	describe('Performance and Caching', () => {
		it('should cache review results for identical diffs', async () => {
			const diff = `
--- test.js
+++ test.js
@@ -1,1 +1,3 @@
+function test() {
+    return "hello";
+}
`;

			mockAI.setResponse('review-code', {
				findings: [
					{
						type: 'improvement',
						severity: 'low',
						line: 2,
						message: 'Consider using const for immutable values',
						category: 'style',
						confidence: 0.8
					}
				],
				summary: {
					totalIssues: 1,
					severity: 'low',
					categories: ['style'],
					overallScore: 9.0,
					recommendation: 'Minor style improvements'
				}
			});

			// First review
			const result1 = await codeReviewer.reviewDiff(diff);
			expect(mockAI.getCallCount('review-code')).toBe(1);

			// Second review of same diff - should be cached
			const result2 = await codeReviewer.reviewDiff(diff);
			expect(mockAI.getCallCount('review-code')).toBe(1); // Still 1, not 2

			expect(result1).toEqual(result2);
		});

		it('should complete reviews within performance threshold', async () => {
			const largeDiff = Array(50).fill(0).map((_, i) => 
				`+    const value${i} = processData(input${i});`
			).join('\n');

			const diff = `
--- large-file.js
+++ large-file.js
@@ -1,1 +1,51 @@
 function processLargeFile() {
${largeDiff}
 }
`;

			mockAI.setResponse('review-code', {
				findings: [],
				summary: {
					totalIssues: 0,
					severity: 'info',
					categories: [],
					overallScore: 10.0,
					recommendation: 'Code looks good'
				}
			});

			const startTime = performance.now();
			await codeReviewer.reviewDiff(diff);
			const reviewTime = performance.now() - startTime;

			// Should complete large reviews in reasonable time (under 2 seconds)
			expect(reviewTime).toBeLessThan(2000);
		});
	});
});
