/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/ChatPane.css":
/*!********************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/ChatPane.css ***!
  \********************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, `/* ChatPane.css */
.chat-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--vscode-editor-background);
  border-right: 1px solid var(--vscode-panel-border);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vscode-panel-border);
  background-color: var(--vscode-sideBar-background);
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-title h3 {
  margin: 0;
  color: var(--vscode-sideBarTitle-foreground);
  font-size: 14px;
  font-weight: 600;
}

.model-selector {
  position: relative;
}

.current-model {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.current-model:hover {
  background: var(--vscode-button-hoverBackground);
}

.model-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--vscode-dropdown-background);
  border: 1px solid var(--vscode-dropdown-border);
  border-radius: 4px;
  min-width: 120px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.model-option {
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  color: var(--vscode-dropdown-foreground);
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;
}

.model-option:hover {
  background: var(--vscode-list-hoverBackground);
}

.model-option.active {
  background: var(--vscode-list-activeSelectionBackground);
  color: var(--vscode-list-activeSelectionForeground);
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 14px;
  opacity: 0.7;
  transition: opacity 0.2s, background-color 0.2s;
}

.clear-btn:hover {
  opacity: 1;
  background: var(--vscode-toolbar-hoverBackground);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
}

.welcome-message {
  text-align: center;
  max-width: 400px;
}

.welcome-message h4 {
  color: var(--vscode-foreground);
  margin: 0 0 12px 0;
  font-size: 16px;
}

.welcome-message p {
  color: var(--vscode-descriptionForeground);
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.example-prompts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.example-prompts button {
  background: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.example-prompts button:hover {
  background: var(--vscode-button-secondaryHoverBackground);
}

.messages-list {
  padding: 0;
}

.message {
  padding: 16px;
  border-bottom: 1px solid var(--vscode-panel-border);
}

.message.user {
  background: var(--vscode-editor-background);
}

.message.assistant {
  background: var(--vscode-sideBar-background);
}

.message.system {
  background: var(--vscode-notifications-background);
}

.message.processing {
  opacity: 0.8;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.message-role {
  font-size: 12px;
  font-weight: 600;
  color: var(--vscode-foreground);
  text-transform: capitalize;
}

.message-time {
  font-size: 11px;
  color: var(--vscode-descriptionForeground);
  margin-left: auto;
}

.regenerate-btn {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 12px;
  opacity: 0.5;
  transition: opacity 0.2s, background-color 0.2s;
}

.regenerate-btn:hover {
  opacity: 1;
  background: var(--vscode-toolbar-hoverBackground);
}

.processing-indicator {
  font-size: 11px;
  color: var(--vscode-descriptionForeground);
  font-style: italic;
}

.message-content {
  margin: 0;
}

.message-content pre {
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  color: var(--vscode-foreground);
  font-family: var(--vscode-editor-font-family);
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.typing-animation {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-animation span {
  width: 6px;
  height: 6px;
  background: var(--vscode-foreground);
  border-radius: 50%;
  opacity: 0.4;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-animation span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-animation span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  40% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* Action Plan Styles */
.action-plan {
  margin-top: 16px;
  border: 1px solid var(--vscode-panel-border);
  border-radius: 6px;
  background: var(--vscode-editor-background);
}

.plan-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vscode-panel-border);
  background: var(--vscode-sideBar-background);
}

.plan-header h4 {
  margin: 0;
  font-size: 14px;
  color: var(--vscode-foreground);
}

.risk-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.plan-summary {
  padding: 12px 16px;
  border-bottom: 1px solid var(--vscode-panel-border);
}

.plan-summary p {
  margin: 0 0 8px 0;
  color: var(--vscode-foreground);
  font-size: 13px;
  line-height: 1.4;
}

.plan-stats {
  display: flex;
  gap: 16px;
}

.plan-stats span {
  font-size: 11px;
  color: var(--vscode-descriptionForeground);
}

.actions-list {
  padding: 8px;
}

.action-item {
  margin-bottom: 8px;
  padding: 12px;
  border: 1px solid var(--vscode-panel-border);
  border-radius: 4px;
  background: var(--vscode-editor-background);
}

.action-item.approved {
  border-color: #28a745;
  background: rgba(40, 167, 69, 0.1);
}

.action-item.rejected {
  border-color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
}

.action-item.pending {
  border-color: #ffc107;
  background: rgba(255, 193, 7, 0.1);
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.action-type {
  font-size: 11px;
  font-weight: 600;
  color: var(--vscode-foreground);
  text-transform: uppercase;
  background: var(--vscode-badge-background);
  color: var(--vscode-badge-foreground);
  padding: 2px 6px;
  border-radius: 3px;
}

.action-risk {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.action-description {
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--vscode-foreground);
  line-height: 1.4;
}

.action-preview {
  margin-bottom: 12px;
  padding: 8px;
  background: var(--vscode-textCodeBlock-background);
  border: 1px solid var(--vscode-panel-border);
  border-radius: 3px;
}

.action-preview code {
  font-family: var(--vscode-editor-font-family);
  font-size: 12px;
  color: var(--vscode-textPreformat-foreground);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.approve-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.approve-btn:hover {
  background: #218838;
}

.reject-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reject-btn:hover {
  background: #c82333;
}

.action-status {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
}

.action-status.approved {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.action-status.rejected {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

.action-status.executed {
  background: rgba(23, 162, 184, 0.2);
  color: #17a2b8;
}

.plan-actions {
  padding: 12px 16px;
  border-top: 1px solid var(--vscode-panel-border);
  text-align: center;
}

.execute-plan-btn {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.execute-plan-btn:hover {
  background: var(--vscode-button-hoverBackground);
}

/* Chat Input */
.chat-input {
  border-top: 1px solid var(--vscode-panel-border);
  background: var(--vscode-sideBar-background);
  padding: 12px 16px;
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.input-container textarea {
  flex: 1;
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  padding: 8px 12px;
  font-family: var(--vscode-font-family);
  font-size: 13px;
  resize: none;
  outline: none;
  min-height: 20px;
  max-height: 100px;
}

.input-container textarea:focus {
  border-color: var(--vscode-focusBorder);
}

.input-container textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 40px;
  transition: background-color 0.2s;
}

.send-btn:hover:not(:disabled) {
  background: var(--vscode-button-hoverBackground);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`, "",{"version":3,"sources":["webpack://./src/renderer/styles/ChatPane.css"],"names":[],"mappings":"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","sourcesContent":["/* ChatPane.css */\n.chat-pane {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  background-color: var(--vscode-editor-background);\n  border-right: 1px solid var(--vscode-panel-border);\n}\n\n.chat-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 12px 16px;\n  border-bottom: 1px solid var(--vscode-panel-border);\n  background-color: var(--vscode-sideBar-background);\n}\n\n.chat-title {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.chat-title h3 {\n  margin: 0;\n  color: var(--vscode-sideBarTitle-foreground);\n  font-size: 14px;\n  font-weight: 600;\n}\n\n.model-selector {\n  position: relative;\n}\n\n.current-model {\n  background: var(--vscode-button-background);\n  color: var(--vscode-button-foreground);\n  border: none;\n  padding: 4px 8px;\n  border-radius: 4px;\n  font-size: 12px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n\n.current-model:hover {\n  background: var(--vscode-button-hoverBackground);\n}\n\n.model-dropdown {\n  position: absolute;\n  top: 100%;\n  right: 0;\n  background: var(--vscode-dropdown-background);\n  border: 1px solid var(--vscode-dropdown-border);\n  border-radius: 4px;\n  min-width: 120px;\n  z-index: 1000;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\n}\n\n.model-option {\n  width: 100%;\n  padding: 8px 12px;\n  background: none;\n  border: none;\n  color: var(--vscode-dropdown-foreground);\n  font-size: 12px;\n  cursor: pointer;\n  text-align: left;\n  transition: background-color 0.2s;\n}\n\n.model-option:hover {\n  background: var(--vscode-list-hoverBackground);\n}\n\n.model-option.active {\n  background: var(--vscode-list-activeSelectionBackground);\n  color: var(--vscode-list-activeSelectionForeground);\n}\n\n.chat-actions {\n  display: flex;\n  gap: 8px;\n}\n\n.clear-btn {\n  background: none;\n  border: none;\n  color: var(--vscode-foreground);\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 4px;\n  font-size: 14px;\n  opacity: 0.7;\n  transition: opacity 0.2s, background-color 0.2s;\n}\n\n.clear-btn:hover {\n  opacity: 1;\n  background: var(--vscode-toolbar-hoverBackground);\n}\n\n.messages-container {\n  flex: 1;\n  overflow-y: auto;\n  padding: 0;\n}\n\n.empty-state {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  padding: 24px;\n}\n\n.welcome-message {\n  text-align: center;\n  max-width: 400px;\n}\n\n.welcome-message h4 {\n  color: var(--vscode-foreground);\n  margin: 0 0 12px 0;\n  font-size: 16px;\n}\n\n.welcome-message p {\n  color: var(--vscode-descriptionForeground);\n  margin: 0 0 20px 0;\n  line-height: 1.5;\n}\n\n.example-prompts {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n\n.example-prompts button {\n  background: var(--vscode-button-secondaryBackground);\n  color: var(--vscode-button-secondaryForeground);\n  border: none;\n  padding: 8px 16px;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 12px;\n  transition: background-color 0.2s;\n}\n\n.example-prompts button:hover {\n  background: var(--vscode-button-secondaryHoverBackground);\n}\n\n.messages-list {\n  padding: 0;\n}\n\n.message {\n  padding: 16px;\n  border-bottom: 1px solid var(--vscode-panel-border);\n}\n\n.message.user {\n  background: var(--vscode-editor-background);\n}\n\n.message.assistant {\n  background: var(--vscode-sideBar-background);\n}\n\n.message.system {\n  background: var(--vscode-notifications-background);\n}\n\n.message.processing {\n  opacity: 0.8;\n}\n\n.message-header {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 8px;\n}\n\n.message-role {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--vscode-foreground);\n  text-transform: capitalize;\n}\n\n.message-time {\n  font-size: 11px;\n  color: var(--vscode-descriptionForeground);\n  margin-left: auto;\n}\n\n.regenerate-btn {\n  background: none;\n  border: none;\n  color: var(--vscode-foreground);\n  cursor: pointer;\n  padding: 2px 4px;\n  border-radius: 2px;\n  font-size: 12px;\n  opacity: 0.5;\n  transition: opacity 0.2s, background-color 0.2s;\n}\n\n.regenerate-btn:hover {\n  opacity: 1;\n  background: var(--vscode-toolbar-hoverBackground);\n}\n\n.processing-indicator {\n  font-size: 11px;\n  color: var(--vscode-descriptionForeground);\n  font-style: italic;\n}\n\n.message-content {\n  margin: 0;\n}\n\n.message-content pre {\n  background: none;\n  border: none;\n  margin: 0;\n  padding: 0;\n  color: var(--vscode-foreground);\n  font-family: var(--vscode-editor-font-family);\n  font-size: 13px;\n  line-height: 1.5;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n}\n\n.typing-animation {\n  display: flex;\n  gap: 4px;\n  padding: 8px 0;\n}\n\n.typing-animation span {\n  width: 6px;\n  height: 6px;\n  background: var(--vscode-foreground);\n  border-radius: 50%;\n  opacity: 0.4;\n  animation: typing 1.4s infinite ease-in-out;\n}\n\n.typing-animation span:nth-child(1) {\n  animation-delay: -0.32s;\n}\n\n.typing-animation span:nth-child(2) {\n  animation-delay: -0.16s;\n}\n\n@keyframes typing {\n  0%, 80%, 100% {\n    opacity: 0.4;\n    transform: scale(1);\n  }\n  40% {\n    opacity: 1;\n    transform: scale(1.1);\n  }\n}\n\n/* Action Plan Styles */\n.action-plan {\n  margin-top: 16px;\n  border: 1px solid var(--vscode-panel-border);\n  border-radius: 6px;\n  background: var(--vscode-editor-background);\n}\n\n.plan-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 16px;\n  border-bottom: 1px solid var(--vscode-panel-border);\n  background: var(--vscode-sideBar-background);\n}\n\n.plan-header h4 {\n  margin: 0;\n  font-size: 14px;\n  color: var(--vscode-foreground);\n}\n\n.risk-badge {\n  padding: 2px 8px;\n  border-radius: 12px;\n  font-size: 10px;\n  font-weight: 600;\n  color: white;\n  text-transform: uppercase;\n}\n\n.plan-summary {\n  padding: 12px 16px;\n  border-bottom: 1px solid var(--vscode-panel-border);\n}\n\n.plan-summary p {\n  margin: 0 0 8px 0;\n  color: var(--vscode-foreground);\n  font-size: 13px;\n  line-height: 1.4;\n}\n\n.plan-stats {\n  display: flex;\n  gap: 16px;\n}\n\n.plan-stats span {\n  font-size: 11px;\n  color: var(--vscode-descriptionForeground);\n}\n\n.actions-list {\n  padding: 8px;\n}\n\n.action-item {\n  margin-bottom: 8px;\n  padding: 12px;\n  border: 1px solid var(--vscode-panel-border);\n  border-radius: 4px;\n  background: var(--vscode-editor-background);\n}\n\n.action-item.approved {\n  border-color: #28a745;\n  background: rgba(40, 167, 69, 0.1);\n}\n\n.action-item.rejected {\n  border-color: #dc3545;\n  background: rgba(220, 53, 69, 0.1);\n}\n\n.action-item.pending {\n  border-color: #ffc107;\n  background: rgba(255, 193, 7, 0.1);\n}\n\n.action-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 8px;\n}\n\n.action-type {\n  font-size: 11px;\n  font-weight: 600;\n  color: var(--vscode-foreground);\n  text-transform: uppercase;\n  background: var(--vscode-badge-background);\n  color: var(--vscode-badge-foreground);\n  padding: 2px 6px;\n  border-radius: 3px;\n}\n\n.action-risk {\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n\n.action-description {\n  margin-bottom: 8px;\n  font-size: 13px;\n  color: var(--vscode-foreground);\n  line-height: 1.4;\n}\n\n.action-preview {\n  margin-bottom: 12px;\n  padding: 8px;\n  background: var(--vscode-textCodeBlock-background);\n  border: 1px solid var(--vscode-panel-border);\n  border-radius: 3px;\n}\n\n.action-preview code {\n  font-family: var(--vscode-editor-font-family);\n  font-size: 12px;\n  color: var(--vscode-textPreformat-foreground);\n}\n\n.action-buttons {\n  display: flex;\n  gap: 8px;\n}\n\n.approve-btn {\n  background: #28a745;\n  color: white;\n  border: none;\n  padding: 6px 12px;\n  border-radius: 4px;\n  font-size: 12px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n\n.approve-btn:hover {\n  background: #218838;\n}\n\n.reject-btn {\n  background: #dc3545;\n  color: white;\n  border: none;\n  padding: 6px 12px;\n  border-radius: 4px;\n  font-size: 12px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n\n.reject-btn:hover {\n  background: #c82333;\n}\n\n.action-status {\n  font-size: 12px;\n  font-weight: 600;\n  padding: 4px 8px;\n  border-radius: 4px;\n  text-align: center;\n}\n\n.action-status.approved {\n  background: rgba(40, 167, 69, 0.2);\n  color: #28a745;\n}\n\n.action-status.rejected {\n  background: rgba(220, 53, 69, 0.2);\n  color: #dc3545;\n}\n\n.action-status.executed {\n  background: rgba(23, 162, 184, 0.2);\n  color: #17a2b8;\n}\n\n.plan-actions {\n  padding: 12px 16px;\n  border-top: 1px solid var(--vscode-panel-border);\n  text-align: center;\n}\n\n.execute-plan-btn {\n  background: var(--vscode-button-background);\n  color: var(--vscode-button-foreground);\n  border: none;\n  padding: 8px 16px;\n  border-radius: 4px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n\n.execute-plan-btn:hover {\n  background: var(--vscode-button-hoverBackground);\n}\n\n/* Chat Input */\n.chat-input {\n  border-top: 1px solid var(--vscode-panel-border);\n  background: var(--vscode-sideBar-background);\n  padding: 12px 16px;\n}\n\n.input-container {\n  display: flex;\n  gap: 8px;\n  align-items: flex-end;\n}\n\n.input-container textarea {\n  flex: 1;\n  background: var(--vscode-input-background);\n  color: var(--vscode-input-foreground);\n  border: 1px solid var(--vscode-input-border);\n  border-radius: 4px;\n  padding: 8px 12px;\n  font-family: var(--vscode-font-family);\n  font-size: 13px;\n  resize: none;\n  outline: none;\n  min-height: 20px;\n  max-height: 100px;\n}\n\n.input-container textarea:focus {\n  border-color: var(--vscode-focusBorder);\n}\n\n.input-container textarea:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.send-btn {\n  background: var(--vscode-button-background);\n  color: var(--vscode-button-foreground);\n  border: none;\n  padding: 8px 12px;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 14px;\n  min-width: 40px;\n  transition: background-color 0.2s;\n}\n\n.send-btn:hover:not(:disabled) {\n  background: var(--vscode-button-hoverBackground);\n}\n\n.send-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/EditorPane.css":
/*!**********************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/EditorPane.css ***!
  \**********************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, `/* EditorPane.css */
.editor-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--vscode-editor-background);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--vscode-editorGroupHeader-tabsBackground);
  border-bottom: 1px solid var(--vscode-editorGroupHeader-tabsBorder);
  min-height: 35px;
}

.editor-tabs {
  display: flex;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
}

.editor-tabs::-webkit-scrollbar {
  height: 3px;
}

.editor-tabs::-webkit-scrollbar-track {
  background: var(--vscode-editorGroupHeader-tabsBackground);
}

.editor-tabs::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
  border-radius: 3px;
}

.editor-tabs::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-scrollbarSlider-hoverBackground);
}

.editor-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: var(--vscode-tab-inactiveBackground);
  color: var(--vscode-tab-inactiveForeground);
  border-right: 1px solid var(--vscode-tab-border);
  cursor: pointer;
  min-width: 120px;
  max-width: 200px;
  transition: background-color 0.2s, color 0.2s;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
}

.editor-tab:hover {
  background-color: var(--vscode-tab-hoverBackground);
  color: var(--vscode-tab-hoverForeground);
}

.editor-tab.active {
  background-color: var(--vscode-tab-activeBackground);
  color: var(--vscode-tab-activeForeground);
  border-bottom: 2px solid var(--vscode-tab-activeBorder);
}

.editor-tab.dirty .tab-name {
  font-style: italic;
}

.tab-name {
  flex: 1;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dirty-indicator {
  color: var(--vscode-tab-activeForeground);
  font-size: 16px;
  line-height: 1;
}

.tab-close {
  background: none;
  border: none;
  color: var(--vscode-tab-inactiveForeground);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: background-color 0.2s, color 0.2s;
}

.tab-close:hover {
  background-color: var(--vscode-toolbar-hoverBackground);
  color: var(--vscode-tab-activeForeground);
}

.editor-actions {
  display: flex;
  gap: 4px;
  padding: 0 8px;
}

.action-btn {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.action-btn:hover {
  background-color: var(--vscode-toolbar-hoverBackground);
}

.editor-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.monaco-editor {
  width: 100%;
  height: 100%;
}

.editor-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--vscode-editor-background);
  color: var(--vscode-foreground);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--vscode-progressBar-background);
  border-top: 2px solid var(--vscode-button-background);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.editor-loading p {
  margin: 0;
  font-size: 14px;
  color: var(--vscode-descriptionForeground);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--vscode-dropdown-background);
  border: 1px solid var(--vscode-dropdown-border);
  border-radius: 6px;
  min-width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vscode-dropdown-border);
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--vscode-foreground);
}

.modal-close {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  padding: 4px;
  border-radius: 2px;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background: var(--vscode-toolbar-hoverBackground);
}

.modal-content {
  padding: 20px;
}

.modal-content label {
  display: block;
  color: var(--vscode-foreground);
  font-size: 14px;
  margin-bottom: 8px;
}

.modal-content input {
  width: 100%;
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  padding: 8px 12px;
  font-family: var(--vscode-font-family);
  font-size: 14px;
  margin-top: 8px;
  outline: none;
  box-sizing: border-box;
}

.modal-content input:focus {
  border-color: var(--vscode-focusBorder);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--vscode-dropdown-border);
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.btn-primary:hover:not(:disabled) {
  background: var(--vscode-button-hoverBackground);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
}

.btn-secondary:hover {
  background: var(--vscode-button-secondaryHoverBackground);
}

/* Responsive */
@media (max-width: 768px) {
  .editor-tab {
    min-width: 100px;
    max-width: 150px;
    padding: 6px 12px;
  }

  .tab-name {
    font-size: 12px;
  }

  .modal {
    min-width: 320px;
    margin: 20px;
  }
}
`, "",{"version":3,"sources":["webpack://./src/renderer/styles/EditorPane.css"],"names":[],"mappings":"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","sourcesContent":["/* EditorPane.css */\n.editor-pane {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  background-color: var(--vscode-editor-background);\n}\n\n.editor-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background-color: var(--vscode-editorGroupHeader-tabsBackground);\n  border-bottom: 1px solid var(--vscode-editorGroupHeader-tabsBorder);\n  min-height: 35px;\n}\n\n.editor-tabs {\n  display: flex;\n  flex: 1;\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n\n.editor-tabs::-webkit-scrollbar {\n  height: 3px;\n}\n\n.editor-tabs::-webkit-scrollbar-track {\n  background: var(--vscode-editorGroupHeader-tabsBackground);\n}\n\n.editor-tabs::-webkit-scrollbar-thumb {\n  background: var(--vscode-scrollbarSlider-background);\n  border-radius: 3px;\n}\n\n.editor-tabs::-webkit-scrollbar-thumb:hover {\n  background: var(--vscode-scrollbarSlider-hoverBackground);\n}\n\n.editor-tab {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 16px;\n  background-color: var(--vscode-tab-inactiveBackground);\n  color: var(--vscode-tab-inactiveForeground);\n  border-right: 1px solid var(--vscode-tab-border);\n  cursor: pointer;\n  min-width: 120px;\n  max-width: 200px;\n  transition: background-color 0.2s, color 0.2s;\n  user-select: none;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n.editor-tab:hover {\n  background-color: var(--vscode-tab-hoverBackground);\n  color: var(--vscode-tab-hoverForeground);\n}\n\n.editor-tab.active {\n  background-color: var(--vscode-tab-activeBackground);\n  color: var(--vscode-tab-activeForeground);\n  border-bottom: 2px solid var(--vscode-tab-activeBorder);\n}\n\n.editor-tab.dirty .tab-name {\n  font-style: italic;\n}\n\n.tab-name {\n  flex: 1;\n  font-size: 13px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dirty-indicator {\n  color: var(--vscode-tab-activeForeground);\n  font-size: 16px;\n  line-height: 1;\n}\n\n.tab-close {\n  background: none;\n  border: none;\n  color: var(--vscode-tab-inactiveForeground);\n  cursor: pointer;\n  font-size: 16px;\n  line-height: 1;\n  padding: 0;\n  width: 16px;\n  height: 16px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 2px;\n  transition: background-color 0.2s, color 0.2s;\n}\n\n.tab-close:hover {\n  background-color: var(--vscode-toolbar-hoverBackground);\n  color: var(--vscode-tab-activeForeground);\n}\n\n.editor-actions {\n  display: flex;\n  gap: 4px;\n  padding: 0 8px;\n}\n\n.action-btn {\n  background: none;\n  border: none;\n  color: var(--vscode-foreground);\n  cursor: pointer;\n  padding: 6px;\n  border-radius: 4px;\n  font-size: 14px;\n  transition: background-color 0.2s;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n}\n\n.action-btn:hover {\n  background-color: var(--vscode-toolbar-hoverBackground);\n}\n\n.editor-container {\n  flex: 1;\n  position: relative;\n  overflow: hidden;\n}\n\n.monaco-editor {\n  width: 100%;\n  height: 100%;\n}\n\n.editor-loading {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  background-color: var(--vscode-editor-background);\n  color: var(--vscode-foreground);\n}\n\n.loading-spinner {\n  width: 24px;\n  height: 24px;\n  border: 2px solid var(--vscode-progressBar-background);\n  border-top: 2px solid var(--vscode-button-background);\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n  margin-bottom: 12px;\n}\n\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n.editor-loading p {\n  margin: 0;\n  font-size: 14px;\n  color: var(--vscode-descriptionForeground);\n}\n\n/* Modal Styles */\n.modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n}\n\n.modal {\n  background: var(--vscode-dropdown-background);\n  border: 1px solid var(--vscode-dropdown-border);\n  border-radius: 6px;\n  min-width: 400px;\n  max-width: 90vw;\n  max-height: 90vh;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 20px;\n  border-bottom: 1px solid var(--vscode-dropdown-border);\n}\n\n.modal-header h3 {\n  margin: 0;\n  font-size: 16px;\n  color: var(--vscode-foreground);\n}\n\n.modal-close {\n  background: none;\n  border: none;\n  color: var(--vscode-foreground);\n  cursor: pointer;\n  font-size: 20px;\n  line-height: 1;\n  padding: 4px;\n  border-radius: 2px;\n  transition: background-color 0.2s;\n}\n\n.modal-close:hover {\n  background: var(--vscode-toolbar-hoverBackground);\n}\n\n.modal-content {\n  padding: 20px;\n}\n\n.modal-content label {\n  display: block;\n  color: var(--vscode-foreground);\n  font-size: 14px;\n  margin-bottom: 8px;\n}\n\n.modal-content input {\n  width: 100%;\n  background: var(--vscode-input-background);\n  color: var(--vscode-input-foreground);\n  border: 1px solid var(--vscode-input-border);\n  border-radius: 4px;\n  padding: 8px 12px;\n  font-family: var(--vscode-font-family);\n  font-size: 14px;\n  margin-top: 8px;\n  outline: none;\n  box-sizing: border-box;\n}\n\n.modal-content input:focus {\n  border-color: var(--vscode-focusBorder);\n}\n\n.modal-footer {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  padding: 16px 20px;\n  border-top: 1px solid var(--vscode-dropdown-border);\n}\n\n.btn-primary,\n.btn-secondary {\n  padding: 8px 16px;\n  border: none;\n  border-radius: 4px;\n  font-size: 13px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n\n.btn-primary {\n  background: var(--vscode-button-background);\n  color: var(--vscode-button-foreground);\n}\n\n.btn-primary:hover:not(:disabled) {\n  background: var(--vscode-button-hoverBackground);\n}\n\n.btn-primary:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.btn-secondary {\n  background: var(--vscode-button-secondaryBackground);\n  color: var(--vscode-button-secondaryForeground);\n}\n\n.btn-secondary:hover {\n  background: var(--vscode-button-secondaryHoverBackground);\n}\n\n/* Responsive */\n@media (max-width: 768px) {\n  .editor-tab {\n    min-width: 100px;\n    max-width: 150px;\n    padding: 6px 12px;\n  }\n\n  .tab-name {\n    font-size: 12px;\n  }\n\n  .modal {\n    min-width: 320px;\n    margin: 20px;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/FileExplorer.css":
/*!************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/FileExplorer.css ***!
  \************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, `/* FileExplorer.css */
.file-explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--vscode-sideBar-background);
  color: var(--vscode-sideBar-foreground);
  border-right: 1px solid var(--vscode-sideBar-border);
}

.explorer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--vscode-sideBar-border);
  background-color: var(--vscode-sideBarSectionHeader-background);
}

.explorer-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.explorer-title h3 {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  color: var(--vscode-sideBarTitle-foreground);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.workspace-name {
  font-size: 12px;
  color: var(--vscode-sideBar-foreground);
  font-weight: 500;
}

.explorer-actions {
  display: flex;
  gap: 2px;
}

.action-btn {
  background: none;
  border: none;
  color: var(--vscode-sideBar-foreground);
  cursor: pointer;
  padding: 4px;
  border-radius: 3px;
  font-size: 12px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  opacity: 0.8;
}

.action-btn:hover:not(:disabled) {
  background-color: var(--vscode-toolbar-hoverBackground);
  opacity: 1;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.file-tree {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.file-tree::-webkit-scrollbar {
  width: 8px;
}

.file-tree::-webkit-scrollbar-track {
  background: var(--vscode-sideBar-background);
}

.file-tree::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
  border-radius: 4px;
}

.file-tree::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-scrollbarSlider-hoverBackground);
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--vscode-descriptionForeground);
  text-align: center;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--vscode-progressBar-background);
  border-top: 2px solid var(--vscode-button-background);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p,
.empty-state p {
  margin: 0;
  font-size: 12px;
  color: var(--vscode-descriptionForeground);
}

.file-node {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
  user-select: none;
  min-height: 24px;
}

.file-node:hover {
  background-color: var(--vscode-list-hoverBackground);
}

.file-node.selected {
  background-color: var(--vscode-list-activeSelectionBackground);
  color: var(--vscode-list-activeSelectionForeground);
}

.file-node.directory {
  font-weight: 500;
}

.file-icon {
  font-size: 14px;
  width: 16px;
  text-align: center;
  flex-shrink: 0;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 10px;
  color: var(--vscode-descriptionForeground);
  margin-left: auto;
  opacity: 0.7;
}

.directory-children {
  border-left: 1px solid var(--vscode-tree-indentGuidesStroke);
  margin-left: 12px;
}

/* Context Menu */
.context-menu {
  position: fixed;
  background: var(--vscode-menu-background);
  border: 1px solid var(--vscode-menu-border);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 150px;
  overflow: hidden;
}

.context-menu button {
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  color: var(--vscode-menu-foreground);
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.context-menu button:hover {
  background: var(--vscode-menu-selectionBackground);
  color: var(--vscode-menu-selectionForeground);
}

.context-menu button.danger {
  color: var(--vscode-errorForeground);
}

.context-menu button.danger:hover {
  background: var(--vscode-errorForeground);
  color: var(--vscode-menu-background);
}

.menu-separator {
  height: 1px;
  background: var(--vscode-menu-separatorBackground);
  margin: 4px 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--vscode-dropdown-background);
  border: 1px solid var(--vscode-dropdown-border);
  border-radius: 6px;
  min-width: 350px;
  max-width: 90vw;
  max-height: 90vh;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vscode-dropdown-border);
}

.modal-header h3 {
  margin: 0;
  font-size: 14px;
  color: var(--vscode-foreground);
}

.modal-close {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 4px;
  border-radius: 2px;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background: var(--vscode-toolbar-hoverBackground);
}

.modal-content {
  padding: 20px;
}

.modal-content label {
  display: block;
  color: var(--vscode-foreground);
  font-size: 13px;
  margin-bottom: 8px;
  font-weight: 500;
}

.modal-content input {
  width: 100%;
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  padding: 8px 12px;
  font-family: var(--vscode-font-family);
  font-size: 13px;
  margin-top: 6px;
  outline: none;
  box-sizing: border-box;
}

.modal-content input:focus {
  border-color: var(--vscode-focusBorder);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--vscode-dropdown-border);
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
}

.btn-primary {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.btn-primary:hover:not(:disabled) {
  background: var(--vscode-button-hoverBackground);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
}

.btn-secondary:hover {
  background: var(--vscode-button-secondaryHoverBackground);
}

/* Responsive */
@media (max-width: 768px) {
  .file-explorer {
    width: 100%;
  }

  .explorer-header {
    padding: 6px 8px;
  }

  .explorer-title h3 {
    font-size: 10px;
  }

  .workspace-name {
    font-size: 11px;
  }

  .action-btn {
    width: 20px;
    height: 20px;
    font-size: 11px;
  }

  .file-node {
    padding: 3px 6px;
    font-size: 12px;
    min-height: 22px;
  }

  .file-icon {
    font-size: 12px;
    width: 14px;
  }

  .file-size {
    font-size: 9px;
  }

  .directory-children {
    margin-left: 10px;
  }

  .context-menu {
    min-width: 120px;
  }

  .context-menu button {
    padding: 6px 10px;
    font-size: 11px;
  }

  .modal {
    min-width: 280px;
    margin: 20px;
  }

  .modal-header {
    padding: 12px 16px;
  }

  .modal-content {
    padding: 16px;
  }

  .modal-footer {
    padding: 12px 16px;
    gap: 8px;
  }

  .btn-primary,
  .btn-secondary {
    padding: 6px 12px;
    font-size: 12px;
  }
}

/* File type specific styling */
.file-node.file:hover .file-name {
  color: var(--vscode-list-hoverForeground);
}

.file-node.directory.expanded > .file-icon {
  transform: rotate(0deg);
}

.file-node.directory:not(.expanded) > .file-icon {
  transform: rotate(-90deg);
}

/* Animation for directory toggle */
.file-icon {
  transition: transform 0.2s ease;
}

/* Tree guide styling */
.directory-children::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--vscode-tree-indentGuidesStroke);
  opacity: 0.4;
}
`, "",{"version":3,"sources":["webpack://./src/renderer/styles/FileExplorer.css"],"names":[],"mappings":"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","sourcesContent":["/* FileExplorer.css */\n.file-explorer {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  background-color: var(--vscode-sideBar-background);\n  color: var(--vscode-sideBar-foreground);\n  border-right: 1px solid var(--vscode-sideBar-border);\n}\n\n.explorer-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 8px 12px;\n  border-bottom: 1px solid var(--vscode-sideBar-border);\n  background-color: var(--vscode-sideBarSectionHeader-background);\n}\n\n.explorer-title {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.explorer-title h3 {\n  margin: 0;\n  font-size: 11px;\n  font-weight: 600;\n  color: var(--vscode-sideBarTitle-foreground);\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n\n.workspace-name {\n  font-size: 12px;\n  color: var(--vscode-sideBar-foreground);\n  font-weight: 500;\n}\n\n.explorer-actions {\n  display: flex;\n  gap: 2px;\n}\n\n.action-btn {\n  background: none;\n  border: none;\n  color: var(--vscode-sideBar-foreground);\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 3px;\n  font-size: 12px;\n  transition: background-color 0.2s;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  opacity: 0.8;\n}\n\n.action-btn:hover:not(:disabled) {\n  background-color: var(--vscode-toolbar-hoverBackground);\n  opacity: 1;\n}\n\n.action-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.file-tree {\n  flex: 1;\n  overflow-y: auto;\n  padding: 4px 0;\n}\n\n.file-tree::-webkit-scrollbar {\n  width: 8px;\n}\n\n.file-tree::-webkit-scrollbar-track {\n  background: var(--vscode-sideBar-background);\n}\n\n.file-tree::-webkit-scrollbar-thumb {\n  background: var(--vscode-scrollbarSlider-background);\n  border-radius: 4px;\n}\n\n.file-tree::-webkit-scrollbar-thumb:hover {\n  background: var(--vscode-scrollbarSlider-hoverBackground);\n}\n\n.loading-state,\n.empty-state {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 40px 20px;\n  color: var(--vscode-descriptionForeground);\n  text-align: center;\n}\n\n.loading-spinner {\n  width: 20px;\n  height: 20px;\n  border: 2px solid var(--vscode-progressBar-background);\n  border-top: 2px solid var(--vscode-button-background);\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n  margin-bottom: 12px;\n}\n\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n.loading-state p,\n.empty-state p {\n  margin: 0;\n  font-size: 12px;\n  color: var(--vscode-descriptionForeground);\n}\n\n.file-node {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 8px;\n  cursor: pointer;\n  font-size: 13px;\n  transition: background-color 0.2s;\n  user-select: none;\n  min-height: 24px;\n}\n\n.file-node:hover {\n  background-color: var(--vscode-list-hoverBackground);\n}\n\n.file-node.selected {\n  background-color: var(--vscode-list-activeSelectionBackground);\n  color: var(--vscode-list-activeSelectionForeground);\n}\n\n.file-node.directory {\n  font-weight: 500;\n}\n\n.file-icon {\n  font-size: 14px;\n  width: 16px;\n  text-align: center;\n  flex-shrink: 0;\n}\n\n.file-name {\n  flex: 1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.file-size {\n  font-size: 10px;\n  color: var(--vscode-descriptionForeground);\n  margin-left: auto;\n  opacity: 0.7;\n}\n\n.directory-children {\n  border-left: 1px solid var(--vscode-tree-indentGuidesStroke);\n  margin-left: 12px;\n}\n\n/* Context Menu */\n.context-menu {\n  position: fixed;\n  background: var(--vscode-menu-background);\n  border: 1px solid var(--vscode-menu-border);\n  border-radius: 4px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\n  z-index: 1000;\n  min-width: 150px;\n  overflow: hidden;\n}\n\n.context-menu button {\n  width: 100%;\n  padding: 8px 12px;\n  background: none;\n  border: none;\n  color: var(--vscode-menu-foreground);\n  font-size: 12px;\n  cursor: pointer;\n  text-align: left;\n  transition: background-color 0.2s;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.context-menu button:hover {\n  background: var(--vscode-menu-selectionBackground);\n  color: var(--vscode-menu-selectionForeground);\n}\n\n.context-menu button.danger {\n  color: var(--vscode-errorForeground);\n}\n\n.context-menu button.danger:hover {\n  background: var(--vscode-errorForeground);\n  color: var(--vscode-menu-background);\n}\n\n.menu-separator {\n  height: 1px;\n  background: var(--vscode-menu-separatorBackground);\n  margin: 4px 0;\n}\n\n/* Modal Styles */\n.modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n}\n\n.modal {\n  background: var(--vscode-dropdown-background);\n  border: 1px solid var(--vscode-dropdown-border);\n  border-radius: 6px;\n  min-width: 350px;\n  max-width: 90vw;\n  max-height: 90vh;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 20px;\n  border-bottom: 1px solid var(--vscode-dropdown-border);\n}\n\n.modal-header h3 {\n  margin: 0;\n  font-size: 14px;\n  color: var(--vscode-foreground);\n}\n\n.modal-close {\n  background: none;\n  border: none;\n  color: var(--vscode-foreground);\n  cursor: pointer;\n  font-size: 18px;\n  line-height: 1;\n  padding: 4px;\n  border-radius: 2px;\n  transition: background-color 0.2s;\n}\n\n.modal-close:hover {\n  background: var(--vscode-toolbar-hoverBackground);\n}\n\n.modal-content {\n  padding: 20px;\n}\n\n.modal-content label {\n  display: block;\n  color: var(--vscode-foreground);\n  font-size: 13px;\n  margin-bottom: 8px;\n  font-weight: 500;\n}\n\n.modal-content input {\n  width: 100%;\n  background: var(--vscode-input-background);\n  color: var(--vscode-input-foreground);\n  border: 1px solid var(--vscode-input-border);\n  border-radius: 4px;\n  padding: 8px 12px;\n  font-family: var(--vscode-font-family);\n  font-size: 13px;\n  margin-top: 6px;\n  outline: none;\n  box-sizing: border-box;\n}\n\n.modal-content input:focus {\n  border-color: var(--vscode-focusBorder);\n}\n\n.modal-footer {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  padding: 16px 20px;\n  border-top: 1px solid var(--vscode-dropdown-border);\n}\n\n.btn-primary,\n.btn-secondary {\n  padding: 8px 16px;\n  border: none;\n  border-radius: 4px;\n  font-size: 13px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n  font-weight: 500;\n}\n\n.btn-primary {\n  background: var(--vscode-button-background);\n  color: var(--vscode-button-foreground);\n}\n\n.btn-primary:hover:not(:disabled) {\n  background: var(--vscode-button-hoverBackground);\n}\n\n.btn-primary:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.btn-secondary {\n  background: var(--vscode-button-secondaryBackground);\n  color: var(--vscode-button-secondaryForeground);\n}\n\n.btn-secondary:hover {\n  background: var(--vscode-button-secondaryHoverBackground);\n}\n\n/* Responsive */\n@media (max-width: 768px) {\n  .file-explorer {\n    width: 100%;\n  }\n\n  .explorer-header {\n    padding: 6px 8px;\n  }\n\n  .explorer-title h3 {\n    font-size: 10px;\n  }\n\n  .workspace-name {\n    font-size: 11px;\n  }\n\n  .action-btn {\n    width: 20px;\n    height: 20px;\n    font-size: 11px;\n  }\n\n  .file-node {\n    padding: 3px 6px;\n    font-size: 12px;\n    min-height: 22px;\n  }\n\n  .file-icon {\n    font-size: 12px;\n    width: 14px;\n  }\n\n  .file-size {\n    font-size: 9px;\n  }\n\n  .directory-children {\n    margin-left: 10px;\n  }\n\n  .context-menu {\n    min-width: 120px;\n  }\n\n  .context-menu button {\n    padding: 6px 10px;\n    font-size: 11px;\n  }\n\n  .modal {\n    min-width: 280px;\n    margin: 20px;\n  }\n\n  .modal-header {\n    padding: 12px 16px;\n  }\n\n  .modal-content {\n    padding: 16px;\n  }\n\n  .modal-footer {\n    padding: 12px 16px;\n    gap: 8px;\n  }\n\n  .btn-primary,\n  .btn-secondary {\n    padding: 6px 12px;\n    font-size: 12px;\n  }\n}\n\n/* File type specific styling */\n.file-node.file:hover .file-name {\n  color: var(--vscode-list-hoverForeground);\n}\n\n.file-node.directory.expanded > .file-icon {\n  transform: rotate(0deg);\n}\n\n.file-node.directory:not(.expanded) > .file-icon {\n  transform: rotate(-90deg);\n}\n\n/* Animation for directory toggle */\n.file-icon {\n  transition: transform 0.2s ease;\n}\n\n/* Tree guide styling */\n.directory-children::before {\n  content: '';\n  position: absolute;\n  left: -1px;\n  top: 0;\n  bottom: 0;\n  width: 1px;\n  background: var(--vscode-tree-indentGuidesStroke);\n  opacity: 0.4;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/Layout.css":
/*!******************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/Layout.css ***!
  \******************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, `/* Layout.css */
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
  overflow: hidden;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  min-width: 200px;
  max-width: 500px;
  background-color: var(--vscode-sideBar-background);
  border-right: 1px solid var(--vscode-sideBar-border);
  overflow: hidden;
  resize: horizontal;
}

.editor-area {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chat-panel {
  width: 400px;
  min-width: 300px;
  max-width: 600px;
  background-color: var(--vscode-sideBar-background);
  border-right: 1px solid var(--vscode-panel-border);
  overflow: hidden;
  resize: horizontal;
}

.code-editor {
  flex: 1;
  background-color: var(--vscode-editor-background);
  overflow: hidden;
}

.preview-panel {
  width: 400px;
  min-width: 300px;
  max-width: 600px;
  background-color: var(--vscode-panel-background);
  border-left: 1px solid var(--vscode-panel-border);
  overflow: hidden;
  resize: horizontal;
}

.terminal-panel {
  height: 250px;
  min-height: 150px;
  max-height: 400px;
  background-color: var(--vscode-panel-background);
  border-top: 1px solid var(--vscode-panel-border);
  overflow: hidden;
  resize: vertical;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .chat-panel {
    width: 300px;
    min-width: 250px;
  }

  .preview-panel {
    width: 300px;
    min-width: 250px;
  }

  .sidebar {
    width: 250px;
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .editor-container {
    flex-direction: column;
  }

  .chat-panel {
    width: 100%;
    height: 200px;
    min-height: 150px;
    border-right: none;
    border-bottom: 1px solid var(--vscode-panel-border);
    resize: vertical;
  }

  .preview-panel {
    width: 100%;
    height: 200px;
    min-height: 150px;
    border-left: none;
    border-top: 1px solid var(--vscode-panel-border);
    resize: vertical;
  }

  .sidebar {
    width: 100%;
    height: 200px;
    min-height: 150px;
    border-right: none;
    border-bottom: 1px solid var(--vscode-sideBar-border);
    resize: vertical;
  }

  .main-content {
    flex-direction: column;
  }

  .editor-area {
    flex-direction: column;
  }
}

/* Animation for panel transitions */
.sidebar,
.chat-panel,
.preview-panel,
.terminal-panel {
  transition: all 0.2s ease-in-out;
}

/* Focus styles for accessibility */
.sidebar:focus-within,
.chat-panel:focus-within,
.code-editor:focus-within,
.preview-panel:focus-within,
.terminal-panel:focus-within {
  outline: 2px solid var(--vscode-focusBorder);
  outline-offset: -2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .sidebar,
  .chat-panel,
  .preview-panel,
  .terminal-panel {
    border-width: 2px;
  }
}

/* Dark/Light theme adjustments */
.vscode-dark {
  --panel-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.vscode-light {
  --panel-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Panel shadow for depth */
.chat-panel,
.preview-panel,
.terminal-panel {
  box-shadow: var(--panel-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Scrollbar styling for consistency */
.sidebar::-webkit-scrollbar,
.chat-panel::-webkit-scrollbar,
.preview-panel::-webkit-scrollbar,
.terminal-panel::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.sidebar::-webkit-scrollbar-track,
.chat-panel::-webkit-scrollbar-track,
.preview-panel::-webkit-scrollbar-track,
.terminal-panel::-webkit-scrollbar-track {
  background: var(--vscode-scrollbar-shadow);
}

.sidebar::-webkit-scrollbar-thumb,
.chat-panel::-webkit-scrollbar-thumb,
.preview-panel::-webkit-scrollbar-thumb,
.terminal-panel::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover,
.chat-panel::-webkit-scrollbar-thumb:hover,
.preview-panel::-webkit-scrollbar-thumb:hover,
.terminal-panel::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-scrollbarSlider-hoverBackground);
}

/* Panel resize handles */
.sidebar::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  cursor: ew-resize;
  background: transparent;
  z-index: 1000;
}

.sidebar::after:hover {
  background: var(--vscode-sash-hoverBorder);
}

.chat-panel::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  cursor: ew-resize;
  background: transparent;
  z-index: 1000;
}

.chat-panel::after:hover {
  background: var(--vscode-sash-hoverBorder);
}

.terminal-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  cursor: ns-resize;
  background: transparent;
  z-index: 1000;
}

.terminal-panel::before:hover {
  background: var(--vscode-sash-hoverBorder);
}
`, "",{"version":3,"sources":["webpack://./src/renderer/styles/Layout.css"],"names":[],"mappings":"AAAA,eAAe;AACf;EACE,aAAa;EACb,sBAAsB;EACtB,aAAa;EACb,iDAAiD;EACjD,sCAAsC;EACtC,gBAAgB;AAClB;;AAEA;EACE,aAAa;EACb,OAAO;EACP,gBAAgB;AAClB;;AAEA;EACE,YAAY;EACZ,gBAAgB;EAChB,gBAAgB;EAChB,kDAAkD;EAClD,oDAAoD;EACpD,gBAAgB;EAChB,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,OAAO;EACP,gBAAgB;AAClB;;AAEA;EACE,aAAa;EACb,OAAO;EACP,gBAAgB;AAClB;;AAEA;EACE,YAAY;EACZ,gBAAgB;EAChB,gBAAgB;EAChB,kDAAkD;EAClD,kDAAkD;EAClD,gBAAgB;EAChB,kBAAkB;AACpB;;AAEA;EACE,OAAO;EACP,iDAAiD;EACjD,gBAAgB;AAClB;;AAEA;EACE,YAAY;EACZ,gBAAgB;EAChB,gBAAgB;EAChB,gDAAgD;EAChD,iDAAiD;EACjD,gBAAgB;EAChB,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,iBAAiB;EACjB,iBAAiB;EACjB,gDAAgD;EAChD,gDAAgD;EAChD,gBAAgB;EAChB,gBAAgB;AAClB;;AAEA,sBAAsB;AACtB;EACE;IACE,YAAY;IACZ,gBAAgB;EAClB;;EAEA;IACE,YAAY;IACZ,gBAAgB;EAClB;;EAEA;IACE,YAAY;IACZ,gBAAgB;EAClB;AACF;;AAEA;EACE;IACE,sBAAsB;EACxB;;EAEA;IACE,WAAW;IACX,aAAa;IACb,iBAAiB;IACjB,kBAAkB;IAClB,mDAAmD;IACnD,gBAAgB;EAClB;;EAEA;IACE,WAAW;IACX,aAAa;IACb,iBAAiB;IACjB,iBAAiB;IACjB,gDAAgD;IAChD,gBAAgB;EAClB;;EAEA;IACE,WAAW;IACX,aAAa;IACb,iBAAiB;IACjB,kBAAkB;IAClB,qDAAqD;IACrD,gBAAgB;EAClB;;EAEA;IACE,sBAAsB;EACxB;;EAEA;IACE,sBAAsB;EACxB;AACF;;AAEA,oCAAoC;AACpC;;;;EAIE,gCAAgC;AAClC;;AAEA,mCAAmC;AACnC;;;;;EAKE,4CAA4C;EAC5C,oBAAoB;AACtB;;AAEA,+BAA+B;AAC/B;EACE;;;;IAIE,iBAAiB;EACnB;AACF;;AAEA,iCAAiC;AACjC;EACE,4CAA4C;AAC9C;;AAEA;EACE,4CAA4C;AAC9C;;AAEA,2BAA2B;AAC3B;;;EAGE,6DAA6D;AAC/D;;AAEA,sCAAsC;AACtC;;;;EAIE,UAAU;EACV,WAAW;AACb;;AAEA;;;;EAIE,0CAA0C;AAC5C;;AAEA;;;;EAIE,oDAAoD;EACpD,kBAAkB;AACpB;;AAEA;;;;EAIE,yDAAyD;AAC3D;;AAEA,yBAAyB;AACzB;EACE,WAAW;EACX,kBAAkB;EAClB,MAAM;EACN,QAAQ;EACR,UAAU;EACV,YAAY;EACZ,iBAAiB;EACjB,uBAAuB;EACvB,aAAa;AACf;;AAEA;EACE,0CAA0C;AAC5C;;AAEA;EACE,WAAW;EACX,kBAAkB;EAClB,MAAM;EACN,QAAQ;EACR,UAAU;EACV,YAAY;EACZ,iBAAiB;EACjB,uBAAuB;EACvB,aAAa;AACf;;AAEA;EACE,0CAA0C;AAC5C;;AAEA;EACE,WAAW;EACX,kBAAkB;EAClB,MAAM;EACN,OAAO;EACP,WAAW;EACX,WAAW;EACX,iBAAiB;EACjB,uBAAuB;EACvB,aAAa;AACf;;AAEA;EACE,0CAA0C;AAC5C","sourcesContent":["/* Layout.css */\n.layout {\n  display: flex;\n  flex-direction: column;\n  height: 100vh;\n  background-color: var(--vscode-editor-background);\n  color: var(--vscode-editor-foreground);\n  overflow: hidden;\n}\n\n.main-content {\n  display: flex;\n  flex: 1;\n  overflow: hidden;\n}\n\n.sidebar {\n  width: 300px;\n  min-width: 200px;\n  max-width: 500px;\n  background-color: var(--vscode-sideBar-background);\n  border-right: 1px solid var(--vscode-sideBar-border);\n  overflow: hidden;\n  resize: horizontal;\n}\n\n.editor-area {\n  display: flex;\n  flex: 1;\n  overflow: hidden;\n}\n\n.editor-container {\n  display: flex;\n  flex: 1;\n  overflow: hidden;\n}\n\n.chat-panel {\n  width: 400px;\n  min-width: 300px;\n  max-width: 600px;\n  background-color: var(--vscode-sideBar-background);\n  border-right: 1px solid var(--vscode-panel-border);\n  overflow: hidden;\n  resize: horizontal;\n}\n\n.code-editor {\n  flex: 1;\n  background-color: var(--vscode-editor-background);\n  overflow: hidden;\n}\n\n.preview-panel {\n  width: 400px;\n  min-width: 300px;\n  max-width: 600px;\n  background-color: var(--vscode-panel-background);\n  border-left: 1px solid var(--vscode-panel-border);\n  overflow: hidden;\n  resize: horizontal;\n}\n\n.terminal-panel {\n  height: 250px;\n  min-height: 150px;\n  max-height: 400px;\n  background-color: var(--vscode-panel-background);\n  border-top: 1px solid var(--vscode-panel-border);\n  overflow: hidden;\n  resize: vertical;\n}\n\n/* Responsive Design */\n@media (max-width: 1200px) {\n  .chat-panel {\n    width: 300px;\n    min-width: 250px;\n  }\n\n  .preview-panel {\n    width: 300px;\n    min-width: 250px;\n  }\n\n  .sidebar {\n    width: 250px;\n    min-width: 200px;\n  }\n}\n\n@media (max-width: 768px) {\n  .editor-container {\n    flex-direction: column;\n  }\n\n  .chat-panel {\n    width: 100%;\n    height: 200px;\n    min-height: 150px;\n    border-right: none;\n    border-bottom: 1px solid var(--vscode-panel-border);\n    resize: vertical;\n  }\n\n  .preview-panel {\n    width: 100%;\n    height: 200px;\n    min-height: 150px;\n    border-left: none;\n    border-top: 1px solid var(--vscode-panel-border);\n    resize: vertical;\n  }\n\n  .sidebar {\n    width: 100%;\n    height: 200px;\n    min-height: 150px;\n    border-right: none;\n    border-bottom: 1px solid var(--vscode-sideBar-border);\n    resize: vertical;\n  }\n\n  .main-content {\n    flex-direction: column;\n  }\n\n  .editor-area {\n    flex-direction: column;\n  }\n}\n\n/* Animation for panel transitions */\n.sidebar,\n.chat-panel,\n.preview-panel,\n.terminal-panel {\n  transition: all 0.2s ease-in-out;\n}\n\n/* Focus styles for accessibility */\n.sidebar:focus-within,\n.chat-panel:focus-within,\n.code-editor:focus-within,\n.preview-panel:focus-within,\n.terminal-panel:focus-within {\n  outline: 2px solid var(--vscode-focusBorder);\n  outline-offset: -2px;\n}\n\n/* High contrast mode support */\n@media (prefers-contrast: high) {\n  .sidebar,\n  .chat-panel,\n  .preview-panel,\n  .terminal-panel {\n    border-width: 2px;\n  }\n}\n\n/* Dark/Light theme adjustments */\n.vscode-dark {\n  --panel-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n}\n\n.vscode-light {\n  --panel-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n\n/* Panel shadow for depth */\n.chat-panel,\n.preview-panel,\n.terminal-panel {\n  box-shadow: var(--panel-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));\n}\n\n/* Scrollbar styling for consistency */\n.sidebar::-webkit-scrollbar,\n.chat-panel::-webkit-scrollbar,\n.preview-panel::-webkit-scrollbar,\n.terminal-panel::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n\n.sidebar::-webkit-scrollbar-track,\n.chat-panel::-webkit-scrollbar-track,\n.preview-panel::-webkit-scrollbar-track,\n.terminal-panel::-webkit-scrollbar-track {\n  background: var(--vscode-scrollbar-shadow);\n}\n\n.sidebar::-webkit-scrollbar-thumb,\n.chat-panel::-webkit-scrollbar-thumb,\n.preview-panel::-webkit-scrollbar-thumb,\n.terminal-panel::-webkit-scrollbar-thumb {\n  background: var(--vscode-scrollbarSlider-background);\n  border-radius: 4px;\n}\n\n.sidebar::-webkit-scrollbar-thumb:hover,\n.chat-panel::-webkit-scrollbar-thumb:hover,\n.preview-panel::-webkit-scrollbar-thumb:hover,\n.terminal-panel::-webkit-scrollbar-thumb:hover {\n  background: var(--vscode-scrollbarSlider-hoverBackground);\n}\n\n/* Panel resize handles */\n.sidebar::after {\n  content: '';\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 4px;\n  height: 100%;\n  cursor: ew-resize;\n  background: transparent;\n  z-index: 1000;\n}\n\n.sidebar::after:hover {\n  background: var(--vscode-sash-hoverBorder);\n}\n\n.chat-panel::after {\n  content: '';\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 4px;\n  height: 100%;\n  cursor: ew-resize;\n  background: transparent;\n  z-index: 1000;\n}\n\n.chat-panel::after:hover {\n  background: var(--vscode-sash-hoverBorder);\n}\n\n.terminal-panel::before {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 4px;\n  cursor: ns-resize;\n  background: transparent;\n  z-index: 1000;\n}\n\n.terminal-panel::before:hover {\n  background: var(--vscode-sash-hoverBorder);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/MenuHandler.css":
/*!***********************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/MenuHandler.css ***!
  \***********************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, `/* MenuHandler.css */
.menu-bar {
  display: flex;
  background-color: var(--vscode-menubar-background);
  color: var(--vscode-menubar-foreground);
  border-bottom: 1px solid var(--vscode-menubar-border);
  height: 30px;
  padding: 0 8px;
  user-select: none;
  font-size: 13px;
}

.menu-button {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  border-radius: 0;
}

.menu-button:hover,
.menu-button.active {
  background-color: var(--vscode-menubar-selectionBackground);
  color: var(--vscode-menubar-selectionForeground);
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--vscode-menu-background);
  border: 1px solid var(--vscode-menu-border);
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 200px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 13px;
  color: var(--vscode-menu-foreground);
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
}

.menu-item:hover:not(.disabled) {
  background-color: var(--vscode-menu-selectionBackground);
  color: var(--vscode-menu-selectionForeground);
}

.menu-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.menu-icon {
  font-size: 14px;
  width: 16px;
  text-align: center;
  flex-shrink: 0;
}

.menu-label {
  flex: 1;
}

.menu-shortcut {
  font-size: 11px;
  color: var(--vscode-descriptionForeground);
  font-family: var(--vscode-editor-font-family);
  margin-left: auto;
}

.menu-arrow {
  font-size: 10px;
  margin-left: auto;
}

.menu-separator {
  height: 1px;
  background: var(--vscode-menu-separatorBackground);
  margin: 4px 8px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal {
  background: var(--vscode-dropdown-background);
  border: 1px solid var(--vscode-dropdown-border);
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal.about-modal,
.modal.settings-modal {
  min-width: 500px;
  max-width: 90vw;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--vscode-dropdown-border);
  background: var(--vscode-sideBarSectionHeader-background);
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--vscode-foreground);
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  padding: 4px;
  border-radius: 3px;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background: var(--vscode-toolbar-hoverBackground);
}

.modal-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: var(--vscode-dropdown-background);
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
  border-radius: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--vscode-dropdown-border);
  background: var(--vscode-sideBarSectionHeader-background);
}

.btn-primary,
.btn-secondary {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
}

.btn-primary {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.btn-primary:hover {
  background: var(--vscode-button-hoverBackground);
}

.btn-secondary {
  background: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
}

.btn-secondary:hover {
  background: var(--vscode-button-secondaryHoverBackground);
}

/* About Modal Specific Styles */
.about-content {
  text-align: center;
  color: var(--vscode-foreground);
}

.app-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.about-content h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--vscode-foreground);
}

.version {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--vscode-descriptionForeground);
  font-family: var(--vscode-editor-font-family);
}

.description {
  margin: 0 0 24px 0;
  line-height: 1.6;
  color: var(--vscode-foreground);
  text-align: left;
}

.features {
  text-align: left;
}

.features h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: var(--vscode-foreground);
}

.features ul {
  margin: 0;
  padding-left: 20px;
  color: var(--vscode-foreground);
}

.features li {
  margin: 8px 0;
  line-height: 1.4;
}

/* Settings Modal Specific Styles */
.settings-content {
  color: var(--vscode-foreground);
}

.setting-group {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vscode-panel-border);
}

.setting-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.setting-group h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--vscode-foreground);
}

.setting-group label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--vscode-foreground);
  cursor: pointer;
}

.setting-group input[type="checkbox"] {
  margin-left: 8px;
  cursor: pointer;
}

.setting-group select {
  background: var(--vscode-dropdown-background);
  color: var(--vscode-dropdown-foreground);
  border: 1px solid var(--vscode-dropdown-border);
  border-radius: 3px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 8px;
  min-width: 100px;
}

.setting-group select:focus {
  outline: 1px solid var(--vscode-focusBorder);
  outline-offset: -1px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .menu-bar {
    height: 28px;
    font-size: 12px;
    padding: 0 4px;
  }

  .menu-button {
    padding: 0 8px;
  }

  .menu-dropdown {
    min-width: 160px;
  }

  .menu-item {
    padding: 6px 12px;
    font-size: 12px;
  }

  .menu-shortcut {
    display: none;
  }

  .modal.about-modal,
  .modal.settings-modal {
    min-width: 320px;
    margin: 20px;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-header h2 {
    font-size: 16px;
  }

  .modal-content {
    padding: 20px;
  }

  .modal-footer {
    padding: 12px 20px;
    gap: 8px;
  }

  .btn-primary,
  .btn-secondary {
    padding: 6px 16px;
    font-size: 12px;
  }

  .about-content h3 {
    font-size: 20px;
  }

  .app-icon {
    font-size: 36px;
    margin-bottom: 12px;
  }

  .setting-group label {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .setting-group input[type="checkbox"],
  .setting-group select {
    margin-left: 0;
    align-self: flex-end;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .menu-bar {
    border-bottom: 2px solid var(--vscode-menubar-border);
  }

  .menu-button:hover,
  .menu-button.active {
    border: 1px solid var(--vscode-focusBorder);
  }

  .menu-dropdown {
    border: 2px solid var(--vscode-menu-border);
  }

  .modal {
    border: 2px solid var(--vscode-dropdown-border);
  }
}

/* Animation */
.menu-dropdown {
  animation: menuFadeIn 0.15s ease-out;
}

@keyframes menuFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal {
  animation: modalFadeIn 0.2s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Focus styles for accessibility */
.menu-button:focus,
.menu-item:focus {
  outline: 1px solid var(--vscode-focusBorder);
  outline-offset: -1px;
}

.modal-close:focus,
.btn-primary:focus,
.btn-secondary:focus {
  outline: 1px solid var(--vscode-focusBorder);
  outline-offset: 2px;
}
`, "",{"version":3,"sources":["webpack://./src/renderer/styles/MenuHandler.css"],"names":[],"mappings":"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","sourcesContent":["/* MenuHandler.css */\n.menu-bar {\n  display: flex;\n  background-color: var(--vscode-menubar-background);\n  color: var(--vscode-menubar-foreground);\n  border-bottom: 1px solid var(--vscode-menubar-border);\n  height: 30px;\n  padding: 0 8px;\n  user-select: none;\n  font-size: 13px;\n}\n\n.menu-button {\n  position: relative;\n  display: flex;\n  align-items: center;\n  padding: 0 12px;\n  cursor: pointer;\n  transition: background-color 0.2s, color 0.2s;\n  border-radius: 0;\n}\n\n.menu-button:hover,\n.menu-button.active {\n  background-color: var(--vscode-menubar-selectionBackground);\n  color: var(--vscode-menubar-selectionForeground);\n}\n\n.menu-dropdown {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  background: var(--vscode-menu-background);\n  border: 1px solid var(--vscode-menu-border);\n  border-radius: 0 0 4px 4px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\n  z-index: 1000;\n  min-width: 200px;\n  overflow: hidden;\n}\n\n.menu-item {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 16px;\n  cursor: pointer;\n  font-size: 13px;\n  color: var(--vscode-menu-foreground);\n  transition: background-color 0.2s, color 0.2s;\n  white-space: nowrap;\n}\n\n.menu-item:hover:not(.disabled) {\n  background-color: var(--vscode-menu-selectionBackground);\n  color: var(--vscode-menu-selectionForeground);\n}\n\n.menu-item.disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.menu-icon {\n  font-size: 14px;\n  width: 16px;\n  text-align: center;\n  flex-shrink: 0;\n}\n\n.menu-label {\n  flex: 1;\n}\n\n.menu-shortcut {\n  font-size: 11px;\n  color: var(--vscode-descriptionForeground);\n  font-family: var(--vscode-editor-font-family);\n  margin-left: auto;\n}\n\n.menu-arrow {\n  font-size: 10px;\n  margin-left: auto;\n}\n\n.menu-separator {\n  height: 1px;\n  background: var(--vscode-menu-separatorBackground);\n  margin: 4px 8px;\n}\n\n/* Modal Styles */\n.modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 2000;\n}\n\n.modal {\n  background: var(--vscode-dropdown-background);\n  border: 1px solid var(--vscode-dropdown-border);\n  border-radius: 6px;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);\n  overflow: hidden;\n}\n\n.modal.about-modal,\n.modal.settings-modal {\n  min-width: 500px;\n  max-width: 90vw;\n  max-height: 90vh;\n}\n\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 24px;\n  border-bottom: 1px solid var(--vscode-dropdown-border);\n  background: var(--vscode-sideBarSectionHeader-background);\n}\n\n.modal-header h2 {\n  margin: 0;\n  font-size: 18px;\n  color: var(--vscode-foreground);\n  font-weight: 600;\n}\n\n.modal-close {\n  background: none;\n  border: none;\n  color: var(--vscode-foreground);\n  cursor: pointer;\n  font-size: 20px;\n  line-height: 1;\n  padding: 4px;\n  border-radius: 3px;\n  transition: background-color 0.2s;\n}\n\n.modal-close:hover {\n  background: var(--vscode-toolbar-hoverBackground);\n}\n\n.modal-content {\n  padding: 24px;\n  max-height: 60vh;\n  overflow-y: auto;\n}\n\n.modal-content::-webkit-scrollbar {\n  width: 8px;\n}\n\n.modal-content::-webkit-scrollbar-track {\n  background: var(--vscode-dropdown-background);\n}\n\n.modal-content::-webkit-scrollbar-thumb {\n  background: var(--vscode-scrollbarSlider-background);\n  border-radius: 4px;\n}\n\n.modal-footer {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  padding: 16px 24px;\n  border-top: 1px solid var(--vscode-dropdown-border);\n  background: var(--vscode-sideBarSectionHeader-background);\n}\n\n.btn-primary,\n.btn-secondary {\n  padding: 8px 20px;\n  border: none;\n  border-radius: 4px;\n  font-size: 13px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n  font-weight: 500;\n}\n\n.btn-primary {\n  background: var(--vscode-button-background);\n  color: var(--vscode-button-foreground);\n}\n\n.btn-primary:hover {\n  background: var(--vscode-button-hoverBackground);\n}\n\n.btn-secondary {\n  background: var(--vscode-button-secondaryBackground);\n  color: var(--vscode-button-secondaryForeground);\n}\n\n.btn-secondary:hover {\n  background: var(--vscode-button-secondaryHoverBackground);\n}\n\n/* About Modal Specific Styles */\n.about-content {\n  text-align: center;\n  color: var(--vscode-foreground);\n}\n\n.app-icon {\n  font-size: 48px;\n  margin-bottom: 16px;\n}\n\n.about-content h3 {\n  margin: 0 0 8px 0;\n  font-size: 24px;\n  font-weight: 600;\n  color: var(--vscode-foreground);\n}\n\n.version {\n  margin: 0 0 16px 0;\n  font-size: 14px;\n  color: var(--vscode-descriptionForeground);\n  font-family: var(--vscode-editor-font-family);\n}\n\n.description {\n  margin: 0 0 24px 0;\n  line-height: 1.6;\n  color: var(--vscode-foreground);\n  text-align: left;\n}\n\n.features {\n  text-align: left;\n}\n\n.features h4 {\n  margin: 0 0 12px 0;\n  font-size: 16px;\n  color: var(--vscode-foreground);\n}\n\n.features ul {\n  margin: 0;\n  padding-left: 20px;\n  color: var(--vscode-foreground);\n}\n\n.features li {\n  margin: 8px 0;\n  line-height: 1.4;\n}\n\n/* Settings Modal Specific Styles */\n.settings-content {\n  color: var(--vscode-foreground);\n}\n\n.setting-group {\n  margin-bottom: 24px;\n  padding-bottom: 16px;\n  border-bottom: 1px solid var(--vscode-panel-border);\n}\n\n.setting-group:last-child {\n  border-bottom: none;\n  margin-bottom: 0;\n}\n\n.setting-group h4 {\n  margin: 0 0 16px 0;\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--vscode-foreground);\n}\n\n.setting-group label {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 12px;\n  font-size: 13px;\n  color: var(--vscode-foreground);\n  cursor: pointer;\n}\n\n.setting-group input[type=\"checkbox\"] {\n  margin-left: 8px;\n  cursor: pointer;\n}\n\n.setting-group select {\n  background: var(--vscode-dropdown-background);\n  color: var(--vscode-dropdown-foreground);\n  border: 1px solid var(--vscode-dropdown-border);\n  border-radius: 3px;\n  padding: 4px 8px;\n  font-size: 12px;\n  cursor: pointer;\n  margin-left: 8px;\n  min-width: 100px;\n}\n\n.setting-group select:focus {\n  outline: 1px solid var(--vscode-focusBorder);\n  outline-offset: -1px;\n}\n\n/* Responsive Design */\n@media (max-width: 768px) {\n  .menu-bar {\n    height: 28px;\n    font-size: 12px;\n    padding: 0 4px;\n  }\n\n  .menu-button {\n    padding: 0 8px;\n  }\n\n  .menu-dropdown {\n    min-width: 160px;\n  }\n\n  .menu-item {\n    padding: 6px 12px;\n    font-size: 12px;\n  }\n\n  .menu-shortcut {\n    display: none;\n  }\n\n  .modal.about-modal,\n  .modal.settings-modal {\n    min-width: 320px;\n    margin: 20px;\n  }\n\n  .modal-header {\n    padding: 16px 20px;\n  }\n\n  .modal-header h2 {\n    font-size: 16px;\n  }\n\n  .modal-content {\n    padding: 20px;\n  }\n\n  .modal-footer {\n    padding: 12px 20px;\n    gap: 8px;\n  }\n\n  .btn-primary,\n  .btn-secondary {\n    padding: 6px 16px;\n    font-size: 12px;\n  }\n\n  .about-content h3 {\n    font-size: 20px;\n  }\n\n  .app-icon {\n    font-size: 36px;\n    margin-bottom: 12px;\n  }\n\n  .setting-group label {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 8px;\n  }\n\n  .setting-group input[type=\"checkbox\"],\n  .setting-group select {\n    margin-left: 0;\n    align-self: flex-end;\n  }\n}\n\n/* High Contrast Mode */\n@media (prefers-contrast: high) {\n  .menu-bar {\n    border-bottom: 2px solid var(--vscode-menubar-border);\n  }\n\n  .menu-button:hover,\n  .menu-button.active {\n    border: 1px solid var(--vscode-focusBorder);\n  }\n\n  .menu-dropdown {\n    border: 2px solid var(--vscode-menu-border);\n  }\n\n  .modal {\n    border: 2px solid var(--vscode-dropdown-border);\n  }\n}\n\n/* Animation */\n.menu-dropdown {\n  animation: menuFadeIn 0.15s ease-out;\n}\n\n@keyframes menuFadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(-4px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.modal {\n  animation: modalFadeIn 0.2s ease-out;\n}\n\n@keyframes modalFadeIn {\n  from {\n    opacity: 0;\n    transform: scale(0.95);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n\n/* Focus styles for accessibility */\n.menu-button:focus,\n.menu-item:focus {\n  outline: 1px solid var(--vscode-focusBorder);\n  outline-offset: -1px;\n}\n\n.modal-close:focus,\n.btn-primary:focus,\n.btn-secondary:focus {\n  outline: 1px solid var(--vscode-focusBorder);\n  outline-offset: 2px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/PreviewPane.css":
/*!***********************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/PreviewPane.css ***!
  \***********************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, `/* PreviewPane.css */
.preview-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--vscode-editor-background);
  border-left: 1px solid var(--vscode-panel-border);
}

.preview-header {
  display: flex;
  flex-direction: column;
  background-color: var(--vscode-panel-background);
  border-bottom: 1px solid var(--vscode-panel-border);
}

.preview-modes {
  display: flex;
  gap: 2px;
  padding: 8px;
  border-bottom: 1px solid var(--vscode-panel-border);
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
}

.mode-btn:hover {
  background: var(--vscode-button-secondaryHoverBackground);
}

.mode-btn.active {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.mode-icon {
  font-size: 14px;
}

.mode-name {
  font-weight: 500;
}

.preview-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  gap: 16px;
}

.url-controls {
  flex: 1;
  position: relative;
}

.url-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: var(--vscode-input-background);
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  max-width: 300px;
}

.url-text {
  flex: 1;
  font-size: 12px;
  color: var(--vscode-input-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--vscode-editor-font-family);
}

.url-edit-btn {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  font-size: 10px;
  opacity: 0.7;
  transition: opacity 0.2s, background-color 0.2s;
}

.url-edit-btn:hover {
  opacity: 1;
  background: var(--vscode-toolbar-hoverBackground);
}

.url-input-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  gap: 4px;
  padding: 8px;
  background: var(--vscode-dropdown-background);
  border: 1px solid var(--vscode-dropdown-border);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin-top: 4px;
}

.url-input-container input {
  flex: 1;
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border: 1px solid var(--vscode-input-border);
  border-radius: 3px;
  padding: 4px 8px;
  font-size: 12px;
  font-family: var(--vscode-editor-font-family);
  outline: none;
}

.url-input-container input:focus {
  border-color: var(--vscode-focusBorder);
}

.url-input-container button {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border: none;
  border-radius: 3px;
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.url-input-container button:hover:not(:disabled) {
  background: var(--vscode-button-hoverBackground);
}

.url-input-container button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 3px;
  font-size: 12px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
}

.control-btn:hover:not(:disabled) {
  background-color: var(--vscode-toolbar-hoverBackground);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.active {
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  border-left: 1px solid var(--vscode-panel-border);
  border-right: 1px solid var(--vscode-panel-border);
}

.zoom-level {
  font-size: 11px;
  color: var(--vscode-foreground);
  min-width: 35px;
  text-align: center;
}

.preview-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #ffffff;
}

.preview-container.mobile {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  background: #f5f5f5;
}

.preview-container.mobile .preview-iframe {
  width: 375px !important;
  height: 667px !important;
  max-width: 100%;
  max-height: 100%;
  border: 8px solid #333;
  border-radius: 25px;
  transform: none !important;
}

.preview-container.desktop {
  background: #f0f0f0;
  padding: 20px;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
  transition: transform 0.2s ease;
}

.preview-error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--vscode-editor-background);
}

.error-content {
  text-align: center;
  max-width: 400px;
  color: var(--vscode-foreground);
}

.error-content h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: var(--vscode-errorForeground);
}

.error-content p {
  margin: 0 0 20px 0;
  color: var(--vscode-descriptionForeground);
  line-height: 1.5;
}

.error-suggestions {
  text-align: left;
  margin: 20px 0;
  padding: 16px;
  background: var(--vscode-textCodeBlock-background);
  border: 1px solid var(--vscode-panel-border);
  border-radius: 4px;
}

.error-suggestions h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--vscode-foreground);
}

.error-suggestions ul {
  margin: 0;
  padding-left: 20px;
  color: var(--vscode-descriptionForeground);
}

.error-suggestions li {
  margin: 6px 0;
  line-height: 1.4;
}

.error-suggestions code {
  background: var(--vscode-textPreformat-background);
  color: var(--vscode-textPreformat-foreground);
  padding: 2px 4px;
  border-radius: 2px;
  font-family: var(--vscode-editor-font-family);
  font-size: 12px;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

.retry-btn,
.change-url-btn {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover,
.change-url-btn:hover {
  background: var(--vscode-button-hoverBackground);
}

.change-url-btn {
  background: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
}

.change-url-btn:hover {
  background: var(--vscode-button-secondaryHoverBackground);
}

.preview-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--vscode-editor-background);
  color: var(--vscode-foreground);
  z-index: 10;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vscode-progressBar-background);
  border-top: 3px solid var(--vscode-button-background);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.preview-loading p {
  margin: 0;
  font-size: 14px;
  color: var(--vscode-descriptionForeground);
}

.preview-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px;
  background-color: var(--vscode-statusBar-background);
  color: var(--vscode-statusBar-foreground);
  border-top: 1px solid var(--vscode-statusBar-border);
  font-size: 11px;
}

.status-left,
.status-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 4px;
}

.connection-status.running {
  color: var(--vscode-terminal-ansiGreen);
}

.connection-status.stopped {
  color: var(--vscode-terminal-ansiRed);
}

.connection-status.error {
  color: var(--vscode-terminal-ansiYellow);
}

.preview-info {
  color: var(--vscode-statusBar-foreground);
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

/* Responsive */
@media (max-width: 768px) {
  .preview-modes {
    overflow-x: auto;
    gap: 1px;
  }

  .mode-btn {
    padding: 4px 8px;
    font-size: 11px;
    min-width: 60px;
  }

  .mode-name {
    display: none;
  }

  .preview-controls {
    flex-direction: column;
    gap: 8px;
    padding: 6px 8px;
  }

  .url-controls {
    max-width: none;
  }

  .url-display {
    max-width: none;
  }

  .action-controls {
    justify-content: center;
    gap: 4px;
  }

  .zoom-controls {
    padding: 0 4px;
  }

  .preview-container.mobile {
    padding: 10px;
  }

  .preview-container.mobile .preview-iframe {
    width: 320px !important;
    height: 568px !important;
    border-width: 4px;
    border-radius: 15px;
  }

  .preview-status {
    padding: 3px 8px;
    font-size: 10px;
  }

  .preview-info {
    max-width: 120px;
  }

  .error-content {
    padding: 20px 10px;
  }

  .error-suggestions {
    padding: 12px;
  }

  .error-actions {
    flex-direction: column;
    gap: 8px;
  }
}
`, "",{"version":3,"sources":["webpack://./src/renderer/styles/PreviewPane.css"],"names":[],"mappings":"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","sourcesContent":["/* PreviewPane.css */\n.preview-pane {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  background-color: var(--vscode-editor-background);\n  border-left: 1px solid var(--vscode-panel-border);\n}\n\n.preview-header {\n  display: flex;\n  flex-direction: column;\n  background-color: var(--vscode-panel-background);\n  border-bottom: 1px solid var(--vscode-panel-border);\n}\n\n.preview-modes {\n  display: flex;\n  gap: 2px;\n  padding: 8px;\n  border-bottom: 1px solid var(--vscode-panel-border);\n}\n\n.mode-btn {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 6px 12px;\n  background: var(--vscode-button-secondaryBackground);\n  color: var(--vscode-button-secondaryForeground);\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 12px;\n  transition: background-color 0.2s, color 0.2s;\n  white-space: nowrap;\n}\n\n.mode-btn:hover {\n  background: var(--vscode-button-secondaryHoverBackground);\n}\n\n.mode-btn.active {\n  background: var(--vscode-button-background);\n  color: var(--vscode-button-foreground);\n}\n\n.mode-icon {\n  font-size: 14px;\n}\n\n.mode-name {\n  font-weight: 500;\n}\n\n.preview-controls {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 8px 12px;\n  gap: 16px;\n}\n\n.url-controls {\n  flex: 1;\n  position: relative;\n}\n\n.url-display {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 4px 8px;\n  background: var(--vscode-input-background);\n  border: 1px solid var(--vscode-input-border);\n  border-radius: 4px;\n  max-width: 300px;\n}\n\n.url-text {\n  flex: 1;\n  font-size: 12px;\n  color: var(--vscode-input-foreground);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-family: var(--vscode-editor-font-family);\n}\n\n.url-edit-btn {\n  background: none;\n  border: none;\n  color: var(--vscode-foreground);\n  cursor: pointer;\n  padding: 2px;\n  border-radius: 2px;\n  font-size: 10px;\n  opacity: 0.7;\n  transition: opacity 0.2s, background-color 0.2s;\n}\n\n.url-edit-btn:hover {\n  opacity: 1;\n  background: var(--vscode-toolbar-hoverBackground);\n}\n\n.url-input-container {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  right: 0;\n  z-index: 1000;\n  display: flex;\n  gap: 4px;\n  padding: 8px;\n  background: var(--vscode-dropdown-background);\n  border: 1px solid var(--vscode-dropdown-border);\n  border-radius: 4px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\n  margin-top: 4px;\n}\n\n.url-input-container input {\n  flex: 1;\n  background: var(--vscode-input-background);\n  color: var(--vscode-input-foreground);\n  border: 1px solid var(--vscode-input-border);\n  border-radius: 3px;\n  padding: 4px 8px;\n  font-size: 12px;\n  font-family: var(--vscode-editor-font-family);\n  outline: none;\n}\n\n.url-input-container input:focus {\n  border-color: var(--vscode-focusBorder);\n}\n\n.url-input-container button {\n  background: var(--vscode-button-background);\n  color: var(--vscode-button-foreground);\n  border: none;\n  border-radius: 3px;\n  padding: 4px 8px;\n  font-size: 11px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n\n.url-input-container button:hover:not(:disabled) {\n  background: var(--vscode-button-hoverBackground);\n}\n\n.url-input-container button:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.action-controls {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.control-btn {\n  background: none;\n  border: none;\n  color: var(--vscode-foreground);\n  cursor: pointer;\n  padding: 4px 6px;\n  border-radius: 3px;\n  font-size: 12px;\n  transition: background-color 0.2s;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 24px;\n  height: 24px;\n}\n\n.control-btn:hover:not(:disabled) {\n  background-color: var(--vscode-toolbar-hoverBackground);\n}\n\n.control-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.control-btn.active {\n  background-color: var(--vscode-button-background);\n  color: var(--vscode-button-foreground);\n}\n\n.zoom-controls {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  padding: 0 8px;\n  border-left: 1px solid var(--vscode-panel-border);\n  border-right: 1px solid var(--vscode-panel-border);\n}\n\n.zoom-level {\n  font-size: 11px;\n  color: var(--vscode-foreground);\n  min-width: 35px;\n  text-align: center;\n}\n\n.preview-container {\n  flex: 1;\n  position: relative;\n  overflow: hidden;\n  background: #ffffff;\n}\n\n.preview-container.mobile {\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n  padding: 20px;\n  background: #f5f5f5;\n}\n\n.preview-container.mobile .preview-iframe {\n  width: 375px !important;\n  height: 667px !important;\n  max-width: 100%;\n  max-height: 100%;\n  border: 8px solid #333;\n  border-radius: 25px;\n  transform: none !important;\n}\n\n.preview-container.desktop {\n  background: #f0f0f0;\n  padding: 20px;\n}\n\n.preview-iframe {\n  width: 100%;\n  height: 100%;\n  border: none;\n  background: white;\n  transition: transform 0.2s ease;\n}\n\n.preview-error {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 40px 20px;\n  background: var(--vscode-editor-background);\n}\n\n.error-content {\n  text-align: center;\n  max-width: 400px;\n  color: var(--vscode-foreground);\n}\n\n.error-content h3 {\n  margin: 0 0 16px 0;\n  font-size: 18px;\n  color: var(--vscode-errorForeground);\n}\n\n.error-content p {\n  margin: 0 0 20px 0;\n  color: var(--vscode-descriptionForeground);\n  line-height: 1.5;\n}\n\n.error-suggestions {\n  text-align: left;\n  margin: 20px 0;\n  padding: 16px;\n  background: var(--vscode-textCodeBlock-background);\n  border: 1px solid var(--vscode-panel-border);\n  border-radius: 4px;\n}\n\n.error-suggestions h4 {\n  margin: 0 0 12px 0;\n  font-size: 14px;\n  color: var(--vscode-foreground);\n}\n\n.error-suggestions ul {\n  margin: 0;\n  padding-left: 20px;\n  color: var(--vscode-descriptionForeground);\n}\n\n.error-suggestions li {\n  margin: 6px 0;\n  line-height: 1.4;\n}\n\n.error-suggestions code {\n  background: var(--vscode-textPreformat-background);\n  color: var(--vscode-textPreformat-foreground);\n  padding: 2px 4px;\n  border-radius: 2px;\n  font-family: var(--vscode-editor-font-family);\n  font-size: 12px;\n}\n\n.error-actions {\n  display: flex;\n  gap: 12px;\n  justify-content: center;\n  margin-top: 20px;\n}\n\n.retry-btn,\n.change-url-btn {\n  background: var(--vscode-button-background);\n  color: var(--vscode-button-foreground);\n  border: none;\n  border-radius: 4px;\n  padding: 8px 16px;\n  font-size: 13px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n\n.retry-btn:hover,\n.change-url-btn:hover {\n  background: var(--vscode-button-hoverBackground);\n}\n\n.change-url-btn {\n  background: var(--vscode-button-secondaryBackground);\n  color: var(--vscode-button-secondaryForeground);\n}\n\n.change-url-btn:hover {\n  background: var(--vscode-button-secondaryHoverBackground);\n}\n\n.preview-loading {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  background: var(--vscode-editor-background);\n  color: var(--vscode-foreground);\n  z-index: 10;\n}\n\n.loading-spinner {\n  width: 32px;\n  height: 32px;\n  border: 3px solid var(--vscode-progressBar-background);\n  border-top: 3px solid var(--vscode-button-background);\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n  margin-bottom: 16px;\n}\n\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n.preview-loading p {\n  margin: 0;\n  font-size: 14px;\n  color: var(--vscode-descriptionForeground);\n}\n\n.preview-status {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 4px 12px;\n  background-color: var(--vscode-statusBar-background);\n  color: var(--vscode-statusBar-foreground);\n  border-top: 1px solid var(--vscode-statusBar-border);\n  font-size: 11px;\n}\n\n.status-left,\n.status-right {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.connection-status {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n\n.connection-status.running {\n  color: var(--vscode-terminal-ansiGreen);\n}\n\n.connection-status.stopped {\n  color: var(--vscode-terminal-ansiRed);\n}\n\n.connection-status.error {\n  color: var(--vscode-terminal-ansiYellow);\n}\n\n.preview-info {\n  color: var(--vscode-statusBar-foreground);\n  opacity: 0.8;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  max-width: 200px;\n}\n\n/* Responsive */\n@media (max-width: 768px) {\n  .preview-modes {\n    overflow-x: auto;\n    gap: 1px;\n  }\n\n  .mode-btn {\n    padding: 4px 8px;\n    font-size: 11px;\n    min-width: 60px;\n  }\n\n  .mode-name {\n    display: none;\n  }\n\n  .preview-controls {\n    flex-direction: column;\n    gap: 8px;\n    padding: 6px 8px;\n  }\n\n  .url-controls {\n    max-width: none;\n  }\n\n  .url-display {\n    max-width: none;\n  }\n\n  .action-controls {\n    justify-content: center;\n    gap: 4px;\n  }\n\n  .zoom-controls {\n    padding: 0 4px;\n  }\n\n  .preview-container.mobile {\n    padding: 10px;\n  }\n\n  .preview-container.mobile .preview-iframe {\n    width: 320px !important;\n    height: 568px !important;\n    border-width: 4px;\n    border-radius: 15px;\n  }\n\n  .preview-status {\n    padding: 3px 8px;\n    font-size: 10px;\n  }\n\n  .preview-info {\n    max-width: 120px;\n  }\n\n  .error-content {\n    padding: 20px 10px;\n  }\n\n  .error-suggestions {\n    padding: 12px;\n  }\n\n  .error-actions {\n    flex-direction: column;\n    gap: 8px;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/StatusBar.css":
/*!*********************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/StatusBar.css ***!
  \*********************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, `/* StatusBar.css */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--vscode-statusBar-background);
  color: var(--vscode-statusBar-foreground);
  border-top: 1px solid var(--vscode-statusBar-border);
  height: 22px;
  padding: 0 12px;
  font-size: 11px;
  user-select: none;
  overflow: hidden;
}

.status-left,
.status-center,
.status-right {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.status-left {
  flex: 1;
  justify-content: flex-start;
}

.status-center {
  flex: 1;
  justify-content: center;
}

.status-right {
  flex: 1;
  justify-content: flex-end;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  height: 18px;
  border-radius: 3px;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
  position: relative;
}

.status-item.clickable {
  cursor: pointer;
}

.status-item.clickable:hover {
  background-color: var(--vscode-statusBarItem-hoverBackground);
  color: var(--vscode-statusBarItem-hoverForeground);
}

.status-icon {
  font-size: 10px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
}

.status-text {
  font-size: 11px;
  line-height: 1;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.status-separator {
  color: var(--vscode-statusBar-foreground);
  opacity: 0.3;
  font-size: 10px;
  margin: 0 4px;
}

/* Specific status item styles */
.workspace-status {
  font-weight: 500;
}

.workspace-status .status-text {
  max-width: 100px;
}

.git-status {
  color: var(--vscode-statusBar-foreground);
}

.problems-status .status-text {
  color: var(--vscode-statusBar-foreground);
}

.problems-status:hover .status-text {
  color: var(--vscode-statusBarItem-hoverForeground);
}

.build-status.success {
  color: var(--vscode-terminal-ansiGreen);
}

.build-status.building {
  color: var(--vscode-terminal-ansiYellow);
}

.build-status.error {
  color: var(--vscode-terminal-ansiRed);
}

.run-status .status-icon {
  animation: none;
}

.run-status.running .status-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.ai-status .status-text.processing {
  color: var(--vscode-terminal-ansiBlue);
}

.ai-status .status-text.processing::after {
  content: '';
  animation: dots 1.5s infinite;
}

@keyframes dots {
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
}

.cursor-position {
  font-family: var(--vscode-editor-font-family);
  color: var(--vscode-statusBar-foreground);
  opacity: 0.8;
}

.ai-model {
  color: var(--vscode-statusBar-foreground);
}

.ai-model .status-text {
  max-width: 80px;
}

.notifications-status {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--vscode-errorForeground);
  color: white;
  font-size: 8px;
  font-weight: bold;
  border-radius: 6px;
  min-width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
  line-height: 1;
}

.connection-status .status-icon {
  animation: none;
}

.connection-status.error .status-icon {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

.memory-usage {
  color: var(--vscode-statusBar-foreground);
  opacity: 0.8;
}

.memory-usage .status-text {
  font-family: var(--vscode-editor-font-family);
  min-width: 30px;
  text-align: right;
}

.time-display {
  color: var(--vscode-statusBar-foreground);
  opacity: 0.8;
  font-family: var(--vscode-editor-font-family);
}

.time-display .status-text {
  min-width: 35px;
  text-align: right;
}

/* Active/Selected states */
.status-item.active {
  background-color: var(--vscode-statusBarItem-activeBackground);
  color: var(--vscode-statusBarItem-activeForeground);
}

/* Error states */
.status-item.error {
  background-color: var(--vscode-statusBarItem-errorBackground);
  color: var(--vscode-statusBarItem-errorForeground);
}

.status-item.warning {
  background-color: var(--vscode-statusBarItem-warningBackground);
  color: var(--vscode-statusBarItem-warningForeground);
}

/* Loading states */
.status-item.loading .status-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 1200px) {
  .status-bar {
    font-size: 10px;
    padding: 0 8px;
  }

  .status-item {
    padding: 1px 4px;
    gap: 3px;
  }

  .status-text {
    font-size: 10px;
    max-width: 80px;
  }

  .workspace-status .status-text {
    max-width: 60px;
  }

  .ai-model .status-text {
    max-width: 60px;
  }

  .status-separator {
    margin: 0 2px;
  }
}

@media (max-width: 768px) {
  .status-bar {
    height: 20px;
    font-size: 9px;
    padding: 0 6px;
    gap: 4px;
  }

  .status-left,
  .status-center,
  .status-right {
    gap: 4px;
  }

  .status-item {
    padding: 1px 3px;
    gap: 2px;
  }

  .status-icon {
    font-size: 9px;
    width: 10px;
    height: 10px;
  }

  .status-text {
    font-size: 9px;
    max-width: 60px;
  }

  /* Hide some items on mobile */
  .git-status,
  .cursor-position,
  .memory-usage {
    display: none;
  }

  .time-display .status-text {
    min-width: 30px;
  }

  .notification-badge {
    font-size: 7px;
    min-width: 10px;
    height: 10px;
  }
}

/* Focus states for accessibility */
.status-item.clickable:focus {
  outline: 1px solid var(--vscode-focusBorder);
  outline-offset: -1px;
}

/* Tooltip-like behavior for truncated text */
.status-item:hover .status-text {
  overflow: visible;
  white-space: nowrap;
  z-index: 1000;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .status-bar {
    border-top: 2px solid var(--vscode-statusBar-border);
  }

  .status-item.clickable:hover {
    border: 1px solid var(--vscode-focusBorder);
  }

  .notification-badge {
    border: 1px solid white;
  }
}

/* Dark/Light theme specific adjustments */
.vscode-dark .status-bar {
  border-top-color: #3c3c3c;
}

.vscode-light .status-bar {
  border-top-color: #e5e5e5;
}

/* Animation performance optimization */
.status-item.loading .status-icon,
.run-status.running .status-icon,
.connection-status.error .status-icon {
  will-change: transform, opacity;
}

/* Prevent text selection on status items */
.status-bar * {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
`, "",{"version":3,"sources":["webpack://./src/renderer/styles/StatusBar.css"],"names":[],"mappings":"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","sourcesContent":["/* StatusBar.css */\n.status-bar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background-color: var(--vscode-statusBar-background);\n  color: var(--vscode-statusBar-foreground);\n  border-top: 1px solid var(--vscode-statusBar-border);\n  height: 22px;\n  padding: 0 12px;\n  font-size: 11px;\n  user-select: none;\n  overflow: hidden;\n}\n\n.status-left,\n.status-center,\n.status-right {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  height: 100%;\n}\n\n.status-left {\n  flex: 1;\n  justify-content: flex-start;\n}\n\n.status-center {\n  flex: 1;\n  justify-content: center;\n}\n\n.status-right {\n  flex: 1;\n  justify-content: flex-end;\n}\n\n.status-item {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  padding: 2px 6px;\n  height: 18px;\n  border-radius: 3px;\n  transition: background-color 0.2s, color 0.2s;\n  white-space: nowrap;\n  position: relative;\n}\n\n.status-item.clickable {\n  cursor: pointer;\n}\n\n.status-item.clickable:hover {\n  background-color: var(--vscode-statusBarItem-hoverBackground);\n  color: var(--vscode-statusBarItem-hoverForeground);\n}\n\n.status-icon {\n  font-size: 10px;\n  line-height: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 12px;\n  height: 12px;\n}\n\n.status-text {\n  font-size: 11px;\n  line-height: 1;\n  font-weight: 400;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: 120px;\n}\n\n.status-separator {\n  color: var(--vscode-statusBar-foreground);\n  opacity: 0.3;\n  font-size: 10px;\n  margin: 0 4px;\n}\n\n/* Specific status item styles */\n.workspace-status {\n  font-weight: 500;\n}\n\n.workspace-status .status-text {\n  max-width: 100px;\n}\n\n.git-status {\n  color: var(--vscode-statusBar-foreground);\n}\n\n.problems-status .status-text {\n  color: var(--vscode-statusBar-foreground);\n}\n\n.problems-status:hover .status-text {\n  color: var(--vscode-statusBarItem-hoverForeground);\n}\n\n.build-status.success {\n  color: var(--vscode-terminal-ansiGreen);\n}\n\n.build-status.building {\n  color: var(--vscode-terminal-ansiYellow);\n}\n\n.build-status.error {\n  color: var(--vscode-terminal-ansiRed);\n}\n\n.run-status .status-icon {\n  animation: none;\n}\n\n.run-status.running .status-icon {\n  animation: pulse 2s infinite;\n}\n\n@keyframes pulse {\n  0% { opacity: 1; }\n  50% { opacity: 0.5; }\n  100% { opacity: 1; }\n}\n\n.ai-status .status-text.processing {\n  color: var(--vscode-terminal-ansiBlue);\n}\n\n.ai-status .status-text.processing::after {\n  content: '';\n  animation: dots 1.5s infinite;\n}\n\n@keyframes dots {\n  0%, 20% { content: ''; }\n  40% { content: '.'; }\n  60% { content: '..'; }\n  80%, 100% { content: '...'; }\n}\n\n.cursor-position {\n  font-family: var(--vscode-editor-font-family);\n  color: var(--vscode-statusBar-foreground);\n  opacity: 0.8;\n}\n\n.ai-model {\n  color: var(--vscode-statusBar-foreground);\n}\n\n.ai-model .status-text {\n  max-width: 80px;\n}\n\n.notifications-status {\n  position: relative;\n}\n\n.notification-badge {\n  position: absolute;\n  top: -2px;\n  right: -2px;\n  background: var(--vscode-errorForeground);\n  color: white;\n  font-size: 8px;\n  font-weight: bold;\n  border-radius: 6px;\n  min-width: 12px;\n  height: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 2px;\n  line-height: 1;\n}\n\n.connection-status .status-icon {\n  animation: none;\n}\n\n.connection-status.error .status-icon {\n  animation: blink 1s infinite;\n}\n\n@keyframes blink {\n  0%, 50% { opacity: 1; }\n  51%, 100% { opacity: 0.3; }\n}\n\n.memory-usage {\n  color: var(--vscode-statusBar-foreground);\n  opacity: 0.8;\n}\n\n.memory-usage .status-text {\n  font-family: var(--vscode-editor-font-family);\n  min-width: 30px;\n  text-align: right;\n}\n\n.time-display {\n  color: var(--vscode-statusBar-foreground);\n  opacity: 0.8;\n  font-family: var(--vscode-editor-font-family);\n}\n\n.time-display .status-text {\n  min-width: 35px;\n  text-align: right;\n}\n\n/* Active/Selected states */\n.status-item.active {\n  background-color: var(--vscode-statusBarItem-activeBackground);\n  color: var(--vscode-statusBarItem-activeForeground);\n}\n\n/* Error states */\n.status-item.error {\n  background-color: var(--vscode-statusBarItem-errorBackground);\n  color: var(--vscode-statusBarItem-errorForeground);\n}\n\n.status-item.warning {\n  background-color: var(--vscode-statusBarItem-warningBackground);\n  color: var(--vscode-statusBarItem-warningForeground);\n}\n\n/* Loading states */\n.status-item.loading .status-icon {\n  animation: spin 1s linear infinite;\n}\n\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n/* Responsive design */\n@media (max-width: 1200px) {\n  .status-bar {\n    font-size: 10px;\n    padding: 0 8px;\n  }\n\n  .status-item {\n    padding: 1px 4px;\n    gap: 3px;\n  }\n\n  .status-text {\n    font-size: 10px;\n    max-width: 80px;\n  }\n\n  .workspace-status .status-text {\n    max-width: 60px;\n  }\n\n  .ai-model .status-text {\n    max-width: 60px;\n  }\n\n  .status-separator {\n    margin: 0 2px;\n  }\n}\n\n@media (max-width: 768px) {\n  .status-bar {\n    height: 20px;\n    font-size: 9px;\n    padding: 0 6px;\n    gap: 4px;\n  }\n\n  .status-left,\n  .status-center,\n  .status-right {\n    gap: 4px;\n  }\n\n  .status-item {\n    padding: 1px 3px;\n    gap: 2px;\n  }\n\n  .status-icon {\n    font-size: 9px;\n    width: 10px;\n    height: 10px;\n  }\n\n  .status-text {\n    font-size: 9px;\n    max-width: 60px;\n  }\n\n  /* Hide some items on mobile */\n  .git-status,\n  .cursor-position,\n  .memory-usage {\n    display: none;\n  }\n\n  .time-display .status-text {\n    min-width: 30px;\n  }\n\n  .notification-badge {\n    font-size: 7px;\n    min-width: 10px;\n    height: 10px;\n  }\n}\n\n/* Focus states for accessibility */\n.status-item.clickable:focus {\n  outline: 1px solid var(--vscode-focusBorder);\n  outline-offset: -1px;\n}\n\n/* Tooltip-like behavior for truncated text */\n.status-item:hover .status-text {\n  overflow: visible;\n  white-space: nowrap;\n  z-index: 1000;\n}\n\n/* High contrast mode support */\n@media (prefers-contrast: high) {\n  .status-bar {\n    border-top: 2px solid var(--vscode-statusBar-border);\n  }\n\n  .status-item.clickable:hover {\n    border: 1px solid var(--vscode-focusBorder);\n  }\n\n  .notification-badge {\n    border: 1px solid white;\n  }\n}\n\n/* Dark/Light theme specific adjustments */\n.vscode-dark .status-bar {\n  border-top-color: #3c3c3c;\n}\n\n.vscode-light .status-bar {\n  border-top-color: #e5e5e5;\n}\n\n/* Animation performance optimization */\n.status-item.loading .status-icon,\n.run-status.running .status-icon,\n.connection-status.error .status-icon {\n  will-change: transform, opacity;\n}\n\n/* Prevent text selection on status items */\n.status-bar * {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/TerminalPane.css":
/*!************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/TerminalPane.css ***!
  \************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, `/* TerminalPane.css */
.terminal-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--vscode-terminal-background);
  color: var(--vscode-terminal-foreground);
  font-family: var(--vscode-editor-font-family);
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--vscode-panel-background);
  border-bottom: 1px solid var(--vscode-panel-border);
  min-height: 35px;
}

.terminal-tabs {
  display: flex;
  flex: 1;
  overflow-x: auto;
}

.terminal-tabs::-webkit-scrollbar {
  height: 3px;
}

.terminal-tabs::-webkit-scrollbar-track {
  background: var(--vscode-panel-background);
}

.terminal-tabs::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
  border-radius: 3px;
}

.terminal-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: var(--vscode-tab-inactiveBackground);
  color: var(--vscode-tab-inactiveForeground);
  border-right: 1px solid var(--vscode-tab-border);
  cursor: pointer;
  min-width: 100px;
  transition: background-color 0.2s, color 0.2s;
  user-select: none;
  white-space: nowrap;
}

.terminal-tab:hover {
  background-color: var(--vscode-tab-hoverBackground);
  color: var(--vscode-tab-hoverForeground);
}

.terminal-tab.active {
  background-color: var(--vscode-tab-activeBackground);
  color: var(--vscode-tab-activeForeground);
  border-bottom: 2px solid var(--vscode-tab-activeBorder);
}

.tab-icon {
  font-size: 12px;
}

.tab-name {
  font-size: 12px;
  flex: 1;
}

.tab-close {
  background: none;
  border: none;
  color: var(--vscode-tab-inactiveForeground);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: background-color 0.2s, color 0.2s;
}

.tab-close:hover {
  background-color: var(--vscode-toolbar-hoverBackground);
  color: var(--vscode-tab-activeForeground);
}

.terminal-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
}

.new-terminal-dropdown {
  position: relative;
}

.new-terminal-dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--vscode-dropdown-background);
  border: 1px solid var(--vscode-dropdown-border);
  border-radius: 4px;
  min-width: 120px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dropdown-content button {
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  color: var(--vscode-dropdown-foreground);
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;
}

.dropdown-content button:hover {
  background: var(--vscode-list-hoverBackground);
}

.runner-controls {
  display: flex;
  gap: 4px;
  margin: 0 8px;
  padding: 0 8px;
  border-left: 1px solid var(--vscode-panel-border);
  border-right: 1px solid var(--vscode-panel-border);
}

.action-btn,
.control-btn {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 3px;
  font-size: 12px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
}

.action-btn:hover,
.control-btn:hover {
  background-color: var(--vscode-toolbar-hoverBackground);
}

.control-btn.active {
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.terminal-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
  background-color: var(--vscode-terminal-background);
}

.terminal-content::-webkit-scrollbar {
  width: 8px;
}

.terminal-content::-webkit-scrollbar-track {
  background: var(--vscode-terminal-background);
}

.terminal-content::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
  border-radius: 4px;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-scrollbarSlider-hoverBackground);
}

.terminal-messages {
  font-family: var(--vscode-editor-font-family);
  font-size: 13px;
  line-height: 1.4;
}

.terminal-message {
  display: flex;
  margin-bottom: 2px;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.terminal-message.input {
  color: var(--vscode-terminal-foreground);
}

.terminal-message.output {
  color: var(--vscode-terminal-foreground);
}

.terminal-message.error {
  color: var(--vscode-errorForeground);
}

.terminal-message.system {
  color: var(--vscode-terminal-ansiBrightBlue);
  font-style: italic;
}

.message-timestamp {
  color: var(--vscode-descriptionForeground);
  font-size: 11px;
  margin-right: 8px;
  min-width: 60px;
  opacity: 0.7;
}

.message-content {
  flex: 1;
  word-break: break-all;
}

.terminal-input-line {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.terminal-prompt {
  color: var(--vscode-terminal-ansiGreen);
  font-weight: 600;
  margin-right: 4px;
  user-select: none;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--vscode-terminal-foreground);
  font-family: var(--vscode-editor-font-family);
  font-size: 13px;
  outline: none;
  padding: 0;
  margin: 0;
  caret-color: var(--vscode-terminal-foreground);
}

.terminal-input::selection {
  background: var(--vscode-terminal-selectionBackground);
}

.terminal-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px;
  background-color: var(--vscode-statusBar-background);
  color: var(--vscode-statusBar-foreground);
  border-top: 1px solid var(--vscode-statusBar-border);
  font-size: 11px;
}

.status-left,
.status-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
}

.status-indicator.running {
  color: var(--vscode-terminal-ansiGreen);
}

.status-indicator.stopped {
  color: var(--vscode-terminal-ansiRed);
}

.status-indicator.error {
  color: var(--vscode-terminal-ansiYellow);
}

.status-indicator.building {
  color: var(--vscode-terminal-ansiBlue);
}

.workspace-info {
  color: var(--vscode-statusBar-foreground);
  opacity: 0.8;
}

.debug-test-toggle {
  background: none;
  border: none;
  color: var(--vscode-statusBar-foreground);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 11px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.debug-test-toggle:hover {
  background-color: var(--vscode-statusBarItem-hoverBackground);
}

.debug-test-toggle.active {
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.debug-test-panel-container {
  position: fixed;
  top: 60px;
  right: 20px;
  bottom: 60px;
  width: 450px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--vscode-panel-border);
}

@media (max-width: 1200px) {
  .debug-test-panel-container {
    width: 380px;
    right: 10px;
  }
}

@media (max-width: 768px) {
  .debug-test-panel-container {
    position: fixed;
    top: 50px;
    left: 10px;
    right: 10px;
    bottom: 50px;
    width: auto;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .terminal-tab {
    min-width: 80px;
    padding: 4px 8px;
  }

  .tab-name {
    font-size: 11px;
  }

  .terminal-actions {
    gap: 2px;
    padding: 0 4px;
  }

  .runner-controls {
    margin: 0 4px;
    padding: 0 4px;
  }

  .terminal-content {
    padding: 6px 8px;
  }

  .terminal-messages {
    font-size: 12px;
  }

  .terminal-input {
    font-size: 12px;
  }

  .terminal-status {
    padding: 3px 8px;
    font-size: 10px;
  }

  .message-timestamp {
    display: none;
  }
}

/* Animation for building status */
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.status-indicator.building {
  animation: pulse 1.5s infinite;
}
`, "",{"version":3,"sources":["webpack://./src/renderer/styles/TerminalPane.css"],"names":[],"mappings":"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","sourcesContent":["/* TerminalPane.css */\n.terminal-pane {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  background-color: var(--vscode-terminal-background);\n  color: var(--vscode-terminal-foreground);\n  font-family: var(--vscode-editor-font-family);\n}\n\n.terminal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background-color: var(--vscode-panel-background);\n  border-bottom: 1px solid var(--vscode-panel-border);\n  min-height: 35px;\n}\n\n.terminal-tabs {\n  display: flex;\n  flex: 1;\n  overflow-x: auto;\n}\n\n.terminal-tabs::-webkit-scrollbar {\n  height: 3px;\n}\n\n.terminal-tabs::-webkit-scrollbar-track {\n  background: var(--vscode-panel-background);\n}\n\n.terminal-tabs::-webkit-scrollbar-thumb {\n  background: var(--vscode-scrollbarSlider-background);\n  border-radius: 3px;\n}\n\n.terminal-tab {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 6px 12px;\n  background-color: var(--vscode-tab-inactiveBackground);\n  color: var(--vscode-tab-inactiveForeground);\n  border-right: 1px solid var(--vscode-tab-border);\n  cursor: pointer;\n  min-width: 100px;\n  transition: background-color 0.2s, color 0.2s;\n  user-select: none;\n  white-space: nowrap;\n}\n\n.terminal-tab:hover {\n  background-color: var(--vscode-tab-hoverBackground);\n  color: var(--vscode-tab-hoverForeground);\n}\n\n.terminal-tab.active {\n  background-color: var(--vscode-tab-activeBackground);\n  color: var(--vscode-tab-activeForeground);\n  border-bottom: 2px solid var(--vscode-tab-activeBorder);\n}\n\n.tab-icon {\n  font-size: 12px;\n}\n\n.tab-name {\n  font-size: 12px;\n  flex: 1;\n}\n\n.tab-close {\n  background: none;\n  border: none;\n  color: var(--vscode-tab-inactiveForeground);\n  cursor: pointer;\n  font-size: 14px;\n  line-height: 1;\n  padding: 0;\n  width: 14px;\n  height: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 2px;\n  transition: background-color 0.2s, color 0.2s;\n}\n\n.tab-close:hover {\n  background-color: var(--vscode-toolbar-hoverBackground);\n  color: var(--vscode-tab-activeForeground);\n}\n\n.terminal-actions {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  padding: 0 8px;\n}\n\n.new-terminal-dropdown {\n  position: relative;\n}\n\n.new-terminal-dropdown:hover .dropdown-content {\n  display: block;\n}\n\n.dropdown-content {\n  display: none;\n  position: absolute;\n  top: 100%;\n  right: 0;\n  background: var(--vscode-dropdown-background);\n  border: 1px solid var(--vscode-dropdown-border);\n  border-radius: 4px;\n  min-width: 120px;\n  z-index: 1000;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\n}\n\n.dropdown-content button {\n  width: 100%;\n  padding: 8px 12px;\n  background: none;\n  border: none;\n  color: var(--vscode-dropdown-foreground);\n  font-size: 12px;\n  cursor: pointer;\n  text-align: left;\n  transition: background-color 0.2s;\n}\n\n.dropdown-content button:hover {\n  background: var(--vscode-list-hoverBackground);\n}\n\n.runner-controls {\n  display: flex;\n  gap: 4px;\n  margin: 0 8px;\n  padding: 0 8px;\n  border-left: 1px solid var(--vscode-panel-border);\n  border-right: 1px solid var(--vscode-panel-border);\n}\n\n.action-btn,\n.control-btn {\n  background: none;\n  border: none;\n  color: var(--vscode-foreground);\n  cursor: pointer;\n  padding: 4px 6px;\n  border-radius: 3px;\n  font-size: 12px;\n  transition: background-color 0.2s;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 24px;\n  height: 24px;\n}\n\n.action-btn:hover,\n.control-btn:hover {\n  background-color: var(--vscode-toolbar-hoverBackground);\n}\n\n.control-btn.active {\n  background-color: var(--vscode-button-background);\n  color: var(--vscode-button-foreground);\n}\n\n.control-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.terminal-content {\n  flex: 1;\n  overflow-y: auto;\n  padding: 8px 12px;\n  background-color: var(--vscode-terminal-background);\n}\n\n.terminal-content::-webkit-scrollbar {\n  width: 8px;\n}\n\n.terminal-content::-webkit-scrollbar-track {\n  background: var(--vscode-terminal-background);\n}\n\n.terminal-content::-webkit-scrollbar-thumb {\n  background: var(--vscode-scrollbarSlider-background);\n  border-radius: 4px;\n}\n\n.terminal-content::-webkit-scrollbar-thumb:hover {\n  background: var(--vscode-scrollbarSlider-hoverBackground);\n}\n\n.terminal-messages {\n  font-family: var(--vscode-editor-font-family);\n  font-size: 13px;\n  line-height: 1.4;\n}\n\n.terminal-message {\n  display: flex;\n  margin-bottom: 2px;\n  word-wrap: break-word;\n  white-space: pre-wrap;\n}\n\n.terminal-message.input {\n  color: var(--vscode-terminal-foreground);\n}\n\n.terminal-message.output {\n  color: var(--vscode-terminal-foreground);\n}\n\n.terminal-message.error {\n  color: var(--vscode-errorForeground);\n}\n\n.terminal-message.system {\n  color: var(--vscode-terminal-ansiBrightBlue);\n  font-style: italic;\n}\n\n.message-timestamp {\n  color: var(--vscode-descriptionForeground);\n  font-size: 11px;\n  margin-right: 8px;\n  min-width: 60px;\n  opacity: 0.7;\n}\n\n.message-content {\n  flex: 1;\n  word-break: break-all;\n}\n\n.terminal-input-line {\n  display: flex;\n  align-items: center;\n  margin-top: 4px;\n}\n\n.terminal-prompt {\n  color: var(--vscode-terminal-ansiGreen);\n  font-weight: 600;\n  margin-right: 4px;\n  user-select: none;\n}\n\n.terminal-input {\n  flex: 1;\n  background: transparent;\n  border: none;\n  color: var(--vscode-terminal-foreground);\n  font-family: var(--vscode-editor-font-family);\n  font-size: 13px;\n  outline: none;\n  padding: 0;\n  margin: 0;\n  caret-color: var(--vscode-terminal-foreground);\n}\n\n.terminal-input::selection {\n  background: var(--vscode-terminal-selectionBackground);\n}\n\n.terminal-status {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 4px 12px;\n  background-color: var(--vscode-statusBar-background);\n  color: var(--vscode-statusBar-foreground);\n  border-top: 1px solid var(--vscode-statusBar-border);\n  font-size: 11px;\n}\n\n.status-left,\n.status-right {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.status-indicator {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 11px;\n}\n\n.status-indicator.running {\n  color: var(--vscode-terminal-ansiGreen);\n}\n\n.status-indicator.stopped {\n  color: var(--vscode-terminal-ansiRed);\n}\n\n.status-indicator.error {\n  color: var(--vscode-terminal-ansiYellow);\n}\n\n.status-indicator.building {\n  color: var(--vscode-terminal-ansiBlue);\n}\n\n.workspace-info {\n  color: var(--vscode-statusBar-foreground);\n  opacity: 0.8;\n}\n\n.debug-test-toggle {\n  background: none;\n  border: none;\n  color: var(--vscode-statusBar-foreground);\n  cursor: pointer;\n  padding: 4px 8px;\n  border-radius: 3px;\n  font-size: 11px;\n  transition: background-color 0.2s;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n\n.debug-test-toggle:hover {\n  background-color: var(--vscode-statusBarItem-hoverBackground);\n}\n\n.debug-test-toggle.active {\n  background-color: var(--vscode-button-background);\n  color: var(--vscode-button-foreground);\n}\n\n.debug-test-panel-container {\n  position: fixed;\n  top: 60px;\n  right: 20px;\n  bottom: 60px;\n  width: 450px;\n  z-index: 1000;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n  border-radius: 8px;\n  overflow: hidden;\n  backdrop-filter: blur(10px);\n  background: rgba(255, 255, 255, 0.95);\n  border: 1px solid var(--vscode-panel-border);\n}\n\n@media (max-width: 1200px) {\n  .debug-test-panel-container {\n    width: 380px;\n    right: 10px;\n  }\n}\n\n@media (max-width: 768px) {\n  .debug-test-panel-container {\n    position: fixed;\n    top: 50px;\n    left: 10px;\n    right: 10px;\n    bottom: 50px;\n    width: auto;\n  }\n}\n\n/* Responsive */\n@media (max-width: 768px) {\n  .terminal-tab {\n    min-width: 80px;\n    padding: 4px 8px;\n  }\n\n  .tab-name {\n    font-size: 11px;\n  }\n\n  .terminal-actions {\n    gap: 2px;\n    padding: 0 4px;\n  }\n\n  .runner-controls {\n    margin: 0 4px;\n    padding: 0 4px;\n  }\n\n  .terminal-content {\n    padding: 6px 8px;\n  }\n\n  .terminal-messages {\n    font-size: 12px;\n  }\n\n  .terminal-input {\n    font-size: 12px;\n  }\n\n  .terminal-status {\n    padding: 3px 8px;\n    font-size: 10px;\n  }\n\n  .message-timestamp {\n    display: none;\n  }\n}\n\n/* Animation for building status */\n@keyframes pulse {\n  0% { opacity: 1; }\n  50% { opacity: 0.5; }\n  100% { opacity: 1; }\n}\n\n.status-indicator.building {\n  animation: pulse 1.5s infinite;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/index.css":
/*!*****************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/index.css ***!
  \*****************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #1e1e1e;
  color: #cccccc;
  overflow: hidden;
}

#root {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

/* VS Code color scheme */
:root {
  --vscode-background: #1e1e1e;
  --vscode-foreground: #cccccc;
  --vscode-editor-background: #1e1e1e;
  --vscode-editor-foreground: #d4d4d4;
  --vscode-sidebar-background: #252526;
  --vscode-sidebar-foreground: #cccccc;
  --vscode-input-background: #3c3c3c;
  --vscode-input-foreground: #cccccc;
  --vscode-input-border: #3c3c3c;
  --vscode-button-background: #0e639c;
  --vscode-button-foreground: #ffffff;
  --vscode-button-hover-background: #1177bb;
  --vscode-list-hover-background: #2a2d2e;
  --vscode-border: #3c3c3c;
  --vscode-panel-background: #1e1e1e;
  --vscode-panel-border: #3c3c3c;
  --vscode-statusbar-background: #007acc;
  --vscode-statusbar-foreground: #ffffff;
  --vscode-terminal-background: #1e1e1e;
  --vscode-terminal-foreground: #cccccc;
  --vscode-success: #89d185;
  --vscode-warning: #ffcc02;
  --vscode-error: #f85149;
  --vscode-info: #3794ff;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(121, 121, 121, 0.4);
  border-radius: 10px;
  border: 3px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(121, 121, 121, 0.7);
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Common styles */
.button {
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: var(--vscode-button-hover-background);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button.secondary {
  background-color: transparent;
  border: 1px solid var(--vscode-border);
  color: var(--vscode-foreground);
}

.button.secondary:hover {
  background-color: var(--vscode-list-hover-background);
}

.input {
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border: 1px solid var(--vscode-input-border);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}

.input:focus {
  border-color: var(--vscode-button-background);
  box-shadow: 0 0 0 1px var(--vscode-button-background);
}

.textarea {
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border: 1px solid var(--vscode-input-border);
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  outline: none;
  resize: vertical;
  min-height: 100px;
}

.textarea:focus {
  border-color: var(--vscode-button-background);
  box-shadow: 0 0 0 1px var(--vscode-button-background);
}

.icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
  display: inline-block;
  vertical-align: middle;
}

.icon.large {
  width: 24px;
  height: 24px;
}

/* Status indicators */
.status-success {
  color: var(--vscode-success);
}

.status-warning {
  color: var(--vscode-warning);
}

.status-error {
  color: var(--vscode-error);
}

.status-info {
  color: var(--vscode-info);
}

/* Loading spinner */
.spinner {
  border: 2px solid transparent;
  border-top: 2px solid var(--vscode-button-background);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Utility classes */
.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-1 {
  flex: 1;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}

.p-2 {
  padding: 8px;
}

.p-3 {
  padding: 12px;
}

.p-4 {
  padding: 16px;
}

.m-2 {
  margin: 8px;
}

.m-3 {
  margin: 12px;
}

.m-4 {
  margin: 16px;
}

.text-center {
  text-align: center;
}

.text-sm {
  font-size: 12px;
}

.text-lg {
  font-size: 16px;
}

.font-semibold {
  font-weight: 600;
}

.opacity-50 {
  opacity: 0.5;
}

.cursor-pointer {
  cursor: pointer;
}

.select-none {
  user-select: none;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.border-b {
  border-bottom: 1px solid var(--vscode-border);
}

.border-r {
  border-right: 1px solid var(--vscode-border);
}

.rounded {
  border-radius: 4px;
}

.shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
`, "",{"version":3,"sources":["webpack://./src/renderer/styles/index.css"],"names":[],"mappings":"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","sourcesContent":["* {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',\n    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',\n    sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  background-color: #1e1e1e;\n  color: #cccccc;\n  overflow: hidden;\n}\n\n#root {\n  height: 100vh;\n  width: 100vw;\n  display: flex;\n  flex-direction: column;\n}\n\n/* VS Code color scheme */\n:root {\n  --vscode-background: #1e1e1e;\n  --vscode-foreground: #cccccc;\n  --vscode-editor-background: #1e1e1e;\n  --vscode-editor-foreground: #d4d4d4;\n  --vscode-sidebar-background: #252526;\n  --vscode-sidebar-foreground: #cccccc;\n  --vscode-input-background: #3c3c3c;\n  --vscode-input-foreground: #cccccc;\n  --vscode-input-border: #3c3c3c;\n  --vscode-button-background: #0e639c;\n  --vscode-button-foreground: #ffffff;\n  --vscode-button-hover-background: #1177bb;\n  --vscode-list-hover-background: #2a2d2e;\n  --vscode-border: #3c3c3c;\n  --vscode-panel-background: #1e1e1e;\n  --vscode-panel-border: #3c3c3c;\n  --vscode-statusbar-background: #007acc;\n  --vscode-statusbar-foreground: #ffffff;\n  --vscode-terminal-background: #1e1e1e;\n  --vscode-terminal-foreground: #cccccc;\n  --vscode-success: #89d185;\n  --vscode-warning: #ffcc02;\n  --vscode-error: #f85149;\n  --vscode-info: #3794ff;\n}\n\n/* Custom scrollbar */\n::-webkit-scrollbar {\n  width: 14px;\n  height: 14px;\n}\n\n::-webkit-scrollbar-thumb {\n  background-color: rgba(121, 121, 121, 0.4);\n  border-radius: 10px;\n  border: 3px solid transparent;\n  background-clip: content-box;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background-color: rgba(121, 121, 121, 0.7);\n}\n\n::-webkit-scrollbar-track {\n  background-color: transparent;\n}\n\n/* Common styles */\n.button {\n  background-color: var(--vscode-button-background);\n  color: var(--vscode-button-foreground);\n  border: none;\n  padding: 8px 16px;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 14px;\n  font-family: inherit;\n  transition: background-color 0.2s;\n}\n\n.button:hover {\n  background-color: var(--vscode-button-hover-background);\n}\n\n.button:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n.button.secondary {\n  background-color: transparent;\n  border: 1px solid var(--vscode-border);\n  color: var(--vscode-foreground);\n}\n\n.button.secondary:hover {\n  background-color: var(--vscode-list-hover-background);\n}\n\n.input {\n  background-color: var(--vscode-input-background);\n  color: var(--vscode-input-foreground);\n  border: 1px solid var(--vscode-input-border);\n  padding: 8px 12px;\n  border-radius: 4px;\n  font-size: 14px;\n  font-family: inherit;\n  outline: none;\n}\n\n.input:focus {\n  border-color: var(--vscode-button-background);\n  box-shadow: 0 0 0 1px var(--vscode-button-background);\n}\n\n.textarea {\n  background-color: var(--vscode-input-background);\n  color: var(--vscode-input-foreground);\n  border: 1px solid var(--vscode-input-border);\n  padding: 12px;\n  border-radius: 4px;\n  font-size: 14px;\n  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;\n  outline: none;\n  resize: vertical;\n  min-height: 100px;\n}\n\n.textarea:focus {\n  border-color: var(--vscode-button-background);\n  box-shadow: 0 0 0 1px var(--vscode-button-background);\n}\n\n.icon {\n  width: 16px;\n  height: 16px;\n  fill: currentColor;\n  display: inline-block;\n  vertical-align: middle;\n}\n\n.icon.large {\n  width: 24px;\n  height: 24px;\n}\n\n/* Status indicators */\n.status-success {\n  color: var(--vscode-success);\n}\n\n.status-warning {\n  color: var(--vscode-warning);\n}\n\n.status-error {\n  color: var(--vscode-error);\n}\n\n.status-info {\n  color: var(--vscode-info);\n}\n\n/* Loading spinner */\n.spinner {\n  border: 2px solid transparent;\n  border-top: 2px solid var(--vscode-button-background);\n  border-radius: 50%;\n  width: 16px;\n  height: 16px;\n  animation: spin 1s linear infinite;\n  display: inline-block;\n}\n\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n/* Utility classes */\n.flex {\n  display: flex;\n}\n\n.flex-column {\n  flex-direction: column;\n}\n\n.flex-1 {\n  flex: 1;\n}\n\n.gap-2 {\n  gap: 8px;\n}\n\n.gap-3 {\n  gap: 12px;\n}\n\n.gap-4 {\n  gap: 16px;\n}\n\n.p-2 {\n  padding: 8px;\n}\n\n.p-3 {\n  padding: 12px;\n}\n\n.p-4 {\n  padding: 16px;\n}\n\n.m-2 {\n  margin: 8px;\n}\n\n.m-3 {\n  margin: 12px;\n}\n\n.m-4 {\n  margin: 16px;\n}\n\n.text-center {\n  text-align: center;\n}\n\n.text-sm {\n  font-size: 12px;\n}\n\n.text-lg {\n  font-size: 16px;\n}\n\n.font-semibold {\n  font-weight: 600;\n}\n\n.opacity-50 {\n  opacity: 0.5;\n}\n\n.cursor-pointer {\n  cursor: pointer;\n}\n\n.select-none {\n  user-select: none;\n}\n\n.truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.border-b {\n  border-bottom: 1px solid var(--vscode-border);\n}\n\n.border-r {\n  border-right: 1px solid var(--vscode-border);\n}\n\n.rounded {\n  border-radius: 4px;\n}\n\n.shadow {\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/debug/components/DebugTestPanel.tsx":
/*!*************************************************!*\
  !*** ./src/debug/components/DebugTestPanel.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DebugTestPanel: () => (/* binding */ DebugTestPanel)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());



const DebugTestPanel = ({ workspaceRoot, activeFile, onTestRun, onDebugStart }) => {
    const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('debug');
    const [debugSession, setDebugSession] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [testCases, setTestCases] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isAutoTestEnabled, setIsAutoTestEnabled] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [isWatchingFiles, setIsWatchingFiles] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [metrics, setMetrics] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        coverage: 0,
        executionTime: 0
    });
    const [debugOutput, setDebugOutput] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [testOutput, setTestOutput] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [smartBreakpoints, setSmartBreakpoints] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [variableAnomalies, setVariableAnomalies] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [aiSuggestions, setAiSuggestions] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isGeneratingTests, setIsGeneratingTests] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [isDebugging, setIsDebugging] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const debugOutputRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const testOutputRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const wsRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    // WebSocket connection for real-time updates
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const connectWebSocket = () => {
            try {
                wsRef.current = new WebSocket('ws://localhost:8080/debug-test');
                wsRef.current.onopen = () => {
                    console.log('Debug-Test WebSocket connected');
                };
                wsRef.current.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    handleWebSocketMessage(data);
                };
                wsRef.current.onclose = () => {
                    console.log('Debug-Test WebSocket disconnected');
                    // Reconnect after 3 seconds
                    setTimeout(connectWebSocket, 3000);
                };
                wsRef.current.onerror = (error) => {
                    console.error('Debug-Test WebSocket error:', error);
                };
            }
            catch (error) {
                console.error('Failed to connect WebSocket:', error);
            }
        };
        connectWebSocket();
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);
    const handleWebSocketMessage = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((data) => {
        switch (data.type) {
            case 'debug-session-started':
                setDebugSession(data.session);
                setIsDebugging(true);
                break;
            case 'debug-session-paused':
                setDebugSession(prev => prev ? { ...prev, status: 'paused' } : null);
                break;
            case 'debug-session-stopped':
                setDebugSession(null);
                setIsDebugging(false);
                break;
            case 'test-started':
                updateTestCase(data.test.id, { status: 'running' });
                break;
            case 'test-completed':
                updateTestCase(data.test.id, {
                    status: data.result.status,
                    duration: data.result.duration,
                    error: data.result.error
                });
                updateMetrics();
                break;
            case 'smart-breakpoints-suggested':
                setSmartBreakpoints(data.breakpoints);
                break;
            case 'variable-anomaly-detected':
                setVariableAnomalies(prev => [...prev, data.anomaly]);
                break;
            case 'ai-suggestion':
                setAiSuggestions(prev => [...prev, data.suggestion]);
                break;
            case 'debug-output':
                setDebugOutput(prev => [...prev, data.message]);
                break;
            case 'test-output':
                setTestOutput(prev => [...prev, data.message]);
                break;
        }
    }, []);
    const updateTestCase = (id, updates) => {
        setTestCases(prev => prev.map(test => test.id === id ? { ...test, ...updates } : test));
    };
    const updateMetrics = () => {
        setMetrics(prev => {
            const total = testCases.length;
            const passed = testCases.filter(t => t.status === 'passed').length;
            const failed = testCases.filter(t => t.status === 'failed').length;
            const avgTime = testCases
                .filter(t => t.duration)
                .reduce((sum, t) => sum + (t.duration || 0), 0) / total;
            return {
                totalTests: total,
                passedTests: passed,
                failedTests: failed,
                coverage: Math.random() * 100, // TODO: Calculate real coverage
                executionTime: avgTime
            };
        });
    };
    const startDebugSession = async () => {
        if (!activeFile)
            return;
        try {
            setIsDebugging(true);
            // Send debug start command via WebSocket
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: 'start-debug',
                    file: activeFile,
                    breakpoints: smartBreakpoints
                }));
            }
            onDebugStart?.({ file: activeFile });
        }
        catch (error) {
            console.error('Failed to start debug session:', error);
            setIsDebugging(false);
        }
    };
    const stopDebugSession = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'stop-debug'
            }));
        }
        setDebugSession(null);
        setIsDebugging(false);
    };
    const generateTests = async () => {
        if (!activeFile)
            return;
        try {
            setIsGeneratingTests(true);
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: 'generate-tests',
                    file: activeFile,
                    testType: 'unit',
                    coverage: 80
                }));
            }
        }
        catch (error) {
            console.error('Failed to generate tests:', error);
        }
        finally {
            setIsGeneratingTests(false);
        }
    };
    const runAllTests = async () => {
        try {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: 'run-all-tests',
                    tests: testCases.map(t => t.id)
                }));
            }
            onTestRun?.(testCases);
        }
        catch (error) {
            console.error('Failed to run tests:', error);
        }
    };
    const runSingleTest = async (testId) => {
        try {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: 'run-test',
                    testId
                }));
            }
        }
        catch (error) {
            console.error('Failed to run test:', error);
        }
    };
    const toggleAutoTest = () => {
        setIsAutoTestEnabled(!isAutoTestEnabled);
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'toggle-auto-test',
                enabled: !isAutoTestEnabled
            }));
        }
    };
    const toggleFileWatching = () => {
        setIsWatchingFiles(!isWatchingFiles);
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'toggle-file-watching',
                enabled: !isWatchingFiles
            }));
        }
    };
    // Auto-scroll debug/test output
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (debugOutputRef.current) {
            debugOutputRef.current.scrollTop = debugOutputRef.current.scrollHeight;
        }
    }, [debugOutput]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (testOutputRef.current) {
            testOutputRef.current.scrollTop = testOutputRef.current.scrollHeight;
        }
    }, [testOutput]);
    const renderDebugTab = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-4 space-y-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 p-3 bg-gray-50 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: isDebugging ? stopDebugSession : startDebugSession, className: `flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium ${isDebugging
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'}`, children: [isDebugging ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16 }) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16 }), isDebugging ? 'Stop Debug' : 'Start Debug'] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: generateTests, disabled: isGeneratingTests, className: "flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50", children: [isGeneratingTests ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16, className: "animate-spin" }) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16 }), "Generate AI Tests"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 ml-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: toggleAutoTest, className: `flex items-center gap-1 px-2 py-1 rounded text-xs ${isAutoTestEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`, children: [isAutoTestEnabled ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 14 }) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 14 }), "Auto Test"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: toggleFileWatching, className: `flex items-center gap-1 px-2 py-1 rounded text-xs ${isWatchingFiles ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`, children: [isWatchingFiles ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 14 }) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 14 }), "Watch Files"] })] })] }), debugSession && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16, className: "text-blue-600" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium text-blue-800", children: "Debug Session Active" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `px-2 py-0.5 rounded text-xs font-medium ${debugSession.status === 'active' ? 'bg-green-100 text-green-700' :
                                    debugSession.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'}`, children: debugSession.status })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-sm text-blue-700", children: ["Stack Frames: ", debugSession.stackFrames?.length || 0, " | Variables: ", debugSession.variables?.length || 0, " | Breakpoints: ", debugSession.breakpoints?.length || 0] })] })), smartBreakpoints.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-3 border border-orange-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h4", { className: "flex items-center gap-2 font-medium text-orange-800 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16 }), "AI Suggested Breakpoints"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "space-y-1", children: smartBreakpoints.map((bp, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 text-sm", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "w-8 text-orange-600 font-mono", children: ["L", bp.line] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-gray-700", children: bp.reason }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: `px-1.5 py-0.5 rounded text-xs ${bp.confidence > 0.8 ? 'bg-green-100 text-green-700' :
                                        bp.confidence > 0.6 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'}`, children: [Math.round(bp.confidence * 100), "%"] })] }, index))) })] })), variableAnomalies.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-3 border border-red-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h4", { className: "flex items-center gap-2 font-medium text-red-800 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16 }), "Variable Anomalies"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "space-y-2", children: variableAnomalies.map((anomaly, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-2 bg-red-50 rounded", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", { className: "text-sm font-mono text-red-700", children: anomaly.variableName }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `px-1.5 py-0.5 rounded text-xs font-medium ${anomaly.severity === 'critical' ? 'bg-red-200 text-red-800' :
                                                anomaly.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                                                    anomaly.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                                        'bg-blue-200 text-blue-800'}`, children: anomaly.severity })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-red-700", children: anomaly.suggestion })] }, index))) })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "h-64 border border-gray-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-2 bg-gray-100 border-b border-gray-200 rounded-t-lg", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h4", { className: "flex items-center gap-2 font-medium text-gray-700", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16 }), "Debug Output"] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { ref: debugOutputRef, className: "h-48 p-3 overflow-y-auto bg-black text-green-400 font-mono text-sm", children: [debugOutput.map((line, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "whitespace-pre-wrap", children: line }, index))), debugOutput.length === 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-gray-500", children: "Start debugging to see output..." }))] })] })] }));
    const renderTestTab = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-4 space-y-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 p-3 bg-gray-50 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: runAllTests, className: "flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16 }), "Run All Tests"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: generateTests, disabled: isGeneratingTests, className: "flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50", children: [isGeneratingTests ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16, className: "animate-spin" }) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16 }), "Generate Tests"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ml-auto text-sm text-gray-600", children: ["Total: ", metrics.totalTests, " | Passed: ", metrics.passedTests, " | Failed: ", metrics.failedTests] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-4 gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16, className: "text-blue-600" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm font-medium text-blue-800", children: "Total Tests" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-2xl font-bold text-blue-900", children: metrics.totalTests })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-3 bg-green-50 border border-green-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16, className: "text-green-600" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm font-medium text-green-800", children: "Passed" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-2xl font-bold text-green-900", children: metrics.passedTests })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-3 bg-red-50 border border-red-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16, className: "text-red-600" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm font-medium text-red-800", children: "Failed" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-2xl font-bold text-red-900", children: metrics.failedTests })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-3 bg-yellow-50 border border-yellow-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16, className: "text-yellow-600" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm font-medium text-yellow-800", children: "Avg Time" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-2xl font-bold text-yellow-900", children: [metrics.executionTime.toFixed(1), "ms"] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "border border-gray-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-3 bg-gray-100 border-b border-gray-200 rounded-t-lg", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { className: "font-medium text-gray-700", children: "Test Cases" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-h-64 overflow-y-auto", children: [testCases.map((test) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-3 border-b border-gray-100 last:border-b-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `w-3 h-3 rounded-full ${test.status === 'passed' ? 'bg-green-500' :
                                                    test.status === 'failed' ? 'bg-red-500' :
                                                        test.status === 'running' ? 'bg-blue-500 animate-pulse' :
                                                            test.status === 'error' ? 'bg-orange-500' :
                                                                'bg-gray-300'}` }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-medium text-gray-900", children: test.name }), test.duration && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-sm text-gray-500", children: ["(", test.duration, "ms)"] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => runSingleTest(test.id), className: "ml-auto p-1 text-gray-400 hover:text-blue-600", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 14 }) })] }), test.error && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700", children: test.error }))] }, test.id))), testCases.length === 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-8 text-center text-gray-500", children: "No tests available. Generate some AI tests to get started!" }))] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "h-48 border border-gray-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-2 bg-gray-100 border-b border-gray-200 rounded-t-lg", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h4", { className: "flex items-center gap-2 font-medium text-gray-700", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16 }), "Test Output"] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { ref: testOutputRef, className: "h-36 p-3 overflow-y-auto bg-black text-green-400 font-mono text-sm", children: [testOutput.map((line, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "whitespace-pre-wrap", children: line }, index))), testOutput.length === 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-gray-500", children: "Run tests to see output..." }))] })] })] }));
    const renderCoverageTab = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-4 space-y-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 20, className: "text-blue-600" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-semibold text-blue-900", children: "Code Coverage" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-3xl font-bold text-blue-900", children: [metrics.coverage.toFixed(1), "%"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-sm text-blue-700", children: "Overall Coverage" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Lines" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "font-medium", children: [(metrics.coverage * 0.9).toFixed(1), "%"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Functions" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "font-medium", children: [(metrics.coverage * 0.95).toFixed(1), "%"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Branches" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "font-medium", children: [(metrics.coverage * 0.8).toFixed(1), "%"] })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "mt-3", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300", style: { width: `${metrics.coverage}%` } }) }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "border border-gray-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-3 bg-gray-100 border-b border-gray-200 rounded-t-lg", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { className: "font-medium text-gray-700", children: "Coverage by File" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-4", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-center text-gray-500 py-8", children: "Coverage details will appear here when tests run with coverage enabled." }) })] }), aiSuggestions.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-3 border border-purple-200 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h4", { className: "flex items-center gap-2 font-medium text-purple-800 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 16 }), "AI Coverage Suggestions"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "space-y-2", children: aiSuggestions.map((suggestion, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-2 bg-purple-50 rounded", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-purple-700", children: suggestion.description }), suggestion.confidence && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "inline-block mt-1 px-2 py-0.5 bg-purple-200 text-purple-800 text-xs rounded", children: ["Confidence: ", Math.round(suggestion.confidence * 100), "%"] }))] }, index))) })] }))] }));
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "w-full h-full bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-3 border-b border-gray-200", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { size: 18, className: "text-blue-600" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "font-semibold text-gray-900", children: "AI Debug & Test Panel" }), activeFile && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "ml-auto text-sm text-gray-500 truncate max-w-48", children: activeFile.split('/').pop() }))] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex border-b border-gray-200 bg-gray-50", children: [
                    { id: 'debug', label: 'Debug', icon: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) },
                    { id: 'test', label: 'Live Tests', icon: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) },
                    { id: 'coverage', label: 'Coverage', icon: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide-react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) }
                ].map(({ id, label, icon: Icon }) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: () => setActiveTab(id), className: `flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === id
                        ? 'border-blue-500 text-blue-600 bg-white'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, { size: 16 }), label] }, id))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 overflow-auto", children: [activeTab === 'debug' && renderDebugTab(), activeTab === 'test' && renderTestTab(), activeTab === 'coverage' && renderCoverageTab()] })] }));
};


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
/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/Layout */ "./src/renderer/components/Layout.tsx");
/* harmony import */ var _components_ChatPane__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/ChatPane */ "./src/renderer/components/ChatPane.tsx");
/* harmony import */ var _components_EditorPane__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/EditorPane */ "./src/renderer/components/EditorPane.tsx");
/* harmony import */ var _components_TerminalPane__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/TerminalPane */ "./src/renderer/components/TerminalPane.tsx");
/* harmony import */ var _components_PreviewPane__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/PreviewPane */ "./src/renderer/components/PreviewPane.tsx");
/* harmony import */ var _components_FileExplorer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/FileExplorer */ "./src/renderer/components/FileExplorer.tsx");
/* harmony import */ var _components_StatusBar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/StatusBar */ "./src/renderer/components/StatusBar.tsx");
/* harmony import */ var _components_MenuHandler__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/MenuHandler */ "./src/renderer/components/MenuHandler.tsx");
/* harmony import */ var _contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./contexts/NotificationContext */ "./src/renderer/contexts/NotificationContext.tsx");
/* harmony import */ var _contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./contexts/WorkspaceContext */ "./src/renderer/contexts/WorkspaceContext.tsx");
/* harmony import */ var _contexts_AIContext__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./contexts/AIContext */ "./src/renderer/contexts/AIContext.tsx");
/* harmony import */ var _contexts_RunnerContext__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./contexts/RunnerContext */ "./src/renderer/contexts/RunnerContext.tsx");














const App = () => {
    const [theme, setTheme] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('dark');
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_10__.NotificationProvider, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_11__.WorkspaceProvider, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_contexts_AIContext__WEBPACK_IMPORTED_MODULE_12__.AIProvider, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_contexts_RunnerContext__WEBPACK_IMPORTED_MODULE_13__.RunnerProvider, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "app", "data-theme": theme, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_MenuHandler__WEBPACK_IMPORTED_MODULE_9__.MenuHandler, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_Layout__WEBPACK_IMPORTED_MODULE_2__.Layout, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Layout__WEBPACK_IMPORTED_MODULE_2__.Layout.Sidebar, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_FileExplorer__WEBPACK_IMPORTED_MODULE_7__.FileExplorer, {}) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_Layout__WEBPACK_IMPORTED_MODULE_2__.Layout.Main, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Layout__WEBPACK_IMPORTED_MODULE_2__.Layout.TopPanel, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_ChatPane__WEBPACK_IMPORTED_MODULE_3__.ChatPane, {}) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_Layout__WEBPACK_IMPORTED_MODULE_2__.Layout.MiddlePanel, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_EditorPane__WEBPACK_IMPORTED_MODULE_4__.EditorPane, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_PreviewPane__WEBPACK_IMPORTED_MODULE_6__.PreviewPane, {})] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Layout__WEBPACK_IMPORTED_MODULE_2__.Layout.BottomPanel, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_TerminalPane__WEBPACK_IMPORTED_MODULE_5__.TerminalPane, {}) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_StatusBar__WEBPACK_IMPORTED_MODULE_8__.StatusBar, {})] }) }) }) }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);


/***/ }),

/***/ "./src/renderer/components/ChatPane.tsx":
/*!**********************************************!*\
  !*** ./src/renderer/components/ChatPane.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChatPane: () => (/* binding */ ChatPane)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contexts_AIContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/AIContext */ "./src/renderer/contexts/AIContext.tsx");
/* harmony import */ var _contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contexts/NotificationContext */ "./src/renderer/contexts/NotificationContext.tsx");
/* harmony import */ var _styles_ChatPane_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles/ChatPane.css */ "./src/renderer/styles/ChatPane.css");





const ActionPlanView = ({ plan, onApprove, onReject, onExecute }) => {
    const getRiskColor = (risk) => {
        switch (risk) {
            case 'low': return '#28a745';
            case 'medium': return '#ffc107';
            case 'high': return '#fd7e14';
            case 'critical': return '#dc3545';
            default: return '#6c757d';
        }
    };
    const approvedActions = plan.actions.filter((action) => action.approved);
    const rejectedActions = plan.actions.filter((action) => !action.approved && action.approved !== undefined);
    const pendingActions = plan.actions.filter((action) => action.approved === undefined);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-plan", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "plan-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Action Plan" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "risk-badge", style: { backgroundColor: getRiskColor(plan.risk_assessment) }, children: [plan.risk_assessment.toUpperCase(), " RISK"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "plan-summary", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: plan.summary }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "plan-stats", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Estimated time: ", Math.round(plan.estimated_time / 60), " min"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [plan.actions.length, " action(s)"] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "actions-list", children: plan.actions.map((action) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `action-item ${action.approved === true ? 'approved' : action.approved === false ? 'rejected' : 'pending'}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "action-type", children: action.type }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "action-risk", style: { color: getRiskColor(action.risk_level) }, children: action.risk_level })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "action-description", children: action.description }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "action-preview", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", { children: action.preview }) }), action.approved === undefined && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-buttons", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "approve-btn", onClick: () => onApprove(action.id), children: "Approve" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "reject-btn", onClick: () => onReject(action.id), children: "Reject" })] })), action.approved === true && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "action-status approved", children: "\u2713 Approved" })), action.approved === false && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "action-status rejected", children: "\u2717 Rejected" })), action.executed && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "action-status executed", children: "\uD83D\uDE80 Executed" }))] }, action.id))) }), approvedActions.length > 0 && !plan.actions.every((a) => a.executed) && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "plan-actions", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "execute-plan-btn", onClick: onExecute, children: ["Execute ", approvedActions.length, " Approved Action(s)"] }) }))] }));
};
const ChatPane = () => {
    const { messages, isProcessing, currentModel, availableModels, activePlan, sendMessage, clearConversation, setModel, approveAction, rejectAction, executeApprovedPlan, regenerateResponse } = (0,_contexts_AIContext__WEBPACK_IMPORTED_MODULE_2__.useAI)();
    const { addNotification } = (0,_contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_3__.useNotifications)();
    const [inputValue, setInputValue] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [showModelSelector, setShowModelSelector] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const messagesEndRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const inputRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        scrollToBottom();
    }, [messages]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isProcessing)
            return;
        const message = inputValue.trim();
        setInputValue('');
        try {
            await sendMessage(message);
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Send Message',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };
    const handleModelChange = async (modelName) => {
        setShowModelSelector(false);
        await setModel(modelName);
    };
    const formatTimestamp = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const handlePlanAction = (action, actionId) => {
        if (!activePlan)
            return;
        if (action === 'approve') {
            approveAction(activePlan.id, actionId);
        }
        else {
            rejectAction(activePlan.id, actionId);
        }
    };
    const handleExecutePlan = async () => {
        if (!activePlan)
            return;
        try {
            await executeApprovedPlan(activePlan.id);
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Execute Plan',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "chat-pane", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "chat-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "chat-title", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "AI Assistant" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "model-selector", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "current-model", onClick: () => setShowModelSelector(!showModelSelector), children: [currentModel, " \u25BC"] }), showModelSelector && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "model-dropdown", children: availableModels.map(model => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `model-option ${model === currentModel ? 'active' : ''}`, onClick: () => handleModelChange(model), children: model }, model))) }))] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "chat-actions", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "clear-btn", onClick: clearConversation, title: "Clear conversation", children: "\uD83D\uDDD1\uFE0F" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "messages-container", children: [messages.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "empty-state", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "welcome-message", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Welcome to VSEmbed AI DevTool" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "I'm your AI assistant. I can help you write, debug, and execute code. Just describe what you'd like to build!" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "example-prompts", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setInputValue("Create a React component for a todo list"), children: "Create a React component" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setInputValue("Help me debug this error"), children: "Debug an error" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setInputValue("Set up a new Python project"), children: "Set up a project" })] })] }) })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "messages-list", children: [messages.map((message) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `message ${message.role}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "message-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "message-role", children: [message.role === 'user' ? '👤' : message.role === 'assistant' ? '🤖' : '⚙️', message.role] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "message-time", children: formatTimestamp(message.timestamp) }), message.role === 'assistant' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "regenerate-btn", onClick: () => regenerateResponse(message.id), title: "Regenerate response", children: "\uD83D\uDD04" }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "message-content", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("pre", { children: message.content }) }), message.plan && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ActionPlanView, { plan: message.plan, onApprove: (actionId) => handlePlanAction('approve', actionId), onReject: (actionId) => handlePlanAction('reject', actionId), onExecute: handleExecutePlan }))] }, message.id))), isProcessing && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "message assistant processing", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "message-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "message-role", children: "\uD83E\uDD16 assistant" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "processing-indicator", children: "Thinking..." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "message-content", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "typing-animation", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {})] }) })] }))] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: messagesEndRef })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("form", { className: "chat-input", onSubmit: handleSubmit, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-container", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { ref: inputRef, value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyDown: handleKeyDown, placeholder: "Describe what you'd like to build or ask for help...", disabled: isProcessing, rows: 2 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "submit", disabled: !inputValue.trim() || isProcessing, className: "send-btn", children: isProcessing ? '⏳' : '📤' })] }) })] }));
};


/***/ }),

/***/ "./src/renderer/components/EditorPane.tsx":
/*!************************************************!*\
  !*** ./src/renderer/components/EditorPane.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EditorPane: () => (/* binding */ EditorPane)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/WorkspaceContext */ "./src/renderer/contexts/WorkspaceContext.tsx");
/* harmony import */ var _contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contexts/NotificationContext */ "./src/renderer/contexts/NotificationContext.tsx");
/* harmony import */ var _styles_EditorPane_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles/EditorPane.css */ "./src/renderer/styles/EditorPane.css");





const EditorPane = () => {
    const { currentWorkspace, openFile, saveFile, createFile } = (0,_contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_2__.useWorkspace)();
    const { addNotification } = (0,_contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_3__.useNotifications)();
    const [tabs, setTabs] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [activeTabId, setActiveTabId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [isMonacoLoaded, setIsMonacoLoaded] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [showNewFileDialog, setShowNewFileDialog] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [newFileName, setNewFileName] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const editorRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const monacoEditorRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const electronAPI = window.electronAPI;
    // Load Monaco Editor
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const loadMonaco = async () => {
            try {
                // Check if Monaco is already loaded
                if (window.monaco) {
                    setIsMonacoLoaded(true);
                    return;
                }
                // Load Monaco from CDN
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
                script.onload = () => {
                    const require = window.require;
                    require.config({
                        paths: {
                            vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
                        }
                    });
                    require(['vs/editor/editor.main'], () => {
                        // Configure Monaco for VS Code theme
                        window.monaco.editor.defineTheme('vs-code-dark', {
                            base: 'vs-dark',
                            inherit: true,
                            rules: [],
                            colors: {
                                'editor.background': '#1e1e1e',
                                'editor.foreground': '#d4d4d4',
                                'editor.lineHighlightBackground': '#2d2d30',
                                'editorCursor.foreground': '#d4d4d4',
                                'editor.selectionBackground': '#264f78',
                                'editor.inactiveSelectionBackground': '#3a3d41'
                            }
                        });
                        window.monaco.editor.setTheme('vs-code-dark');
                        setIsMonacoLoaded(true);
                    });
                };
                document.head.appendChild(script);
            }
            catch (error) {
                console.error('Failed to load Monaco:', error);
                addNotification({
                    type: 'error',
                    title: 'Editor Error',
                    message: 'Failed to load code editor',
                });
            }
        };
        loadMonaco();
    }, [addNotification]);
    // Initialize Monaco editor when container is ready
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (!isMonacoLoaded || !editorRef.current || monacoEditorRef.current)
            return;
        try {
            monacoEditorRef.current = window.monaco.editor.create(editorRef.current, {
                value: '// Welcome to VSEmbed AI DevTool\n// Start by opening a file or creating a new one',
                language: 'javascript',
                theme: 'vs-code-dark',
                automaticLayout: true,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineNumbers: 'on',
                renderWhitespace: 'selection',
                wordWrap: 'on',
                folding: true,
                selectOnLineNumbers: true,
                matchBrackets: 'always',
                contextmenu: true,
                mouseWheelZoom: true,
                multiCursorModifier: 'ctrlCmd',
                formatOnPaste: true,
                formatOnType: true,
            });
            // Handle content changes
            monacoEditorRef.current.onDidChangeModelContent(() => {
                if (activeTabId) {
                    setTabs(prevTabs => prevTabs.map(tab => tab.id === activeTabId
                        ? { ...tab, content: monacoEditorRef.current.getValue(), isDirty: true }
                        : tab));
                }
            });
            // Handle save shortcut
            monacoEditorRef.current.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KeyS, () => {
                if (activeTabId) {
                    handleSaveFile(activeTabId);
                }
            });
        }
        catch (error) {
            console.error('Failed to initialize Monaco editor:', error);
            addNotification({
                type: 'error',
                title: 'Editor Error',
                message: 'Failed to initialize code editor',
            });
        }
    }, [isMonacoLoaded, activeTabId, addNotification]);
    // Update editor when active tab changes
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (!monacoEditorRef.current)
            return;
        const activeTab = tabs.find(tab => tab.id === activeTabId);
        if (activeTab) {
            const model = window.monaco.editor.createModel(activeTab.content, activeTab.language, window.monaco.Uri.file(activeTab.path));
            monacoEditorRef.current.setModel(model);
        }
    }, [activeTabId, tabs]);
    const getLanguageFromExtension = (filename) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        const langMap = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'py': 'python',
            'html': 'html',
            'css': 'css',
            'scss': 'scss',
            'sass': 'sass',
            'json': 'json',
            'md': 'markdown',
            'yaml': 'yaml',
            'yml': 'yaml',
            'xml': 'xml',
            'php': 'php',
            'java': 'java',
            'c': 'c',
            'cpp': 'cpp',
            'cs': 'csharp',
            'go': 'go',
            'rs': 'rust',
            'rb': 'ruby',
            'sh': 'shell',
            'sql': 'sql',
        };
        return langMap[ext || ''] || 'plaintext';
    };
    const handleOpenFile = async (filePath) => {
        if (!electronAPI) {
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Electron API not available',
            });
            return;
        }
        try {
            const content = await openFile(filePath);
            const fileName = filePath.split('/').pop() || 'untitled';
            const language = getLanguageFromExtension(fileName);
            const existingTab = tabs.find(tab => tab.path === filePath);
            if (existingTab) {
                setActiveTabId(existingTab.id);
                return;
            }
            const newTab = {
                id: `tab_${Date.now()}`,
                path: filePath,
                name: fileName,
                language,
                content,
                isDirty: false,
                isActive: true,
            };
            setTabs(prevTabs => [...prevTabs, newTab]);
            setActiveTabId(newTab.id);
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Open File',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
    };
    const handleSaveFile = async (tabId) => {
        const tab = tabs.find(t => t.id === tabId);
        if (!tab || !electronAPI)
            return;
        try {
            await saveFile(tab.path, tab.content);
            setTabs(prevTabs => prevTabs.map(t => t.id === tabId ? { ...t, isDirty: false } : t));
            addNotification({
                type: 'success',
                title: 'File Saved',
                message: `${tab.name} saved successfully`,
            });
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Save File',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
    };
    const handleCloseTab = (tabId) => {
        const tab = tabs.find(t => t.id === tabId);
        if (!tab)
            return;
        if (tab.isDirty) {
            const shouldSave = window.confirm(`${tab.name} has unsaved changes. Save before closing?`);
            if (shouldSave) {
                handleSaveFile(tabId);
            }
        }
        setTabs(prevTabs => {
            const newTabs = prevTabs.filter(t => t.id !== tabId);
            // If we're closing the active tab, switch to another tab
            if (tabId === activeTabId) {
                const remainingTabs = newTabs;
                if (remainingTabs.length > 0) {
                    setActiveTabId(remainingTabs[remainingTabs.length - 1].id);
                }
                else {
                    setActiveTabId(null);
                    if (monacoEditorRef.current) {
                        monacoEditorRef.current.setValue('// No files open\n// Use File > New or File > Open to get started');
                    }
                }
            }
            return newTabs;
        });
    };
    const handleNewFile = async () => {
        if (!newFileName.trim())
            return;
        const fileName = newFileName.trim();
        const language = getLanguageFromExtension(fileName);
        const filePath = currentWorkspace ? `${currentWorkspace.path}/${fileName}` : fileName;
        try {
            await createFile(filePath, '');
            const newTab = {
                id: `tab_${Date.now()}`,
                path: filePath,
                name: fileName,
                language,
                content: '',
                isDirty: false,
                isActive: true,
            };
            setTabs(prevTabs => [...prevTabs, newTab]);
            setActiveTabId(newTab.id);
            setShowNewFileDialog(false);
            setNewFileName('');
            addNotification({
                type: 'success',
                title: 'File Created',
                message: `${fileName} created successfully`,
            });
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Create File',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
    };
    const formatFilePath = (path) => {
        if (!currentWorkspace)
            return path;
        return path.replace(currentWorkspace.path + '/', '');
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "editor-pane", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "editor-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "editor-tabs", children: tabs.map(tab => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `editor-tab ${tab.id === activeTabId ? 'active' : ''} ${tab.isDirty ? 'dirty' : ''}`, onClick: () => setActiveTabId(tab.id), title: formatFilePath(tab.path), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tab-name", children: tab.name }), tab.isDirty && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "dirty-indicator", children: "\u25CF" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "tab-close", onClick: (e) => {
                                        e.stopPropagation();
                                        handleCloseTab(tab.id);
                                    }, children: "\u00D7" })] }, tab.id))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "editor-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-btn", onClick: () => setShowNewFileDialog(true), title: "New File", children: "\uD83D\uDCC4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-btn", onClick: () => {
                                    if (electronAPI?.workspace?.openFile) {
                                        electronAPI.workspace.openFile().then((filePath) => {
                                            if (filePath)
                                                handleOpenFile(filePath);
                                        });
                                    }
                                }, title: "Open File", children: "\uD83D\uDCC2" }), activeTabId && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-btn", onClick: () => handleSaveFile(activeTabId), title: "Save File (Ctrl+S)", children: "\uD83D\uDCBE" }))] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "editor-container", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: editorRef, className: "monaco-editor" }), !isMonacoLoaded && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "editor-loading", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "loading-spinner" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Loading editor..." })] }))] }), showNewFileDialog && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "modal-overlay", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Create New File" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "modal-close", onClick: () => {
                                        setShowNewFileDialog(false);
                                        setNewFileName('');
                                    }, children: "\u00D7" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "modal-content", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { children: ["File name:", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: newFileName, onChange: (e) => setNewFileName(e.target.value), onKeyDown: (e) => {
                                            if (e.key === 'Enter') {
                                                handleNewFile();
                                            }
                                            else if (e.key === 'Escape') {
                                                setShowNewFileDialog(false);
                                                setNewFileName('');
                                            }
                                        }, placeholder: "example.js", autoFocus: true })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-footer", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-secondary", onClick: () => {
                                        setShowNewFileDialog(false);
                                        setNewFileName('');
                                    }, children: "Cancel" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-primary", onClick: handleNewFile, disabled: !newFileName.trim(), children: "Create" })] })] }) }))] }));
};


/***/ }),

/***/ "./src/renderer/components/FileExplorer.tsx":
/*!**************************************************!*\
  !*** ./src/renderer/components/FileExplorer.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileExplorer: () => (/* binding */ FileExplorer)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/WorkspaceContext */ "./src/renderer/contexts/WorkspaceContext.tsx");
/* harmony import */ var _contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contexts/NotificationContext */ "./src/renderer/contexts/NotificationContext.tsx");
/* harmony import */ var _styles_FileExplorer_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles/FileExplorer.css */ "./src/renderer/styles/FileExplorer.css");





const FileExplorer = () => {
    const { currentWorkspace, createFile, createDirectory, deleteFile, renameFile } = (0,_contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_2__.useWorkspace)();
    const { addNotification } = (0,_contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_3__.useNotifications)();
    const [fileTree, setFileTree] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [selectedFile, setSelectedFile] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [contextMenu, setContextMenu] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [showNewDialog, setShowNewDialog] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [newItemName, setNewItemName] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [showRenameDialog, setShowRenameDialog] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [renameValue, setRenameValue] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const electronAPI = window.electronAPI;
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (currentWorkspace) {
            loadFileTree();
        }
        else {
            setFileTree([]);
        }
    }, [currentWorkspace]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const handleClickOutside = () => {
            setContextMenu(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);
    const loadFileTree = async () => {
        if (!currentWorkspace || !electronAPI)
            return;
        setIsLoading(true);
        try {
            const tree = await electronAPI.workspace.getFileTree(currentWorkspace.path);
            setFileTree(tree);
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Load Files',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const getFileIcon = (node) => {
        if (node.type === 'directory') {
            return node.expanded ? '📂' : '📁';
        }
        const ext = node.name.split('.').pop()?.toLowerCase();
        const iconMap = {
            'js': '🟨',
            'jsx': '⚛️',
            'ts': '🔷',
            'tsx': '⚛️',
            'py': '🐍',
            'html': '🌐',
            'css': '🎨',
            'scss': '🎨',
            'sass': '🎨',
            'json': '📋',
            'md': '📝',
            'txt': '📄',
            'yaml': '⚙️',
            'yml': '⚙️',
            'xml': '📄',
            'svg': '🖼️',
            'png': '🖼️',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'gif': '🖼️',
            'pdf': '📕',
            'zip': '📦',
            'tar': '📦',
            'gz': '📦',
        };
        return iconMap[ext || ''] || '📄';
    };
    const toggleDirectory = async (path) => {
        setFileTree(prevTree => {
            const updateNode = (nodes) => {
                return nodes.map(node => {
                    if (node.path === path && node.type === 'directory') {
                        return { ...node, expanded: !node.expanded };
                    }
                    if (node.children) {
                        return { ...node, children: updateNode(node.children) };
                    }
                    return node;
                });
            };
            return updateNode(prevTree);
        });
    };
    const handleFileClick = async (node) => {
        if (node.type === 'directory') {
            await toggleDirectory(node.path);
        }
        else {
            setSelectedFile(node.path);
            // Open file in editor
            if (electronAPI?.workspace?.openFile) {
                try {
                    await electronAPI.workspace.openFile(node.path);
                }
                catch (error) {
                    addNotification({
                        type: 'error',
                        title: 'Failed to Open File',
                        message: error instanceof Error ? error.message : 'Unknown error occurred',
                    });
                }
            }
        }
    };
    const handleContextMenu = (e, node) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            target: node,
        });
    };
    const handleNewFile = () => {
        const parentPath = contextMenu?.target.type === 'directory'
            ? contextMenu.target.path
            : currentWorkspace?.path || '';
        setShowNewDialog({ type: 'file', parent: parentPath });
        setContextMenu(null);
    };
    const handleNewFolder = () => {
        const parentPath = contextMenu?.target.type === 'directory'
            ? contextMenu.target.path
            : currentWorkspace?.path || '';
        setShowNewDialog({ type: 'folder', parent: parentPath });
        setContextMenu(null);
    };
    const handleRename = () => {
        if (!contextMenu)
            return;
        setShowRenameDialog({
            path: contextMenu.target.path,
            oldName: contextMenu.target.name,
        });
        setRenameValue(contextMenu.target.name);
        setContextMenu(null);
    };
    const handleDelete = async () => {
        if (!contextMenu)
            return;
        const confirmed = window.confirm(`Are you sure you want to delete "${contextMenu.target.name}"?`);
        if (confirmed) {
            try {
                await deleteFile(contextMenu.target.path);
                await loadFileTree();
                addNotification({
                    type: 'success',
                    title: 'File Deleted',
                    message: `${contextMenu.target.name} deleted successfully`,
                });
            }
            catch (error) {
                addNotification({
                    type: 'error',
                    title: 'Failed to Delete File',
                    message: error instanceof Error ? error.message : 'Unknown error occurred',
                });
            }
        }
        setContextMenu(null);
    };
    const handleCreateItem = async () => {
        if (!showNewDialog || !newItemName.trim())
            return;
        const fullPath = `${showNewDialog.parent}/${newItemName.trim()}`;
        try {
            if (showNewDialog.type === 'file') {
                await createFile(fullPath, '');
            }
            else {
                await createDirectory(fullPath);
            }
            await loadFileTree();
            addNotification({
                type: 'success',
                title: `${showNewDialog.type === 'file' ? 'File' : 'Folder'} Created`,
                message: `${newItemName} created successfully`,
            });
            setShowNewDialog(null);
            setNewItemName('');
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: `Failed to Create ${showNewDialog.type === 'file' ? 'File' : 'Folder'}`,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
    };
    const handleRenameItem = async () => {
        if (!showRenameDialog || !renameValue.trim())
            return;
        const newPath = showRenameDialog.path.replace(showRenameDialog.oldName, renameValue.trim());
        try {
            await renameFile(showRenameDialog.path, newPath);
            await loadFileTree();
            addNotification({
                type: 'success',
                title: 'Item Renamed',
                message: `Renamed to ${renameValue}`,
            });
            setShowRenameDialog(null);
            setRenameValue('');
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Rename Item',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
    };
    const handleRefresh = () => {
        loadFileTree();
    };
    const handleCollapseAll = () => {
        setFileTree(prevTree => {
            const collapseNode = (nodes) => {
                return nodes.map(node => ({
                    ...node,
                    expanded: false,
                    children: node.children ? collapseNode(node.children) : undefined,
                }));
            };
            return collapseNode(prevTree);
        });
    };
    const formatFileSize = (bytes) => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
    };
    const renderFileNode = (node, depth = 0) => {
        const isSelected = selectedFile === node.path;
        const paddingLeft = depth * 16 + 8;
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `file-node ${isSelected ? 'selected' : ''} ${node.type}`, style: { paddingLeft }, onClick: () => handleFileClick(node), onContextMenu: (e) => handleContextMenu(e, node), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "file-icon", children: getFileIcon(node) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "file-name", children: node.name }), node.size !== undefined && node.type === 'file' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "file-size", children: formatFileSize(node.size) }))] }), node.type === 'directory' && node.expanded && node.children && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "directory-children", children: node.children.map(child => renderFileNode(child, depth + 1)) }))] }, node.path));
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "file-explorer", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "explorer-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "explorer-title", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Explorer" }), currentWorkspace && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "workspace-name", children: currentWorkspace.name }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "explorer-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-btn", onClick: handleRefresh, title: "Refresh", disabled: isLoading, children: isLoading ? '⏳' : '🔄' }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-btn", onClick: handleCollapseAll, title: "Collapse All", children: "\uD83D\uDCC1" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-btn", onClick: () => setShowNewDialog({ type: 'file', parent: currentWorkspace?.path || '' }), title: "New File", children: "\uD83D\uDCC4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-btn", onClick: () => setShowNewDialog({ type: 'folder', parent: currentWorkspace?.path || '' }), title: "New Folder", children: "\uD83D\uDCC1" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "file-tree", children: isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "loading-state", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "loading-spinner" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Loading files..." })] })) : fileTree.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "empty-state", children: currentWorkspace ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "No files found in workspace" })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Open a workspace to explore files" })) })) : (fileTree.map(node => renderFileNode(node))) }), contextMenu && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "context-menu", style: { left: contextMenu.x, top: contextMenu.y }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: handleNewFile, children: "\uD83D\uDCC4 New File" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: handleNewFolder, children: "\uD83D\uDCC1 New Folder" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "menu-separator" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: handleRename, children: "\u270F\uFE0F Rename" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: handleDelete, className: "danger", children: "\uD83D\uDDD1\uFE0F Delete" })] })), showNewDialog && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "modal-overlay", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h3", { children: ["Create New ", showNewDialog.type === 'file' ? 'File' : 'Folder'] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "modal-close", onClick: () => {
                                        setShowNewDialog(null);
                                        setNewItemName('');
                                    }, children: "\u00D7" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "modal-content", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { children: ["Name:", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: newItemName, onChange: (e) => setNewItemName(e.target.value), onKeyDown: (e) => {
                                            if (e.key === 'Enter') {
                                                handleCreateItem();
                                            }
                                            else if (e.key === 'Escape') {
                                                setShowNewDialog(null);
                                                setNewItemName('');
                                            }
                                        }, placeholder: showNewDialog.type === 'file' ? 'example.js' : 'new-folder', autoFocus: true })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-footer", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-secondary", onClick: () => {
                                        setShowNewDialog(null);
                                        setNewItemName('');
                                    }, children: "Cancel" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-primary", onClick: handleCreateItem, disabled: !newItemName.trim(), children: "Create" })] })] }) })), showRenameDialog && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "modal-overlay", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Rename Item" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "modal-close", onClick: () => {
                                        setShowRenameDialog(null);
                                        setRenameValue('');
                                    }, children: "\u00D7" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "modal-content", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { children: ["New name:", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: renameValue, onChange: (e) => setRenameValue(e.target.value), onKeyDown: (e) => {
                                            if (e.key === 'Enter') {
                                                handleRenameItem();
                                            }
                                            else if (e.key === 'Escape') {
                                                setShowRenameDialog(null);
                                                setRenameValue('');
                                            }
                                        }, autoFocus: true })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-footer", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-secondary", onClick: () => {
                                        setShowRenameDialog(null);
                                        setRenameValue('');
                                    }, children: "Cancel" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-primary", onClick: handleRenameItem, disabled: !renameValue.trim() || renameValue === showRenameDialog.oldName, children: "Rename" })] })] }) }))] }));
};


/***/ }),

/***/ "./src/renderer/components/Layout.tsx":
/*!********************************************!*\
  !*** ./src/renderer/components/Layout.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Layout: () => (/* binding */ Layout)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _MenuHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MenuHandler */ "./src/renderer/components/MenuHandler.tsx");
/* harmony import */ var _ChatPane__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ChatPane */ "./src/renderer/components/ChatPane.tsx");
/* harmony import */ var _EditorPane__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./EditorPane */ "./src/renderer/components/EditorPane.tsx");
/* harmony import */ var _TerminalPane__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TerminalPane */ "./src/renderer/components/TerminalPane.tsx");
/* harmony import */ var _PreviewPane__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./PreviewPane */ "./src/renderer/components/PreviewPane.tsx");
/* harmony import */ var _FileExplorer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./FileExplorer */ "./src/renderer/components/FileExplorer.tsx");
/* harmony import */ var _StatusBar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./StatusBar */ "./src/renderer/components/StatusBar.tsx");
/* harmony import */ var _ModelSettings__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ModelSettings */ "./src/renderer/components/ModelSettings.tsx");
/* harmony import */ var _PermissionRequestDialog__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./PermissionRequestDialog */ "./src/renderer/components/PermissionRequestDialog.tsx");
/* harmony import */ var _styles_Layout_css__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../styles/Layout.css */ "./src/renderer/styles/Layout.css");












const Layout = ({ children }) => {
    const [sidebarVisible, setSidebarVisible] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [terminalVisible, setTerminalVisible] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [previewVisible, setPreviewVisible] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [chatVisible, setChatVisible] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [showModelSettings, setShowModelSettings] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const handleViewToggle = (view) => {
        switch (view) {
            case 'sidebar':
                setSidebarVisible(!sidebarVisible);
                break;
            case 'terminal':
                setTerminalVisible(!terminalVisible);
                break;
            case 'preview':
                setPreviewVisible(!previewVisible);
                break;
            case 'chat':
                setChatVisible(!chatVisible);
                break;
            case 'settings':
                setShowModelSettings(true);
                break;
        }
    };
    const handlePanelToggle = (panel) => {
        switch (panel) {
            case 'problems':
                // TODO: Implement problems panel
                break;
            case 'notifications':
                // TODO: Implement notifications panel
                break;
            case 'terminal':
                setTerminalVisible(!terminalVisible);
                break;
            case 'output':
                // TODO: Implement output panel
                break;
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_PermissionRequestDialog__WEBPACK_IMPORTED_MODULE_10__.PermissionRequestManager, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "layout", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_MenuHandler__WEBPACK_IMPORTED_MODULE_2__.MenuHandler, { onViewToggle: handleViewToggle }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "main-content", children: [sidebarVisible && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "sidebar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_FileExplorer__WEBPACK_IMPORTED_MODULE_7__.FileExplorer, {}) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "editor-area", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "editor-container", children: [chatVisible && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "chat-panel", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ChatPane__WEBPACK_IMPORTED_MODULE_3__.ChatPane, {}) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "code-editor", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_EditorPane__WEBPACK_IMPORTED_MODULE_4__.EditorPane, {}) })] }), previewVisible && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "preview-panel", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_PreviewPane__WEBPACK_IMPORTED_MODULE_6__.PreviewPane, {}) }))] })] }), terminalVisible && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "terminal-panel", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_TerminalPane__WEBPACK_IMPORTED_MODULE_5__.TerminalPane, {}) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_StatusBar__WEBPACK_IMPORTED_MODULE_8__.StatusBar, { onTogglePanel: handlePanelToggle }), showModelSettings && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ModelSettings__WEBPACK_IMPORTED_MODULE_9__.ModelSettings, { onClose: () => setShowModelSettings(false) }))] }) }));
};


/***/ }),

/***/ "./src/renderer/components/MenuHandler.tsx":
/*!*************************************************!*\
  !*** ./src/renderer/components/MenuHandler.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MenuHandler: () => (/* binding */ MenuHandler)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/WorkspaceContext */ "./src/renderer/contexts/WorkspaceContext.tsx");
/* harmony import */ var _contexts_RunnerContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contexts/RunnerContext */ "./src/renderer/contexts/RunnerContext.tsx");
/* harmony import */ var _contexts_AIContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../contexts/AIContext */ "./src/renderer/contexts/AIContext.tsx");
/* harmony import */ var _contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../contexts/NotificationContext */ "./src/renderer/contexts/NotificationContext.tsx");
/* harmony import */ var _styles_MenuHandler_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../styles/MenuHandler.css */ "./src/renderer/styles/MenuHandler.css");







const MenuHandler = ({ onViewToggle }) => {
    const { currentWorkspace, createWorkspace, openWorkspace, saveWorkspace } = (0,_contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_2__.useWorkspace)();
    const { runStatus, buildProject, startProject, stopProject } = (0,_contexts_RunnerContext__WEBPACK_IMPORTED_MODULE_3__.useRunner)();
    const { clearConversation, setModel, availableModels } = (0,_contexts_AIContext__WEBPACK_IMPORTED_MODULE_4__.useAI)();
    const { addNotification } = (0,_contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_5__.useNotifications)();
    const [activeMenu, setActiveMenu] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [showAbout, setShowAbout] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [showSettings, setShowSettings] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const electronAPI = window.electronAPI;
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const handleKeyDown = (e) => {
            // Handle keyboard shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        handleNewWorkspace();
                        break;
                    case 'o':
                        e.preventDefault();
                        handleOpenWorkspace();
                        break;
                    case 's':
                        e.preventDefault();
                        handleSaveWorkspace();
                        break;
                    case 'r':
                        e.preventDefault();
                        handleRunProject();
                        break;
                    case 'b':
                        e.preventDefault();
                        handleBuildProject();
                        break;
                    case 'q':
                        e.preventDefault();
                        handleQuit();
                        break;
                }
            }
            if (e.key === 'F5') {
                e.preventDefault();
                handleRunProject();
            }
            if (e.key === 'F11') {
                e.preventDefault();
                handleToggleFullscreen();
            }
            if (e.key === 'Escape') {
                setActiveMenu(null);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const handleClickOutside = () => {
            setActiveMenu(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);
    const handleMenuClick = (menuId, e) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === menuId ? null : menuId);
    };
    const handleNewWorkspace = async () => {
        try {
            const name = prompt('Enter workspace name:');
            if (name) {
                await createWorkspace(name, `/tmp/${name}`);
                addNotification({
                    type: 'success',
                    title: 'Workspace Created',
                    message: `Workspace "${name}" created successfully`,
                });
            }
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Create Workspace',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
        setActiveMenu(null);
    };
    const handleOpenWorkspace = async () => {
        try {
            if (electronAPI?.workspace?.selectDirectory) {
                const path = await electronAPI.workspace.selectDirectory();
                if (path) {
                    await openWorkspace(path);
                    addNotification({
                        type: 'success',
                        title: 'Workspace Opened',
                        message: `Opened workspace at ${path}`,
                    });
                }
            }
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Open Workspace',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
        setActiveMenu(null);
    };
    const handleSaveWorkspace = async () => {
        if (!currentWorkspace) {
            addNotification({
                type: 'warning',
                title: 'No Workspace',
                message: 'No workspace is currently open',
            });
            return;
        }
        try {
            await saveWorkspace();
            addNotification({
                type: 'success',
                title: 'Workspace Saved',
                message: 'Workspace saved successfully',
            });
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Failed to Save Workspace',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
        setActiveMenu(null);
    };
    const handleBuildProject = async () => {
        try {
            await buildProject();
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Build Failed',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
        setActiveMenu(null);
    };
    const handleRunProject = async () => {
        try {
            if (runStatus === 'running') {
                await stopProject();
            }
            else {
                await startProject();
            }
        }
        catch (error) {
            addNotification({
                type: 'error',
                title: 'Run Failed',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
        setActiveMenu(null);
    };
    const handleToggleFullscreen = () => {
        if (electronAPI?.window?.toggleFullscreen) {
            electronAPI.window.toggleFullscreen();
        }
        setActiveMenu(null);
    };
    const handleQuit = () => {
        if (electronAPI?.app?.quit) {
            electronAPI.app.quit();
        }
        setActiveMenu(null);
    };
    const fileMenu = [
        {
            id: 'new-workspace',
            label: 'New Workspace',
            icon: '📁',
            shortcut: 'Ctrl+N',
            action: handleNewWorkspace,
        },
        {
            id: 'open-workspace',
            label: 'Open Workspace',
            icon: '📂',
            shortcut: 'Ctrl+O',
            action: handleOpenWorkspace,
        },
        { id: 'sep1', label: '', separator: true },
        {
            id: 'save-workspace',
            label: 'Save Workspace',
            icon: '💾',
            shortcut: 'Ctrl+S',
            disabled: !currentWorkspace,
            action: handleSaveWorkspace,
        },
        { id: 'sep2', label: '', separator: true },
        {
            id: 'quit',
            label: 'Quit',
            icon: '🚪',
            shortcut: 'Ctrl+Q',
            action: handleQuit,
        },
    ];
    const runMenu = [
        {
            id: 'build',
            label: 'Build Project',
            icon: '🔨',
            shortcut: 'Ctrl+B',
            disabled: !currentWorkspace,
            action: handleBuildProject,
        },
        {
            id: 'run',
            label: runStatus === 'running' ? 'Stop Project' : 'Run Project',
            icon: runStatus === 'running' ? '⏹️' : '▶️',
            shortcut: 'F5',
            disabled: !currentWorkspace,
            action: handleRunProject,
        },
    ];
    const viewMenu = [
        {
            id: 'toggle-sidebar',
            label: 'Toggle Sidebar',
            icon: '📋',
            action: () => onViewToggle?.('sidebar'),
        },
        {
            id: 'toggle-terminal',
            label: 'Toggle Terminal',
            icon: '💻',
            action: () => onViewToggle?.('terminal'),
        },
        {
            id: 'toggle-preview',
            label: 'Toggle Preview',
            icon: '👁️',
            action: () => onViewToggle?.('preview'),
        },
        { id: 'sep1', label: '', separator: true },
        {
            id: 'fullscreen',
            label: 'Toggle Fullscreen',
            icon: '🖥️',
            shortcut: 'F11',
            action: handleToggleFullscreen,
        },
    ];
    const aiMenu = [
        {
            id: 'clear-chat',
            label: 'Clear Conversation',
            icon: '🗑️',
            action: () => {
                clearConversation();
                setActiveMenu(null);
            },
        },
        { id: 'sep1', label: '', separator: true },
        {
            id: 'ai-models',
            label: 'AI Models',
            icon: '🧠',
            submenu: availableModels.map(model => ({
                id: `model-${model}`,
                label: model,
                action: () => {
                    setModel(model);
                    setActiveMenu(null);
                },
            })),
        },
    ];
    const helpMenu = [
        {
            id: 'about',
            label: 'About VSEmbed',
            icon: 'ℹ️',
            action: () => {
                setShowAbout(true);
                setActiveMenu(null);
            },
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: '⚙️',
            action: () => {
                setShowSettings(true);
                setActiveMenu(null);
            },
        },
    ];
    const renderMenuItem = (item) => {
        if (item.separator) {
            return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "menu-separator" }, item.id);
        }
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `menu-item ${item.disabled ? 'disabled' : ''}`, onClick: item.disabled ? undefined : item.action, children: [item.icon && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "menu-icon", children: item.icon }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "menu-label", children: item.label }), item.shortcut && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "menu-shortcut", children: item.shortcut }), item.submenu && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "menu-arrow", children: "\u25B6" })] }, item.id));
    };
    const renderMenu = (items) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "menu-dropdown", children: items.map(renderMenuItem) }));
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "menu-bar", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `menu-button ${activeMenu === 'file' ? 'active' : ''}`, onClick: (e) => handleMenuClick('file', e), children: ["File", activeMenu === 'file' && renderMenu(fileMenu)] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `menu-button ${activeMenu === 'run' ? 'active' : ''}`, onClick: (e) => handleMenuClick('run', e), children: ["Run", activeMenu === 'run' && renderMenu(runMenu)] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `menu-button ${activeMenu === 'view' ? 'active' : ''}`, onClick: (e) => handleMenuClick('view', e), children: ["View", activeMenu === 'view' && renderMenu(viewMenu)] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `menu-button ${activeMenu === 'ai' ? 'active' : ''}`, onClick: (e) => handleMenuClick('ai', e), children: ["AI", activeMenu === 'ai' && renderMenu(aiMenu)] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `menu-button ${activeMenu === 'help' ? 'active' : ''}`, onClick: (e) => handleMenuClick('help', e), children: ["Help", activeMenu === 'help' && renderMenu(helpMenu)] })] }), showAbout && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "modal-overlay", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal about-modal", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { children: "About VSEmbed AI DevTool" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "modal-close", onClick: () => setShowAbout(false), children: "\u00D7" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "modal-content", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "about-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "app-icon", children: "\uD83E\uDD16" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "VSEmbed AI DevTool" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "version", children: "Version 1.0.0" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "description", children: "A portable, embeddable developer application where conversational AI agents write, execute, debug, and live-preview user projects inside a VS Code engine with CLI environment integration." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "features", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Features:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "\uD83E\uDD16 AI-powered code generation and debugging" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "\uD83C\uDFD7\uFE0F Integrated VS Code editor with Monaco" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "\uD83D\uDCBB Built-in terminal and command execution" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "\uD83D\uDC41\uFE0F Live preview with multi-device views" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "\uD83D\uDCE6 Portable workspace management" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "\uD83D\uDD12 Secure sandboxed execution environment" })] })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "modal-footer", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-primary", onClick: () => setShowAbout(false), children: "Close" }) })] }) })), showSettings && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "modal-overlay", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal settings-modal", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { children: "Settings" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "modal-close", onClick: () => setShowSettings(false), children: "\u00D7" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "modal-content", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setting-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Editor" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", defaultChecked: true }), "Enable auto-save"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", defaultChecked: true }), "Show line numbers"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox" }), "Enable word wrap"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setting-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "AI Assistant" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { children: ["Auto-approve low-risk actions:", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { children: ["Maximum response length:", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { defaultValue: "medium", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "short", children: "Short" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "medium", children: "Medium" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "long", children: "Long" })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setting-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Terminal" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { children: ["Default shell:", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { defaultValue: "bash", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "bash", children: "Bash" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "zsh", children: "Zsh" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "powershell", children: "PowerShell" })] })] })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-footer", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-secondary", onClick: () => setShowSettings(false), children: "Cancel" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-primary", onClick: () => setShowSettings(false), children: "Save" })] })] }) }))] }));
};


/***/ }),

/***/ "./src/renderer/components/ModelSettings.tsx":
/*!***************************************************!*\
  !*** ./src/renderer/components/ModelSettings.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModelSettings: () => (/* binding */ ModelSettings)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module './ModelSettings.css'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());



const ModelSettings = ({ onClose }) => {
    const [config, setConfig] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        provider: 'openai',
        model: 'gpt-4-1106-preview',
        temperature: 0.7,
        maxTokens: 4096,
        tools: {
            kali: false,
            gcp: true,
            docker: true,
            vscode: {
                fileAccess: true,
                terminal: false,
                extensions: true,
                debugger: false
            }
        },
        permissions: {
            dangerousOperations: false,
            networkAccess: true,
            fileSystemWrite: false
        }
    });
    const [saving, setSaving] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [errors, setErrors] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('model');
    const [recommendations, setRecommendations] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [auditLog, setAuditLog] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        loadConfiguration();
        loadRecommendations();
        loadAuditLog();
    }, []);
    const loadConfiguration = async () => {
        try {
            // In a real implementation, this would load from the configuration manager
            const savedConfig = localStorage.getItem('ai-model-config');
            if (savedConfig) {
                setConfig(JSON.parse(savedConfig));
            }
        }
        catch (error) {
            console.error('Failed to load configuration:', error);
        }
    };
    const loadRecommendations = async () => {
        // Simulate loading extension recommendations
        setRecommendations([
            {
                extensionId: 'esbenp.prettier-vscode',
                reason: 'Code formatting for JavaScript/TypeScript files',
                urgency: 'high',
                category: 'formatting'
            },
            {
                extensionId: 'ms-python.python',
                reason: 'Python language support detected',
                urgency: 'high',
                category: 'language'
            },
            {
                extensionId: 'ms-azuretools.vscode-docker',
                reason: 'Docker configuration found in workspace',
                urgency: 'medium',
                category: 'containerization'
            }
        ]);
    };
    const loadAuditLog = async () => {
        // Simulate loading permission audit log
        setAuditLog([
            {
                id: '1',
                extensionId: 'prettier',
                command: 'format',
                purpose: 'Format code automatically',
                riskLevel: 'low',
                timestamp: Date.now() - 60000,
                approved: true
            },
            {
                id: '2',
                extensionId: 'docker',
                command: 'build',
                purpose: 'Build container image',
                riskLevel: 'medium',
                timestamp: Date.now() - 120000,
                approved: false
            }
        ]);
    };
    const handleSave = async () => {
        setSaving(true);
        setErrors([]);
        try {
            // Validate configuration
            const validationErrors = validateConfig(config);
            if (validationErrors.length > 0) {
                setErrors(validationErrors);
                setSaving(false);
                return;
            }
            // Save configuration
            localStorage.setItem('ai-model-config', JSON.stringify(config));
            // Notify parent components
            window.dispatchEvent(new CustomEvent('configurationUpdated', {
                detail: config
            }));
            setTimeout(() => {
                setSaving(false);
                onClose();
            }, 1000);
        }
        catch (error) {
            setErrors(['Failed to save configuration']);
            setSaving(false);
        }
    };
    const validateConfig = (config) => {
        const errors = [];
        if (!config.apiKey && config.provider !== 'local') {
            errors.push(`API key required for ${config.provider}`);
        }
        if (config.temperature < 0 || config.temperature > 2) {
            errors.push('Temperature must be between 0 and 2');
        }
        if (config.maxTokens < 1 || config.maxTokens > 8192) {
            errors.push('Max tokens must be between 1 and 8192');
        }
        return errors;
    };
    const handleInstallExtension = async (extensionId) => {
        try {
            // In a real implementation, this would trigger extension installation
            console.log(`Installing extension: ${extensionId}`);
            // Remove from recommendations after "installation"
            setRecommendations(prev => prev.filter(rec => rec.extensionId !== extensionId));
        }
        catch (error) {
            console.error(`Failed to install extension ${extensionId}:`, error);
        }
    };
    const renderModelTab = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-tab", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "provider", children: "Model Provider" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { id: "provider", value: config.provider, onChange: (e) => setConfig({
                            ...config,
                            provider: e.target.value
                        }), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "openai", children: "OpenAI" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "anthropic", children: "Anthropic" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "azure", children: "Azure OpenAI" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "local", children: "Local Model" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "model", children: "Model" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { id: "model", type: "text", value: config.model, onChange: (e) => setConfig({ ...config, model: e.target.value }), placeholder: "e.g., gpt-4-1106-preview" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "apiKey", children: "API Key" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { id: "apiKey", type: "password", value: config.apiKey || '', onChange: (e) => setConfig({ ...config, apiKey: e.target.value }), placeholder: "Enter your API key" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { htmlFor: "temperature", children: ["Temperature: ", config.temperature] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { id: "temperature", type: "range", min: "0", max: "2", step: "0.1", value: config.temperature, onChange: (e) => setConfig({
                            ...config,
                            temperature: parseFloat(e.target.value)
                        }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "maxTokens", children: "Max Tokens" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { id: "maxTokens", type: "number", min: "1", max: "8192", value: config.maxTokens, onChange: (e) => setConfig({
                            ...config,
                            maxTokens: parseInt(e.target.value)
                        }) })] })] }));
    const renderToolsTab = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-tab", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tool-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "External Tools" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "checkbox-label", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: config.tools.gcp, onChange: (e) => setConfig({
                                    ...config,
                                    tools: { ...config.tools, gcp: e.target.checked }
                                }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "checkmark" }), "Google Cloud Platform Access", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tool-description", children: "Access GCP APIs and services" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "checkbox-label", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: config.tools.docker, onChange: (e) => setConfig({
                                    ...config,
                                    tools: { ...config.tools, docker: e.target.checked }
                                }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "checkmark" }), "Docker Operations", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tool-description", children: "Build and manage containers" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "checkbox-label danger", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: config.tools.kali, onChange: (e) => setConfig({
                                    ...config,
                                    tools: { ...config.tools, kali: e.target.checked }
                                }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "checkmark" }), "Kali Security Tools", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tool-description", children: "Network scanning and security testing" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tool-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "VS Code Integration" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "checkbox-label", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: config.tools.vscode.fileAccess, onChange: (e) => setConfig({
                                    ...config,
                                    tools: {
                                        ...config.tools,
                                        vscode: { ...config.tools.vscode, fileAccess: e.target.checked }
                                    }
                                }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "checkmark" }), "File System Access", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tool-description", children: "Read and write workspace files" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "checkbox-label", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: config.tools.vscode.extensions, onChange: (e) => setConfig({
                                    ...config,
                                    tools: {
                                        ...config.tools,
                                        vscode: { ...config.tools.vscode, extensions: e.target.checked }
                                    }
                                }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "checkmark" }), "Extension Access", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tool-description", children: "Use installed VS Code extensions" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "checkbox-label danger", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: config.tools.vscode.terminal, onChange: (e) => setConfig({
                                    ...config,
                                    tools: {
                                        ...config.tools,
                                        vscode: { ...config.tools.vscode, terminal: e.target.checked }
                                    }
                                }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "checkmark" }), "Terminal Access", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tool-description", children: "Execute terminal commands" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "checkbox-label", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: config.tools.vscode.debugger, onChange: (e) => setConfig({
                                    ...config,
                                    tools: {
                                        ...config.tools,
                                        vscode: { ...config.tools.vscode, debugger: e.target.checked }
                                    }
                                }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "checkmark" }), "Debugger Access", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tool-description", children: "Start and control debugging sessions" })] })] })] }));
    const renderPermissionsTab = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-tab", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "permission-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Security Permissions" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "checkbox-label danger", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: config.permissions.dangerousOperations, onChange: (e) => setConfig({
                                    ...config,
                                    permissions: { ...config.permissions, dangerousOperations: e.target.checked }
                                }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "checkmark" }), "Dangerous Operations", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tool-description", children: "Allow potentially harmful operations" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "checkbox-label", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: config.permissions.networkAccess, onChange: (e) => setConfig({
                                    ...config,
                                    permissions: { ...config.permissions, networkAccess: e.target.checked }
                                }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "checkmark" }), "Network Access", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tool-description", children: "Make external network requests" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "checkbox-label danger", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: config.permissions.fileSystemWrite, onChange: (e) => setConfig({
                                    ...config,
                                    permissions: { ...config.permissions, fileSystemWrite: e.target.checked }
                                }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "checkmark" }), "File System Write", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tool-description", children: "Modify files outside workspace" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "audit-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Recent Permission Requests" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "audit-log", children: auditLog.map(entry => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `audit-entry ${entry.approved ? 'approved' : 'denied'}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "audit-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "extension-id", children: entry.extensionId }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `risk-level ${entry.riskLevel}`, children: entry.riskLevel }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `status ${entry.approved ? 'approved' : 'denied'}`, children: entry.approved ? '✓' : '✗' })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "audit-details", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "command", children: entry.command }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "purpose", children: entry.purpose }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "timestamp", children: new Date(entry.timestamp).toLocaleString() })] })] }, entry.id))) })] })] }));
    const renderExtensionsTab = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "settings-tab", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "recommendations-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Recommended Extensions" }), recommendations.length > 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "recommendations-list", children: recommendations.map(rec => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `recommendation ${rec.urgency}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "rec-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "extension-name", children: rec.extensionId }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `urgency ${rec.urgency}`, children: rec.urgency })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "rec-reason", children: rec.reason }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "rec-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "install-btn", onClick: () => handleInstallExtension(rec.extensionId), children: "Install" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "dismiss-btn", onClick: () => setRecommendations(prev => prev.filter(r => r.extensionId !== rec.extensionId)), children: "Dismiss" })] })] }, rec.extensionId))) })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "no-recommendations", children: "No extension recommendations at this time." }))] }) }));
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "model-settings-overlay", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "model-settings-dialog", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { children: "AI Model Configuration" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "close-btn", onClick: onClose, children: "\u2715" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-tabs", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `tab ${activeTab === 'model' ? 'active' : ''}`, onClick: () => setActiveTab('model'), children: "Model" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `tab ${activeTab === 'tools' ? 'active' : ''}`, onClick: () => setActiveTab('tools'), children: "Tools" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `tab ${activeTab === 'permissions' ? 'active' : ''}`, onClick: () => setActiveTab('permissions'), children: "Permissions" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `tab ${activeTab === 'extensions' ? 'active' : ''}`, onClick: () => setActiveTab('extensions'), children: "Extensions" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-content", children: [activeTab === 'model' && renderModelTab(), activeTab === 'tools' && renderToolsTab(), activeTab === 'permissions' && renderPermissionsTab(), activeTab === 'extensions' && renderExtensionsTab()] }), errors.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "error-list", children: errors.map((error, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "error-message", children: error }, index))) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-footer", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "cancel-btn", onClick: onClose, children: "Cancel" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "save-btn", onClick: handleSave, disabled: saving, children: saving ? 'Saving...' : 'Save Configuration' })] })] }) }));
};


/***/ }),

/***/ "./src/renderer/components/PermissionRequestDialog.tsx":
/*!*************************************************************!*\
  !*** ./src/renderer/components/PermissionRequestDialog.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PermissionRequestDialog: () => (/* binding */ PermissionRequestDialog),
/* harmony export */   PermissionRequestManager: () => (/* binding */ PermissionRequestManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module './PermissionRequestDialog.css'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());



const PermissionRequestDialog = ({ request, onResponse, onClose }) => {
    const [remember, setRemember] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [timeLeft, setTimeLeft] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(30); // 30 second timeout
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Auto-deny after timeout
                    onResponse(false, remember);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [onResponse, onClose, remember]);
    const handleResponse = (granted) => {
        onResponse(granted, remember);
        onClose();
    };
    const getRiskIcon = (riskLevel) => {
        switch (riskLevel) {
            case 'high': return '⚠️';
            case 'medium': return '⚡';
            case 'low': return 'ℹ️';
            default: return '❓';
        }
    };
    const getRiskColor = (riskLevel) => {
        switch (riskLevel) {
            case 'high': return '#f44336';
            case 'medium': return '#ff9800';
            case 'low': return '#4caf50';
            default: return '#2196f3';
        }
    };
    const getExtensionInfo = (extensionId) => {
        const extensionMap = {
            'prettier': {
                name: 'Prettier',
                description: 'Code formatter for multiple languages'
            },
            'eslint': {
                name: 'ESLint',
                description: 'JavaScript and TypeScript linter'
            },
            'docker': {
                name: 'Docker',
                description: 'Container management and deployment'
            },
            'python': {
                name: 'Python',
                description: 'Python language support and tools'
            },
            'kali-tools': {
                name: 'Kali Security Tools',
                description: 'Network security and penetration testing tools'
            }
        };
        return extensionMap[extensionId] || {
            name: extensionId,
            description: 'Third-party extension'
        };
    };
    const extInfo = getExtensionInfo(request.extensionId);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "permission-request-overlay", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "permission-request-dialog", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "permission-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "permission-icon", style: { color: getRiskColor(request.riskLevel) }, children: getRiskIcon(request.riskLevel) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "permission-title", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Permission Request" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "timeout-indicator", children: ["Auto-deny in ", timeLeft, "s"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "close-btn", onClick: onClose, children: "\u2715" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "permission-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "extension-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "extension-name", children: extInfo.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "extension-id", children: request.extensionId }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "extension-description", children: extInfo.description })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "request-details", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "label", children: "Command:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", { className: "command", children: request.command })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "label", children: "Purpose:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "purpose", children: request.purpose })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "label", children: "Risk Level:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `risk-badge ${request.riskLevel}`, style: { backgroundColor: getRiskColor(request.riskLevel) }, children: request.riskLevel.toUpperCase() })] })] }), request.riskLevel === 'high' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "warning-box", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "warning-icon", children: "\u26A0\uFE0F" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "warning-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "High Risk Operation" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "This operation could potentially modify your system, access sensitive data, or perform actions outside the current workspace. Only approve if you trust this extension and understand the implications." })] })] })), request.riskLevel === 'medium' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "caution-box", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "caution-icon", children: "\u26A1" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "caution-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "Medium Risk Operation" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "This operation will access system resources or perform actions that could affect your development environment. Review the purpose before approving." })] })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "permission-options", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "remember-option", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: remember, onChange: (e) => setRemember(e.target.checked) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "checkmark" }), "Remember this decision for future requests from this extension"] }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "permission-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "deny-btn", onClick: () => handleResponse(false), children: "Deny" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "allow-btn", onClick: () => handleResponse(true), children: "Allow" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "progress-bar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "progress-fill", style: {
                            width: `${(timeLeft / 30) * 100}%`,
                            backgroundColor: getRiskColor(request.riskLevel)
                        } }) })] }) }));
};
const PermissionRequestManager = ({ children }) => {
    const [currentRequest, setCurrentRequest] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const handlePermissionRequest = (event) => {
            const { request, onResponse } = event.detail;
            setCurrentRequest({ request, onResponse });
        };
        window.addEventListener('permissionRequest', handlePermissionRequest);
        return () => {
            window.removeEventListener('permissionRequest', handlePermissionRequest);
        };
    }, []);
    const handleClose = () => {
        if (currentRequest) {
            // Auto-deny if user closes without responding
            currentRequest.onResponse(false, false);
            setCurrentRequest(null);
        }
    };
    const handleResponse = (granted, remember) => {
        if (currentRequest) {
            currentRequest.onResponse(granted, remember);
            setCurrentRequest(null);
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [children, currentRequest && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(PermissionRequestDialog, { request: currentRequest.request, onResponse: handleResponse, onClose: handleClose }))] }));
};


/***/ }),

/***/ "./src/renderer/components/PreviewPane.tsx":
/*!*************************************************!*\
  !*** ./src/renderer/components/PreviewPane.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PreviewPane: () => (/* binding */ PreviewPane)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contexts_RunnerContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/RunnerContext */ "./src/renderer/contexts/RunnerContext.tsx");
/* harmony import */ var _contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contexts/WorkspaceContext */ "./src/renderer/contexts/WorkspaceContext.tsx");
/* harmony import */ var _contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../contexts/NotificationContext */ "./src/renderer/contexts/NotificationContext.tsx");
/* harmony import */ var _styles_PreviewPane_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../styles/PreviewPane.css */ "./src/renderer/styles/PreviewPane.css");






const PreviewPane = () => {
    const { runStatus, previewUrl } = (0,_contexts_RunnerContext__WEBPACK_IMPORTED_MODULE_2__.useRunner)();
    const { currentWorkspace } = (0,_contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_3__.useWorkspace)();
    const { addNotification } = (0,_contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_4__.useNotifications)();
    const [currentMode, setCurrentMode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        id: 'web',
        name: 'Web Preview',
        icon: '🌐',
        url: previewUrl || 'http://localhost:3000',
        refreshable: true,
    });
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [customUrl, setCustomUrl] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [showUrlInput, setShowUrlInput] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [devTools, setDevTools] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [zoomLevel, setZoomLevel] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(100);
    const iframeRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const electronAPI = window.electronAPI;
    const previewModes = [
        {
            id: 'web',
            name: 'Web Preview',
            icon: '🌐',
            url: previewUrl || 'http://localhost:3000',
            refreshable: true,
        },
        {
            id: 'mobile',
            name: 'Mobile View',
            icon: '📱',
            url: previewUrl || 'http://localhost:3000',
            refreshable: true,
        },
        {
            id: 'desktop',
            name: 'Desktop View',
            icon: '🖥️',
            url: previewUrl || 'http://localhost:3000',
            refreshable: true,
        },
        {
            id: 'docs',
            name: 'Documentation',
            icon: '📚',
            url: 'http://localhost:8080/docs',
            refreshable: true,
        },
    ];
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (previewUrl && previewUrl !== currentMode.url) {
            setCurrentMode(prev => ({ ...prev, url: previewUrl }));
        }
    }, [previewUrl, currentMode.url]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // Auto-refresh when project starts running
        if (runStatus === 'running' && currentMode.refreshable) {
            setTimeout(() => {
                handleRefresh();
            }, 2000); // Give the server time to start
        }
    }, [runStatus, currentMode.refreshable]);
    const handleRefresh = () => {
        if (!iframeRef.current)
            return;
        setIsLoading(true);
        setError(null);
        try {
            iframeRef.current.src = iframeRef.current.src;
        }
        catch (err) {
            setError('Failed to refresh preview');
            setIsLoading(false);
        }
    };
    const handleModeChange = (mode) => {
        setCurrentMode(mode);
        setError(null);
        setIsLoading(true);
    };
    const handleCustomUrl = () => {
        if (!customUrl.trim())
            return;
        let url = customUrl.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'http://' + url;
        }
        setCurrentMode({
            id: 'custom',
            name: 'Custom URL',
            icon: '🔗',
            url,
            refreshable: true,
        });
        setShowUrlInput(false);
        setCustomUrl('');
        setError(null);
        setIsLoading(true);
    };
    const handleIframeLoad = () => {
        setIsLoading(false);
        setError(null);
    };
    const handleIframeError = () => {
        setIsLoading(false);
        setError('Failed to load preview. Make sure the server is running.');
    };
    const handleOpenExternal = () => {
        if (electronAPI?.shell) {
            electronAPI.shell.openExternal(currentMode.url);
        }
        else {
            window.open(currentMode.url, '_blank');
        }
    };
    const handleDevTools = () => {
        if (iframeRef.current && electronAPI?.webContents) {
            setDevTools(!devTools);
            // In a real implementation, this would open dev tools for the iframe
            addNotification({
                type: 'info',
                title: 'Developer Tools',
                message: devTools ? 'Developer tools closed' : 'Developer tools opened',
            });
        }
    };
    const handleZoom = (direction) => {
        let newZoom = zoomLevel;
        switch (direction) {
            case 'in':
                newZoom = Math.min(200, zoomLevel + 10);
                break;
            case 'out':
                newZoom = Math.max(50, zoomLevel - 10);
                break;
            case 'reset':
                newZoom = 100;
                break;
        }
        setZoomLevel(newZoom);
        if (iframeRef.current) {
            iframeRef.current.style.transform = `scale(${newZoom / 100})`;
            iframeRef.current.style.transformOrigin = 'top left';
        }
    };
    const getContainerClass = () => {
        switch (currentMode.id) {
            case 'mobile':
                return 'preview-container mobile';
            case 'desktop':
                return 'preview-container desktop';
            default:
                return 'preview-container';
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "preview-pane", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "preview-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "preview-modes", children: previewModes.map(mode => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `mode-btn ${currentMode.id === mode.id ? 'active' : ''}`, onClick: () => handleModeChange(mode), title: mode.name, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "mode-icon", children: mode.icon }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "mode-name", children: mode.name })] }, mode.id))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "preview-controls", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "url-controls", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "url-display", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "url-text", children: currentMode.url }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "url-edit-btn", onClick: () => setShowUrlInput(true), title: "Edit URL", children: "\u270F\uFE0F" })] }), showUrlInput && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "url-input-container", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: customUrl, onChange: (e) => setCustomUrl(e.target.value), onKeyDown: (e) => {
                                                    if (e.key === 'Enter') {
                                                        handleCustomUrl();
                                                    }
                                                    else if (e.key === 'Escape') {
                                                        setShowUrlInput(false);
                                                        setCustomUrl('');
                                                    }
                                                }, placeholder: "http://localhost:3000", autoFocus: true }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: handleCustomUrl, disabled: !customUrl.trim(), children: "Go" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => { setShowUrlInput(false); setCustomUrl(''); }, children: "Cancel" })] }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-controls", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "control-btn", onClick: handleRefresh, disabled: isLoading, title: "Refresh (F5)", children: isLoading ? '⏳' : '🔄' }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "control-btn", onClick: handleOpenExternal, title: "Open in External Browser", children: "\uD83D\uDE80" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "zoom-controls", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "control-btn", onClick: () => handleZoom('out'), disabled: zoomLevel <= 50, title: "Zoom Out", children: "\uD83D\uDD0D\u2796" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "zoom-level", children: [zoomLevel, "%"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "control-btn", onClick: () => handleZoom('in'), disabled: zoomLevel >= 200, title: "Zoom In", children: "\uD83D\uDD0D\u2795" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "control-btn", onClick: () => handleZoom('reset'), title: "Reset Zoom", children: "\uD83C\uDFAF" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `control-btn ${devTools ? 'active' : ''}`, onClick: handleDevTools, title: "Toggle Developer Tools", children: "\uD83D\uDEE0\uFE0F" })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: getContainerClass(), children: error ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "preview-error", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "error-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\uD83D\uDEAB Preview Error" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: error }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "error-suggestions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Troubleshooting:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Make sure your development server is running" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", { children: ["Check if the URL is correct: ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", { children: currentMode.url })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Try starting your project with the Run button" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Check the terminal for any error messages" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "error-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: handleRefresh, className: "retry-btn", children: "\uD83D\uDD04 Retry" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setShowUrlInput(true), className: "change-url-btn", children: "\uD83D\uDD17 Change URL" })] })] }) })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [isLoading && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "preview-loading", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "loading-spinner" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Loading preview..." })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("iframe", { ref: iframeRef, src: currentMode.url, onLoad: handleIframeLoad, onError: handleIframeError, className: "preview-iframe", sandbox: "allow-same-origin allow-scripts allow-forms allow-popups allow-modals", style: {
                                transform: `scale(${zoomLevel / 100})`,
                                transformOrigin: 'top left',
                                width: `${10000 / zoomLevel}%`,
                                height: `${10000 / zoomLevel}%`,
                            } })] })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "preview-status", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "status-left", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: `connection-status ${runStatus}`, children: [runStatus === 'running' && '🟢 Server Running', runStatus === 'stopped' && '🔴 Server Stopped', runStatus === 'error' && '🟡 Server Error'] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "status-right", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "preview-info", children: [currentMode.name, " \u2022 ", currentMode.url] }) })] })] }));
};


/***/ }),

/***/ "./src/renderer/components/StatusBar.tsx":
/*!***********************************************!*\
  !*** ./src/renderer/components/StatusBar.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StatusBar: () => (/* binding */ StatusBar)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/WorkspaceContext */ "./src/renderer/contexts/WorkspaceContext.tsx");
/* harmony import */ var _contexts_RunnerContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contexts/RunnerContext */ "./src/renderer/contexts/RunnerContext.tsx");
/* harmony import */ var _contexts_AIContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../contexts/AIContext */ "./src/renderer/contexts/AIContext.tsx");
/* harmony import */ var _contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../contexts/NotificationContext */ "./src/renderer/contexts/NotificationContext.tsx");
/* harmony import */ var _styles_StatusBar_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../styles/StatusBar.css */ "./src/renderer/styles/StatusBar.css");







const StatusBar = ({ onTogglePanel }) => {
    const { currentWorkspace, isLoading: workspaceLoading } = (0,_contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_2__.useWorkspace)();
    const { runStatus, buildStatus, errors } = (0,_contexts_RunnerContext__WEBPACK_IMPORTED_MODULE_3__.useRunner)();
    const { isProcessing, currentModel } = (0,_contexts_AIContext__WEBPACK_IMPORTED_MODULE_4__.useAI)();
    const { notifications } = (0,_contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_5__.useNotifications)();
    const [currentTime, setCurrentTime] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(new Date());
    const [connectionStatus, setConnectionStatus] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('connected');
    const [memoryUsage, setMemoryUsage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    const [cursorPosition, setCursorPosition] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({ line: 1, column: 1 });
    const electronAPI = window.electronAPI;
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // Monitor system resources
        const checkResources = async () => {
            if (electronAPI?.system) {
                try {
                    const usage = await electronAPI.system.getMemoryUsage();
                    setMemoryUsage(usage.percent);
                }
                catch (error) {
                    console.error('Failed to get memory usage:', error);
                }
            }
        };
        const resourceTimer = setInterval(checkResources, 5000);
        checkResources();
        return () => clearInterval(resourceTimer);
    }, [electronAPI]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // Check connection status periodically
        const checkConnection = async () => {
            try {
                if (electronAPI?.health?.check) {
                    const status = await electronAPI.health.check();
                    setConnectionStatus(status ? 'connected' : 'disconnected');
                }
            }
            catch (error) {
                setConnectionStatus('error');
            }
        };
        const connectionTimer = setInterval(checkConnection, 10000);
        checkConnection();
        return () => clearInterval(connectionTimer);
    }, [electronAPI]);
    const getStatusIcon = (status) => {
        switch (status) {
            case 'running':
                return '🟢';
            case 'stopped':
                return '🔴';
            case 'error':
                return '🟡';
            case 'building':
                return '🔨';
            default:
                return '⚫';
        }
    };
    const getConnectionIcon = () => {
        switch (connectionStatus) {
            case 'connected':
                return '🟢';
            case 'disconnected':
                return '🔴';
            case 'error':
                return '🟡';
        }
    };
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const formatMemory = (percent) => {
        return `${Math.round(percent)}%`;
    };
    const getErrorCount = () => {
        return errors.filter(e => e.severity === 'error').length;
    };
    const getWarningCount = () => {
        return errors.filter(e => e.severity === 'warning').length;
    };
    const getUnreadNotificationCount = () => {
        return notifications.filter(n => !n.read).length;
    };
    const handleStatusClick = (section) => {
        switch (section) {
            case 'errors':
                onTogglePanel?.('problems');
                break;
            case 'notifications':
                onTogglePanel?.('notifications');
                break;
            case 'terminal':
                onTogglePanel?.('terminal');
                break;
            case 'output':
                onTogglePanel?.('output');
                break;
            default:
                break;
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-bar", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-left", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "status-item workspace-status", children: workspaceLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-icon", children: "\u23F3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-text", children: "Loading..." })] })) : currentWorkspace ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-icon", children: "\uD83D\uDCC1" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-text", children: currentWorkspace.name })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-icon", children: "\uD83D\uDCC2" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-text", children: "No Workspace" })] })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-item git-status", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-icon", children: "\uD83C\uDF3F" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-text", children: "main" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-item clickable problems-status", onClick: () => handleStatusClick('errors'), title: "Problems", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-icon", children: "\uD83D\uDEA8" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "status-text", children: [getErrorCount(), " errors, ", getWarningCount(), " warnings"] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-item build-status", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-icon", children: getStatusIcon(buildStatus) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "status-text", children: [buildStatus === 'building' && 'Building...', buildStatus === 'success' && 'Build Ready', buildStatus === 'error' && 'Build Failed', buildStatus === 'idle' && 'Ready'] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "status-separator", children: "|" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-item clickable run-status", onClick: () => handleStatusClick('terminal'), title: "Runtime Status", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-icon", children: getStatusIcon(runStatus) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "status-text", children: [runStatus === 'running' && 'Running', runStatus === 'stopped' && 'Stopped', runStatus === 'error' && 'Error'] })] }), isProcessing && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "status-separator", children: "|" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-item ai-status", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-icon", children: "\uD83E\uDD16" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-text processing", children: "AI Thinking..." })] })] }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-right", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "status-item cursor-position", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "status-text", children: ["Ln ", cursorPosition.line, ", Col ", cursorPosition.column] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "status-separator", children: "|" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-item ai-model", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-icon", children: "\uD83E\uDDE0" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-text", children: currentModel })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "status-separator", children: "|" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-item clickable notifications-status", onClick: () => handleStatusClick('notifications'), title: "Notifications", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-icon", children: "\uD83D\uDD14" }), getUnreadNotificationCount() > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "notification-badge", children: getUnreadNotificationCount() }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "status-item connection-status", title: "Connection Status", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-icon", children: getConnectionIcon() }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-item memory-usage", title: "Memory Usage", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-icon", children: "\uD83D\uDCBE" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-text", children: formatMemory(memoryUsage) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "status-separator", children: "|" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-item time-display", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-icon", children: "\uD83D\uDD52" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-text", children: formatTime(currentTime) })] })] })] }));
};


/***/ }),

/***/ "./src/renderer/components/TerminalPane.tsx":
/*!**************************************************!*\
  !*** ./src/renderer/components/TerminalPane.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TerminalPane: () => (/* binding */ TerminalPane)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contexts_RunnerContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/RunnerContext */ "./src/renderer/contexts/RunnerContext.tsx");
/* harmony import */ var _contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contexts/WorkspaceContext */ "./src/renderer/contexts/WorkspaceContext.tsx");
/* harmony import */ var _contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../contexts/NotificationContext */ "./src/renderer/contexts/NotificationContext.tsx");
/* harmony import */ var _debug_components_DebugTestPanel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../debug/components/DebugTestPanel */ "./src/debug/components/DebugTestPanel.tsx");
/* harmony import */ var _styles_TerminalPane_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../styles/TerminalPane.css */ "./src/renderer/styles/TerminalPane.css");







const TerminalPane = () => {
    const { runStatus, buildStatus, output, executeCommand, buildProject, startProject, stopProject } = (0,_contexts_RunnerContext__WEBPACK_IMPORTED_MODULE_2__.useRunner)();
    const { currentWorkspace } = (0,_contexts_WorkspaceContext__WEBPACK_IMPORTED_MODULE_3__.useWorkspace)();
    const { addNotification } = (0,_contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_4__.useNotifications)();
    const [tabs, setTabs] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([
        {
            id: 'main',
            name: 'Terminal',
            type: 'bash',
            isActive: true,
            history: [
                {
                    id: '1',
                    type: 'system',
                    content: 'Welcome to VSEmbed AI DevTool Terminal',
                    timestamp: new Date(),
                }
            ],
            currentInput: '',
        }
    ]);
    const [activeTabId, setActiveTabId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('main');
    const [commandHistory, setCommandHistory] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [historyIndex, setHistoryIndex] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(-1);
    const [showDebugTestPanel, setShowDebugTestPanel] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const terminalRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const inputRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const electronAPI = window.electronAPI;
    const scrollToBottom = () => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        scrollToBottom();
    }, [tabs, output]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        // Update terminal output when runner output changes
        if (output.length > 0) {
            const activeTab = tabs.find(tab => tab.id === activeTabId);
            if (activeTab) {
                const newMessages = output.map((line, index) => ({
                    id: `output_${Date.now()}_${index}`,
                    type: line.includes('Error:') || line.includes('error:') ? 'error' : 'output',
                    content: line,
                    timestamp: new Date(),
                }));
                setTabs(prevTabs => prevTabs.map(tab => tab.id === activeTabId
                    ? { ...tab, history: [...tab.history, ...newMessages] }
                    : tab));
            }
        }
    }, [output, activeTabId]);
    const getActiveTab = () => tabs.find(tab => tab.id === activeTabId);
    const addMessage = (tabId, message) => {
        const newMessage = {
            ...message,
            id: `msg_${Date.now()}_${Math.random()}`,
            timestamp: new Date(),
        };
        setTabs(prevTabs => prevTabs.map(tab => tab.id === tabId
            ? { ...tab, history: [...tab.history, newMessage] }
            : tab));
    };
    const updateTabInput = (tabId, input) => {
        setTabs(prevTabs => prevTabs.map(tab => tab.id === tabId ? { ...tab, currentInput: input } : tab));
    };
    const executeTerminalCommand = async (command) => {
        const activeTab = getActiveTab();
        if (!activeTab || !electronAPI)
            return;
        // Add command to history
        addMessage(activeTabId, {
            type: 'input',
            content: `$ ${command}`,
        });
        // Update command history
        setCommandHistory(prev => [...prev, command]);
        setHistoryIndex(-1);
        // Clear current input
        updateTabInput(activeTabId, '');
        try {
            // Handle built-in commands
            if (command.startsWith('cd ')) {
                const path = command.substring(3).trim();
                await electronAPI.terminal?.changeDirectory(path);
                addMessage(activeTabId, {
                    type: 'system',
                    content: `Changed directory to: ${path}`,
                });
                return;
            }
            if (command === 'clear') {
                setTabs(prevTabs => prevTabs.map(tab => tab.id === activeTabId
                    ? { ...tab, history: [] }
                    : tab));
                return;
            }
            if (command === 'pwd') {
                const cwd = currentWorkspace?.path || process.cwd();
                addMessage(activeTabId, {
                    type: 'output',
                    content: cwd,
                });
                return;
            }
            // Execute command through runner context
            await executeCommand(command);
        }
        catch (error) {
            addMessage(activeTabId, {
                type: 'error',
                content: `Error: ${error instanceof Error ? error.message : 'Command failed'}`,
            });
        }
    };
    const handleKeyDown = (e) => {
        const activeTab = getActiveTab();
        if (!activeTab)
            return;
        if (e.key === 'Enter') {
            const command = activeTab.currentInput.trim();
            if (command) {
                executeTerminalCommand(command);
            }
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                updateTabInput(activeTabId, commandHistory[newIndex]);
            }
        }
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                const newIndex = historyIndex + 1;
                if (newIndex >= commandHistory.length) {
                    setHistoryIndex(-1);
                    updateTabInput(activeTabId, '');
                }
                else {
                    setHistoryIndex(newIndex);
                    updateTabInput(activeTabId, commandHistory[newIndex]);
                }
            }
        }
        else if (e.key === 'Tab') {
            e.preventDefault();
            // TODO: Implement command completion
        }
    };
    const createNewTab = (type) => {
        const newTab = {
            id: `tab_${Date.now()}`,
            name: type.charAt(0).toUpperCase() + type.slice(1),
            type,
            isActive: false,
            history: [
                {
                    id: '1',
                    type: 'system',
                    content: `${type} terminal ready`,
                    timestamp: new Date(),
                }
            ],
            currentInput: '',
        };
        setTabs(prevTabs => [
            ...prevTabs.map(tab => ({ ...tab, isActive: false })),
            { ...newTab, isActive: true }
        ]);
        setActiveTabId(newTab.id);
    };
    const closeTab = (tabId) => {
        if (tabs.length <= 1)
            return; // Keep at least one tab
        setTabs(prevTabs => {
            const newTabs = prevTabs.filter(tab => tab.id !== tabId);
            // If closing active tab, switch to first remaining tab
            if (tabId === activeTabId && newTabs.length > 0) {
                setActiveTabId(newTabs[0].id);
                newTabs[0].isActive = true;
            }
            return newTabs;
        });
    };
    const switchTab = (tabId) => {
        setTabs(prevTabs => prevTabs.map(tab => ({ ...tab, isActive: tab.id === tabId })));
        setActiveTabId(tabId);
        // Focus input after tab switch
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };
    const getPrompt = (tab) => {
        const cwd = currentWorkspace?.name || 'vsembed';
        switch (tab.type) {
            case 'node':
                return `node:${cwd}> `;
            case 'python':
                return `python:${cwd}> `;
            case 'docker':
                return `docker:${cwd}> `;
            default:
                return `${cwd}$ `;
        }
    };
    const formatTimestamp = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    const activeTab = getActiveTab();
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "terminal-pane", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "terminal-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "terminal-tabs", children: tabs.map(tab => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `terminal-tab ${tab.id === activeTabId ? 'active' : ''}`, onClick: () => switchTab(tab.id), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "tab-icon", children: [tab.type === 'bash' && '🖥️', tab.type === 'node' && '🟢', tab.type === 'python' && '🐍', tab.type === 'docker' && '🐳'] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tab-name", children: tab.name }), tabs.length > 1 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "tab-close", onClick: (e) => {
                                        e.stopPropagation();
                                        closeTab(tab.id);
                                    }, children: "\u00D7" }))] }, tab.id))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "terminal-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "new-terminal-dropdown", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-btn", title: "New Terminal", children: "\u2795" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "dropdown-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => createNewTab('bash'), children: "\uD83D\uDDA5\uFE0F Bash" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => createNewTab('node'), children: "\uD83D\uDFE2 Node.js" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => createNewTab('python'), children: "\uD83D\uDC0D Python" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => createNewTab('docker'), children: "\uD83D\uDC33 Docker" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "runner-controls", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `control-btn ${buildStatus === 'building' ? 'active' : ''}`, onClick: buildProject, disabled: buildStatus === 'building', title: "Build Project", children: "\uD83D\uDD28" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `control-btn ${runStatus === 'running' ? 'active' : ''}`, onClick: runStatus === 'running' ? stopProject : startProject, title: runStatus === 'running' ? 'Stop Project' : 'Start Project', children: runStatus === 'running' ? '⏹️' : '▶️' })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-btn", onClick: () => {
                                    if (activeTab) {
                                        setTabs(prevTabs => prevTabs.map(tab => tab.id === activeTabId
                                            ? { ...tab, history: [] }
                                            : tab));
                                    }
                                }, title: "Clear Terminal", children: "\uD83D\uDDD1\uFE0F" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "terminal-content", ref: terminalRef, children: activeTab && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "terminal-messages", children: [activeTab.history.map(message => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `terminal-message ${message.type}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "message-timestamp", children: formatTimestamp(message.timestamp) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "message-content", children: message.content })] }, message.id))), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "terminal-input-line", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "terminal-prompt", children: getPrompt(activeTab) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { ref: inputRef, type: "text", value: activeTab.currentInput, onChange: (e) => updateTabInput(activeTabId, e.target.value), onKeyDown: handleKeyDown, className: "terminal-input", autoFocus: true, spellCheck: false })] })] })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "terminal-status", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-left", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: `status-indicator ${runStatus}`, children: [runStatus === 'running' && '🟢 Running', runStatus === 'stopped' && '🔴 Stopped', runStatus === 'error' && '🟡 Error'] }), buildStatus === 'building' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-indicator building", children: "\uD83D\uDD28 Building..." }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-right", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: () => setShowDebugTestPanel(!showDebugTestPanel), className: `debug-test-toggle ${showDebugTestPanel ? 'active' : ''}`, title: "Toggle AI Debug & Test Panel", children: [showDebugTestPanel ? '🐛' : '🧪', " Debug & Test"] }), currentWorkspace && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "workspace-info", children: ["\uD83D\uDCC1 ", currentWorkspace.name] }))] })] }), showDebugTestPanel && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "debug-test-panel-container", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_debug_components_DebugTestPanel__WEBPACK_IMPORTED_MODULE_5__.DebugTestPanel, { workspaceRoot: currentWorkspace?.path || '', activeFile: currentWorkspace?.activeFile, onTestRun: (results) => {
                        addNotification({
                            id: Date.now().toString(),
                            type: 'success',
                            message: `Test run completed: ${results.length} tests`,
                            timestamp: new Date()
                        });
                    }, onDebugStart: (session) => {
                        addNotification({
                            id: Date.now().toString(),
                            type: 'info',
                            message: `Debug session started for ${session.file}`,
                            timestamp: new Date()
                        });
                    } }) }))] }));
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
/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles/index.css */ "./src/renderer/styles/index.css");





const container = document.getElementById('root');
if (!container) {
    throw new Error('Root element not found');
}
const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_2__.createRoot)(container);
root.render((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_App__WEBPACK_IMPORTED_MODULE_3__["default"], {}));


/***/ }),

/***/ "./src/renderer/styles/ChatPane.css":
/*!******************************************!*\
  !*** ./src/renderer/styles/ChatPane.css ***!
  \******************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ChatPane_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./ChatPane.css */ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/ChatPane.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ChatPane_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ChatPane_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_ChatPane_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_ChatPane_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/renderer/styles/EditorPane.css":
/*!********************************************!*\
  !*** ./src/renderer/styles/EditorPane.css ***!
  \********************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_EditorPane_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./EditorPane.css */ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/EditorPane.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_EditorPane_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_EditorPane_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_EditorPane_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_EditorPane_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/renderer/styles/FileExplorer.css":
/*!**********************************************!*\
  !*** ./src/renderer/styles/FileExplorer.css ***!
  \**********************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_FileExplorer_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./FileExplorer.css */ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/FileExplorer.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_FileExplorer_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_FileExplorer_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_FileExplorer_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_FileExplorer_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/renderer/styles/Layout.css":
/*!****************************************!*\
  !*** ./src/renderer/styles/Layout.css ***!
  \****************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_Layout_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./Layout.css */ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/Layout.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Layout_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_Layout_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_Layout_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_Layout_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/renderer/styles/MenuHandler.css":
/*!*********************************************!*\
  !*** ./src/renderer/styles/MenuHandler.css ***!
  \*********************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_MenuHandler_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./MenuHandler.css */ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/MenuHandler.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_MenuHandler_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_MenuHandler_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_MenuHandler_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_MenuHandler_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/renderer/styles/PreviewPane.css":
/*!*********************************************!*\
  !*** ./src/renderer/styles/PreviewPane.css ***!
  \*********************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_PreviewPane_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./PreviewPane.css */ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/PreviewPane.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_PreviewPane_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_PreviewPane_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_PreviewPane_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_PreviewPane_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/renderer/styles/StatusBar.css":
/*!*******************************************!*\
  !*** ./src/renderer/styles/StatusBar.css ***!
  \*******************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_StatusBar_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./StatusBar.css */ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/StatusBar.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_StatusBar_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_StatusBar_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_StatusBar_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_StatusBar_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/renderer/styles/TerminalPane.css":
/*!**********************************************!*\
  !*** ./src/renderer/styles/TerminalPane.css ***!
  \**********************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_TerminalPane_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./TerminalPane.css */ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/TerminalPane.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_TerminalPane_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_TerminalPane_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_TerminalPane_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_TerminalPane_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/renderer/styles/index.css":
/*!***************************************!*\
  !*** ./src/renderer/styles/index.css ***!
  \***************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./index.css */ "./node_modules/css-loader/dist/cjs.js!./src/renderer/styles/index.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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