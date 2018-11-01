const Corrode = require('corrode');

const sectionTypes = require('./section-types');

const SURFACE_PROPERTIES_VERSION = 0x30400;

Corrode.addExtension('rwsMaterial', function(){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsMaterial';

        this
            .uint32('flags')
            .ext.tcolor('color')
            .uint32('unknown')
            .uint32('isTextured');

        if(header.version.version >= SURFACE_PROPERTIES_VERSION){
            this
                .float('ambient')
                .float('specular')
                .float('diffuse');
        }

        this.tap(function(){
            if(!this.vars.isTextured){
                return;
            }

            this.ext.rwsSection('texture', sectionTypes.RW_TEXTURE);
        });

        this.tap(function(){
            this.vars.hasAlpha = this.vars.color[3] < 255 || (this.vars.texture && !!this.vars.texture.maskName);
        });

        this.ext.rwsSection('extension', sectionTypes.RW_EXTENSION);
    }).map.push('section');
});
