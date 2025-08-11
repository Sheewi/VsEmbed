import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Workspace operations
  createWorkspace: (name: string, template?: string) => 
    ipcRenderer.invoke('workspace:create', name, template),
  openWorkspace: (path: string) => 
    ipcRenderer.invoke('workspace:open', path),
  exportWorkspace: (targetPath: string) => 
    ipcRenderer.invoke('workspace:export', targetPath),
  importWorkspace: (archivePath: string) => 
    ipcRenderer.invoke('workspace:import', archivePath),

  // AI operations
  processAIRequest: (userInput: string, context?: any) => 
    ipcRenderer.invoke('ai:process-request', userInput, context),
  executeAIPlan: (planId: string) => 
    ipcRenderer.invoke('ai:execute-plan', planId),
  getAIModels: () => 
    ipcRenderer.invoke('ai:get-models'),
  setAIModel: (modelName: string) => 
    ipcRenderer.invoke('ai:set-model', modelName),

  // Runner operations
  startRunner: (config?: any) => 
    ipcRenderer.invoke('runner:start', config),
  stopRunner: () => 
    ipcRenderer.invoke('runner:stop'),
  getRunnerStatus: () => 
    ipcRenderer.invoke('runner:status'),
  buildProject: (config?: any) => 
    ipcRenderer.invoke('runner:build', config),

  // Secrets operations
  setSecret: (key: string, value: string) => 
    ipcRenderer.invoke('secrets:set', key, value),
  getSecret: (key: string, requester: 'user' | 'ai') => 
    ipcRenderer.invoke('secrets:get', key, requester),
  listSecrets: () => 
    ipcRenderer.invoke('secrets:list'),

  // Security operations
  requestApproval: (summary: string, riskLevel: string, details?: any) => 
    ipcRenderer.invoke('security:request-approval', summary, riskLevel, details),
  logAction: (actionType: string, metadata: any, riskLevel?: string) => 
    ipcRenderer.invoke('security:log-action', actionType, metadata, riskLevel),

  // VS Code Bridge operations
  executeVSCodeCommand: (command: string, args?: any[]) => 
    ipcRenderer.invoke('vscode:execute-command', command, args),
  getFileContent: (filePath: string) => 
    ipcRenderer.invoke('vscode:get-file-content', filePath),
  writeFile: (filePath: string, content: string) => 
    ipcRenderer.invoke('vscode:write-file', filePath, content),
  getHoverInfo: (filePath: string, position: any) => 
    ipcRenderer.invoke('vscode:get-hover-info', filePath, position),
  getCompletions: (filePath: string, position: any) => 
    ipcRenderer.invoke('vscode:get-completions', filePath, position),
  getDefinitions: (filePath: string, position: any) => 
    ipcRenderer.invoke('vscode:get-definitions', filePath, position),
  getReferences: (filePath: string, position: any) => 
    ipcRenderer.invoke('vscode:get-references', filePath, position),

  // Extension operations
  recommendExtensions: (context: any) => 
    ipcRenderer.invoke('extensions:recommend', context),
  installExtension: (extensionId: string) => 
    ipcRenderer.invoke('extensions:install', extensionId),
  getExtensionInfo: (extensionId: string) => 
    ipcRenderer.invoke('extensions:get-info', extensionId),

  // Docker operations
  createSandbox: (extensionId: string, config?: any) => 
    ipcRenderer.invoke('docker:create-sandbox', extensionId, config),
  stopSandbox: (containerId: string) => 
    ipcRenderer.invoke('docker:stop-sandbox', containerId),
  executeSandboxCommand: (containerId: string, command: string[]) => 
    ipcRenderer.invoke('docker:execute-command', containerId, command),
  getSandboxLogs: (containerId: string, tail?: number) => 
    ipcRenderer.invoke('docker:get-logs', containerId, tail),
  listSandboxes: () => 
    ipcRenderer.invoke('docker:list-sandboxes'),
  getDockerMetrics: () => 
    ipcRenderer.invoke('docker:get-metrics'),

  // Performance operations
  getPerformanceMetrics: () => 
    ipcRenderer.invoke('performance:get-metrics'),
  generatePerformanceReport: () => 
    ipcRenderer.invoke('performance:generate-report'),
  getOptimizationRecommendations: () => 
    ipcRenderer.invoke('performance:get-recommendations'),
  forceGarbageCollection: () => 
    ipcRenderer.invoke('performance:force-gc'),

  // Permission operations
  checkPermission: (actor: string, resource: string, context?: any) => 
    ipcRenderer.invoke('permissions:check', actor, resource, context),
  getPolicies: () => 
    ipcRenderer.invoke('permissions:get-policies'),
  updatePolicy: (policyId: string, updates: any) => 
    ipcRenderer.invoke('permissions:update-policy', policyId, updates),
  getAuditLog: (filters?: any) => 
    ipcRenderer.invoke('permissions:get-audit-log', filters),

  // AI Streaming operations
  getAIStreamInfo: () => 
    ipcRenderer.invoke('ai-stream:get-connection-info'),

  // Event listeners
  onMenuAction: (callback: (event: string, data?: any) => void) => {
    const wrappedCallback = (_event: any, data: any) => callback(data.type, data);
    ipcRenderer.on('menu:new-workspace', wrappedCallback);
    ipcRenderer.on('menu:settings', wrappedCallback);
    ipcRenderer.on('ai:settings', wrappedCallback);
    ipcRenderer.on('runner:start', wrappedCallback);
    ipcRenderer.on('runner:stop', wrappedCallback);
    ipcRenderer.on('runner:restart', wrappedCallback);
    ipcRenderer.on('runner:view-logs', wrappedCallback);
    ipcRenderer.on('security:manage-secrets', wrappedCallback);
    ipcRenderer.on('security:view-audit-log', wrappedCallback);
    ipcRenderer.on('security:settings', wrappedCallback);
    ipcRenderer.on('performance:report', wrappedCallback);
    ipcRenderer.on('docker:status', wrappedCallback);
    ipcRenderer.on('permissions:audit', wrappedCallback);
    ipcRenderer.on('workspace:open', wrappedCallback);
    ipcRenderer.on('workspace:export', wrappedCallback);
    ipcRenderer.on('permissions:denied', wrappedCallback);
    ipcRenderer.on('permissions:audit-event', wrappedCallback);
    ipcRenderer.on('vscode:extension-installed', wrappedCallback);
    ipcRenderer.on('vscode:language-server-ready', wrappedCallback);
  },

  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('menu:new-workspace');
    ipcRenderer.removeAllListeners('menu:settings');
    ipcRenderer.removeAllListeners('ai:settings');
    ipcRenderer.removeAllListeners('runner:start');
    ipcRenderer.removeAllListeners('runner:stop');
    ipcRenderer.removeAllListeners('runner:restart');
    ipcRenderer.removeAllListeners('runner:view-logs');
    ipcRenderer.removeAllListeners('security:manage-secrets');
    ipcRenderer.removeAllListeners('security:view-audit-log');
    ipcRenderer.removeAllListeners('security:settings');
    ipcRenderer.removeAllListeners('performance:report');
    ipcRenderer.removeAllListeners('docker:status');
    ipcRenderer.removeAllListeners('permissions:audit');
    ipcRenderer.removeAllListeners('workspace:open');
    ipcRenderer.removeAllListeners('workspace:export');
    ipcRenderer.removeAllListeners('permissions:denied');
    ipcRenderer.removeAllListeners('permissions:audit-event');
    ipcRenderer.removeAllListeners('vscode:extension-installed');
    ipcRenderer.removeAllListeners('vscode:language-server-ready');
  }
});

// Expose app information
contextBridge.exposeInMainWorld('appInfo', {
  name: 'VSEmbed AI DevTool',
  version: '0.1.0',
  platform: process.platform,
  arch: process.arch
});
