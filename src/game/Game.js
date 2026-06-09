// ─────────────────────────────────────────────
//  CHRONO-CLONE · Game
//  Top-level orchestrator.
//  Owns the game loop and all subsystems.
// ─────────────────────────────────────────────

import { ROUND_TIME, MAX_ROUNDS, TRAIL_LENGTH } from './constants.js';
import {
  KEY_POS, EXIT_POS, PRESSURE_PLATE_DEFS,
  GUARD_PATROL_PATHS,
} from './map.js';
import { Player }          from './Player.js';
import { Guard }           from './Guard.js';
import { PressurePlate }   from './PressurePlate.js';
import { TimelineRecorder, Timeline } from './Timeline.js';
import { EffectsManager }  from './EffectsManager.js';
import { Renderer }        from './Renderer.js';
import { KEY_COLLECT_DIST, EXIT_COLLECT_DIST } from './constants.js';
import { dist }            from '../utils/math.js';

/**
 * @typedef {'menu'|'playing'|'dead'|'won'|'gameover'} GameState
 */

export class Game {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {import('../ui/HUD.js').HUD} hud
   * @param {import('./InputManager.js').InputManager} input
   */
  constructor(canvas, hud, input) {
    this.canvas   = canvas;
    this.hud      = hud;
    this.input    = input;
    this.renderer = new Renderer(canvas);
    this.effects  = new EffectsManager();

    /** @type {GameState} */
    this.state    = 'menu';

    /** Sealed timelines (ghost clones). */
    this.timelines = [];

    /** Live recorder for the current round. */
    this.recorder  = new TimelineRecorder();

    this.round     = 1;
    this.elapsed   = 0;   // seconds into current round
    this.hasKey    = false;

    // Entity arrays (reset each round)
    this.player         = null;
    this.guards         = [];
    this.pressurePlates = [];

    /** Recent player positions for motion trail. */
    this._trail = [];

    this._lastTS = 0;
    this._rafId  = null;
  }

  // ── Public API ────────────────────────────

  startGame() {
    this.round     = 1;
    this.hasKey    = false;
    this.timelines = [];
    this._initRound();
    this.state = 'playing';
    this.hud.hideMessage();
    this.hud.showPlayButtons(true);
    this.hud.setStartLabel('▶ PLAY AGAIN');
    this._updateHUD();
  }

  rewind() {
    if (this.state !== 'playing' && this.state !== 'dead') return;
    if (this.round >= MAX_ROUNDS) {
      this.hud.showMessage('TIMELINE LIMIT', 'Maximum clones reached.', true);
      return;
    }

    // Seal the current recording as a ghost
    if (this.recorder.frames.length > 0) {
      this.timelines.push(this.recorder.seal(this.round - 1));
    }

    this.round++;
    this._initRound();
    this.state = 'playing';
    this.effects.triggerRewind();
    this._updateHUD();
  }

  // ── Internal ──────────────────────────────

  _initRound() {
    this.elapsed = 0;
    this._trail  = [];

    this.player = new Player();
    this.player.hasKey = this.hasKey;

    this.guards = GUARD_PATROL_PATHS.map(
      (path, i) => new Guard(path, i)
    );

    this.pressurePlates = PRESSURE_PLATE_DEFS.map(
      def => new PressurePlate(def)
    );

    this.recorder.reset();
    this.hud.setObjective(this.hasKey, false);
  }

  _updateHUD() {
    this.hud.setCounters(this.timelines.length, this.round);
  }

  // ── Game loop ──────────────────────────────

  start() {
    this._rafId = requestAnimationFrame(ts => {
      this._lastTS = ts;
      requestAnimationFrame(ts => this._loop(ts));
    });
  }

  _loop(ts) {
    const dt = Math.min((ts - this._lastTS) / 1000, 0.05);
    this._lastTS = ts;

    this._update(dt);
    this._render();

    this._rafId = requestAnimationFrame(ts => this._loop(ts));
  }

  _update(dt) {
    this.effects.update(dt);

    if (this.state !== 'playing') return;

    this.elapsed += dt;
    this.hud.setTimer(this.elapsed, ROUND_TIME);

    // ── Time expired ──────────────────────────
    if (this.elapsed >= ROUND_TIME) {
      this._handleDeath();
      return;
    }

    // ── Player movement ───────────────────────
    this.player.update(this.input.keys);

    // Motion trail
    this._trail.push({ x: this.player.x, y: this.player.y });
    if (this._trail.length > TRAIL_LENGTH) this._trail.shift();

    // Record snapshot
    this.recorder.record(this.player.snapshot(this.elapsed));

    // ── Pressure plates ───────────────────────
    const anyActive = this._updatePlates();

    // ── Guards ────────────────────────────────
    for (const guard of this.guards) {
      guard.update(anyActive);
      if (guard.catches(this.player)) {
        this._handleDeath();
        return;
      }
    }

    // ── Collectibles ──────────────────────────
    if (!this.player.hasKey) {
      const d = dist(
        { x: this.player.cx, y: this.player.cy },
        { x: KEY_POS.x + 8,  y: KEY_POS.y + 8  }
      );
      if (d < KEY_COLLECT_DIST) {
        this.player.hasKey = true;
        this.hasKey        = true;
        this.hud.setObjective(true, false);
      }
    }

    if (this.player.hasKey) {
      const d = dist(
        { x: this.player.cx,  y: this.player.cy  },
        { x: EXIT_POS.x + 12, y: EXIT_POS.y + 12 }
      );
      if (d < EXIT_COLLECT_DIST) {
        this._handleWin();
        return;
      }
    }
  }

  /** Updates all pressure plates and returns whether any is active. */
  _updatePlates() {
    let any = false;
    for (const pp of this.pressurePlates) {
      pp.update(this.player, this.timelines, this.elapsed);
      if (pp.active) any = true;
    }
    return any;
  }

  _handleDeath() {
    this.state = 'dead';
    this.effects.triggerDeath();

    setTimeout(() => {
      if (this.round < MAX_ROUNDS) {
        this.rewind();
      } else {
        this.state = 'gameover';
        this.hud.showMessage(
          'TIME PARADOX',
          'All timelines compromised · Click START to restart',
          true
        );
        this.hud.showPlayButtons(false);
      }
    }, 600);
  }

  _handleWin() {
    this.state = 'won';
    this.hud.setObjective(true, true);
    this.hud.showMessage(
      'TIMELINE SECURE',
      `Mission complete in ${this.round} timeline${this.round > 1 ? 's' : ''} · Click START`,
      false
    );
    this.hud.showPlayButtons(false);
  }

  // ── Render ────────────────────────────────

  _render() {
    const { ctx }    = this.renderer;
    const { canvas } = this;

    ctx.save();
    ctx.translate(this.effects.shakeX, this.effects.shakeY);

    this.renderer.drawBackground();
    this.renderer.drawMap();
    this.renderer.drawPressurePlates(this.pressurePlates);

    if (!this.player?.hasKey) this.renderer.drawKey(KEY_POS);
    this.renderer.drawExit(EXIT_POS, this.player?.hasKey ?? false);
    this.renderer.drawGhosts(this.timelines, this.elapsed);

    if (this.player && (this.state === 'playing' || this.state === 'dead')) {
      this.renderer.drawPlayer(this.player, this._trail, this.state === 'dead');
    }

    this.renderer.drawGuards(this.guards);
    this.renderer.drawVignette();

    this.effects.renderGlitch(canvas, ctx);
    this.effects.renderParticles(ctx);

    ctx.restore();
  }
}
