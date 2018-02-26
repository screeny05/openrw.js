import { InputDevice } from '../control/device';

export interface IPlatformInputState {
    device: InputDevice;
    input: number;
    // isPressed/mouseMove/gamepadValue/scrollMove
    state: any;
}

export interface IPlatformInput {
    update(delta: number): void;
    getState(device: InputDevice, input: number, defaultState?: any): IPlatformInputState;
    startGamepadPolling(): void;
    stopGamepadPolling(): void;
}
