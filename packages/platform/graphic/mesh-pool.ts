import { IMesh } from '@rws/platform/graphic/mesh';
import { RwsStructPool } from '@rws/library/rws-struct-pool';

export interface IMeshPool {
    getMesh(name: string): Promise<IMesh>;
}

export interface IMeshPoolConstructor {
    new(rwsStructPool: RwsStructPool): IMeshPool;
}
