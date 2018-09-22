import { IObject3d } from "./object3d";

export interface IGroup extends IObject3d {}

export interface IGroupConstructor {
    new(): IGroup;
}
