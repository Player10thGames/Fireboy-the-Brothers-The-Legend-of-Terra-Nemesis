/**
 * Player Entity
 */

import { Collision, Rect } from '@/engine/Collision';
import { AssetLoader } from '@/lib/assetLoader';
import { BaseEntity } from './BaseEntity';

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

export class Player extends BaseEntity {
  private stats: PlayerStats;
  private character: string;
  private lastFireTime = 0;

  constructor(config: PlayerConfig) {
    super(config.x, config.y, config.width, config.height, '#FF6B6B');
    this.stats = { ...config.stats };
    this.character = config.character;

    AssetLoader.preloadImage(this.character).then(img => {
      this.image = img;
    }).catch(error => console.error("Failed to load player image:", error));
  }

  update(deltaTime: number): void {
    this.applyVelocity(this.stats.speed, deltaTime);
    this.clampToScreen();
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.renderSprite(ctx);
  }

  takeDamage(amount: number): void {
    this.stats.health = Math.max(0, this.stats.health - amount);
    if (this.stats.health <= 0) {
      this.active = false;
    }
  }

  heal(amount: number): void {
    this.stats.health = Math.min(
      this.stats.maxHealth,
      this.stats.health + amount
    );
  }

  canFire(currentTime: number): boolean {
    return currentTime - this.lastFireTime >= this.stats.fireRate;
  }

  fire(currentTime: number): void {
    this.lastFireTime = currentTime;
  }

  getStats(): PlayerStats {
    return { ...this.stats };
  }

  getCharacter(): string {
    return this.character;
  }
}
