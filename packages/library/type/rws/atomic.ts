import { RwsGeometry } from './clump';
import { RwsFrame } from './frame';
import { RwsExtension, RwsSection, RwsTexture } from './index';

export interface RwsAtomicFlags {
    atomicCollisionTest: boolean;
    atomicRender: boolean;
}

export interface RwsMaterialEffectsPlg extends RwsSection {
    __name__; 'rwsMaterialEffectsPlg';
    type: RwsMaterialEffectsPlgEffectType;
    effectBumpMap?: RwsMaterialEffectsPlgEffectBumpMap;
    effectEnvMap?: RwsMaterialEffectsPlgEffectEnvMap;
    effectDual?: RwsMaterialEffectsPlgEffectDual;
    effectUvTransform?: RwsMaterialEffectsPlgEffectUvTransform;
    effectNull?: RwsMaterialEffectsPlgEffectNull;
}

export enum RwsMaterialEffectsPlgEffectType {
    NULL = 0x00,
    BUMP_MAP = 0x01,
    ENV_MAP = 0x02,
    BUMP_ENV_MAP = 0x03,
    DUAL = 0x04,
    UV_TRANSFORM = 0x05,
    DUAL_UV_TRANSFORM = 0x06
}

export enum RwsMaterailEffectsPlgEffectBlendMode {
    NO = 0x00,
    ZERO = 0x01,
    ONE = 0x02,
    SRC_COLOR = 0x03,
    INV_SRC_COLOR = 0x04,
    SRC_ALPHA = 0x05,
    INV_SRC_ALPHA = 0x06,
    DEST_ALPHA = 0x07,
    INV_DEST_ALPHA = 0x08,
    DEST_COLOR = 0x09,
    INV_DEST_COLOR = 0x0A,
    SRC_ALPHA_SAT = 0x0B,
};

export const isRwsMaterialEffectsPlg = (section: any): section is RwsMaterialEffectsPlg => section.__name__ === 'rwsMaterialEffectsPlg';

export interface RwsMaterialEffectsPlgEffect {
    __name__: string;
    identifier: number;
}

export interface RwsMaterialEffectsPlgEffectBumpMap extends RwsMaterialEffectsPlgEffect {
    __name__: 'rwsMaterialEffectsPlgEffectBumpMap';
    identifier: RwsMaterialEffectsPlgEffectType.BUMP_MAP;
    intensity: number;
    containsBumpMap: number;
    bumpMap?: RwsTexture;
    containsHeightMap: number;
    heightMap?: RwsTexture;
}

export interface RwsMaterialEffectsPlgEffectEnvMap extends RwsMaterialEffectsPlgEffect {
    __name__: 'rwsMaterialEffectsPlgEffectEnvMap';
    identifier: RwsMaterialEffectsPlgEffectType.ENV_MAP;
    reflectionCoefficient: number;
    useFrameBufferAlpha: number;
    containsEnvironmentMap: number;
    environmentMap?: RwsTexture;
}

export interface RwsMaterialEffectsPlgEffectDual extends RwsMaterialEffectsPlgEffect {
    __name__: 'rwsMaterialEffectsPlgEffectDual';
    identifier: RwsMaterialEffectsPlgEffectType.DUAL;
    srcBlendMode: number;
    destBlendMode: number;
    containsTexture: number;
    texture?: RwsTexture;
}

export interface RwsMaterialEffectsPlgEffectUvTransform extends RwsMaterialEffectsPlgEffect {
    __name__: 'rwsMaterialEffectsPlgEffectUvTransform';
    identifier: RwsMaterialEffectsPlgEffectType.UV_TRANSFORM;
}

export interface RwsMaterialEffectsPlgEffectNull extends RwsMaterialEffectsPlgEffect {
    __name__: 'rwsMaterialEffectsPlgEffectNull';
    identifier: RwsMaterialEffectsPlgEffectType.NULL;
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
