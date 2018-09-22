import { IObject3d } from '@rws/platform/graphic';
import { Object3D, Quaternion, Vector3 } from "three";
import { ThreeVec3 } from './vec3';
import { ThreeQuat } from './quat';

export class ThreeObject3d implements IObject3d {
    src: Object3D;
    readonly position: ThreeVec3;
    readonly scale: ThreeVec3;
    readonly up: ThreeVec3;
    readonly rotation: ThreeQuat;

    get name(): string | undefined { return this.src.name; }
    set name(name: string | undefined) { this.src.name = name!; }

    constructor(threeObj: Object3D){
        this.src = threeObj;
        this.src.userData.adapter = this;
        this.position = new ThreeVec3(this.src.position);
        this.scale = new ThreeVec3(this.src.scale);
        this.up = new ThreeVec3(this.src.up);
        this.rotation = new ThreeQuat(this.src.quaternion);
    }

    getWorldPosition(): ThreeVec3 {
        const vec3 = new Vector3();
        this.src.getWorldPosition(vec3);
        return new ThreeVec3(vec3);
    }

    getWorldScale(): ThreeVec3 {
        const vec3 = new Vector3();
        this.src.getWorldScale(vec3);
        return new ThreeVec3(vec3);
    }

    getWorldRotation(): ThreeQuat {
        const quat = new Quaternion();
        this.src.getWorldQuaternion(quat);
        return new ThreeQuat(quat);
    }

    getWorldDirection(): ThreeVec3 {
        const vec3 = new Vector3();
        this.src.getWorldDirection(vec3);
        return new ThreeVec3(vec3);
    }

    addChild(...children: ThreeObject3d[]): void {
        this.src.add(...children.map(c => c.src));
    }

    removeChild(...children: ThreeObject3d[]): void {
        this.src.remove(...children.map(c => c.src));
    }

    removeAllChildren(): void {
        this.src.remove(...this.src.children);
    }

    addToParent(parent: ThreeObject3d): void {
        this.src.parent = (parent).src;
    }

    removeFromParent(): void {
        this.src.parent = null;
    }

    getParent(): ThreeObject3d | null {
        if(this.src.parent){
            return new ThreeObject3d(this.src.parent);
        }
        return null;
    }

    getChildren(): ThreeObject3d[] {
        return this.src.children.map(c => c.userData.adapter);
    }
}
