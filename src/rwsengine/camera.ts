import NativeWindow from './native-window';

import { mat4, vec3, quat } from 'gl-matrix';

export default class Camera {
    near: number = 0.1;
    far: number = 1000;

    fov: number;
    window: NativeWindow;

    projection: mat4 = mat4.create();
    view: mat4 = mat4.create();

    position: vec3 = vec3.fromValues(0, 0, 0);
    up: vec3 = vec3.fromValues(0, 1, 0);
    direction: vec3 = vec3.fromValues(0, 0, 1);

    rotation: quat = quat.create();
    horizontalRotation: number = 0;
    verticalRotation: number = 0;

    constructor(fov, window: NativeWindow){
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
            Math.sin(this.verticalRotation),
            Math.cos(this.verticalRotation) * Math.cos(this.horizontalRotation)
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
        mat4.lookAt(this.view, this.position, lookAt, this.up);

        return this.view;
    }
}
