/**
 * Player Entity
 */

import { GameObject } from '@/engine/GameEngine';
import { Collision, Rect } from '@/engine/Collision';

export interface PlayerStats {
  health: number;
  speed: number;
  fireRate: number;
  damage: number;
  maxHealth: number;
}

export interface PlayerConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  stats: PlayerStats;
  character: string;
}

export class Player implements GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  vx = 0;
  vy = 0;
  active = true;

  private stats: PlayerStats;
  private character: string;
  private lastFireTime = 0;
  private color = '#FF6B6B';
  private image: HTMLImageElement | null = null;

  constructor(config: PlayerConfig) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.stats = { ...config.stats };
    this.character = config.character;

    // Set color based on character
    this.setCharacterColor();
  }

  /**
   * Set color based on character
   */
  private setCharacterColor(): void {
    const colors: { [key: string]: string } = {
      fireboy: '#FF6B6B',
      caroline: '#FF69B4',
      butch: '#DC143C',
      anabel: '#4169E1',
    };
    this.color = colors[this.character] || '#FF6B6B';
  }

  /**
   * Load character sprite image
   */
  loadImage(imageUrl: string): void {
    this.image = new Image();
    this.image.src = imageUrl;
  }

  /**
   * Update player state
   */
  update(deltaTime: number): void {
    // Apply velocity
    this.x += this.vx * this.stats.speed * deltaTime * 60;
    this.y += this.vy * this.stats.speed * deltaTime * 60;

    // Clamp to screen bounds (assuming 800x600)
    const screenWidth = 800;
    const screenHeight = 600;
    this.x = Math.max(0, Math.min(this.x, screenWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, screenHeight - this.height));
  }

  /**
   * Render player
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
    }
  }

  /**
   * Get player bounds for collision
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
   * Heal player
   */
  heal(amount: number): void {
    this.stats.health = Math.min(
      this.stats.maxHealth,
      this.stats.health + amount
    );
  }

  /**
   * Check if can fire
   */
  canFire(currentTime: number): boolean {
    return currentTime - this.lastFireTime >= this.stats.fireRate;
  }

  /**
   * Fire weapon
   */
  fire(currentTime: number): void {
    this.lastFireTime = currentTime;
  }

  /**
   * Set movement direction
   */
  setVelocity(vx: number, vy: number): void {
    this.vx = vx;
    this.vy = vy;
  }

  /**
   * Get player stats
   */
  getStats(): PlayerStats {
    return { ...this.stats };
  }

  /**
   * Get character name
   */
  getCharacter(): string {
    return this.character;
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
