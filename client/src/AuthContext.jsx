import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // Logout function clears state and storage
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Login function sets state and storage
  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
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
          // Optionally redirect to login here if you use react-router-dom navigate outside components
        }, timeout);
      } else {
        logout(); // token already expired
      }
    } catch (err) {
      console.warn('Failed to decode JWT token or missing exp:', err);
      // If no expiry, optionally do nothing or logout immediately
    }

    // Cleanup timeout on unmount or token change
    return () => clearTimeout(timerId);
  }, [token]);

  // Sync state if localStorage changed (e.g. user logged in in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } else {
        setUser(null);
        setToken(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
