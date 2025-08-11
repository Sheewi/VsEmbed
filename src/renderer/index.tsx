// Working React + VS Code Interface
console.log('🎯 Starting VS Code interface...');

// First ensure JavaScript is working
document.title = 'VSEmbed - Loading React...';

// Import React properly
import * as React from 'react';
import { createRoot } from 'react-dom/client';

// Wait for DOM
function initApp() {
  console.log('📦 Initializing React app...');
  
  const container = document.getElementById('root') || document.body;
  
  // Clear existing content
  container.innerHTML = '<div id="react-root"></div>';
  
  const reactContainer = document.getElementById('react-root');
  const root = createRoot(reactContainer!);
  
  // VS Code Layout Component
  const VSCodeLayout = () => {
    const [sideBarVisible, setSideBarVisible] = React.useState(true);
    const [panelVisible, setPanelVisible] = React.useState(true);
    const [activeView, setActiveView] = React.useState('explorer');
    
    console.log('🎨 Rendering VS Code layout...');
    
    return React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        fontFamily: 'Arial, sans-serif',
        background: '#1e1e1e',
        color: '#cccccc',
        overflow: 'hidden'
      }
    }, [
      // Top Bar
      React.createElement('div', {
        key: 'topbar',
        style: {
          display: 'flex',
          alignItems: 'center',
          height: '35px',
          background: '#2d2d30',
          borderBottom: '1px solid #3c3c3c',
          padding: '0 12px',
          justifyContent: 'space-between'
        }
      }, [
        // Left: Logo
        React.createElement('div', {
          key: 'logo',
          style: { display: 'flex', alignItems: 'center', gap: '8px' }
        }, [
          React.createElement('span', { key: 'icon', style: { fontSize: '16px' } }, '🔷'),
          React.createElement('span', { key: 'text', style: { fontWeight: '500' } }, 'VSEmbed')
        ]),
        
        // Center: Search Bar
        React.createElement('div', {
          key: 'search',
          style: {
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            padding: '0 16px'
          }
        }, React.createElement('input', {
          type: 'text',
          placeholder: 'Search files, symbols, commands...',
          style: {
            width: '100%',
            maxWidth: '600px',
            padding: '6px 12px',
            background: '#3c3c3c',
            border: '1px solid #3c3c3c',
            borderRadius: '6px',
            color: '#cccccc',
            fontSize: '13px',
            outline: 'none'
          }
        })),
        
        // Right: Controls
        React.createElement('div', {
          key: 'controls',
          style: { display: 'flex', gap: '4px' }
        }, [
          React.createElement('button', {
            key: 'sidebar',
            onClick: () => setSideBarVisible(!sideBarVisible),
            style: {
              padding: '6px 8px',
              background: 'transparent',
              border: 'none',
              color: '#cccccc',
              cursor: 'pointer',
              borderRadius: '3px',
              fontSize: '12px'
            },
            title: 'Toggle Side Bar'
          }, '📁'),
          React.createElement('button', {
            key: 'panel',
            onClick: () => setPanelVisible(!panelVisible),
            style: {
              padding: '6px 8px',
              background: 'transparent',
              border: 'none',
              color: '#cccccc',
              cursor: 'pointer',
              borderRadius: '3px',
              fontSize: '12px'
            },
            title: 'Toggle Panel'
          }, '⬜'),
          React.createElement('button', {
            key: 'close',
            style: {
              padding: '6px 8px',
              background: 'transparent',
              border: 'none',
              color: '#cccccc',
              cursor: 'pointer',
              borderRadius: '3px',
              fontSize: '12px'
            },
            title: 'Close'
          }, '✕')
        ])
      ]),
      
      // Main Content
      React.createElement('div', {
        key: 'main',
        style: {
          display: 'flex',
          flex: '1',
          overflow: 'hidden'
        }
      }, [
        // Activity Bar
        React.createElement('div', {
          key: 'activitybar',
          style: {
            width: '48px',
            background: '#2d2d30',
            borderRight: '1px solid #3c3c3c',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px 0',
            gap: '8px'
          }
        }, [
          ['📁', 'explorer', 'Explorer'],
          ['🔍', 'search', 'Search'], 
          ['🌿', 'scm', 'Source Control'],
          ['🐛', 'debug', 'Debug'],
          ['🧩', 'extensions', 'Extensions']
        ].map(([icon, id, title]) =>
          React.createElement('button', {
            key: id,
            onClick: () => setActiveView(id),
            style: {
              width: '40px',
              height: '40px',
              background: activeView === id ? '#37373d' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: activeView === id ? '#ffffff' : '#858585',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            },
            title: title
          }, icon)
        )),
        
        // Side Bar
        sideBarVisible && React.createElement('div', {
          key: 'sidebar',
          style: {
            width: '300px',
            background: '#252526',
            borderRight: '1px solid #3c3c3c',
            display: 'flex',
            flexDirection: 'column'
          }
        }, [
          React.createElement('div', {
            key: 'header',
            style: {
              height: '35px',
              background: '#2d2d30',
              borderBottom: '1px solid #3c3c3c',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }
          }, activeView.toUpperCase()),
          React.createElement('div', {
            key: 'content',
            style: {
              flex: '1',
              padding: '16px',
              overflow: 'auto'
            }
          }, `${activeView} panel content - Working!`)
        ]),
        
        // Editor Area
        React.createElement('div', {
          key: 'editor',
          style: {
            flex: '1',
            background: '#1e1e1e',
            display: 'flex',
            flexDirection: 'column'
          }
        }, [
          React.createElement('div', {
            key: 'tabs',
            style: {
              height: '35px',
              background: '#2d2d30',
              borderBottom: '1px solid #3c3c3c',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px'
            }
          }, 'Welcome.md'),
          React.createElement('div', {
            key: 'content',
            style: {
              flex: '1',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '20px'
            }
          }, [
            React.createElement('h1', {
              key: 'title',
              style: { color: '#4CAF50', margin: '0' }
            }, '🎉 VS Code Interface Working!'),
            React.createElement('p', {
              key: 'desc',
              style: { textAlign: 'center', margin: '0' }
            }, 'You now have: Search bar (center), Panel toggles (right), Activity bar (left), Side panels!')
          ])
        ])
      ]),
      
      // Bottom Panel
      panelVisible && React.createElement('div', {
        key: 'panel',
        style: {
          height: '200px',
          background: '#181818',
          borderTop: '1px solid #3c3c3c',
          display: 'flex',
          flexDirection: 'column'
        }
      }, [
        React.createElement('div', {
          key: 'panelheader',
          style: {
            height: '35px',
            background: '#2d2d30',
            borderBottom: '1px solid #3c3c3c',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            fontSize: '13px'
          }
        }, 'Terminal'),
        React.createElement('div', {
          key: 'panelcontent',
          style: {
            flex: '1',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '12px'
          }
        }, 'Terminal content - Panel toggle working!')
      ]),
      
      // Status Bar
      React.createElement('div', {
        key: 'statusbar',
        style: {
          height: '22px',
          background: '#007acc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          fontSize: '12px',
          color: '#ffffff'
        }
      }, [
        React.createElement('span', { key: 'left' }, 'Ready'),
        React.createElement('span', { key: 'right' }, 'VS Code Interface Active')
      ])
    ]);
  };
  
  console.log('🚀 Rendering VS Code interface...');
  root.render(React.createElement(VSCodeLayout));
  console.log('✅ VS Code interface rendered successfully!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

console.log('🏁 VS Code interface setup complete');
