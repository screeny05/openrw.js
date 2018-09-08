import { IInput } from "./input";
import { IInputState } from './input-state';
import { DeviceId } from "./device-id";
import { ControlId } from "./control-id";

export interface InputControlMapEntry {
    isToggle?: boolean;
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
        let validState: IInputState | null = null;

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
            }
        });

        if(validState){
            // ! is neccessary because typescript somehow thinks `validState: never`
            return validState!.value;
        }

        return defaultValue;
    }
}
