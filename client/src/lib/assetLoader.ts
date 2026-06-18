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
    bossBattle: '/13 Last Evil [Boss Battle].mp3',
    gameOver: '/21. Game Over.mp3',
    stageClear: '/23. Stage Clear.mp3',
  },
  sfx: {
    laserFire: '/BigCore_Laser.wav',
    bossDefeat: '/BossDefeat_Explosion.wav',
    bossWarning: '/BossWarning.wav',
    hitBoss: '/HitBoss.wav',
    jump: '/Jump.wav',
    playerDeath: '/PlayerDeath.wav',
    playerHurt: '/PlayerHurt.wav',
    playerFire: '/Player_FireShoot.wav',
    strain: '/Strain.wav',
    strain2: '/Strain2.wav',
    impact: '/Impact2.wav',
  },
  images: {
    background: '/Background (Space).png',
    foreground: '/Foreground (Platform).png',
    fireboy: '/Fireboy (Playable Characters).png',
    caroline: '/Caroline (Playable Characters).png',
    butch: '/Butch (Playable Characters).png',
    anabel: '/Anabel (Playable Characters).png',
    boss1: '/Big Core MK.I (Boss).png',
    boss2: '/Fake Butch (Boss).png',
    boss3: '/Mandler from Terra Cresta (Boss).png',
    boss4: '/Crusher-Bot MK.II (Boss).png',
    boss5: '/Metal Sonic (Boss).png',
    boss6: '/Roaring Knight from Deltarune (Final Boss).png',
    boss7: '/Roaring Metal - Roaring Knight x Metal Sonic (True Final Boss).png',
    fireBreath: '/Fire Breath (Boss).png',
    laser: '/BigCore_Laser.png',
    dpad: '/D-Pad.png',
    button: '/Button.png',
    play: '/Play.png',
  },
};

export class AssetLoader {
  private static loadedImages: Map<string, HTMLImageElement> = new Map();
  private static loadedAudio: Map<string, HTMLAudioElement> = new Map();

  /**
   * Get music asset path
   */
  static getMusic(key: string): string {
    const path = ASSET_PATHS.music[key];
    if (!path) {
      console.warn(`AssetLoader: unknown music key "${key}"`);
      return '';
    }
    return path;
  }

  /**
   * Get SFX asset path
   */
  static getSFX(key: string): string {
    const path = ASSET_PATHS.sfx[key];
    if (!path) {
      console.warn(`AssetLoader: unknown SFX key "${key}"`);
      return '';
    }
    return path;
  }

  /**
   * Get image asset path
   */
  static getImage(key: string): string {
    const path = ASSET_PATHS.images[key];
    if (!path) {
      console.warn(`AssetLoader: unknown image key "${key}"`);
      return '';
    }
    return path;
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
