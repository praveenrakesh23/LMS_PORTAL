import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import { courseService } from '../../services/api';
// import star from '../../assets/course-card/star.svg';
// import user from '../../assets/course-card/user.svg';
// import calendar from '../../assets/course-card/calendar.svg';
import './course-details.css';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await courseService.getCourse(id);
        setCourse(response);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError(error.response?.data?.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="cd-loading">
        <div className="loading-spinner"></div>
        <p>Loading course details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="cd-error">
        <p>{error || 'Course not found or error loading course details'}</p>
        <button className="cd-back-btn" onClick={() => navigate('/student/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader />
      <div className="cd-container">
        <div className="cd-header-row">
          <button className="cd-back-btn" onClick={() => navigate('/student/dashboard')}>&larr; My Courses</button>
        </div>
        <div className="cd-title-row">
          <div className="cd-title-col">
            <h1 className="cd-title">{course.title}</h1>
            <div className="cd-subtitle">{course.subtitle}</div>
            <div className="cd-desc">{course.description}</div>
          </div>
          <div className="cd-stats-col">
            <div className="cd-stat-card">
              <b>{course.stats.modules} Modules</b>
              <br />
              <span>Earn a career credential that demonstrates your expertise</span>
            </div>
            <div className="cd-stat-card">
              <b>{course.stats.rating ? course.stats.rating.toFixed(1) : '0.0'} ★</b>
              <br />
              <span>({course.stats.ratingCount ? course.stats.ratingCount.toLocaleString() : '0'} reviews)</span>
            </div>
            <div className="cd-stat-card">
              <b>{course.stats.level}</b>
              <br />
              <span>{course.stats.levelDesc}</span>
            </div>
          </div>
        </div>
        <div className="cd-progress-bar-row">
          <div className="cd-progress-label">{course.progress}% completed</div>
          <div className="cd-progress-bar-bg">
            <div className="cd-progress-bar-fg" style={{ width: `${course.progress}%` }}></div>
          </div>
        </div>
        <div className="cd-main-row">
          <div className="cd-main-cards">
            <div className="cd-main-card">
              <b>Modules</b>
              <div>Structured units designed to guide you through the course step-by-step</div>
              <div className="cd-main-card-progress">
                {course.completion.modules.completed}/{course.completion.modules.total} modules completed
              </div>
              <div className="cd-main-card-bar">
                <div style={{ width: `${Math.round((course.completion.modules.completed/course.completion.modules.total)*100)}%` }}></div>
              </div>
              <div className="cd-main-card-label">
                {Math.round((course.completion.modules.completed/course.completion.modules.total)*100)}% completed
              </div>
            </div>
            <div className="cd-main-card">
              <b>Assignments</b>
              <div>Apply your learning through hands-on tasks and real-world challenges</div>
              <div className="cd-main-card-progress">
                {course.completion.assignments.completed}/{course.completion.assignments.total} assignments completed
              </div>
              <div className="cd-main-card-bar">
                <div style={{ width: `${Math.round((course.completion.assignments.completed/course.completion.assignments.total)*100)}%` }}></div>
              </div>
              <div className="cd-main-card-label">
                {Math.round((course.completion.assignments.completed/course.completion.assignments.total)*100)}% completed
              </div>
            </div>
            <div className="cd-main-card">
              <b>Videos</b>
              <div>Engage with expert-led video content to deepen your understanding</div>
              <div className="cd-main-card-progress">
                {course.completion.videos.completed}/{course.completion.videos.total} videos completed
              </div>
              <div className="cd-main-card-bar">
                <div style={{ width: `${Math.round((course.completion.videos.completed/course.completion.videos.total)*100)}%` }}></div>
              </div>
              <div className="cd-main-card-label">
                {Math.round((course.completion.videos.completed/course.completion.videos.total)*100)}% completed
              </div>
            </div>
            <div className="cd-main-card">
              <b>Quizzes</b>
              <div>Test your knowledge with quick, interactive quizzes after each module</div>
              <div className="cd-main-card-progress">
                {course.completion.quizzes.completed}/{course.completion.quizzes.total} quizzes completed
              </div>
              <div className="cd-main-card-bar">
                <div style={{ width: `${Math.round((course.completion.quizzes.completed/course.completion.quizzes.total)*100)}%` }}></div>
              </div>
              <div className="cd-main-card-label">
                {Math.round((course.completion.quizzes.completed/course.completion.quizzes.total)*100)}% completed
              </div>
            </div>
          </div>
          <div className="cd-skills-card">
            <h3>Skills you'll gain</h3>
            <ol>
              {course.skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ol>
          </div>
        </div>
        <div className="cd-continue-row">
          <span>Keep up the momentum — resume learning</span>
          <button className="cd-continue-btn" onClick={() => navigate(`/courses/${course.id}/modules`)}>
            CONTINUE
          </button>
        </div>
        <div className="cd-learn-row">
          <h2>What you'll learn</h2>
          <ul>
            {course.learn.map((item, idx) => (
              <li key={idx}>
                <span className="cd-check">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;