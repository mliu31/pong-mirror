import axios from 'axios';
import { logout } from '@/redux/slices/authSlice';

const api = axios.create({
  baseURL: 'http://localhost:3000', // TODO: read from .env
  withCredentials: true
});

export default api;
