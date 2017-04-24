import { vec3, quat } from 'gl-matrix';

import loadTextDat from '../text-dat';

enum IplSections {
    inst,
    zone,
    cull,
    pick,
    path,
    occl,
    mult,
    grge,
    enex,
    cars,
    jump,
    tcyc,
    auzo
}

interface IplEntryInst {
    id: number;
    modelName: string;
    position: vec3;
    scale: vec3;
    rotation: quat;
}

interface IplEntryZone {
    name: string;
    type: number;
    cornerA: vec3;
    cornerB: vec3;
    level: number;
}

export default class IplLoader {
    __name__: string|null = null;
    path: string;

    entriesInst: Array<IplEntryInst> = [];
    entriesZone: Array<IplEntryZone> = [];

    constructor(path: string){
        this.path = path;
        this.__name__ = this.path.split('/').slice(-1)[0];
    }

    async load(){
        const iplData = await loadTextDat(this.path, { delimiter: ', ', lowercase: true });

        let section: IplSections|null = null;

        iplData.forEach(iplEntry => {
            const trySection = IplSections[iplEntry[0]];
            if(iplEntry.length === 1 && typeof trySection !== 'undefined'){
                section = trySection;
                return;
            }

            if(iplEntry.length === 1 && iplEntry[0] === 'end'){
                section = null;
                return;
            }


            if(section === IplSections.inst){
                return this.entriesInst.push({
                    id: Number.parseInt(iplEntry[0]),
                    modelName: iplEntry[1],
                    position: this.vec3FromString(iplEntry[2], iplEntry[3], iplEntry[4]),
                    scale: this.vec3FromString(iplEntry[5], iplEntry[6], iplEntry[7]),
                    rotation: this.quatFromString(iplEntry[8], iplEntry[9], iplEntry[10], iplEntry[11])
                });

            } else if(section === IplSections.zone){
                if(iplEntry.length !== 9){
                    throw new TypeError('IPL Section ZONE entry must have 12 arguments');
                }
                return this.entriesZone.push({
                    name: iplEntry[0],
                    type: Number.parseInt(iplEntry[1]),
                    cornerA: this.vec3FromString(iplEntry[2], iplEntry[3], iplEntry[4]),
                    cornerB: this.vec3FromString(iplEntry[5], iplEntry[6], iplEntry[7]),
                    level: Number.parseInt(iplEntry[8])
                });
            }
        });
    }

    vec3FromString(x: string, y: string, z: string): vec3 {
        return vec3.fromValues(Number.parseFloat(x), Number.parseFloat(y), Number.parseFloat(z));
    }

    quatFromString(x: string, y: string, z: string, w: string): quat {
        return quat.fromValues(Number.parseFloat(x), Number.parseFloat(y), Number.parseFloat(z), Number.parseFloat(w));
    }
}
