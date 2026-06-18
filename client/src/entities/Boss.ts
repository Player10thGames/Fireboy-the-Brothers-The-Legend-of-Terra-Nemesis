/**
 * Boss Base Entity
 */

import { AssetLoader } from '@/lib/assetLoader';
import { Projectile } from './Projectile';
import { BaseEntity } from './BaseEntity';

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
  stage: number;
}

export class Boss extends BaseEntity {
  protected stats: BossStats;
  protected name: string;
  protected imageUrl: string;
  protected patternIndex = 0;
  protected patternTimer = 0;
  protected patternDuration = 2000;
  protected lastAttackTime = 0;
  protected attackCooldown = 500;

  constructor(config: BossConfig) {
    super(config.x, config.y, config.width, config.height, '#FF0000');
    this.stats = { ...config.stats };
    this.name = config.name;
    this.imageUrl = AssetLoader.getImage(`boss${config.stage}`);
    AssetLoader.preloadImage(`boss${config.stage}`).then(img => {
      this.image = img;
    }).catch(error => console.error("Failed to load boss image:", error));
  }

  update(deltaTime: number): void {
    this.patternTimer += deltaTime * 1000;

    if (this.patternTimer >= this.patternDuration) {
      this.patternTimer = 0;
      this.patternIndex = (this.patternIndex + 1) % 3;
    }

    this.applyVelocity(this.stats.speed, deltaTime);
    this.clampToScreen();
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.renderSprite(ctx, this.name);
  }

  takeDamage(amount: number): void {
    this.stats.health = Math.max(0, this.stats.health - amount);
    if (this.stats.health <= 0) {
      this.active = false;
    }
  }

  getAttackPattern(): number {
    return this.patternIndex;
  }

  canAttack(currentTime: number): boolean {
    return currentTime - this.lastAttackTime >= this.attackCooldown;
  }

  registerAttack(currentTime: number): void {
    this.lastAttackTime = currentTime;
  }

  generateAttack(_currentTime: number): Projectile[] {
    return [];
  }

  getStats(): BossStats {
    return { ...this.stats };
  }

  getName(): string {
    return this.name;
  }

  getHealthPercentage(): number {
    return (this.stats.health / this.stats.maxHealth) * 100;
  }
}
