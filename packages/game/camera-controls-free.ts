import { IObject3d } from "@rws/platform/graphic";
import { InputControlMapper, ControlId } from "@rws/platform/control";

export class CameraControlFree {
    camera: IObject3d;
    control: InputControlMapper;

    constructor(camera: IObject3d, control: InputControlMapper){
        this.camera = camera;
        this.control = control;
    }

    update(delta: number): void {
        const forward = this.control.getState(ControlId.MoveForwardOnFoot) * delta * 0.01;
        const backward = this.control.getState(ControlId.MoveBackwardOnFoot) * delta * 0.01;
        const left = this.control.getState(ControlId.MoveLeft) * delta * 0.01;
        const right = this.control.getState(ControlId.MoveRight) * delta * 0.01;
        const movementSidewards = this.camera.getWorldDirection().clone().cross(this.camera.up).scale(right - left);
        this.camera.position.addScaledVector(this.camera.getWorldDirection(), forward - backward);
        this.camera.position.add(movementSidewards);
        const newRotationZ = this.camera.rotation.z + this.control.getState(ControlId.LookY) * delta * -0.0002;
        const newRotationX = this.camera.rotation.x + this.control.getState(ControlId.LookX) * delta * -0.0002;

        this.camera.rotation.z = newRotationZ;
        if(newRotationX < Math.PI && newRotationX > 0){
            this.camera.rotation.x = newRotationX;
        }
    }
}
