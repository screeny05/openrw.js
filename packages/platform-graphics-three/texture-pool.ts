import { ITexturePool } from "@rws/platform/graphic";
import { RwsStructPool } from "@rws/library/rws-struct-pool";
import * as THREE from 'three';
import { RwsTextureAddressMode, RwsTextureFilterMode, RwsTextureNative, RwsTextureDictionary, RwsSectionType, RwsTextureNativeRasterFormat, RwsTextureNativeCompression } from "@rws/library/type/rws";
import { ThreeTexture } from "./texture";
import { Texture } from "three";

const WrapMap = {
    [RwsTextureAddressMode.BORDER]: THREE.ClampToEdgeWrapping,
    [RwsTextureAddressMode.CLAMP]: THREE.ClampToEdgeWrapping,
    [RwsTextureAddressMode.MIRROR]: THREE.MirroredRepeatWrapping,
    [RwsTextureAddressMode.NONE]: THREE.RepeatWrapping,
    [RwsTextureAddressMode.REPEAT]: THREE.RepeatWrapping,
};

const FilterMap = {
    [RwsTextureFilterMode.NONE]: THREE.LinearFilter,
    [RwsTextureFilterMode.NEAREST]: THREE.NearestFilter,
    [RwsTextureFilterMode.LINEAR]: THREE.LinearFilter,
    [RwsTextureFilterMode.MIP_NEAREST]: THREE.LinearFilter,
    [RwsTextureFilterMode.MIP_LINEAR]: THREE.LinearFilter,
    [RwsTextureFilterMode.LINEAR_MIP_NEAREST]: THREE.LinearFilter,
    [RwsTextureFilterMode.LINEAR_MIP_LINEAR]: THREE.LinearFilter,
};

const SWIZZLE_RGBA_BGRA = [2, 1, 0, 3];
const SWIZZLE_RGBA_BGRX = [2, 1, 0, -1];
const SWIZZLE_5551_1555 = '1555';

export class ThreeTexturePool implements ITexturePool {
    rwsPool: RwsStructPool;

    textureCache: Map<string, ThreeTexture> = new Map();
    loadedFiles: string[] = [];

    fallbackTexture: Texture;

    constructor(rwsPool: RwsStructPool){
        this.rwsPool = rwsPool;

        const fallbackData = new Uint8Array([
            255, 0, 0, 0, 255, 0,
            0, 255, 0, 255, 0, 0,
        ]);
        this.fallbackTexture = new THREE.DataTexture(fallbackData, 2, 2, THREE.RGBFormat, THREE.UnsignedByteType);
        this.fallbackTexture.name = 'fallback_texture';
    }

    cloneFallbackTexture(name: string): ThreeTexture {
        const fallback = new ThreeTexture(this.fallbackTexture.clone());
        fallback.src.name = name;
        fallback.width = 2;
        fallback.height = 2;
        return fallback;
    }

    get(name: string): ThreeTexture {
        // TODO: Return fallback texture?
        if(!this.has(name)){
            console.error(`TexturePool: ${name} is not yet loaded.`);
            return this.cloneFallbackTexture(name);
        }
        return this.textureCache.get(name) as ThreeTexture;
    }

    has(name: string): boolean {
        return this.textureCache.has(name);
    }

    getLoadedEntries(): ThreeTexture[] {
        return Array.from(this.textureCache.values());
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

    async loadFromImg(imgName: string, fileName: string): Promise<void> {
        fileName = this.rwsPool.fileIndex.normalizePath(fileName);
        const combinedPath = `${imgName}/${fileName}`;
        if(this.loadedFiles.includes(combinedPath)){
            return;
        }

        const dictionary = await this.rwsPool.parseRwsFromImg(imgName, fileName, RwsSectionType.RW_TEXTURE_DICTIONARY) as RwsTextureDictionary;
        if(!dictionary){
            throw new Error(`TexturePool: ${fileName} not found in ${imgName}.`);
        }
        this.populateFromDictionary(dictionary);
        this.loadedFiles.push(combinedPath);
    }

    isTxdLoaded(fileName: string): boolean;
    isTxdLoaded(imgName: string, fileName?: string): boolean {
        fileName = fileName ? `${imgName}/${fileName}` : imgName;
        return this.loadedFiles.includes(fileName);
    }

    populateFromDictionary(dictionary: RwsTextureDictionary): void {
        dictionary.textures.forEach(textureNative => {
            this.textureCache.set(textureNative.name, this.textureNativeToThreeTexture(textureNative));
        });
    }

    textureNativeToThreeTexture(textureNative: RwsTextureNative): ThreeTexture {
        const { isPal8, isPal4, isFormat888, isFormat8888, maybeFormat565, maybeFormat4444, usesPalette } = textureNative.flags;
        const isFormat1555 = textureNative.format === RwsTextureNativeRasterFormat.FORMAT_1555;
        const isFormat4444 = maybeFormat4444 && textureNative.scanCompression === RwsTextureNativeCompression.NONE;
        const isFormatDXT3 = maybeFormat4444 && textureNative.scanCompression === RwsTextureNativeCompression.DXT3;
        const isFormat565 = maybeFormat565 && textureNative.scanCompression === RwsTextureNativeCompression.NONE;
        const isFormatDXT1 = maybeFormat565 && textureNative.scanCompression === RwsTextureNativeCompression.DXT1;

        if(!(isFormat888 || isFormat8888 || isFormat1555 || isFormatDXT3 || isFormatDXT1)){
            console.warn('TexturePool: not implemented', textureNative.name, textureNative);
            return this.cloneFallbackTexture(textureNative.name);
        }

        let swizzle: null | number[] | string = null;
        let format: THREE.PixelFormat = THREE.RGBAFormat;
        let type: THREE.TextureDataType = THREE.UnsignedByteType;
        let isCompressed = false;

        if(isFormat8888 && !usesPalette){
            swizzle = SWIZZLE_RGBA_BGRA;
        }

        if(isFormat888 && !usesPalette){
            swizzle = SWIZZLE_RGBA_BGRX;
        }

        if(isFormat1555){
            type = THREE.UnsignedShort5551Type as any as THREE.TextureDataType;
            swizzle = SWIZZLE_5551_1555;
        }

        if(isFormatDXT3){
            format = THREE.RGBA_S3TC_DXT3_Format as any as THREE.PixelFormat;
            isCompressed = true;
        }

        if(isFormatDXT1){
            format = THREE.RGB_S3TC_DXT1_Format as any as THREE.PixelFormat;
            isCompressed = true;
        }

        const miplevels = textureNative.mipLevels.map((level, i) => {
            let data: null | Uint16Array | Uint8Array = null;

            if(typeof swizzle === 'string'){
                if(swizzle === SWIZZLE_5551_1555){
                    data = this.swizzle5551To1555(new Uint16Array(level.buffer, level.byteOffset, level.length / 2));
                } else {
                    throw new Error(`Unsupported texture swizzle '${swizzle}'`);
                }
            } else if(swizzle) {
                data = this.swizzle(level, swizzle);
            } else {
                data = new Uint8Array(level);
            }

            return {
                data: data as ArrayBufferView,
                width: textureNative.width / (2 ** i),
                height: textureNative.height / (2 ** i)
            }
        });

        const threeTexture: THREE.Texture = !isCompressed ? new THREE.DataTexture(
            miplevels[0].data as Uint8Array,
            textureNative.width,
            textureNative.height,
            format,
            type,
            THREE.UVMapping,
            this.mapWrapToThreeWrap(textureNative.uAddressing),
            this.mapWrapToThreeWrap(textureNative.vAddressing),
            this.mapFilterToThreeFilter(textureNative.filterMode),
            this.mapFilterToThreeFilter(textureNative.filterMode)
        ) : new THREE.CompressedTexture(
            miplevels as ImageData[],
            textureNative.width,
            textureNative.height,
            format,
            type,
            THREE.UVMapping,
            this.mapWrapToThreeWrap(textureNative.uAddressing),
            this.mapWrapToThreeWrap(textureNative.vAddressing),
            this.mapFilterToThreeFilter(textureNative.filterMode),
            this.mapFilterToThreeFilter(textureNative.filterMode)
        );

        threeTexture.mipmaps = miplevels as any;
        threeTexture.needsUpdate = true;
        threeTexture.name = textureNative.name;
        threeTexture.premultiplyAlpha = true;

        if((textureNative.format & RwsTextureNativeRasterFormat.AUTO_MIPMAP) === RwsTextureNativeRasterFormat.AUTO_MIPMAP){
            threeTexture.generateMipmaps = true;
        }

        const iTex = new ThreeTexture(threeTexture);
        iTex.hasAlpha = !!textureNative.hasAlpha;
        iTex.width = textureNative.width;
        iTex.height = textureNative.height;
        iTex.format = textureNative.format;
        iTex.compression = textureNative.scanCompression;
        iTex.platform = textureNative.platformId;

        return iTex;
    }

    mapWrapToThreeWrap(addressMode: RwsTextureAddressMode): THREE.Wrapping {
        const val = WrapMap[addressMode];
        if(typeof val === 'undefined'){
            throw new TypeError(`Invalid RwsTextureAddressMode ${addressMode}.`);
        }
        return val;
    }

    mapFilterToThreeFilter(filterMode: RwsTextureFilterMode): THREE.TextureFilter {
        const val = FilterMap[filterMode];
        if(typeof val === 'undefined'){
            throw new TypeError(`Invalid RwsTextureFilterMode ${filterMode}.`);
        }
        return val;
    }

    swizzle(data: Uint8Array, order: number[]): Uint8Array {
        for (let i = 0; i < data.length / order.length; i++) {
            const org = data.subarray(i * order.length, i * order.length + order.length);
            const swizzled: number[] = [];
            order.forEach((newPos, oldPos) => {
                // -1 = throw channel away
                swizzled[newPos] = newPos === -1 ? 0 : org[oldPos];
            });
            data.set(swizzled, i * order.length);
        }
        return data;
    }

    swizzle5551To1555(data: Uint16Array): Uint16Array {
        const maskA = 0b1000000000000000;
        const maskB = 0b0111110000000000;
        const maskG = 0b0000001111100000;
        const maskR = 0b0000000000011111;

        for (let i = 0; i < data.length; i++) {
            const a = (data[i] & maskA) >> 15;
            const b = (data[i] & maskB) >> 10;
            const g = (data[i] & maskG) >> 5;
            const r = data[i] & maskR;

            data[i] = 1 | (b << 1) | (g << 6) | (r << 11);
        }
        return data;
    }

    debug(textureNative: RwsTextureNative): void {
        const canvas = document.createElement('canvas');
        canvas.width = textureNative.width;
        canvas.height = textureNative.height;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if(!ctx){
            throw new Error('No context');
        }

        for(let i = 0; i < textureNative.width * textureNative.height; i++){
            const tx = textureNative.mipLevels[0];
            const x = i % textureNative.width;
            const y = Math.floor(i / textureNative.height);
            const ci = i * 4;
            ctx.fillStyle = `rgba(${tx[ci]}, ${tx[ci + 1]}, ${tx[ci + 2]}, ${tx[ci + 3] / 255})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
}
