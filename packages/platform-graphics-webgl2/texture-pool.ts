import { ITexturePool, ITexture } from "@rws/platform/graphic";
import { RwsStructPool } from "@rws/library/rws-struct-pool";
import { Texture, TextureFormat } from "./texture";
import { RwsSectionType, RwsTextureDictionary, RwsTextureNative, RwsTextureNativeRasterFormat, RwsTextureNativeCompression } from "@rws/library/type/rws";

export class TexturePool implements ITexturePool {
    gl: WebGL2RenderingContext;

    rwsPool: RwsStructPool;

    textureCache: Map<string, ITexture> = new Map();
    loadedFiles: string[] = [];

    fallbackTexture: Texture;

    constructor(rwsPool: RwsStructPool){
        this.rwsPool = rwsPool;
    }

    init(gl: WebGL2RenderingContext){
        this.gl = gl;

        const fallbackData = new Uint8Array([
            255, 0, 0, 0, 255, 0,
            0, 255, 0, 255, 0, 0,
        ]);
        this.fallbackTexture = new Texture(this.gl, 'fallback_texture', 2, 2, [fallbackData]);
    }

    get(name: string): Texture {
        if(!this.textureCache.has(name)){
            console.error(`TexturePool: ${name} is not yet loaded.`);
            return this.cloneFallbackTexture(name);
        }
        return this.textureCache.get(name) as Texture;
    }

    has(name: string): boolean {
        throw new Error("Method not implemented.");
    }

    getLoadedEntries(): ITexture[] {
        throw new Error("Method not implemented.");
    }

    async loadFromFile(fileName: string): Promise<void> {
        fileName = this.rwsPool.fileIndex.normalizePath(fileName);
        if(this.loadedFiles.includes(fileName)){
            return;
        }

        const dictionary = await this.rwsPool.parseRwsFromFile(fileName, RwsSectionType.RW_TEXTURE_DICTIONARY) as RwsTextureDictionary;
        if(!dictionary){
            throw new Error(`TexturePool: ${fileName} not found.`);
        }

        this.populateFromDictionary(dictionary);
        this.loadedFiles.push(fileName);
    }

    populateFromDictionary(dictionary: RwsTextureDictionary): void {
        dictionary.textures.forEach(textureNative => {
            this.textureCache.set(textureNative.name, this.textureNativeToTexture(textureNative));
        });
    }

    textureNativeToTexture(textureNative: RwsTextureNative): Texture {
        const { isPal8, isPal4, isFormat888, isFormat8888, maybeFormat565, maybeFormat4444, usesPalette } = textureNative.flags;
        const isFormat1555 = textureNative.format === RwsTextureNativeRasterFormat.FORMAT_1555;
        const isFormat4444 = maybeFormat4444 && textureNative.scanCompression === RwsTextureNativeCompression.NONE;
        const isFormatDXT3 = maybeFormat4444 && textureNative.scanCompression === RwsTextureNativeCompression.DXT3;
        const isFormat565 = maybeFormat565 && textureNative.scanCompression === RwsTextureNativeCompression.NONE;
        const isFormatDXT1 = maybeFormat565 && textureNative.scanCompression === RwsTextureNativeCompression.DXT1;

        let format: TextureFormat|null = null;

        if(isFormat8888 && !usesPalette){
            format = TextureFormat.FORMAT_8888;
        }
        if(isFormat888 && !usesPalette){
            format = TextureFormat.FORMAT_888;
        }
        if(isFormat565){
            // txd says it is 565, but in reality it's 8888
            format = TextureFormat.FORMAT_8888;
        }

        if(format === null){
            console.log(isFormat1555, isFormat4444, isFormat565, isFormatDXT1, isFormatDXT3);
            console.warn('TexturePool: not implemented', textureNative.name, textureNative);
            return this.cloneFallbackTexture(textureNative.name);
        }

        const texture = new Texture(this.gl, textureNative.name, textureNative.width, textureNative.height, textureNative.mipLevels, format, textureNative.uAddressing, textureNative.vAddressing, textureNative.filterMode, textureNative.filterMode);
        texture.createTexture();
        return texture;
    }

    cloneFallbackTexture(name: string){
        const clone = this.fallbackTexture.shallowClone();
        clone.name = name;
        return clone;
    }

    loadFromImg(imgName: string, fileName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    isTxdLoaded(fileName: string): boolean;
    isTxdLoaded(imgName: string, fileName?: string): boolean {
        throw new Error("Method not implemented.");
    }
}
