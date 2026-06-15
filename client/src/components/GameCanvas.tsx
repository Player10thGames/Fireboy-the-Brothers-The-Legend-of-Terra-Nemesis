/**
 * Game Canvas Component — Boss Rush Mode
 * Full game loop with gimmicks, time attack, screen shake, and all 7 bosses
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '@/engine/GameEngine';
import { InputManager } from '@/engine/InputManager';
import { AudioManager } from '@/engine/AudioManager';
import { GameStateManager } from '@/engine/GameState';
import { Player } from '@/entities/Player';
import { Boss } from '@/entities/Boss';
import { BossFactory } from '@/entities/BossFactory';
import HUD from './HUD';
import TouchControls from './TouchControls';
import { AssetLoader } from '@/lib/assetLoader';
import { Projectile } from '@/entities/Projectile';
import { Collision } from '@/engine/Collision';
import { getCharacter } from '@/entities/characters';
import { getBoss } from '@/entities/bosses';
import {
  MovingPlatformsGimmick,
  GravityShiftGimmick,
  ShockwaveGimmick,
  RingCollectionGimmick,
  PhaseTransitionGimmick,
} from '@/engine/Gimmick';

interface GameCanvasProps {
  characterId: string;
  onGameOver: (won: boolean, score?: number, time?: number) => void;
  startStage?: number;
  isTimeAttack?: boolean;
  options?: {
    masterVolume?: number;
    musicVolume?: number;
    sfxVolume?: number;
    difficulty?: string;
    showFPS?: boolean;
    screenShake?: boolean;
  };
}

const DIFF_MULTIPLIERS: Record<string, { hp: number; dmg: number; spd: number }> = {
  easy: { hp: 0.6, dmg: 0.6, spd: 0.8 },
  normal: { hp: 1.0, dmg: 1.0, spd: 1.0 },
  hard: { hp: 1.4, dmg: 1.4, spd: 1.2 },
  extreme: { hp: 2.0, dmg: 2.0, spd: 1.5 },
};

function createGimmick(stage: number) {
  switch (stage) {
    case 1: return new MovingPlatformsGimmick();
    case 3: return new GravityShiftGimmick();
    case 4: return new ShockwaveGimmick();
    case 5: return new RingCollectionGimmick();
    case 6: return new PhaseTransitionGimmick();
    case 7: return new PhaseTransitionGimmick();
    default: return null;
  }
}

export default function GameCanvas({
  characterId,
  onGameOver,
  startStage = 1,
  isTimeAttack = false,
  options = {},
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const inputManagerRef = useRef<InputManager | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const gameStateRef = useRef<GameStateManager | null>(null);
  const playerRef = useRef<Player | null>(null);
  const bossRef = useRef<Boss | null>(null);
  const projectilesRef = useRef<Projectile[]>([]);
  const gimmickRef = useRef<any>(null);
  const isPausedRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const shakeRef = useRef({ x: 0, y: 0, duration: 0 });
  const fpsRef = useRef({ count: 0, last: Date.now(), fps: 60 });
  const gameOverFiredRef = useRef(false);

  const [gameState, setGameState] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [currentBossName, setCurrentBossName] = useState('');
  const [currentStageNum, setCurrentStageNum] = useState(startStage);
  const [elapsedTime, setElapsedTime] = useState(0);

  const difficulty = options.difficulty || 'normal';
  const diffMult = DIFF_MULTIPLIERS[difficulty] || DIFF_MULTIPLIERS.normal;
  const doScreenShake = options.screenShake !== false;
  const showFPS = options.showFPS === true;

  useEffect(() => {
    if (!isTimeAttack) return;
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTimeRef.current);
    }, 100);
    return () => clearInterval(interval);
  }, [isTimeAttack]);

  const handlePauseToggle = useCallback(() => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
    if (isPausedRef.current) {
      gameEngineRef.current?.stop();
      audioManagerRef.current?.pauseMusic();
    } else {
      gameEngineRef.current?.start();
      audioManagerRef.current?.resumeMusic();
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    gameOverFiredRef.current = false;

    const canvas = canvasRef.current;
    const gameEngine = new GameEngine(canvas, { canvasWidth: 800, canvasHeight: 600, targetFPS: 60 });
    const inputManager = new InputManager();
    const audioManager = new AudioManager();
    const gameState = new GameStateManager();

    gameEngineRef.current = gameEngine;
    inputManagerRef.current = inputManager;
    audioManagerRef.current = audioManager;
    gameStateRef.current = gameState;

    if (options.masterVolume !== undefined) audioManager.setMasterVolume(options.masterVolume / 100);
    if (options.musicVolume !== undefined) audioManager.setMusicVolume(options.musicVolume / 100);
    if (options.sfxVolume !== undefined) audioManager.setSFXVolume(options.sfxVolume / 100);

    gameState.subscribe(setGameState);

    const characterDef = getCharacter(characterId);
    if (!characterDef) {
      console.error(`GameCanvas: unknown character "${characterId}", cannot start game`);
      onGameOver(false, 0, 0);
      return;
    }
    const player = new Player({
      x: 80,
      y: 260,
      width: 48,
      height: 48,
      stats: characterDef.stats,
      character: characterId,
    });
    playerRef.current = player;
    gameEngine.addObject(player);
    gameState.setPlayerMaxHealth(characterDef.stats.maxHealth);
    gameState.setPlayerHealth(characterDef.stats.maxHealth);

    for (let i = 1; i < startStage; i++) gameState.nextStage();
    startTimeRef.current = Date.now();

    const bgImg = new Image();
    bgImg.src = AssetLoader.getImage('background');
    const fgImg = new Image();
    fgImg.src = AssetLoader.getImage('foreground');

    const loadBoss = (stageNum: number) => {
      const bossDef = getBoss(stageNum);
      if (!bossDef) {
        console.error(`GameCanvas: no boss definition for stage ${stageNum}`);
        gameEngine.stop();
        onGameOver(false, gameState.getState().score, Date.now() - startTimeRef.current);
        return;
      }
      const adjustedStats = {
        ...bossDef.stats,
        health: Math.round(bossDef.stats.maxHealth * diffMult.hp),
        maxHealth: Math.round(bossDef.stats.maxHealth * diffMult.hp),
        damage: Math.round(bossDef.stats.damage * diffMult.dmg),
        speed: bossDef.stats.speed * diffMult.spd,
      };
      const newBoss = BossFactory.createBoss(stageNum, {
        x: 580,
        y: 180,
        width: 80,
        height: 80,
        stats: adjustedStats,
        name: bossDef.name,
        stage: stageNum,
      });
      bossRef.current = newBoss;
      gameEngine.addObject(newBoss);
      gameState.setBossMaxHealth(adjustedStats.maxHealth);
      gameState.setBossHealth(adjustedStats.maxHealth);
      gimmickRef.current = createGimmick(stageNum);
      setCurrentBossName(bossDef.name);
      setCurrentStageNum(stageNum);
      setShowTransition(true);
      setTimeout(() => {
        setShowTransition(false);
        setShowWarning(true);
        audioManager.playSFX(AssetLoader.getSFX('bossWarning'));
        setTimeout(() => setShowWarning(false), 2500);
      }, 2000);
      audioManager.playMusic(AssetLoader.getMusic('bossBattle'), true);
    };

    // Override render to add background + gimmick + FPS
    (gameEngine as any).render = () => {
      const ctx = gameEngine.getContext();
      const w = canvas.width;
      const h = canvas.height;
      ctx.save();
      if (doScreenShake && shakeRef.current.duration > 0) {
        const sx = (Math.random() - 0.5) * shakeRef.current.x;
        const sy = (Math.random() - 0.5) * shakeRef.current.y;
        ctx.translate(sx, sy);
        shakeRef.current.duration -= 16;
      }
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, w, h);
      } else {
        ctx.fillStyle = '#050520';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        for (let i = 0; i < 80; i++) {
          ctx.fillRect((i * 137 + 50) % w, (i * 97 + 30) % h, 2, 2);
        }
      }
      if (gimmickRef.current) gimmickRef.current.render(ctx);
      for (const obj of (gameEngine as any).gameObjects) {
        if (obj.active) obj.render(ctx);
      }
      if (fgImg.complete && fgImg.naturalWidth > 0) {
        ctx.drawImage(fgImg, 0, h - 80, w, 80);
      } else {
        ctx.fillStyle = '#1a1a3e';
        ctx.fillRect(0, h - 60, w, 60);
      }
      if (showFPS) {
        fpsRef.current.count++;
        const now = Date.now();
        if (now - fpsRef.current.last >= 1000) {
          fpsRef.current.fps = fpsRef.current.count;
          fpsRef.current.count = 0;
          fpsRef.current.last = now;
        }
        ctx.fillStyle = '#00FF00';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('FPS: ' + fpsRef.current.fps, w - 70, 20);
      }
      ctx.restore();
    };

    loadBoss(startStage);
    gameEngine.start();

    const gameLoopInterval = setInterval(() => {
      const player = playerRef.current;
      const boss = bossRef.current;
      if (!player || !boss || isPausedRef.current || gameOverFiredRef.current) return;
      const currentTime = Date.now();
      const movement = inputManager.getMovementDirection();
      player.setVelocity(movement.x, movement.y);
      if (gimmickRef.current) {
        gimmickRef.current.update(1 / 60);
        if (gimmickRef.current instanceof RingCollectionGimmick) {
          const pb = player.getBounds();
          gimmickRef.current.checkCollision(pb.x, pb.y, pb.width, pb.height);
        }
        if (gimmickRef.current instanceof PhaseTransitionGimmick) {
          gimmickRef.current.updatePhase(boss.getHealthPercentage());
        }
      }
      if (inputManager.isFirePressed() && player.canFire(currentTime)) {
        player.fire(currentTime);
        audioManager.playSFX(AssetLoader.getSFX('playerFire'));
        const center = player.getCenter();
        const projectile = new Projectile({
          x: center.x + 20,
          y: center.y - 4,
          vx: 7,
          vy: 0,
          damage: player.getStats().damage,
          owner: 'player',
          width: 12,
          height: 6,
        });
        projectilesRef.current.push(projectile);
        gameEngine.addObject(projectile);
      }
      if (boss.canAttack(currentTime)) {
        boss.registerAttack(currentTime);
        const bossAttacks = boss.generateAttack(currentTime);
        bossAttacks.forEach(proj => {
          projectilesRef.current.push(proj);
          gameEngine.addObject(proj);
        });
      }
      if (gimmickRef.current instanceof ShockwaveGimmick && Math.random() < 0.005) {
        gimmickRef.current.triggerShockwave(boss.getCenter().x);
      }
      const playerBounds = player.getBounds();
      const bossBounds = boss.getBounds();
      projectilesRef.current = projectilesRef.current.filter(proj => {
        if (proj.getOwner() === 'player') {
          if (Collision.checkAABB(proj.getBounds(), bossBounds)) {
            boss.takeDamage(proj.getDamage());
            gameState.setBossHealth(boss.getStats().health);
            gameState.addScore(10);
            audioManager.playSFX(AssetLoader.getSFX('hitBoss'));
            proj.active = false;
            return false;
          }
        }
        return proj.active;
      });
      projectilesRef.current = projectilesRef.current.filter(proj => {
        if (proj.getOwner() === 'boss') {
          if (Collision.checkAABB(proj.getBounds(), playerBounds)) {
            player.takeDamage(proj.getDamage());
            gameState.setPlayerHealth(player.getStats().health);
            audioManager.playSFX(AssetLoader.getSFX('playerHurt'));
            if (doScreenShake) shakeRef.current = { x: 6, y: 6, duration: 200 };
            proj.active = false;
            return false;
          }
        }
        return proj.active;
      });
      if (player.getStats().health <= 0 && !gameOverFiredRef.current) {
        gameOverFiredRef.current = true;
        audioManager.playSFX(AssetLoader.getSFX('playerDeath'));
        audioManager.playMusic(AssetLoader.getMusic('gameOver'), false);
        if (doScreenShake) shakeRef.current = { x: 15, y: 15, duration: 600 };
        setTimeout(() => {
          gameEngine.stop();
          onGameOver(false, gameState.getState().score, Date.now() - startTimeRef.current);
        }, 800);
        clearInterval(gameLoopInterval);
        return;
      }
      if (boss.getStats().health <= 0 && !gameOverFiredRef.current) {
        audioManager.playSFX(AssetLoader.getSFX('bossDefeat'));
        if (doScreenShake) shakeRef.current = { x: 12, y: 12, duration: 500 };
        gameState.nextStage();
        if (gameState.getState().phase === 'victory') {
          gameOverFiredRef.current = true;
          audioManager.playMusic(AssetLoader.getMusic('stageClear'), false);
          setTimeout(() => {
            gameEngine.stop();
            onGameOver(true, gameState.getState().score, Date.now() - startTimeRef.current);
          }, 1500);
          clearInterval(gameLoopInterval);
          return;
        } else {
          gameEngine.getObjects().forEach(obj => { if (obj !== player) obj.active = false; });
          projectilesRef.current = [];
          audioManager.playSFX(AssetLoader.getSFX('strain'));
          setTimeout(() => loadBoss(gameState.getState().currentStage), 1200);
        }
      }
    }, 16);

    inputManager.onPauseToggle(handlePauseToggle);

    return () => {
      clearInterval(gameLoopInterval);
      gameEngine.stop();
      audioManager.stopMusic();
    };
  }, [characterId, startStage, difficulty]);

  const formatTime = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + String(cs).padStart(2, '0');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden">
      <div className="relative">
        <canvas
          ref={canvasRef}
          style={{ maxWidth: '100vw', maxHeight: 'calc(100vh - 120px)', imageRendering: 'pixelated', border: '2px solid #EAB308' }}
          width={800}
          height={600}
        />
        {showWarning && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none" style={{ background: 'rgba(255,0,0,0.15)' }}>
            <div className="text-center">
              <div className="text-red-500 font-extrabold animate-pulse" style={{ fontSize: 'clamp(1rem,4vw,2rem)', fontFamily: "'Press Start 2P',monospace", textShadow: '0 0 30px #FF0000' }}>!! WARNING !!</div>
              <div className="text-white font-bold mt-2" style={{ fontSize: 'clamp(0.6rem,2vw,1rem)', fontFamily: "'Press Start 2P',monospace" }}>{currentBossName}</div>
              <div className="text-yellow-400 mt-1" style={{ fontSize: 'clamp(0.4rem,1.2vw,0.6rem)', fontFamily: "'Press Start 2P',monospace" }}>APPROACHES!</div>
            </div>
          </div>
        )}
        {showTransition && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none" style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="text-center">
              <div className="text-yellow-400 font-extrabold" style={{ fontSize: 'clamp(0.6rem,2vw,1rem)', fontFamily: "'Press Start 2P',monospace" }}>
                {currentStageNum === 6 ? 'STAGE 6 FINALE' : currentStageNum === 7 ? 'STAGE 7 TRUE FINALE' : 'STAGE ' + currentStageNum}
              </div>
              <div className="text-white font-bold mt-2" style={{ fontSize: 'clamp(0.8rem,3vw,1.5rem)', fontFamily: "'Press Start 2P',monospace", textShadow: '0 0 20px #fff' }}>{currentBossName}</div>
            </div>
          </div>
        )}
        {isPaused && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-30">
            <div className="text-yellow-400 font-extrabold mb-6" style={{ fontSize: 'clamp(1.5rem,5vw,3rem)', fontFamily: "'Press Start 2P',monospace" }}>PAUSED</div>
            <button onClick={handlePauseToggle} className="px-8 py-3 rounded font-bold text-black" style={{ background: 'linear-gradient(90deg,#FF6B00,#FFD700)', fontFamily: "'Press Start 2P',monospace", fontSize: 'clamp(0.5rem,1.5vw,0.75rem)' }}>► RESUME</button>
          </div>
        )}
      </div>
      {gameState && (
        <HUD
          playerHealth={gameState.playerHealth}
          playerMaxHealth={gameState.playerMaxHealth}
          bossHealth={gameState.bossHealth}
          bossMaxHealth={gameState.bossMaxHealth}
          score={gameState.score}
          stage={gameState.currentStage}
          character={characterId}
          bossName={bossRef.current?.getName() || ''}
        />
      )}
      {isTimeAttack && (
        <div className="absolute top-4 right-4 text-green-400 font-bold z-10" style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 'clamp(0.5rem,1.5vw,0.8rem)' }}>
          ⏱ {formatTime(elapsedTime)}
        </div>
      )}
      <TouchControls inputManager={inputManagerRef.current!} onPause={handlePauseToggle} />
    </div>
  );
}
