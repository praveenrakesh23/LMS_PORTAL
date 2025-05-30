import React, { useState } from 'react';
import './login-style.css';
import GradCapIcon from '../assets/login/login_grad_cap.svg';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../AuthContext';
import { useContext } from 'react';

// Dummy credentials for testing
const DUMMY_USERS = {
  'student@example.com': {
    password: 'student123',
    role: 'ROLE_STUDENT',
    name: 'John Student',
    token: 'student-token-123'
  },
  'admin@example.com': {
    password: 'admin123',
    role: 'ROLE_ADMIN',
    name: 'Admin User',
    token: 'admin-token-456'
  },
  'instructor@example.com': {
    password: 'instructor123',
    role: 'ROLE_INSTRUCTOR',
    name: 'Sarah Instructor',
    token: 'instructor-token-789'
  }
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const validateInputs = () => {
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return false;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);

    try {
      // Check for dummy credentials first
      const dummyUser = DUMMY_USERS[email];
      if (dummyUser) {
        if (dummyUser.password === password) {
          // Create a user object with the role
          const userData = {
            email,
            name: dummyUser.name,
            role: dummyUser.role.toLowerCase().replace('role_', '') // Convert ROLE_STUDENT to student
          };
          
          // Use the login function from AuthContext
          login(dummyUser.token, userData);
          
          toast.success('Login successful!');
          
          // Always redirect to dashboard after fresh login
          navigate(`/${userData.role}/dashboard`, { replace: true });
        } else {
          toast.error('Invalid password. Please try again.');
        }
        setLoading(false);
        return;
      } else {
        toast.error('Invalid email or username. Please try again.');
        setLoading(false);
        return;
      }

      // If not a dummy user, proceed with API call
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, role, user, message } = data;
        
        // Use the login function from AuthContext
        login(token, user);
        
        toast.success(message || 'Login successful!');
        
        // Always redirect to dashboard after fresh login
        navigate(`/${role.toLowerCase()}/dashboard`, { replace: true });
      } else {
        // Show the specific error message from the server
        toast.error(data.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      // Only show network error for actual network issues
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-background">
          <div className="gradient-overlay"></div>

          <div className="logo-section">
            <div className="logo-circle">
              <img src={GradCapIcon} alt="Graduation Cap" className="logo-icon" />
            </div>
            <h1 className="logo-text">LMS</h1>
          </div>

          <div className="login-card">
            <div className="login-content">
              <h2 className="login-title">Login</h2>
              <p className="login-subtitle">Prepare yourself for a future full of stars</p>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="login-input"
                    disabled={loading}
                  />
                </div>

                <div className="form-group password-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="login-input"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button type="submit" className="login-button" disabled={loading}>
                  {loading ? <div className="spinner"></div> : 'Sign in'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
