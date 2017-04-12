const Corrode = require('corrode');

const sectionTypes = require('./section-types');

const geometryFlags = {
    triangleStrip: 0x01,
    positions: 0x02,
    textureCoords: 0x04,
    prelit: 0x08,
    normals: 0x10,
    light: 0x20,
    modulatedColor: 0x40,
    secondTextureCoords: 0x80
};

const SURFACE_PROPERTIES_VERSION = 0x34000;

Corrode.addExtension('rwsGeometry', function(header){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsGeometry';

        this
            .uint16('flags')
            .map.bitmask('flags', geometryFlags)
            .uint8('countTextureCoordinates')
            .uint8('isNativeGeometry')
            .int32('countTriangles')
            .int32('countVertices')
            .int32('countMorphTargets');

        if(header.version.version < SURFACE_PROPERTIES_VERSION){
            this
                .int32('surfaceAmbient')
                .int32('surfaceSpecular')
                .int32('surfaceDiffuse');
        }

        this.tap(function(){
            if(this.vars.isNativeGeometry){
                return;
            }


            if(this.vars.flags.textureCoords){
                this.vars.countTextureCoordinates = 1;
            }
            if(this.vars.flags.secondTextureCoords){
                this.vars.countTextureCoordinates = 2;
            }


            if(this.vars.flags.prelit){
                let hasAlpha = false;

                this.repeat('colors', this.vars.countVertices, function(){
                    this
                        .ext.tcolor('color')
                        .tap(function(){
                            if(this.vars.color.a < 255){
                                hasAlpha = true;
                            }
                        })
                        .map.push('color');
                }).tap(function(){
                    this.vars.colorsHasAlpha = hasAlpha;
                });
            }

            this.repeat(this.vars.countTextureCoordinates, function(end, discard, i){
                this
                    .repeat('coordinates', this.vars.countVertices, function(){
                        this
                            .float('u')
                            .float('v');
                    })
                    .tap(function(){
                        if(i === 0){
                            this.vars.textureCoordinates = this.vars.coordinates;
                        } else if(i === 1){
                            this.vars.secondTextureCoordinates = this.vars.coordinates;
                        }
                        delete this.vars.coordinates;
                    });
            });

            this.repeat('triangles', this.vars.countTriangles, function(){
                this
                    .uint16('vertex2')
                    .uint16('vertex1')
                    .uint16('materialId')
                    .uint16('vertex3');
            });
        });

        this.repeat('morphTargets', 'countMorphTargets', function(){
            this
                .ext.tvector3('spherePosition')
                .float('sphereRadius')
                .uint32('hasVertices')
                .uint32('hasNormals');

            if(this.varStack.peek().isNativeGeometry){
                return;
            }

            this.tap(function(){
                if(this.vars.hasVertices){
                    this.repeat('vertices', this.varStack.peek().countVertices, function(){
                        this
                            .ext.tvector3('vector')
                            .map.push('vector');
                    });
                }

                if(this.vars.hasNormals){
                    this.repeat('normals', this.varStack.peek().countVertices, function(){
                        this
                            .ext.tvector3('vector')
                            .map.push('vector');
                    });
                }
            });
        });

        this
            .ext.rwsSection('materialList', sectionTypes.RW_MATERIAL_LIST)
            .ext.rwsSection('extension', sectionTypes.RW_EXTENSION);
    }).map.push('section');
});
