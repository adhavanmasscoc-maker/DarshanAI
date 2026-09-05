import axios from 'axios';

// Get backend API URL
export const getBaseURL = () => {
  const envUrl =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL;

  if (envUrl && envUrl.startsWith('http')) {
    return envUrl.endsWith('/api')
      ? envUrl
      : `${envUrl}/api`;
  }

  // Render production
  if (
    typeof window !== 'undefined' &&
    window.location.hostname.includes('onrender.com')
  ) {
    return 'https://darshanai-backend.onrender.com/api';
  }

  // Local development
  return 'http://localhost:8000/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('darshanai_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('darshanai_token');
      localStorage.removeItem('darshanai_user');

      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;