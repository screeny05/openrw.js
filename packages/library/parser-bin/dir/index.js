const Corrode = require('corrode');

const SECTOR_SIZE = 2048;
const ENTRY_SIZE = 32;

Corrode.addExtension('dir', function(){
    this
        .loop('entries', function(){
            this
                .uint32('offset')
                .uint32('size')
                .string('name', 24)
                .map.trimNull('name')
                .tap(function(){
                    this.vars.offset *= SECTOR_SIZE;
                    this.vars.size *= SECTOR_SIZE;
                    this.emit('entry', this.vars);
                });
        })

        // file-length should match the count of entries
        .tap(function(){
            if(this.streamOffset / ENTRY_SIZE !== this.vars.entries.length){
                throw new TypeError(`DIR filesize does not match entry-count. Found ${this.vars.entries.length} entries, should be ${this.streamOffset / 32}`);
            }
        })

        .map.push('entries');
});

const dirParser = async $ => {
    const entries = await $.loop(async () => ({
        offset: await $.uint32() * SECTOR_SIZE,
        size: await $.uint32() * SECTOR_SIZE,
        name: await $.string(24) |> $.map.trimNull,
    }));

    if($.streamOffset / ENTRY_SIZE !== entries.length){
        throw new TypeError(`DIR filesize does not match entry-count. Found ${entries.length} entries, should be ${$.streamOffset / 32}`);
    }
}
