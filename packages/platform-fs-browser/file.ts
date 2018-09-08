import { ReadableStream } from 'readable-stream';
import { IFile } from '@rws/platform/fs';

import fileReadStream from 'filereader-stream';

export class BrowserFile implements IFile {
    file: File;
    buffer?: ArrayBuffer;

    get path(): string {
        return this.file.webkitRelativePath;
    }

    get name(): string {
        return this.file.name;
    }

    get size(): number {
        return this.file.size;
    }

    constructor(file: File){
        this.file = file;
    }

    async parse<T>(parser: any, start?: number, end?: number): Promise<T> {
        const data = await this.getData(start, end);
        return await parser.asPromised(data);
    }

    async getData(start?: number, end?: number): Promise<ArrayBuffer> {
        if(typeof start === 'undefined' && typeof end !== 'undefined' || typeof start !== 'undefined' && typeof end === 'undefined'){
            throw new TypeError('If start or end is provided, both are required.');
        }
        if(typeof start === 'number' && typeof end === 'number' && (length > this.size || start > this.size || end > this.size)){
            throw new Error('Index out of bounds error');
        }

        const getSlice = (buffer: ArrayBuffer) => {
            if(typeof start !== 'undefined'){
                return buffer.slice(start, end);
            }
            return buffer;
        };

        return new Promise<ArrayBuffer>((resolve, reject) => {
            if(this.buffer){
                return resolve(getSlice(this.buffer));
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                if(!reader.result){
                    return reject(new Error('File load Error, no result.'));
                }

                // result is guaranteed to be ArrayBuffer
                this.buffer = reader.result as ArrayBuffer;
                return resolve(getSlice(this.buffer));
            };

            reader.onabort = reject;
            reader.onerror = reject;
            reader.readAsArrayBuffer(this.file);
        });
    }

    stream(start?: number): ReadableStream {
        return fileReadStream(this.file, { offset: start });
    }
}
