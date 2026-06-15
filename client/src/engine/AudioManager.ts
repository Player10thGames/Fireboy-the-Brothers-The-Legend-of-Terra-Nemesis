/**
 * Audio Manager
 * Handles all sound effects and music with procedural synthesis fallback
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
  private currentDrone: OscillatorNode | null = null;
  private currentLfo: OscillatorNode | null = null;

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
   * Play a sound effect — falls back to synthesize if audio playback fails
   */
  playSFX(urlOrName: string): void {
    if (this.isMuted) return;

    let audio = this.soundEffects.get(urlOrName);
    if (!audio) {
      audio = new Audio(urlOrName);
      this.soundEffects.set(urlOrName, audio);
    }

    if (audio) {
      audio.currentTime = 0;
      audio.volume = this.sfxVolume * this.masterVolume;
      audio.play().catch(() => {
        this.synthesize(this.inferSynthType(urlOrName));
      });
    }
  }

  /**
   * Infer synth type from SFX name/URL
   */
  private inferSynthType(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('fire') || lower.includes('shoot') || lower.includes('laser')) return 'shoot';
    if (lower.includes('hit') || lower.includes('impact')) return 'hit';
    if (lower.includes('explosion') || lower.includes('defeat') || lower.includes('death')) return 'explosion';
    if (lower.includes('hurt')) return 'playerHurt';
    if (lower.includes('warning')) return 'bossWarning';
    if (lower.includes('clear') || lower.includes('strain')) return 'stageClear';
    if (lower.includes('over')) return 'gameOver';
    return 'hit';
  }

  /**
   * Procedural sound synthesis using Web Audio API
   */
  synthesize(type: string): void {
    if (!this.audioContext || !this.sfxGain || this.isMuted) return;
    const ctx = this.audioContext;
    const sfx = this.sfxGain;
    const now = ctx.currentTime;

    switch (type) {
      case 'shoot': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(220, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.connect(gain);
        gain.connect(sfx);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
      case 'hit': {
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        source.connect(gain);
        gain.connect(sfx);
        source.start(now);
        break;
      }
      case 'explosion': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const distortion = ctx.createWaveShaper();
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
          const x = (i * 2) / 256 - 1;
          curve[i] = (Math.PI + 200 * x) / (Math.PI + 200 * Math.abs(x));
        }
        distortion.curve = curve;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.linearRampToValueAtTime(30, now + 0.4);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.connect(distortion);
        distortion.connect(gain);
        gain.connect(sfx);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
      case 'playerHurt': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(200, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.connect(gain);
        gain.connect(sfx);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case 'bossWarning': {
        for (let r = 0; r < 3; r++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          const offset = r * 0.2;
          osc.frequency.setValueAtTime(200, now + offset);
          osc.frequency.linearRampToValueAtTime(800, now + offset + 0.15);
          gain.gain.setValueAtTime(0.2, now + offset);
          gain.gain.linearRampToValueAtTime(0, now + offset + 0.18);
          osc.connect(gain);
          gain.connect(sfx);
          osc.start(now + offset);
          osc.stop(now + offset + 0.18);
        }
        break;
      }
      case 'stageClear': {
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4-E4-G4-C5
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.3, now + i * 0.1);
          gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.1);
          osc.connect(gain);
          gain.connect(sfx);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.1);
        });
        break;
      }
      case 'gameOver': {
        const notes = [392.00, 349.23, 311.13, 293.66, 261.63]; // G4-F4-Eb4-D4-C4
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.15);
          gain.gain.setValueAtTime(0.3, now + i * 0.15);
          gain.gain.linearRampToValueAtTime(0, now + i * 0.15 + 0.15);
          osc.connect(gain);
          gain.connect(sfx);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.15);
        });
        break;
      }
    }
  }

  /**
   * Play looping boss battle drone music
   */
  playBossBattleMusic(stage: number): void {
    this.stopBossBattleDrone();
    if (!this.audioContext || !this.musicGain || this.isMuted) return;

    const baseFreqs = [110, 130, 146, 155, 164, 174, 185];
    const freq = baseFreqs[Math.min(stage - 1, baseFreqs.length - 1)];

    const osc = this.audioContext.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

    const lfo = this.audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(2 + stage * 0.5, this.audioContext.currentTime);
    const lfoGain = this.audioContext.createGain();
    lfoGain.gain.setValueAtTime(freq * 0.1, this.audioContext.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start();
    lfo.start();
    this.currentDrone = osc;
    this.currentLfo = lfo;
  }

  /**
   * Stop the boss battle drone
   */
  private stopBossBattleDrone(): void {
    try { this.currentDrone?.stop(); } catch { /* already stopped */ }
    try { this.currentLfo?.stop(); } catch { /* already stopped */ }
    this.currentDrone = null;
    this.currentLfo = null;
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
    this.currentMusic.play().catch(() => {
      // Fallback: no music file available
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
    this.stopBossBattleDrone();
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
      this.currentMusic.play().catch(() => {
        // Audio playback failed
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
    this.stopBossBattleDrone();
  }

  /**
   * Unmute all audio
   */
  unmute(): void {
    this.isMuted = false;
    if (this.currentMusic) {
      this.currentMusic.play().catch(() => {
        // Audio playback failed
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
      this.audioContext.resume().catch(() => {
        // Resume failed
      });
    }
  }
}
