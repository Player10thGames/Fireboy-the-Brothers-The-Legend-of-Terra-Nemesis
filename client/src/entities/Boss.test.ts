import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/assetLoader', () => ({
  AssetLoader: {
    preloadImage: vi.fn().mockResolvedValue(null),
    getImage: vi.fn().mockReturnValue(''),
  },
}));

vi.mock('@/engine/GameEngine', () => ({}));

import { Boss, BossConfig } from './Boss';

function makeBoss(overrides: Partial<BossConfig> = {}): Boss {
  return new Boss({
    x: 350,
    y: 50,
    width: 100,
    height: 100,
    stats: { health: 200, maxHealth: 200, damage: 10, speed: 2 },
    name: 'Test Boss',
    stage: 1,
    ...overrides,
  });
}

describe('Boss', () => {
  describe('constructor', () => {
    it('initializes with given config', () => {
      const b = makeBoss({ x: 100, y: 50, width: 80, height: 90 });
      expect(b.x).toBe(100);
      expect(b.y).toBe(50);
      expect(b.width).toBe(80);
      expect(b.height).toBe(90);
    });

    it('starts active', () => {
      expect(makeBoss().active).toBe(true);
    });

    it('copies stats', () => {
      const stats = { health: 200, maxHealth: 200, damage: 10, speed: 2 };
      const b = makeBoss({ stats });
      stats.health = 0;
      expect(b.getStats().health).toBe(200);
    });
  });

  describe('update', () => {
    it('updates pattern timer', () => {
      const b = makeBoss();
      b.update(1); // 1 second
      expect(b.getAttackPattern()).toBe(0); // still within 2s pattern
    });

    it('cycles through patterns after duration', () => {
      const b = makeBoss();
      // Simulate 2+ seconds to trigger pattern switch
      b.update(2.1);
      expect(b.getAttackPattern()).toBe(1);
    });

    it('cycles patterns modulo 3', () => {
      const b = makeBoss();
      // 3 full pattern cycles: 6+ seconds
      b.update(2.1);
      b.update(2.1);
      b.update(2.1);
      expect(b.getAttackPattern()).toBe(0); // wraps around
    });

    it('applies velocity with speed factor', () => {
      const b = makeBoss({ x: 400, y: 100 });
      b.setVelocity(1, 0);
      b.update(1 / 60);
      expect(b.x).toBeCloseTo(402, 0); // speed=2
    });

    it('clamps to screen bounds', () => {
      const b = makeBoss({ x: 750, y: 300, width: 100 });
      b.setVelocity(1, 0);
      b.update(1 / 60);
      expect(b.x).toBeLessThanOrEqual(700); // 800 - 100
    });
  });

  describe('takeDamage', () => {
    it('reduces health', () => {
      const b = makeBoss();
      b.takeDamage(50);
      expect(b.getStats().health).toBe(150);
    });

    it('clamps to zero', () => {
      const b = makeBoss();
      b.takeDamage(500);
      expect(b.getStats().health).toBe(0);
    });

    it('deactivates at zero health', () => {
      const b = makeBoss();
      b.takeDamage(200);
      expect(b.active).toBe(false);
    });
  });

  describe('canAttack', () => {
    it('can attack initially', () => {
      const b = makeBoss();
      expect(b.canAttack(1000)).toBe(true);
    });

    it('cannot attack during cooldown', () => {
      const b = makeBoss();
      b.registerAttack(1000);
      expect(b.canAttack(1400)).toBe(false); // 400ms < 500ms cooldown
    });

    it('can attack after cooldown', () => {
      const b = makeBoss();
      b.registerAttack(1000);
      expect(b.canAttack(1500)).toBe(true);
    });
  });

  describe('generateAttack', () => {
    it('returns empty array by default', () => {
      const b = makeBoss();
      expect(b.generateAttack(1000)).toEqual([]);
    });
  });

  describe('getStats', () => {
    it('returns a copy', () => {
      const b = makeBoss();
      const s1 = b.getStats();
      const s2 = b.getStats();
      expect(s1).not.toBe(s2);
      expect(s1).toEqual(s2);
    });
  });

  describe('getName', () => {
    it('returns boss name', () => {
      expect(makeBoss({ name: 'Metal Sonic' }).getName()).toBe('Metal Sonic');
    });
  });

  describe('getBounds', () => {
    it('returns bounding rect', () => {
      const b = makeBoss({ x: 10, y: 20, width: 30, height: 40 });
      expect(b.getBounds()).toEqual({ x: 10, y: 20, width: 30, height: 40 });
    });
  });

  describe('getCenter', () => {
    it('returns center point', () => {
      const b = makeBoss({ x: 100, y: 200, width: 50, height: 60 });
      expect(b.getCenter()).toEqual({ x: 125, y: 230 });
    });
  });

  describe('getHealthPercentage', () => {
    it('returns 100 at full health', () => {
      expect(makeBoss().getHealthPercentage()).toBe(100);
    });

    it('returns 50 at half health', () => {
      const b = makeBoss();
      b.takeDamage(100);
      expect(b.getHealthPercentage()).toBe(50);
    });

    it('returns 0 at zero health', () => {
      const b = makeBoss();
      b.takeDamage(200);
      expect(b.getHealthPercentage()).toBe(0);
    });
  });

  describe('setVelocity', () => {
    it('sets vx and vy', () => {
      const b = makeBoss();
      b.setVelocity(3, -2);
      expect(b.vx).toBe(3);
      expect(b.vy).toBe(-2);
    });
  });
});
