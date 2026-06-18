import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/engine/GameEngine', () => ({}));

import { Projectile, ProjectileConfig } from './Projectile';

function makeProjectile(overrides: Partial<ProjectileConfig> = {}): Projectile {
  return new Projectile({
    x: 100,
    y: 200,
    vx: 5,
    vy: 0,
    damage: 10,
    owner: 'player',
    ...overrides,
  });
}

describe('Projectile', () => {
  describe('constructor', () => {
    it('initializes position and velocity', () => {
      const p = makeProjectile({ x: 50, y: 75, vx: 3, vy: -2 });
      expect(p.x).toBe(50);
      expect(p.y).toBe(75);
      expect(p.vx).toBe(3);
      expect(p.vy).toBe(-2);
    });

    it('defaults width/height to 8', () => {
      const p = makeProjectile();
      expect(p.width).toBe(8);
      expect(p.height).toBe(8);
    });

    it('allows custom width/height', () => {
      const p = makeProjectile({ width: 16, height: 24 });
      expect(p.width).toBe(16);
      expect(p.height).toBe(24);
    });

    it('starts active', () => {
      const p = makeProjectile();
      expect(p.active).toBe(true);
    });
  });

  describe('update', () => {
    it('moves projectile based on velocity and delta time', () => {
      const p = makeProjectile({ x: 100, y: 200, vx: 5, vy: -3 });
      const dt = 1 / 60; // ~16ms
      p.update(dt);
      expect(p.x).toBeCloseTo(105, 0);
      expect(p.y).toBeCloseTo(197, 0);
    });

    it('deactivates when moving off-screen left', () => {
      const p = makeProjectile({ x: -40, y: 200, vx: -5, vy: 0 });
      p.update(1 / 60);
      // After moving further left past -50
      p.x = -51;
      p.update(1 / 60);
      expect(p.active).toBe(false);
    });

    it('deactivates when moving off-screen right', () => {
      const p = makeProjectile({ x: 849, y: 200, vx: 5, vy: 0 });
      p.update(1 / 60);
      expect(p.active).toBe(false);
    });

    it('deactivates when moving off-screen top', () => {
      const p = makeProjectile({ x: 400, y: -49, vx: 0, vy: -5 });
      p.update(1 / 60);
      expect(p.active).toBe(false);
    });

    it('deactivates when moving off-screen bottom', () => {
      const p = makeProjectile({ x: 400, y: 649, vx: 0, vy: 5 });
      p.update(1 / 60);
      expect(p.active).toBe(false);
    });

    it('deactivates after lifetime expires', () => {
      const p = makeProjectile({ x: 400, y: 300, vx: 0, vy: 0 });
      // Manually simulate expired lifetime
      vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 6000);
      p.update(1 / 60);
      expect(p.active).toBe(false);
      vi.restoreAllMocks();
    });
  });

  describe('getBounds', () => {
    it('returns correct bounding rect', () => {
      const p = makeProjectile({ x: 50, y: 75, width: 12, height: 16 });
      expect(p.getBounds()).toEqual({ x: 50, y: 75, width: 12, height: 16 });
    });
  });

  describe('getDamage', () => {
    it('returns configured damage', () => {
      const p = makeProjectile({ damage: 25 });
      expect(p.getDamage()).toBe(25);
    });
  });

  describe('getOwner', () => {
    it('returns player for player projectiles', () => {
      const p = makeProjectile({ owner: 'player' });
      expect(p.getOwner()).toBe('player');
    });

    it('returns boss for boss projectiles', () => {
      const p = makeProjectile({ owner: 'boss' });
      expect(p.getOwner()).toBe('boss');
    });
  });

  describe('getCenter', () => {
    it('returns center coordinates', () => {
      const p = makeProjectile({ x: 100, y: 200, width: 20, height: 30 });
      expect(p.getCenter()).toEqual({ x: 110, y: 215 });
    });

    it('returns center for default size', () => {
      const p = makeProjectile({ x: 0, y: 0 });
      expect(p.getCenter()).toEqual({ x: 4, y: 4 });
    });
  });
});
