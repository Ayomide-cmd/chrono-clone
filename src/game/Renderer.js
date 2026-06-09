
import {
  CANVAS_W, CANVAS_H,
  TILE, MAP_OX, MAP_OY,
  PLAYER_SIZE,
  COLORS,
  TRAIL_LENGTH,
  GHOST_TRAIL_LENGTH,
} from './constants.js';
import { MAP, MAP_ROWS, MAP_COLS } from './map.js';

export class Renderer {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;
  }

 
  _glow(x, y, radius, col) {
    const g = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, col);
    g.addColorStop(1, 'transparent');
    this.ctx.fillStyle = g;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }



  drawBackground() {
    const { ctx } = this;
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(-10, -10, CANVAS_W + 20, CANVAS_H + 20);
  }

  drawMap() {
    const { ctx } = this;
    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        const tx = MAP_OX + c * TILE;
        const ty = MAP_OY + r * TILE;
        if (MAP[r][c] === 1) {
          ctx.fillStyle = COLORS.wallBg;
          ctx.fillRect(tx, ty, TILE, TILE);
          ctx.fillStyle = COLORS.wallFace;
          ctx.fillRect(tx + 1, ty + 1, TILE - 2, TILE - 2);
          ctx.strokeStyle = COLORS.wallBorder;
          ctx.lineWidth   = 0.5;
          ctx.strokeRect(tx + 0.5, ty + 0.5, TILE - 1, TILE - 1);
        } else {
          ctx.fillStyle = COLORS.floor;
          ctx.fillRect(tx, ty, TILE, TILE);
          if ((r + c) % 2 === 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.012)';
            ctx.fillRect(tx, ty, TILE, TILE);
          }
        }
      }
    }
  }

  /** @param {import('./PressurePlate.js').PressurePlate[]} plates */
  drawPressurePlates(plates) {
    const { ctx } = this;
    plates.forEach(pp => {
      const col   = pp.active ? COLORS.pressureActive : COLORS.pressure;
      const gcol  = pp.active ? 'rgba(170,136,255,0.25)' : 'rgba(100,60,200,0.15)';
      this._glow(pp.cx, pp.cy, 28, gcol);

      ctx.globalAlpha = 0.9;
      ctx.fillStyle   = col;
      ctx.beginPath();
      ctx.roundRect(pp.x, pp.y, pp.w, pp.h, 3);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = pp.active ? '#cc99ff' : '#7744cc';
      ctx.lineWidth   = 1;
      ctx.stroke();
    });
  }

  /** @param {{ x:number, y:number }} keyPos */
  drawKey(keyPos) {
    const { ctx } = this;
    const bob = Math.sin(Date.now() * 0.003) * 3;
    const kx  = keyPos.x + 8;
    const ky  = keyPos.y + 8 + bob;
    this._glow(kx, ky, 22, COLORS.keyGlow);
    ctx.fillStyle  = COLORS.key;
    ctx.font       = 'bold 14px Arial';
    ctx.textAlign  = 'center';
    ctx.fillText('🗝', kx, ky + 5);
  }

  /**
   * @param {{ x:number, y:number }} exitPos
   * @param {boolean} unlocked
   */
  drawExit(exitPos, unlocked) {
    const { ctx } = this;
    const ex      = exitPos.x + 12;
    const ey      = exitPos.y + 12;
    const pulse   = 0.7 + Math.sin(Date.now() * 0.004) * 0.3;

    this._glow(ex, ey, 30,
      unlocked ? `rgba(0,255,136,${pulse * 0.4})` : 'rgba(0,150,80,0.1)'
    );
    ctx.fillStyle = unlocked ? COLORS.exit : COLORS.exitLocked;
    ctx.beginPath();
    ctx.roundRect(exitPos.x, exitPos.y, 24, 24, 4);
    ctx.fill();
    ctx.fillStyle  = unlocked ? 'rgba(0,30,15,0.8)' : 'rgba(255,255,255,0.15)';
    ctx.font       = 'bold 13px Arial';
    ctx.textAlign  = 'center';
    ctx.fillText('▶', ex, ey + 5);
  }

  /**
   * Draw all ghost clones using the sealed Timeline list.
   * @param {import('./Timeline.js').Timeline[]} timelines
   * @param {number} elapsed
   */
  drawGhosts(timelines, elapsed) {
    const { ctx } = this;
    const PS = PLAYER_SIZE;

    timelines.forEach((tl, ti) => {
      const frame = tl.frameAt(elapsed);
      if (!frame) return;

      const gc  = COLORS.ghost[tl.colorIndex % COLORS.ghost.length];
      const ggc = COLORS.ghostGlow[tl.colorIndex % COLORS.ghostGlow.length];
      const cx  = frame.x + PS / 2;
      const cy  = frame.y + PS / 2;

      
      const idx = tl.frames.indexOf(frame);
      for (let t = Math.max(0, idx - GHOST_TRAIL_LENGTH); t < idx; t++) {
        const tf    = tl.frames[t];
        const alpha = (t - idx + GHOST_TRAIL_LENGTH) / GHOST_TRAIL_LENGTH * 0.25;
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = gc;
        ctx.beginPath();
        ctx.arc(tf.x + PS / 2, tf.y + PS / 2, PS / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

     
      this._glow(cx, cy, 24, ggc);
      ctx.globalAlpha = 0.75;
      ctx.fillStyle   = gc;
      ctx.beginPath();
      ctx.roundRect(frame.x, frame.y, PS, PS, 3);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = gc.replace('0.7', '1');
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Label
      ctx.fillStyle  = gc.replace('0.7', '0.9');
      ctx.font       = 'bold 7px Courier New';
      ctx.textAlign  = 'center';
      ctx.fillText(`T${ti + 1}`, cx, frame.y - 4);
    });
  }

  /**
   * @param {import('./Player.js').Player} player
   * @param {Array<{x:number,y:number}>} trail
   * @param {boolean} dead
   */
  drawPlayer(player, trail, dead) {
    const { ctx } = this;
    const PS = PLAYER_SIZE;
    const cx = player.cx;
    const cy = player.cy;

    trail.forEach((f, i) => {
      ctx.globalAlpha = (i / trail.length) * 0.3;
      ctx.fillStyle   = COLORS.playerTrail;
      ctx.beginPath();
      ctx.arc(f.x + PS / 2, f.y + PS / 2, PS / 2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    ctx.globalAlpha = dead ? 0.3 : 1;
    this._glow(cx, cy, 28, COLORS.playerGlow);
    ctx.fillStyle   = dead ? '#888' : COLORS.player;
    ctx.beginPath();
    ctx.roundRect(player.x, player.y, PS, PS, 3);
    ctx.fill();
    ctx.strokeStyle = 'rgba(200,240,255,0.8)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (player.hasKey) {
      ctx.font      = '9px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🗝', cx, player.y - 4);
    }
  }

  /** @param {import('./Guard.js').Guard[]} guards */
  drawGuards(guards) {
    const { ctx } = this;
    guards.forEach(g => {
      const gc      = g.cx;
      const gy      = g.cy;
      const col     = g.paused ? COLORS.guardPaused  : COLORS.guard;
      const glowCol = g.paused ? 'rgba(255,180,0,0.4)' : COLORS.guardGlow;

      this._glow(gc, gy, 28, glowCol);

      ctx.fillStyle   = col;
      ctx.beginPath();
      ctx.roundRect(g.x - g.size / 2, g.y - g.size / 2, g.size, g.size, 2);
      ctx.fill();
      ctx.strokeStyle = g.paused ? 'rgba(255,200,0,0.8)' : 'rgba(255,100,100,0.8)';
      ctx.lineWidth   = 1;
      ctx.stroke();

      
      ctx.fillStyle = COLORS.guardVision;
      ctx.beginPath();
      ctx.arc(gc, gy, 36, 0, Math.PI * 2);
      ctx.fill();

     
      ctx.fillStyle  = 'rgba(255,255,255,0.5)';
      ctx.font       = '7px Courier New';
      ctx.textAlign  = 'center';
      ctx.fillText(g.paused ? '⏸' : '◉', gc, gy + 3);
    });
  }


  drawVignette() {
    const { ctx } = this;
    const vg = ctx.createRadialGradient(
      CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.3,
      CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.75
    );
    vg.addColorStop(0, 'transparent');
    vg.addColorStop(1, 'rgba(6,6,18,0.5)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }
}
