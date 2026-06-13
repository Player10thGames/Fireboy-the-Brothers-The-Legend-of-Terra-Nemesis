# Fireboy The Brothers - The Legend of Terra Nemesis (Boss Rush Mode)

A high-octane HTML5 arcade game featuring the Boss Rush Mode for Fireboy The Brothers series. Face 7 increasingly challenging bosses with 4 unique playable characters, each with distinct abilities and playstyles.

## Game Features

### 4 Playable Characters

- **Fireboy** - Balanced character with rapid fire ability (100 HP, 5 speed, 15 damage)
- **Caroline** - Energy blaster with wide spread attack (90 HP, 6 speed, 12 damage)
- **Butch** - Heavy hitter with powerful melee attacks (120 HP, 4 speed, 25 damage)
- **Anabel** - Precision shooter with homing projectiles (85 HP, 7 speed, 10 damage)

### 7 Boss Stages

1. **Double Mecha Rocket** - Laser beams and fire breath attacks
2. **Butch** - Charging attacks and destructible obstacles
3. **Mandler** - Rotating projectiles and gravity shifts
4. **Crusher-Bot MK.II** - Heavy stomp attacks and missile barrages
5. **Metal Sonic** - Speed dashes and homing projectiles
6. **The Roaring Knight** - Sword slashes with phase transitions
7. **Roaring Metal** (True Final Boss) - Combined attacks with enrage mode

### Core Mechanics

- **Health System** - Both player and bosses have health bars
- **Collision Detection** - Pixel-perfect AABB collision system
- **Projectile System** - Player and boss projectiles with damage calculation
- **Stage Progression** - Bosses become progressively harder
- **Gimmicks** - Each stage has unique environmental challenges

### Controls

**Keyboard:**
- Arrow Keys or WASD - Move
- Space or Z - Fire
- P or ESC - Pause

**Touch (Mobile):**
- D-Pad - Movement
- Fire Button - Attack
- Pause Button - Game control

## Technology Stack

- **Frontend:** React 19 + TypeScript
- **Rendering:** HTML5 Canvas 2D
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **Audio:** Web Audio API
- **Input:** Keyboard + Touch Events

## Project Structure

```
client/src/
├── engine/
│   ├── GameEngine.ts       - Core game loop and rendering
│   ├── Collision.ts        - Collision detection system
│   ├── InputManager.ts     - Keyboard and touch input
│   ├── AudioManager.ts     - Sound and music management
│   └── GameState.ts        - Game state management
├── entities/
│   ├── Player.ts           - Player class
│   ├── Boss.ts             - Boss base class
│   ├── Projectile.ts       - Projectile class
│   ├── characters.ts       - Character definitions
│   ├── bosses.ts           - Boss definitions
│   └── bosses/             - Individual boss implementations
├── components/
│   ├── GameCanvas.tsx      - Main game canvas
│   ├── HUD.tsx             - Health bars and UI
│   ├── TouchControls.tsx   - Mobile touch controls
│   └── ...
├── pages/
│   ├── CharacterSelect.tsx - Character selection screen
│   └── ...
└── lib/
    └── assetLoader.ts      - Asset management utility
```

## Game Flow

1. **Main Menu** - Start screen with game title
2. **Character Select** - Choose from 4 characters
3. **Boss Rush** - Face 7 bosses in sequence
4. **Game Over** - Victory or defeat screen
5. **Return to Menu** - Play again or exit

## Development

### Setup

```bash
pnpm install
pnpm dev
```

### Build

```bash
pnpm build
```

### Type Check

```bash
pnpm check
```

## Game Design

The game features a carefully balanced difficulty curve:

- **Stages 1-2:** Introduction to mechanics
- **Stages 3-4:** Increased complexity and speed
- **Stages 5-6:** Advanced patterns and multiple phases
- **Stage 7:** Ultimate challenge combining all mechanics

Each boss has unique attack patterns that cycle every 2 seconds, keeping gameplay dynamic and challenging.

## Assets

The game includes:
- **Music:** Boss battle theme, game over, stage clear
- **Sound Effects:** 13 unique sound effects for gameplay feedback
- **Sprites:** Character and boss artwork
- **UI:** Touch control graphics

## Features Implemented

✅ Core game engine with 60 FPS rendering
✅ 4 playable characters with unique stats
✅ 7 boss stages with distinct attack patterns
✅ Collision detection and physics
✅ Input system (keyboard + touch)
✅ Audio management system
✅ Character selection screen
✅ HUD with health bars and score
✅ Touch controls for mobile
✅ Game state management
✅ Asset loader utility
✅ TypeScript type safety

## Future Enhancements

- Integrate background music and sound effects
- Add particle effects for attacks
- Implement power-ups and special items
- Add difficulty levels (Easy, Normal, Hard)
- Leaderboard system
- Mobile app wrapper
- Multiplayer support

## License

This project is part of the Fireboy The Brothers series.

## Credits

**Game Design & Development:** Manus AI
**Original Fireboy Series:** Player10thGames
**Boss Designs:** Inspired by classic arcade games (Gradius, Sonic, Terra Cresta, Deltarune)

---

**Play the game and face the ultimate boss rush challenge!**
