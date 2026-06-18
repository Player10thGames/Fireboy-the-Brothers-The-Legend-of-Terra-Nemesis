/**
 * Stage 2: Butch from Rowdyruff Boys
 * Charging attacks and destructible obstacles
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';
import { createLinearRow, createRadialBurst } from '../ProjectilePatterns';

export class ButchBoss extends Boss {
  private chargeTimer = 0;
  private isCharging = false;

  constructor(config: BossConfig) {
    super(config);
    this.color = '#DC143C';
    this.patternDuration = 2500;
    this.attackCooldown = 400;
  }

  generateAttack(currentTime: number): Projectile[] {
    const center = this.getCenter();
    const origin = { x: center.x, y: center.y, damage: this.stats.damage };

    switch (this.patternIndex) {
      case 0:
        if (!this.isCharging) {
          this.isCharging = true;
          this.chargeTimer = 0;
        }
        return createLinearRow(origin, 2, 30, -5);

      case 1:
        return createRadialBurst(origin, 8, 3);

      case 2:
        return createLinearRow(origin, 4, 15, -4);

      default:
        return [];
    }
  }

  update(deltaTime: number): void {
    super.update(deltaTime);

    this.chargeTimer += deltaTime * 1000;
    if (this.chargeTimer > 3000) {
      this.chargeTimer = 0;
      this.isCharging = false;
    }

    if (this.y < 200) {
      this.vy = 1;
    } else if (this.y > 350) {
      this.vy = -1;
    }
  }
}
