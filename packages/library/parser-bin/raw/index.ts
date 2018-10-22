const Corrode = require('corrode');

Corrode.addExtension('img', function(sdt, i){
    const sdtEntry = sdt[i];
    if(!sdtEntry){
        throw new Error(`No entry with id ${i} found.`);
    }

    return this
        .skip(sdtEntry.offset)
        .buffer('buffer', sdtEntry.size)
        .map.push('buffer');
});
