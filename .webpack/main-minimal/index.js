/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main/main-minimal.ts":
/*!**********************************!*\
  !*** ./src/main/main-minimal.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const path = __importStar(__webpack_require__(/*! path */ "path"));
console.log('🚀 Starting VSEmbed Application...');
class MinimalVSEmbedApp {
    constructor() {
        this.mainWindow = null;
        console.log('📦 Initializing app handlers...');
        // Handle app ready
        electron_1.app.whenReady().then(() => {
            console.log('✅ App ready, creating window...');
            this.createWindow();
        });
        // Handle window closed
        electron_1.app.on('window-all-closed', () => {
            console.log('🪟 All windows closed');
            if (process.platform !== 'darwin') {
                electron_1.app.quit();
            }
        });
        // Handle activate (macOS)
        electron_1.app.on('activate', () => {
            console.log('🔄 App activated');
            if (electron_1.BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        });
    }
    createWindow() {
        console.log('🏗️ Creating main window...');
        // Create the browser window
        this.mainWindow = new electron_1.BrowserWindow({
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
        (__webpack_require__(/*! fs */ "fs").writeFileSync)(tempHtmlPath, htmlContent);
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


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main/main-minimal.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map