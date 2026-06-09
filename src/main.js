// ─────────────────────────────────────────────
//  CHRONO-CLONE · main.js
//  Entry point – wires subsystems together.
// ─────────────────────────────────────────────

import { Game }         from './game/Game.js';
import { InputManager } from './game/InputManager.js';
import { HUD }          from './ui/HUD.js';

const canvas = document.getElementById('game-canvas');
const hud    = new HUD();
const input  = new InputManager();
const game   = new Game(canvas, hud, input);

// ── Wire up controls ──────────────────────────
hud.onStart(() => game.startGame());
hud.onRewind(() => game.rewind());

// Space bar = rewind while playing
input.on(' ', () => {
  if (game.state === 'playing') game.rewind();
  else if (game.state === 'won' || game.state === 'gameover') game.startGame();
});

// ── Show start message ────────────────────────
hud.showMessage('CHRONO·CLONE', 'WASD / ARROWS TO MOVE · SPACE TO REWIND');
hud.showPlayButtons(false);

// ── Start render loop ─────────────────────────
game.start();
