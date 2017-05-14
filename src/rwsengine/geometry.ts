import Object3D from './object3d';
import Face3 from './face3';
import Sphere from './sphere';

import { vec3 } from 'gl-matrix';

export default class Geometry extends Object3D {
    faces: Array<Face3> = [];
    vertices: Array<vec3> = [];
    buffers: Array<any> = [];

    colorBuffer: WebGLBuffer;
    uvBuffer: WebGLBuffer;
    vertexBuffer: WebGLBuffer;
    indexBuffer: WebGLBuffer;

    boundingSphere: Sphere;

    children: Array<Geometry> = [];

    gl: WebGLRenderingContext;

    doRender: boolean = true;

    constructor(gl: WebGLRenderingContext){
        super();

        this.gl = gl;
    }

    updateBuffer(){
        this.buffers = this.faces.map(face => this.updateFaceBuffer(face));
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

        if(!indexBuffer || !vertexBuffer || !colorBuffer){
            throw new Error('Geometry: Couldn\'t create buffer.');
        }

        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
        this.colorBuffer = colorBuffer;

        const vertices: Array<number> = [];
        this.vertices.forEach(vertex => vertices.push(vertex[0], vertex[1], vertex[2]));

        const indices: Array<number> = [];
        const colors: Array<number> = [];

        this.faces.forEach(face => {
            indices.push(face.a, face.b, face.c);
            colors.push(
                face.aColor.r / 255, face.aColor.g / 255, face.aColor.b / 255, face.aColor.a / 255,
                face.bColor.r / 255, face.bColor.g / 255, face.bColor.b / 255, face.bColor.a / 255,
                face.cColor.r / 255, face.cColor.g / 255, face.cColor.b / 255, face.cColor.a / 255
            );
        });

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    }

    addFaceFromVertices(a: vec3, b: vec3, c: vec3){
        this.vertices.push(a, b, c);
        const face = new Face3(this.vertices.length - 3, this.vertices.length - 2, this.vertices.length - 1, vec3.fromValues(0, 1, 0));
        this.faces.push(face);
        this.buffers.push(this.updateFaceBuffer(face));
    }

    get [Symbol.toStringTag](){
        return `Geometry ${this.name} (${this.faces.length} faces)`;
    }
}
