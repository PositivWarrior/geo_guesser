import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS, FONTS, SIZES } from '@/utils/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 400,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      runOnJS(onPress)();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = [styles.button, styles[`${variant}Button`], styles[`${size}Button`]];
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    return StyleSheet.flatten([...baseStyle, style]);
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = [styles.text, styles[`${variant}Text`], styles[`${size}Text`]];
    
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }
    
    return StyleSheet.flatten([...baseStyle, textStyle]);
  };

  return (
    <AnimatedTouchableOpacity
      style={[getButtonStyle(), animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? COLORS.primary : COLORS.white}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
    elevation: 0,
    shadowOpacity: 0,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  accentButton: {
    backgroundColor: COLORS.accent,
    borderWidth: 0,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  
  // Sizes
  smallButton: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    minHeight: 36,
  },
  mediumButton: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    minHeight: 48,
  },
  largeButton: {
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.lg,
    minHeight: 56,
  },
  
  // Text styles
  text: {
    fontFamily: FONTS.bodySemiBold,
    textAlign: 'center',
    marginLeft: SIZES.sm,
  },
  disabledText: {
    opacity: 0.7,
  },
  
  // Variant text
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.primary,
  },
  accentText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  
  // Size text
  smallText: {
    fontSize: SIZES.caption,
  },
  mediumText: {
    fontSize: SIZES.body,
  },
  largeText: {
    fontSize: SIZES.subtitle,
  },
});

export default Button;
