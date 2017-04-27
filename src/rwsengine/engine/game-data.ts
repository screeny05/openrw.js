import FileIndex from './file-index';

import streamTextDat, { DatCommand } from '../../rwslib/loaders/text-dat';
import IplLoader from '../../rwslib/loaders/ipl';
import IdeLoader from '../../rwslib/loaders/ide';

interface PreDefinedTextures {
    particle;
    icons;
    hud;
    fonts;
    generic;
}

export default class GameData {
    gameDataPath: string;
    fileIndex: FileIndex = new FileIndex();

    textures: PreDefinedTextures;

    constructor(gameDataPath: string){
        this.gameDataPath = gameDataPath;
    }

    async init(){
        this.fileIndex.indexDirectory(this.gameDataPath);

        const tasks: Array<Promise<any>> = [];

        tasks.push(this.loadLevelFile('data/default.dat'));
        tasks.push(this.loadLevelFile('data/gta3.dat'));

        console.log((await Promise.all(tasks))[0][0].entriesPeds);
    }

    async loadIMG(path: string){}

    async loadLevelFile(path: string){
        path = this.fileIndex.getFSPath(path);
        const commandStream = streamTextDat(path, { lowercase: true });

        const tasks: Array<Promise<any>> = [];

        commandStream.on('data', (entry: DatCommand) => {
            const [command, ...args] = entry;
            if(command === 'ipl'){
                tasks.push(this.loadIPL(args[0]));
            } else if(command === 'ide'){
                tasks.push(this.loadIDE(args[0]));
            }
        });

        return new Promise((resolve, reject) => {
            commandStream.on('finish', () => {
                Promise.all(tasks)
                    .then(resolve)
                    .catch(reject);
            });

            commandStream.on('error', reject);
        });
    }

    async loadIDE(path: string){
        path = this.fileIndex.getFSPath(path);
        const loader = new IdeLoader(path);
        await loader.load();
        return loader;
    }

    async loadIPL(path: string){
        path = this.fileIndex.getFSPath(path);
        const loader = new IplLoader(path);
        await loader.load();
        return loader;
    }
}
