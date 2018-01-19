import * as path from 'path';
import * as fs from 'fs';

import * as git from 'git-rev-sync';

export enum GameVersion {
    GTAIII = 3,
    GTAVC = 4,
    GTASA = 5
}

export default class Config {
    projectRoot: string;
    configPath: string;
    packagePath: string;

    version: GameVersion;
    language: string;
    rootPath: string;

    packageRevShort: string;
    packageVersion: string;
    packageName: string;

    debugGl: boolean;

    fov: number;

    constructor(){
        this.projectRoot = path.resolve(__dirname, '../..');
        this.configPath = path.resolve(this.projectRoot, 'config.json');
        this.packagePath = path.resolve(this.projectRoot, 'package.json');

        const configObject = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        const packageObject = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'));

        Object.assign(this, configObject);
        this.parseCmdArgs();

        // make sure rootPath is absolute
        this.rootPath = path.resolve(this.rootPath);
        // transform version into our enum
        this.version = GameVersion[<string><any>this.version];

        this.packageRevShort = git.short();
        this.packageVersion = packageObject.version;
        this.packageName = packageObject.name;
    }

    parseCmdArgs(argv = process.argv): void {
        argv.forEach((arg, i) => {
            const argMatch = arg.match(/^--(.*)/);
            if(!argMatch){
                return;
            }

            let optValue: any = argv[i + 1];
            let optName = argMatch[1];
            const equalsArgMatch = arg.match(/^--(.*)?=(.*)$/);

            if(equalsArgMatch){
                optName = equalsArgMatch[1];
                optValue = equalsArgMatch[2];
            }

            optName = this.dashCaseToCamelCase(optName);

            if(!this[optName]){
                return;
            }

            if(optValue === 'true'){
                optValue = true;
            }
            if(optValue === 'false'){
                optValue = false;
            }
            if(!Number.isNaN(Number.parseFloat(optValue))){
                optValue = Number.parseFloat(optValue);
            }

            this[optName] = optValue;
        });
    }

    dashCaseToCamelCase(str: string): string {
        return str
            .split('-')
            .map((v, i) =>
                i === 0 ? v : v.slice(0, 1).toUpperCase() + v.slice(1)
            )
            .join('');
    }
}
