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
        // Get token from auth context storage
        const authData = localStorage.getItem('auth');
        if (authData) {
            try {
                const { token } = JSON.parse(authData);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Failed to parse auth data:', error);
            }
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
            // Clear auth data on unauthorized response
            localStorage.removeItem('auth');
            // Optionally redirect to login or show message
            // window.location.href = '/';
        }
        if (error.response?.status === 404) {
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default api;