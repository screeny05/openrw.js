import { ReadableStream } from 'readable-stream';
import { IFile } from '@rws/platform/fs';

import * as fs from 'fs';
import * as path from 'path';
import * as klaw from 'klaw';
import * as death from 'death';

export class PlatformFile implements IFile {
    private file: klaw.Item;
    private fileDescriptor: number | null;

    get path(): string {
        return this.file.path;
    }

    get name(): string {
        return path.basename(this.file.path);
    }

    get size(): number {
        return this.file.stats.size;
    }

    constructor(file: klaw.Item){
        this.file = file;
        death({ uncaughtException: true })(this.close.bind(this));
    }

    async parse<T>(parser: any, start?: number, end?: number): Promise<T> {
        fs.createReadStream(this.path, { start, end }).pipe(parser);
        return await parser.asPromised();
    }

    async getData(start?: number, end?: number): Promise<ArrayBuffer> {
        let length = this.size;
        if(!this.fileDescriptor){
            await this.open();
        }
        if(typeof start === 'undefined' && typeof end !== 'undefined' || typeof start !== 'undefined' && typeof end === 'undefined'){
            throw new TypeError('If start or end is provided, both are required.');
        }
        if(typeof start === 'number' && typeof end === 'number'){
            length = end - start;
            if(length > this.size || start > this.size || end > this.size){
                throw new Error('Index out of bounds error');
            }
        }

        return new Promise<ArrayBuffer>((resolve, reject) => {
            const buffer = Buffer.allocUnsafe(length);
            fs.read(<number>this.fileDescriptor, buffer, 0, length, start || 0, (err) => {
                if(err){
                    return reject(err);
                }
                resolve(buffer.buffer);
            });
        });
    }

    stream(start?: number): ReadableStream {
        return fs.createReadStream(this.path, { start: start });
    }

    private close(){
        if(typeof this.fileDescriptor !== 'undefined'){
            return;
        }
        try { fs.closeSync(this.fileDescriptor); }
        catch(e) { }
    }

    private async open(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            fs.open(this.path, 'r', (err, fd) => {
                if(err){
                    return reject(err);
                }
                this.fileDescriptor = fd;
                resolve(fd);
            });
        });
    }
}
