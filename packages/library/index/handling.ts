import { IFile } from "@rws/platform/fs";
import { vec3 } from "gl-matrix";
import streamTextDat, { DatCommand } from "../parser-text/text-dat";
import { vec3FromString, booleanFromStringNumber } from "../parser-text/string-native";

export enum HandlingDriveType {
    FourWheel = '4',
    Front = 'F',
    Rear = 'R'
}

export enum HandlingEngineType {
    Petrol = 'P',
    Diesel = 'D',
    Electric = 'E'
}

export interface HandlingFlags {
    Boost1G: boolean;
    Boost2G: boolean;
    RevBonnet: boolean;
    HangingBoot: boolean;
    NoDoors: boolean;
    IsVan: boolean;
    IsBus: boolean;
    IsLow: boolean;
    DoubleExhaust: boolean;
    TailgateBoot: boolean;
    NoswingBoot: boolean;
    NonplayerStabiliser: boolean;
    NeutralHandling: boolean;
    HasNoRoof: boolean;
    IsBig: boolean;
    HalogenLights: boolean;
}

export enum HandlingFlagsBits1 {
    Boost1G = 1,
    Boost2G = 2,
    RevBonnet = 4,
    HangingBoot = 8,
}

export enum HandlingFlagsBits2 {
    NoDoors = 1,
    IsVan = 2,
    IsBus = 4,
    IsLow = 8,
}

export enum HandlingFlagsBits3 {
    DoubleExhaust = 1,
    TailgateBoot = 2,
    NoswingBoot = 4,
    NonplayerStabiliser = 8,
}

export enum HandlingFlagsBits4 {
    NeutralHandling = 1,
    HasNoRoof = 2,
    IsBig = 4,
    HalogenLights = 8,
}

export enum HandlingLights {
    long = 0,
    small = 1,
    big = 2,
    tall = 3,
}

export interface HandlingEntry {
    name: string;
    mass: number;
    dimensions: vec3;
    centerOfMass: vec3;
    percentSubmerged: number;
    tractionMultiplier: number;
    tractionLoss: number;
    tractionBias: number;
    numberOfGears: number;
    maxVelocity: number;
    engineAcceleration: number;
    driveType: HandlingDriveType;
    engineType: HandlingEngineType;
    brakeDeceleration: number;
    brakeBias: number;
    hasABS: boolean;
    steeringLock: number;
    suspensionForceLevel: number;
    suspensionDampingLevel: number;
    seatOffsetDistance: number;
    collisionDamageMultiplier: number;
    monetaryValue: number;
    suspensionUpperLimit: number;
    suspensionLowerLimit: number;
    suspensionBias: number;
    flags: HandlingFlags;
    frontLights: HandlingLights;
    backLights: HandlingLights;
}

export class HandlingIndex {
    entries: Map<string, HandlingEntry> = new Map();

    constructor(private file: IFile){}

    load(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const handlingTransform = streamTextDat(this.file);
            handlingTransform.on('data', (handlingEntry: DatCommand) => {
                if(handlingEntry.length !== 32){
                    throw TypeError(`handling.cfg entry can only be of length 32. ${handlingEntry.length} given.`);
                }

                const entry: HandlingEntry = {
                    name: handlingEntry[0],
                    mass: Number.parseFloat(handlingEntry[1]),
                    dimensions: vec3FromString(handlingEntry[2], handlingEntry[3], handlingEntry[4]),
                    centerOfMass: vec3FromString(handlingEntry[5], handlingEntry[6], handlingEntry[7]),
                    percentSubmerged: Number.parseFloat(handlingEntry[8]),
                    tractionMultiplier: Number.parseFloat(handlingEntry[9]),
                    tractionLoss: Number.parseFloat(handlingEntry[10]),
                    tractionBias: Number.parseFloat(handlingEntry[11]),
                    numberOfGears: Number.parseFloat(handlingEntry[12]),
                    maxVelocity: Number.parseFloat(handlingEntry[13]),
                    engineAcceleration: Number.parseFloat(handlingEntry[14]),
                    driveType: handlingEntry[15] as HandlingDriveType,
                    engineType: handlingEntry[16] as HandlingEngineType,
                    brakeDeceleration: Number.parseFloat(handlingEntry[17]),
                    brakeBias: Number.parseFloat(handlingEntry[18]),
                    hasABS: booleanFromStringNumber(handlingEntry[19]),
                    steeringLock: Number.parseFloat(handlingEntry[20]),
                    suspensionForceLevel: Number.parseFloat(handlingEntry[21]),
                    suspensionDampingLevel: Number.parseFloat(handlingEntry[22]),
                    seatOffsetDistance: Number.parseFloat(handlingEntry[23]),
                    collisionDamageMultiplier: Number.parseFloat(handlingEntry[24]),
                    monetaryValue: Number.parseFloat(handlingEntry[25]),
                    suspensionUpperLimit: Number.parseFloat(handlingEntry[26]),
                    suspensionLowerLimit: Number.parseFloat(handlingEntry[27]),
                    suspensionBias: Number.parseFloat(handlingEntry[28]),
                    flags: this.getHandlingFlags(handlingEntry[29]),
                    frontLights: Number.parseInt(handlingEntry[30]),
                    backLights: Number.parseInt(handlingEntry[31]),
                };

                this.entries.set(entry.name, entry);
            });

            handlingTransform.on('error', reject);
            handlingTransform.on('finish', () => resolve());
        });
    }

    getHandlingFlags(flagsRaw: string): HandlingFlags {
        const [flags1, flags2, flags3, flags4] = flagsRaw.split('').map(flagString => Number.parseInt(flagString, 16));
        return {
            Boost1G: (flags1 & HandlingFlagsBits1.Boost1G) !== 0,
            Boost2G: (flags1 & HandlingFlagsBits1.Boost2G) !== 0,
            RevBonnet: (flags1 & HandlingFlagsBits1.RevBonnet) !== 0,
            HangingBoot: (flags1 & HandlingFlagsBits1.HangingBoot) !== 0,
            NoDoors: (flags1 & HandlingFlagsBits2.NoDoors) !== 0,
            IsVan: (flags1 & HandlingFlagsBits2.IsVan) !== 0,
            IsBus: (flags1 & HandlingFlagsBits2.IsBus) !== 0,
            IsLow: (flags1 & HandlingFlagsBits2.IsLow) !== 0,
            DoubleExhaust: (flags1 & HandlingFlagsBits3.DoubleExhaust) !== 0,
            TailgateBoot: (flags1 & HandlingFlagsBits3.TailgateBoot) !== 0,
            NoswingBoot: (flags1 & HandlingFlagsBits3.NoswingBoot) !== 0,
            NonplayerStabiliser: (flags1 & HandlingFlagsBits3.NonplayerStabiliser) !== 0,
            NeutralHandling: (flags1 & HandlingFlagsBits4.NeutralHandling) !== 0,
            HasNoRoof: (flags1 & HandlingFlagsBits4.HasNoRoof) !== 0,
            IsBig: (flags1 & HandlingFlagsBits4.IsBig) !== 0,
            HalogenLights: (flags1 & HandlingFlagsBits4.HalogenLights) !== 0,
        }
    }
}
