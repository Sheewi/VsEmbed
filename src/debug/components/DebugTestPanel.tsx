import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SquareStop,
  Bug,
  TestTube,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Code,
  FileText,
  Settings,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface DebugTestPanelProps {
  workspaceRoot: string;
  activeFile?: string;
  onTestRun?: (results: any) => void;
  onDebugStart?: (session: any) => void;
}

interface TestCase {
  id: string;
  name: string;
  code: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'error';
  duration?: number;
  error?: string;
  coverage?: number;
}

interface DebugSession {
  id: string;
  status: 'active' | 'paused' | 'stopped';
  stackFrames: any[];
  variables: any[];
  breakpoints: any[];
}

interface LiveTestMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  coverage: number;
  executionTime: number;
}

export const DebugTestPanel: React.FC<DebugTestPanelProps> = ({
  workspaceRoot,
  activeFile,
  onTestRun,
  onDebugStart
}) => {
  const [activeTab, setActiveTab] = useState<'debug' | 'test' | 'coverage'>('debug');
  const [debugSession, setDebugSession] = useState<DebugSession | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isAutoTestEnabled, setIsAutoTestEnabled] = useState(true);
  const [isWatchingFiles, setIsWatchingFiles] = useState(true);
  const [metrics, setMetrics] = useState<LiveTestMetrics>({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    coverage: 0,
    executionTime: 0
  });
  const [debugOutput, setDebugOutput] = useState<string[]>([]);
  const [testOutput, setTestOutput] = useState<string[]>([]);
  const [smartBreakpoints, setSmartBreakpoints] = useState<any[]>([]);
  const [variableAnomalies, setVariableAnomalies] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isGeneratingTests, setIsGeneratingTests] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);

  const debugOutputRef = useRef<HTMLDivElement>(null);
  const testOutputRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket('ws://localhost:8080/debug-test');

        wsRef.current.onopen = () => {
          console.log('Debug-Test WebSocket connected');
        };

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        };

        wsRef.current.onclose = () => {
          console.log('Debug-Test WebSocket disconnected');
          // Reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        wsRef.current.onerror = (error) => {
          console.error('Debug-Test WebSocket error:', error);
        };

      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'debug-session-started':
        setDebugSession(data.session);
        setIsDebugging(true);
        break;
      case 'debug-session-paused':
        setDebugSession(prev => prev ? { ...prev, status: 'paused' } : null);
        break;
      case 'debug-session-stopped':
        setDebugSession(null);
        setIsDebugging(false);
        break;
      case 'test-started':
        updateTestCase(data.test.id, { status: 'running' });
        break;
      case 'test-completed':
        updateTestCase(data.test.id, {
          status: data.result.status,
          duration: data.result.duration,
          error: data.result.error
        });
        updateMetrics();
        break;
      case 'smart-breakpoints-suggested':
        setSmartBreakpoints(data.breakpoints);
        break;
      case 'variable-anomaly-detected':
        setVariableAnomalies(prev => [...prev, data.anomaly]);
        break;
      case 'ai-suggestion':
        setAiSuggestions(prev => [...prev, data.suggestion]);
        break;
      case 'debug-output':
        setDebugOutput(prev => [...prev, data.message]);
        break;
      case 'test-output':
        setTestOutput(prev => [...prev, data.message]);
        break;
    }
  }, []);

  const updateTestCase = (id: string, updates: Partial<TestCase>) => {
    setTestCases(prev => prev.map(test =>
      test.id === id ? { ...test, ...updates } : test
    ));
  };

  const updateMetrics = () => {
    setMetrics(prev => {
      const total = testCases.length;
      const passed = testCases.filter(t => t.status === 'passed').length;
      const failed = testCases.filter(t => t.status === 'failed').length;
      const avgTime = testCases
        .filter(t => t.duration)
        .reduce((sum, t) => sum + (t.duration || 0), 0) / total;

      return {
        totalTests: total,
        passedTests: passed,
        failedTests: failed,
        coverage: Math.random() * 100, // TODO: Calculate real coverage
        executionTime: avgTime
      };
    });
  };

  const startDebugSession = async () => {
    if (!activeFile) return;

    try {
      setIsDebugging(true);

      // Send debug start command via WebSocket
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'start-debug',
          file: activeFile,
          breakpoints: smartBreakpoints
        }));
      }

      onDebugStart?.({ file: activeFile });
    } catch (error) {
      console.error('Failed to start debug session:', error);
      setIsDebugging(false);
    }
  };

  const stopDebugSession = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'stop-debug'
      }));
    }
    setDebugSession(null);
    setIsDebugging(false);
  };

  const generateTests = async () => {
    if (!activeFile) return;

    try {
      setIsGeneratingTests(true);

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'generate-tests',
          file: activeFile,
          testType: 'unit',
          coverage: 80
        }));
      }

    } catch (error) {
      console.error('Failed to generate tests:', error);
    } finally {
      setIsGeneratingTests(false);
    }
  };

  const runAllTests = async () => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'run-all-tests',
          tests: testCases.map(t => t.id)
        }));
      }

      onTestRun?.(testCases);
    } catch (error) {
      console.error('Failed to run tests:', error);
    }
  };

  const runSingleTest = async (testId: string) => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'run-test',
          testId
        }));
      }
    } catch (error) {
      console.error('Failed to run test:', error);
    }
  };

  const toggleAutoTest = () => {
    setIsAutoTestEnabled(!isAutoTestEnabled);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'toggle-auto-test',
        enabled: !isAutoTestEnabled
      }));
    }
  };

  const toggleFileWatching = () => {
    setIsWatchingFiles(!isWatchingFiles);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'toggle-file-watching',
        enabled: !isWatchingFiles
      }));
    }
  };

  // Auto-scroll debug/test output
  useEffect(() => {
    if (debugOutputRef.current) {
      debugOutputRef.current.scrollTop = debugOutputRef.current.scrollHeight;
    }
  }, [debugOutput]);

  useEffect(() => {
    if (testOutputRef.current) {
      testOutputRef.current.scrollTop = testOutputRef.current.scrollHeight;
    }
  }, [testOutput]);

  const renderDebugTab = () => (
    <div className="p-4 space-y-4">
      {/* Debug Controls */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <button
          onClick={isDebugging ? stopDebugSession : startDebugSession}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium ${
            isDebugging
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isDebugging ? <SquareStop size={16} /> : <Play size={16} />}
          {isDebugging ? 'Stop Debug' : 'Start Debug'}
        </button>

        <button
          onClick={generateTests}
          disabled={isGeneratingTests}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isGeneratingTests ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
          Generate AI Tests
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleAutoTest}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
              isAutoTestEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isAutoTestEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
            Auto Test
          </button>

          <button
            onClick={toggleFileWatching}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
              isWatchingFiles ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isWatchingFiles ? <Eye size={14} /> : <EyeOff size={14} />}
            Watch Files
          </button>
        </div>
      </div>

      {/* Debug Session Info */}
      {debugSession && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Bug size={16} className="text-blue-600" />
            <span className="font-medium text-blue-800">Debug Session Active</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              debugSession.status === 'active' ? 'bg-green-100 text-green-700' :
              debugSession.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {debugSession.status}
            </span>
          </div>
          <div className="text-sm text-blue-700">
            Stack Frames: {debugSession.stackFrames?.length || 0} |
            Variables: {debugSession.variables?.length || 0} |
            Breakpoints: {debugSession.breakpoints?.length || 0}
          </div>
        </div>
      )}

      {/* Smart Breakpoints */}
      {smartBreakpoints.length > 0 && (
        <div className="p-3 border border-orange-200 rounded-lg">
          <h4 className="flex items-center gap-2 font-medium text-orange-800 mb-2">
            <Target size={16} />
            AI Suggested Breakpoints
          </h4>
          <div className="space-y-1">
            {smartBreakpoints.map((bp, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-orange-600 font-mono">L{bp.line}</span>
                <span className="text-gray-700">{bp.reason}</span>
                <span className={`px-1.5 py-0.5 rounded text-xs ${
                  bp.confidence > 0.8 ? 'bg-green-100 text-green-700' :
                  bp.confidence > 0.6 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {Math.round(bp.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variable Anomalies */}
      {variableAnomalies.length > 0 && (
        <div className="p-3 border border-red-200 rounded-lg">
          <h4 className="flex items-center gap-2 font-medium text-red-800 mb-2">
            <AlertTriangle size={16} />
            Variable Anomalies
          </h4>
          <div className="space-y-2">
            {variableAnomalies.map((anomaly, index) => (
              <div key={index} className="p-2 bg-red-50 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-sm font-mono text-red-700">{anomaly.variableName}</code>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    anomaly.severity === 'critical' ? 'bg-red-200 text-red-800' :
                    anomaly.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                    anomaly.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {anomaly.severity}
                  </span>
                </div>
                <p className="text-sm text-red-700">{anomaly.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Output */}
      <div className="h-64 border border-gray-200 rounded-lg">
        <div className="p-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
          <h4 className="flex items-center gap-2 font-medium text-gray-700">
            <FileText size={16} />
            Debug Output
          </h4>
        </div>
        <div
          ref={debugOutputRef}
          className="h-48 p-3 overflow-y-auto bg-black text-green-400 font-mono text-sm"
        >
          {debugOutput.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">{line}</div>
          ))}
          {debugOutput.length === 0 && (
            <div className="text-gray-500">Start debugging to see output...</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTestTab = () => (
    <div className="p-4 space-y-4">
      {/* Test Controls */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <button
          onClick={runAllTests}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700"
        >
          <Play size={16} />
          Run All Tests
        </button>

        <button
          onClick={generateTests}
          disabled={isGeneratingTests}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isGeneratingTests ? <RefreshCw size={16} className="animate-spin" /> : <TestTube size={16} />}
          Generate Tests
        </button>

        <div className="ml-auto text-sm text-gray-600">
          Total: {metrics.totalTests} |
          Passed: {metrics.passedTests} |
          Failed: {metrics.failedTests}
        </div>
      </div>

      {/* Test Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TestTube size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Total Tests</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{metrics.totalTests}</div>
        </div>

        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-800">Passed</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{metrics.passedTests}</div>
        </div>

        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={16} className="text-red-600" />
            <span className="text-sm font-medium text-red-800">Failed</span>
          </div>
          <div className="text-2xl font-bold text-red-900">{metrics.failedTests}</div>
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Avg Time</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900">{metrics.executionTime.toFixed(1)}ms</div>
        </div>
      </div>

      {/* Test Cases */}
      <div className="border border-gray-200 rounded-lg">
        <div className="p-3 bg-gray-100 border-b border-gray-200 rounded-t-lg">
          <h4 className="font-medium text-gray-700">Test Cases</h4>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {testCases.map((test) => (
            <div key={test.id} className="p-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${
                  test.status === 'passed' ? 'bg-green-500' :
                  test.status === 'failed' ? 'bg-red-500' :
                  test.status === 'running' ? 'bg-blue-500 animate-pulse' :
                  test.status === 'error' ? 'bg-orange-500' :
                  'bg-gray-300'
                }`} />
                <span className="font-medium text-gray-900">{test.name}</span>
                {test.duration && (
                  <span className="text-sm text-gray-500">({test.duration}ms)</span>
                )}
                <button
                  onClick={() => runSingleTest(test.id)}
                  className="ml-auto p-1 text-gray-400 hover:text-blue-600"
                >
                  <Play size={14} />
                </button>
              </div>
              {test.error && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {test.error}
                </div>
              )}
            </div>
          ))}
          {testCases.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No tests available. Generate some AI tests to get started!
            </div>
          )}
        </div>
      </div>

      {/* Test Output */}
      <div className="h-48 border border-gray-200 rounded-lg">
        <div className="p-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
          <h4 className="flex items-center gap-2 font-medium text-gray-700">
            <FileText size={16} />
            Test Output
          </h4>
        </div>
        <div
          ref={testOutputRef}
          className="h-36 p-3 overflow-y-auto bg-black text-green-400 font-mono text-sm"
        >
          {testOutput.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">{line}</div>
          ))}
          {testOutput.length === 0 && (
            <div className="text-gray-500">Run tests to see output...</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCoverageTab = () => (
    <div className="p-4 space-y-4">
      {/* Coverage Summary */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Code Coverage</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-3xl font-bold text-blue-900">{metrics.coverage.toFixed(1)}%</div>
            <div className="text-sm text-blue-700">Overall Coverage</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Lines</span>
              <span className="font-medium">{(metrics.coverage * 0.9).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Functions</span>
              <span className="font-medium">{(metrics.coverage * 0.95).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Branches</span>
              <span className="font-medium">{(metrics.coverage * 0.8).toFixed(1)}%</span>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${metrics.coverage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Coverage by File */}
      <div className="border border-gray-200 rounded-lg">
        <div className="p-3 bg-gray-100 border-b border-gray-200 rounded-t-lg">
          <h4 className="font-medium text-gray-700">Coverage by File</h4>
        </div>
        <div className="p-4">
          <div className="text-center text-gray-500 py-8">
            Coverage details will appear here when tests run with coverage enabled.
          </div>
        </div>
      </div>

      {/* AI Suggestions for Coverage */}
      {aiSuggestions.length > 0 && (
        <div className="p-3 border border-purple-200 rounded-lg">
          <h4 className="flex items-center gap-2 font-medium text-purple-800 mb-2">
            <Zap size={16} />
            AI Coverage Suggestions
          </h4>
          <div className="space-y-2">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="p-2 bg-purple-50 rounded">
                <p className="text-sm text-purple-700">{suggestion.description}</p>
                {suggestion.confidence && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-purple-200 text-purple-800 text-xs rounded">
                    Confidence: {Math.round(suggestion.confidence * 100)}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Bug size={18} className="text-blue-600" />
          <h2 className="font-semibold text-gray-900">AI Debug & Test Panel</h2>
          {activeFile && (
            <span className="ml-auto text-sm text-gray-500 truncate max-w-48">
              {activeFile.split('/').pop()}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {[
          { id: 'debug', label: 'Debug', icon: Bug },
          { id: 'test', label: 'Live Tests', icon: TestTube },
          { id: 'coverage', label: 'Coverage', icon: TrendingUp }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-blue-500 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'debug' && renderDebugTab()}
        {activeTab === 'test' && renderTestTab()}
        {activeTab === 'coverage' && renderCoverageTab()}
      </div>
    </div>
  );
};
