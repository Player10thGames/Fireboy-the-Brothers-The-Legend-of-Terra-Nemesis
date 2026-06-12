// ============================================================
// FIREBOY THE BROTHERS - THE LEGEND OF TERRA NEMESIS (Demo)
// HTML5 Canvas Game Engine
// ============================================================

(function() {
  'use strict';

  // ===== CONSTANTS =====
  const CANVAS_W = 800;
  const CANVAS_H = 600;
  const GRAVITY = 0.5;
  const MAX_FALL = 12;
  const TILE = 40;
  const FPS = 60;

  // ===== GAME STATES =====
  const STATE = {
    TITLE: 'title',
    PLAYER_SELECT: 'playerSelect',
    STAGE_INTRO: 'stageIntro',
    PLAYING: 'playing',
    PAUSED: 'paused',
    BOSS_WARNING: 'bossWarning',
    BOSS_FIGHT: 'bossFight',
    STAGE_CLEAR: 'stageClear',
    GAME_OVER: 'gameOver',
    VICTORY: 'victory'
  };

  // ===== CHARACTER DATA =====
  const CHARACTERS = {
    fireboy: {
      name: 'FIREBOY',
      color: '#FF4422',
      accentColor: '#FF8800',
      speed: 4.5,
      jumpPower: -11,
      maxHp: 5,
      shotSpeed: 8,
      shotDamage: 1,
      shotColor: '#FF6600',
      special: 'Flame Burst',
      desc: 'The hero of fire. Balanced stats.',
      spriteFile: 'Fireboy (Playable Characters).png'
    },
    caroline: {
      name: 'CAROLINE',
      color: '#FF6699',
      accentColor: '#FFCCDD',
      speed: 5,
      jumpPower: -12,
      maxHp: 3,
      shotSpeed: 10,
      shotDamage: 1,
      shotColor: '#FF99BB',
      special: 'Heart Beam',
      desc: 'Fast & agile. Low HP, quick shots.',
      spriteFile: 'Caroline (Playable Characters).png'
    },
    butch: {
      name: 'BUTCH',
      color: '#44BB44',
      accentColor: '#88FF88',
      speed: 3.5,
      jumpPower: -10,
      maxHp: 7,
      shotSpeed: 6,
      shotDamage: 2,
      shotColor: '#44FF44',
      special: 'Power Slam',
      desc: 'Tough & strong. Slow but powerful.',
      spriteFile: 'Butch (Playable Characters).png'
    },
    anabel: {
      name: 'ANABEL',
      color: '#DD44FF',
      accentColor: '#FF88FF',
      speed: 4,
      jumpPower: -11.5,
      maxHp: 4,
      shotSpeed: 9,
      shotDamage: 1,
      shotColor: '#DD88FF',
      special: 'Star Storm',
      desc: 'Good jumper. Special attacks.',
      spriteFile: 'Anabel (Playable Characters).png'
    }
  };

  // ===== STAGE DATA =====
  const STAGES = [
    {
      name: 'TERRA OUTPOST',
      subtitle: 'Stage 1',
      bgColor1: '#0a0a2e',
      bgColor2: '#1a1a4e',
      platformColor: '#336633',
      platformTopColor: '#55aa55',
      tileMap: null, // generated procedurally
      bossName: 'MEGA SENTINEL',
      bossColor: '#884488',
      bossHp: 15,
      musicFile: '13 Last Evil [Boss Battle].mp3',
      gimmicks: ['moving_platforms', 'fire_traps']
    },
    {
      name: 'CRYSTAL CAVERNS',
      subtitle: 'Stage 2',
      bgColor1: '#0e1a3e',
      bgColor2: '#1e2a5e',
      platformColor: '#446688',
      platformTopColor: '#6699cc',
      bossName: 'CRYSTAL WYRM',
      bossColor: '#44aaaa',
      bossHp: 20,
      musicFile: '13 Last Evil [Boss Battle].mp3',
      gimmicks: ['crumbling_platforms', 'ice_patches']
    },
    {
      name: 'INFERNAL FORGE',
      subtitle: 'Stage 3',
      bgColor1: '#2a0a0a',
      bgColor2: '#4a1a1a',
      platformColor: '#884422',
      platformTopColor: '#cc6633',
      bossName: 'BIG CORE MK.I',
      bossColor: '#aa4444',
      bossHp: 30,
      musicFile: '13 Last Evil [Boss Battle].mp3',
      gimmicks: ['lava_pits', 'conveyor_belts']
    }
  ];

  // ===== SOUND MANAGEMENT =====
  const SOUNDS = {
    jump: 'Jump.wav',
    hurt: 'PlayerHurt.wav',
    death: 'PlayerDeath.wav',
    bossWarn: 'BossWarning.wav',
    bossHit: 'HitBoss.wav',
    bossDefeat: 'BossDefeat_Explosion.wav',
    impact: 'Impact2.wav',
    strain: 'Strain.wav',
    strain2: 'Strain2.wav',
    laser: 'BigCore_Laser.wav',
    stageClear: '23. Stage Clear.mp3',
    gameOver: '21. Game Over.mp3',
    bossMusic: '13 Last Evil [Boss Battle].mp3'
  };

  // ============================================================
  // GAME ENGINE
  // ============================================================

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // Audio context for sound effects
  let audioCtx = null;
  let audioBuffers = {};
  let musicAudio = null;
  let musicPlaying = false;

  function initAudio() {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {
      console.warn('No Web Audio support');
    }
  }

  function playSound(name, volume = 0.5) {
    if (!audioCtx) initAudio();
    if (!audioCtx) return;
    const file = SOUNDS[name];
    if (!file) return;
    if (audioBuffers[name]) {
      const src = audioCtx.createBufferSource();
      src.buffer = audioBuffers[name];
      const gain = audioCtx.createGain();
      gain.gain.value = volume;
      src.connect(gain);
      gain.connect(audioCtx.destination);
      src.start(0);
    } else {
      loadAndPlaySound(name, file, volume);
    }
  }

  function loadAndPlaySound(name, file, volume) {
    const url = file;
    fetch(url).then(r => r.arrayBuffer()).then(buf => {
      audioCtx.decodeAudioData(buf, decoded => {
        audioBuffers[name] = decoded;
        const src = audioCtx.createBufferSource();
        src.buffer = decoded;
        const gain = audioCtx.createGain();
        gain.gain.value = volume;
        src.connect(gain);
        gain.connect(audioCtx.destination);
        src.start(0);
      });
    }).catch(() => {});
  }

  function playMusic(file) {
    if (musicAudio) {
      musicAudio.pause();
      musicAudio = null;
    }
    musicAudio = new Audio(file);
    musicAudio.loop = true;
    musicAudio.volume = 0.4;
    musicAudio.play().catch(() => {});
    musicPlaying = true;
  }

  function stopMusic() {
    if (musicAudio) {
      musicAudio.pause();
      musicAudio = null;
    }
    musicPlaying = false;
  }

  // ===== INPUT SYSTEM =====
  const keys = {};
  const touchState = { left: false, right: false, up: false, down: false, a: false, b: false };

  document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
    initAudio();
  });
  document.addEventListener('keyup', e => { keys[e.code] = false; });

  function setupTouchControls() {
    const controls = document.getElementById('touch-controls');

    // Detect touch device
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (isTouchDevice) {
      controls.classList.add('active');
    }

    // D-Pad
    ['up','down','left','right'].forEach(dir => {
      const btn = document.getElementById('dpad-' + dir);
      if (!btn) return;
      btn.addEventListener('touchstart', e => { e.preventDefault(); touchState[dir] = true; initAudio(); });
      btn.addEventListener('touchend', e => { e.preventDefault(); touchState[dir] = false; });
      btn.addEventListener('touchcancel', e => { touchState[dir] = false; });
    });

    // Action buttons
    const btnA = document.getElementById('btn-a');
    const btnB = document.getElementById('btn-b');
    if (btnA) {
      btnA.addEventListener('touchstart', e => { e.preventDefault(); touchState.a = true; initAudio(); });
      btnA.addEventListener('touchend', e => { e.preventDefault(); touchState.a = false; });
      btnA.addEventListener('touchcancel', e => { touchState.a = false; });
    }
    if (btnB) {
      btnB.addEventListener('touchstart', e => { e.preventDefault(); touchState.b = true; initAudio(); });
      btnB.addEventListener('touchend', e => { e.preventDefault(); touchState.b = false; });
      btnB.addEventListener('touchcancel', e => { touchState.b = false; });
    }

    // Play/Pause
    const btnPlay = document.getElementById('btn-play');
    if (btnPlay) {
      btnPlay.addEventListener('touchstart', e => {
        e.preventDefault();
        initAudio();
        if (game.state === STATE.PLAYING || game.state === STATE.BOSS_FIGHT) {
          game.togglePause();
        } else if (game.state === STATE.PAUSED) {
          game.togglePause();
        }
      });
    }
  }

  function isLeft() { return keys['ArrowLeft'] || keys['KeyA'] || touchState.left; }
  function isRight() { return keys['ArrowRight'] || keys['KeyD'] || touchState.right; }
  function isUp() { return keys['ArrowUp'] || keys['KeyW'] || touchState.up; }
  function isDown() { return keys['ArrowDown'] || keys['KeyS'] || touchState.down; }
  function isJump() { return keys['Space'] || keys['KeyZ'] || touchState.a; }
  function isShoot() { return keys['KeyX'] || keys['ShiftLeft'] || touchState.b; }
  function isStart() { return keys['Enter'] || keys['Escape'] || keys['KeyP']; }
  function isConfirm() { return keys['Enter'] || keys['Space'] || touchState.a; }

  // ===== IMAGE LOADING =====
  const images = {};
  const imageFiles = {
    fireboy: 'Fireboy (Playable Characters).png',
    caroline: 'Caroline (Playable Characters).png',
    butch: 'Butch (Playable Characters).png',
    anabel: 'Anabel (Playable Characters).png',
    bgSpace: 'Background (Space).png',
    platform: 'Foreground (Platform).png',
    boss1: 'Big Core MK.I (Boss).png',
    laser: 'BigCore_Laser.png',
    dpad: 'D-Pad.png',
    button: 'Button.png',
    play: 'Play.png'
  };

  function loadImages() {
    return Promise.all(Object.entries(imageFiles).map(([key, file]) => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => { images[key] = img; resolve(); };
        img.onerror = () => { images[key] = null; resolve(); };
        img.src = file;
      });
    }));
  }

  // ===== PARTICLE SYSTEM =====
  let particles = [];

  function spawnParticles(x, y, color, count, speed, life) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * speed;
      particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: life + Math.random() * life * 0.5,
        maxLife: life,
        color,
        size: 2 + Math.random() * 4
      });
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function drawParticles() {
    particles.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }

  // ===== STAR FIELD =====
  let stars = [];
  function initStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * CANVAS_W,
        y: Math.random() * CANVAS_H,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        brightness: Math.random()
      });
    }
  }

  function updateStars() {
    stars.forEach(s => {
      s.x -= s.speed;
      s.brightness = 0.5 + Math.sin(Date.now() * 0.003 + s.x) * 0.5;
      if (s.x < 0) { s.x = CANVAS_W; s.y = Math.random() * CANVAS_H; }
    });
  }

  function drawStars() {
    stars.forEach(s => {
      ctx.globalAlpha = s.brightness;
      ctx.fillStyle = '#fff';
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });
    ctx.globalAlpha = 1;
  }

  // ===== GAME OBJECT =====
  const game = {
    state: STATE.TITLE,
    selectedChar: 'fireboy',
    selectCursor: 0,
    charKeys: ['fireboy', 'caroline', 'butch', 'anabel'],
    currentStage: 0,
    score: 0,
    lives: 3,
    stageTimer: 0,
    stateTimer: 0,
    screenShake: 0,
    paused: false,

    // Player
    player: null,
    // Platforms
    platforms: [],
    // Enemies
    enemies: [],
    // Boss
    boss: null,
    // Projectiles
    playerBullets: [],
    enemyBullets: [],
    // Gimmicks
    gimmicks: [],
    // Pickups
    pickups: [],

    togglePause() {
      if (this.state === STATE.PLAYING || this.state === STATE.BOSS_FIGHT) {
        this.state = STATE.PAUSED;
        this.stateTimer = 0;
        stopMusic();
      } else if (this.state === STATE.PAUSED) {
        this.state = this.boss ? STATE.BOSS_FIGHT : STATE.PLAYING;
        this.stateTimer = 0;
      }
    },

    reset() {
      this.score = 0;
      this.lives = 3;
      this.currentStage = 0;
      this.player = null;
      this.boss = null;
      this.platforms = [];
      this.enemies = [];
      this.playerBullets = [];
      this.enemyBullets = [];
      this.gimmicks = [];
      this.pickups = [];
      particles = [];
    },

    startStage(idx) {
      this.currentStage = idx;
      this.state = STATE.STAGE_INTRO;
      this.stateTimer = 120;
      this.platforms = [];
      this.enemies = [];
      this.playerBullets = [];
      this.enemyBullets = [];
      this.gimmicks = [];
      this.pickups = [];
      this.boss = null;
      particles = [];
      this.buildStage(idx);
      this.spawnPlayer();
    },

    buildStage(idx) {
      const stage = STAGES[idx];
      // Build ground
      for (let x = 0; x < CANVAS_W; x += TILE) {
        this.platforms.push({ x, y: CANVAS_H - TILE, w: TILE, h: TILE, type: 'ground', color: stage.platformColor, topColor: stage.platformTopColor });
      }

      // Build stage-specific layout
      if (idx === 0) {
        // TERRA OUTPOST - Military base with platforms
        this.addPlatform(120, 460, 160, 'normal');
        this.addPlatform(340, 380, 120, 'normal');
        this.addPlatform(550, 320, 160, 'normal');
        this.addPlatform(200, 260, 100, 'normal');
        this.addPlatform(50, 180, 120, 'normal');
        this.addPlatform(400, 180, 140, 'normal');
        this.addPlatform(650, 200, 120, 'normal');
        // Moving platforms
        this.gimmicks.push({ type: 'moving_platform', x: 300, y: 460, w: 80, h: 20, startX: 300, endX: 500, speed: 1, dir: 1, color: '#667788', topColor: '#99aacc' });
        this.gimmicks.push({ type: 'moving_platform', x: 600, y: 460, w: 80, h: 20, startX: 500, endX: 700, speed: 1.5, dir: 1, color: '#667788', topColor: '#99aacc' });
        // Fire traps
        this.gimmicks.push({ type: 'fire_trap', x: 460, y: CANVAS_H - TILE - 20, w: 30, h: 40, timer: 0, interval: 90, active: false, onDuration: 40 });
        this.gimmicks.push({ type: 'fire_trap', x: 200, y: CANVAS_H - TILE - 20, w: 30, h: 40, timer: 45, interval: 90, active: false, onDuration: 40 });
        // Enemies
        this.addEnemy(400, 340, 'soldier', 340, 460);
        this.addEnemy(600, 280, 'soldier', 550, 710);
        this.addEnemy(220, 220, 'soldier', 200, 300);
        // Pickups
        this.pickups.push({ x: 170, y: 430, type: 'health', collected: false });
        this.pickups.push({ x: 580, y: 290, type: 'score', collected: false });
      } else if (idx === 1) {
        // CRYSTAL CAVERNS - Underground caverns
        this.addPlatform(80, 460, 120, 'crumble');
        this.addPlatform(280, 400, 100, 'normal');
        this.addPlatform(450, 340, 140, 'crumble');
        this.addPlatform(150, 280, 120, 'normal');
        this.addPlatform(350, 220, 100, 'crumble');
        this.addPlatform(550, 260, 130, 'normal');
        this.addPlatform(680, 180, 100, 'normal');
        // Ice patches
        this.gimmicks.push({ type: 'ice_patch', x: 0, y: CANVAS_H - TILE, w: 200, h: 10, friction: 0.02 });
        this.gimmicks.push({ type: 'ice_patch', x: 500, y: CANVAS_H - TILE, w: 300, h: 10, friction: 0.02 });
        // Enemies
        this.addEnemy(300, 360, 'crystal_bug', 280, 380);
        this.addEnemy(480, 300, 'crystal_bug', 450, 590);
        this.addEnemy(180, 240, 'bat', 150, 270);
        this.addEnemy(570, 220, 'bat', 550, 680);
        // Pickups
        this.pickups.push({ x: 310, y: 370, type: 'health', collected: false });
        this.pickups.push({ x: 580, y: 230, type: 'score', collected: false });
        this.pickups.push({ x: 700, y: 150, type: 'health', collected: false });
      } else if (idx === 2) {
        // INFERNAL FORGE - Fire factory with lava
        this.addPlatform(100, 460, 120, 'normal');
        this.addPlatform(300, 400, 100, 'normal');
        this.addPlatform(500, 340, 120, 'normal');
        this.addPlatform(200, 280, 140, 'normal');
        this.addPlatform(450, 220, 100, 'normal');
        this.addPlatform(650, 260, 130, 'normal');
        this.addPlatform(50, 160, 100, 'normal');
        // Conveyor belts
        this.gimmicks.push({ type: 'conveyor', x: 220, y: CANVAS_H - TILE, w: 160, h: TILE, speed: 1.5, dir: -1, color: '#554433', topColor: '#887766' });
        this.gimmicks.push({ type: 'conveyor', x: 600, y: CANVAS_H - TILE, w: 200, h: TILE, speed: 2, dir: 1, color: '#554433', topColor: '#887766' });
        // Lava pits
        this.gimmicks.push({ type: 'lava', x: 380, y: CANVAS_H - 15, w: 120, h: 15, timer: 0 });
        this.gimmicks.push({ type: 'lava', x: 100, y: CANVAS_H - 15, w: 100, h: 15, timer: 30 });
        // Enemies
        this.addEnemy(320, 360, 'forge_droid', 300, 400);
        this.addEnemy(530, 300, 'forge_droid', 500, 620);
        this.addEnemy(230, 240, 'forge_droid', 200, 340);
        this.addEnemy(680, 220, 'forge_droid', 650, 780);
        // Pickups
        this.pickups.push({ x: 140, y: 430, type: 'health', collected: false });
        this.pickups.push({ x: 510, y: 310, type: 'score', collected: false });
        this.pickups.push({ x: 80, y: 130, type: 'health', collected: false });
      }
    },

    addPlatform(x, y, w, type) {
      const stage = STAGES[this.currentStage];
      this.platforms.push({ x, y, w, h: TILE/2, type, color: stage.platformColor, topColor: stage.platformTopColor, crumbleTimer: type === 'crumble' ? 60 : -1, crumbling: false, fallen: false });
    },

    addEnemy(x, y, type, patrolL, patrolR) {
      const stage = STAGES[this.currentStage];
      const colors = { soldier: '#aa4444', crystal_bug: '#44cccc', bat: '#8844aa', forge_droid: '#cc8833' };
      const hps = { soldier: 2, crystal_bug: 3, bat: 1, forge_droid: 4 };
      this.enemies.push({
        x, y, w: 30, h: 30, type,
        vx: 1, vy: 0,
        hp: hps[type] || 2,
        color: colors[type] || '#aa4444',
        patrolL, patrolR,
        onGround: false,
        shootTimer: Math.random() * 60 + 60,
        animFrame: 0
      });
    },

    spawnPlayer() {
      const ch = CHARACTERS[this.selectedChar];
      this.player = {
        x: 60,
        y: CANVAS_H - TILE - 50,
        w: 28,
        h: 40,
        vx: 0,
        vy: 0,
        hp: ch.maxHp,
        maxHp: ch.maxHp,
        onGround: false,
        facing: 1,
        shootCooldown: 0,
        invincible: 0,
        animFrame: 0,
        animTimer: 0,
        jumpHeld: false,
        onIce: false,
        onConveyor: 0,
        dead: false,
        deathTimer: 0,
        specialCharge: 0
      };
    },

    spawnBoss() {
      const stage = STAGES[this.currentStage];
      this.boss = {
        x: CANVAS_W - 120,
        y: 200,
        w: 80,
        h: 80,
        hp: stage.bossHp,
        maxHp: stage.bossHp,
        color: stage.bossColor,
        name: stage.bossName,
        phase: 0,
        timer: 0,
        pattern: 0,
        patternTimer: 0,
        vx: 0,
        vy: 0,
        invincible: 0,
        animFrame: 0,
        defeated: false,
        defeatTimer: 0,
        coreAngle: 0,
        attacks: this.getBossAttacks(stage.bossName)
      };
      this.state = STATE.BOSS_WARNING;
      this.stateTimer = 150;
      playSound('bossWarn', 0.7);
    },

    getBossAttacks(name) {
      if (name === 'MEGA SENTINEL') {
        return [
          { type: 'aimed_shot', interval: 60, speed: 5 },
          { type: 'sweep_laser', interval: 120, duration: 60 },
          { type: 'homing_missile', interval: 90, speed: 3 }
        ];
      } else if (name === 'CRYSTAL WYRM') {
        return [
          { type: 'crystal_rain', interval: 80, count: 5 },
          { type: 'charge', interval: 120, speed: 6 },
          { type: 'ice_beam', interval: 100, duration: 40 }
        ];
      } else if (name === 'BIG CORE MK.I') {
        return [
          { type: 'multi_shot', interval: 45, count: 3, speed: 6 },
          { type: 'laser_sweep', interval: 150, duration: 80 },
          { type: 'homing_missile', interval: 70, speed: 4 },
          { type: 'core_beam', interval: 200, duration: 100 }
        ];
      }
      return [{ type: 'aimed_shot', interval: 60, speed: 5 }];
    }
  };

  // ===== DRAWING HELPERS =====
  function drawText(text, x, y, size, color, align, shadow) {
    ctx.font = `bold ${size}px 'Courier New', monospace`;
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    if (shadow) {
      ctx.fillStyle = '#000';
      ctx.fillText(text, x + 2, y + 2);
    }
    ctx.fillStyle = color || '#fff';
    ctx.fillText(text, x, y);
  }

  function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  function drawCharSprite(key, x, y, w, h, facing, frame) {
    const img = images[key];
    if (img) {
      ctx.save();
      if (facing === -1) {
        ctx.translate(x + w, y);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0, w, h);
      } else {
        ctx.drawImage(img, x, y, w, h);
      }
      ctx.restore();
    } else {
      // Fallback: draw colored rectangle with character features
      const ch = CHARACTERS[key];
      ctx.fillStyle = ch.color;
      ctx.fillRect(x, y, w, h);
      // Eyes
      ctx.fillStyle = '#fff';
      const eyeY = y + h * 0.25;
      if (facing === 1) {
        ctx.fillRect(x + w * 0.5, eyeY, 5, 5);
        ctx.fillRect(x + w * 0.7, eyeY, 5, 5);
      } else {
        ctx.fillRect(x + w * 0.2, eyeY, 5, 5);
        ctx.fillRect(x + w * 0.4, eyeY, 5, 5);
      }
    }
  }

  function drawBossSprite(boss) {
    const img = images.boss1;
    boss.coreAngle = (boss.coreAngle || 0) + 0.03;
    
    // Boss-specific drawing
    if (boss.name === 'MEGA SENTINEL') {
      // Mechanical sentinel
      ctx.fillStyle = '#554466';
      ctx.fillRect(boss.x - boss.w/2, boss.y - boss.h/2, boss.w, boss.h);
      // Armor plating
      ctx.fillStyle = '#776688';
      ctx.fillRect(boss.x - boss.w/2 + 5, boss.y - boss.h/2 + 5, boss.w - 10, boss.h - 10);
      // Core eye
      ctx.fillStyle = '#ff2222';
      ctx.beginPath();
      ctx.arc(boss.x, boss.y, 15 + Math.sin(Date.now() * 0.005) * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath();
      ctx.arc(boss.x, boss.y, 8, 0, Math.PI * 2);
      ctx.fill();
      // Rotating arms
      for (let i = 0; i < 4; i++) {
        const angle = boss.coreAngle + (i * Math.PI / 2);
        const ax = boss.x + Math.cos(angle) * 50;
        const ay = boss.y + Math.sin(angle) * 50;
        ctx.fillStyle = '#8866aa';
        ctx.fillRect(ax - 8, ay - 8, 16, 16);
        ctx.fillStyle = '#aa88cc';
        ctx.fillRect(ax - 4, ay - 4, 8, 8);
      }
      // Cannon
      ctx.fillStyle = '#443355';
      ctx.fillRect(boss.x - boss.w/2 - 20, boss.y - 5, 20, 10);
      // Glow
      ctx.fillStyle = `rgba(255, 100, 100, ${0.2 + Math.sin(Date.now() * 0.003) * 0.1})`;
      ctx.beginPath();
      ctx.arc(boss.x, boss.y, 40, 0, Math.PI * 2);
      ctx.fill();
    } else if (boss.name === 'CRYSTAL WYRM') {
      // Crystal dragon-like boss
      ctx.fillStyle = '#228888';
      // Body segments
      for (let i = 0; i < 5; i++) {
        const sx = boss.x - i * 18;
        const sy = boss.y + Math.sin(boss.coreAngle * 2 + i * 0.8) * 10;
        const sw = 30 - i * 3;
        const sh = 30 - i * 3;
        ctx.fillRect(sx - sw/2, sy - sh/2, sw, sh);
      }
      // Head
      ctx.fillStyle = '#44cccc';
      ctx.beginPath();
      ctx.arc(boss.x, boss.y, 20, 0, Math.PI * 2);
      ctx.fill();
      // Crystal crown
      for (let i = 0; i < 3; i++) {
        const cx = boss.x - 10 + i * 10;
        ctx.fillStyle = '#88eeff';
        ctx.beginPath();
        ctx.moveTo(cx, boss.y - 18);
        ctx.lineTo(cx - 5, boss.y - 8);
        ctx.lineTo(cx + 5, boss.y - 8);
        ctx.closePath();
        ctx.fill();
      }
      // Eyes
      ctx.fillStyle = '#ffff44';
      ctx.fillRect(boss.x - 8, boss.y - 4, 6, 6);
      ctx.fillRect(boss.x + 2, boss.y - 4, 6, 6);
      // Glow
      ctx.fillStyle = `rgba(68, 204, 255, ${0.15 + Math.sin(Date.now() * 0.004) * 0.1})`;
      ctx.beginPath();
      ctx.arc(boss.x, boss.y, 45, 0, Math.PI * 2);
      ctx.fill();
    } else if (boss.name === 'BIG CORE MK.I') {
      // Final boss - Big Core
      const coreImg = images.boss1;
      if (coreImg) {
        ctx.save();
        ctx.translate(boss.x, boss.y);
        ctx.rotate(boss.coreAngle * 0.5);
        ctx.drawImage(coreImg, -boss.w/2, -boss.h/2, boss.w, boss.h);
        ctx.restore();
      } else {
        // Main body
        ctx.fillStyle = '#882222';
        ctx.fillRect(boss.x - boss.w/2, boss.y - boss.h/2, boss.w, boss.h);
        // Armor
        ctx.fillStyle = '#aa3333';
        ctx.fillRect(boss.x - boss.w/2 + 5, boss.y - boss.h/2 + 5, boss.w - 10, boss.h - 10);
        // Core
        ctx.fillStyle = '#ff4400';
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, 18 + Math.sin(Date.now() * 0.005) * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, 4, 0, Math.PI * 2);
        ctx.fill();
        // Rotating cannons
        for (let i = 0; i < 6; i++) {
          const angle = boss.coreAngle + (i * Math.PI / 3);
          const cx = boss.x + Math.cos(angle) * 55;
          const cy = boss.y + Math.sin(angle) * 55;
          ctx.fillStyle = '#661111';
          ctx.fillRect(cx - 6, cy - 6, 12, 12);
          ctx.fillStyle = '#ff6600';
          ctx.fillRect(cx - 3, cy - 3, 6, 6);
        }
        // Energy field
        ctx.strokeStyle = `rgba(255, 100, 0, ${0.3 + Math.sin(Date.now() * 0.003) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, 60, 0, Math.PI * 2);
        ctx.stroke();
        // Laser indicator
        if (boss.patternTimer < 20) {
          ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
          ctx.fillRect(0, boss.y - 3, boss.x - boss.w/2, 6);
        }
      }
      // Intense glow
      ctx.fillStyle = `rgba(255, 50, 0, ${0.1 + Math.sin(Date.now() * 0.005) * 0.08})`;
      ctx.beginPath();
      ctx.arc(boss.x, boss.y, 70, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Generic boss fallback
      ctx.fillStyle = boss.color;
      ctx.fillRect(boss.x - boss.w/2, boss.y - boss.h/2, boss.w, boss.h);
      ctx.fillStyle = '#ff4444';
      ctx.beginPath();
      ctx.arc(boss.x, boss.y, boss.w/4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(boss.x - 15, boss.y - 10, 8, 8);
      ctx.fillRect(boss.x + 7, boss.y - 10, 8, 8);
    }
  }

  // ===== UPDATE FUNCTIONS =====
  function updateTitle() {
    game.stateTimer++;
    if (isConfirm() && game.stateTimer > 30) {
      game.state = STATE.PLAYER_SELECT;
      game.stateTimer = 0;
      game.selectCursor = 0;
      keys['Enter'] = false;
      keys['Space'] = false;
      touchState.a = false;
    }
  }

  function updatePlayerSelect() {
    game.stateTimer++;
    const prev = game.selectCursor;
    if (isLeft() && game.stateTimer > 10) {
      game.selectCursor = (game.selectCursor - 1 + 4) % 4;
      game.stateTimer = 0;
    }
    if (isRight() && game.stateTimer > 10) {
      game.selectCursor = (game.selectCursor + 1) % 4;
      game.stateTimer = 0;
    }
    if (isConfirm() && game.stateTimer > 15) {
      game.selectedChar = game.charKeys[game.selectCursor];
      game.reset();
      game.startStage(0);
      keys['Enter'] = false;
      keys['Space'] = false;
      touchState.a = false;
    }
  }

  function updateStageIntro() {
    game.stateTimer--;
    if (game.stateTimer <= 0) {
      game.state = STATE.PLAYING;
      game.stateTimer = 0;
    }
  }

  function updatePaused() {
    game.stateTimer++;
    if (isStart() && game.stateTimer > 15) {
      game.togglePause();
      game.stateTimer = 0;
      keys['Enter'] = false;
      keys['Escape'] = false;
      keys['KeyP'] = false;
    }
  }

  function updatePlayer() {
    const p = game.player;
    if (!p || p.dead) return;
    const ch = CHARACTERS[game.selectedChar];

    // Invincibility
    if (p.invincible > 0) p.invincible--;

    // Shoot cooldown
    if (p.shootCooldown > 0) p.shootCooldown--;

    // Special charge
    if (p.specialCharge < 100) p.specialCharge += 0.05;

    // Horizontal movement
    let moveSpeed = ch.speed;
    if (p.onIce) moveSpeed *= 1.5; // Ice = slidey

    if (isLeft()) {
      p.vx = Math.max(p.vx - (p.onIce ? 0.2 : 0.8), -moveSpeed);
      p.facing = -1;
    } else if (isRight()) {
      p.vx = Math.min(p.vx + (p.onIce ? 0.2 : 0.8), moveSpeed);
      p.facing = 1;
    } else {
      if (p.onIce) {
        p.vx *= 0.98;
      } else {
        p.vx *= 0.7;
      }
      if (Math.abs(p.vx) < 0.1) p.vx = 0;
    }

    // Conveyor belt effect
    if (p.onConveyor !== 0) {
      p.vx += p.onConveyor * 0.3;
    }

    // Jump
    if (isJump()) {
      if (p.onGround && !p.jumpHeld) {
        p.vy = ch.jumpPower;
        p.onGround = false;
        p.jumpHeld = true;
        playSound('jump', 0.4);
        spawnParticles(p.x + p.w/2, p.y + p.h, '#fff', 5, 2, 15);
      }
      // Variable jump height
      if (p.vy < 0 && p.jumpHeld) {
        p.vy -= 0.3;
      }
    } else {
      p.jumpHeld = false;
    }

    // Shoot
    if (isShoot() && p.shootCooldown <= 0) {
      p.shootCooldown = 12;
      game.playerBullets.push({
        x: p.x + (p.facing === 1 ? p.w : 0),
        y: p.y + p.h/2 - 3,
        vx: ch.shotSpeed * p.facing,
        vy: 0,
        damage: ch.shotDamage,
        color: ch.shotColor,
        size: 6,
        life: 60
      });
      playSound('strain2', 0.3);
      spawnParticles(p.x + (p.facing === 1 ? p.w + 5 : -5), p.y + p.h/2, ch.shotColor, 3, 3, 10);
    }

    // Special attack (Down + Shoot when charged)
    if (isDown() && isShoot() && p.specialCharge >= 100 && p.shootCooldown <= 0) {
      p.shootCooldown = 30;
      p.specialCharge = 0;
      // Fire special based on character
      if (game.selectedChar === 'fireboy') {
        // Flame Burst - spreads shots
        for (let a = -30; a <= 30; a += 15) {
          const rad = a * Math.PI / 180;
          game.playerBullets.push({
            x: p.x + p.w/2, y: p.y + p.h/2,
            vx: Math.cos(rad) * ch.shotSpeed * p.facing,
            vy: Math.sin(rad) * ch.shotSpeed,
            damage: 2, color: '#FF8800', size: 8, life: 30
          });
        }
        spawnParticles(p.x + p.w/2, p.y + p.h/2, '#FF4400', 20, 5, 20);
      } else if (game.selectedChar === 'caroline') {
        // Heart Beam - piercing shot
        game.playerBullets.push({
          x: p.x + p.w/2, y: p.y + p.h/2,
          vx: ch.shotSpeed * 2 * p.facing, vy: 0,
          damage: 3, color: '#FF66AA', size: 12, life: 90, piercing: true
        });
        spawnParticles(p.x + p.w/2, p.y + p.h/2, '#FF88CC', 15, 4, 20);
      } else if (game.selectedChar === 'butch') {
        // Power Slam - ground pound wave
        for (let i = 0; i < 8; i++) {
          game.playerBullets.push({
            x: p.x + p.w/2, y: CANVAS_H - TILE - 5,
            vx: (i - 3.5) * 2, vy: -3 - Math.random() * 2,
            damage: 3, color: '#44FF44', size: 10, life: 40
          });
        }
        game.screenShake = 15;
        spawnParticles(p.x + p.w/2, CANVAS_H - TILE, '#88FF88', 25, 6, 25);
      } else if (game.selectedChar === 'anabel') {
        // Star Storm - raining stars
        for (let i = 0; i < 12; i++) {
          game.playerBullets.push({
            x: Math.random() * CANVAS_W, y: -10,
            vx: (Math.random() - 0.5) * 2, vy: 4 + Math.random() * 3,
            damage: 2, color: '#DD88FF', size: 7, life: 80
          });
        }
        spawnParticles(p.x + p.w/2, p.y, '#FF88FF', 20, 5, 20);
      }
      playSound('impact', 0.5);
    }

    // Gravity
    p.vy += GRAVITY;
    if (p.vy > MAX_FALL) p.vy = MAX_FALL;

    // Move X
    p.x += p.vx;
    // Collision with platforms (X)
    p.onIce = false;
    p.onConveyor = 0;
    game.platforms.forEach(plat => {
      if (plat.fallen) return;
      if (p.x + p.w > plat.x && p.x < plat.x + plat.w) {
        // Not colliding horizontally if above/below
      }
    });

    // Wall boundaries
    if (p.x < 0) { p.x = 0; p.vx = 0; }
    if (p.x + p.w > CANVAS_W) { p.x = CANVAS_W - p.w; p.vx = 0; }

    // Move Y
    p.y += p.vy;
    p.onGround = false;

    // Collision with platforms (Y)
    const allPlatforms = [...game.platforms, ...game.gimmicks.filter(g => g.type === 'moving_platform').map(g => ({ x: g.x, y: g.y, w: g.w, h: g.h, type: 'moving', color: g.color, topColor: g.topColor, fallen: false }))];
    allPlatforms.forEach(plat => {
      if (plat.fallen) return;
      if (p.x + p.w > plat.x + 2 && p.x < plat.x + plat.w - 2) {
        // Landing on top
        if (p.vy >= 0 && p.y + p.h > plat.y && p.y + p.h < plat.y + plat.h + p.vy + 2) {
          p.y = plat.y - p.h;
          p.vy = 0;
          p.onGround = true;
          // Crumble platform
          if (plat.type === 'crumble' && !plat.crumbling) {
            plat.crumbling = true;
          }
        }
      }
    });

    // Conveyor belt collision
    game.gimmicks.forEach(g => {
      if (g.type === 'conveyor') {
        if (p.x + p.w > g.x && p.x < g.x + g.w && p.y + p.h >= g.y && p.y + p.h <= g.y + g.h + 5) {
          p.onConveyor = g.dir * g.speed;
        }
      }
      if (g.type === 'ice_patch') {
        if (p.x + p.w > g.x && p.x < g.x + g.w && p.y + p.h >= g.y && p.y + p.h <= g.y + g.h + p.h) {
          p.onIce = true;
        }
      }
      if (g.type === 'lava') {
        if (p.x + p.w > g.x && p.x < g.x + g.w && p.y + p.h >= g.y) {
          hurtPlayer(2);
        }
      }
      if (g.type === 'fire_trap' && g.active) {
        if (p.x + p.w > g.x && p.x < g.x + g.w && p.y + p.h > g.y && p.y < g.y + g.h) {
          hurtPlayer(1);
        }
      }
    });

    // Fall off screen - only kill if far below
    if (p.y > CANVAS_H + 100) {
      hurtPlayer(1);
      // Respawn at last safe position
      p.y = CANVAS_H - TILE - p.h - 10;
      p.vy = 0;
      p.x = Math.max(30, Math.min(p.x, CANVAS_W - 60));
    }

    // Animation
    p.animTimer++;
    if (p.animTimer > 8) {
      p.animTimer = 0;
      p.animFrame = (p.animFrame + 1) % 4;
    }
  }

  function hurtPlayer(damage) {
    const p = game.player;
    if (!p || p.dead || p.invincible > 0) return;
    p.hp -= damage;
    p.invincible = 60;
    game.screenShake = 8;
    playSound('hurt', 0.5);
    spawnParticles(p.x + p.w/2, p.y + p.h/2, '#ff0000', 10, 4, 20);
    if (p.hp <= 0) {
      killPlayer();
    }
  }

  function killPlayer() {
    const p = game.player;
    if (!p || p.dead) return;
    p.dead = true;
    p.deathTimer = 60;
    game.lives--;
    game.screenShake = 15;
    playSound('death', 0.6);
    spawnParticles(p.x + p.w/2, p.y + p.h/2, CHARACTERS[game.selectedChar].color, 30, 6, 30);
    if (game.lives <= 0) {
      setTimeout(() => {
        game.state = STATE.GAME_OVER;
        game.stateTimer = 0;
        stopMusic();
        playMusic(SOUNDS.gameOver);
      }, 1500);
    } else {
      setTimeout(() => {
        game.spawnPlayer();
      }, 1500);
    }
  }

  function updateEnemies() {
    game.enemies.forEach(e => {
      // Patrol movement
      e.x += e.vx;
      if (e.x <= e.patrolL || e.x + e.w >= e.patrolR) {
        e.vx *= -1;
      }

      // Gravity for ground enemies
      if (e.type !== 'bat') {
        e.vy = (e.vy || 0) + GRAVITY;
        if (e.vy > MAX_FALL) e.vy = MAX_FALL;
        e.y += e.vy;
        // Ground collision
        if (e.y + e.h >= CANVAS_H - TILE) {
          e.y = CANVAS_H - TILE - e.h;
          e.vy = 0;
        }
      } else {
        // Bat: floating sine wave
        e.y += Math.sin(Date.now() * 0.005 + e.x) * 0.8;
      }

      // Shoot timer
      e.shootTimer--;
      if (e.shootTimer <= 0) {
        e.shootTimer = 80 + Math.random() * 60;
        if (game.player && !game.player.dead) {
          const dx = game.player.x - e.x;
          const dy = game.player.y - e.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 400) {
            const spd = 3;
            game.enemyBullets.push({
              x: e.x + e.w/2,
              y: e.y + e.h/2,
              vx: (dx/dist) * spd,
              vy: (dy/dist) * spd,
              size: 5,
              color: '#ff4444',
              life: 120
            });
          }
        }
      }

      // Player collision
      if (game.player && !game.player.dead && game.player.invincible <= 0) {
        const p = game.player;
        if (p.x + p.w > e.x + 3 && p.x < e.x + e.w - 3 && p.y + p.h > e.y + 3 && p.y < e.y + e.h - 3) {
          hurtPlayer(1);
        }
      }

      // Animation
      e.animFrame = (e.animFrame + 0.1) % 2;
    });

    // Remove dead enemies
    game.enemies = game.enemies.filter(e => e.hp > 0);
  }

  function updateBoss() {
    const boss = game.boss;
    if (!boss) return;

    if (boss.defeated) {
      boss.defeatTimer--;
      game.screenShake = 5;
      spawnParticles(boss.x + Math.random() * 60 - 30, boss.y + Math.random() * 60 - 30, '#ffaa00', 5, 5, 15);
      if (boss.defeatTimer <= 0) {
        game.boss = null;
        game.state = STATE.STAGE_CLEAR;
        game.stateTimer = 180;
        stopMusic();
        playSound('stageClear', 0.6);
        game.score += 1000;
      }
      return;
    }

    boss.timer++;
    if (boss.invincible > 0) boss.invincible--;

    // Boss movement pattern
    const phase = boss.hp < boss.maxHp * 0.3 ? 2 : boss.hp < boss.maxHp * 0.6 ? 1 : 0;
    boss.phase = phase;

    // Move around
    const targetX = CANVAS_W - 120 + Math.sin(boss.timer * 0.02) * 100;
    const targetY = 150 + Math.sin(boss.timer * 0.015 + 1) * 100;
    boss.x += (targetX - boss.x) * 0.02;
    boss.y += (targetY - boss.y) * 0.02;

    // Attack patterns
    boss.patternTimer--;
    if (boss.patternTimer <= 0) {
      const attacks = boss.attacks;
      const atkIdx = Math.floor(Math.random() * attacks.length);
      const atk = attacks[atkIdx];
      boss.pattern = atkIdx;
      boss.patternTimer = atk.interval || 60;
      executeBossAttack(boss, atk, phase);
    }

    // Player collision
    if (game.player && !game.player.dead && game.player.invincible <= 0) {
      const p = game.player;
      if (p.x + p.w > boss.x - boss.w/2 && p.x < boss.x + boss.w/2 && p.y + p.h > boss.y - boss.h/2 && p.y < boss.y + boss.h/2) {
        hurtPlayer(2);
      }
    }
  }

  function executeBossAttack(boss, atk, phase) {
    const p = game.player;
    if (!p) return;
    const speed = (atk.speed || 4) + phase * 0.5;

    if (atk.type === 'aimed_shot') {
      const dx = p.x - boss.x;
      const dy = p.y - boss.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      game.enemyBullets.push({
        x: boss.x, y: boss.y,
        vx: (dx/dist) * speed, vy: (dy/dist) * speed,
        size: 6, color: '#ff4444', life: 120
      });
      if (phase >= 1) {
        game.enemyBullets.push({
          x: boss.x, y: boss.y,
          vx: (dx/dist) * speed * 0.8 + 1, vy: (dy/dist) * speed * 0.8 + 1,
          size: 5, color: '#ff8844', life: 120
        });
      }
    } else if (atk.type === 'sweep_laser' || atk.type === 'laser_sweep') {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        game.enemyBullets.push({
          x: boss.x, y: boss.y,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          size: 5, color: '#ff6666', life: 80
        });
      }
      if (phase >= 2) {
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
          game.enemyBullets.push({
            x: boss.x, y: boss.y,
            vx: Math.cos(angle) * speed * 0.7, vy: Math.sin(angle) * speed * 0.7,
            size: 4, color: '#ffaa44', life: 90
          });
        }
      }
      playSound('laser', 0.3);
    } else if (atk.type === 'homing_missile') {
      game.enemyBullets.push({
        x: boss.x, y: boss.y,
        vx: (p.x > boss.x ? 1 : -1) * 2, vy: 1,
        size: 8, color: '#ff8844', life: 180, homing: true, homingSpeed: speed * 0.6
      });
    } else if (atk.type === 'multi_shot') {
      for (let i = 0; i < (atk.count || 3) + phase; i++) {
        const angle = Math.PI + (i - (atk.count + phase - 1) / 2) * 0.3;
        game.enemyBullets.push({
          x: boss.x, y: boss.y,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          size: 5, color: '#ff4444', life: 100
        });
      }
    } else if (atk.type === 'crystal_rain') {
      const count = (atk.count || 5) + phase * 2;
      for (let i = 0; i < count; i++) {
        game.enemyBullets.push({
          x: Math.random() * CANVAS_W, y: -10,
          vx: (Math.random() - 0.5) * 2, vy: 3 + Math.random() * 2,
          size: 6, color: '#44ddff', life: 150
        });
      }
    } else if (atk.type === 'charge') {
      boss.vx = (p.x - boss.x) * 0.05;
      boss.vy = (p.y - boss.y) * 0.05;
    } else if (atk.type === 'ice_beam') {
      for (let i = 0; i < 10; i++) {
        game.enemyBullets.push({
          x: boss.x - i * 30, y: boss.y + Math.sin(i) * 5,
          vx: -speed, vy: Math.sin(i * 0.5) * 0.5,
          size: 4, color: '#88ddff', life: 60
        });
      }
    } else if (atk.type === 'core_beam') {
      for (let i = 0; i < 20; i++) {
        game.enemyBullets.push({
          x: boss.x - i * 20, y: boss.y,
          vx: -speed * 1.5, vy: Math.sin(i * 0.3) * 2,
          size: 8, color: '#ff2200', life: 80
        });
      }
      game.screenShake = 10;
      playSound('laser', 0.5);
    }
  }

  function updateBullets() {
    // Player bullets
    game.playerBullets.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      b.life--;

      // Hit enemies
      game.enemies.forEach(e => {
        if (b.x + b.size > e.x && b.x < e.x + e.w && b.y + b.size > e.y && b.y < e.y + e.h) {
          e.hp -= b.damage;
          if (!b.piercing) b.life = 0;
          playSound('strain', 0.2);
          spawnParticles(b.x, b.y, b.color, 5, 3, 10);
          if (e.hp <= 0) {
            game.score += 100;
            spawnParticles(e.x + e.w/2, e.y + e.h/2, e.color, 15, 5, 20);
            playSound('impact', 0.4);
          }
        }
      });

      // Hit boss
      if (game.boss && !game.boss.defeated && game.boss.invincible <= 0) {
        const b2 = game.boss;
        if (b.x + b.size > b2.x - b2.w/2 && b.x < b2.x + b2.w/2 && b.y + b.size > b2.y - b2.h/2 && b.y < b2.y + b2.h/2) {
          game.boss.hp -= b.damage;
          if (!b.piercing) b.life = 0;
          game.boss.invincible = 5;
          playSound('bossHit', 0.4);
          spawnParticles(b.x, b.y, '#ffff00', 5, 3, 10);
          if (game.boss.hp <= 0) {
            game.boss.defeated = true;
            game.boss.defeatTimer = 120;
            playSound('bossDefeat', 0.7);
            game.score += 5000;
          }
        }
      }
    });

    // Enemy bullets
    game.enemyBullets.forEach(b => {
      // Homing
      if (b.homing && game.player && !game.player.dead) {
        const dx = game.player.x - b.x;
        const dy = game.player.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > 0) {
          b.vx += (dx/dist) * 0.15;
          b.vy += (dy/dist) * 0.15;
          const spd = Math.sqrt(b.vx*b.vx + b.vy*b.vy);
          const maxSpd = b.homingSpeed || 4;
          if (spd > maxSpd) {
            b.vx = (b.vx/spd) * maxSpd;
            b.vy = (b.vy/spd) * maxSpd;
          }
        }
      }

      b.x += b.vx;
      b.y += b.vy;
      b.life--;

      // Hit player
      if (game.player && !game.player.dead) {
        const p = game.player;
        if (b.x + b.size > p.x && b.x < p.x + p.w && b.y + b.size > p.y && b.y < p.y + p.h) {
          hurtPlayer(1);
          b.life = 0;
        }
      }
    });

    // Cleanup
    game.playerBullets = game.playerBullets.filter(b => b.life > 0 && b.x > -20 && b.x < CANVAS_W + 20 && b.y > -20 && b.y < CANVAS_H + 20);
    game.enemyBullets = game.enemyBullets.filter(b => b.life > 0 && b.x > -20 && b.x < CANVAS_W + 20 && b.y > -20 && b.y < CANVAS_H + 20);
  }

  function updateGimmicks() {
    game.gimmicks.forEach(g => {
      if (g.type === 'moving_platform') {
        g.x += g.speed * g.dir;
        if (g.x <= g.startX || g.x + g.w >= g.endX) g.dir *= -1;
      }
      if (g.type === 'fire_trap') {
        g.timer++;
        if (g.timer >= g.interval) {
          g.active = !g.active;
          g.timer = 0;
          if (g.active) {
            spawnParticles(g.x + g.w/2, g.y, '#ff4400', 8, 3, 15);
          }
        }
      }
      if (g.type === 'conveyor') {
        // Visual animation handled in draw
        g.animOffset = (g.animOffset || 0) + g.speed * g.dir;
      }
    });

    // Crumbling platforms
    game.platforms.forEach(plat => {
      if (plat.crumbling && !plat.fallen) {
        plat.crumbleTimer--;
        if (plat.crumbleTimer <= 0) {
          plat.fallen = true;
          spawnParticles(plat.x + plat.w/2, plat.y, '#885544', 10, 3, 15);
        }
      }
    });
  }

  function updatePickups() {
    const p = game.player;
    if (!p || p.dead) return;
    game.pickups.forEach(pk => {
      if (pk.collected) return;
      if (p.x + p.w > pk.x && p.x < pk.x + 16 && p.y + p.h > pk.y && p.y < pk.y + 16) {
        pk.collected = true;
        if (pk.type === 'health') {
          p.hp = Math.min(p.hp + 1, p.maxHp);
          playSound('strain2', 0.3);
        } else if (pk.type === 'score') {
          game.score += 200;
          playSound('strain', 0.3);
        }
        spawnParticles(pk.x + 8, pk.y + 8, pk.type === 'health' ? '#44ff44' : '#ffff44', 10, 3, 15);
      }
    });
  }

  function checkBossTrigger() {
    if (game.boss) return;
    // When all enemies are defeated
    if (game.enemies.length === 0 && game.state === STATE.PLAYING) {
      game.spawnBoss();
    }
  }

  // ===== MAIN UPDATE =====
  function update() {
    switch (game.state) {
      case STATE.TITLE:
        updateTitle();
        break;
      case STATE.PLAYER_SELECT:
        updatePlayerSelect();
        break;
      case STATE.STAGE_INTRO:
        updateStageIntro();
        break;
      case STATE.PLAYING:
        if (isStart()) {
          game.togglePause();
          keys['Enter'] = false;
          keys['Escape'] = false;
          keys['KeyP'] = false;
          break;
        }
        updatePlayer();
        updateEnemies();
        updateBullets();
        updateGimmicks();
        updatePickups();
        updateParticles();
        updateStars();
        checkBossTrigger();
        // Screen shake decay
        if (game.screenShake > 0) game.screenShake *= 0.9;
        if (game.screenShake < 0.5) game.screenShake = 0;
        break;
      case STATE.PAUSED:
        updatePaused();
        break;
      case STATE.BOSS_WARNING:
        game.stateTimer--;
        updateStars();
        if (game.stateTimer <= 0) {
          game.state = STATE.BOSS_FIGHT;
          playMusic(STAGES[game.currentStage].musicFile);
        }
        break;
      case STATE.BOSS_FIGHT:
        if (isStart()) {
          game.togglePause();
          keys['Enter'] = false;
          keys['Escape'] = false;
          keys['KeyP'] = false;
          break;
        }
        updatePlayer();
        updateBoss();
        updateBullets();
        updateParticles();
        updateStars();
        if (game.screenShake > 0) game.screenShake *= 0.9;
        if (game.screenShake < 0.5) game.screenShake = 0;
        break;
      case STATE.STAGE_CLEAR:
        game.stateTimer--;
        updateParticles();
        updateStars();
        if (game.stateTimer <= 0) {
          if (game.currentStage < STAGES.length - 1) {
            game.startStage(game.currentStage + 1);
          } else {
            game.state = STATE.VICTORY;
            game.stateTimer = 0;
            stopMusic();
          }
        }
        break;
      case STATE.GAME_OVER:
        game.stateTimer++;
        if (isConfirm() && game.stateTimer > 120) {
          game.state = STATE.TITLE;
          game.stateTimer = 0;
          stopMusic();
          keys['Enter'] = false;
          keys['Space'] = false;
          touchState.a = false;
        }
        break;
      case STATE.VICTORY:
        game.stateTimer++;
        if (isConfirm() && game.stateTimer > 120) {
          game.state = STATE.TITLE;
          game.stateTimer = 0;
          stopMusic();
          keys['Enter'] = false;
          keys['Space'] = false;
          touchState.a = false;
        }
        break;
    }
  }

  // ===== DRAW FUNCTIONS =====
  function drawBackground(stage) {
    const s = stage || STAGES[game.currentStage];
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, s.bgColor1);
    grad.addColorStop(1, s.bgColor2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Draw space bg image if available
    if (images.bgSpace) {
      ctx.globalAlpha = 0.3;
      ctx.drawImage(images.bgSpace, 0, 0, CANVAS_W, CANVAS_H);
      ctx.globalAlpha = 1;
    }

    drawStars();
  }

  function drawTitle() {
    drawBackground(STAGES[0]);
    const pulse = Math.sin(Date.now() * 0.003) * 0.3 + 0.7;

    // Title
    drawText('FIREBOY THE BROTHERS', CANVAS_W/2, 120, 32, '#FF4422', 'center', true);
    drawText('THE LEGEND OF TERRA NEMESIS', CANVAS_W/2, 170, 24, '#FFAA00', 'center', true);

    // Subtitle
    drawText('- DEMO -', CANVAS_W/2, 220, 20, '#888', 'center', true);

    // Character silhouettes
    const chKeys = game.charKeys;
    const spacing = 140;
    const startX = CANVAS_W/2 - (spacing * 1.5);
    chKeys.forEach((key, i) => {
      const cx = startX + i * spacing;
      const ch = CHARACTERS[key];
      const bob = Math.sin(Date.now() * 0.003 + i * 1.5) * 5;
      drawCharSprite(key, cx - 25, 290 + bob, 50, 60, 1, 0);
      drawText(ch.name, cx, 370 + bob, 10, ch.color, 'center', false);
    });

    // Instructions
    if (Math.floor(Date.now() / 500) % 2) {
      drawText('PRESS ENTER OR TAP TO START', CANVAS_W/2, 460, 16, `rgba(255,255,255,${pulse})`, 'center', true);
    }

    drawText('Arrow Keys/WASD: Move  |  Space/Z: Jump  |  X/Shift: Shoot', CANVAS_W/2, 520, 11, '#666', 'center', false);
    drawText('Down+Shoot: Special Attack (when charged)', CANVAS_W/2, 545, 11, '#666', 'center', false);
    drawText('P/Enter/Esc: Pause', CANVAS_W/2, 570, 11, '#666', 'center', false);

    drawParticles();
  }

  function drawPlayerSelect() {
    drawBackground(STAGES[0]);

    drawText('SELECT YOUR CHARACTER', CANVAS_W/2, 50, 24, '#FFD700', 'center', true);

    const chKeys = game.charKeys;
    const spacing = 180;
    const startX = CANVAS_W/2 - (spacing * 1.5);

    chKeys.forEach((key, i) => {
      const cx = startX + i * spacing;
      const ch = CHARACTERS[key];
      const selected = i === game.selectCursor;
      const bob = selected ? Math.sin(Date.now() * 0.005) * 8 : 0;
      const scale = selected ? 1.1 : 0.85;

      // Selection highlight
      if (selected) {
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(cx - 65, 80, 130, 280);
        ctx.fillStyle = `rgba(${hexToRgb(ch.color)}, 0.1)`;
        ctx.fillRect(cx - 65, 80, 130, 280);
      }

      // Character
      const sprW = 50 * scale;
      const sprH = 60 * scale;
      drawCharSprite(key, cx - sprW/2, 120 + bob, sprW, sprH, 1, 0);

      // Name
      drawText(ch.name, cx, 210 + bob, selected ? 14 : 11, ch.color, 'center', true);

      // Stats
      if (selected) {
        drawText(`HP: ${ch.maxHp}`, cx, 240, 10, '#aaa', 'center', false);
        drawText(`SPD: ${ch.speed}`, cx, 255, 10, '#aaa', 'center', false);
        drawText(`JMP: ${Math.abs(ch.jumpPower)}`, cx, 270, 10, '#aaa', 'center', false);
        drawText(`DMG: ${ch.shotDamage}`, cx, 285, 10, '#aaa', 'center', false);
        drawText(ch.desc, cx, 310, 9, '#888', 'center', false);
        drawText(`Special: ${ch.special}`, cx, 325, 9, ch.accentColor, 'center', false);
      }
    });

    // Instructions
    const pulse = Math.sin(Date.now() * 0.004) * 0.3 + 0.7;
    drawText('◄ ► to select  |  ENTER to confirm', CANVAS_W/2, 420, 14, `rgba(255,255,255,${pulse})`, 'center', true);

    drawParticles();
  }

  function drawStageIntro() {
    const stage = STAGES[game.currentStage];
    drawBackground(stage);

    const progress = 1 - (game.stateTimer / 120);
    const alpha = progress < 0.2 ? progress * 5 : progress > 0.8 ? (1 - progress) * 5 : 1;
    ctx.globalAlpha = alpha;

    drawText(stage.subtitle, CANVAS_W/2, 200, 18, '#aaa', 'center', true);
    drawText(stage.name, CANVAS_W/2, 260, 32, '#FFD700', 'center', true);

    ctx.globalAlpha = 1;
  }

  function drawGame() {
    const stage = STAGES[game.currentStage];

    // Screen shake
    if (game.screenShake > 0) {
      ctx.save();
      ctx.translate(
        (Math.random() - 0.5) * game.screenShake * 2,
        (Math.random() - 0.5) * game.screenShake * 2
      );
    }

    drawBackground(stage);

    // Draw gimmicks (behind platforms)
    game.gimmicks.forEach(g => {
      if (g.type === 'lava') {
        const lavaGlow = Math.sin(Date.now() * 0.005 + g.x) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, ${Math.floor(50 * lavaGlow)}, 0, ${lavaGlow})`;
        ctx.fillRect(g.x, g.y, g.w, g.h);
        // Lava bubbles
        for (let i = 0; i < 3; i++) {
          const bx = g.x + ((Date.now() * 0.01 + i * 40 + g.x) % g.w);
          const by = g.y - Math.sin(Date.now() * 0.01 + i) * 5;
          ctx.fillStyle = '#ff6600';
          ctx.beginPath();
          ctx.arc(bx, by, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (g.type === 'ice_patch') {
        ctx.fillStyle = 'rgba(150, 220, 255, 0.4)';
        ctx.fillRect(g.x, g.y, g.w, g.h);
        // Ice sparkles
        ctx.fillStyle = 'rgba(200, 240, 255, 0.6)';
        for (let i = 0; i < g.w; i += 20) {
          if (Math.sin(i + Date.now() * 0.01) > 0.7) {
            ctx.fillRect(g.x + i, g.y + 2, 3, 3);
          }
        }
      }
    });

    // Draw platforms
    game.platforms.forEach(plat => {
      if (plat.fallen) return;
      const alpha = plat.crumbling ? (plat.crumbleTimer / 60) : 1;
      ctx.globalAlpha = alpha;
      // Shake crumbling platforms
      const ox = plat.crumbling ? (Math.random() - 0.5) * 4 : 0;
      ctx.fillStyle = plat.color;
      ctx.fillRect(plat.x + ox, plat.y, plat.w, plat.h);
      ctx.fillStyle = plat.topColor;
      ctx.fillRect(plat.x + ox, plat.y, plat.w, 4);
      // Surface detail
      ctx.fillStyle = `rgba(255,255,255,0.1)`;
      ctx.fillRect(plat.x + ox + 4, plat.y + 6, plat.w - 8, 2);
      ctx.globalAlpha = 1;
    });

    // Draw gimmicks (platforms)
    game.gimmicks.forEach(g => {
      if (g.type === 'moving_platform') {
        ctx.fillStyle = g.color;
        ctx.fillRect(g.x, g.y, g.w, g.h);
        ctx.fillStyle = g.topColor;
        ctx.fillRect(g.x, g.y, g.w, 3);
        // Arrows indicating movement
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        const arrowX = g.dir === 1 ? g.x + g.w - 10 : g.x + 2;
        ctx.fillRect(arrowX, g.y + 8, 8, 4);
      }
      if (g.type === 'conveyor') {
        ctx.fillStyle = g.color;
        ctx.fillRect(g.x, g.y, g.w, g.h);
        ctx.fillStyle = g.topColor;
        ctx.fillRect(g.x, g.y, g.w, 4);
        // Conveyor arrows
        const offset = (g.animOffset || 0) % 20;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for (let i = 0; i < g.w; i += 20) {
          const ax = g.x + i + (offset < 0 ? 20 + offset : offset);
          if (ax >= g.x && ax < g.x + g.w - 8) {
            ctx.fillRect(ax, g.y + 10, 8, 3);
            if (g.dir === 1) {
              ctx.fillRect(ax + 6, g.y + 8, 3, 6);
            } else {
              ctx.fillRect(ax, g.y + 8, 3, 6);
            }
          }
        }
      }
      if (g.type === 'fire_trap') {
        if (g.active) {
          const flameH = g.h * (0.8 + Math.sin(Date.now() * 0.02) * 0.2);
          ctx.fillStyle = '#ff4400';
          ctx.fillRect(g.x, g.y + g.h - flameH, g.w, flameH);
          ctx.fillStyle = '#ffaa00';
          ctx.fillRect(g.x + 3, g.y + g.h - flameH * 0.6, g.w - 6, flameH * 0.4);
          ctx.fillStyle = '#ffee88';
          ctx.fillRect(g.x + 6, g.y + g.h - flameH * 0.3, g.w - 12, flameH * 0.15);
        }
      }
    });

    // Draw pickups
    game.pickups.forEach(pk => {
      if (pk.collected) return;
      const bob = Math.sin(Date.now() * 0.005 + pk.x) * 3;
      if (pk.type === 'health') {
        ctx.fillStyle = '#44ff44';
        ctx.fillRect(pk.x + 3, pk.y + bob + 3, 10, 10);
        ctx.fillStyle = '#88ff88';
        ctx.fillRect(pk.x + 5, pk.y + bob + 5, 6, 6);
        // Plus sign
        ctx.fillStyle = '#fff';
        ctx.fillRect(pk.x + 6, pk.y + bob + 4, 2, 8);
        ctx.fillRect(pk.x + 4, pk.y + bob + 6, 6, 2);
      } else if (pk.type === 'score') {
        ctx.fillStyle = '#ffdd00';
        ctx.beginPath();
        ctx.arc(pk.x + 8, pk.y + 8 + bob, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('S', pk.x + 8, pk.y + 11 + bob);
      }
    });

    // Draw enemies
    game.enemies.forEach(e => {
      // Enemy body
      ctx.fillStyle = e.color;
      ctx.fillRect(e.x, e.y, e.w, e.h);
      // Eyes
      ctx.fillStyle = '#fff';
      const ex1 = e.vx > 0 ? e.x + e.w * 0.6 : e.x + e.w * 0.2;
      const ex2 = e.vx > 0 ? e.x + e.w * 0.75 : e.x + e.w * 0.35;
      ctx.fillRect(ex1, e.y + 8, 5, 5);
      ctx.fillRect(ex2, e.y + 8, 5, 5);
      ctx.fillStyle = '#000';
      ctx.fillRect(ex1 + 1, e.y + 10, 3, 3);
      ctx.fillRect(ex2 + 1, e.y + 10, 3, 3);
      // Type-specific details
      if (e.type === 'crystal_bug') {
        ctx.fillStyle = 'rgba(68, 204, 255, 0.5)';
        ctx.fillRect(e.x + 5, e.y + 18, 20, 8);
      } else if (e.type === 'bat') {
        // Wings
        const wingY = Math.sin(Date.now() * 0.01 + e.x) * 3;
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x - 8, e.y + 5 + wingY, 10, 15);
        ctx.fillRect(e.x + e.w - 2, e.y + 5 - wingY, 10, 15);
      } else if (e.type === 'forge_droid') {
        ctx.fillStyle = '#cc6600';
        ctx.fillRect(e.x + 8, e.y + 18, 14, 4);
        ctx.fillStyle = '#ff8800';
        if (Math.sin(Date.now() * 0.01) > 0) {
          ctx.fillRect(e.x + 10, e.y + 22, 3, 5);
        }
      }
      // HP indicator
      if (e.hp > 1) {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(e.x, e.y - 5, (e.hp / 4) * e.w, 3);
      }
    });

    // Draw player bullets
    game.playerBullets.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x + b.size/2, b.y + b.size/2, b.size/2, 0, Math.PI * 2);
      ctx.fill();
      // Trail
      ctx.fillStyle = `rgba(${hexToRgb(b.color)}, 0.4)`;
      ctx.beginPath();
      ctx.arc(b.x + b.size/2 - b.vx * 0.5, b.y + b.size/2 - b.vy * 0.5, b.size/2 * 0.7, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw enemy bullets
    game.enemyBullets.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size/2, 0, Math.PI * 2);
      ctx.fill();
      // Glow
      ctx.fillStyle = `rgba(${hexToRgb(b.color)}, 0.3)`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw player
    const p = game.player;
    if (p && !p.dead) {
      const ch = CHARACTERS[game.selectedChar];
      if (p.invincible > 0 && Math.floor(p.invincible / 3) % 2) {
        // Flashing when invincible
      } else {
        // Body
        drawCharSprite(game.selectedChar, p.x, p.y, p.w, p.h, p.facing, p.animFrame);
      }

      // Player special charge indicator
      if (p.specialCharge >= 100) {
        ctx.strokeStyle = ch.accentColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x + p.w/2, p.y + p.h/2, 22 + Math.sin(Date.now() * 0.01) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Draw boss
    if (game.boss) {
      const boss = game.boss;
      if (boss.defeated) {
        ctx.globalAlpha = boss.defeatTimer / 120;
      }
      drawBossSprite(boss);
      // Boss HP bar
      if (!boss.defeated) {
        const barW = 200;
        const barX = CANVAS_W/2 - barW/2;
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, 20, barW, 12);
        ctx.fillStyle = boss.hp > boss.maxHp * 0.3 ? '#44cc44' : '#ff4444';
        ctx.fillRect(barX, 20, barW * (boss.hp / boss.maxHp), 12);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, 20, barW, 12);
        drawText(boss.name, CANVAS_W/2, 16, 12, '#fff', 'center', true);
      }
      ctx.globalAlpha = 1;
    }

    drawParticles();

    // HUD
    drawHUD();

    if (game.screenShake > 0) {
      ctx.restore();
    }
  }

  function drawHUD() {
    const ch = CHARACTERS[game.selectedChar];
    const p = game.player;

    // HP
    if (p) {
      for (let i = 0; i < p.maxHp; i++) {
        const hx = 10 + i * 22;
        if (i < p.hp) {
          ctx.fillStyle = '#ff3333';
          ctx.fillRect(hx, 10, 18, 18);
          ctx.fillStyle = '#ff6666';
          ctx.fillRect(hx + 2, 12, 14, 6);
        } else {
          ctx.fillStyle = '#333';
          ctx.fillRect(hx, 10, 18, 18);
        }
      }

      // Special charge bar
      ctx.fillStyle = '#222';
      ctx.fillRect(10, 34, 100, 6);
      ctx.fillStyle = p.specialCharge >= 100 ? ch.accentColor : '#555';
      ctx.fillRect(10, 34, p.specialCharge, 6);
      if (p.specialCharge >= 100) {
        drawText('SPECIAL READY!', 60, 50, 8, ch.accentColor, 'center', false);
      }
    }

    // Score
    drawText(`SCORE: ${game.score}`, CANVAS_W - 10, 18, 14, '#FFD700', 'right', true);

    // Lives
    drawText(`LIVES: ${game.lives}`, CANVAS_W - 10, 38, 12, '#fff', 'right', false);

    // Stage
    const stage = STAGES[game.currentStage];
    drawText(stage.name, CANVAS_W/2, CANVAS_H - 15, 10, 'rgba(255,255,255,0.4)', 'center', false);
  }

  function drawPaused() {
    drawGame();
    // Overlay
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    drawText('PAUSED', CANVAS_W/2, CANVAS_H/2 - 20, 36, '#FFD700', 'center', true);
    drawText('Press P or Enter to resume', CANVAS_W/2, CANVAS_H/2 + 30, 14, '#aaa', 'center', false);
  }

  function drawBossWarning() {
    drawBackground(STAGES[game.currentStage]);
    const flash = Math.floor(game.stateTimer / 10) % 2;
    if (flash) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
    drawText('⚠ WARNING ⚠', CANVAS_W/2, CANVAS_H/2 - 40, 32, '#ff4444', 'center', true);
    if (game.boss) {
      drawText(game.boss.name, CANVAS_W/2, CANVAS_H/2 + 20, 24, '#FFD700', 'center', true);
    }
    drawText('APPROACHING', CANVAS_W/2, CANVAS_H/2 + 60, 16, '#ff8888', 'center', true);
  }

  function drawStageClear() {
    drawGame();
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    drawText('STAGE CLEAR!', CANVAS_W/2, CANVAS_H/2 - 20, 36, '#FFD700', 'center', true);
    drawText(`Score: ${game.score}`, CANVAS_W/2, CANVAS_H/2 + 30, 18, '#fff', 'center', true);
  }

  function drawGameOver() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    drawStars();
    updateStars();
    const alpha = Math.min(game.stateTimer / 60, 1);
    ctx.globalAlpha = alpha;
    drawText('GAME OVER', CANVAS_W/2, CANVAS_H/2 - 30, 42, '#ff4444', 'center', true);
    drawText(`Final Score: ${game.score}`, CANVAS_W/2, CANVAS_H/2 + 30, 18, '#FFD700', 'center', true);
    if (game.stateTimer > 120) {
      const pulse = Math.sin(Date.now() * 0.004) * 0.3 + 0.7;
      drawText('Press Enter to continue', CANVAS_W/2, CANVAS_H/2 + 80, 14, `rgba(255,255,255,${pulse})`, 'center', false);
    }
    ctx.globalAlpha = 1;
  }

  function drawVictory() {
    const t = Date.now() * 0.001;
    const grad = ctx.createRadialGradient(CANVAS_W/2, CANVAS_H/2, 0, CANVAS_W/2, CANVAS_H/2, 400);
    grad.addColorStop(0, '#1a0a3e');
    grad.addColorStop(1, '#000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    updateStars();
    drawStars();

    // Celebration particles
    if (game.stateTimer % 5 === 0) {
      const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff'];
      spawnParticles(Math.random() * CANVAS_W, Math.random() * CANVAS_H / 2, colors[Math.floor(Math.random() * colors.length)], 3, 4, 30);
    }
    updateParticles();
    drawParticles();

    const alpha = Math.min(game.stateTimer / 60, 1);
    ctx.globalAlpha = alpha;
    drawText('CONGRATULATIONS!', CANVAS_W/2, 100, 32, '#FFD700', 'center', true);
    drawText('THE LEGEND OF TERRA NEMESIS', CANVAS_W/2, 150, 20, '#FF8800', 'center', true);
    drawText('HAS BEEN DEFEATED!', CANVAS_W/2, 180, 20, '#FF8800', 'center', true);

    // Draw selected character
    const ch = CHARACTERS[game.selectedChar];
    const bob = Math.sin(t * 3) * 10;
    drawCharSprite(game.selectedChar, CANVAS_W/2 - 35, 230 + bob, 70, 85, 1, 0);
    drawText(ch.name, CANVAS_W/2, 340 + bob, 16, ch.color, 'center', true);

    drawText(`Final Score: ${game.score}`, CANVAS_W/2, 400, 22, '#FFD700', 'center', true);

    if (game.stateTimer > 120) {
      const pulse = Math.sin(t * 4) * 0.3 + 0.7;
      drawText('Press Enter to return to title', CANVAS_W/2, 480, 14, `rgba(255,255,255,${pulse})`, 'center', false);
    }
    ctx.globalAlpha = 1;
  }

  // ===== MAIN DRAW =====
  function draw() {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    switch (game.state) {
      case STATE.TITLE: drawTitle(); break;
      case STATE.PLAYER_SELECT: drawPlayerSelect(); break;
      case STATE.STAGE_INTRO: drawStageIntro(); break;
      case STATE.PLAYING: drawGame(); break;
      case STATE.PAUSED: drawPaused(); break;
      case STATE.BOSS_WARNING: drawBossWarning(); break;
      case STATE.BOSS_FIGHT: drawGame(); break;
      case STATE.STAGE_CLEAR: drawStageClear(); break;
      case STATE.GAME_OVER: drawGameOver(); break;
      case STATE.VICTORY: drawVictory(); break;
    }
  }

  // ===== UTILITY =====
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    }
    return '255, 255, 255';
  }

  // ===== GAME LOOP =====
  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  // ===== INITIALIZATION =====
  function init() {
    initStars();
    loadImages().then(() => {
      setupTouchControls();
      game.state = STATE.TITLE;
      game.stateTimer = 0;
      gameLoop();
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
