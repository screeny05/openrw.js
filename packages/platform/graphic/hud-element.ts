import { ITexture } from './texture';
import { IVec2 } from './vec2';

export interface IHudElement {
    texture: ITexture;
    position: IVec2;
    rotation: number;
    scale: IVec2;
    name?: string;
    width: number;
    height: number;
    offset: IVec2;

    setSub(x: number, y: number, width: number, height: number): void;
}

export interface IHudElementConstructor {
    new(texture: ITexture, position: IVec2, rotation?: number, scale?: IVec2): IHudElement;
}
