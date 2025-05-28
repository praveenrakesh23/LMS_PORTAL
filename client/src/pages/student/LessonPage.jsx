import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import './course-modules.css'; // Reuse styles

const dummyLessonData = {
  id: 'lesson-1',
  title: 'Introduction to Artificial Intelligence and Machine Learning',
  moduleId: 'module-1',
  moduleTitle: 'Module 1',
  courseId: '1',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Example video URL
  transcript: [
    { time: '0:00', text: 'Hello, my name is Miguel and I will be your instructor for this course. We will start with an introduction to artificial intelligence and machine learning. This lesson will help us realize the value of clean data. From there, we will learn some tools and techniques to help us make the most out of our data.' },
    { time: '1:28', text: 'Throughout this course, we will gain hands-on experience in retrieving data from different sources and conducting exploratory data analysis and feature engineering. It is highly recommended that you have some background in statistics and Python programming, but if you don\'t have it, that\'s okay. You might find some of the content challenging at times, but stick around. We watch some of the video lessons if you need to and engage your peers and instructors in the discussion forums. We are in this together and we will help one another. Now, one of the main outcomes of this course is that you will gain experience using the tools and techniques that will help you leverage the data sets you feel really passionate about.' },
    // Add more transcript entries as needed
  ],
  notesLink: '#' // Dummy link for notes
};

const LessonPage = () => {
  const { id: courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    // For backend integration later:
    // fetch(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`).then(res => res.json()).then(setLesson);
    // Update dummy data with actual route params if needed for consistency
    setLesson({ ...dummyLessonData, courseId, moduleId, id: lessonId });
  }, [courseId, moduleId, lessonId]);

  if (!lesson) return <div>Loading...</div>;

  return (
    <div className="cm-root">
      <DashboardHeader />
      <div className="cm-lesson-container">
        <button className="cm-back-btn" onClick={() => navigate(-1)}>&larr; Back to Modules</button>
        <div className="cm-lesson-breadcrumb">
          <span className="cm-title-bar"></span>
          <span className="cm-lesson-breadcrumb-main cm-breadcrumb-link" onClick={() => navigate(`/courses/${courseId}/modules`)}>Modules</span>
          <span className="cm-lesson-breadcrumb-sep">&gt;</span>
          <span className="cm-lesson-breadcrumb-module cm-breadcrumb-link" onClick={() => navigate(`/courses/${courseId}/modules`)}>{lesson.moduleTitle}</span>
          <span className="cm-lesson-breadcrumb-sep">&gt;</span>
          <span className="cm-lesson-breadcrumb-current">{lesson.title}</span>
        </div>
        <div className="cm-lesson-content-card">
          <h2 className="cm-lesson-title">{lesson.title}</h2>
          <div className="cm-lesson-video-player">
            <video controls width="100%" height="auto">
              <source src={lesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="cm-lesson-transcript">
            <h3>Transcript</h3>
            {lesson.transcript.map((t, idx) => (
              <div className="cm-lesson-transcript-row" key={idx}>
                <span className="cm-lesson-timestamp">{t.time}</span>
                <span className="cm-lesson-transcript-text">{t.text}</span>
              </div>
            ))}
          </div>
          <div className="cm-lesson-notes">
            <a href={lesson.notesLink}>View all Notes</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage; 