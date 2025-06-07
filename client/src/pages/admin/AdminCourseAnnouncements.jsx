import React, { useState } from 'react';
import './admin-course-announcements.css';

const AdminCourseAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddAnnouncement = () => {
    if (newAnnouncement.title.trim() && newAnnouncement.content.trim()) {
      setAnnouncements(prevAnnouncements => [
        ...prevAnnouncements,
        { ...newAnnouncement, id: Date.now(), date: new Date().toLocaleDateString() }
      ]);
      setNewAnnouncement({ title: '', content: '' });
    } else {
      alert('Please fill in both title and content for the announcement.');
    }
  };

  return (
    <div className="admin-announcements-container">
      <h2 className="admin-announcements-title">Course Announcements</h2>
      <p className="admin-announcements-description">Manage announcements for this course.</p>

      <div className="admin-new-announcement-form">
        <div className="form-group">
          <label htmlFor="announcement-title">Announcement Title:</label>
          <input type="text" id="announcement-title" name="title" placeholder="e.g., Important Update!" value={newAnnouncement.title} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="announcement-content">Content:</label>
          <textarea id="announcement-content" name="content" rows="4" placeholder="Write your announcement here..." value={newAnnouncement.content} onChange={handleInputChange}></textarea>
        </div>
        <button onClick={handleAddAnnouncement} className="admin-add-announcement-btn">Add Announcement</button>
      </div>

      <div className="admin-announcements-list">
        {announcements.length === 0 ? (
          <p className="no-announcements-message">No announcements yet. Add one above!</p>
        ) : (
          announcements.map(announcement => (
            <div key={announcement.id} className="admin-announcement-card">
              <h3 className="admin-announcement-card-title">{announcement.title}</h3>
              <p className="admin-announcement-card-date">{announcement.date}</p>
              <p className="admin-announcement-card-content">{announcement.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCourseAnnouncements; 