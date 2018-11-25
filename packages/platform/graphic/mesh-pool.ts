import { IMesh } from '@rws/platform/graphic/mesh';
import { RwsStructPool } from '@rws/library/rws-struct-pool';

export interface IMeshPool {
    get(name: string): IMesh;
    has(name: string): boolean;
    findMeshChild(name: string): IMesh | null;
    loadFromFile(fileName: string): Promise<void>;
    loadFromImg(imgName: string, fileName: string): Promise<void>;
}

export interface IMeshPoolConstructor {
    new(rwsStructPool: RwsStructPool): IMeshPool;
}
