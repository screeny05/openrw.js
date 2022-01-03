import { mat4, vec3, quat } from 'gl-matrix';
import { Vec3 } from './vec3';
import { Quat } from './quat';
import { IObject3d } from '@rws/platform/graphic';

export default class Object3D implements IObject3d {
    position: Vec3 = new Vec3();
    scale: Vec3 = new Vec3(1, 1, 1);
    rotation: Quat = new Quat();
    up: Vec3 = new Vec3(1, 1, 0);
    worldTransform: mat4 = mat4.create();
    localTransform: mat4 = mat4.create();

    parent: Object3D|null;
    children: Array<Object3D> = [];

    name: string|undefined;

    updateLocalTransform(): void {
        mat4.fromRotationTranslationScaleOrigin(this.localTransform, this.rotation.src, this.position.src, this.scaling.src, this.position.src);
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

    lookAt(target: Vec3): void {
        this.rotation.lookAt(this.position, target, this.up);
    }

    getWorldPosition(): Vec3 {
        const out = vec3.create();
        mat4.getTranslation(out, this.worldTransform);
        return new Vec3(out);
    }

    getWorldScale(): Vec3 {
        const out = vec3.create();
        mat4.getScaling(out, this.worldTransform);
        return new Vec3(out);
    }

    getWorldRotation(): Quat {
        const out = quat.create();
        mat4.getRotation(out, this.worldTransform);
        return new Quat(out);
    }

    getWorldDirection(): Vec3 {
        // courtesy of threejs
        const out = new Vec3(-this.worldTransform[8], -this.worldTransform[9], -this.worldTransform[10]);
        return out.normalize();
    }

    addChild(...children: Object3D[]): void {
        this.children.push(...children);
        children.forEach(child => {
            child.removeFromParent();
            child.parent = this;
            child.updateHierarchyTransform();
        });
    }

    addChildren(children: Array<Object3D>): void {
        children.forEach(child => this.addChild(child));
    }

    removeChild(...children: Object3D[]): void {
        children.forEach(child => {
            const index = this.children.indexOf(child);
            if(index === -1){
                return;
            }

            this.children.splice(index, 1);
            child.parent = null;
        });
    }

    removeAllChildren(): void {
        this.children.splice(0);
    }

    addToParent(parent: Object3D): void {
        parent.addChild(this);
    }

    removeFromParent(): void {
        if(!this.parent){
            return;
        }
        this.parent.removeChild(this);
    }

    getParent(): Object3D | null {
        return this.parent;
    }

    getChildren(): Object3D[] {
        return this.children;
    }

    debug(indentation: number = 0){
        console.log(' '.repeat(indentation) + this.toString().replace(/\[object (.*?)\]/, '$1'));
        this.children.forEach(child => child.debug(indentation + 4));
    }

    get [Symbol.toStringTag](){
        return `Object3D ${this.name}`;
    }
}
