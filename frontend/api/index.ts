import axios from 'axios';
import { store } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';

const api = axios.create({
  baseURL: 'http://localhost:3000', // TODO: read from .env
  withCredentials: true
});

// if we ever get a 401, clear auth state immediately
// (navigation will handle redirecting to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
