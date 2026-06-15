
/**
 * Boss Behavior Configuration
 * Defines unique behaviors and attack patterns for each boss
 */

export interface BossBehaviorConfig {
  name: string;
  baseAttackCooldown: number;
  patternDuration: number;
  maxPatterns: number;
  attackPatterns: Array<{
    type: 'straight' | 'spread' | 'burst' | 'homing' | 'wave';
    intensity: number;
    description: string;
  }>;
  phases: Array<{
    phase: number;
    healthThreshold: number;
    speedMultiplier: number;
    damageMultiplier: number;
    attackCooldownMultiplier: number;
    description: string;
  }>;
  specialAbilities: Array<{
    name: string;
    triggerPhase: number;
    cooldown: number;
    description: string;
  }>;
}

export const BOSS_BEHAVIORS: Record<number, BossBehaviorConfig> = {
  1: {
    // Double Mecha Rocket
    name: 'Double Mecha Rocket',
    baseAttackCooldown: 350,
    patternDuration: 2000,
    maxPatterns: 3,
    attackPatterns: [
      { type: 'straight', intensity: 2, description: 'Laser beams' },
      { type: 'spread', intensity: 5, description: 'Fire breath spread' },
      { type: 'wave', intensity: 6, description: 'Energy wave' },
    ],
    phases: [
      { phase: 1, healthThreshold: 100, speedMultiplier: 1.0, damageMultiplier: 1.0, attackCooldownMultiplier: 1.0, description: 'Normal' },
      { phase: 2, healthThreshold: 50, speedMultiplier: 1.3, damageMultiplier: 1.2, attackCooldownMultiplier: 0.8, description: 'Enraged' },
    ],
    specialAbilities: [
      { name: 'Mega Laser', triggerPhase: 2, cooldown: 5000, description: 'Fires a massive laser beam' },
    ],
  },
  2: {
    // Butch
    name: 'Butch',
    baseAttackCooldown: 400,
    patternDuration: 2500,
    maxPatterns: 3,
    attackPatterns: [
      { type: 'straight', intensity: 2, description: 'Charging dash' },
      { type: 'burst', intensity: 8, description: 'Explosive punch' },
      { type: 'straight', intensity: 4, description: 'Multi-hit combo' },
    ],
    phases: [
      { phase: 1, healthThreshold: 100, speedMultiplier: 1.0, damageMultiplier: 1.0, attackCooldownMultiplier: 1.0, description: 'Normal' },
      { phase: 2, healthThreshold: 50, speedMultiplier: 1.2, damageMultiplier: 1.3, attackCooldownMultiplier: 0.9, description: 'Furious' },
    ],
    specialAbilities: [
      { name: 'Ground Slam', triggerPhase: 2, cooldown: 4000, description: 'Slams the ground creating shockwaves' },
    ],
  },
  3: {
    // Mandler
    name: 'Mandler',
    baseAttackCooldown: 380,
    patternDuration: 2200,
    maxPatterns: 4,
    attackPatterns: [
      { type: 'burst', intensity: 6, description: 'Rotating projectiles' },
      { type: 'wave', intensity: 5, description: 'Gravity waves' },
      { type: 'spread', intensity: 7, description: 'Scattered shots' },
      { type: 'homing', intensity: 3, description: 'Homing projectiles' },
    ],
    phases: [
      { phase: 1, healthThreshold: 100, speedMultiplier: 1.0, damageMultiplier: 1.0, attackCooldownMultiplier: 1.0, description: 'Normal' },
      { phase: 2, healthThreshold: 60, speedMultiplier: 1.1, damageMultiplier: 1.1, attackCooldownMultiplier: 0.85, description: 'Accelerated' },
      { phase: 3, healthThreshold: 30, speedMultiplier: 1.3, damageMultiplier: 1.3, attackCooldownMultiplier: 0.7, description: 'Chaotic' },
    ],
    specialAbilities: [
      { name: 'Gravity Shift', triggerPhase: 2, cooldown: 6000, description: 'Reverses gravity temporarily' },
      { name: 'Dimensional Rift', triggerPhase: 3, cooldown: 7000, description: 'Creates a rift of projectiles' },
    ],
  },
  4: {
    // Crusher-Bot MK.II
    name: 'Crusher-Bot MK.II',
    baseAttackCooldown: 420,
    patternDuration: 2400,
    maxPatterns: 3,
    attackPatterns: [
      { type: 'straight', intensity: 3, description: 'Heavy stomp' },
      { type: 'burst', intensity: 6, description: 'Missile barrage' },
      { type: 'wave', intensity: 5, description: 'Shockwave' },
    ],
    phases: [
      { phase: 1, healthThreshold: 100, speedMultiplier: 0.8, damageMultiplier: 1.2, attackCooldownMultiplier: 1.1, description: 'Normal' },
      { phase: 2, healthThreshold: 50, speedMultiplier: 1.0, damageMultiplier: 1.4, attackCooldownMultiplier: 0.9, description: 'Overclocked' },
    ],
    specialAbilities: [
      { name: 'Hydraulic Slam', triggerPhase: 2, cooldown: 5000, description: 'Slams with massive force' },
    ],
  },
  5: {
    // Metal Sonic
    name: 'Metal Sonic',
    baseAttackCooldown: 330,
    patternDuration: 1800,
    maxPatterns: 4,
    attackPatterns: [
      { type: 'straight', intensity: 2, description: 'Speed dash' },
      { type: 'homing', intensity: 4, description: 'Homing projectiles' },
      { type: 'spread', intensity: 6, description: 'Spread attack' },
      { type: 'burst', intensity: 8, description: 'Circular burst' },
    ],
    phases: [
      { phase: 1, healthThreshold: 100, speedMultiplier: 1.2, damageMultiplier: 1.0, attackCooldownMultiplier: 0.9, description: 'Normal' },
      { phase: 2, healthThreshold: 60, speedMultiplier: 1.5, damageMultiplier: 1.2, attackCooldownMultiplier: 0.7, description: 'Supersonic' },
      { phase: 3, healthThreshold: 30, speedMultiplier: 1.8, damageMultiplier: 1.4, attackCooldownMultiplier: 0.5, description: 'Hypersonic' },
    ],
    specialAbilities: [
      { name: 'Chaos Control', triggerPhase: 2, cooldown: 5000, description: 'Teleports and attacks from multiple angles' },
      { name: 'Super Sonic Dash', triggerPhase: 3, cooldown: 4000, description: 'High-speed dash attack' },
    ],
  },
  6: {
    // The Roaring Knight
    name: 'The Roaring Knight',
    baseAttackCooldown: 350,
    patternDuration: 2000,
    maxPatterns: 3,
    attackPatterns: [
      { type: 'straight', intensity: 3, description: 'Sword slashes' },
      { type: 'spread', intensity: 5, description: 'Energy wave' },
      { type: 'burst', intensity: 6, description: 'Phase transition attack' },
    ],
    phases: [
      { phase: 1, healthThreshold: 100, speedMultiplier: 1.0, damageMultiplier: 1.0, attackCooldownMultiplier: 1.0, description: 'Normal' },
      { phase: 2, healthThreshold: 75, speedMultiplier: 1.1, damageMultiplier: 1.1, attackCooldownMultiplier: 0.9, description: 'Phase 2' },
      { phase: 3, healthThreshold: 50, speedMultiplier: 1.2, damageMultiplier: 1.2, attackCooldownMultiplier: 0.8, description: 'Phase 3' },
      { phase: 4, healthThreshold: 25, speedMultiplier: 1.4, damageMultiplier: 1.4, attackCooldownMultiplier: 0.6, description: 'Enraged' },
    ],
    specialAbilities: [
      { name: 'Divine Slash', triggerPhase: 2, cooldown: 5000, description: 'Powerful sword slash' },
      { name: 'Roaring Cry', triggerPhase: 3, cooldown: 6000, description: 'Unleashes a roaring attack' },
      { name: 'Ultimate Judgment', triggerPhase: 4, cooldown: 7000, description: 'Final devastating attack' },
    ],
  },
  7: {
    // Roaring Metal (True Final Boss)
    name: 'Roaring Metal',
    baseAttackCooldown: 300,
    patternDuration: 1600,
    maxPatterns: 5,
    attackPatterns: [
      { type: 'straight', intensity: 3, description: 'Metal slash' },
      { type: 'homing', intensity: 5, description: 'Homing projectiles' },
      { type: 'spread', intensity: 7, description: 'Spread attack' },
      { type: 'burst', intensity: 8, description: 'Circular burst' },
      { type: 'wave', intensity: 6, description: 'Energy wave' },
    ],
    phases: [
      { phase: 1, healthThreshold: 100, speedMultiplier: 1.1, damageMultiplier: 1.1, attackCooldownMultiplier: 0.95, description: 'Normal' },
      { phase: 2, healthThreshold: 75, speedMultiplier: 1.3, damageMultiplier: 1.3, attackCooldownMultiplier: 0.8, description: 'Phase 2' },
      { phase: 3, healthThreshold: 50, speedMultiplier: 1.5, damageMultiplier: 1.5, attackCooldownMultiplier: 0.65, description: 'Phase 3' },
      { phase: 4, healthThreshold: 25, speedMultiplier: 1.8, damageMultiplier: 1.8, attackCooldownMultiplier: 0.5, description: 'Enrage Mode' },
    ],
    specialAbilities: [
      { name: 'Fusion Attack', triggerPhase: 2, cooldown: 5000, description: 'Combines metal and roaring attacks' },
      { name: 'Chaos Burst', triggerPhase: 3, cooldown: 6000, description: 'Unleashes chaotic projectiles' },
      { name: 'Apocalypse', triggerPhase: 4, cooldown: 8000, description: 'Ultimate combined attack' },
    ],
  },
};

export function getBossBehavior(stage: number): BossBehaviorConfig | undefined {
  return BOSS_BEHAVIORS[stage];
}
