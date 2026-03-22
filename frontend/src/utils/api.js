import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

console.log('🔌 API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log todas las peticiones y respuestas
api.interceptors.request.use(
  (config) => {
    console.log(`📤 [${config.method.toUpperCase()}] ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.status}] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default api;
