// ─────────────────────────────────────────────
//  CHRONO-CLONE · Player
//  Handles movement, collision, key/exit pickup
// ─────────────────────────────────────────────

import { PLAYER_SIZE, PLAYER_SPEED } from './constants.js';
import { isWallRect, PLAYER_START } from './map.js';

export class Player {
  constructor() {
    this.reset();
  }

  reset() {
    this.x      = PLAYER_START.x;
    this.y      = PLAYER_START.y;
    this.alive  = true;
    this.hasKey = false;
    this.w      = PLAYER_SIZE;
    this.h      = PLAYER_SIZE;
  }

  /** Centre point for collision checks and rendering. */
  get cx() { return this.x + this.w / 2; }
  get cy() { return this.y + this.h / 2; }

  /**
   * Move the player based on current input map.
   * @param {Object} keys  – live keyboard state { 'ArrowLeft': true, … }
   */
  update(keys) {
    if (!this.alive) return;

    let dx = 0, dy = 0;
    if (keys['ArrowLeft']  || keys['a'] || keys['A']) dx -= PLAYER_SPEED;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) dx += PLAYER_SPEED;
    if (keys['ArrowUp']    || keys['w'] || keys['W']) dy -= PLAYER_SPEED;
    if (keys['ArrowDown']  || keys['s'] || keys['S']) dy += PLAYER_SPEED;

    // Normalise diagonal movement
    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    // Separate-axis collision so the player slides along walls
    const nx = this.x + dx;
    const ny = this.y + dy;
    if (!isWallRect(nx, this.y, this.w, this.h)) this.x = nx;
    if (!isWallRect(this.x, ny, this.w, this.h)) this.y = ny;
  }

  /** Snapshot position for timeline recording. */
  snapshot(elapsed) {
    return { x: this.x, y: this.y, t: elapsed };
  }

  kill() {
    this.alive = false;
  }
}
