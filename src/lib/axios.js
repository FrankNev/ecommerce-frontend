import axios from 'axios';

export const authAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
});

export const ecommerceAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ECOMMERCE_API_URL,
});

// Interceptor para agregar token automáticamente
const addAuthToken = (config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authAPI.interceptors.request.use(addAuthToken);
ecommerceAPI.interceptors.request.use(addAuthToken);