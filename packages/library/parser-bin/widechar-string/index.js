const Corrode = require('corrode');

const charFromCode = require('./char-from-code');

Corrode.addExtension('widecharString', function(map){
    this
        .loop('chars', function(end, discard, i){
            this
                .uint16('code')
                .tap(function(){
                    if(this.vars.code === 0){
                        return end(true);
                    }

                    this.vars.value = charFromCode(this.vars.code, map);
                })
                .map.push('value');
        })
        .map.callback('chars', chars => chars.join(''))
        .map.push('chars');
});
