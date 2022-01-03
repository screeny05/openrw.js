import { IFileIndex } from '@rws/platform/fs';

export class BrowserNativeFileIndex implements IFileIndex {
    constructor(dir: FileSystemDirectoryHandle){

    }

    load(): Promise<void> {
        throw new Error("Method not implemented.");
    }    normalizePath(path: string): string {
        throw new Error("Method not implemented.");
    }
    has(path: string): boolean {
        throw new Error("Method not implemented.");
    }
    get(path: string): import("../platform/fs").IFile {
        throw new Error("Method not implemented.");
    }
}
