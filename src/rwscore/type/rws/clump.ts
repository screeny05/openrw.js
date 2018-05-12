import { RwsAtomic } from './atomic';

import { vec2, vec3, vec4, mat3 } from 'gl-matrix';
import { RwsSection, RwsExtension } from './index';
import { RwsFrameList } from './frame';

export enum RwsTextureAddressMode {
    NONE = 0x00,
    REPEAT = 0x01,
    MIRROR = 0x02,
    CLAMP = 0x03,
    BORDER = 0x04
}

export enum RwsTextureFilterMode {
    NONE = 0x00,
    NEAREST = 0x01,
    LINEAR = 0x02,
    MIP_NEAREST = 0x03,
    MIP_LINEAR = 0x04,
    LINEAR_MIP_NEAREST = 0x05,
    LINEAR_MIP_LINEAR = 0x06
}

export interface RwsGeometryTexture extends RwsSection {
    __name__: 'rwsGeometryTexture';
    extension: RwsExtension;
    addressModeU: RwsTextureAddressMode;
    addressModeV: RwsTextureAddressMode;
    filterMode: RwsTextureFilterMode;
    name: string;
    maskName: string;
    useMipLevels: number;
}

export interface RwsGeometryFlags {
    triangleStrip: boolean;
    positions: boolean;
    textureCoords: boolean;
    prelit: boolean;
    normals: boolean;
    light: boolean;
    modulatedColor: boolean;
    secondTextureCoords: boolean;
}

export interface RwsGeometryMaterialList {
    materialIndices: Array<number>;
    materials: Array<RwsMaterial>;
}

export interface RwsBinaryMesh extends RwsSection {
    __name__: 'rwsBinaryMesh';
    countIndices: number;
    indices: number[];
    materialIndex: number;
    mode: number;
    material: RwsMaterial;
}

export interface RwsBinMeshPlg extends RwsSection {
    __name__: 'rwsBinMeshPlg';
    countIndices: number;
    countSplits: number;
    hasData: boolean;
    splitMode: number;
    splits: RwsBinaryMesh[];
}

export interface RwsMaterial extends RwsSection {
    __name__: 'rwsMaterial';
    extension: RwsExtension<RwsBinMeshPlg>;
    color: number[];
    flags: number;
    hasAlpha: boolean;
    isTextured: number;
    ambient?: number;
    specular?: number;
    diffuse?: number;
    texture: RwsGeometryTexture;
}

export interface RwsGeometry extends RwsSection {
    __name__: 'rwsGeometry';
    extension: RwsExtension;
    flags: RwsGeometryFlags;
    isNativeGeometry: number;
    materialList: RwsGeometryMaterialList;

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
    colors?: Array<Uint8Array>;
    textureCoordinates: Array<Array<vec2>>;
    triangles: Array<{
        materialId: number;
        vertex1: number;
        vertex2: number;
        vertex3: number;
    }>
}

export interface RwsGeometryList extends RwsSection {
    __name__: 'rwsGeometryList';
    geometries: Array<RwsGeometry>
}

export interface RwsClump extends RwsSection {
    __name__: 'rwsClump';
    atomics: Array<RwsAtomic>;
    frameList: RwsFrameList;
    geometryList: RwsGeometryList;
    extension: RwsExtension;
}
