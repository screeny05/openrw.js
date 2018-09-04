import { Transform as TransformStream, Readable as ReadableStream } from 'stream';

export interface IPlatformFile {
    path: string;
    name: string;
    size: number;
    parse<T>(parser: TransformStream, start?: number, end?: number): Promise<T>;
    stream(start?: number): ReadableStream;
}
