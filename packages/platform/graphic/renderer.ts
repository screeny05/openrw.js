import { IScene } from "./scene";
import { RwsStructPool } from "@rws/library/rws-struct-pool";
import { ICamera } from "./camera";
import { IHud } from "./hud";

export interface IRenderer {
    render(delta: number): void;
}

export interface IRendererConstructor {
    new(rwsPool: RwsStructPool, scene: IScene, hud: IHud, camera: ICamera): IRenderer;
}
