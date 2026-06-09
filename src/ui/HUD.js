// ─────────────────────────────────────────────
//  CHRONO-CLONE · HUD
//  DOM-layer UI: timer bar, counters, messages.
//  No canvas drawing here – pure HTML/CSS.
// ─────────────────────────────────────────────

export class HUD {
  constructor() {
    this.$timerBar   = document.getElementById('timer-bar');
    this.$tlCount    = document.getElementById('tl-count');
    this.$roundCount = document.getElementById('round-count');
    this.$msgOverlay = document.getElementById('msg-overlay');
    this.$msgTitle   = document.getElementById('msg-title');
    this.$msgSub     = document.getElementById('msg-sub');
    this.$startBtn   = document.getElementById('startBtn');
    this.$rewindBtn  = document.getElementById('rewindBtn');
    this.$obj1       = document.getElementById('obj1');
    this.$obj2       = document.getElementById('obj2');
  }

  /** Update the timer bar width and colour. */
  setTimer(elapsed, total) {
    const pct = Math.max(0, 1 - elapsed / total);
    this.$timerBar.style.width = `${pct * 100}%`;
    this.$timerBar.style.background = pct < 0.3
      ? 'linear-gradient(90deg,#ff4444,#ff8844)'
      : 'linear-gradient(90deg,#00ff88,#64c8ff)';
  }

  setCounters(timelines, round) {
    this.$tlCount.textContent    = timelines;
    this.$roundCount.textContent = round;
  }

  setObjective(keyDone, exitDone) {
    this.$obj1.className = keyDone  ? 'obj-done' : '';
    this.$obj2.className = exitDone ? 'obj-done' : '';
  }

  showMessage(title, sub, danger = false) {
    this.$msgOverlay.style.display = 'block';
    this.$msgTitle.textContent     = title;
    this.$msgTitle.style.color          = danger ? '#ff4444' : '#64c8ff';
    this.$msgTitle.style.textShadow     = danger
      ? '0 0 30px #ff4444'
      : '0 0 30px #64c8ff';
    this.$msgSub.textContent = sub;
  }

  hideMessage() {
    this.$msgOverlay.style.display = 'none';
  }

  showPlayButtons(playingState) {
    this.$startBtn.style.display  = playingState ? 'none'         : 'inline-block';
    this.$rewindBtn.style.display = playingState ? 'inline-block' : 'none';
  }

  setStartLabel(label) {
    this.$startBtn.textContent = label;
  }

  onStart(fn)  { this.$startBtn.addEventListener('click', fn); }
  onRewind(fn) { this.$rewindBtn.addEventListener('click', fn); }
}
