import axios from 'axios';

// In development, you might need to change this if your PHP server runs elsewhere
// For production (and if PHP is served from same origin), relative path works
export const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:8000/api' : '/api';

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
            window.location.href = '/login.html'; // Assuming there is a legacy login or separate logic
        }
        return Promise.reject(error);
    }
);

export default api;
