import { NativeWindow } from '@glaced/lwngl';
import { GLES2Context } from '@glaced/gles2-2.0';

import { mat4, vec3, quat } from 'gl-matrix';

// gta3 uses an xzy-esque coordinate-system
// so we have to make sure, that up & direction-vector use
// z as y and y as z
export default class Camera {
    near: number = 0.1;
    far: number = 1000;

    fov: number;
    window: NativeWindow<GLES2Context>;

    projection: mat4 = mat4.create();
    view: mat4 = mat4.create();

    position: vec3 = vec3.fromValues(0, 0, 0);
    up: vec3 = vec3.fromValues(0, 0, 1);

    horizontalRotation: number = 0;
    verticalRotation: number = 0;

    constructor(fov: number, window: NativeWindow<GLES2Context>){
        this.fov = fov;
        this.window = window;

        this.applyPerspective();
        window.on('resize', this.applyPerspective.bind(this));
    }

    applyPerspective(){
        mat4.perspective(this.projection, this.fov, this.window.width / this.window.height, this.near, this.far);
    }

    getDirectionVector(): vec3 {
        return vec3.fromValues(
            Math.cos(this.verticalRotation) * Math.sin(this.horizontalRotation),
            Math.cos(this.verticalRotation) * Math.cos(this.horizontalRotation),
            Math.sin(this.verticalRotation)
        );
    }

    getRightVector(): vec3 {
        const right = vec3.create();
        vec3.cross(right, this.getDirectionVector(), this.up);
        return right;
    }

    getViewMatrix(): mat4 {
        const direction = this.getDirectionVector();

        const lookAt = vec3.create();
        vec3.add(lookAt, this.position, direction);
        //vec3.multiply(lookAt, lookAt, vec3.fromValues(1, 0, 0));
        mat4.lookAt(this.view, this.position, lookAt, this.up);

        var cameraRotation = quat.create();

        return this.view;
    }
}
