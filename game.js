// Game Configuration
const CONFIG = {
    GAME_WIDTH: 1024,
    GAME_HEIGHT: 768,
    PLAYER_SPEED: 5,
    JUMP_POWER: 15,
    GRAVITY: 0.6,
    MAX_HEALTH: 100,
    DIFFICULTY: {
        easy: 0.5,
        normal: 1,
        hard: 1.5,
        extreme: 2
    }
};

// Game States
const GAME_STATE = {
    MENU: 'menu',
    CHARACTER_SELECT: 'character_select',
    GAME: 'game',
    PAUSE: 'pause',
    GAME_OVER: 'game_over'
};

// Boss Data
const BOSSES = [
    {
        id: 1,
        name: 'Duo Mecha Rocket',
        stage: 'Stage 1',
        health: 150,
        speed: 3,
        attackPower: 15,
        pattern: 'spiral'
    },
    {
        id: 2,
        name: 'Butch',
        stage: 'Stage 2',
        health: 180,
        speed: 4,
        attackPower: 20,
        pattern: 'aggressive'
    },
    {
        id: 3,
        name: 'Mandler',
        stage: 'Stage 3',
        health: 200,
        speed: 3.5,
        attackPower: 18,
        pattern: 'pattern'
    },
    {
        id: 4,
        name: 'Crusher-Bot MK.II',
        stage: 'Stage 4',
        health: 220,
        speed: 2.5,
        attackPower: 25,
        pattern: 'heavy'
    },
    {
        id: 5,
        name: 'Metal Sonic',
        stage: 'Stage 5',
        health: 180,
        speed: 6,
        attackPower: 22,
        pattern: 'fast'
    },
    {
        id: 6,
        name: 'Roaring Knight',
        stage: 'Stage 6',
        health: 250,
        speed: 3,
        attackPower: 28,
        pattern: 'combo'
    },
    {
        id: 7,
        name: 'Roaring Metal',
        stage: 'Stage 7 - True Finale',
        health: 350,
        speed: 5,
        attackPower: 35,
        pattern: 'ultimate'
    }
];

// Character Data
const CHARACTERS = {
    fireboy: {
        name: 'Fireboy',
        speed: 6,
        jumpPower: 16,
        health: 100,
        attackPower: 20,
        special: 'Fire Breath'
    },
    caroline: {
        name: 'Caroline',
        speed: 5.5,
        jumpPower: 18,
        health: 90,
        attackPower: 18,
        special: 'Ice Shield'
    },
    butch: {
        name: 'Butch',
        speed: 4.5,
        jumpPower: 14,
        health: 120,
        attackPower: 25,
        special: 'Power Bash'
    },
    anabel: {
        name: 'Anabel',
        speed: 5,
        jumpPower: 17,
        health: 95,
        attackPower: 22,
        special: 'Energy Blast'
    }
};

// Game Instance
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        this.state = GAME_STATE.MENU;
        this.currentStage = 1;
        this.currentCharacter = null;
        this.difficulty = 'normal';
        this.score = 0;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.gameRunning = false;
        
        this.player = null;
        this.boss = null;
        this.projectiles = [];
        this.particles = [];
        this.controls = {};
        
        this.initEventListeners();
        this.gameLoop();
    }

    setupCanvas() {
        this.canvas.width = CONFIG.GAME_WIDTH;
        this.canvas.height = CONFIG.GAME_HEIGHT;
    }

    initEventListeners() {
        // Menu Button Events
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleMenuAction(e.target.dataset.action));
        });

        // Character Selection
        document.querySelectorAll('[data-character]').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectCharacter(e.target.dataset.character));
        });

        // Stage Selection
        document.querySelectorAll('[data-stage]').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectStage(e.target.dataset.stage));
        });

        // Keyboard Controls
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Touch Controls
        this.setupTouchControls();

        // Pause Button
        document.getElementById('pause-btn').addEventListener('click', () => this.pauseGame());
    }

    handleMenuAction(action) {
        switch(action) {
            case 'start-game':
                this.showMenu('character-select');
                break;
            case 'stage-select':
                this.showMenu('stage-select');
                break;
            case 'time-attack':
                this.startTimeAttack();
                break;
            case 'extra':
                this.showMenu('extra');
                break;
            case 'options':
                this.showMenu('options-menu');
                break;
            case 'back':
                this.showMenu('main-menu');
                break;
            case 'resume':
                this.resumeGame();
                break;
            case 'restart':
                this.restartStage();
                break;
            case 'next-stage':
                this.nextStage();
                break;
            case 'main-menu':
                this.returnToMenu();
                break;
        }
    }

    selectCharacter(character) {
        this.currentCharacter = character;
        const charData = CHARACTERS[character];
        this.showMenu('stage-select');
    }

    selectStage(stageNum) {
        this.currentStage = parseInt(stageNum);
        this.startGame();
    }

    startGame() {
        if (!this.currentCharacter) {
            alert('Please select a character first!');
            return;
        }

        this.state = GAME_STATE.GAME;
        this.gameRunning = true;
        this.score = 0;
        this.startTime = Date.now();
        
        // Hide all menus and show canvas
        document.querySelectorAll('.menu').forEach(menu => menu.classList.remove('active'));
        this.canvas.classList.remove('hidden');
        document.getElementById('hud').classList.remove('hidden');
        
        this.initializeGameObjects();
    }

    initializeGameObjects() {
        // Initialize Player
        const charData = CHARACTERS[this.currentCharacter];
        this.player = new Player(
            CONFIG.GAME_WIDTH / 2,
            CONFIG.GAME_HEIGHT - 150,
            charData
        );

        // Initialize Boss
        const bossData = BOSSES[this.currentStage - 1];
        const difficultyMultiplier = CONFIG.DIFFICULTY[this.difficulty];
        this.boss = new Boss(
            CONFIG.GAME_WIDTH / 2,
            100,
            bossData,
            difficultyMultiplier
        );

        this.projectiles = [];
        this.particles = [];
        this.updateHUD();
    }

    handleKeyDown(e) {
        if (this.state !== GAME_STATE.GAME) return;

        switch(e.key.toLowerCase()) {
            case 'arrowleft':
            case 'a':
                this.controls.left = true;
                e.preventDefault();
                break;
            case 'arrowright':
            case 'd':
                this.controls.right = true;
                e.preventDefault();
                break;
            case 'arrowup':
            case 'w':
                this.controls.jump = true;
                e.preventDefault();
                break;
            case ' ':
                this.controls.attack = true;
                e.preventDefault();
                break;
            case 'escape':
                this.pauseGame();
                break;
        }
    }

    handleKeyUp(e) {
        switch(e.key.toLowerCase()) {
            case 'arrowleft':
            case 'a':
                this.controls.left = false;
                break;
            case 'arrowright':
            case 'd':
                this.controls.right = false;
                break;
            case 'arrowup':
            case 'w':
                this.controls.jump = false;
                break;
            case ' ':
                this.controls.attack = false;
                break;
        }
    }

    setupTouchControls() {
        // D-Pad simulation (left side of screen)
        const dpadArea = document.createElement('div');
        dpadArea.id = 'dpad-area';
        
        // Button area (right side of screen)
        const buttonArea = document.createElement('div');
        buttonArea.id = 'button-area';
    }

    pauseGame() {
        if (this.state === GAME_STATE.GAME) {
            this.state = GAME_STATE.PAUSE;
            this.gameRunning = false;
            this.showMenu('pause-menu');
        }
    }

    resumeGame() {
        this.state = GAME_STATE.GAME;
        this.gameRunning = true;
        this.canvas.classList.remove('hidden');
        document.getElementById('hud').classList.remove('hidden');
        document.getElementById('pause-menu').classList.remove('active');
    }

    restartStage() {
        this.state = GAME_STATE.GAME;
        this.gameRunning = true;
        this.score = 0;
        this.startTime = Date.now();
        document.getElementById('pause-menu').classList.remove('active');
        document.getElementById('game-over').classList.remove('active');
        this.canvas.classList.remove('hidden');
        document.getElementById('hud').classList.remove('hidden');
        this.initializeGameObjects();
    }

    nextStage() {
        if (this.currentStage < BOSSES.length) {
            this.currentStage++;
            this.startGame();
        } else {
            alert('Congratulations! You have defeated all bosses!');
            this.returnToMenu();
        }
    }

    returnToMenu() {
        this.state = GAME_STATE.MENU;
        this.gameRunning = false;
        this.canvas.classList.add('hidden');
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('pause-menu').classList.remove('active');
        document.getElementById('game-over').classList.remove('active');
        this.showMenu('main-menu');
    }

    showMenu(menuId) {
        document.querySelectorAll('.menu').forEach(menu => menu.classList.remove('active'));
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.classList.add('active');
        }
    }

    startTimeAttack() {
        // Time Attack mode implementation
        console.log('Time Attack mode starting...');
        this.showMenu('character-select');
    }

    updateHUD() {
        if (!this.player || !this.boss) return;

        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('health-fill').style.width = healthPercent + '%';
        document.getElementById('health-text').textContent = `${this.player.health}/${this.player.maxHealth}`;
        
        const bossData = BOSSES[this.currentStage - 1];
        document.getElementById('stage-name').textContent = bossData.stage;
        document.getElementById('boss-name').textContent = bossData.name;
        
        if (this.gameRunning) {
            this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(this.elapsedTime / 60);
            const seconds = this.elapsedTime % 60;
            document.getElementById('timer').textContent = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        
        document.getElementById('score').textContent = this.score;
    }

    update() {
        if (!this.gameRunning || this.state !== GAME_STATE.GAME) return;

        // Update player
        this.player.update(this.controls);
        
        // Update boss
        this.boss.update(this.player);
        
        // Update projectiles
        this.projectiles = this.projectiles.filter(p => {
            p.update();
            
            // Check collision with player
            if (p.owner !== 'player' && this.isColliding(p, this.player)) {
                this.player.takeDamage(p.damage);
                return false;
            }
            
            // Check collision with boss
            if (p.owner === 'player' && this.isColliding(p, this.boss)) {
                this.boss.takeDamage(p.damage);
                this.score += 10;
                return false;
            }
            
            return p.x > 0 && p.x < CONFIG.GAME_WIDTH;
        });

        // Generate boss projectiles
        if (Math.random() < 0.02) {
            this.projectiles.push(this.boss.createProjectile());
        }

        // Check if player is attacking
        if (this.controls.attack) {
            this.projectiles.push(this.player.createProjectile());
            this.controls.attack = false;
        }

        // Update particles
        this.particles = this.particles.filter(p => p.life > 0);

        // Check game over conditions
        if (this.player.health <= 0) {
            this.endGame(false);
        } else if (this.boss.health <= 0) {
            this.endGame(true);
        }

        this.updateHUD();
    }

    isColliding(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    endGame(victory) {
        this.gameRunning = false;
        this.state = GAME_STATE.GAME_OVER;
        
        const gameOverDiv = document.getElementById('game-over');
        const message = document.getElementById('game-over-message');
        const finalScore = document.getElementById('final-score');
        const finalTime = document.getElementById('final-time');
        
        if (victory) {
            message.textContent = `${BOSSES[this.currentStage - 1].name} Defeated!`;
            this.score += 1000;
        } else {
            message.textContent = 'Game Over! You were defeated.';
        }
        
        finalScore.textContent = `Final Score: ${this.score}`;
        const minutes = Math.floor(this.elapsedTime / 60);
        const seconds = this.elapsedTime % 60;
        finalTime.textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        gameOverDiv.classList.add('active');
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

        // Draw background
        this.drawBackground();

        // Draw game objects
        if (this.player) this.player.draw(this.ctx);
        if (this.boss) this.boss.draw(this.ctx);

        // Draw projectiles
        this.projectiles.forEach(p => p.draw(this.ctx));

        // Draw particles
        this.particles.forEach(p => p.draw(this.ctx));
    }

    drawBackground() {
        // Draw grid pattern
        this.ctx.strokeStyle = 'rgba(255, 107, 53, 0.1)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < CONFIG.GAME_WIDTH; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, CONFIG.GAME_HEIGHT);
            this.ctx.stroke();
        }

        for (let i = 0; i < CONFIG.GAME_HEIGHT; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(CONFIG.GAME_WIDTH, i);
            this.ctx.stroke();
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Player Class
class Player {
    constructor(x, y, characterData) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.vx = 0;
        this.vy = 0;
        this.jumping = false;
        
        this.character = characterData;
        this.speed = characterData.speed;
        this.jumpPower = characterData.jumpPower;
        this.health = characterData.health;
        this.maxHealth = characterData.health;
        this.attackPower = characterData.attackPower;
    }

    update(controls) {
        // Horizontal movement
        if (controls.left) {
            this.vx = -this.speed;
        } else if (controls.right) {
            this.vx = this.speed;
        } else {
            this.vx = 0;
        }

        // Jumping
        if (controls.jump && !this.jumping) {
            this.vy = -this.jumpPower;
            this.jumping = true;
        }

        // Apply gravity
        this.vy += CONFIG.GRAVITY;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Boundary checking
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > CONFIG.GAME_WIDTH) this.x = CONFIG.GAME_WIDTH - this.width;

        // Ground collision
        if (this.y + this.height >= CONFIG.GAME_HEIGHT - 50) {
            this.y = CONFIG.GAME_HEIGHT - 50 - this.height;
            this.vy = 0;
            this.jumping = false;
        }
    }

    draw(ctx) {
        // Draw player character
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw health indicator
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x, this.y - 10, this.width * (this.health / this.maxHealth), 5);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }

    createProjectile() {
        return new Projectile(
            this.x + this.width / 2,
            this.y + this.height / 2,
            8,
            0,
            this.attackPower,
            'player'
        );
    }
}

// Boss Class
class Boss {
    constructor(x, y, bossData, difficultyMultiplier) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 100;
        this.vx = 0;
        this.vy = 0;

        this.data = bossData;
        this.health = bossData.health * difficultyMultiplier;
        this.maxHealth = this.health;
        this.speed = bossData.speed;
        this.attackPower = bossData.attackPower * difficultyMultiplier;
        this.pattern = bossData.pattern;
        this.patternTimer = 0;
    }

    update(player) {
        // Boss AI movement patterns
        this.patternTimer++;

        switch(this.pattern) {
            case 'spiral':
                this.moveSpiral(player);
                break;
            case 'aggressive':
                this.moveAggressive(player);
                break;
            case 'pattern':
                this.movePattern(player);
                break;
            case 'heavy':
                this.moveHeavy(player);
                break;
            case 'fast':
                this.moveFast(player);
                break;
            case 'combo':
                this.moveCombo(player);
                break;
            case 'ultimate':
                this.moveUltimate(player);
                break;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Boundary checking
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > CONFIG.GAME_WIDTH) this.x = CONFIG.GAME_WIDTH - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > CONFIG.GAME_HEIGHT - 50) this.y = CONFIG.GAME_HEIGHT - 50 - this.height;
    }

    moveSpiral(player) {
        const angle = this.patternTimer * 0.05;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
    }

    moveAggressive(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.vx = (dx / dist) * this.speed;
            this.vy = (dy / dist) * this.speed;
        }
    }

    movePattern(player) {
        if (this.patternTimer % 60 < 30) {
            this.vx = this.speed;
        } else {
            this.vx = -this.speed;
        }
        this.vy = Math.sin(this.patternTimer * 0.1) * this.speed * 0.5;
    }

    moveHeavy(player) {
        if (this.patternTimer % 120 < 60) {
            this.vx = this.speed * 0.5;
        } else {
            this.vx = -this.speed * 0.5;
        }
    }

    moveFast(player) {
        const dx = player.x - this.x;
        const dist = Math.abs(dx);

        if (dist > 150) {
            this.vx = dx > 0 ? this.speed : -this.speed;
        } else {
            this.vx = -Math.sign(dx) * this.speed;
        }
    }

    moveCombo(player) {
        if (this.patternTimer < 40) {
            this.moveAggressive(player);
        } else if (this.patternTimer < 80) {
            this.moveSpiral(player);
        } else {
            this.patternTimer = 0;
        }
    }

    moveUltimate(player) {
        if (this.patternTimer < 30) {
            this.moveAggressive(player);
        } else if (this.patternTimer < 60) {
            this.moveSpiral(player);
        } else if (this.patternTimer < 90) {
            this.moveFast(player);
        } else {
            this.patternTimer = 0;
        }
    }

    draw(ctx) {
        // Draw boss
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw health bar
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x, this.y - 15, this.width * (this.health / this.maxHealth), 8);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y - 15, this.width, 8);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }

    createProjectile() {
        return new Projectile(
            this.x + this.width / 2,
            this.y + this.height,
            Math.random() * 4 - 2,
            4,
            this.attackPower,
            'boss'
        );
    }
}

// Projectile Class
class Projectile {
    constructor(x, y, vx, vy, damage, owner) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = 10;
        this.height = 10;
        this.damage = damage;
        this.owner = owner;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += CONFIG.GRAVITY * 0.5;
    }

    draw(ctx) {
        ctx.fillStyle = this.owner === 'player' ? '#00ff00' : '#ff0000';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Particle Class
class Particle {
    constructor(x, y, vx, vy, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += CONFIG.GRAVITY * 0.3;
        this.life--;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = `rgba(255, 107, 53, ${alpha})`;
        ctx.fillRect(this.x, this.y, 5, 5);
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    window.game = game;
});