import { IPlatformInput } from "../platform/input";
import { InputDevice } from "./device";

export interface InputControlMapEntry {
    isToggle?: boolean;
    device: InputDevice;
    inputs: number[];
}

export interface InputControlMap {
    [control: string]: InputControlMapEntry;
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
}
