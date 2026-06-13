/**
 * Boss Definitions
 */

import { BossStats } from './Boss';

export interface BossDefinition {
  id: string;
  stage: number;
  name: string;
  description: string;
  stats: BossStats;
  color: string;
  gimmick: string;
  imageUrl?: string;
}

export const BOSSES: BossDefinition[] = [
  {
    id: 'double_mecha_rocket',
    stage: 1,
    name: 'Double Mecha Rocket',
    description: 'Big Core MK.I from Gradius with Fire Breath from Sonic 3',
    stats: {
      health: 200,
      maxHealth: 200,
      damage: 10,
      speed: 2,
    },
    color: '#FF4500',
    gimmick: 'Moving platforms appear/disappear every 3 seconds',
  },
  {
    id: 'butch_boss',
    stage: 2,
    name: 'Butch',
    description: 'Rowdyruff Boys member with charging attacks',
    stats: {
      health: 250,
      maxHealth: 250,
      damage: 15,
      speed: 3,
    },
    color: '#DC143C',
    gimmick: 'Destructible obstacles block shots; must break through',
  },
  {
    id: 'mandler',
    stage: 3,
    name: 'Mandler',
    description: 'Terra Cresta boss with rotating projectiles',
    stats: {
      health: 280,
      maxHealth: 280,
      damage: 12,
      speed: 2.5,
    },
    color: '#FFD700',
    gimmick: 'Gravity shifts every 5 seconds (affects player movement)',
  },
  {
    id: 'crusher_bot_mk2',
    stage: 4,
    name: 'Crusher-Bot MK.II',
    description: 'Heavy robot with stomp attacks and missile barrage',
    stats: {
      health: 300,
      maxHealth: 300,
      damage: 18,
      speed: 2,
    },
    color: '#696969',
    gimmick: 'Shockwaves push player back; must maintain position',
  },
  {
    id: 'metal_sonic',
    stage: 5,
    name: 'Metal Sonic',
    description: 'Sonic series speedster with homing projectiles',
    stats: {
      health: 280,
      maxHealth: 280,
      damage: 14,
      speed: 4,
    },
    color: '#C0C0C0',
    gimmick: 'Rings appear on screen; collecting them grants temporary shield',
  },
  {
    id: 'roaring_knight',
    stage: 6,
    name: 'The Roaring Knight',
    description: 'Deltarune boss with sword slashes and energy waves',
    stats: {
      health: 350,
      maxHealth: 350,
      damage: 20,
      speed: 2.5,
    },
    color: '#8B0000',
    gimmick: 'Boss phases change at 75%, 50%, and 25% health',
  },
  {
    id: 'roaring_metal',
    stage: 7,
    name: 'Roaring Metal',
    description: 'True Final Boss combining Roaring Knight and Metal Sonic',
    stats: {
      health: 500,
      maxHealth: 500,
      damage: 25,
      speed: 3.5,
    },
    color: '#FF1493',
    gimmick: 'Boss combines abilities from all previous bosses',
  },
];

export function getBoss(stage: number): BossDefinition | undefined {
  return BOSSES.find(boss => boss.stage === stage);
}

export function getAllBosses(): BossDefinition[] {
  return BOSSES;
}
