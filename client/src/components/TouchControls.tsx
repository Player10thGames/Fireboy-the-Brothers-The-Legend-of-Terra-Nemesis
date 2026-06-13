/**
 * Touch Controls Component
 * D-Pad (with sprite), Fire Button, and Play/Pause Button
 * Mobile-optimized with multi-touch support
 */
import React, { useRef, useCallback } from 'react';
import { InputManager } from '@/engine/InputManager';
import { AssetLoader } from '@/lib/assetLoader';

interface TouchControlsProps {
  inputManager: InputManager;
  onPause?: () => void;
}

export default function TouchControls({ inputManager, onPause }: TouchControlsProps) {
  const dpadRef = useRef<HTMLDivElement>(null);
  const activeTouches = useRef<Map<number, string>>(new Map());

  // D-Pad directional logic from touch position relative to center
  const getDPadDirection = (touch: React.Touch, element: HTMLElement): string | null => {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = touch.clientX - cx;
    const dy = touch.clientY - cy;
    const threshold = rect.width * 0.2;
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return null;
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  };

  const clearAllDPad = useCallback(() => {
    inputManager.setTouchPadState({ up: false, down: false, left: false, right: false });
  }, [inputManager]);

  const handleDPadTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dpadRef.current) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const dir = getDPadDirection(touch, dpadRef.current);
      if (dir) {
        activeTouches.current.set(touch.identifier, dir);
        inputManager.setTouchPadState({ [dir]: true });
      }
    }
  }, [inputManager]);

  const handleDPadTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dpadRef.current) return;
    clearAllDPad();
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const dir = getDPadDirection(touch, dpadRef.current);
      if (dir) {
        activeTouches.current.set(touch.identifier, dir);
        inputManager.setTouchPadState({ [dir]: true });
      }
    }
  }, [inputManager, clearAllDPad]);

  const handleDPadTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      activeTouches.current.delete(e.changedTouches[i].identifier);
    }
    if (activeTouches.current.size === 0) {
      clearAllDPad();
    }
  }, [clearAllDPad]);

  const handleFireStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    inputManager.setFireButtonPressed(true);
  }, [inputManager]);

  const handleFireEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    inputManager.setFireButtonPressed(false);
  }, [inputManager]);

  const handlePause = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (onPause) onPause();
  }, [onPause]);

  const dpadImg = AssetLoader.getImage('dpad');
  const buttonImg = AssetLoader.getImage('button');
  const playImg = AssetLoader.getImage('play');

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-between items-end px-4 pb-3 pointer-events-none"
      style={{ zIndex: 50, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}
    >
      {/* D-Pad */}
      <div
        ref={dpadRef}
        className="pointer-events-auto relative select-none"
        style={{ width: 120, height: 120, touchAction: 'none' }}
        onTouchStart={handleDPadTouchStart}
        onTouchMove={handleDPadTouchMove}
        onTouchEnd={handleDPadTouchEnd}
        onTouchCancel={handleDPadTouchEnd}
      >
        {dpadImg ? (
          <img
            src={dpadImg}
            alt="D-Pad"
            style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.9 }}
            draggable={false}
          />
        ) : (
          /* Fallback D-Pad drawn with CSS */
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute" style={{ inset: 0 }}>
              {/* Cross shape */}
              <div className="absolute bg-slate-700 border-2 border-slate-500 rounded"
                style={{ left: '33%', top: 0, width: '34%', height: '34%' }}
                onTouchStart={e => { e.stopPropagation(); inputManager.setTouchPadState({ up: true }); }}
                onTouchEnd={e => { e.stopPropagation(); inputManager.setTouchPadState({ up: false }); }}
              >
                <span className="flex items-center justify-center h-full text-white text-xs">▲</span>
              </div>
              <div className="absolute bg-slate-700 border-2 border-slate-500 rounded"
                style={{ left: '33%', bottom: 0, width: '34%', height: '34%' }}
                onTouchStart={e => { e.stopPropagation(); inputManager.setTouchPadState({ down: true }); }}
                onTouchEnd={e => { e.stopPropagation(); inputManager.setTouchPadState({ down: false }); }}
              >
                <span className="flex items-center justify-center h-full text-white text-xs">▼</span>
              </div>
              <div className="absolute bg-slate-700 border-2 border-slate-500 rounded"
                style={{ left: 0, top: '33%', width: '34%', height: '34%' }}
                onTouchStart={e => { e.stopPropagation(); inputManager.setTouchPadState({ left: true }); }}
                onTouchEnd={e => { e.stopPropagation(); inputManager.setTouchPadState({ left: false }); }}
              >
                <span className="flex items-center justify-center h-full text-white text-xs">◄</span>
              </div>
              <div className="absolute bg-slate-700 border-2 border-slate-500 rounded"
                style={{ right: 0, top: '33%', width: '34%', height: '34%' }}
                onTouchStart={e => { e.stopPropagation(); inputManager.setTouchPadState({ right: true }); }}
                onTouchEnd={e => { e.stopPropagation(); inputManager.setTouchPadState({ right: false }); }}
              >
                <span className="flex items-center justify-center h-full text-white text-xs">►</span>
              </div>
              <div className="absolute bg-slate-800 border-2 border-slate-600 rounded"
                style={{ left: '33%', top: '33%', width: '34%', height: '34%' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Pause / Play button */}
      <div
        className="pointer-events-auto select-none flex flex-col items-center gap-2"
        style={{ touchAction: 'none' }}
      >
        <button
          onTouchStart={handlePause}
          onMouseDown={handlePause}
          className="rounded-full flex items-center justify-center active:scale-95 transition-transform"
          style={{ width: 48, height: 48, background: 'rgba(0,0,0,0.7)', border: '2px solid #FFD700' }}
        >
          {playImg ? (
            <img src={playImg} alt="Pause" style={{ width: 28, height: 28, objectFit: 'contain' }} draggable={false} />
          ) : (
            <span className="text-yellow-400 font-bold" style={{ fontSize: '1rem' }}>⏸</span>
          )}
        </button>
        <span className="text-yellow-400" style={{ fontSize: '0.4rem', fontFamily: "'Press Start 2P',monospace" }}>PAUSE</span>
      </div>

      {/* Fire Button */}
      <div
        className="pointer-events-auto select-none flex flex-col items-center gap-2"
        style={{ touchAction: 'none' }}
      >
        <button
          onTouchStart={handleFireStart}
          onTouchEnd={handleFireEnd}
          onMouseDown={handleFireStart}
          onMouseUp={handleFireEnd}
          className="rounded-full flex items-center justify-center active:scale-95 transition-transform"
          style={{
            width: 80,
            height: 80,
            background: 'radial-gradient(circle, #FF4500, #8B0000)',
            border: '3px solid #FF6B00',
            boxShadow: '0 0 15px #FF4500',
          }}
        >
          {buttonImg ? (
            <img src={buttonImg} alt="Fire" style={{ width: 60, height: 60, objectFit: 'contain' }} draggable={false} />
          ) : (
            <span className="text-white font-extrabold" style={{ fontSize: '0.7rem', fontFamily: "'Press Start 2P',monospace" }}>FIRE</span>
          )}
        </button>
        <span className="text-red-400" style={{ fontSize: '0.4rem', fontFamily: "'Press Start 2P',monospace" }}>ATTACK</span>
      </div>
    </div>
  );
}
