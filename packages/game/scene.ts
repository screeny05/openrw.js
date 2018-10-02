import { PlatformAdapter } from "@rws/platform/adapter";
import { IScene, IVec3Constructor, ISceneConstructor, IRendererConstructor, IRenderer, ICamera, ICameraConstructor, IHud, IHudConstructor } from "@rws/platform/graphic";
import { IAmbientLight, IAmbientLightConstructor } from "@rws/platform/graphic/ambient-light";
import { ISkyboxConstructor, ISkybox } from "@rws/platform/graphic/skybox";
import { GlobalState } from "@rws/game/global-state";
import { IplIndex } from "@rws/library/index/ipl";
import { IVec2Constructor } from "@rws/platform/graphic/vec2";
import { IHudElementConstructor } from "@rws/platform/graphic/hud-element";
import { HudText } from "@rws/platform/graphic/hud-text";

export class Scene {
    state: GlobalState;
    platform: PlatformAdapter;
    graph: IScene;
    hud: IHud;

    ambient: IAmbientLight;
    skybox: ISkybox;
    renderer: IRenderer;

    camera: ICamera;

    private Scene: ISceneConstructor;
    private Hud: IHudConstructor;
    private HudElement: IHudElementConstructor;
    private AmbientLight: IAmbientLightConstructor;
    private Vec3: IVec3Constructor;
    private Vec2: IVec2Constructor;
    private Skybox: ISkyboxConstructor;
    private Renderer: IRendererConstructor;
    private Camera: ICameraConstructor;

    constructor(state: GlobalState, platform: PlatformAdapter){
        this.state = state;
        this.platform = platform;
        Object.assign(this, this.platform.graphicConstructors);

        this.graph = new this.Scene();
        this.hud = new this.Hud();
        this.camera = new this.Camera(75, 0.1, 10000);
        this.renderer = new this.Renderer(this.platform.rwsStructPool, this.graph, this.hud, this.camera);
    }

    setupIdeSelector(): void {
        let lastAdd;
        const onSelect = async (id: number) => {
            if(lastAdd){
                this.graph.src.remove(lastAdd.src);
            }
            const model = await this.platform.rwsStructPool.definitionPool.loadObjMesh(id);
            lastAdd = model;
            this.graph.add(model);
        }
        const ul = document.createElement('ul');
        Array.from(this.platform.rwsStructPool.definitionPool.defObj.values()).forEach(def => {
            const li = document.createElement('li');
            li.textContent = def.modelName;
            li.addEventListener('click', () => onSelect(def.id));
            ul.appendChild(li);
        });
        ul.style.position = 'absolute';
        ul.style.top = '0';
        ul.style.left = '0';
        ul.style.bottom = '0';
        ul.style.overflow = 'auto';
        document.body.appendChild(ul);
    }

    setupIplSelector(): void {
        let added = [];
        const onSelect = async (ipl: IplIndex) => {
            added.forEach(el => this.graph.src.remove(el.src));
            added = [];
            const tasks = ipl.entriesInst.map(async (placement) => {
                const mesh = await this.platform.rwsStructPool.definitionPool.loadObjMesh(placement.id);
                mesh.position.set(placement.position[0], placement.position[1], placement.position[2]);
                mesh.rotation.set(placement.rotation[0], placement.rotation[1], placement.rotation[2], placement.rotation[3]);
                this.graph.add(mesh);
                return mesh;
            });
            await Promise.all(tasks);
        };
        const ul = document.createElement('ul');
        Array.from(this.platform.rwsStructPool.iplIndices.entries()).forEach(([file, ipl]) => {
            const li = document.createElement('li');
            li.textContent = `${file} (${ipl.entriesInst.length})`;
            li.addEventListener('click', () => onSelect(ipl));
            ul.appendChild(li);
        });
        ul.style.position = 'absolute';
        ul.style.top = '0';
        ul.style.left = '0';
        ul.style.bottom = '0';
        ul.style.overflow = 'auto';
        document.body.appendChild(ul);
    }

    setupTextureSelector(): void {
        let lastAdd;
        const onSelect = async (txd) => {
            if(lastAdd){
                this.hud.src.remove(lastAdd.src);
            }
            const el = new this.HudElement(txd);
            window.el = el;
            this.hud.add(el);
            lastAdd = el;
        }
        const ul = document.createElement('ul');
        Array.from(this.platform.rwsStructPool.texturePool.textureCache.values()).forEach(txd => {
            const li = document.createElement('li');
            li.textContent = `${txd.name} (${txd.width}x${txd.height})`;
            li.addEventListener('click', () => onSelect(txd));
            ul.appendChild(li);
        });
        ul.style.position = 'absolute';
        ul.style.top = '0';
        ul.style.left = '0';
        ul.style.bottom = '0';
        ul.style.overflow = 'auto';
        document.body.appendChild(ul);
    }

    async setup(): Promise<void> {
        this.ambient = new this.AmbientLight(new this.Vec3(0.25, 0.25, 0.25));
        this.skybox = new this.Skybox(this.state, this.platform.rwsStructPool.timecycIndex);
        //this.setupIdeSelector();
        //this.setupIplSelector();
        this.setupTextureSelector();

        this.graph.add(this.ambient);
        this.graph.add(this.skybox);

        const text = new HudText(this.platform, this.hud, 'Visit http://scn.cx for more projects!', 32);
        window.text = text;
    }

    update(delta: number): void {
        this.skybox.update(delta);
        this.renderer.render(delta);
    }
}
