import React, { useState, useEffect, createContext, useContext } from 'react';

export interface Route {
  id: string;
  path: string;
  component: React.ComponentType<any>;
  title: string;
  exact?: boolean;
  guards?: string[];
}

interface RouterContextType {
  currentRoute: string;
  navigate: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

const RouterContext = createContext<RouterContextType | null>(null);

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a Router');
  }
  return context;
};

interface RouterProps {
  routes: Route[];
  defaultRoute?: string;
  children?: React.ReactNode;
}

export const Router: React.FC<RouterProps> = ({ routes, defaultRoute = '/', children }) => {
  const [currentRoute, setCurrentRoute] = useState(defaultRoute);
  const [history, setHistory] = useState<string[]>([defaultRoute]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigate = (path: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentRoute(path);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentRoute(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentRoute(history[newIndex]);
    }
  };

  const getCurrentComponent = () => {
    const route = routes.find(r => r.path === currentRoute);
    if (route) {
      const Component = route.component;
      return <Component />;
    }
    return <div>Route not found: {currentRoute}</div>;
  };

  const routerValue: RouterContextType = {
    currentRoute,
    navigate,
    goBack,
    goForward,
    canGoBack: historyIndex > 0,
    canGoForward: historyIndex < history.length - 1,
  };

  return (
    <RouterContext.Provider value={routerValue}>
      {children}
      {getCurrentComponent()}
    </RouterContext.Provider>
  );
};
