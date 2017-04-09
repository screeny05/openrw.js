const Corrode = require('corrode');

Corrode.addExtension('tmatrix', function(rws){
    this
        .float('a').float('b').float('c')
        .float('d').float('e').float('f')
        .float('g').float('h').float('i')
});
