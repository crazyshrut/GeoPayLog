import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHistory } from '../services/api';
import * as Location from 'expo-location';

export default function CitySummaryScreen() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [citySummary, setCitySummary] = useState([]);

    // Load data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadCityData();
        }, [])
    );

    const loadCityData = async () => {
        try {
            const transactions = await getHistory();

            // Group transactions by city
            const cityMap = {};

            for (const tx of transactions) {
                // Get city name from coordinates using reverse geocoding
                let cityName = 'Unknown City';
                try {
                    const result = await Location.reverseGeocodeAsync({
                        latitude: tx.location.lat,
                        longitude: tx.location.long
                    });

                    if (result && result.length > 0) {
                        // Try to get city, or use region/subregion as fallback
                        cityName = result[0].city || result[0].region || result[0].subregion || 'Unknown City';
                    }
                } catch (geoError) {
                    console.log('Geocoding error for transaction:', geoError);
                }

                // Add to city summary
                if (!cityMap[cityName]) {
                    cityMap[cityName] = {
                        city: cityName,
                        totalAmount: 0,
                        count: 0
                    };
                }

                cityMap[cityName].totalAmount += tx.amount;
                cityMap[cityName].count += 1;
            }

            // Convert to array and sort by total amount (highest first)
            const summaryArray = Object.values(cityMap).sort((a, b) => b.totalAmount - a.totalAmount);
            setCitySummary(summaryArray);

        } catch (error) {
            console.log('Failed to load city data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadCityData();
    };

    const renderCityItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cityHeader}>
                <Text style={styles.cityName}>📍 {item.city}</Text>
                <Text style={styles.transactionCount}>{item.count} transactions</Text>
            </View>
            <Text style={styles.totalAmount}>₹{item.totalAmount.toFixed(2)}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (citySummary.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>No transactions yet!</Text>
                <Text style={styles.emptySubtext}>Add some transactions to see city summaries</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={citySummary}
                renderItem={renderCityItem}
                keyExtractor={(item) => item.city}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cityName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    transactionCount: {
        fontSize: 12,
        color: '#666',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    totalAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#ccc',
    },
});
