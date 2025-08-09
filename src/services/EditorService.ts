import { EditorAPI, SearchOptions, SearchResult } from '../api/interfaces';
import { Edit } from '../types';
import * as fs from 'fs/promises';
import * as path from 'path';

export class EditorService implements EditorAPI {
	private workspacePath: string | null = null;
	private openFiles: Map<string, string> = new Map();

	setWorkspacePath(workspacePath: string): void {
		this.workspacePath = workspacePath;
	}

	async applyEdits(edits: Edit[]): Promise<boolean> {
		try {
			// Group edits by file
			const editsByFile = new Map<string, Edit[]>();

			for (const edit of edits) {
				if (!editsByFile.has(edit.file)) {
					editsByFile.set(edit.file, []);
				}
				editsByFile.get(edit.file)!.push(edit);
			}

			// Apply edits to each file
			for (const [filePath, fileEdits] of editsByFile) {
				await this.applyEditsToFile(filePath, fileEdits);
			}

			return true;
		} catch (error) {
			console.error('Failed to apply edits:', error);
			return false;
		}
	}

	async createFile(relativePath: string, content: string): Promise<boolean> {
		try {
			const fullPath = this.getFullPath(relativePath);

			// Ensure directory exists
			await fs.mkdir(path.dirname(fullPath), { recursive: true });

			// Write file
			await fs.writeFile(fullPath, content, 'utf-8');

			return true;
		} catch (error) {
			console.error('Failed to create file:', error);
			return false;
		}
	}

	async deleteFile(relativePath: string): Promise<boolean> {
		try {
			const fullPath = this.getFullPath(relativePath);
			await fs.unlink(fullPath);

			// Remove from open files if it was open
			this.openFiles.delete(relativePath);

			return true;
		} catch (error) {
			console.error('Failed to delete file:', error);
			return false;
		}
	}

	async renameFile(oldPath: string, newPath: string): Promise<boolean> {
		try {
			const oldFullPath = this.getFullPath(oldPath);
			const newFullPath = this.getFullPath(newPath);

			// Ensure target directory exists
			await fs.mkdir(path.dirname(newFullPath), { recursive: true });

			// Rename file
			await fs.rename(oldFullPath, newFullPath);

			// Update open files map
			if (this.openFiles.has(oldPath)) {
				const content = this.openFiles.get(oldPath)!;
				this.openFiles.delete(oldPath);
				this.openFiles.set(newPath, content);
			}

			return true;
		} catch (error) {
			console.error('Failed to rename file:', error);
			return false;
		}
	}

	async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
		try {
			const results: SearchResult[] = [];
			const files = await this.getFiles(options?.includePattern);

			const searchRegex = options?.regex
				? new RegExp(query, options.caseSensitive ? 'g' : 'gi')
				: new RegExp(this.escapeRegex(query), options?.caseSensitive ? 'g' : 'gi');

			for (const file of files) {
				if (options?.excludePattern && this.matchesPattern(file, options.excludePattern)) {
					continue;
				}

				try {
					const content = await this.getFile(file);
					const lines = content.split('\n');

					for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
						const line = lines[lineIndex];
						let match;

						while ((match = searchRegex.exec(line)) !== null) {
							results.push({
								file,
								line: lineIndex + 1,
								column: match.index + 1,
								match: match[0],
								context: this.getLineContext(lines, lineIndex),
							});

							if (options?.maxResults && results.length >= options.maxResults) {
								return results;
							}
						}
					}
				} catch (fileError) {
					// Skip files that can't be read
					continue;
				}
			}

			return results;
		} catch (error) {
			console.error('Failed to search:', error);
			return [];
		}
	}

	async getFile(relativePath: string): Promise<string> {
		try {
			// Check cache first
			if (this.openFiles.has(relativePath)) {
				return this.openFiles.get(relativePath)!;
			}

			const fullPath = this.getFullPath(relativePath);
			const content = await fs.readFile(fullPath, 'utf-8');

			// Cache the content
			this.openFiles.set(relativePath, content);

			return content;
		} catch (error) {
			console.error('Failed to get file:', error);
			throw error;
		}
	}

	async getFiles(pattern?: string): Promise<string[]> {
		if (!this.workspacePath) {
			return [];
		}

		try {
			const files = await this.scanDirectory(path.join(this.workspacePath, 'workspace'));

			if (pattern) {
				return files.filter(file => this.matchesPattern(file, pattern));
			}

			return files;
		} catch (error) {
			console.error('Failed to get files:', error);
			return [];
		}
	}

	async openFile(relativePath: string, line?: number, column?: number): Promise<void> {
		try {
			// Load file content into cache
			await this.getFile(relativePath);

			// In a real implementation, this would focus the editor on the specific file/line/column
			console.log(`Opening file: ${relativePath}`, { line, column });
		} catch (error) {
			console.error('Failed to open file:', error);
		}
	}

	async getSelection(): Promise<{ file: string; start: any; end: any } | null> {
		// In a real implementation, this would get the current selection from the editor
		// For now, return null
		return null;
	}

	private async applyEditsToFile(filePath: string, edits: Edit[]): Promise<void> {
		const content = await this.getFile(filePath);
		const lines = content.split('\n');

		// Sort edits by position (bottom to top) to avoid index shifting
		const sortedEdits = edits.sort((a, b) => {
			if (a.start.line !== b.start.line) {
				return b.start.line - a.start.line;
			}
			return b.start.character - a.start.character;
		});

		// Apply each edit
		for (const edit of sortedEdits) {
			switch (edit.type) {
				case 'insert':
					this.insertText(lines, edit.start, edit.replacement);
					break;
				case 'replace':
					this.replaceText(lines, edit.start, edit.end, edit.replacement);
					break;
				case 'delete':
					this.deleteText(lines, edit.start, edit.end);
					break;
			}
		}

		// Update content
		const newContent = lines.join('\n');
		this.openFiles.set(filePath, newContent);

		// Write to disk
		const fullPath = this.getFullPath(filePath);
		await fs.writeFile(fullPath, newContent, 'utf-8');
	}

	private insertText(lines: string[], position: { line: number; character: number }, text: string): void {
		const lineIndex = position.line - 1;
		const line = lines[lineIndex] || '';

		const before = line.substring(0, position.character);
		const after = line.substring(position.character);

		const insertLines = text.split('\n');

		if (insertLines.length === 1) {
			lines[lineIndex] = before + text + after;
		} else {
			lines[lineIndex] = before + insertLines[0];

			for (let i = 1; i < insertLines.length - 1; i++) {
				lines.splice(lineIndex + i, 0, insertLines[i]);
			}

			lines.splice(lineIndex + insertLines.length - 1, 0, insertLines[insertLines.length - 1] + after);
		}
	}

	private replaceText(
		lines: string[],
		start: { line: number; character: number },
		end: { line: number; character: number },
		replacement: string
	): void {
		// First delete the range, then insert the replacement
		this.deleteText(lines, start, end);
		this.insertText(lines, start, replacement);
	}

	private deleteText(
		lines: string[],
		start: { line: number; character: number },
		end: { line: number; character: number }
	): void {
		const startLineIndex = start.line - 1;
		const endLineIndex = end.line - 1;

		if (startLineIndex === endLineIndex) {
			// Single line deletion
			const line = lines[startLineIndex];
			const before = line.substring(0, start.character);
			const after = line.substring(end.character);
			lines[startLineIndex] = before + after;
		} else {
			// Multi-line deletion
			const startLine = lines[startLineIndex];
			const endLine = lines[endLineIndex];

			const before = startLine.substring(0, start.character);
			const after = endLine.substring(end.character);

			// Remove lines in between
			lines.splice(startLineIndex, endLineIndex - startLineIndex + 1, before + after);
		}
	}

	private getFullPath(relativePath: string): string {
		if (!this.workspacePath) {
			throw new Error('No workspace path set');
		}

		return path.join(this.workspacePath, 'workspace', relativePath);
	}

	private async scanDirectory(dirPath: string): Promise<string[]> {
		const files: string[] = [];

		try {
			const entries = await fs.readdir(dirPath, { withFileTypes: true });

			for (const entry of entries) {
				const fullPath = path.join(dirPath, entry.name);

				if (entry.isDirectory()) {
					// Skip certain directories
					if (['.git', 'node_modules', '.devstudio'].includes(entry.name)) {
						continue;
					}

					const subFiles = await this.scanDirectory(fullPath);
					files.push(...subFiles);
				} else if (entry.isFile()) {
					// Make path relative to workspace
					const relativePath = path.relative(
						path.join(this.workspacePath!, 'workspace'),
						fullPath
					);
					files.push(relativePath);
				}
			}
		} catch (error) {
			// Directory might not exist or be readable
			console.warn('Failed to scan directory:', dirPath, error);
		}

		return files;
	}

	private matchesPattern(filePath: string, pattern: string): boolean {
		// Simple glob pattern matching
		const regexPattern = pattern
			.replace(/\./g, '\\.')
			.replace(/\*/g, '.*')
			.replace(/\?/g, '.');

		const regex = new RegExp(`^${regexPattern}$`, 'i');
		return regex.test(filePath);
	}

	private escapeRegex(text: string): string {
		return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	private getLineContext(lines: string[], lineIndex: number): string {
		const contextLines = 2;
		const start = Math.max(0, lineIndex - contextLines);
		const end = Math.min(lines.length, lineIndex + contextLines + 1);

		return lines.slice(start, end).join('\n');
	}

	// Additional utility methods
	async saveFile(relativePath: string, content: string): Promise<boolean> {
		try {
			this.openFiles.set(relativePath, content);
			const fullPath = this.getFullPath(relativePath);
			await fs.writeFile(fullPath, content, 'utf-8');
			return true;
		} catch (error) {
			console.error('Failed to save file:', error);
			return false;
		}
	}

	async fileExists(relativePath: string): Promise<boolean> {
		try {
			const fullPath = this.getFullPath(relativePath);
			await fs.access(fullPath);
			return true;
		} catch {
			return false;
		}
	}

	async getFileStats(relativePath: string): Promise<{ size: number; modified: Date } | null> {
		try {
			const fullPath = this.getFullPath(relativePath);
			const stats = await fs.stat(fullPath);
			return {
				size: stats.size,
				modified: stats.mtime,
			};
		} catch {
			return null;
		}
	}

	clearCache(): void {
		this.openFiles.clear();
	}
}
