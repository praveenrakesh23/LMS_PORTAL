import React, { useState } from 'react';
import './login-style.css';
import GradCapIcon from '../assets/login/login_grad_cap.svg';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

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
      const credentials = {
        email,
        password
      };

      const response = await login(credentials);
      console.log('Login response:', response); // Debug log
      
      toast.success('Login successful!');
      
      // Redirect based on user role
      const role = response.user.role;
      console.log('Redirecting to:', `/${role}/dashboard`); // Debug log
      navigate(`/${role}/dashboard`, { replace: true });
    } catch (err) {
      console.error('Login error:', err); // Debug log
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
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
