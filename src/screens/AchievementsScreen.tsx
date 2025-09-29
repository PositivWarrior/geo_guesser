import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { Achievement, NavigationStackParamList } from '@/types';
import { COLORS, FONTS, SIZES, ACHIEVEMENT_IDS } from '@/utils/constants';
import Button from '@/components/Button';

interface AchievementsScreenProps {
  navigation: NavigationProp<NavigationStackParamList>;
}

// Mock achievements data
const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: ACHIEVEMENT_IDS.EUROPE_COMPLETE,
    title: 'European Explorer',
    description: 'Complete Europe with 100% accuracy',
    icon: '🇪🇺',
    isUnlocked: true,
    unlockedAt: new Date('2024-01-15'),
    condition: { type: 'continent_complete', target: 'Europe' },
  },
  {
    id: ACHIEVEMENT_IDS.SPEED_DEMON,
    title: 'Speed Demon',
    description: 'Complete All World in under 10 minutes',
    icon: '⚡',
    isUnlocked: false,
    condition: { type: 'time_challenge', target: 600 },
  },
  {
    id: ACHIEVEMENT_IDS.PERFECTIONIST,
    title: 'Perfectionist',
    description: 'Complete any mode with 100% accuracy',
    icon: '💯',
    isUnlocked: true,
    unlockedAt: new Date('2024-01-10'),
    condition: { type: 'accuracy', target: 100 },
  },
  {
    id: ACHIEVEMENT_IDS.ASIA_COMPLETE,
    title: 'Asian Master',
    description: 'Complete Asia with 100% accuracy',
    icon: '🌏',
    isUnlocked: false,
    condition: { type: 'continent_complete', target: 'Asia' },
  },
  {
    id: ACHIEVEMENT_IDS.AFRICA_COMPLETE,
    title: 'African Expert',
    description: 'Complete Africa with 100% accuracy',
    icon: '🌍',
    isUnlocked: false,
    condition: { type: 'continent_complete', target: 'Africa' },
  },
  {
    id: ACHIEVEMENT_IDS.GLOBE_TROTTER,
    title: 'Globe Trotter',
    description: 'Unlock all continents',
    icon: '🌐',
    isUnlocked: false,
    condition: { type: 'continent_complete', target: 'All' },
  },
];

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ navigation }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      // In a real app, this would fetch from Firebase
      setAchievements(MOCK_ACHIEVEMENTS);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAchievements = (): Achievement[] => {
    switch (filter) {
      case 'unlocked':
        return achievements.filter(a => a.isUnlocked);
      case 'locked':
        return achievements.filter(a => !a.isUnlocked);
      default:
        return achievements;
    }
  };

  const getUnlockedCount = (): number => {
    return achievements.filter(a => a.isUnlocked).length;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderAchievement = (achievement: Achievement) => (
    <View
      key={achievement.id}
      style={[
        styles.achievementCard,
        achievement.isUnlocked ? styles.unlockedCard : styles.lockedCard,
      ]}
    >
      <View style={styles.achievementHeader}>
        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        <View style={styles.achievementInfo}>
          <Text style={[
            styles.achievementTitle,
            !achievement.isUnlocked && styles.lockedText,
          ]}>
            {achievement.title}
          </Text>
          <Text style={[
            styles.achievementDescription,
            !achievement.isUnlocked && styles.lockedText,
          ]}>
            {achievement.description}
          </Text>
        </View>
        {achievement.isUnlocked && (
          <View style={styles.unlockedBadge}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </View>
      
      {achievement.isUnlocked && achievement.unlockedAt && (
        <Text style={styles.unlockedDate}>
          Unlocked on {formatDate(achievement.unlockedAt)}
        </Text>
      )}
      
      {!achievement.isUnlocked && (
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>Not yet unlocked</Text>
          <View style={styles.lockIcon}>
            <Text style={styles.lockEmoji}>🔒</Text>
          </View>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading achievements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="← Back"
          onPress={() => navigation.goBack()}
          variant="outline"
          size="small"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>
            {getUnlockedCount()} of {achievements.length} unlocked
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterText,
            filter === 'all' && styles.activeFilterText,
          ]}>
            All ({achievements.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === 'unlocked' && styles.activeFilter]}
          onPress={() => setFilter('unlocked')}
        >
          <Text style={[
            styles.filterText,
            filter === 'unlocked' && styles.activeFilterText,
          ]}>
            Unlocked ({getUnlockedCount()})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === 'locked' && styles.activeFilter]}
          onPress={() => setFilter('locked')}
        >
          <Text style={[
            styles.filterText,
            filter === 'locked' && styles.activeFilterText,
          ]}>
            Locked ({achievements.length - getUnlockedCount()})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {getFilteredAchievements().map(renderAchievement)}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Keep playing to unlock more achievements!
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.heading,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
  },
  placeholder: {
    width: 60, // Same width as back button
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.md,
  },
  filterButton: {
    flex: 1,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: 8,
    marginHorizontal: SIZES.xs,
    backgroundColor: COLORS.darkGray,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
  },
  activeFilterText: {
    color: COLORS.white,
    fontFamily: FONTS.bodySemiBold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.xxl,
  },
  achievementCard: {
    borderRadius: 16,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  unlockedCard: {
    backgroundColor: COLORS.primary,
  },
  lockedCard: {
    backgroundColor: COLORS.darkGray,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
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
    color: COLORS.lightGray,
  },
  lockedText: {
    opacity: 0.6,
  },
  unlockedBadge: {
    backgroundColor: COLORS.success,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 20,
    color: COLORS.white,
  },
  unlockedDate: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
    fontStyle: 'italic',
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.sm,
  },
  progressText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
    opacity: 0.7,
  },
  lockIcon: {
    backgroundColor: COLORS.black,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockEmoji: {
    fontSize: 14,
  },
  footer: {
    paddingVertical: SIZES.xl,
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

export default AchievementsScreen;
