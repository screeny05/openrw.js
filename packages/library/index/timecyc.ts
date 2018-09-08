import { IPlatformFile } from "@rws/adapter/fs/interface/file";
import { vec3 } from "gl-matrix";

import streamTextDat, { DatCommand } from '../parser-text/text-dat';
import { rgbFromString } from "../parser-text/string-native";

const lerp = (a: number, b: number, t: number): number => a * (1 - t) + b * t;

export interface TimecycEntry {
    ambientColor: vec3;
    directLightColor: vec3;
    skyTopColor: vec3;
    skyBottomColor: vec3;
    sunCoreColor: vec3;
    sunCoronaColor: vec3;
    sunCoreSize: number;
    sunCoronaSize: number;
    sunBrightness: number;
    shadowIntensity: number;
    lightShading: number;
    poleShading: number;
    farClippingOffset: number;
    fogStartOffset: number;
    amountGroundLight: number;
    lowerCloudColor: vec3;
    upperCloudTopColor: vec3;
    upperCloudBottomColor: vec3;
    //unknown: [number, number, number, number];
}

const WeatherCycleGTAIII = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 0, 0, 0, 1, 3, 3, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 2, 1];
const WeatherCycleVC = [4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 0, 0, 0, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
const WeatherCycleVCHurricane = [4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 0, 0, 0, 4, 4, 1, 5, 5, 1, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 5, 5, 1, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];

export class TimecycIndex {
    file: IPlatformFile;
    entries: TimecycEntry[] = [];

    constructor(file: IPlatformFile){
        this.file = file;
    }

    async load(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const timecycTransform = streamTextDat(this.file, {
                commentIndicator: /\/\//
            });

            timecycTransform.on('data', (item: DatCommand) => {
                if(item.length !== 40){
                    throw new TypeError(`Timecyc entry must have a length of 52. Got ${item.length} entries.`);
                }

                this.entries.push({
                    ambientColor: rgbFromString(item[0], item[1], item[2]),
                    directLightColor: rgbFromString(item[3], item[4], item[5]),
                    skyTopColor: rgbFromString(item[6], item[7], item[8]),
                    skyBottomColor: rgbFromString(item[9], item[10], item[11]),
                    sunCoreColor: rgbFromString(item[12], item[13], item[14]),
                    sunCoronaColor: rgbFromString(item[15], item[16], item[17]),
                    sunCoreSize: Number.parseFloat(item[18]),
                    sunCoronaSize: Number.parseFloat(item[19]),
                    sunBrightness: Number.parseFloat(item[20]),
                    shadowIntensity: Number.parseFloat(item[21]),
                    lightShading: Number.parseFloat(item[22]),
                    poleShading: Number.parseFloat(item[23]),
                    farClippingOffset: Number.parseFloat(item[24]),
                    fogStartOffset: Number.parseFloat(item[25]),
                    amountGroundLight: Number.parseFloat(item[26]),
                    lowerCloudColor: rgbFromString(item[27], item[28], item[29]),
                    upperCloudTopColor: rgbFromString(item[30], item[31], item[32]),
                    upperCloudBottomColor: rgbFromString(item[33], item[34], item[35]),
                });
            });

            timecycTransform.on('error', reject);
            timecycTransform.on('finish', () => resolve());
        });
    }

    getInterpolatedTimecycEntry(weatherType: number, time: number): TimecycEntry {
        const currentHour = Math.floor(time) % 24;
        const nextHour = (currentHour + 1) % 24;
        const currentEntry = this.entries[weatherType * 24 + currentHour];
        const nextEntry = this.entries[weatherType * 24 + nextHour];
        return this.interpolateEntries(currentEntry, nextEntry, time % 1);
    }

    interpolateEntries(start: TimecycEntry, end: TimecycEntry, t: number): TimecycEntry {
        const ambientColor = vec3.create();
        const directLightColor = vec3.create();
        const skyTopColor = vec3.create();
        const skyBottomColor = vec3.create();
        const sunCoreColor = vec3.create();
        const sunCoronaColor = vec3.create();
        const lowerCloudColor = vec3.create();
        const upperCloudTopColor = vec3.create();
        const upperCloudBottomColor = vec3.create();

        vec3.lerp(ambientColor, start.ambientColor, end.ambientColor, t);
        vec3.lerp(directLightColor, start.directLightColor, end.directLightColor, t);
        vec3.lerp(skyTopColor, start.skyTopColor, end.skyTopColor, t);
        vec3.lerp(skyBottomColor, start.skyBottomColor, end.skyBottomColor, t);
        vec3.lerp(sunCoreColor, start.sunCoreColor, end.sunCoreColor, t);
        vec3.lerp(sunCoronaColor, start.sunCoronaColor, end.sunCoronaColor, t);
        vec3.lerp(lowerCloudColor, start.lowerCloudColor, end.lowerCloudColor, t);
        vec3.lerp(upperCloudTopColor, start.upperCloudTopColor, end.upperCloudTopColor, t);
        vec3.lerp(upperCloudBottomColor, start.upperCloudBottomColor, end.upperCloudBottomColor, t);

        return {
            ambientColor,
            directLightColor,
            skyTopColor,
            skyBottomColor,
            sunCoreColor,
            sunCoronaColor,
            sunCoreSize: lerp(start.sunCoreSize, end.sunCoreSize, t),
            sunCoronaSize: lerp(start.sunCoronaSize, end.sunCoronaSize, t),
            sunBrightness: lerp(start.sunBrightness, end.sunBrightness, t),
            shadowIntensity: lerp(start.shadowIntensity, end.shadowIntensity, t),
            lightShading: lerp(start.lightShading, end.lightShading, t),
            poleShading: lerp(start.poleShading, end.poleShading, t),
            farClippingOffset: lerp(start.farClippingOffset, end.farClippingOffset, t),
            fogStartOffset: lerp(start.fogStartOffset, end.fogStartOffset, t),
            amountGroundLight: lerp(start.amountGroundLight, end.amountGroundLight, t),
            lowerCloudColor,
            upperCloudTopColor,
            upperCloudBottomColor,
        };
    }
}
