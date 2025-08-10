import * as vscode from 'vscode';
import { EventEmitter } from 'events';

export interface ConversationTurn {
	id: string;
	type: 'user' | 'ai';
	content: string;
	timestamp: Date;
	context?: {
		fileChanges?: string[];
		debugState?: any;
		testResults?: any;
	};
}

export interface SharedEdit {
	id: string;
	file: string;
	range: vscode.Range;
	content: string;
	author: 'user' | 'ai';
	rationale: string;
	timestamp: Date;
}

export class ConversationSession extends EventEmitter {
	private sessionId: string;
	private turns: ConversationTurn[] = [];
	private sharedEdits: SharedEdit[] = [];
	private isActive = false;
	private context: Map<string, any> = new Map();

	constructor() {
		super();
		this.sessionId = this.generateSessionId();
	}

	async initialize(): Promise<void> {
		this.isActive = true;
		this.emit('sessionInitialized', this.sessionId);
	}

	addTurn(turn: Omit<ConversationTurn, 'id' | 'timestamp'>): ConversationTurn {
		const completeTurn: ConversationTurn = {
			...turn,
			id: this.generateId(),
			timestamp: new Date()
		};

		this.turns.push(completeTurn);
		this.emit('turnAdded', completeTurn);

		return completeTurn;
	}

	addSharedEdit(edit: Omit<SharedEdit, 'id' | 'timestamp'>): SharedEdit {
		const completeEdit: SharedEdit = {
			...edit,
			id: this.generateId(),
			timestamp: new Date()
		};

		this.sharedEdits.push(completeEdit);
		this.emit('editAdded', completeEdit);

		return completeEdit;
	}

	getRecentTurns(count: number = 10): ConversationTurn[] {
		return this.turns.slice(-count);
	}

	getRecentEdits(count: number = 20): SharedEdit[] {
		return this.sharedEdits.slice(-count);
	}

	setContext(key: string, value: any): void {
		this.context.set(key, value);
		this.emit('contextUpdated', key, value);
	}

	getContext(key: string): any {
		return this.context.get(key);
	}

	getAllContext(): Record<string, any> {
		return Object.fromEntries(this.context);
	}

	getConversationSummary(): {
		turnCount: number;
		editCount: number;
		duration: number;
		topics: string[];
	} {
		const firstTurn = this.turns[0];
		const lastTurn = this.turns[this.turns.length - 1];

		const duration = firstTurn && lastTurn
			? lastTurn.timestamp.getTime() - firstTurn.timestamp.getTime()
			: 0;

		// Extract topics from conversation
		const topics = this.extractTopics();

		return {
			turnCount: this.turns.length,
			editCount: this.sharedEdits.length,
			duration,
			topics
		};
	}

	private extractTopics(): string[] {
		const allText = this.turns.map(turn => turn.content).join(' ').toLowerCase();

		const topicKeywords = [
			'authentication', 'database', 'ui', 'api', 'testing', 'deployment',
			'react', 'typescript', 'node', 'debugging', 'performance', 'security'
		];

		return topicKeywords.filter(topic => allText.includes(topic));
	}

	exportSession(): {
		sessionId: string;
		turns: ConversationTurn[];
		edits: SharedEdit[];
		context: Record<string, any>;
		summary: any;
	} {
		return {
			sessionId: this.sessionId,
			turns: [...this.turns],
			edits: [...this.sharedEdits],
			context: this.getAllContext(),
			summary: this.getConversationSummary()
		};
	}

	async saveSession(): Promise<void> {
		const sessionData = this.exportSession();

		try {
			const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
			if (!workspaceFolder) return;

			const sessionUri = vscode.Uri.joinPath(
				workspaceFolder.uri,
				'.vscode',
				'ai-sessions',
				`${this.sessionId}.json`
			);

			await vscode.workspace.fs.writeFile(
				sessionUri,
				Buffer.from(JSON.stringify(sessionData, null, 2))
			);

			this.emit('sessionSaved', sessionUri);
		} catch (error) {
			this.emit('sessionSaveError', error);
		}
	}

	private generateSessionId(): string {
		const timestamp = new Date().toISOString().split('T')[0];
		const random = Math.random().toString(36).substr(2, 6);
		return `session-${timestamp}-${random}`;
	}

	private generateId(): string {
		return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	destroy(): void {
		this.isActive = false;
		this.turns = [];
		this.sharedEdits = [];
		this.context.clear();
		this.removeAllListeners();
	}
}
