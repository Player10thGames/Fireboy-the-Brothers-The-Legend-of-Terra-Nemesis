/**
 * Core Game Engine
 * Manages game state, update loop, and rendering
 */

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  targetFPS: number;
}

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  active: boolean;
  update(deltaTime: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GameConfig;
  private gameObjects: GameObject[] = [];
  private isRunning = false;
  private lastFrameTime = 0;
  private animationFrameId: number | null = null;

  constructor(canvas: HTMLCanvasElement, config: GameConfig) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D canvas context. The browser may not support Canvas, or the context may already be acquired with a different type.');
    }
    this.ctx = ctx;
    this.config = config;

    // Set canvas size
    this.canvas.width = config.canvasWidth;
    this.canvas.height = config.canvasHeight;

    // Enable image smoothing for better sprite rendering
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  /**
   * Add a game object to the engine
   */
  addObject(obj: GameObject): void {
    this.gameObjects.push(obj);
  }

  /**
   * Remove a game object from the engine
   */
  removeObject(obj: GameObject): void {
    const index = this.gameObjects.indexOf(obj);
    if (index > -1) {
      this.gameObjects.splice(index, 1);
    }
  }

  /**
   * Get all active game objects
   */
  getObjects(): GameObject[] {
    return this.gameObjects.filter(obj => obj.active);
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.gameLoop();
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main game loop
   */
  private gameLoop = (): void => {
    const currentTime = performance.now();
    const deltaTime = Math.min((currentTime - this.lastFrameTime) / 1000, 0.016); // Cap at 60 FPS
    this.lastFrameTime = currentTime;

    // Update
    this.update(deltaTime);

    // Render
    this.render();

    // Continue loop
    if (this.isRunning) {
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }
  };

  /**
   * Update game state
   */
  private update(deltaTime: number): void {
    // Update all active objects
    for (const obj of this.gameObjects) {
      if (obj.active) {
        obj.update(deltaTime);
      }
    }

    // Remove inactive objects
    this.gameObjects = this.gameObjects.filter(obj => obj.active);
  }

  /**
   * Render the game
   */
  private render(): void {
    // Clear canvas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render all active objects
    for (const obj of this.gameObjects) {
      if (obj.active) {
        obj.render(this.ctx);
      }
    }
  }

  /**
   * Get canvas context
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Get canvas
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get game config
   */
  getConfig(): GameConfig {
    return this.config;
  }

  /**
   * Check if engine is running
   */
  isGameRunning(): boolean {
    return this.isRunning;
  }
}
