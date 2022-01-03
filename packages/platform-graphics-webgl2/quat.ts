import { IQuat } from "@rws/platform/graphic/quat";
import { vec3, quat, mat4 } from 'gl-matrix';
import { Vec3 } from "./vec3";

const vecX = vec3.fromValues(1, 0, 0);
const vecY = vec3.fromValues(0, 1, 0);
const vecZ = vec3.fromValues(0, 0, 1);

export class Quat implements IQuat {
    src: quat;

    get w(): number { return this.src[3]; }
    set w(w: number) { this.src[3] = w; }
    get x(): number { return this.src[0]; }
    set x(x: number) { this.src[0] = x; }
    get y(): number { return this.src[1]; }
    set y(y: number) { this.src[1] = y; }
    get z(): number { return this.src[2]; }
    set z(z: number) { this.src[2] = z; }

    constructor(src?: quat){
        if(typeof src === 'object'){
            this.src = src;
        } else {
            this.src = quat.create();
        }
    }

    clone(): Quat {
        return new Quat(quat.clone(this.src));
    }
    set(x: number, y: number, z: number, w: number): this {
        quat.set(this.src, x, y, z, w);
        return this;
    }
    mul(a: Quat): this {
        quat.multiply(this.src, this.src, a.src);
        return this;
    }
    dot(a: Quat): this {
        quat.dot(this.src, a.src);
        return this;
    }
    len(): number {
        return quat.length(this.src);
    }
    lenSqr(): number {
        return quat.squaredLength(this.src);
    }
    slerp(a: Quat, t: number): this {
        quat.slerp(this.src, this.src, a.src, t);
        return this;
    }
    inverse(): this {
        quat.invert(this.src, this.src);
        return this;
    }

    rotateX(rad: number): this {
        quat.rotateX(this.src, this.src, rad);
        return this;
    }

    rotateY(rad: number): this {
        quat.rotateY(this.src, this.src, rad);
        return this;
    }

    rotateZ(rad: number): this {
        quat.rotateZ(this.src, this.src, rad);
        return this;
    }

    rotate(x: number, y: number, z: number): this {
        this.rotateX(x);
        this.rotateY(y);
        this.rotateZ(z);
        return this;
    }

    lookAt(pos: Vec3, target: Vec3, up: Vec3): this {
        const rotationMat = mat4.create();
        mat4.lookAt(rotationMat, pos.src, target.src, up.src);
        mat4.getRotation(this.src, rotationMat);
        return this;
    }

    getEulerAngles(): [number, number, number] {
        return [
            quat.getAxisAngle(vecX, this.src),
            quat.getAxisAngle(vecY, this.src),
            quat.getAxisAngle(vecZ, this.src)
        ];
    }
}
