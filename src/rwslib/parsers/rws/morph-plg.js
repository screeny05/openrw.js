const Corrode = require('corrode');

const sectionTypes = require('./section-types');

Corrode.addExtension('rwsMorphPlg', function(header){
    this.vars.__name__ = 'rwsMorphPlg';

    this.uint32('morphTargetIndex');
});
