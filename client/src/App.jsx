// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PrivateRoute from './PrivateRoute';
import Login from './pages/login';
import StudentDashboard from './pages/student/dashboard';
import AdminDashboard from './pages/admin/dashboard';
import InstructorDashboard from './pages/instructor/dashboard';
import NotFound from './pages/NotFound';
import CourseDetails from './pages/student/course-details';
import CourseModules from './pages/student/CourseModules';
import QuizPage from './pages/student/QuizPage';
import GradesPage from './pages/student/GradesPage';
import AnnouncementsPage from './pages/student/AnnouncementsPage';
import AssignmentsPage from './pages/student/AssignmentsPage';
import LessonPage from './pages/student/LessonPage';
import MyPurchasesPage from './pages/student/MyPurchasesPage';
import AccomplishmentsPage from './pages/student/AccomplishmentsPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          
          {/* Student Routes */}
          <Route
            path="/courses/:id"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <CourseDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/:id/modules"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <CourseModules />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/:id/assignments/:quizId"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <QuizPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/:id/grades"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <GradesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/:id/announcements"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <AnnouncementsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/:id/assignments"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <AssignmentsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/:id/modules/:moduleId/lessons/:lessonId"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <LessonPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/MyPurchasesPage"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <MyPurchasesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/accomplishments"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <AccomplishmentsPage />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Instructor Routes */}
          <Route
            path="/instructor/dashboard"
            element={
              <PrivateRoute allowedRoles={['instructor']}>
                <InstructorDashboard />
              </PrivateRoute>
            }
          />

          {/* Catch all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
