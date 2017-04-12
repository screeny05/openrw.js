const Corrode = require('corrode');

Corrode.addExtension('img', function(dir, entryName){
    if(typeof dir === 'string'){
        dir = this.varStack.peek()[dir];
    }

    const dirEntry = dir[entryName];
    if(!dirEntry){
        throw new Error(`No entry with name ${entryName} found.`);
    }


    return this
        .skip(dirEntry.offset)
        .buffer('buffer', dirEntry.size)
        .map.push('buffer');
});
