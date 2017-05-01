const Corrode = require('corrode');

const TDAT_HEADER_SIZE = 8;

Corrode.addExtension('gxtTdat', function(tkeyEntries){
    if(typeof tkeyEntries === 'string'){
        tkeyEntries = this.varStack.peek()[tkeyEntries];
    }

    const tdatStartOffset = this.streamOffset;

    this
        .string('TDAT', 4)
        .assert.equal('TDAT', 'TDAT')

        // size describes the size of the tdat-entries in bytes
        .uint32('size')

        .loop('entries', function(end, discard, i){
            // tkeyEntries is { [offset]: [key] }
            // so we calculate the offset relative from the first tdat-item
            const entryOffset = this.streamOffset - TDAT_HEADER_SIZE - tdatStartOffset;
            const tkey = tkeyEntries[entryOffset];

            if(!tkey){
                throw new TypeError(`No tkey found for offset 0x${entryOffset.toString(16)}`);
            }

            this.vars.key = tkey;

            this.ext.widecharString('value');

            this.tap(function(){
                this.emit('entry', this.vars);
            });
        })
        .map.arrayToMap('entries', 'key', 'value')
        .map.push('entries');
});
