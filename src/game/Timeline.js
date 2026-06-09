// ─────────────────────────────────────────────
//  CHRONO-CLONE · Timeline
//
//  Implements the core time-reversal mechanic.
//
//  ARCHITECTURE – Command / Time-stamped log:
//  ──────────────────────────────────────────
//  Each frame the live player emits a snapshot:
//    { x, y, t }   (position + elapsed seconds)
//
//  On rewind, that log becomes a Timeline object.
//  During playback we binary-search the log by
//  elapsed time to find the closest frame, so
//  ghost positions stay in perfect sync even if
//  the frame-rate fluctuates.
//
//  Multiple Timeline objects run in parallel –
//  each is an independent "ghost clone".
// ─────────────────────────────────────────────

export class TimelineRecorder {
  constructor() {
    /** @type {Array<{x:number,y:number,t:number}>} */
    this.frames = [];
  }

  /** Record a snapshot from the live player. */
  record(snapshot) {
    this.frames.push(snapshot);
  }

  /** Seal into an immutable Timeline for ghost playback. */
  seal(colorIndex) {
    return new Timeline([...this.frames], colorIndex);
  }

  reset() {
    this.frames = [];
  }
}

export class Timeline {
  /**
   * @param {Array<{x:number,y:number,t:number}>} frames
   * @param {number} colorIndex – selects ghost colour from COLORS.ghost[]
   */
  constructor(frames, colorIndex) {
    this.frames     = frames;
    this.colorIndex = colorIndex;
  }

  /**
   * Binary search for the frame closest to `elapsed` seconds.
   * Returns null if the recording is empty or elapsed is out of range.
   *
   * @param {number} elapsed – seconds since round start
   * @param {number} tolerance – max allowed time delta (seconds)
   */
  frameAt(elapsed, tolerance = 0.2) {
    const { frames } = this;
    if (!frames.length) return null;

    let lo = 0, hi = frames.length - 1, best = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (frames[mid].t < elapsed) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
      if (Math.abs(frames[mid].t - elapsed) < Math.abs(frames[best].t - elapsed)) {
        best = mid;
      }
    }

    return Math.abs(frames[best].t - elapsed) <= tolerance
      ? frames[best]
      : null;
  }
}
