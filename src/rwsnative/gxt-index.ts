import FileIndex from './file-index';

import * as Corrode from 'corrode';

interface GxtEntry {
    readable: string;
}

export default class GxtIndex {
    gxtPath: string;
    fileIndex: FileIndex;
    gxtIndex: Map<string, GxtEntry> = new Map();

    constructor(fileIndex: FileIndex, gxtPath: string){
        this.fileIndex = fileIndex;
        this.gxtPath = gxtPath;
    }

    async load(){
        const gxtStream = this.fileIndex.getFileStream(this.gxtPath);
        const gxtParser = new Corrode();
        gxtParser.ext.gxt('gxt').map.push('gxt');

        return new Promise((resolve, reject) => {
            gxtStream.pipe(gxtParser);

            gxtParser.on('entry', entry =>
                this.gxtIndex.set(entry.key, {
                    readable: entry.value
                })
            );

            gxtParser.on('finish', () => resolve());
            gxtParser.on('error', reject);
        });
    }
}
