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
import { Projectile } from '@/entities/Projectile';
import { Collision } from '@/engine/Collision';
import { getCharacter } from '@/entities/characters';
import { getBoss } from '@/entities/bosses';

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

    // Initialize boss
    const bossDef = getBoss(1);
    if (bossDef) {
      const boss = new Boss({
        x: 300,
        y: 100,
        width: 60,
        height: 60,
        stats: bossDef.stats,
        name: bossDef.name,
      });
      bossRef.current = boss;
      gameEngine.addObject(boss);
      gameState.setBossMaxHealth(bossDef.stats.maxHealth);
      gameState.setBossHealth(bossDef.stats.maxHealth);
    }

    // Start game
    gameEngine.start();

    // Game loop updates
    const gameLoopInterval = setInterval(() => {
      const player = playerRef.current;
      const boss = bossRef.current;

      if (!player || !boss) return;

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
        gameEngine.stop();
        onGameOver(true);
      }
    }, 16); // ~60 FPS

    return () => {
      clearInterval(gameLoopInterval);
      gameEngine.stop();
    };
  }, [characterId, onGameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <canvas
        ref={canvasRef}
        className="border-4 border-yellow-400 bg-black"
        width={800}
        height={600}
      />
      
      {gameState && (
        <div className="mt-4 text-white text-center">
          <p className="text-2xl font-bold">Stage {gameState.currentStage}</p>
          <p className="text-lg">Score: {gameState.score}</p>
          <p className="text-lg">Player HP: {gameState.playerHealth}/{gameState.playerMaxHealth}</p>
          <p className="text-lg">Boss HP: {gameState.bossHealth}/{gameState.bossMaxHealth}</p>
        </div>
      )}
    </div>
  );
}
