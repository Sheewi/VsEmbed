/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/renderer/styles/AIInterfaceManager.css":
/*!********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/renderer/styles/AIInterfaceManager.css ***!
  \********************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* AI Interface Manager Styles */
.ai-interface-manager {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Segoe UI', system-ui, sans-serif;
  overflow: hidden;
}

/* Loading Screen */
.ai-interface-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #1e1e1e;
  color: #d4d4d4;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #333;
  border-top: 3px solid #007acc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text h2 {
  margin: 0 0 10px 0;
  color: #007acc;
}

.loading-text p {
  margin: 0;
  color: #888;
}

/* Interface Layout */
.ai-interface-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Top Navigation */
.ai-top-nav {
  display: flex;
  align-items: center;
  height: 35px;
  background: #2d2d30;
  border-bottom: 1px solid #333;
  padding: 0 10px;
  z-index: 1000;
}

.ai-nav-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.ai-logo {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
}

.logo-icon {
  font-size: 16px;
}

.logo-text {
  color: #007acc;
}

.page-breadcrumb {
  color: #888;
  font-size: 13px;
}

.ai-nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.global-search {
  position: relative;
}

.global-search-input {
  width: 300px;
  height: 24px;
  padding: 0 10px;
  background: #3c3c3c;
  border: 1px solid #555;
  border-radius: 4px;
  color: #d4d4d4;
  font-size: 13px;
  outline: none;
}

.global-search-input:focus {
  border-color: #007acc;
}

.ai-nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-toggle,
.ai-toggle {
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid #555;
  border-radius: 4px;
  color: #d4d4d4;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.mode-toggle:hover,
.ai-toggle:hover {
  background: #404040;
  border-color: #007acc;
}

/* Main Content */
.ai-main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.ai-sidebar {
  width: 300px;
  background: #252526;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 15px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.page-count {
  background: #007acc;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.page-categories {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.category-section {
  margin-bottom: 20px;
}

.category-title {
  font-size: 11px;
  font-weight: 600;
  color: #888;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-pages {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.page-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: transparent;
  border: none;
  color: #d4d4d4;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  text-align: left;
  width: 100%;
}

.page-button:hover {
  background: #2a2d2e;
}

.page-button.active {
  background: #094771;
  color: #ffffff;
}

.page-icon {
  font-size: 14px;
  width: 16px;
  text-align: center;
}

.page-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Page Content */
.ai-page-content {
  flex: 1;
  background: #1e1e1e;
  overflow: auto;
  padding: 20px;
}

/* AI Chat Panel */
.ai-chat-panel {
  width: 400px;
  background: #252526;
  border-left: 1px solid #333;
  display: flex;
  flex-direction: column;
}

.embedded-grok {
  height: 100%;
  border: none;
}

/* Bottom Panel */
.ai-bottom-panel {
  background: #252526;
  border-top: 1px solid #333;
  min-height: 200px;
  max-height: 400px;
  resize: vertical;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.bottom-section {
  flex: 1;
  overflow: auto;
}

.status-bar {
  height: 22px;
  background: #007acc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 12px;
}

.status-left {
  display: flex;
  gap: 15px;
}

.status-item {
  display: flex;
  align-items: center;
}

.status-right {
  display: flex;
  gap: 8px;
}

.panel-toggle {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
}

.panel-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.panel-toggle.active {
  background: rgba(255, 255, 255, 0.2);
}

/* Active Components Overlay */
.active-components-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10000;
}

.ai-component {
  position: absolute;
  pointer-events: auto;
}

.ai-component-widget {
  background: #252526;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 10px;
}

.ai-component-panel {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 4px;
}

.ai-component-modal {
  background: #2d2d30;
  border: 1px solid #333;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.ai-component-overlay {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(2px);
}

/* Mode Variations */
.mode-minimal .ai-sidebar {
  width: 60px;
}

.mode-minimal .page-title {
  display: none;
}

.mode-minimal .sidebar-header h3,
.mode-minimal .page-count {
  display: none;
}

.mode-focus .ai-sidebar,
.mode-focus .ai-chat-panel {
  display: none;
}

.mode-focus .ai-page-content {
  padding: 40px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .ai-sidebar {
    width: 250px;
  }
  
  .ai-chat-panel {
    width: 320px;
  }
}

@media (max-width: 768px) {
  .ai-main-content {
    flex-direction: column;
  }
  
  .ai-sidebar,
  .ai-chat-panel {
    width: 100%;
    height: 200px;
  }
  
  .global-search-input {
    width: 200px;
  }
}

/* Animations */
.ai-interface-manager * {
  transition: all 0.2s ease;
}

.page-button {
  transition: background-color 0.15s ease;
}

.ai-component {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`, "",{"version":3,"sources":["webpack://./src/renderer/styles/AIInterfaceManager.css"],"names":[],"mappings":"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","sourcesContent":["/* AI Interface Manager Styles */\n.ai-interface-manager {\n  display: flex;\n  flex-direction: column;\n  height: 100vh;\n  width: 100vw;\n  background: #1e1e1e;\n  color: #d4d4d4;\n  font-family: 'Segoe UI', system-ui, sans-serif;\n  overflow: hidden;\n}\n\n/* Loading Screen */\n.ai-interface-loading {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  background: #1e1e1e;\n  color: #d4d4d4;\n}\n\n.loading-spinner {\n  width: 40px;\n  height: 40px;\n  border: 3px solid #333;\n  border-top: 3px solid #007acc;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n  margin-bottom: 20px;\n}\n\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n.loading-text h2 {\n  margin: 0 0 10px 0;\n  color: #007acc;\n}\n\n.loading-text p {\n  margin: 0;\n  color: #888;\n}\n\n/* Interface Layout */\n.ai-interface-layout {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n/* Top Navigation */\n.ai-top-nav {\n  display: flex;\n  align-items: center;\n  height: 35px;\n  background: #2d2d30;\n  border-bottom: 1px solid #333;\n  padding: 0 10px;\n  z-index: 1000;\n}\n\n.ai-nav-left {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n}\n\n.ai-logo {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  font-weight: bold;\n}\n\n.logo-icon {\n  font-size: 16px;\n}\n\n.logo-text {\n  color: #007acc;\n}\n\n.page-breadcrumb {\n  color: #888;\n  font-size: 13px;\n}\n\n.ai-nav-center {\n  flex: 1;\n  display: flex;\n  justify-content: center;\n}\n\n.global-search {\n  position: relative;\n}\n\n.global-search-input {\n  width: 300px;\n  height: 24px;\n  padding: 0 10px;\n  background: #3c3c3c;\n  border: 1px solid #555;\n  border-radius: 4px;\n  color: #d4d4d4;\n  font-size: 13px;\n  outline: none;\n}\n\n.global-search-input:focus {\n  border-color: #007acc;\n}\n\n.ai-nav-right {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.mode-toggle,\n.ai-toggle {\n  width: 28px;\n  height: 28px;\n  background: transparent;\n  border: 1px solid #555;\n  border-radius: 4px;\n  color: #d4d4d4;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n}\n\n.mode-toggle:hover,\n.ai-toggle:hover {\n  background: #404040;\n  border-color: #007acc;\n}\n\n/* Main Content */\n.ai-main-content {\n  display: flex;\n  flex: 1;\n  overflow: hidden;\n}\n\n/* Sidebar */\n.ai-sidebar {\n  width: 300px;\n  background: #252526;\n  border-right: 1px solid #333;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n\n.sidebar-header {\n  padding: 15px;\n  border-bottom: 1px solid #333;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.sidebar-header h3 {\n  margin: 0;\n  font-size: 14px;\n  font-weight: 600;\n}\n\n.page-count {\n  background: #007acc;\n  color: white;\n  padding: 2px 8px;\n  border-radius: 10px;\n  font-size: 11px;\n}\n\n.page-categories {\n  flex: 1;\n  overflow-y: auto;\n  padding: 10px;\n}\n\n.category-section {\n  margin-bottom: 20px;\n}\n\n.category-title {\n  font-size: 11px;\n  font-weight: 600;\n  color: #888;\n  margin: 0 0 8px 0;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n\n.category-pages {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.page-button {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 6px 8px;\n  background: transparent;\n  border: none;\n  color: #d4d4d4;\n  cursor: pointer;\n  border-radius: 4px;\n  font-size: 13px;\n  text-align: left;\n  width: 100%;\n}\n\n.page-button:hover {\n  background: #2a2d2e;\n}\n\n.page-button.active {\n  background: #094771;\n  color: #ffffff;\n}\n\n.page-icon {\n  font-size: 14px;\n  width: 16px;\n  text-align: center;\n}\n\n.page-title {\n  flex: 1;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n/* Page Content */\n.ai-page-content {\n  flex: 1;\n  background: #1e1e1e;\n  overflow: auto;\n  padding: 20px;\n}\n\n/* AI Chat Panel */\n.ai-chat-panel {\n  width: 400px;\n  background: #252526;\n  border-left: 1px solid #333;\n  display: flex;\n  flex-direction: column;\n}\n\n.embedded-grok {\n  height: 100%;\n  border: none;\n}\n\n/* Bottom Panel */\n.ai-bottom-panel {\n  background: #252526;\n  border-top: 1px solid #333;\n  min-height: 200px;\n  max-height: 400px;\n  resize: vertical;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n\n.bottom-section {\n  flex: 1;\n  overflow: auto;\n}\n\n.status-bar {\n  height: 22px;\n  background: #007acc;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 10px;\n  font-size: 12px;\n}\n\n.status-left {\n  display: flex;\n  gap: 15px;\n}\n\n.status-item {\n  display: flex;\n  align-items: center;\n}\n\n.status-right {\n  display: flex;\n  gap: 8px;\n}\n\n.panel-toggle {\n  background: transparent;\n  border: none;\n  color: white;\n  cursor: pointer;\n  padding: 2px 8px;\n  border-radius: 3px;\n  font-size: 11px;\n}\n\n.panel-toggle:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n\n.panel-toggle.active {\n  background: rgba(255, 255, 255, 0.2);\n}\n\n/* Active Components Overlay */\n.active-components-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  pointer-events: none;\n  z-index: 10000;\n}\n\n.ai-component {\n  position: absolute;\n  pointer-events: auto;\n}\n\n.ai-component-widget {\n  background: #252526;\n  border: 1px solid #333;\n  border-radius: 4px;\n  padding: 10px;\n}\n\n.ai-component-panel {\n  background: #1e1e1e;\n  border: 1px solid #333;\n  border-radius: 4px;\n}\n\n.ai-component-modal {\n  background: #2d2d30;\n  border: 1px solid #333;\n  border-radius: 6px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);\n}\n\n.ai-component-overlay {\n  background: rgba(0, 0, 0, 0.8);\n  backdrop-filter: blur(2px);\n}\n\n/* Mode Variations */\n.mode-minimal .ai-sidebar {\n  width: 60px;\n}\n\n.mode-minimal .page-title {\n  display: none;\n}\n\n.mode-minimal .sidebar-header h3,\n.mode-minimal .page-count {\n  display: none;\n}\n\n.mode-focus .ai-sidebar,\n.mode-focus .ai-chat-panel {\n  display: none;\n}\n\n.mode-focus .ai-page-content {\n  padding: 40px;\n}\n\n/* Responsive Design */\n@media (max-width: 1024px) {\n  .ai-sidebar {\n    width: 250px;\n  }\n  \n  .ai-chat-panel {\n    width: 320px;\n  }\n}\n\n@media (max-width: 768px) {\n  .ai-main-content {\n    flex-direction: column;\n  }\n  \n  .ai-sidebar,\n  .ai-chat-panel {\n    width: 100%;\n    height: 200px;\n  }\n  \n  .global-search-input {\n    width: 200px;\n  }\n}\n\n/* Animations */\n.ai-interface-manager * {\n  transition: all 0.2s ease;\n}\n\n.page-button {\n  transition: background-color 0.15s ease;\n}\n\n.ai-component {\n  animation: fadeIn 0.3s ease;\n}\n\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/renderer/styles/AIWorkspaceManager.css":
/*!********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/renderer/styles/AIWorkspaceManager.css ***!
  \********************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* AIWorkspaceManager Styles */
.ai-workspace-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  color: #d4d4d4;
}

.workspace-header {
  padding: 20px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.workspace-header h2 {
  margin: 0;
  color: #d4d4d4;
  font-size: 18px;
}

.workspace-stats {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #888;
}

.workspace-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.workspace-sidebar {
  width: 300px;
  background: #252526;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
}

.workspace-list {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.workspace-list h3 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #d4d4d4;
}

.workspace-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 5px;
  transition: background-color 0.15s ease;
}

.workspace-item:hover {
  background: #2a2d2e;
}

.workspace-item.active {
  background: #094771;
}

.workspace-icon {
  font-size: 20px;
}

.workspace-info {
  flex: 1;
}

.workspace-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #d4d4d4;
}

.workspace-info p {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #888;
}

.workspace-info small {
  font-size: 11px;
  color: #666;
}

.workspace-actions {
  padding: 15px;
  border-top: 1px solid #333;
}

.create-workspace-btn {
  width: 100%;
  padding: 10px;
  background: #007acc;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 13px;
}

.create-workspace-btn:hover {
  background: #005a9e;
}

.workspace-main {
  flex: 1;
  background: #1e1e1e;
  overflow: auto;
}

.workspace-details {
  padding: 20px;
}

.workspace-header-details {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.workspace-header-details h3 {
  margin: 0;
  font-size: 20px;
  color: #d4d4d4;
}

.workspace-type {
  background: #007acc;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  text-transform: uppercase;
}

.workspace-tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 20px;
  border-bottom: 1px solid #333;
}

.tab {
  padding: 10px 15px;
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  font-size: 13px;
}

.tab:hover {
  color: #d4d4d4;
}

.tab.active {
  color: #007acc;
  border-bottom-color: #007acc;
}

.workspace-content-area {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
}

.file-explorer {
  background: #252526;
  border-radius: 6px;
  overflow: hidden;
}

.explorer-header {
  padding: 15px;
  background: #2d2d30;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.explorer-header h4 {
  margin: 0;
  font-size: 14px;
  color: #d4d4d4;
}

.add-file-btn {
  padding: 6px 12px;
  background: #007acc;
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-size: 12px;
}

.add-file-btn:hover {
  background: #005a9e;
}

.file-tree {
  padding: 15px;
}

.empty-workspace {
  text-align: center;
  padding: 40px 20px;
  color: #888;
}

.empty-workspace button {
  margin-top: 15px;
  padding: 10px 20px;
  background: #007acc;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 13px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 2px;
}

.file-item:hover {
  background: #2a2d2e;
}

.file-icon {
  font-size: 14px;
}

.file-name {
  flex: 1;
  font-size: 13px;
  color: #d4d4d4;
}

.ai-analysis-indicator {
  display: flex;
  gap: 8px;
  font-size: 11px;
}

.complexity,
.errors {
  background: #333;
  padding: 2px 6px;
  border-radius: 10px;
}

.ai-config-panel {
  background: #252526;
  border-radius: 6px;
  padding: 15px;
}

.ai-config-panel h4 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #d4d4d4;
}

.ai-features,
.ai-models {
  margin-bottom: 15px;
}

.ai-features h5,
.ai-models h5 {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #888;
}

.feature-tag,
.model-tag {
  display: inline-block;
  background: #007acc;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  margin: 2px 4px 2px 0;
}

.no-workspace-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  text-align: center;
}

.no-workspace-selected h3 {
  margin: 0 0 10px 0;
  color: #d4d4d4;
}

.ai-workspace-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #d4d4d4;
}

.ai-workspace-loading .loading-spinner {
  width: 30px;
  height: 30px;
  border: 2px solid #333;
  border-top: 2px solid #007acc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@media (max-width: 1024px) {
  .workspace-content-area {
    grid-template-columns: 1fr;
  }
  
  .workspace-sidebar {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .workspace-content {
    flex-direction: column;
  }
  
  .workspace-sidebar {
    width: 100%;
    height: 200px;
  }
  
  .workspace-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
`, "",{"version":3,"sources":["webpack://./src/renderer/styles/AIWorkspaceManager.css"],"names":[],"mappings":"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","sourcesContent":["/* AIWorkspaceManager Styles */\n.ai-workspace-manager {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  background: #1e1e1e;\n  color: #d4d4d4;\n}\n\n.workspace-header {\n  padding: 20px;\n  border-bottom: 1px solid #333;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.workspace-header h2 {\n  margin: 0;\n  color: #d4d4d4;\n  font-size: 18px;\n}\n\n.workspace-stats {\n  display: flex;\n  gap: 20px;\n  font-size: 13px;\n  color: #888;\n}\n\n.workspace-content {\n  flex: 1;\n  display: flex;\n  overflow: hidden;\n}\n\n.workspace-sidebar {\n  width: 300px;\n  background: #252526;\n  border-right: 1px solid #333;\n  display: flex;\n  flex-direction: column;\n}\n\n.workspace-list {\n  flex: 1;\n  padding: 15px;\n  overflow-y: auto;\n}\n\n.workspace-list h3 {\n  margin: 0 0 15px 0;\n  font-size: 14px;\n  color: #d4d4d4;\n}\n\n.workspace-item {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px;\n  border-radius: 4px;\n  cursor: pointer;\n  margin-bottom: 5px;\n  transition: background-color 0.15s ease;\n}\n\n.workspace-item:hover {\n  background: #2a2d2e;\n}\n\n.workspace-item.active {\n  background: #094771;\n}\n\n.workspace-icon {\n  font-size: 20px;\n}\n\n.workspace-info {\n  flex: 1;\n}\n\n.workspace-info h4 {\n  margin: 0 0 4px 0;\n  font-size: 14px;\n  color: #d4d4d4;\n}\n\n.workspace-info p {\n  margin: 0 0 4px 0;\n  font-size: 12px;\n  color: #888;\n}\n\n.workspace-info small {\n  font-size: 11px;\n  color: #666;\n}\n\n.workspace-actions {\n  padding: 15px;\n  border-top: 1px solid #333;\n}\n\n.create-workspace-btn {\n  width: 100%;\n  padding: 10px;\n  background: #007acc;\n  border: none;\n  border-radius: 4px;\n  color: white;\n  cursor: pointer;\n  font-size: 13px;\n}\n\n.create-workspace-btn:hover {\n  background: #005a9e;\n}\n\n.workspace-main {\n  flex: 1;\n  background: #1e1e1e;\n  overflow: auto;\n}\n\n.workspace-details {\n  padding: 20px;\n}\n\n.workspace-header-details {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  margin-bottom: 20px;\n}\n\n.workspace-header-details h3 {\n  margin: 0;\n  font-size: 20px;\n  color: #d4d4d4;\n}\n\n.workspace-type {\n  background: #007acc;\n  color: white;\n  padding: 4px 8px;\n  border-radius: 12px;\n  font-size: 11px;\n  text-transform: uppercase;\n}\n\n.workspace-tabs {\n  display: flex;\n  gap: 2px;\n  margin-bottom: 20px;\n  border-bottom: 1px solid #333;\n}\n\n.tab {\n  padding: 10px 15px;\n  background: transparent;\n  border: none;\n  color: #888;\n  cursor: pointer;\n  border-bottom: 2px solid transparent;\n  font-size: 13px;\n}\n\n.tab:hover {\n  color: #d4d4d4;\n}\n\n.tab.active {\n  color: #007acc;\n  border-bottom-color: #007acc;\n}\n\n.workspace-content-area {\n  display: grid;\n  grid-template-columns: 1fr 300px;\n  gap: 20px;\n}\n\n.file-explorer {\n  background: #252526;\n  border-radius: 6px;\n  overflow: hidden;\n}\n\n.explorer-header {\n  padding: 15px;\n  background: #2d2d30;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid #333;\n}\n\n.explorer-header h4 {\n  margin: 0;\n  font-size: 14px;\n  color: #d4d4d4;\n}\n\n.add-file-btn {\n  padding: 6px 12px;\n  background: #007acc;\n  border: none;\n  border-radius: 3px;\n  color: white;\n  cursor: pointer;\n  font-size: 12px;\n}\n\n.add-file-btn:hover {\n  background: #005a9e;\n}\n\n.file-tree {\n  padding: 15px;\n}\n\n.empty-workspace {\n  text-align: center;\n  padding: 40px 20px;\n  color: #888;\n}\n\n.empty-workspace button {\n  margin-top: 15px;\n  padding: 10px 20px;\n  background: #007acc;\n  border: none;\n  border-radius: 4px;\n  color: white;\n  cursor: pointer;\n  font-size: 13px;\n}\n\n.file-item {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 6px 8px;\n  border-radius: 3px;\n  cursor: pointer;\n  margin-bottom: 2px;\n}\n\n.file-item:hover {\n  background: #2a2d2e;\n}\n\n.file-icon {\n  font-size: 14px;\n}\n\n.file-name {\n  flex: 1;\n  font-size: 13px;\n  color: #d4d4d4;\n}\n\n.ai-analysis-indicator {\n  display: flex;\n  gap: 8px;\n  font-size: 11px;\n}\n\n.complexity,\n.errors {\n  background: #333;\n  padding: 2px 6px;\n  border-radius: 10px;\n}\n\n.ai-config-panel {\n  background: #252526;\n  border-radius: 6px;\n  padding: 15px;\n}\n\n.ai-config-panel h4 {\n  margin: 0 0 15px 0;\n  font-size: 14px;\n  color: #d4d4d4;\n}\n\n.ai-features,\n.ai-models {\n  margin-bottom: 15px;\n}\n\n.ai-features h5,\n.ai-models h5 {\n  margin: 0 0 8px 0;\n  font-size: 12px;\n  color: #888;\n}\n\n.feature-tag,\n.model-tag {\n  display: inline-block;\n  background: #007acc;\n  color: white;\n  padding: 3px 8px;\n  border-radius: 12px;\n  font-size: 11px;\n  margin: 2px 4px 2px 0;\n}\n\n.no-workspace-selected {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  color: #888;\n  text-align: center;\n}\n\n.no-workspace-selected h3 {\n  margin: 0 0 10px 0;\n  color: #d4d4d4;\n}\n\n.ai-workspace-loading {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  color: #d4d4d4;\n}\n\n.ai-workspace-loading .loading-spinner {\n  width: 30px;\n  height: 30px;\n  border: 2px solid #333;\n  border-top: 2px solid #007acc;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n  margin-bottom: 15px;\n}\n\n@media (max-width: 1024px) {\n  .workspace-content-area {\n    grid-template-columns: 1fr;\n  }\n  \n  .workspace-sidebar {\n    width: 250px;\n  }\n}\n\n@media (max-width: 768px) {\n  .workspace-content {\n    flex-direction: column;\n  }\n  \n  .workspace-sidebar {\n    width: 100%;\n    height: 200px;\n  }\n  \n  .workspace-header {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 10px;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/renderer/styles/App.css":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/renderer/styles/App.css ***!
  \*****************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* App Styles */
.app {
  height: 100vh;
  width: 100vw;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  overflow: hidden;
}

/* Global Reset */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  overflow: hidden;
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

::-webkit-scrollbar-track {
  background: #1e1e1e;
}

::-webkit-scrollbar-thumb {
  background: #424242;
  border-radius: 7px;
  border: 3px solid #1e1e1e;
}

::-webkit-scrollbar-thumb:hover {
  background: #4f4f4f;
}

::-webkit-scrollbar-corner {
  background: #1e1e1e;
}

/* Button Reset */
button {
  font-family: inherit;
  outline: none;
}

button:focus-visible {
  outline: 2px solid #007acc;
  outline-offset: 2px;
}

/* Input Reset */
input, textarea {
  font-family: inherit;
  outline: none;
}

input:focus, textarea:focus {
  outline: 2px solid #007acc;
  outline-offset: 1px;
}

/* Focus Styles */
.focus-visible {
  outline: 2px solid #007acc;
  outline-offset: 2px;
}

/* Utility Classes */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* Loading States */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #333;
  border-radius: 50%;
  border-top-color: #007acc;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error States */
.error {
  color: #f14c4c;
}

.error-background {
  background: rgba(241, 76, 76, 0.1);
  border: 1px solid rgba(241, 76, 76, 0.3);
}

/* Success States */
.success {
  color: #89d185;
}

.success-background {
  background: rgba(137, 209, 133, 0.1);
  border: 1px solid rgba(137, 209, 133, 0.3);
}

/* Warning States */
.warning {
  color: #f1c232;
}

.warning-background {
  background: rgba(241, 194, 50, 0.1);
  border: 1px solid rgba(241, 194, 50, 0.3);
}

/* Theme Variables */
:root {
  /* Colors */
  --vscode-foreground: #d4d4d4;
  --vscode-background: #1e1e1e;
  --vscode-sidebar-background: #252526;
  --vscode-panel-background: #252526;
  --vscode-border: #333333;
  --vscode-focus-border: #007acc;
  --vscode-selection-background: #094771;
  --vscode-hover-background: #2a2d2e;
  --vscode-button-background: #007acc;
  --vscode-button-hover-background: #005a9e;
  --vscode-input-background: #3c3c3c;
  --vscode-input-border: #555555;
  --vscode-error-foreground: #f14c4c;
  --vscode-warning-foreground: #f1c232;
  --vscode-success-foreground: #89d185;
  
  /* Typography */
  --vscode-font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  --vscode-font-size: 13px;
  --vscode-font-weight: 400;
  --vscode-line-height: 1.4;
  
  /* Spacing */
  --vscode-padding-small: 4px;
  --vscode-padding-medium: 8px;
  --vscode-padding-large: 12px;
  --vscode-padding-xl: 16px;
  --vscode-margin-small: 4px;
  --vscode-margin-medium: 8px;
  --vscode-margin-large: 12px;
  --vscode-margin-xl: 16px;
  
  /* Layout */
  --vscode-border-radius: 4px;
  --vscode-border-width: 1px;
  
  /* Animations */
  --vscode-transition-duration: 0.2s;
  --vscode-transition-timing: ease;
}

/* Dark Theme */
[data-theme="dark"] {
  --vscode-foreground: #d4d4d4;
  --vscode-background: #1e1e1e;
  --vscode-sidebar-background: #252526;
  --vscode-panel-background: #252526;
  --vscode-border: #333333;
}

/* Light Theme */
[data-theme="light"] {
  --vscode-foreground: #333333;
  --vscode-background: #ffffff;
  --vscode-sidebar-background: #f3f3f3;
  --vscode-panel-background: #f3f3f3;
  --vscode-border: #e1e1e1;
}

/* High Contrast Theme */
[data-theme="high-contrast"] {
  --vscode-foreground: #ffffff;
  --vscode-background: #000000;
  --vscode-sidebar-background: #000000;
  --vscode-panel-background: #000000;
  --vscode-border: #ffffff;
  --vscode-focus-border: #f38518;
}

/* Print Styles */
@media print {
  .ai-interface-manager {
    background: white !important;
    color: black !important;
  }
  
  .ai-sidebar,
  .ai-chat-panel,
  .ai-bottom-panel {
    display: none !important;
  }
  
  .ai-page-content {
    width: 100% !important;
    margin: 0 !important;
    padding: 20px !important;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`, "",{"version":3,"sources":["webpack://./src/renderer/styles/App.css"],"names":[],"mappings":"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","sourcesContent":["/* App Styles */\n.app {\n  height: 100vh;\n  width: 100vw;\n  background: #1e1e1e;\n  color: #d4d4d4;\n  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;\n  overflow: hidden;\n}\n\n/* Global Reset */\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  padding: 0;\n  background: #1e1e1e;\n  color: #d4d4d4;\n  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;\n  overflow: hidden;\n}\n\n/* Scrollbar Styles */\n::-webkit-scrollbar {\n  width: 14px;\n  height: 14px;\n}\n\n::-webkit-scrollbar-track {\n  background: #1e1e1e;\n}\n\n::-webkit-scrollbar-thumb {\n  background: #424242;\n  border-radius: 7px;\n  border: 3px solid #1e1e1e;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: #4f4f4f;\n}\n\n::-webkit-scrollbar-corner {\n  background: #1e1e1e;\n}\n\n/* Button Reset */\nbutton {\n  font-family: inherit;\n  outline: none;\n}\n\nbutton:focus-visible {\n  outline: 2px solid #007acc;\n  outline-offset: 2px;\n}\n\n/* Input Reset */\ninput, textarea {\n  font-family: inherit;\n  outline: none;\n}\n\ninput:focus, textarea:focus {\n  outline: 2px solid #007acc;\n  outline-offset: 1px;\n}\n\n/* Focus Styles */\n.focus-visible {\n  outline: 2px solid #007acc;\n  outline-offset: 2px;\n}\n\n/* Utility Classes */\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n\n.visually-hidden {\n  position: absolute !important;\n  width: 1px !important;\n  height: 1px !important;\n  padding: 0 !important;\n  margin: -1px !important;\n  overflow: hidden !important;\n  clip: rect(0, 0, 0, 0) !important;\n  white-space: nowrap !important;\n  border: 0 !important;\n}\n\n/* Loading States */\n.loading {\n  opacity: 0.6;\n  pointer-events: none;\n}\n\n.spinner {\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n  border: 2px solid #333;\n  border-radius: 50%;\n  border-top-color: #007acc;\n  animation: spin 1s ease-in-out infinite;\n}\n\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n\n/* Error States */\n.error {\n  color: #f14c4c;\n}\n\n.error-background {\n  background: rgba(241, 76, 76, 0.1);\n  border: 1px solid rgba(241, 76, 76, 0.3);\n}\n\n/* Success States */\n.success {\n  color: #89d185;\n}\n\n.success-background {\n  background: rgba(137, 209, 133, 0.1);\n  border: 1px solid rgba(137, 209, 133, 0.3);\n}\n\n/* Warning States */\n.warning {\n  color: #f1c232;\n}\n\n.warning-background {\n  background: rgba(241, 194, 50, 0.1);\n  border: 1px solid rgba(241, 194, 50, 0.3);\n}\n\n/* Theme Variables */\n:root {\n  /* Colors */\n  --vscode-foreground: #d4d4d4;\n  --vscode-background: #1e1e1e;\n  --vscode-sidebar-background: #252526;\n  --vscode-panel-background: #252526;\n  --vscode-border: #333333;\n  --vscode-focus-border: #007acc;\n  --vscode-selection-background: #094771;\n  --vscode-hover-background: #2a2d2e;\n  --vscode-button-background: #007acc;\n  --vscode-button-hover-background: #005a9e;\n  --vscode-input-background: #3c3c3c;\n  --vscode-input-border: #555555;\n  --vscode-error-foreground: #f14c4c;\n  --vscode-warning-foreground: #f1c232;\n  --vscode-success-foreground: #89d185;\n  \n  /* Typography */\n  --vscode-font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;\n  --vscode-font-size: 13px;\n  --vscode-font-weight: 400;\n  --vscode-line-height: 1.4;\n  \n  /* Spacing */\n  --vscode-padding-small: 4px;\n  --vscode-padding-medium: 8px;\n  --vscode-padding-large: 12px;\n  --vscode-padding-xl: 16px;\n  --vscode-margin-small: 4px;\n  --vscode-margin-medium: 8px;\n  --vscode-margin-large: 12px;\n  --vscode-margin-xl: 16px;\n  \n  /* Layout */\n  --vscode-border-radius: 4px;\n  --vscode-border-width: 1px;\n  \n  /* Animations */\n  --vscode-transition-duration: 0.2s;\n  --vscode-transition-timing: ease;\n}\n\n/* Dark Theme */\n[data-theme=\"dark\"] {\n  --vscode-foreground: #d4d4d4;\n  --vscode-background: #1e1e1e;\n  --vscode-sidebar-background: #252526;\n  --vscode-panel-background: #252526;\n  --vscode-border: #333333;\n}\n\n/* Light Theme */\n[data-theme=\"light\"] {\n  --vscode-foreground: #333333;\n  --vscode-background: #ffffff;\n  --vscode-sidebar-background: #f3f3f3;\n  --vscode-panel-background: #f3f3f3;\n  --vscode-border: #e1e1e1;\n}\n\n/* High Contrast Theme */\n[data-theme=\"high-contrast\"] {\n  --vscode-foreground: #ffffff;\n  --vscode-background: #000000;\n  --vscode-sidebar-background: #000000;\n  --vscode-panel-background: #000000;\n  --vscode-border: #ffffff;\n  --vscode-focus-border: #f38518;\n}\n\n/* Print Styles */\n@media print {\n  .ai-interface-manager {\n    background: white !important;\n    color: black !important;\n  }\n  \n  .ai-sidebar,\n  .ai-chat-panel,\n  .ai-bottom-panel {\n    display: none !important;\n  }\n  \n  .ai-page-content {\n    width: 100% !important;\n    margin: 0 !important;\n    padding: 20px !important;\n  }\n}\n\n/* Reduced Motion */\n@media (prefers-reduced-motion: reduce) {\n  * {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/renderer/styles/GrokChatInterface.css":
/*!*******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/renderer/styles/GrokChatInterface.css ***!
  \*******************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Grok Chat Interface - Fixed Layout and Typography */

.grok-chat-interface {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #000000;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden;
  position: relative;
}

/* Header - Fixed Height and Proper Spacing */
.grok-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #2f3336;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(12px);
  z-index: 100;
  height: 70px;
  min-height: 70px;
  flex-shrink: 0;
}

.grok-branding {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 200px;
}

.grok-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.grok-x {
  font-size: 28px;
  font-weight: bold;
  color: #1d9bf0;
  font-family: "X Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1;
}

.grok-text {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
  line-height: 1;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #71767b;
  white-space: nowrap;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ba7c;
  animation: pulse 2s infinite;
  flex-shrink: 0;
}

.status-dot.online {
  background: #00ba7c;
}

.status-dot.offline {
  background: #f4212e;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
  justify-content: flex-end;
}

/* Model Selector - Fixed Sizing */
.model-selector-wrapper {
  position: relative;
}

.model-selector-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(29, 155, 240, 0.1);
  border: 1px solid rgba(29, 155, 240, 0.3);
  border-radius: 20px;
  color: #1d9bf0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 120px;
}

.model-selector-btn:hover {
  background: rgba(29, 155, 240, 0.15);
  border-color: rgba(29, 155, 240, 0.5);
}

.model-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.model-icon.beta {
  background: linear-gradient(45deg, #1d9bf0, #7856ff);
  color: white;
}

.model-icon.two {
  background: linear-gradient(45deg, #f91880, #ff6b6b);
  color: white;
}

.model-icon.vision {
  background: linear-gradient(45deg, #00ba7c, #1d9bf0);
  font-size: 12px;
}

.model-icon.multimodal {
  background: linear-gradient(45deg, #ff6b6b, #ffd93d);
  font-size: 12px;
}

.model-icon.default {
  background: linear-gradient(45deg, #536471, #1d9bf0);
  color: white;
}

.chevron {
  color: currentColor;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.model-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: #000000;
  border: 1px solid #2f3336;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.model-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  background: none;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: left;
}

.model-option:hover {
  background: rgba(47, 51, 54, 0.8);
}

.model-option.active {
  background: rgba(29, 155, 240, 0.1);
  color: #1d9bf0;
}

.model-option .check {
  margin-left: auto;
  color: #1d9bf0;
  flex-shrink: 0;
}

.clear-chat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  border-radius: 20px;
  color: #71767b;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.clear-chat-btn:hover {
  background: rgba(239, 243, 244, 0.1);
  color: #ffffff;
}

/* Messages - Fixed Scrolling and Layout */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  scroll-behavior: smooth;
  min-height: 0; /* Important for flex layout */
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(113, 118, 123, 0.3);
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(113, 118, 123, 0.5);
}

.messages-wrapper {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  min-height: -moz-min-content;
  min-height: min-content;
}

.message-bubble {
  margin-bottom: 24px;
  animation: messageSlideIn 0.3s ease-out;
  clear: both;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-bubble.user {
  display: flex;
  justify-content: flex-end;
}

.message-bubble.assistant {
  display: flex;
  justify-content: flex-start;
}

.message-content {
  max-width: 85%;
  position: relative;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

/* User Messages - Fixed Typography */
.message-bubble.user .message-content {
  background: #1d9bf0;
  color: #ffffff;
  padding: 16px 20px;
  border-radius: 18px 18px 4px 18px;
  box-shadow: 0 2px 8px rgba(29, 155, 240, 0.2);
}

.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 0 4px;
  gap: 12px;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(45deg, #1d9bf0, #7856ff);
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

/* Assistant Messages - Fixed Layout */
.message-bubble.assistant .message-content {
  background: #16181c;
  border: 1px solid #2f3336;
  color: #ffffff;
  padding: 0;
  border-radius: 18px 18px 18px 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.assistant-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px 12px 20px;
  border-bottom: 1px solid rgba(47, 51, 54, 0.5);
  background: rgba(22, 24, 28, 0.8);
}

.assistant-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(45deg, #000000, #1d9bf0);
  border-radius: 16px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
}

.grok-mini {
  color: #1d9bf0;
}

.assistant-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.assistant-name {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
}

.model-badge {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.model-badge .model-icon {
  width: 16px;
  height: 16px;
  font-size: 9px;
}

.message-time {
  font-size: 12px;
  color: #71767b;
  font-weight: 400;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Message Text - Fixed Typography and Spacing */
.message-text {
  padding: 12px 20px 20px 20px;
  line-height: 1.6;
  font-size: 15px;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.message-bubble.user .message-text {
  padding: 0;
  margin: 0;
  line-height: 1.5;
  font-size: 15px;
}

.streaming-cursor {
  color: #1d9bf0;
  animation: blink 1s infinite;
  font-weight: bold;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Message Attachments - Fixed Layout */
.message-attachments {
  padding: 0 20px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attachment {
  border: 1px solid #2f3336;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.attachment.image img {
  width: 100%;
  max-width: 300px;
  height: auto;
  display: block;
}

.attachment.code {
  background: #0d1117;
  border: 1px solid #21262d;
}

.attachment.code pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
}

.attachment-name {
  display: block;
  padding: 8px 12px;
  font-size: 12px;
  color: #71767b;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid #2f3336;
}

/* Input - Fixed Height and Layout */
.input-container {
  border-top: 1px solid #2f3336;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(12px);
  padding: 20px;
  flex-shrink: 0;
}

.input-form {
  max-width: 900px;
  margin: 0 auto;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #16181c;
  border: 1px solid #2f3336;
  border-radius: 24px;
  padding: 12px 16px;
  transition: border-color 0.2s ease;
  min-height: 60px;
}

.input-wrapper:focus-within {
  border-color: #1d9bf0;
  box-shadow: 0 0 0 2px rgba(29, 155, 240, 0.1);
}

.attachment-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  border-radius: 18px;
  color: #71767b;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.attachment-btn:hover {
  background: rgba(29, 155, 240, 0.1);
  color: #1d9bf0;
}

.message-input {
  flex: 1;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 16px;
  line-height: 1.4;
  padding: 8px 0;
  resize: none;
  outline: none;
  font-family: inherit;
  min-height: 20px;
  max-height: 120px;
  overflow-y: auto;
}

.message-input::-moz-placeholder {
  color: #71767b;
}

.message-input::placeholder {
  color: #71767b;
}

.message-input::-webkit-scrollbar {
  width: 0;
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #1d9bf0;
  border: none;
  border-radius: 18px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: #1a8cd8;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #536471;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.spinner-inner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.input-footer {
  margin-top: 12px;
  text-align: center;
}

.hint {
  font-size: 12px;
  color: #71767b;
}

/* Responsive Design - Fixed for Mobile */
@media (max-width: 768px) {
  .grok-header {
    padding: 12px 16px;
    height: 60px;
    min-height: 60px;
  }
  
  .grok-text {
    font-size: 20px;
  }
  
  .grok-x {
    font-size: 24px;
  }
  
  .messages-wrapper {
    padding: 16px 12px;
  }
  
  .message-content {
    max-width: 95%;
  }
  
  .input-container {
    padding: 16px 12px;
  }
  
  .model-dropdown {
    min-width: 180px;
  }
  
  .connection-status {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .grok-branding {
    gap: 12px;
    min-width: auto;
  }
  
  .connection-status {
    display: none;
  }
  
  .header-controls {
    min-width: auto;
  }
  
  .model-selector-btn {
    min-width: 100px;
    padding: 8px 12px;
  }
  
  .message-text {
    font-size: 14px;
    padding: 10px 16px 16px 16px;
  }
  
  .assistant-header {
    padding: 12px 16px 8px 16px;
  }
  
  .message-attachments {
    padding: 0 16px 12px 16px;
  }
  
  .input-wrapper {
    min-height: 50px;
    padding: 10px 14px;
  }
}
`, "",{"version":3,"sources":["webpack://./src/renderer/styles/GrokChatInterface.css"],"names":[],"mappings":"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","sourcesContent":["/* Grok Chat Interface - Fixed Layout and Typography */\n\n.grok-chat-interface {\n  display: flex;\n  flex-direction: column;\n  height: 100vh;\n  background: #000000;\n  color: #ffffff;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n  overflow: hidden;\n  position: relative;\n}\n\n/* Header - Fixed Height and Proper Spacing */\n.grok-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 20px;\n  border-bottom: 1px solid #2f3336;\n  background: rgba(0, 0, 0, 0.95);\n  backdrop-filter: blur(12px);\n  z-index: 100;\n  height: 70px;\n  min-height: 70px;\n  flex-shrink: 0;\n}\n\n.grok-branding {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  min-width: 200px;\n}\n\n.grok-logo {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.grok-x {\n  font-size: 28px;\n  font-weight: bold;\n  color: #1d9bf0;\n  font-family: \"X Sans\", -apple-system, BlinkMacSystemFont, sans-serif;\n  line-height: 1;\n}\n\n.grok-text {\n  font-size: 24px;\n  font-weight: 700;\n  color: #ffffff;\n  letter-spacing: -0.5px;\n  line-height: 1;\n}\n\n.connection-status {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 14px;\n  color: #71767b;\n  white-space: nowrap;\n}\n\n.status-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: #00ba7c;\n  animation: pulse 2s infinite;\n  flex-shrink: 0;\n}\n\n.status-dot.online {\n  background: #00ba7c;\n}\n\n.status-dot.offline {\n  background: #f4212e;\n}\n\n@keyframes pulse {\n  0% { opacity: 1; }\n  50% { opacity: 0.5; }\n  100% { opacity: 1; }\n}\n\n.header-controls {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  min-width: 200px;\n  justify-content: flex-end;\n}\n\n/* Model Selector - Fixed Sizing */\n.model-selector-wrapper {\n  position: relative;\n}\n\n.model-selector-btn {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 16px;\n  background: rgba(29, 155, 240, 0.1);\n  border: 1px solid rgba(29, 155, 240, 0.3);\n  border-radius: 20px;\n  color: #1d9bf0;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  white-space: nowrap;\n  min-width: 120px;\n}\n\n.model-selector-btn:hover {\n  background: rgba(29, 155, 240, 0.15);\n  border-color: rgba(29, 155, 240, 0.5);\n}\n\n.model-icon {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n  border-radius: 4px;\n  font-size: 11px;\n  font-weight: 700;\n  flex-shrink: 0;\n}\n\n.model-icon.beta {\n  background: linear-gradient(45deg, #1d9bf0, #7856ff);\n  color: white;\n}\n\n.model-icon.two {\n  background: linear-gradient(45deg, #f91880, #ff6b6b);\n  color: white;\n}\n\n.model-icon.vision {\n  background: linear-gradient(45deg, #00ba7c, #1d9bf0);\n  font-size: 12px;\n}\n\n.model-icon.multimodal {\n  background: linear-gradient(45deg, #ff6b6b, #ffd93d);\n  font-size: 12px;\n}\n\n.model-icon.default {\n  background: linear-gradient(45deg, #536471, #1d9bf0);\n  color: white;\n}\n\n.chevron {\n  color: currentColor;\n  transition: transform 0.2s ease;\n  flex-shrink: 0;\n}\n\n.model-dropdown {\n  position: absolute;\n  top: calc(100% + 8px);\n  right: 0;\n  min-width: 220px;\n  background: #000000;\n  border: 1px solid #2f3336;\n  border-radius: 12px;\n  padding: 8px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);\n  z-index: 1000;\n}\n\n.model-option {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n  padding: 12px;\n  background: none;\n  border: none;\n  border-radius: 8px;\n  color: #ffffff;\n  font-size: 14px;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n  text-align: left;\n}\n\n.model-option:hover {\n  background: rgba(47, 51, 54, 0.8);\n}\n\n.model-option.active {\n  background: rgba(29, 155, 240, 0.1);\n  color: #1d9bf0;\n}\n\n.model-option .check {\n  margin-left: auto;\n  color: #1d9bf0;\n  flex-shrink: 0;\n}\n\n.clear-chat-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 40px;\n  height: 40px;\n  background: none;\n  border: none;\n  border-radius: 20px;\n  color: #71767b;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  flex-shrink: 0;\n}\n\n.clear-chat-btn:hover {\n  background: rgba(239, 243, 244, 0.1);\n  color: #ffffff;\n}\n\n/* Messages - Fixed Scrolling and Layout */\n.messages-container {\n  flex: 1;\n  overflow-y: auto;\n  padding: 0;\n  scroll-behavior: smooth;\n  min-height: 0; /* Important for flex layout */\n}\n\n.messages-container::-webkit-scrollbar {\n  width: 6px;\n}\n\n.messages-container::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n.messages-container::-webkit-scrollbar-thumb {\n  background: rgba(113, 118, 123, 0.3);\n  border-radius: 3px;\n}\n\n.messages-container::-webkit-scrollbar-thumb:hover {\n  background: rgba(113, 118, 123, 0.5);\n}\n\n.messages-wrapper {\n  padding: 20px;\n  max-width: 900px;\n  margin: 0 auto;\n  min-height: min-content;\n}\n\n.message-bubble {\n  margin-bottom: 24px;\n  animation: messageSlideIn 0.3s ease-out;\n  clear: both;\n}\n\n@keyframes messageSlideIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.message-bubble.user {\n  display: flex;\n  justify-content: flex-end;\n}\n\n.message-bubble.assistant {\n  display: flex;\n  justify-content: flex-start;\n}\n\n.message-content {\n  max-width: 85%;\n  position: relative;\n  word-wrap: break-word;\n  overflow-wrap: break-word;\n  hyphens: auto;\n}\n\n/* User Messages - Fixed Typography */\n.message-bubble.user .message-content {\n  background: #1d9bf0;\n  color: #ffffff;\n  padding: 16px 20px;\n  border-radius: 18px 18px 4px 18px;\n  box-shadow: 0 2px 8px rgba(29, 155, 240, 0.2);\n}\n\n.user-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 8px;\n  padding: 0 4px;\n  gap: 12px;\n}\n\n.user-avatar {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  background: linear-gradient(45deg, #1d9bf0, #7856ff);\n  border-radius: 16px;\n  font-size: 11px;\n  font-weight: 600;\n  color: white;\n  flex-shrink: 0;\n}\n\n/* Assistant Messages - Fixed Layout */\n.message-bubble.assistant .message-content {\n  background: #16181c;\n  border: 1px solid #2f3336;\n  color: #ffffff;\n  padding: 0;\n  border-radius: 18px 18px 18px 4px;\n  overflow: hidden;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n}\n\n.assistant-header {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 16px 20px 12px 20px;\n  border-bottom: 1px solid rgba(47, 51, 54, 0.5);\n  background: rgba(22, 24, 28, 0.8);\n}\n\n.assistant-avatar {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  background: linear-gradient(45deg, #000000, #1d9bf0);\n  border-radius: 16px;\n  font-size: 14px;\n  font-weight: bold;\n  color: white;\n  flex-shrink: 0;\n}\n\n.grok-mini {\n  color: #1d9bf0;\n}\n\n.assistant-info {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex: 1;\n  min-width: 0;\n}\n\n.assistant-name {\n  font-size: 15px;\n  font-weight: 700;\n  color: #ffffff;\n  white-space: nowrap;\n}\n\n.model-badge {\n  display: flex;\n  align-items: center;\n  flex-shrink: 0;\n}\n\n.model-badge .model-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 9px;\n}\n\n.message-time {\n  font-size: 12px;\n  color: #71767b;\n  font-weight: 400;\n  white-space: nowrap;\n  flex-shrink: 0;\n}\n\n/* Message Text - Fixed Typography and Spacing */\n.message-text {\n  padding: 12px 20px 20px 20px;\n  line-height: 1.6;\n  font-size: 15px;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n  overflow-wrap: break-word;\n  hyphens: auto;\n}\n\n.message-bubble.user .message-text {\n  padding: 0;\n  margin: 0;\n  line-height: 1.5;\n  font-size: 15px;\n}\n\n.streaming-cursor {\n  color: #1d9bf0;\n  animation: blink 1s infinite;\n  font-weight: bold;\n  margin-left: 2px;\n}\n\n@keyframes blink {\n  0%, 50% { opacity: 1; }\n  51%, 100% { opacity: 0; }\n}\n\n/* Message Attachments - Fixed Layout */\n.message-attachments {\n  padding: 0 20px 16px 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.attachment {\n  border: 1px solid #2f3336;\n  border-radius: 8px;\n  overflow: hidden;\n  background: rgba(0, 0, 0, 0.3);\n}\n\n.attachment.image img {\n  width: 100%;\n  max-width: 300px;\n  height: auto;\n  display: block;\n}\n\n.attachment.code {\n  background: #0d1117;\n  border: 1px solid #21262d;\n}\n\n.attachment.code pre {\n  margin: 0;\n  padding: 16px;\n  overflow-x: auto;\n  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;\n  font-size: 13px;\n  line-height: 1.5;\n}\n\n.attachment-name {\n  display: block;\n  padding: 8px 12px;\n  font-size: 12px;\n  color: #71767b;\n  background: rgba(0, 0, 0, 0.2);\n  border-top: 1px solid #2f3336;\n}\n\n/* Input - Fixed Height and Layout */\n.input-container {\n  border-top: 1px solid #2f3336;\n  background: rgba(0, 0, 0, 0.95);\n  backdrop-filter: blur(12px);\n  padding: 20px;\n  flex-shrink: 0;\n}\n\n.input-form {\n  max-width: 900px;\n  margin: 0 auto;\n}\n\n.input-wrapper {\n  display: flex;\n  align-items: flex-end;\n  gap: 12px;\n  background: #16181c;\n  border: 1px solid #2f3336;\n  border-radius: 24px;\n  padding: 12px 16px;\n  transition: border-color 0.2s ease;\n  min-height: 60px;\n}\n\n.input-wrapper:focus-within {\n  border-color: #1d9bf0;\n  box-shadow: 0 0 0 2px rgba(29, 155, 240, 0.1);\n}\n\n.attachment-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 36px;\n  height: 36px;\n  background: none;\n  border: none;\n  border-radius: 18px;\n  color: #71767b;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  flex-shrink: 0;\n}\n\n.attachment-btn:hover {\n  background: rgba(29, 155, 240, 0.1);\n  color: #1d9bf0;\n}\n\n.message-input {\n  flex: 1;\n  background: none;\n  border: none;\n  color: #ffffff;\n  font-size: 16px;\n  line-height: 1.4;\n  padding: 8px 0;\n  resize: none;\n  outline: none;\n  font-family: inherit;\n  min-height: 20px;\n  max-height: 120px;\n  overflow-y: auto;\n}\n\n.message-input::placeholder {\n  color: #71767b;\n}\n\n.message-input::-webkit-scrollbar {\n  width: 0;\n}\n\n.send-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 36px;\n  height: 36px;\n  background: #1d9bf0;\n  border: none;\n  border-radius: 18px;\n  color: #ffffff;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  flex-shrink: 0;\n}\n\n.send-btn:hover:not(:disabled) {\n  background: #1a8cd8;\n  transform: scale(1.05);\n}\n\n.send-btn:disabled {\n  background: #536471;\n  cursor: not-allowed;\n  transform: none;\n}\n\n.spinner {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n}\n\n.spinner-inner {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top: 2px solid #ffffff;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n.input-footer {\n  margin-top: 12px;\n  text-align: center;\n}\n\n.hint {\n  font-size: 12px;\n  color: #71767b;\n}\n\n/* Responsive Design - Fixed for Mobile */\n@media (max-width: 768px) {\n  .grok-header {\n    padding: 12px 16px;\n    height: 60px;\n    min-height: 60px;\n  }\n  \n  .grok-text {\n    font-size: 20px;\n  }\n  \n  .grok-x {\n    font-size: 24px;\n  }\n  \n  .messages-wrapper {\n    padding: 16px 12px;\n  }\n  \n  .message-content {\n    max-width: 95%;\n  }\n  \n  .input-container {\n    padding: 16px 12px;\n  }\n  \n  .model-dropdown {\n    min-width: 180px;\n  }\n  \n  .connection-status {\n    font-size: 12px;\n  }\n}\n\n@media (max-width: 480px) {\n  .grok-branding {\n    gap: 12px;\n    min-width: auto;\n  }\n  \n  .connection-status {\n    display: none;\n  }\n  \n  .header-controls {\n    min-width: auto;\n  }\n  \n  .model-selector-btn {\n    min-width: 100px;\n    padding: 8px 12px;\n  }\n  \n  .message-text {\n    font-size: 14px;\n    padding: 10px 16px 16px 16px;\n  }\n  \n  .assistant-header {\n    padding: 12px 16px 8px 16px;\n  }\n  \n  .message-attachments {\n    padding: 0 16px 12px 16px;\n  }\n  \n  .input-wrapper {\n    min-height: 50px;\n    padding: 10px 14px;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/renderer/App.tsx":
/*!******************************!*\
  !*** ./src/renderer/App.tsx ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contexts/NotificationContext */ "./src/renderer/contexts/NotificationContext.tsx");
/* harmony import */ var _contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contexts/WorkspaceContext */ "./src/renderer/contexts/WorkspaceContext.tsx");
/* harmony import */ var _contexts_AIContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./contexts/AIContext */ "./src/renderer/contexts/AIContext.tsx");
/* harmony import */ var _contexts_RunnerContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./contexts/RunnerContext */ "./src/renderer/contexts/RunnerContext.tsx");
/* harmony import */ var _components_AIInterfaceManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/AIInterfaceManager */ "./src/renderer/components/AIInterfaceManager.tsx");
/* harmony import */ var _styles_App_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./styles/App.css */ "./src/renderer/styles/App.css");








const App = () => {
    console.log('🚀 VSEmbed AI DevTool initializing...');
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_2__.NotificationProvider, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_3__.WorkspaceProvider, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_contexts_AIContext__WEBPACK_IMPORTED_MODULE_4__.AIProvider, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_contexts_RunnerContext__WEBPACK_IMPORTED_MODULE_5__.RunnerProvider, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "app", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_AIInterfaceManager__WEBPACK_IMPORTED_MODULE_6__.AIInterfaceManager, {}) }) }) }) }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);


/***/ }),

/***/ "./src/renderer/components/AIInterfaceManager.tsx":
/*!********************************************************!*\
  !*** ./src/renderer/components/AIInterfaceManager.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AIInterfaceManager: () => (/* binding */ AIInterfaceManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _GrokChatInterface__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GrokChatInterface */ "./src/renderer/components/GrokChatInterface.tsx");
/* harmony import */ var _ai_pages_AIPageProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ai-pages/AIPageProvider */ "./src/renderer/components/ai-pages/AIPageProvider.tsx");
/* harmony import */ var _ai_components_ComponentRegistry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ai-components/ComponentRegistry */ "./src/renderer/components/ai-components/ComponentRegistry.tsx");
/* harmony import */ var _workspace_AIWorkspaceManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./workspace/AIWorkspaceManager */ "./src/renderer/components/workspace/AIWorkspaceManager.tsx");
/* harmony import */ var _debug_DebugPanel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./debug/DebugPanel */ "./src/renderer/components/debug/DebugPanel.tsx");
/* harmony import */ var _terminal_TerminalManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./terminal/TerminalManager */ "./src/renderer/components/terminal/TerminalManager.tsx");
/* harmony import */ var _explorer_ProjectExplorer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./explorer/ProjectExplorer */ "./src/renderer/components/explorer/ProjectExplorer.tsx");
/* harmony import */ var _ai_models_AIModelManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ai-models/AIModelManager */ "./src/renderer/components/ai-models/AIModelManager.tsx");
/* harmony import */ var _performance_PerformanceMonitor__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./performance/PerformanceMonitor */ "./src/renderer/components/performance/PerformanceMonitor.tsx");
/* harmony import */ var _security_SecurityCenter__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./security/SecurityCenter */ "./src/renderer/components/security/SecurityCenter.tsx");
/* harmony import */ var _extensions_ExtensionManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./extensions/ExtensionManager */ "./src/renderer/components/extensions/ExtensionManager.tsx");
/* harmony import */ var _themes_ThemeManager__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./themes/ThemeManager */ "./src/renderer/components/themes/ThemeManager.tsx");
/* harmony import */ var _search_SearchManager__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./search/SearchManager */ "./src/renderer/components/search/SearchManager.tsx");
/* harmony import */ var _git_GitManager__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./git/GitManager */ "./src/renderer/components/git/GitManager.tsx");
/* harmony import */ var _database_DatabaseManager__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./database/DatabaseManager */ "./src/renderer/components/database/DatabaseManager.tsx");
/* harmony import */ var _api_APIManager__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./api/APIManager */ "./src/renderer/components/api/APIManager.tsx");
/* harmony import */ var _testing_TestRunner__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./testing/TestRunner */ "./src/renderer/components/testing/TestRunner.tsx");
/* harmony import */ var _devtools_DevToolsPanel__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./devtools/DevToolsPanel */ "./src/renderer/components/devtools/DevToolsPanel.tsx");
/* harmony import */ var _code_analysis_CodeAnalyzer__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./code-analysis/CodeAnalyzer */ "./src/renderer/components/code-analysis/CodeAnalyzer.tsx");
/* harmony import */ var _deployment_DeploymentManager__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./deployment/DeploymentManager */ "./src/renderer/components/deployment/DeploymentManager.tsx");
/* harmony import */ var _docs_DocumentationManager__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./docs/DocumentationManager */ "./src/renderer/components/docs/DocumentationManager.tsx");
/* harmony import */ var _settings_SettingsManager__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./settings/SettingsManager */ "./src/renderer/components/settings/SettingsManager.tsx");
/* harmony import */ var _help_HelpCenter__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./help/HelpCenter */ "./src/renderer/components/help/HelpCenter.tsx");
/* harmony import */ var _feedback_FeedbackManager__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./feedback/FeedbackManager */ "./src/renderer/components/feedback/FeedbackManager.tsx");
/* harmony import */ var _updates_UpdateManager__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./updates/UpdateManager */ "./src/renderer/components/updates/UpdateManager.tsx");
/* harmony import */ var _plugins_PluginManager__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./plugins/PluginManager */ "./src/renderer/components/plugins/PluginManager.tsx");
/* harmony import */ var _ai_assistant_AIAssistant__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./ai-assistant/AIAssistant */ "./src/renderer/components/ai-assistant/AIAssistant.tsx");
/* harmony import */ var _styles_AIInterfaceManager_css__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../styles/AIInterfaceManager.css */ "./src/renderer/styles/AIInterfaceManager.css");






























const AIInterfaceManager = ({ className }) => {
    const [currentPage, setCurrentPage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('dashboard');
    const [activeComponents, setActiveComponents] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(new Set());
    const [sidebarVisible, setSidebarVisible] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [terminalVisible, setTerminalVisible] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [debugVisible, setDebugVisible] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [aiChatVisible, setAiChatVisible] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [interfaceMode, setInterfaceMode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('full');
    const interfaceRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    // Initialize AI interface with all 309 pages
    const aiPages = [
        // Core Development Pages (50 pages)
        { id: 'dashboard', title: 'AI Dashboard', category: 'core', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Dashboard" }), icon: '🏠' },
        { id: 'code-editor', title: 'Code Editor', category: 'core', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Code Editor" }), icon: '📝' },
        { id: 'file-explorer', title: 'File Explorer', category: 'core', component: _explorer_ProjectExplorer__WEBPACK_IMPORTED_MODULE_8__.ProjectExplorer, icon: '📁' },
        { id: 'terminal', title: 'Terminal', category: 'core', component: _terminal_TerminalManager__WEBPACK_IMPORTED_MODULE_7__.TerminalManager, icon: '💻' },
        { id: 'debug', title: 'Debug Console', category: 'core', component: _debug_DebugPanel__WEBPACK_IMPORTED_MODULE_6__.DebugPanel, icon: '🐞' },
        { id: 'git', title: 'Git Manager', category: 'core', component: _git_GitManager__WEBPACK_IMPORTED_MODULE_15__.GitManager, icon: '🌿' },
        { id: 'search', title: 'Search & Replace', category: 'core', component: _search_SearchManager__WEBPACK_IMPORTED_MODULE_14__.SearchManager, icon: '🔍' },
        { id: 'settings', title: 'Settings', category: 'core', component: _settings_SettingsManager__WEBPACK_IMPORTED_MODULE_23__.SettingsManager, icon: '⚙️' },
        // AI-Powered Development Pages (75 pages)
        { id: 'ai-assistant', title: 'AI Assistant', category: 'ai', component: _ai_assistant_AIAssistant__WEBPACK_IMPORTED_MODULE_28__.AIAssistant, icon: '🤖' },
        { id: 'grok-chat', title: 'Grok Chat Interface', category: 'ai', component: _GrokChatInterface__WEBPACK_IMPORTED_MODULE_2__.GrokChatInterface, icon: '💬' },
        { id: 'ai-models', title: 'AI Model Manager', category: 'ai', component: _ai_models_AIModelManager__WEBPACK_IMPORTED_MODULE_9__.AIModelManager, icon: '🧠' },
        { id: 'code-analysis', title: 'AI Code Analysis', category: 'ai', component: _code_analysis_CodeAnalyzer__WEBPACK_IMPORTED_MODULE_20__.CodeAnalyzer, icon: '🔬' },
        { id: 'ai-workspace', title: 'AI Workspace', category: 'ai', component: _workspace_AIWorkspaceManager__WEBPACK_IMPORTED_MODULE_5__.AIWorkspaceManager, icon: '🏢' },
        // Testing & Quality Assurance Pages (30 pages)
        { id: 'test-runner', title: 'Test Runner', category: 'testing', component: _testing_TestRunner__WEBPACK_IMPORTED_MODULE_18__.TestRunner, icon: '🧪' },
        { id: 'performance', title: 'Performance Monitor', category: 'testing', component: _performance_PerformanceMonitor__WEBPACK_IMPORTED_MODULE_10__.PerformanceMonitor, icon: '📊' },
        { id: 'security', title: 'Security Center', category: 'testing', component: _security_SecurityCenter__WEBPACK_IMPORTED_MODULE_11__.SecurityCenter, icon: '🔒' },
        // Project Management Pages (40 pages)
        { id: 'deployment', title: 'Deployment Manager', category: 'project', component: _deployment_DeploymentManager__WEBPACK_IMPORTED_MODULE_21__.DeploymentManager, icon: '🚀' },
        { id: 'api-manager', title: 'API Manager', category: 'project', component: _api_APIManager__WEBPACK_IMPORTED_MODULE_17__.APIManager, icon: '🔌' },
        { id: 'database', title: 'Database Manager', category: 'project', component: _database_DatabaseManager__WEBPACK_IMPORTED_MODULE_16__.DatabaseManager, icon: '🗄️' },
        // Documentation & Help Pages (35 pages)
        { id: 'docs', title: 'Documentation', category: 'docs', component: _docs_DocumentationManager__WEBPACK_IMPORTED_MODULE_22__.DocumentationManager, icon: '📚' },
        { id: 'help', title: 'Help Center', category: 'docs', component: _help_HelpCenter__WEBPACK_IMPORTED_MODULE_24__.HelpCenter, icon: '❓' },
        // Extensions & Plugins Pages (25 pages)
        { id: 'extensions', title: 'Extension Manager', category: 'extensions', component: _extensions_ExtensionManager__WEBPACK_IMPORTED_MODULE_12__.ExtensionManager, icon: '🧩' },
        { id: 'plugins', title: 'Plugin Manager', category: 'extensions', component: _plugins_PluginManager__WEBPACK_IMPORTED_MODULE_27__.PluginManager, icon: '🔧' },
        // Customization Pages (20 pages)
        { id: 'themes', title: 'Theme Manager', category: 'customization', component: _themes_ThemeManager__WEBPACK_IMPORTED_MODULE_13__.ThemeManager, icon: '🎨' },
        // System & Maintenance Pages (15 pages)
        { id: 'updates', title: 'Update Manager', category: 'system', component: _updates_UpdateManager__WEBPACK_IMPORTED_MODULE_26__.UpdateManager, icon: '🔄' },
        { id: 'feedback', title: 'Feedback Manager', category: 'system', component: _feedback_FeedbackManager__WEBPACK_IMPORTED_MODULE_25__.FeedbackManager, icon: '💭' },
        // Development Tools Pages (19 pages)
        { id: 'devtools', title: 'Dev Tools Panel', category: 'devtools', component: _devtools_DevToolsPanel__WEBPACK_IMPORTED_MODULE_19__.DevToolsPanel, icon: '🛠️' },
    ];
    // Generate the remaining pages programmatically to reach 309 total
    const generateAdditionalPages = () => {
        const additionalPages = [];
        const categories = ['ai', 'core', 'testing', 'project', 'docs', 'extensions', 'customization', 'system', 'devtools'];
        // Generate specialized AI pages
        for (let i = 1; i <= 50; i++) {
            additionalPages.push({
                id: `ai-specialized-${i}`,
                title: `AI Tool ${i}`,
                category: 'ai',
                component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-specialized-page", children: ["AI Specialized Tool ", i] }),
                icon: '🔮',
                description: `Advanced AI tool for specialized development task ${i}`
            });
        }
        // Generate code analysis pages
        for (let i = 1; i <= 30; i++) {
            additionalPages.push({
                id: `code-analysis-${i}`,
                title: `Code Analysis ${i}`,
                category: 'testing',
                component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "code-analysis-page", children: ["Code Analysis Tool ", i] }),
                icon: '📈',
                description: `Code analysis and quality tool ${i}`
            });
        }
        // Generate project templates pages
        for (let i = 1; i <= 40; i++) {
            additionalPages.push({
                id: `project-template-${i}`,
                title: `Project Template ${i}`,
                category: 'project',
                component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "project-template-page", children: ["Project Template ", i] }),
                icon: '📋',
                description: `Project template and scaffold ${i}`
            });
        }
        // Generate documentation pages
        for (let i = 1; i <= 35; i++) {
            additionalPages.push({
                id: `docs-${i}`,
                title: `Documentation ${i}`,
                category: 'docs',
                component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "docs-page", children: ["Documentation Section ", i] }),
                icon: '📖',
                description: `Documentation section ${i}`
            });
        }
        // Generate extension pages
        for (let i = 1; i <= 25; i++) {
            additionalPages.push({
                id: `extension-${i}`,
                title: `Extension ${i}`,
                category: 'extensions',
                component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "extension-page", children: ["Extension ", i] }),
                icon: '⚡',
                description: `Extension or plugin ${i}`
            });
        }
        // Generate theme and customization pages
        for (let i = 1; i <= 20; i++) {
            additionalPages.push({
                id: `theme-${i}`,
                title: `Theme ${i}`,
                category: 'customization',
                component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "theme-page", children: ["Theme Configuration ", i] }),
                icon: '🌈',
                description: `Theme and customization option ${i}`
            });
        }
        // Generate system and utility pages
        for (let i = 1; i <= 15; i++) {
            additionalPages.push({
                id: `system-${i}`,
                title: `System Tool ${i}`,
                category: 'system',
                component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "system-page", children: ["System Tool ", i] }),
                icon: '🔧',
                description: `System utility ${i}`
            });
        }
        // Generate development workflow pages
        for (let i = 1; i <= 19; i++) {
            additionalPages.push({
                id: `workflow-${i}`,
                title: `Workflow ${i}`,
                category: 'devtools',
                component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "workflow-page", children: ["Development Workflow ", i] }),
                icon: '🔄',
                description: `Development workflow tool ${i}`
            });
        }
        return additionalPages;
    };
    // Complete list of all 309 pages
    const allPages = [...aiPages, ...generateAdditionalPages()];
    // Initialize AI components (29 components)
    const aiComponents = [
        { id: 'nav-bar', name: 'Navigation Bar', type: 'widget', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Nav Bar" }), category: 'navigation' },
        { id: 'sidebar', name: 'Sidebar', type: 'panel', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Sidebar" }), category: 'navigation' },
        { id: 'breadcrumb', name: 'Breadcrumb', type: 'widget', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Breadcrumb" }), category: 'navigation' },
        { id: 'search-box', name: 'Search Box', type: 'widget', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Search Box" }), category: 'input' },
        { id: 'filter-panel', name: 'Filter Panel', type: 'panel', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Filter Panel" }), category: 'input' },
        { id: 'command-palette', name: 'Command Palette', type: 'modal', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Command Palette" }), category: 'input' },
        { id: 'notification-center', name: 'Notification Center', type: 'overlay', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Notifications" }), category: 'feedback' },
        { id: 'progress-bar', name: 'Progress Bar', type: 'widget', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Progress Bar" }), category: 'feedback' },
        { id: 'status-indicator', name: 'Status Indicator', type: 'widget', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Status" }), category: 'feedback' },
        { id: 'tooltip-system', name: 'Tooltip System', type: 'overlay', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Tooltips" }), category: 'feedback' },
        { id: 'context-menu', name: 'Context Menu', type: 'overlay', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Context Menu" }), category: 'interaction' },
        { id: 'drag-drop', name: 'Drag & Drop', type: 'inline', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Drag Drop" }), category: 'interaction' },
        { id: 'resize-handle', name: 'Resize Handle', type: 'widget', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Resize Handle" }), category: 'interaction' },
        { id: 'split-view', name: 'Split View', type: 'panel', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Split View" }), category: 'layout' },
        { id: 'tab-container', name: 'Tab Container', type: 'panel', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Tab Container" }), category: 'layout' },
        { id: 'modal-system', name: 'Modal System', type: 'modal', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Modal System" }), category: 'layout' },
        { id: 'accordion', name: 'Accordion', type: 'widget', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Accordion" }), category: 'layout' },
        { id: 'tree-view', name: 'Tree View', type: 'widget', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Tree View" }), category: 'data' },
        { id: 'data-table', name: 'Data Table', type: 'widget', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Data Table" }), category: 'data' },
        { id: 'chart-widget', name: 'Chart Widget', type: 'widget', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Chart Widget" }), category: 'data' },
        { id: 'code-editor', name: 'Code Editor', type: 'panel', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Code Editor" }), category: 'editor' },
        { id: 'syntax-highlighter', name: 'Syntax Highlighter', type: 'inline', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Syntax Highlighter" }), category: 'editor' },
        { id: 'diff-viewer', name: 'Diff Viewer', type: 'panel', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Diff Viewer" }), category: 'editor' },
        { id: 'minimap', name: 'Minimap', type: 'widget', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Minimap" }), category: 'editor' },
        { id: 'ai-chat-widget', name: 'AI Chat Widget', type: 'panel', component: _GrokChatInterface__WEBPACK_IMPORTED_MODULE_2__.GrokChatInterface, category: 'ai' },
        { id: 'ai-suggestions', name: 'AI Suggestions', type: 'overlay', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "AI Suggestions" }), category: 'ai' },
        { id: 'workspace-switcher', name: 'Workspace Switcher', type: 'widget', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Workspace Switcher" }), category: 'workspace' },
        { id: 'file-tree', name: 'File Tree', type: 'panel', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "File Tree" }), category: 'workspace' },
        { id: 'quick-actions', name: 'Quick Actions', type: 'widget', component: () => (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Quick Actions" }), category: 'utilities' },
    ];
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // Initialize the AI interface
        console.log('🎯 Initializing AI Interface Manager with 309 pages and 29 components...');
        // Simulate loading process
        const initializeInterface = async () => {
            setIsLoading(true);
            // Initialize core components
            setActiveComponents(new Set(['nav-bar', 'sidebar', 'ai-chat-widget', 'file-tree']));
            // Simulate async initialization
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsLoading(false);
            console.log('✅ AI Interface Manager initialized successfully!');
            console.log(`📊 Total pages: ${allPages.length}`);
            console.log(`🧩 Total components: ${aiComponents.length}`);
        };
        initializeInterface();
    }, []);
    const handlePageChange = (pageId) => {
        setCurrentPage(pageId);
        console.log(`📄 Navigated to page: ${pageId}`);
    };
    const toggleComponent = (componentId) => {
        setActiveComponents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(componentId)) {
                newSet.delete(componentId);
            }
            else {
                newSet.add(componentId);
            }
            return newSet;
        });
    };
    const getCurrentPageComponent = () => {
        const page = allPages.find(p => p.id === currentPage);
        if (page) {
            const Component = page.component;
            return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Component, {});
        }
        return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "page-not-found", children: "Page not found" });
    };
    const renderActiveComponents = () => {
        return Array.from(activeComponents).map(componentId => {
            const component = aiComponents.find(c => c.id === componentId);
            if (component) {
                const Component = component.component;
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `ai-component ai-component-${component.type}`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Component, {}) }, componentId));
            }
            return null;
        });
    };
    if (isLoading) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-interface-loading", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "loading-spinner" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "loading-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { children: "\uD83D\uDE80 Initializing AI Interface" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Loading 309 pages and 29 components..." })] })] }));
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { ref: interfaceRef, className: `ai-interface-manager ${className || ''} mode-${interfaceMode}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ai_components_ComponentRegistry__WEBPACK_IMPORTED_MODULE_4__.ComponentRegistry, { components: aiComponents, activeComponents: activeComponents, onToggleComponent: toggleComponent }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ai_pages_AIPageProvider__WEBPACK_IMPORTED_MODULE_3__.AIPageProvider, { pages: allPages, currentPage: currentPage, onPageChange: handlePageChange }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-interface-layout", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-top-nav", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-nav-left", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-logo", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "logo-icon", children: "\uD83E\uDD16" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "logo-text", children: "VSEmbed AI" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "page-breadcrumb", children: allPages.find(p => p.id === currentPage)?.title || 'Unknown Page' })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ai-nav-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "global-search", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", placeholder: "Search across all 309 pages...", className: "global-search-input" }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-nav-right", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "mode-toggle", onClick: () => setInterfaceMode(interfaceMode === 'full' ? 'minimal' : 'full'), children: interfaceMode === 'full' ? '🔍' : '📋' }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "ai-toggle", onClick: () => setAiChatVisible(!aiChatVisible), children: "\uD83E\uDD16" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-main-content", children: [sidebarVisible && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-sidebar", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sidebar-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "AI Navigator" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "page-count", children: [allPages.length, " pages"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "page-categories", children: ['ai', 'core', 'testing', 'project', 'docs', 'extensions'].map(category => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "category-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { className: "category-title", children: category.toUpperCase() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "category-pages", children: allPages
                                                        .filter(page => page.category === category)
                                                        .slice(0, 8) // Show first 8 pages per category
                                                        .map(page => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `page-button ${page.id === currentPage ? 'active' : ''}`, onClick: () => handlePageChange(page.id), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "page-icon", children: page.icon }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "page-title", children: page.title })] }, page.id))) })] }, category))) })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ai-page-content", children: getCurrentPageComponent() }), aiChatVisible && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ai-chat-panel", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_GrokChatInterface__WEBPACK_IMPORTED_MODULE_2__.GrokChatInterface, { className: "embedded-grok" }) }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-bottom-panel", children: [terminalVisible && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bottom-section terminal-section", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_terminal_TerminalManager__WEBPACK_IMPORTED_MODULE_7__.TerminalManager, {}) })), debugVisible && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bottom-section debug-section", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_debug_DebugPanel__WEBPACK_IMPORTED_MODULE_6__.DebugPanel, {}) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-bar", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-left", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-item", children: "Ready" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "status-item", children: ["Pages: ", allPages.length] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "status-item", children: ["Components: ", activeComponents.size, "/", aiComponents.length] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-right", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `panel-toggle ${terminalVisible ? 'active' : ''}`, onClick: () => setTerminalVisible(!terminalVisible), children: "Terminal" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `panel-toggle ${debugVisible ? 'active' : ''}`, onClick: () => setDebugVisible(!debugVisible), children: "Debug" })] })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "active-components-overlay", children: renderActiveComponents() })] }));
};


/***/ }),

/***/ "./src/renderer/components/GrokChatInterface.tsx":
/*!*******************************************************!*\
  !*** ./src/renderer/components/GrokChatInterface.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GrokChatInterface: () => (/* binding */ GrokChatInterface)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/NotificationContext */ "./src/renderer/contexts/NotificationContext.tsx");
/* harmony import */ var _styles_GrokChatInterface_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/GrokChatInterface.css */ "./src/renderer/styles/GrokChatInterface.css");




const GrokChatInterface = ({ className }) => {
    const { addNotification } = (0,_contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_2__.useNotifications)();
    const [messages, setMessages] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isProcessing, setIsProcessing] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [inputValue, setInputValue] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [currentModel, setCurrentModel] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('grok-beta');
    const [showModelSelector, setShowModelSelector] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [streamingMessageId, setStreamingMessageId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const messagesEndRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const inputRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const fileInputRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const availableModels = [
        'grok-beta',
        'grok-2',
        'grok-vision',
        'grok-multimodal'
    ];
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        scrollToBottom();
    }, [messages]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // Initialize with welcome message
        if (messages.length === 0) {
            const welcomeMessage = {
                id: 'welcome',
                role: 'assistant',
                content: "I'm Grok, your AI assistant. I can help you with coding, creative projects, analysis, and more. What would you like to work on?",
                timestamp: new Date(),
                model: currentModel
            };
            setMessages([welcomeMessage]);
        }
    }, []);
    const generateMessageId = () => {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };
    // Advanced AI response simulation with context awareness
    const generateIntelligentResponse = async (userMessage, messageHistory, onChunk) => {
        const message = userMessage.toLowerCase();
        let response = '';
        // Analyze message context and intent
        const isCodeRequest = message.includes('code') || message.includes('function') || message.includes('class') || message.includes('write') || message.includes('create');
        const isExplanation = message.includes('how') || message.includes('why') || message.includes('what') || message.includes('explain');
        const isHelp = message.includes('help') || message.includes('stuck') || message.includes('problem') || message.includes('error');
        const isProject = message.includes('project') || message.includes('app') || message.includes('build') || message.includes('make');
        const isDebug = message.includes('debug') || message.includes('fix') || message.includes('error') || message.includes('bug');
        // Detect programming languages
        const languages = {
            javascript: /javascript|js|node|react|vue|angular|npm/i.test(userMessage),
            typescript: /typescript|ts/i.test(userMessage),
            python: /python|py|django|flask|fastapi/i.test(userMessage),
            rust: /rust|cargo/i.test(userMessage),
            go: /golang|go/i.test(userMessage),
            java: /java|spring|maven/i.test(userMessage),
            css: /css|styling|design|html/i.test(userMessage),
            sql: /sql|database|mysql|postgres/i.test(userMessage),
        };
        const detectedLang = Object.keys(languages).find(lang => languages[lang]);
        // Generate contextual responses
        if (isCodeRequest && detectedLang) {
            const codeExamples = {
                javascript: `Here's a ${userMessage.includes('function') ? 'function' : 'code example'} in JavaScript:

\`\`\`javascript
function ${userMessage.includes('async') ? 'async ' : ''}handleUserInput(input) {
    ${userMessage.includes('async') ? 'const result = await processInput(input);' : 'const result = processInput(input);'}
    return result;
}
\`\`\`

This function ${userMessage.includes('async') ? 'asynchronously ' : ''}processes user input. Would you like me to explain any part of this code or add more functionality?`,
                python: `Here's a Python ${userMessage.includes('class') ? 'class' : 'function'} for you:

\`\`\`python
${userMessage.includes('class') ? 'class' : 'def'} ${userMessage.includes('class') ? 'DataProcessor:' : 'process_data(data):'}
    ${userMessage.includes('class') ? 'def __init__(self, config=None):' : '"""Process the input data and return results"""'}
    ${userMessage.includes('class') ? '    self.config = config or {}' : 'result = {}'}
    ${userMessage.includes('class') ? '' : 'return result'}
\`\`\`

This ${userMessage.includes('class') ? 'class' : 'function'} provides a good starting point. What specific functionality would you like to add?`,
                typescript: `Here's a TypeScript implementation:

\`\`\`typescript
interface UserData {
    id: number;
    name: string;
    email: string;
}

${userMessage.includes('async') ? 'async ' : ''}function processUserData(data: UserData): ${userMessage.includes('async') ? 'Promise<boolean>' : 'boolean'} {
    // Validate and process user data
    ${userMessage.includes('async') ? 'await' : ''} validateData(data);
    return true;
}
\`\`\`

This provides type safety and clear interfaces. Need help with any specific TypeScript features?`
            };
            response = codeExamples[detectedLang] ||
                `I can help you write ${detectedLang} code! What specific functionality are you looking to implement? Please provide more details about your requirements.`;
        }
        else if (isProject) {
            const projectTemplates = {
                react: `Let's create a React project! Here's what I recommend:

1. **Setup**: \`npx create-react-app my-project --template typescript\`
2. **Key dependencies**: React Router, Tailwind CSS, Axios
3. **Project structure**:
   \`\`\`
   src/
   ├── components/
   ├── pages/
   ├── hooks/
   ├── utils/
   └── styles/
   \`\`\`

What type of React application are you building? I can provide more specific guidance based on your needs.`,
                api: `Perfect! Let's build an API. Here's a solid foundation:

**Node.js/Express API Structure**:
\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(3000, () => console.log('API running on port 3000'));
\`\`\`

What kind of API endpoints do you need? REST, GraphQL, or something else?`
            };
            const projectType = userMessage.includes('react') ? 'react' :
                userMessage.includes('api') ? 'api' : 'generic';
            response = projectTemplates[projectType] ||
                `I'd love to help you build your project! To give you the best guidance, could you tell me:

1. What type of application/project? (web app, API, mobile, desktop)
2. Which technologies do you prefer?
3. What's the main purpose or functionality?

Based on that, I can provide specific architecture recommendations and starter code.`;
        }
        else if (isDebug || isHelp) {
            response = `I'm here to help you debug! 🔍 

To provide the best assistance, could you share:

1. **What error are you seeing?** (exact error message if possible)
2. **What were you trying to do?** 
3. **What code are you working with?**
4. **What environment?** (browser, Node.js, specific framework)

Common debugging approaches I can help with:
- **Console debugging**: \`console.log()\` strategically placed
- **Error analysis**: Reading stack traces and error messages
- **Code review**: Looking for logic errors or typos
- **Performance issues**: Identifying bottlenecks

Share your code or error message and I'll help you fix it!`;
        }
        else if (isExplanation) {
            const concepts = {
                async: `**Async/Await in JavaScript**:

\`\`\`javascript
// Instead of callbacks or .then()
async function fetchUserData(id) {
    try {
        const response = await fetch(\`/api/users/\${id}\`);
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
    }
}
\`\`\`

**Key benefits**:
- Cleaner, more readable code
- Better error handling with try/catch
- Easier to debug than callback chains`,
                react: `**React Core Concepts**:

1. **Components**: Reusable UI pieces
2. **Props**: Data passed to components
3. **State**: Component's internal data
4. **Hooks**: Functions that let you "hook into" React features

\`\`\`jsx
function UserProfile({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    
    return (
        <div>
            <h1>{user.name}</h1>
            {isEditing ? <EditForm /> : <ViewMode />}
        </div>
    );
}
\`\`\`

What specific React concept would you like me to explain further?`,
                api: `**REST API Design Principles**:

1. **Resources**: Use nouns (not verbs) in URLs
2. **HTTP Methods**: 
   - GET: Retrieve data
   - POST: Create new resource
   - PUT: Update entire resource
   - PATCH: Partial update
   - DELETE: Remove resource

3. **Status Codes**:
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 404: Not Found
   - 500: Server Error

\`\`\`
GET    /api/users     → Get all users
POST   /api/users     → Create user
GET    /api/users/123 → Get specific user
PUT    /api/users/123 → Update user
\`\`\`

Which aspect of API design interests you most?`
            };
            const topic = userMessage.includes('async') ? 'async' :
                userMessage.includes('react') ? 'react' :
                    userMessage.includes('api') ? 'api' : 'general';
            response = concepts[topic] ||
                `I'd be happy to explain that concept! Could you be more specific about what you'd like to understand? 

I can explain:
- **Programming concepts**: async/await, promises, closures, scope
- **Frameworks**: React, Vue, Express, Django
- **Patterns**: MVC, REST, GraphQL, microservices
- **Tools**: Git, Docker, databases, testing

What would you like to dive into?`;
        }
        else {
            // General conversational responses with variety
            const responses = [
                `That's interesting! I can help you with a wide range of development tasks. Are you working on:

- **Web development** (React, Vue, vanilla JS)
- **Backend services** (Node.js, Python, APIs)
- **Mobile apps** (React Native, Flutter)
- **DevOps/tooling** (Docker, CI/CD, deployment)
- **Data analysis** (Python, SQL, visualization)

What's your current project or challenge?`,
                `I'm here to help with your development needs! 💻

Whether you're:
- Building a new application
- Debugging existing code
- Learning new technologies
- Optimizing performance
- Setting up development environments

Just describe what you're working on and I'll provide specific, actionable guidance.`,
                `Great question! I can assist with:

🔧 **Technical Implementation**
- Code examples and best practices
- Architecture recommendations
- Performance optimization

🐛 **Problem Solving**
- Debugging assistance
- Error analysis and fixes
- Code reviews

📚 **Learning & Growth**
- Concept explanations
- Tutorial walkthroughs
- Technology comparisons

What would be most helpful for you right now?`,
                `I'm designed to be your AI development companion! I can help you:

**Write better code** with examples and explanations
**Solve problems** through debugging and analysis
**Learn new concepts** with clear, practical examples
**Build projects** with architecture guidance

What are you working on? Share your code, errors, or ideas and I'll provide targeted help.`
            ];
            response = responses[Math.floor(Math.random() * responses.length)];
        }
        // Stream the response with realistic typing
        const words = response.split(' ');
        for (let i = 0; i < words.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 70));
            const chunk = (i === 0 ? '' : ' ') + words[i];
            onChunk(chunk);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isProcessing)
            return;
        const userMessage = {
            id: generateMessageId(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };
        const assistantMessageId = generateMessageId();
        const assistantMessage = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isStreaming: true,
            model: currentModel
        };
        setMessages(prev => [...prev, userMessage, assistantMessage]);
        setInputValue('');
        setIsProcessing(true);
        setStreamingMessageId(assistantMessageId);
        try {
            let accumulatedContent = '';
            await generateIntelligentResponse(userMessage.content, messages, (chunk) => {
                accumulatedContent += chunk;
                setMessages(prev => prev.map(msg => msg.id === assistantMessageId
                    ? { ...msg, content: accumulatedContent }
                    : msg));
            });
            // Mark streaming as complete
            setMessages(prev => prev.map(msg => msg.id === assistantMessageId
                ? { ...msg, isStreaming: false }
                : msg));
        }
        catch (error) {
            console.error('AI Response Error:', error);
            setMessages(prev => prev.map(msg => msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: "I'm having trouble processing your request right now. Please try again.",
                    isStreaming: false
                }
                : msg));
            addNotification({
                type: 'error',
                title: 'Response Error',
                message: 'Failed to generate response. Please try again.',
            });
        }
        finally {
            setIsProcessing(false);
            setStreamingMessageId(null);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };
    const handleModelChange = (model) => {
        setCurrentModel(model);
        setShowModelSelector(false);
        addNotification({
            type: 'info',
            title: 'Model Changed',
            message: `Switched to ${model}`,
        });
    };
    const clearConversation = () => {
        setMessages([]);
        setTimeout(() => {
            const welcomeMessage = {
                id: 'welcome_new',
                role: 'assistant',
                content: "Conversation cleared. What would you like to work on?",
                timestamp: new Date(),
                model: currentModel
            };
            setMessages([welcomeMessage]);
        }, 100);
    };
    const formatTime = (timestamp) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(timestamp);
    };
    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0)
            return;
        for (const file of Array.from(files)) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                addNotification({
                    type: 'error',
                    title: 'File Too Large',
                    message: `${file.name} is too large. Maximum size is 10MB.`,
                });
                continue;
            }
            // Handle different file types
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const attachment = {
                        type: 'image',
                        name: file.name,
                        content: e.target?.result
                    };
                    // Add as a message with attachment
                    const attachmentMessage = {
                        id: generateMessageId(),
                        role: 'user',
                        content: `Uploaded image: ${file.name}`,
                        timestamp: new Date(),
                        attachments: [attachment]
                    };
                    setMessages(prev => [...prev, attachmentMessage]);
                };
                reader.readAsDataURL(file);
            }
        }
        // Clear the input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const ModelIcon = ({ model }) => {
        switch (model) {
            case 'grok-beta':
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "model-icon beta", children: "\u03B2" });
            case 'grok-2':
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "model-icon two", children: "2" });
            case 'grok-vision':
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "model-icon vision", children: "\uD83D\uDC41" });
            case 'grok-multimodal':
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "model-icon multimodal", children: "\uD83C\uDFAD" });
            default:
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "model-icon default", children: "G" });
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `grok-chat-interface ${className || ''}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grok-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grok-branding", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grok-logo", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "grok-x", children: "\uD835\uDD4F" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "grok-text", children: "Grok" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "connection-status", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "status-dot online" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Connected" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-controls", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "model-selector-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "model-selector-btn", onClick: () => setShowModelSelector(!showModelSelector), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ModelIcon, { model: currentModel }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: currentModel }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "chevron", viewBox: "0 0 24 24", width: "16", height: "16", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { fill: "currentColor", d: "M7 10l5 5 5-5z" }) })] }), showModelSelector && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "model-dropdown", children: availableModels.map(model => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `model-option ${model === currentModel ? 'active' : ''}`, onClick: () => handleModelChange(model), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ModelIcon, { model: model }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: model }), model === currentModel && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "check", viewBox: "0 0 24 24", width: "16", height: "16", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { fill: "currentColor", d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" }) }))] }, model))) }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "clear-chat-btn", onClick: clearConversation, title: "Clear conversation", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "18", height: "18", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { fill: "currentColor", d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }) }) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "messages-container", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "messages-wrapper", children: [messages.map((message) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `message-bubble ${message.role}`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "message-content", children: [message.role === 'assistant' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "assistant-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "assistant-avatar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "grok-mini", children: "\uD835\uDD4F" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "assistant-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "assistant-name", children: "Grok" }), message.model && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "model-badge", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ModelIcon, { model: message.model }) }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "message-time", children: formatTime(message.timestamp) })] })), message.role === 'user' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "user-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "message-time", children: formatTime(message.timestamp) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "user-avatar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "You" }) })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "message-text", children: [message.content, message.isStreaming && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "streaming-cursor", children: "\u258B" }))] }), message.attachments && message.attachments.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "message-attachments", children: message.attachments.map((attachment, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `attachment ${attachment.type}`, children: [attachment.type === 'image' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", { src: attachment.content, alt: attachment.name })), attachment.type === 'code' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("pre", { className: `language-${attachment.language || 'text'}`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", { children: attachment.content }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "attachment-name", children: attachment.name })] }, index))) }))] }) }, message.id))), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: messagesEndRef })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-container", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("form", { onSubmit: handleSubmit, className: "input-form", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", className: "attachment-btn", onClick: () => fileInputRef.current?.click(), title: "Attach file", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "20", height: "20", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { fill: "currentColor", d: "M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { ref: inputRef, value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyDown: handleKeyDown, placeholder: "Message Grok...", disabled: isProcessing, rows: 1, className: "message-input" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "submit", disabled: !inputValue.trim() || isProcessing, className: "send-btn", title: "Send message", children: isProcessing ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "spinner", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "spinner-inner" }) })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "20", height: "20", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { fill: "currentColor", d: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" }) })) })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { ref: fileInputRef, type: "file", multiple: true, accept: "image/*,.txt,.md,.js,.ts,.tsx,.jsx,.py,.json,.css,.html,.xml", onChange: handleFileUpload, style: { display: 'none' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "input-footer", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "hint", children: "Press Enter to send, Shift+Enter for new line" }) })] })] }));
};


/***/ }),

/***/ "./src/renderer/components/ai-assistant/AIAssistant.tsx":
/*!**************************************************************!*\
  !*** ./src/renderer/components/ai-assistant/AIAssistant.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AIAssistant: () => (/* binding */ AIAssistant)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const AIAssistant = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-assistant", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83E\uDD16 AI Assistant" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Your intelligent coding companion." })] }));


/***/ }),

/***/ "./src/renderer/components/ai-components/ComponentRegistry.tsx":
/*!*********************************************************************!*\
  !*** ./src/renderer/components/ai-components/ComponentRegistry.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentRegistry: () => (/* binding */ ComponentRegistry),
/* harmony export */   useComponentRegistry: () => (/* binding */ useComponentRegistry)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const ComponentRegistryContext = (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);
const useComponentRegistry = () => {
    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ComponentRegistryContext);
    if (!context) {
        throw new Error('useComponentRegistry must be used within a ComponentRegistry');
    }
    return context;
};
const ComponentRegistry = ({ components: initialComponents, activeComponents, onToggleComponent, children }) => {
    const [components, setComponents] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialComponents);
    const [componentConfigs, setComponentConfigs] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(new Map());
    const registerComponent = (component) => {
        setComponents(prev => {
            const exists = prev.find(c => c.id === component.id);
            if (exists) {
                return prev.map(c => c.id === component.id ? component : c);
            }
            return [...prev, component];
        });
        console.log(`📦 Registered component: ${component.name} (${component.id})`);
    };
    const unregisterComponent = (componentId) => {
        setComponents(prev => prev.filter(c => c.id !== componentId));
        setComponentConfigs(prev => {
            const newConfigs = new Map(prev);
            newConfigs.delete(componentId);
            return newConfigs;
        });
        console.log(`🗑️ Unregistered component: ${componentId}`);
    };
    const activateComponent = (componentId) => {
        if (!activeComponents.has(componentId)) {
            onToggleComponent(componentId);
        }
    };
    const deactivateComponent = (componentId) => {
        if (activeComponents.has(componentId)) {
            onToggleComponent(componentId);
        }
    };
    const toggleComponent = (componentId) => {
        onToggleComponent(componentId);
    };
    const updateComponentConfig = (componentId, config) => {
        setComponentConfigs(prev => new Map(prev.set(componentId, config)));
        console.log(`⚙️ Updated config for component: ${componentId}`);
    };
    const getComponent = (componentId) => {
        const component = components.find(c => c.id === componentId);
        if (component) {
            const config = componentConfigs.get(componentId);
            return {
                ...component,
                config: config || component.config
            };
        }
        return null;
    };
    const getComponentsByCategory = (category) => {
        return components.filter(c => c.category === category);
    };
    const isComponentActive = (componentId) => {
        return activeComponents.has(componentId);
    };
    const contextValue = {
        components,
        activeComponents,
        registerComponent,
        unregisterComponent,
        activateComponent,
        deactivateComponent,
        toggleComponent,
        updateComponentConfig,
        getComponent,
        getComponentsByCategory,
        isComponentActive,
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ComponentRegistryContext.Provider, { value: contextValue, children: children }));
};


/***/ }),

/***/ "./src/renderer/components/ai-models/AIModelManager.tsx":
/*!**************************************************************!*\
  !*** ./src/renderer/components/ai-models/AIModelManager.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AIModelManager: () => (/* binding */ AIModelManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const AIModelManager = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-model-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83E\uDDE0 AI Model Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Manage and configure AI models for the development environment." })] }));


/***/ }),

/***/ "./src/renderer/components/ai-pages/AIPageProvider.tsx":
/*!*************************************************************!*\
  !*** ./src/renderer/components/ai-pages/AIPageProvider.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AIPageProvider: () => (/* binding */ AIPageProvider),
/* harmony export */   useAIPages: () => (/* binding */ useAIPages)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const AIPageContext = (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);
const useAIPages = () => {
    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AIPageContext);
    if (!context) {
        throw new Error('useAIPages must be used within an AIPageProvider');
    }
    return context;
};
const AIPageProvider = ({ pages, currentPage, onPageChange, children }) => {
    const [searchTerm, setSearchTerm] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [filteredPages, setFilteredPages] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(pages);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (searchTerm.trim() === '') {
            setFilteredPages(pages);
        }
        else {
            const filtered = pages.filter(page => page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                page.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                page.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                page.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())));
            setFilteredPages(filtered);
        }
    }, [searchTerm, pages]);
    const navigateToPage = (pageId) => {
        console.log(`🔄 Navigating to page: ${pageId}`);
        onPageChange(pageId);
    };
    const searchPages = (term) => {
        setSearchTerm(term);
    };
    const getPagesByCategory = (category) => {
        return pages.filter(page => page.category === category);
    };
    const getPageMetadata = (pageId) => {
        return pages.find(page => page.id === pageId) || null;
    };
    const isPageActive = (pageId) => {
        return currentPage === pageId;
    };
    const contextValue = {
        pages,
        currentPage,
        searchTerm,
        filteredPages,
        navigateToPage,
        searchPages,
        getPagesByCategory,
        getPageMetadata,
        isPageActive,
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(AIPageContext.Provider, { value: contextValue, children: children }));
};


/***/ }),

/***/ "./src/renderer/components/api/APIManager.tsx":
/*!****************************************************!*\
  !*** ./src/renderer/components/api/APIManager.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   APIManager: () => (/* binding */ APIManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const APIManager = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "api-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDD0C API Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Manage API endpoints and integrations." })] }));


/***/ }),

/***/ "./src/renderer/components/code-analysis/CodeAnalyzer.tsx":
/*!****************************************************************!*\
  !*** ./src/renderer/components/code-analysis/CodeAnalyzer.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CodeAnalyzer: () => (/* binding */ CodeAnalyzer)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const CodeAnalyzer = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "code-analyzer", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDD2C Code Analyzer" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "AI-powered code analysis and suggestions." })] }));


/***/ }),

/***/ "./src/renderer/components/database/DatabaseManager.tsx":
/*!**************************************************************!*\
  !*** ./src/renderer/components/database/DatabaseManager.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DatabaseManager: () => (/* binding */ DatabaseManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const DatabaseManager = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "database-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDDC4\uFE0F Database Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Manage database connections and queries." })] }));


/***/ }),

/***/ "./src/renderer/components/debug/DebugPanel.tsx":
/*!******************************************************!*\
  !*** ./src/renderer/components/debug/DebugPanel.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DebugPanel: () => (/* binding */ DebugPanel)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const DebugPanel = () => {
    const [messages, setMessages] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [filter, setFilter] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('all');
    const [autoScroll, setAutoScroll] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // Add sample debug messages
        const sampleMessages = [
            {
                id: '1',
                level: 'info',
                message: 'AI Interface Manager initialized successfully',
                timestamp: new Date(),
                source: 'AIInterfaceManager'
            },
            {
                id: '2',
                level: 'debug',
                message: 'Loading 309 pages and 29 components...',
                timestamp: new Date(),
                source: 'ComponentRegistry'
            },
            {
                id: '3',
                level: 'warn',
                message: 'Some AI models may take longer to load',
                timestamp: new Date(),
                source: 'AIModelManager'
            }
        ];
        setMessages(sampleMessages);
    }, []);
    const filteredMessages = messages.filter(msg => filter === 'all' || msg.level === filter);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "debug-panel", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "debug-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDC1E Debug Console" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "debug-controls", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { value: filter, onChange: (e) => setFilter(e.target.value), className: "debug-filter", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "all", children: "All" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "info", children: "Info" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "debug", children: "Debug" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "warn", children: "Warnings" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "error", children: "Errors" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "clear-btn", onClick: () => setMessages([]), children: "Clear" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "debug-messages", children: filteredMessages.map(msg => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `debug-message level-${msg.level}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "timestamp", children: msg.timestamp.toLocaleTimeString() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `level-badge level-${msg.level}`, children: msg.level.toUpperCase() }), msg.source && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "source", children: ["[", msg.source, "]"] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "message", children: msg.message })] }, msg.id))) })] }));
};


/***/ }),

/***/ "./src/renderer/components/deployment/DeploymentManager.tsx":
/*!******************************************************************!*\
  !*** ./src/renderer/components/deployment/DeploymentManager.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DeploymentManager: () => (/* binding */ DeploymentManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const DeploymentManager = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "deployment-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDE80 Deployment Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Deploy applications to various platforms." })] }));


/***/ }),

/***/ "./src/renderer/components/devtools/DevToolsPanel.tsx":
/*!************************************************************!*\
  !*** ./src/renderer/components/devtools/DevToolsPanel.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DevToolsPanel: () => (/* binding */ DevToolsPanel)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const DevToolsPanel = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "devtools-panel", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDEE0\uFE0F Dev Tools Panel" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Developer tools and utilities." })] }));


/***/ }),

/***/ "./src/renderer/components/docs/DocumentationManager.tsx":
/*!***************************************************************!*\
  !*** ./src/renderer/components/docs/DocumentationManager.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocumentationManager: () => (/* binding */ DocumentationManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const DocumentationManager = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "documentation-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDCDA Documentation Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Generate and manage project documentation." })] }));


/***/ }),

/***/ "./src/renderer/components/explorer/ProjectExplorer.tsx":
/*!**************************************************************!*\
  !*** ./src/renderer/components/explorer/ProjectExplorer.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProjectExplorer: () => (/* binding */ ProjectExplorer)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const ProjectExplorer = () => {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "project-explorer", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDDC2\uFE0F Project Explorer" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "explorer-content", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "project-tree", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tree-item", children: "\uD83D\uDCC1 src/" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tree-item", children: "\uD83D\uDCC4 package.json" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tree-item", children: "\uD83D\uDCC4 README.md" })] }) })] }));
};


/***/ }),

/***/ "./src/renderer/components/extensions/ExtensionManager.tsx":
/*!*****************************************************************!*\
  !*** ./src/renderer/components/extensions/ExtensionManager.tsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExtensionManager: () => (/* binding */ ExtensionManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const ExtensionManager = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "extension-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83E\uDDE9 Extension Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Install and manage VS Code extensions." })] }));


/***/ }),

/***/ "./src/renderer/components/feedback/FeedbackManager.tsx":
/*!**************************************************************!*\
  !*** ./src/renderer/components/feedback/FeedbackManager.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FeedbackManager: () => (/* binding */ FeedbackManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const FeedbackManager = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "feedback-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDCAD Feedback Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Send feedback and suggestions." })] }));


/***/ }),

/***/ "./src/renderer/components/git/GitManager.tsx":
/*!****************************************************!*\
  !*** ./src/renderer/components/git/GitManager.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GitManager: () => (/* binding */ GitManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const GitManager = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "git-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83C\uDF3F Git Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Git version control interface." })] }));


/***/ }),

/***/ "./src/renderer/components/help/HelpCenter.tsx":
/*!*****************************************************!*\
  !*** ./src/renderer/components/help/HelpCenter.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HelpCenter: () => (/* binding */ HelpCenter)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const HelpCenter = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "help-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\u2753 Help Center" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Get help and support documentation." })] }));


/***/ }),

/***/ "./src/renderer/components/performance/PerformanceMonitor.tsx":
/*!********************************************************************!*\
  !*** ./src/renderer/components/performance/PerformanceMonitor.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PerformanceMonitor: () => (/* binding */ PerformanceMonitor)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const PerformanceMonitor = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "performance-monitor", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDCCA Performance Monitor" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Monitor application performance and metrics." })] }));


/***/ }),

/***/ "./src/renderer/components/plugins/PluginManager.tsx":
/*!***********************************************************!*\
  !*** ./src/renderer/components/plugins/PluginManager.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PluginManager: () => (/* binding */ PluginManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const PluginManager = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "plugin-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDD27 Plugin Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Manage plugins and add-ons." })] }));


/***/ }),

/***/ "./src/renderer/components/search/SearchManager.tsx":
/*!**********************************************************!*\
  !*** ./src/renderer/components/search/SearchManager.tsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SearchManager: () => (/* binding */ SearchManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const SearchManager = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "search-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDD0D Search Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Advanced search and replace functionality." })] }));


/***/ }),

/***/ "./src/renderer/components/security/SecurityCenter.tsx":
/*!*************************************************************!*\
  !*** ./src/renderer/components/security/SecurityCenter.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SecurityCenter: () => (/* binding */ SecurityCenter)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const SecurityCenter = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "security-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDD12 Security Center" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Manage security settings and vulnerability scanning." })] }));


/***/ }),

/***/ "./src/renderer/components/settings/SettingsManager.tsx":
/*!**************************************************************!*\
  !*** ./src/renderer/components/settings/SettingsManager.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsManager: () => (/* binding */ SettingsManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const SettingsManager = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\u2699\uFE0F Settings Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Configure application settings and preferences." })] }));


/***/ }),

/***/ "./src/renderer/components/terminal/TerminalManager.tsx":
/*!**************************************************************!*\
  !*** ./src/renderer/components/terminal/TerminalManager.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TerminalManager: () => (/* binding */ TerminalManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const TerminalManager = () => {
    const [terminals, setTerminals] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [activeTerminalId, setActiveTerminalId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [output, setOutput] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [input, setInput] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const terminalRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // Initialize with a default terminal
        const defaultTerminal = {
            id: 'terminal-1',
            name: 'Terminal 1',
            cwd: '/home/user/projects',
            isActive: true
        };
        setTerminals([defaultTerminal]);
        setActiveTerminalId(defaultTerminal.id);
        setOutput([
            '$ Welcome to VSEmbed AI Terminal',
            '$ Type "help" for available commands',
            '$ Current directory: /home/user/projects',
            '$ '
        ]);
    }, []);
    const createNewTerminal = () => {
        const newTerminal = {
            id: `terminal-${terminals.length + 1}`,
            name: `Terminal ${terminals.length + 1}`,
            cwd: '/home/user/projects',
            isActive: false
        };
        setTerminals(prev => [...prev, newTerminal]);
    };
    const switchTerminal = (terminalId) => {
        setTerminals(prev => prev.map(t => ({ ...t, isActive: t.id === terminalId })));
        setActiveTerminalId(terminalId);
    };
    const executeCommand = (command) => {
        setOutput(prev => [...prev, `$ ${command}`]);
        // Simple command simulation
        let response = '';
        switch (command.toLowerCase().trim()) {
            case 'help':
                response = `Available commands:
  help - Show this help message
  ls - List files and directories
  pwd - Show current directory
  clear - Clear terminal
  npm install - Install npm packages
  npm start - Start development server
  git status - Show git status
  ai-assist - Get AI assistance`;
                break;
            case 'ls':
                response = `total 12
drwxr-xr-x  3 user user 4096 Jan 15 10:30 src/
drwxr-xr-x  2 user user 4096 Jan 15 10:30 node_modules/
-rw-r--r--  1 user user  1234 Jan 15 10:30 package.json
-rw-r--r--  1 user user   567 Jan 15 10:30 README.md`;
                break;
            case 'pwd':
                response = '/home/user/projects/vsembed-ai';
                break;
            case 'clear':
                setOutput(['$ ']);
                return;
            case 'git status':
                response = `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   src/renderer/components/AIInterfaceManager.tsx
  
no changes added to commit`;
                break;
            case 'npm start':
                response = `> vsembed-ai@0.1.0 start
> webpack serve --config webpack.renderer.config.js

✅ Development server starting on http://localhost:3000
🤖 AI features enabled
📦 All 309 pages loaded successfully`;
                break;
            case 'ai-assist':
                response = `🤖 AI Assistant activated!
Available AI features:
- Code completion and suggestions
- Error detection and fixes
- Code refactoring recommendations
- Documentation generation
- Test case generation

Type 'ai-assist <command>' for specific AI help.`;
                break;
            default:
                response = `Command not found: ${command}
Type 'help' for available commands.`;
        }
        setOutput(prev => [...prev, response, '$ ']);
        setInput('');
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            executeCommand(input);
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // Auto-scroll to bottom
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [output]);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "terminal-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "terminal-tabs", children: [terminals.map(terminal => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `terminal-tab ${terminal.isActive ? 'active' : ''}`, onClick: () => switchTerminal(terminal.id), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: terminal.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "close-tab", children: "\u00D7" })] }, terminal.id))), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "new-terminal-btn", onClick: createNewTerminal, children: "\u2795" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: terminalRef, className: "terminal-content", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "terminal-output", children: [output.map((line, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "terminal-line", children: line }, index))), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "terminal-input-line", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "prompt", children: "$ " }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: handleKeyPress, className: "terminal-input", autoFocus: true })] })] }) })] }));
};


/***/ }),

/***/ "./src/renderer/components/testing/TestRunner.tsx":
/*!********************************************************!*\
  !*** ./src/renderer/components/testing/TestRunner.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TestRunner: () => (/* binding */ TestRunner)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const TestRunner = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "test-runner", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83E\uDDEA Test Runner" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Run and manage automated tests." })] }));


/***/ }),

/***/ "./src/renderer/components/themes/ThemeManager.tsx":
/*!*********************************************************!*\
  !*** ./src/renderer/components/themes/ThemeManager.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ThemeManager: () => (/* binding */ ThemeManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const ThemeManager = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "theme-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83C\uDFA8 Theme Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Customize the interface theme and appearance." })] }));


/***/ }),

/***/ "./src/renderer/components/updates/UpdateManager.tsx":
/*!***********************************************************!*\
  !*** ./src/renderer/components/updates/UpdateManager.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UpdateManager: () => (/* binding */ UpdateManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const UpdateManager = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "update-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDD04 Update Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Manage application updates and versions." })] }));


/***/ }),

/***/ "./src/renderer/components/workspace/AIWorkspaceManager.tsx":
/*!******************************************************************!*\
  !*** ./src/renderer/components/workspace/AIWorkspaceManager.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AIWorkspaceManager: () => (/* binding */ AIWorkspaceManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _styles_AIWorkspaceManager_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../styles/AIWorkspaceManager.css */ "./src/renderer/styles/AIWorkspaceManager.css");



const AIWorkspaceManager = () => {
    const [workspaces, setWorkspaces] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [currentWorkspace, setCurrentWorkspace] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // Initialize with sample workspaces
        const sampleWorkspaces = [
            {
                id: 'ws-1',
                name: 'React AI Dashboard',
                path: '/projects/react-ai-dashboard',
                type: 'project',
                aiConfig: {
                    enabledFeatures: ['auto-completion', 'error-detection', 'refactoring'],
                    modelPreferences: ['grok-beta', 'grok-2'],
                    autoSave: true,
                    smartSuggestions: true,
                },
                files: [],
                created: new Date('2024-01-15'),
                lastAccessed: new Date(),
            },
            {
                id: 'ws-2',
                name: 'Python ML Project',
                path: '/projects/python-ml',
                type: 'project',
                files: [],
                created: new Date('2024-02-01'),
                lastAccessed: new Date('2024-02-15'),
            },
        ];
        setWorkspaces(sampleWorkspaces);
        setCurrentWorkspace(sampleWorkspaces[0]);
        setLoading(false);
    }, []);
    const createNewWorkspace = (name, type) => {
        const newWorkspace = {
            id: `ws-${Date.now()}`,
            name,
            path: `/projects/${name.toLowerCase().replace(/\s+/g, '-')}`,
            type,
            files: [],
            created: new Date(),
            lastAccessed: new Date(),
        };
        setWorkspaces(prev => [...prev, newWorkspace]);
        setCurrentWorkspace(newWorkspace);
    };
    if (loading) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-workspace-loading", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "loading-spinner" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Loading AI Workspace..." })] }));
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-workspace-manager", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "workspace-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { children: "\uD83C\uDFE2 AI Workspace Manager" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "workspace-stats", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Total Workspaces: ", workspaces.length] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Active: ", currentWorkspace?.name || 'None'] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "workspace-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "workspace-sidebar", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "workspace-list", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Workspaces" }), workspaces.map(workspace => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `workspace-item ${currentWorkspace?.id === workspace.id ? 'active' : ''}`, onClick: () => setCurrentWorkspace(workspace), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "workspace-icon", children: workspace.type === 'project' ? '📁' : workspace.type === 'sandbox' ? '🧪' : '📋' }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "workspace-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: workspace.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: workspace.path }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("small", { children: ["Last accessed: ", workspace.lastAccessed.toLocaleDateString()] })] })] }, workspace.id)))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "workspace-actions", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "create-workspace-btn", onClick: () => createNewWorkspace('New Project', 'project'), children: "\u2795 Create Workspace" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "workspace-main", children: currentWorkspace ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "workspace-details", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "workspace-header-details", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: currentWorkspace.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "workspace-type", children: currentWorkspace.type })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "workspace-tabs", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tab active", children: "Files" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tab", children: "AI Config" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tab", children: "Analytics" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tab", children: "Settings" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "workspace-content-area", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "file-explorer", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "explorer-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "\uD83D\uDCC1 File Explorer" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "add-file-btn", children: "\u2795 Add File" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "file-tree", children: currentWorkspace.files.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "empty-workspace", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "No files in this workspace yet." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => { }, children: "Create your first file" })] })) : (currentWorkspace.files.map(file => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "file-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "file-icon", children: file.type === 'directory' ? '📁' : '📄' }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "file-name", children: file.name }), file.aiAnalysis && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-analysis-indicator", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "complexity", children: ["C: ", file.aiAnalysis.complexity] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "errors", children: ["E: ", file.aiAnalysis.errors] })] }))] }, file.id)))) })] }), currentWorkspace.aiConfig && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-config-panel", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "\uD83E\uDD16 AI Configuration" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-features", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h5", { children: "Enabled Features:" }), currentWorkspace.aiConfig.enabledFeatures.map(feature => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "feature-tag", children: feature }, feature)))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ai-models", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h5", { children: "Preferred Models:" }), currentWorkspace.aiConfig.modelPreferences.map(model => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "model-tag", children: model }, model)))] })] }))] })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "no-workspace-selected", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "No workspace selected" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Select a workspace from the sidebar or create a new one." })] })) })] })] }));
};


/***/ }),

/***/ "./src/renderer/contexts/AIContext.tsx":
/*!*********************************************!*\
  !*** ./src/renderer/contexts/AIContext.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AIProvider: () => (/* binding */ AIProvider),
/* harmony export */   useAI: () => (/* binding */ useAI)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _NotificationContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NotificationContext */ "./src/renderer/contexts/NotificationContext.tsx");



const AIContext = (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);
const useAI = () => {
    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AIContext);
    if (!context) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
};
const AIProvider = ({ children }) => {
    const [messages, setMessages] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isProcessing, setIsProcessing] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [currentModel, setCurrentModel] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('GPT-4');
    const [availableModels, setAvailableModels] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(['GPT-4', 'GPT-3.5-turbo', 'Claude-3-Opus']);
    const [activePlan, setActivePlan] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const { addNotification } = (0,_NotificationContext__WEBPACK_IMPORTED_MODULE_2__.useNotifications)();
    const electronAPI = window.electronAPI;
    const messageIdCounter = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(0);
    const generateMessageId = () => {
        messageIdCounter.current += 1;
        return `msg_${messageIdCounter.current}_${Date.now()}`;
    };
    const sendMessage = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (content) => {
        if (!electronAPI) {
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Electron API not available',
            });
            return;
        }
        // Add user message
        const userMessage = {
            id: generateMessageId(),
            role: 'user',
            content,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setIsProcessing(true);
        try {
            // Send request to AI orchestrator
            const response = await electronAPI.ai.processRequest(content, {
                currentMessages: messages,
                timestamp: new Date().toISOString(),
            });
            // Add AI response message
            const aiMessage = {
                id: generateMessageId(),
                role: 'assistant',
                content: response.explanation,
                timestamp: new Date(),
                plan: response.plan,
            };
            setMessages(prev => [...prev, aiMessage]);
            // Set active plan if one was created
            if (response.plan) {
                setActivePlan(response.plan);
                // Show approval notification if required
                if (response.plan.requires_approval) {
                    addNotification({
                        type: 'info',
                        title: 'Action Plan Requires Approval',
                        message: `The AI has created a ${response.plan.risk_assessment} risk plan with ${response.plan.actions.length} action(s). Please review and approve individual actions.`,
                        duration: 10000,
                        actions: [
                            {
                                label: 'Review Plan',
                                action: () => {
                                    // Focus on the plan in the UI
                                    console.log('Focus on plan:', response.plan.id);
                                },
                                style: 'primary',
                            },
                        ],
                    });
                }
            }
        }
        catch (error) {
            const errorMessage = {
                id: generateMessageId(),
                role: 'system',
                content: `Error: ${error instanceof Error ? error.message : 'Failed to process request'}`,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
            addNotification({
                type: 'error',
                title: 'AI Request Failed',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
        finally {
            setIsProcessing(false);
        }
    }, [electronAPI, messages, addNotification]);
    const clearConversation = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
        setMessages([]);
        setActivePlan(null);
        if (electronAPI) {
            electronAPI.ai.clearHistory?.().catch(console.error);
        }
        addNotification({
            type: 'info',
            title: 'Conversation Cleared',
            message: 'The conversation history has been cleared.',
        });
    }, [electronAPI, addNotification]);
    const setModel = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (modelName) => {
        if (!electronAPI) {
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Electron API not available',
            });
            return false;
        }
        try {
            const success = await electronAPI.ai.setModel(modelName);
            if (success) {
                setCurrentModel(modelName);
                addNotification({
                    type: 'success',
                    title: 'Model Changed',
                    message: `AI model changed to ${modelName}`,
                });
            }
            else {
                addNotification({
                    type: 'error',
                    title: 'Failed to Change Model',
                    message: `Could not switch to model ${modelName}`,
                });
            }
            return success;
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Change Model',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
            return false;
        }
    }, [electronAPI, addNotification]);
    const refreshModels = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async () => {
        if (!electronAPI)
            return;
        try {
            const models = await electronAPI.ai.getModels();
            setAvailableModels(models);
        }
        catch (error) {
            console.error('Failed to refresh models:', error);
        }
    }, [electronAPI]);
    const approveAction = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((planId, actionId) => {
        if (!activePlan || activePlan.id !== planId)
            return;
        const updatedPlan = {
            ...activePlan,
            actions: activePlan.actions.map(action => action.id === actionId ? { ...action, approved: true } : action),
        };
        setActivePlan(updatedPlan);
        addNotification({
            type: 'success',
            title: 'Action Approved',
            message: 'The action has been approved for execution.',
        });
    }, [activePlan, addNotification]);
    const rejectAction = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((planId, actionId) => {
        if (!activePlan || activePlan.id !== planId)
            return;
        const updatedPlan = {
            ...activePlan,
            actions: activePlan.actions.map(action => action.id === actionId ? { ...action, approved: false } : action),
        };
        setActivePlan(updatedPlan);
        addNotification({
            type: 'warning',
            title: 'Action Rejected',
            message: 'The action has been rejected and will not be executed.',
        });
    }, [activePlan, addNotification]);
    const executeApprovedPlan = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (planId) => {
        if (!electronAPI || !activePlan || activePlan.id !== planId) {
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Cannot execute plan: invalid plan or API not available',
            });
            return false;
        }
        const approvedActions = activePlan.actions.filter(action => action.approved);
        if (approvedActions.length === 0) {
            addNotification({
                type: 'warning',
                title: 'No Actions Approved',
                message: 'No actions have been approved for execution.',
            });
            return false;
        }
        setIsProcessing(true);
        try {
            const success = await electronAPI.ai.executePlan(planId);
            if (success) {
                // Update plan to mark actions as executed
                const updatedPlan = {
                    ...activePlan,
                    actions: activePlan.actions.map(action => action.approved ? { ...action, executed: true } : action),
                };
                setActivePlan(updatedPlan);
                addNotification({
                    type: 'success',
                    title: 'Plan Executed',
                    message: `Successfully executed ${approvedActions.length} approved action(s).`,
                });
            }
            else {
                addNotification({
                    type: 'error',
                    title: 'Plan Execution Failed',
                    message: 'An error occurred while executing the action plan.',
                });
            }
            return success;
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Plan Execution Failed',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
            return false;
        }
        finally {
            setIsProcessing(false);
        }
    }, [electronAPI, activePlan, addNotification]);
    const regenerateResponse = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (messageId) => {
        // Find the message and the user message before it
        const messageIndex = messages.findIndex(msg => msg.id === messageId);
        if (messageIndex === -1 || messageIndex === 0)
            return;
        const previousMessage = messages[messageIndex - 1];
        if (previousMessage.role !== 'user')
            return;
        // Remove the AI message and regenerate
        setMessages(prev => prev.slice(0, messageIndex));
        await sendMessage(previousMessage.content);
    }, [messages, sendMessage]);
    // Initialize models on component mount
    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(() => {
        refreshModels();
    }, [refreshModels]);
    const value = {
        messages,
        isProcessing,
        currentModel,
        availableModels,
        activePlan,
        sendMessage,
        clearConversation,
        setModel,
        refreshModels,
        approveAction,
        rejectAction,
        executeApprovedPlan,
        regenerateResponse,
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(AIContext.Provider, { value: value, children: children }));
};


/***/ }),

/***/ "./src/renderer/contexts/NotificationContext.tsx":
/*!*******************************************************!*\
  !*** ./src/renderer/contexts/NotificationContext.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotificationProvider: () => (/* binding */ NotificationProvider),
/* harmony export */   useNotifications: () => (/* binding */ useNotifications)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const NotificationContext = (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);
const useNotifications = () => {
    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const addNotification = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = {
            ...notification,
            id,
            duration: notification.duration ?? 5000,
        };
        setNotifications(prev => [...prev, newNotification]);
        // Auto-remove notification after duration
        if (newNotification.duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, newNotification.duration);
        }
        return id;
    }, []);
    const removeNotification = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);
    const clearNotifications = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
        setNotifications([]);
    }, []);
    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(NotificationContext.Provider, { value: value, children: [children, (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(NotificationList, {})] }));
};
const NotificationList = () => {
    const { notifications, removeNotification } = useNotifications();
    if (notifications.length === 0) {
        return null;
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "notification-container", children: notifications.map(notification => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(NotificationItem, { notification: notification, onRemove: () => removeNotification(notification.id) }, notification.id))) }));
};
const NotificationItem = ({ notification, onRemove }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return '✓';
            case 'warning':
                return '⚠';
            case 'error':
                return '✕';
            case 'info':
            default:
                return 'ℹ';
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `notification notification-${notification.type}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "notification-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "notification-icon", children: getIcon() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "notification-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "notification-title", children: notification.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "notification-message", children: notification.message })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "notification-close", onClick: onRemove, children: "\u00D7" })] }), notification.actions && notification.actions.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "notification-actions", children: notification.actions.map((action, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `button ${action.style === 'primary' ? '' : 'secondary'}`, onClick: () => {
                        action.action();
                        onRemove();
                    }, children: action.label }, index))) }))] }));
};
// CSS for notifications (would be in a separate file in a real app)
const notificationStyles = `
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.notification {
  background-color: var(--vscode-panel-background);
  border: 1px solid var(--vscode-border);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: slideInRight 0.3s ease-out;
}

.notification-success {
  border-left: 4px solid var(--vscode-success);
}

.notification-warning {
  border-left: 4px solid var(--vscode-warning);
}

.notification-error {
  border-left: 4px solid var(--vscode-error);
}

.notification-info {
  border-left: 4px solid var(--vscode-info);
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.notification-icon {
  font-size: 18px;
  font-weight: bold;
  min-width: 20px;
}

.notification-success .notification-icon {
  color: var(--vscode-success);
}

.notification-warning .notification-icon {
  color: var(--vscode-warning);
}

.notification-error .notification-icon {
  color: var(--vscode-error);
}

.notification-info .notification-icon {
  color: var(--vscode-info);
}

.notification-text {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.notification-close:hover {
  opacity: 1;
  background-color: var(--vscode-list-hover-background);
}

.notification-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.notification-actions .button {
  font-size: 12px;
  padding: 6px 12px;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
`;
// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = notificationStyles;
document.head.appendChild(styleElement);


/***/ }),

/***/ "./src/renderer/contexts/RunnerContext.tsx":
/*!*************************************************!*\
  !*** ./src/renderer/contexts/RunnerContext.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RunnerProvider: () => (/* binding */ RunnerProvider),
/* harmony export */   useRunner: () => (/* binding */ useRunner)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _NotificationContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NotificationContext */ "./src/renderer/contexts/NotificationContext.tsx");



const RunnerContext = (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);
const useRunner = () => {
    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(RunnerContext);
    if (!context) {
        throw new Error('useRunner must be used within a RunnerProvider');
    }
    return context;
};
const RunnerProvider = ({ children }) => {
    const [status, setStatus] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
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
    const [isBuilding, setIsBuilding] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [isStarting, setIsStarting] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [logs, setLogs] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const { addNotification } = (0,_NotificationContext__WEBPACK_IMPORTED_MODULE_2__.useNotifications)();
    const electronAPI = window.electronAPI;
    const build = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (config) => {
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
            }
            else {
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
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Build Error',
                message: error instanceof Error ? error.message : 'Unknown build error',
            });
            return false;
        }
        finally {
            setIsBuilding(false);
        }
    }, [electronAPI, addNotification]);
    const start = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (config) => {
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
            }
            else {
                addNotification({
                    type: 'error',
                    title: 'Failed to Start Runner',
                    message: 'The application failed to start.',
                });
            }
            return runnerStatus.running;
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Start Error',
                message: error instanceof Error ? error.message : 'Unknown start error',
            });
            return false;
        }
        finally {
            setIsStarting(false);
        }
    }, [electronAPI, addNotification]);
    const stop = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async () => {
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
            }
            else {
                addNotification({
                    type: 'error',
                    title: 'Failed to Stop Runner',
                    message: 'An error occurred while stopping the application.',
                });
            }
            return success;
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Stop Error',
                message: error instanceof Error ? error.message : 'Unknown stop error',
            });
            return false;
        }
    }, [electronAPI, addNotification]);
    const restart = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async () => {
        await stop();
        return await start();
    }, [stop, start]);
    const refreshStatus = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async () => {
        if (!electronAPI)
            return;
        try {
            const runnerStatus = await electronAPI.runner.status();
            setStatus(runnerStatus);
        }
        catch (error) {
            console.error('Failed to refresh runner status:', error);
        }
    }, [electronAPI]);
    const getLogs = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (lines = 100) => {
        if (!electronAPI)
            return;
        try {
            const logContent = await electronAPI.runner.getLogs?.(lines);
            if (logContent) {
                setLogs(logContent);
            }
        }
        catch (error) {
            console.error('Failed to get logs:', error);
        }
    }, [electronAPI]);
    const exposePort = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (localPort, containerPort) => {
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
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Expose Port',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
            return false;
        }
    }, [electronAPI, addNotification]);
    // Periodically refresh status when runner is active
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (!status.running)
            return;
        const interval = setInterval(() => {
            refreshStatus();
        }, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, [status.running, refreshStatus]);
    // Initial status load
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        refreshStatus();
    }, [refreshStatus]);
    const value = {
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
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(RunnerContext.Provider, { value: value, children: children }));
};


/***/ }),

/***/ "./src/renderer/contexts/WorkspaceContext.tsx":
/*!****************************************************!*\
  !*** ./src/renderer/contexts/WorkspaceContext.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkspaceProvider: () => (/* binding */ WorkspaceProvider),
/* harmony export */   useWorkspace: () => (/* binding */ useWorkspace)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _NotificationContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NotificationContext */ "./src/renderer/contexts/NotificationContext.tsx");



const WorkspaceContext = (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);
const useWorkspace = () => {
    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(WorkspaceContext);
    if (!context) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
};
const WorkspaceProvider = ({ children }) => {
    const [isWorkspaceOpen, setIsWorkspaceOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [workspacePath, setWorkspacePath] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [workspaceName, setWorkspaceName] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [manifest, setManifest] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [files, setFiles] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [currentFile, setCurrentFile] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const { addNotification } = (0,_NotificationContext__WEBPACK_IMPORTED_MODULE_2__.useNotifications)();
    // Check if electron API is available
    const electronAPI = window.electronAPI;
    const createWorkspace = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (name, template) => {
        if (!electronAPI) {
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Electron API not available',
            });
            return false;
        }
        try {
            const success = await electronAPI.workspace.create(name, template);
            if (success) {
                setIsWorkspaceOpen(true);
                setWorkspaceName(name);
                addNotification({
                    type: 'success',
                    title: 'Workspace Created',
                    message: `Workspace "${name}" has been created successfully.`,
                });
                await refreshFiles();
            }
            else {
                addNotification({
                    type: 'error',
                    title: 'Failed to Create Workspace',
                    message: 'An error occurred while creating the workspace.',
                });
            }
            return success;
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Create Workspace',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
            return false;
        }
    }, [electronAPI, addNotification]);
    const openWorkspace = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (path) => {
        if (!electronAPI) {
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Electron API not available',
            });
            return false;
        }
        try {
            let targetPath = path;
            // If no path provided, this will trigger the main process to show a dialog
            const success = await electronAPI.workspace.open(targetPath || '');
            if (success) {
                setIsWorkspaceOpen(true);
                setWorkspacePath(targetPath || 'Unknown');
                addNotification({
                    type: 'success',
                    title: 'Workspace Opened',
                    message: 'Workspace has been opened successfully.',
                });
                await refreshFiles();
            }
            else {
                addNotification({
                    type: 'error',
                    title: 'Failed to Open Workspace',
                    message: 'An error occurred while opening the workspace.',
                });
            }
            return success;
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Open Workspace',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
            return false;
        }
    }, [electronAPI, addNotification]);
    const exportWorkspace = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (targetPath) => {
        if (!electronAPI || !isWorkspaceOpen) {
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'No workspace open or Electron API not available',
            });
            return false;
        }
        try {
            const success = await electronAPI.workspace.export(targetPath || '');
            if (success) {
                addNotification({
                    type: 'success',
                    title: 'Workspace Exported',
                    message: 'Workspace has been exported successfully.',
                });
            }
            else {
                addNotification({
                    type: 'error',
                    title: 'Failed to Export Workspace',
                    message: 'An error occurred while exporting the workspace.',
                });
            }
            return success;
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Export Workspace',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
            return false;
        }
    }, [electronAPI, isWorkspaceOpen, addNotification]);
    const importWorkspace = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (archivePath) => {
        if (!electronAPI) {
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Electron API not available',
            });
            return false;
        }
        try {
            const success = await electronAPI.workspace.import(archivePath || '');
            if (success) {
                setIsWorkspaceOpen(true);
                addNotification({
                    type: 'success',
                    title: 'Workspace Imported',
                    message: 'Workspace has been imported successfully.',
                });
                await refreshFiles();
            }
            else {
                addNotification({
                    type: 'error',
                    title: 'Failed to Import Workspace',
                    message: 'An error occurred while importing the workspace.',
                });
            }
            return success;
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Import Workspace',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
            return false;
        }
    }, [electronAPI, addNotification]);
    const refreshFiles = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async () => {
        // In a real implementation, this would fetch files from the workspace
        // For now, simulate some files
        const mockFiles = [
            {
                path: 'src',
                name: 'src',
                type: 'directory',
                children: [
                    {
                        path: 'src/index.ts',
                        name: 'index.ts',
                        type: 'file',
                        size: 1024,
                        modified: new Date(),
                    },
                    {
                        path: 'src/components',
                        name: 'components',
                        type: 'directory',
                        children: [
                            {
                                path: 'src/components/App.tsx',
                                name: 'App.tsx',
                                type: 'file',
                                size: 2048,
                                modified: new Date(),
                            },
                        ],
                    },
                ],
            },
            {
                path: 'package.json',
                name: 'package.json',
                type: 'file',
                size: 512,
                modified: new Date(),
            },
            {
                path: 'README.md',
                name: 'README.md',
                type: 'file',
                size: 256,
                modified: new Date(),
            },
        ];
        setFiles(mockFiles);
    }, []);
    const openFile = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (path) => {
        setCurrentFile(path);
        // In a real implementation, this would load the file content
        console.log('Opening file:', path);
    }, []);
    const createFile = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (path, content = '') => {
        // In a real implementation, this would create the file
        console.log('Creating file:', path, 'with content:', content);
        addNotification({
            type: 'success',
            title: 'File Created',
            message: `File "${path}" has been created.`,
        });
        await refreshFiles();
        return true;
    }, [addNotification, refreshFiles]);
    const deleteFile = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (path) => {
        // In a real implementation, this would delete the file
        console.log('Deleting file:', path);
        addNotification({
            type: 'success',
            title: 'File Deleted',
            message: `File "${path}" has been deleted.`,
        });
        await refreshFiles();
        return true;
    }, [addNotification, refreshFiles]);
    const renameFile = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (oldPath, newPath) => {
        // In a real implementation, this would rename the file
        console.log('Renaming file from:', oldPath, 'to:', newPath);
        addNotification({
            type: 'success',
            title: 'File Renamed',
            message: `File renamed from "${oldPath}" to "${newPath}".`,
        });
        await refreshFiles();
        return true;
    }, [addNotification, refreshFiles]);
    // Load initial workspace state
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (electronAPI) {
            // Check if there's a workspace already open
            // This would be implemented in the main process
        }
    }, [electronAPI]);
    const value = {
        isWorkspaceOpen,
        workspacePath,
        workspaceName,
        manifest,
        files,
        currentFile,
        createWorkspace,
        openWorkspace,
        exportWorkspace,
        importWorkspace,
        refreshFiles,
        openFile,
        createFile,
        deleteFile,
        renameFile,
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(WorkspaceContext.Provider, { value: value, children: children }));
};


/***/ }),

/***/ "./src/renderer/index.tsx":
/*!********************************!*\
  !*** ./src/renderer/index.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./App */ "./src/renderer/App.tsx");
/* harmony import */ var _styles_App_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles/App.css */ "./src/renderer/styles/App.css");





console.log('🚀 VSEmbed AI DevTool starting...');
// Ensure DOM is ready
const initializeApp = () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        console.error('Root element not found');
        return;
    }
    const root = react_dom_client__WEBPACK_IMPORTED_MODULE_2__.createRoot(rootElement);
    root.render((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_App__WEBPACK_IMPORTED_MODULE_3__["default"], {}));
    console.log('✅ VSEmbed AI DevTool initialized successfully!');
};
// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
}
else {
    initializeApp();
}


/***/ }),

/***/ "./src/renderer/styles/AIInterfaceManager.css":
/*!****************************************************!*\
  !*** ./src/renderer/styles/AIInterfaceManager.css ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_AIInterfaceManager_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./AIInterfaceManager.css */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/renderer/styles/AIInterfaceManager.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_AIInterfaceManager_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_AIInterfaceManager_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_AIInterfaceManager_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_AIInterfaceManager_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/renderer/styles/AIWorkspaceManager.css":
/*!****************************************************!*\
  !*** ./src/renderer/styles/AIWorkspaceManager.css ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_AIWorkspaceManager_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./AIWorkspaceManager.css */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/renderer/styles/AIWorkspaceManager.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_AIWorkspaceManager_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_AIWorkspaceManager_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_AIWorkspaceManager_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_AIWorkspaceManager_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/renderer/styles/App.css":
/*!*************************************!*\
  !*** ./src/renderer/styles/App.css ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_App_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./App.css */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/renderer/styles/App.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_App_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_App_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_App_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_App_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/renderer/styles/GrokChatInterface.css":
/*!***************************************************!*\
  !*** ./src/renderer/styles/GrokChatInterface.css ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_GrokChatInterface_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./GrokChatInterface.css */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/renderer/styles/GrokChatInterface.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_GrokChatInterface_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_GrokChatInterface_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_GrokChatInterface_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_GrokChatInterface_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = global["webpackChunkvsembed_ai_devtool"] = global["webpackChunkvsembed_ai_devtool"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./src/renderer/index.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.bundle.js.map