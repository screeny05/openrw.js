import { vec3, vec2 } from 'gl-matrix';

export default class Face3 {
    a: number;
    b: number;
    c: number;

    normal: vec3;
    aNormal: vec3|null;
    bNormal: vec3|null;
    cNormal: vec3|null;

    materialIndex: number = 0;

    aColor: any;
    bColor: any;
    cColor: any;

    textureCoordinates: Array<[vec2, vec2, vec2]> = [];

    constructor(a: number, b: number, c: number, normal: vec3){
        this.a = a;
        this.b = b;
        this.c = c;
        this.normal = normal;
    }
}
