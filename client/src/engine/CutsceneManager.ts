
import { Cutscene, CutsceneFrame } from './Cutscene';
import { AudioManager } from './AudioManager';
import { AssetLoader } from '../lib/assetLoader';

interface CutsceneManagerConfig {
  onCutsceneEnd: () => void;
  onDisplayFrame: (frame: CutsceneFrame) => void;
  onHideCutscene: () => void;
}

export class CutsceneManager {
  private currentCutscene: Cutscene | null = null;
  private currentFrameIndex = 0;
  private audioManager: AudioManager;
  private config: CutsceneManagerConfig;
  private frameTimer: number | null = null;

  constructor(audioManager: AudioManager, config: CutsceneManagerConfig) {
    this.audioManager = audioManager;
    this.config = config;
  }

  public playCutscene(cutscene: Cutscene): void {
    this.currentCutscene = cutscene;
    this.currentFrameIndex = 0;
    this.playCurrentFrame();
  }

  private playCurrentFrame(): void {
    if (!this.currentCutscene) return;

    const frame = this.currentCutscene.frames[this.currentFrameIndex];
    if (!frame) {
      this.endCutscene();
      return;
    }

    this.config.onDisplayFrame(frame);

    if (frame.sfx) {
      this.audioManager.playSFX(AssetLoader.getSFX(frame.sfx));
    }
    if (frame.music) {
      this.audioManager.playMusic(AssetLoader.getMusic(frame.music), true);
    }

    if (frame.duration) {
      this.frameTimer = window.setTimeout(() => {
        this.nextFrame();
      }, frame.duration);
    }
  }

  public nextFrame(): void {
    if (this.frameTimer) {
      clearTimeout(this.frameTimer);
      this.frameTimer = null;
    }
    this.currentFrameIndex++;
    this.playCurrentFrame();
  }

  private endCutscene(): void {
    this.currentCutscene = null;
    this.currentFrameIndex = 0;
    this.config.onHideCutscene();
    this.config.onCutsceneEnd();
  }

  public skipCutscene(): void {
    if (this.frameTimer) {
      clearTimeout(this.frameTimer);
      this.frameTimer = null;
    }
    this.endCutscene();
  }

  public isCutsceneActive(): boolean {
    return this.currentCutscene !== null;
  }
}
