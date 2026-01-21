import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHistory } from '../services/api';

export default function HomeScreen({ navigation }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Function to load data
    const loadData = async () => {
        try {
            const data = await getHistory();
            setTransactions(data);
        } catch (error) {
            // In a real app, we'd show a toast or alert here
            console.log("Failed to load history");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Reload data whenever the screen comes into focus (e.g., after adding a new item)
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.note}>{item.note || 'Expense'}</Text>
                <Text style={styles.amount}>₹{item.amount}</Text>
            </View>
            <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
            <Text style={styles.location}>
                📍 {item.location.lat.toFixed(4)}, {item.location.long.toFixed(4)}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {transactions.length === 0 && !loading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No transactions yet.</Text>
                    <Text style={styles.emptySubText}>Tap '+' to log your first spend!</Text>
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2, // Android shadow
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    note: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#d9534f', // Red-ish for expense
    },
    date: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    location: {
        fontSize: 12,
        color: '#2f95dc',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ccc',
    },
    emptySubText: {
        marginTop: 8,
        color: '#999',
    },
});
