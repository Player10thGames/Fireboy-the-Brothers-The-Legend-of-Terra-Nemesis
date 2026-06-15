
/**
 * Enhanced Extra Page
 * Includes achievements, unlockables, leaderboards, and game statistics
 */

import React, { useState } from 'react';
import { getAllCharacters } from '@/entities/characters';
import { getAllBosses } from '@/entities/bosses';
import { GamePersistence, PlayerProgress } from '@/lib/GamePersistence';

interface ExtraEnhancedProps {
  onBack: () => void;
  progress?: PlayerProgress;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_victory',
    name: 'First Victory',
    description: 'Defeat the first boss',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'speedrunner',
    name: 'Speedrunner',
    description: 'Complete a stage in under 30 seconds',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'perfect_run',
    name: 'Perfect Run',
    description: 'Complete all 7 stages without taking damage',
    icon: '💎',
    unlocked: false,
  },
  {
    id: 'master_of_all',
    name: 'Master of All',
    description: 'Defeat all bosses on Hard difficulty',
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'collector',
    name: 'Ring Collector',
    description: 'Collect all rings in Stage 5',
    icon: '💍',
    unlocked: false,
  },
  {
    id: 'extreme_warrior',
    name: 'Extreme Warrior',
    description: 'Complete all bosses on Extreme difficulty',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'true_hero',
    name: 'True Hero',
    description: 'Defeat the True Final Boss',
    icon: '⭐',
    unlocked: false,
  },
  {
    id: 'time_master',
    name: 'Time Master',
    description: 'Achieve the best time on all stages',
    icon: '⏱️',
    unlocked: false,
  },
];

export default function ExtraEnhanced({ onBack, progress }: ExtraEnhancedProps) {
  const [activeTab, setActiveTab] = useState<'achievements' | 'gallery' | 'stats' | 'credits'>('achievements');
  const characters = getAllCharacters();
  const bosses = getAllBosses();

  const completionPercentage = progress ? GamePersistence.getCompletionPercentage(progress) : 0;

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
          EXTRAS
        </div>
        <div className="text-slate-400 mt-1" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)' }}>
          ACHIEVEMENTS • GALLERY • STATISTICS
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 z-10 flex-wrap justify-center">
        {(['achievements', 'gallery', 'stats', 'credits'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded font-bold transition-all ${
              activeTab === tab
                ? 'bg-yellow-500 text-black'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
            style={{ fontSize: 'clamp(0.35rem, 1vw, 0.55rem)' }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="w-full max-w-4xl z-10">
        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {ACHIEVEMENTS.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? 'border-yellow-400 bg-yellow-500 bg-opacity-10'
                    : 'border-slate-600 bg-slate-900 bg-opacity-50 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2 text-center">{achievement.icon}</div>
                <div className="text-white font-bold" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                  {achievement.name}
                </div>
                <div className="text-slate-300 mt-1" style={{ fontSize: 'clamp(0.25rem, 0.7vw, 0.4rem)' }}>
                  {achievement.description}
                </div>
                {achievement.unlocked && achievement.unlockedDate && (
                  <div className="text-yellow-400 mt-2" style={{ fontSize: 'clamp(0.2rem, 0.6vw, 0.35rem)' }}>
                    Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div>
            <div className="mb-6">
              <h3 className="text-yellow-400 mb-3" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.7rem)' }}>
                PLAYABLE CHARACTERS
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {characters.map(char => (
                  <div key={char.id} className="p-4 bg-slate-900 rounded-lg border-2 border-slate-700">
                    <div className="text-white font-bold mb-2" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                      {char.name}
                    </div>
                    <div className="text-slate-300" style={{ fontSize: 'clamp(0.25rem, 0.7vw, 0.4rem)' }}>
                      HP: {char.stats.maxHealth} | SPD: {char.stats.speed} | DMG: {char.stats.damage}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-yellow-400 mb-3" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.7rem)' }}>
                BOSSES
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {bosses.map(boss => (
                  <div key={boss.stage} className="p-4 bg-slate-900 rounded-lg border-2 border-slate-700">
                    <div className="text-white font-bold mb-2" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                      Stage {boss.stage}: {boss.name}
                    </div>
                    <div className="text-slate-300" style={{ fontSize: 'clamp(0.25rem, 0.7vw, 0.4rem)' }}>
                      HP: {boss.stats.maxHealth} | DMG: {boss.stats.damage}
                    </div>
                    <div className="text-yellow-400 mt-2" style={{ fontSize: 'clamp(0.2rem, 0.6vw, 0.35rem)' }}>
                      {boss.gimmick}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="bg-slate-900 rounded-lg p-6 border-2 border-yellow-400">
            <div className="mb-6">
              <div className="text-yellow-400 mb-2" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.7rem)' }}>
                COMPLETION
              </div>
              <div className="w-full bg-slate-700 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full flex items-center justify-center transition-all"
                  style={{ width: `${completionPercentage}%` }}
                >
                  <span className="text-black font-bold" style={{ fontSize: 'clamp(0.2rem, 0.6vw, 0.35rem)' }}>
                    {Math.round(completionPercentage)}%
                  </span>
                </div>
              </div>
              <div className="text-slate-300 mt-2" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                Stages Cleared: {progress?.clearedStages.length || 0} / 7
              </div>
            </div>

            {progress && Object.keys(progress.highScores).length > 0 && (
              <div className="mb-6">
                <div className="text-yellow-400 mb-2" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.7rem)' }}>
                  HIGH SCORES
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(progress.highScores).map(([stage, score]) => (
                    <div key={stage} className="text-white" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                      Stage {stage}: <span className="text-yellow-400">{score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-yellow-400 mb-2" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.7rem)' }}>
                PLAYSTYLE
              </div>
              <div className="text-slate-300" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                Favorite Character: {progress?.favoriteCharacter || 'N/A'}
              </div>
              <div className="text-slate-300" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                Preferred Difficulty: {progress?.difficulty || 'Normal'}
              </div>
            </div>
          </div>
        )}

        {/* Credits Tab */}
        {activeTab === 'credits' && (
          <div className="bg-slate-900 rounded-lg p-6 border-2 border-yellow-400">
            <div className="text-yellow-400 mb-4" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.7rem)' }}>
              CREDITS
            </div>
            <div className="text-white space-y-3" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
              <div>
                <div className="text-yellow-400">Game Design & Development</div>
                <div className="text-slate-300">Manus AI</div>
              </div>
              <div>
                <div className="text-yellow-400">Original Series</div>
                <div className="text-slate-300">Player10thGames - Fireboy The Brothers</div>
              </div>
              <div>
                <div className="text-yellow-400">Boss Inspirations</div>
                <div className="text-slate-300">Gradius, Sonic Series, Terra Cresta, Deltarune</div>
              </div>
              <div>
                <div className="text-yellow-400">Technology</div>
                <div className="text-slate-300">React 19, TypeScript, HTML5 Canvas, Vite</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-6 z-10">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-slate-500 text-slate-300 rounded font-bold transition-all hover:border-white hover:text-white"
          style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)' }}
        >
          ◄ BACK
        </button>
      </div>
    </div>
  );
}
