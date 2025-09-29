# GeoGuesser 🌍

A sophisticated geography quiz game built with React Native that challenges players to identify countries on an interactive world map. Features in-app purchases, achievements, real-time timers, and AI-powered game mechanics.

## Features

### 🎯 Core Gameplay

-   **Interactive World Map**: Black and white SVG-based map with country highlighting
-   **Multiple Game Modes**: Europe (free), Asia, Africa, North America, South America, Oceania, and All World
-   **Smart Guess Validation**: Case-insensitive matching with diacritics support and fuzzy search
-   **Real-time Timer**: Configurable countdown timer with pause functionality
-   **Progressive Difficulty**: Start with Europe and unlock other continents

### 💰 Monetization

-   **In-App Purchases**: RevenueCat integration for continent unlocking
-   **Cloud Verification**: Firebase Cloud Functions for secure IAP validation
-   **Flexible Pricing**: Individual continents and bundle options

### 🏆 Achievements & Progress

-   **Achievement System**: Unlock badges for completing continents, speed challenges, and perfect scores
-   **Statistics Tracking**: Best times, completion rates, and accuracy metrics
-   **Cloud Sync**: Firestore integration for cross-device progress synchronization

### 🤖 AI Integration

-   **LLM-Powered Timer Logic**: OpenAI integration to intelligently allow/restrict timer pausing based on game context
-   **Remote Configuration**: Firebase Remote Config for dynamic game settings
-   **Adaptive Difficulty**: AI can evaluate player behavior and adjust game mechanics

### 🎨 Design & UX

-   **Modern UI**: Clean, minimalist design following Material Design principles
-   **Custom Color Scheme**: Deep teal theme (#468499) with accent orange (#E58E26)
-   **Typography**: Space Grotesk for headlines, Inter for body text
-   **Animations**: Smooth React Native Reanimated transitions and micro-interactions
-   **Accessibility**: Full support for screen readers and assistive technologies

## Tech Stack

### Frontend

-   **React Native 0.72.6**: Cross-platform mobile development
-   **TypeScript**: Type-safe development
-   **React Navigation 6**: Stack and tab navigation
-   **React Native Reanimated 3**: Smooth animations
-   **React Native SVG**: Interactive map rendering
-   **React Native Linear Gradient**: Beautiful gradient effects

### Backend & Services

-   **Firebase Firestore**: User data and achievements storage
-   **Firebase Cloud Functions**: Server-side logic and IAP verification
-   **Firebase Remote Config**: Dynamic app configuration
-   **RevenueCat**: In-app purchase management
-   **OpenAI GPT**: AI-powered game mechanics

### Development Tools

-   **ESLint**: Code linting and formatting
-   **Prettier**: Code formatting
-   **Metro**: React Native bundler
-   **Flipper**: React Native debugging

## Installation

### Prerequisites

-   Node.js 18 or higher
-   React Native CLI
-   Xcode (for iOS development)
-   Android Studio (for Android development)
-   Firebase account
-   RevenueCat account
-   OpenAI API key

### Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/geo-guesser.git
    cd geo-guesser
    ```

2. **Install dependencies**

    ```bash
    npm install
    # Note: No need for pod install with Expo managed workflow
    ```

3. **Firebase Setup**

    - Create a new Firebase project
    - Enable Firestore, Authentication, and Cloud Functions
    - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
    - Place files in their respective platform directories

4. **RevenueCat Setup**

    - Create a RevenueCat account
    - Set up your app and products
    - Configure entitlements for each continent

5. **Environment Variables**

    ```bash
    # Create .env file
    FIREBASE_API_KEY=your_firebase_api_key
    REVENUECAT_API_KEY=your_revenuecat_api_key
    OPENAI_API_KEY=your_openai_api_key
    ```

6. **Deploy Cloud Functions**

    ```bash
    cd functions
    npm install
    firebase deploy --only functions
    ```

7. **Run the app**

    ```bash
    # Start development server
    npm start

    # iOS (requires macOS or cloud build)
    npm run ios

    # Android (works on Windows)
    npm run android

    # Web browser
    npm run web
    ```

## Configuration

### Firebase Remote Config

Set up the following parameters in Firebase Remote Config:

```json
{
	"timer_durations": {
		"Europe": 900,
		"Asia": 1800,
		"Africa": 1500,
		"North America": 600,
		"South America": 480,
		"Oceania": 300,
		"All World": 3600
	},
	"game_settings": {
		"allowTimerPause": true,
		"minGuessLength": 2,
		"caseSensitive": false
	},
	"achievement_settings": {
		"speedDemonTimeLimit": 600
	}
}
```

### RevenueCat Products

Configure the following product IDs in RevenueCat:

-   `com.geoguesser.asia` - Asia Continent ($2.99)
-   `com.geoguesser.africa` - Africa Continent ($2.99)
-   `com.geoguesser.north_america` - North America Continent ($1.99)
-   `com.geoguesser.south_america` - South America Continent ($1.99)
-   `com.geoguesser.oceania` - Oceania Continent ($0.99)
-   `com.geoguesser.all_world` - All World Bundle ($9.99)

## Architecture

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── GameModeCard.tsx
│   ├── GameTimer.tsx
│   └── WorldMap.tsx
├── screens/            # Screen components
│   ├── HomeScreen.tsx
│   ├── GameScreen.tsx
│   ├── GameCompleteScreen.tsx
│   ├── AchievementsScreen.tsx
│   ├── StoreScreen.tsx
│   └── SettingsScreen.tsx
├── services/           # Business logic and API calls
│   ├── firebaseService.ts
│   ├── purchaseService.ts
│   └── gameService.ts
├── utils/             # Utilities and constants
│   └── constants.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── data/              # Static data and country definitions
│   └── countries.ts
└── App.tsx            # Main app component
```

### Data Flow

1. **Game Initialization**: Load remote config and user entitlements
2. **Mode Selection**: Filter available modes based on purchases
3. **Gameplay**: Real-time validation with fuzzy matching
4. **Timer Management**: AI evaluation for pause permissions
5. **Results**: Achievement checking and statistics update
6. **Persistence**: Cloud sync for cross-device continuity

## AI Integration

The app features sophisticated AI integration through OpenAI's GPT models:

### Timer Pause Evaluation

The LLM evaluates whether timer pausing should be allowed based on:

-   Current game mode and difficulty
-   Player's historical behavior
-   Remote configuration settings
-   Competitive vs. casual play context

### Implementation

```typescript
const shouldAllowPause = await firebaseService.shouldAllowTimerPause(
	userId,
	gameMode,
	gameState,
);
```

The AI considers factors like:

-   Whether the mode is competitive
-   Player's past abuse patterns
-   Accessibility needs
-   Current remote config overrides

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

-   Follow the existing TypeScript and React Native conventions
-   Use meaningful component and variable names
-   Write comprehensive comments for complex logic
-   Ensure all tests pass before submitting

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## Performance Considerations

-   **Map Rendering**: SVG paths are optimized for performance
-   **Memory Management**: Proper cleanup of timers and subscriptions
-   **Bundle Size**: Tree shaking and code splitting for optimal loading
-   **Offline Support**: Local caching of country data and progress

## Security

-   **IAP Verification**: Server-side receipt validation
-   **User Authentication**: Firebase Auth integration
-   **Data Encryption**: All sensitive data encrypted in transit and at rest
-   **Input Validation**: Comprehensive validation for all user inputs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

-   Country data sourced from public geographical databases
-   Map projections based on Natural Earth data
-   Icons from various open-source icon libraries
-   Community feedback and testing

## Support

For support, email support@geoguesser.com or join our Discord community.

---

Built with ❤️ for geography enthusiasts worldwide.
