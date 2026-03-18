import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (user) => api.post('/users', user),
};

export const applicationService = {
  getAllByUser: (userId) => api.get(`/applications/user/${userId}`),
  getById: (id) => api.get(`/applications/${id}`),
  create: (app) => api.post('/applications', app),
  update: (id, app) => api.put(`/applications/${id}`, app),
  delete: (id) => api.delete(`/applications/${id}`),
  getRecent: (userId, since) => api.get(`/applications/user/${userId}/recent`, { params: { since } }),
  search: (userId, company) => api.get(`/applications/user/${userId}/search`, { params: { company } }),
  countByStatus: (userId, status) => api.get(`/applications/user/${userId}/count`, { params: { status } }),
};

export default api;
