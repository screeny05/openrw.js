import { IMesh } from './mesh';

export interface IMeshProvider {
    getMesh(name: string): Promise<IMesh>;
}
