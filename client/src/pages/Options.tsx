/**
 * Options Screen
 * Volume, Difficulty, Display settings
 */
import React, { useState } from 'react';

export interface OptionsSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'extreme';
  showFPS: boolean;
  screenShake: boolean;
  flashEffects: boolean;
}

const DEFAULT_OPTIONS: OptionsSettings = {
  masterVolume: 80,
  musicVolume: 70,
  sfxVolume: 80,
  difficulty: 'normal',
  showFPS: false,
  screenShake: true,
  flashEffects: true,
};

interface OptionsProps {
  onBack: () => void;
  settings?: OptionsSettings;
  onSave?: (settings: OptionsSettings) => void;
}

function VolumeSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="w-32 text-slate-300 text-right" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)' }}>
        {label}
      </div>
      <div className="flex items-center gap-2 flex-1">
        <button
          onClick={() => onChange(Math.max(0, value - 10))}
          className="w-8 h-8 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center justify-center"
          style={{ fontSize: '1rem' }}
        >
          ◄
        </button>
        <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${value}%`,
              background: `linear-gradient(90deg, #FF6B00, #FFD700)`,
            }}
          />
        </div>
        <button
          onClick={() => onChange(Math.min(100, value + 10))}
          className="w-8 h-8 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center justify-center"
          style={{ fontSize: '1rem' }}
        >
          ►
        </button>
        <div className="w-10 text-yellow-400 text-center" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)' }}>
          {value}%
        </div>
      </div>
    </div>
  );
}

const DIFFICULTIES = ['easy', 'normal', 'hard', 'extreme'] as const;
const DIFF_COLORS: Record<string, string> = {
  easy: '#00FF00',
  normal: '#FFFF00',
  hard: '#FF8C00',
  extreme: '#FF0000',
};

export default function Options({ onBack, settings = DEFAULT_OPTIONS, onSave }: OptionsProps) {
  const [opts, setOpts] = useState<OptionsSettings>({ ...settings });

  const handleSave = () => {
    if (onSave) onSave(opts);
    onBack();
  };

  const handleReset = () => {
    setOpts({ ...DEFAULT_OPTIONS });
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
      <div className="text-center mb-8">
        <div
          className="text-yellow-400 font-extrabold tracking-widest"
          style={{ fontSize: 'clamp(0.8rem, 3vw, 1.5rem)', textShadow: '0 0 20px #FFD700' }}
        >
          OPTIONS
        </div>
      </div>

      <div className="w-full max-w-lg">
        {/* Audio Section */}
        <div
          className="mb-6 p-4 rounded-lg border border-slate-700"
          style={{ background: 'rgba(0,0,0,0.6)' }}
        >
          <div
            className="text-yellow-400 font-bold mb-4 border-b border-slate-700 pb-2"
            style={{ fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}
          >
            ♪ AUDIO
          </div>
          <VolumeSlider
            label="MASTER"
            value={opts.masterVolume}
            onChange={v => setOpts(o => ({ ...o, masterVolume: v }))}
          />
          <VolumeSlider
            label="MUSIC"
            value={opts.musicVolume}
            onChange={v => setOpts(o => ({ ...o, musicVolume: v }))}
          />
          <VolumeSlider
            label="SFX"
            value={opts.sfxVolume}
            onChange={v => setOpts(o => ({ ...o, sfxVolume: v }))}
          />
        </div>

        {/* Difficulty Section */}
        <div
          className="mb-6 p-4 rounded-lg border border-slate-700"
          style={{ background: 'rgba(0,0,0,0.6)' }}
        >
          <div
            className="text-yellow-400 font-bold mb-4 border-b border-slate-700 pb-2"
            style={{ fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}
          >
            ⚔ DIFFICULTY
          </div>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map(diff => (
              <button
                key={diff}
                onClick={() => setOpts(o => ({ ...o, difficulty: diff }))}
                className="flex-1 py-2 px-3 rounded border-2 font-bold transition-all"
                style={{
                  fontSize: 'clamp(0.35rem, 1vw, 0.55rem)',
                  borderColor: opts.difficulty === diff ? DIFF_COLORS[diff] : 'rgba(255,255,255,0.2)',
                  background: opts.difficulty === diff ? `${DIFF_COLORS[diff]}22` : 'transparent',
                  color: opts.difficulty === diff ? DIFF_COLORS[diff] : '#888',
                  boxShadow: opts.difficulty === diff ? `0 0 10px ${DIFF_COLORS[diff]}` : 'none',
                }}
              >
                {diff.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="mt-3 text-slate-500" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}>
            {opts.difficulty === 'easy' && 'Reduced boss HP and damage. Great for beginners.'}
            {opts.difficulty === 'normal' && 'Standard boss HP and damage. Recommended.'}
            {opts.difficulty === 'hard' && 'Increased boss HP and damage. For veterans.'}
            {opts.difficulty === 'extreme' && 'Maximum boss HP, damage, and speed. True challenge!'}
          </div>
        </div>

        {/* Display Section */}
        <div
          className="mb-6 p-4 rounded-lg border border-slate-700"
          style={{ background: 'rgba(0,0,0,0.6)' }}
        >
          <div
            className="text-yellow-400 font-bold mb-4 border-b border-slate-700 pb-2"
            style={{ fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}
          >
            ◈ DISPLAY
          </div>
          {[
            { key: 'showFPS', label: 'SHOW FPS COUNTER' },
            { key: 'screenShake', label: 'SCREEN SHAKE' },
            { key: 'flashEffects', label: 'FLASH EFFECTS' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between mb-3">
              <div className="text-slate-300" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)' }}>
                {label}
              </div>
              <button
                onClick={() => setOpts(o => ({ ...o, [key]: !o[key as keyof OptionsSettings] }))}
                className="w-16 h-8 rounded-full border-2 relative transition-all"
                style={{
                  borderColor: opts[key as keyof OptionsSettings] ? '#FFD700' : '#444',
                  background: opts[key as keyof OptionsSettings]
                    ? 'linear-gradient(90deg, #FF6B00, #FFD700)'
                    : '#222',
                }}
              >
                <div
                  className="absolute top-1 w-6 h-6 rounded-full bg-white transition-all"
                  style={{
                    left: opts[key as keyof OptionsSettings] ? 'calc(100% - 1.75rem)' : '0.25rem',
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 py-3 border-2 border-slate-500 text-slate-300 rounded font-bold hover:border-white hover:text-white transition-all"
            style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)' }}
          >
            ◄ BACK
          </button>
          <button
            onClick={handleReset}
            className="flex-1 py-3 border-2 border-slate-600 text-slate-400 rounded font-bold hover:border-slate-400 transition-all"
            style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)' }}
          >
            RESET
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded font-bold transition-all"
            style={{
              fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)',
              background: 'linear-gradient(90deg, #FF6B00, #FFD700)',
              color: '#000',
              boxShadow: '0 0 15px #FFD700',
            }}
          >
            SAVE ►
          </button>
        </div>
      </div>
    </div>
  );
}
