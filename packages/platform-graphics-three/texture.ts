import { ITexture } from "@rws/platform/graphic/texture";
import { Texture } from "three";

export class ThreeTexture implements ITexture {
    src: Texture;

    hasAlpha: boolean = false;

    width: number;
    height: number;

    get name(): string {
        return this.src.name;
    }

    get data(): ArrayBuffer {
        return this.src.image.data.buffer;
    }

    constructor(src: Texture){
        this.src = src;
    }
}
