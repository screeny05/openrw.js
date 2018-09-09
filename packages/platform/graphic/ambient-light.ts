import { IObject3d } from "./object3d";
import { IVec3 } from "./vec3";

export interface IAmbientLight extends IObject3d {
    color: IVec3;
}

export interface IAmbientLightConstructor {
    new(color: IVec3): IAmbientLight;
}
