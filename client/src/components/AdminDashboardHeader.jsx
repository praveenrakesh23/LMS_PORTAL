import React from 'react';
import './DashboardHeader.css'; // Reuse existing header styles for now
import gradcap from '../assets/dashboard/login_grad_cap.svg';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import Logout from '../assets/profile-dropdown/Logout.svg';

const AdminDashboardHeader = () => {
  const { user: currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    const isConfirmed = window.confirm('Are you sure you want to log out?');

    if (isConfirmed) {
      logout();
      navigate('/login');
    }
  };

  // Assuming admin navigation links
  const adminNavLinks = [
    { label: 'My Courses', path: '/admin/dashboard' },
    { label: 'Analytics', path: '/admin/analytics' }, // Placeholder path
    { label: 'Grades', path: '/admin/grades' },       // Placeholder path
    { label: 'Students', path: '/admin/students' },     // Placeholder path
  ];

  return (
    <header className="dashboard-header modern-glass">
      <div className="dashboard-logo modern-logo">
        <img src={gradcap} alt="Graduation Cap" className="grad-cap" />
        <span className="logo-text">Learning Management System</span>
      </div>
      <nav className="dashboard-profile modern-profile">
        {/* Admin Navigation */}
        <ul className="admin-nav-links" style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
          {adminNavLinks.map(link => (
            <li key={link.label}>
              <Link 
                to={link.path} 
                className={location.pathname === link.path ? 'active-nav-link' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li style={{ marginLeft: '20px', fontWeight: '500', color: '#222' }}>
            {currentUser?.name || currentUser?.username || 'Admin'}
          </li>
        </ul>

        {/* Profile Dropdown */}
        <div className="profile-dropdown">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="profile"
            className="profile-pic"
          />
          <div className="profile-options">
            <div className="profile-option" onClick={handleLogoutClick} style={{ cursor: 'pointer' }}>
              <img src={Logout} alt="logout" className='logout' />  Logout
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminDashboardHeader; 