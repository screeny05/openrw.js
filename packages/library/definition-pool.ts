import { RwsStructPool } from "@rws/library/rws-struct-pool";
import { IdeIndex, IdeEntryObj, IdeEntryTobj, IdeEntryHier, IdeEntryCar, IdeEntryPed, IdeEntryPath, IdeEntry2dfxAny } from "./index/ide";
import { IMesh } from "@rws/platform/graphic";
import { ITexture } from "@rws/platform/graphic/texture";

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
        // generic is already loaded
        // maybe we've already loaded the texture with the name of the txd
        if(txd !== 'generic' && !this.rwsPool.texturePool.has(txd)){
            await this.rwsPool.texturePool.loadFromImg('models/gta3.img', txd + '.txd');
        }

        const img = this.rwsPool.imgIndices.get('models/gta3.img')!;
        if(img.imgIndex.has(dff + '.dff')){
            await this.rwsPool.meshPool.loadFromImg('models/gta3.img', dff + '.dff');
        }

        // modelname === dff-name
        if(this.rwsPool.meshPool.has(dff)){
            return this.rwsPool.meshPool.get(dff);
        }

        // FALLBACK mechanism:
        // model is not a dff, but a child of an already loaded mesh
        // name can be $name, $name_l0
        let found = this.rwsPool.meshPool.findMeshChild(dff + '_l0');
        if(found){
            return found;
        }
        found = this.rwsPool.meshPool.findMeshChild(dff);
        if(found){
            return found;
        }

        throw new Error(`DefinitionPool: Unable to find dff/mesh ${dff}.`);
    }

    async loadObjMesh(id: number | IdeEntryObj): Promise<IMesh> {
        const obj = typeof id === 'number' ? this.defObj.get(id) : id;
        if(!obj){
            throw new Error(`DefinitionPool: OBJS-Definition with id ${id} not found`);
        }
        const mesh = await this.loadMesh(obj.modelName, obj.txdName);

        return mesh;
    }

    async loadTextureByDffName(name: string): Promise<boolean> {
        const entry = this.getEntryByModelName(name, this.defObj) || this.getEntryByModelName(name, this.defCar) || this.getEntryByModelName(name, this.defPed);
        if(!entry){
            console.warn(`DefinitionPool: Cannot find entry for given model ${name}.`);
            return false;
        }
        if(entry.txdName === 'generic'){
            // should already be loaded
            return true;
        }
        await this.rwsPool.texturePool.loadFromImg('models/gta3.img', `${entry.txdName}.txd`);
        return true;
    }

    getEntryByModelName<T>(name: string, definitionMap: Map<number, T>): T|undefined {
        return Array.from(definitionMap).map(([_, entry]) => entry).find(entry => (entry as any).modelName === name);
    }
}
