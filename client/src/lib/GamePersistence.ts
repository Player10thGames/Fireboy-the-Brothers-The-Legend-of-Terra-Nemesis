
/**
 * Game Persistence System
 * Handles saving and loading player progress, high scores, and settings
 */

export interface PlayerProgress {
  clearedStages: number[];
  highScores: Record<number, number>;
  bestTimes: Record<number, number>;
  totalPlayTime: number;
  lastPlayedDate: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'extreme';
  favoriteCharacter: string;
}

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'extreme';
  showFPS: boolean;
  screenShake: boolean;
  screenFlash: boolean;
  autoSave: boolean;
}

const STORAGE_KEY_PROGRESS = 'fireboy_boss_rush_progress';
const STORAGE_KEY_SETTINGS = 'fireboy_boss_rush_settings';

export class GamePersistence {
  /**
   * Save player progress to localStorage
   */
  static saveProgress(progress: PlayerProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  /**
   * Load player progress from localStorage
   */
  static loadProgress(): PlayerProgress | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return null;
    }
  }

  /**
   * Save game settings to localStorage
   */
  static saveSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  /**
   * Load game settings from localStorage
   */
  static loadSettings(): GameSettings | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  }

  /**
   * Get default progress object
   */
  static getDefaultProgress(): PlayerProgress {
    return {
      clearedStages: [],
      highScores: {},
      bestTimes: {},
      totalPlayTime: 0,
      lastPlayedDate: new Date().toISOString(),
      difficulty: 'normal',
      favoriteCharacter: 'fireboy',
    };
  }

  /**
   * Get default settings object
   */
  static getDefaultSettings(): GameSettings {
    return {
      masterVolume: 80,
      musicVolume: 70,
      sfxVolume: 80,
      difficulty: 'normal',
      showFPS: false,
      screenShake: true,
      screenFlash: true,
      autoSave: true,
    };
  }

  /**
   * Update high score for a stage
   */
  static updateHighScore(stage: number, score: number, progress: PlayerProgress): PlayerProgress {
    const currentHighScore = progress.highScores[stage] || 0;
    if (score > currentHighScore) {
      progress.highScores[stage] = score;
    }
    return progress;
  }

  /**
   * Update best time for a stage
   */
  static updateBestTime(stage: number, time: number, progress: PlayerProgress): PlayerProgress {
    const currentBestTime = progress.bestTimes[stage] || Infinity;
    if (time < currentBestTime) {
      progress.bestTimes[stage] = time;
    }
    return progress;
  }

  /**
   * Mark a stage as cleared
   */
  static markStageCleared(stage: number, progress: PlayerProgress): PlayerProgress {
    if (!progress.clearedStages.includes(stage)) {
      progress.clearedStages.push(stage);
      progress.clearedStages.sort((a, b) => a - b);
    }
    return progress;
  }

  /**
   * Get completion percentage
   */
  static getCompletionPercentage(progress: PlayerProgress): number {
    return (progress.clearedStages.length / 7) * 100;
  }

  /**
   * Clear all saved data
   */
  static clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_PROGRESS);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  /**
   * Export progress as JSON
   */
  static exportProgress(progress: PlayerProgress): string {
    return JSON.stringify(progress, null, 2);
  }

  /**
   * Import progress from JSON
   */
  static importProgress(json: string): PlayerProgress | null {
    try {
      return JSON.parse(json);
    } catch (error) {
      console.error('Failed to import progress:', error);
      return null;
    }
  }
}
