import { IVec3 } from '@rws/platform/graphic/vec3';
import { vec3 } from 'gl-matrix';

export class Vec3 implements IVec3 {
    src: vec3;

    get x(): number { return this.src[0]; }
    set x(x: number) { this.src[0] = x; }
    get y(): number { return this.src[1]; }
    set y(y: number) { this.src[1] = y; }
    get z(): number { return this.src[2]; }
    set z(z: number) { this.src[2] = z; }

    constructor();
    constructor(src: vec3);
    constructor(x: number, y: number, z: number);
    constructor(x?: number | vec3, y?: number, z?: number){
        if(typeof x === 'object'){
            this.src = x;
        } else {
            this.src = vec3.create();
        }
        if(typeof x === 'number' && y && z){
            this.set(x, y, z);
        }
    }

    clone(): Vec3 {
        return new Vec3(vec3.clone(this.src));
    }
    set(x: number, y: number, z: number): this {
        vec3.set(this.src, x, y, z);
        return this;
    }
    add(a: Vec3): this {
        vec3.add(this.src, this.src, a.src);
        return this;
    }
    sub(a: Vec3): this {
        vec3.sub(this.src, this.src, a.src);
        return this;
    }
    mul(a: Vec3): this {
        vec3.mul(this.src, this.src, a.src);
        return this;
    }
    scale(a: number): this {
        vec3.scale(this.src, this.src, a);
        return this;
    }
    lerp(a: Vec3, t: number): this {
        vec3.lerp(this.src, this.src, a.src, t);
        return this;
    }
    normalize(): this {
        vec3.normalize(this.src, this.src);
        return this;
    }
    cross(a: Vec3): this {
        vec3.cross(this.src, this.src, a.src);
        return this;
    }
    len(): number {
        return vec3.length(this.src);
    }
    lenSqr(): number {
        return vec3.squaredLength(this.src);
    }
}
