import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AIComponent {
  id: string;
  name: string;
  type: 'widget' | 'panel' | 'modal' | 'inline' | 'overlay';
  component: React.ComponentType<any>;
  category: string;
  dependencies?: string[];
  config?: any;
  position?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
  isResizable?: boolean;
  isDraggable?: boolean;
  zIndex?: number;
}

interface ComponentRegistryContextType {
  components: AIComponent[];
  activeComponents: Set<string>;
  registerComponent: (component: AIComponent) => void;
  unregisterComponent: (componentId: string) => void;
  activateComponent: (componentId: string) => void;
  deactivateComponent: (componentId: string) => void;
  toggleComponent: (componentId: string) => void;
  updateComponentConfig: (componentId: string, config: any) => void;
  getComponent: (componentId: string) => AIComponent | null;
  getComponentsByCategory: (category: string) => AIComponent[];
  isComponentActive: (componentId: string) => boolean;
}

const ComponentRegistryContext = createContext<ComponentRegistryContextType | null>(null);

export const useComponentRegistry = () => {
  const context = useContext(ComponentRegistryContext);
  if (!context) {
    throw new Error('useComponentRegistry must be used within a ComponentRegistry');
  }
  return context;
};

interface ComponentRegistryProps {
  components: AIComponent[];
  activeComponents: Set<string>;
  onToggleComponent: (componentId: string) => void;
  children?: React.ReactNode;
}

export const ComponentRegistry: React.FC<ComponentRegistryProps> = ({
  components: initialComponents,
  activeComponents,
  onToggleComponent,
  children
}) => {
  const [components, setComponents] = useState<AIComponent[]>(initialComponents);
  const [componentConfigs, setComponentConfigs] = useState<Map<string, any>>(new Map());

  const registerComponent = (component: AIComponent) => {
    setComponents(prev => {
      const exists = prev.find(c => c.id === component.id);
      if (exists) {
        return prev.map(c => c.id === component.id ? component : c);
      }
      return [...prev, component];
    });
    console.log(`📦 Registered component: ${component.name} (${component.id})`);
  };

  const unregisterComponent = (componentId: string) => {
    setComponents(prev => prev.filter(c => c.id !== componentId));
    setComponentConfigs(prev => {
      const newConfigs = new Map(prev);
      newConfigs.delete(componentId);
      return newConfigs;
    });
    console.log(`🗑️ Unregistered component: ${componentId}`);
  };

  const activateComponent = (componentId: string) => {
    if (!activeComponents.has(componentId)) {
      onToggleComponent(componentId);
    }
  };

  const deactivateComponent = (componentId: string) => {
    if (activeComponents.has(componentId)) {
      onToggleComponent(componentId);
    }
  };

  const toggleComponent = (componentId: string) => {
    onToggleComponent(componentId);
  };

  const updateComponentConfig = (componentId: string, config: any) => {
    setComponentConfigs(prev => new Map(prev.set(componentId, config)));
    console.log(`⚙️ Updated config for component: ${componentId}`);
  };

  const getComponent = (componentId: string): AIComponent | null => {
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

  const getComponentsByCategory = (category: string): AIComponent[] => {
    return components.filter(c => c.category === category);
  };

  const isComponentActive = (componentId: string): boolean => {
    return activeComponents.has(componentId);
  };

  const contextValue: ComponentRegistryContextType = {
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

  return (
    <ComponentRegistryContext.Provider value={contextValue}>
      {children}
    </ComponentRegistryContext.Provider>
  );
};
