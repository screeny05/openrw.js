interface RWSAtomicFlags {
    atomicCollisionTest: boolean;
    atomicRender: boolean;
}

interface RWSAtomic {
    __name__: string;
    frameIndex: number;
    geometryIndex: number;
    flags: RWSAtomicFlags;
    unknown: any;
    extensions: any;
}

export default RWSAtomic;
