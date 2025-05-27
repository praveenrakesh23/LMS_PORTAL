import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './DashboardHeader.css';
import gradcap from '../assets/dashboard/login_grad_cap.svg';

const DashboardHeader = () => {
  const { user: currentUser, logout } = useContext(AuthContext);

  return (
    <header className="dashboard-header modern-glass">
      <div className="dashboard-logo modern-logo">
        <img src={gradcap} alt="Graduation Cap" className="grad-cap" />
        <span className="logo-text">Learning Management System</span>
      </div>
      <nav className="dashboard-profile modern-profile">
        <span className="dashboard-username">{currentUser?.name || currentUser?.username || 'Student'}</span>
        <div className="profile-dropdown">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="profile"
            className="profile-pic"
          />
          <div className="profile-options">
            <div className="profile-option">
              <span role="img" aria-label="accomplishments">📋</span> Accomplishments
            </div>
            <div className="profile-option">
              <span role="img" aria-label="purchases">🛒</span> My purchases
            </div>
            <div className="profile-option" onClick={logout} style={{ cursor: 'pointer' }}>
              <span role="img" aria-label="logout">↗️</span> Logout
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DashboardHeader;