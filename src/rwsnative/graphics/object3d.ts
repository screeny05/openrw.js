import { mat4, vec3, quat } from 'gl-matrix';
import { IObject3d } from './index';

export default class NativeObject3d implements IObject3d {
    position: vec3 = vec3.create();
    scaling: vec3 = vec3.fromValues(1, 1, 1);
    rotation: quat = quat.create();
    worldTransform: mat4 = mat4.create();
    localTransform: mat4 = mat4.create();

    parent?: NativeObject3d;
    children: NativeObject3d[] = [];

    name?: string;

    constructor(){}

    updateLocalTransform(): void {
        mat4.fromRotationTranslationScaleOrigin(this.localTransform, this.rotation, this.position, this.scaling, this.position);
    }

    updateHierarchyTransform(): void {
        this.worldTransform = mat4.clone(this.localTransform);
        if(this.parent){
            mat4.multiply(this.worldTransform, this.parent.worldTransform, this.worldTransform);
        }
        this.children.forEach(child => child.updateHierarchyTransform());
    }

    updateTransform(): void {
        this.updateLocalTransform();
        this.updateHierarchyTransform();
    }

    addChild(child: NativeObject3d): void {
        this.children.push(child);
        child.removeFromParent();
        child.parent = this;
        child.updateHierarchyTransform();
    }

    addChildren(children: Array<NativeObject3d>): void {
        children.forEach(child => this.addChild(child));
    }

    removeChild(child: NativeObject3d): void {
        const index = this.children.indexOf(child);
        if(index === -1){
            return;
        }

        this.children.splice(index, 1);
        child.parent = undefined;
    }

    addToParent(parent: NativeObject3d): void {
        parent.addChild(this);
    }

    removeFromParent(): void {
        if(!this.parent){
            return;
        }
        this.parent.removeChild(this);
    }

    debug(indentation: number = 0){
        console.log(' '.repeat(indentation) + this.toString().replace(/\[object (.*?)\]/, '$1'));
        this.children.forEach(child => child.debug(indentation + 4));
    }

    get [Symbol.toStringTag](){
        return `Object3D ${this.name}`;
    }
}
