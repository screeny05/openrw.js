export enum Endianess {
    LittleEndian = 'LE',
    BigEndian = 'BE'
}

export class BufferBuilder {
    offset: number = 0;
    target: Buffer;
    endianess: Endianess = Endianess.LittleEndian;

    constructor(size: number){
        this.target = new Buffer(size);
    }

    string(val: string): this {
        this.offset += this.target.write(val, this.offset);
        return this;
    }

    uint8(val: number): this {
        this.offset = this.target.writeUInt8(val, this.offset);
        return this;
    }

    int8(val: number): this {
        this.offset = this.target.writeInt8(val, this.offset);
        return this;
    }

    uint16(val: number): this {
        this.offset = this.target[`writeUInt16${this.endianess}`](val, this.offset);
        return this;
    }

    int16(val: number): this {
        this.offset = this.target[`writeInt16${this.endianess}`](val, this.offset);
        return this;
    }

    uint32(val: number): this {
        this.offset = this.target[`writeUInt32${this.endianess}`](val, this.offset);
        return this;
    }

    int32(val: number): this {
        this.offset = this.target[`writeInt32${this.endianess}`](val, this.offset);
        return this;
    }

    float(val: number): this {
        this.offset = this.target[`writeFloat${this.endianess}`](val, this.offset);
        return this;
    }

    double(val: number): this {
        this.offset = this.target[`writeDouble${this.endianess}`](val, this.offset);
        return this;
    }

    buffer(src: ArrayBuffer): this {
        this.target.set(new Uint8Array(src), this.offset);
        this.offset += src.byteLength;
        return this;
    }
}
