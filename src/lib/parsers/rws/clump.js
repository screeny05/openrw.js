const Corrode = require('corrode');

const sectionTypes = require('./section-types');

const LIGHTS_AND_CAMERAS_VERSION = 0x33000;
const LIGHTS_AND_CAMERAS_SIZE = 12;

Corrode.addExtension('rwsClump', function(){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsClump';

        this.vars.countLights = 0;
        this.vars.countCameras = 0;

        this.int32('countAtomics');

        if(header.version.version > LIGHTS_AND_CAMERAS_VERSION || header.size === LIGHTS_AND_CAMERAS_SIZE){
            this
                .int32('countLights')
                .int32('countCameras');
        }

        this
            .ext.rwsSection('frameList', sectionTypes.RW_FRAME_LIST)
            .ext.rwsSection('geometryList', sectionTypes.RW_GEOMETRY_LIST)
            .repeat('atomics', 'countAtomics', function(){
                this
                    .ext.rwsSection('atomic', sectionTypes.RW_ATOMIC)
                    .map.push('atomic');
            })
            .ext.rwsSection('extension', sectionTypes.RW_EXTENSION);
    }).map.push('section');
});
