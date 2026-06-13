/**
 * Main Menu Screen
 * Boss Rush Mode - Fireboy The Brothers: The Legend of Terra Nemesis
 */
import React, { useState, useEffect } from 'react';

interface MainMenuProps {
  onStartGame: () => void;
  onStageSelect: () => void;
  onOptions: () => void;
  onTimeAttack: () => void;
  onExtra: () => void;
}

export default function MainMenu({ onStartGame, onStageSelect, onOptions, onTimeAttack, onExtra }: MainMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flash, setFlash] = useState(true);

  const menuItems = [
    { label: 'START GAME', action: onStartGame },
    { label: 'STAGE SELECT', action: onStageSelect },
    { label: 'TIME ATTACK', action: onTimeAttack },
    { label: 'OPTIONS', action: onOptions },
    { label: 'EXTRA', action: onExtra },
  ];

  useEffect(() => {
    const flashInterval = setInterval(() => setFlash(f => !f), 500);
    return () => clearInterval(flashInterval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSelectedIndex(i => (i - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex(i => (i + 1) % menuItems.length);
      } else if (e.key === 'Enter' || e.key === ' ') {
        menuItems[selectedIndex].action();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, menuItems]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0a0a2e 0%, #000000 100%)',
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
      }}
    >
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="text-center mb-2 z-10">
        <div
          className="text-yellow-400 font-extrabold tracking-widest mb-1"
          style={{ fontSize: 'clamp(1.2rem, 4vw, 2.5rem)', textShadow: '0 0 20px #FFD700, 0 0 40px #FF8C00' }}
        >
          FIREBOY THE BROTHERS
        </div>
        <div
          className="text-white font-bold tracking-wider mb-1"
          style={{ fontSize: 'clamp(0.6rem, 2vw, 1rem)', textShadow: '0 0 10px #fff' }}
        >
          THE LEGEND OF TERRA NEMESIS
        </div>
        <div
          className="text-red-400 font-bold tracking-widest"
          style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1.4rem)', textShadow: '0 0 15px #FF0000' }}
        >
          ★ BOSS RUSH MODE ★
        </div>
      </div>

      {/* Decorative divider */}
      <div className="w-64 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-8 z-10" />

      {/* Menu Items */}
      <div className="flex flex-col items-center gap-3 z-10 w-full max-w-xs">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            onClick={item.action}
            onMouseEnter={() => setSelectedIndex(index)}
            className="w-full py-3 px-6 text-center font-bold tracking-widest transition-all duration-150 border-2 rounded"
            style={{
              fontSize: 'clamp(0.55rem, 1.8vw, 0.85rem)',
              background: selectedIndex === index
                ? 'linear-gradient(90deg, #FF6B00, #FFD700)'
                : 'rgba(0,0,0,0.6)',
              color: selectedIndex === index ? '#000' : '#fff',
              borderColor: selectedIndex === index ? '#FFD700' : 'rgba(255,255,255,0.2)',
              boxShadow: selectedIndex === index ? '0 0 20px #FFD700' : 'none',
              transform: selectedIndex === index ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {selectedIndex === index ? `► ${item.label} ◄` : item.label}
          </button>
        ))}
      </div>

      {/* Press Start hint */}
      <div
        className="mt-10 z-10 text-slate-400"
        style={{
          fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)',
          opacity: flash ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        PRESS ENTER OR TAP TO SELECT
      </div>

      {/* Version */}
      <div
        className="absolute bottom-4 right-4 text-slate-600 z-10"
        style={{ fontSize: '0.5rem' }}
      >
        v2.0 BOSS RUSH EDITION
      </div>

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.2; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
