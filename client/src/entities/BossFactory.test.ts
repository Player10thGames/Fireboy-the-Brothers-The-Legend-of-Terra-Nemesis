import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/assetLoader', () => ({
  AssetLoader: {
    preloadImage: vi.fn().mockResolvedValue(null),
    getImage: vi.fn().mockReturnValue(''),
  },
}));

vi.mock('@/engine/GameEngine', () => ({}));

import { BossFactory } from './BossFactory';
import { BossConfig } from './Boss';

const baseConfig: BossConfig = {
  x: 350,
  y: 50,
  width: 100,
  height: 100,
  stats: { health: 200, maxHealth: 200, damage: 10, speed: 2 },
  name: 'Test',
  stage: 1,
};

describe('BossFactory', () => {
  it('creates a boss for stage 1', () => {
    const boss = BossFactory.createBoss(1, baseConfig);
    expect(boss).toBeDefined();
    expect(boss.active).toBe(true);
  });

  it('creates a boss for stage 2', () => {
    const boss = BossFactory.createBoss(2, baseConfig);
    expect(boss).toBeDefined();
  });

  it('creates a boss for stage 3', () => {
    const boss = BossFactory.createBoss(3, baseConfig);
    expect(boss).toBeDefined();
  });

  it('creates a boss for stage 4', () => {
    const boss = BossFactory.createBoss(4, baseConfig);
    expect(boss).toBeDefined();
  });

  it('creates a boss for stage 5', () => {
    const boss = BossFactory.createBoss(5, baseConfig);
    expect(boss).toBeDefined();
  });

  it('creates a boss for stage 6', () => {
    const boss = BossFactory.createBoss(6, baseConfig);
    expect(boss).toBeDefined();
  });

  it('creates a boss for stage 7', () => {
    const boss = BossFactory.createBoss(7, baseConfig);
    expect(boss).toBeDefined();
  });

  it('throws for unknown stage', () => {
    expect(() => BossFactory.createBoss(0, baseConfig)).toThrow('Unknown boss stage: 0');
    expect(() => BossFactory.createBoss(8, baseConfig)).toThrow('Unknown boss stage: 8');
    expect(() => BossFactory.createBoss(-1, baseConfig)).toThrow('Unknown boss stage: -1');
  });

  it('each stage produces a different boss subclass', () => {
    const bosses = [];
    for (let i = 1; i <= 7; i++) {
      bosses.push(BossFactory.createBoss(i, baseConfig));
    }
    const constructors = bosses.map(b => b.constructor.name);
    expect(new Set(constructors).size).toBe(7);
  });
});
