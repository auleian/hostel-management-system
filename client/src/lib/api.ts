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
        // Support two storage shapes: a simple 'token' key or an 'auth' JSON blob used by the context
        let token = localStorage.getItem('token');
        if (!token) {
            try {
                const authRaw = localStorage.getItem('auth');
                if (authRaw) {
                    const parsed = JSON.parse(authRaw);
                    token = parsed?.token || null;
                }
            } catch (e) {
                token = null;
            }
        }

        if (token) {
            config.headers = config.headers || {};
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
        if (error.response?.status === 404) {
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default api;