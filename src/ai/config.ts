// Model Configuration System
export interface ModelConfig {
  provider: 'openai' | 'anthropic' | 'azure' | 'local';
  model: string;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
  endpoint?: string;
  tools: {
    kali: boolean;
    gcp: boolean;
    docker: boolean;
    vscode: {
      fileAccess: boolean;
      terminal: boolean;
      extensions: boolean;
      debugger: boolean;
    };
  };
  permissions: {
    dangerousOperations: boolean;
    networkAccess: boolean;
    fileSystemWrite: boolean;
  };
}

export interface ExtensionRecommendation {
  extensionId: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  category: string;
  requiredForTask?: string;
}

export interface PermissionRequest {
  id: string;
  extensionId: string;
  command: string;
  purpose: string;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: number;
  approved?: boolean;
}

export class ModelConfiguration {
  private static readonly CONFIG_KEY = 'ai-model-config';
  private static readonly PERMISSIONS_KEY = 'ai-permissions';
  private config: ModelConfig;
  private permissions: Record<string, boolean> = {};

  constructor() {
    this.config = this.loadConfig();
    this.permissions = this.loadPermissions();
  }

  private loadConfig(): ModelConfig {
    const saved = localStorage.getItem(ModelConfiguration.CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      provider: 'openai',
      model: 'gpt-4-1106-preview',
      temperature: 0.7,
      maxTokens: 4096,
      tools: {
        kali: false, // Default disabled for security
        gcp: true,
        docker: true,
        vscode: {
          fileAccess: true,
          terminal: false, // Requires explicit user approval
          extensions: true,
          debugger: false
        }
      },
      permissions: {
        dangerousOperations: false,
        networkAccess: true,
        fileSystemWrite: false
      }
    };
  }

  private loadPermissions(): Record<string, boolean> {
    const saved = localStorage.getItem(ModelConfiguration.PERMISSIONS_KEY);
    return saved ? JSON.parse(saved) : {};
  }

  async updateConfig(updates: Partial<ModelConfig>): Promise<void> {
    this.config = { ...this.config, ...updates };
    localStorage.setItem(
      ModelConfiguration.CONFIG_KEY,
      JSON.stringify(this.config)
    );
    
    // Notify about configuration update
    window.electronAPI?.notifyConfigUpdate?.(this.config);
  }

  async updatePermission(extensionId: string, granted: boolean): Promise<void> {
    this.permissions[extensionId] = granted;
    localStorage.setItem(
      ModelConfiguration.PERMISSIONS_KEY,
      JSON.stringify(this.permissions)
    );
  }

  getConfig(): ModelConfig {
    return { ...this.config };
  }

  hasPermission(extensionId: string): boolean {
    return this.permissions[extensionId] === true;
  }

  getPermissions(): Record<string, boolean> {
    return { ...this.permissions };
  }

  validateConfig(): string[] {
    const errors: string[] = [];

    if (!this.config.apiKey && this.config.provider !== 'local') {
      errors.push(`API key required for ${this.config.provider}`);
    }

    if (this.config.temperature < 0 || this.config.temperature > 2) {
      errors.push('Temperature must be between 0 and 2');
    }

    if (this.config.maxTokens < 1 || this.config.maxTokens > 8192) {
      errors.push('Max tokens must be between 1 and 8192');
    }

    return errors;
  }

  exportConfig(): string {
    return JSON.stringify({
      config: this.config,
      permissions: this.permissions,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  importConfig(configString: string): void {
    try {
      const imported = JSON.parse(configString);
      if (imported.config) {
        this.config = imported.config;
        localStorage.setItem(
          ModelConfiguration.CONFIG_KEY,
          JSON.stringify(this.config)
        );
      }
      if (imported.permissions) {
        this.permissions = imported.permissions;
        localStorage.setItem(
          ModelConfiguration.PERMISSIONS_KEY,
          JSON.stringify(this.permissions)
        );
      }
    } catch (error) {
      throw new Error('Invalid configuration format');
    }
  }
}
