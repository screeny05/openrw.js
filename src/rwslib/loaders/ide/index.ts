import { vec3 } from 'gl-matrix';

import streamTextDat, { DatCommand } from '../text-dat';

import { vec3FromString, quatFromString, bitmaskFromString } from '../text-dat/utils';

enum IdeSections {
    objs,
    tobj,
    hier,
    cars,
    peds,
    path,
    '2dfx',
    weap,
    anim,
    txdp
}

interface IdeEntryObjs {
    id: number;
    modelName: string;
    txdName: string;
    meshCount?: number;
    drawDistances?: Array<number>;
    flags?: IdeEntryObjsFlags;
}

interface IdeEntryTobj extends IdeEntryObjs {
    timeOn?: number;
    timeOff?: number;
}

interface IdeEntryHier {
    id: number;
    modelName: string;
    txdName: string;
}

interface IdeEntryCars {
    id: number;
    modelName: string;
    txdName: string;
    type: string;
    handlingId: string;
    gameName: string;
    class: string;
    frq: number;
    lvl: number;
    comprules: number;
    additionalModelId?: number;
    wheelScale?: number;
}

interface IdeEntryPeds {
    id: number;
    modelName: string;
    txdName: string;
    defaultPedType: string;
    behaviour: string;
    animGroup: string;
    carsCanDrive: IdeEntryPedsCars;
}

interface IdeEntryPath {
    groupType: string;
    id: number;
    modelName: string;
    nodes: Array<IdeEntryPathNode>;
}

interface IdeEntryPathNode {
    nodeType: number;
    nextNode: number;
    isCrossRoad: boolean;
    position: vec3;
    leftLanes: number;
    rightLanes: number;
}

interface IdeEntryObjsFlags {
    all: boolean;
    wet: boolean;
    disableFadeOnLoad: boolean;
    allowTransparencyThroughThis: boolean;
    alphaTransparency2: boolean;
    fadeOnLoad: boolean;
    usedInInterior: boolean;
    disableShadowMesh: boolean;
    disableCull: boolean;
    disableDrawDistance: boolean;
    isBreakable: boolean;
    isCrackable: boolean;
    isGarageDoor: boolean;
    isMultiMesh: boolean;
    isVegetation: boolean;
    getBrightnessFromWeather: boolean;
    explodesAfterHit: boolean;
    unknown1: boolean;
    unknown2: boolean;
    isGrafitty: boolean;
    disableCullSA: boolean;
    unknown3: boolean;
}

const IdeEntryObjsFlagsValues = {
    all: 0xffff,
    wet: 0x01,
    disableFadeOnLoad: 0x02,
    allowTransparencyThroughThis: 0x04,
    alphaTransparency2: 0x08,
    fadeOnLoad: 16,
    usedInInterior: 32,
    disableShadowMesh: 64,
    disableCull: 128,
    disableDrawDistance: 256,
    isBreakable: 512,
    isCrackable: 1024,
    isGarageDoor: 2048,
    isMultiMesh: 4096,
    isVegetation: 16384,
    getBrightnessFromWeather: 32768,
    explodesAfterHit: 65536,
    unknown1: 131072,
    unknown2: 262144,
    isGrafitty: 1048576,
    disableCullSA: 2097152,
    unknown3: 4194304
};

interface IdeEntryPedsCars {
    none: boolean;
    poorfamily: boolean;
    richfamily: boolean;
    executive: boolean;
    worker: boolean;
    special: boolean;
    big: boolean;
    taxi: boolean;
}

const IdeEntryPedsCarsValues = {
    none: 0x00,
    poorfamily: 0x01,
    richfamily: 0x02,
    executive: 0x04,
    worker: 0x08,
    special: 0x10,
    big: 0x20,
    taxi: 0x40
}

export default class IdeLoader {
    __name__: string|null = null;
    path: string;

    entriesObjs: Array<IdeEntryObjs> = [];
    entriesTobj: Array<IdeEntryTobj> = [];
    entriesHier: Array<IdeEntryHier> = [];
    entriesCars: Array<IdeEntryCars> = [];
    entriesPeds: Array<IdeEntryPeds> = [];
    entriesPath: Array<IdeEntryPath> = [];

    constructor(path: string){
        this.path = path;
        this.__name__ = this.path.split('/').slice(-1)[0];
    }

    async load(){
        return new Promise<never>((resolve, reject) => {
            const ideTransform = streamTextDat(this.path, { lowercase: true });

            let section: IdeSections|null = null;
            let isInPath = false;

            ideTransform.on('data', (ideEntry: DatCommand) => {
                const trySection = IdeSections[ideEntry[0]];
                if(ideEntry.length === 1 && typeof trySection !== 'undefined'){
                    section = trySection;

                    if(section !== IdeSections.path){
                        isInPath = false;
                    }
                    return;
                }

                if(ideEntry.length === 1 && ideEntry[0] === 'end'){
                    section = null;
                    return;
                }

                if(section === IdeSections.objs && ideEntry.length === 4){
                    return this.entriesObjs.push({
                        id: Number.parseInt(ideEntry[0]),
                        modelName: ideEntry[1],
                        txdName: ideEntry[2]
                    });
                } else if(section === IdeSections.objs && ideEntry.length === 5){
                    return this.entriesObjs.push({
                        id: Number.parseInt(ideEntry[0]),
                        modelName: ideEntry[1],
                        txdName: ideEntry[2],
                        drawDistances: [Number.parseFloat(ideEntry[3])],
                        flags: bitmaskFromString<IdeEntryObjsFlags>(ideEntry[4], IdeEntryObjsFlagsValues)
                    });
                } else if(section === IdeSections.objs && ideEntry.length === 6){
                    return this.entriesObjs.push({
                        id: Number.parseInt(ideEntry[0]),
                        modelName: ideEntry[1],
                        txdName: ideEntry[2],
                        meshCount: Number.parseInt(ideEntry[3]),
                        drawDistances: [Number.parseFloat(ideEntry[4])],
                        flags: bitmaskFromString<IdeEntryObjsFlags>(ideEntry[5], IdeEntryObjsFlagsValues)
                    });
                } else if(section === IdeSections.objs && ideEntry.length === 7){
                    return this.entriesObjs.push({
                        id: Number.parseInt(ideEntry[0]),
                        modelName: ideEntry[1],
                        txdName: ideEntry[2],
                        meshCount: Number.parseInt(ideEntry[3]),
                        drawDistances: [Number.parseFloat(ideEntry[4]), Number.parseFloat(ideEntry[5])],
                        flags: bitmaskFromString<IdeEntryObjsFlags>(ideEntry[6], IdeEntryObjsFlagsValues)
                    });
                } else if(section === IdeSections.objs && ideEntry.length === 8){
                    return this.entriesObjs.push({
                        id: Number.parseInt(ideEntry[0]),
                        modelName: ideEntry[1],
                        txdName: ideEntry[2],
                        meshCount: Number.parseInt(ideEntry[3]),
                        drawDistances: [Number.parseFloat(ideEntry[4]), Number.parseFloat(ideEntry[5]), Number.parseFloat(ideEntry[6])],
                        flags: bitmaskFromString<IdeEntryObjsFlags>(ideEntry[7], IdeEntryObjsFlagsValues)
                    });
                } else if(section === IdeSections.objs){
                    throw new TypeError(`No overload for OBJS with ${ideEntry.length} arguments found.`);


                } else if(section === IdeSections.tobj && ideEntry.length === 4){
                    return this.entriesTobj.push({
                        id: Number.parseInt(ideEntry[0]),
                        modelName: ideEntry[1],
                        txdName: ideEntry[2]
                    });
                } else if(section === IdeSections.tobj && ideEntry.length === 7){
                    return this.entriesTobj.push({
                        id: Number.parseInt(ideEntry[0]),
                        modelName: ideEntry[1],
                        txdName: ideEntry[2],
                        drawDistances: [Number.parseFloat(ideEntry[3])],
                        flags: bitmaskFromString<IdeEntryObjsFlags>(ideEntry[4], IdeEntryObjsFlagsValues),
                        timeOn: Number.parseInt(ideEntry[5]),
                        timeOff: Number.parseInt(ideEntry[3])
                    });
                } else if(section === IdeSections.tobj && ideEntry.length === 8){
                    return this.entriesTobj.push({
                        id: Number.parseInt(ideEntry[0]),
                        modelName: ideEntry[1],
                        txdName: ideEntry[2],
                        meshCount: Number.parseInt(ideEntry[3]),
                        drawDistances: [Number.parseFloat(ideEntry[4])],
                        flags: bitmaskFromString<IdeEntryObjsFlags>(ideEntry[5], IdeEntryObjsFlagsValues),
                        timeOn: Number.parseInt(ideEntry[6]),
                        timeOff: Number.parseInt(ideEntry[7])
                    });
                } else if(section === IdeSections.tobj && ideEntry.length === 9){
                    return this.entriesTobj.push({
                        id: Number.parseInt(ideEntry[0]),
                        modelName: ideEntry[1],
                        txdName: ideEntry[2],
                        meshCount: Number.parseInt(ideEntry[3]),
                        drawDistances: [Number.parseFloat(ideEntry[4]), Number.parseFloat(ideEntry[5])],
                        flags: bitmaskFromString<IdeEntryObjsFlags>(ideEntry[6], IdeEntryObjsFlagsValues),
                        timeOn: Number.parseInt(ideEntry[7]),
                        timeOff: Number.parseInt(ideEntry[8])
                    });
                } else if(section === IdeSections.tobj && ideEntry.length === 10){
                    return this.entriesTobj.push({
                        id: Number.parseInt(ideEntry[0]),
                        modelName: ideEntry[1],
                        txdName: ideEntry[2],
                        meshCount: Number.parseInt(ideEntry[3]),
                        drawDistances: [Number.parseFloat(ideEntry[4]), Number.parseFloat(ideEntry[5]), Number.parseFloat(ideEntry[6])],
                        flags: bitmaskFromString<IdeEntryObjsFlags>(ideEntry[7], IdeEntryObjsFlagsValues),
                        timeOn: Number.parseInt(ideEntry[8]),
                        timeOff: Number.parseInt(ideEntry[9])
                    });
                } else if(section === IdeSections.tobj){
                    throw new TypeError(`No overload for IDE Section TOBJ with ${ideEntry.length} arguments found.`);


                } else if(section === IdeSections.hier){
                    if(ideEntry.length !== 3){
                        throw new TypeError(`IDE Section HIER entry must have 3 arguments, has ${ideEntry.length}`);
                    }

                    return this.entriesHier.push({
                        id: Number.parseInt(ideEntry[0]),
                        modelName: ideEntry[1],
                        txdName: ideEntry[2]
                    });


                } else if(section === IdeSections.cars){
                    if(ideEntry.length < 10 || ideEntry.length > 12){
                        throw new TypeError(`IDE Section CARS entry must have at least 10 and at most 12 arguments, has ${ideEntry.length}`);
                    }

                    return this.entriesCars.push({
                        id: Number.parseInt(ideEntry[0]),
                        modelName: ideEntry[1],
                        txdName: ideEntry[2],
                        type: ideEntry[3],
                        handlingId: ideEntry[4],
                        gameName: ideEntry[5],
                        class: ideEntry[6],
                        frq: Number.parseInt(ideEntry[7]),
                        lvl: Number.parseInt(ideEntry[8]),
                        comprules: Number.parseInt(ideEntry[9], 16),
                        additionalModelId: ideEntry.length >= 11 ? Number.parseInt(ideEntry[10]) : undefined,
                        wheelScale: ideEntry.length >= 12 ? Number.parseInt(ideEntry[11]) : undefined
                    });


                } else if(section === IdeSections.peds){
                    if(ideEntry.length !== 7){
                        throw new TypeError(`IDE Section PEDS entry must have 7 arguments, has ${ideEntry.length}`);
                    }

                    return this.entriesPeds.push({
                        id: Number.parseInt(ideEntry[0]),
                        modelName: ideEntry[1],
                        txdName: ideEntry[2],
                        defaultPedType: ideEntry[3],
                        behaviour: ideEntry[4],
                        animGroup: ideEntry[5],
                        carsCanDrive: bitmaskFromString<IdeEntryPedsCars>(Number.parseInt(ideEntry[6], 16), IdeEntryPedsCarsValues)
                    });


                } else if(section === IdeSections.path && ideEntry.length === 3){
                    isInPath = true;

                    return this.entriesPath.push({
                        groupType: ideEntry[0],
                        id: Number.parseInt(ideEntry[1]),
                        modelName: ideEntry[2],
                        nodes: []
                    });
                } else if(section === IdeSections.path && ideEntry.length === 9 && isInPath){
                    return this.entriesPath[this.entriesPath.length - 1].nodes.push({
                        nodeType: Number.parseInt(ideEntry[0]),
                        nextNode: Number.parseInt(ideEntry[1]),
                        isCrossRoad: !!Number.parseInt(ideEntry[2]),
                        position: vec3FromString(ideEntry[3], ideEntry[4], ideEntry[5]),
                        leftLanes: Number.parseInt(ideEntry[6]),
                        rightLanes: Number.parseInt(ideEntry[7])
                    });
                } else if(section === IdeSections.path){
                    throw new TypeError(`IDE Section PATH entry must have 3 or 9 arguments, has ${ideEntry.length}`);
                }
            });

            ideTransform.on('error', reject);
            ideTransform.on('finish', () => resolve());
        });
    }
}
