/**
 * Stage 6: The Roaring Knight
 * Deltarune boss with sword slashes and energy waves
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';

export class RoaringKnight extends Boss {
  private phase = 1;
  private phaseChangeTimer = 0;

  constructor(config: BossConfig) {
    super(config);
    this.color = '#8B0000';
    this.patternDuration = 2000;
    this.attackCooldown = 350;
  }

  /**
   * Generate attack projectiles based on pattern
   */
  generateAttack(currentTime: number): Projectile[] {
    const attacks: Projectile[] = [];
    const center = this.getCenter();

    switch (this.patternIndex) {
      case 0:
        // Sword slash (melee range)
        for (let i = 0; i < 3; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y + i * 15 - 15,
              vx: -3,
              vy: 0,
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 1:
        // Energy wave projection
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI / 4) * (i - 2) / 2;
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y - 4,
              vx: -3.5 * Math.cos(angle),
              vy: -3.5 * Math.sin(angle),
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 2:
        // Phase transition attack (all directions)
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * 2 * i) / 6;
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
   * Update boss movement and phases
   */
  update(deltaTime: number): void {
    this.phaseChangeTimer += deltaTime * 1000;

    // Phase changes at health thresholds
    const healthPercent = (this.stats.health / this.stats.maxHealth) * 100;
    if (healthPercent < 75 && this.phase === 1) {
      this.phase = 2;
      this.phaseChangeTimer = 0;
    } else if (healthPercent < 50 && this.phase === 2) {
      this.phase = 3;
      this.phaseChangeTimer = 0;
    } else if (healthPercent < 25 && this.phase === 3) {
      this.phase = 4;
      this.phaseChangeTimer = 0;
    }

    super.update(deltaTime);

    // Aggressive movement in later phases
    const time = Date.now() / 1000;
    this.vx = Math.sin(time * this.phase) * 1.5;
    this.vy = Math.cos(time * this.phase) * 1.5;
  }

  /**
   * Get current phase
   */
  getPhase(): number {
    return this.phase;
  }
}
