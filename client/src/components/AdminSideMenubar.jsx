import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './AdminSideMenubar.css';

const AdminSideMenubar = () => {
  const location = useLocation();
  const { id } = useParams(); // Get the course ID from the URL

  const [activeLink, setActiveLink] = useState(() => {
    // Determine active link based on current path
    const path = location.pathname;
    if (path.includes(`/admin/course-details/${id}/modules`)) return 'modules';
    if (path.includes(`/admin/course-details/${id}/announcements`)) return 'announcements';
    if (path.includes(`/admin/course-details/${id}/assignments`)) return 'assignments';
    if (path.includes(`/admin/course-details/${id}/grades`)) return 'grades';
    if (path.includes(`/admin/course-details/${id}/rubrics`)) return 'rubrics';
    return 'basics'; // Default to basics
  });

  const menuItems = [
    { label: 'Basics', path: `/admin/course-details/${id}/basics`, key: 'basics' },
    { label: 'Modules', path: `/admin/course-details/${id}/modules`, key: 'modules' },
    { label: 'Announcements', path: `/admin/course-details/${id}/announcements`, key: 'announcements' },
    { label: 'Assignments', path: `/admin/course-details/${id}/assignments`, key: 'assignments' },
    { label: 'Grades', path: `/admin/course-details/${id}/grades`, key: 'grades' },
    { label: 'Rubrics', path: `/admin/course-details/${id}/rubrics`, key: 'rubrics' },
  ];

  return (
    <div className="admin-sidebar">
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={activeLink === item.key ? 'active' : ''}
            onClick={() => setActiveLink(item.key)}
          >
            <Link to={item.path}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSideMenubar; 