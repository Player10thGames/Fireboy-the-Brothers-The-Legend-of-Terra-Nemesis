import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/assetLoader', () => ({
  AssetLoader: {
    preloadImage: vi.fn().mockResolvedValue(null),
    getImage: vi.fn().mockReturnValue(''),
  },
}));

vi.mock('@/engine/GameEngine', () => ({}));

import { Player, PlayerConfig } from './Player';

function makePlayer(overrides: Partial<PlayerConfig> = {}): Player {
  return new Player({
    x: 100,
    y: 400,
    width: 40,
    height: 50,
    stats: { health: 100, maxHealth: 100, speed: 5, fireRate: 150, damage: 15 },
    character: 'fireboy',
    ...overrides,
  });
}

describe('Player', () => {
  describe('constructor', () => {
    it('initializes with given position and size', () => {
      const p = makePlayer({ x: 50, y: 75, width: 30, height: 40 });
      expect(p.x).toBe(50);
      expect(p.y).toBe(75);
      expect(p.width).toBe(30);
      expect(p.height).toBe(40);
    });

    it('starts active with zero velocity', () => {
      const p = makePlayer();
      expect(p.active).toBe(true);
      expect(p.vx).toBe(0);
      expect(p.vy).toBe(0);
    });

    it('copies stats (does not reference original)', () => {
      const stats = { health: 100, maxHealth: 100, speed: 5, fireRate: 150, damage: 15 };
      const p = makePlayer({ stats });
      stats.health = 0;
      expect(p.getStats().health).toBe(100);
    });
  });

  describe('update', () => {
    it('moves based on velocity and speed', () => {
      const p = makePlayer({ x: 100, y: 100 });
      p.setVelocity(1, 0);
      p.update(1 / 60);
      expect(p.x).toBeCloseTo(105, 0);
    });

    it('clamps to left screen edge', () => {
      const p = makePlayer({ x: 5, y: 300 });
      p.setVelocity(-1, 0);
      p.update(1 / 60);
      expect(p.x).toBeGreaterThanOrEqual(0);
    });

    it('clamps to right screen edge', () => {
      const p = makePlayer({ x: 770, y: 300, width: 40 });
      p.setVelocity(1, 0);
      p.update(1 / 60);
      expect(p.x).toBeLessThanOrEqual(760); // 800 - 40
    });

    it('clamps to top screen edge', () => {
      const p = makePlayer({ x: 300, y: 2 });
      p.setVelocity(0, -1);
      p.update(1 / 60);
      expect(p.y).toBeGreaterThanOrEqual(0);
    });

    it('clamps to bottom screen edge', () => {
      const p = makePlayer({ x: 300, y: 560, height: 50 });
      p.setVelocity(0, 1);
      p.update(1 / 60);
      expect(p.y).toBeLessThanOrEqual(550); // 600 - 50
    });
  });

  describe('takeDamage', () => {
    it('reduces health', () => {
      const p = makePlayer();
      p.takeDamage(30);
      expect(p.getStats().health).toBe(70);
    });

    it('clamps health to zero', () => {
      const p = makePlayer();
      p.takeDamage(200);
      expect(p.getStats().health).toBe(0);
    });

    it('deactivates player at zero health', () => {
      const p = makePlayer();
      p.takeDamage(100);
      expect(p.active).toBe(false);
    });

    it('stays active above zero health', () => {
      const p = makePlayer();
      p.takeDamage(99);
      expect(p.active).toBe(true);
    });
  });

  describe('heal', () => {
    it('increases health', () => {
      const p = makePlayer();
      p.takeDamage(50);
      p.heal(20);
      expect(p.getStats().health).toBe(70);
    });

    it('caps at maxHealth', () => {
      const p = makePlayer();
      p.takeDamage(10);
      p.heal(50);
      expect(p.getStats().health).toBe(100);
    });
  });

  describe('canFire', () => {
    it('can fire immediately', () => {
      const p = makePlayer();
      expect(p.canFire(1000)).toBe(true);
    });

    it('cannot fire during cooldown', () => {
      const p = makePlayer();
      p.fire(1000);
      expect(p.canFire(1100)).toBe(false); // 100ms < 150ms fireRate
    });

    it('can fire after cooldown', () => {
      const p = makePlayer();
      p.fire(1000);
      expect(p.canFire(1150)).toBe(true);
    });
  });

  describe('setVelocity', () => {
    it('sets vx and vy', () => {
      const p = makePlayer();
      p.setVelocity(1, -1);
      expect(p.vx).toBe(1);
      expect(p.vy).toBe(-1);
    });
  });

  describe('getStats', () => {
    it('returns a copy of stats', () => {
      const p = makePlayer();
      const s1 = p.getStats();
      const s2 = p.getStats();
      expect(s1).toEqual(s2);
      expect(s1).not.toBe(s2);
    });
  });

  describe('getCharacter', () => {
    it('returns character name', () => {
      const p = makePlayer({ character: 'anabel' });
      expect(p.getCharacter()).toBe('anabel');
    });
  });

  describe('getBounds', () => {
    it('returns position and size rect', () => {
      const p = makePlayer({ x: 10, y: 20, width: 30, height: 40 });
      expect(p.getBounds()).toEqual({ x: 10, y: 20, width: 30, height: 40 });
    });
  });

  describe('getCenter', () => {
    it('returns center of player', () => {
      const p = makePlayer({ x: 100, y: 200, width: 40, height: 50 });
      expect(p.getCenter()).toEqual({ x: 120, y: 225 });
    });
  });
});
