import { ITexture } from "@rws/platform/graphic/texture";
import { RwsTextureNativeRasterFormat, RwsTextureNativeCompression, RwsTextureNativePlatformIds, RwsTextureFilterMode, RwsTextureAddressMode } from "@rws/library/type/rws";

const getTextureWrap = (gl: WebGL2RenderingContext, mode: RwsTextureAddressMode): number => {
    return {
        [RwsTextureAddressMode.BORDER]: gl.CLAMP_TO_EDGE,
        [RwsTextureAddressMode.CLAMP]: gl.CLAMP_TO_EDGE,
        [RwsTextureAddressMode.MIRROR]: gl.MIRRORED_REPEAT,
        [RwsTextureAddressMode.NONE]: gl.NONE,
        [RwsTextureAddressMode.REPEAT]: gl.REPEAT,
    }[mode];
};

const getTextureFilter = (gl: WebGL2RenderingContext, mode: RwsTextureFilterMode): number => {
    return {
        [RwsTextureFilterMode.NONE]: gl.NONE,
        [RwsTextureFilterMode.NEAREST]: gl.NEAREST,
        [RwsTextureFilterMode.LINEAR]: gl.LINEAR,
        [RwsTextureFilterMode.MIP_NEAREST]: gl.NEAREST_MIPMAP_NEAREST,
        [RwsTextureFilterMode.MIP_LINEAR]: gl.NEAREST_MIPMAP_LINEAR,
        [RwsTextureFilterMode.LINEAR_MIP_NEAREST]: gl.LINEAR_MIPMAP_NEAREST,
        [RwsTextureFilterMode.LINEAR_MIP_LINEAR]: gl.LINEAR_MIPMAP_LINEAR,
    }[mode];
};

export enum TextureFormat {
    FORMAT_8888,
    FORMAT_888,
    FORMAT_565,
    FORMAT_1555
}

export class Texture implements ITexture {
    gl: WebGL2RenderingContext

    mipmaps: Uint8Array[];
    texture: WebGLTexture;

    hasAlpha: boolean = false;

    name: string;
    width: number;
    height: number;
    format: RwsTextureNativeRasterFormat;
    compression: RwsTextureNativeCompression;
    platform: RwsTextureNativePlatformIds;
    internalFormat: TextureFormat;

    wrapS: number;
    wrapT: number;
    filterMin: number;
    filterMag: number;

    get data(){
        return this.mipmaps[0];
    }

    constructor(
        gl: WebGL2RenderingContext,
        name: string,
        width: number,
        height: number,
        mipmaps: Uint8Array[],
        format: TextureFormat,
        wrapS: RwsTextureAddressMode = RwsTextureAddressMode.CLAMP,
        wrapT: RwsTextureAddressMode = RwsTextureAddressMode.CLAMP,
        filterMin: RwsTextureFilterMode = RwsTextureFilterMode.NEAREST,
        filterMag: RwsTextureFilterMode = RwsTextureFilterMode.NEAREST
    ){
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.name = name;
        this.mipmaps = mipmaps;
        this.internalFormat = format;
        this.wrapS = getTextureWrap(this.gl, wrapS);
        this.wrapT = getTextureWrap(this.gl, wrapT);
        this.filterMin = getTextureFilter(this.gl, filterMin);
        this.filterMag = getTextureFilter(this.gl, filterMag);
    }

    createTexture(): void {
        const texture = this.gl.createTexture();
        if(!texture){
            throw new Error('Cannot create texture');
        }

        this.texture = texture;
        this.bind();

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.wrapS);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.wrapT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        let format = this.gl.RGBA;
        let swizzle: null | string = null;

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

        // Assumes RGBA8
        this.mipmaps.forEach((data, level) => {
            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                level,
                format,
                this.width / (2 ** level),
                this.height / (2 ** level),
                0,
                format,
                this.gl.UNSIGNED_BYTE,
                data
            );
        });
    }

    shallowClone(): Texture {
        const clone = new Texture(this.gl, this.name, this.width, this.height, this.mipmaps, this.internalFormat);
        clone.wrapS = this.wrapS;
        clone.wrapT = this.wrapT;
        clone.filterMin = this.filterMin;
        clone.filterMag = this.filterMag;
        clone.texture = this.texture;
        clone.format = this.format;
        clone.compression = this.compression;
        clone.platform = this.platform;
        return clone;
    }

    bind(): void {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    }
}
