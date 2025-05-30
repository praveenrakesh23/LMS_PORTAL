import React from 'react';
import './notfound.css';
import NoNetworkImage from '../assets/no-network.png';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <img src={NoNetworkImage} alt="Not Found" className="notfound-image" />
      <div className="notfound-text">404 - Page Not Found</div>
      <div className="notfound-subtext">Sorry, the page you are looking for does not exist.</div>
    </div>
  );
};

export default NotFound; 