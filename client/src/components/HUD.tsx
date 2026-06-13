/**
 * HUD Component
 * Displays health bars, score, and stage information
 */

import React from 'react';

interface HUDProps {
  playerHealth: number;
  playerMaxHealth: number;
  bossHealth: number;
  bossMaxHealth: number;
  bossName: string;
  score: number;
  stage: number;
  character: string;
}

export default function HUD({
  playerHealth,
  playerMaxHealth,
  bossHealth,
  bossMaxHealth,
  bossName,
  score,
  stage,
  character,
}: HUDProps) {
  const playerHealthPercent = (playerHealth / playerMaxHealth) * 100;
  const bossHealthPercent = (bossHealth / bossMaxHealth) * 100;

  return (
    <div className="absolute top-0 left-0 right-0 p-4 text-white font-bold">
      {/* Stage and Character Info */}
      <div className="flex justify-between mb-4">
        <div className="text-lg">
          <div>Stage {stage}/7</div>
          <div className="text-sm text-slate-300">{character}</div>
        </div>
        <div className="text-lg text-right">
          <div>Score: {score}</div>
        </div>
      </div>

      {/* Player Health Bar */}
      <div className="mb-2">
        <div className="text-sm mb-1">Player HP: {playerHealth}/{playerMaxHealth}</div>
        <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden border-2 border-blue-500">
          <div
            className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all duration-200"
            style={{ width: `${playerHealthPercent}%` }}
          />
        </div>
      </div>

      {/* Boss Health Bar */}
      <div className="mb-2">
        <div className="text-sm mb-1">{bossName} HP: {bossHealth}/{bossMaxHealth}</div>
        <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden border-2 border-red-500">
          <div
            className="bg-gradient-to-r from-red-500 to-red-400 h-full transition-all duration-200"
            style={{ width: `${bossHealthPercent}%` }}
          />
        </div>
      </div>

      {/* Controls Info */}
      <div className="text-xs text-slate-400 mt-4">
        <div>Arrow Keys or WASD to move</div>
        <div>Space or Z to fire</div>
        <div>P or ESC to pause</div>
      </div>
    </div>
  );
}
