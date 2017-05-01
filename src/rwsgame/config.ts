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

    constructor(){
        this.projectRoot = path.resolve(__dirname, '../..');
        this.configPath = path.resolve(this.projectRoot, 'config.json');
        this.packagePath = path.resolve(this.projectRoot, 'package.json');

        const configObject = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        const packageObject = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'));

        Object.keys(configObject).forEach(key => {
            this[key] = configObject[key];
        });

        // make sure rootPath has a trailing slash
        this.rootPath = path.join(configObject.rootPath, '/');

        // transform version into our enum
        this.version = GameVersion[<string>configObject.version];

        this.packageRevShort = git.short();
        this.packageVersion = packageObject.version;
        this.packageName = packageObject.name;
    }
}
