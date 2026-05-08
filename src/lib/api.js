import axios from 'axios';

// Priority list of backend URLs
const BACKEND_URLS = [
    'https://cashmish-backend.onrender.com',               // Local VM (Primary)
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
// Set a fast timeout for Local VM to trigger fallback quickly (e.g., 5s)
// Render might need more time for cold starts (e.g., 30s)
axios.defaults.timeout = currentIndex === 0 ? 5000 : 30000;

// Axios Interceptor for Fallback
axios.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // If it's a network error OR a timeout OR specific status codes like 502/503/504
        const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error';

        if (isNetworkError && !originalRequest._retry) {
            if (switchBackend()) {
                originalRequest._retry = true;

                // Update axios timeout for the backup server
                axios.defaults.timeout = 30000;
                originalRequest.timeout = 30000;

                // Update the URL in the original request if it was absolute
                BACKEND_URLS.forEach(url => {
                    if (originalRequest.url && originalRequest.url.startsWith(url)) {
                        originalRequest.url = originalRequest.url.replace(url, getActiveURL());
                    }
                });

                // Update baseURL for this specific retry
                originalRequest.baseURL = getActiveURL();

                console.log("Retrying axios request with backup...");
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

    // Fast timeout for fetch on primary
    const controller = new AbortController();
    const id = currentIndex === 0 ? setTimeout(() => controller.abort(), 5000) : null;

    const fetchConfig = { ...config, signal: config.signal || controller.signal };

    try {
        const finalResource = getResolvedUrl(resource);
        const response = await originalFetch(finalResource, fetchConfig);
        if (id) clearTimeout(id);
        return response;
    } catch (error) {
        if (id) clearTimeout(id);

        // Network errors or AbortError (timeout)
        if (switchBackend()) {
            const retryResource = getResolvedUrl(resource);
            console.log(`Retrying fetch with alternate URL: ${retryResource}`);
            // Retry without the tight timeout for Render
            return await originalFetch(retryResource, config);
        }
        throw error;
    }
};

