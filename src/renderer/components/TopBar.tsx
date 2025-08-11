import React, { useState, useRef, useEffect } from 'react';
import './TopBar.css';

interface SearchResult {
  type: 'file' | 'symbol' | 'command';
  title: string;
  subtitle?: string;
  path?: string;
  icon?: string;
}

interface TopBarProps {
  onSearchFocus?: () => void;
  onSearchBlur?: () => void;
  onSearchResults?: (results: SearchResult[]) => void;
  onToggleSideBar?: () => void;
  onTogglePanel?: () => void;
  sideBarVisible?: boolean;
  panelVisible?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  onSearchFocus, 
  onSearchBlur, 
  onSearchResults,
  onToggleSideBar,
  onTogglePanel,
  sideBarVisible,
  panelVisible
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Sample search data - in real implementation, this would come from workspace indexing
  const mockSearchData: SearchResult[] = [
    { type: 'file', title: 'main.ts', subtitle: 'src/main', path: 'src/main/main.ts', icon: '📄' },
    { type: 'file', title: 'App.tsx', subtitle: 'src/renderer', path: 'src/renderer/App.tsx', icon: '⚛️' },
    { type: 'file', title: 'TopBar.tsx', subtitle: 'src/renderer/components', path: 'src/renderer/components/TopBar.tsx', icon: '⚛️' },
    { type: 'symbol', title: 'createMainWindow', subtitle: 'function in main.ts', path: 'src/main/main.ts:45', icon: '🔧' },
    { type: 'symbol', title: 'TopBar', subtitle: 'React component', path: 'src/renderer/components/TopBar.tsx:12', icon: '🧩' },
    { type: 'command', title: 'File: New File', subtitle: 'Create a new file', icon: '⚡' },
    { type: 'command', title: 'View: Toggle Side Bar', subtitle: 'Show/hide side bar', icon: '⚡' },
    { type: 'command', title: 'Terminal: Create New Terminal', subtitle: 'Open new terminal', icon: '⚡' },
  ];

  const performSearch = (query: string): SearchResult[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return mockSearchData.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.subtitle?.toLowerCase().includes(lowerQuery)
    ).slice(0, 10); // Limit to 10 results
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    const results = performSearch(value);
    setSearchResults(results);
    setShowResults(value.length > 0 && results.length > 0);
    onSearchResults?.(results);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    onSearchFocus?.();
    if (searchValue.length > 0 && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleSearchBlur = (e: React.FocusEvent) => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => {
      if (!resultsRef.current?.contains(document.activeElement)) {
        setIsSearchFocused(false);
        setShowResults(false);
        onSearchBlur?.();
      }
    }, 150);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'file' && result.path) {
      console.log('Opening file:', result.path);
    } else if (result.type === 'command') {
      console.log('Executing command:', result.title);
    } else if (result.type === 'symbol' && result.path) {
      console.log('Navigating to symbol:', result.path);
    }
    
    setShowResults(false);
    setSearchValue('');
    searchInputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowResults(false);
      setSearchValue('');
      searchInputRef.current?.blur();
    }
  };

  // Window control handlers
  const handleMinimize = () => {
    console.log('Minimize window');
    // TODO: Add to electronAPI
  };

  const handleMaximize = () => {
    console.log('Maximize window');
    // TODO: Add to electronAPI
  };

  const handleClose = () => {
    console.log('Close window');
    // TODO: Add to electronAPI
  };

  const handleToggleSideBar = () => {
    onToggleSideBar?.();
  };

  const handleTogglePanel = () => {
    onTogglePanel?.();
  };

  const handleCustomizeLayout = () => {
    console.log('Customize layout');
    // TODO: Wire up to renderer state
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showResults]);

  return (
    <div className="top-bar">
      {/* Left side - Menu placeholder (native menu handles this) */}
      <div className="top-bar-left">
        <div className="app-logo">
          <span className="logo-icon">🔷</span>
          <span className="logo-text">VSEmbed</span>
        </div>
      </div>

      {/* Center - Search Bar */}
      <div className="top-bar-center">
        <div className="search-container">
          <div className={`search-wrapper ${isSearchFocused ? 'focused' : ''}`}>
            <div className="search-icon">🔍</div>
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search files, symbols, commands..."
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onKeyDown={handleKeyDown}
            />
            {searchValue && (
              <button 
                className="search-clear"
                onClick={() => {
                  setSearchValue('');
                  setShowResults(false);
                  searchInputRef.current?.focus();
                }}
              >
                ✕
              </button>
            )}
          </div>
          
          {showResults && (
            <div ref={resultsRef} className="search-results">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className={`search-result-item ${result.type}`}
                  onClick={() => handleResultClick(result)}
                  tabIndex={0}
                >
                  <div className="result-icon">{result.icon}</div>
                  <div className="result-content">
                    <div className="result-title">{result.title}</div>
                    {result.subtitle && (
                      <div className="result-subtitle">{result.subtitle}</div>
                    )}
                  </div>
                  <div className="result-type">{result.type}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side - Controls */}
      <div className="top-bar-right">
        <div className="layout-controls">
          <button 
            className="control-btn layout-btn"
            onClick={handleCustomizeLayout}
            title="Customize Layout"
          >
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path fill="currentColor" d="M2 2h5v5H2V2zm6 0h6v2H8V2zm0 3h3v4H8V5zm4 0h2v4h-2V5zM2 8h3v6H2V8zm4 0h2v6H6V8zm3 3h5v3H9v-3z"/>
            </svg>
          </button>
          
          <button 
            className="control-btn sidebar-btn"
            onClick={handleToggleSideBar}
            title="Toggle Side Bar (Ctrl+B)"
          >
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path fill="currentColor" d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 1v10h3V3H3zm4 0v10h6V3H7z"/>
            </svg>
          </button>
          
          <button 
            className="control-btn panel-btn"
            onClick={handleTogglePanel}
            title="Toggle Panel (Ctrl+J)"
          >
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path fill="currentColor" d="M2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm0 1v5h12V4H2zm0 6v2h12v-2H2z"/>
            </svg>
          </button>
        </div>

        <div className="window-controls">
          <button 
            className="control-btn minimize-btn"
            onClick={handleMinimize}
            title="Minimize"
          >
            <svg viewBox="0 0 12 12" width="12" height="12">
              <path fill="currentColor" d="M2 6h8v1H2z"/>
            </svg>
          </button>
          
          <button 
            className="control-btn maximize-btn"
            onClick={handleMaximize}
            title="Maximize"
          >
            <svg viewBox="0 0 12 12" width="12" height="12">
              <path fill="currentColor" d="M2 2h8v8H2V2zm1 1v6h6V3H3z"/>
            </svg>
          </button>
          
          <button 
            className="control-btn close-btn"
            onClick={handleClose}
            title="Close"
          >
            <svg viewBox="0 0 12 12" width="12" height="12">
              <path fill="currentColor" d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
