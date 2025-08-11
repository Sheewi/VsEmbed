/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/renderer/index.tsx":
/*!********************************!*\
  !*** ./src/renderer/index.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
// Working React + VS Code Interface
console.log('🎯 Starting VS Code interface...');
// First ensure JavaScript is working
document.title = 'VSEmbed - Loading React...';
// Import React properly


// Wait for DOM
function initApp() {
    console.log('📦 Initializing React app...');
    const container = document.getElementById('root') || document.body;
    // Clear existing content
    container.innerHTML = '<div id="react-root"></div>';
    const reactContainer = document.getElementById('react-root');
    const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(reactContainer);
    // VS Code Layout Component
    const VSCodeLayout = () => {
        const [sideBarVisible, setSideBarVisible] = react__WEBPACK_IMPORTED_MODULE_0__.useState(true);
        const [panelVisible, setPanelVisible] = react__WEBPACK_IMPORTED_MODULE_0__.useState(true);
        const [activeView, setActiveView] = react__WEBPACK_IMPORTED_MODULE_0__.useState('explorer');
        console.log('🎨 Rendering VS Code layout...');
        return react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
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
            react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
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
                react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
                    key: 'logo',
                    style: { display: 'flex', alignItems: 'center', gap: '8px' }
                }, [
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement('span', { key: 'icon', style: { fontSize: '16px' } }, '🔷'),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement('span', { key: 'text', style: { fontWeight: '500' } }, 'VSEmbed')
                ]),
                // Center: Search Bar
                react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
                    key: 'search',
                    style: {
                        flex: '1',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '0 16px'
                    }
                }, react__WEBPACK_IMPORTED_MODULE_0__.createElement('input', {
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
                react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
                    key: 'controls',
                    style: { display: 'flex', gap: '4px' }
                }, [
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement('button', {
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
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement('button', {
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
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement('button', {
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
            react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
                key: 'main',
                style: {
                    display: 'flex',
                    flex: '1',
                    overflow: 'hidden'
                }
            }, [
                // Activity Bar
                react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
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
                ].map(([icon, id, title]) => react__WEBPACK_IMPORTED_MODULE_0__.createElement('button', {
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
                }, icon))),
                // Side Bar
                sideBarVisible && react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
                    key: 'sidebar',
                    style: {
                        width: '300px',
                        background: '#252526',
                        borderRight: '1px solid #3c3c3c',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }, [
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
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
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
                        key: 'content',
                        style: {
                            flex: '1',
                            padding: '16px',
                            overflow: 'auto'
                        }
                    }, `${activeView} panel content - Working!`)
                ]),
                // Editor Area
                react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
                    key: 'editor',
                    style: {
                        flex: '1',
                        background: '#1e1e1e',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }, [
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
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
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
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
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement('h1', {
                            key: 'title',
                            style: { color: '#4CAF50', margin: '0' }
                        }, '🎉 VS Code Interface Working!'),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement('p', {
                            key: 'desc',
                            style: { textAlign: 'center', margin: '0' }
                        }, 'You now have: Search bar (center), Panel toggles (right), Activity bar (left), Side panels!')
                    ])
                ])
            ]),
            // Bottom Panel
            panelVisible && react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
                key: 'panel',
                style: {
                    height: '200px',
                    background: '#181818',
                    borderTop: '1px solid #3c3c3c',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }, [
                react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
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
                react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
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
            react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
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
                react__WEBPACK_IMPORTED_MODULE_0__.createElement('span', { key: 'left' }, 'Ready'),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement('span', { key: 'right' }, 'VS Code Interface Active')
            ])
        ]);
    };
    console.log('🚀 Rendering VS Code interface...');
    root.render(react__WEBPACK_IMPORTED_MODULE_0__.createElement(VSCodeLayout));
    console.log('✅ VS Code interface rendered successfully!');
}
// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
}
else {
    initApp();
}
console.log('🏁 VS Code interface setup complete');


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