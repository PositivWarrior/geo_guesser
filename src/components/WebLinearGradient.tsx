import React from 'react';
import { View, ViewStyle, Platform } from 'react-native';

interface GradientPoint {
	x: number;
	y: number;
}

interface WebLinearGradientProps {
	colors: string[];
	start?: GradientPoint;
	end?: GradientPoint;
	style?: ViewStyle;
	children?: React.ReactNode;
}

const WebLinearGradient: React.FC<WebLinearGradientProps> = ({
	colors,
	start = { x: 0, y: 0 },
	end = { x: 1, y: 1 },
	style,
	children,
}) => {
	if (Platform.OS === 'web') {
		// Calculate angle for CSS linear gradient
		const angle =
			Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI) + 90;
		const gradientString = `linear-gradient(${angle}deg, ${colors.join(
			', ',
		)})`;

		return (
			<View
				style={[
					style,
					{
						// @ts-ignore - Web-specific CSS property
						background: gradientString,
					},
				]}
			>
				{children}
			</View>
		);
	}

	// For native platforms, use react-native-linear-gradient
	const LinearGradient = require('react-native-linear-gradient').default;
	return (
		<LinearGradient colors={colors} start={start} end={end} style={style}>
			{children}
		</LinearGradient>
	);
};

export default WebLinearGradient;
