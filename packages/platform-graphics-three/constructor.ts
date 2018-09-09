import { IConstructor } from "@rws/platform/graphic";
import { ThreeScene } from "./scene";
import { ThreeAmbientLight } from "./ambient-light";
import { ThreeVec3 } from "@rws/platform-graphics-three/Vec3";

export const BrowserConstructor: IConstructor = {
    Scene: ThreeScene,
    AmbientLight: ThreeAmbientLight,
    Vec3: ThreeVec3,
    //Camera: ThreeCamera,
    //Skybox: ThreeSkybox,
}
