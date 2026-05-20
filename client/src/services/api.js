import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('placemint_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('placemint_token');
      localStorage.removeItem('placemint_user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ======================== Auth API ========================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ======================== Jobs API ========================
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/my-jobs'),
  approve: (id) => api.put(`/jobs/${id}/approve`),
};

// ======================== Applications API ========================
export const applicationsAPI = {
  apply: (jobId) => api.post(`/applications/${jobId}/apply`),
  getMyApplications: () => api.get('/applications/my-applications'),
  getJobApplicants: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
  withdraw: (id) => api.put(`/applications/${id}/withdraw`),
};

// ======================== Admin API ========================
export const adminAPI = {
  getStudents: () => api.get('/admin/students'),
  getCompanies: () => api.get('/admin/companies'),
  getAnalytics: () => api.get('/admin/analytics'),
  verifyUser: (userId) => api.put(`/admin/verify/${userId}`),
  toggleActive: (userId) => api.put(`/admin/toggle-active/${userId}`),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export default api;
