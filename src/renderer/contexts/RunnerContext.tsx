import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useNotifications } from './NotificationContext';

interface RunnerStatus {
  running: boolean;
  pid?: number;
  ports: { [localPort: number]: number };
  preview_url?: string;
  resource_usage: {
    cpu_percent: number;
    memory_mb: number;
    disk_mb: number;
  };
  last_build: BuildResult;
}

interface BuildResult {
  success: boolean;
  output: string;
  errors: string[];
  warnings: string[];
  artifacts: string[];
}

interface RunnerConfig {
  type: 'docker' | 'sandbox' | 'local';
  image?: string;
  ports: { [localPort: number]: number };
  environment: { [key: string]: string };
  working_directory: string;
  resource_limits: {
    cpu: string;
    memory: string;
    disk: string;
  };
  network_policy: {
    enabled: boolean;
    allowed_hosts: string[];
  };
}

interface RunnerContextType {
  status: RunnerStatus;
  isBuilding: boolean;
  isStarting: boolean;
  logs: string;

  // Actions
  build: (config?: RunnerConfig) => Promise<boolean>;
  start: (config?: RunnerConfig) => Promise<boolean>;
  stop: () => Promise<boolean>;
  restart: () => Promise<boolean>;
  refreshStatus: () => Promise<void>;
  getLogs: (lines?: number) => Promise<void>;
  exposePort: (localPort: number, containerPort: number) => Promise<boolean>;
}

const RunnerContext = createContext<RunnerContextType | undefined>(undefined);

export const useRunner = () => {
  const context = useContext(RunnerContext);
  if (!context) {
    throw new Error('useRunner must be used within a RunnerProvider');
  }
  return context;
};

interface RunnerProviderProps {
  children: ReactNode;
}

export const RunnerProvider: React.FC<RunnerProviderProps> = ({ children }) => {
  const [status, setStatus] = useState<RunnerStatus>({
    running: false,
    ports: {},
    resource_usage: {
      cpu_percent: 0,
      memory_mb: 0,
      disk_mb: 0,
    },
    last_build: {
      success: false,
      output: '',
      errors: [],
      warnings: [],
      artifacts: [],
    },
  });

  const [isBuilding, setIsBuilding] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [logs, setLogs] = useState('');

  const { addNotification } = useNotifications();
  const electronAPI = (window as any).electronAPI;

  const build = useCallback(async (config?: RunnerConfig): Promise<boolean> => {
    if (!electronAPI) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Electron API not available',
      });
      return false;
    }

    setIsBuilding(true);

    try {
      const buildResult = await electronAPI.runner.build(config);

      setStatus(prev => ({
        ...prev,
        last_build: buildResult,
      }));

      if (buildResult.success) {
        addNotification({
          type: 'success',
          title: 'Build Successful',
          message: 'Your project has been built successfully.',
          actions: [
            {
              label: 'Start',
              action: () => start(config),
              style: 'primary',
            },
          ],
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Build Failed',
          message: `Build failed with ${buildResult.errors.length} error(s).`,
          actions: [
            {
              label: 'View Logs',
              action: () => getLogs(),
              style: 'secondary',
            },
          ],
        });
      }

      return buildResult.success;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Build Error',
        message: error instanceof Error ? error.message : 'Unknown build error',
      });
      return false;
    } finally {
      setIsBuilding(false);
    }
  }, [electronAPI, addNotification]);

  const start = useCallback(async (config?: RunnerConfig): Promise<boolean> => {
    if (!electronAPI) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Electron API not available',
      });
      return false;
    }

    setIsStarting(true);

    try {
      const runnerStatus = await electronAPI.runner.start(config);

      setStatus(runnerStatus);

      if (runnerStatus.running) {
        addNotification({
          type: 'success',
          title: 'Runner Started',
          message: runnerStatus.preview_url
            ? `Application running at ${runnerStatus.preview_url}`
            : 'Application is now running.',
          actions: runnerStatus.preview_url ? [
            {
              label: 'Open Preview',
              action: () => {
                // This would open the preview pane or external browser
                console.log('Open preview:', runnerStatus.preview_url);
              },
              style: 'primary',
            },
          ] : undefined,
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Failed to Start Runner',
          message: 'The application failed to start.',
        });
      }

      return runnerStatus.running;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Start Error',
        message: error instanceof Error ? error.message : 'Unknown start error',
      });
      return false;
    } finally {
      setIsStarting(false);
    }
  }, [electronAPI, addNotification]);

  const stop = useCallback(async (): Promise<boolean> => {
    if (!electronAPI) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Electron API not available',
      });
      return false;
    }

    try {
      const success = await electronAPI.runner.stop();

      if (success) {
        setStatus(prev => ({
          ...prev,
          running: false,
          ports: {},
          preview_url: undefined,
          pid: undefined,
        }));

        addNotification({
          type: 'info',
          title: 'Runner Stopped',
          message: 'The application has been stopped.',
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Failed to Stop Runner',
          message: 'An error occurred while stopping the application.',
        });
      }

      return success;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Stop Error',
        message: error instanceof Error ? error.message : 'Unknown stop error',
      });
      return false;
    }
  }, [electronAPI, addNotification]);

  const restart = useCallback(async (): Promise<boolean> => {
    await stop();
    return await start();
  }, [stop, start]);

  const refreshStatus = useCallback(async (): Promise<void> => {
    if (!electronAPI) return;

    try {
      const runnerStatus = await electronAPI.runner.status();
      setStatus(runnerStatus);
    } catch (error) {
      console.error('Failed to refresh runner status:', error);
    }
  }, [electronAPI]);

  const getLogs = useCallback(async (lines: number = 100): Promise<void> => {
    if (!electronAPI) return;

    try {
      const logContent = await electronAPI.runner.getLogs?.(lines);
      if (logContent) {
        setLogs(logContent);
      }
    } catch (error) {
      console.error('Failed to get logs:', error);
    }
  }, [electronAPI]);

  const exposePort = useCallback(async (localPort: number, containerPort: number): Promise<boolean> => {
    if (!electronAPI) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Electron API not available',
      });
      return false;
    }

    try {
      const success = await electronAPI.runner.exposePort?.(localPort, containerPort);

      if (success) {
        setStatus(prev => ({
          ...prev,
          ports: {
            ...prev.ports,
            [localPort]: containerPort,
          },
        }));

        addNotification({
          type: 'success',
          title: 'Port Exposed',
          message: `Port ${containerPort} is now accessible at localhost:${localPort}`,
        });
      }

      return success || false;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Expose Port',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }, [electronAPI, addNotification]);

  // Periodically refresh status when runner is active
  useEffect(() => {
    if (!status.running) return;

    const interval = setInterval(() => {
      refreshStatus();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [status.running, refreshStatus]);

  // Initial status load
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const value: RunnerContextType = {
    status,
    isBuilding,
    isStarting,
    logs,
    build,
    start,
    stop,
    restart,
    refreshStatus,
    getLogs,
    exposePort,
  };

  return (
    <RunnerContext.Provider value={value}>
      {children}
    </RunnerContext.Provider>
  );
};
