/**
 * Stage 5: Metal Sonic
 * Sonic series speedster with homing projectiles
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';
import { createLinearRow, createRadialBurst } from '../ProjectilePatterns';

export class MetalSonic extends Boss {
  private dashTimer = 0;
  private isDashing = false;

  constructor(config: BossConfig) {
    super(config);
    this.color = '#C0C0C0';
    this.patternDuration = 2000;
    this.attackCooldown = 300;
  }

  generateAttack(currentTime: number): Projectile[] {
    const center = this.getCenter();
    const origin = { x: center.x, y: center.y, damage: this.stats.damage };

    switch (this.patternIndex) {
      case 0:
        return createLinearRow(origin, 3, 20, -5);

      case 1:
        return createRadialBurst(origin, 4, 2.5);

      case 2:
        return createRadialBurst(origin, 8, 3);

      default:
        return [];
    }
  }

  update(deltaTime: number): void {
    super.update(deltaTime);

    this.dashTimer += deltaTime * 1000;
    if (this.dashTimer > 1500) {
      this.dashTimer = 0;
      this.isDashing = !this.isDashing;
    }

    if (this.isDashing) {
      this.vx = Math.sin(this.dashTimer / 500) * 3;
    } else {
      this.vx = 0;
    }

    if (this.y < 150) {
      this.vy = 2;
    } else if (this.y > 350) {
      this.vy = -2;
    }
  }
}
