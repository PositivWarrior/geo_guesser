import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { Country } from '@/types';
import { COLORS } from '@/utils/constants';

interface WorldMapProps {
  countries: Country[];
  highlightedCountries: Set<string>;
  currentCountry?: Country | null;
  onCountryPress?: (country: Country) => void;
  showCountryNames?: boolean;
  mapMode?: 'game' | 'selection';
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const MAP_WIDTH = screenWidth - 32;
const MAP_HEIGHT = screenHeight * 0.6;
const VIEW_BOX = `0 0 800 500`;

const WorldMap: React.FC<WorldMapProps> = ({
  countries,
  highlightedCountries,
  currentCountry,
  onCountryPress,
  showCountryNames = false,
  mapMode = 'game',
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    if (currentCountry) {
      animationProgress.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [currentCountry]);

  const getCountryColor = (country: Country): string => {
    if (highlightedCountries.has(country.id)) {
      return COLORS.success;
    }
    if (currentCountry?.id === country.id) {
      return COLORS.accent;
    }
    if (selectedCountry === country.id) {
      return COLORS.primary;
    }
    return COLORS.mapDefault;
  };

  const getCountryStroke = (country: Country): string => {
    if (currentCountry?.id === country.id) {
      return COLORS.accent;
    }
    return COLORS.mapBorder;
  };

  const getCountryStrokeWidth = (country: Country): string => {
    if (currentCountry?.id === country.id) {
      return '2';
    }
    return '0.5';
  };

  const handleCountryPress = (country: Country) => {
    if (mapMode === 'selection' && onCountryPress) {
      setSelectedCountry(country.id);
      onCountryPress(country);
    }
  };

  const animatedMapStyle = useAnimatedStyle(() => {
    const scale = interpolateColor(
      animationProgress.value,
      [0, 1],
      [1, 1.05] as any
    );
    
    return {
      transform: [{ scale: animationProgress.value * 0.05 + 1 }],
    };
  });

  const renderCountryPath = (country: Country) => {
    const isHighlighted = highlightedCountries.has(country.id);
    const isCurrent = currentCountry?.id === country.id;
    
    return (
      <Path
        key={country.id}
        d={country.svgPath}
        fill={getCountryColor(country)}
        stroke={getCountryStroke(country)}
        strokeWidth={getCountryStrokeWidth(country)}
        onPress={() => handleCountryPress(country)}
        opacity={isHighlighted ? 1 : isCurrent ? 0.9 : 0.7}
      />
    );
  };

  const renderOceans = () => {
    // Simple ocean background rectangles
    return (
      <G>
        <Path
          d="M0,0 L800,0 L800,500 L0,500 Z"
          fill={COLORS.mapWater}
          opacity={0.3}
        />
      </G>
    );
  };

  const renderGrid = () => {
    if (mapMode !== 'game') return null;
    
    const gridLines = [];
    // Vertical lines
    for (let i = 0; i <= 8; i++) {
      gridLines.push(
        <Path
          key={`v-${i}`}
          d={`M${i * 100},0 L${i * 100},500`}
          stroke={COLORS.mapBorder}
          strokeWidth="0.3"
          opacity={0.2}
        />
      );
    }
    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
      gridLines.push(
        <Path
          key={`h-${i}`}
          d={`M0,${i * 100} L800,${i * 100}`}
          stroke={COLORS.mapBorder}
          strokeWidth="0.3"
          opacity={0.2}
        />
      );
    }
    return <G>{gridLines}</G>;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.mapContainer, animatedMapStyle]}>
        <Svg
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          viewBox={VIEW_BOX}
          style={styles.svg}
        >
          {renderOceans()}
          {renderGrid()}
          <G>
            {countries.map(renderCountryPath)}
          </G>
        </Svg>
      </Animated.View>
      
      {currentCountry && (
        <View style={styles.currentCountryIndicator}>
          <Animated.View
            style={[
              styles.pulseIndicator,
              {
                left: (currentCountry.center[0] / 800) * MAP_WIDTH,
                top: (currentCountry.center[1] / 500) * MAP_HEIGHT,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  mapContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.mapWater,
  },
  svg: {
    backgroundColor: 'transparent',
  },
  currentCountryIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    pointerEvents: 'none',
  },
  pulseIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
});

export default WorldMap;
