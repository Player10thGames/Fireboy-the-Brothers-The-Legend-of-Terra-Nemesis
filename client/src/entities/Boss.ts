/**
 * Boss Base Entity
 */

import { GameObject } from '@/engine/GameEngine';
import { Rect } from '@/engine/Collision';
import { Projectile } from './Projectile';

export interface BossStats {
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
}

export interface BossConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  stats: BossStats;
  name: string;
}

export class Boss implements GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  vx = 0;
  vy = 0;
  active = true;

  protected stats: BossStats;
  protected name: string;
  protected color = '#FF0000';
  protected image: HTMLImageElement | null = null;
  protected patternIndex = 0;
  protected patternTimer = 0;
  protected patternDuration = 2000; // 2 seconds per pattern
  protected lastAttackTime = 0;
  protected attackCooldown = 500; // 500ms between attacks

  constructor(config: BossConfig) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.stats = { ...config.stats };
    this.name = config.name;
  }

  /**
   * Load boss sprite image
   */
  loadImage(imageUrl: string): void {
    this.image = new Image();
    this.image.src = imageUrl;
  }

  /**
   * Update boss state
   */
  update(deltaTime: number): void {
    // Update pattern timer
    this.patternTimer += deltaTime * 1000;

    // Switch pattern if time elapsed
    if (this.patternTimer >= this.patternDuration) {
      this.patternTimer = 0;
      this.patternIndex = (this.patternIndex + 1) % 3; // Cycle through 3 patterns
    }

    // Apply movement
    this.x += this.vx * this.stats.speed * deltaTime * 60;
    this.y += this.vy * this.stats.speed * deltaTime * 60;

    // Clamp to screen bounds
    const screenWidth = 800;
    const screenHeight = 600;
    this.x = Math.max(0, Math.min(this.x, screenWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, screenHeight - this.height));
  }

  /**
   * Render boss
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (this.image && this.image.complete) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      // Fallback to colored rectangle
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);

      // Draw outline
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y, this.width, this.height);

      // Draw name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(this.name, this.x + this.width / 2, this.y - 10);
    }
  }

  /**
   * Get boss bounds for collision
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
   * Take damage
   */
  takeDamage(amount: number): void {
    this.stats.health = Math.max(0, this.stats.health - amount);
    if (this.stats.health <= 0) {
      this.active = false;
    }
  }

  /**
   * Get attack pattern
   */
  getAttackPattern(): number {
    return this.patternIndex;
  }

  /**
   * Check if can attack
   */
  canAttack(currentTime: number): boolean {
    return currentTime - this.lastAttackTime >= this.attackCooldown;
  }

  /**
   * Register attack
   */
  registerAttack(currentTime: number): void {
    this.lastAttackTime = currentTime;
  }

  /**
   * Generate attack projectiles (override in subclasses)
   */
  generateAttack(currentTime: number): Projectile[] {
    return [];
  }

  /**
   * Set movement direction
   */
  setVelocity(vx: number, vy: number): void {
    this.vx = vx;
    this.vy = vy;
  }

  /**
   * Get boss stats
   */
  getStats(): BossStats {
    return { ...this.stats };
  }

  /**
   * Get boss name
   */
  getName(): string {
    return this.name;
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

  /**
   * Get health percentage
   */
  getHealthPercentage(): number {
    return (this.stats.health / this.stats.maxHealth) * 100;
  }
}
