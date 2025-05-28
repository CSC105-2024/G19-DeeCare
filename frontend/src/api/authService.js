import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/auth',
    timeout: 15000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token (fallback for non-cookie scenarios)
apiClient.interceptors.request.use(
    (config) => {
        // Since your backend supports both cookies and Bearer tokens,
        // we can still add the token as a fallback
        const token = localStorage.getItem('authToken');
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        config.metadata = {startTime: new Date()};

        // Log the full request URL for debugging
        console.log(`Making request to: ${config.baseURL}${config.url}`);

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        // Log response time for debugging
        const endTime = new Date();
        const duration = endTime - response.config.metadata.startTime;
        console.log(`API Request to ${response.config.url} took ${duration}ms`);
        console.log('Response received:', response.status, response.statusText);

        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        console.error('Response error:', error.response?.status, error.response?.data);

        // Handle network errors specifically
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error - check if backend server is running on localhost:8000');
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - server may be slow or unresponsive');
        }

        if (error.response?.status === 401) {
            // Token expired or invalid - clear local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            // Don't redirect immediately if it's a login/register request
            const isAuthRequest = error.config?.url?.includes('/login') ||
                error.config?.url?.includes('/register');

            if (!isAuthRequest) {
                // Dispatch custom event for components to handle auth state
                window.dispatchEvent(new CustomEvent('auth:logout'));
            }
        }

        return Promise.reject(error);
    }
);

// Enhanced Auth API functions
export const authAPI = {
    // Register user
    register: async (userData) => {
        try {
            console.log('Registering user with data:', {...userData, password: '[HIDDEN]'});

            const response = await apiClient.post('/register', userData);

            if (response.data.success) {
                // Store token and user data (the cookie is automatically set by the server)
                if (response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                }
                if (response.data.data) {
                    localStorage.setItem('user', JSON.stringify(response.data.data));
                }

                console.log('Registration successful');

                // Dispatch success event
                window.dispatchEvent(new CustomEvent('auth:register-success', {
                    detail: {user: response.data.data, token: response.data.token}
                }));
            }

            return response.data;
        } catch (error) {
            console.error('Registration error:', error);

            // Enhanced error handling with specific network error messages
            if (error.code === 'ERR_NETWORK') {
                throw new Error('Cannot connect to the server. Please check if the backend is running on localhost:8000 and try again.');
            } else if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please check your internet connection and try again.');
            } else if (error.response?.data) {
                const errorData = error.response.data;

                // Handle specific error cases
                if (errorData.message?.includes('already in use') ||
                    errorData.message?.includes('already exists')) {
                    throw new Error('This email or ID number is already registered. Please use a different one or try logging in.');
                }

                if (errorData.message?.includes('Missing required fields')) {
                    throw new Error('Please fill in all required fields.');
                }

                throw new Error(errorData.message || 'Registration failed. Please try again.');
            } else {
                throw new Error('Registration failed. Please check your internet connection and try again.');
            }
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            console.log('Attempting login for ID:', credentials.idNumber);

            const response = await apiClient.post('/login', credentials);

            if (response.data.success) {
                // Store token and user data (the cookie is automatically set by the server)
                if (response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                }
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }

                console.log('Login successful for user:', response.data.user?.firstName);

                // Dispatch success event
                window.dispatchEvent(new CustomEvent('auth:login-success', {
                    detail: {user: response.data.user, token: response.data.token}
                }));
            }

            return response.data;
        } catch (error) {
            console.error('Login error:', error);

            // Enhanced error handling with network-specific messages
            if (error.code === 'ERR_NETWORK') {
                throw new Error('Cannot connect to the server. Please check if the backend is running and try again.');
            } else if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please check your internet connection and try again.');
            } else if (error.response?.data) {
                const errorData = error.response.data;

                if (error.response.status === 401) {
                    throw new Error('Invalid ID number or password. Please check your credentials and try again.');
                }

                if (errorData.message?.includes('required')) {
                    throw new Error('Please enter both ID number and password.');
                }

                throw new Error(errorData.message || 'Login failed. Please try again.');
            } else {
                throw new Error('Login failed. Please check your connection and try again.');
            }
        }
    },

    // Logout user
    logout: async () => {
        try {
            console.log('Logging out user...');

            // Call backend logout to clear server-side cookie
            await apiClient.post('/logout');

            console.log('Server logout successful');
        } catch (error) {
            console.warn('Server logout failed:', error);
            // Continue with client-side cleanup even if server request fails
        } finally {
            // Clear client-side data
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            console.log('Client-side logout complete');

            // Dispatch logout event
            window.dispatchEvent(new CustomEvent('auth:logout'));
        }
    },

    // Get user profile
    getProfile: async () => {
        try {
            const response = await apiClient.get('/profile');

            // Update stored user data with latest profile info
            if (response.data.success && response.data.data) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
            }

            return response.data;
        } catch (error) {
            console.error('Get profile error:', error);

            if (error.code === 'ERR_NETWORK') {
                throw new Error('Cannot connect to the server. Please check your connection.');
            } else if (error.response?.data) {
                throw new Error(error.response.data.message || 'Failed to fetch profile.');
            } else {
                throw new Error('Network error. Please try again.');
            }
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        try {
            const response = await apiClient.put('/profile', profileData);

            // Update stored user data after successful profile update
            if (response.data.success && response.data.data) {
                localStorage.setItem('user', JSON.stringify(response.data.data));

                // Dispatch profile update event
                window.dispatchEvent(new CustomEvent('auth:profile-updated', {
                    detail: {user: response.data.data}
                }));
            }

            return response.data;
        } catch (error) {
            console.error('Update profile error:', error);

            if (error.code === 'ERR_NETWORK') {
                throw new Error('Cannot connect to the server. Please check your connection.');
            } else if (error.response?.data) {
                throw new Error(error.response.data.message || 'Failed to update profile.');
            } else {
                throw new Error('Network error. Please try again.');
            }
        }
    },

    // Update password
    updatePassword: async (passwordData) => {
        try {
            const response = await apiClient.put('/password', passwordData);
            return response.data;
        } catch (error) {
            console.error('Update password error:', error);

            if (error.code === 'ERR_NETWORK') {
                throw new Error('Cannot connect to the server. Please check your connection.');
            } else if (error.response?.data) {
                const errorData = error.response.data;

                if (errorData.message?.includes('current password')) {
                    throw new Error('Current password is incorrect.');
                }

                throw new Error(errorData.message || 'Failed to update password.');
            } else {
                throw new Error('Network error. Please try again.');
            }
        }
    },

    // Update emergency contact
    updateEmergencyContact: async (contactData) => {
        try {
            const response = await apiClient.put('/emergency-contact', contactData);

            // Update stored user data if user info is returned
            if (response.data.success) {
                const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUserData = {
                    ...currentUserData,
                    emergencyContact: response.data.data
                };
                localStorage.setItem('user', JSON.stringify(updatedUserData));
            }

            return response.data;
        } catch (error) {
            console.error('Update emergency contact error:', error);

            if (error.code === 'ERR_NETWORK') {
                throw new Error('Cannot connect to the server. Please check your connection.');
            } else if (error.response?.data) {
                throw new Error(error.response.data.message || 'Failed to update emergency contact.');
            } else {
                throw new Error('Network error. Please try again.');
            }
        }
    },

    // Delete account
    deleteAccount: async () => {
        try {
            const response = await apiClient.delete('/account');

            if (response.data.success) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');

                // Dispatch account deletion event
                window.dispatchEvent(new CustomEvent('auth:account-deleted'));
            }

            return response.data;
        } catch (error) {
            console.error('Delete account error:', error);

            if (error.code === 'ERR_NETWORK') {
                throw new Error('Cannot connect to the server. Please check your connection.');
            } else if (error.response?.data) {
                throw new Error(error.response.data.message || 'Failed to delete account.');
            } else {
                throw new Error('Network error. Please try again.');
            }
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        return !!(token && userData);
    },

    // Get stored user data
    getUserData: () => {
        const userData = localStorage.getItem('user');
        try {
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('user'); // Clean up corrupted data
            return null;
        }
    },

    // Get auth token
    getToken: () => {
        return localStorage.getItem('authToken');
    },

    // Verify token validity with backend
    verifyToken: async () => {
        try {
            const response = await apiClient.get('/profile');
            return {success: true, user: response.data.data};
        } catch (error) {
            console.warn('Token verification failed:', error);

            // Token is invalid, clear local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            return {success: false, message: 'Invalid token'};
        }
    },

    // Check authentication status on app load
    checkAuth: async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            return {isAuthenticated: false};
        }

        try {
            const result = await authAPI.verifyToken();
            return {
                isAuthenticated: result.success,
                user: result.user || null
            };
        } catch (error) {
            console.warn('Auth check failed:', error);
            return {isAuthenticated: false};
        }
    },

    // Refresh auth state (useful for checking if user data has changed)
    refreshAuth: async () => {
        try {
            if (!authAPI.isAuthenticated()) {
                return {isAuthenticated: false};
            }

            const profile = await authAPI.getProfile();

            if (profile.success) {
                return {
                    isAuthenticated: true,
                    user: profile.data
                };
            } else {
                return {isAuthenticated: false};
            }
        } catch (error) {
            console.warn('Auth refresh failed:', error);
            return {isAuthenticated: false};
        }
    }
};

// Additional utility functions
export const apiUtils = {
    // Set custom headers for specific requests
    setCustomHeaders: (headers) => {
        Object.assign(apiClient.defaults.headers, headers);
    },

    // Remove custom headers
    removeCustomHeaders: (headerKeys) => {
        headerKeys.forEach(key => {
            delete apiClient.defaults.headers[key];
        });
    },

    // Update base URL (useful for environment switching)
    updateBaseURL: (newBaseURL) => {
        apiClient.defaults.baseURL = newBaseURL;
        console.log(`API base URL updated to: ${newBaseURL}`);
    },

    // Get current base URL
    getBaseURL: () => {
        return apiClient.defaults.baseURL;
    },

    // Enable/disable credentials
    setCredentials: (enabled) => {
        apiClient.defaults.withCredentials = enabled;
    },

    // Get API client instance for custom requests
    getClient: () => apiClient,

    // Test connection to backend
    testConnection: async () => {
        try {
            // Test the root endpoint since /health might not exist
            const response = await axios.get('http://localhost:8000/', {timeout: 5000});
            return {success: true, message: 'Connection successful'};
        } catch (error) {
            console.error('Connection test failed:', error);
            return {
                success: false,
                message: error.code === 'ERR_NETWORK'
                    ? 'Cannot connect to server - make sure backend is running on localhost:8000'
                    : 'Connection test failed'
            };
        }
    }
};

// Auth event listeners for components
export const authEvents = {
    // Listen for login success
    onLoginSuccess: (callback) => {
        window.addEventListener('auth:login-success', (event) => {
            callback(event.detail);
        });
    },

    // Listen for registration success
    onRegisterSuccess: (callback) => {
        window.addEventListener('auth:register-success', (event) => {
            callback(event.detail);
        });
    },

    // Listen for logout
    onLogout: (callback) => {
        window.addEventListener('auth:logout', callback);
    },

    // Listen for profile updates
    onProfileUpdated: (callback) => {
        window.addEventListener('auth:profile-updated', (event) => {
            callback(event.detail);
        });
    },

    // Listen for account deletion
    onAccountDeleted: (callback) => {
        window.addEventListener('auth:account-deleted', callback);
    },

    // Remove event listeners
    removeListener: (eventName, callback) => {
        window.removeEventListener(eventName, callback);
    }
};

// Export the configured axios instance for custom requests
export default apiClient;