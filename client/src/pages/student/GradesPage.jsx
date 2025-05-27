import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import CourseSidebar from '../../components/CourseSidebar';
import './course-modules.css';

const dummyGradesData = {
  sidebar: [
    { label: 'Modules' },
    { label: 'Announcements' },
    { label: 'Assignments' },
    { label: 'Grades', active: true },
  ],
  grades: [
    { name: 'Quiz 1', title: 'Social Media Audit Report', score: 8, max: 10 },
    { name: 'Quiz 2', title: 'SEO Optimization Strategy P1', score: 10, max: 10 },
    { name: 'Quiz 3', title: 'SEO Optimization Strategy P2', score: 9, max: 10 },
    { name: 'Quiz 4', title: 'Create a Facebook Marketing Plan', score: 7, max: 10 },
    { name: 'Quiz 5', title: 'Instagram Story Strategy Analysis', score: 10, max: 10 },
    { name: 'Quiz 6', title: 'Analyze a Social Media Campaign', score: 9, max: 10 },
    { name: 'Quiz 7', title: 'Final Project: Build a Marketing Campaign', score: 10, max: 10 },
  ]
};

const getGradeStatus = (percent) => {
  if (percent >= 90) return { label: 'Excellent', color: 'cm-grade-badge-excellent' };
  if (percent >= 75) return { label: 'Passed', color: 'cm-grade-badge-passed' };
  if (percent >= 60) return { label: 'Needs Improvement', color: 'cm-grade-badge-improve' };
  return { label: 'Failed', color: 'cm-grade-badge-failed' };
};

const GradesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    // For backend integration later:
    // fetch(`/api/courses/${id}/grades`).then(res => res.json()).then(data => { setSidebar(data.sidebar); setGrades(data.grades); });
    setSidebar(dummyGradesData.sidebar);
    setGrades(dummyGradesData.grades);
  }, [id]);

  const totalScore = grades.reduce((sum, g) => sum + g.score, 0);
  const totalMax = grades.reduce((sum, g) => sum + g.max, 0);
  const percent = totalMax ? Math.round((totalScore / totalMax) * 100) : 0;
  const status = getGradeStatus(percent);

  return (
    <div className="cm-root">
      <DashboardHeader />
      <div className="cm-content-row">
        <CourseSidebar items={sidebar} onMyCoursesClick={() => navigate(`/courses/${id}`)} onItemClick={() => {}} />
        <main className="cm-main">
          <h2 className="cm-title"><span className="cm-title-bar"></span>Grades</h2>
          <div className="cm-grades-summary-card">
            <div className="cm-grades-summary-row">
              <div className="cm-grades-summary-label">Overall Grade</div>
              <div className="cm-grades-summary-score">{percent}%</div>
              <span className={`cm-grade-badge ${status.color}`}>{status.label}</span>
            </div>
            <div className="cm-grades-summary-meta">{totalScore} / {totalMax} points</div>
          </div>
          <div className="cm-grades-list">
            {grades.map((g, idx) => {
              const p = Math.round((g.score / g.max) * 100);
              const s = getGradeStatus(p);
              return (
                <div className="cm-grades-row" key={idx}>
                  <span className="cm-grades-quiz">{g.name}</span>
                  <span className="cm-grades-title">{g.title}</span>
                  <span className="cm-grades-score">{g.score} / {g.max}</span>
                  <span className={`cm-grade-badge ${s.color}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GradesPage; 