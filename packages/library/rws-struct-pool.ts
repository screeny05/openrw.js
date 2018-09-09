import { IFileIndex } from "@rws/platform/fs";
import streamTextDat, { DatCommand } from "./parser-text/text-dat";
import { ImgIndex } from "./index/img";
import { GxtIndex } from "./index/gxt";
import { IdeIndex } from "./index/ide";
import { IplIndex } from "./index/ipl";

import Corrode from 'corrode';
import './parser-bin';
import { RwsSectionType, RwsRootSection, RwsClump, RwsTextureDictionary } from "./type/rws";
import { ColIndex } from "./index/col";
import { CarcolsIndex } from "./index/carcols";
import { TimecycIndex } from "./index/timecyc";
import { HandlingIndex } from "./index/handling";

export class RwsStructPool {
    fileIndex: IFileIndex;
    language: string;
    isLoaded: boolean = false;

    gxtIndex: GxtIndex;
    carcolsIndex: CarcolsIndex;
    timecycIndex: TimecycIndex;
    handlingIndex: HandlingIndex;
    rwsClumpIndex: Map<string, RwsClump> = new Map();
    rwsTextureDictionaryIndex: Map<string, RwsTextureDictionary> = new Map();
    imgIndices: Map<string, ImgIndex> = new Map();
    ideIndices: Map<string, IdeIndex> = new Map();
    iplIndices: Map<string, IplIndex> = new Map();
    colIndices: Map<string, ColIndex> = new Map();

    constructor(fileIndex: IFileIndex, language: string = 'american'){
        this.fileIndex = fileIndex;
        this.language = language;
    }

    isValidPath(): boolean {
        return this.fileIndex.has('models/gta3.img');
    }

    async load(): Promise<void> {
        await this.loadGxt(`text/${this.language}.gxt`);

        await this.loadImg('models/gta3.img');
        await this.loadImg('anim/cuts.img');

        await this.loadRws('models/particle.txd', RwsSectionType.RW_TEXTURE_DICTIONARY);
        await this.loadRwsFromImg('models/gta3.img', 'icons.txd', RwsSectionType.RW_TEXTURE_DICTIONARY);
        await this.loadRws('models/hud.txd', RwsSectionType.RW_TEXTURE_DICTIONARY);
        await this.loadRws('models/fonts.txd', RwsSectionType.RW_TEXTURE_DICTIONARY);
        await this.loadRws('models/generic.txd', RwsSectionType.RW_TEXTURE_DICTIONARY);
        await this.loadRws('models/misc.txd', RwsSectionType.RW_TEXTURE_DICTIONARY);

        await this.loadCarcols('data/carcols.dat');
        await this.loadTimecyc('data/timecyc.dat');
        await this.loadHandling('data/handling.cfg');
        // await this.loadWaterpro('data/waterpro.dat');
        // await this.loadWeaponDAT('data/weapon.dat');
        // await this.loadPedStats('data/pedstats.dat');
        // await this.loadPedRelations('data/ped.dat');
        // await this.loadIFP('ped.ifp');

        await this.loadLevelFile('data/default.dat');
        await this.loadLevelFile('data/gta3.dat');

        // await this.loadPedGroups('data/pedgrp.dat');

        this.isLoaded = true;
    }

    async loadLevelFile(path: string): Promise<void> {
        const commandStream = streamTextDat(this.fileIndex.get(path), { lowercase: true });

        const tasks: Promise<void>[] = [];

        commandStream.on('data', (entry: DatCommand) => {
            const [command, ...args] = entry;

            // TODO: load splashes into different index?
            // TODO: load mapzone into different index?
            if(command === 'img' || command === 'cdimage'){
                tasks.push(this.loadImg(args[0]));
            } else if(command === 'ide'){
                tasks.push(this.loadIde(args[0]));
            } else if(command === 'colfile'){
                tasks.push(this.loadColfile(args[1], Number.parseInt(args[0])));
            } else if(command === 'ipl' || command === 'mapzone'){
                tasks.push(this.loadIpl(args[0]));
            } else if(command === 'texdiction'){
                tasks.push(this.loadRws(args[0], RwsSectionType.RW_TEXTURE_DICTIONARY));
            } else if(command === 'modelfile'){
                tasks.push(this.loadRws(args[0], RwsSectionType.RW_CLUMP));
            } else if(command === 'splash'){
                tasks.push(this.loadRws('txd/' + args[0] + '.txd', RwsSectionType.RW_TEXTURE_DICTIONARY));
            } else {
                console.warn(`LoadLevelFile '${command}' loading not implemented.`);
            }
        });

        return new Promise<void>((resolve, reject) => {
            commandStream.on('finish', () => {
                Promise.all(tasks)
                    .then(() => resolve())
                    .catch(reject);
            });

            commandStream.on('error', reject);
        });
    }

    async loadImg(path: string): Promise<void> {
        const imgIndex = new ImgIndex(this.fileIndex, path);
        await imgIndex.load();

        this.imgIndices.set(this.fileIndex.normalizePath(path), imgIndex);
    }

    async loadIde(path: string): Promise<void> {
        const file = this.fileIndex.get(path);
        const loader = new IdeIndex(file);
        await loader.load();

        this.ideIndices.set(this.fileIndex.normalizePath(path), loader);
    }

    async loadIpl(path: string): Promise<void> {
        const file = this.fileIndex.get(path);
        const loader = new IplIndex(file);
        await loader.load();

        this.iplIndices.set(this.fileIndex.normalizePath(path), loader);
    }

    async loadGxt(path: string): Promise<void> {
        const gxtIndex = new GxtIndex(this.fileIndex.get(path));
        await gxtIndex.load();

        this.gxtIndex = gxtIndex;
    }

    async loadCarcols(path: string): Promise<void> {
        const carcolsIndex = new CarcolsIndex(this.fileIndex.get(path));
        await carcolsIndex.load();

        this.carcolsIndex = carcolsIndex;
    }

    async loadTimecyc(path: string): Promise<void> {
        const timecycIndex = new TimecycIndex(this.fileIndex.get(path));
        await timecycIndex.load();

        this.timecycIndex = timecycIndex;
    }

    async loadHandling(path: string): Promise<void> {
        const handlingIndex = new HandlingIndex(this.fileIndex.get(path));
        await handlingIndex.load();

        this.handlingIndex = handlingIndex;
    }

    async loadColfile(path: string, zone: number): Promise<void> {
        const colIndex = new ColIndex(this.fileIndex.get(path), zone);
        await colIndex.load();

        this.colIndices.set(this.fileIndex.normalizePath(path), colIndex);
    }

    async loadRws(path: string, expectedSectionType?: number): Promise<void> {
        const file = this.fileIndex.get(path);
        const parser = new Corrode().ext.rwsSingle('rws', expectedSectionType).map.push('rws');
        const rws = await file.parse<RwsRootSection>(parser);
        this.setRwsSlot(this.fileIndex.normalizePath(path), rws);
    }

    async loadRwsFromImg(img: string | ImgIndex, entryname: string, expectedSectionType?: number): Promise<void> {
        if(typeof img === 'string'){
            const foundImg = this.imgIndices.get(img);
            if(!foundImg){
                throw new ReferenceError(`RwsStructPool: cannot find img with name '${img}'.`);
            }
            img = foundImg;
        }

        const rws = await img.parseEntryAsRws(entryname, expectedSectionType);
        this.setRwsSlot(this.fileIndex.normalizePath(img.imgFile.path) + '/' + entryname, rws);
    }

    private setRwsSlot(name: string, rws: RwsRootSection): void {
        if(rws.__name__ === 'rwsClump'){
            this.rwsClumpIndex.set(name, rws);
            return;
        }

        this.rwsTextureDictionaryIndex.set(name, rws);
    }
}
