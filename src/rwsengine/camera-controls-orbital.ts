import Input from './input';
import Camera from './camera';

import { vec3, quat } from 'gl-matrix';

export default class CameraControlsOrbital {
    input: Input;
    camera: Camera;

    forwardSpeed: number = 20;
    sidewardSpeed: number = 10;

    constructor(input: Input, camera: Camera){
        this.input = input;
        this.camera = camera;
    }

    controlToScalar(statePos: number, stateNeg: number): number {
        return statePos ? statePos : stateNeg * -1;
    }

    update(deltaTime: number){
        const directionVector = this.camera.getDirectionVector();

        const right = vec3.create();
        const movementForward = vec3.create();
        const movementSideward = vec3.create();
        vec3.scale(movementForward, directionVector, deltaTime * this.controlToScalar(this.input.states.forward, this.input.states.backward) * this.forwardSpeed);
        vec3.add(this.camera.position, this.camera.position, movementForward);


        // @TODO right is not calculated correctly, when directionVector equals up
        vec3.cross(right, directionVector, this.camera.up);
        vec3.scale(movementSideward, right, deltaTime * this.controlToScalar(this.input.states.right, this.input.states.left) * this.sidewardSpeed)
        vec3.add(this.camera.position, this.camera.position, movementSideward);

        // @TODO clamp instead of check
        if(Math.abs(this.camera.verticalRotation + this.input.states.rotationY) <= Math.PI / 2){
            this.camera.verticalRotation += this.input.states.rotationY;
        }

        this.camera.horizontalRotation -= this.input.states.rotationX;
    }
}
