import React, { useState, useCallback, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Page from './components/Pages/Page';
import Folder from './components/Folders/Folder';
import FolderPage from './components/Folders/FolderPage';
import LoginPage from './components/LoginPage';

function App() {
  const [folders, setFolders] = useState(JSON.parse(localStorage.getItem('folders')) || []);
  const [pages, setPages] = useState(JSON.parse(localStorage.getItem('pages')) || []);
  const [folderPages, setFolderPages] = useState(JSON.parse(localStorage.getItem('folderPages')) || {});
  const [showOptions, setShowOptions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingSave, setPendingSave] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('pages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('folderPages', JSON.stringify(folderPages));
  }, [folderPages]);

  const addFolder = () => {
    const newFolder = `Folder ${folders.length + 1}`;
    setFolders([...folders, newFolder]);
    setFolderPages(prev => ({ ...prev, [folders.length]: [] }));
  };

  const addPage = (folderIndex) => {
    const newPage = { id: pages.length + 1, title: `Page ${pages.length + 1}`, content: "", folderIndex: folderIndex };
    setPages([...pages, newPage]);
  };

  const addFolderPage = (folderIndex) => {
    const newPage = { id: (folderPages[folderIndex]?.length || 0) + 1, title: `Page ${(folderPages[folderIndex]?.length || 0) + 1}`, content: "" };
    setFolderPages(prev => ({
      ...prev,
      [folderIndex]: [...(prev[folderIndex] || []), newPage]
    }));
  };

  const updateFolderPage = (folderIndex, pageIndex, newPage) => {
    setFolderPages(prev => ({
      ...prev,
      [folderIndex]: prev[folderIndex].map((page, i) => (i === pageIndex ? newPage : page))
    }));
  };

  const updateFolderName = useCallback((index, newName) => {
    const updatedFolders = folders.map((folder, i) =>
      i === index ? newName : folder
    );
    setFolders(updatedFolders);
  }, [folders]);

  const updatePage = useCallback((index, newPage) => {
    const updatedPages = pages.map((page, i) =>
      i === index ? newPage : page
    );
    setPages(updatedPages);
  }, [pages]);

  const deletePage = useCallback((index) => {
    const updatedPages = pages.filter((_, i) => i !== index);
    setPages(updatedPages);
  }, [pages]);

  const deleteFolderPage = useCallback((folderIndex, pageIndex) => {
    setFolderPages(prev => ({
      ...prev,
      [folderIndex]: prev[folderIndex].filter((_, i) => i !== pageIndex)
    }));
  }, []);

  const deleteFolder = useCallback((index) => {
    const updatedFolders = folders.filter((_, i) => i !== index);
    setFolders(updatedFolders);

    const updatedFolderPages = { ...folderPages };
    delete updatedFolderPages[index];
    setFolderPages(updatedFolderPages);
  }, [folders, folderPages]);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleLogin = (success) => {
    if (success) {
      setIsLoggedIn(true);
      if (pendingSave) {
        const { folderIndex, pageIndex, newPage, type } = pendingSave;
        if (type === "page") {
          updatePage(pageIndex, newPage);
        } else if (type === "folderPage") {
          updateFolderPage(folderIndex, pageIndex, newPage);
        }
        setPendingSave(null);
        alert("저장되었습니다.");
      }
      navigate('/');
    }
  };

  const handleSave = (type, folderIndex, pageIndex, newPage) => {
    if (!isLoggedIn) {
      alert("로그인을 해주세요.");
      setPendingSave({ folderIndex, pageIndex, newPage, type });
      navigate('/login');
    } else {
      if (type === "page") {
        updatePage(pageIndex, newPage);
      } else if (type === "folderPage") {
        updateFolderPage(folderIndex, pageIndex, newPage);
      }
      alert("저장되었습니다.");
    }
  };

  const location = useLocation();
  const isPage = location.pathname.includes('/page');
  const isFolder = location.pathname.includes('/folder');

  return (
    <div className="App">
      <Sidebar
        folders={folders}
        pages={pages.map(page => page.title)}
        folderPages={folderPages}
        updateFolderName={updateFolderName}
      />
      <div className="main-content-container">
        <Routes>
          <Route
            path="/"
            element={<MainContent folders={folders} pages={pages.map(page => page.title)} />}
          />
          <Route
            path="/login"
            element={<LoginPage onLogin={handleLogin} />}
          />
          {pages.map((page, index) => (
            <Route
              key={index}
              path={`/page/${index + 1}`}
              element={<Page
                page={page}
                pageIndex={index}
                updatePage={(pageIndex, newPage) => handleSave("page", null, pageIndex, newPage)}
                deletePage={deletePage}
                isLoggedIn={isLoggedIn}
              />}
            />
          ))}
          {folders.map((folder, index) => (
            <Route
              key={index}
              path={`/folder/${index + 1}`}
              element={<Folder
                folderindex={index}
                pages={folderPages[index] || []}
                addPage={addFolderPage}
                updateFolderName={updateFolderName}
                initialFolderName={folder}
                deleteFolder={deleteFolder}
              />}
            />
          ))}
          {folders.map((folder, folderIndex) => (
            (folderPages[folderIndex] || []).map((folderpage, pageIndex) => (
              <Route
                key={`${folderIndex}-${pageIndex}`}
                path={`/folder/${folderIndex + 1}/folderpage/${pageIndex + 1}`}
                element={<FolderPage
                  page={folderpage}
                  pageIndex={pageIndex}
                  folderIndex={folderIndex}
                  updatePage={(folderIndex, pageIndex, newPage) => handleSave("folderPage", folderIndex, pageIndex, newPage)}
                  deletePage={deleteFolderPage}
                  isLoggedIn={isLoggedIn}
                />}
              />
            ))
          ))}
        </Routes>
        {!(isPage || isFolder) && (
          <div className="add-button-container">
            <div className="add-button" onClick={toggleOptions}>
              +
            </div>
            {showOptions && (
              <div className="options">
                <button onClick={addFolder}>Folders</button>
                <button onClick={() => addPage(null)}>Pages</button>
              </div>
            )}
          </div>
        )}
        <div className="logo-container">
          LEXI NOTE
        </div>
      </div>
    </div>
  );
}

App.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.string),
  pages: PropTypes.arrayOf(PropTypes.object),
  folderPages: PropTypes.object,
  showOptions: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  pendingSave: PropTypes.object,
  navigate: PropTypes.func,
};

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
