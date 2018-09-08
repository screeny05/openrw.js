import { BrowserFile } from './file';
import { IFileIndex } from '@rws/platform/fs';

export class BrowserFileIndex implements IFileIndex {
    private index: Map<string, BrowserFile> = new Map();
    private root: string;
    private files: FileList;

    constructor(files: FileList | null) {
        if(!files || files.length === 0){
            throw new Error('No Files selected');
        }

        this.root = files[0].webkitRelativePath.split('/')[0];
        this.files = files;
    }

    async init(): Promise<void> {
        Array.from(this.files).forEach(file => {
            const normalizedPath = this.normalizePath(file.webkitRelativePath);
            this.index.set(normalizedPath, new BrowserFile(file));
        });
    }

    normalizePath(orgPath: string): string {
        return orgPath.replace(new RegExp('^' + this.root + '/', 'ig'), '').replace(/\\/g, '/').toLowerCase();
    }

    has(path: string): boolean {
        return this.index.has(this.normalizePath(path));
    }

    get(path: string): BrowserFile {
        const file = this.index.get(this.normalizePath(path));
        if(!file){
            throw new ReferenceError(`FileIndex: Given path ${path} does not exist.`);
        }
        return file;
    }
}
