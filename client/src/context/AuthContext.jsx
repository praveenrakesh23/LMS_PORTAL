const logout = () => {
  // Clear all auth data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
  setIsAuthenticated(false);
  
  // Clear browser history and redirect to login
  if (window.history && window.history.pushState) {
    window.history.pushState(null, '', '/login');
    window.onpopstate = function() {
      window.history.pushState(null, '', '/login');
    };
  }
  
  // Force navigation to login page
  window.location.href = '/login';
}; 