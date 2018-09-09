import { IConfig, EngineLevel } from "@rws/platform/config";

export const PlatformConfig: IConfig = {
    debug: true,
    fov: 60,
    language: 'DE',
    level: EngineLevel.GTAIII,
    packageVersion: '0.1.0'
}

export function getConfig(): IConfig {
    return PlatformConfig;
}
