const Corrode = require('corrode');

Corrode.addExtension('tvector3', function(rws){
    this
        .float('x')
        .float('y')
        .float('z')
});

Corrode.addExtension('tvector2', function(rws){
    this
        .float('x')
        .float('y')
});
