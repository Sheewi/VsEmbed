/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************************!*\
  !*** ./src/preload/preload.ts ***!
  \********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const electron_1 = __webpack_require__(/*! electron */ "electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Workspace operations
    createWorkspace: (name, template) => electron_1.ipcRenderer.invoke('workspace:create', name, template),
    openWorkspace: (path) => electron_1.ipcRenderer.invoke('workspace:open', path),
    exportWorkspace: (targetPath) => electron_1.ipcRenderer.invoke('workspace:export', targetPath),
    importWorkspace: (archivePath) => electron_1.ipcRenderer.invoke('workspace:import', archivePath),
    // AI operations
    processAIRequest: (userInput, context) => electron_1.ipcRenderer.invoke('ai:process-request', userInput, context),
    executeAIPlan: (planId) => electron_1.ipcRenderer.invoke('ai:execute-plan', planId),
    getAIModels: () => electron_1.ipcRenderer.invoke('ai:get-models'),
    setAIModel: (modelName) => electron_1.ipcRenderer.invoke('ai:set-model', modelName),
    // Runner operations
    startRunner: (config) => electron_1.ipcRenderer.invoke('runner:start', config),
    stopRunner: () => electron_1.ipcRenderer.invoke('runner:stop'),
    getRunnerStatus: () => electron_1.ipcRenderer.invoke('runner:status'),
    buildProject: (config) => electron_1.ipcRenderer.invoke('runner:build', config),
    // Secrets operations
    setSecret: (key, value) => electron_1.ipcRenderer.invoke('secrets:set', key, value),
    getSecret: (key, requester) => electron_1.ipcRenderer.invoke('secrets:get', key, requester),
    listSecrets: () => electron_1.ipcRenderer.invoke('secrets:list'),
    // Security operations
    requestApproval: (summary, riskLevel, details) => electron_1.ipcRenderer.invoke('security:request-approval', summary, riskLevel, details),
    logAction: (actionType, metadata, riskLevel) => electron_1.ipcRenderer.invoke('security:log-action', actionType, metadata, riskLevel),
    // VS Code Bridge operations
    executeVSCodeCommand: (command, args) => electron_1.ipcRenderer.invoke('vscode:execute-command', command, args),
    getFileContent: (filePath) => electron_1.ipcRenderer.invoke('vscode:get-file-content', filePath),
    writeFile: (filePath, content) => electron_1.ipcRenderer.invoke('vscode:write-file', filePath, content),
    getHoverInfo: (filePath, position) => electron_1.ipcRenderer.invoke('vscode:get-hover-info', filePath, position),
    getCompletions: (filePath, position) => electron_1.ipcRenderer.invoke('vscode:get-completions', filePath, position),
    getDefinitions: (filePath, position) => electron_1.ipcRenderer.invoke('vscode:get-definitions', filePath, position),
    getReferences: (filePath, position) => electron_1.ipcRenderer.invoke('vscode:get-references', filePath, position),
    // Extension operations
    recommendExtensions: (context) => electron_1.ipcRenderer.invoke('extensions:recommend', context),
    installExtension: (extensionId) => electron_1.ipcRenderer.invoke('extensions:install', extensionId),
    getExtensionInfo: (extensionId) => electron_1.ipcRenderer.invoke('extensions:get-info', extensionId),
    // Docker operations
    createSandbox: (extensionId, config) => electron_1.ipcRenderer.invoke('docker:create-sandbox', extensionId, config),
    stopSandbox: (containerId) => electron_1.ipcRenderer.invoke('docker:stop-sandbox', containerId),
    executeSandboxCommand: (containerId, command) => electron_1.ipcRenderer.invoke('docker:execute-command', containerId, command),
    getSandboxLogs: (containerId, tail) => electron_1.ipcRenderer.invoke('docker:get-logs', containerId, tail),
    listSandboxes: () => electron_1.ipcRenderer.invoke('docker:list-sandboxes'),
    getDockerMetrics: () => electron_1.ipcRenderer.invoke('docker:get-metrics'),
    // Performance operations
    getPerformanceMetrics: () => electron_1.ipcRenderer.invoke('performance:get-metrics'),
    generatePerformanceReport: () => electron_1.ipcRenderer.invoke('performance:generate-report'),
    getOptimizationRecommendations: () => electron_1.ipcRenderer.invoke('performance:get-recommendations'),
    forceGarbageCollection: () => electron_1.ipcRenderer.invoke('performance:force-gc'),
    // Permission operations
    checkPermission: (actor, resource, context) => electron_1.ipcRenderer.invoke('permissions:check', actor, resource, context),
    getPolicies: () => electron_1.ipcRenderer.invoke('permissions:get-policies'),
    updatePolicy: (policyId, updates) => electron_1.ipcRenderer.invoke('permissions:update-policy', policyId, updates),
    getAuditLog: (filters) => electron_1.ipcRenderer.invoke('permissions:get-audit-log', filters),
    // AI Streaming operations
    getAIStreamInfo: () => electron_1.ipcRenderer.invoke('ai-stream:get-connection-info'),
    // Event listeners
    onMenuAction: (callback) => {
        const wrappedCallback = (_event, data) => callback(data.type, data);
        electron_1.ipcRenderer.on('menu:new-workspace', wrappedCallback);
        electron_1.ipcRenderer.on('menu:settings', wrappedCallback);
        electron_1.ipcRenderer.on('ai:settings', wrappedCallback);
        electron_1.ipcRenderer.on('runner:start', wrappedCallback);
        electron_1.ipcRenderer.on('runner:stop', wrappedCallback);
        electron_1.ipcRenderer.on('runner:restart', wrappedCallback);
        electron_1.ipcRenderer.on('runner:view-logs', wrappedCallback);
        electron_1.ipcRenderer.on('security:manage-secrets', wrappedCallback);
        electron_1.ipcRenderer.on('security:view-audit-log', wrappedCallback);
        electron_1.ipcRenderer.on('security:settings', wrappedCallback);
        electron_1.ipcRenderer.on('performance:report', wrappedCallback);
        electron_1.ipcRenderer.on('docker:status', wrappedCallback);
        electron_1.ipcRenderer.on('permissions:audit', wrappedCallback);
        electron_1.ipcRenderer.on('workspace:open', wrappedCallback);
        electron_1.ipcRenderer.on('workspace:export', wrappedCallback);
        electron_1.ipcRenderer.on('permissions:denied', wrappedCallback);
        electron_1.ipcRenderer.on('permissions:audit-event', wrappedCallback);
        electron_1.ipcRenderer.on('vscode:extension-installed', wrappedCallback);
        electron_1.ipcRenderer.on('vscode:language-server-ready', wrappedCallback);
    },
    removeAllListeners: () => {
        electron_1.ipcRenderer.removeAllListeners('menu:new-workspace');
        electron_1.ipcRenderer.removeAllListeners('menu:settings');
        electron_1.ipcRenderer.removeAllListeners('ai:settings');
        electron_1.ipcRenderer.removeAllListeners('runner:start');
        electron_1.ipcRenderer.removeAllListeners('runner:stop');
        electron_1.ipcRenderer.removeAllListeners('runner:restart');
        electron_1.ipcRenderer.removeAllListeners('runner:view-logs');
        electron_1.ipcRenderer.removeAllListeners('security:manage-secrets');
        electron_1.ipcRenderer.removeAllListeners('security:view-audit-log');
        electron_1.ipcRenderer.removeAllListeners('security:settings');
        electron_1.ipcRenderer.removeAllListeners('performance:report');
        electron_1.ipcRenderer.removeAllListeners('docker:status');
        electron_1.ipcRenderer.removeAllListeners('permissions:audit');
        electron_1.ipcRenderer.removeAllListeners('workspace:open');
        electron_1.ipcRenderer.removeAllListeners('workspace:export');
        electron_1.ipcRenderer.removeAllListeners('permissions:denied');
        electron_1.ipcRenderer.removeAllListeners('permissions:audit-event');
        electron_1.ipcRenderer.removeAllListeners('vscode:extension-installed');
        electron_1.ipcRenderer.removeAllListeners('vscode:language-server-ready');
    }
});
// Expose app information
electron_1.contextBridge.exposeInMainWorld('appInfo', {
    name: 'VSEmbed AI DevTool',
    version: '0.1.0',
    platform: process.platform,
    arch: process.arch
});

})();

/******/ })()
;
//# sourceMappingURL=preload.js.map