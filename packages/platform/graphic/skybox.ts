import { IMesh } from "./mesh";
import { GlobalState } from "@rws/game/global-state";
import { TimecycIndex } from "@rws/library/index/timecyc";

export interface ISkybox extends IMesh {
    update(delta: number): void;
}

export interface ISkyboxConstructor {
    new(state: GlobalState, timecyc: TimecycIndex): ISkybox;
}
