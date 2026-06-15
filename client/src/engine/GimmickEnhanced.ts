
/**
 * Enhanced Gimmick System
 * Provides advanced stage mechanics and environmental challenges
 */

export interface Gimmick {
  update(deltaTime: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}

// Stage 1: Moving Platforms Gimmick
export class MovingPlatformsGimmick implements Gimmick {
  private platforms: Array<{ x: number; y: number; width: number; height: number; vx: number }> = [];
  private time = 0;

  constructor() {
    // Initialize platforms
    for (let i = 0; i < 3; i++) {
      this.platforms.push({
        x: 100 + i * 250,
        y: 400 + Math.sin(i) * 50,
        width: 80,
        height: 20,
        vx: 1 + i * 0.5,
      });
    }
  }

  update(deltaTime: number): void {
    this.time += deltaTime;
    for (const platform of this.platforms) {
      platform.x += platform.vx;
      if (platform.x > 800) platform.x = -100;
      if (platform.x < -100) platform.x = 800;
      platform.y = 400 + Math.sin(this.time * 2 + platform.x / 100) * 30;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
    for (const platform of this.platforms) {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      ctx.strokeStyle = '#64C8FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    }
  }
}

// Stage 2: Destructible Obstacles Gimmick
export class DestructibleObstaclesGimmick implements Gimmick {
  private obstacles: Array<{ x: number; y: number; width: number; height: number; health: number; maxHealth: number }> = [];

  constructor() {
    for (let i = 0; i < 4; i++) {
      this.obstacles.push({
        x: 150 + i * 150,
        y: 300,
        width: 60,
        height: 60,
        health: 3,
        maxHealth: 3,
      });
    }
  }

  update(deltaTime: number): void {
    this.obstacles = this.obstacles.filter(obs => obs.health > 0);
  }

  damageObstacle(x: number, y: number): void {
    for (const obs of this.obstacles) {
      if (x > obs.x && x < obs.x + obs.width && y > obs.y && y < obs.y + obs.height) {
        obs.health--;
        break;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const obs of this.obstacles) {
      const healthPercent = obs.health / obs.maxHealth;
      ctx.fillStyle = `rgba(${255 - healthPercent * 100}, ${100 + healthPercent * 155}, 100, 0.5)`;
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.strokeStyle = '#FF6464';
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
    }
  }
}

// Stage 3: Gravity Shift Gimmick
export class GravityShiftGimmick implements Gimmick {
  private gravityDirection = 1; // 1 for down, -1 for up
  private shiftTimer = 0;
  private shiftInterval = 5000; // 5 seconds

  update(deltaTime: number): void {
    this.shiftTimer += deltaTime * 1000;
    if (this.shiftTimer >= this.shiftInterval) {
      this.gravityDirection *= -1;
      this.shiftTimer = 0;
    }
  }

  getGravityDirection(): number {
    return this.gravityDirection;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 200, 100, 0.1)';
    ctx.fillRect(0, 0, 800, 600);
    ctx.restore();

    // Draw gravity indicator
    const indicatorY = this.gravityDirection === 1 ? 20 : 580;
    ctx.fillStyle = this.gravityDirection === 1 ? '#FFD700' : '#FF6B9D';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`GRAVITY: ${this.gravityDirection === 1 ? 'DOWN' : 'UP'}`, 10, indicatorY);
  }
}

// Stage 4: Shockwave Gimmick
export class ShockwaveGimmick implements Gimmick {
  private shockwaves: Array<{ x: number; radius: number; maxRadius: number; damage: number }> = [];
  private spawnRate = 0.02;

  triggerShockwave(x: number): void {
    this.shockwaves.push({
      x,
      radius: 10,
      maxRadius: 150,
      damage: 15,
    });
  }

  update(deltaTime: number): void {
    for (const shockwave of this.shockwaves) {
      shockwave.radius += 200 * deltaTime;
    }
    this.shockwaves = this.shockwaves.filter(sw => sw.radius < sw.maxRadius);
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const shockwave of this.shockwaves) {
      const opacity = 1 - (shockwave.radius / shockwave.maxRadius);
      ctx.strokeStyle = `rgba(255, 100, 100, ${opacity})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(shockwave.x, 300, shockwave.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// Stage 5: Ring Collection Gimmick
export class RingCollectionGimmick implements Gimmick {
  private rings: Array<{ x: number; y: number; collected: boolean; angle: number }> = [];
  private ringCount = 0;
  private maxRings = 10;

  constructor() {
    this.spawnRings();
  }

  private spawnRings(): void {
    for (let i = 0; i < this.maxRings; i++) {
      this.rings.push({
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        collected: false,
        angle: Math.random() * Math.PI * 2,
      });
    }
  }

  checkCollision(playerX: number, playerY: number, playerWidth: number, playerHeight: number): void {
    for (const ring of this.rings) {
      if (!ring.collected) {
        if (playerX < ring.x + 20 && playerX + playerWidth > ring.x &&
            playerY < ring.y + 20 && playerY + playerHeight > ring.y) {
          ring.collected = true;
          this.ringCount++;
        }
      }
    }
  }

  update(deltaTime: number): void {
    for (const ring of this.rings) {
      ring.angle += deltaTime * 3;
    }
  }

  getRingCount(): number {
    return this.ringCount;
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const ring of this.rings) {
      if (!ring.collected) {
        ctx.save();
        ctx.translate(ring.x, ring.y);
        ctx.rotate(ring.angle);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Draw ring counter
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`RINGS: ${this.ringCount}`, 10, 30);
  }
}

// Stage 6 & 7: Phase Transition Gimmick
export class PhaseTransitionGimmick implements Gimmick {
  private currentPhase = 1;
  private phaseThresholds = [100, 75, 50, 25, 0];

  update(deltaTime: number): void {
    // Phase updates are handled by updatePhase method
  }

  updatePhase(healthPercent: number): void {
    if (healthPercent < 75 && this.currentPhase === 1) {
      this.currentPhase = 2;
    } else if (healthPercent < 50 && this.currentPhase === 2) {
      this.currentPhase = 3;
    } else if (healthPercent < 25 && this.currentPhase === 3) {
      this.currentPhase = 4;
    }
  }

  getCurrentPhase(): number {
    return this.currentPhase;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const phaseColors = ['#FF0000', '#FF6B00', '#FFD700', '#00FF00'];
    ctx.fillStyle = phaseColors[this.currentPhase - 1];
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`PHASE ${this.currentPhase}`, 10, 30);

    // Draw phase indicator bar
    ctx.strokeStyle = phaseColors[this.currentPhase - 1];
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 40, 200, 20);
    ctx.fillStyle = phaseColors[this.currentPhase - 1];
    ctx.fillRect(10, 40, (this.currentPhase / 4) * 200, 20);
  }
}
