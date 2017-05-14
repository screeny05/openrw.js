const Corrode = require('corrode');
const Buffer = require('buffer').Buffer;

const sectionTypes = require('./section-types');

const filterMode = {
    none: 0,
    nearest: 1,
    linear: 2,
    mipNearest: 3,
    mipLinear: 4,
    linearMipNearest: 5,
    linearMipLinear: 6
};

const addressMode = {
    none: 0,
    repeat: 1,
    mirror: 2,
    clamp: 3
};

const rasterFlags = {
    default: 0x0000,
    format1555: 0x0100,
    format565: 0x0200,
    format4444: 0x0300,
    formatLum8: 0x0400,
    format8888: 0x0500,
    format888: 0x0600,

    autoMipmap: 0x1000,
    palette8: 0x2000,
    palette4: 0x4000,
    mipmapped: 0x8000
};

const compression = {
    none: 0,
    dxt1: 1,
    dxt3: 3
};

const platformIds = {
    pc3VC: 8,
    pcSA: 9,
    ps2: 'PS2\0',
    xbox: 5
};

Corrode.addExtension('rwsTextureNative', function(){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsTextureNative';

        let nextWidth = null;
        let nextHeight = null;

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
            .uint8('countLevels')
            .uint8('rasterType')
            .uint8('scanCompression')

            .tap(function(){
                if(this.vars.platformId !== platformIds.pc3VC){
                    throw new TypeError(`Unsupported texture native, platform ${this.vars.platformId} not implemented.`);
                }

                this.vars.uAddressing = this.vars.uvAddressing & 0x0f;
                this.vars.vAddressing = this.vars.uvAddressing >> 4;

                this.vars.usesPalette = this.vars.flags.palette8 || this.vars.flags.palette4;

                if(this.vars.usesPalette){
                    let paletteSize = 1024;
                    if(this.vars.flags.palette4){
                        paletteSize = 64;
                    }

                    this.buffer('palette', paletteSize);
                }

                // temporary variable for the next size
                nextWidth = this.vars.width;
                nextHeight = this.vars.height;
            })

            .repeat('mip', 'countLevels', function(){
                this.uint32('size');

                this.tap(function(){
                    if(this.vars.size !== 0){
                        return;
                    }

                    if(this.varStack.peek().usesPalette){
                        this.vars.size = nextHeight * nextHeight;

                        if(this.varStack.peek().flags.palette4){
                            this.vars.size /= 2;
                        }
                    } else if(this.varStack.peek().scanCompression !== compression.none) {
                        let ttw = nextHeight;
                        let tth = nextHeight;
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
                    if(this.varStack.peek().flags.palette8){
                        const data = this.vars.data;
                        const palette = this.varStack.peek().palette;
                        const rgbaBuffer = Buffer.allocUnsafe(nextWidth * nextHeight * 4);

                        for(var i = 0; i < this.vars.size; i++){
                            palette.copy(rgbaBuffer, i * 4, data[i] * 4, data[i] * 4 + 4);
                        }
                        this.vars.data = rgbaBuffer;
                    }

                    nextHeight /= 2;
                    nextHeight /= 2;
                })
            });
    }).map.push('section');
});

const debugPPM = (width, height, rgbaBuffer) => {
    let ppm = `P3\n${width} ${height}\n255\n`;

    for (var i = 0; i < rgbaBuffer.length / 4; i++) {
        let r = rgbaBuffer[i * 4 + 0];
        let g = rgbaBuffer[i * 4 + 1];
        let b = rgbaBuffer[i * 4 + 2];
        const a = rgbaBuffer[i * 4 + 3] / 255;

        r = r + ((1 - a) * 255);
        b = b + ((1 - a) * 255);

        if(a === 0){
            r = 255;
            g = 0;
            b = 255;
        }

        ppm += r + ' ' + g + ' ' + b + '\n';
    }

    require('fs').writeFileSync(`txd-${width}.ppm`, ppm, 'utf8');
};
