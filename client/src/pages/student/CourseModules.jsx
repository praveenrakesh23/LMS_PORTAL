import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import CourseSidebar from '../../components/CourseSidebar';
import './course-modules.css';

const dummyModulesData = {
  sidebar: [
    { label: 'Modules', active: true },
    { label: 'Announcements' },
    { label: 'Assignments' },
    { label: 'Grades' },
  ],
  modules: [
    {
      id: 'module-1',
      title: 'Module 1: Introduction to Social Media Marketing',
      lessons: [
        { id: 'lesson-1', title: 'Overview of Social Media Platforms' },
        { id: 'lesson-2', title: 'Intro' },
      ],
    },
    {
      id: 'module-2',
      title: 'Module 2: Introduction to Social Media Marketing',
      lessons: [
        { id: 'lesson-3', title: 'Overview of Social Media Platforms' },
        { id: 'lesson-4', title: 'Intro' },
      ],
    },
    {
      id: 'module-3',
      title: 'Module 3: Instagram Marketing',
      lessons: [
        { id: 'lesson-5', title: 'Optimizing Your Instagram Profile' },
        { id: 'lesson-6', title: 'Instagram Stories for Engagement' },
        { id: 'lesson-7', title: 'Instagram Stories & Reels for Business' },
        { id: 'lesson-8', title: 'Instagram Ads: Formats & Targeting' },
      ],
    },
  ],
};

const CourseModules = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [sidebar, setSidebar] = useState([]);

  useEffect(() => {
    // For backend integration later:
    // fetch(`/api/courses/${id}/modules`).then(res => res.json()).then(setData);
    setData(dummyModulesData);
    setSidebar(dummyModulesData.sidebar);
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="cm-root">
      <DashboardHeader />
      <div className="cm-content-row">
      <CourseSidebar items={sidebar} onMyCoursesClick={() => navigate(`/courses/${id}`)} onItemClick={() => {}} />
      <main className="cm-main">
          <h2 className="cm-title"><span className="cm-title-bar"></span>Modules</h2>
          <div className="cm-modules-list">
            {data.modules.map((mod, mIdx) => (
              <div className="cm-module-card" key={mIdx}>
                <div className="cm-module-title">
                  <span className="cm-module-icon">≡</span>
                  <b>{mod.title} ({mod.lessons.length} lessons)</b>
                </div>
                <div className="cm-lessons-list">
                  {mod.lessons.map((lesson, lIdx) => (
                    <div className="cm-lesson-row" key={lIdx}>
                      <span className="cm-lesson-icon">≡</span>
                      <span className="cm-lesson-link" onClick={() => navigate(`/courses/${id}/modules/${mod.id}/lessons/${lesson.id}`)}>Lesson {lIdx + 1}</span>
                      <span className="cm-lesson-desc">{lesson.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="cm-nav-row">
            <button className="cm-nav-btn" onClick={() => navigate(-1)}>&larr; Back</button>
            <button className="cm-nav-btn cm-nav-next">Next &rarr;</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseModules; 