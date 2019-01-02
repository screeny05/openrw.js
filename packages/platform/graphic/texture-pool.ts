import { ITexture } from "@rws/platform/graphic/texture";
import { RwsStructPool } from "@rws/library/rws-struct-pool";

export interface ITexturePool {
    get(name: string): ITexture;
    has(name: string): boolean;
    getLoadedEntries(): ITexture[];
    loadFromFile(fileName: string): Promise<void>;
    loadFromImg(imgName: string, fileName: string): Promise<void>;
    isTxdLoaded(fileName: string): boolean;
    isTxdLoaded(imgName: string, fileName: string): boolean;
}

export interface ITexturePoolConstructor {
    new(rwsPool: RwsStructPool): ITexturePool;
}
