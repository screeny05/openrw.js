import { IPlatformFile } from "./file";

export interface IPlatformFileIndex {
    normalizePath(path: string): string;
    has(path: string): boolean;
    get(path: string): IPlatformFile;
}
