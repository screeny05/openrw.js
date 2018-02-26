const Corrode = require('corrode');

Corrode.addExtension('colBounds', function(){
    this
        .float('radius')
        .ext.tvector3('center')
        .ext.tvector3('min')
        .ext.tvector3('max');
});
