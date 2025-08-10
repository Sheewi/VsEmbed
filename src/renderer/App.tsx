import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { NotificationProvider } from './contexts/NotificationContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { AIProvider } from './contexts/AIContext';
import { RunnerProvider } from './contexts/RunnerContext';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = 'vsembed-app';
  }, [theme]);

  return (
    <NotificationProvider>
      <WorkspaceProvider>
        <AIProvider>
          <RunnerProvider>
            <div className="vsembed-app" data-theme={theme}>
              <Layout />
            </div>
          </RunnerProvider>
        </AIProvider>
      </WorkspaceProvider>
    </NotificationProvider>
  );
};

export default App;
