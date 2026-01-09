import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Lite mode: no auth interceptors, no token injection
export default apiClient;

