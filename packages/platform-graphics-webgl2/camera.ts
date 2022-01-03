import { mat4, vec3, quat } from 'gl-matrix';
import Object3D from './object3d';
import { ICamera } from '@rws/platform/graphic';
import { Vec3 } from './vec3';

// gta3 uses an xzy-esque coordinate-system
// so we have to make sure, that up & direction-vector use
// z as y and y as z
export default class Camera extends Object3D implements ICamera {
    fov: number;
    near: number = 0.1;
    far: number = 1000;

    projection: mat4 = mat4.create();
    view: mat4 = mat4.create();

    constructor(fov: number, near: number, far: number){
        super();
        this.fov = fov;
        this.near = near;
        this.far = far;
        this.up.set(0, 0, 1);
        this.position.y = 3;
        this.lookAt(new Vec3(0, 0, 0));

        this.applyPerspective();
        window.addEventListener('resize', () => this.applyPerspective());
    }

    applyPerspective(){
        mat4.perspective(this.projection, this.fov, window.innerWidth / window.innerHeight, this.near, this.far);
    }
}
