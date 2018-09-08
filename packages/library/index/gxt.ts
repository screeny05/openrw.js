import Corrode from 'corrode';
import { IFile } from '@rws/platform/fs';
import { Expression as GxtExpression, parse as parseGxt } from '../parser-text/gxt';

type GxtEntry = string;

export class GxtIndex {
    file: IFile;
    gxtIndex: Map<string, GxtEntry> = new Map();
    parsedCache: Map<string, GxtExpression[]> = new Map();

    constructor(file: IFile){
        this.file = file;
    }

    async load(): Promise<void> {
        const parser = new Corrode().ext.gxt('gxt');

        parser.on('entry', entry => {
            this.gxtIndex.set(entry.key, entry.value);
        });

        await this.file.parse(parser);
    }

    get(key: string): GxtEntry {
        const val = this.gxtIndex.get(key);
        if(!val){
            throw new ReferenceError(`GxtIndex: Entry with key '${key}' not found.`);
        }
        return val;
    }

    getParsed(key: string): GxtExpression[] {
        let expressions = this.parsedCache.get(key);
        if(expressions){
            return expressions;
        }

        const parsed = parseGxt(this.get(key));
        this.parsedCache.set(key, parsed);
        return parsed;
    }
}
