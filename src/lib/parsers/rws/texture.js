const Corrode = require('corrode');

const sectionTypes = require('./section-types');

const filterMode = {
    NONE: 0x00,
    NEAREST: 0x01,
    LINEAR: 0x02,
    MIP_NEAREST: 0x03,
    MIP_LINEAR: 0x04,
    LINEAR_MIP_NEAREST: 0x05,
    LINEAR_MIP_LINEAR: 0x06
};

const addressMode = {
    NONE: 0x00,
    REPEAT: 0x01,
    MIRROR: 0x02,
    CLAMP: 0x03,
    BORDER: 0x04
};

Corrode.addExtension('rwsTexture', function(){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsTexture';

        this
            .uint8('filterMode')
            .uint8('addressMode')
            .tap(function(){
                this.vars.addressModeU = (this.vars.addressMode & 0x0f);
                this.vars.addressModeV = (this.vars.addressMode >> 0x04);
            })
            .uint16('useMipLevels')
            .ext.rwsSection('name', sectionTypes.RW_STRING)
            .ext.rwsSection('maskName', sectionTypes.RW_STRING)
            .ext.rwsSection('extension', sectionTypes.RW_EXTENSION);

    }).map.push('section');
});
