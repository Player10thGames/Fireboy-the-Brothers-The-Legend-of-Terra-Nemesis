/**
 * Character Definitions
 */

import { PlayerStats } from './Player';

export interface CharacterDefinition {
  id: string;
  name: string;
  description: string;
  stats: PlayerStats;
  color: string;
  imageUrl?: string;
}

export const CHARACTERS: { [key: string]: CharacterDefinition } = {
  fireboy: {
    id: 'fireboy',
    name: 'Fireboy',
    description: 'Balanced character with rapid fire ability',
    stats: {
      health: 100,
      maxHealth: 100,
      speed: 5,
      fireRate: 150,
      damage: 15,
    },
    color: '#FF6B6B',
  },
  caroline: {
    id: 'caroline',
    name: 'Caroline',
    description: 'Energy blaster with wide spread attack',
    stats: {
      health: 90,
      maxHealth: 90,
      speed: 6,
      fireRate: 200,
      damage: 12,
    },
    color: '#FF69B4',
  },
  butch: {
    id: 'butch',
    name: 'Butch',
    description: 'Heavy hitter with powerful melee attacks',
    stats: {
      health: 120,
      maxHealth: 120,
      speed: 4,
      fireRate: 300,
      damage: 25,
    },
    color: '#DC143C',
  },
  anabel: {
    id: 'anabel',
    name: 'Anabel',
    description: 'Precision shooter with homing projectiles',
    stats: {
      health: 85,
      maxHealth: 85,
      speed: 7,
      fireRate: 100,
      damage: 10,
    },
    color: '#4169E1',
  },
};

export function getCharacter(id: string): CharacterDefinition | undefined {
  return CHARACTERS[id.toLowerCase()];
}

export function getAllCharacters(): CharacterDefinition[] {
  return Object.values(CHARACTERS);
}
