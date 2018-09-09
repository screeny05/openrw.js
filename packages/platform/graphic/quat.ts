import { IVec3 } from "./vec3";

export interface IQuat {
    w: number;
    x: number;
    y: number;
    z: number;

    clone(): IQuat;
    mul(a: IQuat): this;
    dot(a: IQuat): this;
    len(): number;
    lenSqr(): number;
    slerp(a: IQuat, t: number): this;

    rotateX(rad: number): this;
    rotateY(rad: number): this;
    rotateZ(rad: number): this;
    lookAt(pos: IVec3, target: IVec3, up: IVec3): this;
}