import { describe, it, expect } from 'vitest';
import { BOSSES, getBoss, getAllBosses } from './bosses';

describe('bosses', () => {
  describe('BOSSES constant', () => {
    it('has 7 bosses', () => {
      expect(BOSSES).toHaveLength(7);
    });

    it('bosses are ordered by stage 1-7', () => {
      for (let i = 0; i < BOSSES.length; i++) {
        expect(BOSSES[i].stage).toBe(i + 1);
      }
    });

    it('each boss has required fields', () => {
      for (const boss of BOSSES) {
        expect(boss).toHaveProperty('id');
        expect(boss).toHaveProperty('stage');
        expect(boss).toHaveProperty('name');
        expect(boss).toHaveProperty('description');
        expect(boss).toHaveProperty('stats');
        expect(boss).toHaveProperty('color');
        expect(boss).toHaveProperty('gimmick');
        expect(boss.stats).toHaveProperty('health');
        expect(boss.stats).toHaveProperty('maxHealth');
        expect(boss.stats).toHaveProperty('damage');
        expect(boss.stats).toHaveProperty('speed');
      }
    });

    it('boss health increases with stage (generally)', () => {
      const stage1 = BOSSES[0].stats.health;
      const stage7 = BOSSES[6].stats.health;
      expect(stage7).toBeGreaterThan(stage1);
    });

    it('health equals maxHealth for every boss', () => {
      for (const boss of BOSSES) {
        expect(boss.stats.health).toBe(boss.stats.maxHealth);
      }
    });

    it('roaring metal is the true final boss at stage 7', () => {
      const finalBoss = BOSSES[6];
      expect(finalBoss.id).toBe('roaring_metal');
      expect(finalBoss.stage).toBe(7);
      expect(finalBoss.stats.health).toBe(500);
    });

    it('each boss has a unique id', () => {
      const ids = BOSSES.map(b => b.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('getBoss', () => {
    it('returns boss by stage number', () => {
      const boss = getBoss(1);
      expect(boss).toBeDefined();
      expect(boss!.name).toBe('Double Mecha Rocket');
    });

    it('returns undefined for invalid stage', () => {
      expect(getBoss(0)).toBeUndefined();
      expect(getBoss(8)).toBeUndefined();
      expect(getBoss(-1)).toBeUndefined();
    });

    it('returns correct boss for each stage', () => {
      expect(getBoss(1)!.id).toBe('double_mecha_rocket');
      expect(getBoss(2)!.id).toBe('butch_boss');
      expect(getBoss(3)!.id).toBe('mandler');
      expect(getBoss(4)!.id).toBe('crusher_bot_mk2');
      expect(getBoss(5)!.id).toBe('metal_sonic');
      expect(getBoss(6)!.id).toBe('roaring_knight');
      expect(getBoss(7)!.id).toBe('roaring_metal');
    });
  });

  describe('getAllBosses', () => {
    it('returns all 7 bosses', () => {
      expect(getAllBosses()).toHaveLength(7);
    });

    it('returns same data as BOSSES constant', () => {
      expect(getAllBosses()).toEqual(BOSSES);
    });
  });
});
