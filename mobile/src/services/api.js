import axios from 'axios';
import { getDeviceId } from '../utils/device';

// IMPORTANT: Change this IP to your computer's local IP Address!
// e.g., 'http://192.168.1.5:5000'
// 'localhost' will NOT work on a physical Android phone.
const API_BASE_URL = 'http://10.180.175.28:5000/api';
// Note: I'm using a placeholder IP. Please verify your IP using 'ipconfig' later.

// Create an Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
});

// Automatically add the Device ID to every request
api.interceptors.request.use(async (config) => {
    const deviceId = await getDeviceId();
    if (deviceId) {
        config.headers['x-device-id'] = deviceId;
    }
    return config;
});

export const getHistory = async () => {
    try {
        const response = await api.get('/history');
        return response.data;
    } catch (error) {
        console.error("API Get History Error:", error);
        throw error;
    }
};

export const addTransaction = async (data) => {
    try {
        // data should be { amount, note, lat, long, deviceId }
        // Note: deviceId is already handled by interceptor logic in theory, 
        // but our backend expects it in body too for the POST.
        const deviceId = await getDeviceId();
        const payload = { ...data, deviceId };

        const response = await api.post('/log', payload);
        return response.data;
    } catch (error) {
        console.error("API Add Transaction Error:", error);
        throw error;
    }
};

export default api;
