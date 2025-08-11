import React, { useState, useEffect } from 'react';
import { GrokChatInterface } from './components/GrokChatInterface';
import { Layout } from './components/Layout';
import { NotificationProvider } from './contexts/NotificationContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { AIProvider } from './contexts/AIContext';
import { RunnerProvider } from './contexts/RunnerContext';

const App: React.FC = () => {
  console.log('App component is rendering!');
  
  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: '#1e1e1e',
      color: '#fff',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1>🎉 React is Working!</h1>
      <p>VSEmbed AI DevTool</p>
      <button 
        onClick={() => alert('Button clicked!')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007acc',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Test Button
      </button>
      <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.7 }}>
        If you can see this, React is working correctly
      </p>
    </div>
  );
};

export default App;
