const Corrode = require('corrode');

Corrode.addExtension('rwsHeader', function(){
    this
        .uint32('type')
        .uint32('size')
        .ext.rwsVersion('version');
});
