
import {
  MAP, MAP_ROWS, MAP_COLS,
  TILE, MAP_OX, MAP_OY,
  PLAYER_SIZE,
  SPAWN_TILE, KEY_TILE, EXIT_TILE,
  PRESSURE_TILES, GUARD_PATROL_TILES,
} from './constants.js';


export function tileToPixel(col, row) {
  return {
    x: MAP_OX + col * TILE,
    y: MAP_OY + row * TILE,
  };
}


export function pixelToTile(px, py) {
  return {
    col: Math.floor((px - MAP_OX) / TILE),
    row: Math.floor((py - MAP_OY) / TILE),
  };
}


export function isWall(px, py) {
  const { col, row } = pixelToTile(px, py);
  if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return true;
  return MAP[row][col] === 1;
}
export function isWallRect(x, y, w, h) {
  return (
    isWall(x,       y      ) ||
    isWall(x + w-1, y      ) ||
    isWall(x,       y + h-1) ||
    isWall(x + w-1, y + h-1)
  );
}


const sp = tileToPixel(SPAWN_TILE.col, SPAWN_TILE.row);
export const PLAYER_START = {
  x: sp.x + TILE / 2 - PLAYER_SIZE / 2,
  y: sp.y + TILE / 2 - PLAYER_SIZE / 2,
};

const kp = tileToPixel(KEY_TILE.col, KEY_TILE.row);
export const KEY_POS = { x: kp.x - 8, y: kp.y - 8 };   

const ep = tileToPixel(EXIT_TILE.col, EXIT_TILE.row);
export const EXIT_POS = { x: ep.x - 8, y: ep.y + 4 };

export const PRESSURE_PLATE_DEFS = PRESSURE_TILES.map(({ col, row }) => {
  const { x, y } = tileToPixel(col, row);
  return { x: x - 8, y: y - 8, w: 16, h: 16 };
});


export const GUARD_PATROL_PATHS = GUARD_PATROL_TILES.map(path =>
  path.map(({ c, r }) => {
    const { x, y } = tileToPixel(c, r);
    return { x, y };
  })
);

export { MAP, MAP_ROWS, MAP_COLS };
