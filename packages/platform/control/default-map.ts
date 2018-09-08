import { ControlId } from "./control-id";
import { MouseButton, MouseMove, Key } from "./input-source";
import { InputControlMap } from "./mapper";
import { DeviceId } from "./device-id";

export const defaultMap: InputControlMap = {
    [ControlId.Aim]: [{
        isToggle: true,
        device: DeviceId.Mouse,
        input: MouseButton.Secondary
    }],
    [ControlId.Fire]: [{
        device: DeviceId.Mouse,
        input: MouseButton.Primary
    }],
    [ControlId.MoveForwardOnFoot]: [{
        device: DeviceId.Keyboard,
        input: Key.UpArrow
    }, {
        device: DeviceId.Keyboard,
        input: Key.W
    }],
    [ControlId.MoveForwardInCar]: [{
        device: DeviceId.Keyboard,
        input: Key.UpArrow
    }, {
        device: DeviceId.Keyboard,
        input: Key.W
    }],
    [ControlId.MoveLeft]: [{
        device: DeviceId.Keyboard,
        input: Key.LeftArrow
    }, {
        device: DeviceId.Keyboard,
        input: Key.A
    }],
    [ControlId.MoveBackwardOnFoot]: [{
        device: DeviceId.Keyboard,
        input: Key.DownArrow
    }, {
        device: DeviceId.Keyboard,
        input: Key.S
    }],
    [ControlId.MoveBackwardInCar]: [{
        device: DeviceId.Keyboard,
        input: Key.DownArrow
    }, {
        device: DeviceId.Keyboard,
        input: Key.S
    }],
    [ControlId.MoveRight]: [{
        device: DeviceId.Keyboard,
        input: Key.RightArrow
    }, {
        device: DeviceId.Keyboard,
        input: Key.D
    }],
    [ControlId.Sprint]: [{
        isToggle: true,
        device: DeviceId.Keyboard,
        input: Key.Shift
    }],
    [ControlId.LookY]: [{
        device: DeviceId.Mouse,
        input: MouseMove.X
    }],
    [ControlId.LookX]: [{
        device: DeviceId.Mouse,
        input: MouseMove.Y
    }],
}
