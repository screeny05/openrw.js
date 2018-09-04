import { IPlatformFile } from './file';

export interface IPlatformFileIndex {
    init(): Promise<void>;
    normalizePath(path: string): string;
    has(path: string): boolean;
    get(path: string): IPlatformFile;
}
