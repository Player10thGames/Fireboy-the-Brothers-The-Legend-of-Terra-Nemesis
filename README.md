# Fireboy The Brothers - The Legend of Terra Nemesis

A Brand New HTML5 Video Game

## 🎮 Game Features

### 4 Playable Characters
- **Fireboy** - Fire Warrior (Balanced stats)
- **Caroline** - Magic Knight (High jump, magic powers)
- **Butch** - Power House (High HP, strong attacks)
- **Anabel** - Swift Star (Fast speed, agile)

### Bosses
- **Duo Mecha Rocket / Big Core MK.I** (from Gradius) - A massive battleship that fires lasers in spread patterns. Gets more aggressive as HP decreases, adding spread shots and burst attacks.
- **Fire Breath** (from Sonic 3) - A flying dragon mech that drops fire bombs and breathes fire streams. Escalates with spread bombs and continuous fire in later phases.

### Music & Sound
- Procedurally generated boss battle music via Web Audio API
- Stage background music with melody and drums
- Actual WAV/MP3 audio file support (loads from repository assets)
- Sound effects: Jump, Shoot, Hit, Hurt, Boss Warning, Boss Defeat, Stage Clear, Game Over, Power-up, Block Break

### Gimmicks
- **Moving Platforms** - Horizontal and vertical moving platforms that carry the player
- **Breakable Blocks** - Shoot to crack and destroy; visual crack indicators
- **Power-ups**: Health (+), Rapid Fire (R), Shield (S) - floating items that bob up and down

### Touch Screen Controls
- **D-Pad** - Directional movement (Up/Down/Left/Right)
- **Action Button (B)** - Shoot projectiles
- **Play/Pause Button (▌▌)** - Pause/Resume game

## 🕹️ Controls

### Keyboard
| Action | Keys |
|--------|------|
| Move | Arrow Keys / WASD |
| Jump | Space / W / Up Arrow |
| Shoot | Z / X / J / K |
| Pause | Escape / P |

### Touch (Mobile)
| Action | Control |
|--------|---------|
| Move | D-Pad |
| Shoot | B Button |
| Pause | Pause Button |

## 🚀 How to Play
1. Open `index.html` in a modern web browser
2. Press SPACE or tap the screen to start
3. Select your character with Left/Right arrows (each has unique stats)
4. Navigate through the side-scrolling level, collecting power-ups
5. Reach the end to face the stage boss
6. Defeat the boss to clear the stage and advance!

## 🛠️ Technical Details
- Pure HTML5 Canvas game engine - no external dependencies
- Procedural audio via Web Audio API with WAV file fallback
- Responsive design - works on desktop and mobile devices
- All assets are local (images and audio files in same directory)
- Sprite-based rendering with fallback shapes when images unavailable
- Camera system with smooth following
- Particle system for explosions, power-up collection, and effects
- Screen shake for impact feedback

## 📁 Files
- `index.html` - Main game file (complete HTML5 game)
- `*.png` - Character sprites, boss sprites, backgrounds, UI elements
- `*.wav` - Sound effect files
- `*.mp3` - Music files
