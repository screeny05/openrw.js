import FileIndex from './file-index';

import DirEntry from '../rwslib/types/dir-entry';

import * as Corrode from 'corrode';

import * as fs from 'fs';

export default class ImgIndex {
    imgPath: string;
    fileIndex: FileIndex;
    imgFileDescriptor: number;
    imgIndex: Map<string, DirEntry> = new Map();

    constructor(fileIndex: FileIndex, imgPath: string){
        this.fileIndex = fileIndex;
        this.imgPath = imgPath;
    }

    async indexImgWithDir(): Promise<never> {
        this.imgFileDescriptor = await this.fileIndex.getFileDescriptor(this.imgPath);

        const dirPath = this.imgPath.replace(/\.img$/i, '.dir');
        const dirStream = this.fileIndex.getFileStream(dirPath);

        return new Promise<never>((resolve, reject) => {
            const dirParser = new Corrode();
            dirParser.ext.dir('dir');
            dirStream.pipe(dirParser);

            dirParser.on('entry', (dirEntry: DirEntry) =>
                this.imgIndex.set(dirEntry.name.toLowerCase(), dirEntry)
            );

            dirParser.on('finish', resolve);
            dirParser.on('error', reject);
        });
    }

    async parseEntry(name: string){
        const imgStream = this.getImgStreamByName(name);

        return new Promise<never>((resolve, reject) => {
            const rwsParser = new Corrode();
            rwsParser.ext.rws('entry').map.push('entry');
            imgStream.pipe(rwsParser);

            rwsParser.on('finish', () => {
                resolve(rwsParser.vars);
            });
            rwsParser.on('error', reject);
        });
    }

    getEntry(name: string): DirEntry {
        const entry = this.imgIndex.get(name.toLowerCase());

        if(!entry){
            throw new ReferenceError(`ImgIndex: Given entry ${name} does not exist.`);
        }

        return entry;
    }

    getImgStreamByEntry(entry: DirEntry): fs.ReadStream {
        return fs.createReadStream('', {
            fd: this.imgFileDescriptor,
            autoClose: false,
            start: entry.offset,
            end: entry.offset + entry.size
        });
    }

    getImgStreamByName(name: string): fs.ReadStream {
        const entry = this.getEntry(name);
        return this.getImgStreamByEntry(entry);
    }
}
