import { ISkyboxConstructor } from './skybox';
import { ISceneConstructor } from './scene';
import { IAmbientLightConstructor } from './ambient-light';
import { IVec3Constructor } from './vec3';
import { ITexturePoolConstructor } from './texture-pool';
import { IMeshPoolConstructor } from './mesh-pool';
import { IRendererConstructor } from './renderer';
import { ICameraConstructor } from './camera';
import { IVec2Constructor } from './vec2';
import { IHudConstructor } from './hud';
import { IHudElementConstructor } from './hud-element';
import { IGroupConstructor } from './group';

export interface IConstructor {
    Camera: ICameraConstructor;
    Skybox: ISkyboxConstructor;
    Scene: ISceneConstructor;
    Group: IGroupConstructor;
    Hud: IHudConstructor;
    HudElement: IHudElementConstructor;
    AmbientLight: IAmbientLightConstructor;
    Vec3: IVec3Constructor;
    Vec2: IVec2Constructor;
    TexturePool: ITexturePoolConstructor;
    MeshPool: IMeshPoolConstructor;
    Renderer: IRendererConstructor;
}
