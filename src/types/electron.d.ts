export interface ElectronAPI {
  // Workspace operations
  createWorkspace: (name: string, template?: string) => Promise<any>;
  openWorkspace: (path: string) => Promise<any>;
  exportWorkspace: (targetPath: string) => Promise<any>;
  importWorkspace: (archivePath: string) => Promise<any>;

  // AI operations
  processAIRequest: (userInput: string, context?: any) => Promise<any>;
  executeAIPlan: (planId: string) => Promise<any>;
  getAIModels: () => Promise<any>;
  setAIModel: (modelName: string) => Promise<any>;

  // Runner operations
  startRunner: (config?: any) => Promise<any>;
  stopRunner: () => Promise<any>;
  getRunnerStatus: () => Promise<any>;
  buildProject: (config?: any) => Promise<any>;

  // Secrets operations
  setSecret: (key: string, value: string) => Promise<any>;
  getSecret: (key: string, requester: 'user' | 'ai') => Promise<any>;
  listSecrets: () => Promise<any>;

  // Security operations
  requestApproval: (summary: string, riskLevel: string, details?: any) => Promise<any>;
  logAction: (actionType: string, metadata: any, riskLevel?: string) => Promise<any>;

  // VS Code Bridge operations
  executeVSCodeCommand: (command: string, args?: any[]) => Promise<any>;
  getFileContent: (filePath: string) => Promise<any>;
  writeFile: (filePath: string, content: string) => Promise<any>;
  getHoverInfo: (filePath: string, position: any) => Promise<any>;
  getCompletions: (filePath: string, position: any) => Promise<any>;
  getDefinitions: (filePath: string, position: any) => Promise<any>;
  getReferences: (filePath: string, position: any) => Promise<any>;

  // Extension operations
  recommendExtensions: (context: any) => Promise<any>;
  installExtension: (extensionId: string) => Promise<any>;
  getExtensionInfo: (extensionId: string) => Promise<any>;

  // Docker operations
  createSandbox: (extensionId: string, config?: any) => Promise<any>;
  stopSandbox: (containerId: string) => Promise<any>;
  executeSandboxCommand: (containerId: string, command: string[]) => Promise<any>;
  getSandboxLogs: (containerId: string, tail?: number) => Promise<any>;
  listSandboxes: () => Promise<any>;
  getDockerMetrics: () => Promise<any>;

  // Performance operations
  getPerformanceMetrics: () => Promise<any>;
  generatePerformanceReport: () => Promise<any>;
  getOptimizationRecommendations: () => Promise<any>;
  forceGarbageCollection: () => Promise<any>;

  // Permission operations
  checkPermission: (actor: string, resource: string, context?: any) => Promise<any>;
  getPolicies: () => Promise<any>;
  updatePolicy: (policyId: string, updates: any) => Promise<any>;
  getAuditLog: (filters?: any) => Promise<any>;

  // AI Streaming operations
  getAIStreamInfo: () => Promise<any>;

  // Event listeners
  onMenuAction: (callback: (event: string, data?: any) => void) => void;
  removeAllListeners: () => void;
}

export interface AppInfo {
  name: string;
  version: string;
  platform: string;
  arch: string;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    appInfo: AppInfo;
  }
}
