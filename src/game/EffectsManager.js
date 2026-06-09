
import {
  REWIND_PARTICLES,
  SHAKE_FRAMES,
  SHAKE_MAGNITUDE,
  GLITCH_FRAMES,
  CANVAS_W,
  CANVAS_H,
} from './constants.js';

export class EffectsManager {
  constructor() {
    this.particles   = [];
    this.shakeTimer  = 0;
    this.shakeX      = 0;
    this.shakeY      = 0;
    this.glitchTimer = 0;
  }


  triggerRewind() {
    this.shakeTimer  = SHAKE_FRAMES;
    this.glitchTimer = GLITCH_FRAMES;

    for (let i = 0; i < REWIND_PARTICLES; i++) {
      this.particles.push({
        x:       Math.random() * CANVAS_W,
        y:       Math.random() * CANVAS_H,
        vx:      (Math.random() - 0.5) * 8,
        vy:      (Math.random() - 0.5) * 8,
        life:    1,
        maxLife: 0.5 + Math.random() * 0.8,
        col:     `hsl(${180 + Math.random() * 60},100%,${60 + Math.random() * 20}%)`,
      });
    }
  }

  
  triggerDeath() {
    this.shakeTimer  = SHAKE_FRAMES * 1.5;
    this.glitchTimer = GLITCH_FRAMES * 0.6;
  }

  
  update(dt) {
    
    this.particles = this.particles.filter(p => {
      p.x   += p.vx;
      p.y   += p.vy;
      p.vx  *= 0.92;
      p.vy  *= 0.92;
      p.life -= dt / p.maxLife;
      return p.life > 0;
    });

    
    if (this.shakeTimer > 0) {
      const intensity = this.shakeTimer / SHAKE_FRAMES;
      this.shakeX = (Math.random() - 0.5) * SHAKE_MAGNITUDE * intensity;
      this.shakeY = (Math.random() - 0.5) * SHAKE_MAGNITUDE * intensity;
      this.shakeTimer--;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
    }

    if (this.glitchTimer > 0) this.glitchTimer--;
  }

  
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  renderParticles(ctx) {
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle   = p.col;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2 + p.life * 2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} ctx
   */
  renderGlitch(canvas, ctx) {
    if (!this.glitchTimer) return;
    const gi = this.glitchTimer / GLITCH_FRAMES;

    for (let i = 0; i < 4; i++) {
      const sy  = Math.random() * CANVAS_H;
      const sh  = 2 + Math.random() * 8;
      const sx  = (Math.random() - 0.5) * 20 * gi;
      ctx.drawImage(canvas, 0, sy, CANVAS_W, sh, sx, sy, CANVAS_W, sh);
    }

    ctx.fillStyle = `rgba(100,200,255,${gi * 0.05})`;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    if (Math.random() < 0.3) {
      ctx.fillStyle = `rgba(255,100,150,${gi * 0.03})`;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
  }

  get isShaking()  { return this.shakeTimer  > 0; }
  get isGlitching(){ return this.glitchTimer > 0; }
}
