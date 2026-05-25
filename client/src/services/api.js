import axios from 'axios';

/**
 * Normalize API base URL for production.
 * VITE_API_URL should be the Railway backend URL including /api suffix.
 * Example: https://your-app.up.railway.app/api
 */
const normalizeBaseUrl = (url) => {
  if (!url || url === '/api') {
    return import.meta.env.DEV ? '/api' : '';
  }

  const trimmed = url.replace(/\/+$/, '');

  if (trimmed.endsWith('/api/api')) {
    return trimmed.replace(/\/api\/api$/, '/api');
  }

  if (!trimmed.endsWith('/api')) {
    return `${trimmed}/api`;
  }

  return trimmed;
};

const rawApiUrl = import.meta.env.VITE_API_URL;
export const API_BASE_URL = normalizeBaseUrl(rawApiUrl);

if (!import.meta.env.DEV && !rawApiUrl) {
  console.error(
    'VITE_API_URL is not set. Set it in Vercel to your Railway backend URL (e.g. https://your-app.up.railway.app/api)'
  );
}

export const API_TIMEOUT = 15000;

export class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null, originalError = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.originalError = originalError;
    this.isOperational = true;
  }
}

const getStoredToken = () => localStorage.getItem('token');

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const handleUnauthorized = () => {
  clearAuthStorage();

  const isAuthPage =
    window.location.pathname.startsWith('/login') ||
    window.location.pathname.startsWith('/signup');

  if (!isAuthPage) {
    window.location.href = '/login';
  }
};

const parseErrorResponse = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    return new ApiError(
      data?.message || getDefaultMessage(status),
      data?.statusCode || status,
      data?.errors || null,
      error
    );
  }

  if (error.code === 'ECONNABORTED') {
    return new ApiError('Request timed out. Please try again.', 408, null, error);
  }

  if (error.request) {
    return new ApiError(
      'Unable to reach the server. Check your connection and API URL configuration.',
      0,
      null,
      error
    );
  }

  return new ApiError(error.message || 'An unexpected error occurred', 500, null, error);
};

const getDefaultMessage = (status) => {
  const messages = {
    400: 'Invalid request',
    401: 'Unauthorized. Please sign in again.',
    403: 'You do not have permission to perform this action',
    404: 'Resource not found',
    409: 'Conflict with existing data',
    422: 'Validation failed',
    500: 'Internal server error',
  };

  return messages[status] || 'Something went wrong';
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(parseErrorResponse(error))
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const apiError = parseErrorResponse(error);

    if (apiError.statusCode === 401) {
      handleUnauthorized();
    }

    return Promise.reject(apiError);
  }
);

export const apiClient = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

export default api;
