const Corrode = require('corrode');

const sectionTypes = require('./section-types');

Corrode.addExtension('rwsMaterialList', function(){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsMaterialList';

        this
            .uint32('countMaterials')
            .repeat('materialIndices', 'countMaterials', function(){
                this
                    .int32('index')
                    .map.push('index');
            })
            .repeat('materials', 'countMaterials', function(){
                this
                    .ext.rwsSection('material', sectionTypes.RW_MATERIAL)
                    .map.push('material');
            });
    }).map.push('section');
});
