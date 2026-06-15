/**
 * Time Attack Screen
 * Race against the clock to defeat all bosses
 * Stores top 5 times per stage in localStorage
 */
import React, { useState, useMemo } from 'react';
import { getAllBosses } from '@/entities/bosses';

export interface TimeAttackRecord {
  stage: number;
  time: number;
  character: string;
  date: string;
}

interface TimeAttackProps {
  onStartTimeAttack: (startStage: number) => void;
  onBack: () => void;
  records?: TimeAttackRecord[];
}

const STORAGE_KEY = 'terra-nemesis-times';

export function loadTimeAttackRecords(): TimeAttackRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as TimeAttackRecord[];
  } catch { /* ignore */ }
  return [];
}

export function saveTimeAttackRecord(record: TimeAttackRecord): boolean {
  const records = loadTimeAttackRecords();
  const stageRecords = records.filter(r => r.stage === record.stage);
  const isNewRecord = stageRecords.length < 5 || stageRecords.some(r => r.time > record.time);
  records.push(record);
  records.sort((a, b) => a.time - b.time);
  // Keep top 5 per stage
  const grouped: Record<number, TimeAttackRecord[]> = {};
  for (const r of records) {
    if (!grouped[r.stage]) grouped[r.stage] = [];
    if (grouped[r.stage].length < 5) grouped[r.stage].push(r);
  }
  const flat = Object.values(grouped).flat();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flat));
  } catch { /* ignore */ }
  return isNewRecord;
}

function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

const BOSS_NAMES = [
  'Duo Mecha Rocket',
  'Butch',
  'Mandler',
  'Crusher-Bot MK.II',
  'Metal Sonic',
  'Roaring Knight',
  'Roaring Metal',
];

export default function TimeAttack({ onStartTimeAttack, onBack }: TimeAttackProps) {
  const [selectedMode, setSelectedMode] = useState<'full' | 'single'>('full');
  const [selectedStage, setSelectedStage] = useState(1);
  const bosses = getAllBosses();

  const records = useMemo(() => loadTimeAttackRecords(), []);

  const handleStart = () => {
    onStartTimeAttack(selectedMode === 'full' ? 1 : selectedStage);
  };

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
          ⏱ TIME ATTACK
        </div>
        <div className="text-slate-400 mt-1" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.55rem)' }}>
          DEFEAT ALL BOSSES AS FAST AS POSSIBLE
        </div>
      </div>

      <div className="w-full max-w-lg">
        {/* Mode Selection */}
        <div
          className="mb-4 p-4 rounded-lg border border-slate-700"
          style={{ background: 'rgba(0,0,0,0.6)' }}
        >
          <div
            className="text-yellow-400 font-bold mb-3 border-b border-slate-700 pb-2"
            style={{ fontSize: 'clamp(0.45rem, 1.3vw, 0.65rem)' }}
          >
            MODE
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedMode('full')}
              className="flex-1 py-3 rounded border-2 font-bold transition-all"
              style={{
                fontSize: 'clamp(0.35rem, 1vw, 0.55rem)',
                borderColor: selectedMode === 'full' ? '#FFD700' : 'rgba(255,255,255,0.2)',
                background: selectedMode === 'full' ? 'rgba(255,215,0,0.15)' : 'transparent',
                color: selectedMode === 'full' ? '#FFD700' : '#888',
              }}
            >
              FULL RUN<br />
              <span style={{ fontSize: '0.7em', color: '#666' }}>ALL 7 BOSSES</span>
            </button>
            <button
              onClick={() => setSelectedMode('single')}
              className="flex-1 py-3 rounded border-2 font-bold transition-all"
              style={{
                fontSize: 'clamp(0.35rem, 1vw, 0.55rem)',
                borderColor: selectedMode === 'single' ? '#FFD700' : 'rgba(255,255,255,0.2)',
                background: selectedMode === 'single' ? 'rgba(255,215,0,0.15)' : 'transparent',
                color: selectedMode === 'single' ? '#FFD700' : '#888',
              }}
            >
              SINGLE BOSS<br />
              <span style={{ fontSize: '0.7em', color: '#666' }}>1 STAGE ONLY</span>
            </button>
          </div>

          {selectedMode === 'single' && (
            <div className="mt-3">
              <div className="text-slate-400 mb-2" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.5rem)' }}>
                SELECT STAGE:
              </div>
              <div className="grid grid-cols-4 gap-2">
                {bosses.map(boss => (
                  <button
                    key={boss.stage}
                    onClick={() => setSelectedStage(boss.stage)}
                    className="py-2 rounded border font-bold transition-all"
                    style={{
                      fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)',
                      borderColor: selectedStage === boss.stage ? '#FFD700' : '#333',
                      background: selectedStage === boss.stage ? 'rgba(255,215,0,0.2)' : 'rgba(0,0,0,0.4)',
                      color: selectedStage === boss.stage ? '#FFD700' : '#888',
                    }}
                  >
                    {boss.stage === 6 ? 'FINAL' : boss.stage === 7 ? 'TRUE' : `ST.${boss.stage}`}
                  </button>
                ))}
              </div>
              {selectedMode === 'single' && (
                <div className="mt-2 text-slate-400" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
                  Boss: {BOSS_NAMES[selectedStage - 1]}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rules */}
        <div
          className="mb-4 p-4 rounded-lg border border-slate-700"
          style={{ background: 'rgba(0,0,0,0.6)' }}
        >
          <div
            className="text-yellow-400 font-bold mb-3 border-b border-slate-700 pb-2"
            style={{ fontSize: 'clamp(0.45rem, 1.3vw, 0.65rem)' }}
          >
            RULES
          </div>
          <ul className="text-slate-400 space-y-1" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
            <li>• Timer starts when battle begins</li>
            <li>• Timer stops when final boss is defeated</li>
            <li>• No continues — game over resets timer</li>
            <li>• Best time is saved automatically</li>
            <li>• Difficulty affects boss HP and speed</li>
          </ul>
        </div>

        {/* Leaderboard */}
        <div
          className="mb-6 p-4 rounded-lg border border-slate-700"
          style={{ background: 'rgba(0,0,0,0.6)' }}
        >
          <div
            className="text-yellow-400 font-bold mb-3 border-b border-slate-700 pb-2"
            style={{ fontSize: 'clamp(0.45rem, 1.3vw, 0.65rem)' }}
          >
            🏆 BEST TIMES
          </div>
          {records.length === 0 ? (
            <div className="text-slate-600 text-center py-4" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.5rem)' }}>
              NO RECORDS YET — BE THE FIRST!
            </div>
          ) : (
            <div className="space-y-2">
              {records.sort((a, b) => a.time - b.time).slice(0, 5).map((rec, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1 border-b border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <span
                      style={{
                        fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)',
                        color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#666',
                      }}
                    >
                      #{i + 1}
                    </span>
                    <span className="text-slate-300" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
                      {rec.character}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.55rem)' }}>
                      {formatTime(rec.time)}
                    </div>
                    <div className="text-slate-600" style={{ fontSize: 'clamp(0.25rem, 0.7vw, 0.4rem)' }}>
                      {rec.stage === 7 ? 'FULL RUN' : `TO STAGE ${rec.stage}`} • {rec.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 py-3 border-2 border-slate-500 text-slate-300 rounded font-bold hover:border-white hover:text-white transition-all"
            style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)' }}
          >
            ◄ BACK
          </button>
          <button
            onClick={handleStart}
            className="flex-1 py-3 rounded font-bold transition-all"
            style={{
              fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)',
              background: 'linear-gradient(90deg, #FF6B00, #FFD700)',
              color: '#000',
              boxShadow: '0 0 15px #FFD700',
            }}
          >
            ► START!
          </button>
        </div>
      </div>
    </div>
  );
}
