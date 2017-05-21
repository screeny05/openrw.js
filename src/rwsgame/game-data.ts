import Config from './config';
import FileIndex from './file-index';
import ImgIndex from './img-index';
import GxtIndex from './gxt-index';

import streamTextDat, { DatCommand } from '../rwslib/loaders/text-dat';
import IplLoader from '../rwslib/loaders/ipl';
import IdeLoader from '../rwslib/loaders/ide';

import * as Corrode from 'corrode';
import * as fs from 'fs';

interface PreDefinedTextures {
    particle;
    icons;
    hud;
    fonts;
    generic;
}

export default class GameData {
    config: Config;
    fileIndex: FileIndex;

    gxtIndex: GxtIndex;
    rwsIndex: Map<string, any> = new Map();
    imgIndices: Map<string, ImgIndex> = new Map();
    ideLoaders: Map<string, IdeLoader> = new Map();
    iplLoaders: Map<string, IplLoader> = new Map();

    textures: PreDefinedTextures;

    constructor(config: Config){
        this.config = config;

        this.fileIndex = new FileIndex(this.config.rootPath);
    }

    async init(){
        console.time('fileindex');
        await this.fileIndex.indexDirectory();
        console.timeEnd('fileindex');

        console.time('gxt');
        await this.loadGXT(`text/${this.config.language}.gxt`);
        console.timeEnd('gxt');

        console.time('img');
        await this.loadIMG('models/gta3.img');
        await this.loadIMG('anim/cuts.img');
        console.timeEnd('img');

        console.time('dat');
        await this.loadLevelFile('data/default.dat');
        await this.loadLevelFile('data/gta3.dat');
        console.timeEnd('dat');
    }

    async loadLevelFile(path: string){
        path = this.fileIndex.getPath(path);
        const commandStream = streamTextDat(path, { lowercase: true });

        const tasks: Array<Promise<any>> = [];

        commandStream.on('data', (entry: DatCommand) => {
            const [command, ...args] = entry;
            if(command === 'ipl'){
                tasks.push(this.loadIPL(args[0]));
            } else if(command === 'ide'){
                tasks.push(this.loadIDE(args[0]));
            } else if(command === 'modelfile'){
                tasks.push(this.loadRWSFromFile(args[0]));
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

    async loadIMG(path: string){
        const imgIndex = new ImgIndex(this.fileIndex, path);
        await imgIndex.indexImgWithDir();

        this.imgIndices.set(this.fileIndex.normalizePath(path), imgIndex);
    }

    async loadIDE(path: string){
        const realPath = this.fileIndex.getPath(path);
        const loader = new IdeLoader(realPath);
        await loader.load();

        this.ideLoaders.set(this.fileIndex.normalizePath(path), loader);
    }

    async loadIPL(path: string){
        const realPath = this.fileIndex.getPath(path);
        const loader = new IplLoader(realPath);
        await loader.load();

        this.iplLoaders.set(this.fileIndex.normalizePath(path), loader);
    }

    async loadGXT(path: string){
        const gxtIndex = new GxtIndex(this.fileIndex, path);
        await gxtIndex.load();

        this.gxtIndex = gxtIndex;
    }

    async loadRWSFromFile(path: string, expectedSectionType?: number, expectedSectionCount?: number){
        const rwsStream = this.fileIndex.getFileStream(path);
        const rws = await this.loadRWSFromStream(rwsStream, expectedSectionType, expectedSectionCount);

        this.rwsIndex.set(path, rws);
        return rws;
    }

    async loadRWSFromImg(img: ImgIndex|string, name: string, expectedSectionType?: number, expectedSectionCount?: number){
        img = this.getImg(img);
        const rws = await this.loadRWSFromStream(img.getImgStreamByName(name), expectedSectionType, expectedSectionCount);

        this.rwsIndex.set(name, rws);
        return rws;
    }

    async loadRWSFromStream(rwsStream: fs.ReadStream, expectedSectionType?: number, expectedSectionCount?: number){
        const rwsParser = new Corrode();
        rwsParser.ext.rws('rws', expectedSectionType, expectedSectionCount).map.push('rws');

        rwsStream.pipe(rwsParser);
        return await rwsParser.asPromised();
    }

    getImg(img: ImgIndex|string): ImgIndex {
        if(typeof img !== 'string'){
            return img;
        }

        const foundImg = this.imgIndices.get(img);
        if(!foundImg){
            throw new ReferenceError(`GameData: No IMG with name ${img} found.`);
        }

        return foundImg;
    }
}
