import React, { useState, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet, ActivityIndicator,
    RefreshControl, Dimensions, ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getHistory } from '../services/api';
import { COLORS, CATEGORY_CONFIG, SIZES, FONTS } from '../theme/colors';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [monthTotal, setMonthTotal] = useState(0);
    const [avgPerDay, setAvgPerDay] = useState(0);
    const [highestDay, setHighestDay] = useState(0);
    const [dailySpend, setDailySpend] = useState([]);
    const [citySummary, setCitySummary] = useState([]);
    const [streakDays, setStreakDays] = useState(0);
    const [transactions, setTransactions] = useState([]);

    useFocusEffect(
        useCallback(() => {
            loadInsightsData();
        }, [])
    );

    const loadInsightsData = async () => {
        try {
            const allTx = await getHistory();
            setTransactions(allTx);

            const now = new Date();
            const thisMonth = allTx.filter(t => {
                const d = new Date(t.timestamp);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });

            // Month total
            const total = thisMonth.reduce((s, t) => s + t.amount, 0);
            setMonthTotal(total);

            // Avg per day (days elapsed in month)
            const dayOfMonth = now.getDate();
            setAvgPerDay(Math.round(total / dayOfMonth));

            // Highest single transaction
            const highest = thisMonth.length > 0 ? Math.max(...thisMonth.map(t => t.amount)) : 0;
            setHighestDay(highest);

            // Daily spend for last 7 days (bar chart data)
            const last7 = [];
            const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const dateStr = d.toDateString();
                const dayTotal = allTx
                    .filter(t => new Date(t.timestamp).toDateString() === dateStr)
                    .reduce((s, t) => s + t.amount, 0);
                last7.push({
                    day: dayNames[d.getDay()],
                    amount: dayTotal,
                    isToday: i === 0,
                });
            }
            setDailySpend(last7);

            // Streak calculation: consecutive days with at least 1 transaction
            let streak = 0;
            for (let i = 0; i < 30; i++) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const dateStr = d.toDateString();
                const hasTx = allTx.some(t => new Date(t.timestamp).toDateString() === dateStr);
                if (hasTx) {
                    streak++;
                } else {
                    break;
                }
            }
            setStreakDays(streak);

            // City summary from reverse geocoding
            const cityMap = {};
            for (const tx of thisMonth) {
                let cityName = 'Unknown';
                try {
                    const result = await Location.reverseGeocodeAsync({
                        latitude: tx.location.lat,
                        longitude: tx.location.long,
                    });
                    if (result && result.length > 0) {
                        cityName = result[0].city || result[0].region || result[0].subregion || 'Unknown';
                    }
                } catch (e) {
                    // fallback
                }

                if (!cityMap[cityName]) {
                    cityMap[cityName] = { city: cityName, totalAmount: 0, count: 0 };
                }
                cityMap[cityName].totalAmount += tx.amount;
                cityMap[cityName].count += 1;
            }

            const summaryArray = Object.values(cityMap).sort((a, b) => b.totalAmount - a.totalAmount);
            setCitySummary(summaryArray);

        } catch (error) {
            console.log('Failed to load insights:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadInsightsData();
    };

    // Find max for bar chart scaling
    const maxDaily = Math.max(...dailySpend.map(d => d.amount), 1);

    const now = new Date();
    const monthName = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    // Max city for progress bar
    const maxCityAmount = citySummary.length > 0 ? citySummary[0].totalAmount : 1;

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.accent} />
                <Text style={styles.loadingText}>Crunching your data...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={COLORS.accent}
                    colors={[COLORS.accent]}
                    progressBackgroundColor={COLORS.bgCard}
                />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Insights</Text>
                    <Text style={styles.headerSubtitle}>
                        {monthName} · 🔥 {streakDays}-day streak
                    </Text>
                </View>
            </View>

            {/* Stat Cards Row */}
            <View style={styles.statRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>₹{monthTotal.toLocaleString('en-IN')}</Text>
                    <Text style={styles.statLabel}>This month</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>₹{avgPerDay.toLocaleString('en-IN')}</Text>
                    <Text style={styles.statLabel}>Avg / day</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>₹{highestDay.toLocaleString('en-IN')}</Text>
                    <Text style={styles.statLabel}>Highest</Text>
                </View>
            </View>

            {/* Bar Chart — Last 7 days */}
            <View style={styles.chartCard}>
                <Text style={styles.sectionTitle}>Daily spend — last 7 days</Text>
                <View style={styles.barChart}>
                    {dailySpend.map((day, i) => {
                        const barHeight = Math.max((day.amount / maxDaily) * 100, 4);
                        return (
                            <View key={i} style={styles.barColumn}>
                                <View style={styles.barWrapper}>
                                    {day.amount > 0 && (
                                        <Text style={styles.barValue}>₹{day.amount}</Text>
                                    )}
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: barHeight,
                                                backgroundColor: day.isToday ? COLORS.accent : COLORS.bgOverlay,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.barLabel, day.isToday && { color: COLORS.accent }]}>
                                    {day.day}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Spending by City */}
            <View style={styles.citySection}>
                <Text style={styles.sectionTitle}>Spending by city</Text>
                {citySummary.length === 0 ? (
                    <Text style={styles.emptyText}>No city data yet</Text>
                ) : (
                    citySummary.map((city, i) => {
                        const progress = city.totalAmount / maxCityAmount;
                        return (
                            <View key={city.city} style={styles.cityRow}>
                                <View style={styles.cityInfo}>
                                    <Text style={styles.cityName} numberOfLines={1}>{city.city}</Text>
                                    <View style={styles.progressBarBg}>
                                        <View
                                            style={[
                                                styles.progressBarFill,
                                                {
                                                    width: `${progress * 100}%`,
                                                    backgroundColor: i === 0 ? COLORS.accent : COLORS.bgOverlay,
                                                },
                                            ]}
                                        />
                                    </View>
                                </View>
                                <Text style={styles.cityAmount}>
                                    ₹{city.totalAmount.toLocaleString('en-IN')}
                                </Text>
                            </View>
                        );
                    })
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
    },
    loadingText: {
        color: COLORS.textMuted,
        marginTop: 12,
        fontSize: SIZES.md,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: SIZES.title,
        color: COLORS.textPrimary,
        ...FONTS.bold,
    },
    headerSubtitle: {
        fontSize: SIZES.md,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    statRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 8,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.bgCard,
        borderRadius: SIZES.radius,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statValue: {
        fontSize: SIZES.xl,
        color: COLORS.textPrimary,
        ...FONTS.bold,
    },
    statLabel: {
        fontSize: SIZES.xs,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    chartCard: {
        margin: 16,
        backgroundColor: COLORS.bgCard,
        borderRadius: SIZES.radius,
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sectionTitle: {
        fontSize: SIZES.md,
        color: COLORS.textSecondary,
        ...FONTS.semiBold,
        marginBottom: 16,
    },
    barChart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 140,
    },
    barColumn: {
        flex: 1,
        alignItems: 'center',
    },
    barWrapper: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },
    bar: {
        width: 24,
        borderRadius: 4,
        minHeight: 4,
    },
    barValue: {
        fontSize: 9,
        color: COLORS.textMuted,
        marginBottom: 4,
        ...FONTS.medium,
    },
    barLabel: {
        fontSize: SIZES.sm,
        color: COLORS.textMuted,
        marginTop: 8,
        ...FONTS.medium,
    },
    citySection: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    cityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bgCard,
        padding: 14,
        borderRadius: SIZES.radius,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLORS.borderMuted,
    },
    cityInfo: {
        flex: 1,
        marginRight: 12,
    },
    cityName: {
        fontSize: SIZES.md,
        color: COLORS.textPrimary,
        ...FONTS.semiBold,
        marginBottom: 8,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: COLORS.bgInset,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 6,
        borderRadius: 3,
    },
    cityAmount: {
        fontSize: SIZES.lg,
        color: COLORS.textPrimary,
        ...FONTS.bold,
    },
    emptyText: {
        color: COLORS.textMuted,
        fontSize: SIZES.md,
    },
});
