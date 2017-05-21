const Corrode = require('corrode');

require('./clump');
require('./frame-list');
require('./geometry-list');
require('./version');
require('./header');
require('./section');
require('./extension');
require('./frame');
require('./geometry');
require('./material-list');
require('./material');
require('./texture');
require('./atomic');
require('./texture-dictionary');
require('./texture-native');
require('./h-anim-plg');
require('./bin-mesh-plg');
require('./morph-plg');
require('./material-effects-plg');

Corrode.addExtension('rws', function(expectedSectionType, expectedSectionCount){
    this.loop('entries', function(end, discard, i){
        this
            .ext.rwsSection('section', expectedSectionType)
            .map.push('section');
        end();
    });

    if(typeof expectedSectionCount !== 'undefined'){
        this.assert.arrayLength('entries', expectedSectionCount);
    }

    this.map.push('entries');
});
