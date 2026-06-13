/**
 * Touch Controls Component
 * D-Pad, Fire Button, and Pause Button
 */

import React, { useState } from 'react';
import { InputManager } from '@/engine/InputManager';

interface TouchControlsProps {
  inputManager: InputManager;
  onPause?: () => void;
}

export default function TouchControls({ inputManager, onPause }: TouchControlsProps) {
  const [touchActive, setTouchActive] = useState<{ [key: string]: boolean }>({});

  const handleDPadPress = (direction: 'up' | 'down' | 'left' | 'right') => {
    setTouchActive(prev => ({ ...prev, [direction]: true }));
    inputManager.setTouchPadState({ [direction]: true });
  };

  const handleDPadRelease = (direction: 'up' | 'down' | 'left' | 'right') => {
    setTouchActive(prev => ({ ...prev, [direction]: false }));
    inputManager.setTouchPadState({ [direction]: false });
  };

  const handleFirePress = () => {
    setTouchActive(prev => ({ ...prev, fire: true }));
    inputManager.setFireButtonPressed(true);
  };

  const handleFireRelease = () => {
    setTouchActive(prev => ({ ...prev, fire: false }));
    inputManager.setFireButtonPressed(false);
  };

  const handlePausePress = () => {
    if (onPause) {
      onPause();
    }
  };

  const getUpButtonClass = () => {
    const baseClass = 'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all';
    const activeClass = touchActive['up'] ? 'bg-blue-600 scale-95' : 'bg-blue-500 hover:bg-blue-600';
    return `${baseClass} ${activeClass}`;
  };

  const getLeftButtonClass = () => {
    const baseClass = 'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all';
    const activeClass = touchActive['left'] ? 'bg-blue-600 scale-95' : 'bg-blue-500 hover:bg-blue-600';
    return `${baseClass} ${activeClass}`;
  };

  const getDownButtonClass = () => {
    const baseClass = 'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all';
    const activeClass = touchActive['down'] ? 'bg-blue-600 scale-95' : 'bg-blue-500 hover:bg-blue-600';
    return `${baseClass} ${activeClass}`;
  };

  const getRightButtonClass = () => {
    const baseClass = 'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all';
    const activeClass = touchActive['right'] ? 'bg-blue-600 scale-95' : 'bg-blue-500 hover:bg-blue-600';
    return `${baseClass} ${activeClass}`;
  };

  const getFireButtonClass = () => {
    const baseClass = 'w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all';
    const activeClass = touchActive['fire'] ? 'bg-red-600 scale-95' : 'bg-red-500 hover:bg-red-600';
    return `${baseClass} ${activeClass}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex justify-between items-end">
      {/* D-Pad */}
      <div className="flex flex-col items-center gap-2">
        {/* Up */}
        <button
          onMouseDown={() => handleDPadPress('up')}
          onMouseUp={() => handleDPadRelease('up')}
          onTouchStart={() => handleDPadPress('up')}
          onTouchEnd={() => handleDPadRelease('up')}
          className={getUpButtonClass()}
        >
          UP
        </button>

        {/* Left, Down, Right */}
        <div className="flex gap-2">
          <button
            onMouseDown={() => handleDPadPress('left')}
            onMouseUp={() => handleDPadRelease('left')}
            onTouchStart={() => handleDPadPress('left')}
            onTouchEnd={() => handleDPadRelease('left')}
            className={getLeftButtonClass()}
          >
            LFT
          </button>

          <button
            onMouseDown={() => handleDPadPress('down')}
            onMouseUp={() => handleDPadRelease('down')}
            onTouchStart={() => handleDPadPress('down')}
            onTouchEnd={() => handleDPadRelease('down')}
            className={getDownButtonClass()}
          >
            DWN
          </button>

          <button
            onMouseDown={() => handleDPadPress('right')}
            onMouseUp={() => handleDPadRelease('right')}
            onTouchStart={() => handleDPadPress('right')}
            onTouchEnd={() => handleDPadRelease('right')}
            className={getRightButtonClass()}
          >
            RGT
          </button>
        </div>
      </div>

      {/* Fire Button */}
      <button
        onMouseDown={handleFirePress}
        onMouseUp={handleFireRelease}
        onTouchStart={handleFirePress}
        onTouchEnd={handleFireRelease}
        className={getFireButtonClass()}
      >
        FIRE
      </button>

      {/* Pause Button */}
      <button
        onClick={handlePausePress}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-yellow-500 hover:bg-yellow-600 transition-all"
      >
        PAUSE
      </button>
    </div>
  );
}
