
/**
 * Audio Assets Library
 * Comprehensive collection of all game music and sound effects
 */

export const AUDIO_ASSETS = {
  // Background Music
  music: {
    mainMenu: {
      id: 'menu_theme',
      name: 'Main Menu Theme',
      url: '/audio/music/menu_theme.mp3',
      type: 'music' as const,
      loop: true,
    },
    bossBattle: {
      id: 'boss_battle',
      name: 'Boss Battle Theme',
      url: '/audio/music/boss_battle.mp3',
      type: 'music' as const,
      loop: true,
    },
    stage1: {
      id: 'stage1_theme',
      name: 'Double Mecha Rocket Theme',
      url: '/audio/music/stage1_theme.mp3',
      type: 'music' as const,
      loop: true,
    },
    stage2: {
      id: 'stage2_theme',
      name: 'Butch Boss Theme',
      url: '/audio/music/stage2_theme.mp3',
      type: 'music' as const,
      loop: true,
    },
    stage3: {
      id: 'stage3_theme',
      name: 'Mandler Boss Theme',
      url: '/audio/music/stage3_theme.mp3',
      type: 'music' as const,
      loop: true,
    },
    stage4: {
      id: 'stage4_theme',
      name: 'Crusher-Bot MK.II Theme',
      url: '/audio/music/stage4_theme.mp3',
      type: 'music' as const,
      loop: true,
    },
    stage5: {
      id: 'stage5_theme',
      name: 'Metal Sonic Theme',
      url: '/audio/music/stage5_theme.mp3',
      type: 'music' as const,
      loop: true,
    },
    stage6: {
      id: 'stage6_theme',
      name: 'The Roaring Knight Theme',
      url: '/audio/music/stage6_theme.mp3',
      type: 'music' as const,
      loop: true,
    },
    stage7: {
      id: 'stage7_theme',
      name: 'Roaring Metal Theme',
      url: '/audio/music/stage7_theme.mp3',
      type: 'music' as const,
      loop: true,
    },
    stageClear: {
      id: 'stage_clear',
      name: 'Stage Clear Theme',
      url: '/audio/music/stage_clear.mp3',
      type: 'music' as const,
      loop: false,
    },
    gameOver: {
      id: 'game_over',
      name: 'Game Over Theme',
      url: '/audio/music/game_over.mp3',
      type: 'music' as const,
      loop: false,
    },
    victory: {
      id: 'victory_theme',
      name: 'Victory Theme',
      url: '/audio/music/victory_theme.mp3',
      type: 'music' as const,
      loop: false,
    },
  },

  // Sound Effects
  sfx: {
    // Player Sounds
    playerFire: {
      id: 'player_fire',
      name: 'Player Fire',
      url: '/audio/sfx/player_fire.wav',
      type: 'sfx' as const,
      loop: false,
    },
    playerHurt: {
      id: 'player_hurt',
      name: 'Player Hurt',
      url: '/audio/sfx/player_hurt.wav',
      type: 'sfx' as const,
      loop: false,
    },
    playerDeath: {
      id: 'player_death',
      name: 'Player Death',
      url: '/audio/sfx/player_death.wav',
      type: 'sfx' as const,
      loop: false,
    },
    playerSpeak: {
      id: 'player_speak',
      name: 'Player Speak',
      url: '/audio/sfx/player_speak.wav',
      type: 'sfx' as const,
      loop: false,
    },

    // Boss Sounds
    bossWarning: {
      id: 'boss_warning',
      name: 'Boss Warning',
      url: '/audio/sfx/boss_warning.wav',
      type: 'sfx' as const,
      loop: false,
    },
    bossDefeat: {
      id: 'boss_defeat',
      name: 'Boss Defeat',
      url: '/audio/sfx/boss_defeat.wav',
      type: 'sfx' as const,
      loop: false,
    },
    bossAttack: {
      id: 'boss_attack',
      name: 'Boss Attack',
      url: '/audio/sfx/boss_attack.wav',
      type: 'sfx' as const,
      loop: false,
    },
    bossTakeDamage: {
      id: 'boss_take_damage',
      name: 'Boss Take Damage',
      url: '/audio/sfx/boss_take_damage.wav',
      type: 'sfx' as const,
      loop: false,
    },
    bossPhaseTransition: {
      id: 'boss_phase_transition',
      name: 'Boss Phase Transition',
      url: '/audio/sfx/boss_phase_transition.wav',
      type: 'sfx' as const,
      loop: false,
    },

    // Combat Sounds
    hitBoss: {
      id: 'hit_boss',
      name: 'Hit Boss',
      url: '/audio/sfx/hit_boss.wav',
      type: 'sfx' as const,
      loop: false,
    },
    hitPlayer: {
      id: 'hit_player',
      name: 'Hit Player',
      url: '/audio/sfx/hit_player.wav',
      type: 'sfx' as const,
      loop: false,
    },
    explosion: {
      id: 'explosion',
      name: 'Explosion',
      url: '/audio/sfx/explosion.wav',
      type: 'sfx' as const,
      loop: false,
    },
    energyShot: {
      id: 'energy_shot',
      name: 'Energy Shot',
      url: '/audio/sfx/energy_shot.wav',
      type: 'sfx' as const,
      loop: false,
    },

    // UI Sounds
    menuSelect: {
      id: 'menu_select',
      name: 'Menu Select',
      url: '/audio/sfx/menu_select.wav',
      type: 'sfx' as const,
      loop: false,
    },
    menuConfirm: {
      id: 'menu_confirm',
      name: 'Menu Confirm',
      url: '/audio/sfx/menu_confirm.wav',
      type: 'sfx' as const,
      loop: false,
    },
    menuCancel: {
      id: 'menu_cancel',
      name: 'Menu Cancel',
      url: '/audio/sfx/menu_cancel.wav',
      type: 'sfx' as const,
      loop: false,
    },

    // Gimmick Sounds
    ringCollect: {
      id: 'ring_collect',
      name: 'Ring Collect',
      url: '/audio/sfx/ring_collect.wav',
      type: 'sfx' as const,
      loop: false,
    },
    platformMove: {
      id: 'platform_move',
      name: 'Platform Move',
      url: '/audio/sfx/platform_move.wav',
      type: 'sfx' as const,
      loop: false,
    },
    shockwave: {
      id: 'shockwave',
      name: 'Shockwave',
      url: '/audio/sfx/shockwave.wav',
      type: 'sfx' as const,
      loop: false,
    },
    gravityShift: {
      id: 'gravity_shift',
      name: 'Gravity Shift',
      url: '/audio/sfx/gravity_shift.wav',
      type: 'sfx' as const,
      loop: false,
    },

    // Cutscene Sounds
    cutsceneStart: {
      id: 'cutscene_start',
      name: 'Cutscene Start',
      url: '/audio/sfx/cutscene_start.wav',
      type: 'sfx' as const,
      loop: false,
    },
    cutsceneEnd: {
      id: 'cutscene_end',
      name: 'Cutscene End',
      url: '/audio/sfx/cutscene_end.wav',
      type: 'sfx' as const,
      loop: false,
    },

    // Misc Sounds
    strain: {
      id: 'strain',
      name: 'Strain',
      url: '/audio/sfx/strain.wav',
      type: 'sfx' as const,
      loop: false,
    },
    powerUp: {
      id: 'power_up',
      name: 'Power Up',
      url: '/audio/sfx/power_up.wav',
      type: 'sfx' as const,
      loop: false,
    },
  },
};

/**
 * Get music asset by ID
 */
export function getMusic(id: keyof typeof AUDIO_ASSETS.music) {
  return AUDIO_ASSETS.music[id]?.url || '';
}

/**
 * Get SFX asset by ID
 */
export function getSFX(id: keyof typeof AUDIO_ASSETS.sfx) {
  return AUDIO_ASSETS.sfx[id]?.url || '';
}

/**
 * Get all music assets
 */
export function getAllMusic() {
  return Object.values(AUDIO_ASSETS.music);
}

/**
 * Get all SFX assets
 */
export function getAllSFX() {
  return Object.values(AUDIO_ASSETS.sfx);
}
