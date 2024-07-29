import React from 'react';
import { Link } from 'react-router-dom';
import pageIcon from '../../icons/page.png';
import '../../styles/Item.css';

const PageDetail = ({ name, pageIndex }) => {
  return (
    <Link to={`/page/${pageIndex + 1}`} className="item-link">
      <div className="item">
        <img src={pageIcon} alt="Page Icon" className="icon" />
        {name}
      </div>
    </Link>
  );
};

export default PageDetail;
