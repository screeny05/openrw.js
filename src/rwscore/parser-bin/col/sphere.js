const Corrode = require('corrode');

Corrode.addExtension('colSphere', function(){
    this
        .float('radius')
        .ext.tvector3('center')
        .ext.colSurface('surface');
});
