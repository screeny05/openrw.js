import { InputDevice } from '../../../rwscore/control/device';

export interface IPlatformInputState {
    device: InputDevice;
    input: number;
    // isPressed/mouseMove/gamepadValue/scrollMove
    value: number;
}

export interface IPlatformInput {
    update(delta: number): void;
    getState(device: InputDevice, input: number, defaultState?: number): IPlatformInputState;
    startGamepadPolling(): void;
    stopGamepadPolling(): void;
}
