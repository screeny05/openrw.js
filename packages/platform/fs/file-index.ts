import { IFile } from './file';

export interface IFileIndex {
    load(): Promise<void>;
    normalizePath(path: string): string;
    has(path: string): boolean;
    get(path: string): IFile;
}
