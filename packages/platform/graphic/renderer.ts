import { IScene } from "./scene";
import { RwsStructPool } from "@rws/library/rws-struct-pool";

export interface IRenderer {
    render(delta: number): void;
}

export interface IRendererConstructor {
    new(rwsPool: RwsStructPool, scene: IScene): IRenderer;
}
