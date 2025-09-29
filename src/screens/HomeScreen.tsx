import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { GameMode, NavigationStackParamList } from '@/types';
import { COLORS, FONTS, SIZES } from '@/utils/constants';
import GameModeCard from '@/components/GameModeCard';
import Button from '@/components/Button';
import GameService from '@/services/gameService';
import PurchaseService from '@/services/purchaseService';
import FirebaseService from '@/services/firebaseService';

interface HomeScreenProps {
  navigation: NavigationProp<NavigationStackParamList>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const gameService = GameService.getInstance();
  const purchaseService = PurchaseService.getInstance();
  const firebaseService = FirebaseService.getInstance();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Initialize services
      await firebaseService.initializeRemoteConfig();
      
      // Get user's unlocked continents (mock for now)
      const unlockedContinents = ['Europe']; // Europe is free
      
      // Create game modes
      const modes = await gameService.createGameModes(unlockedContinents);
      setGameModes(modes);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      Alert.alert('Error', 'Failed to load game modes');
    } finally {
      setLoading(false);
    }
  };

  const handleModePress = (mode: GameMode) => {
    if (mode.isLocked) {
      Alert.alert(
        'Mode Locked',
        `This mode requires a purchase of ${mode.price}. Would you like to unlock it?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Unlock', onPress: () => handlePurchase(mode) },
        ]
      );
      return;
    }

    navigation.navigate('Game', { mode });
  };

  const handlePurchase = async (mode: GameMode) => {
    try {
      // Mock purchase for now
      Alert.alert(
        'Purchase',
        `Purchase ${mode.name} for ${mode.price}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Buy',
            onPress: () => {
              Alert.alert('Success', 'Purchase completed! (Mock)');
              // In real app, would update the mode's locked status
            },
          },
        ]
      );
    } catch (error) {
      console.error('Purchase failed:', error);
      Alert.alert('Error', 'Purchase failed. Please try again.');
    }
  };

  const navigateToAchievements = () => {
    navigation.navigate('Achievements');
  };

  const navigateToStore = () => {
    navigation.navigate('Store');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>GeoGuesser</Text>
          <Text style={styles.subtitle}>Test your geography knowledge</Text>
        </View>

        <View style={styles.quickActions}>
          <Button
            title="🏆 Achievements"
            onPress={navigateToAchievements}
            variant="secondary"
            size="small"
            style={styles.actionButton}
          />
          <Button
            title="🛒 Store"
            onPress={navigateToStore}
            variant="secondary"
            size="small"
            style={styles.actionButton}
          />
          <Button
            title="⚙️ Settings"
            onPress={navigateToSettings}
            variant="secondary"
            size="small"
            style={styles.actionButton}
          />
        </View>

        <View style={styles.modesSection}>
          <Text style={styles.sectionTitle}>Game Modes</Text>
          <Text style={styles.sectionSubtitle}>
            Choose a continent to test your knowledge
          </Text>

          {gameModes.map((mode) => (
            <GameModeCard
              key={mode.id}
              mode={mode}
              onPress={() => handleModePress(mode)}
              onPurchase={() => handlePurchase(mode)}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Start with Europe (free) or unlock other continents
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: SIZES.subtitle,
    fontFamily: FONTS.body,
    color: COLORS.white,
  },
  header: {
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xxl,
    paddingBottom: SIZES.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.display,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.subtitle,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SIZES.xs,
  },
  modesSection: {
    paddingHorizontal: SIZES.lg,
  },
  sectionTitle: {
    fontSize: SIZES.heading,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  sectionSubtitle: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
    marginBottom: SIZES.lg,
  },
  footer: {
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default HomeScreen;
