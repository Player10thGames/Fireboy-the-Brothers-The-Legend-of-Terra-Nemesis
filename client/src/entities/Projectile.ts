/**
 * Projectile Entity
 */

import { GameObject } from '@/engine/GameEngine';
import { Rect } from '@/engine/Collision';

export interface ProjectileConfig {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  owner: 'player' | 'boss';
  width?: number;
  height?: number;
}

export class Projectile implements GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  active = true;

  private damage: number;
  private owner: 'player' | 'boss';
  private lifetime = 5000; // 5 seconds
  private createdAt = Date.now();
  private color: string;

  constructor(config: ProjectileConfig) {
    this.x = config.x;
    this.y = config.y;
    this.vx = config.vx;
    this.vy = config.vy;
    this.damage = config.damage;
    this.owner = config.owner;
    this.width = config.width || 8;
    this.height = config.height || 8;
    this.color = config.owner === 'player' ? '#FFD700' : '#FF6B6B';
  }

  /**
   * Update projectile
   */
  update(deltaTime: number): void {
    // Move projectile
    this.x += this.vx * deltaTime * 60;
    this.y += this.vy * deltaTime * 60;

    // Check lifetime
    if (Date.now() - this.createdAt > this.lifetime) {
      this.active = false;
    }

    // Check bounds (remove if off screen)
    if (
      this.x < -50 ||
      this.x > 850 ||
      this.y < -50 ||
      this.y > 650
    ) {
      this.active = false;
    }
  }

  /**
   * Render projectile
   */
  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Add glow effect
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
    ctx.globalAlpha = 1;
  }

  /**
   * Get projectile bounds
   */
  getBounds(): Rect {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Get damage
   */
  getDamage(): number {
    return this.damage;
  }

  /**
   * Get owner
   */
  getOwner(): 'player' | 'boss' {
    return this.owner;
  }

  /**
   * Get center position
   */
  getCenter(): { x: number; y: number } {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  }
}
