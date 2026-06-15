
/**
 * Enhanced Time Attack Mode
 * Includes leaderboard, statistics, and difficulty modifiers
 */

import React, { useState, useEffect } from 'react';
import { getAllCharacters } from '@/entities/characters';
import { GamePersistence, PlayerProgress } from '@/lib/GamePersistence';

interface TimeAttackEnhancedProps {
  onStart: (characterId: string, stage: number, difficulty: string) => void;
  onBack: () => void;
  progress?: PlayerProgress;
}

interface LeaderboardEntry {
  rank: number;
  character: string;
  stage: number;
  time: number;
  score: number;
  difficulty: string;
  date: string;
}

export default function TimeAttackEnhanced({ onStart, onBack, progress }: TimeAttackEnhancedProps) {
  const [selectedCharacter, setSelectedCharacter] = useState('fireboy');
  const [selectedStage, setSelectedStage] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const characters = getAllCharacters();

  const difficulties = ['easy', 'normal', 'hard', 'extreme'];
  const stages = Array.from({ length: 7 }, (_, i) => i + 1);

  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, character: 'Metal Sonic', stage: 7, time: 45000, score: 9500, difficulty: 'extreme', date: '2024-01-15' },
    { rank: 2, character: 'Fireboy', stage: 7, time: 52000, score: 8900, difficulty: 'hard', date: '2024-01-14' },
    { rank: 3, character: 'Caroline', stage: 6, time: 38000, score: 8200, difficulty: 'normal', date: '2024-01-13' },
    { rank: 4, character: 'Butch', stage: 5, time: 35000, score: 7800, difficulty: 'normal', date: '2024-01-12' },
    { rank: 5, character: 'Anabel', stage: 4, time: 32000, score: 7200, difficulty: 'easy', date: '2024-01-11' },
  ];

  const formatTime = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'normal': return 'text-blue-400';
      case 'hard': return 'text-yellow-400';
      case 'extreme': return 'text-red-400';
      default: return 'text-white';
    }
  };

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
          TIME ATTACK
        </div>
        <div className="text-slate-400 mt-1" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)' }}>
          RACE AGAINST THE CLOCK
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl z-10">
        {!showLeaderboard ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selection Panel */}
            <div className="bg-slate-900 rounded-lg p-6 border-2 border-yellow-400">
              <h3 className="text-yellow-400 mb-4" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.7rem)' }}>
                SELECT SETTINGS
              </h3>

              {/* Character Selection */}
              <div className="mb-6">
                <label className="text-slate-300 block mb-2" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                  CHARACTER
                </label>
                <select
                  value={selectedCharacter}
                  onChange={e => setSelectedCharacter(e.target.value)}
                  className="w-full bg-slate-800 text-white p-2 rounded border-2 border-slate-600 focus:border-yellow-400"
                  style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}
                >
                  {characters.map(char => (
                    <option key={char.id} value={char.id}>
                      {char.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stage Selection */}
              <div className="mb-6">
                <label className="text-slate-300 block mb-2" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                  STAGE
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {stages.map(stage => (
                    <button
                      key={stage}
                      onClick={() => setSelectedStage(stage)}
                      className={`py-2 rounded font-bold transition-all ${
                        selectedStage === stage
                          ? 'bg-yellow-500 text-black'
                          : 'bg-slate-700 text-white hover:bg-slate-600'
                      }`}
                      style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="mb-6">
                <label className="text-slate-300 block mb-2" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                  DIFFICULTY
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {difficulties.map(diff => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`py-2 rounded font-bold transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-yellow-500 text-black'
                          : 'bg-slate-700 text-white hover:bg-slate-600'
                      }`}
                      style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}
                    >
                      {diff.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={() => onStart(selectedCharacter, selectedStage, selectedDifficulty)}
                className="w-full bg-green-500 text-black py-3 rounded font-bold hover:bg-green-400 transition-all"
                style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)' }}
              >
                ▶ START TIME ATTACK
              </button>
            </div>

            {/* Info Panel */}
            <div className="bg-slate-900 rounded-lg p-6 border-2 border-slate-700">
              <h3 className="text-yellow-400 mb-4" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.7rem)' }}>
                ABOUT TIME ATTACK
              </h3>
              <div className="text-slate-300 space-y-3" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                <p>
                  <span className="text-yellow-400">⏱️ OBJECTIVE:</span> Complete the selected stage as fast as possible!
                </p>
                <p>
                  <span className="text-yellow-400">🏆 SCORING:</span> Faster times = Higher scores. Defeat enemies for bonus points.
                </p>
                <p>
                  <span className="text-yellow-400">⭐ MODIFIERS:</span> Higher difficulties increase enemy speed and damage.
                </p>
                <p>
                  <span className="text-yellow-400">📊 LEADERBOARD:</span> Compete with other players for the best times!
                </p>
              </div>

              {/* Best Times */}
              {progress && Object.keys(progress.bestTimes).length > 0 && (
                <div className="mt-6 pt-6 border-t-2 border-slate-700">
                  <h4 className="text-yellow-400 mb-3" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.6rem)' }}>
                    YOUR BEST TIMES
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(progress.bestTimes).map(([stage, time]) => (
                      <div key={stage} className="flex justify-between text-slate-300" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                        <span>Stage {stage}:</span>
                        <span className="text-yellow-400">{formatTime(time)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Leaderboard View */
          <div className="bg-slate-900 rounded-lg p-6 border-2 border-yellow-400">
            <h3 className="text-yellow-400 mb-4" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.7rem)' }}>
              GLOBAL LEADERBOARD
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-slate-300" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                <thead>
                  <tr className="border-b-2 border-yellow-400">
                    <th className="text-left py-2 px-2">RANK</th>
                    <th className="text-left py-2 px-2">CHARACTER</th>
                    <th className="text-left py-2 px-2">STAGE</th>
                    <th className="text-left py-2 px-2">TIME</th>
                    <th className="text-left py-2 px-2">SCORE</th>
                    <th className="text-left py-2 px-2">DIFFICULTY</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map(entry => (
                    <tr key={entry.rank} className="border-b border-slate-700 hover:bg-slate-800">
                      <td className="py-2 px-2 text-yellow-400 font-bold">#{entry.rank}</td>
                      <td className="py-2 px-2">{entry.character}</td>
                      <td className="py-2 px-2">{entry.stage}</td>
                      <td className="py-2 px-2 text-green-400">{formatTime(entry.time)}</td>
                      <td className="py-2 px-2 text-blue-400">{entry.score}</td>
                      <td className={`py-2 px-2 font-bold ${getDifficultyColor(entry.difficulty)}`}>
                        {entry.difficulty.toUpperCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="mt-6 z-10 flex gap-4">
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="px-6 py-3 border-2 border-blue-500 text-blue-300 rounded font-bold transition-all hover:border-blue-400 hover:text-blue-400"
          style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)' }}
        >
          {showLeaderboard ? '◄ BACK' : '🏆 LEADERBOARD'}
        </button>
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-slate-500 text-slate-300 rounded font-bold transition-all hover:border-white hover:text-white"
          style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)' }}
        >
          ◄ MAIN MENU
        </button>
      </div>
    </div>
  );
}
