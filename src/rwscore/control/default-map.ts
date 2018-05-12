import { Control } from "./control";
import { MouseButton, MouseMove, Key } from "./input";
import { InputControlMap } from "./mapper";
import { InputDevice } from "./device";

export const defaultMap: InputControlMap = {
    [Control.Aim]: [{
        isToggle: true,
        device: InputDevice.Mouse,
        input: MouseButton.Secondary
    }],
    [Control.Fire]: [{
        device: InputDevice.Mouse,
        input: MouseButton.Primary
    }],
    [Control.MoveForwardOnFoot]: [{
        device: InputDevice.Keyboard,
        input: Key.UpArrow
    }, {
        device: InputDevice.Keyboard,
        input: Key.W
    }],
    [Control.MoveForwardInCar]: [{
        device: InputDevice.Keyboard,
        input: Key.UpArrow
    }, {
        device: InputDevice.Keyboard,
        input: Key.W
    }],
    [Control.MoveLeft]: [{
        device: InputDevice.Keyboard,
        input: Key.LeftArrow
    }, {
        device: InputDevice.Keyboard,
        input: Key.A
    }],
    [Control.MoveBackwardOnFoot]: [{
        device: InputDevice.Keyboard,
        input: Key.DownArrow
    }, {
        device: InputDevice.Keyboard,
        input: Key.S
    }],
    [Control.MoveBackwardInCar]: [{
        device: InputDevice.Keyboard,
        input: Key.DownArrow
    }, {
        device: InputDevice.Keyboard,
        input: Key.S
    }],
    [Control.MoveRight]: [{
        device: InputDevice.Keyboard,
        input: Key.RightArrow
    }, {
        device: InputDevice.Keyboard,
        input: Key.D
    }],
    [Control.Sprint]: [{
        isToggle: true,
        device: InputDevice.Keyboard,
        input: Key.Shift
    }],
    [Control.LookY]: [{
        device: InputDevice.Mouse,
        input: MouseMove.X
    }],
    [Control.LookX]: [{
        device: InputDevice.Mouse,
        input: MouseMove.Y
    }],
}
