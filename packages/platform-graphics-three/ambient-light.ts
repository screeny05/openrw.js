import { IAmbientLight } from "@rws/platform/graphic/ambient-light";
import { ThreeVec3 } from "@rws/platform-graphics-three/Vec3";
import { AmbientLight, Color } from "three";
import { ThreeObject3d } from "@rws/platform-graphics-three/object3d";

export class ThreeAmbientLight extends ThreeObject3d implements IAmbientLight {
    color: ThreeVec3;
    src: AmbientLight;

    constructor(color: ThreeVec3){
        const src = new AmbientLight(new Color(color[0], color[1], color[2]));
        super(src);
        this.color = color;
    }
}
