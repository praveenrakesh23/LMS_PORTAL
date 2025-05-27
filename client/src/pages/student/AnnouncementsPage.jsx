import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import CourseSidebar from '../../components/CourseSidebar';
import './course-modules.css'; // Reuse styles

const dummyAnnouncementsData = {
  sidebar: [
    { label: 'Modules' },
    { label: 'Announcements', active: true },
    { label: 'Assignments' },
    { label: 'Grades' },
  ],
  announcements: [
    {
      title: 'Welcome to the course!',
      date: '2024-06-01',
      content: 'We are excited to have you on board. Please check the modules section to get started.'
    },
    {
      title: 'Live Q&A Session',
      date: '2024-06-05',
      content: 'Join us for a live Q&A session this Friday at 5 PM.'
    }
  ]
};

const Announcements = ({ announcements }) => (
  <div className="cm-announcements">
    <h2 className="cm-title"><span className="cm-title-bar"></span>Announcements</h2>
    {announcements.length === 0 ? (
      <div className="cm-no-announcements">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Announcements" style={{ width: 120, margin: '32px auto 16px auto', display: 'block', opacity: 0.7 }} />
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1.1rem' }}>No announcements yet</div>
      </div>
    ) : (
      <div className="cm-announcement-list">
        {announcements.map((a, idx) => (
          <div className="cm-announcement-card" key={idx}>
            <div className="cm-announcement-title">{a.title}</div>
            <div className="cm-announcement-date">{new Date(a.date).toLocaleDateString()}</div>
            <div className="cm-announcement-content">{a.content}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AnnouncementsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [sidebar, setSidebar] = useState([]);

  useEffect(() => {
    // For backend integration later:
    // fetch(`/api/courses/${id}/announcements`).then(res => res.json()).then(data => { setData(data); setSidebar(data.sidebar); });
    setData(dummyAnnouncementsData);
    setSidebar(dummyAnnouncementsData.sidebar);
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="cm-root">
      <DashboardHeader />
      <div className="cm-content-row">
        <CourseSidebar items={sidebar} onMyCoursesClick={() => navigate(`/courses/${id}`)} onItemClick={() => {}} /> {/* Sidebar navigation handled within sidebar component */}
        <main className="cm-main">
          <Announcements announcements={data.announcements} />
        </main>
      </div>
    </div>
  );
};

export default AnnouncementsPage; 