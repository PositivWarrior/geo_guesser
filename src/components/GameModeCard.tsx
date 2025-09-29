import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	interpolate,
} from 'react-native-reanimated';
import WebLinearGradient from './WebLinearGradient';
import { GameMode } from '@/types';
import { COLORS, FONTS, SIZES } from '@/utils/constants';
import Button from './Button';

interface GameModeCardProps {
	mode: GameMode;
	onPress: () => void;
	onPurchase?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - SIZES.xl;

const AnimatedTouchableOpacity =
	Animated.createAnimatedComponent(TouchableOpacity);

const GameModeCard: React.FC<GameModeCardProps> = ({
	mode,
	onPress,
	onPurchase,
}) => {
	const scale = useSharedValue(1);
	const opacity = useSharedValue(1);

	const handlePressIn = () => {
		if (!mode.isLocked) {
			scale.value = withSpring(0.98, {
				damping: 15,
				stiffness: 400,
			});
		}
	};

	const handlePressOut = () => {
		scale.value = withSpring(1, {
			damping: 15,
			stiffness: 400,
		});
	};

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
		opacity: mode.isLocked ? 0.7 : opacity.value,
	}));

	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		return `${minutes} min`;
	};

	const getContinentEmoji = (continent?: string): string => {
		const emojiMap: Record<string, string> = {
			Europe: '🇪🇺',
			Asia: '🌏',
			Africa: '🌍',
			'North America': '🌎',
			'South America': '🌎',
			Oceania: '🌴',
		};
		return emojiMap[continent || ''] || '🌍';
	};

	const getGradientColors = (): string[] => {
		if (mode.isLocked) {
			return [COLORS.darkGray, COLORS.black];
		}

		switch (mode.continent) {
			case 'Europe':
				return [COLORS.primary, COLORS.background];
			case 'Asia':
				return ['#FF6B6B', '#4ECDC4'];
			case 'Africa':
				return ['#FFB347', '#FF8C42'];
			case 'North America':
				return ['#6C5CE7', '#74B9FF'];
			case 'South America':
				return ['#00B894', '#55A3FF'];
			case 'Oceania':
				return ['#FDCB6E', '#E17055'];
			default:
				return [COLORS.accent, COLORS.primary];
		}
	};

	return (
		<AnimatedTouchableOpacity
			style={[styles.container, animatedStyle]}
			onPress={mode.isLocked ? undefined : onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			activeOpacity={0.9}
		>
			<WebLinearGradient
				colors={getGradientColors()}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.gradient}
			>
				<View style={styles.content}>
					<View style={styles.header}>
						<Text style={styles.emoji}>
							{getContinentEmoji(mode.continent)}
						</Text>
						<View style={styles.headerText}>
							<Text style={styles.title}>{mode.name}</Text>
							<Text style={styles.subtitle}>
								{mode.countries.length} countries •{' '}
								{formatTime(mode.timerDuration)}
							</Text>
						</View>
						{mode.isLocked && (
							<View style={styles.lockIcon}>
								<Text style={styles.lockEmoji}>🔒</Text>
							</View>
						)}
					</View>

					<View style={styles.stats}>
						<View style={styles.statItem}>
							<Text style={styles.statValue}>
								{mode.countries.length}
							</Text>
							<Text style={styles.statLabel}>Countries</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statValue}>
								{formatTime(mode.timerDuration)}
							</Text>
							<Text style={styles.statLabel}>Time Limit</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statValue}>
								{mode.isLocked ? mode.price : 'FREE'}
							</Text>
							<Text style={styles.statLabel}>Price</Text>
						</View>
					</View>

					{mode.isLocked && onPurchase && (
						<View style={styles.purchaseSection}>
							<Button
								title={`Unlock for ${mode.price}`}
								onPress={onPurchase}
								variant="accent"
								size="small"
								fullWidth
							/>
						</View>
					)}
				</View>
			</WebLinearGradient>
		</AnimatedTouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: CARD_WIDTH,
		marginHorizontal: SIZES.md,
		marginVertical: SIZES.sm,
		borderRadius: 16,
		elevation: 6,
		shadowColor: COLORS.black,
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 6,
	},
	gradient: {
		borderRadius: 16,
		padding: SIZES.lg,
	},
	content: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: SIZES.md,
	},
	emoji: {
		fontSize: 32,
		marginRight: SIZES.md,
	},
	headerText: {
		flex: 1,
	},
	title: {
		fontSize: SIZES.title,
		fontFamily: FONTS.headlineBold,
		color: COLORS.white,
		marginBottom: SIZES.xs,
	},
	subtitle: {
		fontSize: SIZES.body,
		fontFamily: FONTS.body,
		color: COLORS.white,
		opacity: 0.9,
	},
	lockIcon: {
		backgroundColor: COLORS.black,
		borderRadius: 20,
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	lockEmoji: {
		fontSize: 18,
	},
	stats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: SIZES.md,
		paddingTop: SIZES.md,
		borderTopWidth: 1,
		borderTopColor: COLORS.white,
		opacity: 0.3,
	},
	statItem: {
		alignItems: 'center',
		flex: 1,
	},
	statValue: {
		fontSize: SIZES.subtitle,
		fontFamily: FONTS.headlineBold,
		color: COLORS.white,
		marginBottom: SIZES.xs,
	},
	statLabel: {
		fontSize: SIZES.caption,
		fontFamily: FONTS.body,
		color: COLORS.white,
		opacity: 0.8,
		textAlign: 'center',
	},
	purchaseSection: {
		marginTop: SIZES.lg,
		paddingTop: SIZES.md,
		borderTopWidth: 1,
		borderTopColor: COLORS.white,
		opacity: 0.3,
	},
});

export default GameModeCard;
