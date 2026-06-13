/**
 * Stage 4: Crusher-Bot MK.II
 * Heavy robot with stomp attacks and missile barrage
 */

import { Boss, BossConfig } from '../Boss';
import { Projectile } from '../Projectile';

export class CrusherBot extends Boss {
  private stompTimer = 0;

  constructor(config: BossConfig) {
    super(config);
    this.color = '#696969';
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
        // Heavy stomp (creates shockwave)
        for (let i = 0; i < 5; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y - 4,
              vx: -3 + i * 1.5,
              vy: 2,
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 1:
        // Missile barrage
        for (let i = 0; i < 4; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y + i * 25 - 40,
              vx: -4,
              vy: 0,
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
        break;

      case 2:
        // Combination stomp + missiles
        for (let i = 0; i < 3; i++) {
          attacks.push(
            new Projectile({
              x: center.x - 4,
              y: center.y - 4,
              vx: -3 + i * 1.5,
              vy: 2,
              damage: this.stats.damage,
              owner: 'boss',
            })
          );
        }
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
    }

    return attacks;
  }

  /**
   * Update boss movement
   */
  update(deltaTime: number): void {
    super.update(deltaTime);

    // Slow, heavy movement
    this.stompTimer += deltaTime * 1000;
    if (this.stompTimer > 2000) {
      this.stompTimer = 0;
    }

    // Move up and down slowly
    if (this.y < 150) {
      this.vy = 0.5;
    } else if (this.y > 350) {
      this.vy = -0.5;
    }
  }
}
