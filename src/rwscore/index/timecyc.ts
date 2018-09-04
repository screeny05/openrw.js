import { IPlatformFile } from "../../adapter/fs/interface/file";
import { vec3 } from "gl-matrix";
import { chunk } from 'lodash';

import streamTextDat, { DatCommand } from '../parser-text/text-dat';
import { rgbFromString } from "../parser-text/string-native";

export interface TimecycEntry {
    staticAmbienceColor: vec3;
    dynamicAmbienceColor: vec3;
    staticAmbienceBlurColor: vec3;
    dynamicAmbienceBlurColor: vec3;
    directLightColor: vec3;
    skyTopColor: vec3;
    skyBottomColor: vec3;
    sunCoreColor: vec3;
    sunCoronaColor: vec3;
    sunCoreSize: number;
    sunCoronaSize: number;
    spriteBrightness: number;
    shadowIntensity: number;
    lightShadingValue: number;
    poleShadingValue: number;
    farClippingOffset: number;
    fogStartOffset: number;
    lightOnGround: number;
    lowerCloudsColor: vec3;
    upperCloudsTopColor: vec3;
    upperCloudsBottomColor: vec3;
    blurColor: vec3;
    waterColor: vec3;
    waterAlphaLevel: number;
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
                if(item.length !== 52){
                    throw new TypeError(`Timecyc entry must have a length of 52. Got ${item.length} entries.`);
                }

                this.entries.push({
                    staticAmbienceColor: rgbFromString(item[0], item[1], item[2]),
                    dynamicAmbienceColor: rgbFromString(item[3], item[4], item[5]),
                    staticAmbienceBlurColor: rgbFromString(item[6], item[7], item[8]),
                    dynamicAmbienceBlurColor: rgbFromString(item[9], item[10], item[11]),
                    directLightColor: rgbFromString(item[12], item[13], item[14]),
                    skyTopColor: rgbFromString(item[15], item[16], item[17]),
                    skyBottomColor: rgbFromString(item[18], item[19], item[20]),
                    sunCoreColor: rgbFromString(item[21], item[22], item[23]),
                    sunCoronaColor: rgbFromString(item[24], item[25], item[26]),
                    sunCoreSize: Number.parseFloat(item[27]),
                    sunCoronaSize: Number.parseFloat(item[28]),
                    spriteBrightness: Number.parseFloat(item[29]),
                    shadowIntensity: Number.parseFloat(item[30]),
                    lightShadingValue: Number.parseFloat(item[31]),
                    poleShadingValue: Number.parseFloat(item[32]),
                    farClippingOffset: Number.parseFloat(item[33]),
                    fogStartOffset: Number.parseFloat(item[34]),
                    lightOnGround: Number.parseFloat(item[35]),
                    lowerCloudsColor: rgbFromString(item[36], item[37], item[38]),
                    upperCloudsTopColor: rgbFromString(item[39], item[40], item[41]),
                    upperCloudsBottomColor: rgbFromString(item[42], item[43], item[44]),
                    blurColor: rgbFromString(item[45], item[46], item[47]),
                    waterColor: rgbFromString(item[48], item[49], item[50]),
                    waterAlphaLevel: Number.parseFloat(item[51])
                });
            });

            timecycTransform.on('error', reject);
            timecycTransform.on('finish', () => resolve());
        });
    }

    getInterpolatedTimecycEntry(time: number): TimecycEntry {
        return <any>{};
    }
}
