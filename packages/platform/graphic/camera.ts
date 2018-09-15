import { IObject3d } from "./object3d";

export interface ICamera extends IObject3d {
    fov: number;
    near: number;
    far: number;
}

export interface ICameraConstructor {
    new(fov: number, near: number, far: number): ICamera;
}
