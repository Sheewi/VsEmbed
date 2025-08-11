import React, { useState, useRef } from 'react';
import './SearchPanel.css';

interface SearchResult {
  file: string;
  line: number;
  column: number;
  preview: string;
  match: string;
}

export const SearchPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [matchWholeWord, setMatchWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [includePattern, setIncludePattern] = useState('');
  const [excludePattern, setExcludePattern] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const performSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      // Mock search results - in real implementation, this would use the workspace search
      const mockResults: SearchResult[] = [
        {
          file: 'src/components/App.tsx',
          line: 45,
          column: 12,
          preview: '  const [searchTerm, setSearchTerm] = useState("");',
          match: searchTerm
        },
        {
          file: 'src/utils/helpers.ts',
          line: 23,
          column: 8,
          preview: 'function searchInFile(term: string) {',
          match: searchTerm
        }
      ];

      setTimeout(() => {
        setResults(mockResults);
        setIsSearching(false);
      }, 500);
    } catch (error) {
      console.error('Search failed:', error);
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      performSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    searchInputRef.current?.focus();
  };

  return (
    <div className="search-panel">
      <div className="search-inputs">
        <div className="search-input-container">
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <button className="clear-search" onClick={clearSearch}>
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"/>
              </svg>
            </button>
          )}
        </div>

        <div className="search-toggles">
          <button 
            className="toggle-replace"
            onClick={() => setShowReplace(!showReplace)}
            title="Toggle Replace"
          >
            <svg viewBox="0 0 16 16" width="16" height="16">
              <path fill="currentColor" d="M13.5 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V3.914L3.914 12.5H6.5a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 1 0v2.586L11.586 3H9.5a.5.5 0 0 1 0-1h4z"/>
            </svg>
          </button>
        </div>

        {showReplace && (
          <div className="replace-input-container">
            <input
              type="text"
              className="replace-input"
              placeholder="Replace"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
            />
          </div>
        )}

        <div className="search-options">
          <button 
            className={`search-option ${matchCase ? 'active' : ''}`}
            onClick={() => setMatchCase(!matchCase)}
            title="Match Case"
          >
            Aa
          </button>
          <button 
            className={`search-option ${matchWholeWord ? 'active' : ''}`}
            onClick={() => setMatchWholeWord(!matchWholeWord)}
            title="Match Whole Word"
          >
            <svg viewBox="0 0 16 16" width="16" height="16">
              <path fill="currentColor" d="M4 2v12h1V8.5h1.5V14h1V8.5H9V14h1V8.5h1.5V14h1V2H4zm1 1h6v4.5H9V6H7.5v1.5H6V6H5V3z"/>
            </svg>
          </button>
          <button 
            className={`search-option ${useRegex ? 'active' : ''}`}
            onClick={() => setUseRegex(!useRegex)}
            title="Use Regular Expression"
          >
            .*
          </button>
        </div>

        <div className="search-filters">
          <input
            type="text"
            className="filter-input"
            placeholder="files to include"
            value={includePattern}
            onChange={(e) => setIncludePattern(e.target.value)}
          />
          <input
            type="text"
            className="filter-input"
            placeholder="files to exclude"
            value={excludePattern}
            onChange={(e) => setExcludePattern(e.target.value)}
          />
        </div>

        <div className="search-actions">
          <button 
            className="search-button"
            onClick={performSearch}
            disabled={!searchTerm.trim() || isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          {showReplace && (
            <>
              <button className="replace-button">
                Replace
              </button>
              <button className="replace-all-button">
                Replace All
              </button>
            </>
          )}
        </div>
      </div>

      <div className="search-results">
        {isSearching && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <span>Searching...</span>
          </div>
        )}

        {!isSearching && results.length > 0 && (
          <div className="results-header">
            <span>{results.length} result{results.length !== 1 ? 's' : ''} in {new Set(results.map(r => r.file)).size} file{new Set(results.map(r => r.file)).size !== 1 ? 's' : ''}</span>
          </div>
        )}

        {results.length > 0 && (
          <div className="results-list">
            {results.map((result, index) => (
              <div key={index} className="search-result">
                <div className="result-file">
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <path fill="currentColor" d="M13.71 4.29l-3-3L10 1H4L3 2v12l1 1h9l1-1V5l-.29-.71zM10 2.41L12.59 5H10V2.41zM13 14H4V3h5v3l1 1h3v7z"/>
                  </svg>
                  <span>{result.file}</span>
                </div>
                <div className="result-match">
                  <span className="line-number">{result.line}:</span>
                  <span className="preview">{result.preview}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isSearching && searchTerm && results.length === 0 && (
          <div className="no-results">
            No results found for "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};
