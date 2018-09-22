import { vec3, quat } from "gl-matrix";
import { IVec3 } from "./vec3";
import { IQuat } from "@rws/platform/graphic/quat";

export interface IObject3d {
    name?: string;
    readonly position: IVec3;
    readonly scale: IVec3;
    readonly up: IVec3;
    readonly rotation: IQuat;

    getWorldPosition(): IVec3;
    getWorldScale(): IVec3;
    getWorldRotation(): IQuat;
    getWorldDirection(): IVec3;

    addChild(...children: IObject3d[]): void;
    removeChild(...children: IObject3d[]): void;
    removeAllChildren(): void;
    addToParent(parent: IObject3d): void;
    removeFromParent(): void;

    getParent(): IObject3d | null;
    getChildren(): IObject3d[];
}
