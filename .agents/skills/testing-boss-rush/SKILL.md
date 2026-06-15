---
name: testing-boss-rush
description: Test the Boss Rush Mode HTML5 game end-to-end. Use when verifying gameplay, menus, or input handling changes.
---

# Testing Boss Rush Mode

## Setup

1. Start a local HTTP server from the repo root:
   ```bash
   cd /home/ubuntu/repos/Fireboy-the-Brothers-The-Legend-of-Terra-Nemesis
   python3 -m http.server 8080 &
   ```
2. Open `http://localhost:8080/index.html` in the browser
3. Force a cache-busting reload if testing code changes (use browser console: `window.location.reload(true)`)

## Key Test Flows

### Primary E2E: Menu → Character Select → Gameplay
1. Verify main menu shows 5 buttons: BOSS RUSH, STAGE SELECT, TIME ATTACK, OPTIONS, EXTRA
2. Click BOSS RUSH → character select shows 4 cards (Fireboy, Caroline, Butch, Anabel)
3. Click a character → orange border appears, START BOSS RUSH button enables
4. Click START → cutscene overlay appears with stage title and story text
5. Press Space (or click canvas first then hold Space) → cutscene dismisses
6. Boss Warning appears briefly, then gameplay starts with HUD

### Shooting & Damage
- Hold Space during gameplay to fire projectiles
- Score should increase as projectiles hit the boss
- Boss health bar should visibly decrease

### Pause Toggle (Bug-Prone Area)
- Press P → "PAUSED" overlay with RESUME and QUIT TO MENU buttons
- Press P again → game resumes, overlay disappears
- **Known past bug**: Pause could get stuck if input buffering fails

### Options Menu
- Click OPTIONS from main menu
- 4 settings: Music Volume, SFX Volume, Difficulty, Screen Shake
- Click +/- to adjust values
- Click BACK to return to main menu

## Gotchas & Lessons Learned

- **Input timing**: The game uses a `keyDownBuffer` to capture key presses between frames. If quick key taps aren't registering (e.g., cutscene won't dismiss), the buffer might not be working correctly. Use `hold_key` with ~0.15-0.2s duration instead of instant key presses.
- **Cache issues**: The browser aggressively caches `game.js`. After code changes, use `window.location.reload(true)` from the console or append a cache-busting query param to the URL.
- **Focus**: Click inside the game canvas before pressing keys if keyboard input isn't registering. The canvas/window needs focus to receive keydown events.
- **Game Over**: The player can die during testing. Use the MENU button on the Game Over screen to return to main menu.

## No Secrets Needed

This game runs entirely client-side with no authentication or API keys required.
