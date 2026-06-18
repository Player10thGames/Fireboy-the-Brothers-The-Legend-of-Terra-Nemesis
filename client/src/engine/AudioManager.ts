/**
 * Audio Manager
 * Handles all sound effects and music
 */

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentMusic: HTMLAudioElement | null = null;
  private soundEffects: Map<string, HTMLAudioElement> = new Map();
  private musicVolume = 0.5;
  private sfxVolume = 0.7;
  private masterVolume = 1.0;
  private isMuted = false;

  constructor() {
    this.initAudioContext();
  }

  /**
   * Initialize Web Audio API context
   */
  private initAudioContext(): void {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      if (this.audioContext) {
        this.masterGain = this.audioContext.createGain();
        this.musicGain = this.audioContext.createGain();
        this.sfxGain = this.audioContext.createGain();
      }

      // Connect gain nodes
      if (this.musicGain && this.masterGain) {
        this.musicGain.connect(this.masterGain);
      }
      if (this.sfxGain && this.masterGain) {
        this.sfxGain.connect(this.masterGain);
      }
      if (this.masterGain && this.audioContext) {
        this.masterGain.connect(this.audioContext.destination);
      }

      // Set initial volumes
      this.updateVolumes();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  /**
   * Preload a sound effect
   */
  preloadSFX(name: string, url: string): void {
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.soundEffects.set(name, audio);
  }

  /**
   * Play a sound effect
   */
  playSFX(urlOrName: string): void {
    if (this.isMuted) return;

    let audio = this.soundEffects.get(urlOrName);
    if (!audio) {
      // If not cached, assume it's a URL and create a new audio element
      audio = new Audio(urlOrName);
      this.soundEffects.set(urlOrName, audio);
    }
    
    if (audio) {
      audio.currentTime = 0;
      audio.volume = this.sfxVolume * this.masterVolume;
      audio.play().catch((err) => {
        console.warn(`SFX playback failed for "${urlOrName}":`, err);
      });
    }
  }

  /**
   * Play background music
   */
  playMusic(urlOrName: string, loop = true): void {
    if (this.isMuted) return;

    // Stop current music
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
    }

    // Create and play new music
    this.currentMusic = new Audio(urlOrName);
    this.currentMusic.loop = loop;
    this.currentMusic.volume = this.musicVolume * this.masterVolume;
    this.currentMusic.play().catch((err) => {
      console.warn(`Music playback failed for "${urlOrName}":`, err);
    });
  }

  /**
   * Stop background music
   */
  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
    }
  }

  /**
   * Pause background music
   */
  pauseMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause();
    }
  }

  /**
   * Resume background music
   */
  resumeMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.play().catch((err) => {
        console.warn('Music resume failed:', err);
      });
    }
  }

  /**
   * Set master volume (0-1)
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Set music volume (0-1)
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Set SFX volume (0-1)
   */
  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Update all audio volumes
   */
  private updateVolumes(): void {
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicVolume * this.masterVolume;
    }
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxVolume * this.masterVolume;
    }

    if (this.currentMusic) {
      this.currentMusic.volume = this.musicVolume * this.masterVolume;
    }
  }

  /**
   * Mute all audio
   */
  mute(): void {
    this.isMuted = true;
    if (this.currentMusic) {
      this.currentMusic.pause();
    }
  }

  /**
   * Unmute all audio
   */
  unmute(): void {
    this.isMuted = false;
    if (this.currentMusic) {
      this.currentMusic.play().catch((err) => {
        console.warn('Unmute playback failed:', err);
      });
    }
  }

  /**
   * Check if audio is muted
   */
  getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Get current master volume
   */
  getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Get current music volume
   */
  getMusicVolume(): number {
    return this.musicVolume;
  }

  /**
   * Get current SFX volume
   */
  getSFXVolume(): number {
    return this.sfxVolume;
  }

  /**
   * Resume audio context (required for some browsers)
   */
  resumeAudioContext(): void {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch((err) => {
        console.warn('AudioContext resume failed:', err);
      });
    }
  }
}
