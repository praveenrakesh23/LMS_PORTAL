import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import './course-modules.css';

// Dummy quiz data (in real implementation, this would come from the backend)
const dummyQuiz = {
  id: 'quiz-1',
  title: 'Graded Assignment: Quiz 1 - Modern AI and its Applications',
  type: 'Graded Assignment',
  duration: 30, // in minutes
  totalPoints: 10,
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
      text: 'Which of the following is NOT a type of machine learning?',
      points: 1,
      options: [
        'Supervised Learning',
        'Unsupervised Learning',
        'Reinforcement Learning',
        'Deterministic Learning'
      ]
    }
  ]
};

const getQuizId = (quiz) => quiz.id || quiz.quiz.toLowerCase().replace(/\s+/g, '-');

const QuizPage = () => {
  const { id, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [warningCount, setWarningCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violations, setViolations] = useState([]);
  const [showScorecard, setShowScorecard] = useState(false);
  const [score, setScore] = useState(null);
  const fullscreenRef = useRef(null);
  const lastFocusTime = useRef(Date.now());
  const warningTimeoutRef = useRef(null);
  const [submittedAnswers, setSubmittedAnswers] = useState(null);

  // Fullscreen handling
  const enterFullscreen = async () => {
    try {
      if (fullscreenRef.current) {
        await fullscreenRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      addViolation('Failed to enter fullscreen mode');
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  };

  // Violation tracking
  const addViolation = (type) => {
    setViolations(prev => [...prev, { type, timestamp: new Date().toISOString() }]);
    setWarningCount(prev => prev + 1);
    
    if (warningCount >= 2) {
      handleSubmit(true); // Force submit on third violation
    }
  };

  // Tab switching detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        addViolation('Tab switching detected');
      }
    };

    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFocusTime.current > 1000) {
        addViolation('Window focus change detected');
      }
      lastFocusTime.current = now;
    };

    const handleBlur = () => {
      lastFocusTime.current = Date.now();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isActive]);

  // Copy-paste prevention
  useEffect(() => {
    const preventCopyPaste = (e) => {
      if (isActive) {
        e.preventDefault();
        addViolation('Copy-paste attempt detected');
      }
    };

    const preventContextMenu = (e) => {
      if (isActive) {
        e.preventDefault();
        addViolation('Context menu attempt detected');
      }
    };

    const preventDevTools = (e) => {
      if (e.ctrlKey && (e.key === 'Shift' || e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        addViolation('DevTools access attempt detected');
      }
    };

    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventDevTools);

    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventDevTools);
    };
  }, [isActive]);

  // Browser extension detection
  useEffect(() => {
    const checkForExtensions = () => {
      // Check for common extension patterns
      const extensionPatterns = [
        'chrome-extension://',
        'moz-extension://',
        'safari-extension://'
      ];

      const hasExtensions = extensionPatterns.some(pattern => 
        window.location.href.includes(pattern)
      );

      if (hasExtensions) {
        addViolation('Browser extension detected');
      }
    };

    checkForExtensions();
  }, []);

  // Timer functionality
  useEffect(() => {
    if (!quiz || !isActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, isActive]);

  // Auto-save functionality
  useEffect(() => {
    if (!quiz || !isActive) return;

    const saveInterval = setInterval(() => {
      saveProgress();
    }, 30000);

    return () => clearInterval(saveInterval);
  }, [quiz, answers, isActive]);

  // Warning before leaving
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isActive) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isActive]);

  // Initialize quiz data
  useEffect(() => {
    const initializeQuiz = () => {
      try {
        // Check if quiz is already completed
        const assignments = JSON.parse(localStorage.getItem('assignments') || '{}');
        const courseAssignments = assignments[id] || { current: [], completed: [] };
        const completedQuiz = courseAssignments.completed.find(q => getQuizId(q) === quizId);
        
        if (completedQuiz) {
          // Ensure questions array exists
          const quizWithQuestions = {
            ...completedQuiz,
            questions: completedQuiz.questions || []
          };
          setQuiz(quizWithQuestions);
          setSubmittedAnswers(completedQuiz.submittedAnswers || {});
          setScore(completedQuiz.score);
          setIsSubmitted(true);
          setShowScorecard(true);
          setIsLoading(false);
          return;
        }

        // If not completed, load from current assignments
        const currentQuiz = courseAssignments.current.find(q => getQuizId(q) === quizId);
        if (currentQuiz) {
          // Ensure questions array exists
          const quizWithQuestions = {
            ...currentQuiz,
            questions: currentQuiz.questions || []
          };
          setQuiz(quizWithQuestions);
          setTimeLeft(currentQuiz.duration * 60);
          setIsLoading(false);
          return;
        }

        // If not found in either list, use dummy data
        const dummyQuiz = {
          id: quizId,
          title: "Social Media Marketing Quiz",
          type: "Multiple Choice",
          duration: 30,
          questions: [
            {
              id: 1,
              text: "What is the primary goal of social media marketing?",
              options: [
                { id: 'a', text: "To increase website traffic" },
                { id: 'b', text: "To build brand awareness" },
                { id: 'c', text: "To generate leads" },
                { id: 'd', text: "All of the above" }
              ],
              correctAnswer: 'd',
              points: 1
            },
            {
              id: 2,
              text: "Which platform is best for B2B marketing?",
              options: [
                { id: 'a', text: "Instagram" },
                { id: 'b', text: "LinkedIn" },
                { id: 'c', text: "TikTok" },
                { id: 'd', text: "Snapchat" }
              ],
              correctAnswer: 'b',
              points: 1
            },
            {
              id: 3,
              text: "What is the ideal post length for Twitter?",
              options: [
                { id: 'a', text: "280 characters" },
                { id: 'b', text: "500 characters" },
                { id: 'c', text: "1000 characters" },
                { id: 'd', text: "No limit" }
              ],
              correctAnswer: 'a',
              points: 1
            }
          ]
        };

        // Add to current assignments if not exists
        if (!courseAssignments.current.some(q => getQuizId(q) === quizId)) {
          courseAssignments.current.push(dummyQuiz);
          assignments[id] = courseAssignments;
          localStorage.setItem('assignments', JSON.stringify(assignments));
        }

        setQuiz(dummyQuiz);
        setTimeLeft(dummyQuiz.duration * 60);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing quiz:', error);
        setIsLoading(false);
      }
    };

    initializeQuiz();
  }, [id, quizId]);

  const saveProgress = useCallback(() => {
    if (!quiz || !isActive) return;

    const progress = {
      answers,
      timeLeft,
      lastSaved: new Date().toISOString(),
      violations
    };

    localStorage.setItem(`quiz_progress_${quizId}`, JSON.stringify(progress));
    setLastSaved(new Date());
  }, [quiz, answers, timeLeft, quizId, isActive, violations]);

  const handleCheck = (qIdx, oIdx) => {
    setAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    saveProgress();
  };

  const calculateScore = () => {
    if (!quiz || !answers) return null;
    
    let correctAnswers = 0;
    let totalQuestions = quiz.questions.length;
    
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const percentage = (correctAnswers / totalQuestions) * 100;
    const isPassing = percentage >= 70; // 70% passing threshold
    
    return {
      correctAnswers,
      totalQuestions,
      percentage,
      isPassing,
      grade: getGrade(percentage)
    };
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const handleSubmit = async (forced = false) => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    try {
      // Calculate score
      const scoreData = calculateScore();
      setScore(scoreData);
      
      // Save quiz completion status
      const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '{}');
      completedQuizzes[quiz.id] = {
        score: scoreData,
        completedAt: new Date().toISOString(),
        courseId: id,
        moduleId: quizId,
        violations: violations
      };
      localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
      
      // Update course progress
      const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      if (!courseProgress[id]) {
        courseProgress[id] = { completedModules: [] };
      }
      if (!courseProgress[id].completedModules.includes(quizId)) {
        courseProgress[id].completedModules.push(quizId);
      }
      localStorage.setItem('courseProgress', JSON.stringify(courseProgress));

      // Update assignments list
      const assignments = JSON.parse(localStorage.getItem('assignments') || '{}');
      if (!assignments[id]) {
        assignments[id] = {
          current: [],
          completed: []
        };
      }
      
      // Move the quiz from current to completed
      const currentIndex = assignments[id].current.findIndex(a => a.id === quiz.id);
      if (currentIndex !== -1) {
        const completedQuiz = assignments[id].current.splice(currentIndex, 1)[0];
        completedQuiz.status = 'completed';
        completedQuiz.score = scoreData;
        completedQuiz.completedAt = new Date().toISOString();
        assignments[id].completed.push(completedQuiz);
      } else {
        // If quiz not found in current, add it to completed
        const completedQuiz = {
          id: quiz.id,
          quiz: quiz.title,
          title: quiz.title,
          questions: quiz.questions.length,
          points: quiz.totalPoints,
          status: 'completed',
          score: scoreData,
          completedAt: new Date().toISOString()
        };
        assignments[id].completed.push(completedQuiz);
      }
      localStorage.setItem('assignments', JSON.stringify(assignments));

      // Exit fullscreen if active
      if (isFullscreen) {
        await exitFullscreen();
      }

      // Show scorecard
      setShowScorecard(true);
      setIsActive(false);

      // Clear saved progress
      localStorage.removeItem(`quiz_progress_${quizId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const handleBackToAssignments = () => {
    navigate(`/courses/${id}/assignments`);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="cm-quiz-container">
        <div className="cm-quiz-loading">
          <div className="cm-quiz-loading-spinner"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || !Array.isArray(quiz.questions)) {
    return (
      <div className="cm-quiz-container">
        <div className="cm-quiz-error">
          <p>Quiz not found or invalid quiz data</p>
          <button className="cm-quiz-nav-btn" onClick={() => navigate(`/courses/${id}/assignments`)}>
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  const allAnswered = quiz.questions.every((q, idx) => answers[idx] !== undefined);

  if (showScorecard && score) {
    return (
      <div className="cm-quiz-scorecard">
        <div className="cm-quiz-scorecard-content">
          <div className="cm-quiz-scorecard-header">
            <h2>Quiz Results</h2>
            <div className={`cm-quiz-score-badge ${score.isPassing ? 'passing' : 'failing'}`}>
              {score.percentage}%
            </div>
          </div>
          
          <div className="cm-quiz-score-details">
            <div className="cm-quiz-score-item">
              <span>Grade:</span>
              <span className={`grade ${score.grade.toLowerCase()}`}>{score.grade}</span>
            </div>
            <div className="cm-quiz-score-item">
              <span>Correct Answers:</span>
              <span>{score.correctAnswers} / {score.totalQuestions}</span>
            </div>
            <div className="cm-quiz-score-item">
              <span>Status:</span>
              <span className={score.isPassing ? 'passing' : 'failing'}>
                {score.isPassing ? 'Passed' : 'Failed'}
              </span>
            </div>
            {violations.length > 0 && (
              <div className="cm-quiz-score-item">
                <span>Violations:</span>
                <span className="violations">{violations.length}</span>
              </div>
            )}
          </div>

          <div className="cm-quiz-scorecard-actions">
            <button 
              className="cm-quiz-back-btn"
              onClick={handleBackToAssignments}
            >
              Back to Assignments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cm-root" ref={fullscreenRef}>
      <DashboardHeader />
      <div className="cm-quiz-container">
        <div className="cm-quiz-breadcrumb">
          <span className="cm-title-bar"></span>
          <span className="cm-quiz-breadcrumb-main">Assignments</span>
          <span className="cm-quiz-breadcrumb-sep">&gt;</span>
          <span className="cm-quiz-breadcrumb-current">Current</span>
        </div>
        <div className="cm-quiz-card">
          <div className="cm-quiz-header">
            <div className="cm-quiz-title-row">
              <div className="cm-quiz-title"><b>{quiz.title}</b></div>
              <div className="cm-quiz-meta">{quiz.type} &bull; {quiz.duration} min</div>
            </div>
            <div className="cm-quiz-timer">
              Time Remaining: {formatTime(timeLeft)}
            </div>
            {lastSaved && (
              <div className="cm-quiz-last-saved">
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
            {warningCount > 0 && (
              <div className="cm-quiz-warning">
                Warning: {warningCount} violation{warningCount !== 1 ? 's' : ''} detected
              </div>
            )}
          </div>
          <hr className="cm-quiz-divider" />
          <form className="cm-quiz-form" onSubmit={(e) => e.preventDefault()}>
            {quiz.questions.map((q, qIdx) => (
              <div className="cm-quiz-question-row" key={q.id}>
                <div className="cm-quiz-question-meta">
                  <span className="cm-quiz-question-num">{qIdx + 1}.</span>
                  <span className="cm-quiz-question-text">{q.text}</span>
                  <span className="cm-quiz-question-points">{q.points} point{q.points !== 1 ? 's' : ''}</span>
                </div>
                <div className="cm-quiz-options">
                  {q.options.map((opt, oIdx) => (
                    <label className="cm-quiz-option" key={oIdx}>
                      <input
                        type="radio"
                        name={`question-${q.id}`}
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
          <button 
            className="cm-quiz-nav-btn" 
            onClick={() => {
              if (window.confirm('Are you sure you want to leave? Your progress will be saved.')) {
                navigate(-1);
              }
            }}
          >
            &#60; Previous
          </button>
          <button 
            className="cm-quiz-nav-btn" 
            disabled={!allAnswered || isSubmitted} 
            onClick={() => handleSubmit(false)}
          >
            {isSubmitted ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 