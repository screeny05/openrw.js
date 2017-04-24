import * as fs from 'fs';

const defaults = {
    lowercase: false,
    delimiter: ' '
};

export default async function loadTextDat(path: string, options: any = {}){
    options = { ...defaults, ...options };

    return new Promise<Array<Array<string>>>((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if(err){
                return reject(err);
            }

            const commands: Array<Array<string>> = [];

            data.split('\n').forEach(line => {
                line = line.split('#')[0];
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
