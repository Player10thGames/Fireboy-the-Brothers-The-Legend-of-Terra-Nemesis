import { Boss, BossConfig } from './Boss';
import { DoubleMechaRocket } from './bosses/DoubleMechaRocket';
import { ButchBoss } from './bosses/ButchBoss';
import { Mandler } from './bosses/Mandler';
import { CrusherBot } from './bosses/CrusherBot';
import { MetalSonic } from './bosses/MetalSonic';
import { RoaringKnight } from './bosses/RoaringKnight';
import { RoaringMetal } from './bosses/RoaringMetal';

export class BossFactory {
  static createBoss(stage: number, config: BossConfig): Boss {
    switch (stage) {
      case 1:
        return new DoubleMechaRocket({ ...config, stage: 1 });
      case 2:
        return new ButchBoss({ ...config, stage: 2 });
      case 3:
        return new Mandler({ ...config, stage: 3 });
      case 4:
        return new CrusherBot({ ...config, stage: 4 });
      case 5:
        return new MetalSonic({ ...config, stage: 5 });
      case 6:
        return new RoaringKnight({ ...config, stage: 6 });
      case 7:
        return new RoaringMetal({ ...config, stage: 7 });
      default:
        throw new Error(`Unknown boss stage: ${stage}`);
    }
  }
}
