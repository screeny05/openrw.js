const Corrode = require('corrode');

const TKEY_ENTRY_SIZE = 12;

Corrode.addExtension('gxtTkey', function(){
    this
        .string('TKEY', 4)
        .assert.equal('TKEY', 'TKEY')

        // size describes the size of the tkey-entries in bytes
        .uint32('size')
        .map.callback('size', sizeInBytes => sizeInBytes / TKEY_ENTRY_SIZE)

        .repeat('entries', 'size', function(end, discard, i){
            this
                .uint32('tdatOffset')
                .string('tdatKey', 8)
                .map.trimNull('tdatKey');
        })
        .assert.arrayLength('entries', 'size')
        .map.arrayToMap('entries', 'tdatOffset', 'tdatKey')
        .map.push('entries');
});
