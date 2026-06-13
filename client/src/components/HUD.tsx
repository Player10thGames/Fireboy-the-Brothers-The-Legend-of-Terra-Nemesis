/**
 * HUD Component — Boss Rush Mode
 * Displays health bars, score, stage, boss name, and controls hint
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

function HealthBar({
  value,
  max,
  color,
  borderColor,
  label,
}: {
  value: number;
  max: number;
  color: string;
  borderColor: string;
  label: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const barColor =
    pct > 60 ? color : pct > 30 ? '#FFD700' : '#FF4444';

  return (
    <div className="mb-1">
      <div
        className="flex justify-between mb-0.5"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}
      >
        <span className="text-slate-300">{label}</span>
        <span style={{ color: barColor }}>
          {value}/{max}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 10, background: '#1a1a3e', border: `1px solid ${borderColor}` }}
      >
        <div
          className="h-full rounded-full transition-all duration-150"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${barColor}, ${barColor}aa)`,
            boxShadow: `0 0 6px ${barColor}`,
          }}
        />
      </div>
    </div>
  );
}

const STAGE_LABELS: Record<number, string> = {
  1: 'STAGE 1',
  2: 'STAGE 2',
  3: 'STAGE 3',
  4: 'STAGE 4',
  5: 'STAGE 5',
  6: 'FINALE',
  7: 'TRUE FINALE',
};

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
  return (
    <div
      className="absolute top-0 left-0 right-0 px-3 pt-2 pb-1"
      style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)',
        pointerEvents: 'none',
      }}
    >
      <div className="flex justify-between items-start gap-4">
        {/* Left: Player HP */}
        <div style={{ minWidth: 160, flex: 1 }}>
          <HealthBar
            value={playerHealth}
            max={playerMaxHealth}
            color="#00CC44"
            borderColor="#00AA33"
            label={`♦ ${character.toUpperCase()}`}
          />
        </div>

        {/* Center: Stage + Score */}
        <div
          className="text-center flex-shrink-0"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          <div
            className="text-yellow-400 font-bold"
            style={{ fontSize: 'clamp(0.35rem, 1vw, 0.55rem)' }}
          >
            {STAGE_LABELS[stage] || `STAGE ${stage}`}
          </div>
          <div
            className="text-white"
            style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.45rem)' }}
          >
            {score.toLocaleString()}
          </div>
        </div>

        {/* Right: Boss HP */}
        <div style={{ minWidth: 160, flex: 1 }}>
          <HealthBar
            value={bossHealth}
            max={bossMaxHealth}
            color="#FF4444"
            borderColor="#CC2222"
            label={`☠ ${bossName.toUpperCase().slice(0, 16)}`}
          />
        </div>
      </div>

      {/* Controls hint (keyboard) */}
      <div
        className="text-center text-slate-600 mt-0.5"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(0.25rem, 0.6vw, 0.4rem)',
        }}
      >
        ARROWS/WASD: MOVE &nbsp;|&nbsp; SPACE/Z: FIRE &nbsp;|&nbsp; P/ESC: PAUSE
      </div>
    </div>
  );
}
