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

Corrode.addExtension('rws', function(dataCallback){
    this
        .loop('entries', function(end, discard, i){
            this
                .ext.rwsSection('section')
                .map.push('section');
            end();
        })
        .map.push('entries');

});
