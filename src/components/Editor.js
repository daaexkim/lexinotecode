import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Editor as WysiwygEditor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const Editor = ({ htmlStr, setHtmlStr }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    const blocksFromHtml = htmlToDraft(htmlStr);
    if (blocksFromHtml) {
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [htmlStr]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    setHtmlStr(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  const uploadCallback = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const formData = new FormData();
        formData.append('multipartFiles', file);
        const res = await axios.post('http://localhost:8080/uploadImage', formData);
        resolve({ data: { link: res.data } });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const toolbar = {
    list: { inDropdown: true },
    textAlign: { inDropdown: true },
    link: { inDropdown: true },
    history: { inDropdown: false },
    image: { uploadCallback },
  };

  const localization = {
    locale: 'ko',
  };

  return (
    <WysiwygEditor
      editorClassName="editor"
      toolbarClassName="toolbar"
      toolbar={toolbar}
      placeholder="내용을 입력하세요."
      localization={localization}
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
    />
  );
};

export default Editor;
