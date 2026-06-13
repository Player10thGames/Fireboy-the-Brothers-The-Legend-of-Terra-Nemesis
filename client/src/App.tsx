/**
 * App.tsx — Main Application Router
 * Boss Rush Mode — Fireboy The Brothers: The Legend of Terra Nemesis
 */
import React, { useState, useCallback } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import MainMenu from "./pages/MainMenu";
import CharacterSelect from "./pages/CharacterSelect";
import StageSelect from "./pages/StageSelect";
import Options from "./pages/Options";
import TimeAttack from "./pages/TimeAttack";
import Extra from "./pages/Extra";
import GameCanvas from "./components/GameCanvas";
import { OptionsSettings } from "./pages/Options";

type GamePhase =
  | 'mainMenu'
  | 'characterSelect'
  | 'stageSelect'
  | 'options'
  | 'timeAttack'
  | 'extra'
  | 'playing'
  | 'gameOver';

interface GameAppState {
  phase: GamePhase;
  selectedCharacter: string | null;
  startStage: number;
  isTimeAttack: boolean;
  won: boolean;
  finalScore: number;
  finalTime: number;
  clearedStages: number[];
  options: OptionsSettings;
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

function VictoryScreen({
  won,
  score,
  time,
  isTimeAttack,
  onRetry,
  onMenu,
}: {
  won: boolean;
  score: number;
  time: number;
  isTimeAttack: boolean;
  onRetry: () => void;
  onMenu: () => void;
}) {
  const formatTime = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + String(cs).padStart(2, '0');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: won
          ? 'radial-gradient(ellipse at center, #0a2e0a 0%, #000000 100%)'
          : 'radial-gradient(ellipse at center, #2e0a0a 0%, #000000 100%)',
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
      }}
    >
      <div className="text-center px-4">
        <div
          className="font-extrabold mb-4"
          style={{
            fontSize: 'clamp(1.5rem, 6vw, 4rem)',
            color: won ? '#00FF00' : '#FF0000',
            textShadow: won ? '0 0 30px #00FF00' : '0 0 30px #FF0000',
          }}
        >
          {won ? '★ VICTORY! ★' : 'GAME OVER'}
        </div>

        {won && (
          <div
            className="text-yellow-400 mb-6"
            style={{ fontSize: 'clamp(0.5rem, 1.5vw, 0.8rem)' }}
          >
            ALL BOSSES DEFEATED!
          </div>
        )}

        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            background: 'rgba(0,0,0,0.6)',
            borderColor: won ? '#00FF00' : '#FF4444',
          }}
        >
          <div className="flex justify-between gap-8">
            <div>
              <div className="text-slate-400 mb-1" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.5rem)' }}>SCORE</div>
              <div className="text-yellow-400 font-bold" style={{ fontSize: 'clamp(0.6rem, 2vw, 1rem)' }}>
                {score.toLocaleString()}
              </div>
            </div>
            {isTimeAttack && (
              <div>
                <div className="text-slate-400 mb-1" style={{ fontSize: 'clamp(0.35rem, 1vw, 0.5rem)' }}>TIME</div>
                <div className="text-green-400 font-bold" style={{ fontSize: 'clamp(0.6rem, 2vw, 1rem)' }}>
                  {formatTime(time)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={onRetry}
            className="px-6 py-3 rounded font-bold transition-all"
            style={{
              fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)',
              background: 'linear-gradient(90deg, #FF6B00, #FFD700)',
              color: '#000',
              boxShadow: '0 0 15px #FFD700',
            }}
          >
            ► RETRY
          </button>
          <button
            onClick={onMenu}
            className="px-6 py-3 rounded font-bold border-2 border-slate-500 text-slate-300 hover:border-white hover:text-white transition-all"
            style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)' }}
          >
            ◄ MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}

function GameApp() {
  const [state, setState] = useState<GameAppState>({
    phase: 'mainMenu',
    selectedCharacter: null,
    startStage: 1,
    isTimeAttack: false,
    won: false,
    finalScore: 0,
    finalTime: 0,
    clearedStages: [],
    options: DEFAULT_OPTIONS,
  });

  const goTo = useCallback((phase: GamePhase, extra?: Partial<GameAppState>) => {
    setState(prev => ({ ...prev, phase, ...extra }));
  }, []);

  const handleCharacterSelected = useCallback((characterId: string) => {
    setState(prev => ({ ...prev, selectedCharacter: characterId, phase: 'playing' }));
  }, []);

  const handleGameOver = useCallback((won: boolean, score = 0, time = 0) => {
    setState(prev => ({
      ...prev,
      phase: 'gameOver',
      won,
      finalScore: score,
      finalTime: time,
      clearedStages: won ? [...new Set([...prev.clearedStages, ...Array.from({ length: 7 }, (_, i) => i + 1)])] : prev.clearedStages,
    }));
  }, []);

  const handleRetry = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'characterSelect',
    }));
  }, []);

  const handleSaveOptions = useCallback((opts: OptionsSettings) => {
    setState(prev => ({ ...prev, options: opts }));
  }, []);

  const handleTimeAttackStart = useCallback((startStage: number) => {
    setState(prev => ({
      ...prev,
      phase: 'characterSelect',
      startStage,
      isTimeAttack: true,
    }));
  }, []);

  const handleStageSelected = useCallback((stage: number) => {
    setState(prev => ({
      ...prev,
      startStage: stage,
      phase: 'characterSelect',
      isTimeAttack: false,
    }));
  }, []);

  switch (state.phase) {
    case 'mainMenu':
      return (
        <MainMenu
          onStartGame={() => goTo('characterSelect', { startStage: 1, isTimeAttack: false })}
          onStageSelect={() => goTo('stageSelect')}
          onOptions={() => goTo('options')}
          onTimeAttack={() => goTo('timeAttack')}
          onExtra={() => goTo('extra')}
        />
      );

    case 'stageSelect':
      return (
        <StageSelect
          onStageSelected={handleStageSelected}
          onBack={() => goTo('mainMenu')}
          clearedStages={state.clearedStages}
        />
      );

    case 'options':
      return (
        <Options
          onBack={() => goTo('mainMenu')}
          settings={state.options}
          onSave={handleSaveOptions}
        />
      );

    case 'timeAttack':
      return (
        <TimeAttack
          onStartTimeAttack={handleTimeAttackStart}
          onBack={() => goTo('mainMenu')}
        />
      );

    case 'extra':
      return (
        <Extra
          onBack={() => goTo('mainMenu')}
          clearedStages={state.clearedStages}
        />
      );

    case 'characterSelect':
      return (
        <CharacterSelect
          onCharacterSelected={handleCharacterSelected}
        />
      );

    case 'playing':
      return state.selectedCharacter ? (
        <GameCanvas
          characterId={state.selectedCharacter}
          onGameOver={handleGameOver}
          startStage={state.startStage}
          isTimeAttack={state.isTimeAttack}
          options={state.options}
        />
      ) : null;

    case 'gameOver':
      return (
        <VictoryScreen
          won={state.won}
          score={state.finalScore}
          time={state.finalTime}
          isTimeAttack={state.isTimeAttack}
          onRetry={handleRetry}
          onMenu={() => goTo('mainMenu')}
        />
      );

    default:
      return null;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <GameApp />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
