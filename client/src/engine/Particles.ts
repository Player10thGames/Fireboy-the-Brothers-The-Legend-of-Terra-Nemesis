/**
 * Particle System
 * Handles visual particle effects for hits, explosions, fire, sparks, and rings
 */

export type ParticleType = 'hit' | 'explosion' | 'fire' | 'spark' | 'ring';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  alpha: number;
  shape: 'circle' | 'rect';
}

const PARTICLE_CONFIGS: Record<ParticleType, { count: number; colors: string[]; speed: number; life: number; sizeRange: [number, number]; shape: 'circle' | 'rect' }> = {
  hit: { count: 8, colors: ['#FFD700', '#FFA500', '#FFFFFF'], speed: 3, life: 300, sizeRange: [2, 5], shape: 'circle' },
  explosion: { count: 20, colors: ['#FF4500', '#FF6B00', '#FFD700', '#FF0000'], speed: 5, life: 600, sizeRange: [3, 8], shape: 'circle' },
  fire: { count: 12, colors: ['#FF4500', '#FF6B00', '#FFD700', '#FF8C00'], speed: 2, life: 500, sizeRange: [2, 6], shape: 'rect' },
  spark: { count: 10, colors: ['#FFFFFF', '#FFD700', '#87CEEB'], speed: 4, life: 250, sizeRange: [1, 4], shape: 'rect' },
  ring: { count: 15, colors: ['#FFD700', '#FFA500', '#FFFF00'], speed: 3, life: 400, sizeRange: [2, 5], shape: 'circle' },
};

export class ParticleSystem {
  private particles: Particle[] = [];

  emit(x: number, y: number, type: ParticleType): void {
    const cfg = PARTICLE_CONFIGS[type];
    for (let i = 0; i < cfg.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 0.5 + 0.5) * cfg.speed;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: cfg.life,
        maxLife: cfg.life,
        color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
        size: cfg.sizeRange[0] + Math.random() * (cfg.sizeRange[1] - cfg.sizeRange[0]),
        alpha: 1,
        shape: cfg.shape,
      });
    }
  }

  update(dt: number): void {
    const ms = dt * 1000;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= ms;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.restore();
    }
  }
}

export const particles = new ParticleSystem();
