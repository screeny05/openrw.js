import { ICamera } from "@rws/platform/graphic";
import { ThreeObject3d } from "./object3d";
import { Camera } from "three";

export class ThreeCamera extends ThreeObject3d implements ICamera {
    constructor(){
        super(new Camera());
    }
}
