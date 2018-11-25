const Corrode = require('corrode');

const sectionTypes = require('./section-types');

Corrode.addExtension('rwsTexture', function(){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsTexture';

        this
            .uint8('filterMode')
            .uint8('uvAddressing')
            .tap(function(){
                this.vars.uAddressing = (this.vars.addressMode & 0x0f);
                this.vars.vAddressing = (this.vars.addressMode >> 0x04);
            })
            .uint16('useMipLevels')
            .ext.rwsSection('name', sectionTypes.RW_STRING)
            .ext.rwsSection('maskName', sectionTypes.RW_STRING)
            .ext.rwsSection('extension', sectionTypes.RW_EXTENSION);

    }).map.push('section');
});
