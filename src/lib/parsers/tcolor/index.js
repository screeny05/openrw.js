const Corrode = require('corrode');

Corrode.addExtension('tcolor', function(){
    this
        .uint8('r')
        .uint8('g')
        .uint8('b')
        .uint8('a');
});
