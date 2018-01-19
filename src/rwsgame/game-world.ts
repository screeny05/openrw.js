import { GLES2Context } from '@glaced/gles2-2.0';

import GameData from './game-data';
import GameObjects from './game-objects';
import GameState from './game-state';

import Geometry from '../rwsengine/geometry';
import Face3 from '../rwsengine/face3';

import Texture from '../rwsengine/texture';

import Mesh from '../rwsengine/mesh';

import { IdeEntryObjs } from '../rwslib/loaders/ide';
import { IplEntryInst } from '../rwslib/loaders/ipl';
import * as RwsSectionTypes from '../rwslib/parsers/rws/section-types';

import { vec3 } from 'gl-matrix';

export default class GameWorld {
    data: GameData;
    objects: GameObjects;
    state: GameState;

    gl: GLES2Context;

    meshes: Mesh[] = [];


    constructor(data: GameData, gl: GLES2Context){
        this.data = data;
        this.gl = gl;

        this.objects = new GameObjects(this.data, this.gl);
        this.state = new GameState();
    }

    async init(){
        await this.initDefaultResources();
        await this.createInstance('data/maps/industne/industne', 530);
        //await this.loadMap('data/maps/comse/comse');
        //await this.loadMap('data/maps/comsw/comsw');

        console.time('map');
//await this.loadMap('data/maps/comse/comse');
//await this.loadMap('data/maps/comnbtm/comnbtm');
//await this.loadMap('data/maps/comsw/comsw');
//await this.loadMap('data/maps/comntop/comntop');
        console.timeEnd('map');
    }

    async initDefaultResources(){
        console.time('txd-slots');
        await this.objects.loadRwsTextureDictionary('icons.txd', true);
        await this.objects.loadRwsTextureDictionary('models/particle.txd', false);
        await this.objects.loadRwsTextureDictionary('models/hud.txd', false);
        await this.objects.loadRwsTextureDictionary('models/fonts.txd', false);
        await this.objects.loadRwsTextureDictionary('models/generic.txd', false);
        await this.objects.loadRwsTextureDictionary('models/misc.txd', false);
        console.timeEnd('txd-slots');
    }

    async loadMap(definition: string){
        const ide = this.data.ideLoaders.get(`${definition}.ide`);
        const ipl = this.data.iplLoaders.get(`${definition}.ipl`);

        if(!ide || !ipl){
            throw new ReferenceError(`GameWorld: cannot find definition '${definition}'`);
        }

        const tasks: Array<Promise<Mesh>> = [];

        ipl.entriesInst.forEach(inst => {
            const obj = ide.entriesObjs.find(obj => obj.id === inst.id);
            if(!obj){
                return;
            }

            tasks.push(this.objects.loadMesh(obj, inst));
        });

        const meshes = await Promise.all(tasks);

        this.meshes.push(...meshes);
    }

    async createInstance(definition: string, objectId: number){
        const ide = this.data.ideLoaders.get(`${definition}.ide`);
        const ipl = this.data.iplLoaders.get(`${definition}.ipl`);

        if(!ide || !ipl){
            throw new ReferenceError(`GameWorld: cannot find definition '${definition}'`);
        }

        const obj: IdeEntryObjs|undefined = ide.entriesObjs.find(obj => obj.id === objectId);
        const inst: IplEntryInst|undefined = ipl.entriesInst.find(inst => inst.id === objectId);

        if(!obj || !inst){
            throw new ReferenceError(`GameWorld: cannot find objs/inst with id ${objectId}`);
        }

        const mesh = await this.objects.loadMesh(obj, inst);

        mesh.position[0] = 0;
        mesh.position[1] = 0;
        mesh.position[2] = 0;
        mesh.updateTransform();

        this.meshes.push(mesh);
    }

    async loadIPL(path: string){

    }
}
