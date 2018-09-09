import { IScene } from "@rws/platform/graphic";
import { Scene } from "three";
import { ThreeObject3d } from "@rws/platform-graphics-three/object3d";

export class ThreeScene implements IScene {
    src: Scene;

    constructor(){
        this.src = new Scene();
    }

    add(...obj: ThreeObject3d[]): void {
        this.src.add(...obj.map(obj => obj.src));
    }

    getByName(name: string): ThreeObject3d | undefined {
        const obj = this.src.getObjectByName(name);
        if(!obj){
            return;
        }
        return obj.userData.adapter;
    }
}
