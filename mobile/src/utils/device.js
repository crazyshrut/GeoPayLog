import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'GEOPAYLOG_DEVICE_ID';

/**
 * Checks if we already have a generated Device ID.
 * If not, creates one and saves it.
 */
export const initDeviceId = async () => {
    try {
        const existingId = await AsyncStorage.getItem(DEVICE_ID_KEY);
        if (!existingId) {
            const newId = uuidv4();
            await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
            console.log('✨ Created new Device ID:', newId);
            return newId;
        }
        console.log('📱 Loaded Device ID:', existingId);
        return existingId;
    } catch (error) {
        console.error('Error initializing device ID:', error);
        // Fallback: generate a temporary one if storage fails, though this is rare
        return uuidv4();
    }
};

/**
 * Returns the stored Device ID.
 */
export const getDeviceId = async () => {
    return await AsyncStorage.getItem(DEVICE_ID_KEY);
};
