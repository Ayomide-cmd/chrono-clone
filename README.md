# Chrono-Clone 

A short single-screen stealth/strategy game where **time is your resource**.

You have seconds to steal a key and escape. Fail, and your run becomes a **ghost clone** that plays alongside you. Use your past selves to freeze guards on pressure plates while your new timeline slips through.

---

## Getting Started

No build step required. Just serve the project root over HTTP:

```bash
# Option 1 — VS Code Live Server extension (recommended)
# Right-click index.html → "Open with Live Server"

# Option 2 — Node.js
npx serve .

# Option 3 — Python
python3 -m http.server 8080
```

Then open `http://localhost:8080` (or whatever port your server reports).

> **Why a server?** ES modules (`type="module"`) require HTTP — you can't open `index.html` directly as a `file://` URL.

---

## Controls

| Key              | Action              |
|------------------|---------------------|
| `W A S D`        | Move                |
| `↑ ↓ ← →`       | Move (arrow keys)   |
| `Space`          | Rewind / create clone |
| Click **START**  | Start / restart     |
| Click **⟲ REWIND** | Same as Space    |

---

## Objective

1. Grab the **golden key** 🗝
2. Reach the **green exit** ▶ (only unlocks after picking up the key)
3. Avoid the **red guards** — they patrol fixed paths
4. Step on **purple pressure plates** to freeze guards (your ghost clones can do this too!)

---

## Folder Structure

```
chrono-clone/
├── index.html                  ← Entry point
├── README.md
└── src/
    ├── main.js                 ← Wires all systems together
    ├── game/
    │   ├── constants.js        ← All tunable values (speeds, sizes, colours, map)
    │   ├── map.js              ← Tile grid, collision helpers, entity positions
    │   ├── Game.js             ← Game loop + orchestrator
    │   ├── Player.js           ← Movement, collision, snapshot
    │   ├── Guard.js            ← Patrol AI + catch detection
    │   ├── PressurePlate.js    ← Ghost-aware activation logic
    │   ├── Timeline.js         ← TimelineRecorder + ghost playback (binary search)
    │   ├── EffectsManager.js   ← Screen shake, glitch scanlines, particles
    │   ├── InputManager.js     ← Keyboard state + one-shot callbacks
    │   └── Renderer.js         ← All canvas draw calls (no game logic)
    ├── ui/
    │   ├── HUD.js              ← DOM HUD: timer bar, counters, messages
    │   └── styles.css          ← All CSS
    └── utils/
        └── math.js             ← dist, lerp, clamp, mapRange
```

---

## Architecture Notes

### Time-Stamped Recording (Command Pattern)
Every frame the live player emits a `{ x, y, t }` snapshot. `t` is **elapsed seconds** since the round started — not a frame index. This means ghost playback stays in sync even under variable frame rates.

On rewind, the snapshot log is sealed into a `Timeline` object. The `frameAt(elapsed)` method uses **binary search** to find the closest frame in O(log n) time.

### Ghost Cooperation
`PressurePlate.update()` checks the live player *and* every sealed `Timeline` simultaneously. Any timeline standing on a plate freezes all guards — past selves cooperate automatically without any extra bookkeeping.

### Separation of Concerns
| Layer          | Responsibility                          |
|----------------|-----------------------------------------|
| `Game.js`      | State machine + update/render dispatch  |
| `Renderer.js`  | Pure draw calls, no logic               |
| `HUD.js`       | DOM updates only, no canvas             |
| `EffectsManager` | All juice — shake, glitch, particles  |
| `InputManager` | Keyboard abstraction, one-shot events   |
| `constants.js` | Single source of truth for all numbers  |

---

## Customisation

All tunable values live in `src/game/constants.js`:
- `ROUND_TIME` — seconds per attempt
- `MAX_ROUNDS` — maximum ghost clones
- `PLAYER_SPEED` — tweak for difficulty
- `GUARD_BASE_SPEED` / `GUARD_SPEED_STEP` — guard difficulty scaling
- `COLORS` — full neon palette
- `MAP` — edit the 2D array to redesign the level (0 = floor, 1 = wall)
- `GUARD_PATROL_TILES` — add/remove guards or change their paths
