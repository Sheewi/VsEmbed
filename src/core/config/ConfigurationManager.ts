import { Storage } from '@google-cloud/storage';
import { EventEmitter } from 'events';
import archiver from 'archiver';

export interface GrokConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface GoogleCloudConfig {
  projectId: string;
  keyFilename: string;
  bucketName: string;
  region: string;
}

export interface VSCodeSettings {
  theme: 'dark' | 'light' | 'high-contrast';
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: 'on' | 'off' | 'wordWrapColumn';
  lineNumbers: 'on' | 'off' | 'relative';
  minimap: {
    enabled: boolean;
    side: 'left' | 'right';
    size: 'proportional' | 'fill' | 'fit';
  };
  explorer: {
    confirmDelete: boolean;
    confirmDragAndDrop: boolean;
    sortOrder: 'default' | 'mixed' | 'filesFirst' | 'type' | 'modified';
  };
  git: {
    enabled: boolean;
    autoFetch: boolean;
    autoPush: boolean;
    confirmSync: boolean;
  };
  terminal: {
    shell: {
      linux: string;
      osx: string;
      windows: string;
    };
    fontSize: number;
    fontFamily: string;
    cursorStyle: 'block' | 'line' | 'underline';
  };
  search: {
    exclude: Record<string, boolean>;
    useRipgrep: boolean;
    smartCase: boolean;
  };
  extensions: {
    autoUpdate: boolean;
    autoCheckUpdates: boolean;
    ignoreRecommendations: boolean;
  };
}

export interface VsEmbedConfig {
  grok: GrokConfig;
  googleCloud: GoogleCloudConfig;
  vscode: VSCodeSettings;
  workspace: {
    autoSave: 'off' | 'onFocusChange' | 'onWindowChange' | 'afterDelay';
    autoSaveDelay: number;
    backupLocation: string;
    syncSettings: boolean;
  };
  ai: {
    enableCodeCompletion: boolean;
    enableChatAssistant: boolean;
    enableCodeReview: boolean;
    enableDocGeneration: boolean;
    contextWindow: number;
    maxConcurrentRequests: number;
  };
  security: {
    enableSandbox: boolean;
    allowedDomains: string[];
    dataEncryption: boolean;
    auditLogging: boolean;
  };
}

export class ConfigurationManager extends EventEmitter {
  private config: VsEmbedConfig;
  private storage!: Storage;
  private configPath: string;
  private cloudSyncEnabled: boolean = true;

  constructor() {
    super();
    this.configPath = this.getConfigPath();
    this.config = this.getDefaultConfig();
    this.initializeGoogleCloudStorage();
  }

  private getConfigPath(): string {
    const os = require('os');
    const path = require('path');
    return path.join(os.homedir(), '.vsembed', 'config.json');
  }

  private getDefaultConfig(): VsEmbedConfig {
    return {
      grok: {
        apiKey: process.env.GROK_API_KEY || '',
        baseUrl: 'https://api.x.ai/v1',
        model: 'grok-beta',
        temperature: 0.7,
        maxTokens: 4096,
        topP: 0.9,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
      },
      googleCloud: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || '',
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
        bucketName: process.env.GCS_BUCKET_NAME || 'vsembed-storage',
        region: 'us-central1',
      },
      vscode: {
        theme: 'dark',
        fontSize: 14,
        fontFamily: "'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
        tabSize: 2,
        insertSpaces: true,
        wordWrap: 'on',
        lineNumbers: 'on',
        minimap: {
          enabled: true,
          side: 'right',
          size: 'proportional',
        },
        explorer: {
          confirmDelete: true,
          confirmDragAndDrop: true,
          sortOrder: 'default',
        },
        git: {
          enabled: true,
          autoFetch: true,
          autoPush: false,
          confirmSync: true,
        },
        terminal: {
          shell: {
            linux: '/bin/bash',
            osx: '/bin/zsh',
            windows: 'powershell.exe',
          },
          fontSize: 12,
          fontFamily: "'Fira Code', 'SF Mono', Monaco, Consolas, monospace",
          cursorStyle: 'block',
        },
        search: {
          exclude: {
            '**/node_modules': true,
            '**/bower_components': true,
            '**/*.code-search': true,
            '**/dist': true,
            '**/build': true,
            '**/.git': true,
            '**/.DS_Store': true,
          },
          useRipgrep: true,
          smartCase: true,
        },
        extensions: {
          autoUpdate: false,
          autoCheckUpdates: true,
          ignoreRecommendations: false,
        },
      },
      workspace: {
        autoSave: 'afterDelay',
        autoSaveDelay: 1000,
        backupLocation: 'cloud',
        syncSettings: true,
      },
      ai: {
        enableCodeCompletion: true,
        enableChatAssistant: true,
        enableCodeReview: true,
        enableDocGeneration: true,
        contextWindow: 8192,
        maxConcurrentRequests: 3,
      },
      security: {
        enableSandbox: true,
        allowedDomains: ['*.x.ai', '*.googleapis.com', '*.github.com'],
        dataEncryption: true,
        auditLogging: true,
      },
    };
  }

  private async initializeGoogleCloudStorage(): Promise<void> {
    try {
      this.storage = new Storage({
        projectId: this.config.googleCloud.projectId,
        keyFilename: this.config.googleCloud.keyFilename,
      });

      // Test connection
      await this.storage.getBuckets();
      this.emit('cloudStorageConnected');
    } catch (error) {
      console.warn('Google Cloud Storage not available:', error);
      this.cloudSyncEnabled = false;
      this.emit('cloudStorageError', error);
    }
  }

  async loadConfig(): Promise<VsEmbedConfig> {
    try {
      // Try to load from cloud first
      if (this.cloudSyncEnabled) {
        const cloudConfig = await this.loadFromCloud();
        if (cloudConfig) {
          this.config = { ...this.config, ...cloudConfig };
          await this.saveToLocal();
        }
      }

      // Fallback to local config
      const localConfig = await this.loadFromLocal();
      if (localConfig) {
        this.config = { ...this.config, ...localConfig };
      }

      this.emit('configLoaded', this.config);
      return this.config;
    } catch (error) {
      console.error('Failed to load config:', error);
      this.emit('configError', error);
      return this.config;
    }
  }

  async saveConfig(config: Partial<VsEmbedConfig>): Promise<void> {
    this.config = { ...this.config, ...config };

    try {
      // Save to local first
      await this.saveToLocal();

      // Sync to cloud if enabled
      if (this.cloudSyncEnabled && this.config.workspace.syncSettings) {
        await this.saveToCloud();
      }

      this.emit('configSaved', this.config);
    } catch (error) {
      console.error('Failed to save config:', error);
      this.emit('configError', error);
      throw error;
    }
  }

  private async loadFromLocal(): Promise<Partial<VsEmbedConfig> | null> {
    const fs = require('fs').promises;
    const path = require('path');

    try {
      const configDir = path.dirname(this.configPath);
      await fs.mkdir(configDir, { recursive: true });

      const data = await fs.readFile(this.configPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code !== 'ENOENT') {
        console.error('Error reading local config:', error);
      }
      return null;
    }
  }

  private async saveToLocal(): Promise<void> {
    const fs = require('fs').promises;
    const path = require('path');

    const configDir = path.dirname(this.configPath);
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
  }

  private async loadFromCloud(): Promise<Partial<VsEmbedConfig> | null> {
    if (!this.cloudSyncEnabled) return null;

    try {
      const bucket = this.storage.bucket(this.config.googleCloud.bucketName);
      const file = bucket.file('vsembed-config.json');
      
      const [exists] = await file.exists();
      if (!exists) return null;

      const [data] = await file.download();
      return JSON.parse(data.toString());
    } catch (error) {
      console.error('Error loading from cloud:', error);
      return null;
    }
  }

  private async saveToCloud(): Promise<void> {
    if (!this.cloudSyncEnabled) return;

    try {
      const bucket = this.storage.bucket(this.config.googleCloud.bucketName);
      const file = bucket.file('vsembed-config.json');
      
      await file.save(JSON.stringify(this.config, null, 2), {
        metadata: {
          contentType: 'application/json',
          metadata: {
            lastModified: new Date().toISOString(),
            version: '1.0.0',
          },
        },
      });
    } catch (error) {
      console.error('Error saving to cloud:', error);
      throw error;
    }
  }

  getConfig(): VsEmbedConfig {
    return { ...this.config };
  }

  getGrokConfig(): GrokConfig {
    return { ...this.config.grok };
  }

  getVSCodeSettings(): VSCodeSettings {
    return { ...this.config.vscode };
  }

  getGoogleCloudConfig(): GoogleCloudConfig {
    return { ...this.config.googleCloud };
  }

  updateGrokConfig(config: Partial<GrokConfig>): Promise<void> {
    return this.saveConfig({ grok: { ...this.config.grok, ...config } });
  }

  updateVSCodeSettings(settings: Partial<VSCodeSettings>): Promise<void> {
    return this.saveConfig({ vscode: { ...this.config.vscode, ...settings } });
  }

  updateGoogleCloudConfig(config: Partial<GoogleCloudConfig>): Promise<void> {
    return this.saveConfig({ googleCloud: { ...this.config.googleCloud, ...config } });
  }

  // VS Code settings integration
  applyVSCodeSettings(): void {
    const settings = this.config.vscode;
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Apply font settings
    document.documentElement.style.setProperty('--vscode-font-family', settings.fontFamily);
    document.documentElement.style.setProperty('--vscode-font-size', `${settings.fontSize}px`);
    
    // Apply terminal settings
    document.documentElement.style.setProperty('--terminal-font-family', settings.terminal.fontFamily);
    document.documentElement.style.setProperty('--terminal-font-size', `${settings.terminal.fontSize}px`);
    
    this.emit('vscodeSettingsApplied', settings);
  }

  // Cloud workspace synchronization
  async syncWorkspaceToCloud(workspacePath: string): Promise<void> {
    if (!this.cloudSyncEnabled) {
      throw new Error('Cloud storage not available');
    }

    const fs = require('fs').promises;
    const path = require('path');
    const stream = require('stream');

    try {
      const bucket = this.storage.bucket(this.config.googleCloud.bucketName);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const archiveName = `workspace-backup-${timestamp}.zip`;
      
      // Create archive stream
      const archive = archiver('zip', { zlib: { level: 9 } });
      const passThrough = new stream.PassThrough();
      
      archive.pipe(passThrough);
      
      // Add workspace files to archive
      await this.addDirectoryToArchive(archive, workspacePath, '');
      
      archive.finalize();
      
      // Upload to cloud
      const file = bucket.file(`workspaces/${archiveName}`);
      const uploadStream = file.createWriteStream({
        metadata: {
          contentType: 'application/zip',
          metadata: {
            workspacePath,
            timestamp,
            vsembedVersion: '1.0.0',
          },
        },
      });
      
      passThrough.pipe(uploadStream);
      
      await new Promise((resolve, reject) => {
        uploadStream.on('error', reject);
        uploadStream.on('finish', resolve);
      });
      
      this.emit('workspaceSynced', { archiveName, workspacePath });
    } catch (error) {
      console.error('Error syncing workspace to cloud:', error);
      this.emit('syncError', error);
      throw error;
    }
  }

  private async addDirectoryToArchive(archive: any, dirPath: string, archivePath: string): Promise<void> {
    const fs = require('fs').promises;
    const path = require('path');

    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const entryArchivePath = path.join(archivePath, entry.name);
      
      if (entry.isDirectory()) {
        if (!this.shouldIgnoreDirectory(entry.name)) {
          await this.addDirectoryToArchive(archive, fullPath, entryArchivePath);
        }
      } else {
        if (!this.shouldIgnoreFile(entry.name)) {
          archive.file(fullPath, { name: entryArchivePath });
        }
      }
    }
  }

  private shouldIgnoreDirectory(name: string): boolean {
    const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', 'coverage'];
    return ignoreDirs.includes(name) || name.startsWith('.');
  }

  private shouldIgnoreFile(name: string): boolean {
    const ignoreFiles = ['.DS_Store', 'Thumbs.db', '*.log', '*.tmp'];
    return ignoreFiles.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(name);
      }
      return name === pattern;
    });
  }

  async listCloudWorkspaces(): Promise<Array<{ name: string; timestamp: string; size: number }>> {
    if (!this.cloudSyncEnabled) {
      throw new Error('Cloud storage not available');
    }

    try {
      const bucket = this.storage.bucket(this.config.googleCloud.bucketName);
      const [files] = await bucket.getFiles({ prefix: 'workspaces/' });
      
      return files.map(file => ({
        name: file.name,
        timestamp: String(file.metadata.metadata?.timestamp || ''),
        size: typeof file.metadata.size === 'string' ? parseInt(file.metadata.size) : Number(file.metadata.size || 0),
      }));
    } catch (error) {
      console.error('Error listing cloud workspaces:', error);
      throw error;
    }
  }

  async exportSettings(): Promise<string> {
    return JSON.stringify(this.config, null, 2);
  }

  async importSettings(settingsJson: string): Promise<void> {
    try {
      const importedConfig = JSON.parse(settingsJson);
      await this.saveConfig(importedConfig);
      this.applyVSCodeSettings();
    } catch (error) {
      console.error('Error importing settings:', error);
      throw new Error('Invalid settings format');
    }
  }

  // Migration support
  async migrateFromVSCode(): Promise<void> {
    try {
      const os = require('os');
      const path = require('path');
      const fs = require('fs').promises;
      
      let vscodeConfigPath: string;
      
      if (process.platform === 'win32') {
        vscodeConfigPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Code', 'User', 'settings.json');
      } else if (process.platform === 'darwin') {
        vscodeConfigPath = path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User', 'settings.json');
      } else {
        vscodeConfigPath = path.join(os.homedir(), '.config', 'Code', 'User', 'settings.json');
      }
      
      const vscodeSettings = JSON.parse(await fs.readFile(vscodeConfigPath, 'utf8'));
      
      // Map VS Code settings to VsEmbed format
      const mappedSettings = this.mapVSCodeSettings(vscodeSettings);
      await this.updateVSCodeSettings(mappedSettings);
      
      this.emit('vscodeSettingsMigrated', mappedSettings);
    } catch (error) {
      console.error('Error migrating VS Code settings:', error);
      this.emit('migrationError', error);
    }
  }

  private mapVSCodeSettings(vscodeSettings: any): Partial<VSCodeSettings> {
    const mapped: Partial<VSCodeSettings> = {};
    
    if (vscodeSettings['workbench.colorTheme']) {
      mapped.theme = vscodeSettings['workbench.colorTheme'].includes('Light') ? 'light' : 'dark';
    }
    
    if (vscodeSettings['editor.fontSize']) {
      mapped.fontSize = vscodeSettings['editor.fontSize'];
    }
    
    if (vscodeSettings['editor.fontFamily']) {
      mapped.fontFamily = vscodeSettings['editor.fontFamily'];
    }
    
    if (vscodeSettings['editor.tabSize']) {
      mapped.tabSize = vscodeSettings['editor.tabSize'];
    }
    
    if (vscodeSettings['editor.insertSpaces']) {
      mapped.insertSpaces = vscodeSettings['editor.insertSpaces'];
    }
    
    if (vscodeSettings['editor.wordWrap']) {
      mapped.wordWrap = vscodeSettings['editor.wordWrap'];
    }
    
    if (vscodeSettings['editor.lineNumbers']) {
      mapped.lineNumbers = vscodeSettings['editor.lineNumbers'];
    }
    
    // Map minimap settings
    if (vscodeSettings['editor.minimap.enabled'] !== undefined) {
      mapped.minimap = {
        ...this.config.vscode.minimap,
        enabled: vscodeSettings['editor.minimap.enabled'],
      };
    }
    
    // Map terminal settings
    if (vscodeSettings['terminal.integrated.fontSize']) {
      mapped.terminal = {
        ...this.config.vscode.terminal,
        fontSize: vscodeSettings['terminal.integrated.fontSize'],
      };
    }
    
    return mapped;
  }
}
