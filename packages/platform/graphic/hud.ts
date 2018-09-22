import { IHudElement } from './hud-element';
import { IGroup } from "./group";

export interface IHud {
    add(element: IHudElement | IGroup): void;
}

export interface IHudConstructor {
    new(): IHud;
}
