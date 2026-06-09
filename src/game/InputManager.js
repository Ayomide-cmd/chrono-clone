// ─────────────────────────────────────────────
//  CHRONO-CLONE · InputManager
//  Centralised keyboard state.
//  Emits one-shot callbacks for action keys
//  (Space = rewind) so they don't repeat.
// ─────────────────────────────────────────────

export class InputManager {
  constructor() {
    /** Live key-down map. */
    this.keys = {};

    /** One-shot callbacks registered via on(). */
    this._handlers = {};

    this._onDown = (e) => {
      this.keys[e.key] = true;
      if (this._handlers[e.key]) {
        e.preventDefault();
        this._handlers[e.key]();
      }
    };

    this._onUp = (e) => {
      this.keys[e.key] = false;
    };

    window.addEventListener('keydown', this._onDown);
    window.addEventListener('keyup',   this._onUp);
  }

  /**
   * Register a one-shot callback for a specific key.
   * @param {string}   key  – e.g. ' ' for Space
   * @param {Function} fn
   */
  on(key, fn) {
    this._handlers[key] = fn;
  }

  /** Tear down event listeners (call on game destroy). */
  destroy() {
    window.removeEventListener('keydown', this._onDown);
    window.removeEventListener('keyup',   this._onUp);
  }
}
