import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getHistory, deleteTransaction } from '../services/api';
import { COLORS, CATEGORY_CONFIG, SIZES, FONTS } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const data = await getHistory();
            setTransactions(data);
        } catch (error) {
            console.log("Failed to load history");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleDelete = (id, note) => {
        Alert.alert(
            'Delete Transaction',
            `Remove "${note || 'this expense'}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteTransaction(id);
                            setTransactions(prev => prev.filter(t => t._id !== id));
                        } catch (e) {
                            Alert.alert('Error', 'Could not delete transaction.');
                        }
                    },
                },
            ]
        );
    };

    // Calculate summary stats
    const now = new Date();
    const monthTransactions = transactions.filter(t => {
        const d = new Date(t.timestamp);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthTotal = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const monthCount = monthTransactions.length;

    // Get unique cities count (approximate by unique lat/long combos rounded)
    const uniqueLocations = new Set(
        monthTransactions.map(t => `${Math.round(t.location.lat * 100)},${Math.round(t.location.long * 100)}`)
    );

    // Top category
    const categoryTotals = {};
    monthTransactions.forEach(t => {
        const cat = t.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
    });
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    // Group transactions by date
    const groupedData = [];
    let lastDate = '';
    let dayTotal = 0;
    const tempGroups = {};

    transactions.forEach(t => {
        const dateStr = new Date(t.timestamp).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
        if (!tempGroups[dateStr]) {
            tempGroups[dateStr] = { date: dateStr, items: [], total: 0 };
        }
        tempGroups[dateStr].items.push(t);
        tempGroups[dateStr].total += t.amount;
    });

    const sections = Object.values(tempGroups);

    // Get greeting based on time
    const getGreeting = () => {
        const hour = now.getHours();
        if (hour < 12) return 'Good morning 👋';
        if (hour < 17) return 'Good afternoon ☀️';
        return 'Good evening 🌙';
    };

    // Is today?
    const isToday = (dateStr) => {
        const today = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        return dateStr === today;
    };

    const isYesterday = (dateStr) => {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        return dateStr === yStr;
    };

    const getDateLabel = (dateStr) => {
        if (isToday(dateStr)) return 'Today';
        if (isYesterday(dateStr)) return 'Yesterday';
        return dateStr;
    };

    const renderTransaction = (item) => {
        const catConfig = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.Other;
        return (
            <TouchableOpacity
                key={item._id}
                style={styles.txRow}
                onLongPress={() => handleDelete(item._id, item.note)}
                activeOpacity={0.7}
            >
                <View style={[styles.catIcon, { backgroundColor: catConfig.color + '20' }]}>
                    <Text style={styles.catEmoji}>{catConfig.icon}</Text>
                </View>
                <View style={styles.txInfo}>
                    <Text style={styles.txNote} numberOfLines={1}>{item.note || 'Expense'}</Text>
                    <Text style={styles.txLocation}>📍 {item.location.lat.toFixed(3)}, {item.location.long.toFixed(3)}</Text>
                </View>
                <Text style={styles.txAmount}>₹{item.amount.toLocaleString('en-IN')}</Text>
            </TouchableOpacity>
        );
    };

    const renderSection = ({ item: section }) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionDate}>{getDateLabel(section.date)}</Text>
                <Text style={styles.sectionTotal}>₹{section.total.toLocaleString('en-IN')}</Text>
            </View>
            {section.items.map(renderTransaction)}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                        <Text style={styles.monthTotal}>₹{monthTotal.toLocaleString('en-IN')} <Text style={styles.monthLabel}>this month</Text></Text>
                        <Text style={styles.subtitle}>{monthCount} transactions · {uniqueLocations.size} locations</Text>
                    </View>
                    <TouchableOpacity style={styles.menuBtn}>
                        <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Quick stat pills */}
                {monthCount > 0 && (
                    <View style={styles.statPills}>
                        <View style={styles.pill}>
                            <Text style={styles.pillValue}>₹{Math.round(monthTotal / Math.max(monthCount, 1))}</Text>
                            <Text style={styles.pillLabel}>Avg / txn</Text>
                        </View>
                        <View style={styles.pill}>
                            <Text style={styles.pillValue}>₹{Math.max(...monthTransactions.map(t => t.amount), 0)}</Text>
                            <Text style={styles.pillLabel}>Highest</Text>
                        </View>
                        {topCategory && (
                            <View style={[styles.pill, { backgroundColor: (CATEGORY_CONFIG[topCategory[0]]?.color || COLORS.accent) + '20' }]}>
                                <Text style={styles.pillValue}>{CATEGORY_CONFIG[topCategory[0]]?.icon} {topCategory[0]}</Text>
                                <Text style={styles.pillLabel}>Top cat.</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Transaction List */}
            {sections.length === 0 && !loading ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="wallet-outline" size={64} color={COLORS.textMuted} />
                    <Text style={styles.emptyText}>No transactions yet</Text>
                    <Text style={styles.emptySubText}>Tap + to log your first spend!</Text>
                </View>
            ) : (
                <FlatList
                    data={sections}
                    keyExtractor={(item) => item.date}
                    renderItem={renderSection}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={COLORS.accent}
                            colors={[COLORS.accent]}
                            progressBackgroundColor={COLORS.bgCard}
                        />
                    }
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: COLORS.bg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    greeting: {
        fontSize: SIZES.lg,
        color: COLORS.textSecondary,
        ...FONTS.medium,
        marginBottom: 4,
    },
    monthTotal: {
        fontSize: SIZES.title,
        color: COLORS.textPrimary,
        ...FONTS.bold,
    },
    monthLabel: {
        fontSize: SIZES.lg,
        color: COLORS.textSecondary,
        ...FONTS.regular,
    },
    subtitle: {
        fontSize: SIZES.sm,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    menuBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.bgElevated,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statPills: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 8,
    },
    pill: {
        backgroundColor: COLORS.bgElevated,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.border,
        flex: 1,
    },
    pillValue: {
        fontSize: SIZES.md,
        color: COLORS.textPrimary,
        ...FONTS.semiBold,
    },
    pillLabel: {
        fontSize: SIZES.xs,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    list: {
        padding: 16,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    sectionDate: {
        fontSize: SIZES.md,
        color: COLORS.textSecondary,
        ...FONTS.semiBold,
    },
    sectionTotal: {
        fontSize: SIZES.md,
        color: COLORS.textMuted,
        ...FONTS.medium,
    },
    txRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bgCard,
        padding: 14,
        marginBottom: 6,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.borderMuted,
    },
    catIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    catEmoji: {
        fontSize: 20,
    },
    txInfo: {
        flex: 1,
    },
    txNote: {
        fontSize: SIZES.lg,
        color: COLORS.textPrimary,
        ...FONTS.semiBold,
    },
    txLocation: {
        fontSize: SIZES.xs,
        color: COLORS.textMuted,
        marginTop: 3,
    },
    txAmount: {
        fontSize: SIZES.xl,
        color: COLORS.textPrimary,
        ...FONTS.bold,
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: SIZES.xl,
        ...FONTS.semiBold,
        color: COLORS.textMuted,
        marginTop: 16,
    },
    emptySubText: {
        marginTop: 6,
        color: COLORS.textMuted,
        fontSize: SIZES.md,
    },
});
