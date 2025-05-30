import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './DashboardHeader.css';
import gradcap from '../assets/dashboard/login_grad_cap.svg';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const { user: currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePurchasesClick = () => {
    navigate('/student/MyPurchasesPage');
  };

  const handleLogoutClick = () => {
    const isConfirmed = window.confirm('Are you sure you want to log out?');

    if (isConfirmed) {
      logout();
      navigate('/login');
    }
  };

  const handleAccomplishmentsClick = () => {
    navigate('/student/accomplishments');
  };

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
            <div className="profile-option" onClick={handleAccomplishmentsClick} style={{ cursor: 'pointer' }}>
              <span role="img" aria-label="accomplishments">📋</span> Accomplishments
            </div>
            <div className="profile-option" onClick={handlePurchasesClick} style={{ cursor: 'pointer' }}>
              <span role="img" aria-label="purchases">🛒</span> My purchases
            </div>
            <div className="profile-option" onClick={handleLogoutClick} style={{ cursor: 'pointer' }}>
              <span role="img" aria-label="logout">↗️</span> Logout
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DashboardHeader;