import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Forbidden from './pages/Forbidden';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { token, user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

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

  if (!token || !user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Role not authorized
    return <Forbidden />;
  }

  // Authorized
  return children;
};

export default PrivateRoute;
