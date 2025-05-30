import React, { useState } from 'react';
import './login-style.css';
import GradCapIcon from '../assets/login/login_grad_cap.svg';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../AuthContext';
import { useContext } from 'react';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
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
        
        // Map the role from backend to frontend routes
        const roleMap = {
          'ROLE_ADMIN': 'admin',
          'ROLE_STUDENT': 'student',
          'ROLE_INSTRUCTOR': 'instructor'
        };
        
        const mappedRole = roleMap[role];
        if (mappedRole) {
          navigate(`/${mappedRole}/dashboard`);
        } else {
          toast.error('Unknown user role. Please contact support.');
        }
      } else {
        toast.error(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      toast.error('Network error. Please check your connection.');
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
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Please sign in to your account</p>

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
