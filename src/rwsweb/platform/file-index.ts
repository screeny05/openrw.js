import { PlatformFile } from './file';
import { IPlatformFileIndex } from "../../rwscore/platform/file-index";

export class PlatformFileIndex implements IPlatformFileIndex {
    private index: Map<string, PlatformFile> = new Map();
    private root: string;

    constructor(files: FileList | null) {
        if(!files || files.length === 0){
            throw new Error('No Files selected');
        }

        this.root = files[0].webkitRelativePath.split('/')[0];

        Array.from(files).forEach(file => {
            const normalizedPath = this.normalizePath(file.webkitRelativePath);
            this.index.set(normalizedPath, new PlatformFile(file));
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
