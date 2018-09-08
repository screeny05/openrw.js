import { RwsGeometry } from './clump';
import { RwsFrame } from './frame';
import { RwsExtension, RwsSection } from './index';

export interface RwsAtomicFlags {
    atomicCollisionTest: boolean;
    atomicRender: boolean;
}

export interface RwsMaterialEffectsPlg extends RwsSection {
    __name__; 'rwsMaterialEffectsPlg';
    type: number;
}

export interface RwsAtomic extends RwsSection {
    __name__: 'rwsAtomic';
    frameIndex: number;
    geometryIndex: number;
    flags: RwsAtomicFlags;
    unknown: any;
    extensions: RwsExtension<RwsMaterialEffectsPlg>;
    geometry: RwsGeometry;
    frame: RwsFrame;
}
