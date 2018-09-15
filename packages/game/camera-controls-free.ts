import { IObject3d } from "@rws/platform/graphic";
import { InputControlMapper, ControlId } from "@rws/platform/control";

export class CameraControlFree {
    camera: IObject3d;
    control: InputControlMapper;

    rotX: number = 0;
    rotY: number = 0;

    constructor(camera: IObject3d, control: InputControlMapper){
        this.camera = camera;
        this.control = control;
    }

    update(delta: number): void {
        const forward = this.control.getState(ControlId.MoveForwardOnFoot) * delta * 0.01;
        const backward = this.control.getState(ControlId.MoveBackwardOnFoot) * delta * 0.01;
        const left = this.control.getState(ControlId.MoveLeft) * delta * 0.01;
        const right = this.control.getState(ControlId.MoveRight) * delta * 0.01;
        const direction = this.camera.getWorldDirection();
        const movementSidewards = direction.clone().cross(this.camera.up).scale(right - left);
        this.camera.position.add(direction.scale(forward - backward));
        this.camera.position.add(movementSidewards);

        let rotX = this.control.getState(ControlId.LookX) * delta * -0.0002;
        const rotY = this.control.getState(ControlId.LookY) * delta * -0.0002;

        // prevent > 90deg rotations
        const nextRotX = this.rotX + rotX;
        if(nextRotX > Math.PI / 2 || nextRotX < Math.PI * -.5){
            rotX = 0;
        }

        if(rotY !== 0){
            this.camera.rotation.rotateX(-this.rotX);
            this.camera.rotation.rotateY(rotY);
            this.camera.rotation.rotateX(this.rotX + rotX);
        } else if(rotX !== 0){
            this.camera.rotation.rotateX(rotX);
        }

        this.rotX += rotX;
        this.rotY += rotY;
    }
}
