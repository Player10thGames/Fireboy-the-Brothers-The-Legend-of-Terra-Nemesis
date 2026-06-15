/**
 * Stage 6: The Roaring Knight
 * Deltarune boss with sword slashes and energy waves
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';
import { createLinearRow, createRadialBurst, createFanSpread } from '../ProjectilePatterns';

export class RoaringKnight extends Boss {
  private phase = 1;
  private phaseChangeTimer = 0;

  constructor(config: BossConfig) {
    super(config);
    this.color = '#8B0000';
    this.patternDuration = 2000;
    this.attackCooldown = 350;
  }

  generateAttack(currentTime: number): Projectile[] {
    const center = this.getCenter();
    const origin = { x: center.x, y: center.y, damage: this.stats.damage };

    switch (this.patternIndex) {
      case 0:
        return createLinearRow(origin, 3, 15, -3);

      case 1:
        return createFanSpread(origin, 5, 3.5, Math.PI / 4, Math.PI);

      case 2:
        return createRadialBurst(origin, 6, 3);

      default:
        return [];
    }
  }

  update(deltaTime: number): void {
    this.phaseChangeTimer += deltaTime * 1000;

    const healthPercent = (this.stats.health / this.stats.maxHealth) * 100;
    if (healthPercent < 75 && this.phase === 1) {
      this.phase = 2;
      this.phaseChangeTimer = 0;
    } else if (healthPercent < 50 && this.phase === 2) {
      this.phase = 3;
      this.phaseChangeTimer = 0;
    } else if (healthPercent < 25 && this.phase === 3) {
      this.phase = 4;
      this.phaseChangeTimer = 0;
    }

    super.update(deltaTime);

    const time = Date.now() / 1000;
    this.vx = Math.sin(time * this.phase) * 1.5;
    this.vy = Math.cos(time * this.phase) * 1.5;
  }

  getPhase(): number {
    return this.phase;
  }
}
