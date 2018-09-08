import { vec3 } from 'gl-matrix';

import streamTextDat, { DatCommand } from '../parser-text/text-dat';

import { vec3FromString, bitmaskFromString, rgbFromString } from '../parser-text/string-native';
import { IFile } from '@rws/platform/fs';
import { Bitmask } from '../type/bitmask';

export enum IdeSections {
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

export interface IdeEntryObjs {
    id: number;
    modelName: string;
    txdName: string;
    meshCount?: number;
    drawDistances?: Array<number>;
    flags?: IdeEntryObjsFlags;
}

export interface IdeEntryTobj extends IdeEntryObjs {
    timeOn?: number;
    timeOff?: number;
}

export interface IdeEntryHier {
    id: number;
    modelName: string;
    txdName: string;
}

export interface IdeEntryCars {
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

export interface IdeEntryPeds {
    id: number;
    modelName: string;
    txdName: string;
    defaultPedType: string;
    behaviour: string;
    animGroup: string;
    carsCanDrive: IdeEntryPedsCars;
}

export interface IdeEntryPath {
    id: number;
    modelName: string;
    groupType: string;
    nodes: Array<IdeEntryPathNode>;
}

export interface IdeEntryPathNode {
    nodeType: number;
    nextNode: number;
    isCrossRoad: boolean;
    position: vec3;
    leftLanes: number;
    rightLanes: number;
}

export interface IdeEntry2dfx {
    id: number;
    position: vec3;
    color: vec3;
    fxType: IdeEntry2dfxType;
}

export enum IdeEntry2dfxType {
    lights = 0,
    particles = 1,
    poi = 2
}

export interface IdeEntry2dfxLight extends IdeEntry2dfx {
    coronaTexture: string;
    shadowTexture: string;
    viewDistances: number;
    outerRange: number;
    innerRange: number;
    coronaSize: number;
    shadowIntensity: number;
    flash: IdeEntry2dfxLightFlash;
    isWetReflective: boolean;
    flare: IdeEntry2dfxLightFlare;
    flags: number;
}

export enum IdeEntry2dfxLightFlash {
    lit = 0,
    litAtNight = 1,
    flicker = 2,
    flickerAtNight = 3,
    flash102s = 4,
    flash102sNight = 5,
    flash204s = 6,
    flash204sNight = 7,
    flash408s = 8,
    flash408sNight = 9,
    flickerRandom = 10,
    flickerRandomNight = 11,
    trafficLight = 12,
    flash102sLiftBridge = 13
}

export enum IdeEntry2dfxLightFlare {
    none = 0,
    yellow = 1,
    white = 2
}

export interface IdeEntry2dfxParticle extends IdeEntry2dfx {
    particleType: IdeEntry2dfxParticleType;
    strength: vec3;
    scale: number;
}

export enum IdeEntry2dfxParticleType {
    pavementSteam = 0,
    wallSteam = 1,
    dryIce = 2,
    smallFire = 3,
    darkSmoke = 4,
    waterFountainVert = 5,
    waterFountainHoriz = 6
}

const IdeEntryObjsFlagsValues = {
    all: 0xffff,
    wet: 1<<0,
    disableFadeOnLoad: 1<<1,
    allowTransparencyThroughThis: 1<<2,
    alphaTransparency2: 1<<3,
    fadeOnLoad: 1<<4,
    usedInInterior: 1<<5,
    disableShadowMesh: 1<<6,
    disableCull: 1<<7,
    disableDrawDistance: 1<<8,
    isBreakable: 1<<9,
    isCrackable: 1<<10,
    isGarageDoor: 1<<11,
    isMultiMesh: 1<<12,
    isVegetation: 1<<14,
    getBrightnessFromWeather: 1<<15,
    explodesAfterHit: 1<<16,
    unknown1: 1<<17,
    unknown2: 1<<18,
    isGrafitty: 1<<20,
    disableCullSA: 1<<21,
    unknown3: 1<<22
};

export type IdeEntryObjsFlags = Bitmask<typeof IdeEntryObjsFlagsValues>;

const IdeEntryPedsCarsValues = {
    none: 0,
    poorfamily: 1<<0,
    richfamily: 1<<1,
    executive: 1<<2,
    worker: 1<<3,
    special: 1<<4,
    big: 1<<5,
    taxi: 1<<6
};

export type IdeEntryPedsCars = Bitmask<typeof IdeEntryPedsCarsValues>;

export class IdeIndex {
    file: IFile;

    entriesObjs: Array<IdeEntryObjs> = [];
    entriesTobj: Array<IdeEntryTobj> = [];
    entriesHier: Array<IdeEntryHier> = [];
    entriesCars: Array<IdeEntryCars> = [];
    entriesPeds: Array<IdeEntryPeds> = [];
    entriesPath: Array<IdeEntryPath> = [];
    entries2dfx: Array<IdeEntry2dfx> = [];

    constructor(file: IFile){
        this.file = file;
    }

    async load(){
        return new Promise<never>((resolve, reject) => {
            const ideTransform = streamTextDat(this.file, { lowercase: true });

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


                } else if(section === IdeSections['2dfx'] && ideEntry.length === 20){
                    return this.entries2dfx.push(<IdeEntry2dfxLight>{
                        id: Number.parseInt(ideEntry[0]),
                        position: vec3FromString(ideEntry[1], ideEntry[2], ideEntry[3]),
                        color: rgbFromString(ideEntry[4], ideEntry[5], ideEntry[6]),
                        fxType: Number.parseInt(ideEntry[8]),
                        coronaTexture: ideEntry[9],
                        shadowTexture: ideEntry[10],
                        viewDistances: Number.parseFloat(ideEntry[11]),
                        outerRange: Number.parseFloat(ideEntry[12]),
                        coronaSize: Number.parseFloat(ideEntry[13]),
                        innerRange: Number.parseFloat(ideEntry[14]),
                        shadowIntensity: Number.parseInt(ideEntry[15]),
                        flash: Number.parseInt(ideEntry[16]),
                        isWetReflective: !!Number.parseInt(ideEntry[17]),
                        flare: Number.parseInt(ideEntry[18]),
                        flags: Number.parseInt(ideEntry[19])
                    });
                } else if(section === IdeSections['2dfx'] && ideEntry.length === 14){
                    return this.entries2dfx.push(<IdeEntry2dfxParticle>{
                        id: Number.parseInt(ideEntry[0]),
                        position: vec3FromString(ideEntry[1], ideEntry[2], ideEntry[3]),
                        color: rgbFromString(ideEntry[4], ideEntry[5], ideEntry[6]),
                        fxType: Number.parseInt(ideEntry[8]),
                        particleType: Number.parseInt(ideEntry[9]),
                        strength: vec3FromString(ideEntry[10], ideEntry[11], ideEntry[12]),
                        scale: Number.parseFloat(ideEntry[13])
                    });
                } else if(section === IdeSections['2dfx'] && ideEntry.length === 13){
                    return this.entries2dfx.push(<IdeEntry2dfx>{
                        id: Number.parseInt(ideEntry[0]),
                        position: vec3FromString(ideEntry[1], ideEntry[2], ideEntry[3]),
                        color: rgbFromString(ideEntry[4], ideEntry[5], ideEntry[6]),
                        fxType: Number.parseInt(ideEntry[8]),
                    });
                } else if(section === IdeSections['2dfx']){
                    throw new TypeError(`IDE Section 2DFX entry must have 20/14/13 arguments, has ${ideEntry.length}`);
                }
            });

            ideTransform.on('error', reject);
            ideTransform.on('finish', () => resolve());
        });
    }
}
