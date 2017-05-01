import * as fs from 'fs';
import * as path from 'path';

import * as klaw from 'klaw';
import * as death from 'death';


export default class FileIndex {
    root: string;
    index: Map<string, klaw.Item> = new Map();
    fileDescriptors: Array<number> = [];

    constructor(root: string){
        this.root = path.join(root, '/');

        death({ uncaughtException: true })(this.closeFileDescriptors.bind(this));
    }

    async indexDirectory(): Promise<never> {
        return new Promise<never>((resolve, reject) => {
            klaw(this.root)
                .on('data', item =>
                    this.index.set(this.normalizePath(item.path), item)
                )
                .on('error', reject)
                .on('end', resolve);
        });
    }

    closeFileDescriptors(){
        this.fileDescriptors.forEach(fd => fs.closeSync(fd));
    }

    normalizePath(orgPath: string): string {
        return orgPath.replace(this.root, '').replace(/\\/g, '/').toLowerCase();
    }

    getPathInfo(orgPath: string): klaw.Item {
        const normalizedPath = this.normalizePath(orgPath);
        const indexEntry = this.index.get(normalizedPath);

        if(!indexEntry){
            throw new ReferenceError(`FileIndex: Given path ${orgPath} does not exist.`);
        }

        return indexEntry;
    }

    getPath(orgPath: string): string {
        return this.getPathInfo(orgPath).path;
    }

    pathExists(orgPath: string): boolean {
        const normalizedPath = this.normalizePath(orgPath);
        return this.index.has(normalizedPath);
    }

    getFileStream(orgPath: string): fs.ReadStream {
        return fs.createReadStream(this.getPath(orgPath));
    }

    async getFileDescriptor(orgPath: string, flags: string = 'r'){
        return new Promise<number>((resolve, reject) => {
            fs.open(this.getPath(orgPath), flags, (err, fd) => {
                if(err){
                    return reject(err);
                }
                this.fileDescriptors.push(fd);
                return resolve(fd);
            });
        });
    }
}
