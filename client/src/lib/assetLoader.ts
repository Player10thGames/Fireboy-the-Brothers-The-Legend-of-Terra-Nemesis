/**
 * Asset Loader Utility
 * Manages loading and caching of game assets
 */

export interface AssetPaths {
  music: { [key: string]: string };
  sfx: { [key: string]: string };
  images: { [key: string]: string };
}

const ASSET_PATHS: AssetPaths = {
  music: {
    bossBattle: '/assets/13 Last Evil [Boss Battle].mp3',
    gameOver: '/assets/21. Game Over.mp3',
    stageClear: '/assets/23. Stage Clear.mp3',
  },
  sfx: {
    laserFire: '/assets/BigCore_Laser.wav',
    bossDefeat: '/assets/BossDefeat_Explosion.wav',
    bossWarning: '/assets/BossWarning.wav',
    hitBoss: '/assets/HitBoss.wav',
    jump: '/assets/Jump.wav',
    playerDeath: '/assets/PlayerDeath.wav',
    playerHurt: '/assets/PlayerHurt.wav',
    playerFire: '/assets/Player_FireShoot.wav',
    strain: '/assets/Strain.wav',
    strain2: '/assets/Strain2.wav',
    impact: '/assets/Impact2.wav',
  },
  images: {
    background: '/assets/Background (Space).png',
    foreground: '/assets/Foreground (Platform).png',
    fireboy: '/assets/Fireboy (Playable Characters).png',
    caroline: '/assets/Caroline (Playable Characters).png',
    butch: '/assets/Butch (Playable Characters).png',
    anabel: '/assets/Anabel (Playable Characters).png',
    boss1: '/assets/Big Core MK.I (Boss).png',
    boss2: '/assets/Fake Butch (Boss).png',
    boss3: '/assets/Mandler from Terra Cresta (Boss).png',
    boss4: '/assets/Crusher-Bot MK.II (Boss).png',
    boss5: '/assets/Metal Sonic (Boss).png',
    boss6: '/assets/Roaring Knight from Deltarune (Final Boss).png',
    boss7: '/assets/Roaring Metal - Roaring Knight x Metal Sonic (True Final Boss).png',
    fireBreath: '/assets/Fire Breath (Boss).png',
    laser: '/assets/BigCore_Laser.png',
    dpad: '/assets/D-Pad.png',
    button: '/assets/Button.png',
    play: '/assets/Play.png',
  },
};

export class AssetLoader {
  private static loadedImages: Map<string, HTMLImageElement> = new Map();
  private static loadedAudio: Map<string, HTMLAudioElement> = new Map();

  /**
   * Get music asset path
   */
  static getMusic(key: string): string {
    return ASSET_PATHS.music[key] || '';
  }

  /**
   * Get SFX asset path
   */
  static getSFX(key: string): string {
    return ASSET_PATHS.sfx[key] || '';
  }

  /**
   * Get image asset path
   */
  static getImage(key: string): string {
    return ASSET_PATHS.images[key] || '';
  }

  /**
   * Preload image
   */
  static preloadImage(key: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (this.loadedImages.has(key)) {
        resolve(this.loadedImages.get(key)!);
        return;
      }

      const path = this.getImage(key);
      if (!path) {
        reject(new Error(`Image not found: ${key}`));
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.loadedImages.set(key, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
      img.src = path;
    });
  }

  /**
   * Preload audio
   */
  static preloadAudio(key: string, type: 'music' | 'sfx'): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const cacheKey = `${type}:${key}`;
      if (this.loadedAudio.has(cacheKey)) {
        resolve(this.loadedAudio.get(cacheKey)!);
        return;
      }

      const path = type === 'music' ? this.getMusic(key) : this.getSFX(key);
      if (!path) {
        reject(new Error(`Audio not found: ${key}`));
        return;
      }

      const audio = new Audio(path);
      audio.oncanplaythrough = () => {
        this.loadedAudio.set(cacheKey, audio);
        resolve(audio);
      };
      audio.onerror = () => reject(new Error(`Failed to load audio: ${path}`));
    });
  }

  /**
   * Get cached image
   */
  static getCachedImage(key: string): HTMLImageElement | undefined {
    return this.loadedImages.get(key);
  }

  /**
   * Get cached audio
   */
  static getCachedAudio(key: string, type: 'music' | 'sfx'): HTMLAudioElement | undefined {
    const cacheKey = `${type}:${key}`;
    return this.loadedAudio.get(cacheKey);
  }

  /**
   * Clear all cached assets
   */
  static clearCache(): void {
    this.loadedImages.clear();
    this.loadedAudio.clear();
  }
}
