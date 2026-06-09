export class InputManager {
  constructor() {
    this.keys = {};
    this._handlers = {};
    this._joystick = {
      active: false, startX: 0, startY: 0,
      currentX: 0, currentY: 0, touchId: null,
    };
    this.joystickCanvas = null;

    this._onDown = (e) => {
      this.keys[e.key] = true;
      if (this._handlers[e.key]) {
        e.preventDefault();
        this._handlers[e.key]();
      }
    };
    this._onUp = (e) => { this.keys[e.key] = false; };

    window.addEventListener('keydown', this._onDown);
    window.addEventListener('keyup', this._onUp);
  }

  on(key, fn) { this._handlers[key] = fn; }

  setupMobileControls(joystickCanvas, rewindBtn) {
    this.joystickCanvas = joystickCanvas;
    joystickCanvas.addEventListener('touchstart',  e => this._joyStart(e), { passive: false });
    joystickCanvas.addEventListener('touchmove',   e => this._joyMove(e),  { passive: false });
    joystickCanvas.addEventListener('touchend',    e => this._joyEnd(e),   { passive: false });
    joystickCanvas.addEventListener('touchcancel', e => this._joyEnd(e),   { passive: false });
    rewindBtn.addEventListener('touchstart', e => {
      e.preventDefault();
      if (this._handlers['rewind']) this._handlers['rewind']();
    }, { passive: false });
    document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
  }

  getJoystickState() { return this._joystick; }

  destroy() {
    window.removeEventListener('keydown', this._onDown);
    window.removeEventListener('keyup', this._onUp);
  }

  _joyStart(e) {
    e.preventDefault();
    if (this._joystick.active) return;
    const t = e.changedTouches[0];
    const r = this.joystickCanvas.getBoundingClientRect();
    this._joystick.active   = true;
    this._joystick.touchId  = t.identifier;
    this._joystick.startX   = t.clientX - r.left;
    this._joystick.startY   = t.clientY - r.top;
    this._joystick.currentX = this._joystick.startX;
    this._joystick.currentY = this._joystick.startY;
    this._updateKeysFromJoy();
  }

  _joyMove(e) {
    e.preventDefault();
    for (const t of e.changedTouches) {
      if (t.identifier !== this._joystick.touchId) continue;
      const r = this.joystickCanvas.getBoundingClientRect();
      this._joystick.currentX = t.clientX - r.left;
      this._joystick.currentY = t.clientY - r.top;
    }
    this._updateKeysFromJoy();
  }

  _joyEnd(e) {
    for (const t of e.changedTouches) {
      if (t.identifier !== this._joystick.touchId) continue;
      this._joystick.active  = false;
      this._joystick.touchId = null;
    }
    ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].forEach(k => { this.keys[k] = false; });
  }

  _updateKeysFromJoy() {
    const { startX, startY, currentX, currentY } = this._joystick;
    const dx = currentX - startX;
    const dy = currentY - startY;
    const DEAD = 12;
    this.keys['ArrowLeft']  = dx < -DEAD;
    this.keys['ArrowRight'] = dx >  DEAD;
    this.keys['ArrowUp']    = dy < -DEAD;
    this.keys['ArrowDown']  = dy >  DEAD;
  }
}