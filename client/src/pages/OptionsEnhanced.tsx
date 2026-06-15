
/**
 * Enhanced Options Page
 * Comprehensive game settings and preferences
 */

import React, { useState, useEffect } from 'react';
import { GamePersistence, GameSettings } from '@/lib/GamePersistence';

interface OptionsEnhancedProps {
  onBack: () => void;
  onSettingsChange: (settings: GameSettings) => void;
  currentSettings?: GameSettings;
}

export default function OptionsEnhanced({ onBack, onSettingsChange, currentSettings }: OptionsEnhancedProps) {
  const [settings, setSettings] = useState<GameSettings>(
    currentSettings || GamePersistence.getDefaultSettings()
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const handleSettingChange = (key: keyof GameSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  const handleSave = () => {
    GamePersistence.saveSettings(settings);
    onSettingsChange(settings);
    setSaved(true);
  };

  const handleReset = () => {
    const defaultSettings = GamePersistence.getDefaultSettings();
    setSettings(defaultSettings);
    GamePersistence.saveSettings(defaultSettings);
    onSettingsChange(defaultSettings);
    setSaved(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start pt-6 pb-4 px-4 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0a0a2e 0%, #000000 100%)',
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
      }}
    >
      {/* Header */}
      <div className="text-center mb-6 z-10">
        <div
          className="text-yellow-400 font-extrabold tracking-widest"
          style={{ fontSize: 'clamp(0.8rem, 3vw, 1.5rem)', textShadow: '0 0 20px #FFD700' }}
        >
          OPTIONS
        </div>
        <div className="text-slate-400 mt-1" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.6rem)' }}>
          CUSTOMIZE YOUR EXPERIENCE
        </div>
      </div>

      {/* Settings Panel */}
      <div className="w-full max-w-2xl bg-slate-900 rounded-lg p-6 border-2 border-yellow-400 z-10">
        {/* Audio Settings */}
        <div className="mb-8">
          <h3 className="text-yellow-400 mb-4" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.7rem)' }}>
            🔊 AUDIO
          </h3>
          <div className="space-y-4">
            {/* Master Volume */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-slate-300" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                  Master Volume
                </label>
                <span className="text-yellow-400 font-bold" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                  {settings.masterVolume}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.masterVolume}
                onChange={e => handleSettingChange('masterVolume', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Music Volume */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-slate-300" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                  Music Volume
                </label>
                <span className="text-yellow-400 font-bold" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                  {settings.musicVolume}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.musicVolume}
                onChange={e => handleSettingChange('musicVolume', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* SFX Volume */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-slate-300" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                  SFX Volume
                </label>
                <span className="text-yellow-400 font-bold" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                  {settings.sfxVolume}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sfxVolume}
                onChange={e => handleSettingChange('sfxVolume', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Gameplay Settings */}
        <div className="mb-8 pb-8 border-b-2 border-slate-700">
          <h3 className="text-yellow-400 mb-4" style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.7rem)' }}>
            🎮 GAMEPLAY
          </h3>
          <div className="space-y-4">
            {/* Difficulty */}
            <div>
              <label className="text-slate-300 block mb-2" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                Default Difficulty
              </label>
              <select
                value={settings.difficulty}
                onChange={e => handleSettingChange('difficulty', e.target.value)}
                className="w-full bg-slate-800 text-white p-2 rounded border-2 border-slate-600 focus:border-yellow-400"
                style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}
              >
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>

            {/* Screen Shake */}
            <div className="flex items-center justify-between">
              <label className="text-slate-300" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                Screen Shake
              </label>
              <button
                onClick={() => handleSettingChange('screenShake', !settings.screenShake)}
                className={`px-4 py-2 rounded font-bold transition-all ${
                  settings.screenShake
                    ? 'bg-green-500 text-black'
                    : 'bg-slate-700 text-white'
                }`}
                style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}
              >
                {settings.screenShake ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Screen Flash */}
            <div className="flex items-center justify-between">
              <label className="text-slate-300" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                Screen Flash
              </label>
              <button
                onClick={() => handleSettingChange('screenFlash', !settings.screenFlash)}
                className={`px-4 py-2 rounded font-bold transition-all ${
                  settings.screenFlash
                    ? 'bg-green-500 text-black'
                    : 'bg-slate-700 text-white'
                }`}
                style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}
              >
                {settings.screenFlash ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <label className="text-slate-300" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                Auto Save
              </label>
              <button
                onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                className={`px-4 py-2 rounded font-bold transition-all ${
                  settings.autoSave
                    ? 'bg-green-500 text-black'
                    : 'bg-slate-700 text-white'
                }`}
                style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}
              >
                {settings.autoSave ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Show FPS */}
            <div className="flex items-center justify-between">
              <label className="text-slate-300" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
                Show FPS Counter
              </label>
              <button
                onClick={() => handleSettingChange('showFPS', !settings.showFPS)}
                className={`px-4 py-2 rounded font-bold transition-all ${
                  settings.showFPS
                    ? 'bg-green-500 text-black'
                    : 'bg-slate-700 text-white'
                }`}
                style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}
              >
                {settings.showFPS ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-green-500 text-black rounded font-bold hover:bg-green-400 transition-all"
            style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)' }}
          >
            💾 SAVE
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-orange-500 text-black rounded font-bold hover:bg-orange-400 transition-all"
            style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)' }}
          >
            🔄 RESET
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 border-2 border-slate-500 text-slate-300 rounded font-bold transition-all hover:border-white hover:text-white"
            style={{ fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)' }}
          >
            ◄ BACK
          </button>
        </div>

        {/* Saved Indicator */}
        {saved && (
          <div className="mt-4 text-center text-green-400 font-bold" style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.5rem)' }}>
            ✓ Settings Saved!
          </div>
        )}
      </div>
    </div>
  );
}
