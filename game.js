/* =========================================================================
 * FIREBOY THE BROTHERS — The Legend of Terra Nemesis
 * BOSS RUSH MODE  ·  standalone HTML5 Canvas game (vanilla JS)
 *
 * Features:
 *   - 4 playable heroes (Fireboy, Caroline, Butch, Anabel) w/ unique fire + special
 *   - 7 boss stages, each with distinct attack patterns and a gimmick
 *   - Menus: Boss Rush, Stage Select, Time Attack, Options, Extra
 *   - Cutscenes between stages, boss WARNING banners
 *   - Touch controls (D-Pad, Fire, Special, Play/Pause)
 *   - Per-stage music + layered SFX, saved progress / best times
 * ========================================================================= */
(() => {
  "use strict";

  /* ----------------------------- constants ------------------------------ */
  const W = 800,
    H = 600;
  const PLAYER_MIN_X = 8,
    PLAYER_MAX_X = 470,
    PLAYER_MIN_Y = 70,
    PLAYER_MAX_Y = H - 8;

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  /* ----------------------------- DOM refs ------------------------------- */
  const $ = (id) => document.getElementById(id);
  const dom = {
    hud: $("hud"),
    touch: $("touch"),
    playerHealth: $("player-health"),
    bossHealth: $("boss-health"),
    hudPlayerName: $("hud-player-name"),
    hudBossName: $("hud-boss-name"),
    hudStage: $("hud-stage"),
    hudTimer: $("hud-timer"),
    hudScore: $("hud-score"),
    shieldPip: $("shield-pip"),
    warning: $("warning"),
    warningSub: $("warning-sub"),
    charGrid: $("char-grid"),
    stageGrid: $("stage-grid"),
    timeGrid: $("timeattack-grid"),
    extraBody: $("extra-body"),
    cutsceneImg: $("cutscene-img"),
    cutsceneName: $("cutscene-name"),
    cutsceneText: $("cutscene-text"),
    resultTitle: $("result-title"),
    resultText: $("result-text"),
    resultPrimary: $("result-primary"),
    tapGate: $("tap-gate"),
    stage: $("stage"),
  };
  const screens = {
    title: $("screen-title"),
    char: $("screen-char"),
    stageselect: $("screen-stageselect"),
    timeattack: $("screen-timeattack"),
    options: $("screen-options"),
    extra: $("screen-extra"),
    cutscene: $("screen-cutscene"),
    pause: $("screen-pause"),
    result: $("screen-result"),
  };

  /* ----------------------------- settings ------------------------------- */
  const SAVE_KEY = "fbtb_bossrush_save_v1";
  const settings = {
    musicVol: 0.55,
    sfxVol: 0.8,
    difficulty: "normal",
    touch: "auto",
    highestCleared: 0,
    bestTimes: {},
  };
  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) Object.assign(settings, JSON.parse(raw));
    } catch (e) {
      /* ignore corrupt save */
    }
  }
  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(settings));
    } catch (e) {
      /* ignore */
    }
  }

  /* ----------------------------- assets --------------------------------- */
  const IMG = {
    bg: "Background (Space).png",
    fg: "Foreground (Platform).png",
    fireboy: "Fireboy (Playable Characters).png",
    caroline: "Caroline (Playable Characters).png",
    butch: "Butch (Playable Characters).png",
    anabel: "Anabel (Playable Characters).png",
    bigcore: "Big Core MK.I (Boss).png",
    firebreath: "Fire Breath (Boss).png",
    fakebutch: "Fake Butch (Boss).png",
    mandler: "Mandler from Terra Cresta (Boss).png",
    crusher: "Crusher-Bot MK.II (Boss).png",
    metalsonic: "Metal Sonic (Boss).png",
    knight: "Roaring Knight from Deltarune (Final Boss).png",
    roaringmetal:
      "Roaring Metal - Roaring Knight x Metal Sonic (True Final Boss).png",
    laser: "BigCore_Laser.png",
    bomb: "FireBreath_Bomb.png",
  };
  const images = {};
  function loadImages() {
    for (const key in IMG) {
      const img = new Image();
      img.src = IMG[key];
      images[key] = img;
    }
  }

  /* ----------------------------- audio ---------------------------------- */
  const MUSIC = {
    s1: "Double Trouble (Double Mecha Rocket - Big Core MK.I from Gradius x Fire Breath from Sonic 3) (Stage 1 Boss).mp3",
    s2: "Butch from Rowdyruff Boys (Stage 2 Boss).mp3",
    s5: "Metal Sonic (Stage 5 Boss).mp3",
    s7: "Roaring Metal - Roaring Knight x Metal Sonic (Stage 7 True Finale Boss).mp3",
    boss: "13 Last Evil [Boss Battle].mp3",
    gameover: "21. Game Over.mp3",
    clear: "23. Stage Clear.mp3",
  };
  const SFX = {
    shoot: "Player_FireShoot.wav",
    hit: "HitBoss.wav",
    hurt: "PlayerHurt.wav",
    death: "PlayerDeath.wav",
    warning: "BossWarning.wav",
    explode: "BossDefeat_Explosion.wav",
    laser: "BigCore_Laser.wav",
    stomp: "CrusherBot_Stomp.wav",
    dash: "MSChargeFire.wav",
    fireball: "MSFireball.wav",
    jump: "Jump.wav",
    bossjump: "Boss_Jump.wav",
    impact: "Impact2.wav",
    transform: "Transform.wav",
    ring: "Move.wav",
    land: "Land.wav",
  };
  const Audio2 = {
    music: new Audio(),
    current: "",
    init() {
      this.music.loop = true;
      this.music.volume = settings.musicVol;
    },
    playMusic(src) {
      if (this.current === src && !this.music.paused) return;
      this.current = src;
      this.music.src = src;
      this.music.volume = settings.musicVol;
      this.music.currentTime = 0;
      this.music.play().catch(() => {});
    },
    resume() {
      this.music.play().catch(() => {});
    },
    pause() {
      this.music.pause();
    },
    stop() {
      this.music.pause();
      this.music.currentTime = 0;
      this.current = "";
    },
    setMusicVol(v) {
      settings.musicVol = v;
      this.music.volume = v;
    },
    sfx(key) {
      const src = SFX[key];
      if (!src || settings.sfxVol <= 0) return;
      const a = new Audio(src);
      a.volume = settings.sfxVol;
      a.play().catch(() => {});
    },
  };

  /* ----------------------------- characters ----------------------------- */
  const CHARACTERS = [
    {
      id: "fireboy",
      name: "Fireboy",
      img: "fireboy",
      color: "#ff5a1f",
      hp: 100,
      speed: 300,
      fireRate: 150,
      damage: 15,
      shot: "rapid",
      special: "burst",
      desc: "The blazing brother. Balanced stats and a rapid fire burst.",
      stats: { pow: 3, spd: 3, def: 3 },
    },
    {
      id: "caroline",
      name: "Caroline",
      img: "caroline",
      color: "#ff5fa2",
      hp: 90,
      speed: 360,
      fireRate: 220,
      damage: 12,
      shot: "spread",
      special: "nova",
      desc: "Energy blaster. Three-way spread and an 8-way nova special.",
      stats: { pow: 3, spd: 4, def: 2 },
    },
    {
      id: "butch",
      name: "Butch",
      img: "butch",
      color: "#e23b3b",
      hp: 120,
      speed: 240,
      fireRate: 300,
      damage: 26,
      shot: "heavy",
      special: "smash",
      desc: "Heavy hitter. Slow, huge shots and a devastating smash wave.",
      stats: { pow: 5, spd: 2, def: 5 },
    },
    {
      id: "anabel",
      name: "Anabel",
      img: "anabel",
      color: "#38b6ff",
      hp: 85,
      speed: 420,
      fireRate: 110,
      damage: 10,
      shot: "homing",
      special: "lockon",
      desc: "Precision shooter. Fast homing shots and a 5-lock barrage.",
      stats: { pow: 2, spd: 5, def: 2 },
    },
  ];

  /* ----------------------------- stages --------------------------------- */
  // Each boss: img(s) -> [{key, w, h, dx, dy}], hp, music, gimmick, patterns, color.
  const STAGES = [
    {
      id: 1,
      name: "Duo Mecha Rocket",
      boss: "Duo Mecha Rocket",
      origin: "Big Core MK.I × Fire Breath",
      music: "s1",
      color: "#7fd1ff",
      gimmick: "platforms",
      sprites: [
        { key: "bigcore", w: 180, h: 120, dx: 0, dy: 0 },
        { key: "firebreath", w: 96, h: 84, dx: -70, dy: 18 },
      ],
      hp: 220,
      interval: 1.7,
      patterns: ["laser", "fire", "laser", "combo"],
      warn: "A DUO MECHA ROCKET IS APPROACHING",
      intro: [
        {
          who: "narrator",
          text: "Terra Nemesis trembles. The Brothers launch into the void to end the menace once and for all.",
        },
        {
          who: "hero",
          text: "First target locked — a twin war machine! Let's light it up!",
        },
        { who: "boss", text: "TARGET ACQUIRED. INCINERATING INTRUDERS." },
      ],
      win: "Twin engines down — but that was only the warm-up.",
    },
    {
      id: 2,
      name: "Butch",
      boss: "Butch",
      origin: "Rowdyruff Boys",
      music: "s2",
      color: "#7bff8a",
      gimmick: "obstacles",
      sprites: [{ key: "fakebutch", w: 120, h: 158, dx: 0, dy: 0 }],
      hp: 250,
      interval: 1.6,
      patterns: ["charge", "punchwave", "charge", "combo2"],
      warn: "A RECKLESS BRAWLER CHARGES IN",
      intro: [
        {
          who: "boss",
          text: "Hah! You think you're tough? I'll smash you into scrap!",
        },
        {
          who: "hero",
          text: "All muscle, no aim. Stay sharp and break his guard.",
        },
      ],
      win: "Down goes the brawler. The signal points deeper into the nemesis.",
    },
    {
      id: 3,
      name: "Mandler",
      boss: "Mandler",
      origin: "Terra Cresta",
      music: "boss",
      color: "#ffd23f",
      gimmick: "gravity",
      sprites: [{ key: "mandler", w: 186, h: 136, dx: 0, dy: 0 }],
      hp: 280,
      interval: 1.5,
      patterns: ["ring", "spiral", "gravity", "ring"],
      warn: "AN ANCIENT FORTRESS AWAKENS",
      intro: [
        {
          who: "narrator",
          text: "A relic fortress hums to life, bending gravity itself around the arena.",
        },
        {
          who: "hero",
          text: "The floor keeps shifting... read the pull and keep moving!",
        },
      ],
      win: "Gravity stabilizes. The fortress falls silent.",
    },
    {
      id: 4,
      name: "Crusher-Bot MK.II",
      boss: "Crusher-Bot MK.II",
      origin: "Terra Nemesis Foundry",
      music: "boss",
      color: "#ff8a3c",
      gimmick: "shockwave",
      sprites: [{ key: "crusher", w: 208, h: 116, dx: 0, dy: 0 }],
      hp: 300,
      interval: 1.7,
      patterns: ["stomp", "missiles", "stomp", "missiles"],
      warn: "A WAR FOUNDRY UNIT DEPLOYS",
      intro: [
        {
          who: "boss",
          text: "CRUSH PROTOCOL ENGAGED. ALL THREATS WILL BE FLATTENED.",
        },
        {
          who: "hero",
          text: "Those stomps throw out shockwaves — keep your footing!",
        },
      ],
      win: "The foundry unit collapses in a heap of sparks.",
    },
    {
      id: 5,
      name: "Metal Sonic",
      boss: "Metal Sonic",
      origin: "Sonic Series",
      music: "s5",
      color: "#3a7bff",
      gimmick: "rings",
      sprites: [{ key: "metalsonic", w: 120, h: 120, dx: 0, dy: 0 }],
      hp: 280,
      interval: 1.4,
      patterns: ["dash", "homing", "dash", "spin"],
      warn: "A METALLIC SPEEDSTER INTERCEPTS",
      intro: [
        { who: "boss", text: "..." },
        {
          who: "hero",
          text: "He's fast! Grab the rings for a shield and don't blink.",
        },
      ],
      win: "The speedster sparks out — but a darker presence stirs ahead.",
    },
    {
      id: 6,
      name: "The Roaring Knight",
      boss: "Roaring Knight",
      origin: "Deltarune",
      music: "boss",
      color: "#c44dff",
      gimmick: "phases",
      sprites: [{ key: "knight", w: 150, h: 150, dx: 0, dy: 0 }],
      hp: 350,
      interval: 1.5,
      patterns: ["slash", "wave", "slash", "wave"],
      warn: "THE ROARING KNIGHT DESCENDS",
      intro: [
        {
          who: "narrator",
          text: "The finale. A knight wreathed in roaring light blocks the path to the heart of Terra Nemesis.",
        },
        {
          who: "boss",
          text: "Kneel, little flame. The roar of the end is upon you.",
        },
        {
          who: "hero",
          text: "Not today. We finish this — for everyone counting on us.",
        },
      ],
      win: "The Knight shatters... but its core fuses with fallen metal!",
    },
    {
      id: 7,
      name: "Roaring Metal",
      boss: "Roaring Metal",
      origin: "Roaring Knight × Metal Sonic",
      music: "s7",
      color: "#ff2e63",
      gimmick: "enrage",
      sprites: [{ key: "roaringmetal", w: 158, h: 200, dx: 0, dy: 0 }],
      hp: 500,
      interval: 1.4,
      patterns: ["combo", "dash", "ring", "stomp", "slash", "homing"],
      warn: "TRUE FINALE — ROARING METAL AWAKENS",
      intro: [
        {
          who: "boss",
          text: "KNIGHT AND MACHINE — NOW ONE. WITNESS THE TRUE NEMESIS.",
        },
        {
          who: "hero",
          text: "Everything we have, all at once. LEGEND OF TERRA NEMESIS — GO!",
        },
      ],
      win: "TERRA NEMESIS IS FREE. The legend of the Brothers echoes across the stars.",
    },
  ];

  /* ----------------------------- difficulty ----------------------------- */
  function diffMods() {
    switch (settings.difficulty) {
      case "easy":
        return { bossHp: 0.78, bossDmg: 0.7, interval: 1.2 };
      case "hard":
        return { bossHp: 1.3, bossDmg: 1.35, interval: 0.78 };
      default:
        return { bossHp: 1, bossDmg: 1, interval: 1 };
    }
  }

  /* ----------------------------- helpers -------------------------------- */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const rnd = (a, b) => a + Math.random() * (b - a);
  function overlap(a, b) {
    return (
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    );
  }
  function drawSprite(key, x, y, w, h, flip) {
    const img = images[key];
    if (img && img.complete && img.naturalWidth) {
      if (flip) {
        ctx.save();
        ctx.translate(x + w, y);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0, w, h);
        ctx.restore();
      } else {
        ctx.drawImage(img, x, y, w, h);
      }
    } else {
      ctx.fillStyle = "#555";
      ctx.fillRect(x, y, w, h);
    }
  }
  function fmtTime(ms) {
    const t = Math.max(0, ms);
    const m = Math.floor(t / 60000);
    const s = Math.floor((t % 60000) / 1000);
    const cs = Math.floor((t % 1000) / 10);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  }

  /* ----------------------------- game state ----------------------------- */
  const G = {
    state: "menu", // menu | cutscene | playing | paused | result
    mode: "rush", // rush | timeattack
    char: CHARACTERS[0],
    stageIndex: 0,
    score: 0,
    player: null,
    boss: null,
    pProj: [],
    bProj: [],
    fx: [],
    gimmicks: [],
    shake: 0,
    warmup: 0, // seconds remaining of pre-fight warning
    pull: null, // {cx,cy,strength,timer} gravity well
    gravShift: { dir: 0, timer: 0 },
    startTime: 0,
    elapsed: 0,
    bgScroll: 0,
    cutscene: null,
    cutIndex: 0,
    isTouch:
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches,
    audioUnlocked: false,
  };

  /* ----------------------------- input ---------------------------------- */
  const input = {
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false,
    special: false,
  };
  const keyMap = {
    ArrowUp: "up",
    KeyW: "up",
    ArrowDown: "down",
    KeyS: "down",
    ArrowLeft: "left",
    KeyA: "left",
    ArrowRight: "right",
    KeyD: "right",
    Space: "fire",
    KeyZ: "fire",
    KeyX: "special",
    KeyJ: "fire",
    KeyK: "special",
  };
  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyP" || e.code === "Escape") {
      e.preventDefault();
      onPauseKey();
      return;
    }
    if (G.state === "cutscene" && (e.code === "Space" || e.code === "Enter")) {
      e.preventDefault();
      advanceCutscene();
      return;
    }
    if (G.state === "cutscene" && e.code === "Escape") {
      e.preventDefault();
      endCutscene();
      return;
    }
    const k = keyMap[e.code];
    if (k) {
      input[k] = true;
      if (e.code === "Space") e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    const k = keyMap[e.code];
    if (k) input[k] = false;
  });

  function onPauseKey() {
    if (G.state === "playing") pauseGame();
    else if (G.state === "paused") resumeGame();
  }

  /* touch controls */
  function bindHold(el, on, off) {
    const start = (e) => {
      e.preventDefault();
      on();
      el.classList.add("held");
    };
    const end = (e) => {
      e.preventDefault();
      off();
      el.classList.remove("held");
    };
    el.addEventListener("touchstart", start, { passive: false });
    el.addEventListener("touchend", end, { passive: false });
    el.addEventListener("touchcancel", end, { passive: false });
    el.addEventListener("mousedown", start);
    el.addEventListener("mouseup", end);
    el.addEventListener("mouseleave", (e) => {
      if (el.classList.contains("held")) end(e);
    });
  }
  function setupTouch() {
    document.querySelectorAll("#dpad .pad").forEach((el) => {
      const dir = el.getAttribute("data-dir");
      bindHold(
        el,
        () => (input[dir] = true),
        () => (input[dir] = false),
      );
    });
    bindHold(
      $("btn-fire"),
      () => (input.fire = true),
      () => (input.fire = false),
    );
    bindHold(
      $("btn-special"),
      () => (input.special = true),
      () => (input.special = false),
    );
    $("btn-pause").addEventListener("click", (e) => {
      e.preventDefault();
      onPauseKey();
    });
  }

  /* ----------------------------- entities ------------------------------- */
  class Projectile {
    constructor(o) {
      Object.assign(
        this,
        {
          x: 0,
          y: 0,
          w: 10,
          h: 10,
          vx: 0,
          vy: 0,
          owner: "player",
          damage: 10,
          color: "#fff",
          shape: "rect",
          spriteKey: null,
          gravity: 0,
          life: 6000,
          homing: 0,
          target: null,
          rot: 0,
          rotSpeed: 0,
          delay: 0,
          dead: false,
          glow: true,
        },
        o,
      );
    }
    update(dt) {
      if (this.delay > 0) {
        this.delay -= dt * 1000;
        return;
      }
      if (this.homing && this.target) {
        const cx = this.target.x + (this.target.w || 0) / 2;
        const cy = this.target.y + (this.target.h || 0) / 2;
        const ang = Math.atan2(
          cy - (this.y + this.h / 2),
          cx - (this.x + this.w / 2),
        );
        const sp = Math.hypot(this.vx, this.vy) || 200;
        const cur = Math.atan2(this.vy, this.vx);
        let d = ang - cur;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        const na = cur + clamp(d, -this.homing * dt, this.homing * dt);
        this.vx = Math.cos(na) * sp;
        this.vy = Math.sin(na) * sp;
      }
      if (this.gravity) this.vy += this.gravity * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.rot += this.rotSpeed * dt;
      this.life -= dt * 1000;
      if (
        this.life <= 0 ||
        this.x < -120 ||
        this.x > W + 120 ||
        this.y < -160 ||
        this.y > H + 160
      )
        this.dead = true;
    }
    draw() {
      if (this.delay > 0) {
        // telegraph
        ctx.save();
        ctx.globalAlpha = 0.35 + 0.25 * Math.sin(performance.now() / 60);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y + this.h / 2 - 1, W, 2);
        ctx.restore();
        return;
      }
      ctx.save();
      if (this.glow) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
      }
      ctx.fillStyle = this.color;
      if (this.shape === "sprite" && this.spriteKey) {
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        ctx.rotate(this.rot);
        drawSprite(
          this.spriteKey,
          -this.w / 2,
          -this.h / 2,
          this.w,
          this.h,
          false,
        );
      } else if (this.shape === "circle") {
        ctx.beginPath();
        ctx.arc(
          this.x + this.w / 2,
          this.y + this.h / 2,
          this.w / 2,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      } else if (this.shape === "crescent") {
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        ctx.rotate(this.rot);
        ctx.beginPath();
        ctx.arc(0, 0, this.w / 2, Math.PI * 0.35, Math.PI * 1.65);
        ctx.lineWidth = 8;
        ctx.strokeStyle = this.color;
        ctx.stroke();
      } else if (this.shape === "beam") {
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.globalAlpha = 0.4;
        ctx.fillRect(this.x, this.y - 3, this.w, this.h + 6);
      } else {
        ctx.fillRect(this.x, this.y, this.w, this.h);
      }
      ctx.restore();
    }
  }

  class Player {
    constructor(charDef) {
      this.def = charDef;
      this.w = 48;
      this.h = 60;
      this.x = 90;
      this.y = H / 2 - this.h / 2;
      this.speed = charDef.speed;
      this.maxHp = charDef.hp;
      this.hp = charDef.hp;
      this.damage = charDef.damage;
      this.fireRate = charDef.fireRate;
      this.lastShot = 0;
      this.specialCd = 0;
      this.invuln = 0;
      this.shield = 0;
      this.hitFlash = 0;
      this.facing = 1;
    }
    update(dt, now) {
      let dx = 0,
        dy = 0;
      if (input.left) dx -= 1;
      if (input.right) dx += 1;
      if (input.up) dy -= 1;
      if (input.down) dy += 1;
      if (dx || dy) {
        const l = Math.hypot(dx, dy);
        dx /= l;
        dy /= l;
      }
      this.x += dx * this.speed * dt;
      this.y += dy * this.speed * dt;

      // gravity-shift gimmick drift
      if (G.gravShift.dir) this.y += G.gravShift.dir * 90 * dt;
      // gravity-well pull
      if (G.pull && G.pull.timer > 0) {
        const ang = Math.atan2(
          G.pull.cy - (this.y + this.h / 2),
          G.pull.cx - (this.x + this.w / 2),
        );
        this.x += Math.cos(ang) * G.pull.strength * dt;
        this.y += Math.sin(ang) * G.pull.strength * dt;
      }

      this.x = clamp(this.x, PLAYER_MIN_X, PLAYER_MAX_X);
      this.y = clamp(this.y, PLAYER_MIN_Y, PLAYER_MAX_Y - this.h);

      if (this.invuln > 0) this.invuln -= dt;
      if (this.shield > 0) this.shield -= dt;
      if (this.hitFlash > 0) this.hitFlash -= dt;
      if (this.specialCd > 0) this.specialCd -= dt;

      if (G.warmup <= 0) {
        if (input.fire && now - this.lastShot >= this.fireRate) {
          this.shoot();
          this.lastShot = now;
        }
        if (input.special && this.specialCd <= 0) {
          this.useSpecial();
          this.specialCd = 6;
        }
      }
      dom.shieldPip.classList.toggle("hidden", this.shield <= 0);
    }
    muzzle() {
      return { x: this.x + this.w, y: this.y + this.h / 2 };
    }
    shoot() {
      Audio2.sfx("shoot");
      const m = this.muzzle();
      const add = (vx, vy, opt) =>
        G.pProj.push(
          new Projectile(
            Object.assign(
              {
                x: m.x,
                y: m.y - 5,
                w: 18,
                h: 8,
                vx,
                vy,
                owner: "player",
                damage: this.damage,
                color: this.def.color,
              },
              opt,
            ),
          ),
        );
      switch (this.def.shot) {
        case "spread":
          add(560, -120, { w: 14, h: 8 });
          add(620, 0, { w: 14, h: 8 });
          add(560, 120, { w: 14, h: 8 });
          break;
        case "heavy":
          add(440, 0, { w: 30, h: 18, shape: "rect", color: "#ffb648" });
          break;
        case "homing":
          add(640, 0, {
            w: 14,
            h: 10,
            shape: "circle",
            homing: 4,
            target: G.boss,
            color: this.def.color,
          });
          break;
        default: // rapid
          add(700, 0, { w: 22, h: 8 });
      }
    }
    useSpecial() {
      Audio2.sfx("transform");
      const m = this.muzzle();
      const add = (vx, vy, opt) =>
        G.pProj.push(
          new Projectile(
            Object.assign(
              {
                x: m.x,
                y: m.y - 6,
                w: 16,
                h: 12,
                vx,
                vy,
                owner: "player",
                damage: this.damage,
                color: this.def.color,
              },
              opt,
            ),
          ),
        );
      switch (this.def.special) {
        case "nova":
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            add(Math.cos(a) * 420, Math.sin(a) * 420, {
              w: 16,
              h: 16,
              shape: "circle",
              damage: this.damage * 1.2,
            });
          }
          break;
        case "smash":
          add(360, 0, {
            w: 70,
            h: 70,
            shape: "circle",
            color: "#ffd23f",
            damage: this.damage * 3,
            life: 1400,
            glow: true,
          });
          G.shake = Math.max(G.shake, 10);
          break;
        case "lockon":
          for (let i = -2; i <= 2; i++)
            add(560 + Math.abs(i) * 20, i * 70, {
              w: 14,
              h: 12,
              shape: "circle",
              homing: 5,
              target: G.boss,
              damage: this.damage * 1.3,
            });
          break;
        default: // burst (fireboy)
          for (let i = -2; i <= 2; i++)
            add(640, i * 60, { w: 22, h: 10, damage: this.damage * 1.4 });
      }
      floatText(
        m.x,
        m.y - 30,
        this.def.special.toUpperCase() + "!",
        this.def.color,
      );
    }
    hurt(amt) {
      if (this.invuln > 0) return;
      if (this.shield > 0) {
        this.shield = 0;
        this.invuln = 0.6;
        Audio2.sfx("impact");
        flash(this.x, this.y, "#46e08a");
        return;
      }
      this.hp -= amt;
      this.invuln = 0.7;
      this.hitFlash = 0.25;
      Audio2.sfx("hurt");
      G.shake = Math.max(G.shake, 6);
      if (this.hp <= 0) {
        this.hp = 0;
        onPlayerDead();
      }
    }
    rect() {
      return { x: this.x + 8, y: this.y + 6, w: this.w - 16, h: this.h - 12 };
    }
    draw() {
      ctx.save();
      if (this.invuln > 0 && Math.floor(performance.now() / 70) % 2 === 0)
        ctx.globalAlpha = 0.4;
      if (this.shield > 0) {
        ctx.beginPath();
        ctx.arc(
          this.x + this.w / 2,
          this.y + this.h / 2,
          this.w * 0.8,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = "#46e08a";
        ctx.lineWidth = 3;
        ctx.globalAlpha *= 0.7;
        ctx.stroke();
        ctx.globalAlpha /= 0.7;
      }
      if (this.hitFlash > 0) {
        ctx.shadowBlur = 18;
        ctx.shadowColor = "#ff3b5c";
      }
      drawSprite(this.def.img, this.x, this.y, this.w, this.h, false);
      ctx.restore();
    }
  }

  class Boss {
    constructor(stage) {
      const m = diffMods();
      this.stage = stage;
      this.sprites = stage.sprites;
      this.w = stage.sprites[0].w;
      this.h = stage.sprites[0].h;
      this.homeX = W - this.w - 36;
      this.homeY = H / 2 - this.h / 2;
      this.x = W + 60;
      this.y = this.homeY;
      this.maxHp = Math.round(stage.hp * m.bossHp);
      this.hp = this.maxHp;
      this.dmgMul = m.bossDmg;
      this.interval = stage.interval * m.interval;
      this.patterns = stage.patterns.slice();
      this.pi = 0;
      this.attackTimer = 1.2;
      this.t = 0;
      this.action = null;
      this.invuln = 0;
      this.hitFlash = 0;
      this.phaseMarks = [0.75, 0.5, 0.25];
      this.enraged = false;
      this.bobAmp = 38;
      this.entering = true;
    }
    center() {
      return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
    }
    rect() {
      return {
        x: this.x + this.w * 0.12,
        y: this.y + this.h * 0.12,
        w: this.w * 0.76,
        h: this.h * 0.76,
      };
    }

    update(dt) {
      this.t += dt;
      if (this.hitFlash > 0) this.hitFlash -= dt;

      // entrance
      if (this.entering) {
        this.x += (this.homeX - this.x) * Math.min(1, dt * 4);
        if (Math.abs(this.x - this.homeX) < 2) {
          this.x = this.homeX;
          this.entering = false;
        }
        this.y = this.homeY + Math.sin(this.t * 1.1) * this.bobAmp;
        return;
      }
      if (G.warmup > 0) {
        this.y = this.homeY + Math.sin(this.t * 1.1) * this.bobAmp;
        return;
      }

      // phase transitions (stage 6/7) -> brief invuln + reposition
      if (this.stage.gimmick === "phases" || this.stage.gimmick === "enrage") {
        const ratio = this.hp / this.maxHp;
        if (this.phaseMarks.length && ratio <= this.phaseMarks[0]) {
          this.phaseMarks.shift();
          this.invuln = 1.1;
          this.action = null;
          Audio2.sfx("transform");
          flash(this.center().x, this.center().y, this.stage.color);
          G.shake = 8;
          this.homeY = rnd(80, H - this.h - 120);
          if (
            this.stage.gimmick === "enrage" &&
            !this.enraged &&
            ratio <= 0.5
          ) {
            this.enraged = true;
            this.interval *= 0.62;
            this.bobAmp = 60;
            showWarning("ENRAGED — FULL POWER UNLEASHED", 1.2);
          }
        }
      }

      if (this.invuln > 0) {
        this.invuln -= dt;
        this.x += (this.homeX - this.x) * Math.min(1, dt * 5);
        this.y = this.homeY + Math.sin(this.t * 1.6) * this.bobAmp;
        return;
      }

      if (this.action) {
        this.updateAction(dt);
      } else {
        // idle hover toward home
        this.x += (this.homeX - this.x) * Math.min(1, dt * 3);
        this.y = this.homeY + Math.sin(this.t * 1.1) * this.bobAmp;
        this.attackTimer -= dt;
        if (this.attackTimer <= 0) {
          this.pickAttack();
          this.attackTimer = this.interval;
        }
      }
    }

    pickAttack() {
      const key = this.patterns[this.pi % this.patterns.length];
      this.pi++;
      if (ACTIONS[key])
        this.action = {
          type: key,
          phase: "windup",
          timer: ACTIONS[key].windup,
          t: 0,
          data: {},
        };
      else if (VOLLEYS[key]) VOLLEYS[key](this);
    }

    updateAction(dt) {
      const a = this.action;
      const def = ACTIONS[a.type];
      a.timer -= dt;
      a.t += dt;
      def.run(this, a, dt);
      if (a.timer <= 0) {
        if (a.phase === "windup") {
          a.phase = "active";
          a.timer = def.active;
          if (def.onActive) def.onActive(this, a);
        } else if (a.phase === "active") {
          a.phase = "recover";
          a.timer = def.recover;
          if (def.onRecover) def.onRecover(this, a);
        } else {
          this.action = null;
        }
      }
    }

    hurt(amt) {
      if (this.invuln > 0 || this.entering || G.warmup > 0) return;
      this.hp -= amt;
      this.hitFlash = 0.08;
      if (this.hp <= 0) {
        this.hp = 0;
        onBossDead();
      }
    }

    draw() {
      ctx.save();
      const cx = this.x + this.w / 2,
        cy = this.y + this.h / 2;
      // windup telegraph
      if (this.action && this.action.phase === "windup") {
        ctx.globalAlpha = 0.5 + 0.5 * Math.sin(this.t * 30);
        ctx.shadowBlur = 26;
        ctx.shadowColor = this.stage.color;
      }
      if (this.invuln > 0) {
        ctx.globalAlpha = 0.45 + 0.3 * Math.sin(this.t * 22);
      }
      if (this.hitFlash > 0) {
        ctx.shadowBlur = 24;
        ctx.shadowColor = "#fff";
      }
      if (this.enraged) {
        ctx.shadowBlur = 22;
        ctx.shadowColor = "#ff2e63";
      }
      for (const s of this.sprites) {
        drawSprite(s.key, this.x + s.dx, this.y + s.dy, s.w, s.h, true);
      }
      ctx.restore();
      // hit flash overlay
      if (this.hitFlash > 0) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = "#fff";
        for (const s of this.sprites)
          ctx.fillRect(this.x + s.dx, this.y + s.dy, s.w, s.h);
        ctx.restore();
      }
      void cx;
      void cy;
    }
  }

  /* ----------------------- boss volley patterns ------------------------- */
  function bspawn(o) {
    G.bProj.push(
      new Projectile(Object.assign({ owner: "boss", color: "#ff4dd2" }, o)),
    );
  }
  function bossMouth(b) {
    return { x: b.x + 6, y: b.y + b.h / 2 };
  }

  const VOLLEYS = {
    laser(b) {
      Audio2.sfx("laser");
      const py = G.player ? G.player.y + G.player.h / 2 : b.y + b.h / 2;
      [-70, 0, 70].forEach((off, i) =>
        bspawn({
          x: b.x,
          y: py + off - 4,
          w: 60,
          h: 8,
          vx: -640,
          shape: "beam",
          color: "#7fd1ff",
          damage: 12 * b.dmgMul,
          delay: 220 + i * 60,
        }),
      );
    },
    fire(b) {
      Audio2.sfx("fireball");
      const m = bossMouth(b);
      for (let i = 0; i < 6; i++)
        bspawn({
          x: m.x,
          y: m.y,
          w: 18,
          h: 22,
          vx: rnd(-260, -360),
          vy: rnd(-140, 60),
          gravity: 220,
          shape: "sprite",
          spriteKey: "bomb",
          color: "#ff8a3c",
          damage: 10 * b.dmgMul,
          rotSpeed: 6,
        });
    },
    combo(b) {
      VOLLEYS.laser(b);
      setTimeout(() => {
        if (G.boss === b && G.state === "playing") VOLLEYS.fire(b);
      }, 380);
    },
    punchwave(b) {
      Audio2.sfx("impact");
      const m = bossMouth(b);
      [-40, 0, 40].forEach((vy) =>
        bspawn({
          x: m.x,
          y: m.y - 8,
          w: 26,
          h: 26,
          vx: -320,
          vy,
          shape: "circle",
          color: "#7bff8a",
          damage: 12 * b.dmgMul,
        }),
      );
    },
    combo2(b) {
      const m = bossMouth(b);
      for (let i = 0; i < 5; i++)
        bspawn({
          x: m.x,
          y: m.y,
          w: 20,
          h: 20,
          vx: -300 - i * 20,
          vy: (i - 2) * 70,
          shape: "circle",
          color: "#7bff8a",
          damage: 11 * b.dmgMul,
        });
    },
    ring(b) {
      Audio2.sfx("laser");
      const c = b.center();
      const n = 14,
        base = Math.random() * Math.PI;
      for (let i = 0; i < n; i++) {
        const a = base + (i / n) * Math.PI * 2;
        bspawn({
          x: c.x,
          y: c.y,
          w: 16,
          h: 16,
          vx: Math.cos(a) * 240,
          vy: Math.sin(a) * 240,
          shape: "circle",
          color: "#ffd23f",
          damage: 10 * b.dmgMul,
        });
      }
    },
    missiles(b) {
      Audio2.sfx("fireball");
      const m = bossMouth(b);
      for (let i = 0; i < 5; i++)
        bspawn({
          x: m.x,
          y: b.y + 20 + i * 18,
          w: 22,
          h: 12,
          vx: -260,
          vy: 0,
          shape: "rect",
          color: "#ff8a3c",
          damage: 11 * b.dmgMul,
          homing: 1.4,
          target: G.player,
        });
    },
    homing(b) {
      Audio2.sfx("fireball");
      const m = bossMouth(b);
      for (let i = -1; i <= 1; i++)
        bspawn({
          x: m.x,
          y: m.y + i * 22,
          w: 18,
          h: 18,
          vx: -300,
          vy: i * 60,
          shape: "circle",
          color: "#3a7bff",
          damage: 12 * b.dmgMul,
          homing: 2.4,
          target: G.player,
        });
    },
    wave(b) {
      Audio2.sfx("impact");
      const m = bossMouth(b);
      bspawn({
        x: m.x - 30,
        y: m.y - 45,
        w: 40,
        h: 90,
        vx: -260,
        shape: "rect",
        color: "#c44dff",
        damage: 16 * b.dmgMul,
      });
    },
  };

  /* ----------------------- boss action patterns ------------------------- */
  const ACTIONS = {
    charge: {
      windup: 0.6,
      active: 0.85,
      recover: 0.7,
      run(b, a) {
        if (a.phase === "active") {
          if (!a.data.go) {
            a.data.go = true;
            Audio2.sfx("bossjump");
          }
          const ty = G.player ? G.player.y : b.y;
          b.y += (ty - b.y) * Math.min(1, 6 * (1 / 60));
          b.x -= 1100 * (1 / 60);
          if (b.x < 60) a.timer = Math.min(a.timer, 0);
        } else if (a.phase === "recover") {
          b.x += (b.homeX - b.x) * Math.min(1, 5 * (1 / 60));
          b.y += (b.homeY - b.y) * Math.min(1, 5 * (1 / 60));
        }
      },
    },
    spiral: {
      windup: 0.3,
      active: 1.6,
      recover: 0.3,
      run(b, a) {
        if (a.phase !== "active") return;
        a.data.acc = (a.data.acc || 0) + 1 / 60;
        a.data.ang = (a.data.ang || 0) + 5 * (1 / 60);
        if (a.data.acc >= 0.08) {
          a.data.acc = 0;
          const c = b.center();
          for (let k = 0; k < 2; k++) {
            const ang = a.data.ang + k * Math.PI;
            bspawn({
              x: c.x,
              y: c.y,
              w: 14,
              h: 14,
              vx: Math.cos(ang) * 230,
              vy: Math.sin(ang) * 230,
              shape: "circle",
              color: "#ffd23f",
              damage: 9 * b.dmgMul,
            });
          }
        }
      },
      onActive() {
        Audio2.sfx("laser");
      },
    },
    gravity: {
      windup: 0.3,
      active: 2.5,
      recover: 0.3,
      run(b, a) {
        if (a.phase === "active") {
          const c = b.center();
          G.pull = { cx: c.x, cy: c.y, strength: 120, timer: 0.1 };
        }
      },
      onActive(b) {
        Audio2.sfx("dash");
        showWarning("GRAVITY WELL", 0.9);
        void b;
      },
    },
    stomp: {
      windup: 0.5,
      active: 0.28,
      recover: 0.6,
      run(b, a) {
        if (a.phase === "windup") {
          b.y += (b.homeY - 120 - b.y) * Math.min(1, 6 * (1 / 60));
        } else if (a.phase === "active") {
          b.y += 1500 * (1 / 60);
          if (b.y > b.homeY + 70) {
            b.y = b.homeY + 70;
            a.timer = Math.min(a.timer, 0);
          }
        } else {
          b.y += (b.homeY - b.y) * Math.min(1, 4 * (1 / 60));
        }
      },
      onActive() {
        Audio2.sfx("bossjump");
      },
      onRecover(b) {
        Audio2.sfx("stomp");
        G.shake = 14;
        // ground shockwave that pushes player
        G.fx.push({
          type: "shock",
          x: b.center().x,
          y: b.y + b.h,
          r: 10,
          max: 520,
          color: b.stage.color,
          dmg: 12 * b.dmgMul,
          hit: false,
        });
      },
    },
    dash: {
      windup: 0.5,
      active: 0.55,
      recover: 0.45,
      run(b, a) {
        if (a.phase === "windup") {
          if (G.player) b.y += (G.player.y - b.y) * Math.min(1, 6 * (1 / 60));
        } else if (a.phase === "active") {
          if (!a.data.go) {
            a.data.go = true;
            Audio2.sfx("dash");
            a.data.dir = -1;
          }
          b.x += a.data.dir * 1400 * (1 / 60);
          if (b.x < -b.w) {
            a.data.dir = 1;
          }
          if (a.data.dir === 1 && b.x >= b.homeX) {
            b.x = b.homeX;
            a.timer = Math.min(a.timer, 0);
          }
        } else {
          b.x += (b.homeX - b.x) * Math.min(1, 6 * (1 / 60));
        }
      },
    },
    spin: {
      windup: 0.4,
      active: 1.2,
      recover: 0.4,
      run(b, a) {
        if (a.phase !== "active") return;
        if (G.player) {
          const c = b.center();
          const ang = Math.atan2(G.player.y - c.y, G.player.x - c.x);
          b.x += Math.cos(ang) * 120 * (1 / 60);
          b.y += Math.sin(ang) * 120 * (1 / 60);
        }
        a.data.acc = (a.data.acc || 0) + 1 / 60;
        if (a.data.acc >= 0.18) {
          a.data.acc = 0;
          const c = b.center();
          for (let i = 0; i < 8; i++) {
            const ang = (i / 8) * Math.PI * 2 + b.t * 3;
            bspawn({
              x: c.x,
              y: c.y,
              w: 12,
              h: 12,
              vx: Math.cos(ang) * 260,
              vy: Math.sin(ang) * 260,
              shape: "circle",
              color: "#3a7bff",
              damage: 9 * b.dmgMul,
            });
          }
        }
      },
      onActive() {
        Audio2.sfx("dash");
      },
    },
    slash: {
      windup: 0.5,
      active: 0.4,
      recover: 0.5,
      run(b, a) {
        if (a.phase === "active" && !a.data.go) {
          a.data.go = true;
          Audio2.sfx("impact");
          const m = bossMouth(b);
          bspawn({
            x: m.x - 40,
            y: m.y - 50,
            w: 100,
            h: 100,
            vx: -360,
            shape: "crescent",
            color: "#c44dff",
            damage: 16 * b.dmgMul,
            rotSpeed: 4,
          });
          if (G.player) {
            const ty = G.player.y;
            b.y += (ty - b.y) * 0.5;
          }
        } else if (a.phase === "recover") {
          b.y += (b.homeY - b.y) * Math.min(1, 5 * (1 / 60));
        }
      },
      onActive() {
        Audio2.sfx("bossjump");
      },
    },
  };

  /* ----------------------------- effects -------------------------------- */
  function flash(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const a = Math.random() * Math.PI * 2,
        sp = rnd(60, 260);
      G.fx.push({
        type: "p",
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rnd(0.3, 0.7),
        max: 0.7,
        color,
        r: rnd(2, 5),
      });
    }
  }
  function bigExplosion(x, y, color) {
    for (let i = 0; i < 46; i++) {
      const a = Math.random() * Math.PI * 2,
        sp = rnd(80, 420);
      G.fx.push({
        type: "p",
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rnd(0.5, 1.4),
        max: 1.4,
        color: i % 3 ? color : "#fff",
        r: rnd(3, 8),
      });
    }
  }
  function floatText(x, y, text, color) {
    G.fx.push({ type: "text", x, y, text, color, life: 0.9, max: 0.9 });
  }

  function updateFx(dt) {
    for (const f of G.fx) {
      if (f.type === "p") {
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.vy += 240 * dt;
        f.life -= dt;
      } else if (f.type === "text") {
        f.y -= 30 * dt;
        f.life -= dt;
      } else if (f.type === "shock") {
        f.r += 900 * dt;
        if (!f.hit && G.player) {
          const c = G.player;
          const d = Math.hypot(c.x + c.w / 2 - f.x, c.y + c.h / 2 - f.y);
          if (Math.abs(d - f.r) < 40) {
            f.hit = true;
            c.hurt(f.dmg);
            const ang = Math.atan2(c.y + c.h / 2 - f.y, c.x + c.w / 2 - f.x);
            c.x += Math.cos(ang) * 60;
            c.y += Math.sin(ang) * 30;
          }
        }
        if (f.r >= f.max) f.life = 0;
        else f.life = 1;
      }
    }
    G.fx = G.fx.filter((f) => f.life > 0);
  }
  function drawFx() {
    for (const f of G.fx) {
      if (f.type === "p") {
        ctx.globalAlpha = clamp(f.life / f.max, 0, 1);
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (f.type === "text") {
        ctx.globalAlpha = clamp(f.life / f.max, 0, 1);
        ctx.fillStyle = f.color;
        ctx.font = "bold 22px Trebuchet MS";
        ctx.textAlign = "center";
        ctx.fillText(f.text, f.x, f.y);
        ctx.textAlign = "left";
      } else if (f.type === "shock") {
        ctx.globalAlpha = clamp(1 - f.r / f.max, 0, 1);
        ctx.strokeStyle = f.color;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, Math.PI, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ----------------------------- gimmicks ------------------------------- */
  function initGimmicks(stage) {
    G.gimmicks = [];
    G.pull = null;
    G.gravShift = { dir: 0, timer: 4 };
    if (stage.gimmick === "platforms") {
      for (let i = 0; i < 3; i++)
        G.gimmicks.push({
          kind: "platform",
          x: rnd(300, 520),
          y: rnd(120, 460),
          w: 90,
          h: 16,
          vy: rnd(40, 80) * (i % 2 ? 1 : -1),
          on: true,
          toggle: rnd(2, 4),
        });
    } else if (stage.gimmick === "obstacles") {
      for (let i = 0; i < 3; i++)
        G.gimmicks.push({
          kind: "obstacle",
          x: 360,
          y: 120 + i * 150,
          w: 36,
          h: 90,
          hp: 60,
          maxHp: 60,
          alive: true,
          respawn: 0,
        });
    } else if (stage.gimmick === "rings") {
      G.gimmicks.push({ kind: "ringspawner", timer: 2 });
    }
  }
  function updateGimmicks(dt, stage) {
    if (stage.gimmick === "gravity") {
      G.gravShift.timer -= dt;
      if (G.gravShift.timer <= 0) {
        const opts = [0, 1, -1];
        G.gravShift.dir = opts[Math.floor(Math.random() * opts.length)];
        G.gravShift.timer = 5;
        if (G.gravShift.dir)
          showWarning(G.gravShift.dir > 0 ? "GRAVITY ↓" : "GRAVITY ↑", 0.8);
      }
    }
    for (const g of G.gimmicks) {
      if (g.kind === "platform") {
        g.y += g.vy * dt;
        if (g.y < 90 || g.y > 470) g.vy *= -1;
        g.toggle -= dt;
        if (g.toggle <= 0) {
          g.on = !g.on;
          g.toggle = rnd(2.5, 4);
        }
      } else if (g.kind === "obstacle") {
        if (!g.alive) {
          g.respawn -= dt;
          if (g.respawn <= 0) {
            g.alive = true;
            g.hp = g.maxHp;
          }
        }
      } else if (g.kind === "ringspawner") {
        g.timer -= dt;
        if (g.timer <= 0) {
          g.timer = rnd(3, 5);
          G.gimmicks.push({
            kind: "ring",
            x: rnd(120, 440),
            y: rnd(120, 460),
            w: 26,
            h: 26,
            life: 7,
            t: 0,
          });
        }
      } else if (g.kind === "ring") {
        g.t += dt;
        g.life -= dt;
        g.y += Math.sin(g.t * 3) * 0.4;
        if (g.life <= 0) g.dead = true;
        else if (G.player && overlap(g, G.player.rect())) {
          g.dead = true;
          G.player.shield = 6;
          Audio2.sfx("ring");
          floatText(g.x, g.y - 10, "SHIELD!", "#46e08a");
        }
      }
    }
    G.gimmicks = G.gimmicks.filter((g) => !g.dead);
  }
  function drawGimmicks() {
    for (const g of G.gimmicks) {
      if (g.kind === "platform" && g.on) {
        ctx.fillStyle = "rgba(120,200,255,0.25)";
        ctx.strokeStyle = "#7fd1ff";
        ctx.lineWidth = 2;
        ctx.fillRect(g.x, g.y, g.w, g.h);
        ctx.strokeRect(g.x, g.y, g.w, g.h);
      } else if (g.kind === "obstacle" && g.alive) {
        const f = g.hp / g.maxHp;
        ctx.fillStyle = `rgba(${180 + 60 * (1 - f)},${120 * f},60,0.9)`;
        ctx.fillRect(g.x, g.y, g.w, g.h);
        ctx.strokeStyle = "#3a2";
        ctx.strokeRect(g.x, g.y, g.w, g.h);
      } else if (g.kind === "ring") {
        ctx.save();
        ctx.globalAlpha = clamp(g.life, 0, 1);
        ctx.strokeStyle = "#ffd23f";
        ctx.lineWidth = 5;
        ctx.shadowBlur = 14;
        ctx.shadowColor = "#ffd23f";
        ctx.beginPath();
        ctx.arc(g.x + g.w / 2, g.y + g.h / 2, g.w / 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
  // returns true if projectile blocked by a gimmick
  function projectileHitsGimmick(p) {
    for (const g of G.gimmicks) {
      if (
        g.kind === "platform" &&
        g.on &&
        p.owner === "boss" &&
        overlap(p, g)
      ) {
        p.dead = true;
        return true;
      }
      if (
        g.kind === "obstacle" &&
        g.alive &&
        p.owner === "player" &&
        overlap(p, g)
      ) {
        g.hp -= p.damage;
        p.dead = true;
        if (g.hp <= 0) {
          g.alive = false;
          g.respawn = 5;
          flash(g.x + g.w / 2, g.y + g.h / 2, "#9c6");
        }
        return true;
      }
    }
    return false;
  }

  /* ----------------------------- flow ----------------------------------- */
  function showScreen(name) {
    for (const k in screens) screens[k].classList.toggle("active", k === name);
  }
  function hideAllScreens() {
    for (const k in screens) screens[k].classList.remove("active");
  }

  function setTouchVisible(on) {
    const show =
      on &&
      (settings.touch === "on" || (settings.touch === "auto" && G.isTouch));
    dom.touch.classList.toggle("hidden", !show);
  }

  function showWarning(text, secs) {
    dom.warningSub.textContent = text;
    dom.warning.querySelector(".warning-text").textContent =
      text === "WARNING" ? "WARNING" : "WARNING";
    dom.warning.classList.remove("hidden");
    clearTimeout(showWarning._t);
    showWarning._t = setTimeout(
      () => dom.warning.classList.add("hidden"),
      secs * 1000,
    );
  }

  /* ---- cutscenes ---- */
  function startCutscene(lines, onDone) {
    G.cutscene = { lines, onDone };
    G.cutIndex = 0;
    G.state = "cutscene";
    hideAllScreens();
    dom.hud.classList.add("hidden");
    setTouchVisible(false);
    showScreen("cutscene");
    renderCutscene();
  }
  function renderCutscene() {
    const line = G.cutscene.lines[G.cutIndex];
    if (!line) {
      endCutscene();
      return;
    }
    let name = "NARRATOR",
      imgKey = null;
    if (line.who === "hero") {
      name = G.char.name;
      imgKey = G.char.img;
    } else if (line.who === "boss") {
      name = STAGES[G.stageIndex].boss;
      imgKey = STAGES[G.stageIndex].sprites[0].key;
    }
    dom.cutsceneName.textContent = name;
    dom.cutsceneText.textContent = line.text;
    if (imgKey) {
      dom.cutsceneImg.src = IMG[imgKey];
      dom.cutsceneImg.style.display = "";
    } else {
      dom.cutsceneImg.removeAttribute("src");
      dom.cutsceneImg.style.display = "none";
    }
  }
  function advanceCutscene() {
    if (!G.cutscene) return;
    G.cutIndex++;
    if (G.cutIndex >= G.cutscene.lines.length) endCutscene();
    else renderCutscene();
  }
  function endCutscene() {
    const done = G.cutscene && G.cutscene.onDone;
    G.cutscene = null;
    if (done) done();
  }
  screens.cutscene.addEventListener("click", advanceCutscene);

  /* ---- start / stages ---- */
  function startRun(mode, stageIndex) {
    G.mode = mode;
    G.stageIndex = stageIndex;
    G.score = 0;
    if (mode === "rush" || mode === "stageselect") {
      G.mode = "rush";
      startCutscene(STAGES[stageIndex].intro, () => beginStage(stageIndex));
    } else {
      beginStage(stageIndex);
    }
  }

  function beginStage(index) {
    G.stageIndex = index;
    const stage = STAGES[index];
    G.player =
      G.player && G.mode === "rush" && index > 0
        ? G.player
        : new Player(G.char);
    // refill HP at each stage start
    G.player.hp = G.player.maxHp;
    G.player.invuln = 0;
    G.player.shield = 0;
    G.player.specialCd = 0;
    G.player.x = 90;
    G.player.y = H / 2 - G.player.h / 2;
    G.boss = new Boss(stage);
    G.pProj = [];
    G.bProj = [];
    G.fx = [];
    initGimmicks(stage);
    G.warmup = 1.9;
    G.shake = 0;
    G.state = "playing";
    G.startTime = performance.now();
    G.elapsed = 0;

    hideAllScreens();
    dom.hud.classList.remove("hidden");
    dom.hudPlayerName.textContent = G.char.name;
    dom.hudBossName.textContent = stage.boss;
    dom.hudStage.textContent = `STAGE ${stage.id} / 7`;
    dom.hudScore.textContent = `SCORE ${G.score}`;
    dom.hudTimer.classList.toggle("hidden", G.mode !== "timeattack");
    setTouchVisible(true);

    Audio2.playMusic(MUSIC[stage.music]);
    Audio2.sfx("warning");
    dom.warning.querySelector(".warning-text").textContent = "WARNING";
    dom.warningSub.textContent = stage.warn;
    dom.warning.classList.remove("hidden");
    clearTimeout(showWarning._t);
    showWarning._t = setTimeout(
      () => dom.warning.classList.add("hidden"),
      1800,
    );
  }

  function pauseGame() {
    if (G.state !== "playing") return;
    G.state = "paused";
    Audio2.pause();
    showScreen("pause");
    setTouchVisible(false);
  }
  function resumeGame() {
    if (G.state !== "paused") return;
    G.state = "playing";
    Audio2.resume();
    hideAllScreens();
    setTouchVisible(true);
    G.startTime = performance.now() - G.elapsed; // keep timer consistent
  }

  function onPlayerDead() {
    Audio2.sfx("death");
    bigExplosion(
      G.player.x + G.player.w / 2,
      G.player.y + G.player.h / 2,
      G.char.color,
    );
    G.state = "result";
    Audio2.playMusic(MUSIC.gameover);
    setTouchVisible(false);
    dom.resultTitle.textContent = "GAME OVER";
    dom.resultTitle.style.color = "#ff3b5c";
    dom.resultText.textContent = `You fell at Stage ${STAGES[G.stageIndex].id}: ${STAGES[G.stageIndex].boss}. Score ${G.score}.`;
    dom.resultPrimary.textContent = "RETRY STAGE";
    G.resultAction = "retry";
    setTimeout(() => showScreen("result"), 700);
  }

  function onBossDead() {
    const stage = STAGES[G.stageIndex];
    Audio2.sfx("explode");
    bigExplosion(G.boss.x + G.boss.w / 2, G.boss.y + G.boss.h / 2, stage.color);
    G.shake = 16;
    G.score += 1000 + Math.round(G.player.hp * 10);
    // record progress
    if (stage.id > settings.highestCleared) {
      settings.highestCleared = stage.id;
      persist();
    }

    if (G.mode === "timeattack") {
      G.elapsed = performance.now() - G.startTime;
      const key = "s" + stage.id;
      const prev = settings.bestTimes[key];
      let best = false;
      if (prev == null || G.elapsed < prev) {
        settings.bestTimes[key] = G.elapsed;
        persist();
        best = true;
      }
      G.state = "result";
      Audio2.playMusic(MUSIC.clear);
      setTouchVisible(false);
      dom.resultTitle.textContent = "STAGE CLEAR";
      dom.resultTitle.style.color = "#46e08a";
      dom.resultText.textContent = `Time ${fmtTime(G.elapsed)}${best ? " — NEW BEST!" : ""}  (Best ${fmtTime(settings.bestTimes[key])})`;
      dom.resultPrimary.textContent = "RETRY";
      G.resultAction = "retry";
      setTimeout(() => showScreen("result"), 700);
      return;
    }

    // rush mode
    G.state = "result";
    Audio2.playMusic(MUSIC.clear);
    setTouchVisible(false);
    const isLast = G.stageIndex >= STAGES.length - 1;
    setTimeout(() => {
      if (isLast) {
        // victory cutscene then result
        startCutscene(
          [
            { who: "boss", text: stage.win },
            { who: "hero", text: "It’s over. Terra Nemesis is free at last." },
            {
              who: "narrator",
              text:
                "CONGRATULATIONS! You cleared BOSS RUSH MODE with " +
                G.char.name +
                ". Final score: " +
                G.score +
                ".",
            },
          ],
          () => {
            G.state = "result";
            dom.resultTitle.textContent = "VICTORY!";
            dom.resultTitle.style.color = "#ffd23f";
            dom.resultText.textContent = `All 7 bosses defeated. Final score ${G.score}.`;
            dom.resultPrimary.textContent = "TO MENU";
            G.resultAction = "menu";
            showScreen("result");
          },
        );
      } else {
        dom.resultTitle.textContent = "STAGE CLEAR";
        dom.resultTitle.style.color = "#46e08a";
        dom.resultText.textContent = stage.win + `  ·  Score ${G.score}`;
        dom.resultPrimary.textContent = "NEXT STAGE";
        G.resultAction = "next";
        showScreen("result");
      }
    }, 800);
  }

  function toMenu() {
    G.state = "menu";
    G.player = null;
    G.boss = null;
    G.pProj = [];
    G.bProj = [];
    G.fx = [];
    G.gimmicks = [];
    dom.hud.classList.add("hidden");
    setTouchVisible(false);
    Audio2.stop();
    buildStageGrid();
    buildTimeGrid();
    showScreen("title");
  }

  /* ----------------------------- collisions ----------------------------- */
  function handleCollisions() {
    const boss = G.boss,
      player = G.player;
    // player projectiles
    for (const p of G.pProj) {
      if (p.dead || p.delay > 0) continue;
      if (projectileHitsGimmick(p)) continue;
      if (
        boss &&
        boss.invuln <= 0 &&
        !boss.entering &&
        G.warmup <= 0 &&
        overlap(p, boss.rect())
      ) {
        boss.hurt(p.damage);
        Audio2.sfx("hit");
        flash(p.x, p.y, "#fff");
        if (p.shape !== "circle" || p.w < 40) p.dead = true; // big special orbs pierce
        G.score += 10;
        dom.hudScore.textContent = `SCORE ${G.score}`;
      }
    }
    // boss projectiles vs player + gimmicks
    for (const p of G.bProj) {
      if (p.dead || p.delay > 0) continue;
      if (projectileHitsGimmick(p)) continue;
      if (player && overlap(p, player.rect())) {
        player.hurt(p.damage);
        p.dead = true;
      }
    }
    // contact damage (boss body / dashing)
    if (
      boss &&
      player &&
      boss.invuln <= 0 &&
      !boss.entering &&
      G.warmup <= 0 &&
      overlap(player.rect(), boss.rect())
    ) {
      player.hurt(
        boss.action &&
          (boss.action.type === "charge" || boss.action.type === "dash")
          ? 18 * boss.dmgMul
          : 8 * boss.dmgMul,
      );
    }
  }

  /* ----------------------------- main loop ------------------------------ */
  let lastT = performance.now();
  function frame(now) {
    let dt = (now - lastT) / 1000;
    lastT = now;
    if (dt > 0.05) dt = 0.05; // clamp big gaps

    if (G.state === "playing") {
      update(dt, now);
    }
    render();
    requestAnimationFrame(frame);
  }

  function update(dt, now) {
    const stage = STAGES[G.stageIndex];
    if (G.warmup > 0) G.warmup -= dt;
    if (G.mode === "timeattack" && G.warmup <= 0) {
      G.elapsed = now - G.startTime;
      dom.hudTimer.textContent = fmtTime(G.elapsed);
    }
    G.bgScroll = (G.bgScroll + dt * 40) % W;

    G.player.update(dt, now);
    if (G.boss) G.boss.update(dt);
    updateGimmicks(dt, stage);

    for (const p of G.pProj) p.update(dt);
    for (const p of G.bProj) p.update(dt);
    G.pProj = G.pProj.filter((p) => !p.dead);
    G.bProj = G.bProj.filter((p) => !p.dead);

    handleCollisions();
    updateFx(dt);

    if (G.pull && G.pull.timer > 0) {
      G.pull.timer -= dt;
      if (G.pull.timer <= 0) G.pull = null;
    }
    if (G.shake > 0) G.shake = Math.max(0, G.shake - dt * 40);

    // HUD bars
    dom.playerHealth.style.width = `${clamp((G.player.hp / G.player.maxHp) * 100, 0, 100)}%`;
    if (G.boss)
      dom.bossHealth.style.width = `${clamp((G.boss.hp / G.boss.maxHp) * 100, 0, 100)}%`;
  }

  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (G.shake > 0)
      ctx.translate(rnd(-G.shake, G.shake), rnd(-G.shake, G.shake));

    // background (scrolling)
    const bg = images.bg;
    if (bg && bg.complete && bg.naturalWidth) {
      ctx.drawImage(bg, -G.bgScroll, 0, W, H);
      ctx.drawImage(bg, W - G.bgScroll, 0, W, H);
    } else {
      ctx.fillStyle = "#0a0420";
      ctx.fillRect(0, 0, W, H);
    }
    // subtle stage tint
    if (G.state === "playing" || G.state === "paused" || G.state === "result") {
      const stage = STAGES[G.stageIndex];
      ctx.fillStyle = stage.color;
      ctx.globalAlpha = 0.06;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }

    if (G.boss || G.player) {
      drawGimmicks();
      for (const p of G.bProj) p.draw();
      if (G.boss) G.boss.draw();
      if (G.player) G.player.draw();
      for (const p of G.pProj) p.draw();
      drawFx();
      // gravity-shift indicator
      if (G.gravShift.dir && STAGES[G.stageIndex].gimmick === "gravity") {
        ctx.fillStyle = "rgba(255,210,63,0.5)";
        ctx.font = "bold 40px Trebuchet MS";
        ctx.textAlign = "center";
        ctx.fillText(
          G.gravShift.dir > 0 ? "↓↓↓" : "↑↑↑",
          W / 2,
          G.gravShift.dir > 0 ? 70 : H - 30,
        );
        ctx.textAlign = "left";
      }
    }
    ctx.restore();
  }

  /* ----------------------------- UI builders ---------------------------- */
  function buildCharGrid() {
    dom.charGrid.innerHTML = "";
    CHARACTERS.forEach((c) => {
      const card = document.createElement("div");
      card.className = "char-card";
      card.style.setProperty("--accent", c.color);
      const stat = (name, v) =>
        `<div class="stat"><span class="stat-name">${name}</span><span class="stat-bar"><i style="width:${v * 20}%"></i></span></div>`;
      card.innerHTML = `
      <div class="char-portrait"><img src="${IMG[c.img]}" alt="${c.name}"></div>
      <div class="char-name" style="color:${c.color}">${c.name}</div>
      <div class="char-desc">${c.desc}</div>
      <div class="char-stats">${stat("PWR", c.stats.pow)}${stat("SPD", c.stats.spd)}${stat("DEF", c.stats.def)}</div>`;
      card.addEventListener("click", () => {
        G.char = c;
        Audio2.sfx("ring");
        startRun("rush", 0);
      });
      dom.charGrid.appendChild(card);
    });
  }

  function stageUnlocked(i) {
    return i <= settings.highestCleared;
  } // 0-based index unlocked if cleared up to it

  function buildStageGrid() {
    dom.stageGrid.innerHTML = "";
    STAGES.forEach((s, i) => {
      const unlocked = i === 0 || i <= settings.highestCleared;
      const card = document.createElement("div");
      card.className = "stage-card" + (unlocked ? "" : " locked");
      const badge =
        s.id === 7
          ? '<span class="stage-lock badge-true">★</span>'
          : s.id === 6
            ? '<span class="stage-lock badge-final">✦</span>'
            : "";
      card.innerHTML = `
      ${unlocked ? badge : '<span class="stage-lock">🔒</span>'}
      <div class="stage-thumb"><img src="${IMG[s.sprites[0].key]}" alt="${s.boss}"></div>
      <div class="stage-num">STAGE ${s.id}</div>
      <div class="stage-bname">${s.boss}</div>`;
      if (unlocked)
        card.addEventListener("click", () => {
          Audio2.sfx("ring");
          ensureChar(() => startRun("rush", i));
        });
      dom.stageGrid.appendChild(card);
    });
  }

  function buildTimeGrid() {
    dom.timeGrid.innerHTML = "";
    STAGES.forEach((s, i) => {
      const unlocked = i === 0 || i <= settings.highestCleared;
      const best = settings.bestTimes["s" + s.id];
      const card = document.createElement("div");
      card.className = "stage-card" + (unlocked ? "" : " locked");
      card.innerHTML = `
      ${unlocked ? "" : '<span class="stage-lock">🔒</span>'}
      <div class="stage-thumb"><img src="${IMG[s.sprites[0].key]}" alt="${s.boss}"></div>
      <div class="stage-num">STAGE ${s.id}</div>
      <div class="stage-bname">${s.boss}</div>
      <div class="stage-best">${best != null ? fmtTime(best) : "--:--.--"}</div>`;
      if (unlocked)
        card.addEventListener("click", () => {
          Audio2.sfx("ring");
          ensureChar(() => startRun("timeattack", i));
        });
      dom.timeGrid.appendChild(card);
    });
  }

  // For stage select / time attack, make sure a character is chosen (default Fireboy)
  function ensureChar(cb) {
    if (!G.char) G.char = CHARACTERS[0];
    cb();
  }

  function buildExtra(tab) {
    document
      .querySelectorAll("#screen-extra .tab")
      .forEach((t) =>
        t.classList.toggle("on", t.getAttribute("data-tab") === tab),
      );
    if (tab === "gallery") {
      let html = '<div class="gallery-grid">';
      STAGES.forEach((s) => {
        html += `<div class="gallery-card"><img src="${IMG[s.sprites[0].key]}" alt="${s.boss}"><div class="gname">${s.boss}</div><div class="gorigin">${s.origin}</div></div>`;
      });
      html += "</div>";
      dom.extraBody.innerHTML = html;
    } else if (tab === "story") {
      dom.extraBody.innerHTML = `<div class="story-text">
      <p>The world of <b>Terra Nemesis</b> has been overrun by a cascade of war machines and rogue champions, each more dangerous than the last.</p>
      <p>The <b>Fireboy Brothers</b> — alongside Caroline, Butch, and Anabel — answer the call. Only by surviving a relentless <b>Boss Rush</b> through seven trials can they reach the fused heart of the nemesis: <b>Roaring Metal</b>.</p>
      <p>Pick your hero, master their fire, and topple every boss. Mind the gimmicks: moving platforms, gravity wells, shockwaves, shields, and shifting phases all stand between you and the legend.</p>
    </div>`;
    } else {
      dom.extraBody.innerHTML = `<div class="credits-text">
      <p><b>Fireboy The Brothers — The Legend of Terra Nemesis</b><br>Boss Rush Mode</p>
      <p><b>Series:</b> Player10thGames</p>
      <p><b>Bosses inspired by:</b> Gradius · Sonic 3 · Rowdyruff Boys · Terra Cresta · Deltarune</p>
      <p><b>Heroes:</b> Fireboy · Caroline · Butch · Anabel</p>
      <p>Built as a standalone HTML5 Canvas game — index.html · game.js · style.css</p>
    </div>`;
    }
  }

  /* ----------------------------- menu wiring ---------------------------- */
  function handleAction(action) {
    switch (action) {
      case "start":
        Audio2.sfx("ring");
        showScreen("char");
        break;
      case "stageselect":
        Audio2.sfx("ring");
        buildStageGrid();
        showScreen("stageselect");
        break;
      case "timeattack":
        Audio2.sfx("ring");
        buildTimeGrid();
        showScreen("timeattack");
        break;
      case "options":
        Audio2.sfx("ring");
        syncOptions();
        showScreen("options");
        break;
      case "extra":
        Audio2.sfx("ring");
        buildExtra("gallery");
        showScreen("extra");
        break;
      case "back-title":
        Audio2.sfx("ring");
        showScreen("title");
        break;
      case "resume":
        resumeGame();
        break;
      case "restart":
        hideAllScreens();
        beginStage(G.stageIndex);
        break;
      case "quit":
        toMenu();
        break;
      case "reset-progress":
        settings.highestCleared = 0;
        settings.bestTimes = {};
        persist();
        buildStageGrid();
        buildTimeGrid();
        floatText(W / 2, H / 2, "SAVE RESET", "#ff3b5c");
        break;
      case "result-primary":
        handleResultPrimary();
        break;
    }
  }
  function handleResultPrimary() {
    hideAllScreens();
    if (G.resultAction === "next") beginStage(G.stageIndex + 1);
    else if (G.resultAction === "retry") beginStage(G.stageIndex);
    else toMenu();
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (btn) {
      handleAction(btn.getAttribute("data-action"));
    }
  });

  /* options controls */
  function syncOptions() {
    $("opt-music").value = Math.round(settings.musicVol * 100);
    $("opt-sfx").value = Math.round(settings.sfxVol * 100);
    $("opt-music-val").textContent = Math.round(settings.musicVol * 100);
    $("opt-sfx-val").textContent = Math.round(settings.sfxVol * 100);
    document
      .querySelectorAll("#opt-difficulty button")
      .forEach((b) =>
        b.classList.toggle(
          "on",
          b.getAttribute("data-val") === settings.difficulty,
        ),
      );
    document
      .querySelectorAll("#opt-touch button")
      .forEach((b) =>
        b.classList.toggle("on", b.getAttribute("data-val") === settings.touch),
      );
  }
  function wireOptions() {
    $("opt-music").addEventListener("input", (e) => {
      Audio2.setMusicVol(e.target.value / 100);
      $("opt-music-val").textContent = e.target.value;
      persist();
    });
    $("opt-sfx").addEventListener("input", (e) => {
      settings.sfxVol = e.target.value / 100;
      $("opt-sfx-val").textContent = e.target.value;
      persist();
    });
    $("opt-sfx").addEventListener("change", () => Audio2.sfx("shoot"));
    document.querySelectorAll("#opt-difficulty button").forEach((b) =>
      b.addEventListener("click", () => {
        settings.difficulty = b.getAttribute("data-val");
        syncOptions();
        persist();
      }),
    );
    document.querySelectorAll("#opt-touch button").forEach((b) =>
      b.addEventListener("click", () => {
        settings.touch = b.getAttribute("data-val");
        syncOptions();
        persist();
      }),
    );
    document
      .querySelectorAll("#screen-extra .tab")
      .forEach((t) =>
        t.addEventListener("click", () =>
          buildExtra(t.getAttribute("data-tab")),
        ),
      );
  }

  /* ----------------------------- scaling -------------------------------- */
  function resize() {
    const vw = window.innerWidth,
      vh = window.innerHeight;
    const scale = Math.min(vw / W, vh / H);
    dom.stage.style.transform = `scale(${scale})`;
  }
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", resize);

  /* ----------------------------- audio gate ----------------------------- */
  function unlockAudio() {
    if (G.audioUnlocked) return;
    G.audioUnlocked = true;
    const a = new Audio(SFX.ring);
    a.volume = 0;
    a.play().catch(() => {});
    dom.tapGate.classList.add("hidden");
  }
  ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
    window.addEventListener(ev, unlockAudio, { once: true }),
  );

  /* ----------------------------- init ----------------------------------- */
  function init() {
    loadSave();
    Audio2.init();
    loadImages();
    setupTouch();
    buildCharGrid();
    buildStageGrid();
    buildTimeGrid();
    buildExtra("gallery");
    wireOptions();
    syncOptions();
    resize();
    showScreen("title");
    requestAnimationFrame(frame);
  }
  init();
})();
