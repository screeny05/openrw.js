import { RWSSection, RWSTextureAddressMode, RWSTextureFilterMode } from './clump';

export enum RWSTextureDictionaryDeviceIds {
    none = 0,
    d3d8 = 1,
    d3d9 = 2,
    ps2 = 6,
    xbox = 8
}

export interface RWSTextureNativeRasterFlags {
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

export enum RWSTextureNativeCompression {
    NONE = 0,
    DXT1 = 1,
    DXT3 = 3
}

export enum RWSTextureNativePlatformIds {
    PC_3_VC = 8,
    PC_SA = 9,
    PS2 = 0x50533200,
    XBOX = 5
}

export interface RWSTextureDictionary extends RWSSection  {
    deviceId: RWSTextureDictionaryDeviceIds;
    textures: Array<RWSTextureNative>;
}

export interface RWSTextureNative extends RWSSection {
    platformId: number;
    filterMode: RWSTextureFilterMode;
    uAddressing: RWSTextureAddressMode;
    vAddressing: RWSTextureAddressMode;
    name: string;
    mask: string;
    flags: RWSTextureNativeRasterFlags;
    hasAlpha: number;
    width: number;
    height: number;
    depth: number;
    rasterType: number;
    scanCompression: RWSTextureNativeCompression;
    mipLevels: Array<Buffer>;
    extension: any;
}
