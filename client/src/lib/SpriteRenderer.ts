/**
 * Canvas-drawn sprite renderer
 * Draws each entity using canvas primitives when PNG assets are unavailable
 */

export class SpriteRenderer {
  static drawFireboy(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    // Body
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(x + w * 0.2, y + h * 0.35, w * 0.6, h * 0.55);
    // Head
    ctx.fillStyle = '#FFAA77';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.28, w * 0.22, 0, Math.PI * 2);
    ctx.fill();
    // Flame hair
    ctx.fillStyle = '#FF4500';
    for (let i = 0; i < 5; i++) {
      const fx = x + w * 0.3 + i * w * 0.1;
      const fy = y + h * 0.08;
      ctx.beginPath();
      ctx.moveTo(fx, fy + h * 0.15);
      ctx.lineTo(fx + w * 0.05, fy);
      ctx.lineTo(fx + w * 0.1, fy + h * 0.15);
      ctx.fill();
    }
    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + w * 0.35, y + h * 0.22, w * 0.08, h * 0.08);
    ctx.fillRect(x + w * 0.55, y + h * 0.22, w * 0.08, h * 0.08);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + w * 0.37, y + h * 0.24, w * 0.04, h * 0.04);
    ctx.fillRect(x + w * 0.57, y + h * 0.24, w * 0.04, h * 0.04);
    // Legs
    ctx.fillStyle = '#CC4444';
    ctx.fillRect(x + w * 0.25, y + h * 0.85, w * 0.2, h * 0.15);
    ctx.fillRect(x + w * 0.55, y + h * 0.85, w * 0.2, h * 0.15);
  }

  static drawCaroline(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    // Energy aura
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Body
    ctx.fillStyle = '#FF69B4';
    ctx.fillRect(x + w * 0.2, y + h * 0.3, w * 0.6, h * 0.5);
    // Head
    ctx.fillStyle = '#FFCCDD';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.25, w * 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Hair
    ctx.fillStyle = '#CC3388';
    ctx.fillRect(x + w * 0.25, y + h * 0.1, w * 0.5, h * 0.12);
    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + w * 0.36, y + h * 0.2, w * 0.08, h * 0.06);
    ctx.fillRect(x + w * 0.54, y + h * 0.2, w * 0.08, h * 0.06);
    // Legs
    ctx.fillStyle = '#DD4499';
    ctx.fillRect(x + w * 0.25, y + h * 0.8, w * 0.2, h * 0.2);
    ctx.fillRect(x + w * 0.55, y + h * 0.8, w * 0.2, h * 0.2);
  }

  static drawButch(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    // Stocky body
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.5);
    // Head
    ctx.fillStyle = '#FFAA77';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.25, w * 0.24, 0, Math.PI * 2);
    ctx.fill();
    // Spiky hair
    ctx.fillStyle = '#222';
    ctx.fillRect(x + w * 0.25, y + h * 0.05, w * 0.5, h * 0.12);
    // Angry eyes
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x + w * 0.32, y + h * 0.2, w * 0.12, h * 0.08);
    ctx.fillRect(x + w * 0.56, y + h * 0.2, w * 0.12, h * 0.08);
    ctx.fillStyle = '#F00';
    ctx.fillRect(x + w * 0.36, y + h * 0.22, w * 0.06, h * 0.04);
    ctx.fillRect(x + w * 0.60, y + h * 0.22, w * 0.06, h * 0.04);
    // Big fists
    ctx.fillStyle = '#FFAA77';
    ctx.fillRect(x, y + h * 0.5, w * 0.18, h * 0.2);
    ctx.fillRect(x + w * 0.82, y + h * 0.5, w * 0.18, h * 0.2);
    // Legs
    ctx.fillStyle = '#AA0000';
    ctx.fillRect(x + w * 0.2, y + h * 0.8, w * 0.25, h * 0.2);
    ctx.fillRect(x + w * 0.55, y + h * 0.8, w * 0.25, h * 0.2);
  }

  static drawAnabel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    // Slender body
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(x + w * 0.25, y + h * 0.3, w * 0.5, h * 0.5);
    // Head
    ctx.fillStyle = '#DDCCFF';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.25, w * 0.18, 0, Math.PI * 2);
    ctx.fill();
    // Hair
    ctx.fillStyle = '#2244AA';
    ctx.fillRect(x + w * 0.28, y + h * 0.1, w * 0.44, h * 0.1);
    // Targeting reticle
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x + w * 0.75, y + h * 0.25, w * 0.1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + w * 0.75 - w * 0.14, y + h * 0.25);
    ctx.lineTo(x + w * 0.75 + w * 0.14, y + h * 0.25);
    ctx.moveTo(x + w * 0.75, y + h * 0.25 - h * 0.1);
    ctx.lineTo(x + w * 0.75, y + h * 0.25 + h * 0.1);
    ctx.stroke();
    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + w * 0.37, y + h * 0.22, w * 0.06, h * 0.05);
    ctx.fillRect(x + w * 0.52, y + h * 0.22, w * 0.06, h * 0.05);
    // Legs
    ctx.fillStyle = '#3355BB';
    ctx.fillRect(x + w * 0.28, y + h * 0.8, w * 0.18, h * 0.2);
    ctx.fillRect(x + w * 0.54, y + h * 0.8, w * 0.18, h * 0.2);
  }

  static drawDoubleMechaRocket(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    // Left rocket
    ctx.fillStyle = '#555';
    ctx.fillRect(x + w * 0.05, y + h * 0.15, w * 0.35, h * 0.7);
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.05, y + h * 0.15);
    ctx.lineTo(x + w * 0.225, y);
    ctx.lineTo(x + w * 0.4, y + h * 0.15);
    ctx.fill();
    // Right rocket
    ctx.fillStyle = '#555';
    ctx.fillRect(x + w * 0.6, y + h * 0.15, w * 0.35, h * 0.7);
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.6, y + h * 0.15);
    ctx.lineTo(x + w * 0.775, y);
    ctx.lineTo(x + w * 0.95, y + h * 0.15);
    ctx.fill();
    // Glowing core
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Exhaust flames
    ctx.fillStyle = '#FF6B00';
    ctx.fillRect(x + w * 0.1, y + h * 0.85, w * 0.25, h * 0.15);
    ctx.fillRect(x + w * 0.65, y + h * 0.85, w * 0.25, h * 0.15);
  }

  static drawButchBoss(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    // Large stocky body
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.55);
    // Head
    ctx.fillStyle = '#CC6644';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.22, w * 0.25, 0, Math.PI * 2);
    ctx.fill();
    // Glowing eyes
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(x + w * 0.38, y + h * 0.2, w * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w * 0.62, y + h * 0.2, w * 0.06, 0, Math.PI * 2);
    ctx.fill();
    // Fists
    ctx.fillStyle = '#CC6644';
    ctx.fillRect(x, y + h * 0.45, w * 0.15, h * 0.25);
    ctx.fillRect(x + w * 0.85, y + h * 0.45, w * 0.15, h * 0.25);
    // Legs
    ctx.fillStyle = '#660000';
    ctx.fillRect(x + w * 0.15, y + h * 0.85, w * 0.3, h * 0.15);
    ctx.fillRect(x + w * 0.55, y + h * 0.85, w * 0.3, h * 0.15);
  }

  static drawMandler(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const t = Date.now() / 1000;
    // Rotating geometric body
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.5);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      const px = Math.cos(angle) * w * 0.35;
      const py = Math.sin(angle) * h * 0.35;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    // Orbiting orbs
    for (let i = 0; i < 3; i++) {
      const angle = t * 2 + (Math.PI * 2 * i) / 3;
      const ox = cx + Math.cos(angle) * w * 0.45;
      const oy = cy + Math.sin(angle) * h * 0.45;
      ctx.fillStyle = '#FFFF00';
      ctx.beginPath();
      ctx.arc(ox, oy, w * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  static drawCrusherBot(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    // Main body
    ctx.fillStyle = '#696969';
    ctx.fillRect(x + w * 0.15, y + h * 0.2, w * 0.7, h * 0.6);
    // Head
    ctx.fillStyle = '#888';
    ctx.fillRect(x + w * 0.25, y + h * 0.05, w * 0.5, h * 0.2);
    // Eyes (LED)
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x + w * 0.32, y + h * 0.1, w * 0.1, h * 0.06);
    ctx.fillRect(x + w * 0.58, y + h * 0.1, w * 0.1, h * 0.06);
    // Piston arms
    ctx.fillStyle = '#555';
    ctx.fillRect(x, y + h * 0.3, w * 0.18, h * 0.12);
    ctx.fillRect(x + w * 0.82, y + h * 0.3, w * 0.18, h * 0.12);
    ctx.fillStyle = '#777';
    ctx.fillRect(x, y + h * 0.42, w * 0.22, h * 0.2);
    ctx.fillRect(x + w * 0.78, y + h * 0.42, w * 0.22, h * 0.2);
    // Treads
    ctx.fillStyle = '#444';
    ctx.fillRect(x + w * 0.1, y + h * 0.82, w * 0.8, h * 0.18);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const lx = x + w * 0.15 + i * w * 0.12;
      ctx.beginPath();
      ctx.moveTo(lx, y + h * 0.82);
      ctx.lineTo(lx, y + h);
      ctx.stroke();
    }
  }

  static drawMetalSonic(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    // Silver body
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 0.55, w * 0.3, h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head/quills silhouette
    ctx.fillStyle = '#A0A0A0';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.25, w * 0.25, 0, Math.PI * 2);
    ctx.fill();
    // Quills
    ctx.fillStyle = '#888';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + w * 0.65, y + h * (0.15 + i * 0.1));
      ctx.lineTo(x + w, y + h * (0.1 + i * 0.12));
      ctx.lineTo(x + w * 0.7, y + h * (0.22 + i * 0.1));
      ctx.fill();
    }
    // Red eyes
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(x + w * 0.38, y + h * 0.22, w * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w * 0.55, y + h * 0.22, w * 0.06, 0, Math.PI * 2);
    ctx.fill();
    // Jet engine
    ctx.fillStyle = '#666';
    ctx.fillRect(x + w * 0.35, y + h * 0.85, w * 0.3, h * 0.12);
  }

  static drawRoaringKnight(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    // Armor body
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(x + w * 0.2, y + h * 0.25, w * 0.6, h * 0.55);
    // Helmet
    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.2, w * 0.22, 0, Math.PI * 2);
    ctx.fill();
    // Visor
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x + w * 0.3, y + h * 0.17, w * 0.35, h * 0.06);
    // Glowing sword
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.85, y + h * 0.2);
    ctx.lineTo(x + w * 0.95, y);
    ctx.stroke();
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.85, y + h * 0.2);
    ctx.lineTo(x + w * 0.95, y);
    ctx.stroke();
    ctx.restore();
    // Shield
    ctx.fillStyle = '#555';
    ctx.fillRect(x, y + h * 0.3, w * 0.2, h * 0.35);
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + h * 0.32, w * 0.16, h * 0.31);
    // Legs
    ctx.fillStyle = '#333';
    ctx.fillRect(x + w * 0.25, y + h * 0.8, w * 0.2, h * 0.2);
    ctx.fillRect(x + w * 0.55, y + h * 0.8, w * 0.2, h * 0.2);
  }

  static drawRoaringMetal(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    const t = Date.now() / 500;
    // Dual aura
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w * 0.48 + Math.sin(t) * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Knight armor body
    ctx.fillStyle = '#444';
    ctx.fillRect(x + w * 0.15, y + h * 0.25, w * 0.7, h * 0.55);
    // Metal sonic overlay
    ctx.fillStyle = '#A0A0A0';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.22, w * 0.24, 0, Math.PI * 2);
    ctx.fill();
    // Quills
    ctx.fillStyle = '#666';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + w * 0.65, y + h * (0.1 + i * 0.08));
      ctx.lineTo(x + w, y + h * (0.05 + i * 0.1));
      ctx.lineTo(x + w * 0.7, y + h * (0.16 + i * 0.08));
      ctx.fill();
    }
    // Dual-color eyes
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(x + w * 0.38, y + h * 0.2, w * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.arc(x + w * 0.58, y + h * 0.2, w * 0.06, 0, Math.PI * 2);
    ctx.fill();
    // Glowing sword
    ctx.strokeStyle = '#FF1493';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.9, y + h * 0.25);
    ctx.lineTo(x + w, y);
    ctx.stroke();
    // Legs
    ctx.fillStyle = '#333';
    ctx.fillRect(x + w * 0.2, y + h * 0.8, w * 0.25, h * 0.2);
    ctx.fillRect(x + w * 0.55, y + h * 0.8, w * 0.25, h * 0.2);
  }
}
