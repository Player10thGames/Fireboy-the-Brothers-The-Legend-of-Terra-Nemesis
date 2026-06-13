/**
 * Extra Screen
 * Gallery, Boss Dossier, Credits, and Unlockables
 */
import React, { useState } from 'react';
import { getAllBosses } from '@/entities/bosses';
import { getAllCharacters } from '@/entities/characters';

interface ExtraProps {
  onBack: () => void;
  clearedStages?: number[];
}

type ExtraTab = 'gallery' | 'dossier' | 'credits' | 'secrets';

const BOSS_LORE: Record<number, string> = {
  1: 'The Duo Mecha Rocket is a fusion of Big Core MK.I from the Gradius galaxy and Fire Breath from the Sonic dimension. When two mechanical terrors from different worlds merge, the result is a relentless barrage of lasers and flame.',
  2: 'Butch of the Rowdyruff Boys has gone rogue. Fueled by Chemical X and pure rage, he charges without mercy. His explosive punches can shatter the arena itself.',
  3: 'Mandler hails from the ancient world of Terra Cresta. A rotating sentinel of destruction, it fires spiraling projectiles that warp gravity itself.',
  4: 'Crusher-Bot MK.II is a prototype war machine built by the Terra Nemesis Corporation. Its shockwave stomps can push even the most seasoned fighter off the platform.',
  5: 'Metal Sonic — the ultimate mechanical rival. Faster than sound, armed with homing missiles, and capable of copying any ability. He has only one directive: destroy.',
  6: 'The Roaring Knight emerged from the Dark World of Deltarune. A knight of pure darkness, its sword can cleave through dimensions. At low health, it enters a berserk phase that defies all logic.',
  7: 'Roaring Metal is the impossible fusion of the Roaring Knight and Metal Sonic. Two supreme beings merged into one unstoppable force. This is the true final challenge of the Legend of Terra Nemesis.',
};

const CREDITS = [
  { role: 'Game Design & Programming', name: 'Player10thGames' },
  { role: 'Boss AI Architecture', name: 'Manus AI' },
  { role: 'Original Characters', name: 'Fireboy The Brothers Team' },
  { role: 'Big Core MK.I', name: '© Konami (Gradius Series)' },
  { role: 'Fire Breath', name: '© Sega (Sonic the Hedgehog 3)' },
  { role: 'Butch', name: '© Cartoon Network (The Powerpuff Girls)' },
  { role: 'Mandler', name: '© Nichibutsu (Terra Cresta)' },
  { role: 'Metal Sonic', name: '© Sega (Sonic the Hedgehog Series)' },
  { role: 'Roaring Knight', name: '© Toby Fox (Deltarune)' },
  { role: 'Boss Battle Music', name: '"Last Evil" — Gradius Series' },
  { role: 'Game Over Music', name: 'Original Composition' },
  { role: 'Stage Clear Music', name: 'Original Composition' },
  { role: 'Special Thanks', name: 'All Fans of Boss Rush Games' },
];

const SECRETS = [
  { id: 'clear_all', label: 'BOSS RUSH COMPLETE', desc: 'Defeat all 7 bosses in a single run', unlocked: false },
  { id: 'no_damage', label: 'UNTOUCHABLE', desc: 'Clear any stage without taking damage', unlocked: false },
  { id: 'speed_run', label: 'SPEED DEMON', desc: 'Complete a full run in under 3 minutes', unlocked: false },
  { id: 'all_chars', label: 'TEAM EFFORT', desc: 'Clear Stage 1 with all 4 characters', unlocked: false },
  { id: 'true_ending', label: 'LEGEND OF TERRA NEMESIS', desc: 'Defeat Roaring Metal on Extreme difficulty', unlocked: false },
];

export default function Extra({ onBack, clearedStages = [] }: ExtraProps) {
  const [activeTab, setActiveTab] = useState<ExtraTab>('gallery');
  const [selectedBoss, setSelectedBoss] = useState(1);
  const bosses = getAllBosses();
  const characters = getAllCharacters();

  const tabs: { id: ExtraTab; label: string }[] = [
    { id: 'gallery', label: '🖼 GALLERY' },
    { id: 'dossier', label: '📋 DOSSIER' },
    { id: 'secrets', label: '🔒 SECRETS' },
    { id: 'credits', label: '📜 CREDITS' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start pt-8 pb-6 px-4"
      style={{
        background: 'radial-gradient(ellipse at center, #0a0a2e 0%, #000000 100%)',
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
      }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div
          className="text-yellow-400 font-extrabold tracking-widest"
          style={{ fontSize: 'clamp(0.8rem, 3vw, 1.5rem)', textShadow: '0 0 20px #FFD700' }}
        >
          EXTRA
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 w-full max-w-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2 rounded border font-bold transition-all"
            style={{
              fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)',
              borderColor: activeTab === tab.id ? '#FFD700' : '#333',
              background: activeTab === tab.id ? 'rgba(255,215,0,0.15)' : 'rgba(0,0,0,0.5)',
              color: activeTab === tab.id ? '#FFD700' : '#666',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-lg flex-1">
        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div
            className="p-4 rounded-lg border border-slate-700"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            <div
              className="text-yellow-400 font-bold mb-4 border-b border-slate-700 pb-2"
              style={{ fontSize: 'clamp(0.45rem, 1.3vw, 0.65rem)' }}
            >
              CHARACTERS & BOSSES
            </div>
            <div className="mb-4">
              <div className="text-slate-400 mb-2" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.5rem)' }}>
                PLAYABLE CHARACTERS
              </div>
              <div className="grid grid-cols-4 gap-2">
                {characters.map(char => (
                  <div
                    key={char.id}
                    className="rounded-lg p-3 border border-slate-700 flex flex-col items-center"
                    style={{ background: `${char.color}22` }}
                  >
                    <div
                      className="w-12 h-12 rounded-full mb-2 flex items-center justify-center font-bold text-white"
                      style={{ background: char.color, fontSize: '1.2rem' }}
                    >
                      {char.name.charAt(0)}
                    </div>
                    <div className="text-white text-center" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
                      {char.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-slate-400 mb-2" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.5rem)' }}>
                BOSSES
              </div>
              <div className="grid grid-cols-4 gap-2">
                {bosses.map(boss => {
                  const isCleared = clearedStages.includes(boss.stage);
                  return (
                    <div
                      key={boss.stage}
                      className="rounded-lg p-2 border border-slate-700 flex flex-col items-center relative"
                      style={{ background: `${boss.color}22` }}
                    >
                      <div
                        className="w-12 h-12 rounded mb-1 flex items-center justify-center font-bold text-white"
                        style={{ background: boss.color, fontSize: '0.6rem' }}
                      >
                        {boss.stage === 7 ? 'TRUE' : boss.stage === 6 ? 'FINAL' : `S${boss.stage}`}
                      </div>
                      <div className="text-white text-center leading-tight" style={{ fontSize: 'clamp(0.25rem, 0.7vw, 0.4rem)' }}>
                        {boss.name.split(' ').slice(0, 2).join(' ')}
                      </div>
                      {isCleared && (
                        <div className="absolute top-1 right-1 text-green-400" style={{ fontSize: '0.5rem' }}>✓</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Dossier Tab */}
        {activeTab === 'dossier' && (
          <div
            className="p-4 rounded-lg border border-slate-700"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            <div
              className="text-yellow-400 font-bold mb-4 border-b border-slate-700 pb-2"
              style={{ fontSize: 'clamp(0.45rem, 1.3vw, 0.65rem)' }}
            >
              BOSS DOSSIER
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {bosses.map(boss => (
                <button
                  key={boss.stage}
                  onClick={() => setSelectedBoss(boss.stage)}
                  className="py-2 rounded border font-bold transition-all"
                  style={{
                    fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)',
                    borderColor: selectedBoss === boss.stage ? boss.color : '#333',
                    background: selectedBoss === boss.stage ? `${boss.color}33` : 'transparent',
                    color: selectedBoss === boss.stage ? boss.color : '#666',
                  }}
                >
                  {boss.stage === 7 ? 'TRUE' : boss.stage === 6 ? 'FINAL' : `S${boss.stage}`}
                </button>
              ))}
            </div>
            {bosses.filter(b => b.stage === selectedBoss).map(boss => (
              <div key={boss.stage}>
                <div
                  className="font-bold mb-2"
                  style={{ fontSize: 'clamp(0.45rem, 1.3vw, 0.65rem)', color: boss.color }}
                >
                  {boss.name.toUpperCase()}
                </div>
                <div className="text-slate-300 leading-relaxed mb-3" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.5rem)' }}>
                  {BOSS_LORE[boss.stage]}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-slate-400" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
                    <span className="text-yellow-400">HP:</span> {boss.stats.maxHealth}
                  </div>
                  <div className="text-slate-400" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
                    <span className="text-yellow-400">DMG:</span> {boss.stats.damage}
                  </div>
                  <div className="text-slate-400" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
                    <span className="text-yellow-400">SPD:</span> {boss.stats.speed}
                  </div>
                  <div className="text-slate-400" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
                    <span className="text-yellow-400">PATTERNS:</span> 3
                  </div>
                </div>
                <div className="mt-3 text-slate-400" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
                  <span className="text-yellow-400">GIMMICK:</span> {boss.gimmick}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Secrets Tab */}
        {activeTab === 'secrets' && (
          <div
            className="p-4 rounded-lg border border-slate-700"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            <div
              className="text-yellow-400 font-bold mb-4 border-b border-slate-700 pb-2"
              style={{ fontSize: 'clamp(0.45rem, 1.3vw, 0.65rem)' }}
            >
              🔒 SECRET ACHIEVEMENTS
            </div>
            <div className="space-y-3">
              {SECRETS.map(secret => (
                <div
                  key={secret.id}
                  className="p-3 rounded border"
                  style={{
                    borderColor: secret.unlocked ? '#FFD700' : '#333',
                    background: secret.unlocked ? 'rgba(255,215,0,0.1)' : 'rgba(0,0,0,0.4)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: '0.8rem' }}>{secret.unlocked ? '🏆' : '🔒'}</span>
                    <span
                      style={{
                        fontSize: 'clamp(0.35rem, 1vw, 0.55rem)',
                        color: secret.unlocked ? '#FFD700' : '#666',
                      }}
                    >
                      {secret.label}
                    </span>
                  </div>
                  <div
                    className="text-slate-500"
                    style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}
                  >
                    {secret.unlocked ? secret.desc : '???'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credits Tab */}
        {activeTab === 'credits' && (
          <div
            className="p-4 rounded-lg border border-slate-700 overflow-y-auto"
            style={{ background: 'rgba(0,0,0,0.6)', maxHeight: '60vh' }}
          >
            <div
              className="text-yellow-400 font-bold mb-4 border-b border-slate-700 pb-2 text-center"
              style={{ fontSize: 'clamp(0.45rem, 1.3vw, 0.65rem)' }}
            >
              CREDITS
            </div>
            <div className="text-center mb-4">
              <div className="text-white font-bold" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)' }}>
                FIREBOY THE BROTHERS
              </div>
              <div className="text-slate-400" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
                THE LEGEND OF TERRA NEMESIS
              </div>
              <div className="text-red-400 font-bold mt-1" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.5rem)' }}>
                BOSS RUSH MODE
              </div>
            </div>
            <div className="space-y-3">
              {CREDITS.map((credit, i) => (
                <div key={i} className="border-b border-slate-800 pb-2">
                  <div className="text-slate-500" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.4rem)' }}>
                    {credit.role}
                  </div>
                  <div className="text-white" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.5rem)' }}>
                    {credit.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6 text-slate-600" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.4rem)' }}>
              © 2025 PLAYER10THGAMES<br />
              ALL RIGHTS RESERVED<br />
              MADE WITH ♥ FOR BOSS RUSH FANS
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="mt-6 px-8 py-3 border-2 border-slate-500 text-slate-300 rounded font-bold hover:border-white hover:text-white transition-all"
        style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)' }}
      >
        ◄ BACK TO MENU
      </button>
    </div>
  );
}
