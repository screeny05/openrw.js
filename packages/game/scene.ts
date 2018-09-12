import { PlatformAdapter } from "@rws/platform/adapter";
import { IScene, IVec3Constructor, ISceneConstructor, IRendererConstructor, IRenderer } from "@rws/platform/graphic";
import { IAmbientLight, IAmbientLightConstructor } from "@rws/platform/graphic/ambient-light";
import { ISkyboxConstructor, ISkybox } from "@rws/platform/graphic/skybox";
import { GlobalState } from "@rws/game/global-state";

export class Scene {
    state: GlobalState;
    platform: PlatformAdapter;
    graph: IScene;

    ambient: IAmbientLight;
    skybox: ISkybox;
    renderer: IRenderer;

    private Scene: ISceneConstructor;
    private AmbientLight: IAmbientLightConstructor;
    private Vec3: IVec3Constructor;
    private Skybox: ISkyboxConstructor;
    private Renderer: IRendererConstructor;

    constructor(state: GlobalState, platform: PlatformAdapter){
        this.state = state;
        this.platform = platform;
        Object.assign(this, this.platform.graphicConstructors);

        this.graph = new this.Scene();
        this.renderer = new this.Renderer(this.platform.rwsStructPool, this.graph);
    }

    async setup(): Promise<void> {
        this.ambient = new this.AmbientLight(new this.Vec3(64 / 255, 64 / 255, 64 / 255));
        this.skybox = new this.Skybox(this.state, this.platform.rwsStructPool.timecycIndex);
        const model = await this.platform.rwsStructPool.meshPool.getMesh('asuka');

        this.graph.add(this.ambient);
        this.graph.add(this.skybox);
        this.graph.add(model);
    }

    update(delta: number): void {
        this.skybox.update(delta);
        this.renderer.render(delta);
    }
}
