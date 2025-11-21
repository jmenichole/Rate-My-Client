import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Clients
export const getClients = () => api.get('/clients');
export const getClient = (id) => api.get(`/clients/${id}`);
export const searchClients = (query) => api.get(`/clients/search/${query}`);
export const createClient = (data) => api.post('/clients', data);
export const getClientStats = (id) => api.get(`/clients/${id}/stats`);

// Reviews
export const getReviews = () => api.get('/reviews');
export const getReview = (id) => api.get(`/reviews/${id}`);
export const getClientReviews = (clientId) => api.get(`/reviews/client/${clientId}`);
export const createReview = (data) => api.post('/reviews', data);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

// AI
export const analyzeJobPost = (jobPostText) => api.post('/ai/analyze-job-post', { jobPostText });
export const getAIScans = () => api.get('/ai/scans');

export default api;
