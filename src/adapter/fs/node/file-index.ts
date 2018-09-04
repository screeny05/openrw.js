import * as fs from 'fs';
import * as path from 'path';

import * as klaw from 'klaw';
import * as death from 'death';

import { PlatformFile } from './file';
import { IPlatformFileIndex } from '../interface/file-index';

export class PlatformFileIndex implements IPlatformFileIndex {
    private index: Map<string, PlatformFile> = new Map();
    private root: string;

    constructor(root: string){
        this.root = path.join(root, '/');
    }

    async init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            klaw(this.root)
                .on('data', item =>
                    this.index.set(this.normalizePath(item.path), new PlatformFile(item))
                )
                .on('error', reject)
                .on('end', resolve);
        });
    }

    normalizePath(orgPath: string): string {
        return orgPath.replace(new RegExp('^' + this.root + '/', 'ig'), '').replace(/\\/g, '/').toLowerCase();
    }

    has(path: string): boolean {
        return this.index.has(this.normalizePath(path));
    }

    get(path: string): PlatformFile {
        const file = this.index.get(this.normalizePath(path));
        if(!file){
            throw new ReferenceError(`FileIndex: Given path ${path} does not exist.`);
        }
        return file;
    }
}
