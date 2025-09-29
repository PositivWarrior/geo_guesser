export interface Country {
  id: string;
  name: string;
  aliases: string[];
  continent: Continent;
  svgPath: string;
  center: [number, number];
}

export type Continent = 'Europe' | 'Asia' | 'Africa' | 'North America' | 'South America' | 'Oceania';

export interface GameMode {
  id: string;
  name: string;
  continent?: Continent;
  countries: Country[];
  isLocked: boolean;
  price?: string;
  timerDuration: number; // in seconds
}

export interface GameState {
  currentMode: GameMode;
  currentCountry: Country | null;
  guessedCountries: Set<string>;
  correctGuesses: number;
  totalCountries: number;
  timeRemaining: number;
  isGameActive: boolean;
  isPaused: boolean;
  gameStartTime: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  condition: {
    type: 'continent_complete' | 'time_challenge' | 'accuracy' | 'streak';
    target: string | number;
  };
}

export interface UserProfile {
  id: string;
  achievements: Achievement[];
  unlockedModes: string[];
  statistics: {
    totalGamesPlayed: number;
    totalCorrectGuesses: number;
    bestTimes: Record<string, number>;
    completionRates: Record<string, number>;
  };
}

export interface PurchaseProduct {
  identifier: string;
  productId: string;
  title: string;
  description: string;
  price: string;
  continent?: Continent;
}

export interface RemoteConfigValues {
  timerDurations: Record<string, number>;
  achievementSettings: Record<string, any>;
  gameSettings: {
    allowTimerPause: boolean;
    minGuessLength: number;
    caseSensitive: boolean;
  };
}

export type NavigationStackParamList = {
  Home: undefined;
  Game: { mode: GameMode };
  GameComplete: { 
    mode: GameMode; 
    score: number; 
    time: number; 
    accuracy: number; 
  };
  Achievements: undefined;
  Store: undefined;
  Settings: undefined;
};
