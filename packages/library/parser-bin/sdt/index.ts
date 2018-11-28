const Corrode = require('corrode');

const ENTRY_SIZE = 20;

Corrode.addExtension('sdt', function(){
    this.loop('entries', function(){
        this
            .int32('offset')
            .int32('size')
            .int32('samples')
            .int32('loopStart')
            .int32('loopEnd')
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
