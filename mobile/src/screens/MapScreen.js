import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { getHistory } from '../services/api';

export default function MapScreen() {
    const [transactions, setTransactions] = useState([]);

    // Load data whenever we look at the map to ensure new pins appear
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        try {
            const data = await getHistory();
            setTransactions(data);
        } catch (e) {
            console.log('Map load error', e);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 28.6139, // Default to New Delhi (or adjust to your uni)
                    longitude: 77.2090,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                showsUserLocation={true}
            >
                {transactions.map((t) => (
                    <Marker
                        key={t._id}
                        coordinate={{
                            latitude: t.location.lat,
                            longitude: t.location.long,
                        }}
                        title={t.note}
                        description={`₹${t.amount}`}
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
