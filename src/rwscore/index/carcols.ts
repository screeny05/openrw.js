import { IPlatformFile } from "@rws/adapter/fs/interface/file";
import { vec3 } from "gl-matrix";
import { chunk } from 'lodash';

import streamTextDat, { DatCommand } from '../parser-text/text-dat';
import { rgbFromString } from "../parser-text/string-native";

export enum CarcolsSections {
    col,
    car
}

export type ColorPair = [vec3, vec3];

export class CarcolsIndex {
    file: IPlatformFile;
    colors: vec3[] = [];
    carsToColorIndices: Map<string, [number, number][]> = new Map();

    constructor(file: IPlatformFile){
        this.file = file;
    }

    async load(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const carcolsTransform = streamTextDat(this.file);
            let section: CarcolsSections|null = null;

            carcolsTransform.on('data', (colEntry: DatCommand) => {
                const trySection = CarcolsSections[colEntry[0]];

                if(colEntry.length === 1 && typeof trySection !== 'undefined'){
                    section = trySection;
                    return;
                }

                if(colEntry.length === 1 && colEntry[0] === 'end'){
                    section = null;
                    return;
                }

                if(section === CarcolsSections.col && colEntry.length === 3){
                    this.colors.push(rgbFromString(colEntry[0], colEntry[1], colEntry[2]));
                } else if(section === CarcolsSections.col){
                    throw new TypeError(`No overload for col with ${colEntry.length} arguments found.`);
                } else if(section === CarcolsSections.car){
                    const [carname, ...colors] = colEntry;

                    // if the car has no colors, default to 0
                    if(colors.length === 0){
                        colors.push('0', '0');
                    }

                    if(colors.length % 2 !== 0){
                        throw new TypeError(`No overload for car with ${colEntry.length} arguments found (colors have to be in pairs of two).`);
                    }
                    const colorPairs = chunk(colors.map(color => Number.parseInt(color)), 2) as [number, number][];
                    this.carsToColorIndices.set(carname, colorPairs);
                } else if(section === CarcolsSections.car){
                    throw new TypeError(`No overload for car with ${colEntry.length} arguments found.`);
                }
            });

            carcolsTransform.on('error', reject);
            carcolsTransform.on('finish', () => resolve());
        });
    }

    getColorsByCarName(name: string): ColorPair[] {
        const indices = this.carsToColorIndices.get(name);

        if(!indices){
            throw new Error(`Car ${name} does not exist.`);
        }

        return indices.map<ColorPair>(([indexPrimary, indexSecondary]) => {
            const colorPrimary = this.colors[indexPrimary];
            const colorSecondary = this.colors[indexSecondary];
            if(!colorPrimary || !colorSecondary){
                throw new Error(`Invalid color indices for cal ${name}`);
            }
            return [colorPrimary, colorSecondary];
        });
    }
}
