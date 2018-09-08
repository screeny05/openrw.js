import { IInputState } from "./input-state";
import { DeviceId } from './device-id'

export interface IInput {
    update(delta: number): void;
    getState(device: DeviceId, input: number, defaultState?: number): IInputState;
    startGamepadPolling(): void;
    stopGamepadPolling(): void;
}
