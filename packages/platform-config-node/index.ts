import { IConfig, EngineLevel } from "@rws/platform/config";
import { readFileSync } from 'fs';

export const PlatformConfig: IConfig = {
    debug: true,
    fov: 60,
    language: 'DE',
    level: EngineLevel.GTAIII,
    packageVersion: '0.1.0'
}

export function parseJson(target: IConfig, path: string): void {
    const configObject = JSON.parse(readFileSync(path, 'utf8'));
    Object.assign(target, configObject);

    target.level = EngineLevel[<string><any>target.level];
}

export function parseCmdArgs(target: IConfig, argv = process.argv): void {
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

        optName = dashCaseToCamelCase(optName);

        if(!target[optName]){
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

        target[optName] = optValue;
    });
};

const dashCaseToCamelCase = function(str: string): string {
    return str
        .split('-')
        .map((v, i) =>
            i === 0 ? v : v.slice(0, 1).toUpperCase() + v.slice(1)
        )
        .join('');
};
