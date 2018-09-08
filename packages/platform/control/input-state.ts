import { DeviceId } from './device-id';

export interface IInputState {
    device: DeviceId;
    input: number;
    // isPressed/mouseMove/gamepadValue/scrollMove
    value: number;
}
