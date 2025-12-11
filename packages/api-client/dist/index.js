import axios from 'axios';
// Default API base URL - can be overridden via constructor
const DEFAULT_API_BASE_URL = 'http://localhost:5000';
class APIClient {
    client;
    baseURL;
    constructor(baseURL = DEFAULT_API_BASE_URL) {
        this.baseURL = baseURL;
        this.client = axios.create({
            baseURL: this.baseURL,
            withCredentials: true, // Send cookies
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Request interceptor - add JWT token
        this.client.interceptors.request.use((config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => Promise.reject(error));
        // Response interceptor - handle token refresh
        this.client.interceptors.response.use((response) => response, async (error) => {
            const originalRequest = error.config;
            // If 401 and not already retried, try to refresh token
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    // Refresh token endpoint
                    const { data } = await axios.post(`${this.baseURL}/api/auth/refresh`, {}, { withCredentials: true });
                    localStorage.setItem('accessToken', data.accessToken);
                    // Retry original request
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return this.client(originalRequest);
                }
                catch (refreshError) {
                    // Refresh failed, logout user
                    localStorage.removeItem('accessToken');
                    if (typeof window !== 'undefined') {
                        window.location.href = '/auth/signin';
                    }
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        });
    }
    // Auth API
    auth = {
        login: async (credentials) => {
            const { data } = await this.client.post('/api/auth/login', credentials);
            localStorage.setItem('accessToken', data.accessToken);
            return data;
        },
        signup: async (userData) => {
            const { data } = await this.client.post('/api/auth/signup', userData);
            return data;
        },
        logout: async () => {
            const { data } = await this.client.post('/api/auth/logout');
            localStorage.removeItem('accessToken');
            return data;
        },
        checkSession: async () => {
            const { data } = await this.client.post('/api/auth/security/check-session');
            return data;
        },
        confirmEmail: async (token) => {
            const { data } = await this.client.post('/api/auth/security/confirm-email', { token });
            return data;
        },
        resetPassword: async (email) => {
            const { data } = await this.client.post('/api/auth/security/reset-password/create', {
                email,
            });
            return data;
        },
    };
    // Account API
    account = {
        getProfile: async () => {
            const { data } = await this.client.get('/api/account/profile');
            return data;
        },
        updateProfile: async (profileData) => {
            const { data } = await this.client.post('/api/account/profile', profileData);
            return data;
        },
    };
    // Tracks API
    tracks = {
        getAll: async () => {
            const { data } = await this.client.get('/api/tracks');
            return data;
        },
    };
    // Audio API
    audio = {
        getStreamUrl: (trackId) => {
            return `${this.baseURL}/api/audio/${trackId}`;
        },
    };
}
// Factory function to create client with custom base URL
export const createApiClient = (baseURL) => new APIClient(baseURL);
export const apiClient = new APIClient();
export default apiClient;
