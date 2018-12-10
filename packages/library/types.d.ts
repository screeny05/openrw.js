type CorrodeReadPrimitive = (name: string) => CorrodeInterface;
type CorrodeExtensionCollection = {
    [name: string]: (...params: any[]) => CorrodeInterface
};

interface CorrodeConstructor {
    new(): CorrodeInterface;
    addExtension<T extends any[]>(name: string, callback: (this: CorrodeInterface, ...params: T) => void): this;
    MAPPERS: any;
}

interface CorrodeInterface {
    uint8: CorrodeReadPrimitive;
    int8: CorrodeReadPrimitive;
    uint16: CorrodeReadPrimitive;
    int16: CorrodeReadPrimitive;
    uint32: CorrodeReadPrimitive;
    int32: CorrodeReadPrimitive;
    uint64: CorrodeReadPrimitive;
    int64: CorrodeReadPrimitive;
    float: CorrodeReadPrimitive;
    double: CorrodeReadPrimitive;
    vars: any;
    varStack: any;
    streamOffset: number;
    ext: CorrodeExtensionCollection;
    map: CorrodeExtensionCollection;
    assert: CorrodeExtensionCollection;
    string(name: string, length: string | number, encoding?: string): this;
    skip(length: number): this;
    buffer(name: string, length: string | number): this;
    tap<T>(name: string, callback: (this: this, ...args: T[]) => void, args?: T[]): this;
    tap<T>(callback: (this: this, ...args: T[]) => void, args?: T[]): this;
    loop(name: string, callback: (this: this, end: (discard?: boolean) => void, discard: () => void, i: number) => void): this;
    loop(callback: (this: this, end: (discard?: boolean) => void, discard: () => void, i: number) => void): this;
    repeat(name: string, length: string | number, callback: (this: this, end: (discard?: boolean) => void, discard: () => void, i: number) => void): this;
    repeat(length: string | number, callback: (this: this, end: (discard?: boolean) => void, discard: () => void, i: number) => void): this;
    terminatedBuffer(name: string, terminator?: number, discardTerminator?: boolean): this;
    terminatedString(name: string, terminator?: number, discardTerminator?: boolean, encoding?: string): this;
    pointer(name: string, obj: any|any[]|string, type?: string): this;
    position(offset: number | string): this;
    debug(): this;
    fromBuffer(buffer: ArrayBuffer | NodeBuffer, done: (error: Error|null, data: any) => void): this;
}

declare module 'corrode' {
    var Corrode: CorrodeConstructor;
    export default Corrode;
}
