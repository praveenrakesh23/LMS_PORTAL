import React from 'react';
import '../pages/student/course-modules.css'; // Reuse sidebar styles
import { useNavigate, useParams } from 'react-router-dom';

const CourseSidebar = ({ items, onItemClick, onMyCoursesClick }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <aside className="cm-sidebar">
      <div className="cm-sidebar-mycourses" onClick={onMyCoursesClick} tabIndex={0} role="button">
        &larr; My Courses
      </div>
      <ul>
        {items.map((item, idx) => (
          <li
            key={idx}
            className={item.active ? 'active' : ''}
            onClick={() => {
              if (onItemClick) onItemClick(idx);
              const label = item.label;
              if (label === 'Modules') navigate(`/courses/${id}/modules`);
              else if (label === 'Announcements') navigate(`/courses/${id}/announcements`);
              else if (label === 'Assignments') navigate(`/courses/${id}/assignments`);
              else if (label === 'Grades') navigate(`/courses/${id}/grades`);
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CourseSidebar; 