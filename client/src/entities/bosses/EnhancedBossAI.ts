
/**
 * Enhanced Boss AI System
 * Provides advanced attack patterns and difficulty scaling
 */

import { Boss } from '../Boss';
import { Projectile } from '../Projectile';

export class EnhancedBossAI {
  /**
   * Generate advanced attack patterns based on boss phase and difficulty
   */
  static generateAdvancedAttack(
    boss: Boss,
    pattern: number,
    difficulty: 'easy' | 'normal' | 'hard' | 'extreme'
  ): Projectile[] {
    const attacks: Projectile[] = [];
    const center = boss.getCenter();
    const diffMult = {
      easy: 0.6,
      normal: 1.0,
      hard: 1.4,
      extreme: 2.0,
    }[difficulty];

    switch (pattern) {
      case 0:
        // Straight line attack
        for (let i = 0; i < 3 * diffMult; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y + (i - 1) * 20,
              vx: -5,
              vy: 0,
              damage: boss.getStats().damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 1:
        // Spread attack (cone pattern)
        for (let i = 0; i < 5 * diffMult; i++) {
          const angle = (Math.PI / 4) * (i - 2) / 2;
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y - 4,
              vx: -4 * Math.cos(angle),
              vy: -4 * Math.sin(angle),
              damage: boss.getStats().damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 2:
        // Circular burst
        for (let i = 0; i < 8 * diffMult; i++) {
          const angle = (Math.PI * 2 * i) / (8 * diffMult);
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y - 4,
              vx: 3 * Math.cos(angle),
              vy: 3 * Math.sin(angle),
              damage: boss.getStats().damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 3:
        // Homing attack (simulated with velocity towards player)
        for (let i = 0; i < 2 * diffMult; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y + (i - 0.5) * 30,
              vx: -4.5,
              vy: (Math.random() - 0.5) * 2,
              damage: boss.getStats().damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 4:
        // Wave pattern
        for (let i = 0; i < 6 * diffMult; i++) {
          const waveY = Math.sin(i * 0.5) * 30;
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y + waveY,
              vx: -4,
              vy: 0,
              damage: boss.getStats().damage,
              owner: 'boss',
            })
          );
        }
        break;
    }

    return attacks;
  }

  /**
   * Calculate boss movement based on phase and health
   */
  static calculateMovement(
    boss: Boss,
    phase: number,
    difficulty: 'easy' | 'normal' | 'hard' | 'extreme'
  ): { vx: number; vy: number } {
    const speedMult = {
      easy: 0.8,
      normal: 1.0,
      hard: 1.2,
      extreme: 1.5,
    }[difficulty];

    const baseSpeed = 1.5 * speedMult;
    const phaseSpeedMult = 1 + (phase - 1) * 0.3;

    const time = Date.now() / 1000;
    const vx = Math.sin(time * phaseSpeedMult) * baseSpeed;
    const vy = Math.cos(time * phaseSpeedMult * 0.7) * baseSpeed * 0.5;

    return { vx, vy };
  }

  /**
   * Determine attack cooldown based on difficulty and phase
   */
  static getAttackCooldown(
    baseCooldown: number,
    phase: number,
    difficulty: 'easy' | 'normal' | 'hard' | 'extreme'
  ): number {
    const diffMult = {
      easy: 1.5,
      normal: 1.0,
      hard: 0.7,
      extreme: 0.5,
    }[difficulty];

    const phaseMult = 1 - (phase - 1) * 0.1;
    return baseCooldown * diffMult * phaseMult;
  }

  /**
   * Get attack pattern based on phase and time
   */
  static selectAttackPattern(
    phase: number,
    currentTime: number,
    maxPatterns: number = 5
  ): number {
    const cycleTime = 2000; // 2 second cycle
    const patternIndex = Math.floor((currentTime % cycleTime) / (cycleTime / maxPatterns));
    return patternIndex % maxPatterns;
  }
}
