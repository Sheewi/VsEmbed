import React from 'react';

export const ProjectExplorer: React.FC = () => {
  return (
    <div className="project-explorer">
      <h3>🗂️ Project Explorer</h3>
      <div className="explorer-content">
        <div className="project-tree">
          <div className="tree-item">📁 src/</div>
          <div className="tree-item">📄 package.json</div>
          <div className="tree-item">📄 README.md</div>
        </div>
      </div>
    </div>
  );
};
