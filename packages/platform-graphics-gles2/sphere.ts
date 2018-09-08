import { vec3 } from 'gl-matrix';

export default class Sphere {
    center: vec3;
    radius: number;

    constructor(center: vec3, radius: number){
        this.center = center;
        this.radius = radius;
    }
}
