import axios from 'axios';

const API_BASE_URL = 'https://localhost:7167/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set token if exists
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Task APIs
export const taskService = {
  getAll: (status = null, page = 1, pageSize = 2) => {
    const params = {
      page,
      pageSize
    };
    if (status) params.status = status;

    return api.get('/tasks', { params });
  },
  getById: (id) => api.get(`/Tasks/${id}`),
  create: (task) => api.post('/Tasks', task),
  update: (id, task) => api.put(`/Tasks/${id}`, task),
  delete: (id) => api.delete(`/Tasks/${id}`)
};
// Auth APIs
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials)
};
export default api;
