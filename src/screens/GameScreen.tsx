import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { GameMode, GameState, NavigationStackParamList } from '@/types';
import { COLORS, FONTS, SIZES } from '@/utils/constants';
import WorldMap from '@/components/WorldMap';
import GameTimer from '@/components/GameTimer';
import Button from '@/components/Button';
import GameService from '@/services/gameService';
import FirebaseService from '@/services/firebaseService';

interface GameScreenProps {
  navigation: NavigationProp<NavigationStackParamList>;
  route: RouteProp<NavigationStackParamList, 'Game'>;
}

const GameScreen: React.FC<GameScreenProps> = ({ navigation, route }) => {
  const { mode } = route.params;
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const [canPause, setCanPause] = useState(true);
  
  const gameService = GameService.getInstance();
  const firebaseService = FirebaseService.getInstance();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const guessInputRef = useRef<TextInput>(null);

  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameState?.isGameActive && !gameState.isPaused) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [gameState?.isGameActive, gameState?.isPaused]);

  const initializeGame = () => {
    const initialState = gameService.initializeGame(mode);
    setGameState(initialState);
    
    // Check if timer pause is allowed
    checkPausePermission(initialState);
  };

  const checkPausePermission = async (state: GameState) => {
    try {
      const allowPause = await gameService.pauseGame(state, 'mock-user-id');
      setCanPause(allowPause);
    } catch (error) {
      console.error('Failed to check pause permission:', error);
      setCanPause(true); // Default to allowing pause
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setGameState(prevState => {
        if (!prevState || !prevState.isGameActive || prevState.isPaused) {
          return prevState;
        }
        
        const updatedState = gameService.updateTimer(prevState, 1);
        
        if (!updatedState.isGameActive) {
          // Game over
          setTimeout(() => endGame(updatedState), 100);
        }
        
        return updatedState;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleGuessSubmit = async () => {
    if (!gameState || !gameState.currentCountry || !guess.trim()) {
      return;
    }

    try {
      const isCorrect = await gameService.validateGuess(guess, gameState.currentCountry);
      
      if (isCorrect) {
        const updatedState = gameService.processCorrectGuess(gameState);
        setGameState(updatedState);
        setGuess('');
        setFeedback(`Correct! ${gameState.currentCountry.name}`);
        
        // Check if game is complete
        if (!updatedState.currentCountry) {
          setTimeout(() => endGame(updatedState), 1000);
        }
      } else {
        setFeedback(`Try again! Keep guessing...`);
        // Don't clear the guess for incorrect attempts
      }
      
      // Clear feedback after 2 seconds
      setTimeout(() => setFeedback(''), 2000);
    } catch (error) {
      console.error('Failed to validate guess:', error);
      setFeedback('Error validating guess');
    }
  };

  const handlePause = async () => {
    if (!gameState || !canPause) return;
    
    setGameState(prev => prev ? { ...prev, isPaused: true } : null);
  };

  const handleResume = () => {
    if (!gameState) return;
    
    setGameState(prev => prev ? { ...prev, isPaused: false } : null);
  };

  const endGame = (finalState: GameState) => {
    stopTimer();
    
    const results = gameService.calculateGameResults(finalState);
    
    navigation.navigate('GameComplete', {
      mode: finalState.currentMode,
      score: results.score,
      time: results.timeTaken,
      accuracy: results.accuracy,
    });
  };

  const handleQuit = () => {
    Alert.alert(
      'Quit Game',
      'Are you sure you want to quit? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  if (!gameState) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading game...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.modeTitle}>{mode.name}</Text>
            <Text style={styles.progress}>
              {gameState.correctGuesses} / {gameState.totalCountries}
            </Text>
          </View>
          <Button
            title="Quit"
            onPress={handleQuit}
            variant="outline"
            size="small"
          />
        </View>

        <GameTimer
          timeRemaining={gameState.timeRemaining}
          totalTime={mode.timerDuration}
          isActive={gameState.isGameActive}
          isPaused={gameState.isPaused}
          onPause={handlePause}
          onResume={handleResume}
          canPause={canPause}
        />

        <View style={styles.mapContainer}>
          <WorldMap
            countries={mode.countries}
            highlightedCountries={gameState.guessedCountries}
            currentCountry={gameState.currentCountry}
            mapMode="game"
          />
        </View>

        {gameState.currentCountry && (
          <View style={styles.gameSection}>
            <Text style={styles.question}>
              Name this country:
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                ref={guessInputRef}
                style={styles.input}
                value={guess}
                onChangeText={setGuess}
                placeholder="Enter country name..."
                placeholderTextColor={COLORS.lightGray}
                onSubmitEditing={handleGuessSubmit}
                autoCorrect={false}
                autoCapitalize="words"
                returnKeyType="done"
              />
              <Button
                title="Submit"
                onPress={handleGuessSubmit}
                variant="accent"
                size="medium"
                disabled={!guess.trim()}
              />
            </View>

            {feedback && (
              <View style={styles.feedbackContainer}>
                <Text style={[
                  styles.feedback,
                  { color: feedback.includes('Correct') ? COLORS.success : COLORS.warning }
                ]}>
                  {feedback}
                </Text>
              </View>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  headerInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: SIZES.title,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  progress: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
  },
  mapContainer: {
    flex: 1,
    paddingHorizontal: SIZES.md,
  },
  gameSection: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.lg,
    backgroundColor: COLORS.primary,
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.md,
    borderRadius: 16,
  },
  question: {
    fontSize: SIZES.subtitle,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.black,
  },
  feedbackContainer: {
    marginTop: SIZES.md,
    padding: SIZES.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  feedback: {
    fontSize: SIZES.body,
    fontFamily: FONTS.bodySemiBold,
    textAlign: 'center',
  },
});

export default GameScreen;
