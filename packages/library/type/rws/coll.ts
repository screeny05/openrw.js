import { vec3 } from 'gl-matrix';

export interface Col1Face {
    a: number;
    b: number;
    c: number;
    surface: ColSurface;
}

export interface Col2Face {
    a: number;
    b: number;
    c: number;
    material: number;
    light: number;
}

export interface ColSphere {
    radius: number;
    center: vec3;
    surface: ColSurface;
}

export interface ColBounds {
    radius: number;
    center: vec3;
    min: vec3;
    max: vec3;
}

export interface ColBox {
    min: vec3;
    max: vec3;
    surface: ColSurface;
}

export interface ColSurface {
    material: number;
    flag: number;
    brightness: number;
    light: number;
}

export interface ColFaceGroup {
    min: vec3;
    max: vec3;
    startFace: number;
    endFace: number;
}

export interface Col2Flags {
    useConesInsteadOfLines: boolean;
    notEmpty: boolean;
    hasFaceGroups: boolean;
    hasShadowMesh: boolean;
}

export type ColPossibleVersionString = 'COLL' | 'COL2' | 'COL3' | 'COL4';
export type ColPossibleVersion = Col1 | Col2 | Col3 | Col4;


export interface Col1Base {
    version: ColPossibleVersionString;
    remainingFileSize: number;
    modelName: string;
    modelId: number;
    bounds: ColBounds;
}

export interface Col1 extends Col1Base {
    version: 'COLL';
    countSpheres: number;
    spheres: ColSphere[];
    countBoxes: number;
    boxes: ColBox[];
    countVertices: number;
    vertices: vec3[];
    countFaces: number;
    faces: Col1Face[];
}


export interface Col2Base extends Col1Base {
    countSpheres: number;
    countBoxes: number;
    countFaces: number;
    countLines: number;
    flags: Col2Flags;
    offsetSpheres: number;
    offsetBoxes: number;
    offsetLines: number;
    offsetVertices: number;
    offsetFaces: number;
    offsetPlanes: number;
    spheres: ColSphere[];
    boxes: ColBox[];
    vertices: vec3[];
    faceGroups?: ColFaceGroup[];
    countFaceGroups?: number;
    faces: Col2Face[];
}

export interface Col2 extends Col2Base {
    version: 'COL2';
}


export interface Col3Base extends Col2Base {
    countShadowFaces: number;
    offsetShadowVertices: number;
    offsetShadowFaces: number;
    shadowMeshVertices: vec3[];
    shadowMeshFaces: Col2Face[];
}

export interface Col3 extends Col3Base {
    version: 'COL3';
}


export interface Col4 extends Col3Base {
    version: 'COL4';
}


export interface CollEntry {
    version: ColPossibleVersionString;
    modelName: string;
    modelId: number;
    bounds: ColBounds;

    spheres: ColSphere[];
    boxes: ColBox[];
    vertices: vec3[];
    faces: Col1Face[] | Col2Face[];
    faceGroups?: ColFaceGroup[];
    shadowMeshVertices?: vec3[];
    shadowMeshFaces?: Col2Face[];
}
