// Minimal VS Code Interface - Direct DOM Manipulation
console.log('🎯 Starting VS Code interface...');

// Ensure DOM is ready
function createVSCodeInterface() {
  console.log('📦 Creating VS Code interface...');
  
  // Get root container
  const root = document.getElementById('root') || document.body;
  
  // Create VS Code layout using pure DOM manipulation (no React for now)
  // ...existing code for manual DOM creation only...
  
  console.log('✅ VS Code interface created successfully!');
  
  // Add click handlers for activity bar
  const activityButtons = root.querySelectorAll('[title="Explorer"], [title="Search"], [title="Source Control"], [title="Debug"], [title="Extensions"]');
  activityButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // Reset all buttons
      activityButtons.forEach(btn => {
        (btn as HTMLElement).style.background = 'transparent';
        (btn as HTMLElement).style.color = '#858585';
      });
      // Highlight clicked button
      (button as HTMLElement).style.background = '#37373d';
      (button as HTMLElement).style.color = '#ffffff';
      
      // Update sidebar header and content
      const sidebarHeader = root.querySelector('[style*="EXPLORER"]');
      const sidebarContent = root.querySelector('[style*="flex: 1; padding: 16px; overflow: auto;"]');
      const titles = ['EXPLORER', 'SEARCH', 'SOURCE CONTROL', 'DEBUG', 'EXTENSIONS'];
      const contents = [
        // Explorer content
        `<div style="margin-bottom: 8px; cursor: pointer;">📁 src/</div>
         <div style="margin-left: 16px; margin-bottom: 4px; cursor: pointer;">📄 main.ts</div>
         <div style="margin-left: 16px; margin-bottom: 4px; cursor: pointer;">📁 renderer/</div>
         <div style="margin-left: 32px; margin-bottom: 4px; cursor: pointer;">📄 index.tsx</div>
         <div style="margin-left: 32px; margin-bottom: 4px; cursor: pointer;">📄 App.tsx</div>
         <div style="margin-bottom: 8px; cursor: pointer;">📄 package.json</div>
         <div style="margin-bottom: 8px; cursor: pointer;">📄 README.md</div>`,
        
        // Search content
        `<div style="margin-bottom: 16px;">
           <input type="text" placeholder="Search" style="width: 100%; padding: 6px 8px; background: #3c3c3c; border: 1px solid #3c3c3c; border-radius: 3px; color: #cccccc; font-size: 13px; margin-bottom: 8px;">
           <input type="text" placeholder="Replace" style="width: 100%; padding: 6px 8px; background: #3c3c3c; border: 1px solid #3c3c3c; border-radius: 3px; color: #cccccc; font-size: 13px; margin-bottom: 8px;">
           <div style="display: flex; gap: 4px; margin-bottom: 8px;">
             <button style="padding: 4px 6px; background: #3c3c3c; border: 1px solid #3c3c3c; border-radius: 3px; color: #cccccc; font-size: 11px; cursor: pointer;" title="Match Case">Aa</button>
             <button style="padding: 4px 6px; background: #3c3c3c; border: 1px solid #3c3c3c; border-radius: 3px; color: #cccccc; font-size: 11px; cursor: pointer;" title="Match Whole Word">Ab</button>
             <button style="padding: 4px 6px; background: #3c3c3c; border: 1px solid #3c3c3c; border-radius: 3px; color: #cccccc; font-size: 11px; cursor: pointer;" title="Use Regular Expression">.*</button>
           </div>
           <input type="text" placeholder="files to include" style="width: 100%; padding: 6px 8px; background: #3c3c3c; border: 1px solid #3c3c3c; border-radius: 3px; color: #cccccc; font-size: 13px; margin-bottom: 4px;">
           <input type="text" placeholder="files to exclude" style="width: 100%; padding: 6px 8px; background: #3c3c3c; border: 1px solid #3c3c3c; border-radius: 3px; color: #cccccc; font-size: 13px;">
         </div>
         <div style="color: #888; font-size: 12px;">No results found</div>`,
        
        // Source Control content
        `<div style="margin-bottom: 16px;">
           <div style="padding: 8px; background: #3c3c3c; border-radius: 4px; margin-bottom: 8px;">
             <div style="font-size: 13px; margin-bottom: 4px;">Changes</div>
             <div style="font-size: 12px; color: #888;">No changes</div>
           </div>
           <button style="width: 100%; padding: 8px; background: #0e639c; border: none; border-radius: 4px; color: white; cursor: pointer; font-size: 13px;">Commit</button>
         </div>`,
        
        // Debug content
        `<div style="margin-bottom: 16px;">
           <div style="font-size: 13px; margin-bottom: 8px;">VARIABLES</div>
           <div style="color: #888; font-size: 12px; margin-bottom: 16px;">Not available</div>
           <div style="font-size: 13px; margin-bottom: 8px;">WATCH</div>
           <div style="color: #888; font-size: 12px; margin-bottom: 16px;">No watch expressions</div>
           <div style="font-size: 13px; margin-bottom: 8px;">CALL STACK</div>
           <div style="color: #888; font-size: 12px;">Not paused</div>
         </div>`,
        
        // Extensions content
        `<div style="margin-bottom: 16px;">
           <input type="text" placeholder="Search Extensions in Marketplace" style="width: 100%; padding: 6px 8px; background: #3c3c3c; border: 1px solid #3c3c3c; border-radius: 3px; color: #cccccc; font-size: 13px; margin-bottom: 12px;">
           <div style="font-size: 13px; margin-bottom: 8px;">INSTALLED</div>
           <div style="padding: 8px; border: 1px solid #3c3c3c; border-radius: 4px; margin-bottom: 8px;">
             <div style="font-size: 12px; font-weight: bold;">VS Code Extension</div>
             <div style="font-size: 11px; color: #888;">Sample extension</div>
           </div>
         </div>`
      ];
      
      if (sidebarHeader) {
        // Top bar
        const topBar = document.createElement('div');
  topBar.className = 'top-bar';
  topBar.style.display = 'flex';
  topBar.style.alignItems = 'center';
  topBar.style.height = '30px';
  topBar.style.background = '#1e1e1e';
  topBar.style.color = '#d4d4d4';
  topBar.style.borderBottom = '1px solid #222';
  topBar.style.fontSize = '13px';
  topBar.style.userSelect = 'none';
  topBar.style.zIndex = '100';
  topBar.style.position = 'relative';

        // Menu items (left)
        const menuItems = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];
        const menuContainer = document.createElement('div');
        menuContainer.className = 'menu-container';
        menuContainer.style.display = 'flex';
  menuContainer.style.gap = '12px';
  menuContainer.style.marginLeft = '10px';
        menuContainer.style.height = '100%';
        menuItems.forEach(item => {
          const btn = document.createElement('div');
          btn.className = 'menu-item';
          btn.textContent = item;
          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.cursor = 'pointer';
          btn.style.height = '100%';
          btn.style.padding = '0 10px';
          btn.style.borderRadius = '2px';
          btn.onmouseenter = () => {
            btn.style.background = '#252526';
            btn.style.color = '#fff';
          };
          btn.onmouseleave = () => {
            btn.style.background = '';
            btn.style.color = '#d4d4d4';
          };
          menuContainer.appendChild(btn);
        });

        // Search bar (center in top bar)
        const searchBar = document.createElement('input');
        searchBar.type = 'text';
        searchBar.className = 'top-search-bar';
        searchBar.placeholder = 'Search...';
        searchBar.style.height = '22px';
        searchBar.style.width = '220px';
        searchBar.style.borderRadius = '4px';
        searchBar.style.border = 'none';
        searchBar.style.padding = '0 10px';
  searchBar.style.background = '#252526';
  searchBar.style.color = '#d4d4d4';
        searchBar.style.fontSize = '13px';
        searchBar.style.outline = 'none';

        // Panel toggle buttons (right of search bar)
        const panelToggles = [
          { icon: '🗂', title: 'Explorer' },
          { icon: '🔍', title: 'Search' },
          { icon: '🌿', title: 'Source Control' },
          { icon: '🐞', title: 'Run & Debug' },
          { icon: '🧩', title: 'Extensions' }
        ];
        const panelToggleContainer = document.createElement('div');
        panelToggleContainer.className = 'panel-toggle-container';
        panelToggleContainer.style.display = 'flex';
  panelToggleContainer.style.gap = '8px';

        panelToggles.forEach(({ icon, title }) => {
          const btn = document.createElement('div');
          btn.className = 'panel-toggle-btn';
          btn.title = title;
          btn.textContent = icon;
          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'center';
          btn.style.width = '26px';
          btn.style.height = '26px';
          btn.style.cursor = 'pointer';
          btn.style.borderRadius = '3px';
          btn.onmouseenter = () => {
            btn.style.background = '#252526';
            btn.style.color = '#fff';
          };
          btn.onmouseleave = () => {
            btn.style.background = '';
            btn.style.color = '#d4d4d4';
          };
          panelToggleContainer.appendChild(btn);
        });

        // Window controls (far right)
        const windowControls = [
          { icon: '—', title: 'Minimize' },
          { icon: '□', title: 'Maximize' },
          { icon: '✕', title: 'Close' }
        ];
        const windowControlContainer = document.createElement('div');
        windowControlContainer.className = 'window-control-container';
        windowControlContainer.style.display = 'flex';
  windowControlContainer.style.gap = '1px';
        windowControlContainer.style.marginRight = '8px';

        windowControls.forEach(({ icon, title }) => {
          const btn = document.createElement('div');
          btn.className = 'window-control-btn';
          btn.title = title;
          btn.textContent = icon;
          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'center';
          btn.style.width = '30px';
          btn.style.height = '26px';
          btn.style.cursor = 'pointer';
          btn.style.borderRadius = '3px';
          btn.onmouseenter = () => {
            btn.style.background = '#252526';
            btn.style.color = '#fff';
          };
          btn.onmouseleave = () => {
            btn.style.background = '';
            btn.style.color = '#d4d4d4';
          };
          windowControlContainer.appendChild(btn);
        });

        // Layout: flex row, precise spacing
        topBar.appendChild(menuContainer);

        const spacer1 = document.createElement('div');
        spacer1.style.flexBasis = '1.2in';
        topBar.appendChild(spacer1);

        topBar.appendChild(searchBar);

        const spacer2 = document.createElement('div');
        spacer2.style.flexBasis = '5in';
        topBar.appendChild(spacer2);

        topBar.appendChild(panelToggleContainer);

        const spacer3 = document.createElement('div');
        spacer3.style.flexBasis = '3in';
        topBar.appendChild(spacer3);

        topBar.appendChild(windowControlContainer);

        // Add top bar to root
        root.appendChild(topBar);
      }
    });
}
