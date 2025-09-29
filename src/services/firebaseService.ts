import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import remoteConfig from '@react-native-firebase/remote-config';
import { UserProfile, Achievement, RemoteConfigValues } from '@/types';

class FirebaseService {
  private static instance: FirebaseService;

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // Remote Config
  async initializeRemoteConfig(): Promise<void> {
    try {
      await remoteConfig().setDefaults({
        timer_durations: JSON.stringify({
          Europe: 900,
          Asia: 1800,
          Africa: 1500,
          'North America': 600,
          'South America': 480,
          Oceania: 300,
          'All World': 3600,
        }),
        game_settings: JSON.stringify({
          allowTimerPause: true,
          minGuessLength: 2,
          caseSensitive: false,
        }),
        achievement_settings: JSON.stringify({
          speedDemonTimeLimit: 600, // 10 minutes for All World
        }),
      });

      await remoteConfig().fetchAndActivate();
    } catch (error) {
      console.error('Failed to initialize Remote Config:', error);
    }
  }

  async getRemoteConfigValues(): Promise<RemoteConfigValues> {
    try {
      const timerDurations = JSON.parse(
        remoteConfig().getValue('timer_durations').asString()
      );
      const gameSettings = JSON.parse(
        remoteConfig().getValue('game_settings').asString()
      );
      const achievementSettings = JSON.parse(
        remoteConfig().getValue('achievement_settings').asString()
      );

      return {
        timerDurations,
        gameSettings,
        achievementSettings,
      };
    } catch (error) {
      console.error('Failed to get remote config values:', error);
      throw error;
    }
  }

  // User Profile Management
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const doc = await firestore().collection('users').doc(userId).get();
      if (doc.exists) {
        return doc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  async createUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    try {
      await firestore().collection('users').doc(userId).set({
        id: userId,
        achievements: [],
        unlockedModes: ['Europe'], // Europe is free
        statistics: {
          totalGamesPlayed: 0,
          totalCorrectGuesses: 0,
          bestTimes: {},
          completionRates: {},
        },
        createdAt: firestore.FieldValue.serverTimestamp(),
        ...profile,
      });
    } catch (error) {
      console.error('Failed to create user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      await firestore().collection('users').doc(userId).update({
        ...updates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  // Achievements
  async unlockAchievement(userId: string, achievement: Achievement): Promise<void> {
    try {
      await firestore().collection('users').doc(userId).update({
        achievements: firestore.FieldValue.arrayUnion({
          ...achievement,
          unlockedAt: firestore.FieldValue.serverTimestamp(),
        }),
      });
    } catch (error) {
      console.error('Failed to unlock achievement:', error);
      throw error;
    }
  }

  // IAP Verification
  async verifyPurchase(userId: string, receipt: string, productId: string): Promise<boolean> {
    try {
      const verifyPurchaseFunction = functions().httpsCallable('verifyPurchase');
      const result = await verifyPurchaseFunction({
        userId,
        receipt,
        productId,
      });

      return result.data.isValid;
    } catch (error) {
      console.error('Failed to verify purchase:', error);
      return false;
    }
  }

  async unlockContinent(userId: string, continent: string): Promise<void> {
    try {
      await firestore().collection('users').doc(userId).update({
        unlockedModes: firestore.FieldValue.arrayUnion(continent),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to unlock continent:', error);
      throw error;
    }
  }

  // Game Statistics
  async updateGameStatistics(
    userId: string, 
    mode: string, 
    score: number, 
    time: number, 
    accuracy: number
  ): Promise<void> {
    try {
      const userRef = firestore().collection('users').doc(userId);
      
      await firestore().runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const userData = userDoc.data() as UserProfile;
        
        const updatedStats = {
          totalGamesPlayed: userData.statistics.totalGamesPlayed + 1,
          totalCorrectGuesses: userData.statistics.totalCorrectGuesses + score,
          bestTimes: {
            ...userData.statistics.bestTimes,
            [mode]: Math.min(userData.statistics.bestTimes[mode] || Infinity, time),
          },
          completionRates: {
            ...userData.statistics.completionRates,
            [mode]: accuracy,
          },
        };

        transaction.update(userRef, {
          statistics: updatedStats,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      });
    } catch (error) {
      console.error('Failed to update game statistics:', error);
      throw error;
    }
  }

  // LLM Integration for Timer Pause Logic
  async shouldAllowTimerPause(
    userId: string, 
    gameMode: string, 
    gameState: any
  ): Promise<boolean> {
    try {
      const llmFunction = functions().httpsCallable('evaluateTimerPause');
      const result = await llmFunction({
        userId,
        gameMode,
        gameState,
        remoteConfig: await this.getRemoteConfigValues(),
      });

      return result.data.allowPause;
    } catch (error) {
      console.error('Failed to evaluate timer pause:', error);
      // Default to allowing pause if LLM fails
      return true;
    }
  }
}

export default FirebaseService;
