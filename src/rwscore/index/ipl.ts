import { vec3, quat } from 'gl-matrix';

import streamTextDat, { DatCommand } from '../parser-text/text-dat';

import { vec3FromString, quatFromString, bitmaskFromString } from '../parser-text/string-native';
import { IPlatformFile } from '../platform/file';
import { Bitmask } from '../type/bitmask';

export enum IplSections {
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

export interface IplEntryInst {
    id: number;
    modelName: string;
    position: vec3;
    scale: vec3;
    rotation: quat;
}

export interface IplEntryZone {
    name: string;
    type: number;
    positionCornerA: vec3;
    positionCornerB: vec3;
    level: number;
}

export interface IplEntryCull {
    positionCenter: vec3;
    positionCornerA: vec3;
    positionCornerB: vec3;
    flags: IplEntryCullFlags;
    wantedLevelDrop: number;
}

export interface IplEntryPick {
    id: number;
    position: vec3;
}

const IplEntryCullFlagsValues = {
    all: 0xffff,
    camCloseInForPlayer: 0x01,
    camStairsForPlayer: 0x02,
    cam1stPersonForPlayer: 0x04,
    disableRain: 0x08,
    disablePolice: 0x10,
    loadCollision: 0x40,
    unknown1: 0x80,
    policeAbandonCars: 0x100,
    inRoomForAudio: 0x200,
    waterFudge: 0x400,
    militaryZone: 0x1000,
    extraAirResistance: 0x4000,
    fewerCars: 0x8000,
}

type IplEntryCullFlags = Bitmask<typeof IplEntryCullFlagsValues>;

export class IplIndex {
    file: IPlatformFile;

    entriesInst: Array<IplEntryInst> = [];
    entriesZone: Array<IplEntryZone> = [];
    entriesCull: Array<IplEntryCull> = [];
    entriesPick: Array<IplEntryPick> = [];

    constructor(file: IPlatformFile){
        this.file = file;
    }

    async load(){
        return new Promise<never>((resolve, reject) => {
            const iplTransform = streamTextDat(this.file, { lowercase: true });

            let section: IplSections|null = null;

            iplTransform.on('data', (iplEntry: DatCommand) => {
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
                    if(iplEntry.length !== 12){
                        throw new TypeError(`IPL Section INST entry must have 12 arguments, has ${iplEntry.length}`);
                    }
                    return this.entriesInst.push({
                        id: Number.parseInt(iplEntry[0]),
                        modelName: iplEntry[1],
                        position: vec3FromString(iplEntry[2], iplEntry[3], iplEntry[4]),
                        scale: vec3FromString(iplEntry[5], iplEntry[6], iplEntry[7]),
                        rotation: quatFromString(iplEntry[8], iplEntry[9], iplEntry[10], iplEntry[11])
                    });


                } else if(section === IplSections.zone){
                    if(iplEntry.length !== 9){
                        throw new TypeError(`IPL Section ZONE entry must have 9 arguments, has ${iplEntry.length}`);
                    }
                    return this.entriesZone.push({
                        name: iplEntry[0],
                        type: Number.parseInt(iplEntry[1]),
                        positionCornerA: vec3FromString(iplEntry[2], iplEntry[3], iplEntry[4]),
                        positionCornerB: vec3FromString(iplEntry[5], iplEntry[6], iplEntry[7]),
                        level: Number.parseInt(iplEntry[8])
                    });


                } else if(section === IplSections.cull){
                    return this.entriesCull.push({
                        positionCenter: vec3FromString(iplEntry[0], iplEntry[1], iplEntry[2]),
                        positionCornerA: vec3FromString(iplEntry[3], iplEntry[4], iplEntry[5]),
                        positionCornerB: vec3FromString(iplEntry[6], iplEntry[7], iplEntry[8]),
                        flags: bitmaskFromString<IplEntryCullFlags>(iplEntry[9], IplEntryCullFlagsValues),
                        wantedLevelDrop: Number.parseInt(iplEntry[10])
                    });


                } else if(section === IplSections.pick){
                    return this.entriesPick.push({
                        id: Number.parseInt(iplEntry[0]),
                        position: vec3FromString(iplEntry[1], iplEntry[2], iplEntry[3])
                    });
                }
            });

            iplTransform.on('error', reject);
            iplTransform.on('finish', () => resolve());
        });
    }
}
