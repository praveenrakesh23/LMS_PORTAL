import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import CourseSidebar from '../../components/CourseSidebar';
import './course-modules.css'; // Reuse styles
import NoNetworkImage from '../../assets/no-network.png'; // Assuming you save the image as no-network.png in assets

const dummyAnnouncementsData = {
  sidebar: [
    { label: 'Modules' },
    { label: 'Announcements', active: true },
    { label: 'Assignments' },
    { label: 'Grades' },
  ],
  announcements: [
    
  ]
};

const Announcements = ({ announcements }) => (
  <div className="cm-announcements">
    <h2 className="cm-title"><span className="cm-title-bar"></span>Announcements</h2>
    {announcements.length === 0 ? (
      <div className="cm-no-announcements">
        <img src={NoNetworkImage} alt="No Network" className="no-announcements-image" />
        <div className="no-announcements-text">No Announcements!</div>
        <div className="no-announcements-subtext">Nothing new for now, but stay tuned — updates are on the way!</div>
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