import { PlatformAdapter } from "@rws/platform/adapter";
import { IScene, IVec3Constructor, ISceneConstructor } from "@rws/platform/graphic";
import { IAmbientLight, IAmbientLightConstructor } from "@rws/platform/graphic/ambient-light";
import { ISkyboxConstructor } from "@rws/platform/graphic/skybox";

export class Scene {
    platform: PlatformAdapter;
    data: IScene;

    ambient: IAmbientLight;

    private Scene: ISceneConstructor;
    private AmbientLight: IAmbientLightConstructor;
    private Vec3: IVec3Constructor;
    private Skybox: ISkyboxConstructor;

    constructor(platform: PlatformAdapter){
        this.platform = platform;
        Object.assign(this, this.platform.graphicConstructors);

        this.data = new this.Scene();
    }

    async setup(): Promise<void> {
        this.ambient = new this.AmbientLight(new this.Vec3(255, 255, 255));
    }
}
