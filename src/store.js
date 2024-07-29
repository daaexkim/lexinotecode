import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  folders: [],
  pages: [],
  folderPages: {},
  isLoggedIn: false,
  pendingSave: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addFolder: (state) => {
      const newFolder = `Folder ${state.folders.length + 1}`;
      state.folders.push(newFolder);
      state.folderPages[state.folders.length] = [];
    },
    addPage: (state, action) => {
      const newPage = { id: state.pages.length + 1, title: `Page ${state.pages.length + 1}`, content: "", folderIndex: action.payload };
      state.pages.push(newPage);
    },
    addFolderPage: (state, action) => {
      const folderIndex = action.payload;
      const newPage = { id: (state.folderPages[folderIndex]?.length || 0) + 1, title: `Page ${(state.folderPages[folderIndex]?.length || 0) + 1}`, content: "" };
      state.folderPages[folderIndex].push(newPage);
    },
    updateFolderPage: (state, action) => {
      const { folderIndex, pageIndex, newPage } = action.payload;
      state.folderPages[folderIndex][pageIndex] = newPage;
    },
    updateFolderName: (state, action) => {
      const { index, newName } = action.payload;
      state.folders[index] = newName;
    },
    updatePage: (state, action) => {
      const { index, newPage } = action.payload;
      state.pages[index] = newPage;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setPendingSave: (state, action) => {
      state.pendingSave = action.payload;
    },
    clearPendingSave: (state) => {
      state.pendingSave = null;
    }
  }
});

export const {
  addFolder,
  addPage,
  addFolderPage,
  updateFolderPage,
  updateFolderName,
  updatePage,
  setLoggedIn,
  setPendingSave,
  clearPendingSave
} = appSlice.actions;

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  }
});

export default store;
