import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { NavigationStackParamList, Achievement } from '@/types';
import { COLORS, FONTS, SIZES } from '@/utils/constants';
import Button from '@/components/Button';
import GameService from '@/services/gameService';

interface GameCompleteScreenProps {
  navigation: NavigationProp<NavigationStackParamList>;
  route: RouteProp<NavigationStackParamList, 'GameComplete'>;
}

const GameCompleteScreen: React.FC<GameCompleteScreenProps> = ({
  navigation,
  route,
}) => {
  const { mode, score, time, accuracy } = route.params;
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const gameService = GameService.getInstance();

  useEffect(() => {
    checkAchievements();
  }, []);

  const checkAchievements = async () => {
    try {
      // Mock game state for achievement checking
      const mockGameState = {
        currentMode: mode,
        currentCountry: null,
        guessedCountries: new Set(),
        correctGuesses: score,
        totalCountries: mode.countries.length,
        timeRemaining: 0,
        isGameActive: false,
        isPaused: false,
        gameStartTime: Date.now() - (time * 1000),
      };

      const results = { score, accuracy, completionRate: accuracy, timeTaken: time };
      const newAchievements = await gameService.checkAchievements(
        mockGameState,
        results,
        'mock-user-id'
      );
      
      setAchievements(newAchievements);
    } catch (error) {
      console.error('Failed to check achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceEmoji = (accuracy: number): string => {
    if (accuracy === 100) return '🏆';
    if (accuracy >= 80) return '🥇';
    if (accuracy >= 60) return '🥈';
    if (accuracy >= 40) return '🥉';
    return '📚';
  };

  const getPerformanceMessage = (accuracy: number): string => {
    if (accuracy === 100) return 'Perfect! Outstanding performance!';
    if (accuracy >= 80) return 'Excellent! Great geography knowledge!';
    if (accuracy >= 60) return 'Good job! Keep practicing!';
    if (accuracy >= 40) return 'Nice try! Room for improvement!';
    return 'Keep studying! You\'ll get better!';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>{getPerformanceEmoji(accuracy)}</Text>
          <Text style={styles.title}>Game Complete!</Text>
          <Text style={styles.subtitle}>{getPerformanceMessage(accuracy)}</Text>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Results</Text>
          
          <View style={styles.statGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{score}</Text>
              <Text style={styles.statLabel}>Correct Answers</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{Math.round(accuracy)}%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatTime(time)}</Text>
              <Text style={styles.statLabel}>Time Taken</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{mode.countries.length}</Text>
              <Text style={styles.statLabel}>Total Countries</Text>
            </View>
          </View>
        </View>

        {achievements.length > 0 && (
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>🎉 New Achievements!</Text>
            
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.modeInfo}>
          <Text style={styles.sectionTitle}>Mode: {mode.name}</Text>
          <Text style={styles.modeDescription}>
            You completed {score} out of {mode.countries.length} countries
            {mode.continent && ` in ${mode.continent}`}.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Play Again"
            onPress={() => navigation.replace('Game', { mode })}
            variant="accent"
            size="large"
            fullWidth
            style={styles.actionButton}
          />
          
          <Button
            title="Try Another Mode"
            onPress={() => navigation.navigate('Home')}
            variant="primary"
            size="large"
            fullWidth
            style={styles.actionButton}
          />
          
          <Button
            title="View Achievements"
            onPress={() => navigation.navigate('Achievements')}
            variant="outline"
            size="medium"
            fullWidth
            style={styles.actionButton}
          />
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
  header: {
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xxl,
    paddingBottom: SIZES.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: SIZES.md,
  },
  title: {
    fontSize: SIZES.display,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.subtitle,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: SIZES.heading,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    marginBottom: SIZES.lg,
    textAlign: 'center',
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SIZES.md,
  },
  statCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: SIZES.lg,
    alignItems: 'center',
    width: '47%',
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: SIZES.heading,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  statLabel: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
    textAlign: 'center',
  },
  achievementsContainer: {
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: SIZES.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: SIZES.subtitle,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  achievementDescription: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.white,
    opacity: 0.9,
  },
  modeInfo: {
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  modeDescription: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
    textAlign: 'center',
    lineHeight: SIZES.lg,
  },
  actions: {
    paddingHorizontal: SIZES.lg,
    gap: SIZES.md,
  },
  actionButton: {
    marginBottom: SIZES.sm,
  },
});

export default GameCompleteScreen;
