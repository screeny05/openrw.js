import { ITexturePool } from "@rws/platform/graphic";
import { RwsStructPool } from "@rws/library/rws-struct-pool";
import * as THREE from 'three';
import { RwsTextureAddressMode, RwsTextureFilterMode, RwsTextureNative, RwsTextureDictionary, RwsSectionType } from "@rws/library/type/rws";
import { ThreeTexture } from "./texture";

const WrapMap = {
    [RwsTextureAddressMode.BORDER]: THREE.ClampToEdgeWrapping,
    [RwsTextureAddressMode.CLAMP]: THREE.ClampToEdgeWrapping,
    [RwsTextureAddressMode.MIRROR]: THREE.MirroredRepeatWrapping,
    [RwsTextureAddressMode.NONE]: THREE.ClampToEdgeWrapping,
    [RwsTextureAddressMode.REPEAT]: THREE.RepeatWrapping,
};

const FilterMap = {
    [RwsTextureFilterMode.NONE]: THREE.LinearFilter,
    [RwsTextureFilterMode.NEAREST]: THREE.NearestFilter,
    [RwsTextureFilterMode.LINEAR]: THREE.LinearFilter,
    [RwsTextureFilterMode.MIP_NEAREST]: THREE.NearestFilter,
    [RwsTextureFilterMode.MIP_LINEAR]: THREE.LinearFilter,
    [RwsTextureFilterMode.LINEAR_MIP_NEAREST]: THREE.NearestFilter,
    [RwsTextureFilterMode.LINEAR_MIP_LINEAR]: THREE.LinearFilter,
};

export class ThreeTexturePool implements ITexturePool {
    rwsPool: RwsStructPool;

    textureCache: Map<string, ThreeTexture> = new Map();
    loadedFiles: string[] = [];

    fallbackTexture: ThreeTexture;

    constructor(rwsPool: RwsStructPool){
        this.rwsPool = rwsPool;

        const fallbackData = new Uint8Array([
            255, 0, 0, 0, 255, 0,
            0, 255, 0, 255, 0, 0,
        ]);
        this.fallbackTexture = new ThreeTexture(new THREE.DataTexture(fallbackData, 2, 2, THREE.RGBAFormat, THREE.UnsignedByteType));
        this.fallbackTexture.src.name = 'fallback';
        this.fallbackTexture.src.repeat.set(.05, .05);
    }

    get(name: string): ThreeTexture {
        // TODO: Return fallback texture?
        if(!this.textureCache.has(name)){
            console.error(`TexturePool: ${name} is not yet loaded.`);
            return this.fallbackTexture;
        }
        return this.textureCache.get(name) as ThreeTexture;
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

    populateFromDictionary(dictionary: RwsTextureDictionary): void {
        dictionary.textures.forEach(textureNative => {
            this.textureCache.set(textureNative.name, this.textureNativeToThreeTexture(textureNative));
        });
    }

    textureNativeToThreeTexture(textureNative: RwsTextureNative): ThreeTexture {
        const usesPalette = textureNative.flags.PALETTE_4 || textureNative.flags.PALETTE_8;

        if(!(usesPalette && (textureNative.flags.FORMAT_888 || textureNative.flags.FORMAT_8888))){
            console.warn('TexturePool: not implemented', textureNative.name);
            return this.fallbackTexture;
        }

        let format = THREE.RGBFormat;
        if(textureNative.flags.FORMAT_8888){
            format = THREE.RGBAFormat;
        }

        const miplevels = textureNative.mipLevels.map((level, i) => ({
            data: new Uint8Array(level),
            width: textureNative.width / (2 ** i),
            height: textureNative.height / (2 ** i)
        }));

        const threeTexture = new THREE.DataTexture(
            miplevels[0].data,
            textureNative.width,
            textureNative.height,
            format,
            THREE.UnsignedByteType,
            THREE.UVMapping,
            this.mapWrapToThreeWrap(textureNative.uAddressing),
            this.mapWrapToThreeWrap(textureNative.vAddressing),
            this.mapFilterToThreeFilter(textureNative.filterMode),
            this.mapFilterToThreeFilter(textureNative.filterMode)
        );

        threeTexture.mipmaps = miplevels as any;
        threeTexture.needsUpdate = true;
        threeTexture.name = textureNative.name;

        return new ThreeTexture(threeTexture);
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
