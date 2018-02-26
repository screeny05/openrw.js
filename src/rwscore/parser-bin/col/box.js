const Corrode = require('corrode');

Corrode.addExtension('colBox', function(){
    this
        .ext.tvector3('min')
        .ext.tvector3('max')
        .ext.colSurface('surface');
});
