const Corrode = require('corrode');

Corrode.addExtension('rwsVersion', function(){
    this
        .uint32('packed')
        .tap(function(){
            const { packed } = this.vars;

            const unpacked = {};

            if(packed & 0xFFFF0000){
                unpacked.version = (packed >> 14 & 0x3FF00) + 0x30000 | (packed >> 16 & 0x3F);
                unpacked.build = packed & 0xFFFF;
            } else {
                unpacked.version = packed << 8;
                unpacked.build = 0;
            }

            this.vars = unpacked;
        });
});
