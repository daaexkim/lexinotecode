import React from 'react';
import PropTypes from 'prop-types';
import FolderDetail from './Folders/FolderDetail';
import PageDetail from './Pages/PageDetail';

const MainContent = ({ folders, pages }) => {
  return (
    <div className="main-content">
      <div className="section">
        <h1>Folder</h1>
        <div className="items-grid">
          {folders.map((folder, index) => (
            <div key={index} className="folder-link">
              <FolderDetail name={folder} folderIndex={index} />
            </div>
          ))}
        </div>
      </div>
      <div className="divider"></div>
      <div className="section">
        <h1>Page</h1>
        <div className="items-grid">
          {pages.map((page, index) => (
            <div key={index} className="page-link">
              <PageDetail name={page} pageIndex={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

MainContent.propTypes = {
  folders: PropTypes.array.isRequired,
  pages: PropTypes.array.isRequired,
};

export default MainContent;
