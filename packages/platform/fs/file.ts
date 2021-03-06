import { Transform as TransformStream, Readable as ReadableStream } from 'stream';

export interface IFile {
    path: string;
    name: string;
    size: number;
    parse<T = any>(parser: TransformStream, start?: number, end?: number): Promise<T>;
    stream(start?: number): ReadableStream;
    getData(start?: number, end?: number): Promise<ArrayBuffer>;
}
