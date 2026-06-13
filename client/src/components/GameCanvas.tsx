/**
 * Game Canvas Component
 */

import React, { useEffect, useRef, useState } from 'react';
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


interface GameCanvasProps {
  characterId: string;
  onGameOver: (won: boolean) => void;
}

export default function GameCanvas({ characterId, onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const inputManagerRef = useRef<InputManager | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const gameStateRef = useRef<GameStateManager | null>(null);
  const playerRef = useRef<Player | null>(null);
  const bossRef = useRef<Boss | null>(null);
  const projectilesRef = useRef<Projectile[]>([]);
  const [gameState, setGameState] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize managers
    const gameEngine = new GameEngine(canvasRef.current, {
      canvasWidth: 800,
      canvasHeight: 600,
      targetFPS: 60,
    });
    const inputManager = new InputManager();
    const audioManager = new AudioManager();
    const gameState = new GameStateManager();

    gameEngineRef.current = gameEngine;
    inputManagerRef.current = inputManager;
    audioManagerRef.current = audioManager;
    gameStateRef.current = gameState;

    // Subscribe to game state changes
    gameState.subscribe(setGameState);

    // Initialize player
    const characterDef = getCharacter(characterId);
    if (characterDef) {
      const player = new Player({
        x: 350,
        y: 500,
        width: 40,
        height: 40,
        stats: characterDef.stats,
        character: characterId,
      });
      playerRef.current = player;
      gameEngine.addObject(player);
      gameState.setPlayerMaxHealth(characterDef.stats.maxHealth);
      gameState.setPlayerHealth(characterDef.stats.maxHealth);
    }

    // Function to load a boss for the current stage
    const loadBoss = (stageNum: number) => {
      const bossDef = getBoss(stageNum);
      if (bossDef) {
        const newBoss = BossFactory.createBoss(stageNum, {
          x: 300,
          y: 100,
          width: 60,
          height: 60,
          stats: bossDef.stats,
          name: bossDef.name,
        });
        bossRef.current = newBoss;
        gameEngine.addObject(newBoss);
        gameState.setBossMaxHealth(bossDef.stats.maxHealth);
        gameState.setBossHealth(bossDef.stats.maxHealth);
        audioManager.playMusic(AssetLoader.getMusic("bossBattle"), true);
      }
    };

    // Initial boss load
    loadBoss(gameState.getState().currentStage);

    // Start game
    gameEngine.start();

    // Game loop updates
    const gameLoopInterval = setInterval(() => {
      const player = playerRef.current;
      const boss = bossRef.current;

      if (!player || !boss || isPaused) return;

      // Handle input
      const movement = inputManager.getMovementDirection();
      player.setVelocity(movement.x, movement.y);

      // Handle firing
      const currentTime = Date.now();
      if (inputManager.isFirePressed() && player.canFire(currentTime)) {
        player.fire(currentTime);
        const center = player.getCenter();
        const projectile = new Projectile({
          x: center.x - 4,
          y: center.y - 4,
          vx: 0,
          vy: -5,
          damage: player.getStats().damage,
          owner: 'player',
        });
        projectilesRef.current.push(projectile);
        gameEngine.addObject(projectile);
      }

      // Boss attacks
      if (boss.canAttack(currentTime)) {
        boss.registerAttack(currentTime);
        const bossAttacks = boss.generateAttack(currentTime);
        bossAttacks.forEach(proj => {
          projectilesRef.current.push(proj);
          gameEngine.addObject(proj);
        });
      }

      // Collision detection
      const playerBounds = player.getBounds();
      const bossBounds = boss.getBounds();

      // Check player projectiles hitting boss
      projectilesRef.current = projectilesRef.current.filter(proj => {
        if (proj.getOwner() === 'player') {
          if (Collision.checkAABB(proj.getBounds(), bossBounds)) {
            boss.takeDamage(proj.getDamage());
            gameState.setBossHealth(boss.getStats().health);
            gameState.addScore(10);
            proj.active = false;
            return false;
          }
        }
        return proj.active;
      });

      // Check boss projectiles hitting player
      projectilesRef.current = projectilesRef.current.filter(proj => {
        if (proj.getOwner() === 'boss') {
          if (Collision.checkAABB(proj.getBounds(), playerBounds)) {
            player.takeDamage(proj.getDamage());
            gameState.setPlayerHealth(player.getStats().health);
            proj.active = false;
            return false;
          }
        }
        return proj.active;
      });

      // Check game over conditions
      if (player.getStats().health <= 0) {
        gameEngine.stop();
        onGameOver(false);
      }

      if (boss.getStats().health <= 0) {
        // Boss defeated, advance to next stage or victory
        audioManager.playSFX(AssetLoader.getSFX("bossDefeat"));
        gameState.nextStage();
        if (gameState.getState().phase === 'victory') {
          gameEngine.stop();
          onGameOver(true);
        } else {
          // Clear current game objects except player
          gameEngine.getObjects().forEach(obj => {
            if (obj !== player) {
              obj.active = false;
            }
          });
          projectilesRef.current = [];
          loadBoss(gameState.getState().currentStage);
        }
      }
    }, 16); // ~60 FPS

    const handlePauseToggle = () => {
      setIsPaused(prev => !prev);
      if (gameEngineRef.current) {
        if (isPaused) {
          gameEngineRef.current.start();
          audioManagerRef.current?.resumeMusic();
        } else {
          gameEngineRef.current.stop();
          audioManagerRef.current?.pauseMusic();
        }
      }
    };

    inputManager.onPauseToggle(handlePauseToggle);

    return () => {
      clearInterval(gameLoopInterval);
      gameEngine.stop();
    };
  }, [characterId, onGameOver]);

  return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-black">
        <canvas
          ref={canvasRef}
          className="border-4 border-yellow-400 bg-black"
          width={800}
          height={600}
        />
        {gameState && (
          <HUD
            playerHealth={gameState.playerHealth}
            playerMaxHealth={gameState.playerMaxHealth}
            bossHealth={gameState.bossHealth}
            bossMaxHealth={gameState.bossMaxHealth}
            score={gameState.score}
            stage={gameState.currentStage}
            character={characterId}
            bossName={bossRef.current?.name || ""}
          />
        )}
        <TouchControls inputManager={inputManagerRef.current!} onPause={handlePauseToggle} />
        {isPaused && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <p className="text-white text-5xl font-bold">PAUSED</p>
          </div>
        )}
      </div>
  );
}
