/**
 * HUD Component — Boss Rush Mode
 * Displays health bars, score, stage, boss name, combo, boss phase, ring count, and character portrait
 */
import React, { useRef, useEffect } from 'react';
import { SpriteRenderer } from '@/lib/SpriteRenderer';

interface HUDProps {
  playerHealth: number;
  playerMaxHealth: number;
  bossHealth: number;
  bossMaxHealth: number;
  bossName: string;
  score: number;
  stage: number;
  character: string;
  comboCount?: number;
  bossPhase?: number;
  ringCount?: number;
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

function CharacterPortrait({ character }: { character: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 32, 32);
    try {
      switch (character) {
        case 'fireboy': SpriteRenderer.drawFireboy(ctx, 0, 0, 32, 32); break;
        case 'caroline': SpriteRenderer.drawCaroline(ctx, 0, 0, 32, 32); break;
        case 'butch': SpriteRenderer.drawButch(ctx, 0, 0, 32, 32); break;
        case 'anabel': SpriteRenderer.drawAnabel(ctx, 0, 0, 32, 32); break;
      }
    } catch {
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(4, 4, 24, 24);
    }
  }, [character]);

  return <canvas ref={canvasRef} width={32} height={32} style={{ imageRendering: 'pixelated' }} />;
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
  comboCount = 0,
  bossPhase,
  ringCount,
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
        {/* Left: Player HP with portrait */}
        <div className="flex items-start gap-2" style={{ minWidth: 160, flex: 1 }}>
          <CharacterPortrait character={character} />
          <div className="flex-1">
            <HealthBar
              value={playerHealth}
              max={playerMaxHealth}
              color="#00CC44"
              borderColor="#00AA33"
              label={`♦ ${character.toUpperCase()}`}
            />
          </div>
        </div>

        {/* Center: Stage + Score + Combo */}
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
          {comboCount > 1 && (
            <div
              className="text-orange-400 font-bold animate-pulse"
              style={{ fontSize: 'clamp(0.25rem, 0.7vw, 0.4rem)' }}
            >
              {comboCount}x COMBO
            </div>
          )}
          {bossPhase !== undefined && (stage === 6 || stage === 7) && (
            <div
              className="text-red-400"
              style={{ fontSize: 'clamp(0.25rem, 0.7vw, 0.38rem)' }}
            >
              PHASE {bossPhase + 1} / 3
            </div>
          )}
          {ringCount !== undefined && stage === 5 && (
            <div
              className="text-yellow-300"
              style={{ fontSize: 'clamp(0.25rem, 0.7vw, 0.38rem)' }}
            >
              💍 {ringCount}
            </div>
          )}
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
