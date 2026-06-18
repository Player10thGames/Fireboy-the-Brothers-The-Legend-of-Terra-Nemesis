import { describe, it, expect } from 'vitest';
import { CHARACTERS, getCharacter, getAllCharacters } from './characters';

describe('characters', () => {
  describe('CHARACTERS constant', () => {
    it('has exactly 4 characters', () => {
      expect(Object.keys(CHARACTERS)).toHaveLength(4);
    });

    it('contains fireboy, caroline, butch, anabel', () => {
      expect(CHARACTERS).toHaveProperty('fireboy');
      expect(CHARACTERS).toHaveProperty('caroline');
      expect(CHARACTERS).toHaveProperty('butch');
      expect(CHARACTERS).toHaveProperty('anabel');
    });

    it('each character has required fields', () => {
      for (const char of Object.values(CHARACTERS)) {
        expect(char).toHaveProperty('id');
        expect(char).toHaveProperty('name');
        expect(char).toHaveProperty('description');
        expect(char).toHaveProperty('stats');
        expect(char).toHaveProperty('color');
        expect(char.stats).toHaveProperty('health');
        expect(char.stats).toHaveProperty('maxHealth');
        expect(char.stats).toHaveProperty('speed');
        expect(char.stats).toHaveProperty('fireRate');
        expect(char.stats).toHaveProperty('damage');
      }
    });

    it('fireboy has correct stats', () => {
      const fb = CHARACTERS['fireboy'];
      expect(fb.stats.health).toBe(100);
      expect(fb.stats.speed).toBe(5);
      expect(fb.stats.damage).toBe(15);
    });

    it('butch is the heaviest hitter', () => {
      const damages = Object.values(CHARACTERS).map(c => c.stats.damage);
      expect(CHARACTERS['butch'].stats.damage).toBe(Math.max(...damages));
    });

    it('anabel is the fastest', () => {
      const speeds = Object.values(CHARACTERS).map(c => c.stats.speed);
      expect(CHARACTERS['anabel'].stats.speed).toBe(Math.max(...speeds));
    });

    it('health equals maxHealth for every character', () => {
      for (const char of Object.values(CHARACTERS)) {
        expect(char.stats.health).toBe(char.stats.maxHealth);
      }
    });
  });

  describe('getCharacter', () => {
    it('returns character by id', () => {
      const result = getCharacter('fireboy');
      expect(result).toBeDefined();
      expect(result!.name).toBe('Fireboy');
    });

    it('is case-insensitive', () => {
      expect(getCharacter('FIREBOY')).toBeDefined();
      expect(getCharacter('FireBoy')).toBeDefined();
    });

    it('returns undefined for unknown id', () => {
      expect(getCharacter('unknown')).toBeUndefined();
    });
  });

  describe('getAllCharacters', () => {
    it('returns array of all characters', () => {
      const all = getAllCharacters();
      expect(all).toHaveLength(4);
    });

    it('returns CharacterDefinition objects', () => {
      const all = getAllCharacters();
      for (const char of all) {
        expect(char).toHaveProperty('id');
        expect(char).toHaveProperty('stats');
      }
    });
  });
});
