import { Country, GameMode, GameState, Achievement } from '@/types';
import {
	CONTINENTS,
	DEFAULT_TIMER_DURATIONS,
	ACHIEVEMENT_IDS,
} from '@/utils/constants';
import FirebaseService from './firebaseService';
import Fuse from 'fuse.js';
import { countriesData } from '@/data/countries';
import { Platform } from 'react-native';

class GameService {
	private static instance: GameService;
	private firebaseService: FirebaseService;
	private searchEngine: Fuse<Country>;

	private constructor() {
		this.firebaseService = FirebaseService.getInstance();
		this.initializeSearchEngine();
	}

	public static getInstance(): GameService {
		if (!GameService.instance) {
			GameService.instance = new GameService();
		}
		return GameService.instance;
	}

	private initializeSearchEngine(): void {
		const options = {
			keys: ['name', 'aliases'],
			threshold: 0.3,
			includeScore: true,
			minMatchCharLength: 2,
		};

		this.searchEngine = new Fuse(countriesData, options);
	}

	async createGameModes(unlockedContinents: string[]): Promise<GameMode[]> {
		let timerDurations = DEFAULT_TIMER_DURATIONS;

		// Only fetch remote config on native platforms
		if (Platform.OS !== 'web') {
			try {
				const remoteConfig =
					await this.firebaseService.getRemoteConfigValues();
				timerDurations = {
					...DEFAULT_TIMER_DURATIONS,
					...remoteConfig.timerDurations,
				};
			} catch (error) {
				console.warn(
					'Failed to fetch remote config, using defaults:',
					error,
				);
			}
		}

		const modes: GameMode[] = [];

		// Create continent-specific modes
		Object.entries(CONTINENTS).forEach(([continent, data]) => {
			const countries = this.getCountriesForContinent(continent);
			const isLocked =
				!unlockedContinents.includes(continent) &&
				continent !== 'Europe';

			modes.push({
				id: continent.toLowerCase().replace(' ', '_'),
				name: continent,
				continent: continent as any,
				countries,
				isLocked,
				price: isLocked ? this.getContinentPrice(continent) : undefined,
				timerDuration:
					timerDurations[continent] ||
					DEFAULT_TIMER_DURATIONS[continent],
			});
		});

		// Create "All World" mode
		const allCountries = this.getAllCountries();
		const allWorldUnlocked =
			unlockedContinents.includes('All World') ||
			Object.keys(CONTINENTS).every((continent) =>
				unlockedContinents.includes(continent),
			);

		modes.push({
			id: 'all_world',
			name: 'All World',
			countries: allCountries,
			isLocked: !allWorldUnlocked,
			price: !allWorldUnlocked ? '$9.99' : undefined,
			timerDuration:
				timerDurations['All World'] ||
				DEFAULT_TIMER_DURATIONS['All World'],
		});

		return modes;
	}

	initializeGame(mode: GameMode): GameState {
		const shuffledCountries = [...mode.countries].sort(
			() => Math.random() - 0.5,
		);

		return {
			currentMode: mode,
			currentCountry: this.getRandomCountry(shuffledCountries),
			guessedCountries: new Set(),
			correctGuesses: 0,
			totalCountries: mode.countries.length,
			timeRemaining: mode.timerDuration,
			isGameActive: true,
			isPaused: false,
			gameStartTime: Date.now(),
		};
	}

	async validateGuess(
		guess: string,
		targetCountry: Country,
	): Promise<boolean> {
		if (!guess || guess.trim().length < 2) {
			return false;
		}

		const normalizedGuess = this.normalizeString(guess);
		const normalizedTarget = this.normalizeString(targetCountry.name);

		// Direct match
		if (normalizedGuess === normalizedTarget) {
			return true;
		}

		// Check aliases
		const aliasMatch = targetCountry.aliases.some(
			(alias) => this.normalizeString(alias) === normalizedGuess,
		);

		if (aliasMatch) {
			return true;
		}

		// Fuzzy search as fallback
		const results = this.searchEngine.search(guess);
		const bestMatch = results[0];

		if (
			bestMatch &&
			bestMatch.item.id === targetCountry.id &&
			bestMatch.score! < 0.2
		) {
			return true;
		}

		return false;
	}

	processCorrectGuess(gameState: GameState): GameState {
		const updatedGuessedCountries = new Set(gameState.guessedCountries);
		updatedGuessedCountries.add(gameState.currentCountry!.id);

		const remainingCountries = gameState.currentMode.countries.filter(
			(country) => !updatedGuessedCountries.has(country.id),
		);

		return {
			...gameState,
			guessedCountries: updatedGuessedCountries,
			correctGuesses: gameState.correctGuesses + 1,
			currentCountry:
				remainingCountries.length > 0
					? this.getRandomCountry(remainingCountries)
					: null,
		};
	}

	async pauseGame(gameState: GameState, userId: string): Promise<boolean> {
		// Check with LLM if pause should be allowed
		const allowPause = await this.firebaseService.shouldAllowTimerPause(
			userId,
			gameState.currentMode.id,
			gameState,
		);

		return allowPause;
	}

	updateTimer(gameState: GameState, deltaTime: number): GameState {
		if (gameState.isPaused || !gameState.isGameActive) {
			return gameState;
		}

		const newTimeRemaining = Math.max(
			0,
			gameState.timeRemaining - deltaTime,
		);

		return {
			...gameState,
			timeRemaining: newTimeRemaining,
			isGameActive:
				newTimeRemaining > 0 && gameState.currentCountry !== null,
		};
	}

	calculateGameResults(gameState: GameState): {
		score: number;
		accuracy: number;
		completionRate: number;
		timeTaken: number;
	} {
		const timeTaken = (Date.now() - gameState.gameStartTime) / 1000;
		const accuracy =
			(gameState.correctGuesses / gameState.totalCountries) * 100;
		const completionRate =
			(gameState.correctGuesses / gameState.totalCountries) * 100;

		return {
			score: gameState.correctGuesses,
			accuracy,
			completionRate,
			timeTaken,
		};
	}

	async checkAchievements(
		gameState: GameState,
		results: any,
		userId: string,
	): Promise<Achievement[]> {
		const unlockedAchievements: Achievement[] = [];

		// Check completion achievements
		if (results.completionRate === 100) {
			const achievementId = this.getContinentAchievementId(
				gameState.currentMode.continent,
			);
			if (achievementId) {
				const achievement = this.createAchievement(
					achievementId,
					gameState.currentMode.name,
				);
				unlockedAchievements.push(achievement);
				await this.firebaseService.unlockAchievement(
					userId,
					achievement,
				);
			}
		}

		// Check speed achievement for All World
		if (
			gameState.currentMode.id === 'all_world' &&
			results.completionRate === 100 &&
			results.timeTaken < 600
		) {
			const speedAchievement = this.createAchievement(
				ACHIEVEMENT_IDS.SPEED_DEMON,
				'All World',
			);
			unlockedAchievements.push(speedAchievement);
			await this.firebaseService.unlockAchievement(
				userId,
				speedAchievement,
			);
		}

		// Check perfect game achievement
		if (results.accuracy === 100) {
			const perfectAchievement = this.createAchievement(
				ACHIEVEMENT_IDS.PERFECTIONIST,
				gameState.currentMode.name,
			);
			unlockedAchievements.push(perfectAchievement);
			await this.firebaseService.unlockAchievement(
				userId,
				perfectAchievement,
			);
		}

		return unlockedAchievements;
	}

	private getCountriesForContinent(continent: string): Country[] {
		const continentData = CONTINENTS[continent];
		if (!continentData) return [];

		return continentData.countries
			.map((countryName) =>
				countriesData.find((country) => country.name === countryName),
			)
			.filter(Boolean) as Country[];
	}

	private getAllCountries(): Country[] {
		return countriesData;
	}

	private getRandomCountry(countries: Country[]): Country {
		return countries[Math.floor(Math.random() * countries.length)];
	}

	private normalizeString(str: string): string {
		return str
			.toLowerCase()
			.trim()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
			.replace(/[^a-z0-9\s]/g, '') // Remove special characters
			.replace(/\s+/g, ' '); // Normalize whitespace
	}

	private getContinentPrice(continent: string): string {
		const prices: Record<string, string> = {
			Asia: '$2.99',
			Africa: '$2.99',
			'North America': '$1.99',
			'South America': '$1.99',
			Oceania: '$0.99',
		};
		return prices[continent] || '$2.99';
	}

	private getContinentAchievementId(continent?: string): string | null {
		const achievementMap: Record<string, string> = {
			Europe: ACHIEVEMENT_IDS.EUROPE_COMPLETE,
			Asia: ACHIEVEMENT_IDS.ASIA_COMPLETE,
			Africa: ACHIEVEMENT_IDS.AFRICA_COMPLETE,
			'North America': ACHIEVEMENT_IDS.NORTH_AMERICA_COMPLETE,
			'South America': ACHIEVEMENT_IDS.SOUTH_AMERICA_COMPLETE,
			Oceania: ACHIEVEMENT_IDS.OCEANIA_COMPLETE,
		};
		return continent ? achievementMap[continent] || null : null;
	}

	private createAchievement(id: string, continentName: string): Achievement {
		const achievementData: Record<string, Partial<Achievement>> = {
			[ACHIEVEMENT_IDS.EUROPE_COMPLETE]: {
				title: 'European Explorer',
				description: 'Complete Europe with 100% accuracy',
				icon: '🇪🇺',
			},
			[ACHIEVEMENT_IDS.SPEED_DEMON]: {
				title: 'Speed Demon',
				description: 'Complete All World in under 10 minutes',
				icon: '⚡',
			},
			[ACHIEVEMENT_IDS.PERFECTIONIST]: {
				title: 'Perfectionist',
				description: 'Complete any mode with 100% accuracy',
				icon: '💯',
			},
		};

		const baseData = achievementData[id] || {
			title: `${continentName} Master`,
			description: `Complete ${continentName} with 100% accuracy`,
			icon: '🏆',
		};

		return {
			id,
			title: baseData.title!,
			description: baseData.description!,
			icon: baseData.icon!,
			isUnlocked: true,
			unlockedAt: new Date(),
			condition: {
				type: 'continent_complete',
				target: continentName,
			},
		};
	}
}

export default GameService;
