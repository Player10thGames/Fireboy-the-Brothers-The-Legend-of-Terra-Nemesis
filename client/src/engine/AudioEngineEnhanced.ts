
/**
 * Enhanced Audio Engine
 * Comprehensive music and sound effect management with volume control and effects
 */

export interface AudioAsset {
  id: string;
  url: string;
  type: 'music' | 'sfx';
  volume: number;
  loop: boolean;
}

export class EnhancedAudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentMusic: AudioBufferSourceNode | null = null;
  private musicBuffer: AudioBuffer | null = null;
  private soundEffects: Map<string, AudioBufferSourceNode> = new Map();
  private audioCache: Map<string, AudioBuffer> = new Map();

  private masterVolume = 0.8;
  private musicVolume = 0.7;
  private sfxVolume = 0.8;

  private isInitialized = false;

  /**
   * Initialize the Web Audio API
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create gain nodes for volume control
      this.masterGain = this.audioContext.createGain();
      this.musicGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();

      // Connect the audio graph
      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);

      // Set initial volumes
      this.masterGain.gain.value = this.masterVolume;
      this.musicGain.gain.value = this.musicVolume;
      this.sfxGain.gain.value = this.sfxVolume;

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
    }
  }

  /**
   * Load an audio file and cache it
   */
  async loadAudio(url: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) await this.initialize();
    if (!this.audioContext) return null;

    // Check cache first
    if (this.audioCache.has(url)) {
      return this.audioCache.get(url)!;
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioCache.set(url, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.error(`Failed to load audio: ${url}`, error);
      return null;
    }
  }

  /**
   * Play background music
   */
  async playMusic(url: string, loop: boolean = true): Promise<void> {
    if (!this.audioContext || !this.musicGain) return;

    // Stop current music
    this.stopMusic();

    try {
      const audioBuffer = await this.loadAudio(url);
      if (!audioBuffer) return;

      this.currentMusic = this.audioContext.createBufferSource();
      this.currentMusic.buffer = audioBuffer;
      this.currentMusic.loop = loop;
      this.currentMusic.connect(this.musicGain);
      this.currentMusic.start(0);
    } catch (error) {
      console.error('Failed to play music:', error);
    }
  }

  /**
   * Stop background music
   */
  stopMusic(): void {
    if (this.currentMusic) {
      try {
        this.currentMusic.stop();
      } catch (error) {
        console.error('Error stopping music:', error);
      }
      this.currentMusic = null;
    }
  }

  /**
   * Pause background music
   */
  pauseMusic(): void {
    if (this.audioContext && this.currentMusic) {
      this.audioContext.suspend();
    }
  }

  /**
   * Resume background music
   */
  resumeMusic(): void {
    if (this.audioContext) {
      this.audioContext.resume();
    }
  }

  /**
   * Play a sound effect
   */
  async playSFX(url: string, volume: number = 1): Promise<void> {
    if (!this.audioContext || !this.sfxGain) return;

    try {
      const audioBuffer = await this.loadAudio(url);
      if (!audioBuffer) return;

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // Create a gain node for this specific sound
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(this.sfxGain);
      source.start(0);

      // Clean up after playback
      source.onended = () => {
        source.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.error('Failed to play SFX:', error);
    }
  }

  /**
   * Set master volume (0-1)
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.masterVolume;
    }
  }

  /**
   * Set music volume (0-1)
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicVolume;
    }
  }

  /**
   * Set SFX volume (0-1)
   */
  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
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
   * Fade out music over time
   */
  fadeOutMusic(duration: number = 1000): void {
    if (!this.audioContext || !this.musicGain) return;

    const startVolume = this.musicGain.gain.value;
    const startTime = this.audioContext.currentTime;
    const endTime = startTime + duration / 1000;

    this.musicGain.gain.setTargetAtTime(0, startTime, (duration / 1000) / 3);

    setTimeout(() => {
      this.stopMusic();
      this.musicGain!.gain.value = startVolume;
    }, duration);
  }

  /**
   * Fade in music over time
   */
  fadeInMusic(duration: number = 1000): void {
    if (!this.audioContext || !this.musicGain) return;

    const startTime = this.audioContext.currentTime;
    this.musicGain.gain.setTargetAtTime(this.musicVolume, startTime, (duration / 1000) / 3);
  }

  /**
   * Create a reverb effect (simple implementation)
   */
  createReverbEffect(): ConvolverNode | null {
    if (!this.audioContext) return null;

    const convolver = this.audioContext.createConvolver();
    // In a real implementation, you would load an impulse response
    return convolver;
  }

  /**
   * Clear audio cache
   */
  clearCache(): void {
    this.audioCache.clear();
  }

  /**
   * Dispose of all audio resources
   */
  dispose(): void {
    this.stopMusic();
    this.soundEffects.forEach(source => {
      try {
        source.stop();
      } catch (error) {
        console.error('Error stopping sound effect:', error);
      }
    });
    this.soundEffects.clear();
    this.clearCache();
  }
}
