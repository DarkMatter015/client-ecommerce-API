import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

api.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token")

    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);