import { IMesh } from "@rws/platform/graphic";
import { ThreeObject3d } from "./object3d";
import { Mesh } from "three";

export class ThreeMesh extends ThreeObject3d implements IMesh {
    get name(): string {
        return this.src.name;
    }

    constructor(src: Mesh){
        super(src);
    }
}
