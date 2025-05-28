import React, { useEffect, useState } from 'react';
import './dashboard-style.css';
import star from '../../assets/star.svg';
import user from '../../assets/user.svg';
import calendar from '../../assets/calendar.svg';
import DashboardHeader from '../../components/DashboardHeader';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 12, totalPages: 1, totalCourses: 0 });

  useEffect(() => {
    fetch('/src/sample-courses.json')
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses);
        setFilteredCourses(data.courses);
        setPagination(data.pagination);
      });
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(
        courses.filter((course) =>
          course.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, courses]);

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <main className="dashboard-main">
        <div className="dashboard-search">
          <input
            type="text"
            placeholder="Search for a course"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dashboard-search-input"
          />
        </div>
        <h2 className="dashboard-title">My Courses</h2>
        <div className="dashboard-grid">
          {filteredCourses.map((course) => (
            <div className="dashboard-card" key={course.id}>
              <img src={course.imageUrl} alt={course.title} className="dashboard-card-img" />
              <div className="dashboard-card-content">
                <h3 className="dashboard-card-title">{course.title}</h3>
                <div className="dashboard-card-info">
                  <span className="dashboard-card-rating">
                    <img src={star} alt="star" className="icon-star" />
                    {course.rating} <span className="dashboard-card-rating-count">({course.ratingCount})</span>
                  </span>
                  <span className="dashboard-card-enrolled">
                    <img src={user} alt="user" className="icon-user" />
                    Students Enrolled: {course.studentsEnrolled}
                  </span>
                  <span className="dashboard-card-updated">
                    <img src={calendar} alt="calendar" className="icon-calendar" />
                    Last Updated: {new Date(course.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="dashboard-pagination">
          <button className="dashboard-pagination-btn" disabled={pagination.page === 1}>&lt; Previous</button>
          <button className="dashboard-pagination-btn" disabled={pagination.page === pagination.totalPages}>Next &gt;</button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;