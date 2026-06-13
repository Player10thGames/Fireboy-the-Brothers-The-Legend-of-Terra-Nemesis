/**
 * Stage 2: Butch from Rowdyruff Boys
 * Charging attacks and destructible obstacles
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';

export class ButchBoss extends Boss {
  private chargeTimer = 0;
  private isCharging = false;

  constructor(config: BossConfig) {
    super(config);
    this.color = '#DC143C';
    this.patternDuration = 2500;
    this.attackCooldown = 400;
  }

  /**
   * Generate attack projectiles based on pattern
   */
  generateAttack(currentTime: number): Projectile[] {
    const attacks: Projectile[] = [];
    const center = this.getCenter();

    switch (this.patternIndex) {
      case 0:
        // Charging dash attack
        if (!this.isCharging) {
          this.isCharging = true;
          this.chargeTimer = 0;
        }
        for (let i = 0; i < 2; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y + (i - 0.5) * 30,
              vx: -5,
              vy: 0,
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 1:
        // Explosive punch (creates shockwave)
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8;
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y - 4,
              vx: 3 * Math.cos(angle),
              vy: 3 * Math.sin(angle),
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 2:
        // Multi-hit combo
        for (let i = 0; i < 4; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y + i * 15 - 30,
              vx: -4,
              vy: 0,
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        break;
    }

    return attacks;
  }

  /**
   * Update boss movement
   */
  update(deltaTime: number): void {
    super.update(deltaTime);

    // Aggressive movement pattern
    this.chargeTimer += deltaTime * 1000;
    if (this.chargeTimer > 3000) {
      this.chargeTimer = 0;
      this.isCharging = false;
    }

    // Move towards player
    if (this.y < 200) {
      this.vy = 1;
    } else if (this.y > 350) {
      this.vy = -1;
    }
  }
}
