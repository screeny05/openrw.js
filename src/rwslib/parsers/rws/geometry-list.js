const Corrode = require('corrode');

const sectionTypes = require('./section-types');

Corrode.addExtension('rwsGeometryList', function(header){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsGeometryList';

        this
            .uint32('countGeometries')
            .repeat('geometries', 'countGeometries', function(end){
                this
                    .ext.rwsSection('geometry', sectionTypes.RW_GEOMETRY)
                    .map.push('geometry');
            })
    }).map.push('section');
});
