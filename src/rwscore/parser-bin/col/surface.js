const Corrode = require('corrode');

Corrode.addExtension('colSurface', function(){
    this
        .uint8('material')
        .uint8('flag')
        .uint8('brightness')
        .uint8('light');
});
