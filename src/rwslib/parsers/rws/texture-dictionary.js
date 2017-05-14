const Corrode = require('corrode');

const sectionTypes = require('./section-types');

Corrode.addExtension('rwsTextureDictionary', function(){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsTextureDictionary';

        this.uint32('textureCount');

        console.log(header);
    }).map.push('section');
});
