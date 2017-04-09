const Corrode = require('corrode');

const sectionTypes = require('./section-types');

Corrode.addExtension('rwsFrame', function(header){
    this.vars.__name__ = 'rwsFrame';
    this
        .string('name', header.size)
        .map.trimNull('name');
});
