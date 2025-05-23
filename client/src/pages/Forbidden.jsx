import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Access Forbidden</h2>
        <p className="text-gray-500 mb-6">You don't have permission to access this page.</p>
        <Link 
          to="/login" 
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
};

export default Forbidden; 