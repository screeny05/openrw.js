import { ITexture } from "@rws/platform/graphic/texture";
import { Texture } from "three";

export class ThreeTexture implements ITexture {
    src: Texture;

    hasAlpha: boolean = false;

    get name(): string {
        return this.src.name;
    }

    constructor(src: Texture){
        this.src = src;
    }

    width: number;
    height: number;
}
