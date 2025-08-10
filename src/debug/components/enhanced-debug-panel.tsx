import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as vscode from 'vscode';
import { AIDebugAdapter, DebugSessionData, DebugAnalysis, VariableAnomaly } from '../ai-debug-adapter';

export interface DebugEvent {
	id: string;
	timestamp: number;
	type: 'breakpoint' | 'variable-change' | 'function-call' | 'exception' | 'step';
	data: any;
	stackFrame?: vscode.DebugStackFrame;
	variables?: vscode.DebugVariable[];
}

export interface TimelineProps {
	events: DebugEvent[];
	currentEventId?: string;
	onJump: (event: DebugEvent) => void;
	onFilter: (eventTypes: string[]) => void;
}

const Timeline: React.FC<TimelineProps> = ({ events, currentEventId, onJump, onFilter }) => {
	const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
	const timelineRef = useRef<HTMLDivElement>(null);

	const eventTypes = Array.from(new Set(events.map(e => e.type)));
	const filteredEvents = selectedFilters.length === 0
		? events
		: events.filter(e => selectedFilters.includes(e.type));

	const handleFilterChange = (eventType: string, checked: boolean) => {
		const newFilters = checked
			? [...selectedFilters, eventType]
			: selectedFilters.filter(f => f !== eventType);

		setSelectedFilters(newFilters);
		onFilter(newFilters);
	};

	const formatTimestamp = (timestamp: number) => {
		return new Date(timestamp).toLocaleTimeString();
	};

	const getEventIcon = (type: string) => {
		switch (type) {
			case 'breakpoint': return '🔴';
			case 'variable-change': return '📝';
			case 'function-call': return '📞';
			case 'exception': return '⚠️';
			case 'step': return '👣';
			default: return '📍';
		}
	};

	return (
		<div className="timeline-container">
			<div className="timeline-filters">
				<h4>Event Filters:</h4>
				{eventTypes.map(type => (
					<label key={type} className="filter-checkbox">
						<input
							type="checkbox"
							checked={selectedFilters.includes(type)}
							onChange={(e) => handleFilterChange(type, e.target.checked)}
						/>
						{getEventIcon(type)} {type}
					</label>
				))}
			</div>

			<div className="timeline-scroll" ref={timelineRef}>
				<div className="timeline-line"></div>
				{filteredEvents.map((event, index) => (
					<div
						key={event.id}
						className={`timeline-event ${event.id === currentEventId ? 'current' : ''}`}
						onClick={() => onJump(event)}
					>
						<div className="event-marker">
							<span className="event-icon">{getEventIcon(event.type)}</span>
						</div>
						<div className="event-content">
							<div className="event-header">
								<span className="event-type">{event.type}</span>
								<span className="event-time">{formatTimestamp(event.timestamp)}</span>
							</div>
							<div className="event-details">
								{event.type === 'breakpoint' && (
									<span>Line {event.data.line} in {event.data.file}</span>
								)}
								{event.type === 'variable-change' && (
									<span>{event.data.name}: {event.data.oldValue} → {event.data.newValue}</span>
								)}
								{event.type === 'function-call' && (
									<span>{event.data.functionName}({event.data.args?.join(', ')})</span>
								)}
								{event.type === 'exception' && (
									<span className="error">{event.data.message}</span>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export interface DebugPanelProps {
	debugAdapter: AIDebugAdapter;
	sessionData: DebugSessionData;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ debugAdapter, sessionData }) => {
	const [debugEvents, setDebugEvents] = useState<DebugEvent[]>([]);
	const [currentEventIndex, setCurrentEventIndex] = useState<number>(-1);
	const [analysis, setAnalysis] = useState<DebugAnalysis | null>(null);
	const [anomalies, setAnomalies] = useState<VariableAnomaly[]>([]);
	const [selectedView, setSelectedView] = useState<'timeline' | 'variables' | 'analysis'>('timeline');
	const [isRecording, setIsRecording] = useState<boolean>(true);

	useEffect(() => {
		// Setup event listeners for debug adapter
		const handleDebugEvent = (event: DebugEvent) => {
			if (isRecording) {
				setDebugEvents(prev => [...prev, event]);
				setCurrentEventIndex(prev => prev + 1);
			}
		};

		const handleStackTraceEnhanced = (data: any) => {
			setAnalysis(data.analysis);
		};

		const handleVariablesAnalyzed = (data: any) => {
			setAnomalies(data.anomalies);
		};

		debugAdapter.on('debug-event', handleDebugEvent);
		debugAdapter.on('stackTraceEnhanced', handleStackTraceEnhanced);
		debugAdapter.on('variablesAnalyzed', handleVariablesAnalyzed);

		return () => {
			debugAdapter.off('debug-event', handleDebugEvent);
			debugAdapter.off('stackTraceEnhanced', handleStackTraceEnhanced);
			debugAdapter.off('variablesAnalyzed', handleVariablesAnalyzed);
		};
	}, [debugAdapter, isRecording]);

	const timeTravelDebug = useCallback(async (event: DebugEvent) => {
		try {
			// Find the event index
			const eventIndex = debugEvents.findIndex(e => e.id === event.id);
			if (eventIndex === -1) return;

			setCurrentEventIndex(eventIndex);

			// Simulate time travel by restoring the debug state at this event
			// This would require integration with the actual debugger
			await vscode.commands.executeCommand('workbench.action.debug.restart');

			// TODO: Implement actual time travel debugging
			// This would involve:
			// 1. Recording all variable states at each event
			// 2. Replaying execution up to the target event
			// 3. Restoring variable watch expressions

			console.log(`Time traveling to event: ${event.type} at ${event.timestamp}`);
		} catch (error) {
			console.error('Time travel debugging failed:', error);
			vscode.window.showErrorMessage(`Failed to time travel: ${error}`);
		}
	}, [debugEvents]);

	const handleFilterEvents = useCallback((eventTypes: string[]) => {
		// Filter logic is handled in the Timeline component
	}, []);

	const toggleRecording = () => {
		setIsRecording(!isRecording);
	};

	const clearTimeline = () => {
		setDebugEvents([]);
		setCurrentEventIndex(-1);
		setAnalysis(null);
		setAnomalies([]);
	};

	const exportTimeline = () => {
		const data = {
			sessionId: sessionData.sessionId,
			events: debugEvents,
			analysis,
			anomalies,
			exportedAt: Date.now()
		};

		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `debug-timeline-${sessionData.sessionId}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const renderVariablesView = () => (
		<div className="variables-view">
			<h3>Variables & Anomalies</h3>
			{sessionData.variables?.map(variable => {
				const anomaly = anomalies.find(a => a.variableName === variable.name);
				return (
					<div key={variable.name} className={`variable-item ${anomaly ? 'has-anomaly' : ''}`}>
						<div className="variable-header">
							<span className="variable-name">{variable.name}</span>
							<span className="variable-value">{variable.value}</span>
						</div>
						{anomaly && (
							<div className={`anomaly-indicator ${anomaly.severity}`}>
								<span className="anomaly-type">{anomaly.anomalyType}</span>
								<span className="anomaly-suggestion">{anomaly.suggestion}</span>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);

	const renderAnalysisView = () => (
		<div className="analysis-view">
			<h3>AI Analysis</h3>
			{analysis ? (
				<div>
					<div className="analysis-tags">
						<h4>Tags:</h4>
						{analysis.tags.map(tag => (
							<span key={tag} className="tag">{tag}</span>
						))}
					</div>

					<div className="analysis-suggestions">
						<h4>Suggestions:</h4>
						{analysis.suggestions.map(suggestion => (
							<div key={suggestion.id} className={`suggestion ${suggestion.category}`}>
								<div className="suggestion-header">
									<span className="suggestion-description">{suggestion.description}</span>
									<span className="suggestion-confidence">{(suggestion.confidence * 100).toFixed(0)}%</span>
								</div>
								<button
									className="apply-fix-btn"
									onClick={() => debugAdapter.handleCommand('applyFix', { fix: suggestion.fix })}
								>
									Apply Fix
								</button>
							</div>
						))}
					</div>

					<div className="analysis-fixes">
						<h4>Recommended Fixes:</h4>
						{analysis.fixes.map((fix, index) => (
							<div key={index} className="fix-item">
								<div className="fix-description">{fix.description}</div>
								<pre className="fix-code">{fix.newCode}</pre>
								<button
									className="apply-fix-btn"
									onClick={() => debugAdapter.handleCommand('applyFix', { fix })}
								>
									Apply This Fix
								</button>
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="no-analysis">No analysis available</div>
			)}
		</div>
	);

	return (
		<div className="debug-panel">
			<div className="debug-panel-header">
				<div className="view-tabs">
					<button
						className={selectedView === 'timeline' ? 'active' : ''}
						onClick={() => setSelectedView('timeline')}
					>
						Timeline
					</button>
					<button
						className={selectedView === 'variables' ? 'active' : ''}
						onClick={() => setSelectedView('variables')}
					>
						Variables
					</button>
					<button
						className={selectedView === 'analysis' ? 'active' : ''}
						onClick={() => setSelectedView('analysis')}
					>
						AI Analysis
					</button>
				</div>

				<div className="debug-controls">
					<button
						className={`record-btn ${isRecording ? 'recording' : ''}`}
						onClick={toggleRecording}
						title={isRecording ? 'Stop Recording' : 'Start Recording'}
					>
						{isRecording ? '⏹️' : '⏺️'}
					</button>
					<button onClick={clearTimeline} title="Clear Timeline">🗑️</button>
					<button onClick={exportTimeline} title="Export Timeline">💾</button>
				</div>
			</div>

			<div className="debug-panel-content">
				{selectedView === 'timeline' && (
					<Timeline
						events={debugEvents}
						currentEventId={debugEvents[currentEventIndex]?.id}
						onJump={timeTravelDebug}
						onFilter={handleFilterEvents}
					/>
				)}

				{selectedView === 'variables' && renderVariablesView()}

				{selectedView === 'analysis' && renderAnalysisView()}
			</div>

			<div className="debug-panel-footer">
				<div className="session-info">
					Session: {sessionData.sessionId} | Events: {debugEvents.length}
				</div>
				<div className="performance-info">
					{sessionData.performance && (
						<span>
							CPU: {sessionData.performance.cpu.toFixed(1)}% |
							Memory: {(sessionData.performance.memory / 1024 / 1024).toFixed(1)}MB |
							Response: {sessionData.performance.responseTime}ms
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default DebugPanel;
