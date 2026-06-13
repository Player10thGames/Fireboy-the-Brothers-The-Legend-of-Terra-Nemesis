/**
 * Stage 1: Double Mecha Rocket
 * Big Core MK.I from Gradius with Fire Breath from Sonic 3
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';

export class DoubleMechaRocket extends Boss {
  private movementDirection = 1;
  private movementTimer = 0;

  constructor(config: BossConfig) {
    super(config);
    this.color = '#FF4500';
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
        // Horizontal laser beams (3 waves)
        for (let i = 0; i < 3; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y + i * 20 - 20,
              vx: -4,
              vy: 0,
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 1:
        // Fire breath spray (left to right)
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI / 4) * (i - 2) / 2;
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

      case 2:
        // Combination attack (both simultaneously)
        for (let i = 0; i < 3; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y + i * 20 - 20,
              vx: -4,
              vy: 0,
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        for (let i = 0; i < 3; i++) {
          const angle = (Math.PI / 6) * (i - 1);
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
    }

    return attacks;
  }

  /**
   * Update boss movement
   */
  update(deltaTime: number): void {
    super.update(deltaTime);

    // Oscillating movement
    this.movementTimer += deltaTime * 1000;
    if (this.movementTimer > 1000) {
      this.movementTimer = 0;
      this.movementDirection *= -1;
    }

    this.vy = Math.sin(this.movementTimer / 500) * 2;
  }
}
