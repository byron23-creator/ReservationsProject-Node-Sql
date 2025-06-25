import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api' // URL base de tu API de Node.js
});

// Interceptor para añadir el token JWT a las solicitudes
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;