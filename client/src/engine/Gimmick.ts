/**
 * Gimmick System for stage-specific mechanics
 */

import { particles } from './Particles';
import { Rect } from './Collision';

export interface Gimmick {
  name: string;
  speedMultiplier: number;
  update(deltaTime: number): void;
  apply(playerY: number, playerVy: number): { y: number; vy: number };
  render(ctx: CanvasRenderingContext2D): void;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  respawnTimer: number;
  active: boolean;
}

/**
 * Stage 2 Gimmick: Destructible Obstacles
 */
export class DestructibleObstaclesGimmick implements Gimmick {
  name = "Destructible Obstacles";
  speedMultiplier = 1;
  obstacles: Obstacle[] = [];
  private respawnDelay = 8000;

  constructor(difficulty?: string) {
    if (difficulty === 'easy') this.speedMultiplier = 0.5;
    else if (difficulty === 'hard' || difficulty === 'extreme') this.speedMultiplier = 1.3;
    this.obstacles = [
      { x: 300, y: 200, width: 40, height: 40, hp: 2, maxHp: 2, respawnTimer: 0, active: true },
      { x: 350, y: 350, width: 40, height: 40, hp: 2, maxHp: 2, respawnTimer: 0, active: true },
      { x: 400, y: 450, width: 40, height: 40, hp: 2, maxHp: 2, respawnTimer: 0, active: true },
    ];
  }

  update(deltaTime: number): void {
    const ms = deltaTime * 1000 * this.speedMultiplier;
    for (const obs of this.obstacles) {
      if (!obs.active) {
        obs.respawnTimer += ms;
        if (obs.respawnTimer >= this.respawnDelay) {
          obs.active = true;
          obs.hp = obs.maxHp;
          obs.respawnTimer = 0;
        }
      }
    }
  }

  apply(playerY: number, playerVy: number): { y: number; vy: number } {
    return { y: playerY, vy: playerVy };
  }

  hitObstacle(obstacleIndex: number): boolean {
    const obs = this.obstacles[obstacleIndex];
    if (!obs || !obs.active) return false;
    obs.hp--;
    if (obs.hp <= 0) {
      obs.active = false;
      obs.respawnTimer = 0;
      particles.emit(obs.x + obs.width / 2, obs.y + obs.height / 2, 'explosion');
    }
    return true;
  }

  getObstacleBounds(index: number): Rect | null {
    const obs = this.obstacles[index];
    if (!obs || !obs.active) return null;
    return { x: obs.x, y: obs.y, width: obs.width, height: obs.height };
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const obs of this.obstacles) {
      if (!obs.active) continue;
      ctx.fillStyle = '#555';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      // Health indicator
      const hpPct = obs.hp / obs.maxHp;
      ctx.fillStyle = hpPct > 0.5 ? '#44FF44' : '#FF4444';
      ctx.fillRect(obs.x, obs.y - 6, obs.width * hpPct, 4);
    }
  }
}

/**
 * Stage 1 Gimmick: Moving Platforms
 */
export class MovingPlatformsGimmick implements Gimmick {
  name = "Moving Platforms";
  speedMultiplier = 1;
  private platforms: Array<{ x: number; y: number; width: number; height: number; vx: number }> = [];
  private platformTimer = 0;

  constructor(difficulty?: string) {
    if (difficulty === 'easy') this.speedMultiplier = 0.5;
    else if (difficulty === 'hard' || difficulty === 'extreme') this.speedMultiplier = 1.3;
    this.platforms = [
      { x: 100, y: 300, width: 100, height: 20, vx: 2 },
      { x: 600, y: 400, width: 100, height: 20, vx: -2 },
    ];
  }

  update(deltaTime: number): void {
    this.platformTimer += deltaTime * 1000;
    if (this.platformTimer > 3000) {
      this.platformTimer = 0;
    }

    this.platforms.forEach(platform => {
      platform.x += platform.vx * this.speedMultiplier;
      if (platform.x < 0 || platform.x > 700) {
        platform.vx *= -1;
      }
    });
  }

  apply(playerY: number, playerVy: number): { y: number; vy: number } {
    return { y: playerY, vy: playerVy };
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(100, 150, 255, 0.5)';
    this.platforms.forEach(platform => {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
  }
}

/**
 * Stage 3 Gimmick: Gravity Shifts
 */
export class GravityShiftGimmick implements Gimmick {
  name = "Gravity Shift";
  speedMultiplier = 1;
  private gravityTimer = 0;
  private currentGravity = 1; // 1 = normal, -1 = reversed

  constructor(difficulty?: string) {
    if (difficulty === 'easy') this.speedMultiplier = 0.5;
    else if (difficulty === 'hard' || difficulty === 'extreme') this.speedMultiplier = 1.3;
  }

  update(deltaTime: number): void {
    this.gravityTimer += deltaTime * 1000 * this.speedMultiplier;
    if (this.gravityTimer > 5000) {
      this.gravityTimer = 0;
      this.currentGravity *= -1;
    }
  }

  apply(playerY: number, playerVy: number): { y: number; vy: number } {
    return {
      y: playerY,
      vy: playerVy * this.currentGravity,
    };
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.currentGravity === 1 ? 'rgba(100, 255, 100, 0.1)' : 'rgba(255, 100, 100, 0.1)';
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(this.currentGravity === 1 ? 'Normal Gravity' : 'Reversed Gravity', 10, 30);
  }
}

/**
 * Stage 4 Gimmick: Shockwave Attacks
 */
export class ShockwaveGimmick implements Gimmick {
  name = "Shockwaves";
  speedMultiplier = 1;
  private shockwaves: Array<{ x: number; radius: number; maxRadius: number }> = [];
  shockwaveInterval = 0;

  constructor(difficulty?: string) {
    if (difficulty === 'easy') this.speedMultiplier = 0.5;
    else if (difficulty === 'hard' || difficulty === 'extreme') this.speedMultiplier = 1.3;
  }

  update(deltaTime: number): void {
    this.shockwaves = this.shockwaves.filter(sw => sw.radius < sw.maxRadius);
    this.shockwaves.forEach(sw => {
      sw.radius += 5 * this.speedMultiplier;
    });
  }

  apply(playerY: number, playerVy: number): { y: number; vy: number } {
    return { y: playerY, vy: playerVy };
  }

  triggerShockwave(x: number): void {
    this.shockwaves.push({ x, radius: 0, maxRadius: 200 });
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = 'rgba(255, 200, 0, 0.7)';
    ctx.lineWidth = 3;
    this.shockwaves.forEach(sw => {
      ctx.beginPath();
      ctx.arc(sw.x, 300, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
    });
  }
}

/**
 * Stage 5 Gimmick: Ring Collection
 */
export class RingCollectionGimmick implements Gimmick {
  name = "Ring Collection";
  speedMultiplier = 1;
  private rings: Array<{ x: number; y: number; collected: boolean }> = [];
  private ringTimer = 0;
  public collectedRings = 0;

  constructor(difficulty?: string) {
    if (difficulty === 'easy') this.speedMultiplier = 0.5;
    else if (difficulty === 'hard' || difficulty === 'extreme') this.speedMultiplier = 1.3;
    this.spawnRings();
  }

  private spawnRings(): void {
    this.rings = [];
    for (let i = 0; i < 5; i++) {
      this.rings.push({
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        collected: false,
      });
    }
  }

  update(deltaTime: number): void {
    this.ringTimer += deltaTime * 1000 * this.speedMultiplier;
    if (this.ringTimer > 10000) {
      this.ringTimer = 0;
      this.spawnRings();
      this.collectedRings = 0;
    }
  }

  apply(playerY: number, playerVy: number): { y: number; vy: number } {
    return { y: playerY, vy: playerVy };
  }

  checkCollision(playerX: number, playerY: number, playerWidth: number, playerHeight: number): void {
    this.rings.forEach(ring => {
      if (
        !ring.collected &&
        playerX < ring.x + 10 &&
        playerX + playerWidth > ring.x - 10 &&
        playerY < ring.y + 10 &&
        playerY + playerHeight > ring.y - 10
      ) {
        ring.collected = true;
        this.collectedRings++;
      }
    });
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    this.rings.forEach(ring => {
      if (!ring.collected) {
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, 10, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Rings: ${this.collectedRings}`, 10, 30);
  }
}

/**
 * Stage 6 Gimmick: Phase Transitions
 */
export class PhaseTransitionGimmick implements Gimmick {
  name = "Phase Transitions";
  speedMultiplier = 1;
  private phase = 0;
  private phaseThresholds = [0.75, 0.5, 0.25]; // Boss health percentages

  update(deltaTime: number): void {
    // Updated by boss health
  }

  apply(playerY: number, playerVy: number): { y: number; vy: number } {
    return { y: playerY, vy: playerVy };
  }

  updatePhase(bossHealthPercent: number): number {
    for (let i = 0; i < this.phaseThresholds.length; i++) {
      if (bossHealthPercent <= this.phaseThresholds[i] * 100) {
        this.phase = i + 1;
      }
    }
    return this.phase;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Phase ${this.phase + 1}`, 350, 300);
  }
}
