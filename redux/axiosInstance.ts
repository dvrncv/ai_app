import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../constant';

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
  }
  return config;
});

instance.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post(
          `${BASE_URL}/auth/token?token=${token}`
        );
        await AsyncStorage.setItem('token', response.data.token);
        return instance.request(originalRequest);
      } catch (e) {
        console.log('Token error:', e);
      }
    }
    throw error;
  }
);

export default instance;