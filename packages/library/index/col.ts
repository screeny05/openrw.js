import { IFile } from "@rws/platform/fs";

import Corrode from 'corrode';
import { CollEntry, ColPossibleVersion } from "../type/rws/coll";

export class ColIndex {
    file: IFile;
    zone: number;
    colIndex: Map<number, CollEntry> = new Map();

    constructor(file: IFile, zone: number){
        this.file = file;
        this.zone = zone;
    }

    async load(): Promise<void> {
        const parser = new Corrode().ext.col('col');

        parser.on('entry', entry => {
            const collEntry = this.convertColVersionToCollEntry(entry);
            this.colIndex.set(collEntry.modelId, collEntry);
        });

        await this.file.parse(parser);
    }

    convertColVersionToCollEntry(col: ColPossibleVersion): CollEntry {
        const entry: CollEntry = {
            version: col.version,
            modelName: col.modelName,
            modelId: col.modelId,
            bounds: col.bounds,
            spheres: col.spheres,
            boxes: col.boxes,
            vertices: col.vertices,
            faces: col.faces
        };

        if(col.version !== 'COLL'){
            col.faceGroups = col.faceGroups;
        }

        if(col.version === 'COL3'){
            col.shadowMeshFaces = col.shadowMeshFaces;
            col.shadowMeshVertices = col.shadowMeshVertices;
        }

        return entry;
    }

    getByModelNameAndId(name: string, id: number): CollEntry {
        let entry = this.colIndex.get(id);
        if(!entry || entry.modelName.indexOf(name) !== 0){
            console.warn(`Entry with name ${name} and id ${id} not found by id, now searching by name. Consider using modelName as index.`);
            const possibleEntryByName = Array.from(this.colIndex).find(entry => entry[1].modelName === name);
            if(possibleEntryByName){
                entry = possibleEntryByName[1];
            }
        }
        if(!entry){
            throw new Error(`ColIndex: CollEntry with name ${name} and id ${id} not found.`);
        }
        return entry;
    }
}
