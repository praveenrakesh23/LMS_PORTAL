import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import CourseSidebar from '../../components/CourseSidebar';
import './course-modules.css'; // Reuse styles

const dummyAssignmentsData = {
  sidebar: [
    { label: 'Modules' },
    { label: 'Announcements' },
    { label: 'Assignments', active: true },
    { label: 'Grades' },
  ],
  assignments: {
    current: [
      {
        quiz: 'Quiz 4',
        title: 'Create a Facebook Marketing Plan',
        questions: 2,
        points: 10,
        due: '2024-10-30',
        status: 'current',
      },
      {
        quiz: 'Quiz 5',
        title: 'Instagram Story Strategy Analysis',
        questions: 10,
        points: 10,
        due: '2024-11-15',
        status: 'current',
      },
      {
        quiz: 'Quiz 6',
        title: 'Analyze a Social Media Campaign',
        questions: 10,
        points: 10,
        due: '2024-11-25',
        status: 'current',
      },
      {
        quiz: 'Quiz 7',
        title: 'Final Project: Build a Marketing Campaign',
        questions: 10,
        points: 10,
        due: '2024-12-10',
        status: 'current',
      },
    ],
    completed: [
      {
        quiz: 'Quiz 1',
        title: 'Social Media Audit Report',
        questions: 10,
        points: 10,
        due: '2024-09-30',
        status: 'completed',
      },
      {
        quiz: 'Quiz 2',
        title: 'SEO Optimization Strategy P1',
        questions: 10,
        points: 10,
        due: '2024-08-15',
        status: 'completed',
      },
      {
        quiz: 'Quiz 3',
        title: 'SEO Optimization Strategy P2',
        questions: 10,
        points: 10,
        due: '2024-08-15',
        status: 'completed',
      },
    ]
  }
};

const Assignments = ({ assignments }) => {
  const [open, setOpen] = useState({ current: true, completed: true });
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const navigate = useNavigate();
  const { id } = useParams();
  const getQuizId = (quiz) => quiz.id || quiz.quiz.toLowerCase().replace(/s+/g, '-');

  return (
    <div className="cm-assignments">
      <h2 className="cm-title"><span className="cm-title-bar"></span>Assignments</h2>
      <div className="cm-assignment-section">
        <div className="cm-assignment-section-header" onClick={() => setOpen(o => ({ ...o, current: !o.current }))}>
          <span className="cm-assignment-section-arrow">{open.current ? '▼' : '▶'}</span>
          <b>Current Assignments ({assignments.current.length})</b>
        </div>
        {open.current && (
          <div className="cm-assignment-list">
            {assignments.current.map((a, idx) => (
              <div className="cm-assignment-row" key={idx}>
                <span className="cm-assignment-icon">≡</span>
                <span className="cm-assignment-quiz-link" onClick={() => navigate(`/courses/${id}/assignments/${getQuizId(a)}`)}>{a.quiz}</span>
                <span className="cm-assignment-title">{a.title}</span>
                <span className="cm-assignment-meta">{a.questions} questions | {a.points} pts</span>
                <span className="cm-assignment-badge cm-assignment-badge-due">{formatDate(a.due)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="cm-assignment-section">
        <div className="cm-assignment-section-header" onClick={() => setOpen(o => ({ ...o, completed: !o.completed }))}>
          <span className="cm-assignment-section-arrow">{open.completed ? '▼' : '▶'}</span>
          <b>Completed Assignments ({assignments.completed.length})</b>
        </div>
        {open.completed && (
          <div className="cm-assignment-list">
            {assignments.completed.map((a, idx) => (
              <div className="cm-assignment-row" key={idx}>
                <span className="cm-assignment-icon">≡</span>
                <span className="cm-assignment-quiz-link" onClick={() => navigate(`/courses/${id}/assignments/${getQuizId(a)}`)}>{a.quiz}</span>
                <span className="cm-assignment-title">{a.title}</span>
                <span className="cm-assignment-meta">{a.questions} questions | {a.points} pts</span>
                <span className="cm-assignment-badge cm-assignment-badge-completed">{formatDate(a.due)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AssignmentsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [sidebar, setSidebar] = useState([]);

  useEffect(() => {
    // For backend integration later:
    // fetch(`/api/courses/${id}/assignments`).then(res => res.json()).then(data => { setData(data); setSidebar(data.sidebar); });
    setData(dummyAssignmentsData);
    setSidebar(dummyAssignmentsData.sidebar);
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="cm-root">
      <DashboardHeader />
      <div className="cm-content-row">
        <CourseSidebar items={sidebar} onMyCoursesClick={() => navigate(`/courses/${id}`)} onItemClick={() => {}} /> {/* Sidebar navigation handled within sidebar component */}
        <main className="cm-main">
          <Assignments assignments={data.assignments} />
        </main>
      </div>
    </div>
  );
};

export default AssignmentsPage; 