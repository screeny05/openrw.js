import { IInput } from "./input";
import { IInputState } from './input-state';
import { DeviceId } from "./device-id";
import { ControlId } from "./control-id";

export interface InputControlMapEntry {
    isToggle?: boolean;
    multiplier?: number;
    device: DeviceId;
    input: number;
}

export interface InputControlMap {
    [control: string]: InputControlMapEntry[];
}

export class InputControlMapper {
    map: InputControlMap;
    input: IInput;

    constructor(map: InputControlMap, input: IInput){
        this.map = map;
        this.input = input;
    }

    update(delta: number){
        this.input.update(delta);
    }

    getState(control: ControlId, defaultValue: number = 0): number {
        const mapEntries = this.map[control];
        let validState: IInputState | undefined;
        let validEntry: InputControlMapEntry | undefined;

        if(!mapEntries){
            return defaultValue;
        }

        mapEntries.forEach(entry => {
            if(validState){
                return;
            }

            const state = this.input.getState(entry.device, entry.input);

            if(state.value !== 0){
                validState = state;
                validEntry = entry;
            }
        });

        if(validState && validEntry){
            const multiplier = validEntry.multiplier ? validEntry.multiplier : 1;
            return validState.value * multiplier;
        }

        return defaultValue;
    }
}
