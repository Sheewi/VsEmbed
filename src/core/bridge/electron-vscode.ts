import { ipcMain, ipcRenderer } from 'electron';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';

export interface VSCodeCommand {
  command: string;
  title: string;
  category?: string;
  arguments?: any[];
}

export interface VSCodeExtension {
  id: string;
  displayName: string;
  description: string;
  version: string;
  publisher: string;
  isActive: boolean;
  packageJSON: any;
}

export class VSCodeBridge {
  private vscodeProcess: ChildProcess | null = null;
  private extensionHost: ChildProcess | null = null;
  private languageServers: Map<string, ChildProcess> = new Map();
  private isInitialized = false;

  static init() {
    const bridge = new VSCodeBridge();
    
    // Initialize IPC handlers
    ipcMain.handle('vscode-execute-command', async (_, command: string, ...args: any[]) => {
      return bridge.executeCommand(command, ...args);
    });

    ipcMain.handle('vscode-get-commands', async () => {
      return bridge.getAvailableCommands();
    });

    ipcMain.handle('vscode-get-extensions', async () => {
      return bridge.getInstalledExtensions();
    });

    ipcMain.handle('vscode-install-extension', async (_, extensionId: string) => {
      return bridge.installExtension(extensionId);
    });

    ipcMain.handle('vscode-start-language-server', async (_, language: string, workspaceUri: string) => {
      return bridge.startLanguageServer(language, workspaceUri);
    });

    ipcMain.handle('vscode-read-file', async (_, filePath: string) => {
      return bridge.readFile(filePath);
    });

    ipcMain.handle('vscode-write-file', async (_, filePath: string, content: string) => {
      return bridge.writeFile(filePath, content);
    });

    ipcMain.handle('vscode-workspace-symbol', async (_, query: string) => {
      return bridge.getWorkspaceSymbols(query);
    });

    ipcMain.handle('vscode-definition', async (_, uri: string, position: any) => {
      return bridge.getDefinition(uri, position);
    });

    ipcMain.handle('vscode-hover', async (_, uri: string, position: any) => {
      return bridge.getHover(uri, position);
    });

    ipcMain.handle('vscode-completion', async (_, uri: string, position: any) => {
      return bridge.getCompletion(uri, position);
    });

    return bridge;
  }

  async initialize(workspacePath: string): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Start VS Code server in headless mode
      await this.startVSCodeServer(workspacePath);
      
      // Initialize extension host
      await this.startExtensionHost(workspacePath);
      
      // Start core language servers
      await this.startCoreLanguageServers(workspacePath);
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize VS Code bridge:', error);
      throw error;
    }
  }

  private async startVSCodeServer(workspacePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const vscodeServerPath = path.join(__dirname, '../../node_modules/@vscode/server/bin/code-server');
      
      this.vscodeProcess = spawn(vscodeServerPath, [
        '--host', '127.0.0.1',
        '--port', '0', // Use any available port
        '--without-connection-token',
        '--accept-server-license-terms',
        '--disable-telemetry',
        '--disable-updates',
        '--disable-workspace-trust',
        workspacePath
      ], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          VSCODE_AGENT_FOLDER: path.join(__dirname, '../../.vscode-server')
        }
      });

      this.vscodeProcess.on('error', reject);
      
      this.vscodeProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        console.log('VS Code Server:', output);
        
        if (output.includes('Web UI available at')) {
          resolve();
        }
      });

      this.vscodeProcess.stderr?.on('data', (data) => {
        console.error('VS Code Server Error:', data.toString());
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        reject(new Error('VS Code server startup timeout'));
      }, 30000);
    });
  }

  private async startExtensionHost(workspacePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const extensionHostPath = path.join(__dirname, '../../extension-host/main.js');
      
      this.extensionHost = spawn('node', [
        extensionHostPath,
        '--port', '3002',
        '--workspace', workspacePath
      ], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.extensionHost.on('error', reject);
      
      this.extensionHost.stdout?.on('data', (data) => {
        const output = data.toString();
        console.log('Extension Host:', output);
        
        if (output.includes('Extension host ready')) {
          resolve();
        }
      });

      this.extensionHost.stderr?.on('data', (data) => {
        console.error('Extension Host Error:', data.toString());
      });

      setTimeout(() => {
        reject(new Error('Extension host startup timeout'));
      }, 15000);
    });
  }

  private async startCoreLanguageServers(workspacePath: string): Promise<void> {
    const languageServers = [
      { language: 'typescript', server: 'typescript-language-server', args: ['--stdio'] },
      { language: 'python', server: 'pylsp', args: [] },
      { language: 'json', server: 'vscode-json-languageserver', args: ['--stdio'] },
      { language: 'html', server: 'vscode-html-languageserver', args: ['--stdio'] },
      { language: 'css', server: 'vscode-css-languageserver', args: ['--stdio'] }
    ];

    for (const { language, server, args } of languageServers) {
      try {
        await this.startLanguageServer(language, workspacePath, server, args);
      } catch (error) {
        console.warn(`Failed to start ${language} language server:`, error);
      }
    }
  }

  async startLanguageServer(language: string, workspaceUri: string, serverCommand?: string, args?: string[]): Promise<boolean> {
    if (this.languageServers.has(language)) {
      return true; // Already running
    }

    try {
      const command = serverCommand || this.getDefaultLanguageServer(language);
      const serverArgs = args || ['--stdio'];

      const process = spawn(command, serverArgs, {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: workspaceUri
      });

      process.on('error', (error) => {
        console.error(`Language server error for ${language}:`, error);
        this.languageServers.delete(language);
      });

      process.stdout?.on('data', (data) => {
        // Handle language server responses
        this.handleLanguageServerMessage(language, data.toString());
      });

      this.languageServers.set(language, process);
      
      // Initialize the language server
      const initializeMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          processId: process.pid,
          rootUri: `file://${workspaceUri}`,
          capabilities: {
            textDocument: {
              synchronization: { dynamicRegistration: true },
              completion: { dynamicRegistration: true },
              hover: { dynamicRegistration: true },
              definition: { dynamicRegistration: true }
            },
            workspace: {
              symbol: { dynamicRegistration: true }
            }
          }
        }
      };

      process.stdin?.write(JSON.stringify(initializeMessage) + '\n');
      
      return true;
    } catch (error) {
      console.error(`Failed to start language server for ${language}:`, error);
      return false;
    }
  }

  private getDefaultLanguageServer(language: string): string {
    const serverMap: Record<string, string> = {
      'typescript': 'typescript-language-server',
      'javascript': 'typescript-language-server',
      'python': 'pylsp',
      'json': 'vscode-json-languageserver',
      'html': 'vscode-html-languageserver',
      'css': 'vscode-css-languageserver',
      'rust': 'rust-analyzer',
      'go': 'gopls'
    };

    return serverMap[language] || 'generic-language-server';
  }

  private handleLanguageServerMessage(language: string, message: string): void {
    try {
      const response = JSON.parse(message);
      
      // Forward language server responses to renderer process
      if (response.method) {
        ipcMain.emit('language-server-notification', {
          language,
          method: response.method,
          params: response.params
        });
      } else if (response.result || response.error) {
        ipcMain.emit('language-server-response', {
          language,
          id: response.id,
          result: response.result,
          error: response.error
        });
      }
    } catch (error) {
      console.error(`Failed to parse language server message for ${language}:`, error);
    }
  }

  async executeCommand(command: string, ...args: any[]): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('VS Code bridge not initialized');
    }

    try {
      // Map common VS Code commands to bridge implementations
      switch (command) {
        case 'vscode.open':
          return this.openFile(args[0]);
        
        case 'vscode.executeDefinitionProvider':
          return this.getDefinition(args[0], args[1]);
        
        case 'vscode.executeHoverProvider':
          return this.getHover(args[0], args[1]);
        
        case 'vscode.executeCompletionItemProvider':
          return this.getCompletion(args[0], args[1]);
        
        case 'workbench.action.files.save':
          return this.saveFile(args[0]);
        
        case 'editor.action.formatDocument':
          return this.formatDocument(args[0]);
        
        default:
          // Forward to extension host
          return this.executeExtensionCommand(command, ...args);
      }
    } catch (error) {
      console.error(`Failed to execute command ${command}:`, error);
      throw error;
    }
  }

  async getAvailableCommands(): Promise<VSCodeCommand[]> {
    // Return list of available VS Code commands
    return [
      { command: 'vscode.open', title: 'Open File' },
      { command: 'workbench.action.files.save', title: 'Save File' },
      { command: 'editor.action.formatDocument', title: 'Format Document' },
      { command: 'workbench.action.terminal.new', title: 'New Terminal' },
      { command: 'workbench.action.debug.start', title: 'Start Debugging' },
      { command: 'workbench.action.tasks.runTask', title: 'Run Task' }
    ];
  }

  async getInstalledExtensions(): Promise<VSCodeExtension[]> {
    // Return list of installed extensions
    return [
      {
        id: 'ms-python.python',
        displayName: 'Python',
        description: 'Python language support',
        version: '2024.0.0',
        publisher: 'ms-python',
        isActive: true,
        packageJSON: {}
      },
      {
        id: 'esbenp.prettier-vscode',
        displayName: 'Prettier',
        description: 'Code formatter',
        version: '10.1.0',
        publisher: 'esbenp',
        isActive: true,
        packageJSON: {}
      }
    ];
  }

  async installExtension(extensionId: string): Promise<boolean> {
    try {
      // Simulate extension installation
      console.log(`Installing extension: ${extensionId}`);
      
      // In a real implementation, this would download and install the extension
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (error) {
      console.error(`Failed to install extension ${extensionId}:`, error);
      return false;
    }
  }

  async readFile(filePath: string): Promise<string> {
    const fs = require('fs').promises;
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error}`);
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    const fs = require('fs').promises;
    try {
      await fs.writeFile(filePath, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error}`);
    }
  }

  async openFile(uri: string): Promise<void> {
    // Implementation for opening files
    console.log(`Opening file: ${uri}`);
  }

  async saveFile(uri: string): Promise<void> {
    // Implementation for saving files
    console.log(`Saving file: ${uri}`);
  }

  async formatDocument(uri: string): Promise<any> {
    // Implementation for formatting documents
    console.log(`Formatting document: ${uri}`);
    return { formatted: true };
  }

  async getDefinition(uri: string, position: any): Promise<any> {
    const language = this.detectLanguageFromUri(uri);
    const server = this.languageServers.get(language);
    
    if (!server) {
      return null;
    }

    // Send definition request to language server
    const request = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'textDocument/definition',
      params: {
        textDocument: { uri },
        position
      }
    };

    return this.sendLanguageServerRequest(language, request);
  }

  async getHover(uri: string, position: any): Promise<any> {
    const language = this.detectLanguageFromUri(uri);
    const server = this.languageServers.get(language);
    
    if (!server) {
      return null;
    }

    const request = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'textDocument/hover',
      params: {
        textDocument: { uri },
        position
      }
    };

    return this.sendLanguageServerRequest(language, request);
  }

  async getCompletion(uri: string, position: any): Promise<any> {
    const language = this.detectLanguageFromUri(uri);
    const server = this.languageServers.get(language);
    
    if (!server) {
      return null;
    }

    const request = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'textDocument/completion',
      params: {
        textDocument: { uri },
        position
      }
    };

    return this.sendLanguageServerRequest(language, request);
  }

  async getWorkspaceSymbols(query: string): Promise<any> {
    // Get symbols from all active language servers
    const results = [];
    
    for (const [language, server] of this.languageServers) {
      const request = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'workspace/symbol',
        params: { query }
      };

      try {
        const result = await this.sendLanguageServerRequest(language, request);
        if (result) {
          results.push(...result);
        }
      } catch (error) {
        console.warn(`Symbol search failed for ${language}:`, error);
      }
    }

    return results;
  }

  private async sendLanguageServerRequest(language: string, request: any): Promise<any> {
    const server = this.languageServers.get(language);
    if (!server) {
      throw new Error(`Language server not available for ${language}`);
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Language server request timeout'));
      }, 5000);

      const handler = (response: any) => {
        if (response.id === request.id) {
          clearTimeout(timeout);
          ipcMain.off('language-server-response', handler);
          
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.result);
          }
        }
      };

      ipcMain.on('language-server-response', handler);
      
      try {
        server.stdin?.write(JSON.stringify(request) + '\n');
      } catch (error) {
        clearTimeout(timeout);
        ipcMain.off('language-server-response', handler);
        reject(error);
      }
    });
  }

  private detectLanguageFromUri(uri: string): string {
    const extension = path.extname(uri).toLowerCase();
    const languageMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.py': 'python',
      '.json': 'json',
      '.html': 'html',
      '.css': 'css',
      '.rs': 'rust',
      '.go': 'go'
    };

    return languageMap[extension] || 'plaintext';
  }

  private async executeExtensionCommand(command: string, ...args: any[]): Promise<any> {
    // Forward command to extension host
    return new Promise((resolve, reject) => {
      const requestId = Date.now();
      
      const timeout = setTimeout(() => {
        reject(new Error('Extension command timeout'));
      }, 10000);

      const handler = (response: any) => {
        if (response.id === requestId) {
          clearTimeout(timeout);
          ipcMain.off('extension-response', handler);
          
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response.result);
          }
        }
      };

      ipcMain.on('extension-response', handler);

      // Send command to extension host
      if (this.extensionHost && this.extensionHost.stdin) {
        const message = JSON.stringify({
          id: requestId,
          command,
          args
        });
        
        this.extensionHost.stdin.write(message + '\n');
      } else {
        clearTimeout(timeout);
        ipcMain.off('extension-response', handler);
        reject(new Error('Extension host not available'));
      }
    });
  }

  async shutdown(): Promise<void> {
    console.log('Shutting down VS Code bridge...');

    // Stop language servers
    for (const [language, server] of this.languageServers) {
      try {
        server.kill('SIGTERM');
      } catch (error) {
        console.error(`Failed to stop ${language} language server:`, error);
      }
    }
    this.languageServers.clear();

    // Stop extension host
    if (this.extensionHost) {
      try {
        this.extensionHost.kill('SIGTERM');
      } catch (error) {
        console.error('Failed to stop extension host:', error);
      }
      this.extensionHost = null;
    }

    // Stop VS Code server
    if (this.vscodeProcess) {
      try {
        this.vscodeProcess.kill('SIGTERM');
      } catch (error) {
        console.error('Failed to stop VS Code server:', error);
      }
      this.vscodeProcess = null;
    }

    this.isInitialized = false;
  }
}

// Renderer process API
export class VSCodeBridgeRenderer {
  static async executeCommand(command: string, ...args: any[]): Promise<any> {
    return ipcRenderer.invoke('vscode-execute-command', command, ...args);
  }

  static async getCommands(): Promise<VSCodeCommand[]> {
    return ipcRenderer.invoke('vscode-get-commands');
  }

  static async getExtensions(): Promise<VSCodeExtension[]> {
    return ipcRenderer.invoke('vscode-get-extensions');
  }

  static async installExtension(extensionId: string): Promise<boolean> {
    return ipcRenderer.invoke('vscode-install-extension', extensionId);
  }

  static async readFile(filePath: string): Promise<string> {
    return ipcRenderer.invoke('vscode-read-file', filePath);
  }

  static async writeFile(filePath: string, content: string): Promise<void> {
    return ipcRenderer.invoke('vscode-write-file', filePath, content);
  }

  static async getDefinition(uri: string, position: any): Promise<any> {
    return ipcRenderer.invoke('vscode-definition', uri, position);
  }

  static async getHover(uri: string, position: any): Promise<any> {
    return ipcRenderer.invoke('vscode-hover', uri, position);
  }

  static async getCompletion(uri: string, position: any): Promise<any> {
    return ipcRenderer.invoke('vscode-completion', uri, position);
  }

  static async getWorkspaceSymbols(query: string): Promise<any> {
    return ipcRenderer.invoke('vscode-workspace-symbol', query);
  }
}
