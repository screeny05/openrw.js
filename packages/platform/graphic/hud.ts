import { PlatformAdapter } from "@rws/platform/adapter";
import { IHudElement } from './hud-element';

export interface IHud {
    add(element: IHudElement): void;
}

export interface IHudConstructor {
    new(): IHud;
}
