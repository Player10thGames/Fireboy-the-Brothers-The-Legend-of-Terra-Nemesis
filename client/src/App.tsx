import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CharacterSelect from "./pages/CharacterSelect";
import GameCanvas from "./components/GameCanvas";
import { useState } from "react";

type GamePhase = 'menu' | 'characterSelect' | 'playing' | 'gameOver';

interface GameStateType {
  phase: GamePhase;
  selectedCharacter: string | null;
  won: boolean;
}

function GameApp() {
  const [gameState, setGameState] = useState<GameStateType>({
    phase: 'menu',
    selectedCharacter: null,
    won: false,
  });

  const handleCharacterSelected = (characterId: string) => {
    setGameState({
      phase: 'playing',
      selectedCharacter: characterId,
      won: false,
    });
  };

  const handleGameOver = (won: boolean) => {
    setGameState(prev => ({
      ...prev,
      phase: 'gameOver',
      won,
    }));
  };

  const handleReturnToMenu = () => {
    setGameState({
      phase: 'menu',
      selectedCharacter: null,
      won: false,
    });
  };

  if (gameState.phase === 'characterSelect') {
    return <CharacterSelect onCharacterSelected={handleCharacterSelected} />;
  }

  if (gameState.phase === 'playing' && gameState.selectedCharacter) {
    return (
      <GameCanvas 
        characterId={gameState.selectedCharacter} 
        onGameOver={handleGameOver}
      />
    );
  }

  if (gameState.phase === 'gameOver') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className={`text-6xl font-bold mb-4 ${gameState.won ? 'text-green-400' : 'text-red-400'}`}>
            {gameState.won ? 'VICTORY!' : 'GAME OVER'}
          </h1>
          <p className="text-2xl text-slate-300 mb-8">
            {gameState.won ? 'You defeated the boss!' : 'You were defeated...'}
          </p>
          <button
            onClick={handleReturnToMenu}
            className="px-8 py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            RETURN TO MENU
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-2">
          FIREBOY BOSS RUSH
        </h1>
        <p className="text-2xl text-slate-300 mb-8">
          The Legend of Terra Nemesis
        </p>
        <p className="text-lg text-slate-400 mb-8">
          Face 7 challenging bosses in this action-packed arcade game
        </p>
        <button
          onClick={() => setGameState(prev => ({ ...prev, phase: 'characterSelect' }))}
          className="px-8 py-3 text-lg font-bold bg-green-600 hover:bg-green-700 text-white rounded"
        >
          START GAME
        </button>
      </div>
    </div>
  );
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
