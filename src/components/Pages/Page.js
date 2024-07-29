import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import Tesseract from "tesseract.js";
import PropTypes from 'prop-types';
import "./Page.css";

const ImageBlot = Quill.import('formats/image');

class CustomImageBlot extends ImageBlot {
  static create(value) {
    const node = super.create(value);
    node.setAttribute('data-custom', 'image'); 
    return node;
  }
}

Quill.register(CustomImageBlot, true);

const Page = ({ page, pageIndex, updatePage, deletePage }) => {
  const [title, setTitle] = useState(page.title); 
  const [content, setContent] = useState(page.content); 
  const [selectedLang, setSelectedLang] = useState("ko"); 
  const [showTemplateOptions, setShowTemplateOptions] = useState(false); 
  const navigate = useNavigate();
  const editorRef = useRef(null);

  useEffect(() => {
    setTitle(page.title);
    setContent(page.content);
  }, [page]);

  const handleContentChange = useCallback((value) => {
    setContent(value);
  }, []);

  const handleTitleChange = useCallback((event) => {
    setTitle(event.target.value);
  }, []);

  const handleSave = useCallback(() => {
    updatePage(pageIndex, { ...page, title, content });
  }, [pageIndex, page, title, content, updatePage]);

  const handleMouseUp = useCallback((event) => {
    if (editorRef.current && editorRef.current.getEditor().root.contains(event.target)) {
      const selection = window.getSelection().toString().trim();
      if (selection) {
        let url = "";
        if (selectedLang === "ko") {
          url = `https://ko.dict.naver.com/#/search?range=all&query=${selection}`;
        } else if (selectedLang === "en") {
          url = `https://en.dict.naver.com/#/search?range=all&query=${selection}`;
        } else if (selectedLang === "zh-CN") {
          url = `https://zh.dict.naver.com/#/search?range=all&query=${selection}`;
        } else if (selectedLang === "fr") {
          url = `https://dict.naver.com/frkodict/#/search?query=${selection}`;
        }
        window.open(url, "_blank", "width=800,height=600");
      }
    }
  }, [selectedLang]);

  const handleGrammarCheck = useCallback(() => {
    if (editorRef.current) {
      const contentText = editorRef.current.getEditor().root.innerText;
      if (contentText) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://dic.daum.net/grammar_checker.do";
        form.target = "popupWindow";
        form.style.display = "none";

        const input = document.createElement("textarea");
        input.name = "sentence";
        input.value = contentText;

        form.appendChild(input);
        document.body.appendChild(form);

        window.open('', 'popupWindow', 'width=800,height=600');
        form.submit();

        document.body.removeChild(form);
      } else {
        alert("문법 검사를 위해 텍스트를 입력해주세요.");
      }
    }
  }, []);

  const handlePapagoCheck = useCallback(() => {
    if (editorRef.current) {
      const contentText = editorRef.current.getEditor().root.innerText;
      if (contentText) {
        const encodedText = encodeURIComponent(contentText);
        const url = `https://papago.naver.com/?sk=ko&tk=en&st=${encodedText}`;
        window.open(url, '_blank', 'width=800,height=600');
      } else {
        alert("번역을 위해 텍스트를 입력해주세요.");
      }
    }
  }, []);

  const setTemplateBackground = useCallback((templateName) => {
    const templateUrl = `${process.env.PUBLIC_URL}/images/${templateName}.png`;
    const img = new Image();
    img.src = templateUrl;
    img.onload = () => {
      if (editorRef.current) {
        const editor = editorRef.current.getEditor();
        editor.root.style.backgroundImage = `url(${templateUrl})`;
        editor.root.style.backgroundSize = 'contain';
        editor.root.style.backgroundRepeat = 'no-repeat';
        editor.root.style.backgroundPosition = 'center';
        editor.root.style.width = `${img.width}px`;
        editor.root.style.height = `${img.height}px`;
        editor.root.style.minHeight = `${img.height}px`; 
      }
    };
  }, []);

  const handleTextRecognition = useCallback(() => {
    if (editorRef.current) {
      const editor = editorRef.current.getEditor();
      const images = editor.root.querySelectorAll('img[data-custom="image"]');
      if (images.length > 0) {
        const imageUrl = images[0].src;
        Tesseract.recognize(
          imageUrl,
          'eng',
          {
            logger: (m) => console.log(m),
          }
        ).then(({ data: { text } }) => {
          const delta = editor.clipboard.convert(text);
          editor.updateContents(delta, 'user');
        }).catch((error) => {
          console.error(error);
          alert('텍스트 인식 중 오류가 발생했습니다.');
        });
      } else {
        alert("이미지를 업로드 해주세요.");
      }
    }
  }, []);

  const handleDelete = useCallback(() => {
    if (window.confirm("삭제하시겠습니까?")) {
      deletePage(pageIndex);
      navigate('/');
    }
  }, [deletePage, pageIndex, navigate]);

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'video'],
      ['clean'],
      ['image']
    ]
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline',
    'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'color', 'background',
    'align',
    'link',
    'image',
    'video'
  ];

  return (
    <div className="page-container" onMouseUp={handleMouseUp}>
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>{'<'}</button>
        <input
          className="title-input"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="제목을 입력하세요"
          title="제목을 변경할 수 있습니다"
        />
        <button className="save-button" onClick={handleSave}>SAVE</button>
      </div>
      <div className="editor-container">
        <ReactQuill
          ref={editorRef}
          value={content}
          onChange={handleContentChange}
          className="editor"
          placeholder="여기에 내용을 작성하세요..."
          modules={modules}
          formats={formats}
        />
      </div>
      <div className="options-container">
        <select className="language-select" onChange={(e) => setSelectedLang(e.target.value)} value={selectedLang}>
          <option value="ko">한국어</option>
          <option value="en">영어</option>
          <option value="zh-CN">중국어</option>
          <option value="fr">프랑스어</option>
        </select>
        <div className="template-select">
          <button className="template-button" onClick={() => setShowTemplateOptions(!showTemplateOptions)}>Template</button>
          {showTemplateOptions && (
            <div className="template-options">
              <button onClick={() => setTemplateBackground('todo')}>To-Do List</button>
              <button onClick={() => setTemplateBackground('schedule')}>Schedule</button>
            </div>
          )}
        </div>
        <button onClick={handleTextRecognition} className="ocr-button">텍스트 인식</button>
        <button onClick={handleGrammarCheck} className="grammar-check-button">맞춤법 검사</button>
        <button onClick={handlePapagoCheck} className="grammar-check-button">번역</button>
        <button onClick={handleDelete} className="delete-button">DELETE</button>
      </div>
    </div>
  );
};

Page.propTypes = {
  page: PropTypes.object.isRequired,
  pageIndex: PropTypes.number.isRequired,
  updatePage: PropTypes.func.isRequired,
  deletePage: PropTypes.func.isRequired,
};

export default Page;
