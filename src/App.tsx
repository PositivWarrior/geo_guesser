import React from 'react';

const App = () => {
	console.log('🚀 GeoGuesser Starting - Ultra Simple Version!');
	console.log('App function called - React is working!');
	console.log('Current window:', typeof window);
	console.log(
		'Current location:',
		typeof window !== 'undefined' ? window.location.href : 'not web',
	);

	return React.createElement(
		'div',
		{
			style: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				backgroundColor: '#26414A',
				color: 'white',
				fontFamily: 'Arial, sans-serif',
				textAlign: 'center',
				padding: '20px',
			},
		},
		[
			React.createElement(
				'h1',
				{
					key: 'title',
					style: { fontSize: '48px', margin: '20px 0' },
				},
				'🌍 GeoGuesser',
			),

			React.createElement(
				'p',
				{
					key: 'subtitle',
					style: { fontSize: '24px', margin: '10px 0' },
				},
				'Geography Quiz Game',
			),

			React.createElement(
				'p',
				{
					key: 'status',
					style: {
						fontSize: '18px',
						color: '#4CAF50',
						margin: '10px 0',
					},
				},
				'✅ Ultra Simple React Working!',
			),

			React.createElement(
				'p',
				{
					key: 'version',
					style: { fontSize: '16px', opacity: 0.7 },
				},
				'v1.0.0 - Basic HTML Elements',
			),
		],
	);
};

export default App;
