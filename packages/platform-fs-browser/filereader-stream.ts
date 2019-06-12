import { Readable } from 'readable-stream';

const readChunk = (file: File, offset: number, length?: number) => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if(reader.error){
                return reject(reader.error);
            }
            return resolve(reader.result as ArrayBuffer);
        }
        reader.readAsArrayBuffer(file.slice(offset, length ? offset + length : undefined));
    });
};

export class FileStream extends Readable {
    file: File;
    offset: number;

    static DEFAULT_CHUNK_SIZE = 1024 * 1024;

    constructor(file: File, offset: number = 0){
        super();
        this.file = file;
        this.offset = offset;
    }

    async _read(size?: number){
        let chunk: ArrayBuffer;
        try {
            chunk = await readChunk(this.file, this.offset, size || FileStream.DEFAULT_CHUNK_SIZE);
        } catch (e) {
            setTimeout(() => this.emit('error', e), 0);
            return;
        }

        this.offset += chunk.byteLength;

        if(chunk.byteLength === 0){
            return this.push(null);
        }

        this.push(new Uint8Array(chunk));
    }
}
