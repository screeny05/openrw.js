export enum EngineLevel {
    GTAIII = 3,
    GTAVC = 4,
    GTASA = 5
}

export interface IConfig {
    level: EngineLevel;
    language: string;

    packageVersion: string;
    debug: boolean;

    fov: number;
}
