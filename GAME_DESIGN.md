# Fireboy The Brothers - The Legend of Terra Nemesis: Boss Rush Mode
## Game Design Document

---

## 1. Project Overview

**Title:** Fireboy The Brothers - The Legend of Terra Nemesis (Boss Rush Mode)

**Genre:** Action Arcade / Boss Rush

**Platform:** HTML5 Canvas (Web-based)

**Target Audience:** Retro game enthusiasts, arcade fans, casual gamers

**Core Concept:** A fast-paced boss rush mode where players select from 4 unique characters and face 7 progressively challenging boss encounters, culminating in a true final boss battle.

---

## 2. Game Features

### 2.1 Playable Characters

| Character | Origin | Special Ability | Fire Type |
|-----------|--------|-----------------|-----------|
| **Fireboy** | Fireboy & Watergirl | Fire Burst (rapid fire) | Standard Fire |
| **Caroline** | Powerpuff Girls | Energy Blast (wide spread) | Pink Energy |
| **Butch** | Rowdyruff Boys | Power Punch (close range) | Red Fury |
| **Anabel** | Original Character | Precision Shots (accurate) | Blue Precision |

### 2.2 Boss Stages

| Stage | Boss Name | Origin | Attack Pattern | Gimmick |
|-------|-----------|--------|-----------------|---------|
| 1 | Double Mecha Rocket | Gradius + Sonic 3 | Laser beams + fire breath | Moving platforms |
| 2 | Butch | Rowdyruff Boys | Charging attacks | Destructible obstacles |
| 3 | Mandler | Terra Cresta | Rotating projectiles | Gravity shifts |
| 4 | Crusher-Bot MK.II | Original | Heavy impacts | Shockwave attacks |
| 5 | Metal Sonic | Sonic Series | Speed dashes | Ring collection |
| 6 | The Roaring Knight | Deltarune | Sword slashes | Phase transitions |
| 7 (True Final) | Roaring Metal | Hybrid Boss | Combined attacks | Full power unleashed |

### 2.3 Game Mechanics

- **Health System:** Both player and bosses have health bars
- **Damage System:** Different characters deal different damage types
- **Projectile System:** Player fires projectiles; bosses launch attacks
- **Collision Detection:** Pixel-perfect collision for fair gameplay
- **Stage Progression:** Bosses become progressively harder with more complex patterns
- **Gimmicks:** Each stage has unique environmental or mechanical challenges

### 2.4 Touch Controls

- **D-Pad:** Movement (up, down, left, right)
- **Action Button:** Fire/Attack
- **Play/Pause Button:** Game state control

---

## 3. Technical Architecture

### 3.1 Technology Stack

- **Rendering:** HTML5 Canvas 2D Context
- **Language:** TypeScript + React (for UI overlay)
- **Audio:** Web Audio API
- **Input Handling:** Keyboard + Touch Events
- **Build Tool:** Vite

### 3.2 Game Engine Components

```
GameEngine
├── Canvas Renderer
├── Physics Engine
├── Collision Detector
├── Input Manager (Keyboard + Touch)
├── Audio Manager
├── Game State Manager
├── Character System
├── Boss System
└── UI Manager
```

### 3.3 File Structure

```
client/src/
├── pages/
│   ├── Game.tsx (Main game canvas)
│   ├── CharacterSelect.tsx (Character selection screen)
│   └── GameOver.tsx (End screen)
├── components/
│   ├── GameCanvas.tsx (Canvas wrapper)
│   ├── TouchControls.tsx (D-Pad + buttons)
│   └── HUD.tsx (Health bars, score)
├── engine/
│   ├── GameEngine.ts (Core engine)
│   ├── Renderer.ts (Canvas rendering)
│   ├── Physics.ts (Physics calculations)
│   ├── Collision.ts (Collision detection)
│   ├── InputManager.ts (Input handling)
│   └── AudioManager.ts (Sound management)
├── entities/
│   ├── Player.ts (Player class)
│   ├── Boss.ts (Boss base class)
│   ├── Projectile.ts (Projectile class)
│   └── bosses/ (Individual boss implementations)
└── assets/ (Asset references)
```

---

## 4. Character Specifications

### 4.1 Fireboy
- **Health:** 100 HP
- **Speed:** 5 px/frame
- **Fire Rate:** 150ms
- **Damage:** 15 per shot
- **Special:** Rapid fire mode (hold button)

### 4.2 Caroline
- **Health:** 90 HP
- **Speed:** 6 px/frame
- **Fire Rate:** 200ms
- **Damage:** 12 per shot (but spreads 3 projectiles)
- **Special:** Wide spread attack

### 4.3 Butch
- **Health:** 120 HP
- **Speed:** 4 px/frame
- **Fire Rate:** 300ms
- **Damage:** 25 per shot
- **Special:** Melee punch attack (close range)

### 4.4 Anabel
- **Health:** 85 HP
- **Speed:** 7 px/frame
- **Fire Rate:** 100ms
- **Damage:** 10 per shot
- **Special:** Precision targeting (homing shots)

---

## 5. Boss Specifications

### 5.1 Stage 1: Double Mecha Rocket

**Health:** 200 HP

**Attack Patterns:**
- Pattern A: Horizontal laser beams (3 waves)
- Pattern B: Fire breath spray (left to right)
- Pattern C: Combination attack (both simultaneously)

**Gimmick:** Moving platforms appear/disappear every 3 seconds

**Difficulty:** Easy (Tutorial-like)

### 5.2 Stage 2: Butch

**Health:** 250 HP

**Attack Patterns:**
- Pattern A: Charging dash attack
- Pattern B: Explosive punch (creates shockwave)
- Pattern C: Multi-hit combo

**Gimmick:** Destructible obstacles block shots; must break through

**Difficulty:** Medium

### 5.3 Stage 3: Mandler

**Health:** 280 HP

**Attack Patterns:**
- Pattern A: Rotating projectile rings
- Pattern B: Spiral attack
- Pattern C: Gravity well (pulls player toward center)

**Gimmick:** Gravity shifts every 5 seconds (affects player movement)

**Difficulty:** Medium-Hard

### 5.4 Stage 4: Crusher-Bot MK.II

**Health:** 300 HP

**Attack Patterns:**
- Pattern A: Heavy stomp (creates shockwave)
- Pattern B: Missile barrage
- Pattern C: Combination stomp + missiles

**Gimmick:** Shockwaves push player back; must maintain position

**Difficulty:** Hard

### 5.5 Stage 5: Metal Sonic

**Health:** 280 HP

**Attack Patterns:**
- Pattern A: Speed dash (left-right)
- Pattern B: Homing projectiles
- Pattern C: Spin attack

**Gimmick:** Rings appear on screen; collecting them grants temporary shield

**Difficulty:** Hard

### 5.6 Stage 6: The Roaring Knight

**Health:** 350 HP

**Attack Patterns:**
- Pattern A: Sword slash (melee range)
- Pattern B: Energy wave projection
- Pattern C: Phase transition (becomes invulnerable, repositions)

**Gimmick:** Boss phases change at 75%, 50%, and 25% health

**Difficulty:** Very Hard

### 5.7 Stage 7: Roaring Metal (True Final Boss)

**Health:** 500 HP

**Attack Patterns:**
- Pattern A: Combined laser + fire breath
- Pattern B: Charging dash + sword slash
- Pattern C: Full power unleashed (all attacks simultaneously)
- Pattern D: Enrage mode (at 50% health)

**Gimmick:** Boss combines abilities from all previous bosses

**Difficulty:** Extreme

---

## 6. Audio Assets

| Asset | Type | Duration | Use |
|-------|------|----------|-----|
| 13 Last Evil [Boss Battle].mp3 | Music | ~3:40 | Boss battle theme |
| 21. Game Over.mp3 | Music | ~0:10 | Game over screen |
| 23. Stage Clear.mp3 | Music | ~0:05 | Stage victory |
| BigCore_Laser.wav | SFX | ~0:1 | Laser fire sound |
| BossDefeat_Explosion.wav | SFX | ~0:5 | Boss defeat explosion |
| BossWarning.wav | SFX | ~0:3 | Boss appearance warning |
| HitBoss.wav | SFX | ~0:1 | Hit confirmation |
| Jump.wav | SFX | ~0:1 | Player jump/dodge |
| PlayerDeath.wav | SFX | ~0:2 | Player death |
| PlayerHurt.wav | SFX | ~0:1 | Player damage |
| Player_FireShoot.wav | SFX | ~0:1 | Player fire shot |
| Strain.wav | SFX | ~0:2 | Tension/charge |
| Strain2.wav | SFX | ~0:2 | Tension/charge variant |
| Impact2.wav | SFX | ~0:1 | Impact sound |

---

## 7. Visual Assets

| Asset | Type | Use |
|-------|------|-----|
| Background (Space).png | Background | Game arena background |
| Foreground (Platform).png | Foreground | Platform layer |
| Fireboy (Playable Characters).png | Sprite | Fireboy character |
| Caroline (Playable Characters).png | Sprite | Caroline character |
| Butch (Playable Characters).png | Sprite | Butch character |
| Anabel (Playable Characters).png | Sprite | Anabel character |
| Big Core MK.I (Boss).png | Sprite | Stage 1 boss |
| Fire Breath (Boss).png | Sprite | Fire breath attack |
| Fake Butch (Boss).png | Sprite | Stage 2 boss |
| Mandler from Terra Cresta (Boss).png | Sprite | Stage 3 boss |
| Crusher-Bot MK.II (Boss).png | Sprite | Stage 4 boss |
| Metal Sonic (Boss).png | Sprite | Stage 5 boss |
| Roaring Knight from Deltarune (Final Boss).png | Sprite | Stage 6 boss |
| Roaring Metal - Roaring Knight x Metal Sonic (True Final Boss).png | Sprite | Stage 7 boss |
| D-Pad.png | UI | Touch D-Pad control |
| Button.png | UI | Touch action button |
| Play.png | UI | Play button |
| BigCore_Laser.png | Projectile | Laser projectile |
| FireBreath_Bomb.png | Projectile | Fire breath projectile |

---

## 8. Game Flow

```
Start Screen
    ↓
Character Select Screen
    ↓
Stage 1: Double Mecha Rocket
    ↓ (Victory)
Stage 2: Butch
    ↓ (Victory)
Stage 3: Mandler
    ↓ (Victory)
Stage 4: Crusher-Bot MK.II
    ↓ (Victory)
Stage 5: Metal Sonic
    ↓ (Victory)
Stage 6: The Roaring Knight
    ↓ (Victory)
Stage 7: Roaring Metal (True Final Boss)
    ↓ (Victory)
Victory Screen
    ↓
Return to Start / Play Again
```

---

## 9. Difficulty Progression

- **Stage 1-2:** Introduction to mechanics
- **Stage 3-4:** Increased complexity and speed
- **Stage 5-6:** Advanced patterns and multiple phases
- **Stage 7:** Ultimate challenge combining all mechanics

---

## 10. Development Phases

### Phase 1: Core Engine
- Canvas setup and rendering loop
- Input system (keyboard + touch)
- Basic physics and collision detection

### Phase 2: Character Implementation
- Character select screen
- Player movement and firing
- Character-specific mechanics

### Phase 3: Boss Implementation
- Boss base class and AI
- Individual boss implementations
- Attack pattern systems

### Phase 4: Polish & Audio
- Sound effects integration
- Music implementation
- UI refinement
- Touch control optimization

### Phase 5: Testing & Deployment
- Gameplay testing
- Balance adjustments
- Performance optimization
- GitHub deployment

---

## 11. Success Criteria

- [ ] All 4 characters playable with unique mechanics
- [ ] All 7 boss stages implemented with distinct patterns
- [ ] Touch controls fully functional (D-Pad, buttons)
- [ ] Audio system working (music + SFX)
- [ ] Collision detection accurate and fair
- [ ] Game runs smoothly at 60 FPS
- [ ] Mobile-responsive design
- [ ] Code pushed to GitHub repository

---

## 12. Notes

- Game is designed for both desktop and mobile play
- Touch controls are essential for mobile experience
- Boss difficulty should scale appropriately to maintain engagement
- Audio should enhance immersion without overwhelming gameplay
- All assets are pre-provided; no external asset creation needed
