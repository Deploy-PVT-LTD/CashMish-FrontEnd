import axios from 'axios';

// Priority list of backend URLs
const BACKEND_URLS = [
    'http://192.168.1.11:5000',               // Local VM (Primary)
    'https://cashmish-backend.onrender.com'   // Render (Backup)
];

// Initialize from sessionStorage or default to 0
let currentIndex = parseInt(sessionStorage.getItem('active_backend_idx') || '0');
if (currentIndex >= BACKEND_URLS.length) currentIndex = 0;

export const BASE_URL = BACKEND_URLS[currentIndex];

const getActiveURL = () => BACKEND_URLS[currentIndex];

const switchBackend = () => {
    if (currentIndex < BACKEND_URLS.length - 1) {
        currentIndex++;
        sessionStorage.setItem('active_backend_idx', currentIndex.toString());
        console.warn(`Falling back to: ${BACKEND_URLS[currentIndex]}`);
        // Update axios default just in case
        axios.defaults.baseURL = BACKEND_URLS[currentIndex];
        return true;
    }
    return false;
};

// Global Headers
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
axios.defaults.baseURL = getActiveURL();

// Axios Interceptor for Fallback
axios.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If it's a network error or timeout AND we haven't retried this request yet
        if ((!error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error') && !originalRequest._retry) {
            if (switchBackend()) {
                originalRequest._retry = true;
                // Update the URL in the original request if it was absolute
                BACKEND_URLS.forEach(url => {
                    if (originalRequest.url.startsWith(url)) {
                        originalRequest.url = originalRequest.url.replace(url, getActiveURL());
                    }
                });
                // If it was relative, axios will use the new defaults.baseURL
                return axios(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

// Fetch Override with Fallback
const originalFetch = window.fetch;
window.fetch = async function (resource, config = {}) {
    // Ensure headers include ngrok bypass
    const headers = config.headers instanceof Headers 
        ? config.headers 
        : new Headers(config.headers || {});
    
    if (!headers.has('ngrok-skip-browser-warning')) {
        headers.set('ngrok-skip-browser-warning', 'true');
    }
    
    config.headers = headers;

    // Helper to rewrite URL
    const getResolvedUrl = (url) => {
        let finalUrl = url;
        BACKEND_URLS.forEach(u => {
            if (typeof finalUrl === 'string' && finalUrl.startsWith(u)) {
                finalUrl = finalUrl.replace(u, getActiveURL());
            }
        });
        return finalUrl;
    };

    try {
        const finalResource = getResolvedUrl(resource);
        const response = await originalFetch(finalResource, config);
        return response;
    } catch (error) {
        // Network errors (failed to fetch)
        if (switchBackend()) {
            const retryResource = getResolvedUrl(resource);
            console.log(`Retrying fetch with alternate URL: ${retryResource}`);
            return await originalFetch(retryResource, config);
        }
        throw error;
    }
};