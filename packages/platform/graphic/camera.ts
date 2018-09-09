import { IObject3d } from "./object3d";

export interface ICamera extends IObject3d { }

export interface ICameraConstructor {
    constructor(): ICamera;
}
