import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import CourseSidebar from '../../components/CourseSidebar';
import './course-modules.css'; // Reuse styles

const Assignments = ({ assignments }) => {
  const [open, setOpen] = useState({ current: true, completed: true });
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const navigate = useNavigate();
  const { id } = useParams();
  const getQuizId = (quiz) => quiz.id || quiz.quiz.toLowerCase().replace(/\s+/g, '-');

  // Sort completed assignments by completion date
  const sortedCompleted = [...assignments.completed].sort((a, b) => {
    const dateA = new Date(a.completedAt || a.due);
    const dateB = new Date(b.completedAt || b.due);
    return dateB - dateA;
  });

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
          <b>Completed Assignments ({sortedCompleted.length})</b>
        </div>
        {open.completed && (
          <div className="cm-assignment-list">
            {sortedCompleted.map((a, idx) => (
              <div className="cm-assignment-row" key={idx}>
                <span className="cm-assignment-icon">≡</span>
                <span className="cm-assignment-quiz-link" onClick={() => navigate(`/courses/${id}/assignments/${getQuizId(a)}`)}>{a.quiz}</span>
                <span className="cm-assignment-title">{a.title}</span>
                <span className="cm-assignment-meta">
                  {a.score ? `${a.score.percentage}%` : 'Completed'} | {a.questions} questions
                </span>
                <span className={`cm-assignment-badge ${a.score?.isPassing ? 'cm-assignment-badge-completed' : 'cm-assignment-badge-failed'}`}>
                  {formatDate(a.completedAt || a.due)}
                </span>
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
    // Load assignments from localStorage
    const assignments = JSON.parse(localStorage.getItem('assignments') || '{}');
    const courseAssignments = assignments[id] || {
      current: [],
      completed: []
    };

    // If no assignments in localStorage, initialize with dummy data
    if (!courseAssignments.current.length && !courseAssignments.completed.length) {
      const dummyAssignments = {
        current: [
          {
            id: 'quiz-1',
            quiz: 'Quiz 1',
            title: 'Introduction to Social Media Marketing',
            questions: 10,
            points: 10,
            due: '2024-03-30',
            status: 'current',
          },
          {
            id: 'quiz-2',
            quiz: 'Quiz 2',
            title: 'Content Strategy Basics',
            questions: 10,
            points: 10,
            due: '2024-04-15',
            status: 'current',
          },
        ],
        completed: []
      };
      
      // Save dummy data to localStorage
      assignments[id] = dummyAssignments;
      localStorage.setItem('assignments', JSON.stringify(assignments));
      
      setData({
        sidebar: [
          { label: 'Modules' },
          { label: 'Announcements' },
          { label: 'Assignments', active: true },
          { label: 'Grades' },
        ],
        assignments: dummyAssignments
      });
    } else {
      // Ensure current assignments are properly maintained
      const currentAssignments = courseAssignments.current.filter(assignment => {
        // Keep assignment in current if it's not in completed
        return !courseAssignments.completed.some(
          completed => getQuizId(completed) === getQuizId(assignment)
        );
      });

      // Update assignments if needed
      if (currentAssignments.length !== courseAssignments.current.length) {
        courseAssignments.current = currentAssignments;
        assignments[id] = courseAssignments;
        localStorage.setItem('assignments', JSON.stringify(assignments));
      }

      setData({
        sidebar: [
          { label: 'Modules' },
          { label: 'Announcements' },
          { label: 'Assignments', active: true },
          { label: 'Grades' },
        ],
        assignments: courseAssignments
      });
    }

    setSidebar([
      { label: 'Modules' },
      { label: 'Announcements' },
      { label: 'Assignments', active: true },
      { label: 'Grades' },
    ]);
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="cm-root">
      <DashboardHeader />
      <div className="cm-content-row">
        <CourseSidebar items={sidebar} onMyCoursesClick={() => navigate(`/courses/${id}`)} onItemClick={() => {}} />
        <main className="cm-main">
          <Assignments assignments={data.assignments} />
        </main>
      </div>
    </div>
  );
};

export default AssignmentsPage; 