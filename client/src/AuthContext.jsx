import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = getCookie('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => getCookie('token') || null);
  const [userRole, setUserRole] = useState(() => getCookie('userRole') || null);

  // Logout function clears state and cookies
  const logout = () => {
    setToken(null);
    setUser(null);
    setUserRole(null);
    deleteCookie('token');
    deleteCookie('user');
    deleteCookie('userRole');
  };

  // Login function sets state and cookies
  const login = (token, user) => {
    setToken(token);
    setUser(user);
    
    // Set cookies with appropriate expiration
    setCookie('token', token, 1); // 1 day expiration
    setCookie('user', JSON.stringify(user), 1);
    
    // Extract role from token if available
    try {
      const decoded = jwtDecode(token);
      const role = decoded.role || user.role;
      setUserRole(role);
      setCookie('userRole', role, 1);
    } catch (err) {
      console.warn('Failed to decode JWT token:', err);
    }
  };

  // Helper function to check if user has specific role
  const hasRole = (role) => {
    return userRole === role;
  };

  // Helper function to get user ID
  const getUserId = () => {
    return user?.id;
  };

  // Helper function to get user name
  const getUserName = () => {
    return user?.name;
  };

  // Auto logout timer
  useEffect(() => {
    if (!token) return;

    let timerId;

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
      } else {
        setUser(null);
        setToken(null);
        setUserRole(null);
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
