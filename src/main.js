import { Game }           from './game/Game.js';
import { InputManager }   from './game/InputManager.js';
import { MobileControls } from './game/MobileControls.js';
import { HUD }            from './ui/HUD.js';
import { CANVAS_W, CANVAS_H } from './game/constants.js';

const gameCanvas      = document.getElementById('game-canvas');
const joystickCanvas  = document.getElementById('joystick-canvas');
const mobileRewindBtn = document.getElementById('mobile-rewind-btn');

const hud      = new HUD();
const input    = new InputManager();
const game     = new Game(gameCanvas, hud, input);
const joyCtrls = new MobileControls(joystickCanvas);

function resizeCanvas() {
  const scale   = Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H);
  const offsetX = (window.innerWidth  - CANVAS_W * scale) / 2;
  const offsetY = (window.innerHeight - CANVAS_H * scale) / 2;
  gameCanvas.style.transform       = `translate(${offsetX}px,${offsetY}px) scale(${scale})`;
  gameCanvas.style.transformOrigin = 'top left';
}

function resizeJoystick() {
  joystickCanvas.width  = joystickCanvas.offsetWidth;
  joystickCanvas.height = joystickCanvas.offsetHeight;
}

window.addEventListener('resize',            () => { resizeCanvas(); resizeJoystick(); });
window.addEventListener('orientationchange', () => { resizeCanvas(); resizeJoystick(); });
resizeCanvas();
resizeJoystick();

hud.onStart(()  => game.startGame());
hud.onRewind(() => game.rewind());

input.on(' ', () => {
  if (game.state === 'playing') game.rewind();
  else if (game.state === 'won' || game.state === 'gameover') game.startGame();
});

input.on('rewind', () => {
  if (game.state === 'playing') game.rewind();
  else if (game.state === 'won' || game.state === 'gameover') game.startGame();
});

input.setupMobileControls(joystickCanvas, mobileRewindBtn);

const _origRender = game._render.bind(game);
game._render = function () {
  _origRender();
  if (joystickCanvas.offsetParent !== null) {
    joyCtrls.render(input.getJoystickState());
  }
};

hud.showMessage('CHRONO·CLONE', 'TAP START · DRAG LEFT TO MOVE · TAP ⟲ TO REWIND');
hud.showPlayButtons(false);

game.start();