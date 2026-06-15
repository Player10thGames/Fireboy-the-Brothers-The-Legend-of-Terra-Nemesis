/**
 * Stage 7: Roaring Metal (True Final Boss)
 * Combines Roaring Knight and Metal Sonic
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';
import { createLinearRow, createRadialBurst, createFanSpread } from '../ProjectilePatterns';

export class RoaringMetal extends Boss {
  private enrageMode = false;
  private rotationAngle = 0;
  private phase = 1;

  constructor(config: BossConfig) {
    super(config);
    this.color = '#FF1493';
    this.patternDuration = 1500;
    this.attackCooldown = 250;
  }

  generateAttack(currentTime: number): Projectile[] {
    const center = this.getCenter();
    const origin = { x: center.x, y: center.y, damage: this.stats.damage };
    this.rotationAngle += 0.5;

    if (this.stats.health < this.stats.maxHealth / 2) {
      this.enrageMode = true;
      this.attackCooldown = 150;
    }

    switch (this.patternIndex) {
      case 0:
        return [
          ...createLinearRow(origin, 4, 20, -4),
          ...createFanSpread(origin, 4, 3, Math.PI / 3, Math.PI),
        ];

      case 1:
        return createLinearRow(origin, 5, 15, -5);

      case 2:
        return [
          ...createRadialBurst(origin, 8, 3, this.rotationAngle),
          ...createLinearRow(origin, 3, 25, -4),
          ...createRadialBurst(origin, 4, 2.5),
        ];

      default:
        return [];
    }
  }

  update(deltaTime: number): void {
    super.update(deltaTime);

    const time = Date.now() / 1000;
    const speed = this.enrageMode ? 3 : 2;

    this.vx = Math.sin(time * 2) * speed;
    this.vy = Math.cos(time * 1.5) * speed;

    if (this.enrageMode && Math.random() < 0.01) {
      this.x = Math.random() * 700;
      this.y = Math.random() * 400 + 50;
    }
  }

  isEnraged(): boolean {
    return this.enrageMode;
  }
}
