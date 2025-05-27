// axiosInstance.js - Fixed version with correct auth endpoint
import axios from 'axios';

const Axios = axios.create({
    baseURL: 'http://localhost:8000/auth', // Fixed: Added /auth prefix
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token as fallback
Axios.interceptors.request.use(
    (config) => {
        // Add token from localStorage as fallback
        const token = localStorage.getItem('authToken');
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log the full request URL for debugging
        console.log(`Making request to: ${config.baseURL}${config.url}`);

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
Axios.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.status, response.statusText);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.status, error.response?.data);

        // Handle 401 errors globally
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');

            const isAuthRequest = error.config?.url?.includes('/login') ||
                error.config?.url?.includes('/register');

            if (!isAuthRequest) {
                // Dispatch logout event instead of redirecting immediately
                window.dispatchEvent(new CustomEvent('auth:logout'));
            }
        }

        return Promise.reject(error);
    }
);

export {Axios};