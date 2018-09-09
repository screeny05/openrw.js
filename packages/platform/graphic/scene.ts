import { IObject3d } from "./object3d";

export interface IScene {
    add(obj: IObject3d): void;
    getByName(name: string): IObject3d | undefined;
}

export interface ISceneConstructor {
    new(): IScene;
}
