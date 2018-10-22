const Corrode = require('corrode');

const ENTRY_SIZE = 16;

Corrode.addExtension('sdt', function(){
    this.loop('entries', function(){
        this
            .uint32('offset')
            .uint32('size')
            .uint32('loopStart')
            .uint32('loopEnd')
            .tap(function(){
                this.emit('entry', this.vars);
            });
    })
    .tap(function(){
        if(this.streamOffset / ENTRY_SIZE !== this.vars.entries.length){
            throw new TypeError(`SDT filesize does not match entry-count. Found ${this.vars.entries.length} entries, should be ${this.streamOffset / ENTRY_SIZE}`);
        }
    })
    .map.push('entries');
});
