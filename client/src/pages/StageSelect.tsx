/**
 * Stage Select Screen
 * Shows all 7 boss stages with unlock status
 */
import React, { useState } from 'react';
import { getAllBosses } from '@/entities/bosses';

interface StageSelectProps {
  onStageSelected: (stage: number) => void;
  onBack: () => void;
  clearedStages?: number[];
  highScores?: { [stage: number]: number };
}

const STAGE_COLORS = [
  '#FF4500', // Stage 1 - Duo Mecha Rocket
  '#DC143C', // Stage 2 - Butch
  '#FFD700', // Stage 3 - Mandler
  '#696969', // Stage 4 - Crusher-Bot
  '#C0C0C0', // Stage 5 - Metal Sonic
  '#8B0000', // Stage 6 - Roaring Knight
  '#FF1493', // Stage 7 - Roaring Metal
];

const STAGE_SUBTITLES = [
  'Big Core MK.I × Fire Breath',
  'Rowdyruff Boys',
  'Terra Cresta',
  'Heavy Mech Unit',
  'Sonic Series',
  'Deltarune',
  'True Final Boss',
];

const DIFFICULTY_LABELS = ['EASY', 'NORMAL', 'NORMAL', 'HARD', 'HARD', 'VERY HARD', 'EXTREME'];
const DIFFICULTY_COLORS = ['#00FF00', '#FFFF00', '#FFFF00', '#FF8C00', '#FF8C00', '#FF4500', '#FF0000'];

export default function StageSelect({ onStageSelected, onBack, clearedStages = [], highScores = {} }: StageSelectProps) {
  const [selectedStage, setSelectedStage] = useState(1);
  const bosses = getAllBosses();

  const handleSelect = (stage: number) => {
    setSelectedStage(stage);
  };

  const handleStart = () => {
    onStageSelected(selectedStage);
  };

  const selectedBoss = bosses.find(b => b.stage === selectedStage);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start pt-6 pb-4 px-4 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0a0a2e 0%, #000000 100%)',
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
      }}
    >
      {/* Header */}
      <div className="text-center mb-6 z-10">
        <div
          className="text-yellow-400 font-extrabold tracking-widest"
          style={{ fontSize: 'clamp(0.8rem, 3vw, 1.5rem)', textShadow: '0 0 20px #FFD700' }}
        >
          STAGE SELECT
        </div>
        <div className="text-slate-400 mt-1" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)' }}>
          BOSS RUSH MODE — SELECT YOUR CHALLENGE
        </div>
      </div>

      {/* Stage Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6 z-10 w-full max-w-2xl">
        {bosses.map((boss) => {
          const isSelected = selectedStage === boss.stage;
          const isCleared = clearedStages.includes(boss.stage);
          const isFinal = boss.stage >= 6;

          return (
            <button
              key={boss.stage}
              onClick={() => handleSelect(boss.stage)}
              className="relative rounded-lg p-3 flex flex-col items-center transition-all duration-150 border-2"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${STAGE_COLORS[boss.stage - 1]}44, ${STAGE_COLORS[boss.stage - 1]}88)`
                  : 'rgba(0,0,0,0.7)',
                borderColor: isSelected ? STAGE_COLORS[boss.stage - 1] : 'rgba(255,255,255,0.15)',
                boxShadow: isSelected ? `0 0 20px ${STAGE_COLORS[boss.stage - 1]}` : 'none',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {/* Stage number */}
              <div
                className="font-bold mb-1"
                style={{
                  fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                  color: STAGE_COLORS[boss.stage - 1],
                }}
              >
                {isFinal ? (boss.stage === 7 ? 'TRUE\nFINALE' : 'FINALE') : `STAGE ${boss.stage}`}
              </div>

              {/* Boss name */}
              <div
                className="text-white text-center leading-tight"
                style={{ fontSize: 'clamp(0.35rem, 1vw, 0.55rem)' }}
              >
                {boss.name}
              </div>

              {/* Cleared badge */}
              {isCleared && (
                <div
                  className="absolute top-1 right-1 text-green-400"
                  style={{ fontSize: '0.5rem' }}
                >
                  ✓
                </div>
              )}

              {/* Difficulty */}
              <div
                className="mt-1 font-bold"
                style={{
                  fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)',
                  color: DIFFICULTY_COLORS[boss.stage - 1],
                }}
              >
                {DIFFICULTY_LABELS[boss.stage - 1]}
              </div>
            </button>
          );
        })}

        {/* Placeholder for 8th slot */}
        <div className="rounded-lg p-3 border-2 border-dashed border-slate-700 flex items-center justify-center">
          <span className="text-slate-600" style={{ fontSize: '0.5rem' }}>???</span>
        </div>
      </div>

      {/* Boss Details Panel */}
      {selectedBoss && (
        <div
          className="z-10 w-full max-w-2xl rounded-lg p-4 mb-4 border"
          style={{
            background: `linear-gradient(135deg, rgba(0,0,0,0.8), ${STAGE_COLORS[selectedBoss.stage - 1]}22)`,
            borderColor: STAGE_COLORS[selectedBoss.stage - 1],
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div
                className="font-bold"
                style={{
                  fontSize: 'clamp(0.5rem, 1.5vw, 0.8rem)',
                  color: STAGE_COLORS[selectedBoss.stage - 1],
                }}
              >
                {selectedBoss.name.toUpperCase()}
              </div>
              <div className="text-slate-400 mt-1" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.55rem)' }}>
                {STAGE_SUBTITLES[selectedBoss.stage - 1]}
              </div>
            </div>
            <div className="text-right">
              <div className="text-slate-300" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.5rem)' }}>
                HP: {selectedBoss.stats.maxHealth}
              </div>
              {highScores[selectedBoss.stage] && (
                <div className="text-yellow-400 mt-1" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
                  BEST: {highScores[selectedBoss.stage]}
                </div>
              )}
            </div>
          </div>
          <div className="text-slate-300" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.5rem)' }}>
            <span className="text-yellow-400">GIMMICK: </span>{selectedBoss.gimmick}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 z-10">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-slate-500 text-slate-300 rounded font-bold transition-all hover:border-white hover:text-white"
          style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)' }}
        >
          ◄ BACK
        </button>
        <button
          onClick={handleStart}
          className="px-8 py-3 rounded font-bold transition-all"
          style={{
            fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)',
            background: `linear-gradient(90deg, ${STAGE_COLORS[selectedStage - 1]}, #FFD700)`,
            color: '#000',
            boxShadow: `0 0 20px ${STAGE_COLORS[selectedStage - 1]}`,
          }}
        >
          ► START STAGE {selectedStage}
        </button>
      </div>
    </div>
  );
}
