import axios from 'axios';

// In development, you might need to change this if your PHP server runs elsewhere
// For production (and if PHP is served from same origin), relative path works
export const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:8000/api' : '/api';

export const constructImageUrl = (path?: string | null): string | null => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // If it's stored in 'uploads/', it is likely served from root or public folder.
    // For now, let's assume relative to root if it starts with /.
    return `${API_BASE_URL}/${path.replace(/^\//, '')}`;
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Important for PHP sessions
});

// Add a response interceptor to handleauth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized (redirect to login)
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
