const Corrode = require('corrode');
const Buffer = require('buffer').Buffer;

const sectionTypes = require('./section-types');

export const RasterFormat = {
    DEFAULT: 0x0000,
    FORMAT_1555: 0x0100,
    FORMAT_565: 0x0200,
    FORMAT_4444: 0x0300,
    FORMAT_LUM_8: 0x0400,
    FORMAT_8888: 0x0500,
    FORMAT_888: 0x0600,
    FORMAT_555: 0x0A00,

    AUTO_MIPMAP: 0x1000,
    PALETTE_8: 0x2000,
    PALETTE_4: 0x4000,
    MIPMAPPED: 0x8000
};

const Compression = {
    none: 0,
    dxt1: 1,
    dxt3: 3
};
module.exports.compression = Compression;

const platformIds = {
    pc3VC: 8,
    pcSA: 9,
    ps2: 0x50533200,
    xbox: 5
};

const hasBits = (bits, mask) => (bits & mask) === mask;

Corrode.addExtension('rwsTextureNative', function(){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsTextureNative';

        let currentWidth = null;
        let currentHeight = null;

        this
            .uint32('platformId')
            .uint8('filterMode')
            .uint8('uvAddressing')
            .uint16('pad')
            .assert.equal('pad', 0)
            .string('name', 32)
            .map.trimNull('name')
            .string('mask', 32)
            .map.trimNull('mask')
            .uint32('format')
            .uint32('hasAlpha')
            .uint16('width')
            .uint16('height')
            .uint8('depth')
            .uint8('countMipLevels')
            .uint8('rasterType')
            .uint8('scanCompression')

            .tap(function(){
                if(this.vars.platformId !== platformIds.pc3VC){
                    throw new TypeError(`Unsupported texture native, platform ${this.vars.platformId} not implemented.`);
                }

                this.vars.uAddressing = this.vars.uvAddressing & 0x0f;
                this.vars.vAddressing = this.vars.uvAddressing >> 4;

                this.vars.flags = {
                    isPal8: hasBits(this.vars.format, RasterFormat.PALETTE_8),
                    isPal4: hasBits(this.vars.format, RasterFormat.PALETTE_4),
                    isFormat8888: hasBits(this.vars.format, RasterFormat.FORMAT_8888),
                    isFormat888: hasBits(this.vars.format, RasterFormat.FORMAT_888),
                    maybeFormat565: hasBits(this.vars.format, RasterFormat.FORMAT_565),
                    maybeFormat4444: hasBits(this.vars.format, RasterFormat.FORMAT_4444),
                };

                this.vars.flags.isTransparent = !this.vars.flags.isFormat888;
                this.vars.flags.usesPalette = (this.vars.flags.isPal4 || this.vars.flags.isPal8) && (this.vars.flags.isFormat888 || this.vars.flags.isFormat8888);

                // palette colors are always RGBA
                if(this.vars.flags.usesPalette){
                    let paletteSize = 256 * 4;
                    if(this.vars.flags.isPal4){
                        paletteSize = 16 * 4;
                    }

                    this.buffer('palette', paletteSize);
                }

                // temporary variable for the next size
                currentWidth = this.vars.width;
                currentHeight = this.vars.height;
            })

            .repeat('mipLevels', 'countMipLevels', function(){
                this.uint32('size');

                this.tap(function(){
                    if(this.vars.size !== 0){
                        return;
                    }

                    if(this.varStack.peek().flags.usesPalette){
                        this.vars.size = currentHeight * currentHeight;

                        if(this.varStack.peek().flags.isPal4){
                            this.vars.size /= 2;
                        }
                    } else if(this.varStack.peek().scanCompression !== Compression.none) {
                        let ttw = currentHeight;
                        let tth = currentHeight;
                        if(ttw < 4){
                            ttw = 4;
                        }
                        if(tth < 4){
                            tth = 4;
                        }

                        this.vars.size = (ttw / 4) * (tth / 4) * this.varStack.peek().scanCompression === Compression.dxt3 ? 16 : 8;
                    }
                })

                .buffer('data', 'size')

                .tap(function paletteToImage(){
                    const { flags } = this.varStack.peek();

                    if(flags.isPal8 || flags.isPal4){
                        /** @type {NodeBuffer} */
                        const palette = this.varStack.peek().palette;
                        const indices = this.vars.data;
                        // allocate unsafe assuming all bytes will be filled
                        const rgbaBuffer = Buffer.allocUnsafe(currentWidth * currentHeight * 4);

                        for(var i = 0; i < this.vars.size; i++){
                            const index = indices[i] * 4;
                            rgbaBuffer[i * 4] = palette[index];
                            rgbaBuffer[i * 4 + 1] = palette[index + 1];
                            rgbaBuffer[i * 4 + 2] = palette[index + 2];
                            rgbaBuffer[i * 4 + 3] = palette[index + 3];
                            //rgbaBuffer.set(palette.subarray(index * 4, index * 4 + 4), i * 4);
                            //palette.copy(rgbaBuffer, i * 4, index * 4, index * 4 + 4);
                        }
                        this.vars.data = rgbaBuffer;
                    }

                    currentHeight = currentHeight / 2;
                    currentWidth = currentWidth / 2;
                })

                .map.push('data');
            })

            .ext.rwsSection('extension', sectionTypes.RW_EXTENSION);
    }).map.push('section');
});
