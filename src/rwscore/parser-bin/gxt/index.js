const Corrode = require('corrode');

require('./tkey');
require('./tdat');

Corrode.addExtension('gxt', function(){
    this
        .ext.gxtTkey('tkey')
        .ext.gxtTdat('tdat', 'tkey')
        .map.push('tdat');
});
