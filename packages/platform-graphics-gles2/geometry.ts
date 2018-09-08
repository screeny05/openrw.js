import { GLES2Context } from '@glaced/gles2-2.0';

import Object3D from './object3d';
import Face3 from './face3';
import Sphere from './sphere';

import { vec4, vec3, vec2 } from 'gl-matrix';

export default class Geometry {
    faces: Array<Face3> = [];

    vertices: Array<vec3> = [];
    vertexColors: Array<Uint8Array[4]> = [];
    vertexNormals: Array<vec3> = [];
    uvCoordinates: Array<Array<vec2>> = [];

    vertexBuffer: number;
    colorBuffer: number;
    uvBuffer: number;
    indicesPerMaterialBuffer: Array<number>;

    boundingSphere: Sphere;

    gl: GLES2Context;

    constructor(gl: GLES2Context){
        this.gl = gl;
    }

    updateBuffer() {
        const [vertexBuffer, colorBuffer, uvBuffer] = this.gl.genBuffers(3);

        if(!vertexBuffer || !colorBuffer || !uvBuffer){
            throw new Error('Geometry: Couldn\'t create buffer.');
        }

        this.vertexBuffer = vertexBuffer;
        this.colorBuffer = colorBuffer;
        this.uvBuffer = uvBuffer;

        const vertices: Array<number> = [];
        const colors: Array<number> = [];
        const uvCoordinates0: Array<number> = [];

        const indicesPerMaterial: Array<Array<number>> = [];

        this.faces.forEach(face => {
            let materialIndices: Array<number> = indicesPerMaterial[face.materialIndex];
            if(!materialIndices){
                indicesPerMaterial[face.materialIndex] = materialIndices = [];
            }

            materialIndices.push(face.a, face.b, face.c);
        });


        this.vertices.forEach(vertex => vertices.push(vertex[0], vertex[1], vertex[2]));

        this.vertexColors.forEach(color => colors.push(color[0], color[1], color[2], color[3]));

        this.uvCoordinates[0].forEach(coordinate => uvCoordinates0.push(coordinate[0], coordinate[1]));


        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Uint8Array(colors), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvCoordinates0), this.gl.STATIC_DRAW);

        const materialIndicesBuffers = this.gl.genBuffers(indicesPerMaterial.length);

        this.indicesPerMaterialBuffer = indicesPerMaterial.map((materialIndices, i) => {
            const materialIndicesBuffer = materialIndicesBuffers[i];

            if(!materialIndicesBuffer){
                throw new Error(`Geometry: Couldn\'t create materialIndicesBuffer.`);
            }

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, materialIndicesBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(materialIndices), this.gl.STATIC_DRAW);

            return materialIndicesBuffer;
        });
    }

    get [Symbol.toStringTag](){
        return `Geometry (${this.faces.length} faces)`;
    }
}
