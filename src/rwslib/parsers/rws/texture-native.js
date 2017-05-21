const Corrode = require('corrode');
const Buffer = require('buffer').Buffer;

const sectionTypes = require('./section-types');

const rasterFlags = {
    DEFAULT: 0x0000,
    FORMAT_1555: 0x0100,
    FORMAT_565: 0x0200,
    FORMAT_4444: 0x0300,
    FORMAT_LUM_8: 0x0400,
    FORMAT_8888: 0x0500,
    FORMAT_888: 0x0600,

    AUTO_MIPMAP: 0x1000,
    PALETTE_8: 0x2000,
    PALETTE_4: 0x4000,
    MIPMAPPED: 0x8000
};

const compression = {
    none: 0,
    dxt1: 1,
    dxt3: 3
};

const platformIds = {
    pc3VC: 8,
    pcSA: 9,
    ps2: 0x50533200,
    xbox: 5
};

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
            .uint32('flags')
            .map.bitmask('flags', rasterFlags)
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

                this.vars.usesPalette = this.vars.flags.PALETTE_8 || this.vars.flags.PALETTE_4;

                if(this.vars.usesPalette){
                    let paletteSize = 1024;
                    if(this.vars.flags.PALETTE_4){
                        paletteSize = 64;
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

                    if(this.varStack.peek().usesPalette){
                        this.vars.size = currentHeight * currentHeight;

                        if(this.varStack.peek().flags.PALETTE_4){
                            this.vars.size /= 2;
                        }
                    } else if(this.varStack.peek().scanCompression !== compression.none) {
                        let ttw = currentHeight;
                        let tth = currentHeight;
                        if(ttw < 4){
                            ttw = 4;
                        }
                        if(tth < 4){
                            tth = 4;
                        }

                        this.vars.size = (ttw / 4) * (tth / 4) * this.varStack.peek().scanCompression === compression.dxt3 ? 16 : 8;
                    }
                })

                .buffer('data', 'size')

                .tap(function(){
                    if(this.varStack.peek().flags.PALETTE_8){
                        const data = this.vars.data;
                        const palette = this.varStack.peek().palette;
                        const rgbaBuffer = Buffer.allocUnsafe(currentWidth * currentHeight * 4);

                        for(var i = 0; i < this.vars.size; i++){
                            palette.copy(rgbaBuffer, i * 4, data[i] * 4, data[i] * 4 + 4);
                        }
                        this.vars.data = rgbaBuffer;
                    }

                    currentHeight /= 2;
                    currentHeight /= 2;
                })

                .map.push('data');
            })

            .ext.rwsSection('extension', sectionTypes.RW_EXTENSION);
    }).map.push('section');
});
