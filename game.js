/**
 * FIREBOY THE BROTHERS - THE LEGEND OF TERRA NEMESIS
 * Boss Rush Mode - Complete Game Engine v2.0
 * 
 * Features: 4 Playable Characters, 7 Boss Stages, 
 * Touch Controls, Cutscenes, Gimmicks, Time Attack
 */

// ==================== CONSTANTS ====================
const CANVAS_W = 960;
const CANVAS_H = 540;
const GRAVITY = 0.55;
const GROUND_Y = CANVAS_H - 70;
const FPS = 60;

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
    id: 'fireboy', name: 'Fireboy',
    description: 'Balanced fighter with rapid fire',
    color: '#FF6B35', color2: '#FF4500', eyeColor: '#000',
    hp: 100, speed: 5, jumpPower: 12, damage: 15,
    fireRate: 150, projectileSpeed: 10,
    projectileColor: '#FF4500', special: 'rapid',
    specialName: 'Fire Burst',
    bodyType: 'standard', headColor: '#FFE0B2',
    icon: '🔥'
  },
  caroline: {
    id: 'caroline', name: 'Caroline',
    description: 'Energy blaster with wide spread',
    color: '#FF69B4', color2: '#FF1493', eyeColor: '#006400',
    hp: 90, speed: 6, jumpPower: 13, damage: 12,
    fireRate: 200, projectileSpeed: 8,
    projectileColor: '#FF69B4', special: 'spread',
    specialName: 'Energy Blast',
    bodyType: 'slim', headColor: '#FFE0B2',
    icon: '💫'
  },
  butch: {
    id: 'butch', name: 'Butch',
    description: 'Heavy hitter, powerful melee',
    color: '#DC143C', color2: '#8B0000', eyeColor: '#000',
    hp: 120, speed: 4, jumpPower: 10, damage: 25,
    fireRate: 350, projectileSpeed: 7,
    projectileColor: '#DC143C', special: 'power',
    specialName: 'Power Punch',
    bodyType: 'bulky', headColor: '#FFE0B2',
    icon: '👊'
  },
  anabel: {
    id: 'anabel', name: 'Anabel',
    description: 'Precision shooter with homing shots',
    color: '#4169E1', color2: '#1E3A8A', eyeColor: '#1E3A8A',
    hp: 85, speed: 7, jumpPower: 14, damage: 10,
    fireRate: 100, projectileSpeed: 9,
    projectileColor: '#4169E1', special: 'homing',
    specialName: 'Precision Shot',
    bodyType: 'slim', headColor: '#FFE0B2',
    icon: '🎯'
  }
};

// ==================== STAGE DEFINITIONS ====================
const STAGES = [
  {
    id: 1, name: 'Duo Mecha Rocket',
    boss: 'Big Core MK.I & Fire Breath', bossColor: '#FF4500',
    hp: 400, music: 'Double Trouble (Double Mecha Rocket - Big Core MK.I from Gradius x Fire Breath from Sonic 3) (Stage 1 Boss).mp3',
    gimmick: 'laser_walls',
    cutsceneBefore: 'The mechanical terrors have awakened! Big Core MK.I from Gradius and Fire Breath from Sonic 3 combine their forces in a devastating duo attack!',
    cutsceneAfter: 'The Duo Mecha Rocket is destroyed! Their combined might was not enough. But more enemies await ahead...',
    warningText: 'DUO MECHA ROCKET APPROACHING'
  },
  {
    id: 2, name: 'Butch (Rowdyruff Boys)', boss: 'Butch', bossColor: '#228B22',
    hp: 500, music: 'Butch from Rowdyruff Boys (Stage 2 Boss).mp3',
    gimmick: 'destructible_blocks',
    cutsceneBefore: "Butch of the Rowdyruff Boys stands in your way! His brute strength is unmatched and he won't go down without a fight!",
    cutsceneAfter: 'Butch has been defeated! His raw power was no match for your determination and skill!',
    warningText: 'BUTCH IS CHARGING IN'
  },
  {
    id: 3, name: 'Mandler (Terra Cresta)', boss: 'Mandler', bossColor: '#9932CC',
    hp: 600, music: '13 Last Evil [Boss Battle].mp3',
    gimmick: 'gravity_shift',
    cutsceneBefore: 'Mandler from Terra Cresta descends from the cosmos! Gravity itself bends to its alien will as it warps reality!',
    cutsceneAfter: 'Mandler crumbles into cosmic dust! The gravity distortions finally fade away...',
    warningText: 'MANDLER DESCENDS FROM ABOVE'
  },
  {
    id: 4, name: 'Crusher-Bot MK.II', boss: 'Crusher-Bot MK.II', bossColor: '#708090',
    hp: 700, music: '13 Last Evil [Boss Battle].mp3',
    gimmick: 'falling_debris',
    cutsceneBefore: 'Crusher-Bot MK.II activates with a thunderous roar! Its massive frame shakes the very ground beneath you!',
    cutsceneAfter: 'Crusher-Bot MK.II explodes into a mountain of scrap metal! The way forward is clear!',
    warningText: 'CRUSHER-BOT MK.II ONLINE'
  },
  {
    id: 5, name: 'Metal Sonic', boss: 'Metal Sonic', bossColor: '#1E90FF',
    hp: 800, music: 'Metal Sonic (Stage 5 Boss).mp3',
    gimmick: 'speed_zones',
    cutsceneBefore: 'Metal Sonic appears in a blinding flash of blue light! His speed is absolutely unmatched — can you keep up?',
    cutsceneAfter: "Metal Sonic sparks and collapses! But something dark stirs beyond... this isn't over yet.",
    warningText: 'METAL SONIC AT FULL SPEED'
  },
  {
    id: 6, name: 'Roaring Knight (Finale)', boss: 'Roaring Knight', bossColor: '#FFD700',
    hp: 1000, music: '13 Last Evil [Boss Battle].mp3',
    gimmick: 'phase_shift',
    cutsceneBefore: 'The Roaring Knight emerges from the shadows of Deltarune! Prepare yourself for the final battle — everything is on the line!',
    cutsceneAfter: 'The Roaring Knight kneels in defeat... but a dark energy stirs behind it! Metal Sonic rises once more!',
    warningText: 'THE ROARING KNIGHT APPEARS'
  },
  {
    id: 7, name: 'Roaring Metal (True Finale)', boss: 'Roaring Knight × Metal Sonic', bossColor: '#FF1493',
    hp: 1500, music: 'Roaring Metal - Roaring Knight x Metal Sonic (Stage 7 True Finale Boss).mp3',
    gimmick: 'enrage_all',
    cutsceneBefore: 'The Roaring Knight and Metal Sonic FUSE into ROARING METAL! This is the TRUE final battle! Give it everything you have!',
    cutsceneAfter: 'ROARING METAL is vanquished at last! The darkness dissipates and peace returns to the world! YOU ARE THE TRUE CHAMPION!',
    warningText: 'ROARING METAL AWAKENS'
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
    this.currentMusic = '';
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
    if (this.currentMusic === src && this.music && !this.music.paused) return;
    this.stopMusic();
    this.currentMusic = src;
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
    this.currentMusic = '';
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
    this.keyDownBuffer = {};
    this.setupKeyboard();
    this.setupTouch();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyZ','KeyX','KeyP','Escape','KeyA','KeyW','KeyS','KeyD','Enter'].includes(e.code)) {
        e.preventDefault();
      }
      if (!this.keys[e.code]) {
        this.keyDownBuffer[e.code] = true;
      }
      this.keys[e.code] = true;
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
      this.justPressed[key] = this.keyDownBuffer[key] || (this.keys[key] && !this.prevKeys[key]);
    }
    this.prevKeys = { ...this.keys };
    this.keyDownBuffer = {};
  }

  isLeft() { return this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touch.left; }
  isRight() { return this.keys['ArrowRight'] || this.keys['KeyD'] || this.touch.right; }
  isUp() { return this.keys['ArrowUp'] || this.keys['KeyW'] || this.touch.up; }
  isDown() { return this.keys['ArrowDown'] || this.keys['KeyS'] || this.touch.down; }
  isFire() { return this.keys['Space'] || this.keys['KeyZ'] || this.justPressed['Space'] || this.justPressed['KeyZ'] || this.touch.fire; }
  isJump() { return this.justPressed['ArrowUp'] || this.justPressed['KeyW'] || this.justPressed['KeyX'] || this.touch.jump; }
  isPause() { return this.justPressed['KeyP'] || this.justPressed['Escape'] || this.touch.pause; }
  isAnyKey() { return Object.values(this.justPressed).some(v => v) || Object.values(this.touch).some(v => v); }
}

// ==================== PARTICLE SYSTEM ====================
class Particle {
  constructor(x, y, vx, vy, color, life, size) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.color = color;
    this.life = life; this.maxLife = life;
    this.size = size || (2 + Math.random() * 4);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.08;
    this.vx *= 0.99;
    this.life--;
    this.size *= 0.96;
  }

  draw(ctx) {
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 4;
    ctx.shadowColor = this.color;
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  isDead() { return this.life <= 0; }
}

// ==================== PROJECTILE ====================
class Projectile {
  constructor(x, y, vx, vy, damage, owner, color, width, height) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.damage = damage;
    this.owner = owner;
    this.color = color || (owner === 'player' ? '#ffcc00' : '#ff00ff');
    this.width = width || 12;
    this.height = height || 8;
    this.active = true;
    this.homing = false;
    this.trail = [];
    this.age = 0;
  }

  update(target) {
    this.age++;
    // Trail
    if (this.age % 2 === 0) {
      this.trail.push({ x: this.x + this.width / 2, y: this.y + this.height / 2 });
      if (this.trail.length > 6) this.trail.shift();
    }

    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -60 || this.x > CANVAS_W + 60 || this.y < -60 || this.y > CANVAS_H + 60) {
      this.active = false;
    }
    // Homing
    if (this.homing && target && this.age > 10) {
      const dx = target.x + target.width / 2 - this.x;
      const dy = target.y + target.height / 2 - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        this.vx += (dx / dist) * 0.35;
        this.vy += (dy / dist) * 0.35;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 8;
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed;
          this.vy = (this.vy / speed) * maxSpeed;
        }
      }
    }
  }

  draw(ctx) {
    // Trail
    this.trail.forEach((t, i) => {
      const alpha = (i / this.trail.length) * 0.3;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      const s = (this.width * 0.6) * (i / this.trail.length);
      ctx.fillRect(t.x - s / 2, t.y - s / 2, s, s);
    });
    ctx.globalAlpha = 1;

    // Projectile body
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    if (this.owner === 'boss') {
      // Boss projectiles are rounder
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Player projectiles are elongated
      ctx.fillRect(this.x, this.y, this.width, this.height);
      // Bright core
      ctx.fillStyle = '#fff';
      ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
    }
    ctx.shadowBlur = 0;
  }
}


// ==================== PLAYER ====================
class Player {
  constructor(charDef) {
    this.charDef = charDef;
    this.width = 44;
    this.height = 52;
    this.x = 80;
    this.y = GROUND_Y - this.height;
    this.vx = 0; this.vy = 0;
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
    this.runFrame = 0;
    this.isMoving = false;
    this.isShooting = false;
    this.shootAnim = 0;
  }

  update(input, now, homingTarget) {
    // Movement
    this.vx = 0;
    this.isMoving = false;
    if (input.isLeft()) { this.vx = -this.speed; this.facing = -1; this.isMoving = true; }
    if (input.isRight()) { this.vx = this.speed; this.facing = 1; this.isMoving = true; }

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
    this.x = Math.max(0, Math.min(this.x, CANVAS_W * 0.55));
    this.y = Math.max(0, Math.min(this.y, CANVAS_H - this.height));

    // Shooting
    if (input.isFire() && now - this.lastFire > this.fireRate) {
      this.shoot();
      this.lastFire = now;
      this.isShooting = true;
      this.shootAnim = 8;
    }

    // Update projectiles
    this.projectiles = this.projectiles.filter(p => p.active);
    this.projectiles.forEach(p => p.update(homingTarget));

    // Invincibility timer
    if (this.invincible > 0) this.invincible--;

    // Shoot animation
    if (this.shootAnim > 0) this.shootAnim--;
    else this.isShooting = false;

    // Animation
    this.animTimer++;
    if (this.animTimer > 6) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
      if (this.isMoving) this.runFrame = (this.runFrame + 1) % 4;
    }
  }

  shoot() {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2 - 4;
    const dir = this.facing;

    switch (this.charDef.special) {
      case 'spread': {
        for (let i = -1; i <= 1; i++) {
          this.projectiles.push(new Projectile(
            cx + dir * 10, cy + i * 8,
            this.charDef.projectileSpeed * dir, i * 2.5,
            this.damage, 'player', this.charDef.projectileColor, 10, 6
          ));
        }
        break;
      }
      case 'power': {
        this.projectiles.push(new Projectile(
          cx + dir * 12, cy,
          this.charDef.projectileSpeed * dir, 0,
          this.damage, 'player', this.charDef.projectileColor, 22, 16
        ));
        break;
      }
      case 'homing': {
        const p = new Projectile(
          cx + dir * 8, cy,
          this.charDef.projectileSpeed * dir, 0,
          this.damage, 'player', this.charDef.projectileColor, 10, 10
        );
        p.homing = true;
        this.projectiles.push(p);
        break;
      }
      default: { // rapid
        this.projectiles.push(new Projectile(
          cx + dir * 10, cy,
          this.charDef.projectileSpeed * dir, 0,
          this.damage, 'player', this.charDef.projectileColor, 14, 6
        ));
        break;
      }
    }
  }

  takeDamage(amount) {
    if (this.invincible > 0) return false;
    this.hp -= amount;
    this.invincible = 40;
    if (this.hp < 0) this.hp = 0;
    return true;
  }

  draw(ctx) {
    if (this.invincible > 0 && Math.floor(this.invincible / 3) % 2 === 0) return;

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    if (this.facing === -1) ctx.scale(-1, 1);

    const c = this.charDef;
    const bodyW = this.width;
    const bodyH = this.height;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, bodyH / 2 + 2, bodyW / 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs (animated when moving)
    const legOffset = this.isMoving ? Math.sin(this.runFrame * 1.5) * 5 : 0;
    ctx.fillStyle = c.color2 || c.color;
    ctx.fillRect(-bodyW / 4 - 2, bodyH / 4 + legOffset, 10, bodyH / 4);
    ctx.fillRect(bodyW / 4 - 6, bodyH / 4 - legOffset, 10, bodyH / 4);

    // Body
    ctx.fillStyle = c.color;
    const bodyTop = -bodyH / 4;
    if (c.bodyType === 'bulky') {
      ctx.fillRect(-bodyW / 2 - 2, bodyTop, bodyW + 4, bodyH / 2 + 4);
    } else if (c.bodyType === 'slim') {
      ctx.fillRect(-bodyW / 3, bodyTop, bodyW * 0.66, bodyH / 2);
    } else {
      ctx.fillRect(-bodyW / 2, bodyTop, bodyW, bodyH / 2);
    }

    // Body highlight
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(-bodyW / 4, bodyTop + 2, bodyW / 3, bodyH / 4);

    // Head
    const headSize = c.bodyType === 'bulky' ? 16 : 13;
    ctx.fillStyle = c.headColor;
    ctx.beginPath();
    ctx.arc(0, -bodyH / 4 - headSize + 4, headSize, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.arc(0, -bodyH / 4 - headSize + 1, headSize, Math.PI, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(4, -bodyH / 4 - headSize + 3, 6, 5);
    ctx.fillStyle = c.eyeColor;
    ctx.fillRect(5, -bodyH / 4 - headSize + 4, 4, 3);

    // Arm + weapon (animated)
    const armBaseX = bodyW / 3;
    const armBaseY = bodyTop + 8;
    const armBob = this.isShooting ? -4 : Math.sin(this.animFrame * 0.8) * 2;

    ctx.fillStyle = c.color;
    if (c.bodyType === 'bulky') {
      ctx.fillRect(armBaseX, armBaseY + armBob, 16, 12);
    } else {
      ctx.fillRect(armBaseX, armBaseY + armBob, 14, 8);
    }

    // Shooting effect
    if (this.isShooting && this.shootAnim > 4) {
      ctx.fillStyle = c.projectileColor;
      ctx.shadowBlur = 10;
      ctx.shadowColor = c.projectileColor;
      ctx.beginPath();
      ctx.arc(armBaseX + 18, armBaseY + armBob + 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

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
    this.patternDuration = 150;
    this.moveTimer = 0;
    this.phase = 1;
    this.enraged = false;
    this.flashTimer = 0;
    this.defeated = false;
    this.hitShake = 0;
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
      this.attackInterval = Math.max(12, this.attackInterval - 10);
    }
    this.updateMovement(player);
    if (this.attackTimer >= this.attackInterval) {
      this.attackTimer = 0;
      this.attack(player);
    }
    this.projectiles = this.projectiles.filter(p => p.active);
    this.projectiles.forEach(p => p.update(player));
    if (this.flashTimer > 0) this.flashTimer--;
    if (this.hitShake > 0) this.hitShake--;
    this.x = Math.max(CANVAS_W * 0.4, Math.min(this.x, CANVAS_W - this.width - 10));
    this.y = Math.max(10, Math.min(this.y, GROUND_Y - this.height));
  }

  updateMovement(player) {
    this.y += Math.sin(this.moveTimer * 0.03) * 2;
    this.x += Math.cos(this.moveTimer * 0.02) * 0.5;
  }

  attack(player) {
    this.basicAttack(player);
  }

  basicAttack(player) {
    const cx = this.x;
    const cy = this.y + this.height / 2;
    this.projectiles.push(new Projectile(cx, cy, -5, 0, 10, 'boss', this.color, 16, 12));
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.flashTimer = 8;
    this.hitShake = 4;
    if (this.hp <= 0) {
      this.hp = 0;
      this.defeated = true;
    }
  }

  draw(ctx) {
    if (this.defeated) return;
    ctx.save();
    const sx = this.hitShake > 0 ? (Math.random() - 0.5) * 4 : 0;
    const sy = this.hitShake > 0 ? (Math.random() - 0.5) * 4 : 0;
    ctx.translate(sx, sy);
    if (this.flashTimer > 0) ctx.globalAlpha = 0.5 + Math.random() * 0.3;
    this.drawBoss(ctx);
    ctx.restore();
    this.projectiles.forEach(p => p.draw(ctx));
  }

  drawBoss(ctx) {
    const gradient = ctx.createRadialGradient(
      this.x + this.width / 2, this.y + this.height / 2, 10,
      this.x + this.width / 2, this.y + this.height / 2, this.width / 2
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, '#111');
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    if (this.enraged) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff0000';
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 3;
      ctx.strokeRect(this.x - 3, this.y - 3, this.width + 6, this.height + 6);
      ctx.shadowBlur = 0;
    }
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x + this.width * 0.25, this.y + this.height * 0.25, 14, 14);
    ctx.fillRect(this.x + this.width * 0.55, this.y + this.height * 0.25, 14, 14);
    ctx.fillStyle = '#f00';
    const lookX = Math.sin(this.moveTimer * 0.05) * 3;
    ctx.fillRect(this.x + this.width * 0.28 + lookX, this.y + this.height * 0.28, 7, 7);
    ctx.fillRect(this.x + this.width * 0.58 + lookX, this.y + this.height * 0.28, 7, 7);
    // Boss name label
    ctx.fillStyle = this.color;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.stageDef.boss, this.x + this.width / 2, this.y - 6);
  }
}


// ==================== BOSS IMPLEMENTATIONS ====================
function createBoss(stageIndex) {
  const stageDef = STAGES[stageIndex];
  const boss = new BossEntity(stageDef, stageIndex);

  switch (stageIndex) {
    case 0: // Stage 1: Double Mecha Rocket (Big Core MK.I + Fire Breath)
      boss.width = 140; boss.height = 90;
      boss.attackInterval = 50;
      boss.drawBoss = function(ctx) {
        // Big Core MK.I (upper section)
        ctx.fillStyle = '#B22222';
        ctx.fillRect(this.x, this.y, this.width, this.height / 2);
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(this.x + 10, this.y + 5, 30, 30);
        ctx.fillRect(this.x + this.width - 40, this.y + 5, 30, 30);
        // Core eye
        ctx.fillStyle = '#FF4500';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#FF4500';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 4, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Fire Breath (lower section)
        ctx.fillStyle = '#FF8C00';
        ctx.fillRect(this.x, this.y + this.height / 2, this.width, this.height / 2);
        // Fire vents
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(this.x + 20 + i * 40, this.y + this.height - 15, 20, 10);
        }
        // Connection bolts
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x + 5, this.y + this.height / 2 - 3, this.width - 10, 6);
        // Label
        ctx.fillStyle = '#FF4500';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BIG CORE × FIRE BREATH', this.x + this.width / 2, this.y - 6);
        if (this.enraged) {
          ctx.shadowBlur = 20; ctx.shadowColor = '#ff0000';
          ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 3;
          ctx.strokeRect(this.x - 3, this.y - 3, this.width + 6, this.height + 6);
          ctx.shadowBlur = 0;
        }
      };
      boss.attack = function(player) {
        const cx = this.x;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Laser beams from Big Core
            for (let i = 0; i < 3; i++) {
              this.projectiles.push(new Projectile(cx, cy + i * 20 - 20, -7, 0, 8, 'boss', '#FF4500', 26, 6));
            }
            break;
          case 1: // Fire breath spray
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI / 5) * (i - 2.5);
              this.projectiles.push(new Projectile(cx, cy, -4 * Math.cos(angle), -4 * Math.sin(angle), 10, 'boss', '#FF8C00', 10, 10));
            }
            break;
          case 2: // Combined attack
            for (let i = 0; i < 2; i++) {
              this.projectiles.push(new Projectile(cx, cy + i * 30 - 15, -7, 0, 8, 'boss', '#FF4500', 26, 6));
            }
            for (let i = 0; i < 4; i++) {
              const angle = (Math.PI / 6) * (i - 1.5);
              this.projectiles.push(new Projectile(cx, cy, -4 * Math.cos(angle), -4 * Math.sin(angle), 8, 'boss', '#FF8C00', 10, 10));
            }
            break;
        }
      };
      break;

    case 1: // Stage 2: Butch (Rowdyruff Boys)
      boss.width = 70; boss.height = 85;
      boss.attackInterval = 65;
      boss.chargeTimer = 0; boss.charging = false;
      boss.updateMovement = function(player) {
        if (this.charging) {
          this.x -= 9;
          this.chargeTimer--;
          if (this.chargeTimer <= 0 || this.x < CANVAS_W * 0.2) {
            this.charging = false;
            this.x = CANVAS_W - this.width - 60;
          }
        } else {
          this.y += Math.sin(this.moveTimer * 0.04) * 3;
          if (Math.random() < 0.008 * (this.enraged ? 2.5 : 1)) {
            this.charging = true;
            this.chargeTimer = 25;
          }
        }
      };
      boss.drawBoss = function(ctx) {
        // Butch body - green/black Rowdyruff style
        ctx.fillStyle = '#228B22';
        ctx.fillRect(this.x + 10, this.y + 20, this.width - 20, this.height - 20);
        // Head
        ctx.fillStyle = '#FFE0B2';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 15, 18, 0, Math.PI * 2);
        ctx.fill();
        // Spiky hair (Rowdyruff style)
        ctx.fillStyle = '#228B22';
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          const angle = -Math.PI + (Math.PI / 4) * i;
          ctx.moveTo(this.x + this.width / 2 + Math.cos(angle) * 14, this.y + 8 + Math.sin(angle) * 10);
          ctx.lineTo(this.x + this.width / 2 + Math.cos(angle) * 24, this.y + 2 + Math.sin(angle) * 16);
          ctx.lineTo(this.x + this.width / 2 + Math.cos(angle + 0.3) * 14, this.y + 8 + Math.sin(angle + 0.3) * 10);
          ctx.fill();
        }
        // Angry eyes
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x + 20, this.y + 10, 10, 8);
        ctx.fillRect(this.x + 40, this.y + 10, 10, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 22, this.y + 12, 6, 5);
        ctx.fillRect(this.x + 42, this.y + 12, 6, 5);
        // Label
        ctx.fillStyle = '#228B22';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BUTCH', this.x + this.width / 2, this.y - 6);
        if (this.enraged) {
          ctx.shadowBlur = 15; ctx.shadowColor = '#ff0000';
          ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 2;
          ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
          ctx.shadowBlur = 0;
        }
        // Charging effect
        if (this.charging) {
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 2;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width, this.y + this.height / 2);
            ctx.lineTo(this.x + this.width + 20 + i * 15, this.y + this.height / 2 - 10 + i * 10);
            ctx.stroke();
          }
        }
      };
      boss.attack = function(player) {
        const cx = this.x;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Punch wave
            this.projectiles.push(new Projectile(cx, cy, -8, 0, 15, 'boss', '#228B22', 22, 22));
            break;
          case 1: // Ground pound
            for (let i = 0; i < 5; i++) {
              this.projectiles.push(new Projectile(cx - i * 35, GROUND_Y - 20, -3, -2 - i * 0.5, 10, 'boss', '#8B4513', 14, 14));
            }
            break;
          case 2: // Triple punch
            for (let i = -1; i <= 1; i++) {
              this.projectiles.push(new Projectile(cx, cy + i * 28, -9, i * 0.8, 12, 'boss', '#32CD32', 18, 14));
            }
            break;
        }
      };
      break;

    case 2: // Stage 3: Mandler (Terra Cresta)
      boss.width = 100; boss.height = 90;
      boss.attackInterval = 45;
      boss.rotAngle = 0;
      boss.updateMovement = function(player) {
        this.rotAngle += 0.03;
        this.x = CANVAS_W - 200 + Math.cos(this.rotAngle) * 60;
        this.y = CANVAS_H / 2 - this.height / 2 + Math.sin(this.rotAngle * 1.5) * 120;
      };
      boss.drawBoss = function(ctx) {
        // Mandler body - alien creature
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2.2, 0, Math.PI * 2);
        ctx.fill();
        // Inner core
        ctx.fillStyle = '#9932CC';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Orbiting eyes
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * 2 * i) / 6 + this.moveTimer * 0.04;
          const ex = this.x + this.width / 2 + Math.cos(angle) * 30;
          const ey = this.y + this.height / 2 + Math.sin(angle) * 25;
          ctx.fillStyle = '#DA70D6';
          ctx.beginPath();
          ctx.arc(ex, ey, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(ex + 1, ey - 1, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        // Central eye
        ctx.fillStyle = '#FF00FF';
        ctx.shadowBlur = 15; ctx.shadowColor = '#FF00FF';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Label
        ctx.fillStyle = '#9932CC';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('MANDLER', this.x + this.width / 2, this.y - 8);
        if (this.enraged) {
          ctx.shadowBlur = 20; ctx.shadowColor = '#ff0000';
          ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      };
      boss.attack = function(player) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Rotating ring
            for (let i = 0; i < 8; i++) {
              const angle = (Math.PI * 2 * i) / 8 + this.moveTimer * 0.05;
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * 3.5, Math.sin(angle) * 3.5, 8, 'boss', '#9932CC', 10, 10));
            }
            break;
          case 1: // Aimed at player
            {
              const dx = player.x - cx; const dy = player.y - cy;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              for (let i = -1; i <= 1; i++) {
                this.projectiles.push(new Projectile(cx, cy, (dx / dist) * 4 + i * 0.5, (dy / dist) * 4, 12, 'boss', '#DA70D6', 14, 14));
              }
            }
            break;
          case 2: // Spiral
            for (let i = 0; i < 5; i++) {
              const angle = this.moveTimer * 0.12 + (Math.PI / 2.5) * i;
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, 8, 'boss', '#BA55D3', 8, 8));
            }
            break;
        }
      };
      break;

    case 3: // Stage 4: Crusher-Bot MK.II
      boss.width = 130; boss.height = 120;
      boss.attackInterval = 75;
      boss.stompCooldown = 0; boss.stomping = false;
      boss.updateMovement = function(player) {
        this.y += Math.sin(this.moveTimer * 0.02) * 1.5;
        if (this.stompCooldown > 0) this.stompCooldown--;
        if (!this.stomping && this.stompCooldown === 0 && Math.random() < 0.006) {
          this.stomping = true;
          this.stompCooldown = 50;
          this.origY = this.y;
          this.y = 30;
        }
        if (this.stomping && this.stompCooldown < 25) {
          this.y += 12;
          if (this.y >= GROUND_Y - this.height) {
            this.y = GROUND_Y - this.height;
            this.stomping = false;
          }
        }
      };
      boss.drawBoss = function(ctx) {
        // Robot body
        ctx.fillStyle = '#556677';
        ctx.fillRect(this.x + 15, this.y + 20, this.width - 30, this.height - 30);
        // Head/cabin
        ctx.fillStyle = '#708090';
        ctx.fillRect(this.x + 25, this.y, this.width - 50, 30);
        // Eyes (LED)
        ctx.fillStyle = '#FF0000';
        ctx.shadowBlur = 8; ctx.shadowColor = '#FF0000';
        ctx.fillRect(this.x + 35, this.y + 10, 12, 8);
        ctx.fillRect(this.x + this.width - 47, this.y + 10, 12, 8);
        ctx.shadowBlur = 0;
        // Arms/crushers
        ctx.fillStyle = '#445566';
        ctx.fillRect(this.x, this.y + 30, 20, this.height - 40);
        ctx.fillRect(this.x + this.width - 20, this.y + 30, 20, this.height - 40);
        // Treads
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x + 20, this.y + this.height - 15, 30, 15);
        ctx.fillRect(this.x + this.width - 50, this.y + this.height - 15, 30, 15);
        // Warning light
        ctx.fillStyle = this.stomping ? '#FF0000' : '#FFD700';
        if (this.stomping) {
          ctx.shadowBlur = 15; ctx.shadowColor = '#FF0000';
        }
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Label
        ctx.fillStyle = '#708090';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CRUSHER-BOT MK.II', this.x + this.width / 2, this.y - 6);
        if (this.enraged) {
          ctx.shadowBlur = 20; ctx.shadowColor = '#ff0000';
          ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 3;
          ctx.strokeRect(this.x - 3, this.y - 3, this.width + 6, this.height + 6);
          ctx.shadowBlur = 0;
        }
      };
      boss.attack = function(player) {
        const cx = this.x;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Missile barrage
            for (let i = 0; i < 4; i++) {
              this.projectiles.push(new Projectile(cx, cy + (i - 1.5) * 28, -4.5, (i - 1.5) * 1.2, 12, 'boss', '#708090', 16, 10));
            }
            break;
          case 1: // Heavy slam
            for (let i = 0; i < 6; i++) {
              this.projectiles.push(new Projectile(this.x + i * 18, GROUND_Y - 30, -2.5, -Math.random() * 4, 15, 'boss', '#A9A9A9', 14, 14));
            }
            break;
          case 2: // Laser sweep
            for (let i = 0; i < 5; i++) {
              const angle = -Math.PI / 2 + (Math.PI / 4) * (i / 4);
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * 5.5, Math.sin(angle) * 5.5, 10, 'boss', '#B0C4DE', 22, 6));
            }
            break;
        }
      };
      break;


    case 4: // Stage 5: Metal Sonic
      boss.width = 60; boss.height = 65;
      boss.attackInterval = 30;
      boss.dashTimer = 0; boss.dashing = false;
      boss.spinTimer = 0; boss.spinning = false;
      boss.updateMovement = function(player) {
        if (this.dashing) {
          this.x -= 14;
          this.dashTimer--;
          if (this.dashTimer <= 0 || this.x < CANVAS_W * 0.15) {
            this.dashing = false;
            this.x = CANVAS_W - this.width - 60;
            this.y = player.y - this.height / 2;
          }
        } else if (this.spinning) {
          this.x += Math.cos(this.spinTimer * 0.3) * 6;
          this.y += Math.sin(this.spinTimer * 0.3) * 6;
          this.spinTimer--;
          if (this.spinTimer <= 0) this.spinning = false;
        } else {
          this.y += Math.sin(this.moveTimer * 0.06) * 5;
          this.x += Math.cos(this.moveTimer * 0.04) * 2.5;
          if (Math.random() < 0.012 * (this.enraged ? 2 : 1)) {
            this.dashing = true;
            this.dashTimer = 18;
            this.y = player.y - this.height / 2;
          }
          if (Math.random() < 0.005) {
            this.spinning = true;
            this.spinTimer = 40;
          }
        }
      };
      boss.drawBoss = function(ctx) {
        // Metal Sonic body - sleek blue
        ctx.fillStyle = '#1E90FF';
        // Head
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 15, 16, 0, Math.PI * 2);
        ctx.fill();
        // Torso
        ctx.fillStyle = '#1876CC';
        ctx.fillRect(this.x + 10, this.y + 25, this.width - 20, 25);
        // Legs
        ctx.fillStyle = '#1E90FF';
        ctx.fillRect(this.x + 12, this.y + 48, 12, 17);
        ctx.fillRect(this.x + 36, this.y + 48, 12, 17);
        // Metal ears/fins
        ctx.fillStyle = '#00BFFF';
        ctx.beginPath();
        ctx.moveTo(this.x + 8, this.y + 10);
        ctx.lineTo(this.x - 5, this.y - 5);
        ctx.lineTo(this.x + 18, this.y + 5);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 8, this.y + 10);
        ctx.lineTo(this.x + this.width + 5, this.y - 5);
        ctx.lineTo(this.x + this.width - 18, this.y + 5);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#FF0000';
        ctx.shadowBlur = 8; ctx.shadowColor = '#FF0000';
        ctx.fillRect(this.x + 18, this.y + 8, 8, 6);
        ctx.fillRect(this.x + 34, this.y + 8, 8, 6);
        ctx.shadowBlur = 0;
        // Jet exhaust
        if (this.dashing) {
          ctx.fillStyle = '#FFD700';
          ctx.shadowBlur = 12; ctx.shadowColor = '#FFD700';
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(this.x + this.width + 10 + i * 12, this.y + this.height / 2, 5 - i, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.shadowBlur = 0;
        }
        // Spin effect
        if (this.spinning) {
          ctx.strokeStyle = '#00BFFF';
          ctx.lineWidth = 2;
          for (let i = 0; i < 4; i++) {
            const a = this.moveTimer * 0.3 + (Math.PI / 2) * i;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 35 + i * 5, a, a + 0.5);
            ctx.stroke();
          }
        }
        // Label
        ctx.fillStyle = '#1E90FF';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('METAL SONIC', this.x + this.width / 2, this.y - 8);
        if (this.enraged) {
          ctx.shadowBlur = 15; ctx.shadowColor = '#ff0000';
          ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 2;
          ctx.strokeRect(this.x - 3, this.y - 3, this.width + 6, this.height + 6);
          ctx.shadowBlur = 0;
        }
      };
      boss.attack = function(player) {
        const cx = this.x;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Speed shots
            for (let i = 0; i < 2; i++) {
              this.projectiles.push(new Projectile(cx, cy + i * 15 - 7, -10, 0, 8, 'boss', '#1E90FF', 14, 6));
            }
            break;
          case 1: { // Homing
            const p = new Projectile(cx, cy, -3, 0, 10, 'boss', '#00BFFF', 12, 12);
            p.homing = true;
            this.projectiles.push(p);
            break;
          }
          case 2: // Fan spread
            for (let i = -3; i <= 3; i++) {
              this.projectiles.push(new Projectile(cx, cy, -7, i * 1.8, 8, 'boss', '#4169E1', 10, 6));
            }
            break;
        }
      };
      break;

    case 5: // Stage 6: Roaring Knight (Finale)
      boss.width = 90; boss.height = 105;
      boss.attackInterval = 50;
      boss.slashTimer = 0; boss.slashing = false;
      boss.darkEnergy = 0;
      boss.updateMovement = function(player) {
        this.y += Math.sin(this.moveTimer * 0.03) * 2.5;
        this.darkEnergy += 0.01;
        // Phase 2 teleport
        if (this.phase === 2 && Math.random() < 0.01) {
          this.x = CANVAS_W * 0.5 + Math.random() * (CANVAS_W * 0.4);
          this.y = Math.random() * (GROUND_Y - this.height - 60) + 30;
        }
        // Slash attack movement
        if (!this.slashing && Math.random() < 0.006) {
          this.slashing = true;
          this.slashTimer = 30;
        }
        if (this.slashing) {
          this.x -= 5;
          this.slashTimer--;
          if (this.slashTimer <= 0) {
            this.slashing = false;
            this.x = CANVAS_W - this.width - 60;
          }
        }
      };
      boss.drawBoss = function(ctx) {
        // Knight body - dark armor
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(this.x + 10, this.y + 25, this.width - 20, this.height - 35);
        // Cape
        ctx.fillStyle = '#2a1a3e';
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 25);
        ctx.lineTo(this.x + this.width - 5, this.y + 25);
        ctx.lineTo(this.x + this.width + 10, this.y + this.height + 5);
        ctx.lineTo(this.x - 10, this.y + this.height + 5);
        ctx.fill();
        // Helmet
        ctx.fillStyle = '#2d2d44';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 18, 22, 0, Math.PI * 2);
        ctx.fill();
        // Helmet horn
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2 - 5, this.y - 10);
        ctx.lineTo(this.x + this.width / 2, this.y - 25);
        ctx.lineTo(this.x + this.width / 2 + 5, this.y - 10);
        ctx.fill();
        // Visor (glowing)
        ctx.fillStyle = '#FFD700';
        ctx.shadowBlur = 12; ctx.shadowColor = '#FFD700';
        ctx.fillRect(this.x + this.width / 2 - 15, this.y + 10, 30, 8);
        ctx.shadowBlur = 0;
        // Sword
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(this.x - 5, this.y + 30, 5, 50);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x - 8, this.y + 28, 11, 6);
        // Dark aura
        if (this.enraged) {
          ctx.strokeStyle = '#8B0000';
          ctx.lineWidth = 2;
          for (let i = 0; i < 3; i++) {
            const r = 50 + i * 15 + Math.sin(this.moveTimer * 0.05 + i) * 5;
            ctx.globalAlpha = 0.3 - i * 0.08;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, r, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }
        // Slash trail
        if (this.slashing) {
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 3;
          ctx.shadowBlur = 10; ctx.shadowColor = '#FFD700';
          ctx.beginPath();
          ctx.moveTo(this.x + this.width, this.y + this.height / 2);
          ctx.lineTo(this.x + this.width + 30, this.y + this.height / 2 - 20);
          ctx.lineTo(this.x + this.width + 30, this.y + this.height / 2 + 20);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
        // Label
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ROARING KNIGHT', this.x + this.width / 2, this.y - 16);
      };
      boss.attack = function(player) {
        const cx = this.x;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Sword slash waves
            for (let i = 0; i < 3; i++) {
              const angle = -Math.PI / 4 + (Math.PI / 4) * i;
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * -6, Math.sin(angle) * 5, 14, 'boss', '#FFD700', 24, 6));
            }
            break;
          case 1: // Dark energy pillars
            for (let i = 0; i < 4; i++) {
              this.projectiles.push(new Projectile(player.x + (i - 1.5) * 50, -10, 0, 7, 12, 'boss', '#8B0000', 14, 30));
            }
            break;
          case 2: // Roaring blast (full circle)
            for (let i = 0; i < 10; i++) {
              const angle = (Math.PI * 2 * i) / 10;
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, 10, 'boss', '#FFD700', 12, 12));
            }
            break;
        }
      };
      break;

    case 6: // Stage 7: Roaring Metal (True Final Boss)
      boss.width = 110; boss.height = 110;
      boss.attackInterval = 25;
      boss.rotAngle = 0;
      boss.teleportCooldown = 0;
      boss.darkPulse = 0;
      boss.updateMovement = function(player) {
        this.rotAngle += 0.04;
        this.darkPulse += 0.02;
        this.x = CANVAS_W - 200 + Math.cos(this.rotAngle) * 70;
        this.y = CANVAS_H / 2 - this.height / 2 + Math.sin(this.rotAngle * 1.3) * 90;
        // Teleport in enrage
        this.teleportCooldown--;
        if (this.enraged && this.teleportCooldown <= 0 && Math.random() < 0.012) {
          this.x = CANVAS_W * 0.4 + Math.random() * (CANVAS_W * 0.5);
          this.y = Math.random() * (GROUND_Y - this.height - 20);
          this.teleportCooldown = 25;
        }
      };
      boss.drawBoss = function(ctx) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        // Combined form - knight armor + metal sonic tech
        // Dark aura
        ctx.strokeStyle = '#FF1493';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const r = 55 + i * 12 + Math.sin(this.darkPulse * 3 + i) * 8;
          ctx.globalAlpha = 0.2 - i * 0.04;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        // Body (fusion of knight + metal)
        ctx.fillStyle = '#2a1a3e';
        ctx.fillRect(this.x + 15, this.y + 25, this.width - 30, this.height - 35);
        // Metal Sonic blue tech overlay
        ctx.fillStyle = '#1E90FF';
        ctx.globalAlpha = 0.4;
        ctx.fillRect(this.x + 20, this.y + 30, this.width - 40, this.height - 40);
        ctx.globalAlpha = 1;
        // Cape
        ctx.fillStyle = '#3a1a4e';
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 25);
        ctx.lineTo(this.x + this.width - 10, this.y + 25);
        ctx.lineTo(this.x + this.width + 15, this.y + this.height + 10);
        ctx.lineTo(this.x - 15, this.y + this.height + 10);
        ctx.fill();
        // Helmet
        ctx.fillStyle = '#2d2d44';
        ctx.beginPath();
        ctx.arc(cx, this.y + 18, 24, 0, Math.PI * 2);
        ctx.fill();
        // Metal Sonic fins
        ctx.fillStyle = '#1E90FF';
        ctx.beginPath();
        ctx.moveTo(this.x + 8, this.y + 8);
        ctx.lineTo(this.x - 8, this.y - 12);
        ctx.lineTo(this.x + 20, this.y + 3);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 8, this.y + 8);
        ctx.lineTo(this.x + this.width + 8, this.y - 12);
        ctx.lineTo(this.x + this.width - 20, this.y + 3);
        ctx.fill();
        // Dual visor (Knight gold + Metal red)
        ctx.fillStyle = '#FFD700';
        ctx.shadowBlur = 10; ctx.shadowColor = '#FFD700';
        ctx.fillRect(cx - 18, this.y + 8, 16, 8);
        ctx.fillStyle = '#FF0000';
        ctx.shadowColor = '#FF0000';
        ctx.fillRect(cx + 2, this.y + 8, 16, 8);
        ctx.shadowBlur = 0;
        // Horn + Metal crest
        ctx.fillStyle = '#FF1493';
        ctx.shadowBlur = 12; ctx.shadowColor = '#FF1493';
        ctx.beginPath();
        ctx.moveTo(cx - 5, this.y - 10);
        ctx.lineTo(cx, this.y - 30);
        ctx.lineTo(cx + 5, this.y - 10);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Sword (energy blade)
        ctx.fillStyle = '#FF1493';
        ctx.shadowBlur = 15; ctx.shadowColor = '#FF1493';
        ctx.fillRect(this.x - 8, this.y + 30, 6, 55);
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x - 7, this.y + 32, 4, 50);
        ctx.shadowBlur = 0;
        // Label
        ctx.fillStyle = '#FF1493';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ROARING METAL', cx, this.y - 20);
        if (this.enraged) {
          ctx.shadowBlur = 25; ctx.shadowColor = '#ff0000';
          ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 4;
          ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
          ctx.shadowBlur = 0;
        }
      };
      boss.attack = function(player) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Combined laser + fire breath
            for (let i = 0; i < 4; i++) {
              this.projectiles.push(new Projectile(cx, cy + i * 18 - 27, -7, 0, 10, 'boss', '#FF1493', 22, 6));
            }
            for (let i = 0; i < 3; i++) {
              const angle = (Math.PI / 5) * (i - 1);
              this.projectiles.push(new Projectile(cx, cy, -4.5 * Math.cos(angle), -4.5 * Math.sin(angle), 10, 'boss', '#FF4500', 10, 10));
            }
            break;
          case 1: // Sword + dash
            for (let i = 0; i < 5; i++) {
              this.projectiles.push(new Projectile(cx, cy + i * 14 - 28, -8, 0, 12, 'boss', '#FFD700', 20, 6));
            }
            // Homing
            {
              const p = new Projectile(cx, cy, -4, 0, 14, 'boss', '#FF1493', 14, 14);
              p.homing = true;
              this.projectiles.push(p);
            }
            break;
          case 2: // Full power rotating ring + aimed
            for (let i = 0; i < 12; i++) {
              const angle = (Math.PI * 2 * i) / 12 + this.rotAngle;
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * 4, Math.sin(angle) * 4, 10, 'boss', '#FF1493', 10, 10));
            }
            {
              const dx = player.x - cx; const dy = player.y - cy;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              this.projectiles.push(new Projectile(cx, cy, (dx / dist) * 6, (dy / dist) * 6, 16, 'boss', '#FF0000', 18, 18));
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
    this.rings = []; // for speed_zones
    this.blocks = []; // for destructible_blocks
    this.platforms = []; // for moving platforms
  }

  setGimmick(type) {
    this.type = type;
    this.effects = [];
    this.timer = 0;
    this.rings = [];
    this.blocks = [];
    this.platforms = [];

    if (type === 'destructible_blocks') {
      // Create destructible blocks
      for (let i = 0; i < 4; i++) {
        this.blocks.push({
          x: 200 + i * 80, y: GROUND_Y - 40 - Math.random() * 60,
          width: 30, height: 30, hp: 3, active: true
        });
      }
    }
    if (type === 'speed_zones') {
      // Ring collectibles
      this.rings = [];
    }
    if (type === 'laser_walls') {
      // Moving platforms
      for (let i = 0; i < 3; i++) {
        this.platforms.push({
          x: 100 + i * 200, y: GROUND_Y - 80 - i * 60,
          width: 80, height: 12, speed: 1 + i * 0.5, dir: 1
        });
      }
    }
  }

  update(player) {
    this.timer++;

    switch (this.type) {
      case 'laser_walls':
        // Horizontal laser walls
        if (this.timer % 150 === 0) {
          const y = 50 + Math.random() * (GROUND_Y - 100);
          this.effects.push({ type: 'laser', y, width: CANVAS_W, timer: 80, warning: 40 });
        }
        // Update platforms
        this.platforms.forEach(p => {
          p.x += p.speed * p.dir;
          if (p.x < 50 || p.x + p.width > CANVAS_W * 0.55) p.dir *= -1;
        });
        break;

      case 'destructible_blocks':
        // Respawn blocks
        if (this.timer % 300 === 0) {
          const activeCount = this.blocks.filter(b => b.active).length;
          if (activeCount < 2) {
            this.blocks.push({
              x: 150 + Math.random() * 300, y: GROUND_Y - 40 - Math.random() * 60,
              width: 30, height: 30, hp: 3, active: true
            });
          }
        }
        // Check player projectiles vs blocks
        player.projectiles.forEach(p => {
          if (!p.active) return;
          this.blocks.forEach(b => {
            if (!b.active) return;
            if (p.x < b.x + b.width && p.x + p.width > b.x && p.y < b.y + b.height && p.y + p.height > b.y) {
              b.hp--;
              p.active = false;
              if (b.hp <= 0) b.active = false;
            }
          });
        });
        break;

      case 'gravity_shift':
        if (this.timer % 250 === 0) {
          this.effects.push({ type: 'gravity', dir: Math.random() > 0.5 ? -1 : 1, timer: 100 });
        }
        break;

      case 'falling_debris':
        if (this.timer % 45 === 0) {
          this.effects.push({ type: 'debris', x: 50 + Math.random() * (CANVAS_W - 100), y: -25, vy: 3 + Math.random() * 2, size: 15 + Math.random() * 15, timer: 200 });
        }
        break;

      case 'speed_zones':
        // Spawn rings
        if (this.timer % 120 === 0) {
          this.rings.push({
            x: 100 + Math.random() * (CANVAS_W * 0.4),
            y: GROUND_Y - 50 - Math.random() * 100,
            radius: 10, timer: 180, collected: false, anim: 0
          });
        }
        // Check ring collection
        this.rings.forEach(r => {
          if (r.collected) return;
          r.anim++;
          const dx = (player.x + player.width / 2) - r.x;
          const dy = (player.y + player.height / 2) - r.y;
          if (Math.sqrt(dx * dx + dy * dy) < r.radius + 20) {
            r.collected = true;
            player.invincible = Math.max(player.invincible, 60); // Shield!
          }
        });
        this.rings = this.rings.filter(r => !r.collected && r.timer > 0);
        this.rings.forEach(r => r.timer--);
        // Speed zone areas
        if (this.timer % 200 === 0) {
          this.effects.push({ type: 'speed', x: 50 + Math.random() * (CANVAS_W * 0.4), timer: 120 });
        }
        break;

      case 'phase_shift':
        if (this.timer % 200 === 0) {
          this.effects.push({ type: 'phase', timer: 60 });
        }
        break;

      case 'enrage_all':
        // All gimmicks combined
        if (this.timer % 180 === 0) {
          const types = ['laser', 'debris', 'speed', 'phase'];
          const t = types[Math.floor(Math.random() * types.length)];
          if (t === 'laser') {
            this.effects.push({ type: 'laser', y: 50 + Math.random() * (GROUND_Y - 100), width: CANVAS_W, timer: 60, warning: 30 });
          } else if (t === 'debris') {
            this.effects.push({ type: 'debris', x: 50 + Math.random() * (CANVAS_W - 100), y: -25, vy: 4 + Math.random() * 2, size: 20, timer: 200 });
          } else if (t === 'speed') {
            this.effects.push({ type: 'speed', x: 50 + Math.random() * (CANVAS_W * 0.4), timer: 90 });
          } else {
            this.effects.push({ type: 'phase', timer: 40 });
          }
        }
        break;
    }

    // Update effects
    this.effects = this.effects.filter(e => {
      e.timer--;
      if (e.type === 'debris') {
        e.y += e.vy;
        if (Math.abs(e.x - player.x) < 30 && Math.abs(e.y - player.y) < 30) {
          player.takeDamage(5);
        }
        if (e.y > GROUND_Y) return false;
      }
      if (e.type === 'gravity' && e.timer > 0) {
        player.vy += e.dir * 0.35;
      }
      if (e.type === 'speed' && e.timer > 0) {
        if (player.x > e.x && player.x < e.x + 100) {
          player.vx += 2.5;
        }
      }
      if (e.type === 'laser' && e.warning <= 0) {
        // Active laser - check collision
        if (player.y + player.height > e.y && player.y < e.y + 8) {
          player.takeDamage(8);
        }
      }
      if (e.type === 'laser' && e.warning > 0) e.warning--;
      return e.timer > 0;
    });

    // Platform collision (laser_walls gimmick)
    if (this.type === 'laser_walls') {
      this.platforms.forEach(p => {
        if (player.vy > 0 && player.y + player.height > p.y && player.y + player.height < p.y + p.height + 10
            && player.x + player.width > p.x && player.x < p.x + p.width) {
          player.y = p.y - player.height;
          player.vy = 0;
          player.onGround = true;
        }
      });
    }
  }

  draw(ctx) {
    // Draw gimmick effects
    this.effects.forEach(e => {
      switch (e.type) {
        case 'laser':
          if (e.warning > 0) {
            // Warning line
            ctx.fillStyle = `rgba(255, 0, 0, ${0.2 * (1 - e.warning / 40)})`;
            ctx.fillRect(0, e.y, CANVAS_W, 4);
            // Blinking indicators
            ctx.fillStyle = '#FF0000';
            ctx.font = 'bold 8px monospace';
            ctx.fillText('⚠ LASER', 10, e.y + 3);
          } else {
            // Active laser
            ctx.fillStyle = `rgba(255, 50, 0, ${0.6 + Math.sin(this.timer * 0.2) * 0.2})`;
            ctx.fillRect(0, e.y, CANVAS_W, 6);
            ctx.fillStyle = `rgba(255, 200, 100, 0.4)`;
            ctx.fillRect(0, e.y - 2, CANVAS_W, 10);
          }
          break;
        case 'debris':
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(e.x - e.size / 2, e.y - e.size / 2, e.size, e.size);
          ctx.fillStyle = '#A0522D';
          ctx.fillRect(e.x - e.size / 4, e.y - e.size / 4, e.size / 2, e.size / 2);
          break;
        case 'speed':
          ctx.fillStyle = `rgba(0, 255, 255, ${e.timer / 120 * 0.15})`;
          ctx.fillRect(e.x, 0, 100, CANVAS_H);
          // Arrow indicators
          ctx.fillStyle = `rgba(0, 255, 255, ${e.timer / 120 * 0.4})`;
          ctx.font = '20px sans-serif';
          for (let i = 0; i < 3; i++) {
            ctx.fillText('→', e.x + 30, 100 + i * 150);
          }
          break;
        case 'gravity':
          ctx.fillStyle = `rgba(128, 0, 128, ${e.timer / 100 * 0.12})`;
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
          // Direction indicator
          ctx.fillStyle = `rgba(200, 100, 255, ${e.timer / 100 * 0.5})`;
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(e.dir > 0 ? '⬇ GRAVITY UP ⬇' : '⬆ GRAVITY DOWN ⬆', CANVAS_W / 2, 80);
          ctx.textAlign = 'left';
          break;
        case 'phase':
          ctx.fillStyle = `rgba(255, 215, 0, ${e.timer / 60 * 0.1})`;
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
          break;
      }
    });

    // Draw platforms (laser_walls)
    if (this.type === 'laser_walls') {
      this.platforms.forEach(p => {
        ctx.fillStyle = '#4a4a6a';
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.fillStyle = '#6a6a8a';
        ctx.fillRect(p.x, p.y, p.width, 3);
      });
    }

    // Draw blocks (destructible_blocks)
    if (this.type === 'destructible_blocks') {
      this.blocks.forEach(b => {
        if (!b.active) return;
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.strokeStyle = '#6B4914';
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, b.y, b.width, b.height);
        // Crack indicators
        if (b.hp < 3) {
          ctx.strokeStyle = '#444';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(b.x + b.width / 2, b.y);
          ctx.lineTo(b.x + b.width / 2 + 5, b.y + b.height);
          ctx.stroke();
        }
        if (b.hp < 2) {
          ctx.beginPath();
          ctx.moveTo(b.x, b.y + b.height / 2);
          ctx.lineTo(b.x + b.width, b.y + b.height / 2 + 3);
          ctx.stroke();
        }
      });
    }

    // Draw rings (speed_zones)
    if (this.type === 'speed_zones') {
      this.rings.forEach(r => {
        if (r.collected) return;
        const pulse = Math.sin(r.anim * 0.1) * 3;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FFD700';
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }
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
    this.bestTimes = {};
    this.timeAttackMode = false;
    this.timeAttackStart = 0;
    this.timeAttackElapsed = 0;
    this.bgScrollX = 0;
    this.stageStartTime = 0;
    this.bossHitCount = 0;
    this.playerHitCount = 0;
    this.comboCount = 0;
    this.maxCombo = 0;
    this.lastHitTime = 0;

    this.options = {
      musicVol: 50,
      sfxVol: 70,
      difficulty: 1,
      screenShake: true
    };

    this.transitionTimer = 0;
    this.cutsceneText = '';
    this.cutsceneType = 'before';
    this.cutsceneCharIndex = 0;
    this.cutsceneFullText = '';
    this.cutsceneDisplayed = '';
    this.cutsceneTimer = 0;
    this.warningFlash = 0;

    this.loadAudio();

    this.menuOverlay = document.getElementById('menu-overlay');
    this.hudOverlay = document.getElementById('hud-overlay');
    this.touchControls = document.getElementById('touch-controls');
    this.bossWarning = document.getElementById('boss-warning');
    this.stageClear = document.getElementById('stage-clear');
    this.gameOverEl = document.getElementById('game-over');
    this.pauseOverlay = document.getElementById('pause-overlay');
    this.cutsceneOverlay = document.getElementById('cutscene-overlay');
    this.timeAttackTimerEl = document.getElementById('time-attack-timer');

    this.renderMenu();

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
    this.audio.loadSound('laser', 'BigCore_Laser.wav');
    this.audio.loadSound('grind', 'Grind.wav');
  }

  // ==================== GAME LOOP ====================
  loop() {
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 16.67, 2);
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
        this.warningFlash++;
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
        this.updateCutscene(now);
        break;
      case GameState.PAUSED:
        break;
    }

    // Pause/unpause
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

  updateCutscene(now) {
    this.cutsceneTimer++;
    if (this.cutsceneCharIndex < this.cutsceneFullText.length) {
      if (this.cutsceneTimer % 2 === 0) {
        this.cutsceneDisplayed += this.cutsceneFullText[this.cutsceneCharIndex];
        this.cutsceneCharIndex++;
        document.getElementById('cutscene-text').textContent = this.cutsceneDisplayed;
      }
    }
    if (this.input.isAnyKey()) {
      // Skip to full text or end cutscene
      if (this.cutsceneCharIndex < this.cutsceneFullText.length) {
        this.cutsceneDisplayed = this.cutsceneFullText;
        this.cutsceneCharIndex = this.cutsceneFullText.length;
        document.getElementById('cutscene-text').textContent = this.cutsceneDisplayed;
        // Reset just pressed so we don't immediately end
        this.input.justPressed = {};
      } else {
        this.endCutscene();
      }
    }
  }

  updatePlaying(dt, now) {
    if (!this.player || !this.boss) return;

    this.player.update(this.input, now, this.boss);
    this.boss.update(this.player);
    this.gimmicks.update(this.player);

    // Player projectiles vs boss
    this.player.projectiles.forEach(p => {
      if (p.active && this.collides(p, this.boss)) {
        this.boss.takeDamage(p.damage);
        p.active = false;
        this.audio.playSound('hit');
        this.spawnParticles(p.x, p.y, this.boss.color, 5);
        this.score += 10;
        this.bossHitCount++;
        // Combo system
        if (now - this.lastHitTime < 500) {
          this.comboCount++;
          this.score += this.comboCount * 5;
        } else {
          this.comboCount = 1;
        }
        this.lastHitTime = now;
        this.maxCombo = Math.max(this.maxCombo, this.comboCount);
      }
    });

    // Boss projectiles vs player
    this.boss.projectiles.forEach(p => {
      if (p.active && this.collides(p, this.player)) {
        const dmg = p.damage * this.getDiffMultiplier();
        if (this.player.takeDamage(dmg)) {
          p.active = false;
          this.audio.playSound('playerHurt');
          this.spawnParticles(p.x, p.y, '#ff0000', 6);
          this.playerHitCount++;
          this.comboCount = 0;
          if (this.options.screenShake) this.shakeScreen();
        }
      }
    });

    // Boss body vs player
    if (this.collides(this.player, this.boss) && this.player.invincible === 0) {
      this.player.takeDamage(5 * this.getDiffMultiplier());
      this.audio.playSound('impact');
      this.playerHitCount++;
      if (this.options.screenShake) this.shakeScreen();
    }

    this.updateHUD();

    // Boss defeated
    if (this.boss.defeated) {
      this.onBossDefeated();
    }

    // Player death
    if (this.player.hp <= 0) {
      this.onPlayerDeath();
    }

    // Time attack
    if (this.timeAttackMode) {
      this.timeAttackElapsed = now - this.timeAttackStart;
      this.updateTimeAttackDisplay();
    }

    this.bgScrollX += 0.5;
  }

  // ==================== COLLISION ====================
  collides(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  // ==================== DIFFICULTY ====================
  getDiffMultiplier() {
    return [0.6, 1.0, 1.5][this.options.difficulty];
  }

  // ==================== GAME FLOW ====================
  startGame(stageIndex) {
    this.currentStage = stageIndex || 0;
    this.score = 0;
    this.bossHitCount = 0;
    this.playerHitCount = 0;
    this.maxCombo = 0;
    this.comboCount = 0;
    if (this.timeAttackMode) {
      this.timeAttackStart = performance.now();
    }
    this.showCutscene('before');
  }

  showCutscene(type) {
    const stage = STAGES[this.currentStage];
    this.cutsceneType = type;
    this.cutsceneFullText = type === 'before' ? stage.cutsceneBefore : stage.cutsceneAfter;
    this.cutsceneDisplayed = '';
    this.cutsceneCharIndex = 0;
    this.cutsceneTimer = 0;
    this.state = GameState.CUTSCENE;
    this.hideAllOverlays();
    this.cutsceneOverlay.classList.add('active');
    document.getElementById('cutscene-text').textContent = '';
    document.getElementById('cutscene-speaker').textContent = type === 'before' ? `STAGE ${stage.id} — ${stage.name}` : 'STAGE CLEAR';
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
    this.transitionTimer = 100;
    this.warningFlash = 0;
    this.hideAllOverlays();
    this.bossWarning.classList.add('active');
    document.getElementById('warning-text').textContent = '⚠ WARNING! ⚠';
    document.getElementById('warning-boss-name').textContent = STAGES[this.currentStage].warningText;
    this.audio.playSound('warning');
    this.initStage();
  }

  initStage() {
    const stage = STAGES[this.currentStage];
    this.player = new Player(this.selectedChar);
    this.boss = createBoss(this.currentStage);

    const mult = this.getDiffMultiplier();
    this.boss.maxHp = Math.floor(this.boss.maxHp * mult);
    this.boss.hp = this.boss.maxHp;

    this.gimmicks.setGimmick(stage.gimmick);
    this.audio.playMusic(stage.music);
    this.particles = [];
    this.stageStartTime = performance.now();
  }

  onBossDefeated() {
    this.state = GameState.STAGE_CLEAR;
    this.transitionTimer = 130;
    this.stagesCleared.push(this.currentStage);
    const stageBonus = 1000 * (this.currentStage + 1);
    this.score += stageBonus;
    this.audio.stopMusic();
    this.audio.playSound('explosion');
    this.audio.playSound('clear');
    this.hideAllOverlays();
    this.stageClear.classList.add('active');
    document.getElementById('clear-stage-name').textContent = STAGES[this.currentStage].name;
    const elapsed = performance.now() - this.stageStartTime;
    document.getElementById('clear-stats').innerHTML = 
      `Time: ${this.formatTime(elapsed)} | Hits: ${this.bossHitCount} | Max Combo: ${this.maxCombo} | Bonus: +${stageBonus}`;

    // Explosion particles
    for (let i = 0; i < 40; i++) {
      this.spawnParticles(
        this.boss.x + this.boss.width / 2,
        this.boss.y + this.boss.height / 2,
        this.boss.color, 1
      );
    }

    // Flash effect
    const flash = document.createElement('div');
    flash.className = 'flash-overlay';
    document.getElementById('game-container').appendChild(flash);
    setTimeout(() => flash.remove(), 300);
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
    this.bossHitCount = 0;
    this.playerHitCount = 0;
    this.maxCombo = 0;
    this.comboCount = 0;
    this.showCutscene('before');
  }

  showVictory() {
    this.state = GameState.VICTORY;
    this.hideAllOverlays();
    this.gameOverEl.classList.add('active');
    document.getElementById('gameover-title').textContent = '🏆 VICTORY! 🏆';
    document.getElementById('gameover-title').style.color = '#00ff88';
    document.getElementById('gameover-title').style.textShadow = '0 0 25px #00ff88';
    document.getElementById('gameover-result').textContent = `All stages cleared! Final Score: ${this.score}`;
    if (this.timeAttackMode) {
      const time = this.timeAttackElapsed;
      document.getElementById('gameover-time').textContent = `Total Time: ${this.formatTime(time)}`;
      document.getElementById('gameover-time').style.display = 'block';
      // Best time
      if (!this.bestTimes['total'] || time < this.bestTimes['total']) {
        this.bestTimes['total'] = time;
      }
    }
    const statsHtml = `Boss Hits: ${this.bossHitCount} | Damage Taken: ${this.playerHitCount} | Max Combo: ${this.maxCombo}`;
    document.getElementById('gameover-stats').textContent = statsHtml;
    this.audio.stopMusic();
    this.audio.playSound('clear');
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
    const statsHtml = `Boss Hits: ${this.bossHitCount} | Damage Taken: ${this.playerHitCount} | Max Combo: ${this.maxCombo}`;
    document.getElementById('gameover-stats').textContent = statsHtml;
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
            <h1>🔥 FIREBOY 🔥</h1>
            <h2>THE LEGEND OF TERRA NEMESIS</h2>
            <div class="subtitle">— BOSS RUSH MODE —</div>
            <div class="version">v2.0</div>
          </div>
          <div class="menu-buttons">
            <button class="menu-btn" onclick="game.showMenu('${GameState.CHAR_SELECT}')">⚔ BOSS RUSH</button>
            <button class="menu-btn" onclick="game.showMenu('${GameState.STAGE_SELECT}')">🗺 STAGE SELECT</button>
            <button class="menu-btn" onclick="game.showMenu('${GameState.TIME_ATTACK}')">⏱ TIME ATTACK</button>
            <button class="menu-btn" onclick="game.showMenu('${GameState.OPTIONS}')">⚙ OPTIONS</button>
            <button class="menu-btn" onclick="game.showMenu('${GameState.EXTRA}')">★ EXTRA</button>
          </div>
        `;
        break;

      case GameState.CHAR_SELECT:
        container.innerHTML = `
          <button class="back-btn" onclick="game.showMenu('${GameState.MENU}')">← BACK</button>
          <div class="title-section">
            <h2>SELECT YOUR FIGHTER</h2>
          </div>
          <div class="char-select-grid">
            ${Object.values(CHARACTERS).map(c => `
              <div class="char-card ${this.selectedChar && this.selectedChar.id === c.id ? 'selected' : ''}" onclick="game.selectCharacter('${c.id}')">
                <div class="char-icon" style="background: linear-gradient(180deg, ${c.color}, ${c.color2});">${c.icon}</div>
                <div class="char-name">${c.name}</div>
                <div class="char-desc">${c.description}</div>
                <div class="char-special">★ ${c.specialName}</div>
                <div class="char-stats">
                  <div class="stat-row"><span>HP</span><div class="stat-bar-mini"><div class="stat-bar-mini-fill" style="width:${c.hp / 1.2}%; background:${c.color}"></div></div></div>
                  <div class="stat-row"><span>SPD</span><div class="stat-bar-mini"><div class="stat-bar-mini-fill" style="width:${c.speed * 13}%; background:${c.color}"></div></div></div>
                  <div class="stat-row"><span>ATK</span><div class="stat-bar-mini"><div class="stat-bar-mini-fill" style="width:${c.damage * 3.5}%; background:${c.color}"></div></div></div>
                  <div class="stat-row"><span>RATE</span><div class="stat-bar-mini"><div class="stat-bar-mini-fill" style="width:${Math.min(100, 10000 / c.fireRate)}%; background:${c.color}"></div></div></div>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="menu-btn" onclick="game.confirmCharacter()" ${!this.selectedChar ? 'disabled' : ''}>▶ START BOSS RUSH</button>
        `;
        break;

      case GameState.STAGE_SELECT:
        container.innerHTML = `
          <button class="back-btn" onclick="game.showMenu('${GameState.MENU}')">← BACK</button>
          <div class="title-section">
            <h2>🗺 STAGE SELECT</h2>
          </div>
          <div class="stage-list">
            ${STAGES.map((s, i) => {
              const unlocked = i === 0 || this.stagesCleared.includes(i - 1);
              const cleared = this.stagesCleared.includes(i);
              return `
                <div class="stage-item ${!unlocked ? 'locked' : ''} ${cleared ? 'cleared' : ''}" onclick="game.selectStage(${i})">
                  <div class="stage-num">${s.id}</div>
                  <div class="stage-info">
                    <div class="stage-name">${s.name}</div>
                    <div class="stage-boss">Boss: ${s.boss}</div>
                    <div class="stage-gimmick">Gimmick: ${s.gimmick.replace(/_/g, ' ')}</div>
                  </div>
                  ${cleared ? '<div class="stage-check">✓</div>' : (!unlocked ? '<div class="stage-lock-icon">🔒</div>' : '')}
                </div>
              `;
            }).join('')}
          </div>
        `;
        break;

      case GameState.OPTIONS:
        container.innerHTML = `
          <button class="back-btn" onclick="game.showMenu('${GameState.MENU}')">← BACK</button>
          <div class="title-section">
            <h2>⚙ OPTIONS</h2>
          </div>
          <div class="options-panel">
            <div class="option-row">
              <span class="option-label">🎵 Music Volume</span>
              <div class="option-value">
                <button class="option-btn" onclick="game.adjustOption('musicVol', -10)">−</button>
                <span id="opt-music" style="min-width:40px;text-align:center">${this.options.musicVol}%</span>
                <button class="option-btn" onclick="game.adjustOption('musicVol', 10)">+</button>
              </div>
            </div>
            <div class="option-row">
              <span class="option-label">🔊 SFX Volume</span>
              <div class="option-value">
                <button class="option-btn" onclick="game.adjustOption('sfxVol', -10)">−</button>
                <span id="opt-sfx" style="min-width:40px;text-align:center">${this.options.sfxVol}%</span>
                <button class="option-btn" onclick="game.adjustOption('sfxVol', 10)">+</button>
              </div>
            </div>
            <div class="option-row">
              <span class="option-label">💪 Difficulty</span>
              <div class="option-value">
                <button class="option-btn" onclick="game.adjustOption('difficulty', -1)">−</button>
                <span id="opt-diff" style="min-width:60px;text-align:center">${['EASY','NORMAL','HARD'][this.options.difficulty]}</span>
                <button class="option-btn" onclick="game.adjustOption('difficulty', 1)">+</button>
              </div>
            </div>
            <div class="option-row">
              <span class="option-label">📳 Screen Shake</span>
              <div class="option-value">
                <button class="menu-btn" style="width:auto;padding:8px 18px;font-size:12px" onclick="game.toggleShake()">${this.options.screenShake ? 'ON' : 'OFF'}</button>
              </div>
            </div>
          </div>
        `;
        break;

      case GameState.TIME_ATTACK:
        container.innerHTML = `
          <button class="back-btn" onclick="game.showMenu('${GameState.MENU}')">← BACK</button>
          <div class="title-section">
            <h2>⏱ TIME ATTACK</h2>
            <div class="subtitle">Complete all 7 stages as fast as possible!</div>
          </div>
          <div class="menu-buttons">
            <button class="menu-btn" onclick="game.startTimeAttack()">▶ START TIME ATTACK</button>
          </div>
          <div style="margin-top:20px; text-align:center; color:#888; font-size:13px;">
            <p>Best Time: ${this.bestTimes['total'] ? this.formatTime(this.bestTimes['total']) : '--:--:---'}</p>
          </div>
        `;
        break;

      case GameState.EXTRA:
        container.innerHTML = `
          <button class="back-btn" onclick="game.showMenu('${GameState.MENU}')">← BACK</button>
          <div class="title-section">
            <h2>★ EXTRA</h2>
          </div>
          <div style="text-align:center; color:#ccc; font-size:14px; max-width:450px; line-height:1.8;">
            <p><strong style="color:#ff6b35">🔥 Playable Characters:</strong></p>
            <p style="color:#FF6B35">Fireboy</p>
            <p style="color:#FF69B4">Caroline</p>
            <p style="color:#DC143C">Butch</p>
            <p style="color:#4169E1">Anabel</p>
            <p style="margin-top:12px"><strong style="color:#ffcc00">⚔ Boss Encounters:</strong></p>
            <p>1. Big Core MK.I & Fire Breath</p>
            <p>2. Butch (Rowdyruff Boys)</p>
            <p>3. Mandler (Terra Cresta)</p>
            <p>4. Crusher-Bot MK.II</p>
            <p>5. Metal Sonic</p>
            <p>6. Roaring Knight (Deltarune)</p>
            <p style="color:#FF1493">7. Roaring Metal (True Final Boss)</p>
            <p style="margin-top:12px"><strong style="color:#00ffcc">🎮 Controls:</strong></p>
            <p>Arrow Keys / WASD: Move & Jump</p>
            <p>Space / Z: Fire | X: Jump | P: Pause</p>
            <p>Touch: D-Pad + Buttons</p>
            <p style="margin-top:15px; color:#555; font-size:10px;">
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
    this.audio.playSound('shoot');
    this.renderMenu();
  }

  confirmCharacter() {
    if (!this.selectedChar) return;
    this.timeAttackMode = false;
    this.audio.playSound('transform');
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
    this.bossHitCount = 0;
    this.playerHitCount = 0;
    this.maxCombo = 0;
    this.comboCount = 0;
    this.showCutscene('before');
  }


  // ==================== HUD ====================
  updateHUD() {
    if (!this.player || !this.boss) return;
    const playerHp = (this.player.hp / this.player.maxHp) * 100;
    document.getElementById('player-hp-fill').style.width = `${playerHp}%`;
    // Color based on HP
    const pFill = document.getElementById('player-hp-fill');
    if (playerHp < 25) pFill.style.background = 'linear-gradient(180deg, #ff3333, #cc0000)';
    else if (playerHp < 50) pFill.style.background = 'linear-gradient(180deg, #ff8c3d, #ff4500)';
    else pFill.style.background = 'linear-gradient(180deg, #ff8c3d, #ff4500)';

    document.getElementById('boss-hp-fill').style.width = `${(this.boss.hp / this.boss.maxHp) * 100}%`;
    document.getElementById('hud-player-name').textContent = this.selectedChar.name;
    document.getElementById('hud-boss-name').textContent = STAGES[this.currentStage].boss;
    document.getElementById('hud-stage').textContent = `STAGE ${this.currentStage + 1} / ${STAGES.length}`;
    document.getElementById('hud-score').textContent = `SCORE: ${this.score}`;

    // Boss phase indicator
    let phaseText = '';
    if (this.boss.enraged) phaseText = '⚡ ENRAGED';
    else if (this.boss.phase === 2) phaseText = 'PHASE 2';
    else phaseText = 'PHASE 1';
    document.getElementById('hud-boss-phase').textContent = phaseText;
  }

  updateTimeAttackDisplay() {
    if (this.timeAttackMode) {
      this.timeAttackTimerEl.classList.add('active');
      this.timeAttackTimerEl.textContent = this.formatTime(this.timeAttackElapsed);
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

    if ([GameState.PLAYING, GameState.PAUSED, GameState.BOSS_WARNING,
         GameState.STAGE_CLEAR, GameState.GAME_OVER, GameState.VICTORY].includes(this.state)) {
      this.renderGameplay(ctx);
    } else if (this.state === GameState.CUTSCENE) {
      this.renderGameplay(ctx);
    } else {
      this.renderMenuBackground(ctx);
    }

    this.particles.forEach(p => p.draw(ctx));
  }

  renderMenuBackground(ctx) {
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    const time = Date.now() / 1000;
    // Stars
    for (let i = 0; i < 100; i++) {
      const x = (i * 137.5 + time * 15 * ((i % 3) + 0.5)) % CANVAS_W;
      const y = (i * 97.3 + time * 3) % CANVAS_H;
      const size = (i % 3) + 0.5;
      const brightness = 0.2 + (i % 5) * 0.1 + Math.sin(time * 2 + i) * 0.1;
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.fillRect(x, y, size, size);
    }
    // Nebula glow
    const gradient = ctx.createRadialGradient(CANVAS_W / 2, CANVAS_H / 2, 50, CANVAS_W / 2, CANVAS_H / 2, 300);
    gradient.addColorStop(0, 'rgba(255, 69, 0, 0.05)');
    gradient.addColorStop(0.5, 'rgba(139, 0, 255, 0.03)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  renderGameplay(ctx) {
    // Background - space
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Scrolling stars (parallax)
    for (let i = 0; i < 70; i++) {
      const speed = (i % 3) + 1;
      const x = ((i * 137.5 - this.bgScrollX * speed) % CANVAS_W + CANVAS_W) % CANVAS_W;
      const y = (i * 97.3) % CANVAS_H;
      const size = speed * 0.8;
      const alpha = 0.15 + speed * 0.12;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(x, y, size, size);
    }

    // Stage-specific background tint
    const stageColors = ['rgba(255,69,0,0.02)', 'rgba(34,139,34,0.02)', 'rgba(153,50,204,0.02)',
                         'rgba(112,128,144,0.02)', 'rgba(30,144,255,0.02)', 'rgba(255,215,0,0.02)',
                         'rgba(255,20,147,0.02)'];
    const tintIdx = Math.min(this.currentStage, stageColors.length - 1);
    ctx.fillStyle = stageColors[tintIdx];
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Ground platform
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
    // Ground surface line
    ctx.fillStyle = '#333355';
    ctx.fillRect(0, GROUND_Y, CANVAS_W, 3);
    // Ground detail
    ctx.fillStyle = '#222244';
    for (let i = 0; i < CANVAS_W; i += 40) {
      ctx.fillRect(i, GROUND_Y + 10, 20, 2);
    }

    // Gimmick effects
    this.gimmicks.draw(ctx);

    // Draw entities
    if (this.player) this.player.draw(ctx);
    if (this.boss && !this.boss.defeated) this.boss.draw(ctx);

    // Combo display
    if (this.comboCount > 3 && this.state === GameState.PLAYING) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#FFD700';
      ctx.fillText(`${this.comboCount}x COMBO!`, CANVAS_W / 2, CANVAS_H / 2 - 50);
      ctx.shadowBlur = 0;
      ctx.textAlign = 'left';
    }
  }

  // ==================== EFFECTS ====================
  spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(
        x, y,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        color,
        25 + Math.random() * 25,
        2 + Math.random() * 5
      ));
    }
  }

  shakeScreen() {
    const container = document.getElementById('game-container');
    container.classList.remove('shake');
    void container.offsetWidth; // force reflow
    container.classList.add('shake');
    setTimeout(() => container.classList.remove('shake'), 120);
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
    this.timeAttackTimerEl.classList.remove('active');
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
