const OUTER_R = 52;
const INNER_R = 26;

export class MobileControls {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
  }

  render(joy) {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = joy.active ? joy.startX   : canvas.width  / 2;
    const cy = joy.active ? joy.startY   : canvas.height / 2;
    let kx   = joy.active ? joy.currentX : cx;
    let ky   = joy.active ? joy.currentY : cy;

    if (joy.active) {
      const dx = kx - cx, dy = ky - cy;
      const d  = Math.hypot(dx, dy);
      if (d > OUTER_R - INNER_R) {
        kx = cx + (dx / d) * (OUTER_R - INNER_R);
        ky = cy + (dy / d) * (OUTER_R - INNER_R);
      }
    }

    ctx.beginPath();
    ctx.arc(cx, cy, OUTER_R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(100,200,255,0.25)';
    ctx.lineWidth   = 2;
    ctx.stroke();
    ctx.fillStyle   = 'rgba(100,200,255,0.06)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(kx, ky, INNER_R, 0, Math.PI * 2);
    ctx.fillStyle   = joy.active ? 'rgba(100,200,255,0.35)' : 'rgba(100,200,255,0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(100,200,255,0.5)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    const tickLen = 8, tickOff = OUTER_R + 8;
    ctx.strokeStyle = 'rgba(100,200,255,0.2)';
    ctx.lineWidth   = 1;
    [
      [cx, cy - tickOff, cx, cy - tickOff + tickLen],
      [cx, cy + tickOff - tickLen, cx, cy + tickOff],
      [cx - tickOff, cy, cx - tickOff + tickLen, cy],
      [cx + tickOff - tickLen, cy, cx + tickOff, cy],
    ].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });
  }
}