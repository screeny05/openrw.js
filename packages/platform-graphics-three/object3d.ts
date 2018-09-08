import { IObject3d } from '@rws/platform/graphic';
import { Object3D } from "three";
import { vec3, quat } from "gl-matrix";
import { threeVector3ToGlVec3, setThreeVector3FromGlVec3, threeEulerToGlQuat, setThreeEulerFromGlQuat } from "./converter";

export class ThreeObject3d implements IObject3d {
    _object3d: Object3D;

    get name(): string | undefined { return this._object3d.name; }
    set name(name: string | undefined) { this._object3d.name = name!; }

    constructor(threeObj: Object3D){
        this._object3d = threeObj;
    }

    getPosition(): vec3 {
        return threeVector3ToGlVec3(this._object3d.position);
    }

    setPosition(v: vec3): void {
        setThreeVector3FromGlVec3(v, this._object3d.position);
    }

    getScaling(): vec3 {
        return threeVector3ToGlVec3(this._object3d.scale);
    }

    setScaling(v: vec3): void {
        setThreeVector3FromGlVec3(v, this._object3d.scale);
    }

    getRotation(): quat {
        return threeEulerToGlQuat(this._object3d.rotation);
    }

    setRotation(q: quat): void {
        setThreeEulerFromGlQuat(q, this._object3d.rotation);
    }

    addChild(...children: IObject3d[]): void {
        this._object3d.add(...children.map(c => (<ThreeObject3d>c)._object3d));
    }

    removeChild(...children: IObject3d[]): void {
        this._object3d.remove(...children.map(c => (<ThreeObject3d>c)._object3d));
    }

    addToParent(parent: IObject3d): void {
        this._object3d.parent = (<ThreeObject3d>parent)._object3d;
    }

    removeFromParent(): void {
        // ! needed because of bug in typings
        this._object3d.parent = null!;
    }

    getParent(): IObject3d | null {
        if(this._object3d.parent){
            return <IObject3d>new ThreeObject3d(this._object3d.parent);
        }
        return null;
    }

    getChildren(): IObject3d[] {
        return this._object3d.children.map(c => <IObject3d>new ThreeObject3d(c));
    }
}
