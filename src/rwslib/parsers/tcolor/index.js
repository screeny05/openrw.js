const Corrode = require('corrode');

Corrode.addExtension('tcolor', function(){
    this
        .ext.nativeArray('color', Uint8Array, 4)
        .map.push('color');
});
