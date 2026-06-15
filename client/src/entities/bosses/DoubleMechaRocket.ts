/**
 * Stage 1: Double Mecha Rocket
 * Big Core MK.I from Gradius with Fire Breath from Sonic 3
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';
import { createLinearRow, createFanSpread } from '../ProjectilePatterns';

export class DoubleMechaRocket extends Boss {
  private movementDirection = 1;
  private movementTimer = 0;

  constructor(config: BossConfig) {
    super(config);
    this.color = '#FF4500';
    this.patternDuration = 2000;
    this.attackCooldown = 300;
  }

  generateAttack(currentTime: number): Projectile[] {
    const center = this.getCenter();
    const origin = { x: center.x, y: center.y, damage: this.stats.damage };

    switch (this.patternIndex) {
      case 0:
        return createLinearRow(origin, 3, 20, -4);

      case 1:
        return createFanSpread(origin, 5, 3, Math.PI / 4, Math.PI);

      case 2:
        return [
          ...createLinearRow(origin, 3, 20, -4),
          ...createFanSpread(origin, 3, 3, Math.PI / 3, Math.PI),
        ];

      default:
        return [];
    }
  }

  update(deltaTime: number): void {
    super.update(deltaTime);

    this.movementTimer += deltaTime * 1000;
    if (this.movementTimer > 1000) {
      this.movementTimer = 0;
      this.movementDirection *= -1;
    }

    this.vy = Math.sin(this.movementTimer / 500) * 2;
  }
}
