type CorrodeReadPrimitive = (name: string) => CorrodeInterface;

interface CorrodeConstructor {
    new(): CorrodeInterface;
    addExtension<T extends any[]>(name: string, callback: (this: CorrodeInterface, ...params: T) => void): this;
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
    ext: any;
    map: any;
    assert: any;
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

const Corrode_: CorrodeConstructor = require('corrode');

const MAX_WATERLEVELS = 48;
const OFFSET_ZONES = MAX_WATERLEVELS * 4 + 4;
const OFFSET_LEVELS = OFFSET_ZONES + MAX_WATERLEVELS * 4 * 4;

Corrode_.addExtension('waterpro', function(){
    this
        .uint32('count')
        .repeat('levels', 'count', function(){
            this
                .float('level')
                .map.push('level');
        })
        .position(OFFSET_ZONES)
        .repeat('zones', 'count', function(){
            this
                .float('startX')
                .float('endX')
                .float('startY')
                .float('endY')
        })
        .position(OFFSET_LEVELS)
        .repeat('visibleLevels', 64 * 64, function(){
            const { levels } = this.varStack.peek();
            this
                .pointer('level', levels, 'uint8')
                .map.push('level');
        })
        .repeat('physicalLevels', 128 * 128, function(){
            const { levels } = this.varStack.peek();
            this
                .pointer('level', levels, 'uint8')
                .map.push('level');
        });
});
