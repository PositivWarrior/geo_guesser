import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  runOnUI,
} from 'react-native-reanimated';
import { COLORS, FONTS, SIZES } from '@/utils/constants';

interface GameTimerProps {
  timeRemaining: number;
  totalTime: number;
  isActive: boolean;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  canPause?: boolean;
}

const GameTimer: React.FC<GameTimerProps> = ({
  timeRemaining,
  totalTime,
  isActive,
  isPaused,
  onPause,
  onResume,
  canPause = true,
}) => {
  const [displayTime, setDisplayTime] = useState(timeRemaining);
  const progressValue = useSharedValue(1);
  const pulseValue = useSharedValue(1);

  useEffect(() => {
    setDisplayTime(timeRemaining);
    const progress = timeRemaining / totalTime;
    progressValue.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });

    // Pulse animation when time is low
    if (timeRemaining <= 30 && timeRemaining > 0 && isActive) {
      pulseValue.value = withSpring(1.1, {
        damping: 8,
        stiffness: 300,
      });
      setTimeout(() => {
        pulseValue.value = withSpring(1, {
          damping: 8,
          stiffness: 300,
        });
      }, 200);
    }
  }, [timeRemaining, totalTime, isActive]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    const progress = timeRemaining / totalTime;
    if (progress > 0.5) return COLORS.success;
    if (progress > 0.25) return COLORS.warning;
    return COLORS.error;
  };

  const progressStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progressValue.value,
      [0, 0.25, 0.5, 1],
      [COLORS.error, COLORS.warning, COLORS.accent, COLORS.success]
    );

    return {
      width: `${progressValue.value * 100}%`,
      backgroundColor,
    };
  });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const handlePauseToggle = () => {
    if (!canPause) return;
    
    if (isPaused) {
      onResume();
    } else {
      onPause();
    }
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.timerContainer}>
        <View style={styles.progressBackground}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
        
        <View style={styles.timeDisplay}>
          <Text style={[styles.timeText, { color: getTimerColor() }]}>
            {formatTime(displayTime)}
          </Text>
          
          {canPause && (
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={handlePauseToggle}
              activeOpacity={0.7}
            >
              <Text style={styles.pauseIcon}>
                {isPaused ? '▶️' : '⏸️'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.labels}>
          <Text style={styles.labelText}>Time Remaining</Text>
          {isPaused && (
            <Text style={styles.pausedLabel}>PAUSED</Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.md,
  },
  timerContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SIZES.lg,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  progressBackground: {
    height: 8,
    backgroundColor: COLORS.darkGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SIZES.md,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.sm,
  },
  timeText: {
    fontSize: 36,
    fontFamily: FONTS.headlineBold,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  pauseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pauseIcon: {
    fontSize: 20,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
  },
  pausedLabel: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.warning,
    backgroundColor: COLORS.darkGray,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: 8,
  },
});

export default GameTimer;
