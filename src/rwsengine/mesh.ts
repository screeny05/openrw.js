import Object3D from './object3d';
import Geometry from './geometry';
import Material from './materials/material';

import { IdeEntryObjs } from '../rwslib/loaders/ide';
import { IplEntryInst } from '../rwslib/loaders/ipl';

export default class Mesh extends Object3D {
    geometry: Geometry;
    materials: Array<Material> = [];

    id: any;
    parentId: any;

    children: Array<Mesh> = [];

    constructor(name: string){
        super();

        this.name = name;
    }
}
