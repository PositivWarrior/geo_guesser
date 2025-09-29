/**
 * @format
 */

console.log('🔥 INDEX.JS STARTING!');
console.log(
	'Platform check:',
	typeof window !== 'undefined' ? 'WEB' : 'NATIVE',
);

import { AppRegistry } from 'react-native';
import App from './src/App';
// import { name as appName } from './app.json';
const appName = 'GeoGuesser'; // Hardcode the name for now

console.log('🔥 About to register component:', appName);
console.log('🔥 App component:', App);

AppRegistry.registerComponent(appName, () => {
	console.log('🔥 APP FACTORY CALLED!');
	return App;
});

// Force start the app if on web
if (typeof window !== 'undefined') {
	console.log('🔥 FORCING WEB START!');
	setTimeout(() => {
		try {
			AppRegistry.runApplication(appName, {
				rootTag: document.getElementById('root') || document.body,
			});
			console.log('🔥 APP STARTED MANUALLY!');
		} catch (error) {
			console.error('🔥 MANUAL START FAILED:', error);
		}
	}, 100);
}
