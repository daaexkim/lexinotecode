import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import folderIcon from '../icons/folder.png';
import pageIcon from '../icons/page.png';

const Sidebar = ({ folders, pages, folderPages }) => {
  return (
    <div className="sidebar">
      <h2>FOLDER</h2>
      {folders.map((folder, index) => (
        <div key={index} className="folder">
          <div className="icon">
            <Link to={`/folder/${index + 1}`}>
              <img src={folderIcon} alt="Folder Icon" />
              <span>{folder}</span>
            </Link>
          </div>
          <div className="folder-pages">
            {(folderPages[index] || []).map((folderpage, pageIndex) => (
              <div className="icon small-icon" key={pageIndex}>
                <Link to={`/folder/${index + 1}/folderpage/${pageIndex + 1}`}>
                  <img src={pageIcon} alt="Page Icon" />
                  <span>{folderpage.title}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
      <h2>PAGE</h2>
      {pages.map((page, index) => (
        <div className="icon" key={index}>
          <Link to={`/page/${index + 1}`}>
            <img src={pageIcon} alt="Page Icon" />
            <span>{page}</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

Sidebar.propTypes = {
  folders: PropTypes.array.isRequired,
  pages: PropTypes.array.isRequired,
  folderPages: PropTypes.object.isRequired,
};

export default Sidebar;
