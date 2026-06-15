import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameStateManager } from './GameState';

describe('GameStateManager', () => {
  let gsm: GameStateManager;

  beforeEach(() => {
    gsm = new GameStateManager();
  });

  describe('initial state', () => {
    it('starts with default values', () => {
      const state = gsm.getState();
      expect(state.phase).toBe('menu');
      expect(state.currentStage).toBe(1);
      expect(state.selectedCharacter).toBeNull();
      expect(state.playerHealth).toBe(100);
      expect(state.playerMaxHealth).toBe(100);
      expect(state.bossHealth).toBe(200);
      expect(state.bossMaxHealth).toBe(200);
      expect(state.score).toBe(0);
      expect(state.stagesCleared).toBe(0);
      expect(state.isGameOver).toBe(false);
      expect(state.isVictory).toBe(false);
    });

    it('returns a copy of state (immutable)', () => {
      const state1 = gsm.getState();
      const state2 = gsm.getState();
      expect(state1).toEqual(state2);
      expect(state1).not.toBe(state2);
    });
  });

  describe('setPhase', () => {
    it('updates game phase', () => {
      gsm.setPhase('playing');
      expect(gsm.getState().phase).toBe('playing');
    });

    it('transitions through all phases', () => {
      const phases = ['menu', 'characterSelect', 'playing', 'paused', 'gameOver', 'victory'] as const;
      for (const phase of phases) {
        gsm.setPhase(phase);
        expect(gsm.getState().phase).toBe(phase);
      }
    });
  });

  describe('setSelectedCharacter', () => {
    it('sets the selected character', () => {
      gsm.setSelectedCharacter('fireboy');
      expect(gsm.getState().selectedCharacter).toBe('fireboy');
    });
  });

  describe('setPlayerHealth', () => {
    it('clamps health to max', () => {
      gsm.setPlayerHealth(200);
      expect(gsm.getState().playerHealth).toBe(100);
    });

    it('clamps health to zero', () => {
      gsm.setPlayerHealth(-50);
      expect(gsm.getState().playerHealth).toBe(0);
    });

    it('sets game over when health reaches zero', () => {
      gsm.setPlayerHealth(0);
      const state = gsm.getState();
      expect(state.playerHealth).toBe(0);
      expect(state.isGameOver).toBe(true);
    });

    it('does not set game over for positive health', () => {
      gsm.setPlayerHealth(50);
      expect(gsm.getState().isGameOver).toBe(false);
    });
  });

  describe('setPlayerMaxHealth', () => {
    it('adjusts current health if it exceeds new max', () => {
      gsm.setPlayerMaxHealth(80);
      const state = gsm.getState();
      expect(state.playerMaxHealth).toBe(80);
      expect(state.playerHealth).toBe(80);
    });

    it('keeps current health if below new max', () => {
      gsm.setPlayerHealth(50);
      gsm.setPlayerMaxHealth(120);
      const state = gsm.getState();
      expect(state.playerMaxHealth).toBe(120);
      expect(state.playerHealth).toBe(50);
    });
  });

  describe('setBossHealth', () => {
    it('clamps to boss max health', () => {
      gsm.setBossHealth(500);
      expect(gsm.getState().bossHealth).toBe(200);
    });

    it('clamps to zero', () => {
      gsm.setBossHealth(-10);
      expect(gsm.getState().bossHealth).toBe(0);
    });

    it('sets victory and increments score when boss health reaches zero', () => {
      gsm.setBossHealth(0);
      const state = gsm.getState();
      expect(state.bossHealth).toBe(0);
      expect(state.isVictory).toBe(true);
      expect(state.stagesCleared).toBe(1);
      expect(state.score).toBe(1000); // 1000 * stage 1
    });

    it('calculates score based on current stage', () => {
      gsm.nextStage(); // stage 2
      gsm.setBossMaxHealth(300);
      gsm.setBossHealth(0);
      const state = gsm.getState();
      expect(state.score).toBe(2000); // 1000 * stage 2
    });
  });

  describe('setBossMaxHealth', () => {
    it('adjusts current boss health if it exceeds new max', () => {
      gsm.setBossMaxHealth(150);
      expect(gsm.getState().bossHealth).toBe(150);
    });
  });

  describe('addScore', () => {
    it('accumulates score', () => {
      gsm.addScore(100);
      gsm.addScore(250);
      expect(gsm.getState().score).toBe(350);
    });
  });

  describe('nextStage', () => {
    it('increments stage and resets victory', () => {
      gsm.setBossHealth(0); // triggers victory
      gsm.nextStage();
      const state = gsm.getState();
      expect(state.currentStage).toBe(2);
      expect(state.isVictory).toBe(false);
      expect(state.phase).toBe('playing');
    });

    it('sets victory phase after stage 7', () => {
      for (let i = 0; i < 7; i++) {
        gsm.nextStage();
      }
      expect(gsm.getState().phase).toBe('victory');
      expect(gsm.getState().currentStage).toBe(8);
    });

    it('keeps playing phase up to stage 7', () => {
      for (let i = 0; i < 6; i++) {
        gsm.nextStage();
      }
      expect(gsm.getState().phase).toBe('playing');
      expect(gsm.getState().currentStage).toBe(7);
    });
  });

  describe('reset', () => {
    it('restores all defaults', () => {
      gsm.setPhase('playing');
      gsm.setSelectedCharacter('fireboy');
      gsm.setPlayerHealth(50);
      gsm.addScore(5000);
      gsm.nextStage();

      gsm.reset();
      const state = gsm.getState();
      expect(state.phase).toBe('menu');
      expect(state.currentStage).toBe(1);
      expect(state.selectedCharacter).toBeNull();
      expect(state.playerHealth).toBe(100);
      expect(state.score).toBe(0);
      expect(state.stagesCleared).toBe(0);
      expect(state.isGameOver).toBe(false);
      expect(state.isVictory).toBe(false);
    });
  });

  describe('subscribe', () => {
    it('notifies listeners on state changes', () => {
      const listener = vi.fn();
      gsm.subscribe(listener);

      gsm.setPhase('playing');
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ phase: 'playing' }));
    });

    it('supports multiple listeners', () => {
      const l1 = vi.fn();
      const l2 = vi.fn();
      gsm.subscribe(l1);
      gsm.subscribe(l2);

      gsm.addScore(100);
      expect(l1).toHaveBeenCalledTimes(1);
      expect(l2).toHaveBeenCalledTimes(1);
    });

    it('unsubscribes correctly', () => {
      const listener = vi.fn();
      const unsub = gsm.subscribe(listener);

      gsm.addScore(100);
      expect(listener).toHaveBeenCalledTimes(1);

      unsub();
      gsm.addScore(100);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('passes a copy of state to listeners', () => {
      let captured: unknown = null;
      gsm.subscribe((state) => { captured = state; });
      gsm.setPhase('playing');
      expect(captured).toEqual(gsm.getState());
    });
  });
});
