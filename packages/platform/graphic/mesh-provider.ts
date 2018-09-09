import { IMesh } from './mesh';
import { RwsStructPool } from '@rws/library/rws-struct-pool';

export interface IMeshProvider {
    getMesh(name: string): Promise<IMesh>;
    setRwsStructPool(rwsStructPool: RwsStructPool): void;
}
