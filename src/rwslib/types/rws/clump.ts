import { RWSAtomic } from './atomic';

import { vec2, vec3, vec4, mat3 } from 'gl-matrix';

export interface RWSSection {
    __name__: string;
}

export interface RWSFrame {
    parentFrameId: number;
    position: vec3;
    rotation: mat3;
}

export interface RWSFrameList extends RWSSection {
    extensions: Array<any>;
    frames: Array<RWSFrame>;
}



export enum RWSTextureAddressMode {
    NONE = 0x00,
    REPEAT = 0x01,
    MIRROR = 0x02,
    CLAMP = 0x03,
    BORDER = 0x04
}

export enum RWSTextureFilterMode {
    NONE = 0x00,
    NEAREST = 0x01,
    LINEAR = 0x02,
    MIP_NEAREST = 0x03,
    MIP_LINEAR = 0x04,
    LINEAR_MIP_NEAREST = 0x05,
    LINEAR_MIP_LINEAR = 0x06
}

export interface RWSGeometryTexture extends RWSSection {
    extension: any;
    addressModeU: RWSTextureAddressMode;
    addressModeV: RWSTextureAddressMode;
    filterMode: RWSTextureFilterMode;
    name: string;
    maskName: string;
    useMipLevels: number;
}



export interface RWSGeometryFlags {
    triangleStrip: boolean;
    positions: boolean;
    textureCoords: boolean;
    prelit: boolean;
    normals: boolean;
    light: boolean;
    modulatedColor: boolean;
    secondTextureCoords: boolean;
}

export interface RWSGeometryMaterialList {
    materialIndices: Array<number>;
    materials: Array<RWSGeometryMaterial>;
}

export interface RWSGeometryMaterial extends RWSSection {
    extension: any;
    color: Uint8Array[4];
    flags: number;
    hasAlpha: boolean;
    isTextured: number;
    ambient?: number;
    specular?: number;
    diffuse?: number;
    texture: RWSGeometryTexture;
}

export interface RWSGeometry extends RWSSection {
    extension: any;
    flags: RWSGeometryFlags;
    isNativeGeometry: number;
    materialList: RWSGeometryMaterialList;

    // there's only one "morphTarget"
    morphTargets: Array<{
        hasNormals: number;
        hasVertices: number;
        normals?: Array<vec3>;
        vertices?: Array<vec3>;
        spherePosition: vec3;
        sphereRadius: number;
    }>;
    surfaceAmbient?: number;
    surfaceDiffuse?: number;
    surfaceSpecular?: number;
    colors: Array<Uint8Array[4]>;
    textureCoordinates: Array<Array<vec2>>;
    triangles: Array<{
        materialId: number;
        vertex1: number;
        vertex2: number;
        vertex3: number;
    }>
}

export interface RWSGeometryList extends RWSSection {
    geometries: Array<RWSGeometry>
}



export interface RWSClump extends RWSSection {
    atomics: Array<RWSAtomic>;
    frameList: RWSFrameList;
    geometryList: RWSGeometryList;
    extension: any;
}
