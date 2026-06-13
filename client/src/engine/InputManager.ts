/**
 * Input Manager
 * Handles keyboard and touch input
 */

export enum InputKey {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  FIRE = 'FIRE',
  PAUSE = 'PAUSE',
}

export class InputManager {
  private keysPressed: Set<InputKey> = new Set();
  private keyMap: Map<string, InputKey> = new Map([
    ['ArrowUp', InputKey.UP],
    ['w', InputKey.UP],
    ['W', InputKey.UP],
    ['ArrowDown', InputKey.DOWN],
    ['s', InputKey.DOWN],
    ['S', InputKey.DOWN],
    ['ArrowLeft', InputKey.LEFT],
    ['a', InputKey.LEFT],
    ['A', InputKey.LEFT],
    ['ArrowRight', InputKey.RIGHT],
    ['d', InputKey.RIGHT],
    ['D', InputKey.RIGHT],
    [' ', InputKey.FIRE],
    ['Enter', InputKey.FIRE],
    ['z', InputKey.FIRE],
    ['Z', InputKey.FIRE],
    ['p', InputKey.PAUSE],
    ['P', InputKey.PAUSE],
    ['Escape', InputKey.PAUSE],
  ]);

  private touchPadState = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  private fireButtonPressed = false;
  private pauseButtonPressed = false;

  constructor() {
    this.setupKeyboardListeners();
    this.setupTouchListeners();
  }

  /**
   * Setup keyboard event listeners
   */
  private setupKeyboardListeners(): void {
    window.addEventListener('keydown', (e) => {
      const inputKey = this.keyMap.get(e.key);
      if (inputKey) {
        this.keysPressed.add(inputKey);
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      const inputKey = this.keyMap.get(e.key);
      if (inputKey) {
        this.keysPressed.delete(inputKey);
        e.preventDefault();
      }
    });
  }

  /**
   * Setup touch event listeners for virtual controls
   */
  private setupTouchListeners(): void {
    // This will be called from React components with actual touch targets
  }

  /**
   * Check if a key is currently pressed
   */
  isKeyPressed(key: InputKey): boolean {
    return this.keysPressed.has(key);
  }

  /**
   * Check if any movement key is pressed
   */
  isMoving(): boolean {
    return (
      this.keysPressed.has(InputKey.UP) ||
      this.keysPressed.has(InputKey.DOWN) ||
      this.keysPressed.has(InputKey.LEFT) ||
      this.keysPressed.has(InputKey.RIGHT) ||
      this.touchPadState.up ||
      this.touchPadState.down ||
      this.touchPadState.left ||
      this.touchPadState.right
    );
  }

  /**
   * Get movement direction
   */
  getMovementDirection(): { x: number; y: number } {
    let x = 0;
    let y = 0;

    if (this.keysPressed.has(InputKey.UP) || this.touchPadState.up) y -= 1;
    if (this.keysPressed.has(InputKey.DOWN) || this.touchPadState.down) y += 1;
    if (this.keysPressed.has(InputKey.LEFT) || this.touchPadState.left) x -= 1;
    if (this.keysPressed.has(InputKey.RIGHT) || this.touchPadState.right) x += 1;

    // Normalize diagonal movement
    if (x !== 0 && y !== 0) {
      const length = Math.sqrt(x * x + y * y);
      x /= length;
      y /= length;
    }

    return { x, y };
  }

  /**
   * Check if fire button is pressed
   */
  isFirePressed(): boolean {
    return this.keysPressed.has(InputKey.FIRE) || this.fireButtonPressed;
  }

  /**
   * Check if pause button is pressed
   */
  isPausePressed(): boolean {
    return this.keysPressed.has(InputKey.PAUSE) || this.pauseButtonPressed;
  }

  /**
   * Set touch pad state (called from React touch handlers)
   */
  setTouchPadState(state: {
    up?: boolean;
    down?: boolean;
    left?: boolean;
    right?: boolean;
  }): void {
    if (state.up !== undefined) this.touchPadState.up = state.up;
    if (state.down !== undefined) this.touchPadState.down = state.down;
    if (state.left !== undefined) this.touchPadState.left = state.left;
    if (state.right !== undefined) this.touchPadState.right = state.right;
  }

  /**
   * Set fire button state (called from React touch handlers)
   */
  setFireButtonPressed(pressed: boolean): void {
    this.fireButtonPressed = pressed;
  }

  /**
   * Set pause button state (called from React touch handlers)
   */
  setPauseButtonPressed(pressed: boolean): void {
    this.pauseButtonPressed = pressed;
  }

  /**
   * Reset all input states
   */
  reset(): void {
    this.keysPressed.clear();
    this.touchPadState = { up: false, down: false, left: false, right: false };
    this.fireButtonPressed = false;
    this.pauseButtonPressed = false;
  }
}
