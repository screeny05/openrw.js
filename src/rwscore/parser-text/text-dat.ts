import split2 from 'split2';

import { IPlatformFile } from '../platform/file';

const defaults = {
    lowercase: false,
    splitBy: /, |,| /,
    commentIndicator: /#|;/
};

type StreamTextDatOptions = typeof defaults;

export type DatCommand = string[];

export function parseLineIntoCommand(line: string, options: typeof defaults): DatCommand|undefined {
    [line] = line.split(options.commentIndicator);

    // remove excess whitespace
    line = line.trim();
    line = line.replace(/\s+/g, ' ');

    if(options.lowercase){
        line = line.toLowerCase();
    }

    if(line){
        return line.split(options.splitBy);
    }
}

export default function streamTextDat(file: IPlatformFile, options: Partial<StreamTextDatOptions> = {}): any {
    options = { ...defaults, ...options };

    return file.stream()
        .pipe(split2(line =>
            parseLineIntoCommand(line, <StreamTextDatOptions>options))
        );
}
