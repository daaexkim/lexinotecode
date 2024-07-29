import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'; // PropTypes를 추가
import folderIcon from '../../icons/folder.png';
import '../../styles/Item.css';

const FolderDetail = ({ name, folderIndex }) => {
  return (
    <Link to={`/folder/${folderIndex + 1}`} className="item-link">
      <div className="item">
        <img src={folderIcon} alt="Folder Icon" className="icon" />
        <span className="item-name">{name}</span>
      </div>
    </Link>
  );
};

// PropTypes를 사용하여 prop의 타입을 지정
FolderDetail.propTypes = {
  name: PropTypes.string.isRequired, // 'name'은 문자열이며 필수 항목
  folderIndex: PropTypes.number.isRequired // 'folderIndex'는 숫자이며 필수 항목
};

export default FolderDetail;
