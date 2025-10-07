import axios from 'axios';


const resolvedBaseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
    baseURL: resolvedBaseURL.replace(/\/$/, ''),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Example: Attach token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optionally redirect to login or show message
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;