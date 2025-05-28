// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PrivateRoute from './PrivateRoute'; // 🔒 adjust path if needed
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

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />  {/* OR <Login /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/courses/:id/modules" element={<CourseModules />} />
          <Route path="/courses/:id/assignments/:quizId" element={<QuizPage />} />
          <Route path="/courses/:id/grades" element={<GradesPage />} />
          <Route path="/courses/:id/announcements" element={<AnnouncementsPage />} />
          <Route path="/courses/:id/assignments" element={<AssignmentsPage />} />
          <Route path="/courses/:id/modules/:moduleId/lessons/:lessonId" element={<LessonPage />} />

          <Route path="/student/dashboard" element={<StudentDashboard />} />

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

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
