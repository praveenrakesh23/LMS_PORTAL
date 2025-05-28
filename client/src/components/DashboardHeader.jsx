import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './DashboardHeader.css';

const DashboardHeader = () => {
  const { user: currentUser } = useContext(AuthContext);
  return (
    <header className="dashboard-header">
      <div className="dashboard-logo">
        <span className="logo-icon" role="img" aria-label="cap">🎓</span>
        <span className="logo-text">Learning Management System</span>
      </div>
      <div className="dashboard-profile">
        <span className="dashboard-username">{currentUser?.name || currentUser?.username || 'Student'}</span>
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="profile" className="profile-pic" />
      </div>
    </header>
  );
};

export default DashboardHeader; 