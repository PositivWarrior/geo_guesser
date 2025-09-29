import React, { useEffect, useState } from 'react';
import { StatusBar, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Screens
import HomeScreen from '@/screens/HomeScreen';
import GameScreen from '@/screens/GameScreen';
import GameCompleteScreen from '@/screens/GameCompleteScreen';
import AchievementsScreen from '@/screens/AchievementsScreen';
import StoreScreen from '@/screens/StoreScreen';
import SettingsScreen from '@/screens/SettingsScreen';

// Services
import FirebaseService from '@/services/firebaseService';
import PurchaseService from '@/services/purchaseService';

// Types
import { NavigationStackParamList } from '@/types';
import { COLORS } from '@/utils/constants';

const Stack = createStackNavigator<NavigationStackParamList>();

const App: React.FC = () => {
	const [isInitialized, setIsInitialized] = useState(false);
	const [initializationError, setInitializationError] = useState<
		string | null
	>(null);

	useEffect(() => {
		initializeApp();
	}, []);

	const initializeApp = async () => {
		try {
			// Skip Firebase initialization on web for development
			if (Platform.OS !== 'web') {
				// Initialize Firebase services
				const firebaseService = FirebaseService.getInstance();
				await firebaseService.initializeRemoteConfig();

				// Initialize RevenueCat (commented out for demo)
				// const purchaseService = PurchaseService.getInstance();
				// await purchaseService.initialize('your_revenuecat_api_key');

				// Set mock user ID for testing
				// await purchaseService.setUserId('mock-user-id');
			}

			console.log('App initialized successfully');
			setIsInitialized(true);
		} catch (error) {
			console.error('Failed to initialize app:', error);
			setInitializationError(
				'Failed to initialize app. Please restart the application.',
			);

			Alert.alert(
				'Initialization Error',
				'Failed to initialize the app. Some features may not work properly.',
				[
					{
						text: 'Continue Anyway',
						onPress: () => setIsInitialized(true),
					},
					{ text: 'Retry', onPress: initializeApp },
				],
			);
		}
	};

	if (!isInitialized) {
		// In a real app, you'd show a proper loading screen here
		return null;
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<StatusBar
					barStyle="light-content"
					backgroundColor={COLORS.background}
					translucent={false}
				/>
				<NavigationContainer>
					<Stack.Navigator
						initialRouteName="Home"
						screenOptions={{
							headerShown: false,
							gestureEnabled: true,
							cardStyle: { backgroundColor: COLORS.background },
							animationTypeForReplace: 'push',
						}}
					>
						<Stack.Screen
							name="Home"
							component={HomeScreen}
							options={{
								title: 'GeoGuesser',
							}}
						/>
						<Stack.Screen
							name="Game"
							component={GameScreen}
							options={{
								title: 'Game',
								gestureEnabled: false, // Prevent accidental navigation during game
							}}
						/>
						<Stack.Screen
							name="GameComplete"
							component={GameCompleteScreen}
							options={{
								title: 'Game Complete',
								gestureEnabled: false, // Prevent going back to game
							}}
						/>
						<Stack.Screen
							name="Achievements"
							component={AchievementsScreen}
							options={{
								title: 'Achievements',
							}}
						/>
						<Stack.Screen
							name="Store"
							component={StoreScreen}
							options={{
								title: 'Store',
							}}
						/>
						<Stack.Screen
							name="Settings"
							component={SettingsScreen}
							options={{
								title: 'Settings',
							}}
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
};

export default App;
