import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/App.css';

console.log('🚀 VSEmbed AI DevTool starting...');

// Ensure DOM is ready
const initializeApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
  
  console.log('✅ VSEmbed AI DevTool initialized successfully!');
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
