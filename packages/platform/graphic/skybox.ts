import { IObject3d } from "./object3d";
import { GlobalState } from "@rws/game/global-state";
import { TimecycIndex } from "@rws/library/index/timecyc";

export interface ISkybox extends IObject3d {
    update(delta: number): void;
}

export interface ISkyboxConstructor {
    new(state: GlobalState, timecyc: TimecycIndex): ISkybox;
}
