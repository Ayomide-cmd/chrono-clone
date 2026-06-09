

export const CANVAS_W = 680;
export const CANVAS_H = 460;

export const TILE = 32;


export const PLAYER_SIZE   = 14;
export const PLAYER_SPEED  = 2.2;

// ── Timing ────────────────────────────────────
export const ROUND_TIME  = 7;    // seconds per timeline attempt
export const MAX_ROUNDS  = 5;    // max ghost clones before game over

// ── Guard ─────────────────────────────────────
export const GUARD_SIZE        = 12;
export const GUARD_BASE_SPEED  = 0.8;
export const GUARD_SPEED_STEP  = 0.25;  // each guard is faster by this amount
export const GUARD_CATCH_DIST  = 20;    // pixels – triggers death
export const GUARD_VISION_RADIUS = 36;

// ── Key / Exit ────────────────────────────────
export const KEY_COLLECT_DIST  = 18;
export const EXIT_COLLECT_DIST = 22;

// ── Effects ───────────────────────────────────
export const REWIND_PARTICLES   = 60;
export const SHAKE_FRAMES       = 20;
export const SHAKE_MAGNITUDE    = 6;
export const GLITCH_FRAMES      = 25;
export const TRAIL_LENGTH       = 10;   // frames of motion trail
export const GHOST_TRAIL_LENGTH = 8;

// ── Colors ────────────────────────────────────
export const COLORS = {
  bg:            '#060612',
  floor:         '#0a0a1e',
  wallFace:      '#12123a',
  wallBg:        '#0b0b28',
  wallBorder:    'rgba(100,150,255,0.08)',

  player:        '#64c8ff',
  playerGlow:    'rgba(100,200,255,0.4)',
  playerTrail:   'rgba(100,200,255,0.15)',

  key:           '#ffd700',
  keyGlow:       'rgba(255,215,0,0.3)',

  exit:          '#00ff88',
  exitGlow:      'rgba(0,255,136,0.4)',
  exitLocked:    'rgba(0,150,80,0.3)',

  guard:         '#ff4444',
  guardGlow:     'rgba(255,60,60,0.3)',
  guardPaused:   '#ffaa00',
  guardVision:   'rgba(255,60,60,0.15)',

  pressure:      '#8855ff',
  pressureActive:'#aa88ff',
  pressureGlow:  'rgba(170,136,255,0.25)',

  // Ghost clone palette – indexed by timeline number
  ghost: [
    'rgba(255,107,157,0.7)',
    'rgba(200,150,255,0.7)',
    'rgba(255,200,100,0.7)',
    'rgba(100,255,200,0.7)',
  ],
  ghostGlow: [
    'rgba(255,107,157,0.2)',
    'rgba(200,150,255,0.2)',
    'rgba(255,200,100,0.2)',
    'rgba(100,255,200,0.2)',
  ],
};

// ── Map legend ────────────────────────────────
// 0 = floor  |  1 = wall
export const MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
  [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,1,1,0,1,0,1,1,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export const MAP_ROWS = MAP.length;
export const MAP_COLS = MAP[0].length;

export const MAP_OX = (CANVAS_W - MAP_COLS * TILE) / 2;
export const MAP_OY = (CANVAS_H - MAP_ROWS * TILE) / 2;


export const SPAWN_TILE   = { col: 1, row: 1 };
export const KEY_TILE     = { col: 10, row: 7 };
export const EXIT_TILE    = { col: 19, row: 1 };


export const PRESSURE_TILES = [
  { col: 5, row: 6 },
  { col: 15, row: 6 },
];


export const GUARD_PATROL_TILES = [
  [ {c:3,r:2},{c:9,r:2},{c:9,r:5},{c:3,r:5} ],
  [ {c:13,r:9},{c:19,r:9},{c:19,r:12},{c:13,r:12} ],
  [ {c:5,r:9},{c:9,r:9},{c:7,r:12} ],
];
