import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getHistory } from '../services/api';
import { COLORS, CATEGORY_CONFIG, SIZES, FONTS } from '../theme/colors';

const { width, height } = Dimensions.get('window');
const FILTERS = ['Today', 'Week', 'Month', 'All'];

export default function MapScreen() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTx, setFilteredTx] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const mapRef = useRef(null);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getHistory();
            setTransactions(data);
            applyFilter('All', data);
        } catch (e) {
            console.log('Map load error', e);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = (filter, data = transactions) => {
        setActiveFilter(filter);
        const now = new Date();

        let filtered = data;
        if (filter === 'Today') {
            filtered = data.filter(t => {
                const d = new Date(t.timestamp);
                return d.toDateString() === now.toDateString();
            });
        } else if (filter === 'Week') {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            filtered = data.filter(t => new Date(t.timestamp) >= weekAgo);
        } else if (filter === 'Month') {
            filtered = data.filter(t => {
                const d = new Date(t.timestamp);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
        }

        setFilteredTx(filtered);

        // Auto-zoom to fit
        if (filtered.length > 0 && mapRef.current) {
            const coords = filtered.map(t => ({
                latitude: t.location.lat,
                longitude: t.location.long,
            }));
            setTimeout(() => {
                mapRef.current?.fitToCoordinates(coords, {
                    edgePadding: { top: 80, right: 40, bottom: 80, left: 40 },
                    animated: true,
                });
            }, 500);
        }
    };

    // Calculate area total for the overlay
    const areaTotal = filteredTx.reduce((sum, t) => sum + t.amount, 0);

    // Custom dark map style
    const darkMapStyle = [
        { elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1117' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#8b949e' }] },
        { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#30363d' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#21262d' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#30363d' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1c2128' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#010409' }] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#161b22' }] },
        { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#161b22' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Spending map</Text>
                <View style={styles.filterRow}>
                    {FILTERS.map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                            onPress={() => applyFilter(f)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Map */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.accent} />
                </View>
            ) : (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    customMapStyle={darkMapStyle}
                    initialRegion={{
                        latitude: 28.6139,
                        longitude: 77.2090,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    userInterfaceStyle="dark"
                >
                    {filteredTx.map((t) => {
                        const catConfig = CATEGORY_CONFIG[t.category] || CATEGORY_CONFIG.Other;
                        return (
                            <Marker
                                key={t._id}
                                coordinate={{
                                    latitude: t.location.lat,
                                    longitude: t.location.long,
                                }}
                            >
                                {/* Custom amount bubble marker */}
                                <View style={[styles.markerBubble, { backgroundColor: catConfig.color }]}>
                                    <Text style={styles.markerText}>₹{t.amount}</Text>
                                </View>
                                <View style={[styles.markerArrow, { borderTopColor: catConfig.color }]} />

                                <Callout tooltip>
                                    <View style={styles.callout}>
                                        <Text style={styles.calloutTitle}>{t.note || 'Expense'}</Text>
                                        <Text style={styles.calloutAmount}>₹{t.amount}</Text>
                                        <Text style={styles.calloutDate}>
                                            {new Date(t.timestamp).toLocaleDateString('en-IN')}
                                        </Text>
                                    </View>
                                </Callout>
                            </Marker>
                        );
                    })}
                </MapView>
            )}

            {/* Bottom overlay */}
            {filteredTx.length > 0 && (
                <View style={styles.overlay}>
                    <Ionicons name="wallet" size={16} color={COLORS.accent} />
                    <Text style={styles.overlayText}>
                        ₹{areaTotal.toLocaleString('en-IN')} in this area · {filteredTx.length} transactions
                    </Text>
                </View>
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
        paddingTop: 12,
        paddingBottom: 14,
        backgroundColor: COLORS.bg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: SIZES.xxl,
        color: COLORS.textPrimary,
        ...FONTS.bold,
        marginBottom: 12,
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: SIZES.radiusFull,
        backgroundColor: COLORS.bgElevated,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterChipActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    filterText: {
        fontSize: SIZES.sm,
        color: COLORS.textSecondary,
        ...FONTS.medium,
    },
    filterTextActive: {
        color: '#fff',
        ...FONTS.semiBold,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
    },
    map: {
        flex: 1,
    },
    markerBubble: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        minWidth: 50,
        alignItems: 'center',
    },
    markerText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    markerArrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        alignSelf: 'center',
    },
    callout: {
        backgroundColor: COLORS.bgCard,
        borderRadius: SIZES.radius,
        padding: 14,
        minWidth: 140,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    calloutTitle: {
        fontSize: SIZES.md,
        color: COLORS.textPrimary,
        ...FONTS.semiBold,
    },
    calloutAmount: {
        fontSize: SIZES.xl,
        color: COLORS.accent,
        ...FONTS.bold,
        marginTop: 4,
    },
    calloutDate: {
        fontSize: SIZES.xs,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    overlay: {
        position: 'absolute',
        bottom: 90,
        left: 16,
        right: 16,
        backgroundColor: COLORS.bgCard,
        borderRadius: SIZES.radius,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: COLORS.accentBorder,
    },
    overlayText: {
        fontSize: SIZES.md,
        color: COLORS.textPrimary,
        ...FONTS.medium,
    },
});
