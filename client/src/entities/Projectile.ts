/**
 * Projectile Entity
 */

import { GameObject } from '@/engine/GameEngine';
import { Rect } from '@/engine/Collision';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/engine/constants';

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

const OFFSCREEN_MARGIN = 50;

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
  private lifetime = 5000;
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

  update(deltaTime: number): void {
    this.x += this.vx * deltaTime * 60;
    this.y += this.vy * deltaTime * 60;

    if (Date.now() - this.createdAt > this.lifetime) {
      this.active = false;
    }

    if (
      this.x < -OFFSCREEN_MARGIN ||
      this.x > SCREEN_WIDTH + OFFSCREEN_MARGIN ||
      this.y < -OFFSCREEN_MARGIN ||
      this.y > SCREEN_HEIGHT + OFFSCREEN_MARGIN
    ) {
      this.active = false;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
    ctx.globalAlpha = 1;
  }

  getBounds(): Rect {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  getCenter(): { x: number; y: number } {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
  }

  getDamage(): number {
    return this.damage;
  }

  getOwner(): 'player' | 'boss' {
    return this.owner;
  }
}
