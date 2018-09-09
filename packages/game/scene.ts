import { PlatformAdapter } from "@rws/platform/adapter";
import { IScene, IVec3Constructor, ISceneConstructor } from "@rws/platform/graphic";
import { IAmbientLight, IAmbientLightConstructor } from "@rws/platform/graphic/ambient-light";
import { ISkyboxConstructor, ISkybox } from "@rws/platform/graphic/skybox";
import { GlobalState } from "@rws/game/global-state";

export class Scene {
    state: GlobalState;
    platform: PlatformAdapter;
    graph: IScene;

    ambient: IAmbientLight;
    skybox: ISkybox;

    private Scene: ISceneConstructor;
    private AmbientLight: IAmbientLightConstructor;
    private Vec3: IVec3Constructor;
    private Skybox: ISkyboxConstructor;

    constructor(state: GlobalState, platform: PlatformAdapter){
        this.state = state;
        this.platform = platform;
        Object.assign(this, this.platform.graphicConstructors);

        this.graph = new this.Scene();
    }

    async setup(): Promise<void> {
        this.ambient = new this.AmbientLight(new this.Vec3(255, 255, 255));
        this.skybox = new this.Skybox(this.state, this.platform.rwsStructPool.timecycIndex);

        this.graph.add(this.ambient);
        this.graph.add(await this.platform.meshProvider.getMesh('asuka'));
    }

    update(delta: number): void {
        this.skybox.update(delta);
    }
}
