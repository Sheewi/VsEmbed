import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AIPage {
  id: string;
  title: string;
  category: string;
  component: React.ComponentType<any>;
  icon?: string;
  description?: string;
  keywords?: string[];
  isActive?: boolean;
  permissions?: string[];
  metadata?: {
    created: Date;
    modified: Date;
    version: string;
    author?: string;
  };
}

interface AIPageContextType {
  pages: AIPage[];
  currentPage: string;
  searchTerm: string;
  filteredPages: AIPage[];
  navigateToPage: (pageId: string) => void;
  searchPages: (term: string) => void;
  getPagesByCategory: (category: string) => AIPage[];
  getPageMetadata: (pageId: string) => AIPage | null;
  isPageActive: (pageId: string) => boolean;
}

const AIPageContext = createContext<AIPageContextType | null>(null);

export const useAIPages = () => {
  const context = useContext(AIPageContext);
  if (!context) {
    throw new Error('useAIPages must be used within an AIPageProvider');
  }
  return context;
};

interface AIPageProviderProps {
  pages: AIPage[];
  currentPage: string;
  onPageChange: (pageId: string) => void;
  children?: React.ReactNode;
}

export const AIPageProvider: React.FC<AIPageProviderProps> = ({
  pages,
  currentPage,
  onPageChange,
  children
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPages, setFilteredPages] = useState<AIPage[]>(pages);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPages(pages);
    } else {
      const filtered = pages.filter(page =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.keywords?.some(keyword => 
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredPages(filtered);
    }
  }, [searchTerm, pages]);

  const navigateToPage = (pageId: string) => {
    console.log(`🔄 Navigating to page: ${pageId}`);
    onPageChange(pageId);
  };

  const searchPages = (term: string) => {
    setSearchTerm(term);
  };

  const getPagesByCategory = (category: string): AIPage[] => {
    return pages.filter(page => page.category === category);
  };

  const getPageMetadata = (pageId: string): AIPage | null => {
    return pages.find(page => page.id === pageId) || null;
  };

  const isPageActive = (pageId: string): boolean => {
    return currentPage === pageId;
  };

  const contextValue: AIPageContextType = {
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

  return (
    <AIPageContext.Provider value={contextValue}>
      {children}
    </AIPageContext.Provider>
  );
};
