import { IVec3 } from '@rws/platform/graphic/vec3';
import { Vector3 } from 'three';

export class ThreeVec3 implements IVec3 {
    src: Vector3;

    get x(): number { return this.src.x; }
    set x(x: number) { this.src.x = x; }
    get y(): number { return this.src.y; }
    set y(y: number) { this.src.y = y; }
    get z(): number { return this.src.z; }
    set z(z: number) { this.src.z = z; }

    constructor(src: Vector3);
    constructor(x: number, y: number, z: number);
    constructor(x: number | Vector3, y?: number, z?: number){
        if(x instanceof Vector3){
            this.src = x;
        } else {
            this.src = new Vector3(x, y, z);
        }
    }

    clone(): ThreeVec3 {
        return new ThreeVec3(this.src.clone());
    }
    add(a: ThreeVec3): this {
        this.src.add(a.src);
        return this;
    }
    sub(a: ThreeVec3): this {
        this.src.sub(a.src);
        return this;
    }
    mul(a: ThreeVec3): this {
        this.src.multiply(a.src);
        return this;
    }
    scale(a: number): this {
        this.src.multiplyScalar(a);
        return this;
    }
    lerp(a: ThreeVec3, t: number): this {
        this.src.lerp(a.src, t);
        return this;
    }
    cross(a: ThreeVec3): this {
        this.src.cross(a.src);
        return this;
    }
    len(): number {
        return this.src.length();
    }
    lenSqr(): number {
        return this.src.lengthSq();
    }
}
