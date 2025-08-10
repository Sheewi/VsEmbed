# AI-Powered Debug & Test Engine

A comprehensive debugging and testing system with AI-powered features for live test generation, smart breakpoints, and real-time variable analysis.

## Features

### 🐛 AI Debug Adapter
- **Smart Breakpoint Suggestions**: AI-powered analysis of code to suggest optimal breakpoint placement
- **Variable Anomaly Detection**: Real-time detection of unexpected variable behavior and type mismatches
- **Performance Monitoring**: Track CPU, memory, and execution time during debug sessions
- **Stack Trace Enhancement**: AI-enhanced stack trace analysis with suggestions and anomaly detection
- **Automatic Fix Suggestions**: AI-generated code fixes for common debugging issues

### 🧪 Live Test Engine
- **AI Test Generation**: Automatically generate unit, integration, and performance tests from source code
- **Multi-Framework Support**: Works with Jest, Mocha, Pytest, unittest, and more
- **Real-Time Execution**: Run tests as you type with instant feedback
- **File Watching**: Automatically re-run tests when source files change
- **Test Improvement**: AI analyzes failed tests and suggests improvements
- **Coverage Tracking**: Real-time code coverage analysis and reporting

### 🎯 Integrated Debug-Test Panel
- **Unified Interface**: Single panel for debugging and testing workflows
- **Live Metrics**: Real-time display of test results, coverage, and performance
- **Smart Suggestions**: AI-powered suggestions for both debugging and testing
- **Interactive Controls**: Start/stop debug sessions, run tests, generate new tests
- **WebSocket Communication**: Real-time updates between backend and UI

## Architecture

```
src/debug/
├── ai-debug-adapter.ts          # Core AI debugging functionality
├── live-test-engine.ts          # Test generation and execution engine
├── debug-test-manager.ts        # Session management and coordination
├── components/
│   ├── DebugTestPanel.tsx       # Main integrated UI panel
│   ├── DebugInspector.tsx       # Debug controls and variable inspection
│   └── LiveTestRunner.tsx       # Test execution and coverage UI
└── index.ts                     # Public API exports
```

## Usage

### Basic Integration

```typescript
import { getDebugTestManager, createDebugTestSession } from './debug';

// Create a new debug-test session
const sessionId = await createDebugTestSession('/path/to/workspace', 'src/app.js');

// Get the manager instance
const manager = getDebugTestManager();

// Start debugging
await manager.startDebug(sessionId, 'src/app.js', [
  { line: 10, condition: 'user.id === null' }
]);

// Generate and run AI tests
const results = await manager.generateTests(sessionId, 'src/app.js', 'javascript');
```

### React Component Usage

```tsx
import { DebugTestPanel } from './debug/components/DebugTestPanel';

function App() {
  return (
    <DebugTestPanel
      workspaceRoot="/path/to/workspace"
      activeFile="src/app.js"
      onTestRun={(results) => console.log('Tests completed:', results)}
      onDebugStart={(session) => console.log('Debug started:', session)}
    />
  );
}
```

## API Reference

### AIDebugAdapter

The core debugging functionality with AI-powered features:

```typescript
class AIDebugAdapter {
  // Suggest smart breakpoints based on code analysis
  async suggestBreakpoints(code: string): Promise<BreakpointSuggestion[]>

  // Analyze debug context and detect anomalies
  async analyzeStack(context: DebugContext): Promise<DebugAnalysis>

  // Suggest fixes for debugging issues
  async suggestFix(error: DebugError): Promise<DebugFix>

  // Detect variable anomalies in real-time
  async detectVariableAnomalies(variables: Variable[]): Promise<VariableAnomaly[]>
}
```

### LiveTestEngine

Test generation and execution with AI assistance:

```typescript
class LiveTestEngine {
  // Generate AI-powered tests for source code
  async generateAndRunTests(code: string, language: string): Promise<TestResult[]>

  // Run individual test cases
  async runTest(test: TestCase): Promise<TestResult>

  // Run entire test suites
  async runTestSuite(tests: TestCase[]): Promise<TestResult[]>

  // Enable file watching for auto-testing
  setupWatcher(): void
}
```

### DebugTestManager

Session management and coordination:

```typescript
class DebugTestManager {
  // Create new debug-test session
  async createSession(workspaceRoot: string, activeFile?: string): Promise<string>

  // Start debugging with smart breakpoints
  async startDebug(sessionId: string, file: string, breakpoints?: any[]): Promise<void>

  // Generate AI tests
  async generateTests(sessionId: string, file: string, language: string): Promise<any[]>

  // Run tests with live feedback
  async runTests(sessionId: string, testIds: string[]): Promise<any[]>
}
```

## Events

The system emits real-time events for UI integration:

```typescript
// Debug events
manager.on('debug-started', ({ sessionId, file }) => {});
manager.on('variable-anomaly-detected', ({ sessionId, anomaly }) => {});
manager.on('stack-trace-enhanced', ({ sessionId, analysis }) => {});

// Test events
manager.on('test-started', ({ sessionId, test }) => {});
manager.on('test-completed', ({ sessionId, result }) => {});
manager.on('tests-generated', ({ sessionId, file, results }) => {});

// AI suggestion events
manager.on('ai-suggestion', ({ sessionId, suggestion }) => {});
manager.on('test-improvement-suggested', ({ originalTest, improvedTest }) => {});
```

## Configuration

Default configuration for the debug-test system:

```typescript
const DEFAULT_CONFIG = {
  autoTest: true,           // Auto-run tests when files change
  watchFiles: true,         // Enable file watching
  smartBreakpoints: true,   // Enable AI breakpoint suggestions
  aiSuggestions: true,      // Enable AI-powered suggestions
  coverage: true,           // Enable code coverage tracking
  timeout: 30000,           // Test execution timeout (ms)
  frameworks: [             // Supported test frameworks
    'jest', 'mocha', 'pytest', 'unittest'
  ]
};
```

## Supported Languages & Frameworks

### Languages
- **JavaScript/TypeScript**: Full support with Jest/Mocha
- **Python**: Full support with pytest/unittest
- **Java**: Basic support with JUnit
- **C#**: Basic support with NUnit

### Test Frameworks
- **Jest**: Advanced support with coverage and mocking
- **Mocha**: Full support with custom reporters
- **Pytest**: Advanced support with fixtures and parametrization
- **unittest**: Basic Python testing support
- **Custom**: Extensible framework adapter system

## Performance

The debug-test engine is optimized for real-time performance:

- **Smart Caching**: AI model responses are cached for faster subsequent runs
- **Incremental Testing**: Only run tests affected by code changes
- **Background Processing**: Non-blocking test execution with WebSocket updates
- **Resource Monitoring**: Built-in performance tracking and optimization

## Extensibility

The system is designed to be highly extensible:

```typescript
// Add custom test framework
const customAdapter = new TestFrameworkAdapter('custom-framework', workspaceRoot);
engine.adapters.set('custom-framework', customAdapter);

// Add custom AI model
const customModel = new CustomAIModel();
debugAdapter.setModel(customModel);

// Add custom anomaly detector
const customDetector = new CustomAnomalyDetector();
debugAdapter.addAnomalyDetector(customDetector);
```

## Troubleshooting

### Common Issues

1. **AI Model Not Responding**
   - Check API key configuration
   - Verify network connectivity
   - Fallback to rule-based suggestions

2. **Test Framework Not Detected**
   - Ensure package.json or requirements.txt is present
   - Manually specify framework in configuration
   - Check supported framework list

3. **WebSocket Connection Failed**
   - Verify port 8080 is available
   - Check firewall settings
   - Enable fallback polling mode

### Debug Logging

Enable debug logging for troubleshooting:

```typescript
process.env.DEBUG = 'vsembed:debug-test*';
```

## License

This debug-test engine is part of the VSEmbed project and follows the same licensing terms.
