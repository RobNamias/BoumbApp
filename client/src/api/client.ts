// Local Mode Client Stub
// No network requests are made in this configuration.

const apiClient = {
  get: () => Promise.reject(new Error("Network disabled")),
  post: () => Promise.reject(new Error("Network disabled")),
  put: () => Promise.reject(new Error("Network disabled")),
  delete: () => Promise.reject(new Error("Network disabled")),
};

export default apiClient;
