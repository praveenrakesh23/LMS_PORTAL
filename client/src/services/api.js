import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      // Only redirect to login if it's not a login request
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Course Services
export const courseService = {
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  getCourse: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  enrollInCourse: async (id) => {
    const response = await api.post(`/courses/${id}/enroll`);
    return response.data;
  },
};

// Module Services
export const moduleService = {
  getCourseModules: async (courseId) => {
    const response = await api.get(`/modules/course/${courseId}`);
    return response.data;
  },

  getModule: async (id) => {
    const response = await api.get(`/modules/${id}`);
    return response.data;
  },

  createModule: async (moduleData) => {
    const response = await api.post('/modules', moduleData);
    return response.data;
  },

  updateModule: async (id, moduleData) => {
    const response = await api.put(`/modules/${id}`, moduleData);
    return response.data;
  },

  deleteModule: async (id) => {
    const response = await api.delete(`/modules/${id}`);
    return response.data;
  },
};

export default api; 