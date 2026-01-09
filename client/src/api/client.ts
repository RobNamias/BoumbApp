import axios from 'axios';



// Lite mode: no auth interceptors, no token injection
const apiClient = axios.create({
  baseURL: '/', // No backend in gh-pages
  headers: { 'Content-Type': 'application/json' },
});

// Mock interceptor to log requests instead of failing (optional, or just let them fail)
apiClient.interceptors.request.use((config) => {
  console.log('[Demo Mode] API Call blocked:', config.url);
  // You might want to throw an error or return a mock response here to prevent 404s
  // For now, let's just allow it but we know it will 404 provided there's no handler.
  // Better strategy: Reject all requests to cleanly handle them in catch blocks
  return Promise.reject(new Error("Demo Mode: Backend unavailable"));
});

export default apiClient;

