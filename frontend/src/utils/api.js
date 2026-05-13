import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const memoryAPI = {
  getAll: (params = {}) => api.get('/memories', { params }),
  getOne: (id) => api.get(`/memories/${id}`),
  create: (data) => api.post('/memories', data),
  update: (id, data) => api.put(`/memories/${id}`, data),
  delete: (id) => api.delete(`/memories/${id}`),
  togglePin: (id) => api.post(`/memories/${id}/pin`),
};

export const statsAPI = {
  get: () => api.get('/stats'),
};

export const tagsAPI = {
  getAll: () => api.get('/tags'),
};

export default api;
