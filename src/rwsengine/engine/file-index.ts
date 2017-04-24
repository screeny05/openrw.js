import * as path from 'path';

export default class FileIndex {
    indexRoot: string;

    indexDirectory(root: string){
        this.indexRoot = root;
    }

    getFSPath(orgPath: string): string {
        return path.join(this.indexRoot, orgPath.replace(/\\/g, '/'));
    }
}
