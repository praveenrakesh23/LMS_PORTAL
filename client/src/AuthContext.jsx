import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

// Cookie helper functions
const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict${window.location.protocol === 'https:' ? ';Secure' : ''}`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

// Dummy tokens for development
const DUMMY_TOKENS = {
  'student-token-123': 'student',
  'admin-token-456': 'admin',
  'instructor-token-789': 'instructor'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = getCookie('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => getCookie('token') || null);
  const [userRole, setUserRole] = useState(() => getCookie('userRole') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedToken = getCookie('token');
    const savedUser = getCookie('user');
    return !!(savedToken && savedUser);
  });

  // Logout function clears state and cookies
  const logout = () => {
    setToken(null);
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    deleteCookie('token');
    deleteCookie('user');
    deleteCookie('userRole');
    
    // Clear browser history and redirect to login
    window.history.pushState(null, '', '/login');
    window.location.reload();
  };

  // Login function sets state and cookies
  const login = (token, user) => {
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    
    // Set cookies with appropriate expiration
    setCookie('token', token, 1); // 1 day expiration
    setCookie('user', JSON.stringify(user), 1);
    
    // Handle role setting
    let role;
    
    // Check if it's a dummy token
    if (DUMMY_TOKENS[token]) {
      role = DUMMY_TOKENS[token];
    } else {
      // Try to extract role from token or user object
      try {
        const decoded = jwtDecode(token);
        role = decoded.role || user.role;
      } catch (err) {
        role = user.role;
      }
    }
    
    // Remove 'ROLE_' prefix if present
    role = role.toLowerCase().replace('role_', '');
    
    setUserRole(role);
    setCookie('userRole', role, 1);

    // Clear browser history after successful login
    window.history.pushState(null, '', '/');
  };

  // Helper function to check if user has specific role
  const hasRole = (role) => {
    return userRole === role.toLowerCase();
  };

  // Helper function to get user ID
  const getUserId = () => {
    return user?.id;
  };

  // Helper function to get user name
  const getUserName = () => {
    return user?.name;
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (!isAuthenticated) {
        window.location.href = '/login';
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  // Auto logout timer
  useEffect(() => {
    if (!token) return;

    let timerId;

    // Skip token expiration check for dummy tokens
    if (DUMMY_TOKENS[token]) {
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000; // JWT exp is in seconds
      const currentTime = Date.now();
      const timeout = expiryTime - currentTime;

      if (timeout > 0) {
        timerId = setTimeout(() => {
          logout();
          alert('Session expired. Please login again.');
        }, timeout);
      } else {
        logout(); // token already expired
      }
    } catch (err) {
      console.warn('Failed to decode JWT token or missing exp:', err);
    }

    return () => clearTimeout(timerId);
  }, [token]);

  // Sync state if cookies changed
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = getCookie('user');
      const savedToken = getCookie('token');
      const savedRole = getCookie('userRole');
      
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setUserRole(savedRole);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setToken(null);
        setUserRole(null);
        setIsAuthenticated(false);
      }
    };

    // Check auth state every minute
    const intervalId = setInterval(checkAuth, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      userRole,
      isAuthenticated,
      login, 
      logout,
      hasRole,
      getUserId,
      getUserName
    }}>
      {children}
    </AuthContext.Provider>
  );
};
