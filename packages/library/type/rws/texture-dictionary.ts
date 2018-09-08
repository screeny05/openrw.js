import { RwsTextureAddressMode, RwsTextureFilterMode } from './clump';
import { RwsSection, RwsExtension } from './index';

export enum RwsTextureDictionaryDeviceIds {
    none = 0,
    d3d8 = 1,
    d3d9 = 2,
    ps2 = 6,
    xbox = 8
}

export interface RwsTextureNativeRasterFlags {
    DEFAULT: boolean;
    FORMAT_1555: boolean;
    FORMAT_565: boolean;
    FORMAT_4444: boolean;
    FORMAT_LUM_8: boolean;
    FORMAT_8888: boolean;
    FORMAT_888: boolean;
    FORMAT_555: boolean;

    AUTO_MIPMAP: boolean;
    PALETTE_8: boolean;
    PALETTE_4: boolean;
    MIPMAPPED: boolean;
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
