import { RWSGeometry, RWSFrame } from './clump';

interface RWSAtomicFlags {
    atomicCollisionTest: boolean;
    atomicRender: boolean;
}

export interface RWSAtomic {
    __name__: string;
    frameIndex: number;
    geometryIndex: number;
    flags: RWSAtomicFlags;
    unknown: any;
    extensions: any;
    geometry: RWSGeometry;
    frame: RWSFrame;
}

export default RWSAtomic;
