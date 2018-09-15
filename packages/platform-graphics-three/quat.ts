import { IQuat } from "@rws/platform/graphic/quat";
import { Quaternion, Vector3, Matrix4, Euler } from "three";
import { ThreeVec3 } from "./vec3";

const vecX = new Vector3(1, 0, 0);
const vecY = new Vector3(0, 1, 0);
const vecZ = new Vector3(0, 0, 1);
const tmpQuat = new Quaternion();

export class ThreeQuat implements IQuat {
    src: Quaternion;

    get w(): number { return this.src.w; }
    set w(w: number) { this.src.w = w; }
    get x(): number { return this.src.x; }
    set x(x: number) { this.src.x = x; }
    get y(): number { return this.src.y; }
    set y(y: number) { this.src.y = y; }
    get z(): number { return this.src.z; }
    set z(z: number) { this.src.z = z; }

    constructor(src: Quaternion){
        this.src = src;
    }

    clone(): ThreeQuat {
        return new ThreeQuat(this.src.clone());
    }
    set(x: number, y: number, z: number, w: number): this {
        this.src.set(x, y, z, w);
        return this;
    }
    mul(a: ThreeQuat): this {
        this.src.multiply(a.src);
        return this;
    }
    dot(a: ThreeQuat): this {
        this.src.dot(a.src);
        return this;
    }
    len(): number {
        return this.src.length();
    }
    lenSqr(): number {
        return this.src.lengthSq();
    }
    slerp(a: ThreeQuat, t: number): this {
        this.src.slerp(a.src, t);
        return this;
    }
    inverse(): this {
        this.src.inverse();
        return this;
    }

    rotateX(rad: number): this {
        tmpQuat.setFromAxisAngle(vecX, rad);
        this.src.multiply(tmpQuat);
        return this;
    }

    rotateY(rad: number): this {
        tmpQuat.setFromAxisAngle(vecY, rad);
        this.src.multiply(tmpQuat);
        return this;
    }

    rotateZ(rad: number): this {
        tmpQuat.setFromAxisAngle(vecZ, rad);
        this.src.multiply(tmpQuat);
        return this;
    }

    rotate(x: number, y: number, z: number): this {
        const max = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
        if(max === 0){
            return this;
        }
        tmpQuat.setFromAxisAngle(new Vector3(x / max, y / max, z / max).normalize(), max);
        this.src.multiply(tmpQuat);
        return this;
    }

    lookAt(pos: ThreeVec3, target: ThreeVec3, up: ThreeVec3): this {
        const mat4 = new Matrix4();
        mat4.lookAt(pos.src, target.src, up.src);
        this.src.setFromRotationMatrix(mat4);
        return this;
    }

    getEulerAngles(): [number, number, number] {
        const euler = new Euler();
        euler.setFromQuaternion(this.src);
        return [euler.x, euler.y, euler.z];
    }
}
