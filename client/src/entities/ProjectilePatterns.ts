import { Projectile } from './Projectile';

interface PatternOrigin {
  x: number;
  y: number;
  damage: number;
}

/**
 * Creates a horizontal row of projectiles evenly spaced vertically.
 */
export function createLinearRow(
  origin: PatternOrigin,
  count: number,
  spacing: number,
  speed: number,
): Projectile[] {
  const attacks: Projectile[] = [];
  const halfSpan = ((count - 1) * spacing) / 2;
  for (let i = 0; i < count; i++) {
    attacks.push(
      new Projectile({
        x: origin.x - 4,
        y: origin.y + i * spacing - halfSpan,
        vx: speed,
        vy: 0,
        damage: origin.damage,
        owner: 'boss',
      }),
    );
  }
  return attacks;
}

/**
 * Creates projectiles evenly distributed in a full circle (radial burst).
 */
export function createRadialBurst(
  origin: PatternOrigin,
  count: number,
  speed: number,
  angleOffset = 0,
): Projectile[] {
  const attacks: Projectile[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + angleOffset;
    attacks.push(
      new Projectile({
        x: origin.x - 4,
        y: origin.y - 4,
        vx: speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        damage: origin.damage,
        owner: 'boss',
      }),
    );
  }
  return attacks;
}

/**
 * Creates a fan-shaped spread of projectiles over a given angular range.
 */
export function createFanSpread(
  origin: PatternOrigin,
  count: number,
  speed: number,
  totalAngle: number,
  centerAngle = Math.PI,
): Projectile[] {
  const attacks: Projectile[] = [];
  for (let i = 0; i < count; i++) {
    const angle = centerAngle + totalAngle * ((i / (count - 1)) - 0.5);
    attacks.push(
      new Projectile({
        x: origin.x - 4,
        y: origin.y - 4,
        vx: speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        damage: origin.damage,
        owner: 'boss',
      }),
    );
  }
  return attacks;
}
