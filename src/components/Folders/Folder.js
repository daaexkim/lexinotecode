import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import pageIcon from '../../icons/page.png'; 
import PropTypes from 'prop-types';
import './Folder.css'; 

const Folder = ({ folderindex, pages, addPage, updateFolderName, initialFolderName, deleteFolder }) => {
  const [folderName, setFolderName] = useState(initialFolderName);
  const navigate = useNavigate(); 

  const addFolderPage = () => {
    addPage(folderindex);
  };

  const handleFolderNameChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleFolderNameBlur = () => {
    updateFolderName(folderindex, folderName);
  };

  const handleDelete = useCallback(() => {
    if (window.confirm("폴더를 삭제하시겠습니까?")) {
      deleteFolder(folderindex);
      navigate('/');
    }
  }, [deleteFolder, folderindex, navigate]);

  return (
    <div className="folder-container">
      <div className="back-button-container">
        <button onClick={() => navigate(-1)} className="back-button">{"<"}</button>
      </div>
      <div className="folder-name-container">
        <input
          type="text"
          value={folderName}
          onChange={handleFolderNameChange}
          onBlur={handleFolderNameBlur}
          className="folder-name-input"
          title="이름을 변경할 수 있습니다"
        />
      </div>
      <div className="add-button-container">
        <button onClick={addFolderPage} className="page-add-button">Add Pages</button>
      </div>
      <div className="pages-container">
        {pages.map((page, index) => (
          <Link key={page.id} to={`/folder/${folderindex + 1}/folderpage/${index + 1}`} className="page-icon">
            <img src={pageIcon} alt="Page Icon" />
            <span>{page.title}</span>
          </Link>
        ))}
      </div>
      <div className="delete-button-container">
        <button onClick={handleDelete} className="delete-button">DELETE</button>
      </div>
    </div>
  );
};

Folder.propTypes = {
  folderindex: PropTypes.number.isRequired,
  pages: PropTypes.array.isRequired,
  addPage: PropTypes.func.isRequired,
  updateFolderName: PropTypes.func.isRequired,
  initialFolderName: PropTypes.string.isRequired,
  deleteFolder: PropTypes.func.isRequired,
};

export default Folder;
