/**
 * Character Select Screen
 */

import React, { useState } from 'react';
import { getAllCharacters } from '@/entities/characters';
import { Button } from '@/components/ui/button';

interface CharacterSelectProps {
  onCharacterSelected: (characterId: string) => void;
}

export default function CharacterSelect({ onCharacterSelected }: CharacterSelectProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const characters = getAllCharacters();

  const handleSelectCharacter = (characterId: string) => {
    setSelectedCharacter(characterId);
  };

  const handleStartGame = () => {
    if (selectedCharacter) {
      onCharacterSelected(selectedCharacter);
    }
  };

  const selected = characters.find(c => c.id === selectedCharacter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-2">SELECT YOUR CHARACTER</h1>
        <p className="text-xl text-slate-300">Boss Rush Mode</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl">
        {characters.map((character) => {
          const isSelected = selectedCharacter === character.id;
          const ringClass = isSelected ? 'ring-4 ring-yellow-400 bg-slate-700 scale-105' : 'bg-slate-700 hover:bg-slate-600 hover:scale-105';
          
          return (
            <div
              key={character.id}
              onClick={() => handleSelectCharacter(character.id)}
              className={`cursor-pointer rounded-lg p-6 transition-all duration-300 ${ringClass}`}
            >
              <div
                className="w-full h-24 rounded mb-4 flex items-center justify-center text-3xl font-bold text-white"
                style={{ backgroundColor: character.color }}
              >
                {character.name.charAt(0)}
              </div>

              <h2 className="text-lg font-bold text-white mb-2">{character.name}</h2>
              <p className="text-sm text-slate-300 mb-4">{character.description}</p>

              <div className="text-xs text-slate-400 space-y-1">
                <div>HP: {character.stats.maxHealth}</div>
                <div>Speed: {character.stats.speed}</div>
                <div>Damage: {character.stats.damage}</div>
                <div>Fire Rate: {character.stats.fireRate}ms</div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="bg-slate-700 rounded-lg p-8 mb-8 max-w-2xl w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Character Details</h2>
          <div className="text-slate-300 space-y-2">
            <p>
              <span className="font-bold">Name:</span> {selected.name}
            </p>
            <p>
              <span className="font-bold">Description:</span> {selected.description}
            </p>
            <p>
              <span className="font-bold">Max Health:</span> {selected.stats.maxHealth}
            </p>
            <p>
              <span className="font-bold">Movement Speed:</span> {selected.stats.speed}
            </p>
            <p>
              <span className="font-bold">Damage Per Shot:</span> {selected.stats.damage}
            </p>
            <p>
              <span className="font-bold">Fire Rate:</span> {selected.stats.fireRate}ms
            </p>
          </div>
        </div>
      )}

      <Button
        onClick={handleStartGame}
        disabled={!selectedCharacter}
        className="px-8 py-3 text-lg font-bold bg-green-600 hover:bg-green-700 disabled:bg-slate-500 disabled:cursor-not-allowed"
      >
        {selectedCharacter ? 'START GAME' : 'SELECT A CHARACTER'}
      </Button>
    </div>
  );
}
