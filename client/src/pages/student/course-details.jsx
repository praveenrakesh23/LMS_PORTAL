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

  // Calculate completion statistics
  const totalModules = course.stats?.modules || 0;
  const completedModules = course.completion?.modules?.completed || 0;
  const totalLessons = course.completion?.videos?.total || 0;
  const completedLessons = course.completion?.videos?.completed || 0;
  const totalQuizzes = course.completion?.quizzes?.total || 0;
  const completedQuizzes = course.completion?.quizzes?.completed || 0;
  const totalVideos = course.completion?.videos?.total || 0;
  const completedVideos = course.completion?.videos?.completed || 0;

  // Calculate overall progress
  const overallProgress = totalModules > 0 
    ? Math.round((completedModules / totalModules) * 100)
    : 0;

  // Calculate individual progress percentages
  const modulesProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const lessonsProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const quizzesProgress = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;
  const videosProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

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
              <b>{totalModules} Modules</b>
              <br />
              <span>Earn a career credential that demonstrates your expertise</span>
            </div>
            <div className="cd-stat-card">
              <div className="cd-rating">
                <span className="cd-star">★</span>
                <b>{course.rating ? course.rating.toFixed(1) : '0.0'}</b>
                <span className="cd-rating-count">
                  {course.ratingCount > 0 
                    ? `(${course.ratingCount.toLocaleString()} reviews)`
                    : '(No reviews yet)'}
                </span>
              </div>
              <span>Based on student feedback and course quality</span>
            </div>
            <div className="cd-stat-card">
              <b>{course.level || 'Beginner'}</b>
              <br />
              <span>{course.levelDesc || 'Recommended experience'}</span>
            </div>
          </div>
        </div>
        <div className="cd-progress-bar-row">
          <div className="cd-progress-label">{overallProgress}% completed</div>
          <div className="cd-progress-bar-bg">
            <div className="cd-progress-bar-fg" style={{ width: `${overallProgress}%` }}></div>
          </div>
        </div>
        <div className="cd-main-row">
          <div className="cd-main-cards">
            <div className="cd-main-card">
              <b>Modules</b>
              <div>Complete all modules to earn your certificate</div>
              <div className="cd-main-card-progress">
                {completedModules}/{totalModules} modules completed
              </div>
              <div className="cd-main-card-bar">
                <div style={{ width: `${modulesProgress}%` }}></div>
              </div>
              <div className="cd-main-card-label">
                {modulesProgress}% completed
              </div>
            </div>
            <div className="cd-main-card">
              <b>Lessons</b>
              <div>Watch video lessons and complete assignments</div>
              <div className="cd-main-card-progress">
                {completedLessons}/{totalLessons} lessons completed
              </div>
              <div className="cd-main-card-bar">
                <div style={{ width: `${lessonsProgress}%` }}></div>
              </div>
              <div className="cd-main-card-label">
                {lessonsProgress}% completed
              </div>
            </div>
            <div className="cd-main-card">
              <b>Videos</b>
              <div>Watch instructional videos to learn concepts</div>
              <div className="cd-main-card-progress">
                {completedVideos}/{totalVideos} videos completed
              </div>
              <div className="cd-main-card-bar">
                <div style={{ width: `${videosProgress}%` }}></div>
              </div>
              <div className="cd-main-card-label">
                {videosProgress}% completed
              </div>
            </div>
            <div className="cd-main-card">
              <b>Quizzes</b>
              <div>Test your knowledge with quick, interactive quizzes after each module</div>
              <div className="cd-main-card-progress">
                {completedQuizzes}/{totalQuizzes} quizzes completed
              </div>
              <div className="cd-main-card-bar">
                <div style={{ width: `${quizzesProgress}%` }}></div>
              </div>
              <div className="cd-main-card-label">
                {quizzesProgress}% completed
              </div>
            </div>
          </div>
          <div className="cd-skills-card">
            <h3>Skills you'll gain</h3>
            <ol>
              {course.skills?.map((skill, idx) => (
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
            {course.learn?.map((objective, idx) => (
              <li key={idx}>
                <span className="cd-check">✓</span> {objective}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;