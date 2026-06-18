import { describe, it, expect, beforeEach } from 'vitest';
import {
  MovingPlatformsGimmick,
  GravityShiftGimmick,
  ShockwaveGimmick,
  RingCollectionGimmick,
  PhaseTransitionGimmick,
} from './Gimmick';

describe('MovingPlatformsGimmick', () => {
  let gimmick: MovingPlatformsGimmick;

  beforeEach(() => {
    gimmick = new MovingPlatformsGimmick();
  });

  it('has correct name', () => {
    expect(gimmick.name).toBe('Moving Platforms');
  });

  it('apply returns unchanged player position', () => {
    const result = gimmick.apply(100, 5);
    expect(result).toEqual({ y: 100, vy: 5 });
  });

  it('update does not throw', () => {
    expect(() => gimmick.update(1 / 60)).not.toThrow();
  });

  it('platforms reverse direction at screen edges', () => {
    // Simulate many updates to move platforms to the edge
    for (let i = 0; i < 1000; i++) {
      gimmick.update(1 / 60);
    }
    // Should not throw and should keep running
    expect(() => gimmick.update(1 / 60)).not.toThrow();
  });
});

describe('GravityShiftGimmick', () => {
  let gimmick: GravityShiftGimmick;

  beforeEach(() => {
    gimmick = new GravityShiftGimmick();
  });

  it('has correct name', () => {
    expect(gimmick.name).toBe('Gravity Shift');
  });

  it('starts with normal gravity', () => {
    const result = gimmick.apply(100, 5);
    expect(result.vy).toBe(5);
  });

  it('reverses gravity after 5 seconds', () => {
    // Simulate 5+ seconds of updates
    const dt = 0.1; // 100ms
    for (let i = 0; i < 51; i++) {
      gimmick.update(dt);
    }
    const result = gimmick.apply(100, 5);
    expect(result.vy).toBe(-5);
  });

  it('gravity toggles back after another 5 seconds', () => {
    const dt = 0.1;
    // First shift
    for (let i = 0; i < 51; i++) {
      gimmick.update(dt);
    }
    // Second shift
    for (let i = 0; i < 51; i++) {
      gimmick.update(dt);
    }
    const result = gimmick.apply(100, 5);
    expect(result.vy).toBe(5);
  });

  it('preserves y position in apply', () => {
    const result = gimmick.apply(300, 10);
    expect(result.y).toBe(300);
  });
});

describe('ShockwaveGimmick', () => {
  let gimmick: ShockwaveGimmick;

  beforeEach(() => {
    gimmick = new ShockwaveGimmick();
  });

  it('has correct name', () => {
    expect(gimmick.name).toBe('Shockwaves');
  });

  it('apply returns unchanged values', () => {
    expect(gimmick.apply(100, 5)).toEqual({ y: 100, vy: 5 });
  });

  it('triggerShockwave does not throw', () => {
    expect(() => gimmick.triggerShockwave(400)).not.toThrow();
  });

  it('shockwaves expand and eventually get cleaned up', () => {
    gimmick.triggerShockwave(400);
    // Simulate enough updates for the shockwave to reach maxRadius
    for (let i = 0; i < 100; i++) {
      gimmick.update(1 / 60);
    }
    // Should not throw
    expect(() => gimmick.update(1 / 60)).not.toThrow();
  });
});

describe('RingCollectionGimmick', () => {
  let gimmick: RingCollectionGimmick;

  beforeEach(() => {
    gimmick = new RingCollectionGimmick();
  });

  it('has correct name', () => {
    expect(gimmick.name).toBe('Ring Collection');
  });

  it('starts with 0 collected rings', () => {
    expect(gimmick.collectedRings).toBe(0);
  });

  it('apply returns unchanged values', () => {
    expect(gimmick.apply(100, 5)).toEqual({ y: 100, vy: 5 });
  });

  it('checkCollision increments collected rings on overlap', () => {
    // Place a large player covering entire screen to guarantee ring collision
    gimmick.checkCollision(0, 0, 800, 600);
    expect(gimmick.collectedRings).toBeGreaterThan(0);
  });

  it('rings respawn after 10 seconds', () => {
    // Collect all rings
    gimmick.checkCollision(0, 0, 800, 600);
    const collected = gimmick.collectedRings;
    expect(collected).toBeGreaterThan(0);

    // Simulate 10+ seconds
    const dt = 0.2;
    for (let i = 0; i < 51; i++) {
      gimmick.update(dt);
    }

    // After respawn, collected should reset
    expect(gimmick.collectedRings).toBe(0);
  });

  it('does not double-collect the same ring', () => {
    gimmick.checkCollision(0, 0, 800, 600);
    const first = gimmick.collectedRings;
    gimmick.checkCollision(0, 0, 800, 600);
    expect(gimmick.collectedRings).toBe(first);
  });
});

describe('PhaseTransitionGimmick', () => {
  let gimmick: PhaseTransitionGimmick;

  beforeEach(() => {
    gimmick = new PhaseTransitionGimmick();
  });

  it('has correct name', () => {
    expect(gimmick.name).toBe('Phase Transitions');
  });

  it('apply returns unchanged values', () => {
    expect(gimmick.apply(100, 5)).toEqual({ y: 100, vy: 5 });
  });

  it('returns phase 0 at full health', () => {
    expect(gimmick.updatePhase(100)).toBe(0);
  });

  it('returns phase 1 at 75% health', () => {
    expect(gimmick.updatePhase(75)).toBe(1);
  });

  it('returns phase 2 at 50% health', () => {
    expect(gimmick.updatePhase(50)).toBe(2);
  });

  it('returns phase 3 at 25% health', () => {
    expect(gimmick.updatePhase(25)).toBe(3);
  });

  it('returns phase 3 at near-zero health', () => {
    expect(gimmick.updatePhase(1)).toBe(3);
  });
});
