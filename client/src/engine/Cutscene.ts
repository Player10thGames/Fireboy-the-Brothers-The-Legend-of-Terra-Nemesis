/**
 * Cutscene System
 * Defines dialogue frames for stage transitions
 */

export interface CutsceneFrame {
  speaker: string;
  text: string;
  duration: number;
  background?: string;
}

const CUTSCENES: Record<number, CutsceneFrame[]> = {
  1: [
    { speaker: 'FIREBOY', text: 'The machines are awakening... Let\'s go!', duration: 3000, background: 'linear-gradient(180deg, #1a0a00, #000)' },
  ],
  2: [
    { speaker: 'BUTCH', text: 'You dare challenge ME?!', duration: 3000, background: 'linear-gradient(180deg, #2e0000, #000)' },
  ],
  3: [
    { speaker: 'MANDLER', text: 'Gravity is just a suggestion...', duration: 3000, background: 'linear-gradient(180deg, #1a1a00, #000)' },
  ],
  4: [
    { speaker: 'CRUSHER-BOT', text: 'INITIATING CRUSH PROTOCOL', duration: 3000, background: 'linear-gradient(180deg, #0a0a1a, #000)' },
  ],
  5: [
    { speaker: 'METAL SONIC', text: 'I am the ultimate life form.', duration: 3000, background: 'linear-gradient(180deg, #0a0a2e, #000)' },
  ],
  6: [
    { speaker: 'ROARING KNIGHT', text: 'Your journey ends here, hero.', duration: 3000, background: 'linear-gradient(180deg, #2e000a, #000)' },
  ],
  7: [
    { speaker: 'ROARING METAL', text: 'We are one. You are nothing.', duration: 3000, background: 'linear-gradient(180deg, #1a002e, #000)' },
  ],
  8: [
    { speaker: 'PLAYER', text: 'Terra Nemesis... is finally at peace.', duration: 4000, background: 'linear-gradient(180deg, #002e0a, #000)' },
  ],
};

export function getCutscene(stage: number): CutsceneFrame[] {
  return CUTSCENES[stage] || [];
}
