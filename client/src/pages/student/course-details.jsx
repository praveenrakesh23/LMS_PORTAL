import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
// import star from '../../assets/course-card/star.svg';
// import user from '../../assets/course-card/user.svg';
// import calendar from '../../assets/course-card/calendar.svg';
import './course-details.css';

const dummyCourse = {
  id: '1',
  title: 'Advanced Digital Marketing',
  subtitle: "Get on the fast track to a career in digital marketing. In this certificate program, you'll learn in-demand skills, and get AI training from Google experts. Learn at your own pace, no degree or experience required.",
  description: "Learn anytime, anywhere at your own pace with flexible modules tailored to fit your lifestyle. Upon completion, you'll be job-ready to step into entry-level roles and start building a thriving digital career. Don't just learn—get certified and get noticed!",
  progress: 15,
  stats: {
    modules: 4,
    rating: 4.8,
    ratingCount: 33569,
    level: 'Beginner level',
    levelDesc: 'Recommended experience',
  },
  completion: {
    modules: { completed: 4, total: 10 },
    assignments: { completed: 3, total: 10 },
    videos: { completed: 2, total: 10 },
    quizzes: { completed: 1, total: 10 },
  },
  skills: [
    'Target Audience',
    'Email marketing',
    'social media strategy',
    'digital marketing',
    'campaign',
    'search engine',
    'programs',
    'order fulfillment',
    'e-commerce',
  ],
  learn: [
    'Learn the fundamentals of digital marketing and e-commerce to gain the skills needed to land an entry-level job.',
    'Attract and engage customers through digital marketing channels like search and email.',
    'Measure marketing performance through analytics and present insights.',
    'Build e-commerce stores, analyze online performance, and grow customer loyalty.',
  ],
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    // For backend integration later:
    // fetch(`/api/courses/${id}`)
    //   .then(res => res.json())
    //   .then(data => setCourse(data));
    setCourse(dummyCourse); // Use dummy data for now
  }, [id]);

  if (!course) return <div>Loading...</div>;

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
            <div className="cd-stat-card"><b>{course.stats.modules} Modules</b><br /><span>Earn a career credential that demonstrates your expertise</span></div>
            <div className="cd-stat-card"><b>{course.stats.rating} ★</b><br /><span>({course.stats.ratingCount.toLocaleString()} reviews)</span></div>
            <div className="cd-stat-card"><b>{course.stats.level}</b><br /><span>{course.stats.levelDesc}</span></div>
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
              <div className="cd-main-card-progress">{course.completion.modules.completed}/{course.completion.modules.total} modules completed</div>
              <div className="cd-main-card-bar"><div style={{ width: `${Math.round((course.completion.modules.completed/course.completion.modules.total)*100)}%` }}></div></div>
              <div className="cd-main-card-label">{Math.round((course.completion.modules.completed/course.completion.modules.total)*100)}% completed</div>
            </div>
            <div className="cd-main-card">
              <b>Assignments</b>
              <div>Apply your learning through hands-on tasks and real-world challenges</div>
              <div className="cd-main-card-progress">{course.completion.assignments.completed}/{course.completion.assignments.total} assignments completed</div>
              <div className="cd-main-card-bar"><div style={{ width: `${Math.round((course.completion.assignments.completed/course.completion.assignments.total)*100)}%` }}></div></div>
              <div className="cd-main-card-label">{Math.round((course.completion.assignments.completed/course.completion.assignments.total)*100)}% completed</div>
            </div>
            <div className="cd-main-card">
              <b>Videos</b>
              <div>Engage with expert-led video content to deepen your understanding</div>
              <div className="cd-main-card-progress">{course.completion.videos.completed}/{course.completion.videos.total} modules completed</div>
              <div className="cd-main-card-bar"><div style={{ width: `${Math.round((course.completion.videos.completed/course.completion.videos.total)*100)}%` }}></div></div>
              <div className="cd-main-card-label">{Math.round((course.completion.videos.completed/course.completion.videos.total)*100)}% completed</div>
            </div>
            <div className="cd-main-card">
              <b>Quizzes</b>
              <div>Test your knowledge with quick, interactive quizzes after each module</div>
              <div className="cd-main-card-progress">{course.completion.quizzes.completed}/{course.completion.quizzes.total} modules completed</div>
              <div className="cd-main-card-bar"><div style={{ width: `${Math.round((course.completion.quizzes.completed/course.completion.quizzes.total)*100)}%` }}></div></div>
              <div className="cd-main-card-label">{Math.round((course.completion.quizzes.completed/course.completion.quizzes.total)*100)}% completed</div>
            </div>
          </div>
          <div className="cd-skills-card">
            <h3>Skills you'll gain</h3>
            <ol>
              {course.skills.map((skill, idx) => <li key={idx}>{skill}</li>)}
            </ol>
          </div>
        </div>
        <div className="cd-continue-row">
          <span>Keep up the momentum — resume learning</span>
          <button className="cd-continue-btn" onClick={() => navigate(`/courses/${course.id}/modules`)}>CONTINUE</button>
        </div>
        <div className="cd-learn-row">
          <h2>What you'll learn</h2>
          <ul>
            {course.learn.map((item, idx) => <li key={idx}><span className="cd-check">✓</span> {item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;