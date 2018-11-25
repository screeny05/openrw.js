import { RwsTextureNativeCompression, RwsTextureNativeRasterFormat, RwsTextureNativePlatformIds } from "@rws/library/type/rws";

export interface ITexture {
    name: string;
    hasAlpha: boolean;
    width: number;
    height: number;
    data: ArrayBuffer;

    // info data
    format: RwsTextureNativeRasterFormat;
    compression: RwsTextureNativeCompression;
    platform: RwsTextureNativePlatformIds;
}
