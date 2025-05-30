import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear browser history when component mounts
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = function() {
        window.history.pushState(null, '', window.location.href);
      };
    }
  }, []);

  if (!isAuthenticated) {
    // Use replace: true to prevent adding to browser history
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Use replace: true to prevent adding to browser history
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default PrivateRoute; 