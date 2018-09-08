const Corrode = require('corrode');

Corrode.addExtension('colFace', function(){
    this
        .uint32('a')
        .uint32('b')
        .uint32('c')
        .ext.colSurface('surface');
});
