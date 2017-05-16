import GameData from './game-data';

import DffGeometry from '../rwsengine/dff-geometry';
import Geometry from '../rwsengine/geometry';
import Face3 from '../rwsengine/face3';

import TxdTexture from '../rwsengine/txd-texture';

import { IdeEntryObjs } from '../rwslib/loaders/ide';
import { IplEntryInst } from '../rwslib/loaders/ipl';

import { vec3 } from 'gl-matrix';

export default class GameWorld {
    data: GameData;
    gl: WebGLRenderingContext;

    geometries: Array<Geometry> = [];

    constructor(data: GameData, gl: WebGLRenderingContext){
        this.data = data;
        this.gl = gl;
    }

    async init(){
        await this.createInstance('data/maps/industne/industne', 530);
        //await this.loadMap('data/maps/comse/comse');
        //await this.loadMap('data/maps/comsw/comsw');
    }

    async loadMap(definition: string){
        const ide = this.data.ideLoaders.get(`${definition}.ide`);
        const ipl = this.data.iplLoaders.get(`${definition}.ipl`);

        if(!ide || !ipl){
            throw new ReferenceError(`GameWorld: cannot find definition '${definition}'`);
        }

        const tasks: Array<any> = [];

        ipl.entriesInst.forEach(inst => {
            const obj = ide.entriesObjs.find(obj => obj.id === inst.id);
            if(!obj){
                return;
            }

            tasks.push(this.createInstInstance(inst, obj));
        });

        this.geometries.push(...(await Promise.all(tasks)));
    }

    async createInstInstance(inst: IplEntryInst, obj: IdeEntryObjs): Promise<DffGeometry> {
        if(obj.modelName !== inst.modelName){
            console.warn(`GameWorld: OBJS and INST differ in modelName. Using INST.\nOBJS: ${obj.modelName}\nINST: ${inst.modelName}`);
        }

        const rwsTxd = await this.data.loadRWSFromImg('models/gta3.img', `${obj.txdName}.txd`);
        const rwsClump = await this.data.loadRWSFromImg('models/gta3.img', `${inst.modelName}.dff`);
        const textures = TxdTexture.loadFromRwsTxd(this.gl, rwsTxd[0], obj.txdName);
        const geometry = DffGeometry.loadFromIpl(this.gl, inst, rwsClump[0], inst.modelName, textures);

        return geometry;
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

        const geometry = await this.createInstInstance(inst, obj);
        geometry.position[0]=0;
        geometry.position[1]=0;
        geometry.position[2]=0;
        geometry.updateTransform();

        this.geometries.push(geometry);
    }

    async loadIPL(path: string){

    }
}
