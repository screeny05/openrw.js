import { Control } from "./control";
import { MouseButton, MouseMove, Key } from "./input";
import { InputControlMap } from "./mapper";
import { InputDevice } from "./device";

export const defaultMap: InputControlMap = {
    [Control.Aim]: {
        isToggle: true,
        device: InputDevice.Mouse,
        inputs: [MouseButton.Secondary]
    },
    [Control.Fire]: {
        device: InputDevice.Mouse,
        inputs: [MouseButton.Primary]
    },
    [Control.MoveForwardOnFoot]: {
        device: InputDevice.Keyboard,
        inputs: [Key.UpArrow, Key.W]
    },
    [Control.MoveForwardInCar]: {
        device: InputDevice.Keyboard,
        inputs: [Key.UpArrow, Key.W]
    },
    [Control.MoveLeft]: {
        device: InputDevice.Keyboard,
        inputs: [Key.LeftArrow, Key.A]
    },
    [Control.MoveBackwardOnFoot]: {
        device: InputDevice.Keyboard,
        inputs: [Key.DownArrow, Key.S]
    },
    [Control.MoveBackwardInCar]: {
        device: InputDevice.Keyboard,
        inputs: [Key.DownArrow, Key.S]
    },
    [Control.MoveRight]: {
        device: InputDevice.Keyboard,
        inputs: [Key.RightArrow, Key.D]
    },
    [Control.Sprint]: {
        isToggle: true,
        device: InputDevice.Keyboard,
        inputs: [Key.Shift]
    },
    [Control.LookY]: {
        device: InputDevice.Mouse,
        inputs: [MouseMove.Y]
    },
    [Control.LookX]: {
        device: InputDevice.Mouse,
        inputs: [MouseMove.X]
    },
}
