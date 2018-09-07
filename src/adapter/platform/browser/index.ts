import { BasePlatform } from '../base';
import { WorldState } from '@rws/core/state/world-state';

export class BrowserPlatform extends BasePlatform {
    worldState: WorldState = new WorldState();
}
