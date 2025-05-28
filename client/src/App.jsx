// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PrivateRoute from './PrivateRoute'; // 🔒 adjust path if needed
import Login from './pages/login';
import StudentDashboard from './pages/student/dashboard';
import AdminDashboard from './pages/admin/dashboard';
import InstructorDashboard from './pages/instructor/dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />  {/* OR <Login /> */}
          <Route path="/login" element={<Login />} />

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
