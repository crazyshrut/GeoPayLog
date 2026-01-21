import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import { addTransaction } from '../services/api';

export default function AddTransactionScreen({ navigation }) {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('Waiting...');

    // When screen loads, try to get location immediately to be fast
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationStatus('Permisson Denied');
                Alert.alert('Permission needed', 'We need location to tag your transaction.');
                return;
            }

            setLocationStatus('Fetching location...');
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
            setLocationStatus('Location Acquired ✅');
        })();
    }, []);

    const handleSave = async () => {
        if (!amount) {
            Alert.alert('Missing Amount', 'Please enter how much you spent.');
            return;
        }
        if (!location) {
            Alert.alert('Wait a moment', 'Still fetching your location...');
            return;
        }

        setLoading(true);

        try {
            await addTransaction({
                amount: parseFloat(amount),
                note: note,
                lat: location.latitude,
                long: location.longitude,
            });

            Alert.alert('Success', 'Transaction Logged!');
            setAmount('');
            setNote('');
            navigation.navigate('Home'); // Go back to list
        } catch (error) {
            Alert.alert('Error', 'Could not save transaction. Check network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Amount (₹)</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 50"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />

            <Text style={styles.label}>Note / Payee</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Canteen, Auto, Printout"
                value={note}
                onChangeText={setNote}
            />

            <View style={styles.locContainer}>
                <Text style={styles.locText}>📍 {locationStatus}</Text>
            </View>

            <TouchableOpacity
                style={[styles.btn, loading && styles.btnDisabled]}
                onPress={handleSave}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.btnText}>LOG TRANSACTION</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '600',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 16,
        borderRadius: 8,
        fontSize: 18,
        marginBottom: 24,
        backgroundColor: '#fafafa',
    },
    locContainer: {
        marginBottom: 24,
        padding: 12,
        backgroundColor: '#eef',
        borderRadius: 8,
    },
    locText: {
        color: '#55a',
        fontWeight: '500',
    },
    btn: {
        backgroundColor: '#2f95dc',
        padding: 18,
        borderRadius: 8,
        alignItems: 'center',
    },
    btnDisabled: {
        backgroundColor: '#a0cce8',
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
