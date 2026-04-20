import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import v2 screens
import HomeScreen from './src/screens/HomeScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import MapScreen from './src/screens/MapScreen';
import InsightsScreen from './src/screens/InsightsScreen';

// Helper to init device ID
import { initDeviceId } from './src/utils/device';

// Theme colors (duplicated from theme for App-level use)
const C = {
    bg: '#0d1117',
    bgCard: '#161b22',
    border: '#30363d',
    textPrimary: '#e6edf3',
    textSecondary: '#8b949e',
    textMuted: '#484f58',
    accent: '#0D9488',
};

const Tab = createBottomTabNavigator();

// GitHub-dark navigation theme
const GeoPayDarkTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        primary: C.accent,
        background: C.bg,
        card: C.bgCard,
        text: C.textPrimary,
        border: C.border,
        notification: C.accent,
    },
};

// Custom FAB button for the center Add tab
function AddButton({ children, onPress }) {
    return (
        <TouchableOpacity
            style={styles.fabContainer}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.fab}>
                {children}
            </View>
        </TouchableOpacity>
    );
}

// Simple Profile screen
function ProfileScreen() {
    return (
        <View style={styles.profileContainer}>
            <Ionicons name="person-circle-outline" size={80} color={C.textMuted} />
            <View style={styles.profileCard}>
                <View style={styles.profileRow}>
                    <Ionicons name="finger-print-outline" size={20} color={C.accent} />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.profileTitle}>Device-based ID</Text>
                        <Text style={styles.profileSub}>No login required</Text>
                    </View>
                </View>
            </View>
            <View style={styles.profileCard}>
                <View style={styles.profileRow}>
                    <Ionicons name="shield-checkmark-outline" size={20} color={C.accent} />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.profileTitle}>Privacy First</Text>
                        <Text style={styles.profileSub}>Data stays on your device + cloud</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.versionText}>GeoPayLog v2.0</Text>
            <Text style={styles.tagline}>Zero-friction expense tracking 🌍</Text>
        </View>
    );
}

export default function App() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // When the app starts, we want to make sure we have a Device ID.
        // This effectively "logs in" the user silently.
        const prepareApp = async () => {
            try {
                await initDeviceId();
            } catch (e) {
                console.warn("Could not init device ID", e);
            } finally {
                setIsReady(true);
            }
        };

        prepareApp();
    }, []);

    if (!isReady) {
        return null; // Or a loading spinner
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer theme={GeoPayDarkTheme}>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: C.bg,
                            elevation: 0,
                            shadowOpacity: 0,
                            borderBottomWidth: 1,
                            borderBottomColor: C.border,
                        },
                        headerTintColor: C.textPrimary,
                        headerTitleStyle: {
                            fontWeight: '700',
                            fontSize: 18,
                        },
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === 'Home') {
                                iconName = focused ? 'home' : 'home-outline';
                            } else if (route.name === 'Add') {
                                iconName = 'add';
                            } else if (route.name === 'Map') {
                                iconName = focused ? 'map' : 'map-outline';
                            } else if (route.name === 'Insights') {
                                iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                            } else if (route.name === 'Profile') {
                                iconName = focused ? 'person' : 'person-outline';
                            }

                            // The FAB icon is white; other icons use the tab color
                            if (route.name === 'Add') {
                                return <Ionicons name={iconName} size={28} color="#fff" />;
                            }

                            return <Ionicons name={iconName} size={22} color={color} />;
                        },
                        tabBarActiveTintColor: C.accent,
                        tabBarInactiveTintColor: C.textMuted,
                        tabBarStyle: styles.tabBar,
                        tabBarLabelStyle: styles.tabBarLabel,
                        tabBarItemStyle: styles.tabBarItem,
                    })}
                >
                    <Tab.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ title: 'Home', headerTitle: 'GeoPayLog' }}
                    />
                    <Tab.Screen
                        name="Map"
                        component={MapScreen}
                        options={{ title: 'Map', headerTitle: 'Spending Map' }}
                    />
                    <Tab.Screen
                        name="Add"
                        component={AddTransactionScreen}
                        options={{
                            title: '',
                            headerTitle: 'Log Expense',
                            tabBarButton: (props) => <AddButton {...props} />,
                        }}
                    />
                    <Tab.Screen
                        name="Insights"
                        component={InsightsScreen}
                        options={{ title: 'Insights', headerTitle: 'Insights' }}
                    />
                    <Tab.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{ title: 'Profile', headerTitle: 'Profile' }}
                    />
                </Tab.Navigator>

                <StatusBar style="light" />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: C.bgCard,
        borderTopWidth: 1,
        borderTopColor: C.border,
        height: Platform.OS === 'ios' ? 88 : 68,
        paddingTop: 6,
        paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 20,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: -4 },
        shadowRadius: 12,
    },
    tabBarLabel: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    tabBarItem: {
        paddingVertical: 2,
    },
    fabContainer: {
        top: -22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: C.accent,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: C.accent,
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    profileContainer: {
        flex: 1,
        backgroundColor: C.bg,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    profileCard: {
        backgroundColor: C.bgCard,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: C.border,
        width: 280,
        marginTop: 16,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileTitle: {
        fontSize: 14,
        color: C.textPrimary,
        fontWeight: '600',
    },
    profileSub: {
        fontSize: 12,
        color: C.textMuted,
        marginTop: 2,
    },
    versionText: {
        marginTop: 32,
        fontSize: 14,
        color: C.textMuted,
        fontWeight: '600',
    },
    tagline: {
        marginTop: 4,
        fontSize: 12,
        color: C.textMuted,
    },
});
