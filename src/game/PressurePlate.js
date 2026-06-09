// ─────────────────────────────────────────────
//  CHRONO-CLONE · PressurePlate
//  Activated by the live player OR any ghost clone.
//  When active → all guards pause.
// ─────────────────────────────────────────────

import { PLAYER_SIZE } from './constants.js';

export class PressurePlate {
  /**
   * @param {{ x:number, y:number, w:number, h:number }} def
   */
  constructor({ x, y, w, h }) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.active = false;
  }

  get cx() { return this.x + this.w / 2; }
  get cy() { return this.y + this.h / 2; }

  /**
   * Check whether a point (centre of player/ghost) is standing on the plate.
   * @param {number} px – centre x
   * @param {number} py – centre y
   */
  containsPoint(px, py) {
    return px > this.x && px < this.x + this.w &&
           py > this.y && py < this.y + this.h;
  }

  /**
   * Re-evaluate activation status.
   * @param {{ cx:number, cy:number }} player
   * @param {Array<import('./Timeline.js').Timeline>} timelines
   * @param {number} elapsed – seconds since round start
   */
  update(player, timelines, elapsed) {
    // Check live player
    if (player.alive && this.containsPoint(player.cx, player.cy)) {
      this.active = true;
      return;
    }

    // Check every ghost clone
    const PS = PLAYER_SIZE;
    for (const tl of timelines) {
      const frame = tl.frameAt(elapsed);
      if (!frame) continue;
      const gcx = frame.x + PS / 2;
      const gcy = frame.y + PS / 2;
      if (this.containsPoint(gcx, gcy)) {
        this.active = true;
        return;
      }
    }

    this.active = false;
  }
}
