/**
 * Stage 3: Mandler from Terra Cresta
 * Rotating projectiles and spiral attacks
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';
import { createRadialBurst } from '../ProjectilePatterns';

export class Mandler extends Boss {
  private rotationAngle = 0;

  constructor(config: BossConfig) {
    super(config);
    this.color = '#FFD700';
    this.patternDuration = 2000;
    this.attackCooldown = 350;
  }

  generateAttack(currentTime: number): Projectile[] {
    const center = this.getCenter();
    const origin = { x: center.x, y: center.y, damage: this.stats.damage };
    this.rotationAngle += 0.3;

    switch (this.patternIndex) {
      case 0:
        return createRadialBurst(origin, 6, 3, this.rotationAngle);

      case 1: {
        const attacks: Projectile[] = [];
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
            }),
          );
        }
        return attacks;
      }

      case 2:
        return createRadialBurst(origin, 8, 2.5);

      default:
        return [];
    }
  }

  update(deltaTime: number): void {
    super.update(deltaTime);

    const time = Date.now() / 1000;
    this.vx = Math.sin(time) * 1.5;
    this.vy = Math.cos(time) * 1.5;
  }
}
