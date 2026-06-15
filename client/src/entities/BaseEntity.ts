import { GameObject } from '@/engine/GameEngine';
import { Rect } from '@/engine/Collision';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/engine/constants';

export abstract class BaseEntity implements GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  vx = 0;
  vy = 0;
  active = true;

  protected color: string;
  protected image: HTMLImageElement | null = null;

  constructor(x: number, y: number, width: number, height: number, color: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  abstract update(deltaTime: number): void;
  abstract render(ctx: CanvasRenderingContext2D): void;

  getBounds(): Rect {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  getCenter(): { x: number; y: number } {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
  }

  setVelocity(vx: number, vy: number): void {
    this.vx = vx;
    this.vy = vy;
  }

  protected clampToScreen(): void {
    this.x = Math.max(0, Math.min(this.x, SCREEN_WIDTH - this.width));
    this.y = Math.max(0, Math.min(this.y, SCREEN_HEIGHT - this.height));
  }

  protected applyVelocity(speed: number, deltaTime: number): void {
    this.x += this.vx * speed * deltaTime * 60;
    this.y += this.vy * speed * deltaTime * 60;
  }

  protected renderSprite(ctx: CanvasRenderingContext2D, label?: string): void {
    if (this.image) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      if (label) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, this.x + this.width / 2, this.y - 10);
      }
    }
  }
}
