import { describe, it, expect } from 'vitest';
import { Collision, Rect } from './Collision';

describe('Collision', () => {
  describe('checkAABB', () => {
    it('detects overlapping rectangles', () => {
      const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
      const b: Rect = { x: 25, y: 25, width: 50, height: 50 };
      expect(Collision.checkAABB(a, b)).toBe(true);
    });

    it('returns false for non-overlapping rectangles', () => {
      const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
      const b: Rect = { x: 100, y: 100, width: 50, height: 50 };
      expect(Collision.checkAABB(a, b)).toBe(false);
    });

    it('returns false for edge-touching rectangles (not overlapping)', () => {
      const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
      const b: Rect = { x: 50, y: 0, width: 50, height: 50 };
      expect(Collision.checkAABB(a, b)).toBe(false);
    });

    it('detects overlap when one rect contains the other', () => {
      const outer: Rect = { x: 0, y: 0, width: 100, height: 100 };
      const inner: Rect = { x: 25, y: 25, width: 10, height: 10 };
      expect(Collision.checkAABB(outer, inner)).toBe(true);
      expect(Collision.checkAABB(inner, outer)).toBe(true);
    });

    it('treats zero-dimension point inside rect as colliding', () => {
      const a: Rect = { x: 10, y: 10, width: 0, height: 0 };
      const b: Rect = { x: 5, y: 5, width: 20, height: 20 };
      expect(Collision.checkAABB(a, b)).toBe(true);
    });

    it('returns false for zero-dimension point outside rect', () => {
      const a: Rect = { x: 30, y: 30, width: 0, height: 0 };
      const b: Rect = { x: 5, y: 5, width: 20, height: 20 };
      expect(Collision.checkAABB(a, b)).toBe(false);
    });

    it('detects partial horizontal overlap', () => {
      const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
      const b: Rect = { x: 25, y: 100, width: 50, height: 50 };
      expect(Collision.checkAABB(a, b)).toBe(false);
    });
  });

  describe('getCollisionResult', () => {
    it('returns no collision for separated rects', () => {
      const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
      const b: Rect = { x: 100, y: 100, width: 50, height: 50 };
      const result = Collision.getCollisionResult(a, b);
      expect(result.collided).toBe(false);
      expect(result.overlapX).toBe(0);
      expect(result.overlapY).toBe(0);
    });

    it('calculates overlap for colliding rects', () => {
      const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
      const b: Rect = { x: 40, y: 30, width: 50, height: 50 };
      const result = Collision.getCollisionResult(a, b);
      expect(result.collided).toBe(true);
      expect(result.overlapX).toBe(10); // min(50-40, 40+50-0) = min(10,90) = 10
      expect(result.overlapY).toBe(20); // min(50-30, 30+50-0) = min(20,80) = 20
    });

    it('handles contained rect overlap', () => {
      const a: Rect = { x: 0, y: 0, width: 100, height: 100 };
      const b: Rect = { x: 25, y: 25, width: 50, height: 50 };
      const result = Collision.getCollisionResult(a, b);
      expect(result.collided).toBe(true);
      // overlapLeft = 0+100-25=75, overlapRight = 25+50-0=75 → min=75
      expect(result.overlapX).toBe(75);
      expect(result.overlapY).toBe(75);
    });
  });

  describe('pointInRect', () => {
    const rect: Rect = { x: 10, y: 10, width: 80, height: 60 };

    it('returns true for point inside rect', () => {
      expect(Collision.pointInRect(50, 40, rect)).toBe(true);
    });

    it('returns true for point on edge', () => {
      expect(Collision.pointInRect(10, 10, rect)).toBe(true);
      expect(Collision.pointInRect(90, 70, rect)).toBe(true);
    });

    it('returns false for point outside rect', () => {
      expect(Collision.pointInRect(5, 5, rect)).toBe(false);
      expect(Collision.pointInRect(100, 100, rect)).toBe(false);
    });

    it('returns false for point just outside boundary', () => {
      expect(Collision.pointInRect(9, 40, rect)).toBe(false);
      expect(Collision.pointInRect(91, 40, rect)).toBe(false);
    });
  });

  describe('checkCircleCollision', () => {
    it('detects overlapping circles', () => {
      expect(Collision.checkCircleCollision(0, 0, 10, 15, 0, 10)).toBe(true);
    });

    it('returns false for distant circles', () => {
      expect(Collision.checkCircleCollision(0, 0, 5, 100, 100, 5)).toBe(false);
    });

    it('returns false for circles that just touch (distance == r1+r2)', () => {
      expect(Collision.checkCircleCollision(0, 0, 5, 10, 0, 5)).toBe(false);
    });

    it('detects concentric circles', () => {
      expect(Collision.checkCircleCollision(50, 50, 20, 50, 50, 10)).toBe(true);
    });

    it('handles zero-radius circle', () => {
      expect(Collision.checkCircleCollision(5, 5, 0, 5, 5, 10)).toBe(true);
    });
  });

  describe('checkCircleRectCollision', () => {
    const rect: Rect = { x: 10, y: 10, width: 80, height: 60 };

    it('detects circle overlapping rect', () => {
      expect(Collision.checkCircleRectCollision(50, 40, 10, rect)).toBe(true);
    });

    it('returns false for distant circle', () => {
      expect(Collision.checkCircleRectCollision(200, 200, 5, rect)).toBe(false);
    });

    it('detects circle overlapping rect corner', () => {
      expect(Collision.checkCircleRectCollision(8, 8, 5, rect)).toBe(true);
    });

    it('returns false for circle just outside corner', () => {
      expect(Collision.checkCircleRectCollision(0, 0, 5, rect)).toBe(false);
    });

    it('detects circle touching rect edge', () => {
      expect(Collision.checkCircleRectCollision(50, 5, 6, rect)).toBe(true);
    });
  });
});
