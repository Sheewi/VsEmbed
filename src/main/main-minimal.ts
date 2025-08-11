import { app, BrowserWindow } from 'electron';
import * as path from 'path';

console.log('🚀 Starting VSEmbed Application...');

class MinimalVSEmbedApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    console.log('📦 Initializing app handlers...');
    
    // Handle app ready
    app.whenReady().then(() => {
      console.log('✅ App ready, creating window...');
      this.createWindow();
    });

    // Handle window closed
    app.on('window-all-closed', () => {
      console.log('🪟 All windows closed');
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Handle activate (macOS)
    app.on('activate', () => {
      console.log('🔄 App activated');
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }

  private createWindow(): void {
    console.log('🏗️ Creating main window...');

    // Create the browser window
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      title: 'VSEmbed AI DevTool',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false
      },
      show: false // Don't show until ready
    });

    // Load a simple HTML page first
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VSEmbed AI DevTool</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #1e1e1e;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
          }
          .status {
            text-align: center;
            max-width: 600px;
          }
          .success { color: #4ade80; }
          .loading { color: #fbbf24; }
          .error { color: #f87171; }
        </style>
      </head>
      <body>
        <div class="status">
          <h1>🚀 VSEmbed AI DevTool</h1>
          <p class="success">✅ Electron main process is working!</p>
          <p class="loading">⚡ Basic window rendering successful</p>
          <hr style="margin: 20px 0; border: 1px solid #444;">
          <h3>Next Steps:</h3>
          <ul style="text-align: left;">
            <li>✅ Main process initialization</li>
            <li>⏳ React renderer setup</li>
            <li>⏳ IPC communication</li>
            <li>⏳ Component integration</li>
          </ul>
        </div>
      </body>
      </html>
    `;

    // Write temporary HTML file
    const tempHtmlPath = path.join(__dirname, 'temp-minimal.html');
    require('fs').writeFileSync(tempHtmlPath, htmlContent);

    // Load the temporary file
    this.mainWindow.loadFile(tempHtmlPath);

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      console.log('✨ Window ready to show');
      this.mainWindow?.show();
      this.mainWindow?.webContents.openDevTools();
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      console.log('❌ Main window closed');
      this.mainWindow = null;
    });

    console.log('🏁 Window creation complete');
  }
}

// Initialize the minimal app
console.log('🎯 Creating minimal VSEmbed app instance...');
new MinimalVSEmbedApp();
