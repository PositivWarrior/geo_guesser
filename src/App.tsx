import React, { useState, useEffect } from 'react';

// Global CSS reset for full-screen experience
const applyGlobalStyles = () => {
	if (typeof document !== 'undefined') {
		const style = document.createElement('style');
		style.textContent = `
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
			html, body {
				margin: 0;
				padding: 0;
				width: 100%;
				height: 100%;
				overflow-x: hidden;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
			}
			#root {
				width: 100%;
				height: 100%;
			}
		`;
		document.head.appendChild(style);
	}
};

// Simple Game Screen Component
const GameScreen = ({ onBack }) => {
	return React.createElement(
		'div',
		{
			style: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '100vh',
				width: '100vw',
				margin: 0,
				padding: '20px',
				boxSizing: 'border-box',
				backgroundColor: '#1a3b44',
				color: 'white',
				fontFamily: 'Arial, sans-serif',
				textAlign: 'center',
				position: 'fixed',
				top: 0,
				left: 0,
				overflow: 'auto',
			},
		},
		[
			React.createElement(
				'h1',
				{
					key: 'title',
					style: {
						fontSize: 'clamp(28px, 5vw, 48px)',
						margin: '20px 0',
						fontWeight: 'bold',
					},
				},
				'🗺️ Game Screen',
			),

			React.createElement(
				'p',
				{
					key: 'instructions',
					style: {
						fontSize: 'clamp(16px, 3vw, 24px)',
						margin: '20px 0',
						maxWidth: '600px',
						lineHeight: '1.5',
					},
				},
				'This is where the geography quiz will be!',
			),

			React.createElement(
				'p',
				{
					key: 'placeholder',
					style: {
						fontSize: 'clamp(14px, 2.5vw, 18px)',
						margin: '20px 0',
						opacity: 0.8,
						maxWidth: '500px',
						lineHeight: '1.4',
					},
				},
				'🌟 Coming soon: Interactive world map, country guessing, timer, and scoring!',
			),

			React.createElement(
				'button',
				{
					key: 'back-button',
					onClick: onBack,
					style: {
						padding:
							'clamp(12px, 2vw, 16px) clamp(20px, 4vw, 32px)',
						fontSize: 'clamp(16px, 2.5vw, 20px)',
						backgroundColor: '#E58E26',
						color: 'white',
						border: 'none',
						borderRadius: '12px',
						cursor: 'pointer',
						margin: '30px 0 20px 0',
						fontWeight: 'bold',
						transition: 'all 0.2s ease',
						minWidth: '140px',
						boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
					},
				},
				'← Back to Home',
			),
		],
	);
};

const App = () => {
	console.log('🚀 GeoGuesser Starting - Ultra Simple Version!');
	console.log('App function called - React is working!');
	console.log('Current window:', typeof window);
	console.log(
		'Current location:',
		typeof window !== 'undefined' ? window.location.href : 'not web',
	);

	const [currentScreen, setCurrentScreen] = useState('home');

	// Apply global styles once
	useEffect(() => {
		applyGlobalStyles();
	}, []);

	if (currentScreen === 'game') {
		return React.createElement(GameScreen, {
			onBack: () => setCurrentScreen('home'),
		});
	}

	return React.createElement(
		'div',
		{
			style: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '100vh',
				width: '100vw',
				margin: 0,
				padding: '20px',
				boxSizing: 'border-box',
				backgroundColor: '#26414A',
				color: 'white',
				fontFamily: 'Arial, sans-serif',
				textAlign: 'center',
				position: 'fixed',
				top: 0,
				left: 0,
				overflow: 'auto',
			},
		},
		[
			React.createElement(
				'h1',
				{
					key: 'title',
					style: {
						fontSize: 'clamp(32px, 8vw, 64px)',
						margin: '20px 0',
						fontWeight: 'bold',
						textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
					},
				},
				'🌍 GeoGuesser',
			),

			React.createElement(
				'p',
				{
					key: 'subtitle',
					style: {
						fontSize: 'clamp(18px, 4vw, 28px)',
						margin: '10px 0',
						opacity: 0.95,
						fontWeight: '500',
					},
				},
				'Geography Quiz Game',
			),

			React.createElement(
				'p',
				{
					key: 'description',
					style: {
						fontSize: 'clamp(16px, 3vw, 22px)',
						margin: '30px 0',
						opacity: 0.9,
						maxWidth: '600px',
						lineHeight: '1.5',
					},
				},
				'Test your knowledge of world geography!',
			),

			React.createElement(
				'button',
				{
					key: 'play-button',
					onClick: () => setCurrentScreen('game'),
					style: {
						padding:
							'clamp(16px, 3vw, 20px) clamp(32px, 6vw, 48px)',
						fontSize: 'clamp(18px, 3vw, 24px)',
						backgroundColor: '#4CAF50',
						color: 'white',
						border: 'none',
						borderRadius: '15px',
						cursor: 'pointer',
						margin: '40px 0 30px 0',
						fontWeight: 'bold',
						transition: 'all 0.3s ease',
						minWidth: '200px',
						boxShadow: '0 6px 12px rgba(76, 175, 80, 0.4)',
						transform: 'scale(1)',
					},
				},
				'🎮 Start Game',
			),

			React.createElement(
				'p',
				{
					key: 'status',
					style: {
						fontSize: 'clamp(14px, 2.5vw, 18px)',
						color: '#4CAF50',
						margin: '20px 0 10px 0',
						opacity: 0.8,
					},
				},
				'✅ App Working Successfully!',
			),
		],
	);
};

export default App;
