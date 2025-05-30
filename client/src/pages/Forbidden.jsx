import React from 'react';
import './forbidden.css';
import NoNetworkImage from '../assets/no-network.png';

const Forbidden = () => {
  return (
    <div className="forbidden-container">
      <img src={NoNetworkImage} alt="Forbidden" className="forbidden-image" />
      <div className="forbidden-text">403 - Forbidden</div>
      <div className="forbidden-subtext">You do not have permission to access this page.</div>
    </div>
  );
};

export default Forbidden; 