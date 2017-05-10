import Object3D from './object3d';
import Face3 from './face3';
import Sphere from './sphere';

import { vec3 } from 'gl-matrix';

export default class Geometry extends Object3D {
    faces: Array<Face3> = [];
    vertices: Array<vec3> = [];
    buffers: Array<any> = [];

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
