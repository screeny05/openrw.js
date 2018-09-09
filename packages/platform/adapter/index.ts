import { IMeshProvider, IScene, IConstructor } from "../graphic";
import { IFileIndex } from "../fs";
import { IInput, InputControlMapper, defaultMap } from "../control";
import { ILoop } from "../loop";
import { IConfig } from "../config";
import { RwsStructPool } from "@rws/library/rws-struct-pool";

export class PlatformAdapter {
    fileIndex: IFileIndex;
    config: IConfig;
    rwsStructPool: RwsStructPool;
    control: InputControlMapper;
    loop: ILoop;
    meshProvider: IMeshProvider;
    graphicConstructors: IConstructor;

    constructor(config: IConfig, fileIndex: IFileIndex, input: IInput, loop: ILoop, meshProvider: IMeshProvider, graphicConstructors: IConstructor){
        this.config = config;
        this.fileIndex = fileIndex;
        this.rwsStructPool = new RwsStructPool(this.fileIndex, config.language);
        this.control = new InputControlMapper(defaultMap, input);
        this.meshProvider = meshProvider;
        this.meshProvider.setRwsStructPool(this.rwsStructPool);
        this.loop = loop;
        this.graphicConstructors = graphicConstructors;
    }

    async load(): Promise<void> {
        await this.fileIndex.load();
        await this.rwsStructPool.load();
    }
}
