import { mat4, vec3, quat } from 'gl-matrix';

export default class Object3D {
    position: vec3 = vec3.create();
    scaling: vec3 = vec3.fromValues(1, 1, 1);
    rotation: quat = quat.create();
    worldTransform: mat4 = mat4.create();
    localTransform: mat4 = mat4.create();

    parent: Object3D|null;
    children: Array<Object3D> = [];

    name: string|null;

    constructor(){}

    updateLocalTransform(): void {
        mat4.fromRotationTranslationScaleOrigin(this.localTransform, this.rotation, this.position, this.scaling, this.position);
    }

    updateHierarchyTransform(): void {
        this.worldTransform = mat4.clone(this.localTransform);
        if(this.parent){
            mat4.multiply(this.worldTransform, this.worldTransform, this.parent.worldTransform);
        }
        this.children.forEach(child => child.updateHierarchyTransform());
    }

    updateTransform(): void {
        this.updateLocalTransform();
        this.updateHierarchyTransform();
    }

    addChild(child: Object3D): void {
        this.children.push(child);
        child.removeFromParent();
        child.parent = this;
        child.updateHierarchyTransform();
    }

    removeChild(child: Object3D): void {
        const index = this.children.indexOf(child);
        if(index === -1){
            return;
        }

        this.children.splice(index, 1);
        child.parent = null;
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

    debug(indentation: number = 0){
        console.log(' '.repeat(indentation) + 'Object3D ' + this.name);

        this.children.forEach(child => child.debug(indentation + 4));
    }
}
