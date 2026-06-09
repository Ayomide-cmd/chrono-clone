// ─────────────────────────────────────────────
//  CHRONO-CLONE · Guard
//  Patrol AI with pressure-plate pause and
//  player catch detection.
// ─────────────────────────────────────────────

import {
  GUARD_SIZE,
  GUARD_BASE_SPEED,
  GUARD_SPEED_STEP,
  GUARD_CATCH_DIST,
} from './constants.js';
import { dist } from '../utils/math.js';

export class Guard {
  /**
   * @param {Array<{x:number,y:number}>} path  – pixel waypoints
   * @param {number} index – guard index (affects speed)
   */
  constructor(path, index) {
    this.path  = path;
    this.pi    = 0;                                         // current waypoint index
    this.x     = path[0].x;
    this.y     = path[0].y;
    this.speed = GUARD_BASE_SPEED + index * GUARD_SPEED_STEP;
    this.size  = GUARD_SIZE;
    this.paused = false;
  }

  get cx() { return this.x; }
  get cy() { return this.y; }

  /**
   * Advance along the patrol path.
   * If `paused` is true the guard stops in place (pressure plate active).
   */
  update(paused) {
    this.paused = paused;
    if (paused) return;

    const target = this.path[this.pi];
    const d = dist(this, target);

    if (d < 4) {
      // Reached waypoint – advance to next
      this.pi = (this.pi + 1) % this.path.length;
    } else {
      const angle = Math.atan2(target.y - this.y, target.x - this.x);
      this.x += Math.cos(angle) * this.speed;
      this.y += Math.sin(angle) * this.speed;
    }
  }

  /**
   * Returns true if the guard has caught the player.
   * @param {{ cx:number, cy:number }} player
   */
  catches(player) {
    return dist(this, { x: player.cx, y: player.cy }) < GUARD_CATCH_DIST;
  }
}
