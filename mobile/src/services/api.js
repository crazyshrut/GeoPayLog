import axios from 'axios';
import { getDeviceId } from '../utils/device';

// ========== TOGGLE THIS ==========
// For LOCAL testing: use your computer's WiFi IP
// For DEPLOYED: use your Render URL
const USE_DEPLOYED = false;

const LOCAL_URL = 'http://100.129.164.83:5000/api';
const DEPLOYED_URL = 'https://geopaylog-api.onrender.com/api'; // ← Update after deploying

const API_BASE_URL = USE_DEPLOYED ? DEPLOYED_URL : LOCAL_URL;
// ==================================

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
        // data should be { amount, note, category, lat, long }
        // deviceId is handled by interceptor for header, but backend expects it in body too.
        const deviceId = await getDeviceId();
        const payload = { ...data, deviceId };

        const response = await api.post('/log', payload);
        return response.data;
    } catch (error) {
        console.error("API Add Transaction Error:", error);
        throw error;
    }
};

/**
 * v2: Delete a transaction by its _id
 */
export const deleteTransaction = async (transactionId) => {
    try {
        const response = await api.delete(`/transaction/${transactionId}`);
        return response.data;
    } catch (error) {
        console.error("API Delete Transaction Error:", error);
        throw error;
    }
};

export default api;
