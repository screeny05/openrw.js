import Object3D from './object3d';
import Geometry from './geometry';
import Texture from './texture';

import { IdeEntryObjs } from '../rwslib/loaders/ide';
import { IplEntryInst } from '../rwslib/loaders/ipl';

export default class Mesh extends Object3D {
    geometries: Array<Geometry> = [];
    textures: Array<Texture> = [];

    constructor(){
        super();
    }

    static fromIpl(instance: IplEntryInst, definition: IdeEntryObjs): Mesh {
        const mesh = new Mesh();

        return mesh;
    }
}
