import React, { useState, useEffect } from 'react';
import { GrokChatInterface } from './components/GrokChatInterface';
import { Layout } from './components/Layout';
import { NotificationProvider } from './contexts/NotificationContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { AIProvider } from './contexts/AIContext';
import { RunnerProvider } from './contexts/RunnerContext';
// import { AIInterfaceManager } from './components/AIInterfaceManager';
// TODO: Uncomment and fix the import path once AIInterfaceManager exists
import './styles/App.css';

const App: React.FC = () => {
  console.log('🚀 VSEmbed AI DevTool initializing...');
  
  return (
    <NotificationProvider>
      <WorkspaceProvider>
        <AIProvider>
          <RunnerProvider>
            <div className="app">
              {/* <AIInterfaceManager /> */}
              {/* TODO: Uncomment and fix the import path once AIInterfaceManager exists */}
            </div>
          </RunnerProvider>
        </AIProvider>
      </WorkspaceProvider>
    </NotificationProvider>
  );
};

export default App;
