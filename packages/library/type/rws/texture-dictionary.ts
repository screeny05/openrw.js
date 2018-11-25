import { RwsTextureAddressMode, RwsTextureFilterMode } from './clump';
import { RwsSection, RwsExtension } from './index';

export enum RwsTextureDictionaryDeviceIds {
    none = 0,
    d3d8 = 1,
    d3d9 = 2,
    ps2 = 6,
    xbox = 8
}

export enum RwsTextureNativeRasterFormat {
    DEFAULT = 0x0000,
    FORMAT_1555 = 0x0100,
    FORMAT_565 = 0x0200,
    FORMAT_4444 = 0x0300,
    FORMAT_LUM_8 = 0x0400,
    FORMAT_8888 = 0x0500,
    FORMAT_888 = 0x0600,
    FORMAT_555 = 0x0A00,

    AUTO_MIPMAP = 0x1000,
    PALETTE_8 = 0x2000,
    PALETTE_4 = 0x4000,
    MIPMAPPED = 0x8000,
}

export interface RwsTextureNativeRasterFlags {
    isPal8: boolean;
    isPal4: boolean;
    isFormat8888: boolean;
    isFormat888: boolean;
    maybeFormat565: boolean;
    maybeFormat4444: boolean;
    isTransparent: boolean;
    usesPalette: boolean;
}

export enum RwsTextureNativeCompression {
    NONE = 0,
    DXT1 = 1,
    DXT3 = 3
}

export enum RwsTextureNativePlatformIds {
    PC_3_VC = 8,
    PC_SA = 9,
    PS2 = 0x50533200,
    XBOX = 5
}

export interface RwsTextureDictionary extends RwsSection {
    __name__: 'rwsTextureDictionary';
    deviceId: RwsTextureDictionaryDeviceIds;
    textures: Array<RwsTextureNative>;
}

export interface RwsTextureNative extends RwsSection {
    __name__: 'rwsTextureNative';
    platformId: number;
    filterMode: RwsTextureFilterMode;
    uAddressing: RwsTextureAddressMode;
    vAddressing: RwsTextureAddressMode;
    name: string;
    mask: string;
    format: RwsTextureNativeRasterFormat;
    flags: RwsTextureNativeRasterFlags;
    hasAlpha: number;
    width: number;
    height: number;
    depth: number;
    rasterType: number;
    scanCompression: RwsTextureNativeCompression;
    mipLevels: Array<Buffer>;
    extension: RwsExtension;
}

export interface RwsTexture extends RwsSection {
    __name__: 'rwsTexture';
    filterMode: RwsTextureFilterMode;
    uAddressing: RwsTextureAddressMode;
    vAddressing: RwsTextureAddressMode;
    useMipLevels: number;
    name: string;
    mask: string;
    extension: RwsExtension;
}
