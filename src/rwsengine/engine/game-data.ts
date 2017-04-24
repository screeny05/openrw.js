import FileIndex from './file-index';

import loadTextDat from '../../rwslib/loaders/text-dat';
import IplLoader from '../../rwslib/loaders/ipl';

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

        await Promise.all(tasks);
    }

    async loadIMG(path: string){}

    async loadLevelFile(path: string){
        path = this.fileIndex.getFSPath(path);
        const commands = await loadTextDat(path);

        Promise.all(commands.map(commandLine => {
            const [command, ...args] = commandLine;

            if(command === 'IPL'){
                return this.loadIPL(args[0]);
            }
        }))
    }

    async loadIDE(path: string){}

    async loadIPL(path: string){
        path = this.fileIndex.getFSPath(path);
        const loader = new IplLoader(path);
        await loader.load();
    }
}
