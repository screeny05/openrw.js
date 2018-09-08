import Corrode from 'corrode';

import { DirEntry } from '../type/dir-entry';
import { RwsRootSection } from '../type/rws/index';
import { IFileIndex, IFile } from "@rws/platform/fs";

export class ImgIndex {
    fileIndex: IFileIndex;
    imgFile: IFile;
    imgIndex: Map<string, DirEntry> = new Map();

    constructor(fileIndex: IFileIndex, imgPath: string){
        this.fileIndex = fileIndex;
        this.imgFile = this.fileIndex.get(imgPath);
    }

    async load(): Promise<void> {
        const dirPath = this.imgFile.path.replace(/\.img$/i, '.dir');
        const dirFile = this.fileIndex.get(dirPath);
        const dirParser = new Corrode().ext.dir('dir');

        dirParser.on('entry', (dirEntry: DirEntry) => {
            this.imgIndex.set(dirEntry.name.toLowerCase(), dirEntry);
        });

        await dirFile.parse(dirParser);
    }

    async parseEntryAsRws(entry: string|DirEntry, expectedSectionType?: number): Promise<RwsRootSection> {
        if(typeof entry === 'string'){
            entry = this.getEntry(entry);
        }

        const parser = new Corrode().ext.rwsSingle('rws', expectedSectionType).map.push('rws');
        return await this.imgFile.parse<RwsRootSection>(parser, entry.offset, entry.offset + entry.size);
    }

    getEntry(name: string): DirEntry {
        const entry = this.imgIndex.get(name);

        if(!entry){
            throw new Error(`ImgIndex: Cannot find entry with name ${name}`);
        }

        return entry;
    }
}
