import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

interface DebugVariable {
	name: string;
	value: any;
	type: string;
	scope: 'local' | 'global' | 'closure';
	changed?: boolean;
}

interface DebugStackFrame {
	id: string;
	name: string;
	file: string;
	line: number;
	column: number;
}

interface DebugBreakpoint {
	id: string;
	file: string;
	line: number;
	condition?: string;
	hitCount: number;
	active: boolean;
}

interface ConsoleMessage {
	id: string;
	type: 'log' | 'error' | 'warn' | 'info' | 'command' | 'result';
	content: string;
	timestamp: Date;
	source?: string;
}

interface InteractiveDebugConsoleProps {
	variables: DebugVariable[];
	stackFrames: DebugStackFrame[];
	breakpoints: DebugBreakpoint[];
	onExecuteCommand: (command: string) => Promise<string>;
	onSetBreakpoint: (file: string, line: number, condition?: string) => void;
	onEvaluateExpression: (expression: string) => Promise<any>;
	isDebugging: boolean;
}

export const InteractiveDebugConsole: React.FC<InteractiveDebugConsoleProps> = ({
	variables,
	stackFrames,
	breakpoints,
	onExecuteCommand,
	onSetBreakpoint,
	onEvaluateExpression,
	isDebugging
}) => {
	const [command, setCommand] = useState('');
	const [messages, setMessages] = useState<ConsoleMessage[]>([]);
	const [selectedFrame, setSelectedFrame] = useState<string>('');
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [activeTab, setActiveTab] = useState<'console' | 'variables' | 'stack' | 'breakpoints'>('console');
	const [expandedVariables, setExpandedVariables] = useState<Set<string>>(new Set());
	const consoleRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// Auto-scroll console to bottom
		if (consoleRef.current) {
			consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		// Add welcome message when debugging starts
		if (isDebugging && messages.length === 0) {
			addMessage({
				type: 'info',
				content: '🚀 Interactive debugging session started. Type commands or ask questions about your code!'
			});
		}
	}, [isDebugging]);

	const addMessage = (message: Omit<ConsoleMessage, 'id' | 'timestamp'>) => {
		const newMessage: ConsoleMessage = {
			...message,
			id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			timestamp: new Date()
		};
		setMessages(prev => [...prev, newMessage]);
	};

	const handleExecuteCommand = async () => {
		if (!command.trim()) return;

		// Add command to history
		setCommandHistory(prev => [...prev, command]);
		setHistoryIndex(-1);

		// Add command message
		addMessage({
			type: 'command',
			content: command
		});

		try {
			// Check if it's a special debug command
			if (command.startsWith('/')) {
				await handleSpecialCommand(command);
			} else {
				// Regular command or expression evaluation
				const result = await onExecuteCommand(command);
				addMessage({
					type: 'result',
					content: result
				});
			}
		} catch (error) {
			addMessage({
				type: 'error',
				content: `Error: ${error instanceof Error ? error.message : String(error)}`
			});
		}

		setCommand('');
	};

	const handleSpecialCommand = async (cmd: string) => {
		const [command, ...args] = cmd.slice(1).split(' ');

		switch (command) {
			case 'help':
				addMessage({
					type: 'info',
					content: `Available commands:
/help - Show this help
/vars - List all variables
/stack - Show call stack
/bp <file:line> - Set breakpoint
/eval <expression> - Evaluate expression
/clear - Clear console
/explain <variable> - Explain variable value
/watch <expression> - Add expression to watch list`
				});
				break;

			case 'vars':
				const varList = variables.map(v => `${v.name}: ${v.type} = ${JSON.stringify(v.value)}`).join('\n');
				addMessage({
					type: 'result',
					content: varList || 'No variables in current scope'
				});
				break;

			case 'stack':
				const stackList = stackFrames.map((frame, i) =>
					`${i}: ${frame.name} (${frame.file}:${frame.line})`
				).join('\n');
				addMessage({
					type: 'result',
					content: stackList || 'No stack frames available'
				});
				break;

			case 'bp':
				if (args.length > 0) {
					const [fileAndLine, condition] = args.join(' ').split(' if ');
					const [file, line] = fileAndLine.split(':');
					if (file && line) {
						onSetBreakpoint(file, parseInt(line), condition);
						addMessage({
							type: 'info',
							content: `Breakpoint set at ${file}:${line}${condition ? ` with condition: ${condition}` : ''}`
						});
					}
				}
				break;

			case 'eval':
				if (args.length > 0) {
					try {
						const result = await onEvaluateExpression(args.join(' '));
						addMessage({
							type: 'result',
							content: JSON.stringify(result, null, 2)
						});
					} catch (error) {
						addMessage({
							type: 'error',
							content: `Evaluation error: ${error}`
						});
					}
				}
				break;

			case 'clear':
				setMessages([]);
				addMessage({
					type: 'info',
					content: 'Console cleared'
				});
				break;

			case 'explain':
				if (args.length > 0) {
					const varName = args[0];
					const variable = variables.find(v => v.name === varName);
					if (variable) {
						addMessage({
							type: 'info',
							content: `Variable "${varName}" is a ${variable.type} with value: ${JSON.stringify(variable.value, null, 2)}
Scope: ${variable.scope}
${variable.changed ? 'This variable was recently modified.' : ''}`
						});
					} else {
						addMessage({
							type: 'error',
							content: `Variable "${varName}" not found in current scope`
						});
					}
				}
				break;

			default:
				addMessage({
					type: 'error',
					content: `Unknown command: /${command}. Type /help for available commands.`
				});
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleExecuteCommand();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (commandHistory.length > 0) {
				const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
				setHistoryIndex(newIndex);
				setCommand(commandHistory[newIndex]);
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyIndex !== -1) {
				const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : -1;
				setHistoryIndex(newIndex);
				setCommand(newIndex === -1 ? '' : commandHistory[newIndex]);
			}
		}
	};

	const toggleVariableExpansion = (varName: string) => {
		setExpandedVariables(prev => {
			const newSet = new Set(prev);
			if (newSet.has(varName)) {
				newSet.delete(varName);
			} else {
				newSet.add(varName);
			}
			return newSet;
		});
	};

	const formatValue = (value: any, depth: number = 0): string => {
		if (depth > 3) return '...';

		if (value === null) return 'null';
		if (value === undefined) return 'undefined';
		if (typeof value === 'string') return `"${value}"`;
		if (typeof value === 'number' || typeof value === 'boolean') return String(value);
		if (Array.isArray(value)) {
			if (value.length === 0) return '[]';
			if (depth > 2) return `[${value.length} items]`;
			return `[${value.map(v => formatValue(v, depth + 1)).join(', ')}]`;
		}
		if (typeof value === 'object') {
			const keys = Object.keys(value);
			if (keys.length === 0) return '{}';
			if (depth > 2) return `{${keys.length} properties}`;
			return `{${keys.slice(0, 3).map(k => `${k}: ${formatValue(value[k], depth + 1)}`).join(', ')}${keys.length > 3 ? '...' : ''}}`;
		}
		return String(value);
	};

	const getMessageIcon = (type: ConsoleMessage['type']) => {
		const icons = {
			log: '📝',
			error: '❌',
			warn: '⚠️',
			info: 'ℹ️',
			command: '➤',
			result: '✓'
		};
		return icons[type] || '📝';
	};

	if (!isDebugging) {
		return (
			<div className="debug-console-inactive">
				<div className="inactive-message">
					<h3>🐛 Interactive Debug Console</h3>
					<p>Start a debugging session to begin interactive debugging with AI assistance.</p>
					<p>Features:</p>
					<ul>
						<li>Conversational debugging commands</li>
						<li>Variable inspection and explanation</li>
						<li>Smart breakpoint suggestions</li>
						<li>Code execution in debug context</li>
					</ul>
				</div>
			</div>
		);
	}

	return (
		<div className="interactive-debug-console">
			<div className="debug-tabs">
				{(['console', 'variables', 'stack', 'breakpoints'] as const).map(tab => (
					<button
						key={tab}
						className={`tab ${activeTab === tab ? 'active' : ''}`}
						onClick={() => setActiveTab(tab)}
					>
						{tab.charAt(0).toUpperCase() + tab.slice(1)}
						{tab === 'breakpoints' && ` (${breakpoints.length})`}
						{tab === 'variables' && ` (${variables.length})`}
					</button>
				))}
			</div>

			<div className="debug-content">
				{activeTab === 'console' && (
					<div className="console-tab">
						<div className="console-messages" ref={consoleRef}>
							{messages.map(message => (
								<div key={message.id} className={`console-message ${message.type}`}>
									<span className="message-icon">{getMessageIcon(message.type)}</span>
									<span className="message-time">{message.timestamp.toLocaleTimeString()}</span>
									<pre className="message-content">{message.content}</pre>
								</div>
							))}
						</div>
						<div className="console-input">
							<span className="prompt">debug{'>'}  </span>
							<input
								ref={inputRef}
								type="text"
								value={command}
								onChange={(e) => setCommand(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Type a command or expression (try /help for commands)"
								disabled={!isDebugging}
							/>
							<button onClick={handleExecuteCommand} disabled={!command.trim()}>
								Execute
							</button>
						</div>
					</div>
				)}

				{activeTab === 'variables' && (
					<div className="variables-tab">
						{variables.length === 0 ? (
							<div className="empty-state">No variables in current scope</div>
						) : (
							<div className="variables-list">
								{variables.map(variable => (
									<div key={variable.name} className={`variable-item ${variable.changed ? 'changed' : ''}`}>
										<div
											className="variable-header"
											onClick={() => toggleVariableExpansion(variable.name)}
										>
											<span className="expand-icon">
												{expandedVariables.has(variable.name) ? '▼' : '▶'}
											</span>
											<span className="variable-name">{variable.name}</span>
											<span className="variable-type">{variable.type}</span>
											<span className="variable-scope">{variable.scope}</span>
										</div>
										<div className="variable-value">
											{expandedVariables.has(variable.name)
												? <pre>{JSON.stringify(variable.value, null, 2)}</pre>
												: formatValue(variable.value)
											}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === 'stack' && (
					<div className="stack-tab">
						{stackFrames.length === 0 ? (
							<div className="empty-state">No stack frames available</div>
						) : (
							<div className="stack-frames">
								{stackFrames.map((frame, index) => (
									<div
										key={frame.id}
										className={`stack-frame ${selectedFrame === frame.id ? 'selected' : ''}`}
										onClick={() => setSelectedFrame(frame.id)}
									>
										<div className="frame-index">{index}</div>
										<div className="frame-info">
											<div className="frame-name">{frame.name}</div>
											<div className="frame-location">{frame.file}:{frame.line}:{frame.column}</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === 'breakpoints' && (
					<div className="breakpoints-tab">
						{breakpoints.length === 0 ? (
							<div className="empty-state">
								No breakpoints set
								<p>Use /bp filename:line to set a breakpoint</p>
							</div>
						) : (
							<div className="breakpoints-list">
								{breakpoints.map(bp => (
									<div key={bp.id} className={`breakpoint-item ${bp.active ? 'active' : 'inactive'}`}>
										<div className="breakpoint-info">
											<span className="breakpoint-file">{bp.file}:{bp.line}</span>
											{bp.condition && <span className="breakpoint-condition">if {bp.condition}</span>}
										</div>
										<div className="breakpoint-stats">
											<span className="hit-count">Hits: {bp.hitCount}</span>
											<span className={`status ${bp.active ? 'active' : 'inactive'}`}>
												{bp.active ? '●' : '○'}
											</span>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>

			<style jsx>{`
				.interactive-debug-console {
					height: 100%;
					display: flex;
					flex-direction: column;
					background: var(--vscode-editor-background);
					color: var(--vscode-editor-foreground);
				}

				.debug-console-inactive {
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					background: var(--vscode-editor-background);
					color: var(--vscode-editor-foreground);
				}

				.inactive-message {
					text-align: center;
					max-width: 400px;
					padding: 20px;
				}

				.inactive-message h3 {
					margin-bottom: 16px;
				}

				.inactive-message ul {
					text-align: left;
					margin-top: 16px;
				}

				.debug-tabs {
					display: flex;
					border-bottom: 1px solid var(--vscode-panel-border);
				}

				.tab {
					padding: 8px 16px;
					background: transparent;
					border: none;
					color: var(--vscode-tab-inactiveForeground);
					cursor: pointer;
					border-bottom: 2px solid transparent;
				}

				.tab.active {
					color: var(--vscode-tab-activeForeground);
					border-bottom-color: var(--vscode-tab-activeBorder);
				}

				.debug-content {
					flex: 1;
					overflow: hidden;
				}

				.console-tab {
					height: 100%;
					display: flex;
					flex-direction: column;
				}

				.console-messages {
					flex: 1;
					overflow-y: auto;
					padding: 8px;
					font-family: var(--vscode-editor-font-family);
					font-size: var(--vscode-editor-font-size);
				}

				.console-message {
					display: flex;
					align-items: flex-start;
					margin-bottom: 4px;
					padding: 4px 0;
				}

				.message-icon {
					margin-right: 8px;
					font-size: 12px;
				}

				.message-time {
					margin-right: 8px;
					font-size: 10px;
					opacity: 0.6;
					min-width: 60px;
				}

				.message-content {
					flex: 1;
					margin: 0;
					white-space: pre-wrap;
					font-family: inherit;
				}

				.console-message.command .message-content {
					color: var(--vscode-terminal-ansiBlue);
				}

				.console-message.error .message-content {
					color: var(--vscode-errorForeground);
				}

				.console-message.warn .message-content {
					color: var(--vscode-list-warningForeground);
				}

				.console-message.result .message-content {
					color: var(--vscode-charts-green);
				}

				.console-input {
					display: flex;
					align-items: center;
					padding: 8px;
					border-top: 1px solid var(--vscode-panel-border);
					background: var(--vscode-input-background);
				}

				.prompt {
					margin-right: 8px;
					color: var(--vscode-terminal-ansiBlue);
					font-weight: bold;
				}

				.console-input input {
					flex: 1;
					padding: 4px 8px;
					background: transparent;
					border: 1px solid var(--vscode-input-border);
					color: var(--vscode-input-foreground);
					border-radius: 3px;
				}

				.console-input button {
					margin-left: 8px;
					padding: 4px 12px;
					background: var(--vscode-button-background);
					color: var(--vscode-button-foreground);
					border: none;
					border-radius: 3px;
					cursor: pointer;
				}

				.variables-tab, .stack-tab, .breakpoints-tab {
					height: 100%;
					overflow-y: auto;
					padding: 8px;
				}

				.empty-state {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					height: 200px;
					color: var(--vscode-descriptionForeground);
					text-align: center;
				}

				.variables-list, .stack-frames, .breakpoints-list {
					display: flex;
					flex-direction: column;
					gap: 4px;
				}

				.variable-item {
					border: 1px solid var(--vscode-panel-border);
					border-radius: 4px;
					padding: 8px;
				}

				.variable-item.changed {
					border-color: var(--vscode-charts-orange);
					background: var(--vscode-inputValidation-warningBackground);
				}

				.variable-header {
					display: flex;
					align-items: center;
					cursor: pointer;
					gap: 8px;
				}

				.expand-icon {
					font-size: 10px;
				}

				.variable-name {
					font-weight: bold;
					flex: 1;
				}

				.variable-type {
					font-size: 12px;
					color: var(--vscode-charts-blue);
				}

				.variable-scope {
					font-size: 10px;
					opacity: 0.7;
					text-transform: uppercase;
				}

				.variable-value {
					margin-top: 4px;
					padding-left: 16px;
					font-family: var(--vscode-editor-font-family);
					font-size: 12px;
				}

				.stack-frame {
					display: flex;
					align-items: center;
					padding: 8px;
					border: 1px solid var(--vscode-panel-border);
					border-radius: 4px;
					cursor: pointer;
				}

				.stack-frame.selected {
					background: var(--vscode-list-activeSelectionBackground);
					border-color: var(--vscode-focusBorder);
				}

				.frame-index {
					width: 20px;
					text-align: center;
					font-weight: bold;
					margin-right: 12px;
				}

				.frame-info {
					flex: 1;
				}

				.frame-name {
					font-weight: bold;
					margin-bottom: 2px;
				}

				.frame-location {
					font-size: 12px;
					opacity: 0.7;
				}

				.breakpoint-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 8px;
					border: 1px solid var(--vscode-panel-border);
					border-radius: 4px;
				}

				.breakpoint-item.active {
					border-color: var(--vscode-charts-red);
				}

				.breakpoint-info {
					flex: 1;
				}

				.breakpoint-file {
					font-weight: bold;
				}

				.breakpoint-condition {
					font-size: 12px;
					color: var(--vscode-charts-orange);
					margin-left: 8px;
				}

				.breakpoint-stats {
					display: flex;
					align-items: center;
					gap: 8px;
				}

				.hit-count {
					font-size: 12px;
					opacity: 0.7;
				}

				.status.active {
					color: var(--vscode-charts-red);
				}

				.status.inactive {
					color: var(--vscode-descriptionForeground);
				}
			`}</style>
		</div>
	);
};
