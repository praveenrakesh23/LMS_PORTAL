import React, { useState } from 'react';
import './login-style.css';
import GradCapIcon from '../assets/login/login_grad_cap.svg';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // for redirecting after login

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email || !password) {
      alert('Please fill in both email and password.');
      return false;
    }
    if (!email.includes('@')) {
      alert('Email must include "@" symbol.');
      return false;
    }
    if (password.length < 8) {
      alert('Password must be at least 8 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateInputs()) return;

    setLoading(true);

    try {
      // Replace the below dummy URL with your real backend API endpoint
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login success: Redirect to dashboard
        navigate('/dashboard');
      } else {
        // Login failed: show error from backend
        alert(data.message || 'Login failed.');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
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
              <p className="login-subtitle">
                Prepare yourself for a future full of stars
              </p>

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
                    type={showPassword ? "text" : "password"}
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

                {/* Error Message */}
                {error && <p className="error-message">{error}</p>}

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? <div className="spinner"></div> : 'LOGIN'}
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
