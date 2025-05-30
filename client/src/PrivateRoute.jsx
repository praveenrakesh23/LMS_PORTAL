import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Forbidden from './pages/Forbidden';

// Dummy tokens for development
const DUMMY_TOKENS = {
  'student-token-123': 'student',
  'admin-token-456': 'admin',
  'instructor-token-789': 'instructor'
};

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { token, user, isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate checking authentication status
    const checkAuth = async () => {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    };
    checkAuth();
  }, [token, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check for dummy tokens first
  if (token && DUMMY_TOKENS[token]) {
    const dummyRole = DUMMY_TOKENS[token];
    if (allowedRoles.length === 0 || allowedRoles.includes(dummyRole)) {
      return children;
    }
    return <Forbidden />;
  }

  if (!isAuthenticated || !token || !user) {
    // Not logged in - redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Role not authorized
    return <Forbidden />;
  }

  // Authorized
  return children;
};

export default PrivateRoute;
