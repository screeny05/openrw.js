import { IPlatformInput, IPlatformInputState } from "../platform/input";
import { InputDevice } from "./device";
import { Control } from "./control";

export interface InputControlMapEntry {
    isToggle?: boolean;
    device: InputDevice;
    input: number;
}

export interface InputControlMap {
    [control: string]: InputControlMapEntry[];
}

export class InputControlMapper {
    map: InputControlMap;
    input: IPlatformInput;

    constructor(map: InputControlMap, input: IPlatformInput){
        this.map = map;
        this.input = input;
    }

    update(delta: number){
        this.input.update(delta);
    }

    getState(control: Control, defaultValue: number = 0): number {
        const mapEntries = this.map[control];
        let validState: IPlatformInputState | null = null;

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
