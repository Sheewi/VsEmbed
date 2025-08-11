import React, { useState } from 'react';
import './ActivityBar.css';

interface ActivityBarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onToggleSideBar: () => void;
}

interface ActivityBarItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  badgeCount?: number;
  isActive?: boolean;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  activeView,
  onViewChange,
  onToggleSideBar
}) => {
  const [accounts, setAccounts] = useState<any[]>([]);

  const activityItems: ActivityBarItem[] = [
    {
      id: 'explorer',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
        </svg>
      ),
      title: 'Explorer (Ctrl+Shift+E)',
      isActive: activeView === 'explorer'
    },
    {
      id: 'search',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      ),
      title: 'Search (Ctrl+Shift+F)',
      isActive: activeView === 'search'
    },
    {
      id: 'scm',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M5.41 21L6.12 17H2.12l.71 4H5.41zM7.88 17l.71 4h2.58l-.71-4H7.88zM15 9V7.5c0-.83-.67-1.5-1.5-1.5S12 6.67 12 7.5V9c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1zm-1 0h-1V7.5c0-.28.22-.5.5-.5s.5.22.5.5V9z"/>
        </svg>
      ),
      title: 'Source Control (Ctrl+Shift+G)',
      badgeCount: 3,
      isActive: activeView === 'scm'
    },
    {
      id: 'debug',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M20,8H17.19C16.74,7.22 16.12,6.55 15.37,6.04L17,4.41L15.59,3L13.42,5.17C12.96,5.06 12.49,5 12,5C11.51,5 11.04,5.06 10.59,5.17L8.41,3L7,4.41L8.62,6.04C7.88,6.55 7.26,7.22 6.81,8H4V10H6.09C6.04,10.33 6,10.66 6,11V12H4V14H6V15C6,15.34 6.04,15.67 6.09,16H4V18H6.81C7.85,19.79 9.78,21 12,21C14.22,21 16.15,19.79 17.19,18H20V16H17.91C17.96,15.67 18,15.34 18,15V14H20V12H18V11C18,10.66 17.96,10.33 17.91,10H20V8M16,15A4,4 0 0,1 12,19A4,4 0 0,1 8,15V11A4,4 0 0,1 12,7A4,4 0 0,1 16,11V15Z"/>
        </svg>
      ),
      title: 'Run and Debug (Ctrl+Shift+D)',
      isActive: activeView === 'debug'
    },
    {
      id: 'extensions',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3"/>
        </svg>
      ),
      title: 'Extensions (Ctrl+Shift+X)',
      isActive: activeView === 'extensions'
    },
    {
      id: 'testing',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M20 6L14 6L10.5 9.5L9.5 8.5L8 10L12 14L16 10L14.5 8.5L13.5 9.5L20 6ZM18 16H6V6H18V16ZM18 4H6C4.89 4 4 4.89 4 6V18C4 19.11 4.89 20 6 20H18C19.11 20 20 19.11 20 18V6C20 4.89 19.11 4 18 4Z"/>
        </svg>
      ),
      title: 'Testing',
      isActive: activeView === 'testing'
    },
    {
      id: 'remote',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M21.71 11.29l-9-9a.996.996 0 00-1.41 0l-9 9C2.11 11.48 2 11.74 2 12c0 .55.45 1 1 1h2v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-4h4v4c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h2c.55 0 1-.45 1-1 0-.26-.11-.52-.29-.71z"/>
        </svg>
      ),
      title: 'Remote Explorer',
      isActive: activeView === 'remote'
    },
    {
      id: 'bookmarks',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z"/>
        </svg>
      ),
      title: 'Bookmarks',
      isActive: activeView === 'bookmarks'
    },
    {
      id: 'project-manager',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M16,20H20V16H16M16,14H20V10H16M10,8H14V4H10M16,8H20V4H16M10,14H14V10H10M4,14H8V10H4M4,20H8V16H4M10,20H14V16H10M4,8H8V4H4V8Z"/>
        </svg>
      ),
      title: 'Project Manager',
      isActive: activeView === 'project-manager'
    }
  ];

  const bottomItems = [
    {
      id: 'accounts',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
        </svg>
      ),
      title: accounts.length > 0 ? 'Accounts: Sign Out' : 'Accounts: Sign In',
      isActive: activeView === 'accounts'
    },
    {
      id: 'settings',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
        </svg>
      ),
      title: 'Manage (Ctrl+,)',
      isActive: activeView === 'settings'
    }
  ];

  const handleItemClick = (item: any) => {
    if (item.id === activeView) {
      // Toggle sidebar if clicking the same view
      onToggleSideBar();
    } else {
      onViewChange(item.id);
    }
  };

  return (
    <div className="activity-bar">
      <div className="activity-bar-top">
        {activityItems.map((item) => (
          <div
            key={item.id}
            className={`activity-bar-item ${item.isActive ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
            title={item.title}
            role="button"
            tabIndex={0}
          >
            <div className="activity-bar-icon">
              {item.icon}
              {item.badgeCount && (
                <span className="activity-badge">{item.badgeCount}</span>
              )}
            </div>
            {item.isActive && <div className="activity-bar-indicator" />}
          </div>
        ))}
      </div>

      <div className="activity-bar-bottom">
        {bottomItems.map((item) => (
          <div
            key={item.id}
            className={`activity-bar-item ${item.isActive ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
            title={item.title}
            role="button"
            tabIndex={0}
          >
            <div className="activity-bar-icon">
              {item.icon}
            </div>
            {item.isActive && <div className="activity-bar-indicator" />}
          </div>
        ))}
      </div>
    </div>
  );
};
