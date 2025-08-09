import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ChatPane } from './components/ChatPane';
import { EditorPane } from './components/EditorPane';
import { TerminalPane } from './components/TerminalPane';
import { PreviewPane } from './components/PreviewPane';
import { FileExplorer } from './components/FileExplorer';
import { StatusBar } from './components/StatusBar';
import { MenuHandler } from './components/MenuHandler';
import { NotificationProvider } from './contexts/NotificationContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { AIProvider } from './contexts/AIContext';
import { RunnerProvider } from './contexts/RunnerContext';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <NotificationProvider>
      <WorkspaceProvider>
        <AIProvider>
          <RunnerProvider>
            <div className="app" data-theme={theme}>
              <MenuHandler />
              <Layout>
                <Layout.Sidebar>
                  <FileExplorer />
                </Layout.Sidebar>

                <Layout.Main>
                  <Layout.TopPanel>
                    <ChatPane />
                  </Layout.TopPanel>

                  <Layout.MiddlePanel>
                    <EditorPane />
                    <PreviewPane />
                  </Layout.MiddlePanel>

                  <Layout.BottomPanel>
                    <TerminalPane />
                  </Layout.BottomPanel>
                </Layout.Main>
              </Layout>

              <StatusBar />
            </div>
          </RunnerProvider>
        </AIProvider>
      </WorkspaceProvider>
    </NotificationProvider>
  );
};

export default App;
