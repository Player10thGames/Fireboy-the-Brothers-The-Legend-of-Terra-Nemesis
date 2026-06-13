/**
 * Gimmick System for stage-specific mechanics
 */

export interface Gimmick {
  name: string;
  update(deltaTime: number): void;
  apply(playerY: number, playerVy: number): { y: number; vy: number };
  render(ctx: CanvasRenderingContext2D): void;
}

/**
 * Stage 1 Gimmick: Moving Platforms
 */
export class MovingPlatformsGimmick implements Gimmick {
  name = "Moving Platforms";
  private platforms: Array<{ x: number; y: number; width: number; height: number; vx: number }> = [];
  private platformTimer = 0;

  constructor() {
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
      platform.x += platform.vx;
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
  private gravityTimer = 0;
  private currentGravity = 1; // 1 = normal, -1 = reversed

  update(deltaTime: number): void {
    this.gravityTimer += deltaTime * 1000;
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
  private shockwaves: Array<{ x: number; radius: number; maxRadius: number }> = [];

  update(deltaTime: number): void {
    this.shockwaves = this.shockwaves.filter(sw => sw.radius < sw.maxRadius);
    this.shockwaves.forEach(sw => {
      sw.radius += 5;
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
  private rings: Array<{ x: number; y: number; collected: boolean }> = [];
  private ringTimer = 0;
  public collectedRings = 0;

  constructor() {
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
    this.ringTimer += deltaTime * 1000;
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
