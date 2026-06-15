/**
 * FIREBOY THE BROTHERS - THE LEGEND OF TERRA NEMESIS
 * Boss Rush Mode - Complete Game Engine
 */

// ==================== CONSTANTS ====================
const CANVAS_W = 960;
const CANVAS_H = 540;
const GRAVITY = 0.6;
const GROUND_Y = CANVAS_H - 80;

// ==================== GAME STATE ====================
const GameState = {
  MENU: 'menu',
  CHAR_SELECT: 'charSelect',
  STAGE_SELECT: 'stageSelect',
  OPTIONS: 'options',
  TIME_ATTACK: 'timeAttack',
  EXTRA: 'extra',
  PLAYING: 'playing',
  CUTSCENE: 'cutscene',
  BOSS_WARNING: 'bossWarning',
  STAGE_CLEAR: 'stageClear',
  GAME_OVER: 'gameOver',
  PAUSED: 'paused',
  VICTORY: 'victory'
};

// ==================== CHARACTER DEFINITIONS ====================
const CHARACTERS = {
  fireboy: {
    id: 'fireboy',
    name: 'Fireboy',
    description: 'Balanced fighter with rapid fire',
    color: '#FF6B6B',
    hp: 100,
    speed: 5,
    jumpPower: 12,
    damage: 15,
    fireRate: 150,
    projectileSpeed: 10,
    projectileColor: '#FF4500',
    special: 'rapid'
  },
  caroline: {
    id: 'caroline',
    name: 'Caroline',
    description: 'Energy blaster, wide spread',
    color: '#FF69B4',
    hp: 90,
    speed: 6,
    jumpPower: 13,
    damage: 12,
    fireRate: 200,
    projectileSpeed: 8,
    projectileColor: '#FF69B4',
    special: 'spread'
  },
  butch: {
    id: 'butch',
    name: 'Butch',
    description: 'Heavy hitter, powerful melee',
    color: '#DC143C',
    hp: 120,
    speed: 4,
    jumpPower: 10,
    damage: 25,
    fireRate: 350,
    projectileSpeed: 7,
    projectileColor: '#DC143C',
    special: 'power'
  },
  anabel: {
    id: 'anabel',
    name: 'Anabel',
    description: 'Precision shooter, homing shots',
    color: '#4169E1',
    hp: 85,
    speed: 7,
    jumpPower: 14,
    damage: 10,
    fireRate: 100,
    projectileSpeed: 9,
    projectileColor: '#4169E1',
    special: 'homing'
  }
};

// ==================== STAGE DEFINITIONS ====================
const STAGES = [
  {
    id: 1,
    name: 'Duo Mecha Rocket',
    boss: 'Big Core MK.I & Fire Breath',
    bossColor: '#FF4500',
    hp: 400,
    music: 'Double Trouble (Double Mecha Rocket - Big Core MK.I from Gradius x Fire Breath from Sonic 3) (Stage 1 Boss).mp3',
    gimmick: 'laser_walls',
    cutsceneBefore: 'The mechanical terrors have awakened! Big Core MK.I and Fire Breath combine their forces!',
    cutsceneAfter: 'The Duo Mecha Rocket is destroyed! But more enemies await...'
  },
  {
    id: 2,
    name: 'Butch (Rowdyruff Boys)',
    boss: 'Butch',
    bossColor: '#228B22',
    hp: 500,
    music: 'Butch from Rowdyruff Boys (Stage 2 Boss).mp3',
    gimmick: 'destructible_blocks',
    cutsceneBefore: 'Butch of the Rowdyruff Boys stands in your way! He won\'t go down easy!',
    cutsceneAfter: 'Butch has been defeated! His strength was no match for your resolve!'
  },
  {
    id: 3,
    name: 'Mandler (Terra Cresta)',
    boss: 'Mandler',
    bossColor: '#9932CC',
    hp: 600,
    music: '13 Last Evil [Boss Battle].mp3',
    gimmick: 'gravity_shift',
    cutsceneBefore: 'Mandler from Terra Cresta descends from the cosmos! Gravity itself bends to his will!',
    cutsceneAfter: 'Mandler crumbles! The gravity distortions fade away...'
  },
  {
    id: 4,
    name: 'Crusher-Bot MK.II',
    boss: 'Crusher-Bot MK.II',
    bossColor: '#708090',
    hp: 700,
    music: '13 Last Evil [Boss Battle].mp3',
    gimmick: 'falling_debris',
    cutsceneBefore: 'Crusher-Bot MK.II activates! Its massive frame shakes the ground!',
    cutsceneAfter: 'Crusher-Bot MK.II explodes into scrap! The way forward is clear!'
  },
  {
    id: 5,
    name: 'Metal Sonic',
    boss: 'Metal Sonic',
    bossColor: '#1E90FF',
    hp: 800,
    music: 'Metal Sonic (Stage 5 Boss).mp3',
    gimmick: 'speed_zones',
    cutsceneBefore: 'Metal Sonic appears in a flash of blue light! His speed is unmatched!',
    cutsceneAfter: 'Metal Sonic sparks and collapses! But this isn\'t over yet...'
  },
  {
    id: 6,
    name: 'Roaring Knight (Finale)',
    boss: 'Roaring Knight',
    bossColor: '#FFD700',
    hp: 1000,
    music: '13 Last Evil [Boss Battle].mp3',
    gimmick: 'phase_shift',
    cutsceneBefore: 'The Roaring Knight emerges from the shadows of Deltarune! Prepare for the final battle!',
    cutsceneAfter: 'The Roaring Knight kneels... but a dark energy stirs behind it!'
  },
  {
    id: 7,
    name: 'Roaring Metal (True Finale)',
    boss: 'Roaring Knight × Metal Sonic',
    bossColor: '#FF1493',
    hp: 1500,
    music: 'Roaring Metal - Roaring Knight x Metal Sonic (Stage 7 True Finale Boss).mp3',
    gimmick: 'enrage_all',
    cutsceneBefore: 'The Roaring Knight and Metal Sonic fuse into ROARING METAL! This is the TRUE final battle!',
    cutsceneAfter: 'ROARING METAL is vanquished! Peace returns to the world! YOU ARE THE CHAMPION!'
  }
];

// ==================== AUDIO MANAGER ====================
class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;
    this.muted = false;
  }

  loadSound(name, src) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    this.sounds[name] = audio;
  }

  playSound(name) {
    if (this.muted) return;
    const sound = this.sounds[name];
    if (sound) {
      const clone = sound.cloneNode();
      clone.volume = this.sfxVolume;
      clone.play().catch(() => {});
    }
  }

  playMusic(src) {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
    }
    this.music = new Audio(src);
    this.music.loop = true;
    this.music.volume = this.musicVolume;
    if (!this.muted) {
      this.music.play().catch(() => {});
    }
  }

  stopMusic() {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
    }
  }

  setMusicVolume(v) {
    this.musicVolume = v;
    if (this.music) this.music.volume = v;
  }

  setSfxVolume(v) {
    this.sfxVolume = v;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.music) this.music.pause();
    else if (!this.muted && this.music) this.music.play().catch(() => {});
  }
}

// ==================== INPUT MANAGER ====================
class InputManager {
  constructor() {
    this.keys = {};
    this.touch = { left: false, right: false, up: false, down: false, fire: false, jump: false, pause: false };
    this.justPressed = {};
    this.prevKeys = {};
    this.setupKeyboard();
    this.setupTouch();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      e.preventDefault();
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      e.preventDefault();
    });
  }

  setupTouch() {
    const bind = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); this.touch[key] = true; });
      el.addEventListener('touchend', (e) => { e.preventDefault(); this.touch[key] = false; });
      el.addEventListener('touchcancel', (e) => { e.preventDefault(); this.touch[key] = false; });
      el.addEventListener('mousedown', (e) => { e.preventDefault(); this.touch[key] = true; });
      el.addEventListener('mouseup', (e) => { e.preventDefault(); this.touch[key] = false; });
      el.addEventListener('mouseleave', (e) => { this.touch[key] = false; });
    };
    bind('dpad-up', 'up');
    bind('dpad-down', 'down');
    bind('dpad-left', 'left');
    bind('dpad-right', 'right');
    bind('btn-fire', 'fire');
    bind('btn-jump', 'jump');
    bind('btn-pause', 'pause');
  }

  update() {
    for (const key in this.keys) {
      this.justPressed[key] = this.keys[key] && !this.prevKeys[key];
    }
    this.prevKeys = { ...this.keys };
  }

  isLeft() { return this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touch.left; }
  isRight() { return this.keys['ArrowRight'] || this.keys['KeyD'] || this.touch.right; }
  isUp() { return this.keys['ArrowUp'] || this.keys['KeyW'] || this.touch.up || this.touch.jump; }
  isDown() { return this.keys['ArrowDown'] || this.keys['KeyS'] || this.touch.down; }
  isFire() { return this.keys['Space'] || this.keys['KeyZ'] || this.touch.fire; }
  isJump() { return this.keys['ArrowUp'] || this.keys['KeyW'] || this.keys['KeyX'] || this.touch.up || this.touch.jump; }
  isPause() { return this.justPressed['KeyP'] || this.justPressed['Escape'] || this.touch.pause; }
  isAnyKey() { return Object.values(this.keys).some(v => v) || Object.values(this.touch).some(v => v); }
}

// ==================== PARTICLE SYSTEM ====================
class Particle {
  constructor(x, y, vx, vy, color, life) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    this.size = 3 + Math.random() * 3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1;
    this.life--;
    this.size *= 0.97;
  }

  draw(ctx) {
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    ctx.globalAlpha = 1;
  }

  isDead() { return this.life <= 0; }
}

// ==================== PROJECTILE ====================
class Projectile {
  constructor(x, y, vx, vy, damage, owner, color, width, height) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.owner = owner;
    this.color = color || (owner === 'player' ? '#ffcc00' : '#ff00ff');
    this.width = width || 12;
    this.height = height || 8;
    this.active = true;
  }

  update(target) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -50 || this.x > CANVAS_W + 50 || this.y < -50 || this.y > CANVAS_H + 50) {
      this.active = false;
    }
    // Homing behavior
    if (this.homing && target) {
      const dx = target.x + target.width / 2 - this.x;
      const dy = target.y + target.height / 2 - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        this.vx += (dx / dist) * 0.3;
        this.vy += (dy / dist) * 0.3;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 8) {
          this.vx = (this.vx / speed) * 8;
          this.vy = (this.vy / speed) * 8;
        }
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.shadowBlur = 0;
  }
}

// ==================== PLAYER ====================
class Player {
  constructor(charDef) {
    this.charDef = charDef;
    this.width = 48;
    this.height = 56;
    this.x = 80;
    this.y = GROUND_Y - this.height;
    this.vx = 0;
    this.vy = 0;
    this.hp = charDef.hp;
    this.maxHp = charDef.hp;
    this.speed = charDef.speed;
    this.jumpPower = charDef.jumpPower;
    this.damage = charDef.damage;
    this.fireRate = charDef.fireRate;
    this.lastFire = 0;
    this.onGround = true;
    this.facing = 1;
    this.invincible = 0;
    this.projectiles = [];
    this.animFrame = 0;
    this.animTimer = 0;
  }

  update(input, now, homingTarget) {
    // Movement
    this.vx = 0;
    if (input.isLeft()) { this.vx = -this.speed; this.facing = -1; }
    if (input.isRight()) { this.vx = this.speed; this.facing = 1; }

    // Jump
    if (input.isJump() && this.onGround) {
      this.vy = -this.jumpPower;
      this.onGround = false;
    }

    // Gravity
    this.vy += GRAVITY;
    this.x += this.vx;
    this.y += this.vy;

    // Ground collision
    if (this.y >= GROUND_Y - this.height) {
      this.y = GROUND_Y - this.height;
      this.vy = 0;
      this.onGround = true;
    }

    // Boundaries
    this.x = Math.max(0, Math.min(this.x, CANVAS_W - this.width));
    this.y = Math.max(0, Math.min(this.y, CANVAS_H - this.height));

    // Shooting
    if (input.isFire() && now - this.lastFire > this.fireRate) {
      this.shoot();
      this.lastFire = now;
    }

    // Update projectiles
    this.projectiles = this.projectiles.filter(p => p.active);
    this.projectiles.forEach(p => p.update(homingTarget));

    // Invincibility timer
    if (this.invincible > 0) this.invincible--;

    // Animation
    this.animTimer++;
    if (this.animTimer > 8) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }
  }

  shoot() {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    switch (this.charDef.special) {
      case 'spread': {
        for (let i = -1; i <= 1; i++) {
          const p = new Projectile(
            cx, cy,
            this.charDef.projectileSpeed * this.facing,
            i * 2,
            this.damage, 'player', this.charDef.projectileColor
          );
          this.projectiles.push(p);
        }
        break;
      }
      case 'power': {
        const p = new Projectile(
          cx, cy,
          this.charDef.projectileSpeed * this.facing, 0,
          this.damage, 'player', this.charDef.projectileColor, 20, 14
        );
        this.projectiles.push(p);
        break;
      }
      case 'homing': {
        const p = new Projectile(
          cx, cy,
          this.charDef.projectileSpeed * this.facing, 0,
          this.damage, 'player', this.charDef.projectileColor, 10, 10
        );
        p.homing = true;
        this.projectiles.push(p);
        break;
      }
      default: {
        const p = new Projectile(
          cx, cy,
          this.charDef.projectileSpeed * this.facing, 0,
          this.damage, 'player', this.charDef.projectileColor
        );
        this.projectiles.push(p);
        break;
      }
    }
  }

  takeDamage(amount) {
    if (this.invincible > 0) return;
    this.hp -= amount;
    this.invincible = 30;
    if (this.hp < 0) this.hp = 0;
  }

  draw(ctx) {
    // Invincibility flash
    if (this.invincible > 0 && Math.floor(this.invincible / 4) % 2 === 0) return;

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    if (this.facing === -1) ctx.scale(-1, 1);

    // Body
    ctx.fillStyle = this.charDef.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Head
    ctx.fillStyle = '#FFE4B5';
    ctx.beginPath();
    ctx.arc(0, -this.height / 4, 12, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(3, -this.height / 4 - 3, 4, 4);

    // Arm (animated)
    const armOffset = Math.sin(this.animFrame * 0.8) * 3;
    ctx.fillStyle = this.charDef.color;
    ctx.fillRect(this.width / 2 - 8, -4 + armOffset, 14, 8);

    ctx.restore();

    // Draw projectiles
    this.projectiles.forEach(p => p.draw(ctx));
  }
}

// ==================== BOSS BASE ====================
class BossEntity {
  constructor(stageDef, stageIndex) {
    this.stageDef = stageDef;
    this.stageIndex = stageIndex;
    this.width = 100;
    this.height = 100;
    this.x = CANVAS_W - this.width - 60;
    this.y = CANVAS_H / 2 - this.height / 2;
    this.hp = stageDef.hp;
    this.maxHp = stageDef.hp;
    this.color = stageDef.bossColor;
    this.projectiles = [];
    this.attackTimer = 0;
    this.attackInterval = 60;
    this.patternIndex = 0;
    this.patternTimer = 0;
    this.patternDuration = 120;
    this.moveTimer = 0;
    this.phase = 1;
    this.enraged = false;
    this.flashTimer = 0;
    this.defeated = false;
  }

  update(player) {
    if (this.defeated) return;

    this.moveTimer++;
    this.attackTimer++;
    this.patternTimer++;

    if (this.patternTimer >= this.patternDuration) {
      this.patternTimer = 0;
      this.patternIndex = (this.patternIndex + 1) % 3;
    }

    // Phase check
    if (this.hp < this.maxHp * 0.5 && this.phase === 1) {
      this.phase = 2;
      this.attackInterval = Math.max(20, this.attackInterval - 15);
    }
    if (this.hp < this.maxHp * 0.25 && !this.enraged) {
      this.enraged = true;
      this.attackInterval = Math.max(15, this.attackInterval - 10);
    }

    // Movement (varies by boss)
    this.updateMovement(player);

    // Attack
    if (this.attackTimer >= this.attackInterval) {
      this.attackTimer = 0;
      this.attack(player);
    }

    // Update projectiles
    this.projectiles = this.projectiles.filter(p => p.active);
    this.projectiles.forEach(p => p.update(player));

    // Flash timer
    if (this.flashTimer > 0) this.flashTimer--;

    // Keep in bounds
    this.x = Math.max(CANVAS_W * 0.4, Math.min(this.x, CANVAS_W - this.width - 10));
    this.y = Math.max(10, Math.min(this.y, GROUND_Y - this.height));
  }

  updateMovement(player) {
    // Default oscillating movement
    this.y += Math.sin(this.moveTimer * 0.03) * 2;
    this.x += Math.cos(this.moveTimer * 0.02) * 0.5;
  }

  attack(player) {
    // Override in stage-specific logic
    this.basicAttack(player);
  }

  basicAttack(player) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const p = new Projectile(cx, cy, -5, 0, 10, 'boss', this.color, 16, 12);
    this.projectiles.push(p);
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.flashTimer = 6;
    if (this.hp <= 0) {
      this.hp = 0;
      this.defeated = true;
    }
  }

  draw(ctx) {
    if (this.defeated) return;

    ctx.save();

    // Flash on hit
    if (this.flashTimer > 0) {
      ctx.globalAlpha = 0.6;
    }

    // Boss body
    const gradient = ctx.createRadialGradient(
      this.x + this.width / 2, this.y + this.height / 2, 10,
      this.x + this.width / 2, this.y + this.height / 2, this.width / 2
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, '#111');
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Boss outline
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Enrage indicator
    if (this.enraged) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff0000';
      ctx.strokeStyle = '#ff0000';
      ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
      ctx.shadowBlur = 0;
    }

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x + this.width * 0.3, this.y + this.height * 0.3, 10, 10);
    ctx.fillRect(this.x + this.width * 0.6, this.y + this.height * 0.3, 10, 10);
    ctx.fillStyle = '#f00';
    ctx.fillRect(this.x + this.width * 0.33, this.y + this.height * 0.33, 5, 5);
    ctx.fillRect(this.x + this.width * 0.63, this.y + this.height * 0.33, 5, 5);

    ctx.restore();

    // Draw projectiles
    this.projectiles.forEach(p => p.draw(ctx));
  }
}

// ==================== BOSS IMPLEMENTATIONS ====================
function createBoss(stageIndex) {
  const stageDef = STAGES[stageIndex];
  const boss = new BossEntity(stageDef, stageIndex);

  switch (stageIndex) {
    case 0: // Double Mecha Rocket
      boss.width = 120;
      boss.height = 80;
      boss.attackInterval = 50;
      boss.attack = function (player) {
        const cx = this.x;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Laser beams
            for (let i = 0; i < 3; i++) {
              this.projectiles.push(new Projectile(cx, cy + i * 20 - 20, -6, 0, 8, 'boss', '#FF4500', 24, 6));
            }
            break;
          case 1: // Fire breath spray
            for (let i = 0; i < 5; i++) {
              const angle = (Math.PI / 4) * (i - 2) / 2;
              this.projectiles.push(new Projectile(cx, cy, -4 * Math.cos(angle), -4 * Math.sin(angle), 10, 'boss', '#FF8C00', 10, 10));
            }
            break;
          case 2: // Combined
            for (let i = 0; i < 2; i++) {
              this.projectiles.push(new Projectile(cx, cy + i * 30 - 15, -6, 0, 8, 'boss', '#FF4500', 24, 6));
            }
            for (let i = 0; i < 3; i++) {
              const angle = (Math.PI / 6) * (i - 1);
              this.projectiles.push(new Projectile(cx, cy, -4 * Math.cos(angle), -4 * Math.sin(angle), 8, 'boss', '#FF8C00', 10, 10));
            }
            break;
        }
      };
      break;

    case 1: // Butch (Rowdyruff Boys)
      boss.width = 80;
      boss.height = 90;
      boss.attackInterval = 70;
      boss.chargeTimer = 0;
      boss.charging = false;
      boss.updateMovement = function (player) {
        if (this.charging) {
          this.x -= 8;
          this.chargeTimer--;
          if (this.chargeTimer <= 0) {
            this.charging = false;
            this.x = CANVAS_W - this.width - 60;
          }
        } else {
          this.y += Math.sin(this.moveTimer * 0.04) * 3;
          if (Math.random() < 0.008 * (this.enraged ? 2 : 1)) {
            this.charging = true;
            this.chargeTimer = 30;
          }
        }
      };
      boss.attack = function (player) {
        const cx = this.x;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Punch wave
            this.projectiles.push(new Projectile(cx, cy, -7, 0, 15, 'boss', '#228B22', 20, 20));
            break;
          case 1: // Ground pound
            for (let i = 0; i < 4; i++) {
              this.projectiles.push(new Projectile(cx - i * 40, GROUND_Y - 20, -3, -2 - i, 10, 'boss', '#8B4513', 14, 14));
            }
            break;
          case 2: // Triple punch
            for (let i = -1; i <= 1; i++) {
              this.projectiles.push(new Projectile(cx, cy + i * 25, -8, i * 0.5, 12, 'boss', '#32CD32', 18, 14));
            }
            break;
        }
      };
      break;

    case 2: // Mandler
      boss.width = 90;
      boss.height = 90;
      boss.attackInterval = 45;
      boss.rotAngle = 0;
      boss.updateMovement = function (player) {
        this.rotAngle += 0.03;
        this.x = CANVAS_W - 180 + Math.cos(this.rotAngle) * 50;
        this.y = CANVAS_H / 2 - this.height / 2 + Math.sin(this.rotAngle * 1.5) * 100;
      };
      boss.attack = function (player) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Rotating ring
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI * 2 * i) / 6 + this.moveTimer * 0.05;
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * 3, Math.sin(angle) * 3, 8, 'boss', '#9932CC', 10, 10));
            }
            break;
          case 1: // Gravity pull (aimed at player)
            {
              const dx = player.x - cx;
              const dy = player.y - cy;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              this.projectiles.push(new Projectile(cx, cy, (dx / dist) * 4, (dy / dist) * 4, 12, 'boss', '#DA70D6', 14, 14));
            }
            break;
          case 2: // Spiral
            for (let i = 0; i < 4; i++) {
              const angle = this.moveTimer * 0.1 + (Math.PI / 2) * i;
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * 4, Math.sin(angle) * 4, 8, 'boss', '#BA55D3', 8, 8));
            }
            break;
        }
      };
      break;

    case 3: // Crusher-Bot MK.II
      boss.width = 130;
      boss.height = 120;
      boss.attackInterval = 80;
      boss.stompCooldown = 0;
      boss.updateMovement = function (player) {
        this.y += Math.sin(this.moveTimer * 0.02) * 1.5;
        // Stomp mechanic
        if (this.stompCooldown > 0) this.stompCooldown--;
        if (this.stompCooldown === 0 && Math.random() < 0.005) {
          this.y = 50;
          this.stompCooldown = 60;
        }
        if (this.stompCooldown > 40) {
          this.y += 10;
        }
      };
      boss.attack = function (player) {
        const cx = this.x;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Missile barrage
            for (let i = 0; i < 3; i++) {
              this.projectiles.push(new Projectile(cx, cy + (i - 1) * 30, -4, (i - 1) * 1.5, 12, 'boss', '#708090', 16, 10));
            }
            break;
          case 1: // Heavy slam
            for (let i = 0; i < 5; i++) {
              this.projectiles.push(new Projectile(this.x + i * 20, GROUND_Y - 30, -2, -Math.random() * 3, 15, 'boss', '#A9A9A9', 12, 12));
            }
            break;
          case 2: // Laser sweep
            for (let i = 0; i < 4; i++) {
              const angle = -Math.PI / 2 + (Math.PI / 3) * (i / 3);
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * 5, Math.sin(angle) * 5, 10, 'boss', '#B0C4DE', 20, 6));
            }
            break;
        }
      };
      break;

    case 4: // Metal Sonic
      boss.width = 70;
      boss.height = 70;
      boss.attackInterval = 35;
      boss.dashTimer = 0;
      boss.dashing = false;
      boss.updateMovement = function (player) {
        if (this.dashing) {
          this.x -= 12;
          this.dashTimer--;
          if (this.dashTimer <= 0 || this.x < CANVAS_W * 0.3) {
            this.dashing = false;
            this.x = CANVAS_W - this.width - 60;
            this.y = player.y;
          }
        } else {
          this.y += Math.sin(this.moveTimer * 0.06) * 4;
          this.x += Math.cos(this.moveTimer * 0.04) * 2;
          if (Math.random() < 0.01 * (this.enraged ? 2 : 1)) {
            this.dashing = true;
            this.dashTimer = 20;
            this.y = player.y;
          }
        }
      };
      boss.attack = function (player) {
        const cx = this.x;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Speed shots
            this.projectiles.push(new Projectile(cx, cy, -9, 0, 8, 'boss', '#1E90FF', 14, 8));
            break;
          case 1: { // Homing
            const p = new Projectile(cx, cy, -3, 0, 10, 'boss', '#00BFFF', 10, 10);
            p.homing = true;
            this.projectiles.push(p);
            break;
          }
          case 2: // Fan spread
            for (let i = -2; i <= 2; i++) {
              this.projectiles.push(new Projectile(cx, cy, -6, i * 2, 8, 'boss', '#4169E1', 12, 8));
            }
            break;
        }
      };
      break;

    case 5: // Roaring Knight
      boss.width = 100;
      boss.height = 110;
      boss.attackInterval = 55;
      boss.slashTimer = 0;
      boss.updateMovement = function (player) {
        this.y += Math.sin(this.moveTimer * 0.03) * 2.5;
        // Phase shift teleport
        if (this.phase === 2 && Math.random() < 0.008) {
          this.x = CANVAS_W * 0.5 + Math.random() * (CANVAS_W * 0.4);
          this.y = Math.random() * (GROUND_Y - this.height - 50) + 50;
        }
      };
      boss.attack = function (player) {
        const cx = this.x;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Sword slash waves
            for (let i = 0; i < 3; i++) {
              const angle = -Math.PI / 4 + (Math.PI / 4) * i;
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * -5, Math.sin(angle) * 5, 14, 'boss', '#FFD700', 22, 6));
            }
            break;
          case 1: // Dark energy pillars
            for (let i = 0; i < 3; i++) {
              this.projectiles.push(new Projectile(player.x + (i - 1) * 60, 0, 0, 6, 12, 'boss', '#8B0000', 10, 30));
            }
            break;
          case 2: // Roaring blast
            for (let i = 0; i < 8; i++) {
              const angle = (Math.PI * 2 * i) / 8;
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * 4, Math.sin(angle) * 4, 10, 'boss', '#FFD700', 12, 12));
            }
            break;
        }
      };
      break;

    case 6: // Roaring Metal (True Final Boss)
      boss.width = 110;
      boss.height = 110;
      boss.attackInterval = 30;
      boss.rotAngle = 0;
      boss.teleportCooldown = 0;
      boss.updateMovement = function (player) {
        this.rotAngle += 0.04;
        this.x = CANVAS_W - 200 + Math.cos(this.rotAngle) * 60;
        this.y = CANVAS_H / 2 - this.height / 2 + Math.sin(this.rotAngle * 1.3) * 80;
        // Teleport in enrage
        this.teleportCooldown--;
        if (this.enraged && this.teleportCooldown <= 0 && Math.random() < 0.015) {
          this.x = CANVAS_W * 0.4 + Math.random() * (CANVAS_W * 0.5);
          this.y = Math.random() * (GROUND_Y - this.height - 20);
          this.teleportCooldown = 30;
        }
      };
      boss.attack = function (player) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Combined laser + fire
            for (let i = 0; i < 4; i++) {
              this.projectiles.push(new Projectile(cx, cy + i * 18 - 27, -6, 0, 10, 'boss', '#FF1493', 20, 6));
            }
            for (let i = 0; i < 3; i++) {
              const angle = (Math.PI / 5) * (i - 1);
              this.projectiles.push(new Projectile(cx, cy, -4 * Math.cos(angle), -4 * Math.sin(angle), 10, 'boss', '#FF4500', 10, 10));
            }
            break;
          case 1: // Sword + dash
            for (let i = 0; i < 5; i++) {
              this.projectiles.push(new Projectile(cx, cy + i * 14 - 28, -7, 0, 12, 'boss', '#FFD700', 18, 6));
            }
            break;
          case 2: // Full power rotating ring
            for (let i = 0; i < 10; i++) {
              const angle = (Math.PI * 2 * i) / 10 + this.rotAngle;
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * 3.5, Math.sin(angle) * 3.5, 10, 'boss', '#FF1493', 10, 10));
            }
            // Plus aimed shots
            {
              const dx = player.x - cx;
              const dy = player.y - cy;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              this.projectiles.push(new Projectile(cx, cy, (dx / dist) * 5, (dy / dist) * 5, 14, 'boss', '#FF0000', 16, 16));
            }
            break;
        }
      };
      break;
  }

  return boss;
}

// ==================== GIMMICK SYSTEM ====================
class GimmickManager {
  constructor() {
    this.effects = [];
    this.timer = 0;
    this.type = null;
  }

  setGimmick(type) {
    this.type = type;
    this.effects = [];
    this.timer = 0;
  }

  update(player) {
    this.timer++;
    switch (this.type) {
      case 'laser_walls':
        if (this.timer % 180 === 0) {
          this.effects.push({ type: 'laser', y: Math.random() * (GROUND_Y - 40), timer: 60 });
        }
        break;
      case 'gravity_shift':
        if (this.timer % 300 === 0) {
          this.effects.push({ type: 'gravity', dir: Math.random() > 0.5 ? -1 : 1, timer: 90 });
        }
        break;
      case 'falling_debris':
        if (this.timer % 60 === 0) {
          this.effects.push({ type: 'debris', x: Math.random() * CANVAS_W, y: -20, vy: 3 + Math.random() * 2, timer: 200 });
        }
        break;
      case 'speed_zones':
        if (this.timer % 240 === 0) {
          this.effects.push({ type: 'speed', x: Math.random() * (CANVAS_W - 100), timer: 120 });
        }
        break;
    }

    // Update effects
    this.effects = this.effects.filter(e => {
      e.timer--;
      if (e.type === 'debris') {
        e.y += e.vy;
        // Check collision with player
        if (Math.abs(e.x - player.x) < 30 && Math.abs(e.y - player.y) < 30) {
          player.takeDamage(5);
        }
      }
      if (e.type === 'gravity' && e.timer > 0) {
        player.vy += e.dir * 0.3;
      }
      if (e.type === 'speed' && e.timer > 0) {
        if (player.x > e.x && player.x < e.x + 100) {
          player.x += 2;
        }
      }
      return e.timer > 0;
    });
  }

  draw(ctx) {
    this.effects.forEach(e => {
      switch (e.type) {
        case 'laser':
          ctx.fillStyle = `rgba(255, 0, 0, ${e.timer / 60 * 0.4})`;
          ctx.fillRect(0, e.y, CANVAS_W, 4);
          break;
        case 'debris':
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(e.x, e.y, 20, 20);
          break;
        case 'speed':
          ctx.fillStyle = `rgba(0, 255, 255, ${e.timer / 120 * 0.2})`;
          ctx.fillRect(e.x, 0, 100, CANVAS_H);
          break;
        case 'gravity':
          ctx.fillStyle = `rgba(128, 0, 128, ${e.timer / 90 * 0.15})`;
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
          break;
      }
    });
  }
}

// ==================== MAIN GAME CLASS ====================
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_H;

    this.state = GameState.MENU;
    this.prevState = null;
    this.input = new InputManager();
    this.audio = new AudioManager();
    this.gimmicks = new GimmickManager();
    this.particles = [];

    this.selectedChar = null;
    this.currentStage = 0;
    this.player = null;
    this.boss = null;
    this.score = 0;
    this.stagesCleared = [];
    this.timeAttackMode = false;
    this.timeAttackStart = 0;
    this.timeAttackElapsed = 0;
    this.bgScrollX = 0;

    // Options
    this.options = {
      musicVol: 50,
      sfxVol: 70,
      difficulty: 1, // 0=easy, 1=normal, 2=hard
      screenShake: true
    };

    // Transition timers
    this.transitionTimer = 0;
    this.cutsceneText = '';
    this.cutsceneType = 'before';

    // Load sounds
    this.loadAudio();

    // UI references
    this.menuOverlay = document.getElementById('menu-overlay');
    this.hudOverlay = document.getElementById('hud-overlay');
    this.touchControls = document.getElementById('touch-controls');
    this.bossWarning = document.getElementById('boss-warning');
    this.stageClear = document.getElementById('stage-clear');
    this.gameOverEl = document.getElementById('game-over');
    this.pauseOverlay = document.getElementById('pause-overlay');
    this.cutsceneOverlay = document.getElementById('cutscene-overlay');
    this.timeAttackTimer = document.getElementById('time-attack-timer');

    // Show initial menu
    this.renderMenu();

    // Start game loop
    this.lastTime = performance.now();
    this.loop();
  }

  loadAudio() {
    this.audio.loadSound('shoot', 'Player_FireShoot.wav');
    this.audio.loadSound('hit', 'HitBoss.wav');
    this.audio.loadSound('explosion', 'BossDefeat_Explosion.wav');
    this.audio.loadSound('warning', 'BossWarning.wav');
    this.audio.loadSound('playerHurt', 'PlayerHurt.wav');
    this.audio.loadSound('jump', 'Jump.wav');
    this.audio.loadSound('impact', 'Impact.wav');
    this.audio.loadSound('land', 'Land.wav');
    this.audio.loadSound('move', 'Move.wav');
    this.audio.loadSound('stomp', 'CrusherBot_Stomp.wav');
    this.audio.loadSound('charge', 'MSChargeFire.wav');
    this.audio.loadSound('transform', 'Transform.wav');
    this.audio.loadSound('death', 'PlayerDeath.wav');
    this.audio.loadSound('clear', '23. Stage Clear.mp3');
    this.audio.loadSound('gameOver', '21. Game Over.mp3');
  }

  // ==================== GAME LOOP ====================
  loop() {
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 16.67, 2); // normalize to 60fps
    this.lastTime = now;

    this.input.update();
    this.update(dt, now);
    this.render();

    requestAnimationFrame(() => this.loop());
  }

  update(dt, now) {
    switch (this.state) {
      case GameState.PLAYING:
        this.updatePlaying(dt, now);
        break;
      case GameState.BOSS_WARNING:
        this.transitionTimer--;
        if (this.transitionTimer <= 0) {
          this.state = GameState.PLAYING;
          this.hideAllOverlays();
          this.bossWarning.classList.remove('active');
          this.hudOverlay.classList.add('active');
          this.touchControls.classList.add('active');
        }
        break;
      case GameState.STAGE_CLEAR:
        this.transitionTimer--;
        if (this.transitionTimer <= 0) {
          this.advanceStage();
        }
        break;
      case GameState.CUTSCENE:
        if (this.input.isFire() || this.input.isAnyKey()) {
          this.endCutscene();
        }
        break;
      case GameState.PAUSED:
        break;
    }

    // Pause/unpause toggle (mutually exclusive in one frame)
    if (this.state === GameState.PLAYING && this.input.isPause()) {
      this.pauseGame();
    } else if (this.state === GameState.PAUSED && this.input.isPause()) {
      this.resumeGame();
    }

    // Update particles
    this.particles = this.particles.filter(p => {
      p.update();
      return !p.isDead();
    });
  }

  updatePlaying(dt, now) {
    if (!this.player || !this.boss) return;

    this.player.update(this.input, now, this.boss);
    this.boss.update(this.player);

    // Gimmicks
    this.gimmicks.update(this.player);

    // Collision: player projectiles vs boss
    this.player.projectiles.forEach(p => {
      if (p.active && this.collides(p, this.boss)) {
        this.boss.takeDamage(p.damage);
        p.active = false;
        this.audio.playSound('hit');
        this.spawnParticles(p.x, p.y, this.boss.color, 5);
        this.score += 10;
      }
    });

    // Collision: boss projectiles vs player
    this.boss.projectiles.forEach(p => {
      if (p.active && this.collides(p, this.player)) {
        this.player.takeDamage(p.damage * this.getDiffMultiplier());
        p.active = false;
        this.audio.playSound('playerHurt');
        this.spawnParticles(p.x, p.y, '#ff0000', 4);
        if (this.options.screenShake) this.shakeScreen();
      }
    });

    // Collision: player vs boss body
    if (this.collides(this.player, this.boss) && this.player.invincible === 0) {
      this.player.takeDamage(5 * this.getDiffMultiplier());
      this.audio.playSound('impact');
      if (this.options.screenShake) this.shakeScreen();
    }

    // Update HUD
    this.updateHUD();

    // Check boss defeat
    if (this.boss.defeated) {
      this.onBossDefeated();
    }

    // Check player death
    if (this.player.hp <= 0) {
      this.onPlayerDeath();
    }

    // Time attack
    if (this.timeAttackMode) {
      this.timeAttackElapsed = now - this.timeAttackStart;
      this.updateTimeAttackDisplay();
    }

    // Background scroll
    this.bgScrollX += 0.5;
  }

  // ==================== COLLISION ====================
  collides(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

  // ==================== DIFFICULTY ====================
  getDiffMultiplier() {
    return [0.7, 1.0, 1.4][this.options.difficulty];
  }

  // ==================== GAME FLOW ====================
  startGame(stageIndex) {
    this.currentStage = stageIndex || 0;
    this.score = 0;
    if (this.timeAttackMode) {
      this.timeAttackStart = performance.now();
    }
    this.showCutscene('before');
  }

  showCutscene(type) {
    const stage = STAGES[this.currentStage];
    this.cutsceneType = type;
    this.cutsceneText = type === 'before' ? stage.cutsceneBefore : stage.cutsceneAfter;
    this.state = GameState.CUTSCENE;
    this.hideAllOverlays();
    this.cutsceneOverlay.classList.add('active');
    document.getElementById('cutscene-text').textContent = this.cutsceneText;
    document.getElementById('cutscene-speaker').textContent = type === 'before' ? `STAGE ${stage.id} - ${stage.name}` : 'STAGE CLEAR';
  }

  endCutscene() {
    this.cutsceneOverlay.classList.remove('active');
    if (this.cutsceneType === 'before') {
      this.startBossWarning();
    } else {
      this.advanceToNextStage();
    }
  }

  startBossWarning() {
    this.state = GameState.BOSS_WARNING;
    this.transitionTimer = 90;
    this.hideAllOverlays();
    this.bossWarning.classList.add('active');
    this.bossWarning.textContent = `WARNING! BOSS APPROACHING!`;
    this.audio.playSound('warning');
    this.initStage();
  }

  initStage() {
    const stage = STAGES[this.currentStage];
    this.player = new Player(this.selectedChar);
    this.boss = createBoss(this.currentStage);

    // Apply difficulty
    const mult = this.getDiffMultiplier();
    this.boss.maxHp = Math.floor(this.boss.maxHp * mult);
    this.boss.hp = this.boss.maxHp;

    this.gimmicks.setGimmick(stage.gimmick);
    this.audio.playMusic(stage.music);
    this.particles = [];
  }

  onBossDefeated() {
    this.state = GameState.STAGE_CLEAR;
    this.transitionTimer = 120;
    this.stagesCleared.push(this.currentStage);
    this.score += 1000 * (this.currentStage + 1);
    this.audio.stopMusic();
    this.audio.playSound('explosion');
    this.audio.playSound('clear');
    this.hideAllOverlays();
    this.stageClear.classList.add('active');
    document.getElementById('clear-stage-name').textContent = STAGES[this.currentStage].name;

    // Explosion particles
    for (let i = 0; i < 30; i++) {
      this.spawnParticles(
        this.boss.x + this.boss.width / 2,
        this.boss.y + this.boss.height / 2,
        this.boss.color, 1
      );
    }
  }

  advanceStage() {
    this.stageClear.classList.remove('active');
    if (this.currentStage >= STAGES.length - 1) {
      this.showVictory();
    } else {
      this.showCutscene('after');
    }
  }

  advanceToNextStage() {
    this.currentStage++;
    this.showCutscene('before');
  }

  showVictory() {
    this.state = GameState.VICTORY;
    this.hideAllOverlays();
    this.gameOverEl.classList.add('active');
    document.getElementById('gameover-title').textContent = 'VICTORY!';
    document.getElementById('gameover-title').style.color = '#00ff88';
    document.getElementById('gameover-title').style.textShadow = '0 0 20px #00ff88';
    document.getElementById('gameover-result').textContent = `All stages cleared! Score: ${this.score}`;
    if (this.timeAttackMode) {
      document.getElementById('gameover-time').textContent = `Time: ${this.formatTime(this.timeAttackElapsed)}`;
      document.getElementById('gameover-time').style.display = 'block';
    }
    this.audio.stopMusic();
  }

  onPlayerDeath() {
    this.state = GameState.GAME_OVER;
    this.hideAllOverlays();
    this.gameOverEl.classList.add('active');
    document.getElementById('gameover-title').textContent = 'GAME OVER';
    document.getElementById('gameover-title').style.color = '#ff0000';
    document.getElementById('gameover-title').style.textShadow = '0 0 20px #ff0000';
    document.getElementById('gameover-result').textContent = `Defeated at Stage ${this.currentStage + 1}. Score: ${this.score}`;
    document.getElementById('gameover-time').style.display = 'none';
    this.audio.stopMusic();
    this.audio.playSound('death');
    this.audio.playSound('gameOver');
  }

  pauseGame() {
    this.prevState = this.state;
    this.state = GameState.PAUSED;
    this.pauseOverlay.classList.add('active');
    if (this.audio.music) this.audio.music.pause();
  }

  resumeGame() {
    this.state = this.prevState || GameState.PLAYING;
    this.pauseOverlay.classList.remove('active');
    if (this.audio.music && !this.audio.muted) this.audio.music.play().catch(() => {});
  }

  // ==================== MENU SYSTEM ====================
  showMenu(menuState) {
    this.state = menuState || GameState.MENU;
    this.hideAllOverlays();
    this.menuOverlay.classList.remove('hidden');
    this.audio.stopMusic();
    this.renderMenu();
  }

  renderMenu() {
    const container = document.getElementById('menu-content');
    container.innerHTML = '';

    switch (this.state) {
      case GameState.MENU:
        container.innerHTML = `
          <div class="title-section">
            <h1>FIREBOY</h1>
            <h2>THE LEGEND OF TERRA NEMESIS</h2>
            <div class="subtitle">BOSS RUSH MODE</div>
          </div>
          <div class="menu-buttons">
            <button class="menu-btn" onclick="game.showMenu('${GameState.CHAR_SELECT}')">BOSS RUSH</button>
            <button class="menu-btn" onclick="game.showMenu('${GameState.STAGE_SELECT}')">STAGE SELECT</button>
            <button class="menu-btn" onclick="game.showMenu('${GameState.TIME_ATTACK}')">TIME ATTACK</button>
            <button class="menu-btn" onclick="game.showMenu('${GameState.OPTIONS}')">OPTIONS</button>
            <button class="menu-btn" onclick="game.showMenu('${GameState.EXTRA}')">EXTRA</button>
          </div>
        `;
        break;

      case GameState.CHAR_SELECT:
        container.innerHTML = `
          <button class="back-btn" onclick="game.showMenu('${GameState.MENU}')">← BACK</button>
          <div class="title-section">
            <h2>SELECT CHARACTER</h2>
          </div>
          <div class="char-select-grid">
            ${Object.values(CHARACTERS).map(c => `
              <div class="char-card ${this.selectedChar && this.selectedChar.id === c.id ? 'selected' : ''}" onclick="game.selectCharacter('${c.id}')">
                <div class="char-icon" style="background: ${c.color};">${c.name[0]}</div>
                <div class="char-name">${c.name}</div>
                <div class="char-desc">${c.description}</div>
                <div class="char-stats">
                  <div class="stat-row"><span>HP</span><div class="stat-bar-mini"><div class="stat-bar-mini-fill" style="width:${c.hp / 1.2}%; background:${c.color}"></div></div></div>
                  <div class="stat-row"><span>SPD</span><div class="stat-bar-mini"><div class="stat-bar-mini-fill" style="width:${c.speed * 14}%; background:${c.color}"></div></div></div>
                  <div class="stat-row"><span>ATK</span><div class="stat-bar-mini"><div class="stat-bar-mini-fill" style="width:${c.damage * 4}%; background:${c.color}"></div></div></div>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="menu-btn" onclick="game.confirmCharacter()" ${!this.selectedChar ? 'disabled style="opacity:0.4"' : ''}>START BOSS RUSH</button>
        `;
        break;

      case GameState.STAGE_SELECT:
        container.innerHTML = `
          <button class="back-btn" onclick="game.showMenu('${GameState.MENU}')">← BACK</button>
          <div class="title-section">
            <h2>STAGE SELECT</h2>
          </div>
          <div class="stage-list">
            ${STAGES.map((s, i) => `
              <div class="stage-item ${i > 0 && !this.stagesCleared.includes(i - 1) ? 'locked' : ''}" onclick="game.selectStage(${i})">
                <div class="stage-num">${s.id}</div>
                <div class="stage-info">
                  <div class="stage-name">${s.name}</div>
                  <div class="stage-boss">Boss: ${s.boss}</div>
                </div>
                ${this.stagesCleared.includes(i) ? '<span style="color:#0f0">✓</span>' : ''}
              </div>
            `).join('')}
          </div>
        `;
        break;

      case GameState.OPTIONS:
        container.innerHTML = `
          <button class="back-btn" onclick="game.showMenu('${GameState.MENU}')">← BACK</button>
          <div class="title-section">
            <h2>OPTIONS</h2>
          </div>
          <div class="options-panel">
            <div class="option-row">
              <span class="option-label">Music Volume</span>
              <div class="option-value">
                <button class="option-btn" onclick="game.adjustOption('musicVol', -10)">-</button>
                <span id="opt-music">${this.options.musicVol}%</span>
                <button class="option-btn" onclick="game.adjustOption('musicVol', 10)">+</button>
              </div>
            </div>
            <div class="option-row">
              <span class="option-label">SFX Volume</span>
              <div class="option-value">
                <button class="option-btn" onclick="game.adjustOption('sfxVol', -10)">-</button>
                <span id="opt-sfx">${this.options.sfxVol}%</span>
                <button class="option-btn" onclick="game.adjustOption('sfxVol', 10)">+</button>
              </div>
            </div>
            <div class="option-row">
              <span class="option-label">Difficulty</span>
              <div class="option-value">
                <button class="option-btn" onclick="game.adjustOption('difficulty', -1)">-</button>
                <span id="opt-diff">${['EASY', 'NORMAL', 'HARD'][this.options.difficulty]}</span>
                <button class="option-btn" onclick="game.adjustOption('difficulty', 1)">+</button>
              </div>
            </div>
            <div class="option-row">
              <span class="option-label">Screen Shake</span>
              <div class="option-value">
                <button class="menu-btn" style="width:auto;padding:8px 16px;font-size:12px" onclick="game.toggleShake()">${this.options.screenShake ? 'ON' : 'OFF'}</button>
              </div>
            </div>
          </div>
        `;
        break;

      case GameState.TIME_ATTACK:
        container.innerHTML = `
          <button class="back-btn" onclick="game.showMenu('${GameState.MENU}')">← BACK</button>
          <div class="title-section">
            <h2>TIME ATTACK</h2>
            <div class="subtitle">Complete all stages as fast as possible!</div>
          </div>
          <div class="menu-buttons">
            <button class="menu-btn" onclick="game.startTimeAttack()">START TIME ATTACK</button>
          </div>
          <div style="margin-top:20px; text-align:center; color:#888; font-size:13px;">
            <p>Best Time: ${this.bestTime ? this.formatTime(this.bestTime) : '--:--:---'}</p>
          </div>
        `;
        break;

      case GameState.EXTRA:
        container.innerHTML = `
          <button class="back-btn" onclick="game.showMenu('${GameState.MENU}')">← BACK</button>
          <div class="title-section">
            <h2>EXTRA</h2>
          </div>
          <div style="text-align:center; color:#888; font-size:14px; max-width:400px; line-height:1.6;">
            <p><strong style="color:#ffcc00">Characters:</strong> Fireboy, Caroline, Butch, Anabel</p>
            <p style="margin-top:10px"><strong style="color:#ffcc00">Bosses:</strong></p>
            <p>1. Big Core MK.I & Fire Breath</p>
            <p>2. Butch (Rowdyruff Boys)</p>
            <p>3. Mandler (Terra Cresta)</p>
            <p>4. Crusher-Bot MK.II</p>
            <p>5. Metal Sonic</p>
            <p>6. Roaring Knight (Deltarune)</p>
            <p>7. Roaring Metal (True Final Boss)</p>
            <p style="margin-top:15px; color:#666; font-size:11px;">
              Inspired by Gradius, Sonic 3, Terra Cresta, Deltarune<br>
              Fireboy The Brothers © Player10thGames
            </p>
          </div>
        `;
        break;
    }
  }

  selectCharacter(id) {
    this.selectedChar = CHARACTERS[id];
    this.renderMenu();
  }

  confirmCharacter() {
    if (!this.selectedChar) return;
    this.timeAttackMode = false;
    this.startGame(0);
  }

  selectStage(index) {
    if (index > 0 && !this.stagesCleared.includes(index - 1)) return;
    if (!this.selectedChar) {
      this.showMenu(GameState.CHAR_SELECT);
      return;
    }
    this.timeAttackMode = false;
    this.startGame(index);
  }

  startTimeAttack() {
    if (!this.selectedChar) {
      this.showMenu(GameState.CHAR_SELECT);
      return;
    }
    this.timeAttackMode = true;
    this.startGame(0);
  }

  adjustOption(key, delta) {
    if (key === 'musicVol') {
      this.options.musicVol = Math.max(0, Math.min(100, this.options.musicVol + delta));
      this.audio.setMusicVolume(this.options.musicVol / 100);
    } else if (key === 'sfxVol') {
      this.options.sfxVol = Math.max(0, Math.min(100, this.options.sfxVol + delta));
      this.audio.setSfxVolume(this.options.sfxVol / 100);
    } else if (key === 'difficulty') {
      this.options.difficulty = Math.max(0, Math.min(2, this.options.difficulty + delta));
    }
    this.renderMenu();
  }

  toggleShake() {
    this.options.screenShake = !this.options.screenShake;
    this.renderMenu();
  }

  returnToMenu() {
    this.hideAllOverlays();
    this.gameOverEl.classList.remove('active');
    this.showMenu(GameState.MENU);
  }

  retryStage() {
    this.hideAllOverlays();
    this.gameOverEl.classList.remove('active');
    this.showCutscene('before');
  }

  // ==================== HUD ====================
  updateHUD() {
    if (!this.player || !this.boss) return;
    document.getElementById('player-hp-fill').style.width = `${(this.player.hp / this.player.maxHp) * 100}%`;
    document.getElementById('boss-hp-fill').style.width = `${(this.boss.hp / this.boss.maxHp) * 100}%`;
    document.getElementById('hud-player-name').textContent = this.selectedChar.name;
    document.getElementById('hud-boss-name').textContent = STAGES[this.currentStage].boss;
    document.getElementById('hud-stage').textContent = `STAGE ${this.currentStage + 1}`;
    document.getElementById('hud-score').textContent = `SCORE: ${this.score}`;
  }

  updateTimeAttackDisplay() {
    if (this.timeAttackMode) {
      this.timeAttackTimer.classList.add('active');
      this.timeAttackTimer.textContent = this.formatTime(this.timeAttackElapsed);
    }
  }

  formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const msRemainder = Math.floor((ms % 1000) / 10);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(msRemainder).padStart(2, '0')}`;
  }

  // ==================== RENDERING ====================
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    if (this.state === GameState.PLAYING || this.state === GameState.PAUSED || this.state === GameState.BOSS_WARNING) {
      this.renderGameplay(ctx);
    } else if (this.state === GameState.STAGE_CLEAR || this.state === GameState.GAME_OVER || this.state === GameState.VICTORY) {
      this.renderGameplay(ctx);
    } else {
      // Menu background
      this.renderMenuBackground(ctx);
    }

    // Particles (always render)
    this.particles.forEach(p => p.draw(ctx));
  }

  renderMenuBackground(ctx) {
    // Animated starfield
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    const time = Date.now() / 1000;
    for (let i = 0; i < 80; i++) {
      const x = (i * 137.5 + time * 20 * ((i % 3) + 1)) % CANVAS_W;
      const y = (i * 97.3 + time * 5) % CANVAS_H;
      const size = (i % 3) + 1;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (i % 5) * 0.1})`;
      ctx.fillRect(x, y, size, size);
    }
  }

  renderGameplay(ctx) {
    // Background - space with scrolling stars
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Scrolling stars
    for (let i = 0; i < 60; i++) {
      const speed = (i % 3) + 1;
      const x = ((i * 137.5 - this.bgScrollX * speed) % CANVAS_W + CANVAS_W) % CANVAS_W;
      const y = (i * 97.3) % CANVAS_H;
      const size = speed;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + speed * 0.15})`;
      ctx.fillRect(x, y, size, size);
    }

    // Ground platform
    ctx.fillStyle = '#2a2a3a';
    ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
    ctx.fillStyle = '#444';
    ctx.fillRect(0, GROUND_Y, CANVAS_W, 3);

    // Gimmick effects
    this.gimmicks.draw(ctx);

    // Draw entities
    if (this.player) this.player.draw(ctx);
    if (this.boss && !this.boss.defeated) this.boss.draw(ctx);
  }

  // ==================== EFFECTS ====================
  spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(
        x, y,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        color,
        20 + Math.random() * 20
      ));
    }
  }

  shakeScreen() {
    const container = document.getElementById('game-container');
    container.classList.add('shake');
    setTimeout(() => container.classList.remove('shake'), 100);
  }

  // ==================== UTILITY ====================
  hideAllOverlays() {
    this.menuOverlay.classList.add('hidden');
    this.hudOverlay.classList.remove('active');
    this.touchControls.classList.remove('active');
    this.bossWarning.classList.remove('active');
    this.stageClear.classList.remove('active');
    this.gameOverEl.classList.remove('active');
    this.pauseOverlay.classList.remove('active');
    this.cutsceneOverlay.classList.remove('active');
    this.timeAttackTimer.classList.remove('active');
  }
}

// ==================== INITIALIZATION ====================
let game;
window.addEventListener('DOMContentLoaded', () => {
  game = new Game();

  // Force landscape on mobile
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(() => {});
  }
});
