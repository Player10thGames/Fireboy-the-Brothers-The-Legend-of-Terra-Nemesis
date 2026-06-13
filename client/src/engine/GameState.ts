/**
 * Game State Manager
 */

export type GamePhase = 'menu' | 'characterSelect' | 'playing' | 'paused' | 'gameOver' | 'victory';

export interface GameState {
  phase: GamePhase;
  currentStage: number;
  selectedCharacter: string | null;
  playerHealth: number;
  playerMaxHealth: number;
  bossHealth: number;
  bossMaxHealth: number;
  score: number;
  stagesCleared: number;
  isGameOver: boolean;
  isVictory: boolean;
}

export class GameStateManager {
  private state: GameState = {
    phase: 'menu',
    currentStage: 1,
    selectedCharacter: null,
    playerHealth: 100,
    playerMaxHealth: 100,
    bossHealth: 200,
    bossMaxHealth: 200,
    score: 0,
    stagesCleared: 0,
    isGameOver: false,
    isVictory: false,
  };

  private listeners: Set<(state: GameState) => void> = new Set();

  /**
   * Get current game state
   */
  getState(): GameState {
    return { ...this.state };
  }

  /**
   * Update game phase
   */
  setPhase(phase: GamePhase): void {
    this.state.phase = phase;
    this.notifyListeners();
  }

  /**
   * Set selected character
   */
  setSelectedCharacter(character: string): void {
    this.state.selectedCharacter = character;
    this.notifyListeners();
  }

  /**
   * Update player health
   */
  setPlayerHealth(health: number): void {
    this.state.playerHealth = Math.max(0, Math.min(health, this.state.playerMaxHealth));
    if (this.state.playerHealth <= 0) {
      this.state.isGameOver = true;
    }
    this.notifyListeners();
  }

  /**
   * Update player max health
   */
  setPlayerMaxHealth(maxHealth: number): void {
    this.state.playerMaxHealth = maxHealth;
    this.state.playerHealth = Math.min(this.state.playerHealth, maxHealth);
    this.notifyListeners();
  }

  /**
   * Update boss health
   */
  setBossHealth(health: number): void {
    this.state.bossHealth = Math.max(0, Math.min(health, this.state.bossMaxHealth));
    if (this.state.bossHealth <= 0) {
      this.state.isVictory = true;
      this.state.stagesCleared++;
      this.state.score += 1000 * this.state.currentStage;
    }
    this.notifyListeners();
  }

  /**
   * Update boss max health
   */
  setBossMaxHealth(maxHealth: number): void {
    this.state.bossMaxHealth = maxHealth;
    this.state.bossHealth = Math.min(this.state.bossHealth, maxHealth);
    this.notifyListeners();
  }

  /**
   * Add score
   */
  addScore(points: number): void {
    this.state.score += points;
    this.notifyListeners();
  }

  /**
   * Move to next stage
   */
  nextStage(): void {
    this.state.currentStage++;
    this.state.isVictory = false;
    if (this.state.currentStage > 7) {
      this.state.phase = 'victory';
    } else {
      this.state.phase = 'playing';
    }
    this.notifyListeners();
  }

  /**
   * Reset game state
   */
  reset(): void {
    this.state = {
      phase: 'menu',
      currentStage: 1,
      selectedCharacter: null,
      playerHealth: 100,
      playerMaxHealth: 100,
      bossHealth: 200,
      bossMaxHealth: 200,
      score: 0,
      stagesCleared: 0,
      isGameOver: false,
      isVictory: false,
    };
    this.notifyListeners();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }
}
