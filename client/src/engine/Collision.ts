/**
 * Collision Detection System
 */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CollisionResult {
  collided: boolean;
  overlapX: number;
  overlapY: number;
}

export class Collision {
  /**
   * Check if two rectangles collide (AABB - Axis-Aligned Bounding Box)
   */
  static checkAABB(rect1: Rect, rect2: Rect): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  /**
   * Get detailed collision result between two rectangles
   */
  static getCollisionResult(rect1: Rect, rect2: Rect): CollisionResult {
    const collided = this.checkAABB(rect1, rect2);

    if (!collided) {
      return { collided: false, overlapX: 0, overlapY: 0 };
    }

    // Calculate overlap
    const overlapLeft = rect1.x + rect1.width - rect2.x;
    const overlapRight = rect2.x + rect2.width - rect1.x;
    const overlapTop = rect1.y + rect1.height - rect2.y;
    const overlapBottom = rect2.y + rect2.height - rect1.y;

    const overlapX = Math.min(overlapLeft, overlapRight);
    const overlapY = Math.min(overlapTop, overlapBottom);

    return { collided: true, overlapX, overlapY };
  }

  /**
   * Check if a point is inside a rectangle
   */
  static pointInRect(x: number, y: number, rect: Rect): boolean {
    return (
      x >= rect.x &&
      x <= rect.x + rect.width &&
      y >= rect.y &&
      y <= rect.y + rect.height
    );
  }

  /**
   * Check if two circles collide
   */
  static checkCircleCollision(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number
  ): boolean {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < r1 + r2;
  }

  /**
   * Check if a circle and rectangle collide
   */
  static checkCircleRectCollision(
    cx: number,
    cy: number,
    cr: number,
    rect: Rect
  ): boolean {
    const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));

    const dx = cx - closestX;
    const dy = cy - closestY;

    return dx * dx + dy * dy < cr * cr;
  }
}
