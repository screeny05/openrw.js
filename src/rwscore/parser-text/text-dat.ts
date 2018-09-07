import split2 from 'split2';

import { IPlatformFile } from '@rws/adapter/fs/interface/file';

const defaults = {
    lowercase: false,
    splitBy: /, |,| /,
    trimTrailingComma: true,
    commentIndicator: /#|;/
};

type StreamTextDatOptions = typeof defaults;

export type DatCommand = string[];

export function parseLineIntoCommand(line: string, options: typeof defaults): DatCommand|undefined {
    [line] = line.split(options.commentIndicator);

    // remove excess whitespace
    line = line.trim();
    line = line.replace(/\s+/g, ' ');

    if(options.trimTrailingComma){
        line = line.replace(/,+$/, '');
    }

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
