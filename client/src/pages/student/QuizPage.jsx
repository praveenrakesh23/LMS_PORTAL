import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import './course-modules.css';

const dummyQuiz = {
  id: 'quiz-1',
  title: 'Graded Assignment: Quiz 1 - Modern AI and its Applications',
  type: 'Graded Assignment',
  duration: '30 min',
  questions: [
    {
      id: 1,
      text: 'What is the goal of supervised learning?',
      points: 1,
      options: [
        'Find an underlying structure of the dataset without any labels.',
        'Predict the labels.',
        'Find the target.',
        'Predict the features.'
      ]
    },
    {
      id: 2,
      text: 'What is the goal of supervised learning?',
      points: 1,
      options: [
        'Find an underlying structure of the dataset without any labels.',
        'Predict the labels.',
        'Find the target.',
        'Predict the features.'
      ]
    }
  ]
};

const QuizPage = () => {
  const { id, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // For backend integration later:
    // fetch(`/api/courses/${id}/assignments/${quizId}`).then(res => res.json()).then(setQuiz);
    setQuiz(dummyQuiz);
  }, [id, quizId]);

  const handleCheck = (qIdx, oIdx) => {
    setAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const allAnswered = quiz && quiz.questions.every((q, idx) => answers[idx] !== undefined);

  return (
    <div className="cm-root">
      <DashboardHeader />
      <div className="cm-quiz-container">
        <div className="cm-quiz-breadcrumb">
          <span className="cm-title-bar"></span>
          <span className="cm-quiz-breadcrumb-main">Assignments</span>
          <span className="cm-quiz-breadcrumb-sep">&gt;</span>
          <span className="cm-quiz-breadcrumb-current">Current</span>
        </div>
        <div className="cm-quiz-card">
          <div className="cm-quiz-title-row">
            <div className="cm-quiz-title"><b>{quiz?.title}</b></div>
            <div className="cm-quiz-meta">{quiz?.type} &bull; {quiz?.duration}</div>
          </div>
          <hr className="cm-quiz-divider" />
          <form className="cm-quiz-form">
            {quiz?.questions.map((q, qIdx) => (
              <div className="cm-quiz-question-row" key={q.id}>
                <div className="cm-quiz-question-meta">
                  <span className="cm-quiz-question-num">{qIdx + 1}.</span>
                  <span className="cm-quiz-question-text">{q.text}</span>
                  <span className="cm-quiz-question-points">{q.points} point</span>
                </div>
                <div className="cm-quiz-options">
                  {q.options.map((opt, oIdx) => (
                    <label className="cm-quiz-option" key={oIdx}>
                      <input
                        type="checkbox"
                        checked={answers[qIdx] === oIdx}
                        onChange={() => handleCheck(qIdx, oIdx)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </form>
        </div>
        <div className="cm-quiz-nav-row">
          <button className="cm-quiz-nav-btn" onClick={() => navigate(-1)}>&#60; Previous</button>
          <button className="cm-quiz-nav-btn" disabled={!allAnswered} onClick={() => navigate(-1)}>Next &#62;</button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 