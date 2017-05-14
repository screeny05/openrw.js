const Corrode = require('corrode');

const sectionTypes = require('./section-types');

const deviceIds = {
    none: 0,
    d3d8: 1,
    d3d9: 2,
    ps2: 6,
    xbox: 8
};

Corrode.addExtension('rwsTextureDictionary', function(){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsTextureDictionary';

        this
            .uint16('countTextures')
            .uint16('deviceId');

        this.tap(function(){
            const deviceId = this.vars.deviceId;

            if(deviceId !== deviceIds.none && deviceId !== deviceIds.d3d8){
                throw new TypeError(`TextureNative Format ${deviceId} not implemented`);
            }
        });

        this.repeat('textures', 'countTextures', function(){
            this
                .ext.rwsSection('texture', sectionTypes.RW_TEXTURE_NATIVE)
                .ext.rwsSection('extension', sectionTypes.RW_EXTENSION);
        });
    }).map.push('section');
});
