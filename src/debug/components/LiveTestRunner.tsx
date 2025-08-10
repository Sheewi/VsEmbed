import React, { useState, useEffect } from 'react';
import {
  TestTube,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Target,
  Zap,
  Eye,
  Filter,
  BarChart3
} from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  description?: string;
  file: string;
  line: number;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'error' | 'skipped';
  duration?: number;
  error?: string;
  output?: string;
  coverage?: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
  aiGenerated?: boolean;
  confidence?: number;
}

interface TestSuite {
  id: string;
  name: string;
  file: string;
  tests: TestCase[];
  status: 'pending' | 'running' | 'completed';
  duration?: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
}

interface TestRunnerProps {
  suites: TestSuite[];
  onRunTest: (testId: string) => void;
  onRunSuite: (suiteId: string) => void;
  onRunAll: () => void;
  onStopRun: () => void;
  onGenerateTests: (file: string) => void;
  isRunning: boolean;
  autoRun: boolean;
  onAutoRunToggle: (enabled: boolean) => void;
}

interface TestFilterState {
  status: 'all' | 'passed' | 'failed' | 'pending';
  type: 'all' | 'ai-generated' | 'manual';
  search: string;
}

export const LiveTestRunner: React.FC<TestRunnerProps> = ({
  suites,
  onRunTest,
  onRunSuite,
  onRunAll,
  onStopRun,
  onGenerateTests,
  isRunning,
  autoRun,
  onAutoRunToggle
}) => {
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);
  const [filters, setFilters] = useState<TestFilterState>({
    status: 'all',
    type: 'all',
    search: ''
  });
  const [showCoverage, setShowCoverage] = useState(false);
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set());

  // Calculate overall metrics
  const totalTests = suites.reduce((sum, suite) => sum + suite.totalTests, 0);
  const passedTests = suites.reduce((sum, suite) => sum + suite.passedTests, 0);
  const failedTests = suites.reduce((sum, suite) => sum + suite.failedTests, 0);
  const skippedTests = suites.reduce((sum, suite) => sum + suite.skippedTests, 0);
  const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  const toggleSuiteExpansion = (suiteId: string) => {
    const newExpanded = new Set(expandedSuites);
    if (newExpanded.has(suiteId)) {
      newExpanded.delete(suiteId);
    } else {
      newExpanded.add(suiteId);
    }
    setExpandedSuites(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'running':
        return <RefreshCw size={16} className="text-blue-500 animate-spin" />;
      case 'error':
        return <AlertTriangle size={16} className="text-orange-500" />;
      case 'skipped':
        return <Eye size={16} className="text-gray-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'running':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'error':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'skipped':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const filteredSuites = suites.filter(suite => {
    if (filters.search) {
      const searchMatch = suite.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         suite.tests.some(test =>
                           test.name.toLowerCase().includes(filters.search.toLowerCase())
                         );
      if (!searchMatch) return false;
    }

    return true;
  });

  const filteredTests = (suite: TestSuite) => {
    return suite.tests.filter(test => {
      if (filters.status !== 'all' && test.status !== filters.status) return false;

      if (filters.type === 'ai-generated' && !test.aiGenerated) return false;
      if (filters.type === 'manual' && test.aiGenerated) return false;

      if (filters.search) {
        const searchMatch = test.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           (test.description && test.description.toLowerCase().includes(filters.search.toLowerCase()));
        if (!searchMatch) return false;
      }

      return true;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Controls */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={isRunning ? onStopRun : onRunAll}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium ${
              isRunning
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            {isRunning ? 'Stop All' : 'Run All Tests'}
          </button>

          <button
            onClick={() => onGenerateTests('')}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
          >
            <Zap size={16} />
            Generate AI Tests
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={autoRun}
                onChange={(e) => onAutoRunToggle(e.target.checked)}
                className="w-4 h-4"
              />
              Auto-run
            </label>

            <button
              onClick={() => setShowCoverage(!showCoverage)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                showCoverage ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <BarChart3 size={14} />
              Coverage
            </button>
          </div>
        </div>

        {/* Test Summary */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{totalTests}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{passedTests}</div>
            <div className="text-xs text-gray-600">Passed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{failedTests}</div>
            <div className="text-xs text-gray-600">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{passRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-600">Pass Rate</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${passRate}%` }}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-sm">
          <Filter size={14} className="text-gray-500" />

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
            className="px-2 py-1 border border-gray-300 rounded text-xs"
          >
            <option value="all">All Status</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
            className="px-2 py-1 border border-gray-300 rounded text-xs"
          >
            <option value="all">All Types</option>
            <option value="ai-generated">AI Generated</option>
            <option value="manual">Manual</option>
          </select>

          <input
            type="text"
            placeholder="Search tests..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-2 py-1 border border-gray-300 rounded text-xs flex-1"
          />
        </div>
      </div>

      {/* Test Suites */}
      <div className="flex-1 overflow-auto">
        {filteredSuites.map((suite) => {
          const isExpanded = expandedSuites.has(suite.id);
          const testsToShow = filteredTests(suite);

          return (
            <div key={suite.id} className="border-b border-gray-200">
              {/* Suite Header */}
              <div
                className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleSuiteExpansion(suite.id)}
              >
                <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                  ▶
                </div>

                <TestTube size={16} className="text-blue-600" />

                <div className="flex-1">
                  <div className="font-medium text-gray-900">{suite.name}</div>
                  <div className="text-xs text-gray-600">{suite.file}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {suite.passedTests}/{suite.totalTests}
                  </span>

                  {suite.duration && (
                    <span className="text-xs text-gray-500">
                      {suite.duration}ms
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRunSuite(suite.id);
                    }}
                    className="p-1 text-gray-400 hover:text-green-600"
                  >
                    <Play size={14} />
                  </button>
                </div>
              </div>

              {/* Suite Tests */}
              {isExpanded && (
                <div className="bg-gray-50">
                  {testsToShow.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center gap-2 p-3 pl-8 border-t border-gray-200 hover:bg-white"
                    >
                      {getStatusIcon(test.status)}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 truncate">
                            {test.name}
                          </span>

                          {test.aiGenerated && (
                            <div className="flex items-center gap-1">
                              <Zap size={10} className="text-yellow-500" />
                              <span className="text-xs text-yellow-700">AI</span>
                              {test.confidence && (
                                <span className="text-xs text-gray-500">
                                  {Math.round(test.confidence * 100)}%
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {test.description && (
                          <div className="text-xs text-gray-600 truncate">
                            {test.description}
                          </div>
                        )}

                        {test.error && (
                          <div className="text-xs text-red-600 truncate mt-1">
                            {test.error}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {test.duration && (
                          <span>{test.duration}ms</span>
                        )}

                        {showCoverage && test.coverage && (
                          <span className="text-blue-600">
                            {test.coverage.lines}% cov
                          </span>
                        )}

                        <button
                          onClick={() => onRunTest(test.id)}
                          className="p-1 text-gray-400 hover:text-green-600"
                        >
                          <Play size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {testsToShow.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No tests match the current filters
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredSuites.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <TestTube size={48} className="mx-auto mb-4 text-gray-300" />
            <div className="text-lg font-medium mb-2">No tests found</div>
            <div className="text-sm">
              Generate some AI tests or adjust your filters to see test results.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface TestCoverageViewProps {
  coverage: {
    overall: {
      lines: number;
      functions: number;
      branches: number;
      statements: number;
    };
    files: Array<{
      file: string;
      lines: number;
      functions: number;
      branches: number;
      statements: number;
      uncoveredLines: number[];
    }>;
  };
  onViewFile: (file: string, line?: number) => void;
}

export const TestCoverageView: React.FC<TestCoverageViewProps> = ({
  coverage,
  onViewFile
}) => {
  const [sortBy, setSortBy] = useState<'file' | 'lines' | 'functions' | 'branches'>('lines');
  const [sortDesc, setSortDesc] = useState(true);

  const sortedFiles = [...coverage.files].sort((a, b) => {
    const aVal = a[sortBy] || a.file;
    const bVal = b[sortBy] || b.file;

    if (typeof aVal === 'string') {
      return sortDesc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    }

    return sortDesc ? bVal - aVal : aVal - bVal;
  });

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const HeaderButton: React.FC<{ field: keyof typeof sortBy; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => {
        if (sortBy === field) {
          setSortDesc(!sortDesc);
        } else {
          setSortBy(field as any);
          setSortDesc(true);
        }
      }}
      className="flex items-center gap-1 text-left font-medium text-gray-700 hover:text-gray-900"
    >
      {children}
      {sortBy === field && (
        <span className="text-xs">{sortDesc ? '↓' : '↑'}</span>
      )}
    </button>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Overall Coverage Summary */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="font-semibold text-gray-900 mb-3">Coverage Summary</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Lines', value: coverage.overall.lines },
            { label: 'Functions', value: coverage.overall.functions },
            { label: 'Branches', value: coverage.overall.branches },
            { label: 'Statements', value: coverage.overall.statements }
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className={`text-2xl font-bold ${getCoverageColor(value).split(' ')[0]}`}>
                {value.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">{label}</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    value >= 80 ? 'bg-green-500' :
                    value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Coverage Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="text-left p-3">
                <HeaderButton field="file">File</HeaderButton>
              </th>
              <th className="text-right p-3">
                <HeaderButton field="lines">Lines</HeaderButton>
              </th>
              <th className="text-right p-3">
                <HeaderButton field="functions">Functions</HeaderButton>
              </th>
              <th className="text-right p-3">
                <HeaderButton field="branches">Branches</HeaderButton>
              </th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedFiles.map((file, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3">
                  <div className="font-medium text-gray-900 truncate">
                    {file.file.split('/').pop()}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {file.file}
                  </div>
                </td>
                <td className="text-right p-3">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getCoverageColor(file.lines)}`}>
                    {file.lines.toFixed(1)}%
                  </span>
                </td>
                <td className="text-right p-3">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getCoverageColor(file.functions)}`}>
                    {file.functions.toFixed(1)}%
                  </span>
                </td>
                <td className="text-right p-3">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getCoverageColor(file.branches)}`}>
                    {file.branches.toFixed(1)}%
                  </span>
                </td>
                <td className="text-center p-3">
                  <button
                    onClick={() => onViewFile(file.file)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </button>
                  {file.uncoveredLines.length > 0 && (
                    <button
                      onClick={() => onViewFile(file.file, file.uncoveredLines[0])}
                      className="ml-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Uncovered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedFiles.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
            <div className="text-lg font-medium mb-2">No coverage data</div>
            <div className="text-sm">
              Run tests with coverage enabled to see detailed coverage information.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
