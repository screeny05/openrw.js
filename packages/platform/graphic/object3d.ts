import { vec3, quat } from "gl-matrix";

export interface IObject3d {
    name?: string;

    getPosition(): vec3;
    setPosition(v: vec3): void;
    getScaling(): vec3;
    setScaling(v: vec3): void;
    getRotation(): quat;
    setRotation(q: quat): void;

    addChild(...children: IObject3d[]): void;
    removeChild(...children: IObject3d[]): void;
    addToParent(parent: IObject3d): void;
    removeFromParent(): void;

    getParent(): IObject3d | null;
    getChildren(): IObject3d[];
}
