/**
 * FIREBOY THE BROTHERS - THE LEGEND OF TERRA NEMESIS
 * Boss Rush Mode v2.0 - Enhanced Game Engine
 * Features: 4 Characters, 7 Stages, Cutscenes, Gimmicks, Touch Controls
 */

// ==================== CONSTANTS ====================
const CANVAS_W = 960;
const CANVAS_H = 540;
const GRAVITY = 0.55;
const GROUND_Y = CANVAS_H - 80;
const FPS = 60;
const FRAME_TIME = 1000 / FPS;

// ==================== GAME STATES ====================
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
    description: 'Balanced fighter with rapid fire ability',
    color: '#FF6B6B',
    accentColor: '#FF4500',
    hp: 100,
    speed: 5,
    jumpPower: 13,
    damage: 15,
    fireRate: 150,
    projectileSpeed: 10,
    projectileColor: '#FF4500',
    special: 'rapid',
    sprite: {
      body: '#FF6B6B',
      hair: '#FF4500',
      outline: '#CC3300'
    }
  },
  caroline: {
    id: 'caroline',
    name: 'Caroline',
    description: 'Energy blaster with wide spread attack',
    color: '#FF69B4',
    accentColor: '#FF1493',
    hp: 90,
    speed: 6,
    jumpPower: 14,
    damage: 12,
    fireRate: 200,
    projectileSpeed: 8,
    projectileColor: '#FF69B4',
    special: 'spread',
    sprite: {
      body: '#FF69B4',
      hair: '#FFB6C1',
      outline: '#C71585'
    }
  },
  butch: {
    id: 'butch',
    name: 'Butch',
    description: 'Heavy hitter with powerful melee attacks',
    color: '#228B22',
    accentColor: '#32CD32',
    hp: 120,
    speed: 4,
    jumpPower: 11,
    damage: 25,
    fireRate: 350,
    projectileSpeed: 7,
    projectileColor: '#32CD32',
    special: 'power',
    sprite: {
      body: '#228B22',
      hair: '#006400',
      outline: '#004400'
    }
  },
  anabel: {
    id: 'anabel',
    name: 'Anabel',
    description: 'Precision shooter with homing projectiles',
    color: '#4169E1',
    accentColor: '#00BFFF',
    hp: 85,
    speed: 7,
    jumpPower: 14,
    damage: 10,
    fireRate: 120,
    projectileSpeed: 9,
    projectileColor: '#00BFFF',
    special: 'homing',
    sprite: {
      body: '#4169E1',
      hair: '#87CEEB',
      outline: '#191970'
    }
  }
};

// ==================== STAGE DEFINITIONS ====================
const STAGES = [
  {
    id: 1,
    name: 'Duo Mecha Rocket',
    boss: 'Big Core MK.I & Fire Breath',
    bossSubtitle: 'from Gradius & Sonic 3',
    bossColor: '#FF4500',
    bossAccent: '#FF8C00',
    hp: 450,
    music: 'Double Trouble (Double Mecha Rocket - Big Core MK.I from Gradius x Fire Breath from Sonic 3) (Stage 1 Boss).mp3',
    gimmick: 'laser_walls',
    bgColor: '#0a0a2a',
    bgAccent: '#1a0a3a',
    cutsceneBefore: [
      { speaker: 'System', text: 'WARNING: Hostile signatures detected ahead!' },
      { speaker: 'Fireboy', text: 'Those machines... Big Core and Fire Breath have combined their power!' },
      { speaker: 'System', text: 'Initiating combat sequence. Good luck!' }
    ],
    cutsceneAfter: [
      { speaker: 'System', text: 'Enemy neutralized. Scanning for next target...' },
      { speaker: 'Fireboy', text: 'That was just the beginning. More enemies await!' }
    ]
  },
  {
    id: 2,
    name: 'Butch (Rowdyruff Boys)',
    boss: 'Butch',
    bossSubtitle: 'from Rowdyruff Boys',
    bossColor: '#228B22',
    bossAccent: '#32CD32',
    hp: 550,
    music: 'Butch from Rowdyruff Boys (Stage 2 Boss).mp3',
    gimmick: 'destructible_blocks',
    bgColor: '#0a1a0a',
    bgAccent: '#1a2a0a',
    cutsceneBefore: [
      { speaker: 'Butch (Boss)', text: 'Ha! You think you can take ME on?!' },
      { speaker: 'Fireboy', text: 'Butch of the Rowdyruff Boys... Bring it on!' },
      { speaker: 'Butch (Boss)', text: 'I\'ll crush you with my bare fists!' }
    ],
    cutsceneAfter: [
      { speaker: 'Butch (Boss)', text: 'No way... I lost?!' },
      { speaker: 'Fireboy', text: 'Your strength wasn\'t enough. Now step aside!' }
    ]
  },
  {
    id: 3,
    name: 'Mandler (Terra Cresta)',
    boss: 'Mandler',
    bossSubtitle: 'from Terra Cresta',
    bossColor: '#9932CC',
    bossAccent: '#BA55D3',
    hp: 650,
    music: '13 Last Evil [Boss Battle].mp3',
    gimmick: 'gravity_shift',
    bgColor: '#1a0a2a',
    bgAccent: '#2a0a3a',
    cutsceneBefore: [
      { speaker: 'System', text: 'Cosmic entity detected! Gravity anomalies increasing!' },
      { speaker: 'Mandler', text: 'I am Mandler... commander of cosmic forces!' },
      { speaker: 'Fireboy', text: 'Gravity manipulation won\'t stop me!' }
    ],
    cutsceneAfter: [
      { speaker: 'Mandler', text: 'Impossible... my gravitational control... shattered...' },
      { speaker: 'Fireboy', text: 'The gravity distortions are fading. Onward!' }
    ]
  },
  {
    id: 4,
    name: 'Crusher-Bot MK.II',
    boss: 'Crusher-Bot MK.II',
    bossSubtitle: 'Heavy Assault Mech',
    bossColor: '#708090',
    bossAccent: '#A9A9A9',
    hp: 750,
    music: '13 Last Evil [Boss Battle].mp3',
    gimmick: 'falling_debris',
    bgColor: '#1a1a1a',
    bgAccent: '#2a2a2a',
    cutsceneBefore: [
      { speaker: 'System', text: 'ALERT: Massive mech signature! Ground tremors detected!' },
      { speaker: 'Crusher-Bot', text: '[SYSTEMS ONLINE] TARGET ACQUIRED. INITIATING CRUSH PROTOCOL.' },
      { speaker: 'Fireboy', text: 'That thing is massive! I have to be careful of its stomp attacks!' }
    ],
    cutsceneAfter: [
      { speaker: 'Crusher-Bot', text: '[CRITICAL FAILURE] SYSTEMS... SHUTTING... DOWN...' },
      { speaker: 'Fireboy', text: 'The scrap heap is clear. What else awaits?' }
    ]
  },
  {
    id: 5,
    name: 'Metal Sonic',
    boss: 'Metal Sonic',
    bossSubtitle: 'from Sonic Series',
    bossColor: '#1E90FF',
    bossAccent: '#4169E1',
    hp: 850,
    music: 'Metal Sonic (Stage 5 Boss).mp3',
    gimmick: 'speed_zones',
    bgColor: '#0a0a2a',
    bgAccent: '#0a1a3a',
    cutsceneBefore: [
      { speaker: 'System', text: 'EXTREME VELOCITY SIGNATURE! Speed exceeds measurement!' },
      { speaker: 'Metal Sonic', text: '... I AM THE REAL SONIC. ALL OTHERS ARE INFERIOR.' },
      { speaker: 'Fireboy', text: 'Metal Sonic?! His speed is incredible... Focus!' }
    ],
    cutsceneAfter: [
      { speaker: 'Metal Sonic', text: 'THIS... CANNOT... BE...' },
      { speaker: 'System', text: 'Warning: Two more powerful signatures ahead. Prepare yourself!' }
    ]
  },
  {
    id: 6,
    name: 'Roaring Knight (Finale)',
    boss: 'The Roaring Knight',
    bossSubtitle: 'from Deltarune',
    bossColor: '#FFD700',
    bossAccent: '#FFA500',
    hp: 1100,
    music: '13 Last Evil [Boss Battle].mp3',
    gimmick: 'phase_shift',
    bgColor: '#1a1a0a',
    bgAccent: '#2a2a0a',
    cutsceneBefore: [
      { speaker: 'System', text: 'FINAL BOSS DETECTED! Power level: EXTREME!' },
      { speaker: 'Roaring Knight', text: 'You have come far, warrior. But this is where your journey ends!' },
      { speaker: 'Fireboy', text: 'The Roaring Knight from Deltarune... This is the final battle!' },
      { speaker: 'Roaring Knight', text: 'Draw your weapon. LET US CLASH!' }
    ],
    cutsceneAfter: [
      { speaker: 'Roaring Knight', text: 'You... are worthy. But...' },
      { speaker: 'System', text: 'DANGER! Dark energy is combining with another entity!' },
      { speaker: 'Fireboy', text: 'What?! There\'s something even more powerful forming!' }
    ]
  },
  {
    id: 7,
    name: 'Roaring Metal (True Finale)',
    boss: 'Roaring Metal',
    bossSubtitle: 'Roaring Knight × Metal Sonic',
    bossColor: '#FF1493',
    bossAccent: '#8B008B',
    hp: 1600,
    music: 'Roaring Metal - Roaring Knight x Metal Sonic (Stage 7 True Finale Boss).mp3',
    gimmick: 'enrage_all',
    bgColor: '#1a0a0a',
    bgAccent: '#2a0a1a',
    cutsceneBefore: [
      { speaker: 'System', text: 'TRUE FINAL BOSS! Power level: UNMEASURABLE!' },
      { speaker: '???', text: 'The Knight\'s fury... combined with Metal\'s speed...' },
      { speaker: 'Roaring Metal', text: 'WE ARE ROARING METAL! THE ULTIMATE FUSION!' },
      { speaker: 'Fireboy', text: 'Both of them fused together?! This is the TRUE final battle!' },
      { speaker: 'Roaring Metal', text: 'PREPARE TO BE ANNIHILATED!' }
    ],
    cutsceneAfter: [
      { speaker: 'Roaring Metal', text: 'IMPOSSIBLE... OUR COMBINED MIGHT... DEFEATED?!' },
      { speaker: 'System', text: 'All hostile signatures eliminated. Mission complete!' },
      { speaker: 'Fireboy', text: 'We did it! Peace has been restored!' },
      { speaker: 'System', text: 'CONGRATULATIONS! YOU ARE THE TRUE CHAMPION!' }
    ]
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
    this.loadSounds();
  }

  loadSounds() {
    const sfxFiles = {
      laser: 'BigCore_Laser.wav',
      bossDefeat: 'BossDefeat_Explosion.wav',
      bossWarning: 'BossWarning.wav',
      bossJump: 'Boss_Jump.wav',
      butchHurt: 'Butch_BossHurt.wav',
      butchFall: 'Butch_Fall.wav',
      butchJump: 'Butch_Jump.wav',
      crusherStomp: 'CrusherBot_Stomp.wav',
      grind: 'Grind.wav',
      hitBoss: 'HitBoss.wav',
      impact: 'Impact.wav',
      impact2: 'Impact2.wav',
      jump: 'Jump.wav',
      land: 'Land.wav',
      move: 'Move.wav',
      msCharge: 'MSChargeFire.wav',
      msFireball: 'MSFireball.wav',
      playerDeath: 'PlayerDeath.wav',
      playerHurt: 'PlayerHurt.wav',
      playerFire: 'Player_FireShoot.wav',
      strain: 'Strain.wav',
      strain2: 'Strain2.wav',
      transform: 'Transform.wav',
      alarm: 'fp2_alarm.ogg'
    };
    for (const [name, src] of Object.entries(sfxFiles)) {
      this.loadSound(name, src);
    }
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
    this.stopMusic();
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
      this.music = null;
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
    this.keyDownBuffer = {};
    this.setupKeyboard();
    this.setupTouch();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      this.keyDownBuffer[e.code] = true;
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
      const start = (e) => { e.preventDefault(); this.touch[key] = true; this.keyDownBuffer[key + '_touch'] = true; };
      const end = (e) => { e.preventDefault(); this.touch[key] = false; };
      el.addEventListener('touchstart', start, { passive: false });
      el.addEventListener('touchend', end, { passive: false });
      el.addEventListener('touchcancel', end, { passive: false });
      el.addEventListener('mousedown', start);
      el.addEventListener('mouseup', end);
      el.addEventListener('mouseleave', end);
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
      this.justPressed[key] = this.keyDownBuffer[key] && !this.prevKeys[key];
    }
    for (const key in this.keyDownBuffer) {
      if (key.endsWith('_touch')) {
        this.justPressed[key] = true;
      }
    }
    this.prevKeys = { ...this.keys };
    this.keyDownBuffer = {};
  }

  isLeft() { return this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touch.left; }
  isRight() { return this.keys['ArrowRight'] || this.keys['KeyD'] || this.touch.right; }
  isUp() { return this.keys['ArrowUp'] || this.keys['KeyW'] || this.touch.up || this.touch.jump; }
  isDown() { return this.keys['ArrowDown'] || this.keys['KeyS'] || this.touch.down; }
  isFire() { return this.keys['Space'] || this.keys['KeyZ'] || this.touch.fire; }
  isJump() { return this.justPressed['ArrowUp'] || this.justPressed['KeyW'] || this.justPressed['KeyX'] || this.justPressed['jump_touch']; }
  isPause() { return this.justPressed['KeyP'] || this.justPressed['Escape'] || this.justPressed['pause_touch']; }
  isAnyKey() { return Object.values(this.keys).some(v => v) || Object.values(this.touch).some(v => v); }
}

// ==================== PARTICLE SYSTEM ====================
class Particle {
  constructor(x, y, vx, vy, color, life, size) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    this.size = size || (2 + Math.random() * 4);
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.08;
    this.vx *= 0.99;
    this.life--;
    this.size *= 0.98;
    this.rotation += this.rotSpeed;
  }

  draw(ctx) {
    const alpha = this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }

  isDead() { return this.life <= 0 || this.size < 0.5; }
}

// ==================== TRAIL EFFECT ====================
class Trail {
  constructor(x, y, color, size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.life = 15;
    this.maxLife = 15;
  }

  update() { this.life--; }

  draw(ctx) {
    const alpha = (this.life / this.maxLife) * 0.4;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * (this.life / this.maxLife), 0, Math.PI * 2);
    ctx.fill();
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
    this.homing = false;
    this.trail = [];
    this.age = 0;
  }

  update(target) {
    this.age++;
    this.x += this.vx;
    this.y += this.vy;

    // Trail
    if (this.age % 2 === 0) {
      this.trail.push(new Trail(this.x + this.width / 2, this.y + this.height / 2, this.color, this.width / 3));
    }
    this.trail = this.trail.filter(t => { t.update(); return !t.isDead(); });

    if (this.x < -60 || this.x > CANVAS_W + 60 || this.y < -60 || this.y > CANVAS_H + 60) {
      this.active = false;
    }

    // Homing behavior
    if (this.homing && target && this.age > 5) {
      const tx = target.x + target.width / 2;
      const ty = target.y + target.height / 2;
      const dx = tx - this.x;
      const dy = ty - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        this.vx += (dx / dist) * 0.4;
        this.vy += (dy / dist) * 0.4;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 9;
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed;
          this.vy = (this.vy / speed) * maxSpeed;
        }
      }
    }
  }

  draw(ctx) {
    // Draw trail
    this.trail.forEach(t => t.draw(ctx));

    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;

    if (this.homing) {
      // Circular homing projectile
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(this.x, this.y, this.width, this.height);
      // Bright core
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.6;
      ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
    }
    ctx.restore();
  }
}

// ==================== PLAYER ====================
class Player {
  constructor(charDef) {
    this.charDef = charDef;
    this.width = 48;
    this.height = 56;
    this.x = 100;
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
    this.runFrame = 0;
    this.dashTrail = [];
    this.hitFlash = 0;
  }

  update(input, now, homingTarget) {
    // Movement
    this.vx = 0;
    if (input.isLeft()) { this.vx = -this.speed; this.facing = -1; }
    if (input.isRight()) { this.vx = this.speed; this.facing = 1; }

    // Jump (only on just-pressed to prevent continuous jumping)
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
    this.y = Math.max(0, this.y);

    // Shooting
    if (input.isFire() && now - this.lastFire > this.fireRate) {
      this.shoot(homingTarget);
      this.lastFire = now;
    }

    // Update projectiles
    this.projectiles = this.projectiles.filter(p => p.active);
    this.projectiles.forEach(p => p.update(homingTarget));

    // Invincibility timer
    if (this.invincible > 0) this.invincible--;
    if (this.hitFlash > 0) this.hitFlash--;

    // Run animation
    if (Math.abs(this.vx) > 0) {
      this.animTimer++;
      if (this.animTimer > 6) {
        this.animTimer = 0;
        this.runFrame = (this.runFrame + 1) % 4;
      }
    } else {
      this.runFrame = 0;
    }

    // Dash trail
    if (Math.abs(this.vx) > 0) {
      this.dashTrail.push(new Trail(this.x + this.width / 2, this.y + this.height / 2, this.charDef.color, 8));
    }
    this.dashTrail = this.dashTrail.filter(t => { t.update(); return !t.isDead(); });
  }

  shoot(homingTarget) {
    const cx = this.x + this.width / 2 + (this.facing * 20);
    const cy = this.y + this.height / 2;

    switch (this.charDef.special) {
      case 'spread': {
        for (let i = -1; i <= 1; i++) {
          const p = new Projectile(cx, cy, this.charDef.projectileSpeed * this.facing, i * 2.5, this.damage, 'player', this.charDef.projectileColor);
          this.projectiles.push(p);
        }
        break;
      }
      case 'power': {
        const p = new Projectile(cx, cy, this.charDef.projectileSpeed * this.facing, 0, this.damage, 'player', this.charDef.projectileColor, 22, 16);
        this.projectiles.push(p);
        break;
      }
      case 'homing': {
        const p = new Projectile(cx, cy, this.charDef.projectileSpeed * this.facing, (Math.random() - 0.5) * 3, this.damage, 'player', this.charDef.projectileColor, 10, 10);
        p.homing = true;
        this.projectiles.push(p);
        break;
      }
      default: { // rapid
        const p = new Projectile(cx, cy, this.charDef.projectileSpeed * this.facing, 0, this.damage, 'player', this.charDef.projectileColor);
        this.projectiles.push(p);
        break;
      }
    }
  }

  takeDamage(amount) {
    if (this.invincible > 0) return;
    this.hp -= amount;
    this.invincible = 40;
    this.hitFlash = 10;
    if (this.hp < 0) this.hp = 0;
  }

  draw(ctx) {
    // Dash trail
    this.dashTrail.forEach(t => t.draw(ctx));

    // Invincibility flash
    if (this.invincible > 0 && Math.floor(this.invincible / 3) % 2 === 0) return;

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    if (this.facing === -1) ctx.scale(-1, 1);

    // Hit flash
    if (this.hitFlash > 0) {
      ctx.globalAlpha = 0.8;
    }

    const sprite = this.charDef.sprite;
    const bobY = this.onGround ? Math.sin(this.runFrame * 1.5) * 2 : 0;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, this.height / 2, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs (animated)
    const legOffset = this.onGround ? Math.sin(this.runFrame * 1.5) * 5 : 3;
    ctx.fillStyle = sprite.outline;
    ctx.fillRect(-10, 12 + bobY, 8, 16 + legOffset);
    ctx.fillRect(2, 12 + bobY, 8, 16 - legOffset);

    // Body
    ctx.fillStyle = sprite.body;
    ctx.beginPath();
    ctx.roundRect(-14, -12 + bobY, 28, 28, 4);
    ctx.fill();
    ctx.strokeStyle = sprite.outline;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Head
    ctx.fillStyle = '#FFE4B5';
    ctx.beginPath();
    ctx.arc(0, -18 + bobY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = sprite.outline;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Hair
    ctx.fillStyle = sprite.hair;
    ctx.beginPath();
    ctx.arc(0, -24 + bobY, 12, Math.PI, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(3, -20 + bobY, 4, 5);
    ctx.fillStyle = '#fff';
    ctx.fillRect(4, -20 + bobY, 2, 2);

    // Arm (animated aiming forward)
    const armAngle = !this.onGround ? -0.3 : Math.sin(this.animTimer * 0.3) * 0.1;
    ctx.save();
    ctx.translate(10, -2 + bobY);
    ctx.rotate(armAngle);
    ctx.fillStyle = sprite.body;
    ctx.fillRect(0, -4, 16, 8);
    ctx.fillStyle = sprite.outline;
    ctx.fillRect(14, -3, 6, 6);
    ctx.restore();

    ctx.restore();

    // Draw projectiles
    this.projectiles.forEach(p => p.draw(ctx));
  }
}

// ==================== BOSS ENTITY ====================
class BossEntity {
  constructor(stageDef, stageIndex) {
    this.stageDef = stageDef;
    this.stageIndex = stageIndex;
    this.width = 100;
    this.height = 100;
    this.x = CANVAS_W - this.width - 80;
    this.y = CANVAS_H / 2 - this.height / 2;
    this.hp = stageDef.hp;
    this.maxHp = stageDef.hp;
    this.color = stageDef.bossColor;
    this.accent = stageDef.bossAccent;
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
    this.defeatTimer = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.introTimer = 60;
    this.auraParticles = [];
  }

  update(player) {
    if (this.defeated) {
      this.defeatTimer++;
      return;
    }

    if (this.introTimer > 0) {
      this.introTimer--;
      return;
    }

    this.moveTimer++;
    this.attackTimer++;
    this.patternTimer++;

    if (this.patternTimer >= this.patternDuration) {
      this.patternTimer = 0;
      this.patternIndex = (this.patternIndex + 1) % 3;
    }

    // Phase transitions
    const hpPercent = this.hp / this.maxHp;
    if (hpPercent < 0.6 && this.phase === 1) {
      this.phase = 2;
      this.attackInterval = Math.max(25, this.attackInterval - 12);
    }
    if (hpPercent < 0.3 && !this.enraged) {
      this.enraged = true;
      this.attackInterval = Math.max(18, this.attackInterval - 10);
    }

    // Movement
    this.updateMovement(player);

    // Attack
    if (this.attackTimer >= this.attackInterval) {
      this.attackTimer = 0;
      this.attack(player);
    }

    // Update projectiles
    this.projectiles = this.projectiles.filter(p => p.active);
    this.projectiles.forEach(p => p.update(player));

    // Flash and shake on hit
    if (this.flashTimer > 0) this.flashTimer--;
    this.shakeX *= 0.8;
    this.shakeY *= 0.8;

    // Aura particles when enraged
    if (this.enraged && Math.random() < 0.3) {
      this.auraParticles.push(new Particle(
        this.x + Math.random() * this.width,
        this.y + this.height,
        (Math.random() - 0.5) * 2,
        -Math.random() * 3 - 1,
        this.phase >= 2 ? '#ff0000' : this.color,
        20 + Math.random() * 15,
        3 + Math.random() * 3
      ));
    }
    this.auraParticles = this.auraParticles.filter(p => { p.update(); return !p.isDead(); });

    // Keep in bounds
    this.x = Math.max(CANVAS_W * 0.35, Math.min(this.x, CANVAS_W - this.width - 10));
    this.y = Math.max(20, Math.min(this.y, GROUND_Y - this.height));
  }

  updateMovement(player) {
    this.y += Math.sin(this.moveTimer * 0.03) * 1.5;
    this.x += Math.cos(this.moveTimer * 0.02) * 0.8;
  }

  attack(player) {
    this.basicAttack(player);
  }

  basicAttack(player) {
    const cx = this.x;
    const cy = this.y + this.height / 2;
    const p = new Projectile(cx, cy, -6, 0, 10, 'boss', this.color, 16, 12);
    this.projectiles.push(p);
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.flashTimer = 8;
    this.shakeX = (Math.random() - 0.5) * 8;
    this.shakeY = (Math.random() - 0.5) * 4;
    if (this.hp <= 0) {
      this.hp = 0;
      this.defeated = true;
    }
  }

  draw(ctx) {
    // Aura particles
    this.auraParticles.forEach(p => p.draw(ctx));

    if (this.defeated) {
      // Defeat explosion animation
      if (this.defeatTimer < 60) {
        const alpha = 1 - this.defeatTimer / 60;
        ctx.globalAlpha = alpha;
        ctx.save();
        ctx.translate(this.x + this.width / 2 + (Math.random() - 0.5) * 10, this.y + this.height / 2 + (Math.random() - 0.5) * 10);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
        ctx.globalAlpha = 1;
      }
      return;
    }

    ctx.save();
    ctx.translate(this.shakeX, this.shakeY);

    // Flash on hit
    if (this.flashTimer > 0 && this.flashTimer % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Enrage glow
    if (this.enraged) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff0000';
    }

    // Boss body with gradient
    const gradient = ctx.createRadialGradient(
      this.x + this.width / 2, this.y + this.height / 2, 5,
      this.x + this.width / 2, this.y + this.height / 2, this.width * 0.6
    );
    gradient.addColorStop(0, this.accent);
    gradient.addColorStop(0.7, this.color);
    gradient.addColorStop(1, '#111');
    ctx.fillStyle = gradient;

    // Rounded boss shape
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 8);
    ctx.fill();

    // Outline
    ctx.strokeStyle = this.enraged ? '#ff0000' : this.color;
    ctx.lineWidth = this.enraged ? 3 : 2;
    ctx.stroke();

    // Inner details
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(this.x + 10, this.y + 10, this.width - 20, this.height / 3);

    // Eyes
    const eyeGlow = this.enraged ? '#ff0000' : '#fff';
    ctx.fillStyle = eyeGlow;
    ctx.shadowBlur = this.enraged ? 10 : 4;
    ctx.shadowColor = eyeGlow;
    ctx.beginPath();
    ctx.arc(this.x + this.width * 0.35, this.y + this.height * 0.35, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + this.width * 0.65, this.y + this.height * 0.35, 8, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = this.enraged ? '#ff4400' : this.color;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(this.x + this.width * 0.35, this.y + this.height * 0.35, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + this.width * 0.65, this.y + this.height * 0.35, 4, 0, Math.PI * 2);
    ctx.fill();

    // Phase indicator
    if (this.phase >= 2) {
      ctx.strokeStyle = '#ff4400';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(this.x - 4, this.y - 4, this.width + 8, this.height + 8);
      ctx.setLineDash([]);
    }

    ctx.restore();

    // Draw projectiles
    this.projectiles.forEach(p => p.draw(ctx));
  }
}

// ==================== BOSS FACTORY ====================
function createBoss(stageIndex) {
  const stageDef = STAGES[stageIndex];
  const boss = new BossEntity(stageDef, stageIndex);

  switch (stageIndex) {
    case 0: // Double Mecha Rocket - Big Core MK.I & Fire Breath
      boss.width = 130;
      boss.height = 80;
      boss.attackInterval = 45;
      boss.attack = function(player) {
        const cx = this.x;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Triple laser beams
            for (let i = 0; i < 3; i++) {
              this.projectiles.push(new Projectile(cx, cy + (i - 1) * 25, -7, 0, 8, 'boss', '#FF4500', 28, 5));
            }
            break;
          case 1: // Fire breath spray fan
            for (let i = 0; i < 5; i++) {
              const angle = (Math.PI * 0.6) * ((i / 4) - 0.5);
              this.projectiles.push(new Projectile(cx, cy, -5 * Math.cos(angle), -5 * Math.sin(angle), 10, 'boss', '#FF8C00', 12, 12));
            }
            break;
          case 2: // Combined: lasers + fire
            this.projectiles.push(new Projectile(cx, cy - 15, -8, 0, 8, 'boss', '#FF4500', 30, 4));
            this.projectiles.push(new Projectile(cx, cy + 15, -8, 0, 8, 'boss', '#FF4500', 30, 4));
            for (let i = 0; i < 3; i++) {
              const angle = (Math.PI * 0.4) * ((i / 2) - 0.5);
              this.projectiles.push(new Projectile(cx, cy, -4 * Math.cos(angle), -4 * Math.sin(angle), 9, 'boss', '#FF8C00', 10, 10));
            }
            break;
        }
        if (this.enraged) {
          // Extra side shots when enraged
          this.projectiles.push(new Projectile(cx, this.y, -3, -2, 6, 'boss', '#FFD700', 8, 8));
          this.projectiles.push(new Projectile(cx, this.y + this.height, -3, 2, 6, 'boss', '#FFD700', 8, 8));
        }
      };
      break;

    case 1: // Butch (Rowdyruff Boys)
      boss.width = 85;
      boss.height = 95;
      boss.attackInterval = 65;
      boss.charging = false;
      boss.chargeTimer = 0;
      boss.chargeWarning = 0;
      boss.updateMovement = function(player) {
        if (this.chargeWarning > 0) {
          this.chargeWarning--;
          this.shakeX = (Math.random() - 0.5) * 4;
          if (this.chargeWarning <= 0) {
            this.charging = true;
            this.chargeTimer = 35;
          }
          return;
        }
        if (this.charging) {
          this.x -= 10;
          this.chargeTimer--;
          if (this.chargeTimer <= 0 || this.x < CANVAS_W * 0.35) {
            this.charging = false;
            this.x = CANVAS_W - this.width - 80;
          }
        } else {
          this.y += Math.sin(this.moveTimer * 0.04) * 3;
          if (Math.random() < 0.006 * (this.enraged ? 2.5 : 1)) {
            this.chargeWarning = 30;
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
          case 1: // Ground pound rocks
            for (let i = 0; i < 4; i++) {
              this.projectiles.push(new Projectile(cx - i * 50, GROUND_Y - 25, -2 - i, -3 - Math.random() * 2, 10, 'boss', '#8B4513', 14, 14));
            }
            break;
          case 2: // Triple punch burst
            for (let i = -1; i <= 1; i++) {
              this.projectiles.push(new Projectile(cx, cy + i * 30, -9, i * 0.8, 12, 'boss', '#32CD32', 18, 14));
            }
            break;
        }
      };
      break;

    case 2: // Mandler (Terra Cresta)
      boss.width = 95;
      boss.height = 95;
      boss.attackInterval = 40;
      boss.rotAngle = 0;
      boss.updateMovement = function(player) {
        this.rotAngle += 0.03;
        this.y = CANVAS_H / 2 - this.height / 2 + Math.sin(this.rotAngle) * 80;
        this.x = CANVAS_W - this.width - 80 + Math.cos(this.rotAngle * 0.7) * 40;
      };
      boss.attack = function(player) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Rotating ring of projectiles
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI * 2 / 6) * i + this.rotAngle;
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * 4, Math.sin(angle) * 4, 8, 'boss', '#9932CC', 10, 10));
            }
            break;
          case 1: // Spiral attack
            const sAngle = this.moveTimer * 0.15;
            this.projectiles.push(new Projectile(cx, cy, Math.cos(sAngle) * 5, Math.sin(sAngle) * 5, 8, 'boss', '#BA55D3', 8, 8));
            this.projectiles.push(new Projectile(cx, cy, Math.cos(sAngle + Math.PI) * 5, Math.sin(sAngle + Math.PI) * 5, 8, 'boss', '#BA55D3', 8, 8));
            break;
          case 2: // Gravity pull (aimed at player)
            const dx = player.x + player.width / 2 - cx;
            const dy = player.y + player.height / 2 - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
              this.projectiles.push(new Projectile(cx, cy, (dx / dist) * 5, (dy / dist) * 5, 12, 'boss', '#7B68EE', 14, 14));
            }
            break;
        }
      };
      break;

    case 3: // Crusher-Bot MK.II
      boss.width = 120;
      boss.height = 120;
      boss.attackInterval = 55;
      boss.stomping = false;
      boss.stompTimer = 0;
      boss.originalY = boss.y;
      boss.updateMovement = function(player) {
        if (this.stomping) {
          this.stompTimer++;
          if (this.stompTimer < 15) {
            this.y -= 3; // Rise up
          } else if (this.stompTimer < 25) {
            this.y += 8; // Slam down
          } else if (this.stompTimer > 35) {
            this.stomping = false;
            this.stompTimer = 0;
          }
          this.y = Math.max(20, Math.min(this.y, GROUND_Y - this.height));
        } else {
          this.y += Math.sin(this.moveTimer * 0.02) * 1;
          this.x += Math.cos(this.moveTimer * 0.015) * 0.5;
          if (Math.random() < 0.008 * (this.enraged ? 2 : 1)) {
            this.stomping = true;
            this.stompTimer = 0;
          }
        }
      };
      boss.attack = function(player) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height;
        switch (this.patternIndex) {
          case 0: // Heavy stomp shockwave
            for (let i = 0; i < 5; i++) {
              this.projectiles.push(new Projectile(cx - 60 + i * 30, cy, -2 - Math.random() * 2, -1, 10, 'boss', '#708090', 16, 16));
            }
            break;
          case 1: // Missile barrage
            for (let i = 0; i < 3; i++) {
              const p = new Projectile(this.x, this.y + i * 30, -5, (Math.random() - 0.5) * 3, 12, 'boss', '#A9A9A9', 14, 8);
              this.projectiles.push(p);
            }
            break;
          case 2: // Combined stomp + missiles
            this.stomping = true;
            this.stompTimer = 0;
            this.projectiles.push(new Projectile(this.x, cy - 40, -6, -1, 14, 'boss', '#C0C0C0', 18, 12));
            this.projectiles.push(new Projectile(this.x, cy - 40, -6, 1, 14, 'boss', '#C0C0C0', 18, 12));
            break;
        }
      };
      break;

    case 4: // Metal Sonic
      boss.width = 80;
      boss.height = 80;
      boss.attackInterval = 35;
      boss.dashing = false;
      boss.dashTimer = 0;
      boss.dashVX = 0;
      boss.dashVY = 0;
      boss.updateMovement = function(player) {
        if (this.dashing) {
          this.x += this.dashVX;
          this.y += this.dashVY;
          this.dashTimer--;
          if (this.dashTimer <= 0) {
            this.dashing = false;
            this.x = Math.max(CANVAS_W * 0.5, Math.min(this.x, CANVAS_W - this.width - 20));
            this.y = Math.max(20, Math.min(this.y, GROUND_Y - this.height));
          }
        } else {
          this.y += Math.sin(this.moveTimer * 0.05) * 3;
          this.x += Math.cos(this.moveTimer * 0.03) * 2;
          if (Math.random() < 0.01 * (this.enraged ? 2.5 : 1)) {
            this.dashing = true;
            this.dashTimer = 20;
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            this.dashVX = (dx / dist) * 12;
            this.dashVY = (dy / dist) * 12;
          }
        }
      };
      boss.attack = function(player) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Speed dash projectiles
            this.projectiles.push(new Projectile(cx, cy, -10, 0, 10, 'boss', '#1E90FF', 20, 8));
            this.projectiles.push(new Projectile(cx, cy, -8, -2, 8, 'boss', '#4169E1', 14, 6));
            this.projectiles.push(new Projectile(cx, cy, -8, 2, 8, 'boss', '#4169E1', 14, 6));
            break;
          case 1: // Homing fireball
            const p = new Projectile(cx, cy, -3, 0, 12, 'boss', '#00BFFF', 12, 12);
            p.homing = true;
            this.projectiles.push(p);
            break;
          case 2: // Spin attack (ring of projectiles)
            for (let i = 0; i < 8; i++) {
              const angle = (Math.PI * 2 / 8) * i;
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * 4, Math.sin(angle) * 4, 8, 'boss', '#87CEEB', 8, 8));
            }
            break;
        }
      };
      break;

    case 5: // Roaring Knight (Deltarune)
      boss.width = 110;
      boss.height = 120;
      boss.attackInterval = 50;
      boss.phaseShiftTimer = 0;
      boss.invulnerable = false;
      boss.invulnTimer = 0;
      boss.slashing = false;
      boss.slashTimer = 0;
      boss.updateMovement = function(player) {
        if (this.invulnerable) {
          this.invulnTimer--;
          this.y += Math.sin(this.moveTimer * 0.1) * 5;
          this.x = CANVAS_W - this.width - 80 + Math.cos(this.moveTimer * 0.08) * 60;
          if (this.invulnTimer <= 0) {
            this.invulnerable = false;
          }
          return;
        }
        if (this.slashing) {
          this.x -= 6;
          this.slashTimer--;
          if (this.slashTimer <= 0) {
            this.slashing = false;
            this.x = CANVAS_W - this.width - 80;
          }
        } else {
          this.y += Math.sin(this.moveTimer * 0.03) * 2;
          this.x += Math.cos(this.moveTimer * 0.02) * 1;
        }

        // Phase shift at health thresholds
        const hpPct = this.hp / this.maxHp;
        if ((hpPct < 0.75 && this.phaseShiftTimer === 0) ||
            (hpPct < 0.5 && this.phaseShiftTimer === 1) ||
            (hpPct < 0.25 && this.phaseShiftTimer === 2)) {
          this.phaseShiftTimer++;
          this.invulnerable = true;
          this.invulnTimer = 60;
        }
      };
      boss.takeDamage = function(amount) {
        if (this.invulnerable) return;
        BossEntity.prototype.takeDamage.call(this, amount);
      };
      boss.attack = function(player) {
        if (this.invulnerable) return;
        const cx = this.x;
        const cy = this.y + this.height / 2;
        switch (this.patternIndex) {
          case 0: // Sword slash wave
            this.slashing = true;
            this.slashTimer = 20;
            this.projectiles.push(new Projectile(cx, cy, -8, 0, 15, 'boss', '#FFD700', 30, 6));
            this.projectiles.push(new Projectile(cx, cy - 20, -7, -1, 12, 'boss', '#FFA500', 24, 6));
            this.projectiles.push(new Projectile(cx, cy + 20, -7, 1, 12, 'boss', '#FFA500', 24, 6));
            break;
          case 1: // Energy wave projection
            for (let i = 0; i < 4; i++) {
              const angle = -0.4 + (i * 0.27);
              this.projectiles.push(new Projectile(cx, cy, -6 * Math.cos(angle), -6 * Math.sin(angle), 10, 'boss', '#FFD700', 12, 12));
            }
            break;
          case 2: // Overhead slam
            this.projectiles.push(new Projectile(player.x, 0, 0, 6, 18, 'boss', '#FF6600', 20, 20));
            this.projectiles.push(new Projectile(player.x - 40, 0, 0, 5, 14, 'boss', '#FF8800', 14, 14));
            this.projectiles.push(new Projectile(player.x + 40, 0, 0, 5, 14, 'boss', '#FF8800', 14, 14));
            break;
        }
      };
      break;

    case 6: // Roaring Metal (True Final Boss)
      boss.width = 130;
      boss.height = 130;
      boss.attackInterval = 35;
      boss.superPhase = 0;
      boss.teleporting = false;
      boss.teleTimer = 0;
      boss.updateMovement = function(player) {
        if (this.teleporting) {
          this.teleTimer--;
          if (this.teleTimer <= 0) {
            this.teleporting = false;
            this.x = CANVAS_W * 0.5 + Math.random() * (CANVAS_W * 0.4);
            this.y = 40 + Math.random() * (GROUND_Y - this.height - 80);
          }
          return;
        }
        this.y += Math.sin(this.moveTimer * 0.04) * 3;
        this.x += Math.cos(this.moveTimer * 0.025) * 2;

        if (Math.random() < 0.005 * (this.enraged ? 3 : 1)) {
          this.teleporting = true;
          this.teleTimer = 15;
        }

        // Super phase at 25% health
        if (this.hp < this.maxHp * 0.25 && this.superPhase === 0) {
          this.superPhase = 1;
          this.attackInterval = 20;
        }
      };
      boss.attack = function(player) {
        if (this.teleporting) return;
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        // Combine attacks from previous bosses
        const attackSet = this.superPhase === 1 ? 5 : 4;
        const pattern = Math.floor(Math.random() * attackSet);

        switch (pattern) {
          case 0: // Metal Sonic dash burst
            for (let i = -2; i <= 2; i++) {
              this.projectiles.push(new Projectile(cx, cy, -8, i * 1.5, 10, 'boss', '#1E90FF', 14, 8));
            }
            break;
          case 1: // Knight sword waves
            this.projectiles.push(new Projectile(cx, cy, -9, 0, 14, 'boss', '#FFD700', 30, 8));
            this.projectiles.push(new Projectile(cx, cy - 30, -7, -1.5, 12, 'boss', '#FFA500', 20, 6));
            this.projectiles.push(new Projectile(cx, cy + 30, -7, 1.5, 12, 'boss', '#FFA500', 20, 6));
            break;
          case 2: // Spiral + aimed
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI * 2 / 6) * i + this.moveTimer * 0.1;
              this.projectiles.push(new Projectile(cx, cy, Math.cos(angle) * 5, Math.sin(angle) * 5, 9, 'boss', '#FF1493', 10, 10));
            }
            break;
          case 3: // Overhead rain
            for (let i = 0; i < 4; i++) {
              this.projectiles.push(new Projectile(player.x - 60 + i * 40, -10, 0, 5 + Math.random() * 2, 11, 'boss', '#8B008B', 12, 12));
            }
            break;
          case 4: // FULL POWER - all combined
            // Laser
            this.projectiles.push(new Projectile(cx, cy, -10, 0, 16, 'boss', '#FF0000', 36, 6));
            // Spread
            for (let i = -2; i <= 2; i++) {
              this.projectiles.push(new Projectile(cx, cy, -6, i * 2, 10, 'boss', '#FF1493', 10, 10));
            }
            // Homing
            const hp = new Projectile(cx, cy, -2, (Math.random() - 0.5) * 3, 12, 'boss', '#00FFFF', 14, 14);
            hp.homing = true;
            this.projectiles.push(hp);
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
    this.type = null;
    this.objects = [];
    this.timer = 0;
    this.active = false;
    this.gravityFlipped = false;
    this.speedMultiplier = 1;
  }

  init(type) {
    this.type = type;
    this.objects = [];
    this.timer = 0;
    this.active = true;
    this.gravityFlipped = false;
    this.speedMultiplier = 1;
  }

  update(player, boss) {
    if (!this.active) return;
    this.timer++;

    switch (this.type) {
      case 'laser_walls':
        // Periodic laser walls that scroll across screen
        if (this.timer % 180 === 0) {
          this.objects.push({ x: CANVAS_W, y: Math.random() * (GROUND_Y - 60), w: 6, h: 50 + Math.random() * 40, speed: 3 });
        }
        this.objects.forEach(obj => { obj.x -= obj.speed; });
        this.objects = this.objects.filter(obj => obj.x > -20);
        // Collision with player
        this.objects.forEach(obj => {
          if (this.checkCollision(player, obj)) {
            player.takeDamage(5);
          }
        });
        break;

      case 'destructible_blocks':
        if (this.timer % 120 === 0 && this.objects.length < 6) {
          this.objects.push({ x: 200 + Math.random() * 500, y: GROUND_Y - 40 - Math.random() * 100, w: 30, h: 30, hp: 3 });
        }
        break;

      case 'gravity_shift':
        if (this.timer % 300 === 0) {
          this.gravityFlipped = !this.gravityFlipped;
        }
        if (this.gravityFlipped && player) {
          player.vy -= GRAVITY * 1.5; // counteract normal gravity and reverse
        }
        break;

      case 'falling_debris':
        if (this.timer % 80 === 0) {
          this.objects.push({ x: Math.random() * CANVAS_W, y: -20, w: 20 + Math.random() * 20, h: 20 + Math.random() * 20, vy: 2 + Math.random() * 2, active: true });
        }
        this.objects.forEach(obj => {
          obj.y += obj.vy;
          if (obj.y > CANVAS_H) obj.active = false;
          if (obj.active && this.checkCollision(player, obj)) {
            player.takeDamage(6);
            obj.active = false;
          }
        });
        this.objects = this.objects.filter(obj => obj.active);
        break;

      case 'speed_zones':
        if (this.timer % 200 === 0) {
          this.objects.push({ x: Math.random() * (CANVAS_W - 100), y: GROUND_Y - 20, w: 100, h: 20, life: 120, boost: Math.random() > 0.5 });
        }
        this.objects.forEach(obj => {
          obj.life--;
          if (this.checkCollision(player, obj)) {
            if (obj.boost) {
              player.speed = player.charDef.speed * 1.8;
            } else {
              player.speed = player.charDef.speed * 0.5;
            }
          }
        });
        this.objects = this.objects.filter(obj => obj.life > 0);
        if (!this.objects.some(obj => this.checkCollision(player, obj))) {
          if (player) player.speed = player.charDef.speed;
        }
        break;

      case 'phase_shift':
        // Arena darkens periodically
        break;

      case 'enrage_all':
        // Screen shakes, particles everywhere
        if (this.timer % 60 === 0) {
          this.objects.push({ x: Math.random() * CANVAS_W, y: -10, w: 8, h: 8, vy: 3 + Math.random() * 3, color: ['#FF1493', '#FFD700', '#1E90FF', '#FF4500'][Math.floor(Math.random() * 4)], active: true });
        }
        this.objects.forEach(obj => {
          obj.y += obj.vy;
          if (obj.y > CANVAS_H) obj.active = false;
        });
        this.objects = this.objects.filter(obj => obj.active);
        break;
    }
  }

  checkCollision(player, obj) {
    if (!player) return false;
    return player.x < obj.x + obj.w &&
           player.x + player.width > obj.x &&
           player.y < obj.y + obj.h &&
           player.y + player.height > obj.y;
  }

  draw(ctx) {
    if (!this.active) return;

    switch (this.type) {
      case 'laser_walls':
        this.objects.forEach(obj => {
          ctx.fillStyle = '#ff0044';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ff0044';
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.shadowBlur = 0;
        });
        break;

      case 'destructible_blocks':
        this.objects.forEach(obj => {
          ctx.fillStyle = `rgba(139, 69, 19, ${obj.hp / 3})`;
          ctx.strokeStyle = '#654321';
          ctx.lineWidth = 2;
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
        });
        break;

      case 'gravity_shift':
        if (this.gravityFlipped) {
          ctx.fillStyle = 'rgba(148, 0, 211, 0.1)';
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
          // Indicator arrows
          ctx.fillStyle = 'rgba(148, 0, 211, 0.4)';
          for (let i = 0; i < 5; i++) {
            const ax = 100 + i * 200;
            const ay = 50 + (this.timer % 40);
            ctx.beginPath();
            ctx.moveTo(ax, ay + 10);
            ctx.lineTo(ax - 8, ay);
            ctx.lineTo(ax + 8, ay);
            ctx.fill();
          }
        }
        break;

      case 'falling_debris':
        this.objects.forEach(obj => {
          ctx.fillStyle = '#555';
          ctx.strokeStyle = '#333';
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
        });
        break;

      case 'speed_zones':
        this.objects.forEach(obj => {
          const alpha = obj.life / 120;
          ctx.fillStyle = obj.boost ? `rgba(0, 255, 100, ${alpha * 0.3})` : `rgba(255, 0, 0, ${alpha * 0.3})`;
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.strokeStyle = obj.boost ? '#00ff66' : '#ff3333';
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
          ctx.setLineDash([]);
        });
        break;

      case 'phase_shift':
        // Periodic dark flashes
        if (Math.sin(this.timer * 0.02) > 0.7) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        }
        break;

      case 'enrage_all':
        this.objects.forEach(obj => {
          ctx.fillStyle = obj.color;
          ctx.shadowBlur = 5;
          ctx.shadowColor = obj.color;
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.shadowBlur = 0;
        });
        // Red vignette
        const vigGrad = ctx.createRadialGradient(CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.3, CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.7);
        vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
        vigGrad.addColorStop(1, `rgba(139, 0, 0, ${0.15 + Math.sin(this.timer * 0.05) * 0.1})`);
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        break;
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

    // DOM references
    this.menuOverlay = document.getElementById('menu-overlay');
    this.hudOverlay = document.getElementById('hud-overlay');
    this.touchControls = document.getElementById('touch-controls');
    this.bossWarning = document.getElementById('boss-warning');
    this.stageClear = document.getElementById('stage-clear');
    this.gameOverEl = document.getElementById('game-over');
    this.pauseOverlay = document.getElementById('pause-overlay');
    this.cutsceneOverlay = document.getElementById('cutscene-overlay');
    this.timeAttackTimer = document.getElementById('time-attack-timer');

    // Systems
    this.audio = new AudioManager();
    this.input = new InputManager();
    this.gimmicks = new GimmickManager();

    // Game state
    this.state = GameState.MENU;
    this.prevState = null;
    this.selectedChar = null;
    this.currentStage = 0;
    this.player = null;
    this.boss = null;
    this.particles = [];
    this.trails = [];
    this.score = 0;
    this.bgScrollX = 0;
    this.stagesCleared = [];
    this.screenShakeTimer = 0;
    this.screenShakeIntensity = 0;

    // Time attack
    this.timeAttackMode = false;
    this.timeAttackStart = 0;
    this.timeAttackElapsed = 0;
    this.bestTime = parseInt(localStorage.getItem('bestTime') || '0');

    // Options
    this.options = {
      musicVol: 50,
      sfxVol: 70,
      difficulty: 1,
      screenShake: true,
      showFPS: false
    };

    // Cutscene state
    this.cutsceneLines = [];
    this.cutsceneIndex = 0;
    this.cutsceneCharIndex = 0;
    this.cutsceneTimer = 0;
    this.cutsceneType = 'before';

    // Performance
    this.lastFrameTime = 0;
    this.fps = 60;
    this.fpsCounter = 0;
    this.fpsTime = 0;

    // Stars background
    this.stars = [];
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Math.random() * CANVAS_W,
        y: Math.random() * CANVAS_H,
        speed: 0.5 + Math.random() * 2,
        size: 1 + Math.random() * 2,
        brightness: 0.3 + Math.random() * 0.7
      });
    }

    // Start
    this.showMenu(GameState.MENU);
    this.gameLoop = this.gameLoop.bind(this);
    requestAnimationFrame(this.gameLoop);
  }

  // ==================== GAME LOOP ====================
  gameLoop(timestamp) {
    // FPS tracking
    const delta = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    this.fpsCounter++;
    this.fpsTime += delta;
    if (this.fpsTime >= 1000) {
      this.fps = this.fpsCounter;
      this.fpsCounter = 0;
      this.fpsTime = 0;
    }

    this.input.update();

    if (this.state === GameState.PLAYING) {
      this.updateGameplay(timestamp);
    } else if (this.state === GameState.CUTSCENE) {
      this.updateCutscene();
    } else if (this.state === GameState.BOSS_WARNING) {
      this.updateBossWarning();
    }

    // Pause check
    if (this.state === GameState.PLAYING && this.input.isPause()) {
      this.pauseGame();
    }

    // Background scroll
    this.bgScrollX += 0.5;

    // Update particles
    this.particles = this.particles.filter(p => { p.update(); return !p.isDead(); });

    // Screen shake decay
    if (this.screenShakeTimer > 0) this.screenShakeTimer--;

    // Time attack timer
    if (this.timeAttackMode && this.state === GameState.PLAYING) {
      this.timeAttackElapsed = Date.now() - this.timeAttackStart;
      this.updateTimeAttackDisplay();
    }

    this.render();
    requestAnimationFrame(this.gameLoop);
  }

  // ==================== GAMEPLAY UPDATE ====================
  updateGameplay(now) {
    if (!this.player || !this.boss) return;

    // Update entities
    this.player.update(this.input, now, this.boss);
    this.boss.update(this.player);

    // Gimmick updates
    this.gimmicks.update(this.player, this.boss);

    // Collision: player projectiles -> boss
    this.player.projectiles.forEach(proj => {
      if (!proj.active || this.boss.defeated) return;
      if (this.checkAABB(proj, this.boss)) {
        proj.active = false;
        this.boss.takeDamage(proj.damage * this.getDiffMultiplier('playerDmg'));
        this.score += 10;
        this.spawnParticles(proj.x, proj.y, this.boss.color, 5);
        this.audio.playSound('hitBoss');
        if (this.options.screenShake) this.triggerScreenShake(3);
      }
    });

    // Collision: boss projectiles -> player
    this.boss.projectiles.forEach(proj => {
      if (!proj.active) return;
      if (this.checkAABB(proj, this.player)) {
        proj.active = false;
        this.player.takeDamage(proj.damage * this.getDiffMultiplier('bossDmg'));
        this.spawnParticles(proj.x, proj.y, '#ff4444', 8);
        this.audio.playSound('playerHurt');
        if (this.options.screenShake) this.triggerScreenShake(5);
      }
    });

    // Collision: boss body -> player (contact damage)
    if (!this.boss.defeated && this.checkAABB(this.player, this.boss)) {
      this.player.takeDamage(5 * this.getDiffMultiplier('bossDmg'));
    }

    // Check win/lose
    if (this.boss.defeated && this.boss.defeatTimer > 60) {
      this.onBossDefeated();
    }
    if (this.player.hp <= 0) {
      this.onPlayerDeath();
    }

    // Update HUD
    this.updateHUD();
  }

  getDiffMultiplier(type) {
    const diff = this.options.difficulty;
    if (type === 'playerDmg') return [1.3, 1.0, 0.7][diff];
    if (type === 'bossDmg') return [0.7, 1.0, 1.4][diff];
    if (type === 'bossHp') return [0.8, 1.0, 1.3][diff];
    return 1;
  }

  checkAABB(a, b) {
    return a.x < b.x + b.width &&
           a.x + (a.width || 0) > b.x &&
           a.y < b.y + b.height &&
           a.y + (a.height || 0) > b.y;
  }

  // ==================== GAME FLOW ====================
  startGame(stageIndex) {
    this.currentStage = stageIndex;
    this.hideAllOverlays();
    this.showCutscene('before');
  }

  showCutscene(type) {
    this.state = GameState.CUTSCENE;
    this.cutsceneType = type;
    const stage = STAGES[this.currentStage];
    this.cutsceneLines = type === 'before' ? stage.cutsceneBefore : stage.cutsceneAfter;
    this.cutsceneIndex = 0;
    this.cutsceneCharIndex = 0;
    this.cutsceneTimer = 0;

    this.hideAllOverlays();
    this.cutsceneOverlay.classList.add('active');
    this.renderCutsceneLine();
  }

  renderCutsceneLine() {
    const line = this.cutsceneLines[this.cutsceneIndex];
    if (!line) return;
    document.getElementById('cutscene-speaker').textContent = line.speaker;
    document.getElementById('cutscene-text').textContent = '';
    this.cutsceneCharIndex = 0;
  }

  updateCutscene() {
    const line = this.cutsceneLines[this.cutsceneIndex];
    if (!line) return;

    // Typewriter effect
    this.cutsceneTimer++;
    if (this.cutsceneTimer % 2 === 0 && this.cutsceneCharIndex < line.text.length) {
      this.cutsceneCharIndex++;
      document.getElementById('cutscene-text').textContent = line.text.substring(0, this.cutsceneCharIndex);
    }

    // Advance on key press
    if (this.input.isAnyKey() && this.cutsceneTimer > 15) {
      if (this.cutsceneCharIndex < line.text.length) {
        // Show full text instantly
        this.cutsceneCharIndex = line.text.length;
        document.getElementById('cutscene-text').textContent = line.text;
        this.cutsceneTimer = 0;
      } else {
        // Next line
        this.cutsceneIndex++;
        this.cutsceneTimer = 0;
        if (this.cutsceneIndex >= this.cutsceneLines.length) {
          this.endCutscene();
        } else {
          this.renderCutsceneLine();
        }
      }
    }
  }

  endCutscene() {
    this.cutsceneOverlay.classList.remove('active');
    if (this.cutsceneType === 'before') {
      this.showBossWarning();
    } else {
      this.onStageClear();
    }
  }

  showBossWarning() {
    this.state = GameState.BOSS_WARNING;
    this.bossWarning.classList.add('active');
    this.bossWarningTimer = 0;
    this.audio.playSound('bossWarning');
  }

  updateBossWarning() {
    this.bossWarningTimer++;
    if (this.bossWarningTimer > 90) {
      this.bossWarning.classList.remove('active');
      this.beginBattle();
    }
  }

  beginBattle() {
    this.state = GameState.PLAYING;
    this.player = new Player(this.selectedChar);
    this.boss = createBoss(this.currentStage);
    this.boss.hp = Math.floor(this.boss.hp * this.getDiffMultiplier('bossHp'));
    this.boss.maxHp = this.boss.hp;
    this.gimmicks.init(STAGES[this.currentStage].gimmick);
    this.particles = [];

    // Show HUD and touch controls
    this.hudOverlay.classList.add('active');
    this.touchControls.classList.add('active');

    // Play music
    this.audio.playMusic(STAGES[this.currentStage].music);

    // Start time attack timer
    if (this.timeAttackMode && this.currentStage === 0) {
      this.timeAttackStart = Date.now();
    }
  }

  onBossDefeated() {
    this.state = GameState.STAGE_CLEAR;
    this.audio.stopMusic();
    this.audio.playSound('bossDefeat');

    // Giant explosion
    for (let i = 0; i < 40; i++) {
      this.spawnParticles(
        this.boss.x + Math.random() * this.boss.width,
        this.boss.y + Math.random() * this.boss.height,
        this.boss.color, 3
      );
    }

    this.score += 1000 * (this.currentStage + 1);
    if (!this.stagesCleared.includes(this.currentStage)) {
      this.stagesCleared.push(this.currentStage);
    }

    if (this.options.screenShake) this.triggerScreenShake(15);

    // Show after-cutscene after delay
    setTimeout(() => {
      this.showCutscene('after');
    }, 1500);
  }

  onStageClear() {
    // Move to next stage or victory
    if (this.currentStage >= STAGES.length - 1) {
      this.showVictory();
    } else {
      this.currentStage++;
      this.hideAllOverlays();
      this.showCutscene('before');
    }
  }

  showVictory() {
    this.state = GameState.VICTORY;
    this.hideAllOverlays();

    const el = this.gameOverEl;
    el.classList.add('active');
    document.getElementById('gameover-title').textContent = 'VICTORY!';
    document.getElementById('gameover-title').style.color = '#FFD700';
    document.getElementById('gameover-result').textContent = `YOU DEFEATED ALL 7 BOSSES! SCORE: ${this.score}`;

    if (this.timeAttackMode) {
      const timeEl = document.getElementById('gameover-time');
      timeEl.style.display = 'block';
      timeEl.textContent = `TIME: ${this.formatTime(this.timeAttackElapsed)}`;
      if (!this.bestTime || this.timeAttackElapsed < this.bestTime) {
        this.bestTime = this.timeAttackElapsed;
        localStorage.setItem('bestTime', String(this.bestTime));
        timeEl.textContent += ' (NEW BEST!)';
      }
    }

    this.audio.stopMusic();
  }

  onPlayerDeath() {
    this.state = GameState.GAME_OVER;
    this.hideAllOverlays();

    const el = this.gameOverEl;
    el.classList.add('active');
    document.getElementById('gameover-title').textContent = 'GAME OVER';
    document.getElementById('gameover-title').style.color = '#ff4444';
    document.getElementById('gameover-result').textContent = `Defeated at Stage ${this.currentStage + 1}: ${STAGES[this.currentStage].name}`;
    document.getElementById('gameover-time').style.display = 'none';

    this.audio.stopMusic();
    this.audio.playSound('playerDeath');
  }

  // ==================== PAUSE ====================
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
            <div class="subtitle">~ BOSS RUSH MODE ~</div>
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
          <div class="title-section"><h2>SELECT YOUR CHARACTER</h2></div>
          <div class="char-select-grid">
            ${Object.values(CHARACTERS).map(c => `
              <div class="char-card ${this.selectedChar && this.selectedChar.id === c.id ? 'selected' : ''}" onclick="game.selectCharacter('${c.id}')">
                <div class="char-icon" style="background: radial-gradient(circle, ${c.accentColor}, ${c.color});">${c.name[0]}</div>
                <div class="char-name">${c.name}</div>
                <div class="char-desc">${c.description}</div>
                <div class="char-stats">
                  <div class="stat-row"><span>HP</span><div class="stat-bar-mini"><div class="stat-bar-mini-fill" style="width:${c.hp / 1.2}%; background: linear-gradient(90deg, ${c.color}, ${c.accentColor})"></div></div></div>
                  <div class="stat-row"><span>SPD</span><div class="stat-bar-mini"><div class="stat-bar-mini-fill" style="width:${c.speed * 14}%; background: linear-gradient(90deg, ${c.color}, ${c.accentColor})"></div></div></div>
                  <div class="stat-row"><span>ATK</span><div class="stat-bar-mini"><div class="stat-bar-mini-fill" style="width:${c.damage * 4}%; background: linear-gradient(90deg, ${c.color}, ${c.accentColor})"></div></div></div>
                  <div class="stat-row"><span>RATE</span><div class="stat-bar-mini"><div class="stat-bar-mini-fill" style="width:${100 - (c.fireRate / 4)}%; background: linear-gradient(90deg, ${c.color}, ${c.accentColor})"></div></div></div>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="menu-btn start-btn" onclick="game.confirmCharacter()" ${!this.selectedChar ? 'disabled style="opacity:0.4;pointer-events:none"' : ''}>START BOSS RUSH</button>
        `;
        break;

      case GameState.STAGE_SELECT:
        container.innerHTML = `
          <button class="back-btn" onclick="game.showMenu('${GameState.MENU}')">← BACK</button>
          <div class="title-section"><h2>STAGE SELECT</h2><div class="subtitle">Select a stage to begin</div></div>
          <div class="stage-list">
            ${STAGES.map((s, i) => {
              const locked = i > 0 && !this.stagesCleared.includes(i - 1);
              return `
              <div class="stage-item ${locked ? 'locked' : ''} ${this.stagesCleared.includes(i) ? 'cleared' : ''}" onclick="game.selectStage(${i})">
                <div class="stage-num" style="background: ${locked ? '#333' : s.bossColor}">${s.id}</div>
                <div class="stage-info">
                  <div class="stage-name">${s.name}</div>
                  <div class="stage-boss">${s.boss}</div>
                </div>
                <div class="stage-status">${this.stagesCleared.includes(i) ? '★' : locked ? '🔒' : '→'}</div>
              </div>`;
            }).join('')}
          </div>
        `;
        break;

      case GameState.OPTIONS:
        container.innerHTML = `
          <button class="back-btn" onclick="game.showMenu('${GameState.MENU}')">← BACK</button>
          <div class="title-section"><h2>OPTIONS</h2></div>
          <div class="options-panel">
            <div class="option-row">
              <span class="option-label">Music Volume</span>
              <div class="option-value">
                <button class="option-btn" onclick="game.adjustOption('musicVol', -10)">−</button>
                <span class="option-display" id="opt-music">${this.options.musicVol}%</span>
                <button class="option-btn" onclick="game.adjustOption('musicVol', 10)">+</button>
              </div>
            </div>
            <div class="option-row">
              <span class="option-label">SFX Volume</span>
              <div class="option-value">
                <button class="option-btn" onclick="game.adjustOption('sfxVol', -10)">−</button>
                <span class="option-display" id="opt-sfx">${this.options.sfxVol}%</span>
                <button class="option-btn" onclick="game.adjustOption('sfxVol', 10)">+</button>
              </div>
            </div>
            <div class="option-row">
              <span class="option-label">Difficulty</span>
              <div class="option-value">
                <button class="option-btn" onclick="game.adjustOption('difficulty', -1)">−</button>
                <span class="option-display diff-${this.options.difficulty}" id="opt-diff">${['EASY', 'NORMAL', 'HARD'][this.options.difficulty]}</span>
                <button class="option-btn" onclick="game.adjustOption('difficulty', 1)">+</button>
              </div>
            </div>
            <div class="option-row">
              <span class="option-label">Screen Shake</span>
              <div class="option-value">
                <button class="option-btn toggle ${this.options.screenShake ? 'active' : ''}" onclick="game.toggleShake()">${this.options.screenShake ? 'ON' : 'OFF'}</button>
              </div>
            </div>
            <div class="option-row">
              <span class="option-label">Show FPS</span>
              <div class="option-value">
                <button class="option-btn toggle ${this.options.showFPS ? 'active' : ''}" onclick="game.toggleFPS()">${this.options.showFPS ? 'ON' : 'OFF'}</button>
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
            <div class="subtitle">Complete all 7 stages as fast as possible!</div>
          </div>
          <div class="time-attack-info">
            <div class="ta-record">
              <span class="ta-label">BEST TIME</span>
              <span class="ta-value">${this.bestTime ? this.formatTime(this.bestTime) : '--:--:--'}</span>
            </div>
          </div>
          <div class="menu-buttons">
            <button class="menu-btn start-btn" onclick="game.startTimeAttack()">START TIME ATTACK</button>
          </div>
          <div class="ta-rules">
            <p>• Fight all 7 bosses in sequence</p>
            <p>• Timer starts at Stage 1</p>
            <p>• No continues - one life!</p>
            <p>• Cutscenes are skippable</p>
          </div>
        `;
        break;

      case GameState.EXTRA:
        container.innerHTML = `
          <button class="back-btn" onclick="game.showMenu('${GameState.MENU}')">← BACK</button>
          <div class="title-section"><h2>EXTRA</h2></div>
          <div class="extra-content">
            <div class="extra-section">
              <h3>PLAYABLE CHARACTERS</h3>
              <div class="extra-list">
                ${Object.values(CHARACTERS).map(c => `<div class="extra-item"><span class="dot" style="background:${c.color}"></span>${c.name} - ${c.description}</div>`).join('')}
              </div>
            </div>
            <div class="extra-section">
              <h3>BOSS GALLERY</h3>
              <div class="extra-list">
                ${STAGES.map(s => `<div class="extra-item"><span class="dot" style="background:${s.bossColor}"></span>Stage ${s.id}: ${s.boss} <span class="extra-sub">${s.bossSubtitle}</span></div>`).join('')}
              </div>
            </div>
            <div class="extra-section credits">
              <h3>CREDITS</h3>
              <p>Fireboy The Brothers © Player10thGames</p>
              <p>Boss Inspirations: Gradius, Sonic, Terra Cresta, Deltarune</p>
              <p>Engine: HTML5 Canvas</p>
            </div>
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
    this.score = 0;
    this.startGame(0);
  }

  selectStage(index) {
    if (index > 0 && !this.stagesCleared.includes(index - 1)) return;
    if (!this.selectedChar) {
      this.showMenu(GameState.CHAR_SELECT);
      return;
    }
    this.timeAttackMode = false;
    this.score = 0;
    this.startGame(index);
  }

  startTimeAttack() {
    if (!this.selectedChar) {
      this.showMenu(GameState.CHAR_SELECT);
      return;
    }
    this.timeAttackMode = true;
    this.score = 0;
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

  toggleFPS() {
    this.options.showFPS = !this.options.showFPS;
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
    this.startGame(this.currentStage);
  }

  // ==================== HUD ====================
  updateHUD() {
    if (!this.player || !this.boss) return;
    const playerHpPct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
    const bossHpPct = Math.max(0, (this.boss.hp / this.boss.maxHp) * 100);

    document.getElementById('player-hp-fill').style.width = `${playerHpPct}%`;
    document.getElementById('boss-hp-fill').style.width = `${bossHpPct}%`;

    // Color change when low HP
    if (playerHpPct < 25) {
      document.getElementById('player-hp-fill').style.background = 'linear-gradient(180deg, #ff3333, #cc0000)';
    } else {
      document.getElementById('player-hp-fill').style.background = `linear-gradient(180deg, ${this.selectedChar.accentColor}, ${this.selectedChar.color})`;
    }

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

    // Screen shake offset
    let shakeX = 0, shakeY = 0;
    if (this.screenShakeTimer > 0) {
      shakeX = (Math.random() - 0.5) * this.screenShakeIntensity;
      shakeY = (Math.random() - 0.5) * this.screenShakeIntensity;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);
    ctx.clearRect(-10, -10, CANVAS_W + 20, CANVAS_H + 20);

    if (this.state === GameState.PLAYING || this.state === GameState.PAUSED ||
        this.state === GameState.BOSS_WARNING || this.state === GameState.STAGE_CLEAR ||
        this.state === GameState.GAME_OVER || this.state === GameState.VICTORY) {
      this.renderGameplay(ctx);
    } else {
      this.renderMenuBackground(ctx);
    }

    // Particles
    this.particles.forEach(p => p.draw(ctx));

    ctx.restore();

    // FPS display
    if (this.options.showFPS) {
      ctx.fillStyle = '#0f0';
      ctx.font = '12px monospace';
      ctx.fillText(`FPS: ${this.fps}`, CANVAS_W - 70, 15);
    }
  }

  renderMenuBackground(ctx) {
    // Deep space background
    const stage = STAGES[this.currentStage] || STAGES[0];
    ctx.fillStyle = '#060612';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Animated nebula
    const time = Date.now() / 2000;
    const nebulaGrad = ctx.createRadialGradient(
      CANVAS_W / 2 + Math.sin(time) * 100, CANVAS_H / 2 + Math.cos(time) * 50, 50,
      CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.6
    );
    nebulaGrad.addColorStop(0, 'rgba(80, 20, 100, 0.15)');
    nebulaGrad.addColorStop(0.5, 'rgba(20, 10, 60, 0.1)');
    nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Stars
    this.stars.forEach(star => {
      star.x -= star.speed * 0.3;
      if (star.x < 0) { star.x = CANVAS_W; star.y = Math.random() * CANVAS_H; }
      const twinkle = 0.5 + Math.sin(Date.now() / 500 + star.x) * 0.3;
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
  }

  renderGameplay(ctx) {
    const stage = STAGES[this.currentStage];

    // Stage-specific background
    ctx.fillStyle = stage.bgColor;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Scrolling stars
    this.stars.forEach(star => {
      star.x -= star.speed;
      if (star.x < 0) { star.x = CANVAS_W; star.y = Math.random() * CANVAS_H; }
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    // Atmospheric gradient
    const atmGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    atmGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    atmGrad.addColorStop(0.7, stage.bgAccent);
    atmGrad.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    ctx.fillStyle = atmGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Ground platform with detail
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);

    // Ground top edge (glowing line)
    const groundGrad = ctx.createLinearGradient(0, GROUND_Y, 0, GROUND_Y + 4);
    groundGrad.addColorStop(0, stage.bossColor);
    groundGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, GROUND_Y, CANVAS_W, 4);

    // Ground pattern
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_W; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, GROUND_Y);
      ctx.lineTo(i, CANVAS_H);
      ctx.stroke();
    }

    // Gimmick effects (drawn behind entities)
    this.gimmicks.draw(ctx);

    // Draw entities
    if (this.player) this.player.draw(ctx);
    if (this.boss) this.boss.draw(ctx);
  }

  // ==================== EFFECTS ====================
  spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(
        x, y,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        color,
        25 + Math.random() * 25
      ));
    }
  }

  triggerScreenShake(intensity) {
    this.screenShakeTimer = 10;
    this.screenShakeIntensity = intensity;
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
