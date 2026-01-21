import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import our screens
import HomeScreen from './src/screens/HomeScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import MapScreen from './src/screens/MapScreen';
import CitySummaryScreen from './src/screens/CitySummaryScreen';

// Helper to init device ID
import { initDeviceId } from './src/utils/device';

const Tab = createBottomTabNavigator();

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
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        headerShown: true,
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === 'Home') {
                                iconName = focused ? 'file-tray-full' : 'file-tray-outline';
                            } else if (route.name === 'Add') {
                                iconName = focused ? 'add-circle' : 'add-circle-outline';
                            } else if (route.name === 'Map') {
                                iconName = focused ? 'map' : 'map-outline';
                            } else if (route.name === 'Cities') {
                                iconName = focused ? 'location' : 'location-outline';
                            }

                            return <Ionicons name={iconName} size={size} color={color} />;
                        },
                        tabBarActiveTintColor: '#2f95dc',
                        tabBarInactiveTintColor: 'gray',
                    })}
                >
                    <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'My Log' }} />
                    <Tab.Screen name="Add" component={AddTransactionScreen} options={{ title: 'New Entry' }} />
                    <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Explore' }} />
                    <Tab.Screen name="Cities" component={CitySummaryScreen} options={{ title: 'City Summary' }} />
                </Tab.Navigator>

                <StatusBar style="auto" />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
