export enum Endianess {
    LittleEndian = 'LE',
    BigEndian = 'BE'
}

export class BufferBuilder {
    offset: number = 0;
    buffer: Buffer;
    endianess: Endianess = Endianess.LittleEndian;

    constructor(size: number){
        this.buffer = new Buffer(size);
    }

    writeString(val: string): this {
        this.offset += this.buffer.write(val, this.offset);
        return this;
    }

    writeUInt8(val: number): this {
        this.offset = this.buffer.writeUInt8(val, this.offset);
        return this;
    }

    writeInt8(val: number): this {
        this.offset = this.buffer.writeInt8(val, this.offset);
        return this;
    }

    writeUInt16(val: number): this {
        this.offset = this.buffer[`writeUInt16${this.endianess}`](val, this.offset);
        return this;
    }

    writeInt16(val: number): this {
        this.offset = this.buffer[`writeInt16${this.endianess}`](val, this.offset);
        return this;
    }

    writeUInt32(val: number): this {
        this.offset = this.buffer[`writeUInt32${this.endianess}`](val, this.offset);
        return this;
    }

    writeInt32(val: number): this {
        this.offset = this.buffer[`writeInt32${this.endianess}`](val, this.offset);
        return this;
    }

    writeDouble(val: number): this {
        this.offset = this.buffer[`writeDouble${this.endianess}`](val, this.offset);
        return this;
    }

    writeFloat(val: number): this {
        this.offset = this.buffer[`writeFloat${this.endianess}`](val, this.offset);
        return this;
    }

    writeBuffer(src: ArrayBuffer): this {
        this.buffer.set(new Uint8Array(src), this.offset);
        this.offset += src.byteLength;
        return this;
    }
}
