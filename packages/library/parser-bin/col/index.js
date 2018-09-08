const Corrode = require('corrode');

require('./bounds');
require('./surface');
require('./sphere');
require('./box');
require('./face');

Corrode.addExtension('col', function(){
    this
        .loop('entries', function(end, discard, i){
            this
                .string('version', 4)
                .tap(function(){
                    if(this.vars.version !== 'COLL'){
                        throw new TypeError(`Col parser not implemented for col version '${this.vars.version}'`);
                    }
                })
                .uint32('remainingFileSize')
                .string('modelName', 22, 'ascii')
                .int16('modelId')
                .ext.colBounds('bounds')
                .uint32('countSpheres')
                .repeat('spheres', 'countSpheres', function(){
                    this.ext.colSphere('sphere').map.push('sphere');
                })
                .uint32('unknown')
                .uint32('countBoxes')
                .repeat('boxes', 'countBoxes', function(){
                    this.ext.colBox('box').map.push('box');
                })
                .uint32('countVertices')
                .repeat('vertices', 'countVertices', function(){
                    this.ext.tvector3('vertex').map.push('vertex');
                })
                .uint32('countFaces')
                .repeat('faces', 'countFaces', function(){
                    this.ext.colFace('face').map.push('face');
                })
                .tap(function(){
                    this.emit('entry', this.vars);
                });
        })
        .map.push('entries');
});
