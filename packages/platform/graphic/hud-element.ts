import { ITexture } from './texture';
import { IVec2 } from './vec2';
import { IObject3d } from './object3d';

export interface IHudElement extends IObject3d {
    texture: ITexture;
    width: number;
    height: number;

    setPosition(x: number, y: number): void;
    setSize(width: number, height: number): void;
    setTextureOffset(x: number, y: number): void;
    setTextureSize(x: number, y: number): void;
    setRotation(angle: number): void;
}

export interface IHudElementConstructor {
    new(texture: ITexture): IHudElement;
}
