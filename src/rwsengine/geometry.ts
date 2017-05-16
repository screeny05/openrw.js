import Object3D from './object3d';
import Face3 from './face3';
import Sphere from './sphere';

import TxdTexture from './txd-texture';

import { vec3, vec2 } from 'gl-matrix';

export default class Geometry extends Object3D {
    faces: Array<Face3> = [];
    vertices: Array<vec3> = [];
    vertexColors: Array<any> = [];
    vertexNormals: Array<vec3> = [];
    uvCoordinates: Array<any> = [];

    buffers: Array<any> = [];

    colorBuffer: WebGLBuffer;
    uvBuffer: WebGLBuffer;
    vertexBuffer: WebGLBuffer;
    indexBuffer: WebGLBuffer;

    boundingSphere: Sphere;

    children: Array<Geometry> = [];

    gl: WebGLRenderingContext;

    doRender: boolean = true;

    textures: Array<TxdTexture> = [];

    constructor(gl: WebGLRenderingContext){
        super();

        this.gl = gl;
    }

    updateBuffer(){
        //this.buffers = this.faces.map(face => this.updateFaceBuffer(face));
        this.updateElementBuffer();
    }

    updateFaceBuffer(face: Face3): WebGLBuffer {
        const buffer = this.gl.createBuffer();

        if(!buffer){
            throw new Error('Geometry: Couldn\'t create buffer.');
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

        const a = this.vertices[face.a];
        const b = this.vertices[face.b];
        const c = this.vertices[face.c];

        const vertices = [
            a[0], a[1], a[2],
            b[0], b[1], b[2],
            c[0], c[1], c[2],
        ];

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        return buffer;
    }

    updateElementBuffer() {
        const vertexBuffer = this.gl.createBuffer();
        const indexBuffer = this.gl.createBuffer();
        const colorBuffer = this.gl.createBuffer();
        const uvBuffer = this.gl.createBuffer();

        if(!indexBuffer || !vertexBuffer || !colorBuffer || !uvBuffer){
            throw new Error('Geometry: Couldn\'t create buffer.');
        }

        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
        this.colorBuffer = colorBuffer;
        this.uvBuffer = uvBuffer;

        const vertices: Array<number> = [];
        const indices: Array<number> = [];
        const colors: Array<number> = [];
        const uvCoordinates: Array<number> = [];

        this.vertices.forEach(vertex => vertices.push(vertex[0], vertex[1], vertex[2]));

        this.faces.forEach(face => {
            indices.push(face.a, face.b, face.c);
        });

        this.vertexColors.forEach(color => {
            colors.push(color.r / 255, color.g / 255, color.b / 255, color.a / 255);
        });

        this.uvCoordinates.forEach(coordinate => {
            uvCoordinates.push(coordinate.u, coordinate.v);
        });

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvCoordinates), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    }

    get [Symbol.toStringTag](){
        return `Geometry ${this.name} (${this.faces.length} faces)`;
    }
}
