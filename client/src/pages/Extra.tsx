/**
 * Extra Screen
 * Gallery, Boss Dossier, Credits, and Unlockables
 */
import React, { useState, useRef, useEffect } from 'react';
import { getAllBosses } from '@/entities/bosses';
import { getAllCharacters } from '@/entities/characters';
import { SpriteRenderer } from '@/lib/SpriteRenderer';

interface ExtraProps {
  onBack: () => void;
  clearedStages?: number[];
}

type ExtraTab = 'gallery' | 'dossier' | 'credits' | 'secrets' | 'stats' | 'controls';

function BossPortrait({ stage }: { stage: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 64, 64);
    try {
      switch (stage) {
        case 1: SpriteRenderer.drawDoubleMechaRocket(ctx, 0, 0, 64, 64); break;
        case 2: SpriteRenderer.drawButchBoss(ctx, 0, 0, 64, 64); break;
        case 3: SpriteRenderer.drawMandler(ctx, 0, 0, 64, 64); break;
        case 4: SpriteRenderer.drawCrusherBot(ctx, 0, 0, 64, 64); break;
        case 5: SpriteRenderer.drawMetalSonic(ctx, 0, 0, 64, 64); break;
        case 6: SpriteRenderer.drawRoaringKnight(ctx, 0, 0, 64, 64); break;
        case 7: SpriteRenderer.drawRoaringMetal(ctx, 0, 0, 64, 64); break;
      }
    } catch {
      ctx.fillStyle = '#555';
      ctx.fillRect(8, 8, 48, 48);
    }
  }, [stage]);
  return <canvas ref={canvasRef} width={64} height={64} style={{ imageRendering: 'pixelated' }} />;
}

function CharPortrait({ id }: { id: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 64, 64);
    try {
      switch (id) {
        case 'fireboy': SpriteRenderer.drawFireboy(ctx, 0, 0, 64, 64); break;
        case 'caroline': SpriteRenderer.drawCaroline(ctx, 0, 0, 64, 64); break;
        case 'butch': SpriteRenderer.drawButch(ctx, 0, 0, 64, 64); break;
        case 'anabel': SpriteRenderer.drawAnabel(ctx, 0, 0, 64, 64); break;
      }
    } catch {
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(8, 8, 48, 48);
    }
  }, [id]);
  return <canvas ref={canvasRef} width={64} height={64} style={{ imageRendering: 'pixelated' }} />;
}

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
    { id: 'stats', label: '📊 STATS' },
    { id: 'dossier', label: '📋 DOSSIER' },
    { id: 'controls', label: '🎮 CONTROLS' },
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
                    <CharPortrait id={char.id} />
                    <div className="text-white text-center mt-1" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
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
                      <BossPortrait stage={boss.stage} />
                      <div className="text-white text-center leading-tight mt-1" style={{ fontSize: 'clamp(0.25rem, 0.7vw, 0.4rem)' }}>
                        {boss.name.split(' ').slice(0, 2).join(' ')}
                      </div>
                      {isCleared && (
                        <div
                          className="absolute top-1 right-1 px-1 rounded font-bold"
                          style={{ fontSize: 'clamp(0.2rem, 0.6vw, 0.35rem)', background: '#00CC44', color: '#000' }}
                        >
                          DEFEATED
                        </div>
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

        {/* Character Stats Tab */}
        {activeTab === 'stats' && (
          <div
            className="p-4 rounded-lg border border-slate-700"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            <div
              className="text-yellow-400 font-bold mb-4 border-b border-slate-700 pb-2"
              style={{ fontSize: 'clamp(0.45rem, 1.3vw, 0.65rem)' }}
            >
              CHARACTER STATS
            </div>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-2 text-left text-yellow-400">STAT</th>
                    {characters.map(c => (
                      <th key={c.id} className="py-2 text-center" style={{ color: c.color }}>{c.name.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-800">
                    <td className="py-1 text-slate-400">HP</td>
                    {characters.map(c => <td key={c.id} className="py-1 text-center">{c.stats.maxHealth}</td>)}
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-1 text-slate-400">SPEED</td>
                    {characters.map(c => <td key={c.id} className="py-1 text-center">{c.stats.speed}</td>)}
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-1 text-slate-400">DAMAGE</td>
                    {characters.map(c => <td key={c.id} className="py-1 text-center">{c.stats.damage}</td>)}
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-1 text-slate-400">FIRE RATE</td>
                    {characters.map(c => <td key={c.id} className="py-1 text-center">{c.stats.fireRate}ms</td>)}
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-400">TYPE</td>
                    {characters.map(c => (
                      <td key={c.id} className="py-1 text-center">
                        {c.id === 'fireboy' ? 'RAPID' : c.id === 'caroline' ? 'SPREAD' : c.id === 'butch' ? 'MELEE' : 'HOMING'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Controls Tab */}
        {activeTab === 'controls' && (
          <div
            className="p-4 rounded-lg border border-slate-700"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            <div
              className="text-yellow-400 font-bold mb-4 border-b border-slate-700 pb-2"
              style={{ fontSize: 'clamp(0.45rem, 1.3vw, 0.65rem)' }}
            >
              CONTROLS
            </div>
            <div className="space-y-4" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
              <div>
                <div className="text-yellow-400 mb-2 font-bold">KEYBOARD</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Arrow Keys / WASD</div><div className="text-right">Move</div>
                  <div>Space / Z</div><div className="text-right">Fire</div>
                  <div>P / Escape</div><div className="text-right">Pause</div>
                  <div>Enter</div><div className="text-right">Confirm / Skip</div>
                </div>
              </div>
              <div>
                <div className="text-yellow-400 mb-2 font-bold">TOUCH</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>D-Pad (left)</div><div className="text-right">Move</div>
                  <div>A Button (right)</div><div className="text-right">Fire</div>
                  <div>Pause Button (top)</div><div className="text-right">Pause</div>
                  <div>Tap Screen</div><div className="text-right">Skip Cutscene</div>
                </div>
              </div>
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
            <div className="mt-4 pt-3 border-t border-slate-700">
              <div className="text-yellow-400 mb-2" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>INSPIRATIONS</div>
              <div className="text-slate-400" style={{ fontSize: 'clamp(0.25rem, 0.7vw, 0.4rem)' }}>
                Gradius (Konami) • Sonic the Hedgehog (Sega) • Terra Cresta (Nichibutsu) • Deltarune (Toby Fox)
              </div>
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
