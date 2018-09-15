export { Key } from 'ts-keycode-enum';

export enum MouseButton {
    Primary = 0,
    Middle = 1,
    Secondary = 2,
    Fourth = 3,
    Fifth = 4,
    Sixth = 5,
    Seventh = 6,
}

export enum MouseMove {
    X,
    Y,
    WheelX,
    WheelY,
}

// GamepadAxis maps with an offset of 100 to prevent collisions with buttons
export enum GamepadAxis {
    AX = 100,
    AY = 101,
    BX = 102,
    BY = 103
}

export enum GamepadButton {
    A,
    B,
    X,
    Y,
    BumperLeft,
    BumperRight,
    TriggerLeft,
    TriggerRight,
    Select,
    Start,
    JoystickLeft,
    JoystickRight,
    Up,
    Down,
    Left,
    Right,
    Home
}
