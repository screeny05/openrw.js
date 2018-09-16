import { RwsStructPool } from "@rws/library/rws-struct-pool";
import { IdeIndex, IdeEntryObj, IdeEntryTobj, IdeEntryHier, IdeEntryCar, IdeEntryPed, IdeEntryPath, IdeEntry2dfxAny } from "./index/ide";
import { IMesh } from "@rws/platform/graphic";

export class DefinitionPool {
    rwsPool: RwsStructPool;
    defObj: Map<number, IdeEntryObj> = new Map();
    defTobj: Map<number, IdeEntryTobj> = new Map();
    defHier: Map<number, IdeEntryHier> = new Map();
    defCar: Map<number, IdeEntryCar> = new Map();
    defPed: Map<number, IdeEntryPed> = new Map();
    defPath: Map<number, IdeEntryPath> = new Map();
    def2dfx: Map<number, IdeEntry2dfxAny> = new Map();

    constructor(rwsPool: RwsStructPool){
        this.rwsPool = rwsPool;
    }

    async loadIdeFile(path: string): Promise<void> {
        const file = this.rwsPool.fileIndex.get(path);
        const loader = new IdeIndex(file);
        await loader.load(
            def => this.trySet(this.defObj, def),
            def => this.trySet(this.defTobj, def),
            def => this.trySet(this.defHier, def),
            def => this.trySet(this.defCar, def),
            def => this.trySet(this.defPed, def),
            def => this.trySet(this.defPath, def),
            def => this.trySet(this.def2dfx, def),
        );
    }

    trySet<T extends { id: number }>(map: Map<number, T>, def: T): void {
        if(map.has(def.id)){
            const prevDef = map.get(def.id);
            // TODO is this ok?
            //console.error(`DefinitionPool: Duplicate entry with ID ${def.id}.`, prevDef, def);
            return;
        }
        map.set(def.id, def);
    }

    async loadMesh(dff: string, txd: string): Promise<IMesh> {
        if(txd !== 'generic'){
            await this.rwsPool.texturePool.loadFromImg('models/gta3.img', txd + '.txd');
        }
        await this.rwsPool.meshPool.loadFromImg('models/gta3.img', dff + '.dff');
        return this.rwsPool.meshPool.get(dff);
    }

    async loadObjMesh(id: number | IdeEntryObj): Promise<IMesh> {
        const obj = typeof id === 'number' ? this.defObj.get(id) : id;
        if(!obj){
            throw new Error(`DefinitionPool: OBJS-Definition with id ${id} not found`);
        }
        const mesh = this.loadMesh(obj.modelName, obj.txdName);
        return mesh;
    }
}
