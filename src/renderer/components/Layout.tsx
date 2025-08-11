import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { ActivityBar } from './ActivityBar';
import { SideBar } from './SideBar';
import { EditorPane } from './EditorPane';
import { StatusBar } from './StatusBar';
import '../styles/Layout.css';

export const Layout: React.FC = () => {
  const [sideBarVisible, setSideBarVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);
  const [activityBarVisible, setActivityBarVisible] = useState(true);
  const [statusBarVisible, setStatusBarVisible] = useState(true);
  const [activeView, setActiveView] = useState('explorer');

  const toggleSideBar = () => setSideBarVisible(!sideBarVisible);
  const togglePanel = () => setPanelVisible(!panelVisible);
  const toggleActivityBar = () => setActivityBarVisible(!activityBarVisible);
  const toggleStatusBar = () => setStatusBarVisible(!statusBarVisible);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (!sideBarVisible) {
      setSideBarVisible(true);
    }
  };

  return (
    <div className="layout">
      <TopBar 
        onToggleSideBar={toggleSideBar}
        onTogglePanel={togglePanel}
        sideBarVisible={sideBarVisible}
        panelVisible={panelVisible}
      />
      
      <div className="layout-body">
        {activityBarVisible && (
          <ActivityBar 
            activeView={activeView}
            onViewChange={handleViewChange}
            onToggleSideBar={toggleSideBar}
          />
        )}
        
        <div className="layout-main">
          {sideBarVisible && (
            <SideBar 
              activeView={activeView}
              isVisible={sideBarVisible}
              onToggle={toggleSideBar}
            />
          )}
          
          <div className="layout-content">
            <EditorPane />
            {panelVisible && (
              <div className="panel">
                <div className="panel-header">
                  <span>Terminal</span>
                </div>
                <div className="panel-content">
                  <div>Terminal content goes here</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {statusBarVisible && (
        <StatusBar />
      )}
    </div>
  );
};
