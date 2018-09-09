import { IMesh } from "@rws/platform/graphic";
import { ThreeObject3d } from "./object3d";
import { Mesh } from "three";

export class ThreeMesh extends ThreeObject3d implements IMesh {
    constructor(src: Mesh){
        super(src);
    }
}
