/**
 * Stage 4: Crusher-Bot MK.II
 * Heavy robot with stomp attacks and missile barrage
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';
import { createLinearRow } from '../ProjectilePatterns';

export class CrusherBot extends Boss {
  private stompTimer = 0;

  constructor(config: BossConfig) {
    super(config);
    this.color = '#696969';
    this.patternDuration = 2500;
    this.attackCooldown = 400;
  }

  generateAttack(currentTime: number): Projectile[] {
    const center = this.getCenter();
    const origin = { x: center.x, y: center.y, damage: this.stats.damage };

    switch (this.patternIndex) {
      case 0:
        return this.createStompWave(center);

      case 1:
        return createLinearRow(origin, 4, 25, -4);

      case 2:
        return [
          ...this.createStompWave(center),
          ...createLinearRow(origin, 3, 20, -4),
        ];

      default:
        return [];
    }
  }

  private createStompWave(center: { x: number; y: number }): Projectile[] {
    const attacks: Projectile[] = [];
    for (let i = 0; i < 5; i++) {
      attacks.push(
        new Projectile({
          x: center.x - 4,
          y: center.y - 4,
          vx: -3 + i * 1.5,
          vy: 2,
          damage: this.stats.damage,
          owner: 'boss',
        }),
      );
    }
    return attacks;
  }

  update(deltaTime: number): void {
    super.update(deltaTime);

    this.stompTimer += deltaTime * 1000;
    if (this.stompTimer > 2000) {
      this.stompTimer = 0;
    }

    if (this.y < 150) {
      this.vy = 0.5;
    } else if (this.y > 350) {
      this.vy = -0.5;
    }
  }
}
