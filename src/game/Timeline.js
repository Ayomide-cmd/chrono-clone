
export class TimelineRecorder {
  constructor() {
    /** @type {Array<{x:number,y:number,t:number}>} */
    this.frames = [];
  }

  
  record(snapshot) {
    this.frames.push(snapshot);
  }

  
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
   * @param {number} colorIndex 
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
