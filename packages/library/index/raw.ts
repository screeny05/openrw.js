import Corrode from 'corrode';

import { RwsRootSection } from '../type/rws/index';
import { IFileIndex, IFile } from "@rws/platform/fs";
import { SdtEntry } from '../type/sdt-entry';

export class RawIndex {
    fileIndex: IFileIndex;
    rawFile: IFile;
    sdtIndex: SdtEntry[] = [];

    constructor(fileIndex: IFileIndex, rawPath: string){
        this.fileIndex = fileIndex;
        this.rawFile = this.fileIndex.get(rawPath);
    }

    async load(): Promise<void> {
        const sdtPath = this.rawFile.path.replace(/\.raw$/i, '.sdt');
        const sdtFile = this.fileIndex.get(sdtPath);
        const sdtParser = new Corrode().ext.sdt('sdt');

        sdtParser.on('entry', (sdtEntry: SdtEntry) => {
            this.sdtIndex.push(sdtEntry);
        });

        await sdtFile.parse(sdtParser);
    }

    getEntry(i: number): SdtEntry {
        const entry = this.sdtIndex[i];

        if(!entry){
            throw new Error(`SdtIndex: Cannot find entry with name ${name}`);
        }

        return entry;
    }
}
