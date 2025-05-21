// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import { Toaster } from 'react-hot-toast';
//import StudentDashboard from './pages/student/StudentDashboard';
//import AdminDashboard from './pages/admin/AdminDashboard';
//import InstructorDashboard from './pages/instructor/InstructorDashboard';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
      </Routes>
    </Router>
    <Toaster position="top-right" />
    </>
  );
}

export default App;
