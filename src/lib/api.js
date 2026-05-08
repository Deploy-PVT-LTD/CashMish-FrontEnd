import axios from 'axios';
// Centralized API configuration
// export const BASE_URL = 'http://localhost:5000';
 export const BASE_URL = 'https://cashmish-backend.onrender.com';
 //export const BASE_URL = 'http://192.168.1.11:5000';
//export const BASE_URL = 'https://backend.cashmish.com:5000';

// Add the header globally to Axios
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

// Add the header globally to the native fetch API
const originalFetch = window.fetch;
window.fetch = async function () {
    let [resource, config] = arguments;
    if (config === undefined) {
        config = {};
    }
    if (config.headers === undefined) {
        config.headers = {};
    }
    // Convert Headers object to normal object if necessary, or just set if it's a plain object
    if (config.headers instanceof Headers) {
        config.headers.append('ngrok-skip-browser-warning', 'true');
    } else {
        config.headers['ngrok-skip-browser-warning'] = 'true';
    }
    return await originalFetch(resource, config);
};