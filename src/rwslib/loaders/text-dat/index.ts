import * as fs from 'fs';

import * as split2 from 'split2';

const defaults = {
    lowercase: false,
    splitBy: /,| /,
    commentIndicator: /#|;/
};

export type DatCommand = Array<string>;

export function parseLineIntoCommand(line: string, options: any): DatCommand|undefined {
    line = line.split(options.commentIndicator)[0];

    // remove excess whitespace
    line = line.trim();
    line = line.replace(/\s+/g, ' ');


    if(options.lowercase){
        line = line.toLowerCase();
    }

    if(line){
        return line.split(options.splitBy).filter(arg => arg);
    }
}

export default function streamTextDat(path: string, options: any = {}){
    options = { ...defaults, ...options };

    return fs
        .createReadStream(path, 'utf8')
        .pipe(split2(line =>
            parseLineIntoCommand(line, options))
        );
}
