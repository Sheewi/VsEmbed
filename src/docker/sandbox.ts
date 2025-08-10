import { EventEmitter } from 'events';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs/promises';
import { ExtensionRecommender } from '../extensions/recommender';

export interface ContainerConfig {
  name: string;
  image: string;
  ports: { host: number; container: number }[];
  volumes: { host: string; container: string; readonly?: boolean }[];
  environment: Record<string, string>;
  resources: {
    memory: string;
    cpuLimit: string;
    networkMode: string;
  };
  security: {
    seccompProfile?: string;
    capabilities: {
      add: string[];
      drop: string[];
    };
    user: string;
    readonlyRootfs: boolean;
  };
}

export interface ExtensionSandbox {
  containerId: string;
  extensionId: string;
  status: 'creating' | 'running' | 'stopped' | 'error';
  config: ContainerConfig;
  process?: ChildProcess;
  createdAt: Date;
  lastAccessed: Date;
  ports: number[];
  resources: {
    cpu: number;
    memory: number;
    network: number;
  };
}

export interface SandboxMetrics {
  totalContainers: number;
  runningContainers: number;
  memoryUsage: number;
  cpuUsage: number;
  networkTraffic: number;
  securityEvents: number;
  containerHealth: Map<string, boolean>;
}

export class DockerManager extends EventEmitter {
  private containers: Map<string, ExtensionSandbox> = new Map();
  private imageCache: Map<string, boolean> = new Map();
  private networkIds: Set<string> = new Set();
  private metrics: SandboxMetrics;
  private cleanupInterval?: NodeJS.Timer;
  private monitoringInterval?: NodeJS.Timer;

  constructor(private recommender: ExtensionRecommender) {
    super();
    
    this.metrics = {
      totalContainers: 0,
      runningContainers: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      networkTraffic: 0,
      securityEvents: 0,
      containerHealth: new Map()
    };

    this.initializeDocker();
    this.startMonitoring();
    this.setupCleanup();
  }

  async createExtensionSandbox(extensionId: string, config?: Partial<ContainerConfig>): Promise<ExtensionSandbox> {
    const sandboxConfig = await this.buildContainerConfig(extensionId, config);
    const containerId = this.generateContainerId(extensionId);

    // Check if extension requires special permissions
    const extensionInfo = await this.recommender.getExtensionInfo(extensionId);
    if (extensionInfo?.security?.requiresIsolation) {
      sandboxConfig.security.capabilities.drop.push('NET_RAW', 'SYS_ADMIN');
    }

    const sandbox: ExtensionSandbox = {
      containerId,
      extensionId,
      status: 'creating',
      config: sandboxConfig,
      createdAt: new Date(),
      lastAccessed: new Date(),
      ports: sandboxConfig.ports.map(p => p.host),
      resources: {
        cpu: 0,
        memory: 0,
        network: 0
      }
    };

    this.containers.set(containerId, sandbox);
    this.emit('sandboxCreating', { containerId, extensionId });

    try {
      // Build container if image doesn't exist
      await this.ensureImage(sandboxConfig.image);

      // Create and start container
      const process = await this.startContainer(sandbox);
      sandbox.process = process;
      sandbox.status = 'running';

      this.metrics.totalContainers++;
      this.metrics.runningContainers++;

      this.emit('sandboxCreated', { containerId, extensionId });
      return sandbox;

    } catch (error) {
      sandbox.status = 'error';
      this.emit('sandboxError', { 
        containerId, 
        extensionId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  async stopSandbox(containerId: string): Promise<void> {
    const sandbox = this.containers.get(containerId);
    if (!sandbox) {
      throw new Error(`Sandbox ${containerId} not found`);
    }

    this.emit('sandboxStopping', { containerId, extensionId: sandbox.extensionId });

    try {
      // Stop container gracefully
      await this.executeDockerCommand(['stop', '-t', '10', containerId]);
      
      // Remove container
      await this.executeDockerCommand(['rm', containerId]);

      sandbox.status = 'stopped';
      if (sandbox.status === 'running') {
        this.metrics.runningContainers--;
      }

      this.emit('sandboxStopped', { containerId, extensionId: sandbox.extensionId });

    } catch (error) {
      this.emit('sandboxError', { 
        containerId, 
        extensionId: sandbox.extensionId,
        error: error instanceof Error ? error.message : 'Failed to stop container' 
      });
      throw error;
    }
  }

  async restartSandbox(containerId: string): Promise<void> {
    const sandbox = this.containers.get(containerId);
    if (!sandbox) {
      throw new Error(`Sandbox ${containerId} not found`);
    }

    await this.stopSandbox(containerId);
    
    // Wait a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSandbox = await this.createExtensionSandbox(sandbox.extensionId, sandbox.config);
    
    // Update container ID mapping
    this.containers.delete(containerId);
    this.containers.set(newSandbox.containerId, newSandbox);
  }

  async executeSandboxCommand(containerId: string, command: string[]): Promise<string> {
    const sandbox = this.containers.get(containerId);
    if (!sandbox || sandbox.status !== 'running') {
      throw new Error(`Sandbox ${containerId} is not running`);
    }

    sandbox.lastAccessed = new Date();

    try {
      const result = await this.executeDockerCommand(['exec', containerId, ...command]);
      this.emit('commandExecuted', { containerId, command, success: true });
      return result;
    } catch (error) {
      this.emit('commandExecuted', { 
        containerId, 
        command, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  async copyToSandbox(containerId: string, hostPath: string, containerPath: string): Promise<void> {
    const sandbox = this.containers.get(containerId);
    if (!sandbox || sandbox.status !== 'running') {
      throw new Error(`Sandbox ${containerId} is not running`);
    }

    try {
      await this.executeDockerCommand(['cp', hostPath, `${containerId}:${containerPath}`]);
      this.emit('fileCopied', { containerId, hostPath, containerPath, direction: 'to' });
    } catch (error) {
      this.emit('copyError', { 
        containerId, 
        hostPath, 
        containerPath, 
        direction: 'to',
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  async copyFromSandbox(containerId: string, containerPath: string, hostPath: string): Promise<void> {
    const sandbox = this.containers.get(containerId);
    if (!sandbox || sandbox.status !== 'running') {
      throw new Error(`Sandbox ${containerId} is not running`);
    }

    try {
      await this.executeDockerCommand(['cp', `${containerId}:${containerPath}`, hostPath]);
      this.emit('fileCopied', { containerId, containerPath, hostPath, direction: 'from' });
    } catch (error) {
      this.emit('copyError', { 
        containerId, 
        containerPath, 
        hostPath, 
        direction: 'from',
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  async getSandboxLogs(containerId: string, tail = 100): Promise<string> {
    const sandbox = this.containers.get(containerId);
    if (!sandbox) {
      throw new Error(`Sandbox ${containerId} not found`);
    }

    try {
      return await this.executeDockerCommand(['logs', '--tail', tail.toString(), containerId]);
    } catch (error) {
      throw new Error(`Failed to get logs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getSandboxStatus(containerId: string): ExtensionSandbox | undefined {
    return this.containers.get(containerId);
  }

  listSandboxes(): ExtensionSandbox[] {
    return Array.from(this.containers.values());
  }

  getSandboxesByExtension(extensionId: string): ExtensionSandbox[] {
    return Array.from(this.containers.values()).filter(s => s.extensionId === extensionId);
  }

  getMetrics(): SandboxMetrics {
    return { ...this.metrics };
  }

  private async buildContainerConfig(
    extensionId: string, 
    customConfig?: Partial<ContainerConfig>
  ): Promise<ContainerConfig> {
    const baseConfig: ContainerConfig = {
      name: `vsembed-ext-${extensionId.replace(/[^a-zA-Z0-9]/g, '-')}`,
      image: 'vsembed/extension-runtime:latest',
      ports: [
        { host: await this.getAvailablePort(), container: 8080 }
      ],
      volumes: [
        { host: '/tmp/vsembed/workspace', container: '/workspace', readonly: false },
        { host: '/tmp/vsembed/extensions', container: '/extensions', readonly: true }
      ],
      environment: {
        'EXTENSION_ID': extensionId,
        'NODE_ENV': 'production',
        'VSCODE_EXTENSION_API_VERSION': '1.74.0'
      },
      resources: {
        memory: '512m',
        cpuLimit: '0.5',
        networkMode: 'vsembed-network'
      },
      security: {
        capabilities: {
          add: [],
          drop: ['ALL']
        },
        user: '1000:1000',
        readonlyRootfs: true
      }
    };

    // Apply extension-specific configurations
    const extensionInfo = await this.recommender.getExtensionInfo(extensionId);
    if (extensionInfo) {
      if (extensionInfo.resources?.memory) {
        baseConfig.resources.memory = extensionInfo.resources.memory;
      }
      if (extensionInfo.resources?.cpu) {
        baseConfig.resources.cpuLimit = extensionInfo.resources.cpu;
      }
      if (extensionInfo.security?.requiredCapabilities) {
        baseConfig.security.capabilities.add.push(...extensionInfo.security.requiredCapabilities);
      }
    }

    // Merge with custom configuration
    return this.mergeConfigs(baseConfig, customConfig || {});
  }

  private mergeConfigs(base: ContainerConfig, custom: Partial<ContainerConfig>): ContainerConfig {
    return {
      ...base,
      ...custom,
      ports: custom.ports || base.ports,
      volumes: custom.volumes || base.volumes,
      environment: { ...base.environment, ...(custom.environment || {}) },
      resources: { ...base.resources, ...(custom.resources || {}) },
      security: {
        ...base.security,
        ...(custom.security || {}),
        capabilities: {
          add: [...(base.security.capabilities.add || []), ...(custom.security?.capabilities?.add || [])],
          drop: [...(base.security.capabilities.drop || []), ...(custom.security?.capabilities?.drop || [])]
        }
      }
    };
  }

  private async ensureImage(imageName: string): Promise<void> {
    if (this.imageCache.has(imageName)) {
      return;
    }

    try {
      // Check if image exists locally
      await this.executeDockerCommand(['inspect', imageName]);
      this.imageCache.set(imageName, true);
    } catch (error) {
      // Image doesn't exist, build it
      await this.buildExtensionImage(imageName);
      this.imageCache.set(imageName, true);
    }
  }

  private async buildExtensionImage(imageName: string): Promise<void> {
    this.emit('imageBuildStarted', { imageName });

    // Create Dockerfile for extension runtime
    const dockerfile = this.generateDockerfile();
    const buildContext = '/tmp/vsembed/build';
    
    await fs.mkdir(buildContext, { recursive: true });
    await fs.writeFile(path.join(buildContext, 'Dockerfile'), dockerfile);

    try {
      await this.executeDockerCommand(['build', '-t', imageName, buildContext]);
      this.emit('imageBuildCompleted', { imageName });
    } catch (error) {
      this.emit('imageBuildFailed', { 
        imageName, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  private generateDockerfile(): string {
    return `
FROM node:18-alpine

# Install VS Code dependencies
RUN apk add --no-cache \
    git \
    bash \
    curl \
    python3 \
    make \
    g++ \
    libx11 \
    libxkbfile \
    libsecret

# Create non-root user
RUN addgroup -g 1000 vscode && \
    adduser -u 1000 -G vscode -s /bin/bash -D vscode

# Install VS Code Server
RUN curl -fsSL https://code-server.dev/install.sh | sh

# Create workspace directory
RUN mkdir -p /workspace /extensions /tmp/vscode-extensions
RUN chown -R vscode:vscode /workspace /extensions /tmp/vscode-extensions

# Copy extension runner script
COPY <<EOF /usr/local/bin/run-extension.sh
#!/bin/bash
set -e

# Initialize VS Code environment
export VSCODE_AGENT_FOLDER=/tmp/vscode-extensions
export VSCODE_EXTENSIONS_PATH=/extensions

# Start code-server with extension support
exec code-server \\
  --bind-addr 0.0.0.0:8080 \\
  --auth none \\
  --disable-telemetry \\
  --extensions-dir /extensions \\
  --user-data-dir /tmp/vscode-user \\
  /workspace
EOF

RUN chmod +x /usr/local/bin/run-extension.sh

# Switch to non-root user
USER vscode

# Set working directory
WORKDIR /workspace

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:8080/healthz || exit 1

# Start extension runtime
CMD ["/usr/local/bin/run-extension.sh"]
`;
  }

  private async startContainer(sandbox: ExtensionSandbox): Promise<ChildProcess> {
    const { config } = sandbox;
    
    const dockerArgs = [
      'run',
      '-d',
      '--name', sandbox.containerId,
      '--memory', config.resources.memory,
      '--cpus', config.resources.cpuLimit,
      '--network', config.resources.networkMode,
      '--user', config.security.user,
      '--security-opt', 'no-new-privileges:true'
    ];

    // Add readonly root filesystem if specified
    if (config.security.readonlyRootfs) {
      dockerArgs.push('--read-only');
      dockerArgs.push('--tmpfs', '/tmp:exec,size=100m');
      dockerArgs.push('--tmpfs', '/var/tmp:exec,size=100m');
    }

    // Add capabilities
    config.security.capabilities.drop.forEach(cap => {
      dockerArgs.push('--cap-drop', cap);
    });
    config.security.capabilities.add.forEach(cap => {
      dockerArgs.push('--cap-add', cap);
    });

    // Add seccomp profile if specified
    if (config.security.seccompProfile) {
      dockerArgs.push('--security-opt', `seccomp=${config.security.seccompProfile}`);
    }

    // Add port mappings
    config.ports.forEach(port => {
      dockerArgs.push('-p', `${port.host}:${port.container}`);
    });

    // Add volume mounts
    config.volumes.forEach(volume => {
      const mount = volume.readonly ? `${volume.host}:${volume.container}:ro` : `${volume.host}:${volume.container}`;
      dockerArgs.push('-v', mount);
    });

    // Add environment variables
    Object.entries(config.environment).forEach(([key, value]) => {
      dockerArgs.push('-e', `${key}=${value}`);
    });

    // Add image
    dockerArgs.push(config.image);

    const process = spawn('docker', dockerArgs, {
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false
    });

    return new Promise((resolve, reject) => {
      let output = '';
      let errorOutput = '';

      process.stdout?.on('data', (data) => {
        output += data.toString();
      });

      process.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(process);
        } else {
          reject(new Error(`Docker container failed to start: ${errorOutput}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!process.killed) {
          process.kill();
          reject(new Error('Container startup timeout'));
        }
      }, 30000);
    });
  }

  private async executeDockerCommand(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn('docker', args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let errorOutput = '';

      process.stdout?.on('data', (data) => {
        output += data.toString();
      });

      process.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(`Docker command failed: ${errorOutput}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  private async getAvailablePort(): Promise<number> {
    // Simple port allocation - in production, use proper port management
    return 8080 + Math.floor(Math.random() * 1000);
  }

  private generateContainerId(extensionId: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const sanitized = extensionId.replace(/[^a-zA-Z0-9]/g, '-');
    return `vsembed-${sanitized}-${timestamp}-${random}`;
  }

  private async initializeDocker(): Promise<void> {
    try {
      // Check if Docker is available
      await this.executeDockerCommand(['version']);

      // Create custom network for VSEmbed
      try {
        await this.executeDockerCommand([
          'network', 'create',
          '--driver', 'bridge',
          '--subnet', '172.20.0.0/16',
          '--opt', 'com.docker.network.bridge.enable_icc=false',
          'vsembed-network'
        ]);
        this.networkIds.add('vsembed-network');
      } catch (error) {
        // Network might already exist
        console.log('VSEmbed network already exists or failed to create');
      }

      this.emit('dockerInitialized');
    } catch (error) {
      this.emit('dockerError', { error: 'Docker not available' });
      throw new Error('Docker is not available or not running');
    }
  }

  private startMonitoring(): void {
    this.monitoringInterval = setInterval(async () => {
      await this.updateMetrics();
    }, 10000); // Every 10 seconds
  }

  private async updateMetrics(): Promise<void> {
    try {
      // Update container health status
      for (const [containerId, sandbox] of this.containers) {
        if (sandbox.status === 'running') {
          try {
            const healthOutput = await this.executeDockerCommand(['inspect', '--format={{.State.Health.Status}}', containerId]);
            const isHealthy = healthOutput.trim() === 'healthy';
            this.metrics.containerHealth.set(containerId, isHealthy);

            if (!isHealthy) {
              this.emit('containerUnhealthy', { containerId, extensionId: sandbox.extensionId });
            }
          } catch (error) {
            this.metrics.containerHealth.set(containerId, false);
            this.emit('containerUnhealthy', { containerId, extensionId: sandbox.extensionId });
          }
        }
      }

      // Update overall metrics
      this.metrics.runningContainers = Array.from(this.containers.values())
        .filter(s => s.status === 'running').length;

      this.emit('metricsUpdated', this.metrics);
    } catch (error) {
      console.error('Failed to update Docker metrics:', error);
    }
  }

  private setupCleanup(): void {
    this.cleanupInterval = setInterval(async () => {
      await this.cleanupIdleContainers();
    }, 60000); // Every minute
  }

  private async cleanupIdleContainers(): Promise<void> {
    const idleThreshold = 30 * 60 * 1000; // 30 minutes
    const now = new Date();

    for (const [containerId, sandbox] of this.containers) {
      const idleTime = now.getTime() - sandbox.lastAccessed.getTime();
      
      if (idleTime > idleThreshold && sandbox.status === 'running') {
        try {
          await this.stopSandbox(containerId);
          this.emit('containerCleaned', { containerId, extensionId: sandbox.extensionId, idleTime });
        } catch (error) {
          console.error(`Failed to cleanup container ${containerId}:`, error);
        }
      }
    }
  }

  public async shutdown(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    // Stop all running containers
    const stopPromises = Array.from(this.containers.keys()).map(containerId => 
      this.stopSandbox(containerId).catch(console.error)
    );
    
    await Promise.all(stopPromises);

    // Clean up networks
    for (const networkId of this.networkIds) {
      try {
        await this.executeDockerCommand(['network', 'rm', networkId]);
      } catch (error) {
        console.error(`Failed to remove network ${networkId}:`, error);
      }
    }

    this.emit('shutdown');
  }
}
