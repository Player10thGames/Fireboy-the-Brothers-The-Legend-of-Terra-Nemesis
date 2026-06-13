/**
 * Stage 5: Metal Sonic
 * Sonic series speedster with homing projectiles
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';

export class MetalSonic extends Boss {
  private dashTimer = 0;
  private isDashing = false;

  constructor(config: BossConfig) {
    super(config);
    this.color = '#C0C0C0';
    this.patternDuration = 2000;
    this.attackCooldown = 300;
  }

  /**
   * Generate attack projectiles based on pattern
   */
  generateAttack(currentTime: number): Projectile[] {
    const attacks: Projectile[] = [];
    const center = this.getCenter();

    switch (this.patternIndex) {
      case 0:
        // Speed dash (left-right)
        for (let i = 0; i < 3; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y + i * 20 - 20,
              vx: -5,
              vy: 0,
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 1:
        // Homing projectiles
        for (let i = 0; i < 4; i++) {
          const angle = (Math.PI / 2) * i;
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y - 4,
              vx: 2.5 * Math.cos(angle),
              vy: 2.5 * Math.sin(angle),
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 2:
        // Spin attack
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
    }

    return attacks;
  }

  /**
   * Update boss movement
   */
  update(deltaTime: number): void {
    super.update(deltaTime);

    // Fast, erratic movement
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

    // Vertical movement
    if (this.y < 150) {
      this.vy = 2;
    } else if (this.y > 350) {
      this.vy = -2;
    }
  }
}
