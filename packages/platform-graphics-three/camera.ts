import { ICamera } from "@rws/platform/graphic";
import { ThreeObject3d } from "./object3d";
import { PerspectiveCamera, Quaternion, Vector3 } from "three";
import { ThreeQuat } from "@rws/platform-graphics-three/quat";

export class ThreeCamera extends ThreeObject3d implements ICamera {
    src: PerspectiveCamera;

    get fov(): number {
        return this.src.fov;
    }
    set fov(val: number){
        this.src.fov = val;
    }
    get near(): number {
        return this.src.near;
    }
    set near(val: number){
        this.src.near = val;
    }
    get far(): number {
        return this.src.far;
    }
    set far(val: number){
        this.src.far = val;
    }

    constructor(fov: number, near: number, far: number){
        super(new PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far));
        this.src.up.set(0, 0, 1);
        this.src.position.y = 3;
        this.src.lookAt(0, 0, 0);
    }
}
