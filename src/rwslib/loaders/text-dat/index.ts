import * as fs from 'fs';

const defaults = {
    lowercase: false,
    delimiter: ' '
};

type DatCommand = Array<string>;

export default async function loadTextDat(path: string, options: any = {}){
    options = { ...defaults, ...options };

    return new Promise<Array<DatCommand>>((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if(err){
                return reject(err);
            }

            const commands: Array<DatCommand> = [];

            data.split('\n').forEach(line => {
                // remove comments
                line = line.split('#')[0];

                // remove excess whitespace
                line = line.trim();
                line = line.replace(/\s+/g, ' ');

                if(options.lowercase){
                    line = line.toLowerCase();
                }

                if(line){
                    commands.push(line.split(options.delimiter));
                }
            });

            resolve(commands);
        });
    });
}
