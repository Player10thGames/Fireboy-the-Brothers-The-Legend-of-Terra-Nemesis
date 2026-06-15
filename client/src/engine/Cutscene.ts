
export interface CutsceneFrame {
  type: 'dialogue' | 'narration' | 'action';
  speaker?: string;
  text: string;
  background?: string; // URL or asset key for background image
  characterLeft?: string; // URL or asset key for character sprite on left
  characterRight?: string; // URL or asset key for character sprite on right
  sfx?: string; // URL or asset key for sound effect
  music?: string; // URL or asset key for music
  duration?: number; // Duration in milliseconds for action/narration frames
}

export interface Cutscene {
  id: string;
  frames: CutsceneFrame[];
}

// Example Cutscene Data (will be moved to a separate data file later)
export const CUTSCENES: Cutscene[] = [
  {
    id: 'intro_stage1',
    frames: [
      {
        type: 'narration',
        text: 'The legendary heroes, Fireboy and his allies, stand ready.',
        background: 'background_space',
        duration: 3000,
      },
      {
        type: 'dialogue',
        speaker: 'Fireboy',
        text: 'Another challenge awaits. The Terra Nemesis is strong, but we are stronger!',
        characterLeft: 'fireboy_sprite',
        sfx: 'player_speak',
      },
      {
        type: 'dialogue',
        speaker: 'Caroline',
        text: "Let's show them the power of teamwork!",
        characterRight: 'caroline_sprite',
        sfx: 'player_speak',
      },
      {
        type: 'action',
        text: 'A giant mechanical roar echoes through space...', // Visual/audio cue
        sfx: 'boss_warning',
        duration: 2000,
      },
      {
        type: 'narration',
        text: 'Stage 1: Double Mecha Rocket!',
        background: 'boss_stage1_bg',
        duration: 2500,
      },
    ],
  },
  {
    id: 'outro_stage1',
    frames: [
      {
        type: 'narration',
        text: 'The Double Mecha Rocket is defeated!',
        background: 'background_space',
        duration: 2000,
      },
      {
        type: 'dialogue',
        speaker: 'Butch',
        text: "That was just a warm-up!",
        characterLeft: 'butch_sprite',
        sfx: 'player_speak',
      },
    ],
  },
];
