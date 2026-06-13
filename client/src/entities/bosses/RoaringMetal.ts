/**
 * Stage 7: Roaring Metal (True Final Boss)
 * Combines Roaring Knight and Metal Sonic
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';

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

  /**
   * Generate attack projectiles based on pattern
   */
  generateAttack(currentTime: number): Projectile[] {
    const attacks: Projectile[] = [];
    const center = this.getCenter();
    this.rotationAngle += 0.5;

    // Enrage mode at 50% health
    if (this.stats.health < this.stats.maxHealth / 2) {
      this.enrageMode = true;
      this.attackCooldown = 150;
    }

    switch (this.patternIndex) {
      case 0:
        // Combined laser + fire breath
        for (let i = 0; i < 4; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y + i * 20 - 30,
              vx: -4,
              vy: 0,
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        for (let i = 0; i < 4; i++) {
          const angle = (Math.PI / 6) * (i - 1.5);
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y - 4,
              vx: -3 * Math.cos(angle),
              vy: -3 * Math.sin(angle),
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 1:
        // Charging dash + sword slash
        for (let i = 0; i < 5; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y + i * 15 - 30,
              vx: -5,
              vy: 0,
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 2:
        // Full power unleashed (all attacks simultaneously)
        // Rotating rings
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8 + this.rotationAngle;
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
        // Laser beams
        for (let i = 0; i < 3; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y + i * 25 - 25,
              vx: -4,
              vy: 0,
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        // Energy waves
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
    }

    return attacks;
  }

  /**
   * Update boss movement
   */
  update(deltaTime: number): void {
    super.update(deltaTime);

    // Extremely aggressive movement
    const time = Date.now() / 1000;
    const speed = this.enrageMode ? 3 : 2;

    this.vx = Math.sin(time * 2) * speed;
    this.vy = Math.cos(time * 1.5) * speed;

    // Teleport to random position in enrage mode
    if (this.enrageMode && Math.random() < 0.01) {
      this.x = Math.random() * 700;
      this.y = Math.random() * 400 + 50;
    }
  }

  /**
   * Check if in enrage mode
   */
  isEnraged(): boolean {
    return this.enrageMode;
  }
}
