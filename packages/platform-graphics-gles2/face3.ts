import { vec3, vec2 } from 'gl-matrix';

export default class Face3 {
    a: number;
    b: number;
    c: number;

    materialIndex: number = 0;

    constructor(a: number, b: number, c: number, materialIndex: number = 0){
        this.a = a;
        this.b = b;
        this.c = c;
        this.materialIndex = materialIndex;
    }
}
