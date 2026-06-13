/**
 * Stage 3: Mandler from Terra Cresta
 * Rotating projectiles and spiral attacks
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';

export class Mandler extends Boss {
  private rotationAngle = 0;

  constructor(config: BossConfig) {
    super(config);
    this.color = '#FFD700';
    this.patternDuration = 2000;
    this.attackCooldown = 350;
  }

  /**
   * Generate attack projectiles based on pattern
   */
  generateAttack(currentTime: number): Projectile[] {
    const attacks: Projectile[] = [];
    const center = this.getCenter();
    this.rotationAngle += 0.3;

    switch (this.patternIndex) {
      case 0:
        // Rotating projectile rings
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * 2 * i) / 6 + this.rotationAngle;
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

      case 1:
        // Spiral attack
        for (let i = 0; i < 4; i++) {
          const angle = (Math.PI / 2) * i + this.rotationAngle * 0.5;
          const distance = 2 + i * 0.5;
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y - 4,
              vx: distance * Math.cos(angle),
              vy: distance * Math.sin(angle),
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 2:
        // Gravity well (multiple projectiles converging)
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8;
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
    }

    return attacks;
  }

  /**
   * Update boss movement
   */
  update(deltaTime: number): void {
    super.update(deltaTime);

    // Circular movement pattern
    const time = Date.now() / 1000;
    this.vx = Math.sin(time) * 1.5;
    this.vy = Math.cos(time) * 1.5;
  }
}
