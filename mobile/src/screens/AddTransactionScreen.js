import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
    Alert, Dimensions, Vibration, ScrollView
} from 'react-native';
import * as Location from 'expo-location';
import { addTransaction } from '../services/api';
import { COLORS, CATEGORY_CONFIG, SIZES, FONTS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const CATEGORIES = Object.keys(CATEGORY_CONFIG);

export default function AddTransactionScreen({ navigation }) {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [category, setCategory] = useState('Food');
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('Fetching...');
    const [locationAddress, setLocationAddress] = useState('');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationStatus('Permission Denied');
                Alert.alert('Permission needed', 'We need location to tag your transaction.');
                return;
            }

            setLocationStatus('Fetching location...');
            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setLocation(loc.coords);

            // Try reverse geocoding for display
            try {
                const result = await Location.reverseGeocodeAsync({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                });
                if (result && result.length > 0) {
                    const place = result[0];
                    const area = place.name || place.street || '';
                    const city = place.city || place.region || '';
                    setLocationAddress(`${area}, ${city}`);
                }
            } catch (e) {
                // Fallback to coords display
            }

            setLocationStatus('Located ✅');
        })();
    }, []);

    const handleNumPress = (val) => {
        Vibration.vibrate(10);
        if (val === '.' && amount.includes('.')) return;
        if (val === '⌫') {
            setAmount(prev => prev.slice(0, -1));
            return;
        }
        setAmount(prev => prev + val);
    };

    const handleSave = async () => {
        if (!amount || parseFloat(amount) === 0) {
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
                note: note || `${CATEGORY_CONFIG[category].label} expense`,
                category,
                lat: location.latitude,
                long: location.longitude,
            });

            Vibration.vibrate(50);
            Alert.alert('✅ Saved!', 'Transaction logged successfully.');
            setAmount('');
            setNote('');
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Error', 'Could not save transaction. Check network.');
        } finally {
            setLoading(false);
        }
    };

    const numKeys = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['.', '0', '⌫'],
    ];

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Title */}
                <Text style={styles.title}>Log expense</Text>

                {/* Category selector */}
                <View style={styles.categoryRow}>
                    {CATEGORIES.map(cat => {
                        const config = CATEGORY_CONFIG[cat];
                        const isActive = category === cat;
                        return (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryChip,
                                    isActive && { backgroundColor: config.color + '30', borderColor: config.color },
                                ]}
                                onPress={() => setCategory(cat)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.categoryEmoji}>{config.icon}</Text>
                                <Text style={[styles.categoryLabel, isActive && { color: config.color }]}>
                                    {config.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Amount display */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <Text style={[styles.amountText, !amount && { color: COLORS.textMuted }]}>
                        {amount || '0'}
                    </Text>
                </View>

                {/* Custom numpad */}
                <View style={styles.numpad}>
                    {numKeys.map((row, i) => (
                        <View key={i} style={styles.numRow}>
                            {row.map(key => (
                                <TouchableOpacity
                                    key={key}
                                    style={styles.numKey}
                                    onPress={() => handleNumPress(key)}
                                    activeOpacity={0.6}
                                >
                                    {key === '⌫' ? (
                                        <Ionicons name="backspace-outline" size={24} color={COLORS.textSecondary} />
                                    ) : (
                                        <Text style={styles.numKeyText}>{key}</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Location indicator */}
                <View style={styles.locationBar}>
                    <Ionicons name="location" size={18} color={COLORS.accent} />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {locationAddress || locationStatus}
                    </Text>
                </View>

                {/* Save button */}
                <TouchableOpacity
                    style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.saveBtnText}>Save transaction</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    title: {
        fontSize: SIZES.xxl,
        color: COLORS.textPrimary,
        ...FONTS.bold,
        marginBottom: 20,
    },
    categoryRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 30,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: SIZES.radiusFull,
        backgroundColor: COLORS.bgElevated,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        gap: 6,
    },
    categoryEmoji: {
        fontSize: 16,
    },
    categoryLabel: {
        fontSize: SIZES.md,
        color: COLORS.textSecondary,
        ...FONTS.medium,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        marginBottom: 30,
        paddingVertical: 10,
    },
    currencySymbol: {
        fontSize: 28,
        color: COLORS.textMuted,
        ...FONTS.regular,
        marginRight: 4,
    },
    amountText: {
        fontSize: 56,
        color: COLORS.textPrimary,
        ...FONTS.bold,
        letterSpacing: -1,
    },
    numpad: {
        marginBottom: 20,
    },
    numRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 10,
    },
    numKey: {
        width: (width - 80) / 3,
        height: 56,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.bgElevated,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.borderMuted,
    },
    numKeyText: {
        fontSize: 24,
        color: COLORS.textPrimary,
        ...FONTS.semiBold,
    },
    locationBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.accentSubtle,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.accentBorder,
        marginBottom: 16,
        gap: 10,
    },
    locationText: {
        fontSize: SIZES.md,
        color: COLORS.accent,
        ...FONTS.medium,
        flex: 1,
    },
    saveBtn: {
        backgroundColor: COLORS.accent,
        paddingVertical: 18,
        borderRadius: SIZES.radius,
        alignItems: 'center',
    },
    saveBtnDisabled: {
        opacity: 0.5,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: SIZES.xl,
        ...FONTS.bold,
    },
});
