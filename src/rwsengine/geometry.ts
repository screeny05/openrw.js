import Object3D from './object3d';
import Face3 from './face3';

import { vec3 } from 'gl-matrix';

export default class Geometry extends Object3D {
    faces: Array<Face3> = [];
    vertices: Array<vec3> = [];
    buffers: Array<any> = [];
    gl: WebGLRenderingContext;

    doRender: boolean = true;

    constructor(gl: WebGLRenderingContext){
        super();

        this.gl = gl;
    }

    updateBuffer(){
        this.buffers = this.faces.map(face => {
            const buffer = this.gl.createBuffer();
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
        });
    }
}
